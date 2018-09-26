<template>
  <div class="act-card">
    <div class="main-banner">
      <div class="avatar">
        <div style="flex: 1">
          <!--<img :src="information.user.avatar" alt="" @click="toPersonPage(information)">-->
          <j-img :osskey="information.user.avatar" :custom-width="40" :custom-height="40"></j-img>
          <div class="name" @click="toPersonPage(information)">
            <p>{{information.user.name}}</p>
            <p>{{information.pubTime}}</p>
          </div>
        </div>
        <p class="endTime" v-show="information.endTimeStr">{{information.endTimeStr}}</p>
      </div>
      <!--<div class="topicCoverimg" v-show="information.topicCoverimg">
        <img :src="information.topicCoverimg" alt="">
      </div>-->
      <div class="introduce">
        <p @click="toDetail(information)" v-html="information.container.content"></p>
      </div>
      <div class="imgList">
        <ul>
          <li class="first-item" v-for="(items, index) in imgLists" v-bind:class="{ onePic: isOnePic }" v-show="items.src">
            <!--<img class="previewer-demo-img" :src="items.src" alt="" @click="show(index, information)">-->
            <j-img :osskey="items.src" v-if="isOnePic" :custom-class="'previewer-demo-img'" :custom-width="345" :custom-height="200" @click.native="show(index, information)"></j-img>
            <j-img :osskey="items.src" v-if="!isOnePic" :custom-class="'previewer-demo-img'" :custom-width="114" :custom-height="114" @click.native="show(index, information)"></j-img>
          </li>
        </ul>
        <div v-transfer-dom>
          <previewer ref="previewer" :list="imgLists" :options="options(ind)">
          </previewer>
        </div>
      </div>
      <div class="attentionList">
        <ul>
          <li class="attention" @click="addPraise(information)">
            <i :class="{like: information.activity.isLike === 1}"></i>
            <span>{{information.activity.like || 0}}</span>
            <!--<input v-model="information.activity.like" readonly>-->
          </li>
          <li class="comment" @click="addComment">
            <i></i>
            <span>{{information.activity.comments || 0}}</span>
            <!--<input v-model="information.activity.comments" readonly>-->
          </li>
          <li class="join" v-show="information.type === 'activity'" @click="goSign(information)">
            <i></i>
            <span>{{information.activity.join || 0}}</span>
            <!--<input v-model="information.activity.join" readonly>-->
          </li>
          <li class="vote" v-show="information.voteId" @click="toDetail(information)">
            <i></i>
            <span>{{information.activity.vote || 0}}</span>
            <!--<input v-model="information.activity.vote" readonly>-->
          </li>
        </ul>
        <div class="tag" v-show="information.tags">
          <p>#{{information.tags}}</p>
        </div>
      </div>
      <div class="aa" v-show="information.activity.comments"></div>
      <div class="commentList">
        <ul v-show="information.activity.comments">
          <li v-for="(_item, index) in information.commentArr" @click="selectMsg(_item, index, information)">
            <div>
              <p class="user">{{_item.userName}}</p>
              <div class="reply">
                <div v-show="_item.toUserId">
                  <p>回复</p>
                  <p class="user">{{_item.toUserName}}</p>
                </div>
                :
              </div>
            </div>
            <p class="reply_content">{{_item.msgContent}}</p>
          </li>
          <li class="showMore" v-show="information.activity.comments > 5" @click="toDetail(information)">
            <span>查看更多</span>
            <i></i>
          </li>
        </ul>
        <div class="commentInput">
          <span ref="commentInput" @click="onFocus">评论</span>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <actionsheet
        :menus="menus"
        v-model="showMenus"
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
            <a slot="right" @click="subComment(information)">发送</a>
          </x-header>
          <group>
            <x-textarea :max="500" ref="textArea" v-model="commentText" class="commentField" :placeholder="placeholder" :show-counter="false" :height="200" :rows="8" :cols="30"></x-textarea>
          </group>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
        <span class="delete-info vux-1px-b">您尚未绑定手机号</span>
        <div class="operate-wrapper">
          <span class="text vux-1px-r" @click="deleteModalShow = false">以后再说</span>
          <span class="text" @click="goToBind">前往绑定</span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import { Previewer, Actionsheet, TransferDom, XInput, Group, Divider, querystring, XDialog, XHeader, Popup, XTextarea } from 'vux'
  import JImg from 'components/common/img/jImg'
  export default {
    name: 'activityCard',
    directives: {
      TransferDom
    },
    components: {
      Previewer, XHeader, XInput, Divider, Actionsheet, Group, XDialog, Popup, XTextarea, 'j-img': JImg
    },
    props: {
      dataList: {
        type: Object,
        default: {}
      },
      // 控制点击发布人姓名时能否跳转到个人主页
      personPage: {
        type: Boolean,
        default: true
      },
      ind: ''
    },
    data () {
      return {
        itemsIndex: '',
        information: {},
        imgLists: [],
        isOne: false,
        isShowNum: false,
        isLike: '',
        commentText: '',
        menus: {},
        showMenus: false,
        messageId: '',
        copyMsg: '',
        msgIndex: '',
        curIndex: '',
        curTopic: {},
        toUser: '',
        showCommentField: false,
        placeholder: '评论',
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        },
        token: localStorage.getItem('token')
      }
    },
    created () {
      this.getInformation();
    },
    computed: {
      isOnePic () {
        let length = this.imgLists.length;
        if (length === 1) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      getInformation () {
        this.information = this.dataList;
        this.imgLists = this.information.container.imgList;
        this.itemsIndex = this.ind;
        let length = this.imgLists.length;
        if (length === 1) {
          this.isOne = true
        }
      },
      onFocus () {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          this.showCommentField = true;
        }
      },
      replyMsg (value) {
        console.log(222, value)
        let type;
        let id;
        let _this = this;
        if (value.topicType === 8) { // 社群
          type = 5;
          id = value.neighborId
        } else if (value.topicType === 11) {
          type = 11;
          id = value.neighborId
        } else {
          type = 1;
          id = value.neighborId
        }
        if (!_this.commentText.trim()) {
          _this.$vux.toast.show({
            type: 'text',
            text: '评论内容不能为空！'
          })
          return
        }
        let params = {
          neighborId: id,
          messageId: this.messageId,
          message: this.commentText,
          type: type
        };
        if (params.message !== '') {
          _this.$JHttp({
            method: 'post',
            url: window.baseURL + '/neighbor/addComment?' + querystring.stringify(params),
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            if (res.status === 100) {
              _this.$vux.toast.show({
                type: 'success',
                text: '评论成功'
              });
              value.commentArr.unshift(res.data);
              if (value.commentArr.length > 5) {
                value.commentArr.splice(value.commentArr.length - 1, 1);
              }
              value.activity.comments = value.activity.comments + 1;
              _this.commentText = '';
              _this.messageId = '';
              _this.showCommentField = false
            }
          }).catch(e => {
            console.log(e)
          })
        } else {
          _this.$vux.toast.show({
            type: 'cancel',
            text: '评论内容不能为空'
          });
        }
      },
      selectMsg (value, index, item) {
        console.log(value, index, item);
        this.messageId = value.messageId;
        this.copyMsg = value.msgContent;
        this.toUser = value.userName;
        this.msgIndex = index;
        this.curTopic = item;
//        this.curIndex = i;
        let userId = localStorage.getItem('userId');
        if (userId === value.userId) {
          this.menus = {
            menu1: '删除',
            menu2: '复制'
          }
        } else {
          this.menus = {
            menu1: '回复',
            menu2: '复制'
//            menu3: '举报'
          }
        }
        this.showMenus = true
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
                this.curTopic.commentArr.splice(this.msgIndex, 1);
                this.curTopic.activity.comments = this.curTopic.activity.comments - 1;
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
            this.showCommentField = true;
            this.placeholder = '回复' + this.toUser + ':';
          }
        } else if (item === '复制') {
          //
          this.messageId = '';
          this.$copyText(this.copyMsg).then(res => {
            console.log(res);
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
        } else if (key === 'cancel') {
          this.messageId = ''
          console.log(111, this.messageId)
        }
      },
      clickCancelAndMask () {
        this.messageId = ''
      },
      toPersonPage (value) {
//        if (!this.token) {
//          this.deleteModalShow = true;
//        } else {
//          let id;
//          if (value.topicType === 6) {
//            id = value.userId;
//            this.$router.push('/personPage/' + id)
//          } else if (value.topicType === 2) {
//            if (value.isPrivate) {
//              id = value.userId;
//              this.$router.push('/personPage/' + id)
//            }
//          }
//        }
        if (this.personPage) {
          let id;
          if (value.topicType === 2) {
            if (value.isPrivate) {
              id = value.userId;
              this.$router.push('/personPage/' + id)
            }
          } else {
            id = value.userId;
            this.$router.push('/personPage/' + id)
          }
        }
      },
      show (index, value) {
        console.log(value)
        if (value.topicType === 4) {
          if (value.voteId) {
            this.$router.push('/surveyDetail/' + value.voteId + '/' + value.neighborId);
          } else {
            this.$router.push('/newThingsDetail/' + value.neighborId);
          }
        } else {
          this.$refs.previewer.show(index);
        }
      },
      options (ind) {
        let that = this;
        return {
          getThumbBoundsFn (index) {
            // find thumbnail element
//          let thumbnail = document.querySelectorAll('.previewer-demo-img')[index];
            let thumbnail = that.$el.querySelectorAll('.previewer-demo-img')[index];
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
//          isClickableElement: function (el) {
//            return /previewer-delete-icon-box/.test(el.className)
//          }
        }
      },
      toDetail (val) {
//        if (!this.token) {
//          this.deleteModalShow = true;
//        } else {
//          switch (val.topicType) {
//            case 6:
//              this.$router.push('/newThingsDetail/' + val.neighborId);
//              break;
//            case 4:
//              if (val.voteId) {
//                this.$router.push('/surveyDetail/' + val.voteId + '/' + val.neighborId);
//              } else {
//                this.$router.push('/newThingsDetail/' + val.neighborId);
//              }
//              break;
//            case 8:
//              this.$router.push('/newThingsDetail/' + val.neighborId);
//              break;
//          }
//        }
        switch (val.topicType) {
          case 4:
            if (val.voteId) {
              this.$router.push('/surveyDetail/' + val.voteId + '/' + val.neighborId);
            } else {
              this.$router.push('/newThingsDetail/' + val.neighborId);
            }
            break;
          case 11:
            this.$router.push('/albumDetail/' + val.neighborId);
            break;
          default:
            this.$router.push('/newThingsDetail/' + val.neighborId);
        }
      },
      addPraise (value) {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          let id;
          let type;
          if (value.topicType === 2) {
            type = 4;
            if (value.isPrivate) {
              id = value.neighborId
            } else {
              id = value.id;
            }
          } else {
            type = 0; // 点赞的类型只有0，1，2
            id = value.neighborId;
          }
          this.isLike = value.activity.isLike;
          if (this.isLike === 0) {
            // 点赞
            let params = {
              neighborId: id,
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
                value.activity.isLike = 1;
                value.activity.like = value.activity.like + 1;
                console.log(value.activity)
              }
            }).catch(e => {})
          } else {
            let params = {
              neighborId: id
            };
            this.$JHttp({
              method: 'put',
              url: window.baseURL + '/neighbor/cancelPraise?' + querystring.stringify(params)
            }).then(res => {
              console.log('取消点赞', res);
              value.activity.isLike = 0;
              value.activity.like = value.activity.like - 1;
            }).catch(e => {
              console.log(e)
            })
          }
        }
      },
      addComment () {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          this.showCommentField = true;
//          this.$refs.commentInput.focus()
        }
      },
      goToBind () {
        this.$router.push('/Login')
      },
      subComment (value) {
        this.replyMsg(value);
      },
      close () {
        this.showCommentField = false;
        this.commentText = '';
      },
      onEvent (event) {
        console.log(event)
      },
      goSign (value) {
        console.log(value);
        if (value.status === 1) {
          this.$router.push('/signUp/' + value.id)
        } else if (value.status === 2) {
          this.$vux.alert.show({
            content: '报名未开始，请耐心等待'
          });
          setTimeout(() => {
            this.$vux.alert.hide()
          }, 3000);
        } else {
          this.$vux.alert.show({
            content: '报名已结束，去看看别的活动吧'
          });
          setTimeout(() => {
            this.$vux.alert.hide()
          }, 3000);
        }
      },
      downLoad () {
        alert('loading')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .act-card {
    .main-banner {
      background-color: #ffffff;
      margin-top: 10px;
      padding: 10px 15px 15px;
      .avatar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
          display: flex;
          flex-direction: row;
          /*align-items: center;*/
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
          .name {
            flex: 1;
            margin-left: 10px;
            font-size: 10px;
            color: #d0d0d0;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            p:first-child {
              font-size: 15px;
              color: #333333;
            }
          }
          .endTime {
            line-height: 100%;
            font-size: 12px;
            color: #aaaaaa;
          }
        }
        .endTime {
          font-size: 12px;
          color: #aaaaaa;
        }
      }
      /*.topicCoverimg{
        width: 100%;
        height: 200px;
        img{
          width: 100%;
          height: 100%;
        }
      }*/
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
              height: 100%;
            }
          }
          li:nth-child(3n+1){
            margin-left: 0;
          }
        }
      }
      .attentionList {
        margin-top: 13px;
        padding-bottom: 13px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        ul {
          flex: 0.5;
          display: flex;
          align-items: center;
          li {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #aaaaaa;
            margin-left: 15px;
            i {
              display: block;
              width: 21px;
              height: 21px;
              margin-right: 4px;
              background-repeat: no-repeat;
              background-position: center;
              background-size: contain;
            }
            input {
              border: none;
              width: 15px;
              font-size: 12px;
              color: #aaaaaa;
            }
          }
          li:first-child{
            margin-left: 0;
          }
          li.attention{
            i{
              background-image: url("../../assets/images/like_icon_42gray.png");
            }
            .like{
              background-image: url("../../assets/images/liked_icon_56red.png");
            }
          }
          li.comment i{
            background-image: url("../../assets/images/comment_icon_42gray.png");
          }
          li.join i{
            background-image: url("../../assets/images/joinus_icon_42gray.png");
          }
          li.vote i{
            background-image: url("../../assets/images/vote_icon_42gray.png");
          }
        }
        .tag{
          font-size: 12px;
          color: #869DC7;
        }
      }
      .aa{
        height:0.5px;
        border-top: 0.5px solid #d8d8d8;
        margin-bottom: 15px;
      }
      .commentList{
        /*padding-top: 15px;*/
        width:100%;
        ul{
          margin-bottom: 15px;
          li {
            div, p {
              display: inline;
              font-size: 15px;
              word-break:break-all;
              word-wrap:break-word
            }
            .user{
              color: #869DC7;
            }
          }
          li:active{
            background-color: #e5e5e5;
          }
          li.showMore{
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 15px;
            color: #aaaaaa;
            i {
              display: block;
              width: 11px;
              height: 11px;
              background: url("../../assets/images/arrow_icon_grey32.png") no-repeat center;
              background-size: contain;
            }
          }
        }
        .commentInput {
          /*margin-top: 15px;*/
          width: 100%;
          span {
            width: 100%;
            height: 30px;
            line-height: 30px;
            box-sizing: border-box;
            padding-left: 5px;
            color: #aaaaaa;
            border: 0.5px solid #D8D8D8;
            border-radius: 4px;
          }
        }
      }
    }
    .downLoad-icon {

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
