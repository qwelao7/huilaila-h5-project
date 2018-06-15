<template>
  <div class="voteDetail commonHeader">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="投票调查"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div style="height: 100%">
        <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
          <div slot="jpull-list">
            <div class="detailBanner">
              <h1 class="tit">{{detailObj.title}}</h1>
              <div class="pubTime">
                <span>{{detailObj.endTime}}</span>
              </div>
              <div class="bannerImg">
                <!--<img :src="detailObj.ico" alt="">-->
                <div class="activityReq">
                  <p v-html="detailObj.introduce"></p>
                </div>
              </div>
              <div v-show="isVote" @click="goVoteDetail">
                <group>
                  <cell-box class="banner" is-link>
                    <i></i>
                    <span>正在投票</span>
                  </cell-box>
                </group>
              </div>
              <div v-show="isResult" @click="goVoteResult">
                <group>
                  <cell-box class="banner vote" :class="{voted: isVoted}" is-link>
                    <i></i>
                    <span>查看投票结果</span>
                  </cell-box>
                </group>
              </div>
            </div>
            <!--<div><commentList></commentList></div>-->
            <div class="commentList no-margin-top">
              <div @click="getIsPraise(detailObj)">
                <cell-box class="likeList" v-show="likeArr.length" is-link>
                  <div>
                    <span>共{{praiseNumber}}人点赞</span>
                    <ul>
                      <li v-for="item in likeArr"><img :src="item.headPicName" alt=""></li>
                    </ul>
                  </div>
                </cell-box>
              </div>
              <group class="commentCell" v-show="commentLists.length > 0">
                <cell-box class="commentTotal">
                  <span>共{{commentLists.length}}人评论</span>
                </cell-box>
                <cell-box class="comments" v-for="(_item, index) in commentLists" :key="index">
                  <div class="left">
                    <div class="avatar" @click="toPersonPage(_item)"><img :src="_item.headPicName" alt=""></div>
                    <div class="content" @click="replyMsg(_item, index, commentLists)">
                      <span class="user">{{_item.userName}}</span>
                      <div class="reply">
                        <div v-show="_item.toUserId">
                          <p>回复</p>
                          <p class="user_1">{{_item.toUserName}}</p>:
                        </div>
                        <p>{{_item.msgContent}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="time">
                    <span>{{_item.inTimeTag}}</span>
                  </div>
                </cell-box>
              </group>
              <div class="noComment" v-show="commentLists.length <= 0">
                <div>还没有人评论</div>
                <div @click="addComment(commentLists)">
                  <img :src="currentUser.headPicName" alt="">
                  <span>拼的就是速度，抢个沙发...</span>
                </div>
              </div>
            </div>
          </div>
        </j-pull>
      </div>
      <div class="bottomLikeTab">
        <div class="likeTab" @click="likeIt(detailObj)">
          <i :class="{like: showLike}"></i>
          <span>{{likeWords}}</span>
        </div>
        <div class="commentTab" @click="addComment(commentLists)">
          <i></i>
          <span>评论</span>
        </div>
      </div>
    </view-box>
    <div v-transfer-dom>
      <actionsheet
        :menus="menuOpt"
        v-model="showMenuOpt"
        show-cancel
        @on-click-menu="clickMenu"
        @on-click-menu-cancel="clickCancelAndMask"
        @on-click-mask="clickCancelAndMask"></actionsheet>
    </div>
    <div v-transfer-dom>
      <popup v-model="showCommentField" height="100%" style="background-color: #ffffff">
        <div class="commentPopup">
          <x-header
            left-options.preventGoBack="true"
            title="">
            <a slot="overwrite-left" @click="showCommentField = false" style="color: #333333">取消</a>
            <a slot="right" @click="subComment(detailObj)">发送</a>
          </x-header>
          <group>
            <x-textarea :max="500" v-model="commentText" class="commentField" placeholder="说点什么吧" :show-counter="false" :rows="1" autosize></x-textarea>
          </group>
        </div>
      </popup>
    </div>
    <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
      <span class="delete-info vux-1px-b">您尚未绑定手机号</span>
      <div class="operate-wrapper">
        <span class="text vux-1px-r" @click="deleteModalShow = false">以后再说</span>
        <span class="text" @click="goToBind">前往绑定</span>
      </div>
    </x-dialog>
  </div>
</template>
<script>
  import detailBanner from '../../common/detailBanner'
  import commentList from '../../common/commentList'
  import btmTab from '../../common/btmTab'
  import JPull from '../../base/JPull/JPull'
  import { XHeader, Actionsheet, Popup, TransferDom, XTextarea, Previewer, Group, CellBox, querystring, XDialog, ViewBox } from 'vux'

  export default {
    name: 'activityDetail',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      XTextarea,
      Actionsheet,
      ViewBox,
      JPull,
      detailBanner,
      commentList,
      btmTab,
      Popup,
      Previewer,
      Group,
      XDialog,
      CellBox
    },
    data () {
      return {
        menuOpt: {
          menu1: '回复',
          menu2: '复制'
        },
        imgList: [],
        likeArr: [],
        isVote: false,
        isResult: false,
        isVoted: true,
        status: '',
        isOne: false,
        isTwo: false,
        showLike: false,
        praiseNumber: '',
        commentLists: [],
        showMenuOpt: false,
        curPage: 1,
        pageSize: 20,
        hasMore: true,
        likeWords: '',
        isLike: '',
        isPraise: '',
        messageId: '',
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 0 0 0',
          borderRadius: '20px'
        },
        token: localStorage.getItem('token'),
        detailObj: {},
        showCommentField: false,
        commentText: '',
        currentUser: {}
      }
    },
    created () {
      this.getActivityData();
      this.getComments();
      this.getCurrentUser()
    },
    methods: {
      refreshData (loaded) {
        this.curPage = 1;
        this.commentLists = [];
        this.getActivityData(loaded);
        this.getComments(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getComments(loaded);
      },
      getIsPraise (id) {
        this.$router.push('/likePeopleList/' + this.$route.params.neiId)
      },
      getActivityData (loaded) {
        this.$vux.loading.show({
          text: '加载中'
        });
        let params = {
          voteId: this.$route.params.id,
          defCommunityId: localStorage.getItem('communityId'),
          companyCode: window.commonConfig.companyCode,
          token: localStorage.getItem('token')
//          mobiletype: '17'
        };
        let _this = this;
        let status = '';
        _this.$JHttp({
          method: 'get',
          url: window.oldBaseURL + '/scVoteAction!exsitsRecord.action?' + querystring.stringify(params)
        }).then(res => {
          if (loaded) {
            loaded()
          }
          if (res.status === '100') {
            _this.status = res.data.exists;
            status = _this.status;
            this.$JHttp({
              method: 'get',
              url: window.oldBaseURL + '/scVoteAction!getPaper.action?' + querystring.stringify(params)
            }).then(res => {
              if (res.status === '100') {
                this.$vux.loading.hide();
                _this.detailObj = res.data;
                let nowTime = new Date().getTime();
                let voteEndTime = new Date(_this.detailObj.endTime.replace(new RegExp('-', 'gm'), '/')).getTime();
                // 判断是否过期
                if (nowTime < voteEndTime) {
                  _this.isVote = true;
                  _this.isResult = false;
                  if (status === '0') {
                    _this.isVote = true;
                    _this.isResult = false;
                  } else {
                    _this.isVote = false;
                    _this.isResult = true;
                  }
                } else {
                  // 判断用户是否投过票
                  _this.isVote = false;
                  _this.isResult = true;
                }
                _this.detailObj.type = 'survey';
              } else {
                this.$vux.loading.hide();
                this.$vux.toast.show({
                  type: 'cancel',
                  text: res.msg
                })
              }
            }).catch(e => {
              this.$vux.loading.hide();
            });
          } else {
            this.$vux.loading.hide();
          }
        }).catch(err => {
          console.log(err);
          this.$vux.loading.hide();
        });
        // 判断是否已经点赞
        _this.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/neighbor/topic/praiseStatus?neighborId=' + this.$route.params.neiId
        }).then(res => {
          _this.isPraise = res.data;
          this.like = !this.like;
          if (_this.isPraise === 0) {
            this.likeWords = '点赞';
            this.showLike = false;
          } else {
            this.likeWords = '已赞';
            this.showLike = true;
          }
        }).catch(err => {
          console.log(err);
        });
        //  点赞列表
        let neighborId = this.$route.params.neiId;
        let that = this;
        that.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/neighbor/topic/praiseList?neighborId=' + neighborId + '&curPage=1&pageSize=10'
        }).then(v => {
          that.likeArr = v.data.resultList;
        }).catch(err => {
          console.log(err);
        });
        //  点赞人数
        that.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/neighbor/topic/praiseNumber?neighborId=' + this.$route.params.neiId
        }).then(res => {
          that.praiseNumber = res.data;
        }).catch(err => {
          console.log(err);
        });
      },
      getComments (loaded) {
        let neighborId = this.$route.params.neiId;
        let _this = this;
        let params = {
          neighborId: neighborId,
          curPage: this.curPage,
          pageSize: this.pageSize
        };
        _this.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/neighbor/topic/commentList?' + querystring.stringify(params)
        }).then(v => {
          if (loaded) {
            loaded(_this.hasMore)
          }
          if (v.status === 100) {
            let data = v.data;
            _this.hasMore = data.pageResult.hasMore;
            _this.commentLists = _this.commentLists.concat(data.resultList)
          }
        }).catch(err => {
          console.log(err);
        });
      },
      getCurrentUser () {
        let _this = this;
        let userId = {
          userId: localStorage.getItem('userId')
        }
        console.log(userId)
        _this.$JHttp({
          methods: 'get',
          url: window.baseURL + '/neighbor/user/home?' + querystring.stringify(userId),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            _this.currentUser = res.data;
          }
        }).catch(e => {
          console.log(e)
        });
      },
      likeIt (value) {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          let _this = this;
          let userId = localStorage.getItem('userId');
          let neighborId = this.$route.params.neiId;
          _this.isLike = _this.isPraise;
          console.log(_this.isPraise, '点赞按钮');
          if (_this.isLike === 0) {
            // 点赞
            let params = {
              neighborId: neighborId,
              type: 6
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
                _this.isPraise = 1;
                _this.showLike = true;
                _this.praiseNumber = _this.praiseNumber + 1;
                this.likeWords = '已赞';
                let obj = {headPicName: res.data.headPicName};
                _this.likeArr.unshift(obj);
                if (_this.likeArr.length > 6) {
                  _this.likeArr.splice(_this.likeArr.length - 1, 1)
                }
              }
            }).catch(e => {
              console.log(e)
            })
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
              _this.isPraise = 0;
              _this.showLike = false;
              _this.praiseNumber = _this.praiseNumber - 1;
              this.likeWords = '点赞';
              let cancelIndex;
              _this.likeArr.forEach((res, index) => {
                if (res.userId === userId) {
                  cancelIndex = index;
                }
              });
              _this.likeArr.splice(cancelIndex, 1)
            }).catch(e => {
              console.log(e)
            })
          }
        }
      },
      //  新增评论
      addComment (value) {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          this.topic = value;
          this.showCommentField = true
        }
      },
      subComment (value) {
        if (!this.commentText.trim()) {
          this.$vux.toast.show({
            type: 'text',
            text: '发送的内容不能空'
          });
        } else {
          let params = {
            neighborId: this.$route.params.neiId,
            messageId: this.messageId,
            message: this.commentText,
            type: 1
          };
          this.$JHttp({
            method: 'post',
            url: window.baseURL + '/neighbor/addComment?' + querystring.stringify(params),
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            this.$vux.toast.show({
              type: 'success',
              text: '评论成功'
            });
            if (res.status === 100) {
              this.$vux.toast.show({
                type: 'success',
                text: '评论成功'
              });
              this.commentLists.unshift(res.data);
              this.commentNumber = this.commentNumber + 1;
              this.commentText = '';
              this.showCommentField = false
            }
          }).catch(e => {
            console.log(e)
          })
        }
      },
      //   回复评论， 删除评论
      replyMsg (value, index, item) {
        this.curTopic = item;
        this.msgIndex = index;
        this.copyMsg = value.msgContent;
        this.messageId = value.messageId;
        let userId = localStorage.getItem('userId');
        if (userId === value.userId) {
          this.menuOpt = {
            menu1: '删除',
            menu2: '复制'
          }
        } else {
          this.menuOpt = {
            menu1: '回复',
            menu2: '复制'
//            menu3: '举报'
          }
        }
        this.showMenuOpt = true
      },
      clickCancelAndMask () {
        this.messageId = ''
      },
      toPersonPage (val) {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          if (val.topicType !== 8) {
            this.$router.push('/personPage/' + val.userId)
          }
        }
      },
      clickMenu (key, item) {
        if (item === '删除') {
          if (!this.token) {
            this.deleteModalShow = true;
          } else {
            let params = {
              messageId: this.messageId
            };
            this.$JHttp({
              method: 'delete',
              url: window.baseURL + '/neighbor/deleteComment?' + querystring.stringify(params),
              headers: {
                defCommunityId: localStorage.getItem('communityId')
              }
            }).then(res => {
              if (res.status === 100) {
                this.commentLists.splice(this.msgIndex, 1);
                this.commentNumber = this.commentNumber - 1;
                this.$vux.toast.show({
                  type: 'success',
                  text: '删除成功'
                });
              }
            }).catch(e => {
              console.log(e)
            })
          }
        } else if (item === '回复') {
          if (!this.token) {
            this.deleteModalShow = true;
          } else {
            this.topic = this.curTopic;
            this.showCommentField = true;
          }
        } else if (item === '复制') {
          //
          this.$copyText(this.copyMsg).then(res => {
            this.$vux.toast.show({
              type: 'success',
              text: '复制成功'
            });
          }, err => {
            this.$vux.toast.show({
              type: 'cancel',
              text: '复制失败'
            });
            console.log(err)
          })
        } else if (item === '举报') {
          // todo 举报待定
        }
      },
      goVoteDetail () {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          if (this.status === '0') {
            this.$router.push('/voteSelect/' + this.$route.params.id)
          } else if (this.status === '1') {
            this.$router.push('/voteResult/' + this.$route.params.id)
          }
        }
      },
      goVoteResult () {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          this.$router.push('/voteResult/' + this.$route.params.id)
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
      goToBind () {
        this.$router.push('/Login')
      },
      bindSoon () {
        this.deleteModalShow = false;
        this.$router.go(-1)
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .voteDetail{
    height: 100%;
    background-color: #f7f7fa;
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
          background-image: url("../../../assets/images/vote_icon_56white.png");
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
                width: 100%;
                height: 100%;
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
          align-items: flex-start;
          .left{
            flex: 1;
            display: flex;
            align-items: flex-start;
            .avatar{
              width: 40px;
              height: 40px;
              border-radius: 50%;
              img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
            .content{
              flex: 1;
              margin-left: 15px;
              .user{
                font-size: 12px;
                margin-bottom: .05rem;
              }
              div, p {
                display: inline;
                font-size: 15px;
                word-break:break-all;
                word-wrap:break-word
              }
              .user_1{
                color: #0DAB60;
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
    .noComment{
      padding: 0 .3rem .3rem .3rem;
      div:first-child{
        padding: .3rem 0 .4rem 0;
        border-bottom: 0.5px solid #D8D8D8;
        font-size: 14px;
        color: #000000;
      }
      div:last-child{
        padding-top: .3rem;
        display: flex;
        align-items: center;
        img{
          width: 40px;
          height: 42px;
          border-radius: 50%;
        }
        span{
          flex: 1;
          font-size: 12px;
          color: #aaaaaa;
          margin-left: .3rem;
          background-color: #f7f7f7;
          border-radius: 100px;
          padding: .2rem .4rem;
        }
      }
    }
    .delete-wrapper {
      .delete-info {
        color: #333;
        font-size: 14px;
        font-weight: bold;
        display: inline-block;
        width: 100%;
        padding-bottom: 20px;
      }
      .operate-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        .text {
          display: inline-block;
          width: 50%;
          height: 100%;
          line-height: 50px;
          color: #18adfb;
          font-size: 16px;
        }
      }
    }
  }
</style>
