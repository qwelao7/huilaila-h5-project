<template>
  <div class="shopping-cart-wrapper commonHeader">
    <view-box body-padding-top="1.253333rem" body-padding-bottom="1.866667rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="购物车"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
        <a slot="right" class="right-btn" v-show="validList.length" v-text="editText" @click="isEdit = !isEdit"></a>
      </x-header>
      <div class="cart-list-wrapper" v-if="validList.length || invalidList.length">
        <j-pull :refreshFunc="refreshData">
          <div slot="jpull-list">
            <div class="product-list-enable-wrapper">
              <product-enable v-for="(productItem, index) in validList" :key="index" ref="productEnable" :productItem="productItem" :isEdit="isEdit" @refreshData="refreshData"
                              @updateAllCheckStatus="onUpdateAllCheckStatus"></product-enable>
            </div>
            <div class="product-list-disable-wrapper">
              <product-disable :invalidProductList="invalidList" @refreshData="refreshData"></product-disable>
            </div>
          </div>
        </j-pull>
      </div>
      <div class="cart-footer-wrapper"  v-if="validList.length">
        <div class="left">
          <div class="select-wrapper">
            <check-icon class="check-icon" @click.native="selectAll" :value.async="allChecked"></check-icon>
            <span class="left-title" v-text="'全选'"></span>
          </div>
          <div class="fee-wrapper" v-show="!isEdit">
            <div class="top">
              <span class="top-title" v-text="'合计:'"></span>
              <div class="top-value">
                <span class="symbol" v-text="'¥'"></span>
                <span class="fee-int" v-text="totalPrice.totalMoney.int"></span>
                <span class="fee-float" v-text="totalPrice.totalMoney.float"></span>
              </div>
            </div>
            <div class="bottom">
              <span class="bottom-title" v-text="'含运费:'"></span>
              <div class="bottom-value">
                <span class="symbol" v-text="'¥'"></span>
                <span class="fee-int" v-text="totalPrice.totalFreightMoney.int"></span>
                <span class="fee-float" v-text="totalPrice.totalFreightMoney.float"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-btn">
          <button class="btn btn-commit" :class="{'btn-disable': !selectedProductId.length}" v-show="!isEdit" @click="goOrderConfirm">
            <span class="btn-text" v-text="'结算'"></span>
            <span class="btn-count" v-show="totalCount" v-text="btnCommitText"></span>
          </button>
          <button class="btn btn-delete" v-show="isEdit" v-text="'删除'" @click="deleteCart"></button>
        </div>
      </div>
      <div class="placeholder"  v-if="!validList.length && !invalidList.length">
        <span class="placeholder-bg"></span>
        <p class="placeholder-text-top">哎呀~购物车空空如也</p>
        <p class="placeholder-text-bottom">快去选购宝贝吧</p>
        <button class="btn btn-goHome" @click="goServiceIndex">去逛逛</button>
      </div>
      <div v-transfer-dom>
        <x-dialog v-model="isShowNotAuthModel" :hide-on-blur="false" class="not-auth-wrapper">
          <p class="not-auth-text" v-text="notAuthTips"></p>
          <div class="btn">
            <span @click="isShowNotAuthModel = false">确定</span>
          </div>
        </x-dialog>
      </div>
    </view-box>
  </div>
</template>

