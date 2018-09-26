<template>
  <div class="record-detail-wrapper" v-if="!isLoading">
    <div class="body">
      <div class="top">
        <div class="parking-no">
          <div class="left">
            <span class="text" v-text="recordDetail.communityName + '-' + recordDetail.parkingNO"></span>
            <span class="icon" v-if="false"></span>
          </div>
          <div class="right" @click="showOrderTimeLine">
            <span class="order-description" :class="{ orderFinished: recordDetail.orderFinished }"
                  v-text="recordDetail.orderDescription"></span>
          </div>
        </div>
        <div class="detail">
          <div class="left">
            <div class="reserve-time">
              <span class="title">预约时段:</span>
              <span class="value" v-text="recordDetail.reserveTimeStr"></span>
            </div>
            <div class="car-no" @click="showCarNOModal">
              <span class="title">车牌号:</span>
              <span class="value" v-text="recordDetail.carNO"></span>
            </div>
            <div class="order-no">
              <span class="title">订单号:</span>
              <span class="value" v-text="recordDetail.orderNO"></span>
            </div>
            <div class="order-create-time">
              <span class="title">提交订单:</span>
              <span class="value" v-text="recordDetail.createTime"></span>
            </div>
            <div class="order-pay-time" v-if="recordDetail.orderStatus === 5">
              <span class="title">取消订单:</span>
              <span class="value" v-text="recordDetail.cancelTime"></span>
            </div>
            <div class="order-pay-time" v-if="recordDetail.orderStatus === 4">
              <span class="title">支付费用:</span>
              <span class="value" v-text="recordDetail.payTime"></span>
            </div>
          </div>
          <a class="right" :href="recordDetail.telStr">
            <span class="icon"></span>
            <span class="text">联系物业</span>
          </a>
        </div>
        <div class="money-wrapper vux-1px-b vux-1px-t">
          <span class="title">合计</span>
          <span class="total-money" v-text="'¥' + ' ' + recordDetail.totalMoney"></span>
          <div class="show-detail" @click="showMoneyDetail">
            <span class="title">查看明细</span>
            <span class="icon"></span>
          </div>
        </div>
        <!--未入场 begin（单行显示）-->
        <div class="car-status-one" v-if="recordDetail.carStatus === 0">
          <div class="left">
            <span class="dot"></span>
            <span class="status-text" v-text="recordDetail.carStatusStr"></span>
          </div>
          <div class="right" v-if="recordDetail.orderStatus == 2 ||
        recordDetail.orderStatus === 3">
            <span class="dot"></span>
            <span class="car-tips" v-text="recordDetail.carTips"></span>
          </div>
        </div>
        <!--未入场 end-->
        <!--已入场 begin-->
        <div class="car-status-other" v-if="recordDetail.carStatus !== 0">
          <div class="car-status-top">
            <span class="dot"></span>
            <span class="intime-text" v-text="recordDetail.enterTime + ' 已入场'"></span>
          </div>
          <div class="car-status-bottom" v-if="recordDetail.carTips">
            <span class="dot"></span>
            <span class="car-tips" v-text="recordDetail.carTips"></span>
          </div>
        </div>
        <!--已入场 end-->
      </div>
      <div class="content">
        <div class="warn">请您停放至指定车位，并在车位关闭时间前离场，若逾期将面临多倍罚款。</div>
        <div class="fee-rule" @click="showRuleDescription">计费规则</div>
        <div class="qr-code" v-if="recordDetail.orderStatus === 2 || recordDetail.orderStatus === 3">
          <div class="img-wrapper">
            <!--<img class="img" :src="recordDetail.qrCodeAddress" alt="">-->
            <qrcode :value="recordDetail.qrCodeContent" :size="qrSize" type="img" :bg-color="'#ebebeb'"></qrcode>
          </div>
          <span class="text">您可以使用访客二维码快速进出园区</span>
        </div>
        <div class="share" v-show="false"></div>
        <div class="pay-wrapper" v-if="recordDetail.orderStatus === 1" @click="showPayPop">
          <j-button jText="去支付" type="primary"></j-button>
        </div>
      </div>
    </div>
    <div class="footer" v-if="recordDetail.isCancelable">
      <div class="cancel-wrapper">
        <div class="cancel-tips" v-text="recordDetail.cancelTips"></div>
        <div class="cancel-order" @click="showCancelOrderModal">
          <j-button jText="取消" :jstyle="jstyle"></j-button>
        </div>
      </div>
    </div>
    <!--查看车牌Modal begin-->
    <x-dialog v-model="carNOModal.isShow" class="carNOModalWrapper" :dialog-style="carNOModal.carNOModalStyle" hide-on-blur>
      <span class="car-no" v-text="recordDetail.carNO"></span>
      <div class="car-info">
        <span class="name" v-text="recordDetail.carOwnerName"></span>
        <span class="phone" v-text="recordDetail.carOwnerPhone"></span>
      </div>
    </x-dialog>
    <!--查看车牌Modal end-->
    <!--取消订单Modal begin-->
    <x-dialog class="cancel-order-modal-wrapper" v-model="cancelOrderModal.isShow" :dialog-style="cancelOrderModal.cancelOrderModalStyle" hide-on-blur>
      <span class="cancel-info vux-1px-b" v-text="cancelOrderModal.text"></span>
      <div class="operate-wrapper">
        <span class="text vux-1px-r" @click="cancelOrderModal.isShow = false">再想想</span>
        <span class="text" @click="cancelOrder">继续</span>
      </div>
    </x-dialog>
    <!--取消订单Modal end-->
    <!--支付弹出层begin-->
    <div>
      <popup v-model="payPopShow">
        <pay :order="recordDetail" :totalMoney = "recordDetail.totalMoney"
        v-on:refreshPage="initRecordDetail"></pay>
      </popup>
    </div>
    <!--支付弹出层end-->
  </div>
