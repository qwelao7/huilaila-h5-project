<template>
  <!--确认订单-->
  <div class="commonHeader confirmOrders">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        style="width:100%;position:fixed;left:0;top:0;z-index:100">确认订单</x-header>
      <div class="address">
        <div class="content" @click="chooseAddress" v-show="!cantPay">
          <div>
            <span>{{userAddressInfo.userAddress}}</span>
            <i class="arrow"></i>
          </div>
          <p><span>{{userAddressInfo.receiveUser}}</span>,<span>{{userAddressInfo.phone}}</span></p>
        </div>
        <div class="noAddr" @click="chooseAddress" v-show="cantPay"><p>{{noAddress}}</p><i class="arrow"></i></div>
        <div class="line"></div>
      </div>
      <div class="itemBox">
        <div class="item" v-for="items in orderData">
          <!--<span class="itemTitle">{{items.storeName}}</span>-->
          <productItems
            :productItem="items"
            :payTypes="payType"
            :abnormalStatus="abnormalStatus"
            @getRedList="getRedList"
            :redPacketIdList="redPacketIdList"></productItems>
        </div>
      </div>
      <div class="reFound" v-show="abnormalStatus === 0">
        <group title="选择支付方式：">
          <radio :options="TypeArr" @on-change="choosePayWay" v-model="payType"></radio>
        </group>
      </div>
      <div class="cantMerge" v-show="abnormalStatus !== 0">
        <span>对不起，您选购的服务无法进行合并支付。您可在“我的服务”中进行分别支付。</span>
      </div>
      <div slot="bottom" class="bottom">
        <div class="number">
          <span>共 {{totalCount}} 件</span>
          <ul class="offer">
            <!--<li><span>应付：</span><span class="money">¥{{allMoney}}</span></li>-->
            <li><span>应付：</span><span class="money">¥{{changeTwoDecimalf(computedFee.totalMoney)}}</span></li>
            <li v-show="computedFee.saveMoney"><span>已优惠：</span><span class="save">¥{{changeTwoDecimalf(computedFee.saveMoney)}}</span></li>
          </ul>
        </div>
        <button class="orderNow" :class="{'cantPay': cantPay}" @click="submitNow">立即下单</button>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {XHeader, ViewBox, Group, CellBox, Popup, TransferDomDirective as TransferDom, XSwitch, XTextarea, Radio, querystring, PopupRadio, PopupPicker} from 'vux'
  import productItems from './productItems'
  import img from '../../../assets/a3.jpg'
  export default {
    name: 'confirmOrders',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      ViewBox,
      Group,
      CellBox,
      Popup,
      XSwitch,
      XTextarea,
      Radio,
      PopupRadio,
      PopupPicker,
      productItems
    },
    data () {
      return {
        orderData: [],
        productsLists: [],
//        saveMoney: 0,
        showDelivery: false,
        deliveryFree: false,
        cantPay: false,
        TypeArr: [],
        payType: 2,
        productInfo: [],
        userAddressInfo: {},
        noAddress: '',
        curPage: 1,
        pageSize: 20,
        isConflict: false,
        flag: false,
        abnormalStatus: 0,
        redPacketIdList: [],
        redListStr: []
      }
    },
    created () {
      this.getData()
      this.getAbnormalStatus()
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (from.path.indexOf('/selectReceiveAddress') !== -1) {
          vm.flag = true;
          let currentAddress = JSON.parse(localStorage.getItem('currentReceiveAddress'))
          if (currentAddress && currentAddress !== null) {
            vm.userAddressInfo = {
              receiveUser: currentAddress.nickName,
              phone: currentAddress.mobileNum.replace(currentAddress.mobileNum.slice(3, 7), '****'),
              userAddress: currentAddress.detailAddress,
              addressId: currentAddress.ownerAssetId
            }
          } else {
            vm.flag = false;
          }
        } else {
          vm.flag = false;
        }
        next()
      })
    },
    computed: {
      totalCount () {
        let data = this.orderData;
        let totalCount = 0;
        data.forEach(item => {
          let list = item.productList
          list.forEach(listItem => {
            totalCount += listItem.itemNum
          })
        })
        return totalCount
      },
      saveMoney () {
        let data = this.redPacketIdList;
        let saveMoney = 0
        data.forEach(item => {
          saveMoney += item.money
        })
        return saveMoney
      },
      computedFee () {
        let this_ = this;
        let totalMoney = 0;
        this_.orderData.forEach(productItem => {
          let storeMoney = parseFloat(productItem.storeMoney);
          // 有无物流(1:无物流,2:有物流)
          let deliverySetting = productItem.deliverySetting;
          // 支持物流方式: 1快递配送  2预约上门 3用户自提(ps:1&2是互斥的)
          let deliverType = productItem.deliveryType;
          // 服务费
          let onsiteServiceExpense = productItem.onsiteServiceExpense;
          // 免服务费条件
          let onsiteFreeService = productItem.onsiteFreeService;
          // 运费
          let freightMoney = productItem.freightMoney;
          // 免运费条件
          let minMoney = productItem.minMoney;
          /* 计算运费和服务费 begin */
          let totalFee = productItem.totalFee;
          // 至少选中一个
          // 有物流(没有物流不需考虑服务费或者运费)
          if (deliverySetting === 2) {
            // 预约上门&用户自提(用户自提不需要考虑相关费用)
            if (deliverType.indexOf('2') !== -1) {
              // 服务费大于0
              if (onsiteServiceExpense > 0) {
                // 需要服务费
                if (onsiteFreeService === -1) {
                  totalFee = onsiteServiceExpense;
                } else if (onsiteFreeService > 0) {
                  // 没有达到免服务费的条件
                  if (storeMoney < onsiteFreeService) {
                    totalFee = onsiteServiceExpense;
                  }
                }
              }
            }
            if (deliverType.indexOf('1') !== -1) { // 快递配送&用户自提(用户自提不需要考虑相关费用)
              // 运费大于0
              if (freightMoney > 0) {
                if (minMoney === -1) {
                  totalFee = freightMoney;
                } else if (minMoney > 0) {
                  // 没有达到免运费的条件
                  if (storeMoney < minMoney) {
                    totalFee = freightMoney;
                  }
                }
              }
            }
          }
          productItem.totalFee = totalFee;
          totalMoney += totalFee + storeMoney
        })
        let save = this_.saveMoney
        if (save) {
          if (totalMoney < save) {
            save = totalMoney
            totalMoney = 0
          } else {
            totalMoney = totalMoney - save
          }
          return {
            totalMoney: totalMoney,
            saveMoney: save
          }
        } else {
          return {
            totalMoney: totalMoney
          }
        }
      }
    },
    methods: {
      getRedList (value) {
        let this_ = this
        if (typeof value === 'string') {
          value = value.split(',')
        }
        this_.redPacketIdList = value;
//        console.log(111, this_.redPacketIdList)
        this_.redPacketIdList.forEach(res => {
          this_.redListStr.push(res.redPacketId)
        })
      },
      getAbnormalStatus () {
        if (this.$route.query.status) {
          let status = JSON.parse(this.$route.query.status)
          console.log('合并支付状态：', status)
          this.abnormalStatus = status
        }
      },
      getDefaultAddress (value) {
        let this_ = this;
        let storeIds = [];
        value.forEach(res => {
          storeIds.push(res.storeId)
        })
        let params = {
          storeIds: storeIds
        }
        this_.$JHttp({
          method: 'post',
          url: window.baseURL + '/order/getDefaultAddr',
          data: params,
          transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }

        }).then(res => {
          if (res.status === 100) {
            let data = res.data
            if (data) {
              data.phone = data.phone.replace(data.phone.slice(3, 7), '****')
              this_.userAddressInfo = {
                receiveUser: data.receiveUser,
                phone: data.phone,
                userAddress: data.areaAddr + data.detailAddr,
                addressId: data.addrId
              }
            } else {
              this_.cantPay = true
              this_.noAddress = '暂无可用收货地址，点击去添加'
            }
          }
        }).catch(e => {
          console.log(e)
        })
      },
      getData () {
        let this_ = this;
        let productLists = {
          productList: JSON.parse(this.$route.query.productList)
        }
        this_.$JHttp({
          method: 'post',
          url: window.baseURL + '/productCarts/getProductByIds',
          data: productLists
        }).then(res => {
          if (res.status === 100) {
            let data = res.data
            this_.orderData = data.orderList
            if (!this_.flag) {
              this_.getDefaultAddress(this_.orderData)
            }
            this_.orderData.forEach((product) => {
              product.storeMoney = 0; // 门店小计
              product.totalMoney = 0;
              product.totalFee = 0;
              product.isFreeDelivery = false;
              product.isFreeService = false;
              product.totalMoney = 0;
              product.serverTimes = []; // 服务时间
              product.deliveryTypes = ''; // 物流
              product.productInfo = []; // 商品信息
              product.redPacketObj = {}; // 红包信息
              product.save = 0;
              product.message = ''; // 商家留言
              let productList = product.productList
              product.accountId = productList[0].accountId;
              this_.productsLists = productList
              productList.forEach(item => {
                let price = item.productPrice;
                let count = item.itemNum;
                let money = parseFloat(price) * count;
                product.storeMoney += money;
                let obj = {
                  specId: item.productId,
                  itemNum: item.itemNum,
                  itemName: item.productName,
                  itemPrice: item.productPrice,
                  itemUnit: item.productUnit
                }
                product.productInfo.push(obj)
              })
              this_.createDelivery(product)
            })
            this_.createPayType(this_.orderData)
          }
        }).catch(e => {
          console.log(e)
        })
      },
      createPayType (value) {
        let arr = []
        let num3Count = 0;
        let payOtherWay
        value.forEach(res => {
          arr.push(res.subPaytype)
          if (res.subPaytype === 3) {
            num3Count++
          } else {
            payOtherWay = res.subPaytype
          }
        })
        if (arr.length === num3Count) {
          this.TypeArr = [
            {
              key: 2,
              value: '线上支付'
            },
            {
              key: 1,
              value: '线下支付'
            }
          ]
          this.payType = 2
        } else if (payOtherWay === 1) {
          this.TypeArr = [
            {
              key: 1,
              value: '线下支付'
            }
          ]
          this.payType = 1
        } else if (payOtherWay === 2) {
          this.TypeArr = [
            {
              key: 2,
              value: '线上支付'
            }
          ]
          this.payType = 2
        }
      },
      createDelivery (value) {
        if (value.deliverySetting === 2 && value.deliveryType !== '') {
          let arr = value.deliveryType.split(',')
          let arr1 = [];
          arr.forEach(val => {
            if (val === '1') {
              val = '快递'
            } else if (val === '2') {
              val = '预约上门'
            } else if (val === '3') {
              val = '到店自提'
            }
            arr1.push(val)
          })
          value.deliveryData = [arr1]
          let length = value.deliveryData.length
          let deliveryType;
          if (length && length === 1) {
            switch (value.deliveryData[0][0]) {
              case '快递':
                deliveryType = 1;
                break
              case '预约上门':
                deliveryType = 2;
                break
              case '到店自提':
                deliveryType = 3;
                break
            }
            value.deliveryTypes = deliveryType
            value.deliveryChoose = value.deliveryData[0][0]
          }
        } else {
          value.deliveryTypes = 1
        }
      },
      chooseAddress () {
        let arr = [];
        let addrId = ''
        this.orderData.forEach(res => {
          arr.push(res.storeId)
        })
        if (this.userAddressInfo.addressId) {
          addrId = this.userAddressInfo.addressId
        }
        this.$router.push({
          path: '/selectReceiveAddress',
          query: {
            storeIds: JSON.stringify(arr),
            addrId: addrId
          }
        })
      },
      choosePayWay (value) {
        this.payType = value
      },
      submitNow () {
        let this_ = this;
        if (!this.cantPay) {
          this_.$vux.loading.show()
          this_.$JHttp({ // 校验房号是否审核
            method: 'get',
            url: window.baseURL + '/ownerAsset/CurrentCommunityHasDefaultAsset',
            header: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            this_.$vux.loading.hide()
            if (res.status === 100) { // 审核通过
              let param = []
              for (let i = 0; i < this_.orderData.length; i++) {
                let res = this_.orderData[i]
                if (res.onsiteIsOpenTime && res.deliveryTypes !== 1) {
                  if (!res.serverTimes.length) {
                    this_.$vux.toast.show({
                      type: 'text',
                      text: '请选择服务时间'
                    })
                    this_.$vux.loading.hide()
                    return
                  }
                }
                let obj = {
                  shopId: res.shopId,
                  deliveryType: res.deliverySetting === 1 ? '' : res.deliveryTypes,
                  addressId: this_.userAddressInfo.addressId,
                  redPacketId: res.redPacketObj.redPacketId || '',
                  moneyType: this_.abnormalStatus !== 0 ? -1 : this_.payType === 1 ? 0 : 9,
                  communityId: localStorage.getItem('communityId'),
                  minMoney: res.minMoney,
                  productInfo: res.productInfo,
                  storeId: res.storeId,
                  userAddress: this_.userAddressInfo.userAddress,
                  orderPrice: '',
                  orderDate: res.serverTimes[0] || '',
                  orderTime: res.serverTimes[1] || '',
                  freightMoney: res.totalFee,
                  sourceType: 6,
                  orderRemark: res.message
                }
                obj.orderPrice = this_.changeTwoDecimalf(res.storeMoney + obj.freightMoney)
                if (res.redPacketObj.money) {
                  let subTotal = res.storeMoney + obj.freightMoney
                  let sub = subTotal - res.redPacketObj.money
                  let totalA = 0
                  totalA = sub > 0 ? sub : 0
                  obj.orderPrice = this_.changeTwoDecimalf(totalA)
                } else {
                  obj.orderPrice = this_.changeTwoDecimalf(res.storeMoney + obj.freightMoney)
                }
                param.push(obj)
              }
              console.log(param)
              let params = {
                orderInfo: JSON.stringify(param)
              }
              this_.$JHttp({
                method: 'post',
                url: window.baseURL + '/order/insertNewOrderInShoppingCart?' + querystring.stringify(params)
              }).then(res => {
                if (res.status === 100) {
                  let data = res.data
                  this_.$vux.toast.show({
                    type: 'success',
                    text: '提交成功'
                  })
                  if (data.abnormalStauts === 0) {
                    setTimeout(function () {
                      if (this_.payType === 1 || data.orderMoney <= 0) { // 线下支付
                        this_.$router.push('/submitSuccess')
                      } else if (this_.payType === 2) { // 线上支付
                        this_.$router.push('/selectPayType/' + data.orderId)
                      }
                    }, 1000)
                  } else {
                    this_.$vux.alert.show({
                      title: '',
                      content: '对不起，您选购的服务无法进行合并支付。您可在“我的服务”中进行分别支付。',
                      buttonText: '去我的服务',
                      onHide () {
                        this_.$router.push('/myOrder')
                      }
                    })
                  }
                } else {
                  this_.$vux.toast.show({
                    type: 'text',
                    width: '12em',
                    text: res.msg
                  })
                  this_.$router.go(-1)
                }
              }).catch(e => {
                console.log(e)
              })
            } else {
              this_.$vux.toast.show({
                type: 'text',
                text: res.msg
              })
            }
          }).catch(e => {
            console.log(e)
          })
        }
      },
      changeTwoDecimalf (x) {
        var fX = parseFloat(x);
        if (isNaN(fX)) {
          return false;
        }
        var fX1 = Math.round(x * 100) / 100;
        var sX = fX1.toString();
        var posDecimal = sX.indexOf('.');
        if (posDecimal < 0) {
          posDecimal = sX.length;
          sX += '.';
        }
        while (sX.length <= posDecimal + 2) {
          sX += '0';
        }
        return sX;
      }
    }
  }
