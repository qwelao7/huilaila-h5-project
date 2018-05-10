<template>
  <div class="login">
    <div class="bg"></div>
    <div v-transfer-dom>
      <x-dialog v-model="showDialogStyle" :hide-on-blur="false" class="bind">
        <div class="bindBanner">
          <div class="verFiled">
            <p class="title">绑定手机号，可享受更多服务</p>
            <x-input type="tel" placeholder="请输入手机号" v-model="mobileNO" :value="mobileNO" :max="11">
              <!--<x-button :class="{disableBtn:disabled}" :disabled="disabled" slot="right" type="primary" mini
                        @click.native="send">{{text}}
              </x-button>-->
            </x-input>
            <!--<x-input type="number" placeholder="请输入验证码" v-model="validateCode" :show-clear="false"></x-input>-->
          </div>
          <div class="btn">
            <span @click="bindSoon">以后再说</span>
            <span @click="getGraphCode">下一步</span>
          </div>
        </div>
      </x-dialog>
      <x-dialog v-model="showGraphDialog" :hide-on-blur="false" class="bind">
        <div class="bindBanner">
          <div class="verFiled">
            <p>请输入图中验证码</p>
            <x-input type="text" placeholder="请输入图中验证码" v-model="graphCode" :value="graphCode">
            </x-input>
            <div class="graph-code-wrapper">
              <img :src="codeImgUrl" alt="" class="code-img">
              <button @click="getGraphCode" class="code-btn">看不清换一张</button>
            </div>
          </div>
          <div class="btn">
            <span @click="closeGraphDialog">上一步</span>
            <span @click="checkGraphCode">下一步</span>
          </div>
        </div>
      </x-dialog>
      <x-dialog v-model="showCodeDialog" :hide-on-blur="false" class="bind">
        <div class="bindBanner">
          <div class="verFiled">
            <p v-text="codeTitle"></p>
            <x-input type="text" placeholder="请输入短信验证码" v-model="validateCode">
              <x-button :class="{disableBtn:disabled}" :disabled="disabled" slot="right" type="primary" mini
                        @click.native="send">{{text}}
              </x-button>
            </x-input>
          </div>
          <div class="btn">
            <span @click="bindSoon">取消</span>
            <span @click="bind">立即绑定</span>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import {
    querystring,
    XDialog,
    TransferDomDirective as TransferDom,
    XInput, XButton
  } from 'vux'
  import {initialAxios} from '../../main'
  export default {
    created () {
      let openId = localStorage.getItem('openId');
      if (!openId) {
        this.isBind();
      } else {
        this.getUserInfoByOpenId(openId);
      }
    },
    data () {
      return {
        showDialogStyle: false,
        showGraphDialog: false,
        showCodeDialog: false,
        disabled: false,
        text: '获取验证码',
        timer: null,
        count: 0,
        mobileNO: '',
        graphCode: '',
        codeImgUrl: '',
        codeTitle: '',
        validateCode: '',
        openId: localStorage.getItem('openId')
      }
    },
    methods: {
      bindSoon () {
        this.showDialogStyle = false;
        this.$router.push('/');
      },
      isBind () {
        console.log(1111111)
        let _this = this;
        let code = localStorage.getItem('code');
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
          localStorage.removeItem('code');
          let data = res.data;
          let isBind = data.bind;
          console.log(222, isBind)
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
            _this.showDialogStyle = true;
          } else {
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
//              var formData = new FormData();
//              formData.append('username', mobile);
//              formData.append('password', password);
              var postData = {
                username: mobile,
                password: password
              };
//              console.log(formData)
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
                _this.$router.go(-1);
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
              _this.$router.go(-1);
            }
          }
        }).catch(e => {
          console.log(e);
        })
      },
      getUserInfoByOpenId (openId) {
//        console.log(999, openId)
        let _this = this;
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/openid/' + openId + '/info'
        }).then(res => {
          let data = res.data;
          let isBind = data.bind;
          let userInfo_ = {
            nickName: '',
            avatar: '',
            sex: ''
          };
          if (!isBind) {
            _this.showDialogStyle = true;
          } else {
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
//              var formData = new FormData();
//              formData.append('username', mobile);
//              formData.append('password', password);
              var postData = {
                username: mobile,
                password: password
              };
//              console.log(formData)
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
                let userId = data.userInfo.id;
                localStorage.setItem('userId', userId);
                this.createHeader();
                _this.$router.go(-1);
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
              _this.$router.go(-1);
            }
          }
        }).catch(e => {
          console.log(e);
        })
      },
      // 获取图形验证码
      getGraphCode () {
        if (!window.commonConfig.phoneRegp.test(this.mobileNO)) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入有效手机号'
          });
          return;
        }
        let timestamp = new Date().getTime();
        this.codeImgUrl = window.baseURL + '/common/imageCode?openid=' + this.openId + '&timestamp=' + timestamp;
        this.showDialogStyle = false;
        this.showGraphDialog = true;
      },
      // 关闭图形验证码弹出框
      closeGraphDialog () {
        this.graphCode = '';
        this.showGraphDialog = false;
        this.showDialogStyle = true;
      },
      // 验证图形验证码
      checkGraphCode () {
        if (!this.graphCode) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入图形验证码'
          });
          return;
        }
        let _this_ = this;
        this.send(this.graphCode, function () {
          let phone = _this_.mobileNO;
          let phoneStr = phone.substr(0, 3) + '****' + phone.substr(7, 4);
          _this_.codeTitle = '已向您的手机' + phoneStr + '发送验证码';
          _this_.showGraphDialog = false;
          _this_.showCodeDialog = true;
        });
      },
      send (imageCode, cb) {
        let TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          let postData = {
            phoneNumber: this.mobileNO,
            imageCode: imageCode,
            openid: this.openId
          };
          this.$JHttp.post(window.baseURL + '/common/sendRegCode?' + querystring.stringify(postData)).then(res => {
            let status = res.status;
            if (status === 100) {
              this.$vux.toast.show({
                type: 'success',
                text: '发送成功'
              });
              cb();
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                  this.disabled = true;
                  this.text = this.count + 's后重发';
                } else {
                  clearInterval(this.timer);
                  this.timer = null;
                  this.disabled = false;
                  this.text = '获取验证码';
                }
              }, 1000)
            } else {
              this.$vux.toast.show({
                type: 'cancel',
                text: res.msg
              });
            }
          }).catch(error => {
            console.error(error)
          });
        }
      },
      bind () {
        let _this = this;
        let mobile = this.mobileNO;
        let validateCode = this.validateCode;
        let regCode = /^\d{6}$/
        if (!regCode.test(validateCode)) {
          _this.$vux.toast.show({
            type: 'text',
            text: '请输入6位数字验证码'
          })
          return
        }
        var formData = new FormData();
        formData.append('mobile_num', mobile);
        formData.append('code', validateCode);
        let openId = this.openId;
        // 区分邀请者信息的一个code
        let idCode = localStorage.getItem('invite_id_code');
        let postData = {
          mobile_num: mobile,
          code: validateCode,
          openid: openId,
          idCode: idCode
        };
        console.log(11, postData);
        this.$JHttp({
          url: window.baseURL + '/openid/bind',
          method: 'post',
          data: postData
        }).then((res) => {
          if (res.status === 100) {
            let data = res.data;
            let token = data.token;
            _this.$store.commit('updateToken', token);
            localStorage.setItem('token', token);
            let userId = data.userId;
            localStorage.setItem('userId', userId);
            localStorage.removeItem('invite_id_code');
            this.createHeader();
            // localStorage.removeItem('openId');
            _this.$router.go(-1);
          } else {
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          _this.$vux.toast.show({
            type: 'cancel',
            text: '绑定出错了!'
          });
        });
      },
      createHeader () {
        initialAxios();
      }
    },
    directives: {
      TransferDom
    },
    components: {
      XDialog,
      XInput,
      XButton
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .graph-code-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .code-img {
      width: 120px;
      height: 40px;
    }
    .code-btn {
      /*flex: 1;*/
      margin-left: 20px;
      width: 120px;
      height: 40px;
      border-radius: 4px;
    }
  }
  .bindBanner{
    border-radius: 4px;
    .verFiled{
      padding: 0 19px;
      padding-top: 20px;
      .title{
        font-size: 18px;
        color: #333333;
      }
      .weui-cell{
        margin: 20px 0;
        .weui-input{
          padding: 14px 0;
        }
      }
    }
    .btn{
      border-top: 1px solid #E5E5E5;
      span{
        height: 50px;
        line-height: 50px;
      }
    }
  }
</style>
