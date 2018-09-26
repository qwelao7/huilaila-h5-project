<template>
  <div class="secKill" ref='secKill'>
    <div class="top" >
       <div>
         <span class="title">限时秒杀</span>
         <span class="status">正在进行</span>
       </div>
       <div style="flex: 1;padding-left: 0.8rem;">
         <div class="cutTime">
           <span class="countdown">{{ day }}</span><span class="day">天</span>
           <span class="countdown">{{ hours }}</span><span class="colon">:</span>
           <span class="countdown">{{ minute }}</span><span class="colon">:</span>
           <span class="countdown">{{ second }}</span>
         </div>
          <span class="status">距离结束</span>
       </div>
       <div class="arrow">
       </div>
    </div>

  <div>
    <swiper :options="swiperOption" class="swiper-box" >    
      <swiper-slide v-for='(item,index) in data.secondKillData' :key='item.goodsName' class="killPro" @click.native.stop="jumpToGoods(item.skipData,$event)">   
        <img :src="item.image" />
        <span class="proName nowrap"><b>{{ item.goodsName }}</b></span>
        <div class="goodsPrice">
          <span><b>¥</b></span><span class="price">{{ item.price }}</span><span class="price_dec">.{{ item.price_dec }}</span>
        </div>   
        <span class="oldPrice">¥{{ item.normalPrice }}</span> 
      </swiper-slide>
    </swiper>
  </div>

  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
require('swiper/dist/css/swiper.css');
export default {
  name: 'secKill',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    data: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      swiperOption: {
        // 如果你后续需要找到当前实例化后的swiper对象以对其进行一些操作的话，可以自定义配置一个名字
        name: 'currentSwiper',
        // 所有配置均为可选（同Swiper配置）
        slidesPerView: 3,
        // paginationClickable: true,
        spaceBetween: 0.4 * window.rem,
        freeMode: true
      },
      countTime: 0,
      day: 0,
      hours: 0,
      minute: 0,
      second: 0,
      secondKillData: [],
      startTime: 0
    };
  },
  created () {
    this.secondKillData = this.data.secondKillData;
    this.secondKillData = this.newPrice(this.secondKillData);
    this.countTime = this.data.title;
    this.startTime = new Date().getTime();
    this.getDate(this.startTime);
  },
  mounted () {
    // this.getDate();
  },
  methods: {
    getDate: function (starttime) {
      let _this_ = this;
      let downTime = setInterval(function () {
        let endTime = new Date().getTime();
        let countTime = parseInt(_this_.countTime - Math.floor((endTime - starttime) / 1000));
        if (countTime >= 0) {
          let day = Math.floor(countTime / 60 / 60 / 24);
          let hours = Math.floor(countTime / 60 / 60 % 24);
          let minute = Math.floor(countTime / 60 % 60);
          let second = Math.floor(countTime % 60);
          _this_.day = day.toString().length < 2 ? '0' + day : day;
          _this_.hours = hours.toString().length < 2 ? '0' + hours : hours;
          _this_.minute = minute.toString().length < 2 ? '0' + minute : minute;
          _this_.second = second.toString().length < 2 ? '0' + second : second;
          if (day === 0 && hours === 0 && minute === 0 && second === 0) {
            window.clearInterval(downTime);
            downTime = null;
            _this_.$refs.secKill.style.display = 'none';
          }
        } else {
          window.clearInterval(downTime);
          downTime = null;
          // _this_.$refs.secKill.style.display = 'none';
        }
      }, 1000);
    },
    jumpToGoods: function (skipData, e) {
      if (window.WebViewJavascriptBridge) {
        // alert('我要跳转了');
        window.WebViewJavascriptBridge.callHandler('_app_page_jump', skipData);
      } else {
        // alert('页面跳转调用失败');
      }
    },
    newPrice: function (list) {
      list.forEach(function (x) {
        if ((x.promoPrice).toString().indexOf('.') > -1) {
          x.price = x.promoPrice.toString().split('.')[0];
          x.price_dec = x.promoPrice.toString().split('.')[1];
        } else {
          x.price = x.promoPrice;
          x.price_dec = '00';
        }
      });
      return list;
    }
  },
  watch: {
    'data.secondKillData': function (n, o) {
      this.secondKillData = this.newPrice(n);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.secKill {
  padding: 0.5333333333333333rem 0.4rem;
  position: relative;
}
.secKill::after{
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
.top{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title{
  font-size: 0.56rem;
  color: #333333;
  font-weight: 700;
}
.status{
  display: block;
  line-height: 0.44rem;
  font-size: 0.32rem;
  color: #aaaaaa;
  padding-top: 0.1333333333333333333rem;
}
.arrow{
  background-image: url('../assets/img/arrow_icon_grey@2x.png');
  width: 0.32rem;
  height: 0.42666666666666667rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;

}
.cutTime{
   display: flex;
   align-content: center;
   color: #FF6648;
   font-size: 0.48rem;
}
.cutTime span{
   text-align: center;
}
.countdown{
   background-image: url('../assets/img/countdown-bg@2x.png');
   width: 0.6666666666666666667rem;
   height: 0.6666666666666667rem;
   background-repeat: no-repeat;
   background-size: 100% 100%;
   line-height: 0.6666666666666666667rem;
}
.day{
  width: 0.4rem;
  font-size: 0.32rem;
  padding: 0 0.13333333333333333rem;
  line-height: 0.6666666666666666667rem;
  font-weight:  700;
}
.colon{
  width: 0.21333333333333rem;
  line-height: 0.6666666666666666667rem;
}

.killPro{
  width: 2.66666666666666667rem;
  padding-top: 0.53333333333333333rem;

}
.killPro img{
  width: 2.66666666666666667rem;
  height: 2.66666666666666667rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.proName{
   height: 0.44rem;
   line-height: 0.44rem;
   font-size: 0.32rem;
   color: #333333;
   margin-top: 0.4rem;
}
.goodsPrice{
  display: block;
  height: 0.66666666666667rem;
  line-height: 0.66666666666667rem;
  font-size: 0.32rem;
  color: #FF6648;
}
.price{
   font-size: 0.48rem;
}
.oldPrice{
   text-decoration:line-through;
   color: #aaaaaa;
   font-size: 0.32rem;
}
</style>
