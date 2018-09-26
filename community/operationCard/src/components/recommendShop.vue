<template>
  <div class="recommend-shop">
    <div class="body">
      <div class="picture">
        <img :src="data.picture" />
      </div>
      <div class="info">
        <span class="shopName nowrap">{{ data.title }}</span>
        <span class="score">
          <span class="star" :class="handleStar(data.subTitle)"></span>
          <span class="number">{{ data.subTitle }}</span>
        </span>
        <span class="shopDetail" v-show='data.thirdLine'>{{ data.thirdLine }}</span>
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
  name: 'recommend-shop',
  props: {
    data: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  methods: {
    handleStar (score) {
      let _score = Math.floor(score);
      return 'star-' + _score;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.recommend-shop {
  padding: 0.4rem;
  position: relative;
}
.recommend-shop::after {
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
.body {
  display: flex;
}
.picture {
  flex:0 0 4rem;
  width: 4rem;
  height: 4rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin-right:0.26666666666666666667rem;
}
.picture img {
  width: 100%;
  height:100%;
}
.shopName {
  height: 0.66666666666666666667rem;
  line-height: 0.66666666666666666667rem;
  font-size: 0.48rem;
  font-weight: 700;
  padding-top: 0.01333333333333333333rem;
}
.score {
  display: flex;
  align-items: center;
  height: 0.4rem;
  padding-top: 0.16rem;
}
.score .star {
  display: inline-block;
  margin-right: 0.4rem;
  width: 2.56rem;
  height: 0.4rem;
  background-size: 100% 100%;
}
.score .star-0 {
  background-image: url('../assets/img/star_0@2x.png');
}
.score .star-1 {
  background-image: url('../assets/img/star_1@2x.png');
}
.score .star-2 {
  background-image: url('../assets/img/star_2@2x.png');
}
.score .star-3 {
  background-image: url('../assets/img/star_3@2x.png');
}
.score .star-4 {
  background-image: url('../assets/img/star_4@2x.png');
}
.score .star-5 {
  background-image: url('../assets/img/star_5@2x.png');
}
.score .number {
  height: 0.427rem;
  line-height: 0.44rem;
  font-size: 0.32rem;
  color: #333333;
}
.shopDetail {
  display: block;
  color: #AAAAAA;
  line-height: 0.44rem;
  font-size: 0.32rem;
  padding-top: 0.453rem;
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
</style>
