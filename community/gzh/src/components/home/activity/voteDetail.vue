<template>
  <div class="voteDetail commonHeader">
    <x-header
      :left-options="{backText: ''}" title="调查投票">
    </x-header>
    <!--<div v-if="detailObj !== {}"><detailBanner :pageData="detailObj"></detailBanner></div>-->
    <div class="detailBanner">
      <h1 class="tit">{{detailObj.activityName}}</h1>
      <div class="pubTime">
        <span>{{detailObj.inTimeTag}}</span>
        <span>{{detailObj.endTimeTag}}</span>
      </div>
      <div class="bannerImg">
        <!--<img :src="detailObj.bannerPic" alt="">-->
        <div class="imgList">
          <ul>
            <li v-for="(item, index) in imgList" v-bind:class="{ onePic: isOne, twoPic: isTwo}">
              <img class="previewer-demo-img" :src="item.src" alt="" @click="show(index)">
            </li>
          </ul>
          <div v-transfer-dom v-if="imgList">
            <previewer :list="imgList" ref="previewer" :options="options"></previewer>
          </div>
        </div>
        <div class="activityReq">
          <p v-html="detailObj.body"></p>
        </div>
      </div>
      <group>
        <cell-box link="/signUp" class="banner signUp" v-show="showSignBtn">
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
    <!--<div><commentList></commentList></div>-->
    <div class="commentList no-margin-top">
      <group>
        <cell-box link="/likePeopleList" class="likeList" v-show="likeArr.length">
          <div>
            <span>共{{detailObj.praiseNumber}}人点赞</span>
            <ul>
              <li v-for="item in likeArr"><img :src="item.headPicName" alt=""></li>
            </ul>
          </div>
        </cell-box>
      </group>
      <group class="commentCell">
        <cell-box class="commentTotal">
          <span>共{{detailObj.commentNumber}}人评论</span>
        </cell-box>
        <cell-box class="comments" v-for="(_item, index) in detailObj.comments" :key="index">
          <div class="left">
            <div class="avatar"><img :src="_item.headPicName" alt=""></div>
            <div class="content">
              <span>{{_item.userName}}</span>
              <span>{{_item.msgContent}}</span>
            </div>
          </div>
          <div class="time">
            <span>{{_item.inTimeTag}}</span>
          </div>
        </cell-box>
      </group>
    </div>
    <div class="bottomLikeTab">
      <div class="likeTab" @click="likeIt(detailObj)">
        <i :class="{like: detailObj.isPraise === 1}"></i>
        <span>{{likeWords}}</span>
      </div>
      <div class="commentTab">
        <i></i>
        <span>评论</span>
      </div>
    </div>
    <!--<div><btmTab></btmTab></div>-->
  </div>
