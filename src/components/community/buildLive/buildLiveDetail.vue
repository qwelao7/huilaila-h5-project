<template>
  <div class="commonHeader buildLiveDetail">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="小区动态详情"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div style="height: 100%">
        <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
          <div slot="jpull-list">
            <div v-if="commonLists">
              <commonBanner :commonLists="commonLists"></commonBanner>
            </div>
            <div class="commentList no-margin-top">
              <div @click="getIsPraise(commonLists)">
                <group>
                  <cell-box class="likeList" v-show="commonLists.topicPraiseNumber" is-link>
                    <div>
                      <span style="height: 34px;line-height: 34px;">共{{commonLists.topicPraiseNumber}}人点赞</span>
                      <ul>
                        <li v-for="item in likeArr">
                          <img :src="item.headPicName" alt="">
                        </li>
                      </ul>
                    </div>
                  </cell-box>
                </group>
              </div>
              <group class="commentCell" v-show="commonLists.topicCommentNumber > 0">
                <cell-box class="commentTotal">
                  <span>共{{commonLists.topicCommentNumber}}人评论</span>
                </cell-box>
                <cell-box class="comments" v-for="(_item, index) in commentLists" :key="index">
                  <div class="left">
                    <div class="avatar" @click="toPersonPage(_item)"><img :src="_item.headPicName" alt=""></div>
                    <div class="content" @click="replyMsg(_item, index, commonLists)">
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
              <div class="noComment" v-show="commonLists.topicCommentNumber <= 0">
                <div>还没有人评论</div>
                <div @click="addComment(commonLists)">
                  <img :src="currentUser.headPicName" alt="">
                  <span>拼的就是速度，抢个沙发...</span>
                </div>
              </div>
            </div>
          </div>
        </j-pull>
      </div>
      <div class="bottomLikeTab">
        <div class="likeTab" @click="likeIt(commonLists)">
          <i :class="{like: showLike}"></i>
          <span :class="{isLike: showLike}">{{like}}</span>
        </div>
        <div class="commentTab" @click="addComment(commonLists)">
          <i></i>
          <span>评论</span>
        </div>
      </div>
    </view-box>
    <!--<div v-if="commonListReady"><commentList :commonLists="commonLists"></commentList></div>-->
    <div v-transfer-dom>
      <actionsheet :menus="menus" @on-click-menu-menu="onReport(commonLists)" v-model="showMenus" show-cancel></actionsheet>
    </div>
    <div v-transfer-dom>
      <actionsheet
        :menus="menuOpt"
        v-model="showMenuOpt"
        show-cancel
        @on-click-menu="clickMenu"></actionsheet>
    </div>
    <div v-transfer-dom>
      <popup v-model="showCommentField" height="100%" style="background-color: #ffffff">
        <div class="commentPopup">
          <x-header
            left-options.preventGoBack="true"
            title="">
            <a slot="overwrite-left" @click="close" style="color: #333333">取消</a>
            <a slot="right" @click="subComment(commonLists)">发送</a>
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
  import {XHeader, Actionsheet, Group, ViewBox, CellBox, querystring, Popup, XTextarea, TransferDom, XDialog} from 'vux'
  import commonBanner from '../buildCommonBanner'
  import commentList from '../../common/commentList'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'buildLiveDetail',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Group,
      ViewBox,
      CellBox,
      commonBanner,
      commentList,
      Actionsheet,
      XTextarea,
      Popup,
      XDialog,
      JPull
    },
    data () {
      return {
        menus: {
          menu: '举报'
        },
        menuOpt: {
          menu1: '回复',
          menu2: '复制'
        },
        showMenuOpt: false,
        likeArr: [],
        showMenus: false,
        commonLists: {
          type1: ''
        },
        showLike: false,
        like: '',
        isLike: '',
        showCommentField: false,
        commentText: '',
        curPage: 1,
        pageSize: 20,
        hasMore: true,
        commentLists: [],
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 0 0 0',
          borderRadius: '20px'
        },
        token: localStorage.getItem('token'),
        currentUser: {},
        previewPic: []
      }
    },
    created () {
      this.getBuildDetail();
      this.getComments();
      this.getCurrentUser()
    },
    methods: {
      getBuildDetail (loaded) {
        this.$vux.loading.show({
          text: '加载中'
        });
        let that = this;
        that.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/focusInfo/focusDetail?fid=' + that.$route.params.id
        }).then(res => {
          console.log(res, '??????????');
          if (loaded) {
            loaded()
          }
          if (res.status === 100) {
            this.$vux.loading.hide();
            that.commonLists = res.data;
            that.commonLists.type1 = 'buildLive';
            let isPraise = this.commonLists.isPraise;
            this.showLike = !this.showLike;
            if (isPraise === 0) {
              that.like = '点赞';
              that.showLike = false;
            } else {
              that.like = '已赞';
              that.showLike = true;
            }
            that.likeArr = this.commonLists.praises;
            let picObj = []
            if (that.commonLists.smallPic) {
              picObj.push(that.commonLists.smallPic)
              that.previewPic = that.getImgList(picObj)
              that.commonLists.previewPic = that.previewPic
            }
          } else {
            that.$vux.loading.hide()
          }
        })
      },
      getComments (loaded) {
        let neighborId = this.$route.params;
        let _this = this;
        let params = {
          neighborId: neighborId.id,
          curPage: this.curPage,
          pageSize: this.pageSize
        };
        console.log(neighborId);
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
      addComment (value) {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          this.messageId = '';
          this.topic = value;
          this.showCommentField = true
        }
      },
      subComment (value) {
        let type;
        if (value.type1 === 'buildLive') {
          type = 7
        } else if (value.type1 === 'announcement') {
          type = 10
        } else if (value.type1 === 'survey') {
          type = 3
        } else if (value.type1 === 'project') {
          type = 8
        }
        if (!this.commentText.trim()) {
          this.$vux.toast.show({
            type: 'text',
            text: '发送的内容不能空'
          });
        } else {
          let params = {
            neighborId: value.focusDetailId,
            messageId: this.messageId,
            message: this.commentText,
            type: type
          };
          this.$JHttp({
            method: 'post',
            url: window.baseURL + '/neighbor/addComment?' + querystring.stringify(params),
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            if (res.status === 100) {
              this.$vux.toast.show({
                type: 'success',
                text: '评论成功'
              });
              this.commentLists.unshift(res.data);
              this.topic.topicCommentNumber = this.topic.topicCommentNumber + 1;
              this.commentText = '';
              this.showCommentField = false
            }
          }).catch(e => {
            console.log(e)
          })
        }
      },
      clickMenu (key, item) {
        console.log(key, item);
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
                this.curTopic.topicCommentNumber = this.curTopic.topicCommentNumber - 1;
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
      replyMsg (value, index, item) {
        this.messageId = value.messageId;
        this.curTopic = item;
        this.msgIndex = index;
        this.copyMsg = value.msgContent;
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
      likeIt (value) {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          let type;
          if (value.type1 === 'buildLive') {
            type = 5
          } else if (value.type1 === 'announcement') {
            type = 5
          } else if (value.type1 === 'project') {
            type = 5
          } else if (value.type === 'survey') {
            type = 6
          }
          let _this = this;
          let userId = localStorage.getItem('userId');
          let neighborId = value.focusDetailId;
          this.isLike = value.isPraise;
          if (this.isLike === 0) {
            this.showLike = true;
            // 点赞
            let params = {
              neighborId: neighborId,
              type: type
            };
            this.$JHttp({
              method: 'post',
              url: window.baseURL + '/neighbor/addPraise?' + querystring.stringify(params)
            }).then(res => {
              console.log('点赞', res);
              if (res.status === 100) {
                this.commonLists.isPraise = 1;
                _this.commonLists.topicPraiseNumber = _this.commonLists.topicPraiseNumber + 1;
                this.like = '已赞';
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
            this.showLike = false;
            let params = {
              neighborId: neighborId
            };
            this.$JHttp({
              method: 'put',
              url: window.baseURL + '/neighbor/cancelPraise?' + querystring.stringify(params)
            }).then(res => {
              if (res.status === 100) {
                console.log('取消点赞', res);
                value.isPraise = 0;
                _this.commonLists.topicPraiseNumber = _this.commonLists.topicPraiseNumber - 1;
                this.like = '点赞';
                let cancelIndex;
                _this.likeArr.forEach((res, index) => {
                  if (res.userId === userId) {
                    cancelIndex = index;
                  }
                });
                _this.likeArr.splice(cancelIndex, 1)
              }
            }).catch(e => {
              console.log(e)
            })
          }
        }
      },
      getIsPraise (id) {
        this.$router.push('/likePeopleList/' + id.focusDetailId)
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
      close () {
        console.log('close')
        this.showCommentField = false;
        this.commentText = ''
      },
      refreshData (loaded) {
        this.curPage = 1;
        this.commentLists = [];
        this.getBuildDetail(loaded);
        this.getComments(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getComments(loaded);
      },
      goToBind () {
        this.$router.push('/Login')
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
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .buildLiveDetail{
    height: 100%;
    background-color: #f7f7f7;
    .padding{
      padding: 0 15px;
    }
    .title{
      margin-bottom: 10px;
      font-size: 24px;
      color: #333333;
      font-weight: bold;
    }
    .time{
      font-size: 12px;
      color: #aaaaaa;
      margin-bottom: 15px;
    }
    .image{
      height: 4.34rem;
      margin-bottom: 15px;
    }
    .description{
      font-size: 14px;
      /*font-weight: bold;*/
      color: #333333;
      line-height: 2;
      padding-bottom: 20px;
      p{
        text-indent: 2em;
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
          position: relative;
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
            position: absolute;
            right:20px;
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

