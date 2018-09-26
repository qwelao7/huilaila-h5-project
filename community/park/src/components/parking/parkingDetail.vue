<template>
  <div class="parking-detail-wrapper">
    <div class="top">
      <div class="parking-no vux-1px-b">
        <div class="left">车位号:</div>
        <div class="right">
          <div class="value" v-text="communityName + '-' + parkingDetail.parkingNO"></div>
          <div class="status-wrapper">
            <j-switch class="right-switch" v-if="parkingDetail.parkingStatus === 1 || parkingDetail.parkingStatus === 0"
                      v-model="parkingDetail.isOpened" @switchStatus="switchParkingStatus(parkingDetail)"></j-switch>
          </div>
        </div>
      </div>
      <div class="parking-fee vux-1px-b">
        <div class="left">停车费:</div>
        <div class="right" @click="showAllocationModal">
          <span class="text" v-text="rent + rentUnit"></span>
          <span class="icon"></span>
        </div>
      </div>
      <div class="parking-duration vux-1px-b" :class="{closed: (parkingDetail.parkingStatus === 0)}" @click="editSharingTime">
        <div class="left">
          <div class="duration" v-text="parkingDetail.sharingDuration"></div>
          <div class="repeat" v-text="parkingDetail.sharingRepeatStr"></div>
        </div>
        <div class="right">
          <span class="icon"></span>
        </div>
      </div>
    </div>
    <div class="body">
      <j-tab :tabtitles="tabTitles"
           :current-page="currentTab">
        <div class="tab-content-container">
          <ul v-if="parkingDetail.todayOrderList">
            <li class="order-item" v-for="order in parkingDetail.todayOrderList">
              <div class="carNO-wrapper">
                <div class="left" @click="showCarNOModal(order.baseInfo.carNO, order.baseInfo.carOwnerName,
                 order.baseInfo.carOwnerPhone)">
                  <span class="title">车牌号:</span>
                  <span class="value" v-text="order.baseInfo.carNO"></span>
                </div>
                <div class="right">
                  <span class="status" :class="{ orderFinished: order.baseInfo.orderFinished }"
                        v-text="order.baseInfo.orderDescription"></span>
                </div>
              </div>
              <div class="detail-wrapper">
                <div class="time-wrapper">
                  <div class="left">
                    <div class="reserveTime">
                      <span class="title">预约时段:</span>
                      <span class="value" v-text="order.baseInfo.reserveTimeStr || '一'"></span>
                    </div>
                    <div class="inTime">
                      <span class="title">入场时间:</span>
                      <span class="value" v-text="order.baseInfo.enterTime || '一'"></span>
                    </div>
                    <div class="outTime">
                      <span class="title">出场时间:</span>
                      <span class="value" v-text="order.baseInfo.leaveTime || '一'"></span>
                    </div>
                  </div>
                  <a class="right" :href="order.baseInfo.telStr">
                    <span class="icon"></span>
                    <span class="text">联系车主</span>
                  </a>
                </div>
                <div class="charge-wrapper">
                  <div class="normal-last">
                    <div class="left">
                      <span class="title">正常时段:</span>
                    </div>
                    <div class="right">
                      <span class="value" v-text="order.chargeInfo.normalLast || '一'"></span>
                      <span class="money" v-text="'¥' + ' ' + order.chargeInfo.normalMoney"></span>
                    </div>
                  </div>
                  <div class="normal-begin-charge" v-if="order.chargeInfo.normalBeginChargeTime">
                    <div class="left">
                      <span class="title">开始计费:</span>
                    </div>
                    <div class="right">
                      <span class="value" v-text="order.chargeInfo.normalBeginChargeTime"></span>
                    </div>
                  </div>
                  <div class="normal-end-charge" v-if="order.chargeInfo.normalEndChargeTime">
                    <div class="left">
                      <span class="title">结束计费:</span>
                    </div>
                    <div class="right">
                      <span class="value" v-text="order.chargeInfo.normalEndChargeTime"></span>
                    </div>
                  </div>
                  <div class="overtime-last">
                    <div class="left">
                      <span class="title">超时时段:</span>
                    </div>
                    <div class="right">
                      <span class="value" v-text="order.chargeInfo.overtimeLast || '一'"></span>
                      <span class="money" v-text="'¥' + ' ' + order.chargeInfo.overtimeMoney"></span>
                    </div>
                  </div>
                  <div class="overtime-begin-charge" v-if="order.chargeInfo.overtimeBeginChargeTime">
                    <div class="left">
                      <span class="title">开始计费:</span>
                    </div>
                    <div class="right">
                      <span class="value" v-text="order.chargeInfo.overtimeBeginChargeTime"></span>
                    </div>
                  </div>
                  <div class="overtime-end-charge" v-if="order.chargeInfo.overtimeEndChargeTime">
                    <div class="left">
                      <span class="title">结束计费:</span>
                    </div>
                    <div class="right">
                      <span class="value" v-text="order.chargeInfo.overtimeEndChargeTime"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="money-wrapper">
                <span class="left" v-text="order.baseInfo.moneyTitleStr"></span>
                <span class="right" v-text="'¥ ' + order.chargeInfo.totalMoney"></span>
              </div>
            </li>
          </ul>
          <div class="placeholder" v-if="!parkingDetail.todayOrderList.length">
            <span class="icon"></span>
            <div class="text">暂无相关内容</div>
          </div>
        </div>
        <div class="tab-content-container">
          <ul v-if="parkingDetail.waitingToPayOrderList">
            <li class="order-item" v-for="order in parkingDetail.waitingToPayOrderList">
              <div class="carNO-wrapper">
                <div class="left" @click="showCarNOModal(order.baseInfo.carNO, order.baseInfo.carOwnerName,
                order.baseInfo.carOwnerPhone)">
                  <span class="title">车牌号:</span>
                  <span class="value" v-text="order.baseInfo.carNO"></span>
                </div>
                <div class="right">
                  <span class="status" v-text="order.baseInfo.orderDescription"></span>
                </div>
              </div>
              <div class="detail-wrapper">
                <div class="time-wrapper">
                  <div class="left">
                    <div class="reserveTime">
                      <span class="title">预约时段:</span>
                      <span class="value" v-text="order.baseInfo.reserveTimeStr || '一'"></span>
                    </div>
                    <div class="inTime">
                      <span class="title">入场时间:</span>
                      <span class="value" v-text="order.baseInfo.enterTime || '一'"></span>
                    </div>
                    <div class="outTime">
                      <span class="title">出场时间:</span>
                      <span class="value" v-text="order.baseInfo.leaveTime || '一'"></span>
                    </div>
                  </div>
                  <a class="right" :href="order.baseInfo.telStr">
                    <span class="icon"></span>
                    <span class="text">联系车主</span>
                  </a>
                </div>
                <div class="charge-wrapper">
                  <div class="normal-last">
                    <div class="left">
                      <span class="title">正常时段:</span>
                    </div>
                    <div class="right">
                      <span class="value" v-text="order.chargeInfo.normalTimeLast || '一'"></span>
                      <span class="money" v-text="'¥' + ' ' + order.chargeInfo.normalMoney"></span>
                    </div>
                  </div>
                  <div class="normal-begin-charge" v-if="order.chargeInfo.normalBeginChargeTime">
                    <div class="left">
                      <span class="title">开始计费:</span>
                    </div>
                    <div class="right">
                      <span class="value" v-text="order.chargeInfo.normalBeginChargeTime"></span>
                    </div>
                  </div>
                  <div class="normal-end-charge" v-if="order.chargeInfo.normalEndChargeTime">
                    <div class="left">
                      <span class="title">结束计费:</span>
                    </div>
                    <div class="right">
                      <span class="value" v-text="order.chargeInfo.normalEndChargeTime"></span>
                    </div>
                  </div>
                  <div class="overtime-last">
                    <div class="left">
                      <span class="title">超时时段:</span>
                    </div>
                    <div class="right">
                      <span class="value" v-text="order.chargeInfo.overtimeLast || '一'"></span>
                      <span class="money" v-text="'¥' + ' ' + order.chargeInfo.overtimeMoney"></span>
                    </div>
                  </div>
                  <div class="overtime-begin-charge" v-if="order.chargeInfo.overtimeBeginChargeTime">
                    <div class="left">
                      <span class="title">开始计费:</span>
                    </div>
                    <div class="right">
                      <span class="value" v-text="order.chargeInfo.overtimeBeginChargeTime"></span>
                    </div>
                  </div>
                  <div class="overtime-end-charge" v-if="order.chargeInfo.overtimeEndChargeTime">
                    <div class="left">
                      <span class="title">结束计费:</span>
                    </div>
                    <div class="right">
                      <span class="value" v-text="order.chargeInfo.overtimeEndChargeTime"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="money-wrapper">
                <span class="left" v-text="order.baseInfo.moneyTitleStr"></span>
                <span class="right" v-text="'¥ ' + order.chargeInfo.totalMoney"></span>
              </div>
            </li>
          </ul>
          <div class="placeholder" v-if="!parkingDetail.waitingToPayOrderList.length">
            <span class="icon"></span>
            <div class="text">暂无相关内容</div>
          </div>
        </div>
      </j-tab>
    </div>
    <!--查看车牌Modal begin-->
    <x-dialog v-model="carNOModalShow" class="carNOModalWrapper" :dialog-style="carNODialogStyle" hide-on-blur>
      <span class="car-no" v-text="currentCarInfo.carNO"></span>
      <div class="car-info">
        <span class="name" v-text="currentCarInfo.carOwnerName"></span>
        <span class="phone" v-text="currentCarInfo.carOwnerPhone"></span>
      </div>
    </x-dialog>
    <!--查看车牌Modal end-->
    <!--停车费用分成Modal begin-->
    <x-dialog v-model="allocationModalShow" :dialog-style="allocationDialogStyle" hide-on-blur>
      <span class="delete-text">停车费用收入将按以下比例分配:</span>
      <ul class="allocation-list-wrapper">
        <li class="allocation-item" v-if="ownerReceiveRate">
          <span class="text">业主:</span>
          <span class="rate" v-text="ownerReceiveRate + '%'"></span>
        </li>
        <li class="allocation-item" v-if="propertyReceiveRate">
          <span class="text">物业:</span>
          <span class="rate" v-text="propertyReceiveRate + '%'"></span>
        </li>
        <li class="allocation-item" v-if="industryCommitteeReceiveRate">
          <span class="text">业委会:</span>
          <span class="rate" v-text="industryCommitteeReceiveRate + '%'"></span>
        </li>
        <li class="allocation-item" v-if="platformReceiveRate">
          <span class="text">平台:</span>
          <span class="rate" v-text="platformReceiveRate + '%'"></span>
        </li>
      </ul>
    </x-dialog>
    <!--停车费用分成Modal end-->
    <!--关闭车位Modal begin-->
    <x-dialog class="close-wrapper" v-model="closeParkingModal.isShow"
              :dialog-style="closeParkingModal.closeDialogStyle" hide-on-blur>
      <span class="close-info vux-1px-b" v-text="closeParkingModal.text"></span>
      <div class="operate-wrapper">
        <span class="text vux-1px-r" @click="closeParkingModal.isShow = false">暂不关闭</span>
        <span class="text" @click="closeParking(closeParkingModal.currentParking)">关闭</span>
      </div>
    </x-dialog>
    <!--关闭车位Modal end-->
  </div>
