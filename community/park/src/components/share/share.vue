<template>
  <div class="share-wrapper">
    <div v-if="isPlaceholder" class="placeholder-wrapper">
      <div class="placeholder"></div>
      <div class="btn-share" @click="addParking">
        <j-button type="primary" jText="我要共享"></j-button>
      </div>
    </div>
    <div v-if="sharingList.length" class="header-wrapper">
      <div class="content">
        <div class="totayIncome">
          <div class="title">今日收益(元)</div>
          <div class="value" v-text="shareBaseInfo.todayIncome"></div>
        </div>
        <div class="totalIncome">
          <span class="title" @click="showReceiveDetail">总收益(元):</span>
          <span class="value" v-text="shareBaseInfo.totalIncome" @click="showReceiveDetail"></span>
          <span class="icon" @click="showReceiveDetail"></span>
        </div>
      </div>
    </div>
    <ul v-if="sharingList.length" class="parking-list-wrapper">
      <li class="parking-item" v-for="shareParking in sharingList"
          :class="{isClosed: shareParking.parkingStatus !== 1}"
          @click="showParkingDetail(shareParking)">
        <div class="top">
          <span class="left" v-text="communityName + ' ' + shareParking.parkingNO"></span>
          <div class="right">
            <span class="unpassed" v-if="shareParking.parkingStatus === 2">待审核</span>
            <span class="unpassed" v-if="shareParking.parkingStatus === 3">未通过</span>
            <j-switch class="right-switch" v-if="shareParking.parkingStatus === 1 || shareParking.parkingStatus === 0"
                      v-model="shareParking.isOpened" @switchStatus="switchParkingStatus(shareParking)"></j-switch>
          </div>
        </div>
        <div class="body" v-if="shareParking.parkingStatus !== 2">
          <div class="left">
            <span class="icon" :class="{isParking: (shareParking.parkingCarNO && shareParking.parkingCarNO !== '无')}"></span>
          </div>
          <div class="right">
            <div class="right-title">
              <div class="duration">共享时段:</div>
              <div class="rent">价格:</div>
              <div class="todayUsedTimes">今日使用:</div>
              <div class="parkingCarNO">正在停放:</div>
            </div>
            <div class="right-value">
              <div class="duration-value" v-text="shareParking.sharingDurationStr"></div>
              <div class="rent-value" v-text="rent + rentUnit"></div>
              <div class="todayUsedTimes-value" v-text="shareParking.usedTimes"></div>
              <div class="parkingCarNO-value" v-text="shareParking.parkingCarNO"></div>
            </div>
          </div>
        </div>
        <div class="waiting-wrapper" v-if="shareParking.parkingStatus === 2">
          <span class="pic"></span>
          <span class="text">我们正在火速审核中,请您耐心等待......</span>
        </div>
      </li>
    </ul>
    <div v-if="sharingList.length" class="parking-add-wrapper" @click="addParking">
      <span class="icon"></span>
      <span class="text">新增车位</span>
    </div>
    <!--关闭车位Modal begin-->
    <x-dialog class="close-wrapper" v-model="closeParkingModal.isShow" :dialog-style="closeParkingModal.closeDialogStyle" hide-on-blur>
      <span class="close-info vux-1px-b" v-text="closeParkingModal.text"></span>
      <div class="operate-wrapper">
        <span class="text vux-1px-r" @click="closeParkingModal.isShow = false">暂不关闭</span>
        <span class="text" @click="closeParking(closeParkingModal.currentParking)">关闭</span>
      </div>
    </x-dialog>
    <!--关闭车位Modal end-->
    <!--悬浮窗begin-->
    <div class="float-box-wrapper" v-if="orderToast.visible" v-text="orderToast.description"
         @click="linkToRecords">
    </div>
    <!--悬浮窗end-->
  </div>
</template>

