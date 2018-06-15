<template>
  <div class="product-list">
    <span class="itemTitle">{{productItem.storeName}}</span>
    <div>
      <listForOrder :productList="productItem.productList" :borderBottom="true"></listForOrder>
      <ul class="itemForm">
        <li>
          <span>小计：</span>
          <div><span class="subTotal">¥{{changeTwoDecimalf(computedFee.storeMoney)}}</span></div>
        </li>
        <li @click="getRedPacket(productItem)" v-show="abnormalStatus === 0 && payTypes !== 1">
          <span>使用红包：</span>
          <div class="redBag_right" v-if="!redPacketObj.money">
            <span class="defaultText">{{defaultRedText}}</span>
            <i class="arrow"></i>
          </div>
          <div class="redBag_right" v-if="redPacketObj.money">
            <span class="selectType">{{redPacketObj.typeName}}</span>
            <span class="selectNum">¥{{changeTwoDecimalf(redPacketObj.money)}}</span>
            <i class="arrow"></i>
          </div>
        </li>
        <li class="chooseDelivery" v-show="productItem.deliverySetting === 2 && deliveryData.length > 1">
          <popup-picker title="物流方式：" :data="deliveryData" v-model="productItem.choosedDeliveryType" @on-change="expressDelivery" placeholder="请选择" popup-title="请选择物流方式"></popup-picker>
        </li>
        <li v-show="productItem.deliverySetting === 2 && deliveryData.length === 1">
          <span>物流方式：</span>
          <div>
            <p><span>{{productItem.deliveryChoose}}</span></p>
          </div>
        </li>
        <li v-show="productItem.deliverySetting !== 1 && productItem.deliveryTypes === 2">
          <span>服务费：</span>
          <div class="delivery">
            <p v-show="!deliveryFree" :class="{'lineThrough': lineThrough}">¥<span>{{changeTwoDecimalf(productItem.onsiteServiceExpense)}}</span></p>
            <p v-show="deliveryFree">免服务费</p>
          </div>
        </li>
        <li v-show="productItem.deliverySetting !== 1 && productItem.deliveryTypes === 1">
          <span>运费：</span>
          <div class="delivery">
            <p v-show="!deliveryFree" :class="{'lineThrough': lineThrough}">¥<span>{{changeTwoDecimalf(productItem.freightMoney)}}</span></p>
            <p v-show="deliveryFree">免邮</p>
          </div>
        </li>
        <li v-show="productItem.onsiteIsOpenTime && productItem.deliveryTypes !== 1">
          <popup-picker title="服务时间：" :data="timeData" :columns="2"
                        v-model="serverTimes"
                        @on-change="chooseServerTime"
                        @on-shadow-change="onChangeDay"
                        placeholder="请选择" popup-title="请选择服务时间"></popup-picker>
        </li>
        <li class="leaveMsg" @click="toLeaveMsg">
          <span v-show="msgForStore">{{msgForStore}}</span>
          <span v-show="!msgForStore">给服务商留言...</span>
        </li>
      </ul>
      <!--选择红包-->
      <div v-transfer-dom>
        <popup v-model="showRedBag" height="100%">
          <div class="redBagPopup commonHeader">
            <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="0">
              <x-header :left-options="leftOpt"
                        @on-click-back="hidePopup"
                        style="width:100%;position:fixed;left:0;top:0;z-index:100"
                        :title="redTitle"></x-header>
              <div>
                <group>
                  <x-switch :title="switchTitle" v-model="canChoose" @on-change="switchBar"></x-switch>
                </group>
                <ul class="redBagList">
                  <li @click="choose(item, redLists, index)" v-for="(item, index) in redLists">
                    <div class="align-right">
                      <span>{{item.typeName}}</span>
                      <i :class="{'isChecked': item.isChoose}"></i>
                    </div>
                    <div class="content">
                      <div class="type">
                        <span class="money">¥{{item.money}}</span>
                        <span>{{item.minMoney}}</span>
                      </div>
                      <div class="name">
                        <span>{{item.shopName}}</span>
                        <span>有效期：{{item.fromDate}} - {{item.toDate}}</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </view-box>
          </div>
        </popup>
      </div>
      <!--给服务商留言-->
      <div v-transfer-dom>
        <popup v-model="leaveMsgPopup" height="100%">
          <div class="msgPopup commonHeader">
            <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
              <x-header :left-options="leftOpt"
                        @on-click-back="closeMsgPopup"
                        title="给服务商留言"
                        style="width:100%;position:fixed;left:0;top:0;z-index:100">
                <a slot="right" @click="submitMsg(msgForStore)">确定</a></x-header>
              <group>
                <x-textarea v-model="msgForStore" :show-counter="false" :max="150" :height="200" :rows="8" :cols="30"></x-textarea>
              </group>
            </view-box>
          </div>
        </popup>
      </div>
    </div>
  </div>