</template>
<script>
  import detailBanner from '../../common/detailBanner'
  import commentList from '../../common/commentList'
  import btmTab from '../../common/btmTab'
  import { XHeader, Actionsheet, TransferDom, Previewer, Group, CellBox, querystring } from 'vux'

  export default {
    name: 'activityDetail',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Actionsheet,
      detailBanner,
      commentList,
      btmTab,
      Previewer,
      Group,
      CellBox
    },
    data () {
      return {
        imgList: [],
        likeArr: [],
        isVote: false,
        isVoted: true,
        isOne: false,
        isTwo: false,
        likeWords: '点赞',
        isLike: '',
        detailObj: {},
        options: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index];
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect();
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      }
    },
    created () {
      this.getActivityData()
    },
    computed: {
      showSignBtn () {
        let status = this.detailObj.activityStatus;
        let show;
        if (status) {
          if (status === 1) {
            show = true
          } else {
            show = false
          }
          return show
        }
      }
    },
    methods: {
      getActivityData () {
        this.$vux.loading.show({
          text: '加载中'
        });
        let params = {
          voteId: this.$route.params.id,
          defCommunityId: localStorage.getItem('communityId'),
          companyCode: window.commonConfig.companyCode
        };
        let _this = this;
        this.$JHttp({
          method: 'get',
          url: 'http://192.168.20.14:6090/scVoteAction!getPaper.action?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            this.$vux.loading.hide();
            _this.detailObj = res.data;
            _this.detailObj.type = 'activity';
            console.log('huodong ,', _this.detailObj);
            _this.imgList = _this.getImgList(this.detailObj.headPictures);
            if (_this.imgList) {
              let length = _this.imgList.length;
              if (length === 1) {
                _this.isOne = true
              } else if (length === 2) {
                _this.isTwo = true
              }
            }
            if (_this.detailObj.isPraise === 0) {
              this.likeWords = '点赞';
            } else {
              this.likeWords = '已赞';
            }
            _this.likeArr = _this.detailObj.praises;
          } else {
            this.$vux.loading.hide();
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {})
      },
      likeIt (value) {
        let _this = this;
        let neighborId = value.activityId;
        let type;
        if (value.type === 'newThing') {
          type = 0
        } else if (value.type === 'activity') {
          type = 4
        }
        this.isLike = value.isPraise;
        if (this.isLike === 0) {
          // 点赞
          let params = {
            neighborId: neighborId,
            type: type
          };
          this.$JHttp({
            method: 'post',
            url: window.baseURL + '/neighbor/addPraise?' + querystring.stringify(params),
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            console.log('点赞', res);
            if (res.status === 100) {
              value.isPraise = 1;
              value.praiseNumber = value.praiseNumber + 1;
              this.likeWords = '已赞';
              let obj = {headPicName: res.data.headPicName};
              _this.likeArr.push(obj);
            }
          }).catch(e => {})
        } else {
          let params = {
            neighborId: neighborId
          };
          this.$JHttp({
            method: 'put',
            url: window.baseURL + '/neighbor/cancelPraise?' + querystring.stringify(params),
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            console.log('取消点赞', res);
            value.isPraise = 0;
            value.praiseNumber = value.praiseNumber - 1;
            this.likeWords = '点赞';
            _this.likeArr.pop()
          }).catch(e => {})
        }
      },
      getImgList (val) {
        let obj1 = {};
        let arr = [];
        val.forEach(res => {
          obj1 = {
            src: res
          };
          arr.push(obj1)
        });
        return arr
      },
      show (index) {
        this.$refs.previewer.show(index)
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .voteDetail{
    background-color: #f7f7fa;
    margin-bottom: 53px;
    .detailBanner{
      background-color: #ffffff;
      padding: 10px 0;
      .tit{
        font-size: 24px;
        color: #333333;
        padding: 0 .3rem;
      }
      .pubTime{
        margin-top: 10px;
        padding: 0 .3rem;
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
          padding: 0 .3rem;
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
        background-image: url("../../../assets/images/enroll_icon_56white.png");
      }
      .voted{
        background-color: #aaaaaa;
      }
      .vote i{
        background-image: url("../../../assets/images/vote_icon_56white.png");
      }
    }
    .commentList{
      margin-top: 10px;
      background-color: #ffffff;
      .likeList{
        div{
          display: flex;
          align-items: center;
          span{
            font-size: 15px;
            color: #aaaaaa;
          }
          ul{
            display: flex;
            align-items: center;
            li:first-child{
              margin-left: 0;
            }
            li{
              width: 26px;
              height: 26px;
              border: 4px solid #ffffff;
              margin-left: -9px;
              border-radius: 50%;
              img{
                border-radius: 50%;
              }
            }
          }
        }
      }
      .commentCell{
        .commentTotal{
          font-size: 15px;
          color: #aaaaaa;
        }
        .comments{
          justify-content: space-between;
          .left{
            flex: 1;
            display: flex;
            align-items: center;
            .avatar{
              width: 40px;
              height: 40px;
              border-radius: 50%;
              img{
                border-radius: 50%;
              }
            }
            .content{
              flex: 1;
              margin-left: 15px;
              font-size: 12px;
              span:last-child{
                margin-top: 5px;
                font-size: 15px;
              }
            }
          }
          .time{
            margin-left: 5px;
            color: #aaaaaa;
            font-size: 12px;
          }
        }
      }
    }
    .bottomLikeTab {
      width: 100%;
      max-width: 750px;
      z-index: 500;
      padding: 11px 0;
      background-color: #fafafa;
      display: flex;
      align-items: center;
      justify-content: space-around;
      position: fixed;
      bottom: 0;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0.5;
        font-size: 12px;
        i {
          width: 28px;
          height: 28px;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        span{
          margin-left: 10px;
        }
        .isLike{
          color: #FF6565;
        }
      }
      .likeTab{
        border-right: 0.5px solid #D8D8D8;
        i{
          background-image: url("../../../assets/images/like_icon_56black.png");
        }
        .like{
          background-image: url("../../../assets/images/liked_icon_56red.png");
        }
      }
      .commentTab{
        i{
          background-image: url("../../../assets/images/comment_icon_56black.png");
        }
      }
    }
  }
</style>
