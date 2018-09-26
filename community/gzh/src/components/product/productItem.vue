<template>
  <div class="product-item-wrapper">
    <div class="product-item" @click="goProductDetail(product.id)">
      <img class="img" :src="product.imgUrl" alt="">
      <div class="product-title" v-text="product.productName"></div>
      <div class="price">
        <span class="price-unit" v-text="'¥'"></span>
        <div class="price-value">
          <span class="int" v-text="product.priceInt"></span>
          <span class="dot" v-text="product.priceDot"></span>
        </div>
      </div>
      <div class="salt-wrapper">
        <span class="salt-title" v-text="'已售'"></span>
        <span class="salt-count" v-text="product.saltCount"></span>
      </div>
      <div class="label-list">
              <span class="label-item" v-for="(label, labelIndex) in product.labelList" :key="labelIndex"
                    v-text="label"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import img from '../../assets/a3.jpg';
  import JPull from 'components/base/JPull/JPull';
  import {querystring} from 'vux';
  export default {
    name: 'ProductItem',
    components: {
    },
    props: {
      product: {
        type: Object,
        default: {}
      }
    },
    created: function () {
    },
    data () {
      return {
      }
    },
    methods: {
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
  .product-item-wrapper {
    background-color: #fff;
    width: 165px;
    display: inline-block;
    margin: 20px 0 20px 15px;
    vertical-align: top;
    .product-item {
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
        height: 20px;
        .label-item {
          font-size: 12px;
          width: 40px;
          height: 18px;
          margin-right: 8px;
          border-radius: 3px;
          border: 1px solid #CD0000;
          color: #cd0000;
          background: #FFF0F0;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
