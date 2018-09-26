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
  import JPull from 'components/base/JPull/JPull';
  import {querystring} from 'vux';
  import ProductItem from 'components/product/productItem';
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
        curPage: 1,
        pageSize: 20,
        sortType: '1',
        categoryId: '',
        productList: []
      }
    },
    computed: {
      labelId () {
        return this.$route.params.labelId;
      }
    },
    methods: {
      search (sortType) {
        this.sortType = sortType;
        this.productList = [];
        this.getProductList(undefined, sortType);
      },
      getCategoryProductList (loaded, categoryId) {
        let params = {
          categoryId: categoryId,
          sortType: '1',
          curPage: this.curPage,
          pageSize: this.pageSize
        }
        let _this_ = this;
        let product = {};
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/shopGoods/getCategoryGoodsList?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            let data = res.data.resultList;
            if (data && data.length) {
              data.forEach(function (item) {
                let price = item.productPrice;
                let prices = (parseFloat(price).toFixed(2)).split('.');
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
            if (loaded) {
              let hasMore = res.data.pageResult.hasMore;
              loaded(hasMore);
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
      refreshData (loaded, categoryId) {
        if (categoryId !== undefined) {
          this.categoryId = categoryId;
        }
        this.curPage = 1;
        this.productList = [];
        this.getCategoryProductList(loaded, this.categoryId);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getCategoryProductList(loaded, this.categoryId);
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
    height: 623px;
    background-color: #fff;
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
