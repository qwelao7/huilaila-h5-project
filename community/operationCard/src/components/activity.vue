<template>
  <div class="activity">
    <div class="activityImg">
          <img :src="data.picture"/> 
    </div>
    <div class='activityBody'>
    <span class="title nowrap" v-show='data.title'>{{ data.title }}</span>
    <span class="sub-title nowrap-two" v-show='data.subTitle'>{{ data.subTitle }}</span>
    <div class='card-buttom'>
      <div class="card-buttom-left">
       <span>{{ data.cardName }}</span>
        <span class='subline'></span>
        <span>{{ data.timeStr }}</span>
      </div>
      <span class='cardbtn'>{{ data.btnName}}</span>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'activity',
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
.activity {
}
.activityBody{
   padding: 0.4rem;
   position: relative;
}
.activityBody::after{
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
.activityImg{
   height: 4.026666666666666666667rem;
   background-repeat: no-repeat;
   width: 100%;
   background-size: 100% 100%;
}
.activityImg img{
    width: 100%;
    height: 100%;
}
.title{
  height: 0.66666666666666666667rem;
  line-height: 0.66666666666666666667rem;
  font-size: 0.48rem;
  font-weight: 700;
}
.sub-title {
  padding-top: 0.267rem;
  line-height: 0.56rem;
  font-size: 0.4rem;
  color: #AAAAAA;
}
</style>
