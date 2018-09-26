<template>
  <div class="enchashment-result commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="wrapper">
        <div class="top">
          <span class="icon"></span>
          <span class="text">申请提现成功！</span>
        </div>
        <div class="bottom">
          <div class="cell">
            <span class="left">微信</span>
            <span class="right" v-text="payeeAccount"></span>
          </div>
          <div class="cell">
            <span class="left">提现金额</span>
            <span class="right" v-text="'¥' + money"></span>
          </div>
          <div class="button" @click="ok">完成</div>
        </div>
      </div>

    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader } from 'vux'
  export default {
    name: 'enchashment-result',
    components: {
      ViewBox,
      XHeader
    },
    data () {
      return {
        title: '提现',
        payeeAccount: '',
        money: 0
      }
    },
    created () {
      this.payeeAccount = this.$route.query.payeeAccount
      this.money = this.$route.query.money
    },
    methods: {
      ok () {
        this.$router.push('/myWallet')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.enchashment-result {
  height: 100%;
  .wrapper {
    margin: 0 15px;
    .top {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 50px;
      .icon {
        display: inline-block;
        width: 50px;
        height: 50px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        background-image: url("../../../assets/images/checked_icon_green.png");
        margin-bottom: 20px;
      }
      .text {
        font-size: 18px;
        color: #333333;
        margin-bottom: 49px;
      }
    }
    .bottom {
      font-size: 15px;
      color: #333333;
      text-align: center;
      .cell {
        overflow: hidden;
        padding: 5px 0;
        .left {
          float: left;
          min-width: 76px;
          text-align: left;
        }
        .right {
          display: block;
          overflow: hidden;
          text-align: right;
          white-space:nowrap;
          text-overflow:ellipsis;
        }
      }
      .button {
        display: inline-block;
        font-size: 15px;
        padding: 7px 47px;
        text-align: center;
        color: #0DAB60;
        border: 1px solid #0DAB60;
        border-radius: 8px;
        background-color: #FFFFFF;
        margin-top: 40px;
      }
    }
  }
}
</style>
