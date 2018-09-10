<template>
  <div class="payResult">
    <div class="content">
      <img src="../assets/images/payment_icon.png" alt="">
      <p class="success">支付成功</p>
      <p class="jump" v-show="!isApp"><span>{{time}}</span>秒后将跳转至首页</p>
      <p class="jump" v-show="isApp">页面跳转中<span>{{time}}</span></p>
    </div>
  </div>
</template>
<script>
  import {JURL} from '../common/js/utils';
  export default {
    name: 'payResult',
    data () {
      return {
        time: 3,
        timer: null,
        isApp: ''
      }
    },
    created () {
      this.countDown()
    },
    methods: {
      countDown () {
        let TIME = 3
        let _this = this
        _this.isApp = JURL.getHashParam('isApp') || JURL.getSearchParam('isApp')
        if (!_this.timer) {
          _this.timer = setInterval(() => {
            if (_this.time > 0 && _this.time <= TIME) {
              _this.time--
            } else {
              clearInterval(_this.timer)
              _this.timer = null;
              if (_this.isApp) {
                _this.$router.push('/activity?out=1?isApp=1')
              } else {
                _this.$router.push('/')
              }
            }
          }, 1000)
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .payResult{
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .content{
      padding-top: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      img{
        width: 60px;
        height: 60px;
        border: none;
      }
      .success{
        font-size: 32px;
        color: #0DAB60;
        font-weight: 600;
        margin-top: 15px;
        height: 45px;
        line-height: 45px;
      }
      .jump{
        margin-top: 10px;
        font-size: 12px;
        color: #aaaaaa;
        span{
          display: inline-block;
        }
      }
    }
  }
</style>