</script>
<style type="text/less" lang="less">
  .isChecked{
    width: 22px;
    height: 22px;
    background: url("../../../assets/images/checked_icon_orange.png") no-repeat;
    background-size: cover;
  }
</style>
<style type="text/less" lang="less" scoped>
  .confirmOrders{
    height: 100%;
    background-color: #f5f5f5;
    .arrow{
      width: 14px;
      height: 14px;
      background: url("../../../assets/images/arrow_icon_grey32.png") no-repeat;
      background-size: contain;
    }
    .address{
      background-color: #ffffff;
      .content{
        padding: 15px;
        div{
          display: flex;
          align-items: center;
          justify-content: space-between;
          span{
            flex: 1;
            font-size: 15px;
          }
        }
        p{
          margin-top: 5px;
          display: flex;
          align-items: center;
        }
      }
      .noAddr{
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        p{
          flex: 1;
          color: #FF3939;
        }
      }
      .line{
        width: 100%;
        height: 5px;
        background: url("../../../assets/images/addressline_icon.png") repeat-x;
        background-size: contain;
      }
    }
    .itemBox{
      margin-top: 10px;
      background-color: #ffffff;
      padding: 0 15px;
      .item{
        .itemTitle{
          padding: 12px 0;
        }
        .itemForm{
           li{
             display: flex;
             align-items: center;
             justify-content: space-between;
             border-bottom: 0.5px solid #D8D8D8;
             padding: 15px 0;
             span{
               font-size: 15px;
               color: #333333;
             }
             .subTotal{
               color: #FF6648;
             }
             .redBag_right{
               display: flex;
               align-items: center;
               .defaultText{
                 color: #aaaaaa;
               }
               .selectType{
                 color: #aaaaaa;
                 margin-right: 10px;
               }
               .selectNum{
                 color: #FF6648;
               }
             }
             .delivery{
               display: flex;
               align-items: center;
               p{
                 color: #FF6648;
                 display: flex;
                 align-items: center;
                 span{
                   color: #FF6648;
                 }
               }
               .lineThrough{
                 text-decoration: line-through;
               }
             }
           }
           .vux-cell-box{
             width: 100%;
           }
           .leaveMsg{
             border-bottom: none;
             span{
               width: 100%;
               padding: 7px 10px;
               background-color: #F2F2F2;
               border-radius: 4px;
               color: #aaaaaa;
               font-size: 15px;
               word-break: break-all;
             }
           }
         }
      }

    }
    .cantMerge{padding: 10px 15px;
      background-color: #ebebeb;
      color: #b6b6b6;
      font-size: 12px;
    }
    .bottom{
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      display: flex;
      align-items: center;
      border-top: 0.5px solid #D8D8D8;
      background-color: #ffffff;
      .number{
        padding: 0 10px 0 15px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span{
          font-size: 15px;
        }
        li{
          display: flex;
          align-items: center;
          justify-content: flex-end;
          span{
            font-size: 12px;
          }
          .money{
            font-size: 18px;
            color: #FF6648;
          }
          .save{
            font-size: 12px;
            color: #FF6648;
          }
        }
      }
      .orderNow{
        border: none;
        width: 105px;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        color: #ffffff;
        background-color: #FF6648;
      }
      .cantPay{
        background-color: #D8D8D8;
      }
    }
  }
  .demo3-slot{
    text-align: center;
    padding: 8px 0;
    color: #888;
  }
</style>