</template>

<script>
  import router from '../../router';
  import {mapState} from 'vuex';
  import {querystring} from 'vux';
  import Toast from 'components/utils/toast/toast';
  import {jlDate} from '../../common/utils';
  import JTab from 'components/utils/tab/jtab';
  import JSwitch from 'components/utils/jswitch';
  export default {
    name: 'parkingDetail',
    created: function () {
      document.title = '车位详情';
      let currentShareId = this.currentShareId;
      if (!currentShareId) {
        return;
      }
      this.initParkingDetail(currentShareId);
    },
    data () {
      return {
        parkingDetail: {
          todayOrderList: [],
          waitingToPayOrderList: []
        },
        currentTab: 1,
        currentCarInfo: {
          carNO: '',
          carOwnerName: '',
          carOwnerPhone: ''
        },
        carNOModalShow: false,
        carNODialogStyle: {
          maxWidth: '100%',
          width: '70%',
          borderRadius: '0.266667rem',
          padding: '0.733333rem 0',
          color: '#333'
        },
        allocationModalShow: false,
        allocationDialogStyle: {
          maxWidth: '100%',
          width: '80%',
          borderRadius: '0.266667rem',
          padding: '0.6rem 0',
          color: '#333'
        },
        closeParkingModal: {
          isShow: false,
          text: '',
          currentParking: {},
          closeDialogStyle: {
            maxWidth: '100%',
            width: '70%',
            padding: '0.4rem 0 0 0',
            borderRadius: '0.266667rem'
          }
        }
      };
    },
    computed: mapState({
      communityName: state => state.pageCfg.communityName,
      rent: state => state.pageCfg.rent,
      rentUnit: state => state.pageCfg.rentUnit,
      freeLast: state => state.pageCfg.freeLast, // 免费时长
      ownerReceiveRate: state => state.pageCfg.ownerReceiveRate, // 业主收入分成
      propertyReceiveRate: state => state.pageCfg.propertyReceiveRate, // 物业收入分成
      industryCommitteeReceiveRate: state => state.pageCfg.industryCommitteeReceiveRate, // 业委会收入分成
      platformReceiveRate: state => state.pageCfg.platformReceiveRate, // 平台收入分成
      currentShareId: state => state.pageCfg.currentShareId, // 当前编辑的分享Id
      leftTitle: function () {
        let todayOrderCount = 0;
        if (this.parkingDetail.todayOrderList && this.parkingDetail.todayOrderList.length) {
          todayOrderCount = this.parkingDetail.todayOrderList.length;
        }
        return '停放计划(' + todayOrderCount + ')';
      },
      rightTitle: function () {
        let waitingToPayOrderCount = 0;
        if (this.parkingDetail.waitingToPayOrderList && this.parkingDetail.waitingToPayOrderList.length) {
          waitingToPayOrderCount = this.parkingDetail.waitingToPayOrderList.length;
        }
        return '未缴费车辆(' + waitingToPayOrderCount + ')';
      },
      tabTitles: function () {
        return [this.leftTitle, this.rightTitle];
      }
    }),
    methods: {
      // 初始化订单详情
      initParkingDetail: function (currentShareId) {
        // 清空共享时段的时间索引
        this.$store.commit('updateSharingTimeIndexs', {
          sharingTimeIndexs: undefined
        });
        // 清空共享时段起止时间
        this.$store.commit('updateSharingTime', {
          sharingTime: undefined
        });
        // 清空共享时段的重复周期
        this.$store.commit('updateSharingRepeat', {
          sharingRepeat: undefined
        });
        let _this_ = this;
        // 根据订单Id,获取订单详情
        this.$JHttp.get(window.homeURL + '/sharedPark/parkingSpace/' + currentShareId).then((res) => {
          if (res.data.status === 100) {
            if (res.data.data) {
              let parkingDetail = res.data.data;
              this.parkingDetail = {
                shareId: parkingDetail.id, // 车位分享id
                parkingNO: parkingDetail.spaceName,
                parkingStatus: parkingDetail.status, // 车位状态
                sharingStartTime: parkingDetail.beginTime,
                sharingEndTime: parkingDetail.endTime,
                isCrossDay: parkingDetail.isCrossDay, // 是否隔天
                sharingRepeat: parkingDetail.weekday
              };
              // 获取今日订单信息
              if (parkingDetail.todayOrders && parkingDetail.todayOrders.length) {
                let todayOrderList = [];
                let todayOrders = parkingDetail.todayOrders;
                todayOrders.forEach(function (order) {
                  let orderStatus;
                  if (order.orderStatus === -1) {
                    orderStatus = 5; // 已取消
                  } else if (order.orderStatus === 0 || order.orderStatus === 1) { // 0:未入场 1:已入场,未计费
                    orderStatus = 2; // 待开始
                  } else if (order.orderStatus === 2) {
                    orderStatus = 3; // 计费中
                  } else if (order.orderStatus === 3) {
                    orderStatus = 1 // 待支付
                  } else if (order.orderStatus === 4) {
                    orderStatus = 4; // 已支付
                  } else {
                    orderStatus = -1; // 未知,预留状态
                  }
                  order.orderStatus = orderStatus;
                  let orderFinished = false;
                  if (orderStatus === 4 || orderStatus === 5) {
                    orderFinished = true;
                  }
                  let baseInfo = {
                    orderStatus: orderStatus,
                    orderFinished: orderFinished,
                    isPay: order.isPay,
                    carNO: order.carNum,
                    carOwnerName: order.driverName,
                    carOwnerPhone: order.driverMobile,
                    orderId: order.id,
                    appointerPhone: order.orderUserMobile,
                    carStatus: order.parkingStatus,
                    reserveTimeStr: order.reserveTimeStr,
                    enterTime: order.parkingBeginTime && jlDate.Dateformat(order.parkingBeginTime, 'MM-DD HH:mm'),
                    leaveTime: order.parkingEndTime && jlDate.Dateformat(order.parkingEndTime, 'MM-DD HH:mm')
                  };
                  let telStr = 'tel:';
                  if (orderStatus === 3) { // 计费中
                    telStr += baseInfo.carOwnerPhone;
                  } else {
                    telStr += baseInfo.appointerPhone;
                  }
                  _this_.$set(baseInfo, 'telStr', telStr);
                  let moneyTitleStr = _this_.getMoneyTitleStr(baseInfo);
                  _this_.$set(baseInfo, 'moneyTitleStr', moneyTitleStr);
                  let details = order.details;
                  let chargeInfo = {
                    normalMoney: '0.00',
                    overtimeMoney: '0.00',
                    totalMoney: order.amount
                  };
                  if (details && details.length) {
                    details.forEach(function (detail) {
                      let type = detail.type;
                      if (type === 1) { // 正常时段
                        chargeInfo.normalLast = _this_.getLastStr(detail);
                        chargeInfo.normalBeginChargeTime = detail.beginTime && jlDate.Dateformat(detail.beginTime, 'MM-DD HH:mm');
                        chargeInfo.normalEndChargeTime = detail.endTime && jlDate.Dateformat(detail.endTime, 'MM-DD HH:mm');
                        chargeInfo.normalMoney = detail.amount;
                      } else if (type === 2) { // 超时时段
                        chargeInfo.overtimeLast = _this_.getLastStr(detail);
                        chargeInfo.overtimeBeginChargeTime = detail.beginTime && jlDate.Dateformat(detail.beginTime, 'MM-DD HH:mm');
                        chargeInfo.overtimeEndChargeTime = detail.endTime && jlDate.Dateformat(detail.endTime, 'MM-DD HH:mm');
                        chargeInfo.overtimeMoney = detail.amount;
                      }
                    });
                  }
                  todayOrderList.push({
                    baseInfo: baseInfo,
                    chargeInfo: chargeInfo
                  });
                  let orderDescription = _this_.getOrderDescription(order);
                  _this_.$set(baseInfo, 'orderDescription', orderDescription);
                });
                this.$set(this.parkingDetail, 'todayOrderList', todayOrderList);
              } else {
                this.$set(this.parkingDetail, 'todayOrderList', []);
              }
              // 获取未支付订单信息
              if (parkingDetail.unpaiedOrders && parkingDetail.unpaiedOrders.length) {
                let waitingToPayOrderList = [];
                let unpaiedOrders = parkingDetail.unpaiedOrders;
                unpaiedOrders.forEach(function (order) {
                  let orderStatus;
                  if (order.orderStatus === -1) {
                    orderStatus = 5; // 已取消
                  } else if (order.orderStatus === 0 || order.orderStatus === 1) {
                    orderStatus = 2; // 待开始
                  } else if (order.orderStatus === 2) {
                    orderStatus = 3; // 计费中
                  } else if (order.orderStatus === 3) {
                    orderStatus = 1 // 待支付
                  } else if (order.orderStatus === 4) {
                    orderStatus = 4; // 已支付
                  } else {
                    orderStatus = -1; // 未知,预留状态
                  }
                  // 基础信息 begin
                  let baseInfo = {
                    orderStatus: orderStatus,
                    isPay: order.isPay,
                    carNO: order.carNum,
                    carOwnerName: order.driverName,
                    carOwnerPhone: order.driverMobile,
                    orderId: order.id,
                    appointerPhone: order.orderUserMobile,
                    carStatus: order.parkingStatus,
                    reserveTimeStr: order.reserveTimeStr,
                    enterTime: order.parkingBeginTime && jlDate.Dateformat(order.parkingBeginTime, 'MM-DD HH:mm'),
                    leaveTime: order.parkingEndTime && jlDate.Dateformat(order.parkingEndTime, 'MM-DD HH:mm')
                  };
                  let orderDescription = '待支付';
                  _this_.$set(baseInfo, 'orderDescription', orderDescription);
                  let telStr = 'tel:';
                  telStr += baseInfo.appointerPhone;
                  _this_.$set(baseInfo, 'telStr', telStr);
                  let moneyTitleStr = '应付金额';
                  _this_.$set(baseInfo, 'moneyTitleStr', moneyTitleStr);
                  // 基础信息 end

                  // 计费信息 begin
                  let details = order.details;
                  let chargeInfo = {
                    normalMoney: '0.00',
                    overtimeMoney: '0.00',
                    totalMoney: order.amount
                  };
                  if (details && details.length) {
                    details.forEach(function (detail) {
                      let type = detail.type;
                      if (type === 1) { // 正常时段
                        chargeInfo.normalLast = _this_.getLastStr(detail);
                        chargeInfo.normalBeginChargeTime = detail.beginTime && jlDate.Dateformat(detail.beginTime, 'MM-DD HH:mm');
                        chargeInfo.normalEndChargeTime = detail.endTime && jlDate.Dateformat(detail.endTime, 'MM-DD HH:mm');
                        chargeInfo.normalMoney = detail.amount;
                      } else if (type === 2) { // 超时时段
                        chargeInfo.overtimeLast = _this_.getLastStr(detail);
                        chargeInfo.overtimeBeginChargeTime = detail.beginTime && jlDate.Dateformat(detail.beginTime, 'MM-DD HH:mm');
                        chargeInfo.overtimeEndChargeTime = detail.endTime && jlDate.Dateformat(detail.endTime, 'MM-DD HH:mm');
                        chargeInfo.overtimeMoney = detail.amount;
                      }
                    });
                  }
                  // 计费信息 end
                  waitingToPayOrderList.push({
                    baseInfo: baseInfo,
                    chargeInfo: chargeInfo
                  });
                });
                _this_.$set(this.parkingDetail, 'waitingToPayOrderList', waitingToPayOrderList);
              } else {
                _this_.$set(this.parkingDetail, 'waitingToPayOrderList', []);
              }
              _this_.$set(_this_.parkingDetail, 'isOpened', _this_.parkingDetail.parkingStatus === 1);
              let sharingDuration = '未设置'; // 未设置共享时段
              if (_this_.parkingDetail.sharingStartTime) {
                sharingDuration = _this_.parkingDetail.sharingStartTime + '一' + _this_.parkingDetail.sharingEndTime;
                let isCrossDay = _this_.parkingDetail.isCrossDay;
                if (isCrossDay === 1) {
                  sharingDuration += '次日';
                }
              }
              _this_.$set(_this_.parkingDetail, 'sharingDuration', sharingDuration);
              let sharingRepeatStr = jlDate.getSharingRepeatStr(_this_.parkingDetail.sharingRepeat + '');
              _this_.$set(_this_.parkingDetail, 'sharingRepeatStr', sharingRepeatStr);
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
      // 获取订单描述
      getOrderDescription: function (order) {
        let orderStatus = order.orderStatus;
        let orderDescription = '';
        switch (orderStatus) {
          case 1: // 待支付
            orderDescription = '待支付';
            break;
          case 2: // 待开始
            // let chargeBegin = this.getChargeBegin(order); // 计费开始时间
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
      // 获取计费开始时间
      getChargeBegin: function (order) {
        let orderType = order.orderType;
        let beginTime = order.reserveBeginTime;
        let chargeBegin;
        if (orderType === 1) { // 即时停车
          let inTime = new Date(beginTime.replace(/-/g, '/'));
          let freeLast = this.freeLast;
          let value = freeLast.replace(/[^0-9]/ig, '');
          if (freeLast.indexOf('分钟') !== -1) { // 免费时长单位为分钟
            chargeBegin = jlDate.addMinutes(inTime, value);
          } else if (freeLast.indexOf('小时') !== -1) { // 免费时长为单位为小时
            chargeBegin = jlDate.addHours(inTime, value);
          }
        } else if (orderType === 2) { // 预约停车
          chargeBegin = new Date(beginTime.replace(/-/g, '/'));
        }
        return chargeBegin;
      },
      // 获取待开始订单的订单描述
      getWaitingStartOrderDescription: function (order) {
        let hours = order.hours;
        let minutes = order.minutes;
        let orderDescription = '';
        if (hours) {
          orderDescription = hours + '小时后计费'; // 分钟向下取整
        } else if (minutes) {
          orderDescription = minutes + '分钟后计费'; //  小时向下取整
        }
        return orderDescription;
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
      // 获取金额标题
      getMoneyTitleStr: function (orderBaseInfo) {
        let orderStatus = orderBaseInfo.orderStatus;
        let isPay = orderBaseInfo.isPay;
        let moneyTitleStr = '';
        switch (orderStatus) {
          case 1:
            moneyTitleStr = '应付金额:';
            break;
          case 2:
          case 3:
            moneyTitleStr = '合计金额:';
            break;
          case 4:
            moneyTitleStr = '实付金额:';
            break;
          case 5:
            if (isPay) {
              moneyTitleStr = '实付金额:';
            } else {
              moneyTitleStr = '应付金额:';
            }
            break;
          default:
            break;
        }
        return moneyTitleStr;
      },
      switchParkingStatus: function (shareParking) {
        if (shareParking.parkingStatus === 1) { // 车位状态从开启切换到关闭
          // 调用接口获取，当前车位的停放状态和预约状态
          let _this_ = this;
          this.getCarStatusByParkingId(shareParking.shareId, function (carStatus) {
            if (carStatus === 0) { // 未被使用,随时可以关闭
              _this_.closeParking(shareParking);
            } else if (carStatus === 1) { // 有车辆正停放在该车位
              _this_.$set(_this_.closeParkingModal, 'isShow', true);
              _this_.$set(_this_.closeParkingModal, 'text', '您的车位有正在停放的车辆，关闭将不影响正' +
                '在停放的车辆，确定关闭？');
              _this_.$set(_this_.closeParkingModal, 'currentParking', shareParking);
            } else if (carStatus === 2) { // 有车辆预约了该车位
              _this_.$set(_this_.closeParkingModal, 'isShow', true);
              _this_.$set(_this_.closeParkingModal, 'text', '您的车位已被预约，关闭后不会影响该预约执行。' +
                '如有需要，请电话联系车主取消预约。');
              _this_.$set(_this_.closeParkingModal, 'currentParking', shareParking);
            }
          });
        } else { // 车位状态从关闭切换到开启
          // 调用开启共享车位接口
          this.openParking(shareParking);
        }
      },
      // 获取车位的停放状态和预约状态
      getCarStatusByParkingId: function (currentShareId, cb) {
        // 调用接口获取，当前车位的停放状态和预约状态
        this.$JHttp.get(window.homeURL + '/sharedPark/parkingSpace/' + currentShareId + '/closeCheck').then((res) => {
          if (res.data.status === 100) {
            let status = res.data.data;
            cb(status);
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
      },
      // 关闭车位
      closeParking: function (shareParking) {
        // 调用关闭共享车位接口
        let _this_ = this;
        let shareId = shareParking.shareId;
        let status;
        if (shareParking.isOpened) {
          status = 0; // 关闭
        } else {
          status = 1; // 关闭
        }
        let postData = {
          id: shareId,
          status: status
        };
        let postDataStr = querystring.stringify(postData);
        this.$JHttp.put(window.homeURL + '/sharedPark/parkingSpace/' + shareId + '/switch', postDataStr, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          if (res.data.status === 100) {
            _this_.$set(shareParking, 'parkingStatus', 0);
            _this_.$set(shareParking, 'isOpened', false);
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
        this.$set(this.closeParkingModal, 'isShow', false);
      },
      // 开启车位
      openParking: function (shareParking) {
        // 调用关闭共享车位接口
        let _this_ = this;
        let shareId = shareParking.shareId;
        let status = 1; // 开启
        let postData = {
          id: shareId,
          status: status
        };
        let postDataStr = querystring.stringify(postData);
        this.$JHttp.put(window.homeURL + '/sharedPark/parkingSpace/' + shareId + '/switch', postDataStr, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          if (res.data.status === 100) {
            _this_.$set(shareParking, 'parkingStatus', 1);
            _this_.$set(shareParking, 'isOpened', true);
            if (!shareParking.sharingStartTime) { // 未设置共享时段，跳转至编辑时段页面
              router.push('/share/editSharingTime');
              return;
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
      showCarNOModal: function (carNO, carOwnerName, carOwnerPhone) {
        this.currentCarInfo = {
          carNO: carNO,
          carOwnerName: carOwnerName,
          carOwnerPhone: carOwnerPhone
        }
        this.carNOModalShow = true;
      },
      showAllocationModal: function () {
        this.allocationModalShow = true;
      },
      editSharingTime: function () {
        let status = this.parkingDetail.parkingStatus;
        if (status === 0) { // 处于关闭状态
          return;
        }
        // 先清空上次选择的共享时间索引
        this.$store.commit('updateSharingTimeIndexs', {
          sharingTimeIndexs: []
        });
        router.push('/share/editSharingTime');
      }
    },
    components: {
      'j-tab': JTab,
      'j-switch': JSwitch
    }
  }
</script>

<style scoped lang="less">
  .parking-detail-wrapper {
    width: 100%;
    height: 100%;
    background-color: #ebebeb;
    overflow: auto;
    font-size: 14px;
    color: #333;
    .top {
      margin: 0.213333rem 0 0.4rem 0;
      background-color: #fff;
      .parking-fee {
        height: 1.173333rem;
        padding: 0 0.4rem;
        display: flex;
        align-items: center;
        .left {
          flex: 0 0 2.506667rem;
          text-align: left;
        }
        .right {
          flex: 1;
          display: flex;
          align-items: center;
        }
      }
      .parking-no {
        display: flex;
        align-items: center;
        padding: 0.32rem 0.4rem;
        .left {
          flex: 0 0 2.506667rem;
          text-align: left;
        }
        .right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .value {
            text-align: left;
          }
          .status-wrapper {
            padding-left: 0.64rem;
          }
        }
      }
      .parking-fee {
        .right {
          font-size: 0;
          .text {
            font-size: 14px;
          }
          .icon {
            display: inline-block;
            width: 0.32rem;
            height: 0.32rem;
            margin-left: 0.213333rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url('../../assets/img/@2x/icon-info.png');
          }
        }
      }
      .parking-duration {
        height: 1.6rem;
        display: flex;
        align-items: center;
        padding: 0 0.4rem;
        justify-content: space-between;
        .left {
          text-align: left;
          .duration {
            font-size: 14px;
          }
          .repeat {
            font-size: 12px;
            color: #aaa;
          }
        }
        .right {
          font-size: 0;
          .icon {
            display: inline-block;
            width: 0.213333rem;
            height: 0.426667rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url('../../assets/img/@2x/gray-icon-right.png');
          }
        }
      }
      .closed {
        color: #aaa;
      }
    }
    .body {
      .tab-content-container {
        background-color: #ebebeb;
        padding-top: 0.4rem;
        .placeholder {
          padding-top: 2.546667rem;
          .icon {
            display: block;
            width: 2.666667rem;
            height: 2.666667rem;
            margin: 0 auto;
            background-size: 100%;
            background-repeat:no-repeat;
            background-image: url("../../assets/img/@2x/placeholder.png");
          }
          .text {
            margin-top: 0.4rem;
            color: #aaa;
            font-size: 12px;
          }
        }
        .order-item {
          background-color: #fff;
          margin: 0 0.4rem 0.4rem 0.4rem;
          border-radius: 0.266667rem;
          box-shadow: 0 0.016667rem 0.096667rem rgba(19, 187, 239, 0.4);
          .carNO-wrapper {
            height: 1.44rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 0.4rem;
            .left {
              font-size: 0;
              .title, .value {
                font-size: 14px;
              }
              .title {
                margin-right: 0.32rem;
              }
            }
            .right {
              .status {
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
          .detail-wrapper {
            font-size: 12px;
            .time-wrapper {
              padding: 0.133333rem 0.4rem 0.533333rem 0.4rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .left {
                text-align: left;
                font-size: 0;
                .reserveTime, .inTime, .outTime {
                  .title, .value {
                    font-size: 12px;
                  }
                  .title {
                    margin-right: 0.4rem;
                  }
                }
                .reserveTime, .inTime {
                  margin-bottom: 0.266667rem;
                }
                .outTime {
                  margin-bottom: 0.133333rem;
                }
              }
              .right {
                display: flex;
                align-items: center;
                text-decoration: none;
                .icon {
                  display: inline-block;
                  width: 0.426667rem;
                  height: 0.426667rem;
                  margin-right: 0.2rem;
                  background-size: 100%;
                  background-repeat: no-repeat;
                  background-image: url('../../assets/img/@2x/tel.png');
                }
                .text {
                  color: #18adfb;
                }
              }
            }
            .charge-wrapper {
              color: #aaa;
              padding: 0 0.4rem 0 0.4rem;
              .normal-last {
                display: flex;
                font-size: 0;
                margin-bottom: 0.266667rem;
                .left {
                  flex: 0 0 1.733333rem;
                  text-align: left;
                  .title {
                    font-size: 12px;
                  }
                }
                .right {
                  flex: 1;
                  display: flex;
                  justify-content: space-between;
                  font-size: 0;
                  margin-bottom: 0;
                  .value, .money {
                    font-size: 12px;
                  }
                }
              }
              .normal-begin-charge {
                display: flex;
                font-size: 0;
                margin-bottom: 0.266667rem;
                .left {
                  flex: 0 0 1.733333rem;
                  text-align: left;
                  .title {
                    font-size: 12px;
                  }
                }
                .right {
                  flex: 1;
                  text-align: left;
                  margin-bottom: 0;
                  .value {
                    font-size: 12px;
                  }
                }
              }
              .normal-end-charge {
                display: flex;
                font-size: 0;
                margin-bottom: 0.266667rem;
                .left {
                  flex: 0 0 1.733333rem;
                  text-align: left;
                  .title {
                    font-size: 12px;
                  }
                }
                .right {
                  flex: 1;
                  text-align: left;
                  margin-bottom: 0;
                  .value {
                    font-size: 12px;
                  }
                }
              }
              .overtime-last {
                display: flex;
                font-size: 0;
                margin-bottom: 0.266667rem;
                .left {
                  flex: 0 0 1.733333rem;
                  text-align: left;
                  .title {
                    font-size: 12px;
                  }
                }
                .right {
                  flex: 1;
                  display: flex;
                  justify-content: space-between;
                  font-size: 0;
                  margin-bottom: 0;
                  .value, .money {
                    font-size: 12px;
                  }
                }
              }
              .overtime-begin-charge {
                display: flex;
                font-size: 0;
                margin-bottom: 0.266667rem;
                .left {
                  flex: 0 0 1.733333rem;
                  text-align: left;
                  .title {
                    font-size: 12px;
                  }
                }
                .right {
                  flex: 1;
                  text-align: left;
                  margin-bottom: 0;
                  .value {
                    font-size: 12px;
                  }
                }
              }
              .overtime-end-charge {
                display: flex;
                font-size: 0;
                margin-bottom: 0.266667rem;
                .left {
                  flex: 0 0 1.733333rem;
                  text-align: left;
                  .title {
                    font-size: 12px;
                  }
                }
                .right {
                  flex: 1;
                  text-align: left;
                  margin-bottom: 0;
                  .value {
                    font-size: 12px;
                  }
                }
              }
            }
            .charge-wrapper div:last-child {
              margin-bottom: 0.48rem;
            }
          }
          .money-wrapper {
            display: flex;
            justify-content: space-between;
            align-items:center;
            padding: 0 0.4rem 0.4rem 0.4rem;
            .left {
              text-align: left;
            }
          }
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
    .close-wrapper {
      .close-info {
        color: #333;
        font-size: 12px;
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
          font-size: 14px;
        }
      }
    }
  }

  [data-dpr="2"]
  .parking-detail-wrapper {
    font-size: 30px;
    .top {
      .parking-fee {
        .right {
          .text {
            font-size: 30px;
          }
        }
      }
      .parking-duration {
        .left {
          .duration {
            font-size: 30px;
          }
          .repeat {
            font-size: 24px;
          }
        }
      }
    }
    .body {
      .tab-content-container {
        .placeholder {
          .text {
            font-size: 24px;
          }
        }
        .order-item {
          .carNO-wrapper {
            .left {
              .title, .value {
                font-size: 30px;
              }
            }
            .right {
              .status {
                font-size: 24px;
              }
            }
          }
          .detail-wrapper {
            font-size: 24px;
            .time-wrapper {
              .left {
                .reserveTime, .inTime, .outTime {
                  .title, .value {
                    font-size: 24px;
                  }
                }
              }
            }
            .charge-wrapper {
              .normal-last {
                .left {
                  .title {
                    font-size: 24px;
                  }
                }
                .right {
                  .value, .money {
                    font-size: 24px;
                  }
                }
              }
              .normal-begin-charge {
                .left {
                  .title {
                    font-size: 24px;
                  }
                }
                .right {
                  .value {
                    font-size: 24px;
                  }
                }
              }
              .normal-end-charge {
                .left {
                  .title {
                    font-size: 24px;
                  }
                }
                .right {
                  .value {
                    font-size: 24px;
                  }
                }
              }
              .overtime-last {
                .left {
                  .title {
                    font-size: 24px;
                  }
                }
                .right {
                  .value, .money {
                    font-size: 24px;
                  }
                }
              }
              .overtime-begin-charge {
                .left {
                  .title {
                    font-size: 24px;
                  }
                }
                .right {
                  .value {
                    font-size: 24px;
                  }
                }
              }
              .overtime-end-charge {
                .left {
                  .title {
                    font-size: 24px;
                  }
                }
                .right {
                  .value {
                    font-size: 24px;
                  }
                }
              }
            }
          }
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
    .close-wrapper {
      .close-info {
        font-size: 24px;
      }
      .operate-wrapper {
        .text {
          font-size: 30px;
        }
      }
    }
  }

  [data-dpr="3"]
  .parking-detail-wrapper {
    font-size: 54px;
    .top {
      .parking-fee {
        .right {
          .text {
            font-size: 54px;
          }
          .icon {
            background-image: url('../../assets/img/@3x/icon-info@3x.png');
          }
        }
      }
      .parking-duration {
        .left {
          .duration {
            font-size: 54px;
          }
          .repeat {
            font-size: 42px;
          }
        }
        .right {
          .icon {
            background-image: url('../../assets/img/@3x/gray-icon-right@3x.png');
          }
        }
      }
    }
    .body {
      .tab-content-container {
        .placeholder {
          .icon {
            background-image: url("../../assets/img/@3x/placeholder@3x.png");
          }
          .text {
            font-size: 42px;
          }
        }
        .order-item {
          .carNO-wrapper {
            .left {
              .title, .value {
                font-size: 54px;
              }
            }
            .right {
              .status {
                font-size: 42px;
              }
            }
          }
          .detail-wrapper {
            font-size: 42px;
            .time-wrapper {
              .left {
                .reserveTime, .inTime, .outTime {
                  .title, .value {
                    font-size: 42px;
                  }
                }
              }
              .right {
                .icon {
                  background-image: url('../../assets/img/@3x/tel@3x.png');
                }
              }
            }
            .charge-wrapper {
              .normal-last {
                line-height: 42px;
                .left {
                  .title {
                    font-size: 42px;
                  }
                }
                .right {
                  .value, .money {
                    font-size: 42px;
                  }
                }
              }
              .normal-begin-charge {
                .left {
                  .title {
                    font-size: 42px;
                  }
                }
                .right {
                  .value {
                    font-size: 42px;
                  }
                }
              }
              .normal-end-charge {
                .left {
                  .title {
                    font-size: 42px;
                  }
                }
                .right {
                  .value {
                    font-size: 42px;
                  }
                }
              }
              .overtime-last {
                line-height: 42px;
                .left {
                  .title {
                    font-size: 42px;
                  }
                }
                .right {
                  .value, .money {
                    font-size: 42px;
                  }
                }
              }
              .overtime-begin-charge {
                .left {
                  .title {
                    font-size: 42px;
                  }
                }
                .right {
                  .value {
                    font-size: 42px;
                  }
                }
              }
              .overtime-end-charge {
                .left {
                  .title {
                    font-size: 42px;
                  }
                }
                .right {
                  .value {
                    font-size: 42px;
                  }
                }
              }
            }
          }
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
    .close-wrapper {
      .close-info {
        font-size: 42px;
      }
      .operate-wrapper {
        .text {
          font-size: 54px;
        }
      }
    }
  }
</style>
