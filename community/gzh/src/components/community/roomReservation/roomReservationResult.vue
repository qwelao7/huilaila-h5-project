<template>
  <div class="room-reservation-result commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ showBack: false }" :title=title></x-header>

      <div class="wrapper">
        <div class="icon"></div>
        <div class="text">预约成功，我们将安排专人与您联系</div>
        <div>
          <div class="button" @click="goCommunity">回首页</div>
          <div class="button" @click="goMyOrder">我的服务</div>
        </div>
      </div>

    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader } from 'vux'
  export default {
    name: 'room-reservation-result',
    components: {
      ViewBox,
      XHeader
    },
    data () {
      return {
        title: '提交成功'
      }
    },
    methods: {
      goCommunity () {
        this.$router.push('/life')
      },
      goMyOrder () {
        this.$router.push('/myOrder')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.room-reservation-result {
  height: 100%;
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .icon {
      display: inline-block;
      width: 50px;
      height: 50px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      background-image: url("../../../assets/images/checked_icon_green.png");
      margin: 50px 0 20px 0;
    }
    .text {
      font-size: 18px;
      color: #333333;
      margin-bottom: 40px;
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
    }
  }
}
</style>
