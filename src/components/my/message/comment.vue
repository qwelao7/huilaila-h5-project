<template>
  <div class="comment">
    <div class="pull-top">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <ul v-if="dataList.length">
            <li v-for="item in dataList">
              <div class="comment-head">
                <div class="head-left" @click="toPersonPage(item.commentInuser)">
                  <img :src="item.headPicName" alt="">
                  <div class="name-time">
                    <div class="name">
                      <span>{{item.userName}}</span>
                      <badge class="dot" v-show="item.isRead === 0"></badge>
                    </div>
                    <span class="time">{{item.updateTime}}</span>
                  </div>
                </div>
                <div class="head-right" @click="toReply(item)">
                  <i></i>
                  <span>回复</span>
                </div>
              </div>
              <p class="comment-detail">{{item.msgContent}}</p>
              <div class="topic" @click="goToTopic(item)">
                <img :src="item.topicPicture" alt="" v-show="item.topicPicture">
                <p>{{item.msgTheme}}</p>
              </div>
            </li>
          </ul>
          <div class="noContent" v-if="!dataList.length">
            <img src="../../../assets/images/No-post.png" alt="">
            <p>迫不及待听你说</p>
            <span @click="toPublish">去发帖</span>
          </div>
        </div>
      </j-pull>
    </div>
    <div v-transfer-dom>
      <popup v-model="showCommentField" height="100%" style="background-color: #ffffff">
        <div class="commentPopup">
          <x-header title="评论" left-options.preventGoBack="true">
            <a slot="overwrite-left" @click="cancelComment">取消</a>
            <a slot="right" @click="subComment">发送</a>
          </x-header>
          <group>
            <x-textarea autofocus="autofocus" v-model="commentText" class="commentField" :show-counter="false" :rows="1" autosize ref="replyFiled">
              <span slot="label" class="replyName">回复<span>{{topic.userName}}</span>：</span>
            </x-textarea>
          </group>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import { XHeader, Badge, TransferDom, Popup, XTextarea, Group, querystring } from 'vux'
  import JPull from '../../base/JPull/JPull'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader, Badge, TransferDom, Popup, XTextarea, Group, JPull
    },
    data () {
      return {
        dataList: [],
        showCommentField: false,
        commentText: '',
        topic: {},
        replyName: '',
        curPage: 1,
        pageSize: 10,
        hasMore: true
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData (loaded) {
        let _this = this;
        _this.$vux.loading.show({
          text: '加载中'
        });
        let params = {
          curPage: this.curPage,
          pageSize: this.pageSize
        };
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/notice/getNoticeCommentList?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (loaded) {
            loaded(_this.hasMore)
          }
          if (res.status === 100) {
            _this.$vux.loading.hide();
            _this.hasMore = res.data.pageResult.hasMore;
            _this.dataList = _this.dataList.concat(res.data.resultList)
          } else {
            _this.$vux.loading.hide();
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          console.log(e)
        })
      },
      toReply (item) {
        this.topic = item;
        this.showCommentField = true;
        this.$refs.replyFiled.focus();
//        this.$router.push('/commentPage')
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
            messageId: this.topic.msgId,
            message: this.commentText,
            type: this.topic.messageType
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
              console.log(res.data);
              this.commentText = '';
              this.showCommentField = false;
              this.topic.isRead = 1;
            }
          }).catch(e => {
            console.log(e)
          })
        }
      },
      cancelComment () {
        this.showCommentField = false;
        this.topic.isRead = 1;
      },
      goToTopic (val) {
        switch (val.topicType) {
          case 6:
            this.$router.push('/newThingsDetail/' + val.neighborId);
            break;
          case 2:
            // 个人活动
            this.$router.push('/newThingsDetail/' + val.neighborId);
//            if (val.isPrivate) {
//              this.$router.push('/newThingsDetail/' + val.neighborId);
//            } else {
//              this.$router.push('/activityDetail/' + val.neighborId);
//            }
            break;
          case 'vote':
            console.log(val.id);
            this.$router.push('/voteDetail/' + val.id);
            break;
        }
      },
      toPersonPage (key) {
        this.$router.push('/personPage/' + key)
      },
      refreshData (loaded) {
        this.curPage = 1;
        this.dataList = [];
        this.getData(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getData(loaded);
      },
      toPublish () {
        this.$router.push('/pub_newThings')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .comment{
    height: 100%;
    .pull-top{
      height: 100%;
    }
    .noContent{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 124px;
      margin-bottom: 248px;
      img{
        width: 150px;
        height: 150px;
      }
      p{
        margin-top: 10px;
        color: #aaaaaa;
        font-size: 15px;
      }
      span{
        width: 150px;
        height: 35px;
        margin-top: 20px;
        line-height: 35px;
        text-align: center;
        background-color: #0DAB60;
        color: #ffffff;
        font-size: 15px;
        border-radius: 67px;
      }
    }
    ul{
      height: 100%;
      padding: 20px 15px;
      li{
        padding: 20px 0;
        border-bottom: 0.5px solid #D8D8D8;
        .comment-head{
          display: flex;
          align-items: center;
          justify-content: space-between;
          .head-left{
            display: flex;
            align-items: center;
            img{
              border-radius: 50%;
              width: 40px;
              height: 40px;
              margin-right: 15px;
            }
            .name-time{
              span{
                font-size: 12px;
              }
              .name{
                position: relative;
                margin-bottom: 7px;
                .dot{
                  position: absolute;
                  right: -10px;
                  top: 1px;
                  padding: 3px;
                }
              }
              .time{
                color: #aaaaaa;
              }
            }

          }
          .head-right{
            display: flex;
            align-items: center;
            i{
              width: 16px;
              height: 16px;
              background: url("../../../assets/images/comment_icon_green.png") center no-repeat / contain;
            }
            span{
              font-size: 12px;
              color: #333333;
              margin-left: 10px;
            }
          }
        }
        .comment-detail{
          margin-top: 10px;
          font-size: 15px;
          color: #333333;
        }
        .topic{
          display: flex;
          margin-top: 15px;
          align-items: center;
          background-color: #f8f8f8;
          img{
            width: 62px;
            height: 62px;
          }
          p{
            flex: 1;
            word-wrap: break-word;
            word-break: break-all;
            padding: 10px;
            font-size: 15px;
            color: #aaaaaa;
          }
        }
      }
      li:first-child{
        padding-top: 0;
      }
    }
  }
</style>
