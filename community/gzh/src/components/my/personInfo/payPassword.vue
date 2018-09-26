<template>
  <div class="commonHeader password">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      :title="title">
    </x-header>
    <div class="modifyPsd">
      <div class="breadcrumb">
        <span :class="{current: !isNext, 'next': isNext}">验证账户</span>
        <span>&nbsp;>&nbsp;</span>
        <span :class="{current: isNext, 'next': !isNext}" v-text="title"></span>
      </div>
      <div class="nextStep" @click="checkCode" v-show="!isNext"><span></span></div>
      <div class="verify" v-show="!isNext">
        <group class="weui-cells_form">
          <x-input placeholder="手机号" type="tel" class="weui-vcode" readonly :show-clear="false" v-model="phoneNum" disabled>
            <x-button :class="{disableBtn:disabled}" :disabled="disabled" slot="right" type="primary" mini
                      @click.native="getCode()">{{text}}</x-button>
          </x-input>
        </group>
        <group>
          <x-input placeholder="验证码" type="number" class="weui-vcode" :show-clear="code" v-model="code"> </x-input>
        </group>
      </div>
      <div class="resetPsd" v-show="isNext">
        <div class="inputPsd">
          <p>请设置您新的6位支付密码</p>
          <input ref="pwd1" type="text" pattern="[0-9]*" maxlength="6" v-model="psd"  style="position: absolute;z-index: -1;left:-100%;opacity: 0"/>
          <ul class="pwd-wrap" @click="focus1">
            <li><i v-if="msgLength1 > 0"></i></li>
            <li><i v-if="msgLength1 > 1"></i></li>
            <li><i v-if="msgLength1 > 2"></i></li>
            <li><i v-if="msgLength1 > 3"></i></li>
            <li><i v-if="msgLength1 > 4"></i></li>
            <li><i v-if="msgLength1 > 5"></i></li>
          </ul>
        </div>
        <div class="reInputPsd">
          <p>请重复</p>
          <input ref="pwd2" type="text" pattern="[0-9]*" maxlength="6" v-model="rePsd"  style="position: absolute;z-index: -1;left:-100%;opacity: 0"/>
          <ul class="pwd-wrap" @click="focus2">
            <li><i v-if="msgLength2 > 0"></i></li>
            <li><i v-if="msgLength2 > 1"></i></li>
            <li><i v-if="msgLength2 > 2"></i></li>
            <li><i v-if="msgLength2 > 3"></i></li>
            <li><i v-if="msgLength2 > 4"></i></li>
            <li><i v-if="msgLength2 > 5"></i></li>
          </ul>
        </div>
        <div class="submit">
          <x-button @click.native="submit">确认提交</x-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { XHeader, XInput, Group, XButton, querystring } from 'vux'
  import {sha1} from '../../../common/js/sha1';
  export default {
    components: {
      XHeader,
      XInput,
      Group,
      XButton
    },
    data () {
      return {
        phoneNum: '',
        phone: '',
        disabled: false,
        text: '获取验证码',
        timer: null,
        count: 0,
        code: '',
        isNext: false,
        psd: '',
        rePsd: '',
        msgLength1: 0,
        msgLength2: 0,
        title: ''
      }
    },
    created () {
      this.getPersonalInfo();
    },
    watch: {
      psd (curVal) {
        if (/[^\d]/g.test(curVal)) {
          this.psd = this.psd.replace(/[^\d]/g, '');
        } else {
          this.msgLength1 = curVal.length;
        }
      },
      rePsd (curVal) {
        if (/[^\d]/g.test(curVal)) {
          this.rePsd = this.rePsd.replace(/[^\d]/g, '');
        } else {
          this.msgLength2 = curVal.length;
        }
      }
    },
    methods: {
      getPersonalInfo () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/home/getUserInfoAndAsset'
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            let data = res.data;
            let phone = data.mobileNum;
            let phoneStr = '';
            if (phone) {
              _this_.phone = phone;
              phoneStr += (phone.substr(0, 3));
              phoneStr += '****';
              phoneStr += (phone.substr(7, 4));
            }
            _this_.phoneNum = phoneStr;
            _this_.title = data.isSetPaymentPassword ? '重置支付密码' : '设置支付密码'
          } else {
            _this_.$vux.toast.show({
              type: 'error',
              text: res.msg
            });
          }
        }).catch(error => {
          console.error(error);
        })
      },
      getCode () {
        let phone = this.phone;
        if (!phone) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请先绑定手机号'
          });
          return
        }
        let _this_ = this;
        let TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          let postData = {
            phoneNumber: phone,
            type: 3 // 设置支付密码
          };
          this.$JHttp.post(window.baseURL + '/common/sendAliyunSmsCheckCode?' + querystring.stringify(postData)).then(res => {
            let status = res.status;
            if (status === 100) {
              this.$vux.toast.show({
                type: 'success',
                text: '发送成功'
              });
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  _this_.count--;
                  _this_.disabled = true;
                  _this_.text = this.count + 's后重发';
                } else {
                  clearInterval(this.timer);
                  _this_.timer = null;
                  _this_.disabled = false;
                  _this_.text = '获取验证码';
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
      checkCode () {
        let code = this.code;
        if (!code) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入验证码'
          });
          return;
        }
        let _this_ = this;
        let postData = {
          phoneNumber: this.phone,
          code: code,
          type: 3
        };
        _this_.$JHttp({
          method: 'post',
          url: window.baseURL + '/common/checkVerifyCode?' + querystring.stringify(postData)
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            _this_.isNext = true;
          } else {
            _this_.$vux.toast.show({
              type: 'error',
              text: res.msg
            });
          }
        }).catch(error => {
          console.error(error);
        })
      },
      focus1 () {
        this.$refs.pwd1.focus();
      },
      focus2 () {
        this.$refs.pwd2.focus();
      },
      submit () {
        let psd = this.psd;
        let rePsd = this.rePsd;
        if (!psd || psd.length !== 6) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入正确密码!'
          });
          return;
        }
        if (!rePsd) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请确认密码!'
          });
          return;
        }
        if (psd !== rePsd) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '两次密码不一致哦'
          });
          return;
        }
        let _this_ = this;
        let postData = {
          phone: this.phone,
          code: this.code,
          password: sha1(rePsd + window.commonConfig.passwordSalt)
        };
        _this_.$JHttp({
          method: 'post',
          url: window.baseURL + '/userAccount/setPaymentPwd?' + querystring.stringify(postData)
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            this.$vux.toast.show({
              type: 'success',
              text: '密码修改成功'
            });
            _this_.$router.go(-1);
          } else {
            _this_.$vux.toast.show({
              type: 'error',
              text: res.msg
            });
          }
        }).catch(error => {
          console.error(error);
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .password{
    height: 100%;
    display: flex;
    flex-direction: column;
    .modifyPsd{
      flex: 1;
      padding: 20px 15px;
      position: relative;
      .breadcrumb{
        display: flex;
        align-items: center;
        span{
          font-size: 15px;
          color: #aaaaaa;
        }
        .current{
          color: #0DAB60;
        }
        .next{
          color: #aaaaaa;
        }
      }
      .nextStep{
        position: absolute;
        bottom: 30px;
        right: 15px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: rgba(13,171,96,0.60);
        display: flex;
        align-items: center;
        justify-content: center;
        span{
          width: 12px;
          height: 12px;
          border: 1px solid #ffffff;
          border-top-color: transparent;
          border-left-color: transparent;
          transform: rotate(-45deg);
          -ms-transform: rotate(-45deg);
          -webkit-transform: rotate(-45deg);
          -o-transform: rotate(-45deg);
          -moz-transform: rotate(-45deg);
          margin-right: 5px;
        }
      }
      .verify{
        .weui-cell{
          padding: 10px 0;
        }
        button{
          color: #0DAB60;
          background-color: #ffffff;
          border: 1px solid #0DAB60;
        }
        .disableBtn{
          color: #aaaaaa;
          background-color: #ffffff;
          border: 0.5px solid #D8D8D8;
        }
        .weui-btn:after{
          border:none
        }
      }
      .resetPsd{
        .inputPsd{
          margin-top: 20px;
        }
        p{
          margin: 20px 0;
        }
        .pwd-wrap{
          /*width: 100%;*/
          height: 1rem;
          padding-bottom: 1px;
          background: #fff;
          display: flex;
          justify-content: space-between;
          li{
            line-height: 44px;
            width: 1rem;
            border:1px solid #aaaaaa;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            i{
              height: 12px;
              width: 12px;
              border-radius:50% ;
              background: #000;
            }
          }
        }
        .submit{
          margin-top: 20px;
          button{
            height: 44px;
            background-color: #0DAB60;
            color: #ffffff;
          }
        }
      }
    }
  }
</style>
