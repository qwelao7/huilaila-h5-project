<template>
  <div class="goods">
    <ul>
      <li v-for="item in productArr" @click="toGoodsDetail(item)">
        <div class="flex-item">
          <i class="tag" v-if="item.activityType === 2">促</i>
          <!-- <img :src="item.productCoverimg" alt=""> -->
          <j-img :osskey="item.productCoverimg" :custom-width="165" :custom-height="165"></j-img>
          <p class="name">{{item.productName}}</p>
          <p class="price">¥{{item.productPrice }}</p>
          <p class="sell">已售{{item.productSold}}</p>
          <div class="tags"><span  v-show="item.isFreeFreight">包邮</span></div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import JImg from 'components/common/img/jImg'
  export default {
    name: 'goods',
    components: {
      JImg
    },
    props: {
      productArr: {
        type: Array
      }
    },
    data () {
      return {
        text: ''
      }
    },
    created () {
      //
    },
    methods: {
      toGoodsDetail (value) {
        // todo 进入商品详情
        this.$router.push({
          path: '/productDetail',
          query: {
            productId: value.productId
          }
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .goods{
    ul{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      li{
        width: 165px;
        margin-bottom: 20px;
      }
      li:nth-child(2n) {
        margin-left: 15px;
      }
    }
    .flex-item{
      position: relative;
      .tag{
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-style: normal;
        font-size: 14px;
        border-radius: 6px;
        background-color: #FFBD2A;
        color: #FFFFFF;
      }
/*      .m{background-color: red}
      .c{background-color: #f74c31}
      .p{background-color: #0DAB60}*/
      img{
        width: 165px;
        height: 165px;
      }
      p{
        font-size: 12px;
        margin: 0;
      }
      .name{
        width: 165px;
        font-size: 15px;
        color: #333333;
        margin-top: 5px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .price{
        color: #FF6648;
      }
      .sell{
        color: #aaaaaa;
      }
      .tags{
        height: 18px;
        line-height: 18px;
        span{
          width: 40px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          font-size: 11px;
          border: 0.5px solid #cd0000;
          border-radius: 3px;
          background: #FFF0F0;
          color: #cd0000;
        }
      }
    }
  }
</style>
