<template>
  <div class="broadcast">
    <div class="broadcastBody">
      <div class="goodsImg">
        <img :src="data.picture" />
      </div>
      <div class="goodsInfo">
        <span class="goodsName nowrap">{{ data.title }}</span>
        <div class="goodsPrice">
           <span><b>¥</b></span><span class="price">{{ price }}</span><span class="price_dec">.{{ price_dec }}</span>
        </div>
        <span class="goodsDetail" v-show='data.thirdLine'>{{ data.thirdLine }}</span>
        <span class ="soldNum">{{ data.fourthLine }}</span>
      </div>
    </div>
    <div class='card-buttom'>
      <div class="card-buttom-left">
       <span>{{ data.cardName }}</span>
        <span class='subline'></span>
        <span>{{ data.timeStr }}</span>
      </div>
      <span class='cardbtn'>{{ data.btnName}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'broadcast',
  data () {
    return {
      price: '0',
      price_dec: '00'
    };
  },
  props: {
    data: {
      type: Object,
      default () {
        return [];
      }
    }
  },
  created () {
    this.newPrice(this.data.subTitle);
  },
  methods: {
    newPrice: function (oldPrice) {
      if (oldPrice.toString().indexOf('.') > -1) {
        this.price = oldPrice.toString().split('.')[0];
        this.price_dec = oldPrice.toString().split('.')[1];
      }
    }
  },
  watch: {
    'data.subTitle': function (n, o) {
      this.newPrice(n);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.broadcast {
  padding: 0.4rem;
  position: relative;
}
.broadcast::after{
    content: " ";
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #D8D8D8;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    box-sizing: border-box;
}
.broadcastBody{
  display: flex;
}
.goodsImg{
  flex:0 0 4rem;
  width: 4rem;
  height: 4rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin-right:0.26666666666666666667rem;
}
.goodsImg img{
  width: 100%;
  height:100%;
}
.goodsName{
  height: 0.66666666666666666667rem;
  line-height: 0.66666666666666666667rem;
  font-size: 0.48rem;
  font-weight: 700;
  padding-top: 0.01333333333333333333rem;
}
.goodsPrice{
  display: block;
  line-height: 0.7466666666666666667rem;
  font-size: 0.32rem;
  padding-top: 0.1333333333333333333rem;
  color: #FF6648;
}
.price{
   font-size: 0.5333333333333rem;
}
.goodsDetail{
  color: #aaaaaa;
  display: block;
  line-height: 0.46rem;
  font-size: 0.32rem;
  padding-top: 0.13333333333333333333333rem;
  height: 1.32889rem;

  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-all;

}
.soldNum{
  padding-top: 0.53333333333333333rem;
  color: #aaaaaa;
  display: block;
  line-height: 0.4rem;
  font-size: 0.32rem;
}
</style>
