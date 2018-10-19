<template>
  <div class="activityDetail commonHeader">
    <view-box ref="viewBox" :body-padding-top="(isApp && !headerRight.showMore) ? '0rem' : '1.253333rem'" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        v-if="!isApp || headerRight.showMore"
        :left-options="{backText: '', showBack: (isApp ? false : true)}"
        :right-options="headerRight"
        @on-click-more="goReport(detailObj)"
        title="活动"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div style="height: 100%">
        <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
          <div slot="jpull-list">
            <div class="detailBanner">
              <p v-if="detailObj.activityType === 1" class="officialTitle">{{detailObj.activityName}}</p>
              <div class="avatar">
                <div class="headTit">
                  <img v-if="detailObj.activityType === 0" :src="userInfo.headPicName" alt=""
                       @click="toPersonPage_(detailObj)">
                  <div class="name" @click="toPersonPage_(detailObj)">
                    <p class="nickName" v-if="detailObj.activityType === 0"><span>{{userInfo.nickname}}</span><i></i>
                    </p>
                    <p>{{detailObj.intime}}</p>
                  </div>
                </div>
                <p class="endTime" v-html="detailObj.activityStatus === 6 ? '活动取消' : detailObj.endTimeTag"></p>
              </div>
              <div class="introduce">
                <p v-if="detailObj.activityType === 0">{{detailObj.activityName}}</p>
                <ul>
                  <li>
                    <span>活动开始时间：</span>
                    <span>{{detailObj.startDate}}</span>
                  </li>
                  <li>
                    <span>活动地点：</span>
                    <span>{{detailObj.activityAddress}}</span>
                  </li>
                  <li v-if="detailObj.joinMoney > 0">
                    <span>报名费：</span>
                    <span>{{detailObj.joinMoney}}元/人</span>
                  </li>
                </ul>
                <p v-html="detailObj.content"></p>
              </div>
              <div class="bannerImg" v-show="imgList.length">
                <!--<img :src="detailObj.bannerPic" alt="">-->
                <div class="imgList">
                  <ul>
                    <li v-for="(item, index) in imgList" :class="{onePic: isOne}">
                      <!--<img class="previewer-demo-img" :src="item.src" alt="" @click="show(index)">-->
                      <j-img :osskey="item.src" v-if="isOne" :custom-class="'previewer-demo-img'" :custom-width="345" :custom-height="200" @click.native="show(index)"></j-img>
                      <j-img :osskey="item.src" v-if="!isOne" :custom-class="'previewer-demo-img'" :custom-width="105" :custom-height="105" @click.native="show(index)"></j-img>
                    </li>
                  </ul>
                  <div v-transfer-dom v-if="imgList">
                    <previewer :list="imgList" ref="previewer" :options="options"></previewer>
                  </div>
                </div>
              </div>
            </div>
            <div class="commentList no-margin-top">
              <group>
                <cell-box is-link class="accountList" @click.native="toCordinator(detailObj)"
                          v-if="detailObj.userRole===1||detailObj.needHelp===1">
                  <div>
                    <span>活动协办人</span>
                  </div>
                </cell-box>
              </group>
              <group v-if="detailObj.activityStatus>2">
                <cell-box is-link class="accountList" @click.native="goToBalance"
                          v-if="detailObj.isBalanced===1||detailObj.userRole===1">
                  <div>
                    <span>活动结算</span>
                  </div>
                </cell-box>
              </group>
              <group>
                <cell-box is-link class="joinList" @click.native="toPraiseList(detailObj)"
                          v-show="detailObj.applyUserCount">
                  <div>
                    <span>共{{detailObj.applyUserCount}}人参与</span>
                    <ul>
                      <li v-for="item in joinUser" v-show="showApplyUserAvatar">
                        <img :src="item.joinUserPhoto" alt="" v-if="item.joinUserPhoto">
                        <img src="../../../assets/images/default_avatar.png" alt="" v-if="!item.joinUserPhoto">
                        <!--<cell-box is-link class="joinList" @click.native="toPraiseList(detailObj)">-->
                        <!--<div>-->
                        <!--<span>共{{detailObj.applyUserCount}}人参与</span>-->
                        <!--<ul>-->
                        <!--<li v-for="item in applyUserInfo">-->
                        <!--&lt;!&ndash;<img :src="item.joinUserPhoto" alt="">&ndash;&gt;-->
                        <!--<img :src="item" alt="" v-if="item">-->
                        <!--<img src="../../../assets/images/default_avatar.png" alt="" v-if="!item">-->
                      </li>
                    </ul>
                  </div>
                </cell-box>
              </group>

              <group class="commentCell" v-show="commentList.length > 0">
                <cell-box class="commentTotal">
                  <span>共{{commentList.length}}条评论</span>
                </cell-box>
                <cell-box class="comments" v-for="(_item, index) in commentList" :key="index"
                          @click.native="replyMsg(_item, index, detailObj)">
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
              <div class="noComment" v-show="commentList.length <= 0">
                <div>还没有人评论</div>
                <div @click="addComment(detailObj)">
                  <img :src="currentUser.headPicName" alt="" v-show="currentUser.headPicName">
                  <span>拼的就是速度，抢个沙发...</span>
                </div>
              </div>
            </div>
          </div>
        </j-pull>
      </div>
      <div class="bottomLikeTab">
        <div class="commentTab" @click="addComment(detailObj)">
          <i></i>
          <span>评论</span>
        </div>
        <div class="albumTab" @click="goToAlbum" v-show="detailObj.activityStatus>3">
          <i></i>
          <span>活动相册</span>
        </div>
        <div class="joinTab" @click="goToSignUp(detailObj)"
             v-show="!isMyActivity&&detailObj.activityStatus<=3">
          <i></i>
          <span>报名</span>
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
            <a slot="overwrite-left" @click="close" style="color: #333333">取消</a>
            <a slot="right" @click="subComment">发送</a>
          </x-header>
          <group>
            <x-textarea :max="500" v-model="commentText" class="commentField" placeholder="说点什么吧" :show-counter="false"
                        :rows="1" autosize></x-textarea>
          </group>
        </div>
      </popup>
    </div>
    <!--举报开始-->
    <div v-transfer-dom>
      <actionsheet
        :menus="reportMenu"
        @on-click-menu="onReport"
        v-model="showMenus"
        show-cancel></actionsheet>
    </div>
    <!--举报结束-->
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
  import JPull from '../../base/JPull/JPull'
  import {initWXShare} from '../../../common/js/share'
  import {JURL} from '../../../common/js/utils';
  import JImg from 'components/common/img/jImg'
  import {
    XHeader,
    ViewBox,
    Actionsheet,
    TransferDom,
    Previewer,
    Group,
    CellBox,
    Popup,
    XTextarea,
    XDialog,
    querystring
  } from 'vux'
  const scope = 'snsapi_base' // snsapi_userinfo
  export default {
    name: 'activityDetail',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      ViewBox,
      JPull,
      Actionsheet,
      Previewer,
      Group,
      CellBox,
      Popup,
      XDialog,
      XTextarea,
      'j-img': JImg
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 开启分享功能入口
        vm.$wechat.showOptionMenu();
      });
    },
    beforeRouteLeave (to, from, next) {
      // 隐藏分享功能入口
      this.$wechat.hideOptionMenu();
      next();
    },
    data () {
      return {
        headerRight: {showMore: false},
        showMenus: false,
        reportMenu: {},
        curPage: 1,
        pageSize: 20,
        hasMore: false,
        userInfo: {},
        imgList: [],
        applyUserInfo: {},
        joinUser: [],
        showApplyUserAvatar: true,
        showRightArrow: true,
        clickAble: true,
        commentList: [],
        isMyActivity: false,
        isOne: false,
        isTwo: false,
        detailObj: {},
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
        menuOpt: {},
        showMenuOpt: false,
        showCordinatorOpt: false,
        messageId: '',
        msgIndex: '',
        curTopic: {},
        currentUser: {},
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        },
        isApp: ''
      }
    },
    created () {
      this.isApp = localStorage.getItem('isApp')
      this.getActivityData();
      this.getCommentList();
      this.getApplyList();
      this.getCurrentUser();
      let fromOauth = JURL.getHashParam('fromOauth');
      let token = localStorage.getItem('token');
      if (fromOauth === '1' && !token) {
        this.$router.push('/Login');
      }
    },
    methods: {
      oauth () {
        let path = location.pathname;
        let commonPath = path.substr(0, path.lastIndexOf('/'));
        let activityId = this.$route.params.activityId;
        let redirectURI = location.origin + commonPath + '/middle.html?path=activityDetail/' + activityId + '&fromOauth=1';
        let postData = {
          redirectURI: redirectURI,
          scope: scope
        };
        this.$JHttp({
          url: window.baseURL + '/weixin/oauth2/authorize',
          method: 'post',
          data: postData
        }).then((res) => {
          window.location.href = res;
        }).catch(e => {
          console.log(e);
        });
      },
      goToBind () {
        let state = JURL.getHashParam('state');
        // 说明是从分享进来的,需要授权
        if (state === 'activityDetail') {
          this.oauth();
        }
      },
      bindSoon () {
        this.deleteModalShow = false;
      },
      refreshData (loaded) {
        this.curPage = 1;
        this.commentList = [];
        this.getActivityData(loaded);
        this.getCommentList(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getCommentList(loaded);
      },
      getActivityData (loaded) {
        this.$vux.loading.show({
          text: '加载中'
        });
        let activityId = this.$route.params;
        let _this = this;
        this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getActivityDetail?' + querystring.stringify(activityId),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (loaded) {
            loaded()
          }
          if (res.status === 100) {
            this.$vux.loading.hide();
            _this.detailObj = res.data;
            console.log('detailObj', _this.detailObj)
            _this.imgList = _this.getImgList(this.detailObj.picList);
            _this.userInfo = _this.detailObj.userInfo;
            _this.applyUserInfo = _this.detailObj.applyUserAvatarList
            if (_this.imgList) {
              let length = _this.imgList.length;
              if (length === 1) {
                _this.isOne = true
              } else if (length === 2) {
                _this.isTwo = true
              }
            }
//            let userId = localStorage.getItem('userId');
            if (_this.detailObj.userRole === 1) {
              _this.isMyActivity = true
              _this.headerRight.showMore = true

//              this.showApplyUserAvatar = false
            }
//            let link = window.location.href + '?out=1';
            // 拼接code的地址
            let location = window.location;
            let path = location.pathname;
            let commonPath = path.substr(0, path.lastIndexOf('/'));
            let linkURL = location.origin + commonPath + '/middle.html?path=activityDetail/' + activityId.activityId + '&state=activityDetail';
            let shareData = {
              title: _this.detailObj.activityName,
              desc: _this.detailObj.activityAddress, // 分享描述
              link: linkURL,
              imgUrl: _this.detailObj.activityPicture // 自定义图标
            }
            initWXShare(_this.$wechat, 'timeLine', shareData);
            initWXShare(_this.$wechat, 'appMessage', shareData);
            initWXShare(_this.$wechat, 'qq', shareData);
          } else if (res.status === 105) {
            this.deleteModalShow = true
          } else {
            this.$vux.loading.hide();
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      getCommentList (loaded) {
        let params = {
          neighborId: this.$route.params.activityId,
          curPage: this.curPage,
          pageSize: this.pageSize
        };
        let _this = this;
        this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getCommentList?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (loaded) {
            loaded(_this.hasMore)
          }
          if (res.status === 100) {
            _this.commentList = _this.commentList.concat(res.data.resultList)
          }
        }).catch(e => {
          console.log(e)
        })
      },
      getApplyList () {
        let activityId = this.$route.params;
        let _this = this;
        this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getApplyUserList?' + querystring.stringify(activityId)
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            _this.applyUserInfo = res.data;
            if (!data.myself) {
              if (!data.needUserDetail) {
                _this.showApplyUserAvatar = false;
                _this.showRightArrow = false;
                _this.clickAble = false
              } else {
                _this.showApplyUserAvatar = true;
              }
            } else {
              if (!data.needUserDetail) {
                _this.showApplyUserAvatar = false;
              }
            }
            console.log(data)
            data.applyItemList.forEach(val => {
              let list = val.joinUserList
              list.forEach(item => {
                _this.joinUser.push(item)
              })
            })
            _this.joinUser = _this.joinUser.splice(0, 6)
          }
        }).catch(e => {
          console.log(e)
        })
      },
      getCurrentUser () {
        let _this = this;
        let userId = {
          userId: localStorage.getItem('userId')
        }
        console.log(userId)
        _this.$JHttp({
          methods: 'get',
          url: window.baseURL + '/home/getUserInfoAndAsset',
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
      goToSignUp (val) {
        let token = localStorage.getItem('token');
        if (!token) {
          this.deleteModalShow = true
        } else {
          let status = val.activityStatus
          if (status === 1) {
            this.$vux.toast.show({
              type: 'text',
              text: '报名未开始，请耐心等待'
            })
          } else if (status === 2) {
            let params = {
              joinOtherCommunity: val.joinOtherCommunity,
              communityId: val.communityId
            }
            let _this = this;
            _this.$JHttp({
              method: 'get',
              url: window.baseURL + '/socialactivity/validateJoinOtherCommunity?' + querystring.stringify(params)
            }).then(res => {
              if (res.status === 100) {
                if (val.limitCount && val.applyUserCount >= val.limitCount) {
                  _this.$vux.toast.show({
                    type: 'text',
                    text: '报名人数满了，下次再来吧'
                  })
                } else {
                  _this.$router.push('/signUp/' + val.activityId)
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
          } else if (status === 6) {
            this.$vux.toast.show({
              type: 'text',
              text: '很遗憾，活动取消啦'
            })
          } else {
            this.$vux.toast.show({
              type: 'text',
              text: '来晚一步，报名已结束'
            })
          }
        }
      },
      toPraiseList (val) {
        this.$router.push('/signUpPeople/' + val.activityId)
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
      clickCancelAndMask () {
        this.messageId = ''
      },
      clickMenu (key, item) {
        console.log(key, item);
        let token = localStorage.getItem('token');
        if (!token) {
          this.deleteModalShow = true
        } else {
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
                this.commentList.splice(this.msgIndex, 1);
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
        }
      },
      addComment (value) {
        let token = localStorage.getItem('token');
        if (!token) {
          this.deleteModalShow = true
        } else {
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
            neighborId: this.topic.activityId,
            messageId: this.messageId,
            message: this.commentText,
            type: 2
          };
          this.$JHttp({
            method: 'post',
            url: window.baseURL + '/socialactivity/addComment?' + querystring.stringify(params),
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            if (res.status === 100) {
              this.$vux.toast.show({
                type: 'success',
                text: '评论成功'
              });
              this.commentList.unshift(res.data);
              this.topic.commentCount = this.topic.commentCount + 1;
              this.commentText = '';
              this.messageId = '';
              this.showCommentField = false
            } else {
              this.$vux.toast.show({
                type: 'cancel',
                text: res.msg
              });
            }
          }).catch(e => {
            console.log(e)
          })
        }
      },
      toPersonPage (value) {
        if (!this.isApp) {
          let id = value.userId;
          this.$router.push('/personPage/' + id)
        }
      },
      toPersonPage_ (value) {
        if (!this.isApp) {
          let id = value.userInfo.id;
          this.$router.push('/personPage/' + id)
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
      show (index) {
        this.$refs.previewer.show(index)
      },
      goReport (value) {
        let userId = localStorage.getItem('userId');
        if (value.userInfo.id === userId) {
          if (value.activityStatus === 6) {
            this.reportMenu = {
              delActivity: '删除'
            }
          } else {
            this.reportMenu = {
              cancelActivity: '取消活动'
//            report: '举报'
            }
          }
          this.showMenus = true
        }
      },
      close () {
        this.showCommentField = false;
        this.commentText = ''
      },
      onReport (key) {
        if (key === 'cancelActivity') {
          if (this.detailObj.activityStatus <= 3 && this.detailObj.withdrawFlag === 0) {
            // 可以取消您已提现不能取消活动啦
            let _this = this
            _this.$vux.confirm.show({
              title: '取消活动',
              content: '确定取消活动？',
              onConfirm () {
                let params = {
                  activityId: _this.$route.params.activityId
                }
                _this.$JHttp({
                  method: 'post',
                  url: window.baseURL + '/socialactivity/cancelActivity?' + querystring.stringify(params),
                  headers: {
                    defCommunityId: localStorage.getItem('communityId')
                  }
                }).then(res => {
                  console.log(res)
                  if (res.status === 100) {
                    _this.$vux.toast.show({
                      type: 'success',
                      text: '活动已取消'
                    })
                    _this.reportMenu = {
                      delActivity: '删除'
                    }
                    setTimeout(function () {
                      window.location.reload()
                    }, 1000)
                  }
                }).catch(e => {
                  console.log(e)
                })
              }
            })
          } else if (this.detailObj.activityStatus === 4) {
            this.$vux.toast.show({
              type: 'text',
              text: '活动已开始，不能取消啦'
            })
          } else if (this.detailObj.activityStatus === 5) {
            this.$vux.toast.show({
              type: 'text',
              text: '活动已结束，不能取消啦'
            })
          } else if (this.detailObj.withdrawFlag !== 0) {
            this.$vux.toast.show({
              type: 'text',
              text: '您已提现不能取消活动啦'
            })
          }
          console.log('cancelActivity')
        } else if (key === 'delActivity') {
          let _this = this;
          _this.$vux.confirm.show({
            title: '删除活动',
            content: '确定删除活动？',
            onCancel () {
//                console.log('plugin cancel')
            },
            onConfirm () {
              let params = {
                activityId: _this.$route.params.activityId
              }
              _this.$JHttp({
                method: 'put',
                url: window.baseURL + '/socialactivity/closedSocialHllActivity?' + querystring.stringify(params),
                headers: {
                  defCommunityId: localStorage.getItem('communityId')
                }
              }).then(res => {
                console.log(res)
                if (res.status === 100) {
                  _this.$vux.toast.show({
                    type: 'success',
                    text: '删除成功'
                  })
                  _this.$router.go(-1)
                }
              }).catch(e => {
                console.log(e)
              })
            }
          })
        }
      },
      toCordinator (val) {
        let _this = this
        if (_this.detailObj.userRole === 1 && _this.detailObj.needHelp === 0) {
          this.$router.push('/cordinatorActive/' + val.activityId)
        } else {
          this.$router.push('/cordinatorList/' + val.activityId)
        }
      },
      goToAlbum () {
        this.$router.push('/albumList/' + this.$route.params.activityId)
      },
      goToBalance () {
        let _this = this
        if (_this.detailObj.isBalanced === 0 && _this.detailObj.userRole === 1) {
          _this.$router.push('/activityBalance/' + _this.$route.params.activityId)
        } else {
          _this.$router.push('/balanceList/' + _this.$route.params.activityId)
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .activityDetail {
    height: 100%;
    background-color: #f7f7fa;
    .detailBanner {
      background-color: #ffffff;
      padding: 0 15px;
      .officialTitle {
        padding-top: 10px;
        font-size: 24px;
        font-weight: 700;
        color: #333333;
        word-break: break-all;
        letter-spacing: 0.29px;
      }
      .avatar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 15px;
        .headTit {
          flex: 1;
          display: flex;
          align-items: center;
          img {
            width: 40px;
            height: 40px;
            margin-right: 8px;
            border-radius: 50%;
          }
          .name {
            flex: 1;
            font-size: 10px;
            color: #aaaaaa;
            .nickName {
              display: flex;
              align-items: center;
              span {
                font-size: 15px;
                color: #333333;
              }
              i {
                height: 16px;
                margin-left: 8px;
                width: 45px;
                background: url("../../../assets/images/owner_icon_32.png") no-repeat center;
                background-size: contain;
              }
            }
          }
        }
        .endTime {
          font-size: 12px;
          color: #aaaaaa;
        }
      }
      .tit {
        font-size: 24px;
        color: #333333;
        padding: 0 .3rem;
      }
      .introduce {
        padding-bottom: 10px;
        p {
          margin-top: 15px;
          font-size: 15px;
          color: #333333;
          word-wrap: break-word;
        }
        ul {
          margin-top: 15px;
          li {
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            span {
              font-size: 15px;
              color: #869DC7;
              word-break: break-all;
            }
            span:last-child {
              flex: 1;
            }
          }
        }
      }
      .bannerImg {
        margin-top: 15px;
        .imgList {
          padding-bottom: 15px;
          ul {
            display: flex;
            flex-wrap: wrap;
            li {
              width: 113.5px;
              height: 113.5px;
              margin-bottom: 2px;
              margin-left: 1.25px;
              overflow: hidden;
              display: flex;
              align-items: center;
              img {
                width: 100%;
                height: 50vw;
              }
            }
            .onePic {
              overflow: hidden;
              display: flex;
              align-items: center;
              width: 100%;
              height: 200px;
              img {
                width: 100%;
                height: auto;
              }
            }
            li:nth-child(3n+1) {
              margin-left: 0;
            }
          }
        }
        .activityReq {
          margin-top: 15px;
          padding: 0 15px;
          p {
            font-size: 18px;
            color: #333333;
          }
        }
      }
    }
    .commentList {
      margin-top: 10px;
      background-color: #ffffff;
      .joinList {
        div {
          display: flex;
          align-items: center;
          width: 100%;
          span {
            font-size: 15px;
            color: #aaaaaa;
          }
          ul {
            display: flex;
            align-items: center;
            flex: 1;
            li:first-child {
              margin-left: 0;
            }
            li {
              width: 26px;
              height: 26px;
              border: 4px solid #ffffff;
              border-radius: 50%;
              margin-left: -9px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
        }
      }
      .accountList {
        padding: 10px 0 10px 0;
        margin: 0 0 0 15px;
        border-bottom: 0.5px solid #d8d8d8;
        div {
          display: flex;
          align-items: center;
          span {
            font-size: 15px;
            color: #333;
          }
        }
        ::after {
          border-bottom: none;
        }
      }
      .commentCell {
        .commentTotal {
          font-size: 15px;
          color: #aaaaaa;
        }
        .comments {
          justify-content: space-between;
          align-items: flex-start;
          .left {
            flex: 1;
            display: flex;
            align-items: flex-start;
            .avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
            .content {
              flex: 1;
              margin-left: 15px;
              .user {
                font-size: 12px;
                margin-bottom: .05rem;
              }
              div, p {
                display: inline;
                font-size: 15px;
                word-break: break-all;
                word-wrap: break-word
              }
              .user_1 {
                color: #0DAB60;
              }
              .reply {

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
          .time {
            margin-left: 5px;
            color: #aaaaaa;
            font-size: 12px;
          }
        }
      }
      .noComment {
        padding: 0 15px 15px 15px;
        div:first-child {
          padding: 15px 0 20px 0;
          border-bottom: 0.5px solid #D8D8D8;
          font-size: 14px;
          color: #000000;
        }
        div:last-child {
          padding-top: 15px;
          display: flex;
          align-items: center;
          img {
            width: 40px;
            height: 42px;
            border-radius: 50%;
          }
          span {
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
        span {
          margin-left: 10px;
        }
      }
      .joinTab {
        border-left: 0.5px solid #D8D8D8;
        i {
          background-image: url("../../../assets/images/enroll_icon_56black.png");
        }
        .like {
          background-image: url("../../../assets/images/liked_icon_56red.png");
        }
      }
      .commentTab {
        i {
          background-image: url("../../../assets/images/comment_icon_56black.png");
        }
      }
      .albumTab {
        border-left: 0.5px solid #D8D8D8;
        i {
          background-image: url("../../../assets/images/album_tab.png");
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
