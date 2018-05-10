<template>
  <div class="payResult">
    <div class="content">
      <img src="../assets/images/payment_icon.png" alt="">
      <p class="success">支付成功</p>
      <p class="jump"><span>{{time}}</span>秒后将跳转至首页</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'payResult',
    data () {
      return {
        time: 3,
        timer: null
      }
    },
    created () {
      this.countDown()
    },
    methods: {
      countDown () {
        let TIME = 3
//        let countNum = 3;
        if (!this.timer) {
          this.timer = setInterval(() => {
            if (this.time > 0 && this.time <= TIME) {
              this.time--
//              this.time = this.time;
              console.log(this.time)
            } else {
              clearInterval(this.timer)
              this.timer = null;
              this.$router.push('/')
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
