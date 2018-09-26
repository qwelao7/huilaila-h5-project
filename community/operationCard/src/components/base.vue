<template>
  <div class="base">
    <span class="title nowrap">{{ data.title }}</span>
    <span class="subTitle nowrap" v-show='data.subTitle'>{{ data.subTitle }}</span>
    <span class="thirdLine nowrap" v-show='data.thirdLine'>{{ data.thirdLine }}</span>
    <span class="thirdLine nowrap" v-show='data.fourthLine'>{{ data.fourthLine }}</span>
    <div class='card-buttom'>
      <div class="card-buttom-left">
        <span>{{ data.cardName }}</span>
        <span class='subline'></span>
        <span>{{ data.timeStr }}</span>
      </div>
      <span class='cardbtn' v-show='data.btnName'>{{ data.btnName}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bases',
  props: {
    data: {
      type: Object,
      default () {
        return [];
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.base {
  padding: 0.5333333333333333rem 0.4rem 0.4rem;
  position: relative;
}
.base::after{
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
.title{
  height: 0.66666666666666666667rem;
  line-height: 0.66666666666666666667rem;
  font-size: 0.48rem;
  font-weight: 700;
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
