<template>
  <div class="signUpDetails commonHeader">
    <x-header
      slot="header"
      :left-options="{showBack: false}" title="签到详情">
    </x-header>
    <div class="signUp" v-show="!showBlankPage">
      <div class="signUp_tit">
        <div class="tit_img">
          <img v-show="joinUsersInfo.joinUserPhoto" :src="joinUsersInfo.joinUserPhoto" alt="">
          <img v-show="!joinUsersInfo.joinUserPhoto" src="../../../assets/images/default_avatar.png" alt="">
        </div>
        <div class="tit_name"><!--joinUserSex -->
          <div class="name">
            <span>{{joinUsersInfo.joinUserName}}</span>
            <i v-show="joinUsersInfo.needUserDetail" :class="{male: joinUsersInfo.joinUserSex === 1, 'female': joinUsersInfo.joinUserSex === 2}"></i>
          </div>
          <div class="type">参与人</div>
        </div>
        <div class="phone" v-if="joinUsersInfo.needUserDetail === 1 && joinUsersInfo.signStatus === 0">
          <a style="width: 100%;height: 100%;display: block;" :href="'tel:' + joinUsersInfo.joinUserPhone"></a>
        </div>
      </div>
      <div class="segmentation"></div>
      <div class="activity_detail">
        <div class="activity_name">
          {{joinUsersInfo.activityName}}
        </div>
        <div class="activity_information">
          <p>活动开始时间：{{joinUsersInfo.startDate}}</p>
          <p>活动地点：{{joinUsersInfo.activityAddress}}</p>
          <p v-if="joinUsersInfo.joinMoney > 0">报名费：{{joinUsersInfo.joinMoney}}</p>
        </div>
      </div>
      <div class="segmentation"></div>
      <div class="joinPeople_detail" v-show="applyUser">
        <div class="join_people">
          <div class="join_name">
            报名人：{{applyUser.userName || applyUser.nickname}}
          </div>
          <div class="phone">
            <a style="width: 100%;height: 100%;display: block;" :href="'tel:' + applyUser.mobileNum"></a>
          </div>
        </div>
        <div class="join_people" style="border-bottom: none">
          <div class="join_name">
            <div v-show="!joinUsersInfo.ownerAffirm" class="joinAddress">
              <span>报名人住址：</span>
              <span>{{joinUsersInfo.applyUserAddress}}</span>
            </div>
            <span v-show="joinUsersInfo.ownerAffirm">报名人住址： - </span>
          </div>
        </div>
      </div>
      <div class="segmentation"></div>
      <div class="sign" v-if="joinUsersInfo.signStatus === 1">
        <div class="join_people">
          <div class="join_name">
            签到记录
          </div>
        </div>
        <div class="sign_time">
          <i class="sign_img"></i>
          <span class="sign_data">{{joinUsersInfo.signDate}}</span>
        </div>
      </div>
    </div>
    <div class="sign_bottom" v-show="!showBlankPage">
      <span v-if="joinUsersInfo.activityStatus  <= 3">{{joinUsersInfo.startDate }} 后可签到</span>
      <span v-if="joinUsersInfo.signStatus === 0 && joinUsersInfo.activityStatus  > 3" style="background-color:  #0DAB60;" @click="goSign">签到</span>
      <span v-if="joinUsersInfo.signStatus === 1">已签到</span>
    </div>
    <div class="noContent_app" v-show="showBlankPage">
      <div>
        <img src="../../../assets/images/No-delivery.png" alt="">
        <span>无效二维码</span>
      </div>
    </div>
  </div>