</template>
<script>
  import {XHeader, ViewBox, Group, CellBox, Popup, TransferDomDirective as TransferDom, XSwitch, XTextarea, Radio, querystring, PopupRadio, PopupPicker} from 'vux'
  import listForOrder from './listFororder'
  export default {
    name: 'product-list',
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
      listForOrder
    },
    props: {
      productItem: {
        type: Object,
        default: () => {}
      },
      payTypes: {
        type: Number,
        default: () => 2
      },
      abnormalStatus: {
        type: Number,
        default: () => 0
      },
      redPacketIdList: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        redLists: [],
        canChoose: true,
        baseTimeData: [],
        timeData: [],
        timeToday: [],
        timeTomorrow: [],
        serverTimes: [],
        deliveryData: [],
        deliveryChoose: [],
        deliveryFree: false,
        lineThrough: false,
        showRedBag: false,
        redPacketObj: {},
        defaultRedText: '请选择红包',
        redTitle: '红包',
        switchTitle: '使用红包',
        leaveMsgPopup: false,
        msgForStore: '',
        curPage: 1,
        pageSize: 20,
        leftOpt: {
          backText: '',
          preventGoBack: true
        }
      }
    },
    computed: {
      computedFee () {
        let this_ = this;
        // 有无物流(1:无物流,2:有物流)
        let deliverySetting = this.productItem.deliverySetting;
        // 支持物流方式: 1快递配送  2预约上门 3用户自提(ps:1&2是互斥的)
        let deliverType = this.productItem.deliveryType;
        // 服务费
        let onsiteServiceExpense = parseFloat(this.productItem.onsiteServiceExpense);
        // 免服务费条件
        let onsiteFreeService = parseFloat(this.productItem.onsiteFreeService);
        // 运费
        let freightMoney = parseFloat(this.productItem.freightMoney);
        // 免运费条件
        let minMoney = this.productItem.minMoney;
        let storeMoney = 0;
        let totalMoney = 0;
        let productList = this.productItem.productList;
        if (productList && productList.length) {
          productList.forEach(function (product) {
            let price = product.productPrice;
            let count = product.itemNum;
            let money = parseFloat(price) * count;
            storeMoney += money;
          });
        }
        this_.$set(this_.productItem, 'storeMoney', storeMoney)
        /* 计算运费和服务费 begin */
        let acturalServiceMoney = 0;
        let acturalFreightMoney = 0;
        // 至少选中一个
        // 有物流(没有物流不需考虑服务费或者运费)
        if (deliverySetting === 2) {
          // 预约上门&用户自提(用户自提不需要考虑相关费用)
          if (deliverType.indexOf('2') !== -1) {
            // 服务费大于0
            if (onsiteServiceExpense > 0) {
              // 需要服务费
              if (onsiteFreeService === -1) {
                acturalServiceMoney = onsiteServiceExpense;
              } else if (onsiteFreeService > 0) {
                // 没有达到免服务费的条件
                if (storeMoney < onsiteFreeService) {
                  acturalServiceMoney = onsiteServiceExpense;
                } else {
                  this_.lineThrough = true
                }
              } else {
                // this_.deliveryFree = true
                this_.lineThrough = true
              }
            } else {
              this_.deliveryFree = true
            }
          }
          if (deliverType.indexOf('1') !== -1) { // 快递配送&用户自提(用户自提不需要考虑相关费用)
            // 运费大于0
            if (freightMoney > 0) {
              if (minMoney === -1) {
                acturalFreightMoney = freightMoney;
              } else if (minMoney > 0) {
                // 没有达到免运费的条件
                if (storeMoney < minMoney) {
                  acturalFreightMoney = freightMoney;
                } else {
                  this_.lineThrough = true
                }
              } else {
                // this_.deliveryFree = true
                this_.lineThrough = true
              }
            } else {
              this_.deliveryFree = true
            }
          }
        }
        totalMoney += acturalFreightMoney + acturalServiceMoney + storeMoney
        return {
          storeMoney: storeMoney,
          totalMoney: totalMoney
        }
      }
    },
    created () {
      this.createDelivery()
    },
    methods: {
      createDelivery () {
        let value = this.productItem
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
          this.deliveryData = [arr1]
          let length = this.deliveryData.length
          let deliveryType;
          if (length && length === 1) {
            switch (this.deliveryData[0][0]) {
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
            this.deliveryChoose = this.deliveryData[0][0]
            if (deliveryType !== 1) {
              this.getTime()
            }
          }
        } else {
          value.deliveryTypes = 1
        }
      },
      expressDelivery (val) {
        let data = this.productItem
        let deliveryType;
        switch (val[0]) {
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
        data.deliveryTypes = deliveryType
        this.deliveryChoose = val
        if (deliveryType !== 1) {
          this.getTime()
        }
      },
      getTime () {
        let this_ = this;
        let params = {
          storeId: this_.productItem.storeId
        }
        this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/shop/store/time?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            this_.baseTimeData = data
            let arr = []
            this_.timeToday = []
            this_.timeTomorrow = []
            data.forEach(res => {
              res.days.forEach(d => {
                let obj = {
                  name: d,
                  value: d,
                  parent: 0
                }
                arr.push(obj)
                res.timeNormal.forEach(t => {
                  let obj1 = {
                    name: t,
                    value: t,
                    parent: d
                  }
                  this_.timeTomorrow.push(obj1)
                })
                res.timeZero.forEach(t => {
                  let obj2 = {
                    name: t,
                    value: t,
                    parent: d
                  }
                  this_.timeToday.push(obj2)
                })
              })
            })
            this_.timeData.push(arr)
            this_.timeData.push(this_.timeToday)
          }
        }).catch(e => {
          console.log(e)
        })
      },
      switchTime (data) {
        let this_ = this;
        data.forEach(res => {
          let arr = []
          res.days.forEach(d => {
            let obj = {
              name: d,
              value: d,
              parent: 0
            }
            arr.push(obj)
            let valStr = new Date(arr[0]).getTime()
            let today = new Date().getTime()
            if (valStr > today) {
              res.timeNormal.forEach(t => {
                let obj1 = {
                  name: t,
                  value: t,
                  parent: d
                }
                arr.push(obj1)
              })
            } else {
              res.timeZero.forEach(t => {
                let obj2 = {
                  name: t,
                  value: t,
                  parent: d
                }
                arr.push(obj2)
              })
            }
          })
          this_.timeData = arr
        })
      },
      onChangeDay (value) {
        let this_ = this;
        let valSt1r = new Date(value[0]).getTime()
        let today = new Date().getTime()
        if (valSt1r > today) {
          this_.timeData.splice(1, 1, this_.timeTomorrow)
        } else {
          this_.timeData.splice(1, 1, this_.timeToday)
        }
      },
      chooseServerTime () {
        this.productItem.serverTimes = this.serverTimes
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
      getRedPacket (value) {
        let this_ = this;
        this_.showRedBag = true
        let params = {
          curPage: this_.curPage,
          pageSize: this_.pageSize,
          orderMoney: this_.changeTwoDecimalf(value.storeMoney),
          redPacketIds: '',
          shopId: value.shopId,
          storeId: value.storeId
        }
        let listString = []
        if (this_.redPacketIdList.length) {
          this_.redPacketIdList.forEach((res, index) => {
            if (value.redPacketObj.redPacketId === res.redPacketId) {
              this_.redPacketIdList.splice(index, 1)
            }
          })
          this_.redPacketIdList.forEach((res) => {
            listString.push(res.redPacketId)
          })
          params.redPacketIds = listString.join(',')
        }
        this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/treasureShu/getOrderAvailableRedPacketList?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            if (data.resultList.length) {
              let arr = []
              data.resultList.forEach((val, index) => {
                let obj = {
                  fromDate: val.fromDate,
                  toDate: val.toDate,
                  minMoney: val.minMoney,
                  money: val.money,
                  redPacketId: val.redPacketId,
                  shopId: val.shopId,
                  shopName: val.shopName,
                  storeId: val.storeId,
                  storeName: val.storeName,
                  type: val.type,
                  typeName: val.typeName,
                  isChoose: false,
                  chooseId: index
                }
                arr.push(obj)
              })
              this_.redLists = arr
              if (this_.canChoose && value.redPacketObj.redPacketId) {
                this_.redLists.forEach(val => {
                  if (value.redPacketObj.redPacketId === val.redPacketId) {
                    val.isChoose = true
                    this_.redPacketObj = val
                    this_.redPacketIdList.push(val)
                  }
                })
                this_.$emit('getRedList', this_.redPacketIdList)
              } else {
                this_.redLists.forEach(res => {
                  res.isChoose = false
                })
              }
            } else {
              this_.defaultRedText = '无可用红包'
//              this_.redTitle = '使用红包';
//              this_.switchTitle = '不使用红包';
//              this_.canChoose = false
            }
            this_.$set(value, 'redPacketObj', this_.redPacketObj)
          }
        }).catch(e => {
          console.log(e)
        })
      },
