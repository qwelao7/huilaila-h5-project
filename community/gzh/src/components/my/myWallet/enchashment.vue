<template>
  <div class="enchashment commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="wrapper">
        <div class="label">提现到微信零钱</div>
        <x-input title="¥" type="text" class="input" v-model="money" placeholder="请输入提现金额" :max="10" @on-change="changeInput"></x-input>
        <div class="tips">
          <span class="current" :class="{ 'active': money > allMoney }" v-text="money > allMoney ? '已超过可提现金额' : '可提现金额 ' + allMoney + '元（仅收益可提现）'"></span>
          <span class="all" @click="money = allMoney" v-if="allMoney > 0">全部提现</span>
        </div>
        <div class="button" @click="submit" :class="{ 'active': active }">提现</div>
      </div>

      <!--支付键盘 begin-->
      <popup v-model="payKeyboardPopShow" :hide-on-blur="hideOnBlur">
        <pay-keyboard v-on:closeKeyboard="closePayKeyboard" ref="payKeyboard" v-on:balancePay="balancePay"></pay-keyboard>
      </popup>
      <!--支付键盘 end-->

    </view-box>

  </div>
</template>
<script>
  import { sha1 } from '../../../common/js/sha1'
  import Popup from '../../common/popup/index'
  import payKeyboard from 'components/common/pay/payKeyboard'
  import { ViewBox, XHeader, XInput } from 'vux'
  export default {
    name: 'recharge',
    components: {
      ViewBox,
      XHeader,
      XInput,
      Popup,
      payKeyboard
    },
    data () {
      return {
        title: '提现',
        payKeyboardPopShow: false,
        hideOnBlur: false,
        allMoney: 0,
        money: undefined
      }
    },
    created () {
      let _this_ = this
      _this_.$JHttp({
        method: 'GET',
        url: window.baseURL + '/treasure/getMoneyIncome'
      }).then(res => {
        if (res.status === 100) {
          _this_.allMoney = res.data.moneyIncome
        }
      }).catch(e => {
        console.log(e)
      })
    },
    computed: {
      active () {
        return this.money && this.money > 0 && this.money <= this.allMoney
      }
    },
    methods: {
      changeInput () {
        this.$nextTick(() => {
          this.money = this.money.toString()
          if (this.money.indexOf('.') === -1 && this.money.length > 7) {
            this.money = this.money.slice(0, 7)
          }
          this.money = this.money.replace(/^0(\d+)$/, '$1').replace(/[^\d.]/g, '').replace(/^\./g, '0.').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        })
      },
      showPayKeyboard: function () {
        this.payKeyboardPopShow = true;
      },
      closePayKeyboard: function () {
        this.payKeyboardPopShow = false;
      },
      balancePay: function (password) {
        let _this_ = this
        _this_.$vux.loading.show({
          text: '加载中'
        });
        let payeeAccount = ''
        try {
          let _userInfo_ = localStorage.getItem('userInfo')
          let userInfo = JSON.parse(_userInfo_)
          payeeAccount = userInfo.nickname
        } catch (e) {
          console.error(e)
        }
        let money = _this_.money
        let pwd = sha1(password + window.commonConfig.passwordSalt)
        _this_.$refs.payKeyboard.closeKeyboard();
        _this_.$JHttp({
          method: 'POST',
          url: window.baseURL + '/treasure/wechatWithdraw',
          params: {
            payeeAccount: payeeAccount,
            money: money,
            pwd: pwd
          }
        }).then(res => {
          _this_.$vux.loading.hide();
          if (res.status === 100) {
            if (res.data.status === 1) {
              _this_.$router.push({ path: '/enchashmentResult', query: { payeeAccount: payeeAccount, money: money } })
            } else if (res.data.status === 10) {
              _this_.$vux.confirm.show({
                title: res.msg,
                confirmText: '找回密码',
                cancelText: '取消',
                onConfirm () {
                  _this_.$router.push('/payPassword')
                }
                // onCancel () {}
              })
            } else {
              _this_.$vux.toast.show({
                type: 'text',
                text: res.msg
              });
            }
          } else {
            _this_.$vux.toast.show({
              type: 'text',
              text: res.msg
            });
          }
        }).catch(e => {
          _this_.$vux.loading.hide();
          console.log(e)
        });
      },
      submit () {
        if (this.active) {
          if (this.money < 0.3) {
            this.$vux.toast.show({
              type: 'cancel',
              text: '金额不能小于0.3元'
            });
            return
          }
          this.showPayKeyboard()
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.enchashment {
  height: 100%;
  .wrapper {
    margin: 20px 15px 0 15px;
    color: #333333;
    .label {
      font-size: 15px;
    }
    .button {
      text-align: center;
      width: 100%;
      height: 44px;
      line-height: 44px;
      color: #FFFFFF;
      background-color: #D8D8D8;
      &.active {
        background-color: #0DAB60;
      }
    }
    .tips {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 36px;
      .current {
        font-size: 12px;
        color: #333333;
        &.active {
          color: #FF6648;
        }
      }
      .all {
        font-size: 15px;
        color: #0DAB60;
      }
    }
    /deep/ .input {
      font-size: 21px;
      width: 100%;
      padding: 0 0 13px 0;
      margin: 5px 0 15px 0;
      border: none;
      border-bottom: 1px solid #D8D8D8;
      .weui-cell__hd {
        .weui-label {
          width: 19.5px;
          margin-right: 6px;
          text-align: center;
        }
      }
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
