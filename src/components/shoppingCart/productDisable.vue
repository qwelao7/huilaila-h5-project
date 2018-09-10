<template>
  <div class="product-disable-wrapper">
    <Swipeout class="item-wrapper">
      <swipeout-item transition-mode="follow" v-for="(product, index) in invalidProductList" :key="index">
        <div slot="right-menu">
          <swipeout-button @click.native="deleteProductFromCart(product.productId)" type="warn">删除</swipeout-button>
        </div>
        <div slot="content" class="item vux-1px-b">
          <div class="left">
            <span class="label">失效</span>
          </div>
          <div class="content">
            <img class="img" :src="product.productImg" alt="">
            <div class="detail">
              <div class="product-title" v-text="product.productName"></div>
              <div class="product-price">
                <span class="symbol">¥</span>
                <span class="value" v-text="product.productPrice"></span>
              </div>
            </div>
            <div class="product-reason-wrapper">
              <span v-text="product.fstatusStr"></span>
            </div>
          </div>
        </div>
      </swipeout-item>
    </Swipeout>
  </div>
</template>

<script>
  import JPull from 'components/base/JPull/JPull';
  import {XNumber, Swipeout, SwipeoutItem, SwipeoutButton, querystring} from 'vux';
  export default {
    name: 'ProductDisable',
    props: {
      invalidProductList: {
        type: Array,
        default: []
      }
    },
    components: {
      'x-number': XNumber,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton
    },
    created: function () {
    },
    data () {
      return {
      }
    },
    methods: {
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
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .product-disable-wrapper {
    width: 100%;
    margin-top: 10px;
    background-color: #F9F9F9;
    .item-wrapper {
      .item {
        display: flex;
        align-items: center;
        margin: 0 15px;
        padding: 15px 0;
        .left {
          flex: 0 0 32px;
          margin-right: 10px;
          background-color: #aaa;
          border-radius: 3px;
          .label {
            color: #fff;
            font-size: 12px;
            text-align: center;
          }
        }
        .content {
          flex: 1;
          display: flex;
          align-items: center;
          position: relative;
          .img {
            width: 85px;
            height: 85px;
            margin-right: 10px;
          }
          .detail {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 80px;
            justify-content: space-between;
            .top {
              .product-title {
                font-size: 15px;
                line-height: 21px;
                color: #333;
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
          .product-reason-wrapper {
            position: absolute;
            right: 0;
            bottom: 0;
            font-size: 15px;
            color: #aaa;
          }
        }
      }
    }
  }
</style>
