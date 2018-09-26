<template>
  <div class="order">
    <div class="title">
      <span class="nowrap">{{ data.title }}</span>
      <dots v-show="data.ignore" @remove='igremove'></dots>
    </div>
    <div class="orderBody space">
      <div class="productImg" v-show="data.picture">
        <img :src="data.picture"/> 
      </div>
      <div class="orderinfo">
        <span class="subTitle  nowrap"  v-show='data.subTitle'>{{ data.subTitle }}</span>
        <span class="thirdLine nowrap" v-show='data.thirdLine'>{{ data.thirdLine }}</span>
        <span class="thirdLine nowrap" v-show='data.fourthLine'>{{ data.fourthLine }}</span>
      </div>
    </div>
    <div class='card-buttom space'>
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
import dotdotdot from './dotdotdot.vue';
import { remove } from '../common/ignore.js';
export default {
  name: 'order',
  components: {
    'dots': dotdotdot
  },
  props: {
    data: {
      type: Object,
      default () {
        return [];
      }
    }
  },
  methods: {
    igremove: function () {
      remove(this);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.order {
  padding: 0.5333333333333333rem 0 0.4rem 0.4rem;
  /*border: 1px solid #d8d8d8;*/
   position:relative;
}
.order::after{
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
    z-index: -11;
}
.orderBody{
  display: flex;
  padding-top: 0.2133333333333333333rem;
}
.productImg{
  width:1.86666666666666666666667rem;
  flex:0 0 1.86666666666666666666667rem;
  height: 1.86666666666666666666667rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-right: 0.2666666666666666666667rem;
}
.productImg img{
  width: 100%;
  height: 100%;
}
.title{
  height: 0.66666666666666666667rem;
  line-height: 0.66666666666666666667rem;
  font-size: 0.48rem;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
}
.subTitle{
  height: 0.44rem;
  line-height: 0.44rem;
  font-size: 0.32rem;
  padding-top: 0.21333333333333333333rem;
}
.thirdLine{
  color: #aaaaaa;
  height: 0.4rem;
  line-height: 0.4rem;
  font-size: 0.32rem;
  padding-top: 0.13333333333333333333333rem;
}
</style>
