<template>
    <div class="commonHeader register-wrapper">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="邀请家人">
      </x-header>
      <div class="code">
        <qrcode :value="inviteLink" :size="124" type="img"></qrcode>
      </div>
      <div class="text">
        <span>邀请您的家人扫描此二维码</span>
        <span>关联手机号后可免审核直接绑定房号</span>
      </div>
    </div>
</template>

<script>
  import {Qrcode, XHeader} from 'vux';
  export default {
    name: 'inviteRegister',
    components: {
      Qrcode,
      XHeader
    },
    created: function () {
      this.generateQRCode();
    },
    data () {
      return {
        inviteLink: ''
      }
    },
    methods: {
      generateQRCode () {
        let _this_ = this;
        this.$JHttp({
          url: window.baseURL + '/user/registerInviteNo',
          method: 'get'
        }).then((res) => {
          let status = res.status;
          if (status === 100) {
            let idCode = res.data.out;
            let businessParam = {
              businessCode: 20,
              idCode: idCode
            };
            // 拼接code的地址
            let location = window.location;
            let linkURL = location.origin + location.pathname + '#/oauth?out=1&businessParam=' + encodeURI(JSON.stringify(businessParam));
            _this_.inviteLink = linkURL;
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          console.log(e);
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .register-wrapper {
    text-align: center;
    .code {
      margin-top: 60px;
      margin-left: auto;
      margin-right: auto;
      width: 130px;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.6);
    }
    .text {
      margin-top: 20px;
      font-size: 16px;
    }
  }
</style>
