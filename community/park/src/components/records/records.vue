<template>
  <div class="records-wrapper" v-if="!isLoading">
    <div class="placeholder" v-if="!recordsList.length">
      <span class="icon"></span>
      <div class="text">暂无相关内容</div>
    </div>
    <j-pull v-if="recordsList.length" :refreshFunc="refreshFunc" :loadMore="loadMore">
      <ul class="records-list-wrapper">
        <li class="records-item vux-1px-b" v-for="record in recordsList"
            @click="showRecordDetail(record.orderId)">
          <div class="top">
            <div class="left">
              <span class="project-name" v-text="record.communityName"></span>
            </div>
            <div class="right">
              <span class="order-description" :class="{ orderFinished: record.orderFinished }"
                    v-text="record.orderDescription"></span>
            </div>
          </div>
          <div class="middle vux-1px-b">
            <div class="reserve-time">
              <span class="title">预约时段:</span>
              <span class="value" v-text="record.reserveTimeStr"></span>
            </div>
            <div class="parking-no">
              <span class="title">车位号:</span>
              <span class="value" v-text="record.parkingNO"></span>
            </div>
            <div class="car-no">
              <span class="title">车牌号:</span>
              <span class="value" v-text="record.carNO"></span>
            </div>
            <div class="total-money">
              <span class="title" v-text="record.moneyTitleStr + ':'"></span>
              <span class="value" v-text="'¥' + record.totalMoney"></span>
            </div>
          </div>
          <div class="bottom">
            <div class="left">
              <span class="dot"></span>
              <span class="car-status" v-text="record.carStatusStr"></span>
            </div>
            <div class="right" v-if="record.carTips">
              <span class="dot"></span>
              <span class="car-tips" v-text="record.carTips"></span>
            </div>
          </div>
        </li>
      </ul>
    </j-pull>
  </div>
</template>