<script>
  import router from '../../router';
  import {mapState} from 'vuex';
  import {querystring} from 'vux';
  import JSwitch from 'components/utils/jswitch';
  import JButton from 'components/utils/jbutton';
  import {jlDate} from '../../common/utils';
  import Toast from 'components/utils/toast/toast';
  export default {
    name: 'share',
    created: function () {
      document.title = '我要共享';
      this.$store.commit('updateTabStatus', {
        tabStatus: [false, true, false]
      });
      // 清空重复状态的状态管理
      this.$store.commit('updateSharingRepeat', {
        sharingRepeat: ''
      });
      // 恢复默认时段
      this.$store.commit('updateSharingTimeIndexs', {
        sharingTimeIndexs: [32, 36]
      });
      // 清空上传图片的状态管理
      this.$store.commit('updateUploadedParkingPics', {
        uploadedParkingPics: {
          pics: [],
          previewPics: []
        }
      });
      this.$store.commit('updateUploadedIdPics', {
        uploadedIdPics: {
          pics: [],
          previewPics: []
        }
      });
      // 初始化订单类目信息
      this.initOrderList();
      // 初始化共享信息
      this.initShareInfo();
    },
    data () {
      return {
        categoryOrder: {}, // 订单状态
        orderToast: {}, // 订单状态悬浮窗
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
        },
        shareBaseInfo: {},
        sharingList: [],
        isPlaceholder: false
      }
    },
    methods: {
      initOrderList: function () {
        // 调用接口1，获取订单类目
        let _this_ = this;
        this.$JHttp.get(window.homeURL + '/sharedPark/order/statusStatistic').then((res) => {
          if (res.data.status === 100) {
            let data = res.data.data;
            if (data) {
              let categoryOrder = data;
              _this_.$set(_this_, 'categoryOrder', categoryOrder);
              _this_.initOrderToast();
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
      initOrderToast: function () {
        let visible = true;
        let order = this.categoryOrder;
        if (order.pendingPayCount) { // 存在待支付订单
          // 跳转到我要停车页面,理论上不存在这种可能
          router.replace('/home/park');
          return;
        }
        let orderToast = {};
        if (order.prepareCount) { // 没有待支付,存在待开始的订单
          orderToast = {
            visible: visible,
            description: '您有' + order.prepareCount + '个待开始的订单'
          };
          this.orderToast = orderToast;
          return;
        }
        if (order.valuatingCount) { // 没有待支付和待开始,存在计费中订单
          orderToast = {
            visible: visible,
            description: '您有' + order.valuatingCount + '个计费中的订单'
          }
          this.orderToast = orderToast;
          return;
        }
        this.orderToast = orderToast;
      },
      // 初始化共享信息
      initShareInfo: function () {
        // 获取基础信息
        let _this_ = this;
        this.$JHttp.get(window.homeURL + '/sharedPark/parkingSpace').then((res) => {
          if (res.data.status === 100) {
            // 分成信息
            if (res.data.data && res.data.data.project) {
              let project = res.data.data.project;
              _this_.shareBaseInfo = {
                ownerReceiveRate: project.ownerPercent,
                propertyReceiveRate: project.propertyPercent,
                industryCommitteeReceiveRate: project.communityPercent,
                platformReceiveRate: project.platformPercent
              };
              _this_.$store.commit('updateOwnerReceiveRate', {
                ownerReceiveRate: this.shareBaseInfo.ownerReceiveRate
              });
              _this_.$store.commit('updatePropertyReceiveRate', {
                propertyReceiveRate: this.shareBaseInfo.propertyReceiveRate
              });
              _this_.$store.commit('updateIndustryCommitteeReceiveRate', {
                industryCommitteeReceiveRate: this.shareBaseInfo.industryCommitteeReceiveRate
              });
              _this_.$store.commit('updatePlatformReceiveRate', {
                platformReceiveRate: this.shareBaseInfo.platformReceiveRate
              });
            }
            // 收益信息
            if (res.data.data && res.data.data.userFunds) {
              let userFunds = res.data.data.userFunds;
              let todayIncome = userFunds.todayIncome || '0.00';
              _this_.$set(this.shareBaseInfo, 'todayIncome', todayIncome);
              let totalIncome = userFunds.totalIncome || '0.00';
              _this_.$set(this.shareBaseInfo, 'totalIncome', totalIncome);
            }
            // 共享车位列表
            if (res.data.data && res.data.data.spaces && res.data.data.spaces.length) {
              let spaces = res.data.data.spaces;
              spaces.forEach(function (sharingParking) {
                // 添加车位是否开启属性
                let parking = {
                  shareId: sharingParking.id, // 分享计划ID
                  parkingId: sharingParking.roomId, // 车位号ID
                  parkingNO: sharingParking.name,
                  sharingStartTime: sharingParking.beginTime,
                  sharingEndTime: sharingParking.endTime,
                  isCrossDay: sharingParking.isCrossDay, // 是否隔天
                  parkingStatus: sharingParking.status, // 车位共享状态 -1:已删除,0:关闭,1:开启,2:待审核,3:未通过
                  usedTimes: sharingParking.todayUsedTimes,
                  parkingCarNO: sharingParking.currentCarNum || '无'
                };
                _this_.$set(parking, 'isOpened', sharingParking.status === 1);
                let sharingStarTime = sharingParking.beginTime;
                let sharingEndTime = sharingParking.endTime;
                let isCrossDay = sharingParking.isCrossDay;
                if (isCrossDay === 1) {
                  sharingEndTime += '次日';
                }
                let sharingRepeatStr = jlDate.getSharingRepeatStr(sharingParking.weekday);
                let sharingDurationStr = '未设置';
                if (sharingStarTime) {
                  sharingDurationStr = sharingStarTime + '-' + sharingEndTime + ' ' + sharingRepeatStr;
                }
                _this_.$set(parking, 'sharingDurationStr', sharingDurationStr);
                _this_.sharingList.push(parking);
              });
            } else {
              this.isPlaceholder = true;
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
      // 查看收益明细
      showReceiveDetail: function () {
        router.push('/share/receive');
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
      getCarStatusByParkingId: function (shareId, cb) {
        // 调用接口获取，当前车位的停放状态和预约状态
        this.$JHttp.get(window.homeURL + '/sharedPark/parkingSpace/' + shareId + '/closeCheck').then((res) => {
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
        let status = 0; // 关闭
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
              this.$store.commit('updateCurrentShareId', {
                currentShareId: shareParking.shareId
              });
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
      // 进入共享车位详情页
      showParkingDetail: function (parking) {
        // 阻止j-switch的click事件
        if (event.target.nodeName === 'INPUT') {
          return;
        }
        if (parking.parkingStatus === 2) { // 待审核
          Toast('请耐心等待');
          return;
        }
        let shareId = parking.shareId;
        this.$store.commit('updateCurrentShareId', {
          currentShareId: shareId
        });
        if (parking.parkingStatus === 3) { // 未通过,跳转到新增车位页面
          router.push({
            name: 'addParking',
            params: {
              unPassParkingId: parking.parkingId
            }
          });
          return;
        }
        router.push('/share/parkingDetail');
      },
      // 新增车位
      addParking: function () {
        this.$store.commit('updateCurrentShareId', {
          currentShareId: undefined // 清空编辑的车位id(存储在状态管理中)
        });
        this.$store.commit('updateSelectedParking', {
          selectedParking: undefined // 清空之前选择过的车位号信息
        });
        this.$store.commit('updateProtocolChecked', {
          protocolChecked: false // 清空之前勾选的协议
        });
        router.push('/share/addParking');
      },
      // 跳转到停车记录页
      linkToRecords: function () {
        router.push('/home/records');
      }
    },
    computed: mapState({
      rent: state => state.pageCfg.rent,
      rentUnit: state => state.pageCfg.rentUnit,
      communityName: state => state.pageCfg.communityName
    }),
    components: {
      'j-switch': JSwitch,
      'j-button': JButton
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .share-wrapper {
    color: #333;
    background-color: #ebebeb;
    .placeholder-wrapper {
      .placeholder {
        width: 100%;
        height: 11.973333rem;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url('../../assets/img/@2x/no-sharing.png');
      }
      .btn-share {
        margin-top: 0.6rem;
        padding: 0 0.4rem;
        height: 1.12rem;
      }
    }
    .header-wrapper {
      color: #fff;
      width: 100%;
      height: 5.013333rem;
      background-image: -webkit-linear-gradient(-360deg, #0ad5db, #18b0f9);
      .content {
        height: 4.32rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .totayIncome {
          font-size: 0;
          margin-top: 0.986667rem;
          .title {
            margin-bottom: 0.213333rem;
            font-size: 12px;
            line-height: 12px;
          }
          .value {
            font-size: 52px;
            line-height: 52px;
            font-weight: 600;
          }
        }
        .totalIncome {
          position: relative;
          font-size: 0;
          width: 100%;
          height: 1.173333rem;
          margin-top: 0.265667rem;
          display: flex;
          align-items: center;
          justify-content: center;
          .title, .value {
            font-size: 14px;
          }
          .title {
            margin-right: 0.213333rem;
          }
          .icon {
            position: absolute;
            top: 50%;
            margin-top: -0.273333rem;
            right: 1.946667rem;
            display: inline-block;
            width: 0.213333rem;
            height: 0.426667rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url('../../assets/img/@2x/white-icon-right.png');
          }
        }
      }
    }
    .parking-list-wrapper {
      color: #333;
      margin-top: -0.613333rem;
      .parking-item {
        position: relative;
        background-color: #fff;
        margin: 0 0.4rem;
        padding: 0 0.4rem;
        border-radius: 0.266667rem;
        margin-bottom: 0.4rem;
        box-shadow: 0 0.066667rem 0.106667rem rgba(24, 173, 251, 0.08) ;
        .top {
          display: flex;

          justify-content: space-between;
          align-items: center;
          text-align: left;
          padding-top: 0.4rem;
          padding-bottom: 0.32rem;
          .left {
            font-size: 14px;
          }
          .right{
            padding-left: 0.64rem;
            .unpassed {
              color: #aaa;
              display: inline-block;
              width: 1.626667rem;
              height: 0.533333rem;
              line-height: 0.533333rem;
              border-radius: 2.666667rem;
              background-color: #ebebeb;
              text-align: center;
              font-size: 12px;
            }
          }
        }
        .body {
          height: 2.906667rem;
          display: flex;
          .left {
            flex: 0 0 2.24rem;
            height: 2.506667rem;
            text-align: left;
            .icon {
              display: inline-block;
              width: 1.786667rem;
              height: 2.506667rem;
              background-size: 100%;
              background-repeat:no-repeat;
              background-image: url('../../assets/img/@2x/parking-no-car.png');
            }
            .isParking {
              background-image: url('../../assets/img/@2x/parking-car.png');
            }
          }
          .right {
            flex: 1;
            font-size: 12px;
            display: flex;
            text-align: left;
            .right-title {
              flex: 0 0 1.866667rem;
            }
            .right-value {
              flex: 1;
              max-width: 4.293333rem;
              .duration-value {
                overflow: hidden;
                white-space:nowrap;
                text-overflow:ellipsis;
              }
            }
          }
        }
        .waiting-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-bottom: 0.4rem;
          .pic {
            display: inline-block;
            width: 1.866667rem;
            height: 1.866667rem;
            background-size: 100%;
            background-repeat:no-repeat;
            background-image: url('../../assets/img/@2x/auditing.png');
          }
        }
      }
      .isClosed {
        color: #aaa;
      }
    }
    .parking-add-wrapper {
      margin: 0.613333rem 0;
      .icon {
        margin-right: 0.133333rem;
        display: inline-block;
        width: 0.426667rem;
        height: 0.426667rem;
        background-size: 100%;
        background-repeat:no-repeat;
        background-image: url('../../assets/img/@2x/add.png');
      }
      .text {
        color: #aaa;
        font-size: 16px;
      }
    }
    .close-wrapper {
      .close-info {
        color: #333;
        font-size: 14px;
        display: inline-block;
        padding: 0 0.8rem 0.4rem 0.8rem;
      }
      .operate-wrapper {
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        align-items: center;
        -webkit-align-items: center;
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
    .float-box-wrapper {
      position: fixed;
      right: 0.4rem;
      bottom: 1.96rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fbbe18;
      border-radius: 2.666667rem;
      min-width: 164px;
      height: 1.12rem;
      color: #333;
      font-size: 14px;
    }
  }

  [data-dpr="2"]
  .share-wrapper {
    .header-wrapper {
      .content {
        .totayIncome {
          .title {
            font-size: 24px;
            line-height: 24px;
          }
          .value {
            font-size: 96px;
            line-height: 96px;
          }
        }
        .totalIncome {
          .title, .value {
            font-size: 30px;
          }
        }
      }
    }
    .parking-list-wrapper {
      .parking-item {
        .top {
          .left {
            font-size: 30px;
          }
          .right {
            .unpassed {
              font-size: 24px;
            }
          }
        }
        .body {
          .right {
            font-size: 24px;
          }
        }
      }
    }
    .parking-add-wrapper {
      .text {
        font-size: 36px;
      }
    }
    .close-wrapper {
      .close-info {
        font-size: 30px;
      }
      .operate-wrapper {
        .text {
          font-size: 34px;
        }
      }
    }
    .float-box-wrapper {
      min-width: 3.84rem;
      font-size: 24px;
    }
  }
  [data-dpr="3"]
  .share-wrapper {
    .placeholder-wrapper {
      .placeholder {
        background-image: url('../../assets/img/@3x/no-sharing@3x.png');
      }
    }
    .header-wrapper {
      .content {
        .totayIncome {
          .title {
            font-size: 42px;
            line-height: 42px;
          }
          .value {
            font-size: 158px;
            line-height: 158px;
          }
        }
        .totalIncome {
          .title, .value {
            font-size: 54px;
          }
          .icon {
            background-image: url('../../assets/img/@3x/white-icon-right@3x.png');
          }
        }
      }
    }
    .parking-list-wrapper {
      .parking-item {
        .top {
          .left {
            font-size: 54px;
          }
          .right {
            .unpassed {
              font-size: 42px;
            }
          }
        }
        .body {
          .left {
            .icon {
              background-image: url('../../assets/img/@3x/parking-no-car@3x.png');
            }
            .isParking {
              background-image: url('../../assets/img/@3x/parking-car@3x.png');
            }
          }
          .right {
            font-size: 42px;
          }
        }
        .waiting-wrapper {
          .pic {
            background-image: url('../../assets/img/@3x/auditing@3x.png');
          }
        }
      }
    }
    .parking-add-wrapper {
      .icon {
        background-image: url('../../assets/img/@3x/add@3x.png');
      }
      .text {
        font-size: 60px;
      }
    }
    .close-wrapper {
      .close-info {
        font-size: 54px;
      }
      .operate-wrapper {
        .text {
          font-size: 60px;
        }
      }
    }
    .float-box-wrapper {
      min-width: 3.84rem;
      font-size: 42px;
    }
  }

</style>
