<template>
  <div class="pay-wrapper">
    <div class="order-wrapper">
      <div class="title">
        <span class="left">应付金额:</span>
        <span class="right" v-text="'¥' + totalMoney"></span>
      </div>
      <ul class="order-list" v-if="orderList.length">
        <li class="order-item" v-for="(order, index) in orderList">
          <span class="left" v-text="'订单' + (index + 1) + ':' "></span>
          <span class="right" v-text="'¥' + order.money"></span>
        </li>
      </ul>
      <div class="time-wrapper" v-if="orderDetail">
        <div class="normal">
          <span class="title">正常时段:</span>
          <span class="value" v-text="orderDetail.normalMoneyTimeStr"></span>
        </div>
        <div class="overtime">
          <span class="title">超时时段:</span>
          <span class="value" v-text="orderDetail.overtimeMoneyTimeStr"></span>
        </div>
      </div>
    </div>
    <div class="pay-way-wrapper">
      <div class="title vux-1px-b">选择支付方式:</div>
      <ul class="pay-list">
        <li class="pay-way vux-1px-b" :class="'pay-way-' + index"
            v-for="(payWay, index) in payWayList">
          <div class="left">
            <span class="icon"></span>
            <span class="text" v-text="payWay.name"></span>
          </div>
          <div class="right">
            <span class="money" v-if="payWay.type === 0" v-text="'¥ ' + account.balance"></span>
            <span class="check" :class="{selected: payWay.selected}"></span>
          </div>
        </li>
      </ul>
    </div>
    <div class="save-wrapper" @click="go2Pay">
      <j-button :type="payBtnType" :jText="payBtnText" :disabled="payBtnDisabled"></j-button>
    </div>
    <!--支付键盘 begin-->
    <popup v-model="payKeyboardPopShow" :hide-on-blur="hideOnBlur">
      <pay-keyboard v-on:closeKeyboard="closePayKeyboard" v-on:balancePay="balancePay"></pay-keyboard>
    </popup>
    <!--支付键盘 end-->
  </div>
</template>

