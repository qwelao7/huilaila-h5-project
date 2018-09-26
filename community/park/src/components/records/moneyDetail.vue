<template>
  <div class="money-detail-wrapper">
    <div class="top vux-1px-b" v-text="'¥ '+ orderDetail.totalMoney"></div>
    <div class="content">
      <div class="normal-wrapper">
        <div class="total">
          <div class="left">
            <span class="title">正常时段:</span>
            <span class="value" v-text="orderDetail.chargeInfo.normalLast || '一'"></span>
          </div>
          <div class="right">
            <span class="money" v-text="'¥' + (orderDetail.chargeInfo.normalMoney || '0.00')"></span>
          </div>
        </div>
        <div class="charge">
          <div class="begin">
            <span class="title">开始计费:</span>
            <span class="value" v-text="orderDetail.chargeInfo.normalBeginChargeTime || '一'"></span>
          </div>
          <div class="end">
            <span class="title">结束计费:</span>
            <span class="value" v-text="orderDetail.chargeInfo.normalEndChargeTime || '一'"></span>
          </div>
        </div>
      </div>
      <div class="overtime-wrapper">
        <div class="total">
          <div class="left">
            <span class="title">超时时段:</span>
            <span class="value" v-text="orderDetail.chargeInfo.overtimeLast || '一'"></span>
          </div>
          <div class="right">
            <span class="money" v-text="'¥' + (orderDetail.chargeInfo.overtimeMoney || '0.00')"></span>
          </div>
        </div>
        <div class="charge">
          <div class="begin">
            <span class="title">开始计费:</span>
            <span class="value" v-text="orderDetail.chargeInfo.overtimeBeginChargeTime || '一'"></span>
          </div>
          <div class="end">
            <span class="title">结束计费:</span>
            <span class="value" v-text="orderDetail.chargeInfo.overtimeEndChargeTime || '一'"></span>
          </div>
        </div>
      </div>
      <div class="money-wrapper">
        <div class="total-money">
          <span class="title">合计金额:</span>
          <span class="value" v-text="'¥ ' + orderDetail.totalMoney"></span>
        </div>
        <div class="pay-money" v-if="orderDetail.orderStatus !== 2 && orderDetail.orderStatus !== 3">
          <span class="title" v-text="orderDetail.moneyTitleStr"></span>
          <span class="value" v-text="'¥ ' + orderDetail.totalMoney"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Toast from 'components/utils/toast/toast';
  import {jlDate} from '../../common/utils';
  export default {
    name: 'moneyDetail',
    created: function () {
      this.initOrderDetail();
    },
    data () {
      return {
        orderDetail: {}
      }
    },
    computed: {
      orderId: function () {
        // 获取当前查看的订单
        return this.$store.state.pageCfg.currentOrderId;
      }
    },
    methods: {
      initOrderDetail: function () {
        // eslint-disable-next-line no-unused-vars
        let orderId = this.orderId;
        // 调用获取订单金额明细接口
        this.$JHttp.get(window.homeURL + '/sharedPark/order/' + orderId + '/details').then((res) => {
          if (res.data.status === 100) {
            let order = res.data.data;
            if (order) {
              let status = order.orderStatus;
              let orderStatus = this.getOrderStatus(status);
              let isPay = false;
              if (order.isPay === 1) {
                isPay = true;
              }
              let orderDetail = {
                orderStatus: orderStatus,
                isPay: isPay,
                totalMoney: order.amount
              };
              let moneyTitleStr = this.getMoneyTitleStr(orderStatus);
              this.$set(orderDetail, 'moneyTitleStr', moneyTitleStr);
              let details = res.data.data.details;
              let chargeInfo = {};
              if (details && details.length) {
                let _this_ = this;
                details.forEach(function (detail) {
                  // 计费类型(1,正常；2,超时；3,取消；4,关闭)
                  let type = detail.type;
                  if (type !== 2) { // 正常时段(1,3,4其实都按正常计费)
                    chargeInfo.normalLast = _this_.getLastStr(detail);
                    chargeInfo.normalBeginChargeTime = jlDate.Dateformat(detail.beginTime, 'MM-DD HH:mm');
                    chargeInfo.normalEndChargeTime = jlDate.Dateformat(detail.endTime, 'MM-DD HH:mm');
                    chargeInfo.normalMoney = detail.amount;
                  } else { // 超时时段
                    chargeInfo.overtimeLast = _this_.getLastStr(detail);
                    chargeInfo.overtimeBeginChargeTime = jlDate.Dateformat(detail.beginTime, 'MM-DD HH:mm');
                    chargeInfo.overtimeEndChargeTime = jlDate.Dateformat(detail.endTime, 'MM-DD HH:mm');
                    chargeInfo.overtimeMoney = detail.amount;
                  }
                });
              }
              this.$set(orderDetail, 'chargeInfo', chargeInfo);
              this.orderDetail = orderDetail;
            }
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
      },
      // 映射订单状态
      getOrderStatus: function (status) {
        let orderStatus;
        if (status === 0) {
          orderStatus = 5; // 已取消
        } else if (status === 1) {
          orderStatus = 2; // 待开始
        } else if (status === 2) {
          orderStatus = 3; // 计费中
        } else if (status === 3) {
          orderStatus = 1 // 待支付
        } else if (status === 4) {
          orderStatus = 4; // 已支付
        } else {
          orderStatus = -1; // 未知,预留状态
        }
        return orderStatus;
      },
      // 获取订单时长字符串
      getLastStr: function (detail) {
        let hours = detail.hours;
        let minutes = detail.minutes;
        let lastStr = '';
        if (!hours && !minutes) {
          return '一';
        }
        if (hours) {
          lastStr += hours + '小时';
        }
        if (minutes) {
          lastStr += minutes + '分钟';
        }
        return lastStr;
      },
      /**
       * 获取金额标题
       * @param isPay 支付状态
       * @returns {*} 金额标题
       */
      getMoneyTitleStr: function (orderStatus) {
        if (orderStatus === 4) { // 已支付
          return '实付金额:';
        } else { // 待支付
          return '应付金额:';
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .money-detail-wrapper {
    width: 100%;
    height: 100%;
    background-color: #ebebeb;
    padding-top: 0.213333rem;
    .top {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2.986667rem;
      color: #333;
      background-color: #fff;
      font-size: 26px;
    }
    .content {
      background-color: #fff;
      .normal-wrapper, .overtime-wrapper {
        padding: 0.4rem 0.4rem 0.266667rem 0.4rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
        .total {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          color: #333;
          margin-bottom: 0.266667rem;
          line-height: 12px;
          .left {
            display: flex;
            align-items: center;
            text-align: left;
            .title {
              flex: 0 0 2.24rem;
            }
            .value {
              flex: 1;
              white-space: nowrap;
            }
          }
        }
        .charge {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          text-align: left;
          color: #aaa;
          .begin {
            margin-bottom: 0.266667rem;
          }
          .begin, .end {
            width: 100%;
            display: flex;
            line-height: 12px;
            .title {
              flex: 0 0 2.24rem;
            }
            .value {
              flex: 1;
            }
          }
        }
      }
      .overtime-wrapper {
        padding-top: 0;
        padding-bottom: 0.506667rem;
      }
      .money-wrapper {
        padding: 0 0.4rem;
        .total-money, .pay-money {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.4rem;
          color: #333;
          font-size: 14px;
          line-height: 14px;
        }
      }
    }
  }
  [data-dpr="2"]
  .money-detail-wrapper {
    .top {
      font-size: 56px;
    }
    .content {
      .normal-wrapper, .overtime-wrapper {
        font-size: 24px;
        .total {
          line-height: 24px;
        }
        .charge {
          .begin, .end {
            line-height: 24px;
          }
        }
      }
      .money-wrapper {
        .total-money, .pay-money {
          font-size: 30px;
          line-height: 30px;
        }
      }
    }
  }
  [data-dpr="3"]
  .money-detail-wrapper {
    .top {
      font-size: 82px;
    }
    .content {
      .normal-wrapper, .overtime-wrapper {
        font-size: 42px;
        .total {
          line-height: 42px;
        }
        .charge {
          .begin, .end {
            line-height: 42px;
          }
        }
      }
      .money-wrapper {
        .total-money, .pay-money {
          font-size: 54px;
          line-height: 54px;
        }
      }
    }
  }
</style>