</template>
<script>
  import { XHeader, querystring } from 'vux'
  import {JURL} from '../../../common/js/utils';
  export default {
    name: 'signUpDetails',
    components: {
      XHeader
    },
    data () {
      return {
//        businessParam: ''
        isApp: '',
        joinUsersInfo: {},
        applyUser: {},
        signId: '',
        showBlankPage: ''
      }
    },
    created () {
      this.isApp = localStorage.getItem('isApp');
      this.validateSign()
    },
    methods: {
      validateSign () {
        let _this_ = this;
        let token = localStorage.getItem('token');
        if (token) {
//          let isApp = JURL.getSearchParam('isApp') || JURL.getHashParam('isApp');
          if (_this_.isApp) {
            let code = JURL.getSearchParam('idCode') || JURL.getHashParam('idCode')
            _this_.getSignInfo(code)
          } else {
            let butler = JURL.getSearchParam('forButler') || JURL.getHashParam('forButler')
            if (butler) {
              // 微信端扫到管理后台的活动
              _this_.showBlankPage = true
              _this_.$vux.toast.show({
                type: 'text',
                text: '您只能签到自己发起的活动'
              });
              setTimeout(function () {
                _this_.$wechat.closeWindow()
              }, 2000)
            } else {
              // 根据state,获取基础信息
              let state = JURL.getHashParam('state');
              // 根据state获取业务参数
              this.$JHttp({
                url: window.baseURL + '/weixin/oauth2/getState?state=' + state,
                method: 'get'
              }).then((res) => {
                if (res.status === 100) {
                  console.log(99999, res)
                  let code = res.data.idCode
                  _this_.getSignInfo(code)
                } else {
                  _this_.$vux.toast.show({
                    type: 'cancel',
                    text: res.msg
                  });
                }
              }).catch(e => {
                console.log(e);
              })
            }
          }
        } else {
          _this_.$vux.toast.show({
            type: 'text',
            text: '对不起，您不是活动发起人，无权进行此项操作'
          })
          setTimeout(function () {
            _this_.$router.push('/')
          }, 2000)
        }
      },
      getSignInfo (val) {
        let _this = this;
        let params = {
          joinCode: val
        }
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getSignInfo?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            let id = localStorage.getItem('userId')
            if (id === res.data.releaseUserId) {
              _this.showBlankPage = false
              _this.joinUsersInfo = res.data
              _this.applyUser = res.data.applyUser
              _this.signId = res.data.joinUserDetailId;
              if (_this.joinUsersInfo.applyUserAddress) {
                _this.joinUsersInfo.applyUserAddress = _this.joinUsersInfo.applyUserAddress.replace(/>/g, '')
              }
            } else {
              _this.showBlankPage = true
              _this.$vux.toast.show({
                type: 'text',
                text: '您只能签到自己发起的活动'
              });
              setTimeout(function () {
                _this.$wechat.closeWindow()
              }, 2000)
            }
          } else {
            _this.$vux.toast.show({
              type: 'text',
              text: res.msg
            });
          }
        }).catch(e => {
          console.log(e)
        })
      },
      goSign () {
        console.log(location.href)
//        alert('当前URL：' + location.href)
        let _this = this;
        let params = {
          id: _this.signId
        }
        _this.$JHttp({
          method: 'post',
          url: window.baseURL + '/socialactivity/signActivity?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            console.log(res)
            _this.$vux.toast.show({
              type: 'success',
              text: '签到成功'
            });
            setTimeout(function () {
              window.location.reload()
//              window.location.href = location.href + '?time=' + ((new Date()).getTime());
//              alert('成功的URL：' + location.href)
            }, 2000)
          }
        }).catch(e => {
          console.log(e)
        })
      }
    }
  }
  /* eslint-disable no-useless-escape */
  function updateUrl (url, key) {
    var keys = (key || 't') + '=';  // 默认是"t"
    var reg = new RegExp(keys + '\\d+');  // 正则：t=1472286066028
    var timestamp = +new Date();
    if (url.indexOf(keys) > -1) { // 有时间戳，直接更新
      return url.replace(reg, keys + timestamp);
    } else {  // 没有时间戳，加上时间戳
      if (url.indexOf('\?') > -1) {
        var urlArr = url.split('\?');
        if (urlArr[1]) {
          return urlArr[0] + '?' + keys + timestamp + '&' + urlArr[1];
        } else {
          return urlArr[0] + '?' + keys + timestamp;
        }
      } else {
        if (url.indexOf('#') > -1) {
          return url.split('#')[0] + '?' + keys + timestamp + location.hash;
        } else {
          return url + '?' + keys + timestamp;
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .signUpDetails{
    width:100%;
    height:100%;
    background: #f7f7f7;
    .signUp {
      width:100%;
      margin-top: 10px;
      background: #ffffff;
      .signUp_tit{
        width: 93%;
        margin: 0 auto;
        height:40px;
        padding: 10px 0;
        line-height: 40px;
        position: relative;
        .phone{
          display: inline-block;
          position: absolute;
          right: 0;
          top:13.5px;
          width:28px;
          height:28px;
          background: url("../../../assets/images/consult_icon_black.png") left center;
          background-size: cover;
        }
        .tit_img{
          width: 40px;
          height: 40px;
          border-radius: 100%;
          display: inline-block;
          vertical-align: middle;
          img{
            width:100%;
            height:100%;
            border-radius: 100%;
          }
        }
        .tit_name{
          font-size: 15px;
          color: #333333;
          display: inline-block;
          margin-left: 10px;
          vertical-align: middle;
          .name{
            line-height: 21px;
            span{
              display: inline-block;
            }
            i{
              display: inline-block;
              width: 16px;
              height: 16px;
              margin-left: 10px;
              vertical-align: top;
              background-position: center;
              background-size: cover;
              background-repeat: no-repeat;
            }
            .male{
              background-image: url("../../../assets/images/male_icon_32.png");
            }
            .female{
              background-image: url("../../../assets/images/female_icon_32.png");
            }
          }
          .type{
            line-height:21px;
            color: #aaaaaa;
            font-size: 12px;
          }
        }
      }
      .segmentation{
        width:100%;
        height:10px;
        background: #f7f7f7;
      }
      .activity_detail{
        width: 93%;
        margin:0 auto;
        .activity_name{
          width:100%;
          height:21px;
          line-height: 21px;
          font-size: 18px;
          color: #333333;
          font-weight: 500;
          padding: 15px 0;
          border-bottom: solid 0.5px #d8d8d8;
        }
        .activity_information{
          width: 100%;
          color: #333333;
          font-size: 15px;
          padding:20px 0;
          p{
            height:21px;
            line-height: 21px;
            padding:5px 0;
            font-weight: 600;
          }
        }
      }
      .joinPeople_detail{
        width:93%;
        margin:0 auto;
        .join_people{
          width:100%;
          position: relative;
          border-bottom: solid 1px #d8d8d8;
          .join_name{
            color: #333333;
            font-size: 15px;
            font-weight: 600;
            padding: 17px 0;
            .joinAddress{
              display: flex;
              justify-content: flex-start;
              /*align-items: center;*/
              span{
                color: #333333;
                font-size: 15px;
                font-weight: 600;
                line-height: normal;
              }
              span:last-child{
                flex: 1;
              }
            }
          }
          .phone{
            display: inline-block;
            position: absolute;
            right: 0;
            top:13.5px;
            width:28px;
            height:28px;
            background: url("../../../assets/images/consult_icon_black.png") left center;
            background-size: cover;
          }
        }
      }
      .sign{
        width:93%;
        margin:0 auto;
        .join_people{
          width:100%;
          height:55px;
          line-height: 55px;
          border-bottom: solid 1px #d8d8d8;
          .join_name{
            color: #333333;
            font-size: 15px;
            font-weight: 600;
          }
        }
        .sign_time{
          width:100%;
          height:63px;
          line-height: 63px;
          font-size: 15px;
          font-weight: 600;
          color: #aaaaaa;
          display: flex;
          align-items: center;
          .sign_img{
            display: inline-block;
            width:12px;
            height:63px;
            background: url("../../../assets/images/flow_icon_express.png") center;
            background-size: cover;
            vertical-align: middle;
          }
          .sign_data{
            /*word-break: keep-all;*/
            flex: 1;
            vertical-align: middle;
            display: inline-block;
            margin-left: 10px;
          }
        }
      }
    }
    .sign_bottom{
      width:100%;
      height:50px;
      background: #aaaaaa;
      color: #ffffff;
      font-size: 18px;
      position: fixed;
      bottom:0;
      left:0;
      text-align: center;
      line-height: 50px;
    }
    .noContent_app{
      /*padding-top: 124px;*/
      width:100%;
      height:100%;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      div{
        margin-top: -113px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      img{
        width: 150px;
        height: 150px;
      }
      span{
        margin-top: 10px;
        font-size: 15px;
        color: #cccccc;
      }
    }
  }
</style>
