<template>
  <div class="pay-wrapper commonHeader">
    <span class="pay-later-btn" @click="showPayLaterModel" v-text="'稍后付款'"></span>
    <view-box body-padding-top="1.253333rem" body-padding-bottom="1.866667rem">
      <x-header
        slot="header"
        :left-options="{showBack:false}"
        title="选择付款方式"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div class="order-wrapper">
        <div class="should-pay">
          <span class="top" v-text="'应付金额'"></span>
          <div class="bottom">
            <span class="symbol" v-text="'¥'"></span>
            <span class="money" v-text="orderDetail.payMoney"></span>
          </div>
        </div>
        <div class="total-money">
          <span class="title" v-text="'合计金额:'"></span>
          <div class="right">
            <span class="symbol" v-text="'¥'"></span>
            <span class="money-int" v-text="orderDetail.totalMoney.int"></span>
            <span class="money-float" v-text="orderDetail.totalMoney.float"></span>
          </div>
        </div>
        <div class="packet-money" v-show="orderDetail.redpacketMoney.money">
          <span class="title" v-text="'红包抵扣:'"></span>
          <div class="right">
            <span class="sub" v-text="'-'"></span>
            <span class="symbol" v-text="'¥'"></span>
            <span class="money-int" v-text="orderDetail.redpacketMoney.int"></span>
            <span class="money-float" v-text="orderDetail.redpacketMoney.float"></span>
          </div>
        </div>
      </div>
      <div class="pay-way-wrapper">
        <div class="title vux-1px-b">支付方式:</div>
        <ul class="pay-list" v-if="payWayList.length">
          <li class="pay-way vux-1px-b" :class="['pay-way-' + payWay.type, payWay.class]"
              v-for="(payWay, index) in payWayList">
            <div class="left">
              <span class="icon"></span>
              <div class="text-wrapper">
                <span class="text" v-text="payWay.name"></span>
                <span class="tips" v-text="payWay.tips"></span>
              </div>
            </div>
            <div class="right" @click="selectPayWay(payWay)">
              <span class="money" v-if="payWay.type === 0" v-text="'¥ ' + account.balance.toFixed(2)"></span>
              <span class="money" v-if="payWay.type >=3" v-text="'¥ ' + payWay.money.toFixed(2)"></span>
              <span class="check" :class="{selected: payWay.selected}"></span>
            </div>
          </li>
        </ul>
      </div>
      <div class="info-wrapper" v-text="'提示:  请在下单后' + orderDetail.productTimeOut + '分钟内完成支付。'"></div>
      <div class="save-wrapper" @click="go2Pay">
        <j-button :type="payBtnType" :jText="payBtnText" :disabled="payBtnDisabled"></j-button>
      </div>
      <!--支付键盘 begin-->
      <popup v-model="payKeyboardPopShow" :hide-on-blur="hideOnBlur">
        <pay-keyboard v-on:closeKeyboard="closePayKeyboard" ref="payKeyboard"
                      v-on:balancePay="balancePay"></pay-keyboard>
      </popup>
      <!--支付键盘 end-->
      <div v-transfer-dom>
        <x-dialog v-model="isShowPayLaterModel" :hide-on-blur="false" class="pay-later-wrapper">
          <span class="title">确认稍后付款?</span>
          <p class="pay-later-text" v-text="payLaterText"></p>
          <div class="btn">
            <span @click="payLater">稍后付款</span>
            <span @click="isShowPayLaterModel = false">继续付款</span>
          </div>
        </x-dialog>
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
  import router from '../../../router';
  import Popup from '../../common/popup/index';
  import JButton from 'components/common/jbutton';
  import payKeyboard from 'components/common/pay/payKeyboard';
  import {sha1} from '../../../common/js/sha1';
  import {JNavigator} from '../../../common/js/utils';
  import {XHeader, ViewBox, querystring, md5, XDialog, TransferDomDirective as TransferDom} from 'vux';

  export default {
    name: 'pay',
    components: {
      Popup,
      'j-button': JButton,
      'pay-keyboard': payKeyboard,
      'view-box': ViewBox,
      'x-header': XHeader,
      XDialog
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        let fromPath = from.path;
        vm.fromPath = fromPath;
      })
    },
    directives: {
      TransferDom
    },
    created: function () {
      this.initOrderDetail();
    },
    data () {
      return {
        fromPath: '',
        isShowPayLaterModel: false,
        isShowPayPasswordModel: false,
        isShowChargeModel: false,
        orderDetail: {
          payMoney: 0,
          productTimeOut: 15,
          totalMoney: {},
          redpacketMoney: {}
        },
        payTypes: [],
        payWayList: [{
          type: 0,
          name: '钱包支付',
          selected: true
        }],
        memberCardList: [],
        subIsOnlinepay: '2',
        currentPayWay: {},
        account: {
          balance: 0.00,
          hasPassword: false,
          disable: false // 账户余额是否充足
        },
        payBtnType: 'primary',
        payBtnText: '确认支付',
        payBtnDisabled: false,
        payKeyboardPopShow: false,
        hideOnBlur: false
      }
    },
    computed: {
      orderId () {
        return this.$route.params.orderId;
      },
      orderIds () {
        let orderIds = this.$route.params.orderId;
        return orderIds.split(',');
      },
      payLaterText () {
        let leftMinutes = this.orderDetail.productTimeOut;
        return '下单后' + leftMinutes + '分钟内未支付成功,订单将被关闭,请尽快完成支付';
      }
    },
    methods: {
      // 初始化账户信息
      initAccount: function () {
        // 默认余额支付
        this.currentPayWay = this.payWayList[0];
        // 调取查询账户基础信息接口
        let _this_ = this;
        this.$JHttp.get(window.baseURL + '/treasure/getMyMoney').then((res) => {
          if (res.status === 100) {
            let data = res.data;
            let money = data.money;
            let hasPassword = data.isHavePaymentPassword;
            _this_.$set(_this_.account, 'hasPassword', hasPassword);
            let balance = parseFloat(money);
            _this_.$set(_this_.account, 'balance', balance);
            // 余额不足时,置灰余额支付并选中微信支付
            if (_this_.account.balance < _this_.orderDetail.totalMoney.money) {
              _this_.$set(_this_.payWayList[0], 'selected', false); // 去除余额支付的选中状态
              if (_this_.payWayList.length > 1) {
                _this_.$set(_this_.payWayList[1], 'selected', true); // 选中微信支付
                _this_.currentPayWay = _this_.payWayList[1];
              }
              _this_.$set(_this_.account, 'disable', true);
            }
          } else {
            // 接口没有返回数据
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(function (response) {
          // 余额查询出错了,也必须置灰余额支付选项
          _this_.$set(_this_.payWayList[0], 'selected', false); // 去除余额支付的选中状态
          _this_.$set(_this_.payWayList[1], 'selected', true); // 选中支付宝
          _this_.currentPayWay = _this_.payWayList[1];
          _this_.$set(_this_.account, 'disable', true);
        });
      },
      // 初始化订单详情
      initOrderDetail: function () {
        let _this_ = this;
        this.$JHttp.get(window.baseURL + '/order/getOrderListByIds?orderIds=' + this.orderId).then((res) => {
          if (res.status === 100) {
            let data = res.data;
            let money = data.orderMoneySum;
            _this_.orderDetail.payMoney = money;
            let totalMoney = data.orderMoneyTotalSum;
            let totalMoneys = totalMoney.toFixed(2).split('.');
            _this_.orderDetail.totalMoney.money = totalMoney;
            _this_.orderDetail.totalMoney.int = totalMoneys[0];
            _this_.orderDetail.totalMoney.float = '.' + totalMoneys[1];
            _this_.orderDetail.productTimeOut = data.productTimeOut;
            let redpacketMoney = data.redPacketMoneySum;
            let redpacketMoneys = redpacketMoney.toFixed(2).split('.');
            _this_.orderDetail.redpacketMoney.money = redpacketMoney;
            _this_.orderDetail.redpacketMoney.int = redpacketMoneys[0];
            _this_.orderDetail.redpacketMoney.float = '.' + redpacketMoneys[1];
            _this_.payTypes = data.payType;
            _this_.subIsOnlinepay = data.subIsOnlinepay;
            if (data.userCardMemberList) {
              _this_.memberCardList = data.userCardMemberList;
            }
            console.log(data)
            _this_.setPayWayList();
            _this_.initAccount();
          } else {
            // 接口没有返回数据
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(function (err) {
          console.error(err);
        });
      },
      setPayWayList () {
        let _this_ = this;
        let payTypes = this.payTypes;
        let availablePayTypes = [];
        if (payTypes && payTypes.length) {
          payTypes.forEach(function (type) {
            switch (type) {
              case 1: // 支付宝,不支持
                break;
              case 13:
                availablePayTypes.push({
                  type: 1,
                  name: '微信支付',
                  tips: '推荐安装微信5.0及以上版本的用户使用',
                  selected: false
                });
                break;
              case 15:
                _this_.memberCardList.forEach(function (item, index) {
                  availablePayTypes.push({
                    type: index + 3,
                    money: item.money,
                    cardId: item.cardId,
                    name: item.cardName + '支付',
                    selected: false
                  });
                })
                break;
            }
          });
        }
        // 支持线下支付(产品让手动隐藏线下支付)
//        if (this.subIsOnlinepay !== '2') {
//          availablePayTypes.push({
//            type: 2,
//            class: 'pay-item-offline',
//            name: '线下支付',
//            selected: false
//          });
//        }
        this.payWayList = this.payWayList.concat(availablePayTypes);
      },
      // 选择支付方式
      selectPayWay: function (payWay) {
        let type = payWay.type;
        if (payWay.selected) {
          return;
        }
        this.currentPayWay = payWay;
        // 先取消所有选择
        this.payWayList.forEach(function (payWayItem) {
          payWayItem.selected = false;
        });
        // 然后选择当前支付方式
        payWay.selected = true;
        if (type === 0) { // 余额支付
          if (!this.account.hasPassword) { // 没有设置支付密码
            this.payBtnType = 'disabled';
            this.payBtnDisabled = true;
            this.isShowPayPasswordModel = true;
          }
          if (this.account.balance < this.orderDetail.payMoney) { // 余额不足
            this.payBtnText = '余额不足';
            this.payBtnType = 'disabled';
            this.payBtnDisabled = true;
          } else {
            this.payBtnText = '确认支付';
            this.payBtnType = 'primary';
            this.payBtnDisabled = false;
            // 调起支付键盘
            this.showPayKeyboard();
          }
        } else if (type >= 3) {
          if (!this.account.hasPassword) { // 没有设置支付密码
            this.payBtnType = 'disabled';
            this.payBtnDisabled = true;
            this.isShowPayPasswordModel = true;
          }
          if (this.currentPayWay.money < this.orderDetail.payMoney) { // 余额不足
            this.payBtnText = '余额不足';
            this.payBtnType = 'disabled';
            this.payBtnDisabled = true;
          } else {
            this.payBtnText = '确认支付';
            this.payBtnType = 'primary';
            this.payBtnDisabled = false;
            // 调起支付键盘
            this.showPayKeyboard();
          }
        } else {
          this.payBtnText = '确认支付';
          this.payBtnType = 'primary';
          this.payBtnDisabled = false;
        }
      },
      showPayLaterModel () {
        let fromPath = this.fromPath;
        // 来自确认订单页,则需要提示,否则直接返回
        if (fromPath.indexOf('/confirmOrders') !== -1) {
          this.isShowPayLaterModel = true;
        } else {
          this.$router.go(-1);
        }
      },
      payLater () {
        this.isShowPayLaterModel = false;
        let fromPath = this.fromPath;
        // 来自确认订单页,则需要跳转到首页,否则返回上一页
        if (fromPath.indexOf('/confirmOrders') !== -1) {
          // 跳转到首页
          this.$router.push('/service');
        } else {
          this.$router.go(-1);
        }
      },
      setPassword () {
        this.$router.push('/payPassword')
      },
      // 去支付
      go2Pay: function () {
        let type = this.currentPayWay.type;
        // 余额支付
        if (type === 0) {
          if (!this.account.hasPassword) { // 没有设置支付密码
            this.payBtnType = 'disabled';
            this.payBtnDisabled = true;
            this.isShowPayPasswordModel = true;
            return;
          }
          if (this.account.balance < this.orderDetail.payMoney) { // 余额不足
            this.payBtnText = '余额不足';
            this.payBtnType = 'disabled';
            this.payBtnDisabled = true;
            return;
          }
          this.showPayKeyboard();
        } else if (type === 1) { // 微信支付
          this.wxPay();
        } else if (type === 2) { // 线下支付
          this.offLinePay();
        } else if (type >= 3) { // 会员卡支付
          if (!this.account.hasPassword) { // 没有设置支付密码
            this.payBtnType = 'disabled';
            this.payBtnDisabled = true;
            this.isShowPayPasswordModel = true;
            return;
          }
          if (this.currentPayWay.money < this.orderDetail.payMoney) { // 余额不足
            this.payBtnText = '余额不足';
            this.payBtnType = 'disabled';
            this.payBtnDisabled = true;
            return;
          }
          this.showPayKeyboard();
        }
      },
      // 调起支付键盘
      showPayKeyboard: function () {
        this.payKeyboardPopShow = true;
      },
      // 关闭支付键盘
      closePayKeyboard: function () {
        this.payKeyboardPopShow = false;
      },
      // 余额支付
      balancePay: function (password) {
        // 目前先支持单订单支付
        let orderIds = this.orderIds;
        this.multipleOrderPay(orderIds, password);
      },
      // 多个订单余额支付接口(合并支付)
      multipleOrderPay: function (orderIds, password) {
        let postData = {};
        password = sha1(password + window.commonConfig.passwordSalt);
        postData.pwd = password;
        postData.myMoney = this.account.balance;
        postData.orderMoney = this.orderDetail.payMoney;
        postData.orderIds = orderIds;
        let cardData = {};
        cardData.pwd = password;
        cardData.orderIds = orderIds;
        let _this_ = this;
        let type = this.currentPayWay.type;
        if (type === 0) {  // 余额支付
          this.$JHttp.post(window.baseURL + '/pay/getOrderBalancePay?' + querystring.stringify(postData)).then((res) => {
            if (res.status === 100) {
              let data = res.data;
              let status = data.status;
              // 隐藏键盘
              _this_.payKeyboardPopShow = false;
              if (status === 1) {
                // 支付请求成功,跳转到正在支付页面
                _this_.$vux.toast.show({
                  type: 'success',
                  text: '支付成功'
                });
                setTimeout(function () {
                  _this_.$router.push({
                    path: '/submitSuccess',
                    query: {
                      payMoney: _this_.orderDetail.payMoney
                    }
                  });
                }, 2000);
              } else {
                // 关闭键盘
                _this_.$refs.payKeyboard.closeKeyboard();
                _this_.$vux.toast.show({
                  type: 'cancel',
                  text: data.message
                })
              }
            } else {
              // 关闭键盘
              _this_.$refs.payKeyboard.closeKeyboard();
              // 接口没有返回数据
              this.$vux.toast.show({
                type: 'cancel',
                text: res.msg
              });
            }
          }).catch(function (response) {
            // 调用接口出错,隐藏键盘
            _this_.payKeyboardPopShow = false;
          });
        } else if (type >= 3) { // 会员卡支付
          cardData.cardId = _this_.currentPayWay.cardId
          this.$JHttp.post(window.baseURL + '/pay/getOrderMemberCardPay?' + querystring.stringify(cardData)).then((res) => {
            if (res.status === 100) {
              let data = res.data;
              let status = data.status;
              // 隐藏键盘
              _this_.payKeyboardPopShow = false;
              if (status === 1) {
                // 支付请求成功,跳转到正在支付页面
                _this_.$vux.toast.show({
                  type: 'success',
                  text: '支付成功'
                });
                setTimeout(function () {
                  _this_.$router.push({
                    path: '/submitSuccess',
                    query: {
                      payMoney: _this_.orderDetail.payMoney
                    }
                  });
                }, 2000);
              } else {
                // 关闭键盘
                _this_.$refs.payKeyboard.closeKeyboard();
                _this_.$vux.toast.show({
                  type: 'cancel',
                  text: data.message
                })
              }
            } else {
              // 关闭键盘
              _this_.$refs.payKeyboard.closeKeyboard();
              // 接口没有返回数据
              this.$vux.toast.show({
                type: 'cancel',
                text: res.msg
              });
            }
          }).catch(function (response) {
            // 调用接口出错,隐藏键盘
            _this_.payKeyboardPopShow = false;
          });
        }
      },
      aliPay: function () {
        // 调用支付接口
        let orderList = this.orderList;
        let postData = new FormData();
        if (orderList && orderList.length) {
          orderList.forEach(function (order) {
            postData.append('orderIds', order.id);
          });
        } else {
          let order = this.orderDetail;
          if (order && order.orderId) { // 从订单详情发起的支付请求
            postData.append('orderIds', order.orderId);
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              text: '没有待支付的订单!'
            });
            return;
          }
        }
        this.$JHttp.post(window.homeURL + '/pay/getParkBalanceAlipay/' + window.commonConfig.payBusiness, postData).then((res) => {
          let _this_ = this;
          if (res.status === 100) {
            document.write(res.data);
          } else {
            // 接口没有返回数据
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(function (response) {
          // 调用接口出错
        });
      },
      wxPay () {
        let orderIdStrs = this.orderId;
        let _this_ = this;
        this.$JHttp.post(window.baseURL + '/pay/getWxPayInfo/' + window.commonConfig.productPayBusiness + '?orderIds=' + orderIdStrs).then((res) => {
          if (res.status === 100) {
            let data = res.data;
            let isWeiXin = JNavigator.isWeiXin();
            if (isWeiXin) {
              _this_.$wechat.chooseWXPay({
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                package: data.packageStr,
                signType: data.signType,
                paySign: data.paySign,
                success: function (res) {
                  if (res.errMsg === 'chooseWXPay:ok') {
                    // 支付请求成功,跳转到支付成功页面
                    _this_.$vux.toast.show({
                      type: 'success',
                      text: '支付成功'
                    });
                    setTimeout(function () {
                      _this_.$router.push({
                        path: '/submitSuccess',
                        query: {
                          payMoney: _this_.orderDetail.payMoney
                        }
                      });
                    }, 2000);
                  }
                },
                fail: function (err) {
                  console.log(err)
                }
              })
            } else {
              location.href = data.mwebUrl;
            }
          } else {
            // 接口没有返回数据
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(function (response) {
          // 调用接口出错
        });
      },
      offLinePay () {
        // 支付请求成功,跳转到正在支付页面
        this.$vux.toast.show({
          type: 'success',
          text: '支付成功'
        });
        let _this_ = this;
        setTimeout(function () {
          _this_.$router.push({
            path: '/submitSuccess',
            query: {
              payMoney: _this_.orderDetail.payMoney
            }
          });
        }, 2000);
      }
    }
  }
</script>

<style type="text/less" scoped lang="less">
  .pay-wrapper {
    text-align: left;
    color: #333;
    height: 100%;
    background-color: #f5f5f5;
    .pay-later-btn {
      position: absolute;
      top: 13px;
      left: 15px;
      font-size: 15px;
      color: #333;
      z-index: 9999;
      line-height: 21px;
    }
    .order-wrapper {
      .should-pay {
        height: 100px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .top {
          font-size: 12px;
        }
        .bottom {
          color: #FF6648;
          display: flex;
          align-items: baseline;
          .symbol {
            font-size: 12px;
          }
          .money {
            font-size: 15px;
          }
        }
      }
      .total-money {
        margin-top: 10px;
        padding: 0 15px;
        height: 40px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          font-size: 15px;
        }
        .right {
          color: #FF6648;
          display: flex;
          align-items: baseline;
          .symbol {
            font-size: 12px;
            margin-right: 3px;
          }
          .money-int {
            font-size: 15px;
          }
          .money-float {
            font-size: 12px;
          }
        }
      }
      .packet-money {
        padding: 0 15px;
        height: 40px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          font-size: 15px;
        }
        .right {
          color: #FF6648;
          display: flex;
          align-items: baseline;
          .sub {
            font-size: 12px;
            margin-right: 2px;
          }
          .symbol {
            font-size: 12px;
            margin-right: 3px;
          }
          .money-int {
            font-size: 15px;
          }
          .money-float {
            font-size: 12px;
          }
        }
      }
    }
    .pay-way-wrapper {
      margin-top: 0.213333rem;
      margin-bottom: 0.4rem;
      .title {
        font-size: 14px;
        line-height: 1.173333rem;
        padding: 0 0.4rem;
      }
      .pay-list {
        .pay-way {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 0.4rem;
          font-size: 14px;
          height: 67px;
          background-color: #fff;
          .left {
            display: flex;
            align-items: center;
            .icon {
              display: inline-block;
              width: 1.066667rem;
              height: 1.066667rem;
              margin-right: 10px;
              background-size: 100%;
              background-repeat: no-repeat;
            }
            .text-wrapper {
              .tips {
                color: #aaa;
                font-size: 12px;
              }
            }
          }
          .right {
            display: flex;
            align-items: center;
            .money {
              color: #FF6648;
              margin-right: 0.4rem;
              font-size: 15px;
            }
            .check {
              display: inline-block;
              width: 0.586667rem;
              height: 0.586667rem;
              background-size: 100%;
              background-repeat: no-repeat;
              background-image: url('../../../assets/images/uncheckcircle_button.png');
            }
            .selected {
              background-image: url('../../../assets/images/checked_icon_orange.png');
            }
          }
        }
        .pay-way-0 {
          .left {
            .icon {
              background-image: url('../../../assets/images/wallet_icon_payway.png');
            }
          }
          margin-bottom: 5px;
        }
        .pay-way-1 {
          .left {
            .icon {
              background-image: url('../../../assets/images/wechat_icon_payway.png');
            }
          }
        }
        .pay-way-2 {
          .left {
            .icon {
              background-image: url('../../../assets/images/offline_icon_payway.png');
            }
          }
        }
        .pay-way-3, .pay-way-4, .pay-way-5, .pay-way-6, .pay-way-7, .pay-way-8, .pay-way-9, .pay-way-10 {
          .left {
            .icon {
              background-image: url('../../../assets/images/membercard_icon_payway.png');
            }
          }
          margin-bottom: 5px;
        }
        .pay-item-offline {
          margin-top: 5px;
        }
      }
    }
    .info-wrapper {
      padding: 0 15px;
      font-size: 12px;
      color: #333;
    }
    .save-wrapper {
      height: 44px;
      padding: 0 15px;
      margin-top: 0.4rem;
    }
    .pay-later-wrapper {
      .title {
        font-size: 15px;
      }
      .btn {
        border-top: 1px solid #E5E5E5;
        span {
          height: 50px;
          line-height: 50px;
        }
      }
    }
  }
</style>
