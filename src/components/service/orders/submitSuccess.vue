<template>
  <div class="commonHeader submitSuccess">
    <x-header :title="title" :left-options="{showBack: false}"></x-header>
    <div class="successBanner">
      <div class="iconBox box">
        <img src="../../../assets/images/paid_icon_over.png" alt="">
      </div>
      <div class="textBox box">
        <span>您的订单已提交成功</span>
        <div class="fromPay" v-show="isFromPayType">
          <span>实付金额：</span>
          <span>¥{{payMoney.int + payMoney.float}}</span>
        </div>
      </div>
      <div class="btnBox box">
        <span @click="backToHome">回首页</span>
        <span @click="toMyOrder">我的服务</span>
      </div>
    </div>
  </div>
</template>
<script>
  import { XHeader } from 'vux'
  export default {
    name: 'submitSuccess',
    components: {
      XHeader
    },
    data () {
      return {
        title: '提交成功',
        desText: '您的订单已提交成功',
        payMoney: {
          int: '',
          float: ''
        },
        isFromPayType: false
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (from.path.indexOf('/selectPayType') !== -1) {
          vm.title = '支付成功';
          vm.desText = '付款成功';
          vm.isFromPayType = true
          next()
        }
      })
    },
    created () {
      let payMoneys = parseFloat(this.$route.query.payMoney).toFixed(2).split('.')
      this.payMoney = {
        int: payMoneys[0],
        float: '.' + payMoneys[1]
      }
    },
    methods: {
      backToHome () {
        this.$router.push('/service')
      },
      toMyOrder () {
        this.$router.push('/myOrder')
      }
    }
  }
</script>
<style type="text/less" scoped lang="less">
  .submitSuccess{
    height: 100%;
    background-color: #ffffff;
    .successBanner{
      padding-top: 50px;
      .box{
        margin: 0 auto;
      }
      .iconBox{
        width: 50px;
        height: 50px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .textBox{
        margin-top: 20px;
        text-align: center;
        span{
          font-size: 18px;
        }
        .fromPay{
          display: flex;
          align-items: center;
          justify-content: center;
          span{
            font-size: 12px;
          }
        }
      }
      .btnBox{
        margin-top: 40px;
        padding: 0 55px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span{
          width: 123px;
          height: 33px;
          line-height: 33px;
          text-align: center;
          font-size: 15px;
          border: 1px solid #FF6648;
          color: #FF6648;
          border-radius: 100px;
        }
      }
    }
  }
</style>
