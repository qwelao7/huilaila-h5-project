<template>
  <div class="commentList no-margin-top">
    <div @click="getIsPraise(commonLists)">
      <group>
        <cell-box class="likeList" v-show="commonLists.topicPraiseNumber">
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
      <cell-box class="comments" v-for="(_item, index) in commonLists.comments" :key="index" @click.native="replyMsg(_item, index, commonLists)">
        <div class="left">
          <div class="avatar" @click="toPersonPage(_item.userId)"><img :src="_item.headPicName" alt=""></div>
          <div class="content">
            <span class="user">{{_item.userName}}</span>
            <div class="reply">
              <p v-show="_item.toUserId">
                <span>回复</span>
                <span>{{_item.toUserName}}</span>:
              </p>
              <span class="text">{{_item.msgContent}}</span>
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
      <div>
        <img :src="commonLists.headPicName" alt="">
        <span>拼的就是速度，抢个沙发...</span>
      </div>
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
            <a slot="overwrite-left" @click="showCommentField = false">取消</a>
            <a slot="right" @click="subComment(commonLists)">发送</a>
          </x-header>
          <group>
            <x-textarea :max="500" v-model="commentText" class="commentField" placeholder="说点什么吧" :show-counter="false" :rows="1" autosize></x-textarea>
          </group>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import { XHeader, Group, CellBox, querystring, Actionsheet, Popup, XTextarea, TransferDom } from 'vux'
  export default {
    name: 'commentList',
    directives: {
      TransferDom
    },
    components: {
      Group,
      CellBox,
      XHeader,
      Actionsheet,
      Popup,
      XTextarea
    },
    data () {
      return {
        menuOpt: {},
        menus: {
          menu: '举报'
        },
        likeAndComments: {},
        likeArr: {},
        showMenuOpt: false,
        commentLists: {},
        likeNum: '',
        messageId: '',
        commentNumber: '',
        showLike: false,
        like: '',
        showMenus: false,
        isLike: '',
        showCommentField: false,
        commentText: ''
      }
    },
    props: {
      comments: {
        type: Object,
        default: function () {
          return {}
        }
      },
      commonLists: {}
    },
    created () {
      this.getComments();
      this.getPraiseList();
    },
    methods: {
      getIsPraise (id) {
        this.$router.push('/likePeopleList/' + id.focusDetailId)
      },
      getPraiseList () {
        // 判断是否已经点赞
        let isPraise = this.commonLists.isPraise;
        this.showLike = !this.showLike;
        if (isPraise === 0) {
          this.like = '点赞';
          this.showLike = false;
        } else {
          this.like = '已赞';
          this.showLike = true;
        }
        this.likeArr = this.commonLists.praises;
        this.commentNumber = this.commonLists.comments;
        //  获取点赞数据 praises
        let neighborId = this.$route.params.id;
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
//  获取评论人数
        that.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/neighbor/topic/commentNumber?neighborId=' + neighborId
        }).then(v => {
          that.commentNumber = v.data;
        }).catch(err => {
          console.log(err);
        });
// 获取评论列表
        that.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/neighbor/topic/commentList?neighborId=' + neighborId + '&curPage=1&pageSize=10'
        }).then(v => {
          that.commentLists = v.data.resultList;
        }).catch(err => {
          console.log(err);
        });
      },
      likeIt (value) {
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
              _this.likeArr.push(obj);
            }
          }).catch(e => {})
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
              _this.likeArr.pop()
            }
          }).catch(e => {})
        }
      },
      addComment (value) {
        console.log(value, 11111111);
        this.topic = value;
        this.showCommentField = true
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
        if (this.commentText === '') {
          this.$vux.toast.show({
            type: 'cancel',
            text: '发送的内容不能空'
          });
        } else {
          let params = {
            neighborId: value.focusDetailId,
            messageId: '',
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
              this.topic.comments.unshift(res.data);
              this.topic.topicCommentNumber = this.topic.topicCommentNumber + 1;
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
              this.curTopic.comments.splice(this.msgIndex, 1);
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
          console.log(this.curTopic, '回复');
          this.topic = this.curTopic;
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
      getComments () {
        this.likeAndComments = this.comments;
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .commentList{
    margin-top: 10px;
    background-color: #ffffff;
    .noComment{
      padding: 0 .3rem;
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
            .user{
              font-size: 12px;
              margin-bottom: .05rem;
            }
            .reply{
              display: flex;
              align-items: center;
              p{
                display: flex;
                align-items: center;
                span:last-child{
                  color: #0DAB60;
                }
              }
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
          background-image: url("../../assets/images/like_icon_56black.png");
        }
        .like{
          background-image: url("../../assets/images/liked_icon_56red.png");
        }
      }
      .commentTab{
        i{
          background-image: url("../../assets/images/comment_icon_56black.png");
        }
      }
    }
  }
</style>
