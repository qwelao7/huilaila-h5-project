<template>
  <div class="bind-wrapper" v-show="isReady">
    <div class="no-bind-wrapper" v-show="!isExit">
      <div class="content">
        <div class="title-wrapper">
          <span class="name-title">您的家人</span>
          <span class="name-value" v-text="houseInfo.realName"></span>
          <div class="name-text">邀请您回家</div>
        </div>
        <div class="house-info">
          <div class="community-wrapper">
            <span class="label">小区:</span>
            <span class="value" v-text="houseInfo.communityName"></span>
          </div>
          <div class="room-wrapper">
            <span class="label">房号:</span>
            <span class="value" v-text="houseInfo.address"></span>
          </div>
        </div>
        <div class="phone-binded" v-show="phoneBinded">
          <div class="submit"><x-button type="primary" action-type="button" @click.native="bindHouse">确认回家</x-button></div>
          <span class="description">快核对您的门牌号,没错就快回家吧。</span>
        </div>
        <div class="phone-no-bind" v-show="!phoneBinded">
          <div class="submit"><x-button type="primary" action-type="button" @click.native="goLogin">绑定手机号</x-button></div>
          <span class="description">离家只差一步啦,快绑定手机号吧。</span>
        </div>
      </div>
    </div>
    <div class="binded-wrapper" v-show="isExit">
      <div class="content">
        <div class="title-wrapper">
          <span>您已经在该房号下了</span>
          <span>不用重复绑定</span>
        </div>
        <div class="icon"></div>
        <div class="submit"><x-button type="primary" action-type="button" @click.native="goHome">回家看看</x-button></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {JURL} from '../../../common/js/utils';
  import {XButton} from 'vux';
  import {initialAxios} from '../../../main'
  export default {
    name: 'autoBindHouse',
    components: {
      XButton
    },
    mounted: function () {
      let token = localStorage.getItem('token');
      if (!token) {
        this.isBind();
      } else {
        this.phoneBinded = true;
      }
    },
    created: function () {
      // 根据state,获取基础信息
      let state = JURL.getHashParam('state');
      // 根据state获取业务参数
      let _this_ = this;
      this.$JHttp({
        url: window.baseURL + '/weixin/oauth2/getState?state=' + state,
        method: 'get'
      }).then((res) => {
        if (res.status === 100) {
          _this_.businessParam = res.data;
          _this_.getHouseInfo();
        } else {
          _this_.$vux.toast.show({
            type: 'cancel',
            text: res.msg
          });
        }
      }).catch(e => {
        console.log(e);
      });
    },
    data () {
      return {
        businessParam: {},
        houseInfo: {},
        isExit: false,
        isValidateCode: 0,
        phoneBinded: false,
        isReady: false
      }
    },
    methods: {
      isBind () {
        let _this = this;
        let code = localStorage.getItem('code');
        this.$vux.loading.show({
          text: '加载中'
        });
        if (!code) {
          this.$vux.toast.show({
            type: 'cancel',
            text: 'code不存在'
          });
          return;
        }
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/openid/info/code?code=' + code
        }).then(res => {
          let data = res.data;
          let isBind = data.bind;
          let userInfo_ = {
            nickName: '',
            avatar: '',
            sex: ''
          };
          if (!isBind) {
            _this.openId = data.openidInfo.openid;
            localStorage.setItem('openId', data.openidInfo.openid);
            userInfo_ = {
              nickName: data.openidInfo.nickName,
              avatar: data.openidInfo.avatar,
              sex: data.openidInfo.sex
            };
            _this.$store.commit('updateUserInfo', userInfo_);
            localStorage.setItem('wx_user_info', JSON.stringify(userInfo_));
            _this.phoneBinded = false;
          } else {
            _this.phoneBinded = true;
            userInfo_ = {
              nickName: data.userInfo.nickname,
              avatar: data.userInfo.headPicName,
              sex: data.userInfo.sex
            };
            _this.$store.commit('updateUserInfo', userInfo_);
            localStorage.setItem('wx_user_info', JSON.stringify(userInfo_));
            let isLogin = data.login;
            if (!isLogin) {
              let mobile = data.mobileNum;
              let password = data.password;
              var postData = {
                username: mobile,
                password: password
              };
              _this.$JHttp({
                url: window.baseURL + '/login',
                method: 'post',
                data: postData,
                transformRequest: [function (data) {
                  let ret = '';
                  for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                  }
                  return ret
                }],
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }).then((res) => {
                let data = res.data;
                let token = data.token;
                _this.$store.commit('updateToken', token);
                localStorage.setItem('token', token);
                let userId = data.userId;
                localStorage.setItem('userId', userId);
                this.createHeader();
              }).catch(e => {
                console.log(e);
              });
            } else {
              let token = data.token;
              _this.$store.commit('updateToken', token);
              localStorage.setItem('token', token);
              let userId = data.userInfo.id;
              localStorage.setItem('userId', userId);
              this.createHeader();
            }
          }
        }).catch(e => {
          console.log(e)
        })
      },
      createHeader () {
        initialAxios();
      },
      getHouseInfo () {
        let _this_ = this;
        let idCode = this.businessParam.idCode;
        this.$JHttp({
          url: window.baseURL + '/community/getCommunityInfoByIdCode?idCode=' + idCode,
          method: 'get'
        }).then((res) => {
          let status = res.status;
          if (status === 100) {
            let houseData = res.data;
            let roomId = houseData.roomId;
            let communityName = houseData.communityName;
            let address = '';
            if (houseData.blockName) {
              address += houseData.blockName;
            }
            if (houseData.buildingNumber) {
              address += houseData.buildingNumber;
            }
            if (houseData.unit) {
              address += houseData.unit;
            }
            if (houseData.room) {
              address += houseData.room;
            }
            _this_.houseInfo = {
              communityName: communityName,
              address: address,
              roomId: roomId,
              realName: houseData.username
            }
            let token = localStorage.getItem('token');
            if (token) {
              _this_.$JHttp({
                url: window.baseURL + '/ownerAsset/isMemberOfRoom?roomId=' + roomId,
                method: 'get'
              }).then((res) => {
                if (res.status === 100) {
                  let isExit = res.data;
                  _this_.isExit = isExit;
                  if (isExit) {
                    _this_.$vux.loading.hide();
                    _this_.isReady = true;
                    return;
                  }
                  _this_.$vux.loading.hide();
                  _this_.isReady = true;
                } else {
                  _this_.$vux.loading.hide();
                  _this_.isReady = true;
                  _this_.$vux.toast.show({
                    type: 'cancel',
                    text: res.msg
                  });
                }
              }).catch(error => {
                console.error(error);
              });
            } else {
              _this_.$vux.loading.hide();
              _this_.isReady = true;
            }
          } else {
            _this_.$vux.loading.hide();
            _this_.isReady = true;
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          _this_.$vux.loading.hide();
          _this_.isReady = true;
          console.log(e);
        });
      },
      // 绑定房号
      bindHouse () {
        let roomId = this.houseInfo.roomId;
        let _this_ = this;
        this.$JHttp({
          url: window.baseURL + '/ownerAsset/joinAddress?roomId=' + roomId,
          method: 'post'
        }).then(res => {
          if (res.status === 100) {
            _this_.$router.push('/');
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.error(e);
        });
      },
      goLogin () {
        let idCode = this.businessParam.idCode;
        localStorage.setItem('invite_id_code', idCode);
        this.$router.push('/login/' + this.openId);
      },
      goHome () {
//        let location = window.location;
//        location.href = location.origin + location.pathname + '#/life';
        this.$router.push('/');
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.bind-wrapper {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("../../../assets/images/auto_bind_house_bg.png");
  span {
    display: inline-block;
  }
  .no-bind-wrapper {
    position: absolute;
    left: 8.66%;
    top: 19.71%;
    width: 82.68%;
    height: 50.98%;
    background-color: #fff;
    .content {
      margin: 0 15px;
      height: 100%;
      position: relative;
      .title-wrapper {
        font-size: 20px;
        color: #333;
        margin: 30px 0;
        .name-value {
          margin-left: 10px;
          color: #869DC7;
        }
      }
      .house-info {
        font-size: 16px;
        color: #333;
        margin: 30px 0;
        .community-wrapper,
        .room-wrapper {
          .value {
            margin-left: 10px;
          }
        }
        .room-wrapper {
          margin-top: 10px;
        }
      }
      .phone-binded,
      .phone-no-bind {
        position: absolute;
        bottom: 60px;
        width: 100%;
        margin: 0;
        .description {
          margin-top: 10px;
          font-size: 14px;
        }
      }
    }
  }
  .binded-wrapper {
    position: absolute;
    left: 8.66%;
    top: 19.71%;
    width: 82.68%;
    height: 50.98%;
    background-color: #fff;
    .content {
      margin: 0 15px;
      height: 100%;
      position: relative;
      .title-wrapper {
        font-size: 20px;
        color: #333;
        padding: 30px 0;
      }
      .icon {
        width: 48.38%;
        height: 44.12%;
        position: absolute;
        bottom: 85px;
        left: 50%;
        transform: translateX(-50%);
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url("../../../assets/images/icon_binded.png");
      }
      .submit {
        position: absolute;
        width: 100%;
        bottom: 30px;
      }
    }

  }
}
</style>