//      useRedBag (value) {
//        this.getRedPacket(value.redPacketIdList)
//        console.log(this.redLists.length)
//        this.showRedBag = true
//        if (!this.redLists.length) {
//          this.redTitle = '使用红包';
//          this.switchTitle = '不使用红包';
//          this.canChoose = false
//        } else {
//          if (!this.canChoose) {
//            this.redLists.forEach(res => {
//              res.isChoose = false
//            })
//          }
//        }
//      },
      hidePopup () {
        this.showRedBag = false
      },
      switchBar (value) {
        let current = this.productItem
        this.canChoose = value
        if (!this.canChoose) {
          if (this.redPacketIdList.length) {
            this.redPacketIdList.forEach((res, index) => {
              if (this.redPacketObj.redPacketId === res.redPacketId) {
                this.redPacketIdList.splice(index, 1)
              }
            })
          }
          this.redPacketObj = {};
          current.save = 0;
          this.defaultRedText = '不使用红包'
          for (let i = 0; i < this.redLists.length; i++) {
            let val = this.redLists[i]
            this.$set(val, 'isChoose', false)
          }
          this.showRedBag = false
        } else {
          if (!this.redLists.length) {
            this.defaultRedText = '无可用红包'
          }
//          this.redPacketIdList.forEach((res) => {
//            if (this.redPacketObj.redPacketId === res) {
//              this.redPacketIdList.push(this.redPacketObj.redPacketId)
//            }
//          })
        }
        this.$set(current, 'redPacketObj', this.redPacketObj)
        this.$emit('getRedList', this.redPacketIdList)
      },
      choose (value, list) {
        let this_ = this;
        if (this_.canChoose) {
          this_.$nextTick(function () {
            list.forEach(item => {
              if (item.redPacketId === value.redPacketId) {
                let redList = this_.redPacketIdList
                if (redList.length) {
                  redList.forEach((redItem, index) => {
                    if (redItem.redPacketId === this_.redPacketObj.redPacketId) {
                      this_.redPacketIdList.splice(index, 1, value)
                    }
                  })
                }
                item.isChoose = true
                this_.redPacketObj = value
                this_.redPacketIdList.push(value)
              } else {
                item.isChoose = false
              }
            })
            this_.$set(this_.productItem, 'redPacketObj', this_.redPacketObj)
            this_.$emit('redPacketIdList', this_.redPacketIdList)
            this.showRedBag = false
          })
        }
      },
      toLeaveMsg () {
        this.leaveMsgPopup = true
      },
      closeMsgPopup () {
        this.leaveMsgPopup = false
      },
      submitMsg (value) {
        if (!value.trim()) {
          this.$vux.toast.show({
            type: 'text',
            text: '留言内容不能为空'
          })
        } else {
          this.msgForStore = value
          this.leaveMsgPopup = false
          this.$set(this.productItem, 'message', this.msgForStore)
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
<style type="text/less" lang="less" scoped>
  .product-list {
    .itemTitle{
      padding: 12px 0;
    }
    .arrow{
      width: 14px;
      height: 14px;
      background: url("../../../assets/images/arrow_icon_grey32.png") no-repeat;
      background-size: contain;
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
</style>
