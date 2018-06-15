<template>
  <div class="commonHeader modifyPhoneNum">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="修改手机号">
    </x-header>
    <div class="changeBanner">
      <group>
        <x-input placeholder="旧号码" type="tel" v-model="oldPhone" :max="11"></x-input>
      </group>
      <group>
        <x-input placeholder="新号码" type="tel" v-model="newPhone" class="weui-vcode" :max="11">
          <x-button class="btnGetCode" :class="{disableBtn:disabled}" :disabled="disabled" slot="right" type="primary" mini
          @click.native="getCode()" v-text="text"></x-button>
        </x-input>
      </group>
      <group>
        <x-input placeholder="验证码" type="number" v-model="code"></x-input>
      </group>
      <div class="submit">
        <x-button @click.native="updatePhone">保存</x-button>
      </div>
    </div>
  </div>
</template>
<script>
  import { XHeader, XInput, Group, XButton, querystring } from 'vux'
  export default {
    components: {
      XHeader,
      XInput,
      Group,
      XButton
    },
    data () {
      return {
        disabled: false,
        text: '获取验证码',
        oldPhone: '',
        newPhone: '',
        code: '',
        timer: null,
        count: 0
      }
    },
    methods: {
      getCode () {
        let newPhone = this.newPhone;
        let oldPhone = this.oldPhone;
        if (!newPhone) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入新手机号'
          });
          return
        }
        if (!window.commonConfig.phoneRegp.test(newPhone)) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '新手机号输入错误'
          });
          return
        }
        if (newPhone === oldPhone) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '新旧手机号不能一样哦'
          });
          return
        }
        let TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          let postData = {
            phoneNumber: this.newPhone,
            type: 4 // 目前是注册，固定为4
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
      // 校验参数的合法性
      checkParams (params) {
        let oldPhone = params.oldPhone;
        let newPhone = params.newPhone;
        let code = params.code;
        if (!oldPhone) {
          return {
            res: false,
            text: '请输入旧手机号'
          }
        }
        if (!window.commonConfig.phoneRegp.test(oldPhone)) {
          return {
            res: false,
            text: '旧手机号输入错误'
          }
        }
        if (!newPhone) {
          return {
            res: false,
            text: '请输入新手机号'
          }
        }
        if (oldPhone === newPhone) {
          return {
            res: false,
            text: '新旧手机号不能一样哦'
          }
        }
        if (!window.commonConfig.phoneRegp.test(newPhone)) {
          return {
            res: false,
            text: '新手机号输入错误'
          }
        }
        if (!code) {
          return {
            res: false,
            text: '请输入验证码'
          }
        }
        return {
          res: true,
          text: ''
        }
      },
      updatePhone () {
        let oldPhone = this.oldPhone;
        let newPhone = this.newPhone;
        let code = this.code;
        let checkRes = this.checkParams({
          oldPhone: oldPhone,
          newPhone: newPhone,
          code: code
        });
        if (!checkRes.res) {
          this.$vux.toast.show({
            type: 'cancel',
            text: checkRes.text
          });
          return;
        }
        let postData = {
          oldPhone: this.oldPhone,
          newPhone: this.newPhone,
          verCode: code
        }
        let _this_ = this;
        _this_.$JHttp({
          method: 'put',
          url: window.baseURL + '/user/modifyPhone?' + querystring.stringify(postData)
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            _this_.$vux.toast.show({
              type: 'success',
              text: '手机号修改成功'
            });
            _this_.$router.go(-1);
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
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
  .changeBanner {
    padding: 0 .3rem;
    .weui-cell {
      padding: 36px 0 10px 0;
    }
    .submit{
      margin-top: 10px;
      button{
        height: 44px;
        margin-top: 20px;
        background: #0DAB60;
        border-radius: 5px;
        color: #ffffff;
        font-size: 18px;
      }
      p{
        font-size: 12px;
      }
    }
    .btnGetCode{
      background-color: #ffffff;
      border: 0.5px solid #0DAB60;
      color: #0DAB60;
    }
    .disableBtn {
      color: #aaaaaa;
      background-color: #ffffff;
      border: 0.5px solid #D8D8D8;
    }
    .weui-btn:after {
      border: none
    }
  }
</style>