<script>
  import img from '../../assets/a3.jpg';
  import JPull from 'components/base/JPull/JPull';
  import {XHeader, ViewBox, CheckIcon, querystring, XDialog, TransferDomDirective as TransferDom} from 'vux';
  import ProductEnable from 'components/shoppingCart/productEnable';
  import ProductDisable from 'components/shoppingCart/productDisable';
  export default {
    name: 'ProductList',
    components: {
      'x-header': XHeader,
      'view-box': ViewBox,
      'check-icon': CheckIcon,
      'j-pull': JPull,
      'product-enable': ProductEnable,
      'product-disable': ProductDisable,
      XDialog
    },
    directives: {
      TransferDom
    },
    created: function () {
      this.getPersonalInfo();
    },
    data () {
      return {
        curPage: 1,
        pageSize: 20,
        isEdit: false,
        allChecked: false,
        invalidList: [],
        validList: [],
        roomId: '',
        isShowNotAuthModel: false,
        notAuthTips: '您的当前房号信息未审核,可前往"我的地址"进行查看或修改'
      }
    },
    computed: {
      editText () {
        if (!this.isEdit) {
          return '编辑';
        } else {
          return '完成';
        }
      },
      btnCommitText () {
        if (this.totalCount > 99) {
          return '(99+)';
        }
        return '(' + this.totalCount + ')';
      },
      selectedProductId () {
        let validList = this.validList;
        let selectedProductIds = [];
        if (validList && validList.length) {
          validList.forEach(function (productItem) {
            let productList = productItem.productList;
            if (productList && productList) {
              productList.forEach(function (product) {
                if (product.isCheck) {
                  selectedProductIds.push(product.productId);
                }
              });
            }
          });
        }
        return selectedProductIds;
      },
      selectedProducts () {
        let validList = this.validList;
        let selectedProducts = [];
        if (validList && validList.length) {
          validList.forEach(function (productItem) {
            let productList = productItem.productList;
            if (productList && productList) {
              productList.forEach(function (product) {
                if (product.isCheck) {
                  selectedProducts.push({
                    productId: product.productId,
                    itemNum: product.itemNum
                  });
                }
              });
            }
          });
        }
        return selectedProducts;
      },
      selectedStores () {
        let validList = this.validList;
        let selectedStores = [];
        if (validList && validList.length) {
          validList.forEach(function (productItem) {
            let atLeastOneCheck = productItem.atLeastOneCheck;
            // 至少有一个商品被选中的门店
            if (atLeastOneCheck) {
              let productList = productItem.productList;
              let selectedProductList = [];
              if (productList && productList.length) {
                productList.forEach(function (product) {
                  // 被选中的商品
                  if (product.isCheck) {
                    selectedProductList.push(product);
                  }
                });
              }
              productItem.productList = selectedProductList;
              selectedStores.push(productItem);
            }
          });
        }
        return selectedStores;
      },
      totalCount () {
        let validList = this.validList;
        let totalCount = 0;
        if (validList && validList.length) {
          validList.forEach(function (productItem) {
            let productList = productItem.productList;
            if (productList && productList) {
              productList.forEach(function (product) {
                if (product.isCheck) {
                  totalCount += product.itemNum;
                }
              });
            }
          });
        }
        return totalCount;
      },
      totalPrice () {
        let validList = this.validList;
        let totalMoney = 0;
        let totalFreightMoney = 0;
        let totalServiceMoney = 0;
        if (this.totalCount) {
          if (validList && validList.length) {
            validList.forEach(function (productItem) {
              let storeMoney = productItem.totalMoney;
              let storeFreightMoney = productItem.acturalFreightMoney;
              let storeServiceMoney = productItem.acturalServiceMoney;
              totalMoney += storeMoney;
              totalFreightMoney += storeFreightMoney;
              // 将服务费也算在运费里头(产品这么指鹿为马的设计)
              totalServiceMoney += storeServiceMoney;
            });
          }
        }
        let totalMoneys = totalMoney.toFixed(2).split('.');
        let totalFreightMoneys = (totalFreightMoney + totalServiceMoney).toFixed(2).split('.');
        return {
          totalMoney: {
            int: totalMoneys[0],
            float: '.' + totalMoneys[1]
          },
          totalFreightMoney: {
            int: totalFreightMoneys[0],
            float: '.' + totalFreightMoneys[1]
          }
        };
      },
      moneyType () {
        let moneyTypes = [];
        // subPaytype 1: 线下 2: 线上 3:线上&线下
        if (this.selectedStores && this.selectedStores.length) {
          this.selectedStores.forEach(function (store) {
            moneyTypes.push(store.subPaytype);
          });
        }
        let isAllEqual = true;
        for (let i = 0; i < moneyTypes.length; i++) {
          let type = moneyTypes[i];
          if (type !== moneyTypes[0]) {
            isAllEqual = false;
            break;
          }
        }
        // 有一个不相等
        if (!isAllEqual) {
          return -1;
        }
        // 全部都为线上支付
        if (moneyTypes[0] === 2) {
          return 9;
        } else { // 全部都为线下支付
          return 0;
        }
      }
    },
    methods: {
      getPersonalInfo () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/ownerAsset/CurrentCommunityHasDefaultAsset'
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            let ownerAsset = res.data;
            // 拥有审核通过的房号
            if (ownerAsset && ownerAsset.roomId) {
              _this_.roomId = ownerAsset.roomId;
              _this_.refreshData();
            } else {
              _this_.isShowNotAuthModel = true;
            }
          } else {
            _this_.$vux.toast.show({
              type: 'error',
              text: res.msg
            });
          }
        }).catch(error => {
          console.error(error);
        })
      },
      getCartList (loaded) {
        let params = {
          curPage: this.curPage,
          pageSize: this.pageSize
        }
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/productCarts/getProductCartsList?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            let validList = res.data.orderList;
            let invalidList = res.data.invalidList;
            if (validList && validList.length) {
              validList.forEach(function (productItem) {
                productItem.notReachMinPrice = true;
                productItem.acturalFreightMoney = 0;
                productItem.acturalServiceMoney = 0;
                productItem.totalMoney = 0;
                productItem.atLeastOneCheck = false;
                productItem.checked = false;
                let productList = productItem.productList;
                if (productList && productList.length) {
                  productList.forEach(function (product) {
                    product.isCheck = false;
                  });
                }
              });
            }
            _this_.validList = validList;
            _this_.invalidList = invalidList;
            if (loaded) {
              loaded(true);
            }
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      refreshData (loaded) {
        this.curPage = 1;
        this.getCartList(loaded);
      },
      selectAll () {
        let _this_ = this;
        let count = this.validList.length;
        // 全选
        for (let i = 0; i < count; i++) {
          _this_.$refs.productEnable[i].isNeedUpdateItemCheckStatus = true;
        }
        if (!this.allChecked) {
          this.invalidList.forEach(function (item) {
            _this_.$set(item, 'checked', true);
          })
          this.validList.forEach(function (item) {
            _this_.$set(item, 'checked', true);
          })
        } else { // 取消全选
          this.invalidList.forEach(function (item) {
            _this_.$set(item, 'checked', false);
          })
          this.validList.forEach(function (item) {
            _this_.$set(item, 'checked', false);
          })
        }
        this.allChecked = !this.allChecked;
      },
      onUpdateAllCheckStatus (status) {
        // 有一个未选中的,就取消全选
        if (!status) {
          this.allChecked = false;
        } else { // 遍历,确定是否需要全选
          let validList = this.validList;
          if (validList && validList.length) {
            for (let i = 0; i < validList.length; i++) {
              let productItem = validList[i];
              if (productItem.checked) {
                continue;
              } else {
                return;
              }
            }
            this.allChecked = true;
          }
        }
      },
      deleteCart () {
        // 判断商品数量
        if (!this.totalCount) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请选择需要删除的商品'
          });
          return;
        }
        let _this_ = this;
        let params = {};
        // 全部删除
        if (this.allChecked) {
          params.deleteAll = true;
        } else {
          params.deleteAll = false;
          params.ids = JSON.stringify(this.selectedProductId);
        }
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
            _this_.refreshData();
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
      goOrderConfirm () {
        // 判断商品数量
        if (!this.totalCount) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请选择需要结算的商品'
          });
          return;
        }
        let _this_ = this;
        let selectedStores = this.selectedStores;
        let orderInfo = [];
        let communityId = localStorage.getItem('communityId');
        if (selectedStores && selectedStores.length) {
          selectedStores.forEach(function (store) {
            let selectedProductList = store.productList;
            let products = [];
            if (selectedProductList && selectedProductList.length) {
              selectedProductList.forEach(function (selectedProduct) {
                products.push({
                  specId: selectedProduct.productId,
                  itemNum: selectedProduct.itemNum,
                  itemName: selectedProduct.productName,
                  itemPrice: selectedProduct.productPrice,
                  itemStock: selectedProduct.productStock,
                  itemLimitBuy: selectedProduct.productLimitopt
//                  itemUnit: selectedProduct.productUnit
                });
              });
            }
            orderInfo.push({
              productInfo: products,
              freightMoney: (store.acturalServiceMoney + store.acturalFreightMoney),
              storeId: store.storeId,
              minMoney: store.minMoney,
              orderPrice: store.totalMoney.toFixed(2),
//              subCommunityId: communityId,
//              moneyType: _this_.moneyType,
              deliveryType: store.deliveryType,
              shopId: store.shopId
            });
          });
        }
        let params = {
          orderInfo: JSON.stringify(orderInfo)
        }
        _this_.$JHttp({
          method: 'post',
          url: window.baseURL + '/order/checkParamForNewOrderList',
          data: params,
          transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            defRoomId: this.roomId
          }
        }).then((res) => {
          if (res.status === 100) {
            let data = res.data;
            let abnormalStauts = data.abnormalStauts;
            // 校验成功,跳转到订单结算页
            this.$router.push({
              path: '/confirmOrders',
              query: {
                productList: JSON.stringify(this.selectedProducts),
                status: abnormalStauts
              }
            });
          } else {
            // 接口没有返回数据
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
            // 有异常,全部刷新
            _this_.refreshData();
          }
        }).catch(function (response) {
          // 调用接口出错
        });
      },
      goServiceIndex () {
        // 跳转到商圈首页
        this.$router.replace('/service')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .shopping-cart-wrapper {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    .cart-list-wrapper {
      height: 100%;
      margin-bottom: 20px;
    }
    .cart-footer-wrapper {
      width: 100%;
      height: 50px;
      background-color: #fff;
      display: flex;
      align-items: center;
      .left {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .select-wrapper {
          margin-left: 15px;
          display: flex;
          align-items: center;
          .left-title {
            margin-left: 5px;
            line-height: 24px;
            font-size: 15px;
          }
        }
        .fee-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          .top {
            display: flex;
            align-items: baseline;
            .top-title {
              font-size: 12px;
            }
            .top-value {
              display: flex;
              align-items: baseline;
              color: #FF6648;
              .symbol {
                font-size: 12px;
              }
              .fee-int {
                font-size: 15px;
              }
              .fee-float {
                font-size: 12px;
              }
            }
          }
          .bottom {
            display: flex;
            align-items: baseline;
            .bottom-title {
              font-size: 12px;
            }
            .bottom-value {
              display: flex;
              align-items: baseline;
              color: #FF6648;
              font-size: 12px;
            }
          }
        }
      }
      .right-btn {
        flex: 0 0 105px;
        height: 100%;
        margin-left: 10px;
        .btn {
          width: 100%;
          height: 100%;
          outline: none;
          -webkit-appearance: none;
          box-shadow: none;
          border-style: none;
          background-color: #FF6648;
          color: #fff;
          font-size: 0;
          .btn-text {
            font-size: 18px;
            display: inline-block;
          }
          .btn-count {
            font-size: 15px;
            display: inline-block;
          }
        }
        .btn-delete {
          font-size: 18px;
        }
        .btn-disable {
          background-color: #D8D8D8;
        }
      }
    }
    .placeholder {
      background-color: #fff;
      height: 623px;
      padding-top: 79px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .placeholder-bg {
        width: 150px;
        height: 150px;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url("../../assets/images/No-interaction.png");
        margin-bottom: 5px;
      }
      .placeholder-text-top {
        font-size: 15px;
        color: #aaa;
        margin-bottom: 5px;
      }
      .placeholder-text-bottom {
        font-size: 12px;
        color: #aaa;
        margin-bottom: 20px;
      }
      .btn-goHome {
        width: 150px;
        height: 35px;
        outline: none;
        -webkit-appearance: none;
        box-shadow: none;
        border-style: none;
        background-color: #FF6648;
        color: #fff;
        font-size: 15px;
        cursor: hand;
        border-radius: 34px;
      }
    }
  }
</style>