<script>
  import router from '../../router';
  import Toast from 'components/utils/toast/toast';
  import Popup from '../utils/popup/index';
  import JButton from 'components/utils/jbutton';
  import payKeyboard from 'components/utils/pay/payKeyboard';
  import {sha1} from '../../common/sha1';
  export default {
    name: 'pay',
    props: {
      totalMoney: {
        type: String,
        default: '0.00'
      },
      orderList: {
        type: Array,
        default: function () {
          return [];
        }
      },
      order: {
        type: Object,
        default: function () {
          return undefined;
        }
      }
    },
    created: function () {
      this.initOrderDetail();
//      this.initAccount();
    },
    data () {
      return {
        payWayList: [
//          {
//            type: 0,
//            name: '账户余额支付',
//            selected: true
//          },
          {
            type: 1,
            name: '支付宝支付',
            selected: true
          }
        ],
        currentPayWay: {},
        orderDetail: {},
        account: {
          balance: 0.00,
          hasPassword: false,
          disable: false // 账户余额是否充足
        },
        payBtnType: 'primary',
        payBtnText: '去支付',
        payBtnDisabled: false,
        payKeyboardPopShow: false,
        hideOnBlur: false
      }
    },
    methods: {
      // 初始化账户信息
      initAccount: function () {
        // 默认余额支付
        this.currentPayWay = this.payWayList[0];
        // 调取查询账户基础信息接口
        let _this_ = this;
        this.$JHttp.get(window.homeURL + '/sharedPark/pay/balance/account').then((res) => {
          if (res.data.status === 100) {
            let accountInfo = res.data.data; // 账户基础信息
            if (accountInfo) {
              if (accountInfo.isHavePaymentPassword) { // 设置了支付密码
                _this_.$set(_this_.account, 'hasPassword', true);
              }
              let balance = parseFloat(accountInfo.money);
              _this_.$set(_this_.account, 'balance', balance);
            }
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
          // 余额不足时,置灰余额支付并选中支付宝
          if (_this_.account.balance < _this_.totalMoney) {
            _this_.$set(_this_.payWayList[0], 'selected', false); // 去除余额支付的选中状态
            _this_.$set(_this_.payWayList[1], 'selected', true); // 选中支付宝
            _this_.currentPayWay = _this_.payWayList[1];
            _this_.$set(_this_.account, 'disable', true);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
          // 余额查询出错了,也必须置灰余额支付选项
          _this_.$set(_this_.payWayList[0], 'selected', false); // 去除余额支付的选中状态
          _this_.$set(_this_.payWayList[1], 'selected', true); // 选中支付宝
          _this_.currentPayWay = _this_.payWayList[1];
          _this_.$set(_this_.account, 'disable', true);
        });
      },
      // 初始化订单详情
      initOrderDetail: function () {
        let order = this.order;
        if (order) {
          let normalMoneyTimeStr = '一';
          let overtimeMoneyTimeStr = '一';
          if (order.normalTimeLast) {
            normalMoneyTimeStr = '¥' + order.normalMoney + ' (' + order.normalTimeLast + ')';
          }
          if (order.overtimeLast) {
            overtimeMoneyTimeStr = '¥' + order.overtimeMoney + ' (' + order.overtimeLast + ')';
          }
          this.$set(this.orderDetail, 'orderId', order.orderId);
          this.$set(this.orderDetail, 'normalMoneyTimeStr', normalMoneyTimeStr);
          this.$set(this.orderDetail, 'overtimeMoneyTimeStr', overtimeMoneyTimeStr);
        } else {
          this.orderDetail = undefined;
        }
      },
      // 选择支付方式
      selectPayWay: function (payWay) {
        let type = payWay.type;
        if (type === 0) { // 余额支付
          if (this.account.disable) { // 余额不足
            this.payBtnText = '余额不足';
            this.payBtnType = 'disabled';
            this.payBtnDisabled = true;
            return;
          } else {
            this.payBtnText = '去支付';
            this.payBtnType = 'primary';
            this.payBtnDisabled = false;
            // 调起支付键盘
            this.showPayKeyboard();
          }
        } else {
          this.payBtnText = '去支付';
          this.payBtnType = 'primary';
          this.payBtnDisabled = false;
        }
        this.currentPayWay = payWay;
        if (payWay.selected) {
          return;
        }
        // 先取消所有选择
        this.payWayList.forEach(function (payWay) {
          payWay.selected = false;
        });
        // 然后选择当前支付方式
        payWay.selected = true;
      },
      // 去支付
      go2Pay: function () {
        let type = this.currentPayWay.type;
        if (type === 0) {
          this.showPayKeyboard();
        } else {
          this.aliPay();
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
        let orderList = this.orderList;
        if (orderList && orderList.length) {
          this.multipleOrderPay(orderList, password);
        } else {
          let order = this.orderDetail;
          if (order && order.orderId) { // 从订单详情发起的支付请求
            orderList = [{
              id: order.orderId
            }]
            this.multipleOrderPay(orderList, password);
          } else {
            Toast('没有待支付的订单!');
          }
        }
      },
      // 多个订单余额支付接口(合并支付)
      multipleOrderPay: function (orderList, password) {
        let postData = new FormData();
        password = sha1(password + window.commonConfig.passwordSalt);
        postData.append('pwd', password);
        postData.append('myMoney', this.account.balance);
        postData.append('orderMoney', this.totalMoney);
        orderList.forEach(function (order) {
          postData.append('orderIds', order.id);
        });
        this.$JHttp.post(window.homeURL + '/pay/getParkBalancePay', postData).then((res) => {
          if (res.data.status === 100) {
            // 支付请求成功,跳转到正在支付页面
            router.replace('/home/paying');
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
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
            Toast('没有待支付的订单!');
            return;
          }
        }
        this.$JHttp.post(window.homeURL + '/pay/getParkBalanceAlipay/' + window.commonConfig.payBusiness, postData).then((res) => {
          if (res.data.status === 100) {
            document.write(res.data.data);
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
      }
    },
    components: {
      Popup,
      'j-button': JButton,
      'pay-keyboard': payKeyboard
    },
    watch: {
      order: function () {
        this.initOrderDetail();
      }
    }
  }
</script>

<style scoped lang="less">
  .pay-wrapper {
    text-align: left;
    color: #333;
    background-color: #ebebeb;
    .order-wrapper {
      background-color: #fff;
      padding: 0.453333rem 0.4rem;
      .title {
        display: flex;
        .left {
          flex: 0 0 2.666667rem;
          font-size: 14px;
          line-height: 14px;
        }
        .right {
          flex: 1;
          font-size: 18px;
          line-height: 18px;
          text-align: left;
        }
      }
      .order-list {
        .order-item {
          display: flex;
          font-size: 12px;
          line-height: 12px;
          margin: 0.266667rem 0;
          .left {
            flex: 0 0 2.666667rem;
          }
          .right {
            flex: 1;
          }
        }
      }
      .order-list li:last-child {
        margin-bottom: 0;
      }
      .time-wrapper {
        .normal, .overtime {
          display: flex;
          font-size: 12px;
          line-height: 12px;
          .title {
            flex: 0 0 2.666667rem;
          }
          .value {
            flex: 1;
          }
        }
        .normal {
          margin: 0.266667rem 0;
        }
      }
    }
    .pay-way-wrapper {
      margin-top: 0.213333rem;
      margin-bottom: 0.4rem;
      background-color: #fff;
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
          height: 1.52rem;
          .left {
            display: flex;
            align-items: center;
            .icon {
              display: inline-block;
              width: 1.066667rem;
              height: 1.066667rem;
              margin-right: 0.213333rem;
              background-size: 100%;
              background-repeat: no-repeat;
            }
          }
          .right {
            display: flex;
            align-items: center;
            .money {
              color: #18adfb;
              margin-right: 0.4rem;
            }
            .check {
              display: inline-block;
              width: 0.586667rem;
              height: 0.586667rem;
              background-size: 100%;
              background-repeat: no-repeat;
              background-image: url('../../assets/img/@2x/empty-select.png');
            }
            .selected {
              background-image: url('../../assets/img/@2x/selected.png');
            }
          }
        }
        /*.pay-way-0 {*/
          /*.left {*/
            /*.icon {*/
              /*background-image: url('../../assets/img/@2x/pay-balance.png');*/
            /*}*/
          /*}*/
        /*}*/
        .pay-way-0 {
          .left {
            .icon {
              background-image: url('../../assets/img/@2x/alipay.png');
            }
          }
        }
      }
    }
    .save-wrapper {
      height: 1.2rem;
      margin-top: 0.4rem;
    }
  }

  [data-dpr="2"]
  .pay-wrapper {
    .order-wrapper {
      .title {
        .left {
          font-size: 30px;
          line-height: 30px;
        }
        .right {
          font-size: 36px;
          line-height: 36px;
        }
      }
      .order-list {
        .order-item {
          display: flex;
          font-size: 24px;
          line-height: 24px;
        }
      }
      .time-wrapper {
        .normal, .overtime {
          font-size: 24px;
          line-height: 24px;
        }
      }
    }
    .pay-way-wrapper {
      .title {
        font-size: 30px;
      }
      .pay-list {
        .pay-way {
          font-size: 30px;
        }
      }
    }
  }

  [data-dpr="3"]
  .pay-wrapper {
    .order-wrapper {
      .title {
        .left {
          font-size: 54px;
          line-height: 54px;
        }
        .right {
          font-size: 68px;
          line-height: 68px;
        }
      }
      .order-list {
        .order-item {
          display: flex;
          font-size: 42px;
          line-height: 42px;
        }
      }
      .time-wrapper {
        .normal, .overtime {
          font-size: 24px;
          line-height: 24px;
        }
      }
    }
    .pay-way-wrapper {
      .title {
        font-size: 54px;
      }
      .pay-list {
        .pay-way {
          font-size: 54px;
          .right {
            .check {
              background-image: url('../../assets/img/@3x/empty-select@3x.png');
            }
            .selected {
              background-image: url('../../assets/img/@3x/selected@3x.png');
            }
          }
        }
        /*.pay-way-0 {*/
          /*.left {*/
            /*.icon {*/
              /*background-image: url('../../assets/img/@3x/pay-balance@3x.png');*/
            /*}*/
          /*}*/
        /*}*/
        .pay-way-0 {
          .left {
            .icon {
              background-image: url('../../assets/img/@3x/alipay@3x.png');
            }
          }
        }
      }
    }
  }
</style>
