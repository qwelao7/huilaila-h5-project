<template>
  <div class="detailBanner">
    <h1 class="tit">{{detailObj.title}}</h1>
    <div class="pubTime">
      <span>{{detailObj.pubTime}}</span>
      <span>{{detailObj.endTime}}</span>
    </div>
    <div class="bannerImg">
      <img :src="detailObj.bannerPic" alt="">
      <div class="activityReq">
        <p v-html="detailObj.body"></p>
      </div>
    </div>
    <group>
      <cell-box link="/signUp" class="banner signUp" v-show="isActivity">
        <i></i>
        <span>正在报名</span>
      </cell-box>
      <cell-box link="/vote" class="banner vote" v-show="isVote" :class="{voted: isVoted}">
        <i></i>
        <span v-show="!isVote">正在投票</span>
        <span v-show="isVote">查看投票结果</span>
      </cell-box>
    </group>
  </div>
</template>
<script>
  import { Group, CellBox } from 'vux'
  export default {
    name: 'detailBanner',
    components: {
      Group,
      CellBox
    },
    props: {
      pageData: {
        type: Object,
        default: {}
      }
    },
    created () {
      //
      console.log(222, this.pageData)
      this.getData()
    },
    data () {
      return {
        isVote: false,
        isVoted: true,
        isActivity: false,
        detailObj: {}
      }
    },
    methods: {
      getData () {
        this.detailObj = this.pageData;
        if (this.detailObj) {
          if (this.detailObj.type === 'activity') {
            console.log(1111111);
            this.isActivity = true
          }
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .detailBanner{
    background-color: #ffffff;
    padding: 10px 0;
    .tit{
      font-size: 24px;
      color: #333333;
      padding: 0 15px;
    }
    .pubTime{
      margin-top: 10px;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span{
        font-size: 12px;
        color: #aaaaaa;
      }
    }
    .bannerImg{
      margin-top: 15px;
      .activityReq{
        margin-top: 15px;
        padding: 0 15px;
        p{
          font-size: 18px;
          color: #333333;
        }
      }
    }
    .banner{
      background-color: #0DAB60 ;
      justify-content: center;
      color: #ffffff;
      padding: 16px 15px;
      i{
        width: 28px;
        height: 28px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
      }
      span{
        font-size: 15px;
        color: #ffffff;
        margin-left: 10px;
      }
    }
    .signUp i{
      background-image: url("../../assets/images/enroll_icon_56white.png");
    }
    .voted{
      background-color: #aaaaaa;
    }
    .vote i{
      background-image: url("../../assets/images/vote_icon_56white.png");
    }
  }
</style>