</template>

<script>
  // 获取根节点字体大小
  const htmlFontSize = getComputedStyle(window.document.documentElement)['font-size'];
  const remRate = parseInt(htmlFontSize.substring(0, (htmlFontSize.length - 2)));
  const qrSize = remRate * 1.786667;
  import {mapState} from 'vuex';
  import router from '../../router';
  import {jlDate} from '../../common/utils';
  import JButton from 'components/utils/jbutton';
  import Popup from '../utils/popup/index';
  import Pay from 'components/park/pay';
  import Toast from 'components/utils/toast/toast';
  import {Qrcode} from 'vux';
  export default {
    name: 'recordDetail',
    created: function () {
      document.title = '记录详情';
      // 支付数据非法(ps: 选择支付宝支付,未支付,再回到回来啦社区,点击返回)
      if (!this.currentOrderId) {
        router.replace('/home/park');
        return;
      }
      this.initRecordDetail();
    },
    data () {
      return {
        isLoading: true,
        recordDetail: {},
        qrSize: qrSize,
        payPopShow: false,
        jstyle: {
          backgroundColor: '#666'
        },
        carNOModal: {
          isShow: false,
          carNOModalStyle: {
            maxWidth: '100%',
            width: '70%',
            borderRadius: '0.266667rem',
            padding: '0.733333rem 0',
            color: '#333'
          }
        },
        cancelOrderModal: {
          isShow: false,
          text: '',
          cancelOrderModalStyle: {
            maxWidth: '100%',
            width: '70%',
            padding: '0.4rem 0 0 0',
            borderRadius: '0.266667rem'
          }
        }
      }
    },
    computed: mapState({
      propertyPhone: state => state.pageCfg.propertyPhone,
      currentOrderId: state => state.pageCfg.currentOrderId
    }),
    components: {
      'j-button': JButton,
      Popup,
      Qrcode,
      'pay': Pay
    },
    methods: {
      initRecordDetail: function () {
        this.payPopShow = false;
        let orderId = this.currentOrderId;
        let _this_ = this;
        // 根据订单Id,获取订单详情
        this.$JHttp.get(window.homeURL + '/sharedPark/order/' + orderId).then((res) => {
          if (res.data.status === 100) {
            if (res.data.data) {
              let orderDetail = res.data.data;
              let orderStatus;
              if (orderDetail.orderStatus === -1) {
                orderStatus = 5; // 已取消
              } else if (orderDetail.orderStatus === 0 || orderDetail.orderStatus === 1) {
                orderStatus = 2; // 待开始
              } else if (orderDetail.orderStatus === 2) {
                orderStatus = 3; // 计费中
              } else if (orderDetail.orderStatus === 3) {
                orderStatus = 1 // 待支付
              } else if (orderDetail.orderStatus === 4) {
                orderStatus = 4; // 已支付
              } else {
                orderStatus = -1; // 未知,预留状态
              }
              let orderFinished = false;
              if (orderStatus === 4 || orderStatus === 5) {
                orderFinished = true;
              }
              _this_.recordDetail = {
                communityName: orderDetail.communityName, // 项目名称
                parkingNO: orderDetail.spaceName,
                carNO: orderDetail.carNum,
                tip: orderDetail.tip, // 入离场提示
                carOwnerName: orderDetail.driverName,
                carOwnerPhone: orderDetail.driverMobile,
                orderType: orderDetail.orderType,
                fullTimeShared: orderDetail.fullTimeShared, // 是否7*24共享车位 1:是, 0:否
                orderStatus: orderStatus, // 订单状态,1: 待支付 2: 待开始, 3:计费中 4.已支付, 5:已取消
                orderFinished: orderFinished,
                isPay: orderDetail.isPay, // 0: 未支付, 1: 已支付
                orderNO: orderDetail.orderNo,
                createTime: orderDetail.intime, // 创建时间
                cancelTime: orderDetail.cancelTime, // 取消订单时间
                payTime: orderDetail.payTime, // 支付时间
                propertyPhone: _this_.propertyPhone,
                totalMoney: orderDetail.amount, // 合计金额
                carStatus: orderDetail.parkingStatus, // 0 未入场, 1 已入场 , 2 已离场
                reserveTimeStr: orderDetail.reserveTimeStr, // 预约时段
                inTime: orderDetail.reserveBeginTime, // 下单时选择的预计入场时间
                enterTime: orderDetail.parkingBeginTime && jlDate.Dateformat(orderDetail.parkingBeginTime, 'MM-DD HH:mm'), // 司机实际入场时间
                outTime: orderDetail.reserveEndTime, // 下单时选择的预计离场时间
                leaveTime: orderDetail.parkingEndTime, // 司机实际离场时间
                parkingCloseTime: orderDetail.shareEndTime, // 车位在本分享时间段最后关闭时间
                qrCodeContent: orderDetail.passCode, // passCode 自行生成
                hours: orderDetail.hours, // 距离计费开始剩余的小时数
                minutes: orderDetail.minutes, // 距离计费开始剩余的分钟数
                rent: parseFloat(orderDetail.normalPrice), // 正常时段价格
                freeLast: orderDetail.freeMinute, // 即时停车免费时长（供车主找寻车位）
                holdLast: orderDetail.keepHour, // 车位保留时长
                aheadIn: orderDetail.advanceMinute // 预约停车可提前入场时间
              };
              _this_.$set(_this_.recordDetail, 'orderId', orderId);
              // 获取订单描述
              let orderDescription = _this_.getOrderDescription(_this_.recordDetail);
              _this_.$set(_this_.recordDetail, 'orderDescription', orderDescription);
              // 物业电话telStr
              let telStr = 'tel:' + _this_.recordDetail.propertyPhone;
              _this_.$set(_this_.recordDetail, 'telStr', telStr);
              // 车辆进出场描述
              let carStatusStr = _this_.getCarStatusStr(_this_.recordDetail.carStatus);
              _this_.$set(_this_.recordDetail, 'carStatusStr', carStatusStr);
              // 车辆进出场友情提示
              let carTips = _this_.getCarTips(_this_.recordDetail);
              _this_.$set(_this_.recordDetail, 'carTips', carTips);
              // 订单是否可取消
              let isCancelable = _this_.isCancelable(_this_.recordDetail);
              _this_.$set(_this_.recordDetail, 'isCancelable', isCancelable);
              _this_.setCancelTips(); // 设置取消提示语
              // 获取计费时长明细
              let details = res.data.data.details;
              if (details && details.length) {
                // 计费类型(1,正常；2,超时；3,取消；4,关闭)
                let normalTimeLast, normalMoney, overtimeLast, overtimeMoney;
                details.forEach(function (detail) {
                  let type = detail.type;
                  if (type !== 2) { // 正常时段(1,3,4其实都按正常计费)
                    normalTimeLast = _this_.getLastStr(detail);
                    normalMoney = detail.amount;
                  } else { // 超时时段
                    overtimeLast = _this_.getLastStr(detail);
                    overtimeMoney = detail.amount;
                  }
                  _this_.$set(_this_.recordDetail, 'normalTimeLast', normalTimeLast);
                  _this_.$set(_this_.recordDetail, 'normalMoney', normalMoney);
                  _this_.$set(_this_.recordDetail, 'overtimeLast', overtimeLast);
                  _this_.$set(_this_.recordDetail, 'overtimeMoney', overtimeMoney);
                });
              }
            }
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
          _this_.isLoading = false;
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
          _this_.isLoading = false;
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
          case 1: // 待支付
            orderDescription = '待支付';
            break;
          case 2: // 待开始
            // let chargeBegin = this.getChargeBegin(order);
            orderDescription = this.getWaitingStartOrderDescription(order);
            break;
          case 3:
            orderDescription = '计费中';
            break;
          case 4:
            orderDescription = '已支付';
            break;
          case 5:
            orderDescription = '已取消';
            break;
          default:
            break;
        }
        return orderDescription;
      },
      /**
       * 获取开始计费时间
       * @param order 订单实体
       * @return {datetime} 开始计费时间
       */
      getFreeCancel: function (order) {
        let orderType = order.orderType;
        let freeCancel;
        if (orderType === 1) { // 即时停车
          let inTime = new Date(order.inTime.replace(/-/g, '/'));
          let freeLast = order.freeLast;
          freeCancel = jlDate.addMinutes(inTime, freeLast);
        } else if (orderType === 2) { // 预约停车
          let inTime = new Date(order.inTime.replace(/-/g, '/'));
          let aheadIn = order.aheadIn;
          freeCancel = jlDate.addMinutes(inTime, -aheadIn);
        }
        return freeCancel;
      },
      /**
       * 获取开始计费时间
       * @param order 订单实体
       * @return {datetime} 开始计费时间
       */
      getChargeBegin: function (order) {
        let orderType = order.orderType;
        let chargeBegin;
        if (orderType === 1) { // 即时停车
          let inTime = new Date(order.inTime.replace(/-/g, '/'));
          let freeLast = order.freeLast;
          chargeBegin = jlDate.addMinutes(inTime, freeLast);
        } else if (orderType === 2) { // 预约停车
          let inTime = new Date(order.inTime.replace(/-/g, '/'));
          chargeBegin = inTime;
        }
        return chargeBegin;
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
       * 获取车辆入离场状态
       * @param carStatus 车辆状态
       * @return {string} 车辆状态描述
       */
      getCarStatusStr (carStatus) {
        let carStatusStr = '';
        switch (carStatus) {
          case 0:
            carStatusStr = '未入场';
            break;
          case 1:
            carStatusStr = '已入场';
            break;
          case 2:
            carStatusStr = '已离场';
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
      /**
       * 订单是否可取消
       * @param order 订单实体
       * @returns {boolean} 订单是否可取消
       */
      isCancelable: function (order) {
        let carStatus = order.carStatus;
        if (carStatus !== 0) { // 车辆已入场
          return false;
        } else {
          let orderStatus = order.orderStatus;
          // 订单为待支付或已支付或已取消
          if (orderStatus === 1 || orderStatus === 4 || orderStatus === 5) {
            return false;
          }
        }
        return true;
      },
      /**
       * 取消订单的友情提示
       * @param order 订单实体
       * @returns {string} 取消订单的友情提示
       */
      setCancelTips: function () {
        let order = this.recordDetail;
        let isCancelable = order.isCancelable;
        let cancelTips = '';
        if (!isCancelable) { // 无法取消,隐藏取消按钮和提示文案
          this.$set(this.recordDetail, 'cancelTips', '');
          return;
        }
        let _this_ = this;
        this.$JHttp.get(window.homeURL + '/sharedPark/order/' + order.orderId + '/cancel/calculate').then((res) => {
          if (res.data.status === 100) {
            let data = res.data.data;
            if (data) {
              let isFree = data.isFree;
              if (isFree) { // 无偿取消
                let freeCancelDeadTime = data.billingTime;
                let orderType = order.orderType;
                if (orderType === 1) { // 即时停车
                  cancelTips = '您可在' + freeCancelDeadTime + '前免费取消';
                } else if (orderType === 2) {
                  cancelTips = '您最早可在' + freeCancelDeadTime + '进入,这之前可免费取消';
                } else {
                  cancelTips = '';
                }
              } else { // 有偿取消
                let money = data.amount;
                cancelTips = '现在取消将收取您' + money + '元';
              }
            } else {
              // 接口没有返回数据
              Toast(res.data.msg);
            }
          } else {
            // 接口异常
            Toast(res.data.msg);
          }
          _this_.$set(_this_.recordDetail, 'cancelTips', cancelTips);
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
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
      // 跳转至订单时间轴页面
      showOrderTimeLine: function () {
        router.push('/records/orderTimeLine');
      },
      /**
       * 跳转至金额明细页
       * @param orderId 订单ID
       */
      showMoneyDetail: function () {
        // 跳转至金额明细页
        router.push('/records/moneyDetail');
      },
      /**
       * 跳转至计费规则富文本页
       */
      showRuleDescription: function () {
        // 跳转至计费规则富文本页
        router.push('/records/ruleDescription');
      },
      /**
       * 跳转至车位平面图
       */
      showParkingPlan: function () {
        // 跳转至车位平面图
        router.push('/records/parkingPlan');
      },
      // 显示车牌号modal
      showCarNOModal: function () {
        this.carNOModal.isShow = true;
      },
      // 显示取消订单modal
      showCancelOrderModal: function () {
        // 获取取消订单的文本
        let order = this.recordDetail;
        let cancelOrderText = '';
        let _this_ = this;
        this.$JHttp.get(window.homeURL + '/sharedPark/order/' + order.orderId + '/cancel/calculate').then((res) => {
          if (res.data.status === 100) {
            let data = res.data.data;
            if (data) {
              let isFree = data.isFree;
              if (isFree) { // 无偿取消
                cancelOrderText = '现在可免费取消，继续取消？';
              } else { // 有偿取消
                let money = data.amount;
                cancelOrderText = '现在取消将收取' + money + '元，继续取消？';
              }
            } else {
              // 接口没有返回数据
              Toast(res.data.msg);
            }
          } else {
            // 接口异常
            Toast(res.data.msg);
          }
          _this_.$set(_this_.cancelOrderModal, 'text', cancelOrderText);
          _this_.$set(_this_.cancelOrderModal, 'isShow', true);
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
      },
      // 取消订单
      cancelOrder: function () {
        let orderId = this.recordDetail.orderId;
        let postDataStr = 'id=' + orderId;
        // 调用取消订单接口
        this.$JHttp.put(window.homeURL + '/sharedPark/order/' + orderId + '/cancel', postDataStr, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          if (res.data.status === 100) {
            // 成功,重新初始化订单详情
            this.initRecordDetail();
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
          this.disabled = false;
        });
        // 刷新订单
        this.cancelOrderModal.isShow = false;
      },
      showPayPop: function () {
        this.payPopShow = true;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.record-detail-wrapper {
  width: 100%;
  height: 100%;
  background-color: #ebebeb;
  display: flex;
  flex-direction: column;
  .body {
    flex: 1;
    padding-top: 0.213333rem;
    overflow: auto;
    position: relative;
    /*解决滑动卡顿的情况*/
    -webkit-overflow-scrolling: touch;
    z-index: 1;
    .top {
      padding: 0rem 0.4rem 0 0.4rem;
      background-color: #fff;
      .parking-no {
        display: flex;
        justify-content: space-between;
        padding-top: 0.48rem;
        padding-bottom: 0.48rem;
        .left {
          font-size: 0;
          text-align: left;
          .text {
            font-size: 16px;
            text-align: left;
            margin-right: 0.213333rem;
          }
          .icon {
            display: inline-block;
            width: 0.32rem;
            height: 0.32rem;
            vertical-align: text-bottom;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url('../../assets/img/@2x/icon-info.png');
          }
        }
        .right {
          display: flex;
          align-items: center;
          padding-left: 0.64rem;
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
      .detail {
        display: flex;
        display: -webkit-flex;
        align-items:center;
        -webkit-align-items: center;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        margin-bottom: 0.533333rem;
        .left {
          display: flex;
          flex-direction: column;
          text-align: left;
          .reserve-time, .car-no, .order-no, .order-create-time, .order-pay-time {
            display: flex;
            align-items: center;
            text-align: left;
            .title {
              flex: 0 0 1.84rem;
              font-size: 12px;
              line-height: 12px;
            }
            .value {
              flex: 1;
              font-size: 12px;
              line-height: 12px;
              white-space: nowrap;
            }
          }
          .reserve-time, .car-no, .order-no, .order-create-time {
            margin-bottom: 0.266667rem;
          }
          & div:last-child {
            margin-bottom: 0;
          }
        }
        .right {
          display: flex;
          align-items: center;
          font-size: 0;
          text-decoration: none;
          .icon {
            display: inline-block;
            width: 0.426667rem;
            height: 0.426667rem;
            margin-right: 0.2rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url('../../assets/img/@2x/tel.png');
            margin-right: 0.133333rem;
          }
          .text {
            color: #18adfb;
            font-size: 12px;
          }
        }
      }
      .money-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 2.986667rem;
        .title {
          font-size: 12px;
        }
        .total-money {
          font-size: 26px;
        }
        .show-detail {
          font-size: 0;
          display: flex;
          align-items:center;
          .title {
            font-size: 12px;
            margin-right: 0.213333rem;
          }
          .icon {
            display: inline-block;
            vertical-align: middle;
            width: 0.213333rem;
            height: 0.426667rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url('../../assets/img/@2x/gray-icon-right.png');
          }
        }
      }
      .car-status-one {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.333333rem 0;
        .left, .right {
          display: flex;
          align-items: center;
          font-size: 0;
          .dot {
            display: inline-block;
            width: 0.106667rem;
            height: 0.106667rem;
            background-color: #18adfb;
            border-radius: 50%;
            margin-right: 0.213333rem;
          }
        }
        .left {
          .status-text {
            font-size: 12px;
          }
        }
        .right {
          .car-tips {
            font-size: 12px;
          }
        }
      }
      .car-status-other {
        text-align: left;
        .car-status-top, .car-status-bottom {
          font-size: 0;
          display: flex;
          display: -webkit-flex;
          align-items:center;
          -webkit-align-items: center;
          .dot {
            display: inline-block;
            width: 0.106667rem;
            height: 0.106667rem;
            background-color: #18adfb;
            border-radius: 50%;
            margin-right: 0.213333rem;
          }
        }
        .car-status-top {
          padding: 0.333333rem 0;
          .intime-text {
            font-size: 12px;
          }
        }
        .car-status-bottom {
          padding-bottom: 0.333333rem;
          .car-tips {
            font-size: 12px;
          }
        }
      }
    }
    .content {
      padding: 0rem 0.4rem 0 0.4rem;
      background-color: #ebebeb;
      .warn {
        font-size: 12px;
        color: #aaa;
        text-align: left;
        margin: 0.4rem 0 0.613333rem;
      }
      .fee-rule {
        font-size: 12px;
        color: #333;
        text-decoration: underline;
        margin-bottom: 0.613333rem;
      }
      .qr-code {
        margin-bottom: 0.613333rem;
        .img-wrapper {
          font-size: 0;
          margin-bottom: 0.533333rem;
          .img {
            width: 3.573333rem;
            height: 3.573333rem;
            color: #333;
          }
        }
        .text {
          font-size: 12px;
          line-height: 12px;
          display: block;
          color: #333;
        }
      }
      .share {
        margin-bottom: 0.4rem;
      }
      .pay-wrapper {
        height: 1.12rem;
      }
    }
  }
  .footer {
    flex: 0 0 2.506667rem;
    .cancel-wrapper {
      .cancel-tips {
        font-size: 12px;
        color: #333;
        padding: 0.4rem 0;
        background-color: #fff;
      }
      .cancel-order {
        height: 1.2rem;
      }
    }
  }
  .carNOModalWrapper {
    .car-no {
      font-size: 28px;
    }
    .car-info {
      font-size: 0;
      .name, .phone {
        font-size: 14px;
      }
      .name {
        margin-right: 0.266667rem;
      }
    }
  }
  .cancel-order-modal-wrapper {
    .cancel-info {
      color: #333;
      font-size: 14px;
      display: inline-block;
      padding: 0 0.8rem 0.4rem 0.8rem;
    }
    .operate-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1.44rem;
      .text {
        display: inline-block;
        width: 50%;
        height: 100%;
        line-height: 1.44rem;
        color: #18adfb;
        font-size: 16px;
      }
    }
  }
}
  [data-dpr="2"]
  .record-detail-wrapper {
    .body {
      .top {
        .parking-no {
          .left {
            .text {
              font-size: 36px;
            }
          }
          .right {
            .order-description {
              font-size: 24px;
            }
          }
        }
        .detail {
          .left {
            .reserve-time, .car-no, .order-no, .order-create-time, .order-pay-time {
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
          .right {
            .text {
              font-size: 24px;
            }
          }
        }
        .money-wrapper {
          .title {
            font-size: 24px;
          }
          .total-money {
            font-size: 56px;
          }
          .show-detail {
            .title {
              font-size: 24px;
            }
          }
        }
        .car-status-one {
          .left {
            .status-text {
              font-size: 24px;
            }
          }
          .right {
            .car-tips {
              font-size: 24px;
            }
          }
        }
        .car-status-other {
          .car-status-top {
            .intime-text {
              font-size: 24px;
            }
          }
          .car-status-bottom {
            .car-tips {
              font-size: 24px;
            }
          }
        }
      }
      .content {
        .warn {
          font-size: 24px;
        }
        .fee-rule {
          font-size: 24px;
        }
        .qr-code {
          .text {
            font-size: 24px;
            line-height: 24px;
          }
        }
      }
    }
    .footer {
      .cancel-wrapper {
        .cancel-tips {
          font-size: 24px;
        }
      }
    }
    .carNOModalWrapper {
      .car-no {
        font-size: 50px;
      }
      .car-info {
        .name, .phone {
          font-size: 30px;
        }
      }
    }
    .cancel-order-modal-wrapper {
      .cancel-info {
        font-size: 30px;
      }
      .operate-wrapper {
        .text {
          font-size: 34px;
        }
      }
    }
  }
[data-dpr="3"]
  .record-detail-wrapper {
  .body {
    .top {
      .parking-no {
        .left {
          .text {
            font-size: 62px;
          }
          .icon {
            background-image: url('../../assets/img/@3x/icon-info@3x.png');
          }
        }
        .right {
          .order-description {
            font-size: 42px;
          }
        }
      }
      .detail {
        .left {
          .reserve-time, .car-no, .order-no, .order-create-time, .order-pay-time {
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
        .right {
          .icon {
            background-image: url('../../assets/img/@3x/tel@3x.png');
          }
          .text {
            font-size: 42px;
          }
        }
      }
      .money-wrapper {
        .title {
          font-size: 42px;
        }
        .total-money {
          font-size: 82px;
        }
        .show-detail {
          .title {
            font-size: 42px;
          }
          .icon {
            background-image: url('../../assets/img/@3x/gray-icon-right@3x.png');
          }
        }
      }
      .car-status-one {
        .left {
          .status-text {
            font-size: 42px;
          }
        }
        .right {
          .car-tips {
            font-size: 42px;
          }
        }
      }
      .car-status-other {
        .car-status-top {
          .intime-text {
            font-size: 42px;
          }
        }
        .car-status-bottom {
          .car-tips {
            font-size: 42px;
          }
        }
      }
    }
    .content {
      .warn {
        font-size: 42px;
      }
      .fee-rule {
        font-size: 42px;
      }
      .qr-code {
        .text {
          font-size: 42px;
          line-height: 42px;
        }
      }
    }
  }
  .footer {
    .cancel-wrapper {
      .cancel-tips {
        font-size: 42px;
      }
    }
  }
  .carNOModalWrapper {
    .car-no {
      font-size: 74px;
    }
    .car-info {
      .name, .phone {
        font-size: 54px;
      }
    }
  }
  .cancel-order-modal-wrapper {
    .cancel-info {
      font-size: 54px;
    }
    .operate-wrapper {
      .text {
        font-size: 60px;
      }
    }
  }
}
</style>
