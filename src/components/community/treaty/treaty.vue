<template>
  <div class="commonHeader treaty">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="小区公约"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
        <a slot="right" @click="showHistory">历史版本</a>
      </x-header>
      <div style="height: 100%" v-if="commonLists.title">
        <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
          <div slot="jpull-list">
            <commonBanner :commonLists="commonLists"></commonBanner>
            <div class="commentList no-margin-top">
              <group class="commentCell" v-show="commentLists.length > 0">
                <cell-box class="commentTotal">
                  <span>共{{commentLists.length}}条建议</span>
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
              <div class="noComment" v-show="commentLists.length <= 0">
                <div>还没有人提建议</div>
                <div @click="addComment(commonLists)">
                  <img :src="currentUser.headPicName" alt="">
                  <span>拼的就是速度，抢个沙发...</span>
                </div>
              </div>
            </div>
          </div>
        </j-pull>
      </div>
      <div class="bottomLikeTab" v-if="commonLists.title">
        <div class="commentTab" @click="addComment(commonLists)">
          <i></i>
          <span>提建议</span>
        </div>
      </div>
      <div class="noContent" v-if="!commonLists.title">
        <img src="../../../assets/images/No-content.png" alt="">
        <p>什么都没发现，去别处看看吧</p>
        <!--<span @click="toPublish">去发帖</span>-->
      </div>
    </view-box>
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
  import btmTab from '../../common/btmTab'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'treaty',
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
        type: 15,
        curPage: 1,
        pageSize: 20,
        hasMore: true,
        menuOpt: {
          menu1: '回复',
          menu2: '复制'
        },
        showMenuOpt: false,
        commonLists: {},
        commentLists: [],
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 0 0 0',
          borderRadius: '20px'
        },
        commentText: '',
        showCommentField: false,
        token: localStorage.getItem('token'),
        currentUser: {}
      }
    },
    created () {
      this.getBuildDetail();
      this.getCurrentUser()
    },
    methods: {
      refreshData (loaded) {
        this.curPage = 1;
        this.commentLists = [];
        this.getBuildDetail(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getBuildDetail(loaded);
      },
      getBuildDetail (loaded) {
        let that = this;
        let params = {
          type: this.type,
          curPage: this.curPage,
          pageSize: this.pageSize
        };
        that.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/community/lastest/focusinfo?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            that.commonLists = res.data;
            if (that.commonLists) {
              let picObj = []
              if (that.commonLists.smallPic) {
                picObj.push(that.commonLists.smallPic)
                that.previewPic = that.getImgList(picObj)
                that.commonLists.previewPic = that.previewPic
              }
              console.log(111, that.commonLists)
              that.getComments(loaded, that.commonLists.focusDetailId)
            }
          }
        })
      },
      getComments (loaded, id) {
        let _this = this;
        let params = {
          neighborId: id,
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
        let type = value.type;
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
        this.showCommentField = false;
        this.commentText = ''
      },
      goToBind () {
        this.$router.push('/Login')
      },
      showHistory () {
        this.$router.push('/treatyHistory')
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
  .treaty{
    /*background-color: #ffffff;*/
    height: 100%;
    background-color: #f7f7f7;
    .noContent{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 142.5px;
      margin-bottom: 284.5px;
      img{
        width: 150px;
        height: 150px;
      }
      p{
        margin-top: 10px;
        color: #aaaaaa;
        font-size: 15px;
      }
    }
    .vux-header .vux-header-right a{
      font-size: 15px;
      color: #333333;
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
