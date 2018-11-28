<template>
  <div class="act-card">
    <div class="main-banner">
      <div class="avatar">
        <div>
          <!--<img :src="information.userInfo.headPicName" alt="" @click="toPersonPage(information)">-->
          <j-img :osskey="information.userInfo.headPicName" :custom-width="40" :custom-height="40" @click.native="toPersonPage(information)"></j-img>
          <div class="name" @click="toPersonPage(information)">
            <p>{{information.userInfo.nickname}}</p>
            <p>{{information.intime}}</p>
          </div>
        </div>
        <p class="endTime" v-html="information.activityStatus === 6 ? '活动取消' : information.endTimeTag"></p>
      </div>
      <div class="introduce" @click="toDetail(information)">
        <ul>
          <li><p style="word-break: break-all;width: 100%;">{{information.activityName}}</p></li>
          <li>
            <span>活动开始时间：</span>
            <span>{{information.startDate}}</span>
          </li>
          <li class="activityAddress">
            <span>活动地点：</span>
            <span>{{information.activityAddress}}</span>
          </li>
          <li v-if="information.joinMoney > 0">
            <span>报名费：</span>
            <span>￥{{information.joinMoney}}元/人</span>
          </li>
          <li v-if="information.limitCount> 0">
            <span>活动名额：</span>
            <span>{{information.limitCount}}人</span>
          </li>
          <li class="a_content" v-if="information.activityType === 0"><p class="activityContent">{{information.content}}</p></li>
          <!--<li><div class="activityContent">{{information.content}}</div></li>-->
        </ul>
      </div>
      <div class="imgList" @click="toDetail(information)">
        <!--<img :src="information.activityPicture" alt="">-->
        <j-img v-if="information.activityPicture" :osskey="information.activityPicture" :custom-width="345" :custom-height="200"></j-img>
        <j-img v-if="!information.activityPicture" osskey="../../../assets/images/openstudio_Illustration_750.png" :custom-width="345" :custom-height="200"></j-img>
      </div>
      <div class="attentionList">
        <ul>
          <li class="join" @click="goSign(information)">
            <i></i>
            <span>{{information.applyUserCount}}</span>
          </li>
          <li class="comment" @click="addComment">
            <i></i>
            <span>{{information.commentCount}}</span>
          </li>
        </ul>
      </div>
      <div class="aa" v-show="information.commentCount"></div>
      <div class="commentList">
        <ul v-show="information.commentCount">
          <li v-for="(item, index) in information.commentList" @click="selectMsg(item, index, information)">
            <span class="user">{{item.userName}}</span>
            <div class="reply">
              <p v-show="item.toUserName">回复<span class="user">{{item.toUserName}}</span></p>
              <span> : </span>
            </div>
            <span class="reply_content">{{item.msgContent}}</span>
          </li>
          <li class="showMore" v-show="information.commentCount > 5">
            <span  @click="toDetail(information)">查看更多</span>
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
  import { Actionsheet, TransferDom, XInput, Group, querystring, XDialog, XHeader, Popup, XTextarea } from 'vux'
  import JImg from 'components/common/img/jImg'
  export default {
    name: 'activityCard',
    directives: {
      TransferDom
    },
    components: {
      XInput,
      Actionsheet,
      Group,
      XDialog,
      XHeader,
      Popup,
      XTextarea,
      'j-img': JImg
    },
    props: {
      dataList: {
        type: Object,
        default: {}
      },
      isApp: {
        default: 0
      }
    },
    data () {
      return {
        information: {},
        isShowNum: false,
        commentText: '',
        menus: {},
        showMenus: false,
        messageId: '',
        copyMsg: '',
        msgIndex: '',
        curIndex: '',
        curTopic: {},
        toUser: '',
        placeholder: '评论',
        showCommentField: false,
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        },
        token: localStorage.getItem('token'),
        currentUser: {}
      }
    },
    created () {
      this.getInformation();
    },
    methods: {
      getInformation () {
        this.information = this.dataList;
      },
      replyMsg (value, index) {
        let _this = this;
        if (!_this.commentText.trim()) {
          _this.$vux.toast.show({
            type: 'text',
            text: '评论内容不能为空！'
          })
          return
        }
        let params = {
          neighborId: value.activityId,
          messageId: this.messageId,
          message: this.commentText,
          type: 2
        };
        if (params.message !== '') {
          _this.$JHttp({
            method: 'post',
            url: window.baseURL + '/socialactivity/addComment?' + querystring.stringify(params),
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            if (res.status === 100) {
              _this.$vux.toast.show({
                type: 'success',
                text: '评论成功'
              });
              value.commentList.unshift(res.data);
              if (value.commentList.length > 5) {
                value.commentList.splice(value.commentList.length - 1, 1);
              }
              value.commentCount = value.commentCount + 1;
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
      selectMsg (value, index, item, i) {
        this.showMenus = true;
        console.log(value, index, item, i);
        this.messageId = value.messageId;
        this.copyMsg = value.msgContent;
        this.toUser = value.userName;
        this.msgIndex = index;
        this.curTopic = item;
        this.curIndex = i;
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
          }
        }
      },
      clickMenu (key, item) {
        console.log(222, key, item);
        if (item === '删除') {
          let params = {
            messageId: this.messageId
          };
          this.$JHttp({
            method: 'delete',
            url: window.baseURL + '/socialactivity/deleteComment?' + querystring.stringify(params),
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            if (res.status === 100) {
              this.curTopic.commentList.splice(this.msgIndex, 1);
              this.curTopic.commentCount = this.curTopic.commentCount - 1;
              this.$vux.toast.show({
                type: 'success',
                text: '删除成功'
              });
            }
          }).catch(e => {
            console.log(e)
          })
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
          console.log(222, this.messageId)
        }
      },
      clickCancelAndMask () {
        this.messageId = ''
      },
      toPersonPage (value) {
        if (!this.isApp) {
          if (value.activityType === 0) {
            let id = value.userInfo.id;
            this.$router.push('/personPage/' + id)
          }
        }
      },
      onFocus () {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          this.showCommentField = true;
        }
      },
      close () {
        this.showCommentField = false;
        this.commentText = '';
      },
      toDetail (val) {
        this.$router.push('/activityDetail/' + val.activityId);
      },
      addComment () {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          this.showCommentField = true;
        }
      },
      subComment (value) {
        this.replyMsg(value);
      },
      goToBind () {
        this.$router.push('/Login')
      },
      goSign (value) {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          let userId = localStorage.getItem('userId');
          if (userId !== value.userInfo.id) {
            if (value.activityStatus === 2) {
              let params = {
                joinOtherCommunity: value.joinOtherCommunity,
                activityId: value.activityId
              }
              let _this = this;
              _this.$JHttp({
                method: 'get',
                url: window.baseURL + '/socialactivity/validateJoinOtherCommunity?' + querystring.stringify(params)
              }).then(res => {
                if (res.status === 100) {
                  if (value.limitCount && value.applyUserCount >= value.limitCount) {
                    _this.$vux.toast.show({
                      type: 'text',
                      text: '报名人数满了，下次再来吧'
                    })
                  } else {
                    _this.$router.push('/signUp/' + value.activityId)
                  }
                } else {
                  _this.$vux.toast.show({
                    type: 'text',
                    text: res.msg
                  })
                }
              }).catch(e => {
                console.log(e)
              })
            } else if (value.activityStatus === 1) {
              this.$vux.toast.show({
                type: 'text',
                text: '报名未开始，请耐心等待~'
              });
            } else if (value.activityStatus === 6) {
              this.$vux.toast.show({
                type: 'text',
                text: '很遗憾，活动取消啦~'
              });
            } else {
              this.$vux.toast.show({
                type: 'text',
                text: '来晚一步，报名已结束~'
              });
            }
          } else {
            this.$router.push('/signUpPeople/' + value.activityId)
          }
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .act-card{
    .main-banner{
      background-color: #ffffff;
      margin-top: 10px;
      /*padding: 10px 15px 15px 15px;*/
      padding: 0 15px;
      .avatar{
        padding-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        div{
          flex: 1;
          display: flex;
          /*align-items: center;*/
          img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
          .name{
            flex: 1;
            margin-left: 10px;
            font-size: 10px;
            color: #aaaaaa;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            p:first-child{
              font-size: 15px;
              color: #333333;
            }
          }
        }
        .endTime{
          font-size: 12px;
          color: #aaaaaa;
        }
      }
      .introduce{
        margin-top: 15px;
        ul{
          li{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            span{
              font-size: 15px;
              color: #333333;
              white-space:normal;
              word-break:break-all;
            }
            /*p{*/
              /*white-space:normal;*/
              /*word-break:break-all;*/
            /*}*/
            .activityContent{
              font-size: 15px;
              overflow:hidden;
              white-space:nowrap;
              text-overflow:ellipsis;
              -o-text-overflow:ellipsis;
            }
            span:last-child{
              flex: 1;
            }
          }
          .a_content{

          }
          .activityAddress{
            align-items: flex-start;
          }
        }
        p{
          font-size: 15px;
          color: #333333;
          text-align: left;
          word-wrap: break-word;
        }
      }
      .imgList{
        margin-top: 12px;
        width: 100%;
        height: 200px;
        overflow: hidden;
        display: flex;
        align-items: center;
        img{
          display: block;
          width: 100%;
          height:100%
        }
      }
      .attentionList{
        margin-top: 13px;
        padding-bottom: 13px;
        /*border-bottom: 0.5px solid #d8d8d8;*/
        display: flex;
        justify-content: space-between;
        align-items: center;
        ul{
          flex: 0.5;
          display: flex;
          align-items: center;
          li{
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #aaaaaa;
            margin-left: 15px;
            i{
              display: block;
              width: 21px;
              height: 21px;
              margin-right: 4px;
              background-repeat: no-repeat;
              background-position: center;
              background-size: contain;
            }
            input{
              border: none;
              width: .3rem;
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
        width:100%;
        ul{
          li{
            display: flex;
            text-align: left;
            font-size: 15px;
            color: #000000;
            .user{
              color: #869DC7;
            }
            .reply{
              display: flex;
              /*align-items: center;*/
              p{
                display: flex;
                align-items: center;
              }
            }
            .reply_content{
              white-space:normal;
              word-break:break-all;
              flex: 1;
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
            i{
              display: block;
              width: 11px;
              height: 11px;
              background: url("../../assets/images/arrow_icon_grey32.png") no-repeat center;
              background-size: contain;
            }
          }
        }
        .commentInput{
          margin-top: 15px;
          padding-bottom: 15px;
          span{
            width: 100%;
            height: 30px;
            line-height: 30px;
            padding-left: 5px;
            color: #aaaaaa;
            border: 0.5px solid #D8D8D8;
            border-radius: 4px;
          }
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
