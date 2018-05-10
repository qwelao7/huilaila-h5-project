<template>
  <div class="building_dynamic">
    <div class="building_tit" v-show="buildList1.title1" @click="toBanner(buildList1)">
      <span class="building_top">{{buildList1.title1}}</span>
      <x-icon type="ios-arrow-right" size="25"></x-icon>
    </div>
    <div class="building_content">
      <div class="building_img" @click="toDetail(buildList1)">
        <img :src="buildList1.img" alt="">
        <!--<img :src="buildList1.img" alt="" v-if="buildList1.type === 'buildLive' && !buildList1.img">-->
        <!--<img :src="buildList1.img" alt="">-->
        <!--<img :src="buildList1.img" alt="">-->
        <div class="building_data">
          <i class="instruction_icon"></i>
          <span class="data_instruction">{{buildList1.dataInstruction}}</span>
        </div>
      </div>
      <p class="building_name" v-html="buildList1.name">{{buildList1.name}}</p>
      <div class="building_bottom">
        <div class="building_like" @click="addPraise(buildList1)">
          <i class="like_icon" :class="{like: buildList1.isPraise === 1}"></i>
          <span class="like_num">{{buildList1.praisenum || 0}}</span>
        </div>
        <div class="building_like" @click="addComments(buildList1)">
          <i class="message_icon"></i>
          <span class="message_num">{{buildList1.commentNum || 0}}</span>
        </div>
        <div class="building_like" v-show="buildList1.joinUserCnt >= 0" @click="goVote(buildList1)">
          <i class="vote_icon"></i>
          <span class="vote_num">{{buildList1.joinUserCnt || 0}}</span>
        </div>
      </div>
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
          <span class="text vux-1px-r" @click="deleteModalShow = false">以后再说</span>
          <span class="text" @click="goToBind">前往绑定</span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import { XHeader, Popup, XTextarea, Group, querystring, XDialog, TransferDom } from 'vux'
  export default {
    name: 'comCard',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Popup,
      Group,
      XTextarea,
      XDialog
    },
    props: {
      buildList1: {}
    },
    data () {
      return {
        isLike: '',
        showLike: '',
        like: '',
        likeWords: '',
        topic: {},
        showCommentField: false,
        commentText: '',
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
    methods: {
      addPraise (value) {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          let this_ = this;
          let neighborId = '';
          if (value.type === 'survey') {
            neighborId = value.neiId || value.neighborId;
          } else {
            neighborId = value.id;
          }
          let type;
          if (value.value === 'survey') {
            type = 6
          } else {
            type = 5
          }
          if (value.isPraise === 0) {
            // 点赞
            let params = {
              neighborId: neighborId,
              type: type
            };
            this_.$JHttp({
              method: 'post',
              url: window.baseURL + '/neighbor/addPraise?' + querystring.stringify(params),
              headers: {
                defCommunityId: localStorage.getItem('communityId')
              }
            }).then(res => {
              if (res.status === 100) {
                this_.showLike = true;
                this_.buildList1.isPraise = 1;
                this_.buildList1.praisenum = this_.buildList1.praisenum + 1;
              }
            }).catch(e => {
              console.log(e)
            })
          } else {
            let params = {
              neighborId: neighborId
            };
            this_.$JHttp({
              method: 'put',
              headers: {
                defCommunityId: localStorage.getItem('communityId')
              },
              url: window.baseURL + '/neighbor/cancelPraise?' + querystring.stringify(params)
            }).then(res => {
              if (res.status === 100) {
                this_.showLike = false;
                this_.buildList1.isPraise = 0;
                this_.buildList1.praisenum = this_.buildList1.praisenum - 1;
              }
            }).catch(e => {
              console.log(e)
            })
          }
        }
      },
      addComments (value) {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          this.messageId = '';
          this.topic = value;
          this.showCommentField = true
        }
      },
      subComment () {
        let value = this.topic;
        let type;
        if (value.type || value.value === 'buildLive') {
          type = 7
        } else if (value.type || value.value === 'announcement') {
          type = 10
        } else if (value.type || value.value === 'survey') {
          type = 3
        } else if (value.type || value.value === 'project') {
          type = 8
        }
        let neighborId = '';
        if (value.type === 'survey') {
          neighborId = value.neighborId || value.neiId;
        } else {
          neighborId = value.id;
        }
        if (!this.commentText.trim()) {
          this.$vux.toast.show({
            type: 'text',
            text: '发送的内容不能空'
          });
        } else {
          let params = {
            neighborId: neighborId,
            messageId: '',
            message: this.commentText,
            type: type
          };
//          if (value.type === 'survey') {
//            params.neighborId = value.neiId
//          }
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
              value.commentNum = value.commentNum + 1;
              this.commentText = '';
              this.showCommentField = false
            }
          }).catch(e => {
            console.log(e)
          })
        }
      },
      close () {
        this.showCommentField = false;
        this.commentText = ''
      },
      toDetail (val) {
        if (val.type === 'survey') {
          let _id = val.neiId || val.neighborId;
          this.$router.push('/' + val.value + 'Detail/' + val.id + '/' + _id)
        } else {
          this.$router.push('/' + val.value + 'Detail/' + val.id)
        }
      },
      goVote (val) {
        let _id = val.neiId || val.neighborId;
        this.$router.push('/' + val.value + 'Detail/' + val.id + '/' + _id)
      },
      toBanner (val) {
        this.$router.push('/' + val.value);
      },
      goToBind () {
        this.$router.push('/Login')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .building_dynamic {
    margin-top: 10px;
    padding: 15px 15px 13px 15px;
    background: #fff;
  }
  input{
    border: none;
    width: 15px;
    font-size: 12px;
    color: #aaaaaa;
  }
  .building_tit {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }
  .building_top {
    font-size: 18px;
  }

  .vux-x-icon {
    fill: #aaaaaa;
    vertical-align: middle;
    width: 25px;
    height: 25px;
  }

  .cell-x-icon {
    display: block;
    fill: green;
  }
  .building_img {
    height: 200px;
    position: relative;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .building_data {
    width: 100%;
    height: 30px;
    color: #ffffff;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;

  }
  .instruction_icon {
    margin-right: 7px;
    margin-left: 5px;
    width: 21px;
    height: 21px;
    background: url('../../assets/images/time_icon_white.png') center no-repeat / cover;
  }

  .data_instruction {
    width: 100%;
    font-size: 12px;
    margin-top: 2px;
  }
  .building_like{
    display: inline-flex;
    align-items: center;
    margin-left: 33px;
  }
  .building_like:first-child{
    margin-left: 0;
  }
  .building_name {
    color: #333;
    font-size: 14px;
    margin-top: 12px;
  }

  .building_bottom {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
  .like_icon, .message_icon, .vote_icon{
    width: 21px;
    height: 21px;
  }
  .like_icon {
    background: url('../../assets/images/like_icon_42gray.png') center no-repeat / contain;
  }
  .vote_icon{
    background: url('../../assets/images/vote_icon_42gray.png') center no-repeat / contain;
  }
  .like{
    background-image: url("../../assets/images/liked_icon_56red.png");
  }
  .like_num, .message_num, .vote_num{
    color: #aaaaaa;
    font-size: 12px;
    margin-top: 3px;
    margin-left: 3px;
  }

  .message_icon {
    background: url('../../assets/images/comment_icon_42gray.png') center no-repeat / contain;
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
</style>
