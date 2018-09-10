<template>
  <div class="list-wrapper">
    <j-pull v-if="productList.length" :refreshFunc="refreshData" :loadMoreFunc="loadMore">
      <div slot="jpull-list">
        <product-item class="product-item-parent" v-for="(product, productIndex) in productList" :key="productIndex"
                      :product="product" @click="goProductDetail(product.id)">
        </product-item>
      </div>
    </j-pull>
    <div class="placeholder" v-if="!productList.length">
      <span class="img"></span>
      <p class="text">什么都没发现，去别处看看吧</p>
    </div>
  </div>
</template>

<script>
  import img from '../../../assets/a3.jpg';
  import JPull from 'components/base/JPull/JPull';
  import ProductItem from 'components/product/productItem';
  import {querystring} from 'vux';
  export default {
    name: 'ProductList',
    components: {
      'j-pull': JPull,
      'product-item': ProductItem
    },
    created: function () {
    },
    data () {
      return {
        categoryId: '',
        curPage: 1,
        pageSize: 20,
        productList: []
      }
    },
    computed: {
      storeId () {
        return this.$route.params.storeId;
      }
    },
    methods: {
      getProductList (loaded, categoryId) {
        let product = {};
        let params = {
          storeId: this.storeId,
          curPage: this.curPage,
          pageSize: this.pageSize
        }
        if (categoryId) {
          params.categoryId = categoryId;
        }
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/shop/store/productByCategoryId?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            let hasMore = data.pageResult.hasMore;
            if (loaded) {
              loaded(hasMore);
            }
            let resultList = data.resultList;
            if (resultList && resultList.length) {
              resultList.forEach(function (item) {
                let price = item.productPrice;
                let prices = price.split('.');
                let priceInt = prices[0];
                let priceDot = '.' + prices[1];
                product = {
                  id: item.productId,
                  imgUrl: item.productCoverimg,
                  productName: item.productName,
                  priceInt: priceInt,
                  priceDot: priceDot,
                  saltCount: item.productSold,
                  labelList: item.isFreeFreight === 1 ? ['包邮'] : []
                }
                _this_.productList.push(product);
              });
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
      getData () {
        this.curPage = 1;
        this.productList = [];
        this.getProductList();
      },
      refreshData (loaded, categoryId) {
        if (categoryId !== undefined) {
          this.categoryId = categoryId;
        }
        this.curPage = 1;
        this.productList = [];
        this.getProductList(loaded, this.categoryId);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getProductList(loaded, this.categoryId);
      },
      goProductDetail (productId) {
        this.$router.push({
          path: '/productDetail',
          query: {
            productId: productId
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .list-wrapper {
    width: 100%;
    height: 500px;
    background-color: #fff;
    .product-item {
      width: 165px;
      margin: 20px 0 20px 15px;
      display: inline-block;
      .img {
        width: 165px;
        height: 165px;
        margin-bottom: 5px;
      }
      .product-title {
        font-size: 15px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .price {
        color: #FF6648;
        display: flex;
        align-items: baseline;
        font-size: 0;
        .price-unit {
          font-size: 12px;
          margin-right: 4px;
        }
        .price-value {
          display: flex;
          align-items: baseline;
          .int {
            font-size: 18px;
          }
          .dot {
            font-size: 12px;
          }
        }
      }
      .salt-wrapper {
        display: flex;
        color: #aaa;
        font-size: 0;
        margin-bottom: 4px;
        .salt-title {
          font-size: 12px;
          margin-right: 6px;
        }
        .salt-count {
          font-size: 12px;
        }
      }
      .label-list {
        display: flex;
        .label-item {
          font-size: 12px;
          width: 40px;
          height: 18px;
          margin-right: 8px;
          border-radius: 3px;
          border: 1px solid #CD0000;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .placeholder {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .img {
      width: 225px;
      height: 225px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url('../../../assets/images/No-content.png');
    }
    .text {
      font-size: 15px;
    }
  }
</style>
