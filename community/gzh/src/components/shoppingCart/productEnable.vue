<template>
  <div class="product-wrapper">
    <div class="header vux-1px-b">
      <div class="left">
        <check-icon class="check-icon" @click.native="updateStoreCheckStatus" :value="productItem.checked"></check-icon>
        <span class="shopper-title" v-text="productItem.storeName" @click="goShopperProductList(productItem.storeId)"></span>
      </div>
      <div class="money-wrapper" v-show="!isEdit && oneCheck">
        <span class="money-symbol" v-text="'¥'"></span>
        <span class="money-int" v-text="storeMoneyObj.int"></span>
        <span class="money-float" v-text="storeMoneyObj.float"></span>
      </div>
    </div>
    <div class="product-list-wrapper">
      <Swipeout>
        <swipeout-item class="item" transition-mode="follow" v-for="(product, index) in productItem.productList" :key="index">
          <div slot="right-menu">
            <swipeout-button @click.native="deleteProductFromCart(product.productId)" type="warn">删除</swipeout-button>
          </div>
          <div slot="content" class="item-wrapper vux-1px-b">
            <div class="left">
              <check-icon @click.native="changeCheckStatus(product)" :value="product.isCheck"></check-icon>
            </div>
            <div class="content">
              <div class="img-wrapper" @click="goProductDetail(product.productId)">
                <img :src="product.productImg" class="img" alt="">
                <p class="count-tip" v-text="'仅剩' + product.productStock + '件'" v-show="product.productStock <= 10"></p>
              </div>
              <div class="detail" @click="goProductDetail(product.productId)">
                <div class="top">
                  <div class="product-title" v-text="product.productName"></div>
                  <div class="product-sku" v-text="product.skuProperties"></div>
                </div>
                <div class="product-price">
                  <span class="symbol">¥</span>
                  <span class="value" v-text="product.productPrice"></span>
                </div>
              </div>
              <div class="product-count-wrapper">
                <j-number :mainObj="product" :value="product.itemNum" :onSub="onSub" :onAdd="onAdd" :onChangeFunc="onChangeFunc" fillable></j-number>
              </div>
            </div>
          </div>
        </swipeout-item>
      </Swipeout>
    </div>
    <div class="footer" @click="goShopperProductList(productItem.storeId)"
         v-show="footerObj.leftText || footerObj.rightText">
      <div class="left" v-text="footerObj.leftText" :class="{'left-disabled': footerObj.disabled}"></div>
      <div class="right">
        <span class="text" v-text="footerObj.rightText"></span>
        <span class="icon"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import JPull from 'components/base/JPull/JPull';
  import JNumber from 'components/base/JNumber';
  import {XNumber, CheckIcon, Swipeout, SwipeoutItem, SwipeoutButton, querystring} from 'vux';
  export default {
    name: 'ProductEnable',
    props: {
      productItem: {
        type: Object,
        default: {}
      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    components: {
      'j-number': JNumber,
      'check-icon': CheckIcon,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton
    },
    created: function () {
    },
    data () {
      return {
        isNeedUpdateItemCheckStatus: true
      }
    },
    computed: {
      oneCheck () {
        let oneCheck = false;
        let productList = this.productItem.productList;
        if (productList && productList.length) {
          for (let i = 0; i < productList.length; i++) {
            let product = productList[i];
            if (product.isCheck) {
              oneCheck = true;
              return oneCheck;
            }
          }
        }
        return oneCheck;
      },
      storeMoneyObj () {
        let storeMoneyObj = {
          money: 0,
          totalMoney: 0,
          int: '',
          float: ''
        };
        // 有无物流(1:无物流,2:有物流)
        let deliverySetting = this.productItem.deliverySetting;
        // 支持物流方式: 1快递配送  2预约上门 3用户自提(ps:1&2是互斥的)
        let deliverType = this.productItem.deliveryType;
        // 起送价
        let onsiteMinprice = parseFloat(this.productItem.onsiteMinprice);
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
        let atLeastOneCheck = false;
        let productList = this.productItem.productList;
        if (productList && productList.length) {
          productList.forEach(function (product) {
            if (product.isCheck) {
              atLeastOneCheck = true;
              let price = product.productPrice;
              let count = product.itemNum;
              let money = parseFloat(price) * count;
              storeMoney += money;
            }
          });
        }

        /* 计算运费和服务费 begin */
        let acturalServiceMoney = 0;
        let acturalFreightMoney = 0;
        // 至少选中一个
        if (atLeastOneCheck) {
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
                  }
                }
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
                  }
                }
              }
            }
          }
        }
        this.$set(storeMoneyObj, 'money', storeMoney);
        // 未达到起送价
        if (storeMoney < onsiteMinprice) {
          this.$set(this.productItem, 'notReachMinPrice', true);
        } else {
          this.$set(this.productItem, 'notReachMinPrice', false);
        }
        totalMoney += storeMoney; // (商品价格)
        totalMoney += acturalServiceMoney; // (服务费)
        totalMoney += acturalFreightMoney; // (运费)
        /* 计算运费和服务费 end */
        if (totalMoney >= 0) {
          let totalMoneys = totalMoney.toFixed(2).split('.');
          this.$set(storeMoneyObj, 'show', true);
          this.$set(storeMoneyObj, 'totalMoney', totalMoney);
          this.$set(storeMoneyObj, 'int', totalMoneys[0]);
          this.$set(storeMoneyObj, 'float', '.' + totalMoneys[1]);
        }
        this.$set(this.productItem, 'acturalServiceMoney', acturalServiceMoney);
        this.$set(this.productItem, 'acturalFreightMoney', acturalFreightMoney);
        this.$set(this.productItem, 'totalMoney', totalMoney);
        this.$set(this.productItem, 'atLeastOneCheck', atLeastOneCheck);
        return storeMoneyObj;
      },
      footerObj () {
        let footerObj = {
          disabled: false,
          leftText: '',
          rightText: ''
        }
        // 商家价格
        let money = this.storeMoneyObj.money;
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
        // 免运费条件(0:不需要运费,-1:不减免运费,其他:满xxx免运费)
        let minMoney = this.productItem.minMoney;
        // 起送价
        let onsiteMinprice = parseFloat(this.productItem.onsiteMinprice);
        // 未达到起送价
        if (money < onsiteMinprice) {
          footerObj.disabled = true;
          footerObj.leftText = '未达到' + onsiteMinprice + '元起送价';
          footerObj.rightText = '去凑单';
          return footerObj;
        }
        // 有物流(无物流不需要考虑)
        if (deliverySetting === 2) {
          // 预约上门&用户自提(用户自提不需要考虑相关费用)
          if (deliverType.indexOf('2') !== -1) {
            // 没有服务费
            if (onsiteServiceExpense <= 0) {
              footerObj.leftText = '您已享受"全场免服务费"';
              footerObj.rightText = '再去抢购';
            } else {
              // 有服务费
              if (onsiteFreeService === -1) {
                footerObj.leftText = '服务费' + onsiteServiceExpense + '元';
                footerObj.rightText = '再去抢购';
              } else if (onsiteFreeService <= 0) {
                footerObj.leftText = '您已享受"全场免服务费"';
                footerObj.rightText = '再去抢购';
              } else if (onsiteFreeService > 0) {
                // 没有达到免服务费的条件
                if (money < onsiteFreeService) {
                  footerObj.leftText = '服务费' + onsiteServiceExpense + '元, 满' + onsiteFreeService + '元免服务费';
                  footerObj.rightText = '去凑单';
                } else {
                  footerObj.leftText = '您已享受"满' + onsiteFreeService + '元免服务费"';
                  footerObj.rightText = '再去抢购';
                }
              }
            }
          }
          // 快递配送&用户自提(用户自提不需要考虑相关费用)
          if (deliverType.indexOf('1') !== -1) {
            // 没有运费
            if (freightMoney <= 0) {
              footerObj.leftText = '您已享受"全场包邮"';
              footerObj.rightText = '再去抢购';
            } else {
              if (minMoney === -1) {
                footerObj.leftText = '运费' + freightMoney + '元';
                footerObj.rightText = '再去抢购';
              } else if (minMoney <= 0) {
                footerObj.leftText = '您已享受"全场包邮"';
                footerObj.rightText = '再去抢购';
              } else if (minMoney > 0) {
                // 商品价格已达到包邮条件
                if (money >= minMoney) {
                  footerObj.leftText = '您已享受"满' + minMoney + '元包邮"';
                  footerObj.rightText = '再去抢购';
                } else {
                  footerObj.leftText = '运费' + freightMoney + '元,满' + minMoney + '元包邮';
                  footerObj.rightText = '去凑单';
                }
              }
            }
          }
        }
        return footerObj;
      }
    },
    methods: {
      updateStoreCheckStatus () {
        this.isNeedUpdateItemCheckStatus = true;
        this.$nextTick(function () {
          this.$set(this.productItem, 'checked', !this.productItem.checked);
        })
      },
      changeCheckStatus (product) {
        this.$nextTick(function () {
          // 修改对象的属性值
          this.$set(product, 'isCheck', !product.isCheck);
          let val = product.isCheck;
          // 取消选择某个商品,则直接将门店下的icon置为false
          if (!val) {
            this.isNeedUpdateItemCheckStatus = false;
            this.$set(this.productItem, 'checked', false);
            return;
          }
          // 否则,查看是否门店下所有商品都为选中,如果是,则将门店下的icon置为true
          let productList = this.productItem.productList;
          if (productList && productList.length) {
            for (let i = 0; i < productList.length; i++) {
              let item = productList[i];
              if (item.isCheck) {
                continue;
              } else {
                return;
              }
            }
            this.$set(this.productItem, 'checked', true);
          }
        })
      },
      onChange (product, val, cb, type) {
        let _this_ = this;
        // 选购数量已经是1了
        if (product.itemNum === 1) {
          if (type === 'sub') {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: '选购数量不能再少了'
            });
            return;
          }
        }
        // 手动输入选购数量
        if (type === 'change') {
          // 选购数量小于等于1,没必要更新了
          if (val < 1) {
            product.itemNum = 1;
            _this_.$vux.toast.show({
              type: 'cancel',
              text: '选购数量不能再少了'
            });
            return;
          }
        }
        // 超过最大限购量 || 库存
        let productLimitopt = parseFloat(product.productLimitopt);
        let productStock = parseFloat(product.productStock);
        // 代表没有选购上限
        if (productLimitopt === 0) {
          productLimitopt = Math.min();
        }
        let maxCount = Math.min(productLimitopt, productStock);
        if (val > maxCount) {
          let toastText = '已达到选购上限';
          if (val < productLimitopt && val > productStock) {
            toastText = '商品库存不足';
          }
          _this_.$vux.toast.show({
            type: 'cancel',
            text: toastText
          });
          val = maxCount;
          if (val !== 0) {
            product.itemNum = val;
          }
          return;
        }
        let productId = product.productId;
        let params = {
          productId: productId,
          productNum: val
        };
        _this_.$JHttp({
          method: 'put',
          url: window.baseURL + '/productCarts/updateProductCartsCount?' + querystring.stringify(params)
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            product.itemNum = val;
          } else { // 库存没有更新成功,则恢复为原来的数量
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(error => {
          console.error(error);
        })
      },
      onChangeFunc (product, val, cb) {
        this.onChange(product, val, cb, 'change');
      },
      onAdd (product, val, cb) {
        // 增加购物车数量
        this.onChange(product, val, cb);
      },
      onSub (product, val, cb) {
        // 减少购物车数量
        this.onChange(product, val, cb, 'sub');
      },
      deleteProductFromCart (productId) {
        let _this_ = this;
        let params = {
          deleteAll: false,
          ids: JSON.stringify([productId])
        };
        _this_.$JHttp({
          method: 'put',
          url: window.baseURL + '/productCarts/deleteProductCarts?' + querystring.stringify(params)
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            _this_.$vux.toast.show({
              type: 'success',
              text: '商品移除成功!'
            });
            _this_.$emit('refreshData');
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(error => {
          console.error(error);
        })
      },
      goProductDetail (productId) {
        this.$router.push({
          path: '/productDetail',
          query: {
            productId: productId
          }
        })
      },
      goShopperProductList (storeId) {
        this.$router.push('/shopperProductList/' + storeId)
      }
    },
    watch: {
      'productItem.checked' (val) {
        if (val) {
          this.$emit('updateAllCheckStatus', true);
        } else { // 取消全选
          this.$emit('updateAllCheckStatus', false);
        }
        if (this.isNeedUpdateItemCheckStatus) {
          let productList = this.productItem.productList;
          if (productList && productList.length) {
            productList.forEach(function (product) {
              // 选中一个门店下的全部商品
              if (val) {
                product.isCheck = true;
              } else { // 取消全选
                product.isCheck = false;
              }
            });
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .product-wrapper {
    width: 100%;
    height: 100%;
    margin-top: 10px;
    background-color: #fff;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 15px;
      padding: 15px 0;
      .left {
        display: flex;
        align-items: center;
        .check-icon {
          margin-right: 10px;
        }
        .shopper-title {
          font-size: 15px;
          color: #333;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .money-wrapper {
        margin-left: 10px;
        color: #FF6648;
        font-size: 0;
        display: flex;
        align-items: baseline;
        .money-symbol {
          font-size: 12px;
          margin-right: 3px;
        }
        .money-int {
          font-size: 18px;
        }
        .money-float {
          font-size: 12px;
        }
      }
    }
    .product-list-wrapper {
      width: 100%;
      height: 100%;
      .item {
        width: 100%;
        height: 100%;
        .item-wrapper {
          display: flex;
          align-items: center;
          margin: 0 15px;
          padding: 15px 0;
          .left {
            flex: 0 0 32px;
            margin-right: 10px;
          }
          .content {
            flex: 1;
            display: flex;
            align-items: center;
            position: relative;
            .img-wrapper {
              width: 85px;
              height: 85px;
              position: relative;
              margin-right: 10px;
              .img {
                width: 85px;
                height: 85px;
              }
              .count-tip {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                line-height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #666565;
                color: #fff;
                font-size: 12px;
              }
            }
            .detail {
              flex: 1;
              display: flex;
              flex-direction: column;
              height: 85px;
              justify-content: space-between;
              .top {
                .product-title {
                  font-size: 15px;
                  /*line-height: 17px;*/
                  display: -webkit-box;
                  /*! autoprefixer: off */
                  -webkit-box-orient: vertical;
                  /* autoprefixer: on */
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  color: #333;
                }
                .product-sku {
                  font-size: 15px;
                  line-height: 21px;
                  color: #aaa;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  margin-top: 3px;
                }
              }
              .product-price {
                display: flex;
                color: #FF6648;
                font-size: 15px;
                .symbol {
                  margin-right: 4px;
                }
              }
            }
            .product-count-wrapper {
              position: absolute;
              right: 0;
              bottom: 0;
            }
          }
        }
      }
    }
    .footer {
      height: 50px;
      display: flex;
      background-color: #fff;
      align-items: center;
      margin: 0 15px;
      .left {
        flex: 1;
      }
      .left-disabled {
        color: #aaa;
      }
      .right {
        flex: 0 0 86px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: #FF6648;
        .icon {
          flex: 0 0 16px;
          height: 16px;
          position: relative;
        }
        .icon:before {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          border: 1px solid #aaa;
          border-width: 1px 0 0 1px;
          transform: rotate(-225deg);
          top: 3px;
          left: 3px;
        }
      }
    }
  }
</style>
