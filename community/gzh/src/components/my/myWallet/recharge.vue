<template>
  <div class="recharge commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="wrapper">
        <b class="title">充值到钱包</b>
        <div class="label">金额</div>
        <x-input type="tel" class="input" v-model="money" placeholder="请输入充值金额" :max="7" @on-change="changeInput"></x-input>
        <div class="label">直接选择要充值的金额</div>
        <div class="select">
          <span class="select-item" v-for="item in moneyList" v-text="item + '元'" :class="{ 'active': money === item }" @click="money = item"></span>
        </div>
        <div class="button-recharge" @click="recharge" :class="{ 'active': rechargeActive }">充值</div>
        <div class="tips" @click="goRechargeCard">拥有回来啦社区充值卡？去使用</div>
      </div>

    </view-box>

    <div v-transfer-dom>
      <popup v-model="showPopup" style="background-color: #FFFFFF;">
        <div class="popup">
          <div class="title">选择支付方式</div>
          <div class="list">
            <div class="item" v-for="(item, index) in paymentWayList" @click="paymentWayIndex = paymentWayIndex === index ? -1 : index">
              <span class="left">
                <span class="icon" :style="{ backgroundImage: 'url(' + require('../../../assets/images/' + item.icon + '.png') + ')' }"></span>
                <span v-text="item.text"></span>
              </span>
              <span class="icon-select" :class="{ 'icon-selected': paymentWayIndex === index }"></span>
            </div>
          </div>
          <div class="button-pay" :class="{ 'active': payActive }" @click="pay">确认支付</div>
        </div>
      </popup>
    </div>

  </div>
</template>
<script>
  import { ViewBox, XHeader, XInput, TransferDom, Popup } from 'vux'
  export default {
    name: 'recharge',
    directives: {
      TransferDom
    },
    components: {
      ViewBox,
      XHeader,
      XInput,
      TransferDom,
      Popup
    },
    data () {
      return {
        title: '我的钱包',
        showPopup: false,
        paymentWayIndex: 0,
        paymentWayList: [{
          text: '微信',
          icon: 'wechat_icon_payway'
        }],
        moneyList: ['50', '100', '200', '300', '500', '1000'],
        money: undefined
      }
    },
    computed: {
      rechargeActive () {
        return this.money && this.money > 0
      },
      payActive () {
        return this.paymentWayIndex >= 0
      }
    },
    methods: {
      changeInput () {
        this.$nextTick(() => {
          if (this.money.length === 1) {
            this.money = this.money.replace(/[^1-9]/gi, '');
          } else {
            this.money = this.money.replace(/[\D]/gi, '');
          }
        })
      },
      goRechargeCard () {
        this.$router.push('/rechargeCard')
      },
      recharge () {
        if (this.rechargeActive) {
          this.showPopup = true
        }
      },
      pay () {
        if (this.payActive) {
          let _this_ = this
          _this_.showPopup = false
          _this_.$JHttp({
            method: 'POST',
            url: window.baseURL + '/pay/getWcPayRechargeInfo/rechargeCommon',
            params: {
              orderMoney: _this_.money
            }
          }).then(res => {
            if (res.status === 100) {
              let val = res.data;
              _this_.$wechat.chooseWXPay({
                timestamp: val.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: val.nonceStr, // 支付签名随机串，不长于 32 位
                package: val.packageStr, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: val.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: val.paySign, // 支付签名
                success: function (res) { // 支付成功后的回调函数
                  if (res.errMsg === 'chooseWXPay:ok') {
                    _this_.$vux.toast.show({
                      type: 'success',
                      text: '充值成功！'
                    })
                    _this_.$router.go(-1)
                  }
                },
                fail: function (err) {
                  console.log(err)
                }
              })
            } else {
              _this_.$vux.toast.show({
                type: 'text',
                text: res.msg
              })
            }
          }).catch(e => {
            console.log(e)
          })
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.popup {
  .title {
    height: 25px;
    font-size: 18px;
    margin: 15px 15px;
    text-align: center;
    color: #333333;
  }
  .list {
    margin: 0 15px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 67px;
      font-size: 15px;
      border-top: 1px solid #D8D8D8;
      .left {
        display: flex;
        .icon {
          width: 33px;
          height: 30px;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          margin-right: 10px;
        }
      }
    }
  }
  .icon-select {
    width: 22px;
    height: 22px;
    background-image: url("../../../assets/images/unchecked_icon_grey.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .icon-selected {
    background-image: url("../../../assets/images/payment_icon.png");
  }
  .button-pay {
    text-align: center;
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #FFFFFF;
    background-color: #D8D8D8;
    &.active {
      background-color: #0DAB60;
    }
  }
}
.recharge {
  height: 100%;
  .wrapper {
    margin: 20px 15px 0 15px;
    color: #333333;
    .title {
      font-size: 27px;
      padding-bottom: 20px;
    }
    .label {
      font-size: 15px;
    }
    .select {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 20px 0 20px 0;
      .select-item {
        width: 105px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        border-radius: 8px;
        margin-bottom: 15px;
        background-color: #F2F2F2;
        &.active {
          background-color: #0DAB60;
        }
      }
    }
    .button-recharge {
      text-align: center;
      width: 100%;
      height: 50px;
      line-height: 50px;
      color: #FFFFFF;
      background-color: #D8D8D8;
      margin-bottom: 30px;
      &.active {
        background-color: #0DAB60;
      }
    }
    .tips {
      font-size: 15px;
      color: #AAAAAA;
      text-align: center;
      text-decoration: underline;
    }
    /deep/ .input {
      font-size: 21px;
      width: 100%;
      padding: 0 0 13px 0;
      margin: 5px 0 20px 0;
      border: none;
      border-bottom: 1px solid #D8D8D8;
      .weui-icon-clear {
        vertical-align: -0.027rem;
      }
      &:before {
        display: none;
      }
    }
  }
}
</style>
