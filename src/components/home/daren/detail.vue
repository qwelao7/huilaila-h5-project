<template>
  <div class="commonHeader daren-detail">
    <view-box ref="viewBox">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        :title="title">
        <span class="right-btn" slot="right" @click="publish" v-if="userId === ownerId"><x-icon type="ios-plus-empty" size="30"></x-icon></span>
      </x-header>
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <div class="customer-img">
            <div class="img-wrapper">
              <img v-if="!workroomPic" src="../../../assets/images/banner_personalhomepage.jpg" alt="">
              <!--<img v-if="workroomPic" :src="workroomPic" alt="">-->
              <j-img v-if="workroomPic" :osskey="workroomPic" :custom-width="375" :custom-height="250"></j-img>
            </div>
            <div class="mask"></div>
          </div>
          <div class="content">
            <div class="info">
              <div class="brief">
                <div class="avatar">
                  <img v-if="!headPic" src="../../../assets/images/default_avatar.png" alt="">
                  <!--<img v-if="headPic" :src="headPic" alt="">-->
                  <j-img v-if="headPic" :osskey="headPic" :custom-width="57" :custom-height="57"></j-img>
                </div>
                <div class="intro">
                  <p class="title" v-text="ownerName"></p>
                  <p class="address"><img src="../../../assets/images/address_icon_32black.png" alt="">{{from}}</p>
                </div>
              </div>
              <div class="edit-btn" @click="edit" v-if="userId === ownerId">编辑</div>
              <div class="edit-btn" @click="info" v-if="userId !== ownerId">咨询</div>
            </div>
            <div class="tags-part">
              <div class="name">标签</div>
              <div class="tags">
                <span v-show="labels.length > 0">#</span>
                <span v-for="i in labels">{{i}}</span>
              </div>
            </div>
            <div class="introduce">
              <div class="name">介绍</div>
              <p v-text="introduce"></p>
            </div>
            <div class="states">
              <p class="title">动态</p>
              <div class="states-list-wrapper">
                <ul class="states-list">
                  <li v-for="item in list" @click="goDetail(item)">
                    <div class="list-wrapper">
                      <div class="pointer"></div>
                      <p class="text" v-text="item.topicContent"></p>
                      <ul class="imgs" v-if="item.annexs.length > 1">
                        <li v-for="img in item.annexs">
                          <!--<img v-if="img.name" :src="img.name" alt="">-->
                          <j-img v-if="img.name" :osskey="img.name" :custom-width="154" :custom-height="154"></j-img>
                          <img v-if="!img.name" src="../../../assets/images/studio_Illustration_200.png" alt="">
                        </li>
                      </ul>
                      <ul class="imgs-single" v-if="item.annexs.length === 1">
                        <li v-for="img in item.annexs">
                          <!--<img v-if="img.name" :src="img.name" alt="">-->
                          <j-img v-if="img.name" :osskey="img.name" :custom-width="310" :custom-height="200"></j-img>
                          <img v-if="!img.name" src="../../../assets/images/studio_Illustration_200.png" alt="">
                        </li>
                      </ul>
                      <div class="operate-part">
                        <div class="time" v-text="item.intime"></div>
                        <div class="operate">
                          <div class="like">
                            <img v-show="item.isPraised === 0" src="../../../assets/images/like_icon_42gray.png" alt="" @click.stop="like(item)">
                            <img v-show="item.isPraised === 1" src="../../../assets/images/liked_icon_56red.png" alt="" @click.stop="dislike(item)">
                            <span class="number" v-text="item.topicPraise"></span>
                          </div>
                          <div class="comment">
                            <img src="../../../assets/images/comment_icon_42gray.png" alt="" @click.stop="comment(item)">
                            <span class="number" v-text="item.topicMsgcnt"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </j-pull>
    </view-box>
    <div v-transfer-dom>
      <popup v-model="showCommentField" height="100%" style="background-color: #ffffff">
        <div class="commentPopup">
          <x-header
            left-options.preventGoBack="true"
            title="">
            <a slot="overwrite-left" @click="close" style="color: #333333">取消</a>
            <a slot="right" @click="subComment()">发送</a>
          </x-header>
          <group>
            <x-textarea :max="500" ref="textArea" v-model="commentText" class="commentField" placeholder="写评论..." :show-counter="false" :height="200" :rows="8" :cols="30"></x-textarea>
          </group>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <x-dialog class="cancel-order-wrapper" v-model="isShowDialog" :dialog-style="showDialogStyle" hide-on-blur>
        <span class="delete-info vux-1px-b">该功能只在“回来啦社区”APP中提供，跳转至APP？</span>
        <div class="operate-wrapper">
          <span class="text vux-1px-r" @click="isShowDialog = false">取消</span>
          <span class="text" @click="open">确定</span>
        </div>
      </x-dialog>
      <x-dialog class="close-mask" v-model="isClose">
        <span>达人已关闭</span>
        <span>如有问题请联系生活服务中心</span>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import {TransferDom, XHeader, ViewBox, querystring, Popup, Group, XTextarea, XDialog} from 'vux'
  import JPull from '../../base/JPull/JPull'
  import JImg from 'components/common/img/jImg'
  import open from '../../../common/js/openApp'
  export default {
    name: 'topicList',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      JPull,
      ViewBox,
      Popup,
      Group,
      XTextarea,
      'j-img': JImg,
      'x-dialog': XDialog
    },
    props: {
      id: ''
    },
    data () {
      return {
        list: [], // 动态列表
        ownerName: '', // 动态用户名称
        from: '', // 地址
        labels: [], // 标签
        introduce: '', // 介绍
        headPic: '', // 头像
        workRoomId: '', // 达人id
        workroomPic: '', // 工作室背景图
        showCommentField: false,
        commentText: '',
        curItem: null, // 当前所选动态项
        userId: '', // 当前用户的userId
        ownerId: '', // 当前达人的userId
        title: '', // 标题
        curPage: 1, // 当前页码
        isShowDialog: false,
        isClose: false,
        showDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 18px 0 18px',
          borderRadius: '20px'
        }
      }
    },
    computed: {
    },
    created () {
      this.getCurrentUser();
      this.getDetail();
      this.getList();
    },
    methods: {
      // 达人详情
      getDetail () {
        let url = `${window.oldBaseURL}/scNeighborGroupActionV36!workRoomDetail.action`;
        let params = {};
        if (this.id) {
          params.workRoomId = this.id;
        }
        this.fetchFormData(url, params, data => {
          const { shopName, from, headPic, introduce, label, workRoomId, ownerId, ownerName, workroomPic, workroomStatus } = data;
          this.shopName = shopName;
          this.from = from;
          this.introduce = introduce;
          this.labels = label.split(',');
          this.workRoomId = workRoomId;
          this.ownerId = ownerId;
          this.ownerName = ownerName;
          this.title = shopName;
          this.workroomPic = workroomPic; // 工作室背景图
          this.headPic = headPic;
          this.isClose = workroomStatus === 0;
        });
      },

      // 编辑
      edit () {
        this.$router.push({path: '/darenApply', query: {id: this.workRoomId, title: '编辑达人'}})
      },

      info () {
        this.isShowDialog = true;
      },
      open () {
        open();
      },
      // 达人动态
      getList (loaded) {
        let url = `${window.oldBaseURL}/scNeighborActionV36!neighborList.action`;
        let params = {
          topicType: 7, // 话题类型
          curPage: this.curPage
        };
        if (this.id) {
          params.objId = this.id; // 原工作室id
        }
        this.$vux.loading.show({
          text: '加载中'
        });
        this.fetchFormData(url, params, data => {
          const { resultList, curPage, maxPage } = data;
          this.list = [...this.list, ...resultList];
          if (loaded) loaded(curPage <= maxPage)
          this.$vux.loading.hide();
        });
      },

      refreshData (loaded) {
        this.curPage = 1;
        this.list = [];
        this.getList(loaded);
      },
      loadMore (loaded) {
        this.curPage ++;
        this.getList(loaded);
      },
      publish () {
        if (this.workRoomId) {
          this.$router.push({path: '/pub_newThings', query: {tid: this.workRoomId, type: 7}})
        }
      },
      like (item) {
        let params = {
          neighborId: item.id,
          type: 0
        };
        this.$JHttp({
          method: 'post',
          url: `${window.baseURL}/neighbor/addPraise?${querystring.stringify(params)}`
        }).then(res => {
          if (res.status === 100) {
            // 点赞
            item.isPraised = 1;
            item.topicPraise += 1;
          }
        }).catch(e => {
          console.log(e)
        })
      },
      dislike (item) {
        let params = {
          neighborId: item.id
        };
        this.$JHttp({
          method: 'put',
          url: `${window.baseURL}/neighbor/cancelPraise?${querystring.stringify(params)}`
        }).then(res => {
          if (res.status === 100) {
            // 取消点赞
            item.isPraised = 0;
            item.topicPraise -= 1;
          }
        }).catch(e => {
          console.log(e)
        })
      },
      comment (item) {
        this.showCommentField = true;
        this.curItem = item;
      },
      close () {
        this.showCommentField = false;
        this.commentText = '';
      },
      // 发送评论
      subComment () {
        if (!this.commentText.trim()) {
          this.$vux.toast.show({
            type: 'text',
            text: '评论内容不能为空！'
          })
          return
        }
        let params = {
          messageInfo: this.commentText
        }
        if (this.curItem) params.neighbourId = this.curItem.id;
        let url = `${window.oldBaseURL}/scNeighborActionV36!neighbourComments.action`
        this.fetchFormData(url, params, data => {
          this.curItem.topicMsgcnt ++;
          this.close();
        });
      },

      // 跳转动态详情
      goDetail (item) {
        this.$router.push({path: `/newThingsDetail/${item.id}`});
      },

      // 获取当前用户信息
      getCurrentUser () {
        this.$JHttp({
          methods: 'get',
          url: window.baseURL + '/home/getUserInfoAndAsset',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            const { userId } = res.data;
            // 保存当前用户信息，动态详情有用到
            localStorage.setItem('userId', userId);
            this.userId = userId;
          }
        }).catch(e => {
          console.log(e)
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .customer-img{
    position: relative;
    img{
      width: 100%;
    }
    .img-wrapper{
      height: 250px;
      overflow: hidden;
      img {
        min-height: 250px;
      }
    }
  }
  .mask{
    width: 100%;
    min-height: 250px;
    position: absolute;
    top: 0;
    background: linear-gradient(to bottom,rgba(255,255,255,0) 180px,rgba(255,255,255,1) 250px);
    z-index: 1;
  }
  .right-btn{
    margin-top: -7px;
  }
  .content{
    margin-top: -25px;
    padding: 0 15px;
    position: relative;
    z-index: 10;
    .info{
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      .title{
        font-size: 18px;
        margin-bottom: 4px;
      }
    }
    .avatar{
      width: 57px;
      height: 57px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 8px;
      img {
        width: 57px;
        height: 57px;
      }
    }
    .edit-btn{
      width: 60px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      border-radius: 12.5px;
      border: 1px solid #0DAB60;
      color: #0DAB60;
      background-color: transparent;
    }
    .brief{
      display: flex;
      width: 100%;
    }
    .address{
      font-size: 12px;
      img{
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }
    .tags-part{
      margin-top: 25px;
      display: flex;
      span{
        font-size: 12px;
        margin-right: 5px;
      }
      .tags{
        display: flex;
        flex-wrap: wrap;
      }
    }
    .name{
      font-size: 12px;
      margin-right: 42px;
      white-space: nowrap;
    }
    .introduce{
      font-size: 12px;
      margin-top: 16px;
      width: 100%;
      display: flex;
    }
    .states{
      margin-top: 16px;
      .title{
        font-size: 12px;
        margin-bottom: 13px;
      }
    }
    .states-list{
      margin-top: 23px;
      .text{
        font-size: 15px;
        margin-bottom: 11px;
      }
      &>li{
        margin-left: 10px;
        border-left: 1px solid #D3D3D3;
        padding-left: 23px;
        .list-wrapper{
          position: relative;
          top: -10px;
          .pointer{
            width: 9px;
            height: 9px;
            border-radius: 4px;
            background-color:  #D3D3D3;
            position: absolute;
            margin-left: -28px;
            margin-top: 6px;
          }
          padding-bottom: 34px;
        }
        &:last-child{
          .list-wrapper{
            padding-bottom: 0;
          }
        }
        .imgs{
          display: flex;
          flex-wrap: wrap;
          li{
            overflow: hidden;
            margin-right: 1.5px;
            margin-top: 1.5px;
            width: 153px;
            height: 153px;
          }
        }
        .imgs-single{
          li{
          }
          img{
            min-height: 200px;
          }
        }
        .operate-part{
          margin-top: 8px;
          display: flex;
          justify-content: space-between;
          .time{
            color: #aaa;
            font-size: 12px;
            line-height: 21px;
          }
          .operate{
            display: flex;
            .like{
              margin-right: 35px;
            }
            span.number{
              color: #aaa;
              font-size: 12px;
              display: inline;
            }
            img{
              height: 20px;
            }
          }
        }
      }
    }
    .states-list-wrapper{

    }
  }
  .daren-detail{
    height: 100%;
  }
  .cancel-order-wrapper {
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
  .close-mask /deep/ .weui-dialog {
    background-color: transparent;
    color: #fff;
  }
</style>
