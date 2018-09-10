<template>
  <div class="newThingsDetail commonHeader">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        :left-options="{backText: ''}"
        :right-options="{showMore: true}"
        @on-click-more="clickReportMenu(detailObj)"
        :title="title"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div style="height: 100%">
        <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
          <div slot="jpull-list">
            <div class="detailBanner">
              <div class="avatar">
                <!--<img :src="detailObj.headPicName" alt="" @click="toPersonPage(detailObj)">-->
                <j-img :osskey="detailObj.headPicName" :custom-width="40" :custom-height="42" @click.native="toPersonPage(detailObj)"></j-img>
                <div class="name" @click="toPersonPage(detailObj)">
                  <p>{{detailObj.userName}}</p>
                  <!-- <p>{{detailObj.inTimeTag}}</p>/ -->
                  <p>{{detailObj.intime}}</p>
                </div>
              </div>
              <div class="introduce">
                <p v-html="detailObj.topicContent" v-if="detailObj.isFromApp"></p>
                <p v-html="detailObj.body"></p>
              </div>
              <div class="imgList" v-if="detailObj.isFromApp">
                <ul>
                  <li v-for="(item, index) in imgList" v-bind:class="{ onePic: isOne }">
                    <!--<img class="previewer-demo-img" :src="item.src" alt="" @click="show(index)">-->
                    <j-img :osskey="item.src" :custom-class="'previewer-demo-img'" :custom-width="113" :custom-height="113" @click.native="show(index)"></j-img>
                  </li>
                </ul>
                <div v-transfer-dom v-if="imgList">
                  <previewer :list="imgList" ref="previewer" :options="options"></previewer>
                </div>
              </div>
            </div>
            <!--<div v-if="detailObj.commentsAndLike.comments.length"><commentList :comments="detailObj.commentsAndLike"></commentList></div>-->
            <div class="commentList no-margin-top">
              <group>
                <cell-box is-link class="likeList" v-show="detailObj.topicPraiseNumber" @click.native="toPraiseList(detailObj.neighborId)">
                  <div>
                    <span>共{{detailObj.topicPraiseNumber}}人点赞</span>
                    <ul>
                      <li v-for="item in likeArr"><img :src="item.headPicName" alt=""></li>
                    </ul>
                  </div>
                </cell-box>
              </group>
              <group class="commentCell" v-show="commentLists.length > 0">
                <cell-box class="commentTotal">
                  <span>共{{commentLists.length}}人评论</span>
                </cell-box>
                <cell-box class="comments" v-for="(_item, index) in commentLists" :key="index" @click.native="replyMsg(_item, index, detailObj)">
                  <div class="left">
                    <div class="avatar" @click="toPersonPage(_item)"><img :src="_item.headPicName" alt=""></div>
                    <div class="content">
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
                <div @click="addComment(detailObj)">
                  <j-img v-show="currentUser.headPicName" :osskey="currentUser.headPicName" :custom-width="40" :custom-height="42"></j-img>
                  <span>拼的就是速度，抢个沙发...</span>
                </div>
              </div>
            </div>
          </div>
          <!--<divider style="margin-top: .3rem; font-size: 12px" v-show="!hasMore">我是有底线的</divider>-->
        </j-pull>
      </div>
      <div class="bottomLikeTab">
        <div class="likeTab" @click="likeIt(detailObj)">
          <i :class="{like: detailObj.isPraise === 1}"></i>
          <span>{{likeWords}}</span>
        </div>
        <div class="commentTab" @click="addComment(detailObj)">
          <i></i>
          <span>评论</span>
        </div>
      </div>
    </view-box>
    <!--<div><btmTab :isLike="detailObj.isLike"></btmTab></div>-->
    <div v-transfer-dom>
      <actionsheet :menus="menus" @on-click-menu="onReportOrDel" v-model="showMenus" show-cancel></actionsheet>
    </div>
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
            <a slot="overwrite-left" @click="close" style="color: #333333">取消</a>
            <a slot="right" @click="subComment">发送</a>
          </x-header>
          <group>
            <x-textarea :max="500" v-model="commentText" class="commentField" placeholder="说点什么吧" :show-counter="false" :rows="1" autosize></x-textarea>
          </group>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
        <span class="delete-info vux-1px-b">您尚未绑定手机号</span>
        <div class="operate-wrapper">
          <span class="text vux-1px-r" @click="bindSoon">以后再说</span>
          <span class="text" @click="goToBind">前往绑定</span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import { XHeader, Actionsheet, ViewBox, TransferDom, Previewer, Group, CellBox, Popup, XTextarea, querystring, XDialog } from 'vux'
  import commentList from '../../common/commentList'
  import btmTab from '../../common/btmTab'
  import JPull from '../../base/JPull/JPull'
  import JImg from 'components/common/img/jImg'

  export default {
    name: 'newThingsDetail',
    directives: {
      TransferDom
    },
    components: {
      JPull,
      ViewBox,
      XHeader,
      commentList,
      btmTab,
      Actionsheet,
      Previewer,
      Group,
      CellBox,
      Popup,
      XTextarea,
      XDialog,
      'j-img': JImg
    },
    data () {
      return {
        title: '',
        menus: {},
        topic: {},
        menuOpt: {},
        showMenuOpt: false,
        messageId: '',
        msgIndex: '',
        curTopic: {},
        imgList: [],
        commentLists: [],
        likeArr: [],
        isOne: false,
        showMenus: false,
        detailObj: {},
        isLike: '',
        likeWords: '点赞',
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
        },
        showCommentField: false,
        commentText: '',
        curPage: 1,
        pageSize: 20,
        hasMore: true,
        currentUser: {},
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        }
      }
    },
    created () {
      this.getData();
      this.getComments();
      this.getCurrentUser()
    },
    methods: {
      goToBind () {
        this.$router.push('/Login')
      },
      bindSoon () {
        this.deleteModalShow = false;
      },
      refreshData (loaded) {
        this.curPage = 1;
        this.commentLists = [];
        this.getData(loaded);
        this.getComments(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getComments(loaded);
      },
      getData (loaded) {
        this.$vux.loading.show({
          text: '加载中'
        });
        let neighborId = this.$route.params;
        console.log(neighborId.neighborId, '新鲜事ID');
        let _this = this;
        this.$JHttp({
          method: 'get',
          url: window.baseURL + '/neighbor/topic/detail?' + querystring.stringify(neighborId)
        }).then(res => {
          if (loaded) {
            loaded()
          }
          if (res.status === 100) {
//            console.log(res.data);
            _this.$vux.loading.hide();
            _this.detailObj = res.data;
            _this.imgList = _this.getImgList(this.detailObj.annexs);
            _this.likeArr = _this.detailObj.praises;
            if (_this.imgList) {
              let length = _this.imgList.length;
              if (length === 1) {
                _this.isOne = true
              }
            }
            if (_this.detailObj.isPraise === 0) {
              this.likeWords = '点赞';
            } else {
              this.likeWords = '已赞';
            }
            if (_this.detailObj.topicType === 8) {
              _this.title = '社群'
            } else if (_this.detailObj.topicType === 2) {
              _this.title = '活动'
            } else {
              _this.title = _this.detailObj.topicTag
            }
          } else {
            _this.$vux.loading.hide();
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e);
          this.$vux.loading.hide();
        });
      },
      getComments (loaded) {
// 获取评论列表
        let neighborId = this.$route.params;
        let _this = this;
        let params = {
          neighborId: neighborId.neighborId,
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
//            _this.commentLists = data.resultList;
            _this.commentLists = _this.commentLists.concat(data.resultList);
            console.log(111, _this.commentLists);
          }
        }).catch(err => {
          console.log(err);
        });
      },
      getCurrentUser () {
        let _this = this;
        if (!localStorage.getItem('userId')) return;
        let userId = {
          userId: localStorage.getItem('userId')
        }
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
      onReportOrDel (key, item) {
        if (key === 'report') {
          this.$router.push('/onReport/' + this.topic.neighborId)
        } else if (key === 'delTopic') {
          let params = {
            neighborId: this.topic.neighborId
          };
          let _this = this;
          _this.$JHttp({
            method: 'put',
            url: window.baseURL + '/neighbor/deleteTopic?' + querystring.stringify(params),
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            if (res.status === 100) {
              _this.$vux.toast.show({
                type: 'success',
                text: '删除成功'
              });
              _this.$router.go(-1)
            }
          }).catch(e => {
            console.log(e)
          })
        }
      },
      replyMsg (value, index, item) {
        console.log(111, value, index, item);
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
          this.messageId = value.messageId;
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
      clickMenu (key, item) {
        console.log(key, item);
        if (item === '删除') {
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
        } else if (item === '回复') {
          this.topic = this.curTopic;
          console.log(this.curTopic, '回复');
          this.showCommentField = true;
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
      toPersonPage (val) {
        if (val.topicType !== 8) {
          this.$router.push('/personPage/' + val.userId)
        }
      },
      toPraiseList (key) {
        this.$router.push('/likePeopleList/' + key)
      },
      likeIt (value) {
        let token = localStorage.getItem('token');
        if (!token) {
          this.deleteModalShow = true
        } else {
          let _this = this;
          let userId = localStorage.getItem('userId');
          let neighborId = value.neighborId;
          this.isLike = value.isPraise;
          if (this.isLike === 0) {
            // 点赞
            let params = {
              neighborId: neighborId,
              type: 0
            };
            this.$JHttp({
              method: 'post',
              url: window.baseURL + '/neighbor/addPraise?' + querystring.stringify(params)
            }).then(res => {
              console.log('点赞', res);
              if (res.status === 100) {
                value.isPraise = 1;
                value.topicPraiseNumber = res.data.praiseNumber;
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
              url: window.baseURL + '/neighbor/cancelPraise?' + querystring.stringify(params)
            }).then(res => {
              if (res.status === 100) {
                console.log('取消点赞', res);
                value.isPraise = 0;
                value.topicPraiseNumber = value.topicPraiseNumber - 1;
                _this.likeWords = '点赞';
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
      addComment (value) {
        let token = localStorage.getItem('token');
        if (!token) {
          this.deleteModalShow = true
        } else {
          this.messageId = '';
          this.topic = value;
          this.showCommentField = true;
        }
      },
      subComment () {
        if (!this.commentText.trim()) {
          this.$vux.toast.show({
            type: 'text',
            text: '发送的内容不能空'
          });
        } else {
          let params = {
            neighborId: this.topic.neighborId,
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
      clickReportMenu (value) {
        let userId = localStorage.getItem('userId');
        if (value.userId === userId) {
          this.menus = {
            delTopic: '删除'
          }
        } else {
          this.menus = {
            report: '举报'
          }
        }
        this.topic = value;
        this.showMenus = true
      },
      close () {
        console.log('close');
        this.showCommentField = false;
        this.commentText = ''
      },
      show (index) {
        this.$refs.previewer.show(index)
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
<style lang="less" type="text/less" scoped>
  .newThingsDetail {
    height: 100%;
    background-color: #f7f7fa;
    .detailBanner{
      padding: .3rem;
      background-color: #ffffff;
      .avatar{
        display: flex;
        img{
          width: 40px;
          height: 42px;
          border-radius: 50%;
        }
        .name{
          margin-left: 10px;
          font-size: 8px;
          color: #d0d0d0;
          display: flex;
          text-align: left;
          flex-direction: column;
          justify-content: center;
          p:first-child{
            font-size: 14px;
            color: #333333;
          }
        }
      }
      .introduce{
        margin-top: 12px;
        p{
          font-size: 15px;
          text-align: left;
          word-wrap: break-word;
        }
      }
      .imgList{
        margin-top: 12px;
        ul{
          display: flex;
          flex-wrap: wrap;
          li{
            width: 113.5px;
            height: 113.5px;
            margin-bottom: 2px;
            margin-left: 1.25px;
            overflow: hidden;
            display: flex;
            align-items: center;
            img{
              width: 100%;
              height:50vw;
            }
          }
          .onePic{
            overflow: hidden;
            display: flex;
            align-items: center;
            width: 100%;
            height: 200px;
            img{
              width: 100%;
              height: auto;
            }
          }
          li:nth-child(3n+1){
            margin-left: 0;
          }
        }
      }
      .attentionList{
        margin-top: 13px;
        padding-bottom: 13px;
        border-bottom: 0.5px solid #d8d8d8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        ul{
          width: 50%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          li{
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #aaaaaa;
            i{
              display: block;
              width: 21px;
              height: 21px;
              margin-right: 4px;
              background-repeat: no-repeat;
              background-position: center;
              background-size: contain;
            }
          }
          li.attention i{
            background-image: url("../../../assets/images/like_icon_42gray.png");
          }
          li.comment i{
            background-image: url("../../../assets/images/comment_icon_42gray.png");
          }
          li.join i{
            background-image: url("../../../assets/images/joinus_icon_42gray.png");
          }
          li.vote i{
            background-image: url("../../../assets/images/vote_icon_42gray.png");
          }
        }
        .tag{
          font-size: 12px;
          color: #869DC7;
        }
      }
      .commentList{
        margin-top: 15px;
        ul{
          li{
            display: flex;
            text-align: left;
            font-size: 12px;
            color: #000000;
            .user{
              color: #869DC7;
            }
          }
          li.showMore{
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 15px auto;
            color: #aaaaaa;
            i{
              display: block;
              width: 11px;
              height: 11px;
              background: url("../../../assets/images/arrow_icon_grey32.png") no-repeat center;
              background-size: contain;
            }
          }
        }
        .commentInput{
          width: 100%;
          margin-top: 15px;
          overflow: auto;
          input{
            box-sizing: border-box;
            width: 100%;
            border:0.5px solid #d8d8d8;
            padding: 4px 10px;
            border-radius: 5px;
            outline: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
        }
      }
    }
    .commentList{
      margin-top: 10px;
      background-color: #ffffff;
      position: relative;
      .likeList{
        div{
          display: flex;
          align-items: center;
          height: .7rem;
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
              .reply{

                /*display: flex;*/
                /*align-items: center;*/
                /*p{*/
                  /*display: flex;*/
                  /*align-items: center;*/
                  /*span:last-child{*/
                    /*color: #0DAB60;*/
                  /*}*/
                /*}*/
                /*.text{*/
                  /*width: 4.2rem;*/
                  /*overflow: hidden;*/
                  /*text-overflow: ellipsis;*/
                  /*white-space: nowrap;*/
                /*}*/
                /*.replyText{*/
                  /*width: 1.1rem;*/
                /*}*/
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
      position: absolute;
      bottom: 0;
      left:0;
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
    .vux-popup-dialog{
      background-color: #ffffff;
    }
    .noComment{
      padding: 0 15px 15px 15px;
      div:first-child{
        padding: 15px 0 20px 0;
        border-bottom: 0.5px solid #D8D8D8;
        font-size: 14px;
        color: #000000;
      }
      div:last-child{
        padding-top: 15px;
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
          margin-left: 15px;
          background-color: #f7f7f7;
          border-radius: 100px;
          padding: 10px 20px;
        }
      }
    }
  }
</style>
