<template>
  <div class="payResult confirm">
    <div id="openApp" ref="openApp" @click="autoClick"></div>
    <div v-transfer-dom>
      <x-dialog v-model="confirmPayResult" :dialog-style="dialogStyle" class="confirm">
        <ul class="confirmPayResult">
          <li class="confirm_1">请确认微信支付是否已完成</li>
          <li class="confirm_ok" @click="payOk">已完成支付</li>
          <li class="confirm_repay" @click="cancelPay">支付遇到问题，重新支付</li>
        </ul>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import { XDialog, TransferDomDirective as TransferDom } from 'vux'
  export default {
    name: 'paySuccess',
    directives: {
      TransferDom
    },
    components: {
      XDialog
    },
    data () {
      return {
        time: 5,
        timer: null,
        ua: navigator.userAgent.toLowerCase(),
        scheme_IOS: window.commonConfig.scheme_IOS,
        confirmPayResult: true,
        dialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0 15px'
        }
      }
    },
    created () {
//      this.countDown()
      this.openNativeApp()
    },
    methods: {
      payOk () {
//        alert('token:' + localStorage.getItem('token'))
//        alert('communityId:' + localStorage.getItem('communityId'))
//        alert('userId:' + localStorage.getItem('userId'))
        this.$router.push('/payResult?out=1&isApp=1')
      },
      cancelPay () {
        this.$router.push('/mySignUp')
      },
      countDown () {
        let TIME = 5
        let _this = this
        if (!_this.timer) {
          _this.timer = setInterval(() => {
            if (_this.time > 0 && _this.time <= TIME) {
              _this.time--
            } else {
              clearInterval(_this.timer)
              _this.timer = null;
              _this.$router.push('/activity')
            }
          }, 1000)
        }
      },
      openNativeApp () {
        if (this.ua.match(/(iPhone|iPod|iPad);?/i)) {
          console.log('这是IOS')
          var install = false;
          this.autoClick()
        }
      },
      autoClick () {
        var loadTime = new Date();
        location.href = this.scheme_IOS; // ios协议
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .payResult{
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .confirmPayResult {
      li {
        border-bottom: 1px solid #D8D8D8;
      }
      .confirm_1 {
        padding: 15px 0;
      }
      .confirm_ok {
        color: #fc6679;
        padding: 10px 0;
      }
      .confirm_repay {
        color: #aaaaaa;
        padding: 10px 0;
        border: none;
      }
    }
  }
</style>
