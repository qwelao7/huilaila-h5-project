<template>
  <div class="QRcode">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      style="background-color: transparent">
      <!--<a slot="right">取消报名</a>-->
    </x-header>
    <div class="banner">
      <div class="head">
        <p>活动凭证</p>
        <p>-绿漫实验园-</p>
      </div>
      <div class="qrCard">
        <div class="name">
          <span>阮怡雯 </span>
          <span>18723691522</span>
        </div>
        <div class="qrPic">
          <span>217-551-061</span>
          <img src="" alt="">
        </div>
        <ul>
          <li>
            <span>活动名称：</span>
            <span>第三届小区邻里摄影大赛开始啦</span>
          </li>
          <li>
            <span>活动地点：</span>
            <span>体育馆</span>
          </li>
          <li>
            <span>活动时间：</span>
            <span>明天下午</span>
          </li>
          <li>
            <span>参与项目：</span>
            <span>人物摄影</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import { XHeader, XButton } from 'vux'
  export default {
    components: {
      XHeader,
      XButton
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  .QRcode{
    background-color: rgba(0,0,0,0.6);
    height: 100%;
    position: relative;
    .banner{
      display: flex;
      flex-direction: column;
      align-items: center;
      /*padding-bottom: .53rem;*/
      .head{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: -0.4rem;
        p{
          color: #ffffff;
          font-size: 15px;
        }
        p:first-child{
          font-size: 21px;
          font-weight: bold;
        }
      }
      .qrCard{
        width: 315px;
        /*height: 8.64rem;*/
        background-color: #ffffff;
        border-radius: 10px;
        margin-top: 20px;
        /*padding: .25rem 0 .4rem 0;*/
        .name{
          display: flex;
          align-items: center;
          justify-content: space-between;
          /*padding-bottom: .34rem;*/
          padding: 12.5px 15px;
          border-bottom: 1px dashed #aaaaaa;
        }
        .qrPic{
          display: flex;
          flex-direction: column;
          align-items: center;
          /*padding: .4rem .3rem .5rem .3rem;*/
          margin-top: 20px;
          padding-bottom: 25px;
          border-bottom: 1px dashed #aaaaaa;
          span{
            margin-bottom: 15px;
          }
          img{
            width: 150px;
            height: 150px;
          }
        }
        ul{
          padding: 15px 15px 20px 15px;
          li{
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 13px;
            font-size: 12px;
          }
          li:first-child{
            margin-top: 0;
          }
        }
      }
    }
  }
</style>
