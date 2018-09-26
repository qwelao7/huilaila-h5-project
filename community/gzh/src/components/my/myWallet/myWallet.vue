<template>
  <div class="my-willet commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="top">
        <div class="title">
          <span>钱包余额</span>
          <span @click="goSecureProtocolWallet">安全协议</span>
        </div>
        <b class="money" v-text="money"></b>
      </div>

      <div class="bottom">
        <div class="cell" @click="goRecharge">
          <span class="text">充值</span>
          <span class="icon-arrow"></span>
        </div>
        <div class="cell" @click="goEnchashment">
          <span class="text">提现</span>
          <span class="icon-arrow"></span>
        </div>
        <div class="cell" @click="goPayPassword">
          <span class="text">设置支付密码</span>
          <span class="icon-arrow"></span>
        </div>
      </div>

      <div v-transfer-dom>
        <x-dialog v-model="isShowPayPasswordModel" :hide-on-blur="false" class="pay-password-wrapper">
          <div class="title-wrapper">
            <p class="text">您尚未设置支付密码</p>
            <span class="text">请先去设置</span>
          </div>
          <div class="btn">
            <span class="cancel" @click="isShowPayPasswordModel = false">取消</span>
            <span @click="setPassword">去设置</span>
          </div>
        </x-dialog>

      </div>
    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader, XDialog, TransferDomDirective as TransferDom } from 'vux'
  export default {
    name: 'my-willet',
    directives: {
      TransferDom
    },
    components: {
      ViewBox,
      XHeader,
      XDialog
    },
    data () {
      return {
        title: '我的钱包',
        isShowPayPasswordModel: false,
        isHavePaymentPassword: false,
        money: undefined
      }
    },
    created () {
      let _this_ = this
      _this_.$JHttp({
        method: 'GET',
        url: window.baseURL + '/treasure/getMyMoney'
      }).then(res => {
        if (res.status === 100) {
          _this_.money = res.data.money
          _this_.isHavePaymentPassword = res.data.isHavePaymentPassword
        }
      }).catch(e => {
        console.log(e)
      });
    },
    methods: {
      setPassword () {
        this.$router.push('/payPassword')
      },
      goSecureProtocolWallet () {
        this.$router.push('/secureProtocolWallet')
      },
      goRecharge () {
        if (this.isHavePaymentPassword) {
          this.$router.push('/recharge')
        } else {
          this.isShowPayPasswordModel = true
        }
      },
      goEnchashment () {
        if (this.isHavePaymentPassword) {
          this.$router.push('/enchashment')
        } else {
          this.isShowPayPasswordModel = true
        }
      },
      goPayPassword () {
        this.$router.push('/payPassword')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.my-willet {
  height: 100%;
  .top {
    margin: 20px 15px 0 15px;
    .title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 15px;
      color: #333333;
      padding-bottom: 15px;
    }
    .money {
      height: 50px;
      text-align: center;
      font-size: 36px;
      color: #0DAB60;
      padding-bottom: 51px;
    }
  }
  .bottom {
    border-top: 1px solid #D8D8D8;
    margin: 0 15px;
    .cell {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 55px;
      border-bottom: 1px solid #D8D8D8;
      .icon-arrow {
        width: 7px;
        height: 15px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        background-image: url("../../../assets/images/arrow_icon_grey.png");
      }
    }
  }
}
</style>