<script>
  import router from '../../router';
  import {querystring} from 'vux';
  import Toast from 'components/utils/toast/toast';
  import JPull from 'components/utils/pagination/jpull';
  export default {
    name: 'records',
    created: function () {
      document.title = '停车记录';
      this.$store.commit('updateTabStatus', {
        tabStatus: [false, false, true]
      });
      this.checkWaitingPayOrder();
    },
    data () {
      return {
        isLoading: true,
        recordsList: []
      }
    },
    components: {
      'j-pull': JPull
    },
    methods: {
      // 检查是否有待支付订单
      checkWaitingPayOrder: function (pageIndex, pageSize, cb) {
        let _this_ = this;
        this.$JHttp.get(window.homeURL + '/sharedPark/order/statusStatistic').then((res) => {
          if (res.data.status === 100) {
            let data = res.data.data;
            if (data) {
              if (data.pendingPayCount) {
                router.replace('/home/park');
                return;
              } else {
                _this_.initRecordsList(pageIndex, pageSize, cb);
              }
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
      initRecordsList: function (pageIndex, pageSize, cb) {
        let postData = {
          curPage: pageIndex || 1,
          pageSize: pageSize || 20
        };
        let postDataStr = querystring.stringify(postData);
        let _this_ = this;
        this.$JHttp.get(window.homeURL + '/sharedPark/order?' + postDataStr).then((res) => {
          if (res.data.status === 100) {
            if (res.data.data && res.data.data.resultList && res.data.data.resultList.length) {
              let recordsList = [];
              let dataList = res.data.data.resultList;
              dataList.forEach(function (record) {
                let orderStatus;
                if (record.orderStatus === -1) {
                  orderStatus = 5; // 已取消
                } else if (record.orderStatus === 0 || record.orderStatus === 1) {
                  orderStatus = 2; // 待开始
                } else if (record.orderStatus === 2) {
                  orderStatus = 3; // 计费中
                } else if (record.orderStatus === 3) {
                  orderStatus = 1 // 待支付
                } else if (record.orderStatus === 4) {
                  orderStatus = 4; // 已支付
                } else {
                  orderStatus = -1; // 未知,预留状态
                }
                let orderFinished = false;
                if (orderStatus === 4 || orderStatus === 5) {
                  orderFinished = true;
                }
                recordsList.push({
                  orderId: record.id,
                  orderStatus: orderStatus,
                  orderFinished: orderFinished,
                  communityName: record.communityName, // 项目名称
                  isPay: record.isPay, // 0,未支付, 1,已支付
                  isOvertime: record.isOvertime, // 是否超时停放（0、否；1、是）
                  orderType: record.orderType, // 订单类型 1: 即时停车, 2: 预约停车
                  fullTimeShared: record.fullTimeShared, // 是否7*24共享车位 1:是, 0:否
                  carStatus: record.parkingStatus, // 0 未入场, 1 已入场 , 2 已离场
                  reserveTimeStr: record.reserveTimeStr, // 预约时段
                  inTime: record.reserveBeginTime, // 下单时选择的预计入场时间
                  enterTime: record.parkingBeginTime, // 业主实际入场时间
                  outTime: record.reserveEndTime, // 下单时选择的预计离场时间
                  leaveTime: record.parkingEndTime, // 业主实际离场时间
                  parkingCloseTime: record.shareEndTime, // 车位在本分享时间段最后关闭时间
                  payTime: record.payTime, // 支付时间
                  hours: record.hours, // 距离计费开始剩余的小时数
                  minutes: record.minutes, // 距离计费开始剩余的分钟数
                  parkingNO: record.spaceName, // 车位号
                  carNO: record.carNum, // 车牌号
                  tip: record.tip, // 入离场提示
                  totalMoney: record.amount, //  合计金额
                  holdLast: record.keepHour
                })
              });
              _this_.recordsList = recordsList;
              if (_this_.recordsList && _this_.recordsList.length) { // 存在停车记录
                let orderList = _this_.recordsList;
                orderList.forEach(function (order) {
                  let orderDescription = _this_.getOrderDescription(order);
                  _this_.$set(order, 'orderDescription', orderDescription);
                  let moneyTitleStr = _this_.getMoneyTitleStr(order);
                  _this_.$set(order, 'moneyTitleStr', moneyTitleStr);
                  let carStatusStr = _this_.getCarStatusStr(order); // 车辆入离场状态
                  _this_.$set(order, 'carStatusStr', carStatusStr);
                  let carTips = _this_.getCarTips(order); // 车辆入离场友情提示
                  _this_.$set(order, 'carTips', carTips);
                });
              }
            }
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
          _this_.isLoading = false;
          cb && cb(true);
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
          _this_.isLoading = false;
          cb && cb(false);
        });
      },
      /**
       * 获取订单描述
       * @param order 订单实体
       * @returns {string} 订单描述
       */
      getOrderDescription (order) {
        let orderDescription = '';
        let orderStatus = order.orderStatus;
        switch (orderStatus) {
          case 2: // 待开始
            orderDescription = this.getWaitingStartOrderDescription(order);
            break;
          case 3:
            orderDescription = '计费中';
            break;
          case 5:
            orderDescription = '已取消';
            break;
          case 4:
            orderDescription = '已支付';
            break;
          default:
            break;
        }
        return orderDescription;
      },
      /**
       *  获取待开始订单的订单描述
       * @param order 订单实体
       * @returns {string} 15分钟后计费
       */
      getWaitingStartOrderDescription: function (order) {
        let hours = order.hours;
        let minutes = order.minutes;
        let orderDescription = '';
        if (hours) {
          orderDescription = hours + '小时后计费';
        } else if (minutes) {
          orderDescription = minutes + '分钟后计费';
        }
        return orderDescription;
      },
      /**
       * 获取金额标题描述
       * @param orderStatus 订单状态
       * @return {string} 车辆状态描述
       */
      getMoneyTitleStr (order) {
        let orderStatus = order.orderStatus;
        let moneyTitleStr = '';
        switch (orderStatus) {
          case 2:
          case 3:
          case 5:
            moneyTitleStr = '合计金额';
            break;
          case 4:
            moneyTitleStr = '实付金额';
            break;
          default:
            break;
        }
        let isPay = order.isPay;
        if (isPay) {
          moneyTitleStr = '实付金额';
        }
        return moneyTitleStr;
      },
      /**
       * 获取车辆入离场状态
       * @param carStatus 车辆状态
       * @return {string} 车辆状态描述
       */
      getCarStatusStr (order) {
        let carStatus = order.carStatus;
        let carStatusStr = '';
        switch (carStatus) {
          case 0:
            carStatusStr = '未入场';
            break;
          case 1:
            carStatusStr = '已入场';
            break;
          case 2:
            let leaveTime = order.leaveTime;
            carStatusStr = leaveTime + ' 已出场';
            break;
        }
        return carStatusStr;
      },
      /**
       *  获取入离场提示
       * @param order
       * @returns {string} eg:已入场，已逾期X小时X分钟
       */
      getCarTips: function (order) {
        let carTips = order.tip;
        return carTips;
      },
      refreshFunc: function (pageIndex, pageSize, cb) {
        this.checkWaitingPayOrder(pageIndex, pageSize, cb);
      },
      loadMore: function (pageIndex, pageSize, cb) {
        let postData = {
          curPage: pageIndex,
          pageSize: pageSize
        };
        let postDataStr = querystring.stringify(postData);
        this.$JHttp.get(window.homeURL + '/sharedPark/order?' + postDataStr).then((res) => {
          if (res.data.status === 100) {
            if (res.data.data && res.data.data.resultList && res.data.data.resultList.length) {
              let _this_ = this;
              let dataList = res.data.data.resultList;
              dataList.forEach(function (record) {
                let orderStatus;
                if (record.orderStatus === -1) {
                  orderStatus = 5; // 已取消
                } else if (record.orderStatus === 0 || record.orderStatus === 1) { // 0:未入场 1:已入场,未计费
                  orderStatus = 2; // 待开始
                } else if (record.orderStatus === 2) {
                  orderStatus = 3; // 计费中
                } else if (record.orderStatus === 3) {
                  orderStatus = 1 // 待支付
                } else if (record.orderStatus === 4) {
                  orderStatus = 4; // 已支付
                } else {
                  orderStatus = -1; // 未知,预留状态
                }
                let orderFinished = false;
                if (orderStatus === 5 || orderStatus === 4) {
                  orderFinished = true;
                }
                _this_.recordsList.push({
                  orderId: record.id,
                  communityName: record.communityName, // 项目名称
                  orderStatus: orderStatus,
                  orderFinished: orderFinished,
                  isPay: record.isPay, // 0,未支付, 1,已支付
                  isOvertime: record.isOvertime, // 是否超时停放（0、否；1、是）
                  orderType: record.orderType, // 订单类型 1: 即时停车, 2: 预约停车
                  fullTimeShared: record.fullTimeShared, // 是否7*24共享车位 1:是, 0:否
                  carStatus: record.parkingStatus, // 0 未入场, 1 已入场 , 2 已离场
                  reserveTimeStr: record.reserveTimeStr, // 预约时段
                  inTime: record.reserveBeginTime, // 下单时选择的预计入场时间
                  enterTime: record.parkingBeginTime, // 业主下单时选择的预计入场时间
                  outTime: record.reserveEndTime, // 下单时选择的预计离场时间
                  leaveTime: record.parkingEndTime, // 司机实际离场时间
                  parkingCloseTime: record.shareEndTime, // 车位在本分享时间段最后关闭时间
                  payTime: record.payTime, // 支付时间
                  parkingNO: record.spaceName, // 车位号
                  carNO: record.carNum, // 车牌号
                  tip: record.tip, // 入离场提示
                  totalMoney: record.amount //  合计金额
                })
              });
              if (this.recordsList && this.recordsList.length) { // 存在停车记录
                let orderList = this.recordsList;
                let _this_ = this;
                orderList.forEach(function (order) {
                  let orderDescription = _this_.getOrderDescription(order);
                  _this_.$set(order, 'orderDescription', orderDescription);
                  let moneyTitleStr = _this_.getMoneyTitleStr(order);
                  _this_.$set(order, 'moneyTitleStr', moneyTitleStr);
                  let carStatusStr = _this_.getCarStatusStr(order); // 车辆入离场状态
                  _this_.$set(order, 'carStatusStr', carStatusStr);
                  let carTips = _this_.getCarTips(order); // 车辆入离场友情提示
                  _this_.$set(order, 'carTips', carTips);
                });
              }
              let hasMore = res.data.data.pageResult.hasMore;
              this.$nextTick(() => {
                setTimeout(function () {
                  cb(hasMore);
                }, 10);
              });
            } else {
              let hasMore = false;
              this.$nextTick(() => {
                setTimeout(function () {
                  cb(hasMore);
                }, 10);
              });
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
      showRecordDetail: function (orderId) {
        // 更新当前查看的订单ID
        this.$store.commit('updateCurrentOrderId', {
          currentOrderId: orderId
        });
        // 跳转至订单详情页
        router.push('/records/recordDetail');
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .records-wrapper {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #ebebeb;
    .placeholder {
      padding-top: 4.72rem;
      .icon {
        display: block;
        width: 2.666667rem;
        height: 2.666667rem;
        margin: 0 auto;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url("../../assets/img/@2x/placeholder.png");
      }
      .text {
        margin-top: 0.4rem;
        color: #aaa;
        font-size: 12px;
      }
    }
    .records-list-wrapper {
      padding: 0.4rem 0.4rem;
      .records-item {
        margin-bottom: 0.4rem;
        padding: 0 0.4rem;
        color: #333;
        background-color: #fff;
        border-radius: 0.266667rem;
        box-shadow: 0 0.066667rem 0.106667rem rgba(24, 173, 251, 0.08) ;
        .top {
          display: flex;
          justify-content: space-between;
          align-items:center;
          height: 1.44rem;
          .left {
            font-size: 14px;
          }
          .right {
            display: flex;
            align-items: center;
            .order-description {
              display: inline-block;
              background-color: #fbbe18;
              border-radius: 2.666667rem;
              height: 0.533333rem;
              line-height: 0.533333rem;
              min-width: 0.933333rem;
              padding: 0 0.346667rem;
              font-size: 12px;
              white-space: nowrap;
            }
            .orderFinished {
              background-color: #ebebeb;
              color: #aaa;
            }
          }
        }
        .middle {
          display: flex;
          flex-direction: column;
          align-items: center;
          .reserve-time, .parking-no {
            width: 100%;
            display: flex;
            text-align: left;
            margin-bottom: 0.166667rem;
            .title {
              flex: 0 0 1.813333rem;
              font-size: 12px;
            }
            .value {
              flex: 1;
              font-size: 12px;
            }
          }
          .car-no, .total-money {
            width: 100%;
            display: flex;
            align-items: center;
            text-align: left;
            .title {
              flex: 0 0 1.813333rem;
              font-size: 12px;
              line-height: 12px;
            }
            .value {
              flex: 1;
              font-size: 12px;
              line-height: 12px;
            }
          }
          .car-no {
            margin-bottom: 0.266667rem;
          }
          .total-money {
            margin-bottom: 0.32rem;
          }
        }
        .bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 0.986667rem;
          .left {
            font-size: 0;
            display: flex;
            align-items: center;
            .dot {
              display: inline-block;
              width: 0.106667rem;
              height: 0.106667rem;
              background-color: #18adfb;
              border-radius: 50%;
              margin-right: 0.213333rem;
            }
            .car-status {
              font-size: 12px;
            }
          }
          .right {
            font-size: 0;
            display: flex;
            align-items: center;
            .dot {
              display: inline-block;
              width: 0.106667rem;
              height: 0.106667rem;
              background-color: #18adfb;
              border-radius: 50%;
              margin-right: 0.213333rem;
            }
            .car-tips {
              font-size: 12px;
            }
          }
        }
      }
    }
    .records-list-wrapper div:last-child {
      margin-bottom: 0;
    }
  }
  [data-dpr="2"]
  .records-wrapper {
    .placeholder {
      .text {
        font-size: 24px;
      }
    }
    .records-item {
      .top {
        .left {
          font-size: 30px;
        }
        .right {
          .order-description {
            font-size: 24px;
          }
        }
      }
      .middle {
        .reserve-time, .parking-no {
          .title {
            font-size: 24px;
          }
          .value {
            font-size: 24px;
          }
        }
        .car-no, .total-money {
          .title {
            font-size: 24px;
            line-height: 24px;
          }
          .value {
            font-size: 24px;
            line-height: 24px;
          }
        }
      }
      .bottom {
        .left {
          .car-status {
            font-size: 24px;
          }
        }
        .right {
          .car-tips {
            font-size: 24px;
          }
        }
      }
    }
  }
  [data-dpr="3"]
  .records-wrapper {
    .placeholder {
      .icon {
        background-image: url("../../assets/img/@3x/placeholder@3x.png");
      }
      .text {
        font-size: 42px;
      }
    }
    .records-item {
      .top {
        .left {
          font-size: 54px;
        }
        .right {
          .order-description {
            font-size: 42px;
          }
        }
      }
      .middle {
        .reserve-time, .parking-no {
          .title {
            font-size: 42px;
          }
          .value {
            font-size: 42px;
          }
        }
        .car-no, .total-money {
          .title {
            font-size: 42px;
            line-height: 42px;
          }
          .value {
            font-size: 42px;
            line-height: 42px;
          }
        }
      }
      .bottom {
        .left {
          .car-status {
            font-size: 42px;
          }
        }
        .right {
          .car-tips {
            font-size: 42px;
          }
        }
      }
    }
  }
</style>
