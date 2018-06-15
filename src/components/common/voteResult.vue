<template>
  <div class="voteResult commonHeader">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="{backText: ''}" title="投票调查"
        style="width:100%;position:absolute;left:0;top:0;z-index:999">
      </x-header>
      <div class="detailBanner">
        <p class="tit">{{detailObj.title}}</p>
        <div class="pubTime">
          <span>{{detailObj.endTime}}</span>
        </div>
        <div class="bannerImg">
          <!--<img :src="detailObj.ico" alt="">-->
          <div class="activityReq">
            <p v-html="detailObj.introduce"></p>
          </div>
        </div>
      </div>
      <div class="vote_num">
        <i class="vote_i"></i>
        <span class="vote_Pnum">{{detailObj.joinUserCnt}}</span>
        <span class="vote_Wnum">位业主投票</span>
      </div>
      <div class="vote_result" v-for="item in radioData">
        <div>
          <p class="tit">{{item.des}}</p>
          <span class="vote_status">{{voteState}}</span>
        </div>
        <ul>
          <li v-for="data in item.options">
            <span class="option-desc">{{data.des}}</span>
            <span>{{data.percent}}</span>
            <i :style="{width: data.percent}" :class="{colorFull:data.max}"></i>
          </li>
        </ul>
      </div>
      <div class="vote_result" v-for="item in checkBoxData">
        <div>
          <p class="tit">{{item.des}}</p>
          <span class="vote_status">{{voteState}}</span>
        </div>
        <ul>
          <li v-for="data in item.options">
            <span class="option-desc">{{data.des}}</span>
            <span>{{data.percent}}</span>
            <i :style="{width: data.percent}" :class="{colorFull:data.max}"></i>
          </li>
        </ul>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {querystring, XHeader, ViewBox} from 'vux';
  export default {
    name: 'voteResult',
    components: {
      XHeader,
      ViewBox
    },
    data () {
      return {
        detailObj: {},
        radioData: [],
        checkBoxData: [],
        voteState: ''
      }
    },
    created () {
      this.getVoteInformation();
      this.getData()
    },
    methods: {
      getVoteInformation () {
        this.$vux.loading.show({
          text: '加载中'
        });
        let params = {
          voteId: this.$route.params.id,
          defCommunityId: localStorage.getItem('communityId'),
          companyCode: window.commonConfig.companyCode,
          token: localStorage.getItem('token')
        };
        let _this = this;
        _this.$JHttp({
          method: 'get',
          url: window.oldBaseURL + '/scVoteAction!exsitsRecord.action?' + querystring.stringify(params)
        }).then(res => {
          if (res.data.exists === '0') {
            _this.voteState = '未投票'
          } else {
            _this.voteState = '已投票'
          }
        }).catch(err => {
          console.log(err);
        });
      },
      getData () {
        let params = {
          voteId: this.$route.params.id,
          defCommunityId: localStorage.getItem('communityId'),
          companyCode: window.commonConfig.companyCode,
          token: localStorage.getItem('token')
        };
        let _this = this;
        _this.$JHttp({
          method: 'get',
          url: window.oldBaseURL + '/scVoteAction!getPaperResult.action?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === '100') {
            this.$vux.loading.hide();
            _this.detailObj = res.data;
            let questions = _this.detailObj.questions;
            for (let i = 0; i < questions.length; i++) {
              let option = questions[i].options;
              let arr = [];
              for (let k = 0; k < option.length; k++) {
                arr.push(option[k].percent.split('%')[0]);
              }
              questions[i].resultArr = arr;
              for (let j = 0; j < option.length; j++) {
                if (Number(option[j].percent.split('%')[0]) === Math.max(...questions[i].resultArr)) {
                  option[j].max = true
                }
              }
            }
            _this.detailObj.type = 'survey';
            questions.forEach((res) => {
              if (res.type === 1) {
                _this.radioData.push(res)
              } else if (res.type === 2) {
                _this.checkBoxData.push(res)
              }
            });
            console.log(111, this.radioData);
            console.log(222, this.checkBoxData);
            console.log(333, this.detailObj)
          } else {
            this.$vux.loading.hide();
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .voteResult{
    height: 100%;
    .vote_result{
      margin-top: 20px;
      margin-bottom: 20px;
      padding: 0 15px;
      .option-desc{
        margin-right: 20px;
        word-break: break-all;
      }
      .tit{
        font-size: 18px;
        font-weight: bold;
        margin-top: 10px;
      }
      .vote_status{
        width:100%;
        text-align: right;
        font-size:15px;
        color: #00c66c;
        margin: 5px 0 10px 0;
      }
    }
    .vote_num{
      padding: 0 15px;
      display: flex;
      align-items: center;
      .vote_i{
        display: inline-block;
        width: 28px;
        height: 28px;
        background: url("../../assets/images/vote_icon_56green.png");
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        vertical-align: middle;
      }
      .vote_Pnum{
        display: inline-block;
        color: #0DAB60;
        font-size: 12px;
        vertical-align: middle;
        margin-left: 5px;
      }
      .vote_Wnum{
        display: inline-block;
        color: #999;
        font-size: 12px;
        vertical-align: middle;
      }
    }
    ul{
      border: 0.5px solid #D8D8D8;
      li{
        box-sizing: border-box;
        width: 100%;
        padding: 15px 10px;
        border-top: 0.5px solid #D8D8D8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        span{
          font-size: 15px;
          color: #aaaaaa;
          z-index: 100;
        }
        span:first-child{
          flex: 1;
          color: #333333;
          font-size: 18px;
          margin-right: 10px;
        }
        i{
          position: absolute;
          height: 100%;
          left: 0;
          top: 0;
          background-color: #F0F0F0;
        }
        .colorFull{
          background-color: rgba(13,171,96,0.20);
        }
      }
      li:first-child{
        border-top: none;
      }
    }
    .detailBanner{
      background-color: #ffffff;
      padding: 10px 0 0;
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
        .imgList{
          margin-top: 12px;
          padding: 0 15px;
          ul{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .onePic{
              width: 100%;
            }
            .twoPic{
              width: 50%;
            }
            li{
              width: 32%;
              margin-bottom: 5px;
              margin-left: 5px;
            }
            li:nth-child(3n+1){
              margin-left: 0;
            }
          }
          img{
            width: 100%;
            height: 100%;
          }
        }
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
  }
</style>
