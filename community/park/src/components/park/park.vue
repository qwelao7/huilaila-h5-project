<template>
  <div class="park-wrapper">
    <div class="content-wrapper" v-show="!searchingParking">
      <!--车牌号begin-->
      <div class="carNO-wrapper">
        <div class="left">
          <span class="title">车牌号</span>
        </div>
        <div class="right" @click="addCarNO">
          <span class="value" v-text="carNO">请设置车牌号</span>
          <span class="icon"></span>
        </div>
      </div>
      <!--车牌号end-->
      <!--入场时间begin-->
      <div class="inTime-wrapper">
        <div class="top">
          <div class="left">
            <span class="title">入场时间</span>
          </div>
          <div class="right">
            <span class="title" @click="showRuleDescription">停车费:</span>
            <span class="value" v-text="rent + rentUnit" @click="showRuleDescription"></span>
            <span class="icon" @click="showRuleDescription"></span>
          </div>
        </div>
        <div class="bottom" @click="inTimeShow = true">
          <div class="middle" @click="showInTimePicker">
            <span class="placeholder" v-if="!inTimeStr">请选择</span>
            <span class="value" v-if="inTimeStr" v-text="inTimeStr"></span>
          </div>
          <span class="icon"></span>
        </div>
      </div>
      <!--入场时间end-->
      <!--出场时间begin-->
      <div class="outTime-wrapper" @click="showOutTimePicker">
        <div class="top">
          <span class="title">出场时间</span>
        </div>
        <div class="bottom">
          <div class="middle">
            <span class="placeholder" v-if="!outTimeStr">请选择</span>
            <span class="value" v-if="outTimeStr" v-text="outTimeStr"></span>
          </div>
          <span class="icon"></span>
        </div>
      </div>
      <!--出场时间end-->
      <!--备注begin-->
      <div class="remark-wrapper">
        <span v-text="remark"></span>
      </div>
      <!--备注end-->
      <!--预计费用begin-->
      <div class="fee-wrapper">
        <span>预计费用:</span>
        <span v-text="calculateRent"></span>
        <div class="fee-remark">（最终费用将以实际停车时长为准）</div>
      </div>
      <!--预计费用end-->
      <div class="save-wrapper">
        <j-button j-text="确认提交" type="primary" :disabled="disabled" @click.native="saveParkOrder"></j-button>
      </div>

      <!--悬浮窗begin-->
      <div class="float-box-wrapper" v-if="orderToastShow"
           v-show="dialog.visible" v-text="dialog.description" @click="linkToRecords">
      </div>
      <!--悬浮窗end-->

      <!--访客通行Modal begin-->
      <x-dialog class="visitor-wrapper" v-model="visitorModal.isShow" :dialog-style="visitorModal.visitorDialogStyle" hide-on-blur>
        <span class="visitor-info vux-1px-b" v-text="visitorModal.text"></span>
        <div class="operate-wrapper">
          <span class="text vux-1px-r" @click="cancelOrder">再想想</span>
          <span class="text" @click="continueSaveOrder">继续</span>
        </div>
      </x-dialog>
      <!--访客通行Modal end-->
    </div>
    <!--匹配车位动效 begin-->
    <div class="searching-parking" v-if="searchingParking">
      <span class="icon"></span>
      <span class="text">正在为您安排车位...</span>
    </div>
    <!--匹配车位动效 end-->
    <router-view></router-view>
  </div>
</template>

<script>
  import router from '../../router';
  import {mapState} from 'vuex';
  import {dateFormat} from 'vux';
  import JButton from 'components/utils/jbutton';
  import Picker from 'mx-picker';
  import Toast from 'components/utils/toast/toast';
  import {jlDate, JURL} from '../../common/utils';
  const orderStatusEnum = {
    waitingToPay: 1, // 待支付订单
    waitingToStart: 2, // 待开始订单
    charging: 3 // 计费中
  };
  const dialogTypeEnum = {
    shadow: 1, // 全屏遮罩
    toast: 2 // 悬窗提示
  };
  export default {
    name: 'park',
    created: function () {
      document.title = '我要停车';
      this.updateToken();
      this.$store.commit('updateTabStatus', {
        tabStatus: [true, false, false]
      });
      this.$store.commit('updateOrderDialog', {
        orderDialog: {}
      });
      this.initOrders();
      this.initPageCfg();
    },
    data () {
      return {
        disabled: false,
        enterTime: new Date(), // 进入页面的时间
        carId: '', // 车牌ID
        carNO: '请设置车牌号', // 车牌号
        inTimePicker: undefined,
        inTimeList: [], // 入场可用时间集合
        inTimeStr: '', // 入场时间
        inTimeArr: [], // 入场时间数组
        isParkNow: false,
        outTimePicker: undefined,
        outTimeList: [], // 出场可用时间集合
        outTimeSelectIndex: [], // 出场时间默认选中的序号
        outTimeStr: '', // 离场时间
        outTimeArr: [], // 离场时间数组
        categoryOrder: {}, // 订单状态
        dialog: {}, // 弹窗实体
        recommendList: [],
        visitorModal: {
          isShow: false,
          forcedCloseVisitor: 0,
          text: '该车牌已被预约访客通行，继续提交将作废原访客通行申请',
          visitorDialogStyle: {
            maxWidth: '100%',
            width: '70%',
            padding: '0.4rem 0 0 0',
            borderRadius: '0.266667rem'
          }
        },
        searchingParking: false,
        inTimePickerDisable: false,
        outTimePickerDisable: false
      }
    },
    computed: mapState({
      rent: state => state.pageCfg.rent, // 园区租金
      rentUnit: state => state.pageCfg.rentUnit, // 园区租金单位
      communityName: state => state.pageCfg.communityName, // 园区名称
      freeLast: state => state.pageCfg.freeLast, // 免费时长(即时停车)
      aheadIn: state => state.pageCfg.aheadIn, // 提前入场时长(预约停车)
      holdLast: state => state.pageCfg.holdLast, // 保留车位时长
      // 备注
      remark: function () {
        // 进出场时间都选择才显示备注
        if (!this.postInTime && !this.postOutTime) {
          return '';
        }
        if (this.isParkNow) { // 即时停车
          return '注：提交' + this.freeLast + '后将开始计费，且车位将为您保留' + this.holdLast +
            '，若您未在' + this.holdLast + '内进入，则将收取' + this.holdLast + '停车费用。';
        } else { // 预约停车
          return '注：计费将从预约的入场时间开始，您可提前' + this.aheadIn + '入场。车位将为您保留' + this.holdLast +
            '，若您未在' + this.holdLast + '内进入，则将收取' + this.holdLast + '停车费用。'
        }
      },
      // 格式化后提交给后台的入场时间
      postInTime: function () {
        let postInTime = '';
        let today = new Date();
        if (!this.inTimeStr) {
          return '';
        } else {
          let date = '';
          this.isParkNow = false;
          if (this.inTimeArr[1] === '现在') { // 选择的是现在
            if (!this.inTimeArr[2]) { // 现在可用
              this.isParkNow = true;
              return dateFormat(today, 'YYYY-MM-DD HH:mm');
            } else { // 现在不可用
              return '';
            }
          }
          if (this.inTimeArr[0] === '今天') { // 选择的是其他,100:今天
            date = dateFormat(today, 'YYYY-MM-DD') + ' ';
          } else if (this.inTimeArr[0] === '明天') { // 200:明天
            date = dateFormat(jlDate.addDays(today, 1), 'YYYY-MM-DD') + ' ';
          } else if (this.inTimeArr[0] === '后天') { // 300:后天
            date = dateFormat(jlDate.addDays(today, 2), 'YYYY-MM-DD') + ' ';
          }
          postInTime += date; // 日期部分
          let hour = this.inTimeArr[1] + ':';
          let minutes = this.inTimeArr[2];
          postInTime += hour + minutes;
          return postInTime;
        }
      },
      // 格式化后提交给后台的离场时间
      postOutTime: function () {
        let postOutTime = '';
        let today = new Date();
        if (!this.outTimeStr) {
          return '';
        } else {
          let date = '';
          if (this.outTimeArr[0] === '今天') { // 选择的是其他,100:今天
            date = dateFormat(today, 'YYYY-MM-DD') + ' ';
          } else if (this.outTimeArr[0] === '明天') { // 200:明天
            date = dateFormat(jlDate.addDays(today, 1), 'YYYY-MM-DD') + ' ';
          } else if (this.outTimeArr[0] === '后天') { // 300:后天
            date = dateFormat(jlDate.addDays(today, 2), 'YYYY-MM-DD') + ' ';
          } else if (this.outTimeArr[0].indexOf('-') !== -1) { // eg05-18
            let y = today.getFullYear(); // 当前年份
            let monthDateParts = this.outTimeArr[0].split('-'); // 月日部分
            let m = monthDateParts[0]; // 月份
            let d = monthDateParts[1]; // 日期
            date = y + '-' + m + '-' + d + ' ';
          }
          postOutTime += date; // 日期部分
          let hour = this.outTimeArr[1] + ':';
          let minutes = this.outTimeArr[2];
          postOutTime += hour + minutes;
          return postOutTime;
        }
      },
      orderToastShow: function () {
        return this.dialog.type === dialogTypeEnum.toast;
      },
      calculateRent: function (state) {
        // 进出场时间未选择完
        if (!this.postInTime || !this.postOutTime) {
          return window.commonConfig.RMBSymbol + '0.00';
        }
        // safari无法解析'-'格式日期
        let inTime = new Date(this.postInTime.replace(/-/g, '/'));
        let chargeBegin = inTime;
        if (this.isParkNow) { // 即时停车,计费时间=预计入场时间+免费时长
          let freeLast = this.freeLast;
          let value = freeLast.replace(/[^0-9]/ig, '');
          chargeBegin = jlDate.addMinutes(inTime, value);
        }
        let outTime = new Date(this.postOutTime.replace(/-/g, '/'));
        // 进出场时间非法
        if ('Invalid Date' == inTime || 'Invalid Date' == outTime || inTime >= outTime) { // eslint-disable-line
          return window.commonConfig.RMBSymbol + '0.00';
        } else {
          // 计算预计停车费用
          let milliSeconds = (outTime - chargeBegin); // 停车持续的毫秒值
          let totalHours = Math.ceil(milliSeconds / 3600000); // 1000 * 60 * 60,向上取整
          let rent = state.pageCfg.rent;
          let money = totalHours * rent; // 总金额
          let maxMoney = state.pageCfg.maxMoney;
          if (maxMoney !== 0) { // 存在24小时内封顶价
            let days = Math.floor(totalHours / 24);
            let leftHours = totalHours % 24;
            let allDayMoney = days * 24 * rent; // n*24小时内的价格
            let allDayMaxMoney = days * maxMoney; // n*24小时内的封顶价
            let leftMoney = leftHours * rent; // 余下的价格
            if (allDayMoney > allDayMaxMoney) {
              allDayMoney = allDayMaxMoney;
            }
            if (leftMoney > maxMoney) {
              leftMoney = maxMoney;
            }
            money = allDayMoney + leftMoney;
          }
          return window.commonConfig.RMBSymbol + money.toFixed(2); // 保留两位小数
        }
      }
    }),
    methods: {
      // 从url中获取token
      updateToken: function () {
        let token, localToken, communityId, localCommunityId, roomId, localRoomId;
        if (!window.token) { // token不存在
          token = JURL.getHashParam('token');
          communityId = JURL.getHashParam('defCommunityId');
          roomId = JURL.getHashParam('defRoomId');
          if (!token) {
            localToken = localStorage.getItem('token');
            localCommunityId = localStorage.getItem('communityId');
            localRoomId = localStorage.getItem('roomId');
            if (!localToken) {
              // 跳转到占位图页面
              router.replace('/home/empty');
              return false;
            } else {
              window.token = localToken;
              window.communityId = localCommunityId;
              window.roomId = localRoomId;
            }
          } else {
            window.token = token;
            window.communityId = communityId;
            window.roomId = roomId;
            localStorage.setItem('token', token);
            localStorage.setItem('communityId', communityId);
            localStorage.setItem('roomId', roomId);
          }
        }
      },
      initOrders: function () {
        // 调用接口1，获取订单类目
        let _this_ = this;
        this.$JHttp.get(window.homeURL + '/sharedPark/order/statusStatistic').then((res) => {
          if (res.data.status === 100) {
            let data = res.data.data;
            if (data) {
              let categoryOrder = data;
              _this_.$set(_this_, 'categoryOrder', categoryOrder);
              _this_.initDialog();
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
      initDialog: function () {
        let visible = true;
        let dialog = null;
        let order = this.categoryOrder;
        let description = null;
        let _this_ = this;
        if (order.pendingPayCount > 0) { // 存在待支付订单
          description = '您还有' + order.count + '个待支付的订单,请尽快支付。';
          this.$JHttp.get(window.homeURL + '/sharedPark/order/unpaid').then((res) => {
            if (res.data.status === 100) {
              let data = res.data.data;
              if (data) {
                let dataList = data.orders;
                let waitingToPayList = [];
                if (dataList && dataList.length) {
                  let titlePrefix = '查看订单';
                  dataList.forEach(function (item, index) {
                    let waitToPayOrder = {
                      id: item.orderId,
                      title: titlePrefix + (index + 1) + ':',
                      money: item.amount
                    }
                    waitingToPayList.push(waitToPayOrder);
                  });
                }
                dialog = {
                  type: dialogTypeEnum.shadow,
                  visible: visible,
                  description: description,
                  count: data.count,
                  totalMoney: data.amount,
                  waitingToPayList: waitingToPayList
                }
                _this_.$set(_this_, 'dialog', dialog);
                // 将待支付订单加入状态管理
                _this_.$store.commit('updateOrderDialog', {
                  orderDialog: dialog
                });
                router.replace('/home/waiting2pay');
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
        }
        if (order.prepareCount) { // 没有待支付,存在待开始的订单
          dialog = {
            type: dialogTypeEnum.toast,
            visible: visible,
            status: orderStatusEnum.waitingToStart,
            description: '您有' + order.prepareCount + '个待开始的订单'
          };
          this.$set(this, 'dialog', dialog);
          return;
        }
        if (order.valuatingCount) { // 没有待支付和待开始,存在计费中订单
          dialog = {
            type: dialogTypeEnum.toast,
            visible: visible,
            status: orderStatusEnum.charging,
            description: '您有' + order.valuatingCount + '个计费中的订单'
          }
          this.$set(this, 'dialog', dialog);
          return;
        }
      },
      initPageCfg: function () {
        let pageCfg = {
          rent: 0,
          rentUnit: '元/时',
          maxMoney: 0,
          communityName: '',
          freeLast: '',
          aheadIn: '',
          holdLast: ''
        };
        // 获取基础信息
        this.$JHttp.get(window.homeURL + '/sharedPark/parkingSpace').then((res) => {
          if (res.data.status === 100) {
            if (res.data.data && res.data.data.project) {
              let project = res.data.data.project;
              pageCfg = {
                rent: parseFloat(project.normalPrice),
                rentUnit: project.priceUnit || '元/时',
                maxMoney: parseFloat(project.maxAmount) || 0,
                communityName: project.communityName,
                freeLast: project.freeMinute + '分钟',
                aheadIn: project.advanceMinute + '分钟',
                holdLast: project.keepHour + '小时',
                propertyPhone: project.communityPhone, // 物业电话
                shareProtocol: project.shareProtocol, // 共享协议
                ruleDescription: project.ruleDescription, // 计费规则描述
                instructionPic: project.instruction // 车位平面图
              };
              this.$store.commit('updateRent', {
                rent: pageCfg.rent
              });
              this.$store.commit('updateRentUnit', {
                rentUnit: pageCfg.rentUnit
              });
              this.$store.commit('updateMaxMoney', {
                maxMoney: pageCfg.maxMoney
              });
              this.$store.commit('updateCommunityName', {
                communityName: pageCfg.communityName
              });
              this.$store.commit('updateFreeLast', {
                freeLast: pageCfg.freeLast
              });
              this.$store.commit('updateAheadIn', {
                aheadIn: pageCfg.aheadIn
              });
              this.$store.commit('updateHoldLast', {
                holdLast: pageCfg.holdLast
              });
              this.$store.commit('updatePropertyPhone', {
                propertyPhone: pageCfg.propertyPhone
              });
              this.$store.commit('updateShareProtocol', {
                shareProtocol: pageCfg.shareProtocol
              });
              this.$store.commit('updateRuleDescription', {
                ruleDescription: pageCfg.ruleDescription
              });
              this.$store.commit('updateInstructionPic', {
                instructionPic: pageCfg.instructionPic
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
        // 获取默认车牌
        this.$JHttp.get(window.homeURL + '/sharedPark/car/default').then((res) => {
          if (res.data.status === 100) {
            if (res.data.data) {
              let car = res.data.data;
              this.carId = car.id;
              this.carNO = car.carNum;
            }
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
        // 调用高德api，获取当前省份
        let _this_ = this;
        this.$http.post(window.commonConfig.GDAPI + '/v3/ip?key=' + window.commonConfig.GDKey).then((res) => {
          if (res.data.status === '1') {
            // 获取省份信息
            _this_.$store.commit('updateProvince', {
              province: res.data.province
            });
            // 获取城市信息
            _this_.$store.commit('updateCity', {
              city: res.data.city
            });
          } else {
            console.error('根据ip获取城市信息失败');
          }
        });
      },
      addCarNO: function () {
        if (!this.carId) { // 没有车牌,直接跳转到新增车牌页面
          router.push('/carNO/addCarNO');
        } else {
          router.push('/carNO/list');
        }
      },
      // 跳转到计费规则描述富文本页
      showRuleDescription: function () {
        router.push('/records/ruleDescription');
      },
      // 跳转到停车记录页
      linkToRecords: function () {
        router.push('/home/records');
      },
      // 构造时间选择器的数据列
      createList: function (obj, list, options) {
        obj.forEach(function (item, index, arr) {
          let temp = {};
          temp.text = item.name;
          temp.value = index;
          list.push(temp);
        })
      },
      // 构造picker列数据（真实渲染所用）
      createColumns: function (list, selectedIndex) {
        let first = [];
        let second = [];
        let third = [];
        this.createList(list, first);
        if (list[selectedIndex[0]].hasOwnProperty('sub')) {
          this.createList(list[selectedIndex[0]].sub, second);
        } else {
          second = [{text: '', value: 0}];
        }
        if (list[selectedIndex[0]].sub[selectedIndex[1]].hasOwnProperty('sub')) {
          this.createList(list[selectedIndex[0]].sub[selectedIndex[1]].sub, third);
        } else {
          third = [{text: '', value: 0}];
        }
        return [first, second, third];
      },
      // 创建入场时间选择器
      createInTimePicker: function (list, options) {
        let selectedIndex; // 默认选中的时间
        let checked;
        if (list[0].sub[0].sub[0].name === '暂无车位') {
          if (list[0].sub.length === 1) { // 表示没有一个可用时间
            selectedIndex = [0, 0, 0]; // 现在,暂无车位
            checked = [0, 0, 0];
          } else {
            selectedIndex = [0, 1, 0];
            checked = [0, 1, 0];
          }
        } else {
          selectedIndex = [0, 0, 0];
          checked = [0, 0, 0];
        }
        let columndatas = this.createColumns(list, selectedIndex);
        let picker = new Picker({
          data: columndatas,
          selectedIndex: selectedIndex,
          cancelText: options.cancelText,
          okText: options.okText,
          footerText: options.footerText,
          title: options.title
        });
        let _this_ = this;
        let first = columndatas[0];
        let second = columndatas[1];
        let third = columndatas[2];
        picker.on('picker.select', function (selectedVal, selectedIndex) {
          let text1 = first[selectedIndex[0]].text;
          let text2 = second[selectedIndex[1]].text;
          let text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';
          if (text2 === '现在') { // 选择的是现在
            if (!text3) {
              _this_.inTimeStr = '现在';
            } else { // 现在不可用
              // Toast('现在暂无可用车位');
              return false;
            }
          } else {
            if (!text3) { // 避免滚动未结束,就点击完成,导致 '今天 23:' 这种情况
              return false;
            }
            _this_.inTimeStr = text1 + ' ' + text2 + ':' + text3;
          }
          _this_.inTimeArr = [text1, text2, text3];
        });
        picker.on('picker.change', function (index, selectedIndex) {
          if (index === 0) {
            firstChange();
          } else if (index === 1) {
            secondChange();
          }
          function firstChange () {
            second = [];
            third = [];
            checked[0] = selectedIndex;
            let firstDate = list[selectedIndex];
            if (firstDate.hasOwnProperty('sub')) {
              _this_.createList(firstDate.sub, second);
              var secondHour = list[selectedIndex].sub[0];
              if (secondHour.hasOwnProperty('sub')) {
                _this_.createList(secondHour.sub, third);
              } else {
                third = [{text: '', value: 0}];
                checked[2] = 0;
              }
            } else {
              second = [{text: '', value: 0}];
              third = [{text: '', value: 0}];
              checked[1] = 0;
              checked[2] = 0;
            }

            picker.refillColumn(1, second);
            picker.refillColumn(2, third);
            picker.scrollColumn(1, 0);
            picker.scrollColumn(2, 0);
          }

          function secondChange () {
            third = [];
            checked[1] = selectedIndex;
            var firstIndex = checked[0];
            if (list[firstIndex].sub[selectedIndex].hasOwnProperty('sub')) {
              let secondHour = list[firstIndex].sub[selectedIndex];
              _this_.createList(secondHour.sub, third);
              picker.refillColumn(2, third);
              picker.scrollColumn(2, 0)
            } else {
              third = [{text: '', value: 0}];
              checked[2] = 0;
              picker.refillColumn(2, third);
              picker.scrollColumn(2, 0)
            }
          }
        });
        this.inTimePicker = picker;
      },
      // 处理后台传回的可用入场时间
      initInTimeList: function (availableInTimes, isNowAvailable, inTimeList) {
        // 处理现在
        if (isNowAvailable) {
          inTimeList.push({
            name: '今天',
            type: 0,
            sub: [{
              name: '现在',
              type: 1,
              sub: [{
                name: '',
                type: 2
              }]
            }]
          })
        } else {
          inTimeList.push({
            name: '今天',
            type: 0,
            sub: [{
              name: '现在',
              type: 1,
              sub: [{
                name: '暂无车位',
                type: 2
              }]
            }]
          })
        }
        // 处理其他时间数据
        let inTimeListIndex = 0;
        if (availableInTimes) {
          let todays = availableInTimes.today;
          if (todays && todays.length) {
            todays.forEach(function (item) {
              let hour = {
                name: item.hour,
                type: 1,
                sub: []
              }
              let minutes = item.minutes;
              if (minutes && minutes.length) {
                minutes.forEach(function (item) {
                  let minute = {
                    name: item,
                    type: 2
                  }
                  hour.sub.push(minute);
                });
              }
              inTimeList[inTimeListIndex].sub.push(hour);
            });
          }
          let tomorrow = availableInTimes.tomorrow;
          if (tomorrow && tomorrow.length) {
            inTimeListIndex++;
            inTimeList.push({
              name: '明天',
              type: 0,
              sub: []
            });
            tomorrow.forEach(function (item) {
              let hour = {
                name: item.hour,
                type: 1,
                sub: []
              }
              let minutes = item.minutes;
              if (minutes && minutes.length) {
                minutes.forEach(function (item) {
                  let minute = {
                    name: item,
                    type: 2
                  }
                  hour.sub.push(minute);
                });
              }
              inTimeList[inTimeListIndex].sub.push(hour);
            });
          }
          let afterTomorrow = availableInTimes.dayAfterTomorrow;
          if (afterTomorrow && afterTomorrow.length) {
            inTimeListIndex++;
            inTimeList.push({
              name: '后天',
              type: 0,
              sub: []
            });
            afterTomorrow.forEach(function (item) {
              let hour = {
                name: item.hour,
                type: 1,
                sub: []
              }
              let minutes = item.minutes;
              if (minutes && minutes.length) {
                minutes.forEach(function (item) {
                  let minute = {
                    name: item,
                    type: 2
                  }
                  hour.sub.push(minute);
                });
              }
              inTimeList[inTimeListIndex].sub.push(hour);
            });
          }
        }
      },
      showInTimePicker: function () {
        if (this.inTimePickerDisable) { // 表示某次点击还未结束
          return;
        }
        this.inTimePickerDisable = true;
        // 调取接口，获取数据列
        let _this_ = this;
        if (!this.inTimePicker) {
          this.$JHttp.get(window.homeURL + '/sharedPark/order/availableSpaces').then((res) => {
            if (res.data.status === 100) {
              let data = res.data.data;
              let currentEmptyCount = data.currentEmptySpaceCount;
              let isNowAvailable = currentEmptyCount > 0; // 现在是否可用
              let availableInTimes = data.shareBeginTimes;
              let inTimeList = [];
              _this_.initInTimeList(availableInTimes, isNowAvailable, inTimeList);
              this.inTimeList = inTimeList;
              let options = {
                type: 'in',
                title: '可预约时间',
                cancelText: '取消',
                okText: '完成'
              };
              this.createInTimePicker(this.inTimeList, options);
              this.inTimePicker.show();
            } else {
              // 接口没有返回数据
              Toast(res.data.msg);
            }
            _this_.inTimePickerDisable = false;
          }).catch(function (response) {
            // 调用接口出错
            Toast(window.commonConfig.commonError);
            _this_.inTimePickerDisable = false;
          });
        } else {
          this.inTimePicker.show();
          _this_.inTimePickerDisable = false;
        }
      },
      // 获取出场时间数据列
      getOutTimeArrs: function (time) {
        let today = new Date();
        let currentDate = today.getDate();
        let currentInDate = new Date(this.postInTime.replace(/-/g, '/')).getDate();
        let targetHour = time.getHours();
        let targetMinute = time.getMinutes();
        let targetDate = time.getDate();
        let gapDates = targetDate - currentDate; // 最近一个离场时间距离今天的天数
        if (gapDates < 0) { // 表示跨月（-27->2月；-29,-30）,本质上就是隔了一天
          gapDates = 1;
        }
        let isStepNight = targetDate - currentInDate !== 0; // 判断是否跨夜(跨月就是负数了)
        let dates = [];
        let hours = [];
        let minutes = [];
        let fullMinutes = window.fullTimeConfig.fullMinutes;
        let fullHours = window.fullTimeConfig.fullHours;
        switch (gapDates) {
          case 0: // 今天,不存在跨夜
            for (let i = targetMinute; i <= 45; i += 15) {
              let j = i < 10 ? ('0' + i) : i;
              minutes.push({
                name: j,
                type: 2
              });
            }
            for (let i = targetHour; i <= 23; i++) {
              let j = i < 10 ? ('0' + i) : i; // 不足10，补零
              if (i === targetHour) {
                hours.push({
                  name: j,
                  type: 1,
                  sub: minutes
                });
              } else {
                hours.push({
                  name: j,
                  type: 1,
                  sub: fullMinutes
                });
              }
            }
            dates.push({
              name: '今天',
              type: 0,
              sub: hours
            }, {
              name: '明天',
              type: 0,
              sub: fullHours
            }, {
              name: '后天',
              type: 0,
              sub: fullHours
            });
            break;
          case 1:
            let thirdDay = jlDate.addDays(today, 3);
            let thirdDayStr = jlDate.getMonthDayStr(thirdDay);
            for (let i = targetMinute; i <= 45; i += 15) {
              let j = i < 10 ? ('0' + i) : i;
              minutes.push({
                name: j,
                type: 2
              });
            }
            for (let i = targetHour; i <= 23; i++) {
              let j = i < 10 ? ('0' + i) : i;
              if (i === targetHour) {
                hours.push({
                  name: j,
                  type: 1,
                  sub: minutes
                });
              } else {
                hours.push({
                  name: j,
                  type: 1,
                  sub: fullMinutes
                });
              }
            }
            if (isStepNight) {
              dates.push({
                name: '明天',
                type: 0,
                sub: hours
              }, {
                name: '后天',
                type: 0,
                sub: fullHours
              });
            } else {
              dates.push({
                name: '明天',
                type: 0,
                sub: hours
              }, {
                name: '后天',
                type: 0,
                sub: fullHours
              }, {
                name: thirdDayStr,
                type: 0,
                sub: fullHours
              });
            }
            break;
          case 2:
            let thirdDay1 = jlDate.addDays(today, 3);
            let forthDay = jlDate.addDays(today, 4);
            let thirdDayStr1 = jlDate.getMonthDayStr(thirdDay1);
            let forthDayStr = jlDate.getMonthDayStr(forthDay);
            for (let i = targetMinute; i <= 45; i += 15) {
              let j = i < 10 ? ('0' + i) : i;
              minutes.push({
                name: j,
                type: 2
              });
            }
            for (let i = targetHour; i <= 23; i++) {
              let j = i < 10 ? ('0' + i) : i; // 不足10，补零
              if (i === targetHour) {
                hours.push({
                  name: j,
                  type: 1,
                  sub: minutes
                });
              } else {
                hours.push({
                  name: j,
                  type: 1,
                  sub: fullMinutes
                });
              }
            }
            if (isStepNight) { // 跨夜
              dates.push({
                name: '后天',
                type: 0,
                sub: hours
              }, {
                name: thirdDayStr1,
                type: 0,
                sub: fullHours
              });
            } else { // 未跨夜
              dates.push({
                name: '后天',
                type: 0,
                sub: hours
              }, {
                name: thirdDayStr1,
                type: 0,
                sub: fullHours
              }, {
                name: forthDayStr,
                type: 0,
                sub: fullHours
              });
            }
            break;
          case 3: // 入场时间为后天且跨夜
            let thirdDay2 = jlDate.addDays(today, 3);
            let forthDay2 = jlDate.addDays(today, 4);
            let thirdDayStr2 = jlDate.getMonthDayStr(thirdDay2);
            let forthDayStr2 = jlDate.getMonthDayStr(forthDay2);
            for (let i = targetMinute; i <= 45; i += 15) {
              let j = i < 10 ? ('0' + i) : i;
              minutes.push({
                name: j,
                type: 2
              });
            }
            for (let i = targetHour; i <= 23; i++) {
              let j = i < 10 ? ('0' + i) : i; // 不足10，补零
              if (i === targetHour) {
                hours.push({
                  name: j,
                  type: 1,
                  sub: minutes
                });
              } else {
                hours.push({
                  name: j,
                  type: 1,
                  sub: fullMinutes
                });
              }
            }
            dates.push({
              name: thirdDayStr2,
              type: 0,
              sub: hours
            }, {
              name: forthDayStr2,
              type: 0,
              sub: fullHours
            });
            break;
        }
        return dates;
      },
      // 获取出场时间二维数组
      getOutTimeList: function () {
        if (this.postInTime) {
          // safari 无法解析'-'格式字符串
          let inTime = new Date(this.postInTime.replace(/-/g, '/'));
          let minute = inTime.getMinutes();
          let mod = minute % 15;
          let divide = Math.floor(minute / 15);
          if (!this.postOutTime) { // 表示首次弹出出场时间选择框
            this.outTimeSelectIndex = [0, 1, 0];
            if (mod !== 0) { // 当选择为现在时,有可能不是15的倍数
              let fullYear = inTime.getFullYear();
              let month = inTime.getMonth() + 1;
              let date = inTime.getDate();
              let hour = inTime.getHours();
              let minuteStr = '00';
              switch (divide) {
                case 0:
                  minuteStr = '15';
                  inTime = new Date(fullYear + '/' + month + '/' + date + ' ' + hour + ':' + minuteStr);
                  this.outTimeSelectIndex = [0, 1, 1];
                  break;
                case 1:
                  minuteStr = '30';
                  inTime = new Date(fullYear + '/' + month + '/' + date + ' ' + hour + ':' + minuteStr);
                  this.outTimeSelectIndex = [0, 1, 2];
                  break;
                case 2:
                  minuteStr = '45';
                  inTime = new Date(fullYear + '/' + month + '/' + date + ' ' + hour + ':' + minuteStr);
                  this.outTimeSelectIndex = [0, 1, 3];
                  break;
                case 3:
                  minuteStr = '00';
                  inTime = jlDate.addHours(inTime, 1);
                  fullYear = inTime.getFullYear();
                  month = inTime.getMonth() + 1;
                  hour = inTime.getHours();
                  inTime = new Date(fullYear + '/' + month + '/' + date + ' ' + hour + ':' + minuteStr);
                  break;
              }
            } else {
              switch (divide) {
                case 0:
                  break;
                case 1:
                  this.outTimeSelectIndex = [0, 1, 1];
                  break;
                case 2:
                  this.outTimeSelectIndex = [0, 1, 2];
                  break;
                case 3:
                  this.outTimeSelectIndex = [0, 1, 3];
                  break;
              }
            }
          } else { // 如果选择过出场时间,则不改变出场时间index
            if (mod !== 0) { // 当选择为现在时,有可能不是15的倍数
              let fullYear = inTime.getFullYear();
              let month = inTime.getMonth() + 1;
              let date = inTime.getDate();
              let hour = inTime.getHours();
              let minuteStr = '00';
              switch (divide) {
                case 0:
                  minuteStr = '15';
                  inTime = new Date(fullYear + '/' + month + '/' + date + ' ' + hour + ':' + minuteStr);
                  break;
                case 1:
                  minuteStr = '30';
                  inTime = new Date(fullYear + '/' + month + '/' + date + ' ' + hour + ':' + minuteStr);
                  break;
                case 2:
                  minuteStr = '45';
                  inTime = new Date(fullYear + '/' + month + '/' + date + ' ' + hour + ':' + minuteStr);
                  break;
                case 3:
                  minuteStr = '00';
                  inTime = jlDate.addHours(inTime, 1);
                  fullYear = inTime.getFullYear();
                  month = inTime.getMonth() + 1;
                  hour = inTime.getHours();
                  inTime = new Date(fullYear + '/' + month + '/' + date + ' ' + hour + ':' + minuteStr);
                  break;
              }
            }
          }
          if (inTime !== 'Invalid Date') {
            // 获取入场时间1小时后的时间
            let targetOutTime = jlDate.addHours(inTime, 1);
            return this.getOutTimeArrs(targetOutTime);
          }
        }
      },
      // 创建出场时间选择器
      createOutTimePicker: function (list, options) {
        let first = [];
        let second = [];
        let third = [];
        let selectedIndex = this.outTimeSelectIndex; // 默认选中的时间
        let checked = this.outTimeSelectIndex; // 已选选项
        // 校正默认选中时间序号
        if (!this.postOutTime) { // 首次设置出场时间需要给出出场时间的默认索引
          if (list[0].name === '今天') {
            if ((list[0].sub.length - 1) < selectedIndex[1]) { // 今天只剩一个23时了,离场时间只能顺延到第二天
              selectedIndex = [1, 0, selectedIndex[2]];
              checked = [1, 0, selectedIndex[2]];
              this.outTimeSelectIndex = [1, 0, selectedIndex[2]];
            }
          }
        }
        this.createList(list, first);
        if (list[selectedIndex[0]].hasOwnProperty('sub')) {
          this.createList(list[selectedIndex[0]].sub, second);
        } else {
          second = [{text: '', value: 0}];
        }
        if (list[selectedIndex[0]].sub[selectedIndex[1]].hasOwnProperty('sub')) {
          this.createList(list[selectedIndex[0]].sub[selectedIndex[1]].sub, third);
        } else {
          third = [{text: '', value: 0}];
        }
        let picker = new Picker({
          data: [first, second, third],
          selectedIndex: selectedIndex,
          cancelText: options.cancelText,
          okText: options.okText,
          footerText: options.footerText,
          title: options.title
        });
        var _this_ = this;
        picker.on('picker.select', function (selectedVal, selectedIndex) {
          let text1 = first[selectedIndex[0]].text;
          let text2 = second[selectedIndex[1]].text;
          let text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';
          _this_.outTimeStr = text1 + ' ' + text2 + ':' + text3;
          _this_.outTimeArr = [text1, text2, text3];
        });
        picker.on('picker.change', function (index, selectedIndex) {
          if (index === 0) {
            firstChange();
          } else if (index === 1) {
            secondChange();
          }
          function firstChange () {
            second = [];
            third = [];
            checked[0] = selectedIndex;
            let firstDate = list[selectedIndex];
            if (firstDate.hasOwnProperty('sub')) {
              _this_.createList(firstDate.sub, second);

              var secondHour = list[selectedIndex].sub[0]
              if (secondHour.hasOwnProperty('sub')) {
                _this_.createList(secondHour.sub, third);
              } else {
                third = [{text: '', value: 0}];
                checked[2] = 0;
              }
            } else {
              second = [{text: '', value: 0}];
              third = [{text: '', value: 0}];
              checked[1] = 0;
              checked[2] = 0;
            }

            picker.refillColumn(1, second);
            picker.refillColumn(2, third);
            picker.scrollColumn(1, 0)
            picker.scrollColumn(2, 0)
          }

          function secondChange () {
            third = [];
            checked[1] = selectedIndex;
            var firstIndex = checked[0];
            if (list[firstIndex].sub[selectedIndex].hasOwnProperty('sub')) {
              let secondHour = list[firstIndex].sub[selectedIndex];
              _this_.createList(secondHour.sub, third);
              picker.refillColumn(2, third);
              picker.scrollColumn(2, 0)
            } else {
              third = [{text: '', value: 0}];
              checked[2] = 0;
              picker.refillColumn(2, third);
              picker.scrollColumn(2, 0)
            }
          }
        });
        this.outTimePicker = picker;
      },
      showOutTimePicker: function () {
        if (this.outTimePickerDisable) { // 表示某次点击还未结束
          return;
        }
        this.outTimePickerDisable = true;
        if (!this.inTimeStr) { // 未选择入场时间
          Toast('请先选择入场时间');
          this.outTimePickerDisable = false;
          return;
        }
        try {
          this.outTimeList = this.getOutTimeList();
          let options = {
            title: '预计出场时间',
            cancelText: '取消',
            okText: '完成'
          }
          this.createOutTimePicker(this.outTimeList, options);
          this.outTimePicker.show();
          this.outTimePickerDisable = false;
        } catch (err) {
          this.outTimePickerDisable = false;
        }
      },
      // 校验车牌完整性
      checkCarId: function () {
        if (!this.carId) {
          Toast('请选择车牌');
          return false;
        }
        return true;
      },
      // 校验出入场时间合法性
      checkPostTime: function () {
        if (!this.postInTime) {
          Toast('请选择入场时间');
          return false;
        }
        if (!this.postOutTime) {
          Toast('请选择预计出场时间');
          return false;
        }
        let inTime = new Date(this.postInTime.replace(/-/g, '/'));
        let outTime = new Date(this.postOutTime.replace(/-/g, '/'));
        let intervalHours = jlDate.getHoursInterval(inTime, outTime);
        if (intervalHours < 1) {
          Toast('入场时间需早于出场时间1小时');
          return false;
        }
        return true;
      },
      saveParkOrder: function () {
        let _this_ = this;
        this.disabled = true; // 防止重复提交
        let currentTime = new Date(); // 提交停车订单的当前时间
        let intervalMinutes = jlDate.getMinutesInterval(this.enterTime, currentTime);
        if (intervalMinutes >= window.commonConfig.homePageStayLast) { // homePageStayLast:停留在我要停车页面时长(分)
          Toast('停留久了点，将为您刷新');
          setTimeout(function () {
            let url = window.location.href;
            if (url.indexOf('token') !== -1) {
              window.location.reload();
            } else {
              url += ('?token=' + window.token);
              window.location.href = url; // 刷新页面(保留token)
              window.location.reload();
            }
          }, 2000);
          return;
        }
        // 校验参数合法性
        if (!this.checkCarId() || !this.checkPostTime()) {
          setTimeout(function () {
            _this_.disabled = false; // 恢复按钮的可用
          }, 2000);
          return false;
        }
        // 提交停车订单给后台
        let live = 0;
        if (this.isParkNow) { // 即时停车
          live = 1;
        }
        let postData = new FormData();
        postData.append('carId', this.carId);
        postData.append('beginTime', this.postInTime);
        postData.append('endTime', this.postOutTime);
        postData.append('live', live);
        postData.append('forcedCloseVisitor', this.visitorModal.forcedCloseVisitor);
        // 显示停车动效
        this.searchingParking = true;
        this.$JHttp.post(window.homeURL + '/sharedPark/order', postData).then((res) => {
          _this_.searchingParking = false;
          if (res.data.status === 100) {
            let data = res.data.data;
            let result = data.result;
            if (result === 0) { // 下单成功
              Toast('预约成功');
              router.push('/home/records');
            } else if (result === 1) {
              Toast('服务器忙,请稍后再试');
            } else if (result === 2) {
              Toast('您最多只可预约3个车位');
              router.replace('/home/records');
            } else if (result === 7) {
              Toast('您还有待支付的订单');
            } else if (result === 4) { // 有未完成的访客记录
              this.visitorModal.forcedCloseVisitor = 0;
              _this_.visitorModal.isShow = true;
            } else if (result === 6) { // 不能匹配到车位
              Toast('车位被抢走啦，请重新选择');
            } else if (result === 3) { // 该车辆还有待支付的订单
              Toast('该车牌已预约车位，订单结束后才能再约哦。');
            } else if (result === 5) {
              // 获取推荐车位列表
              let recommendParkingList = data.recommendSpaces;
              if (recommendParkingList && recommendParkingList.length) { // 具有推荐车位
                recommendParkingList.forEach(function (item) {
                  let recommend = {
                    carId: _this_.carId,
                    parkingId: item.id,
                    parkingNO: item.name,
                    live: live,
                    inTime: _this_.postInTime,
                    deadTime: item.shareEndTime,
                    deadTimeStr: jlDate.getChineseTime(new Date(item.shareEndTime.replace(/-/g, '/')))
                  };
                  _this_.recommendList.push(recommend);
                });
                // 跳转到推荐车位页面
                router.push({
                  name: 'recommendList',
                  params: {
                    recommendList: this.recommendList,
                    isParkNow: this.isParkNow
                  }
                });
              }
            }
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
          _this_.disabled = false;
        }).catch(function (response) {
          // 调用接口出错
          this.searchingParking = false;
          Toast(window.commonConfig.commonError);
          _this_.disabled = false;
        });
      },
      // 保留访客通行,取消共享订单
      cancelOrder: function () {
        this.visitorModal.forcedCloseVisitor = 0;
        this.visitorModal.isShow = false;
      },
      // 强制提交订单,取消访客通行
      continueSaveOrder: function () {
        this.visitorModal.forcedCloseVisitor = 1;
        this.saveParkOrder();
        this.visitorModal.isShow = false;
      }
    },
    components: {
      'j-button': JButton
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .park-wrapper {
    position: absolute;
    height: 100%;
    width: 100%;
    .content-wrapper {
      height: 100%;
      width: 100%;
      .carNO-wrapper {
        display: flex;
        align-items: center;
        height: 1.546667rem;
        background-image: url('../../assets/img/@2x/carNO-bg.png');
        background-size: 100%;
        background-repeat: no-repeat;
        color: #fff;
        .left {
          flex: 0 0 2.0rem;
          text-align: left;
          margin-left: 0.4rem;
          font-size: 15px;
        }
        .right {
          flex: 1;
          text-align: right;
          margin-right: 0.4rem;
          font-size: 20px;
          .value {
            margin-right: 0.266667rem;
            line-height: 1.546667rem;
            vertical-align: middle;
          }
          .icon {
            display: inline-block;
            vertical-align: middle;
            width: 0.213333rem;
            height: 0.426667rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url("../../assets/img/@2x/white-icon-right.png");
          }
        }
      }
      .inTime-wrapper {
        color: #333;
        .top {
          display: flex;
          margin: 0.613333rem 0.4rem 0.266667rem 0.4rem;
          .left {
            flex: 0 0 3.2rem;
            text-align: left;
            font-size: 14px;
          }
          .right {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            font-size: 12px;
            .title {
              margin-right: 0.213333rem;
            }
            .value {
              margin-right: 0.213333rem;
            }
            .icon {
              display: inline-block;
              vertical-align: middle;
              width: 0.32rem;
              height: 0.32rem;
              background-image: url('../../assets/img/@2x/icon-info.png');
              background-size: 100%;
              background-repeat: no-repeat;
            }
          }
        }
        .bottom {
          position: relative;
          height: 1.413333rem;
          background-color: #fff;
          .middle {
            color: #333;
            height: 100%;
            line-height: 1.413333rem;
            font-size: 24px;
            .placeholder {
              color: #aaa;
            }
            .value {
              color: #333;
            }
          }
          .icon {
            position: absolute;
            right: 0.4rem;
            top: 50%;
            margin-top: -0.213333rem;
            display: inline-block;
            vertical-align: middle;
            width: 0.213333rem;
            height: 0.426667rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url("../../assets/img/@2x/gray-icon-right.png");
          }
        }
      }
      .outTime-wrapper {
        color: #333;
        .top {
          margin: 0.613333rem 0 0.266667rem 0.4rem;
          text-align: left;
          font-size: 14px;
        }
        .bottom {
          position: relative;
          height: 1.413333rem;
          background-color: #fff;
          .middle {
            color: #333;
            height: 100%;
            line-height: 1.413333rem;
            font-size: 24px;
            .placeholder {
              color: #aaa;
            }
          }
          .icon {
            position: absolute;
            right: 0.4rem;
            top: 50%;
            margin-top: -0.213333rem;
            display: inline-block;
            vertical-align: middle;
            width: 0.213333rem;
            height: 0.426667rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url("../../assets/img/@2x/gray-icon-right.png");
          }
        }
      }
      .remark-wrapper {
        margin: 0.4rem 0.4rem 0 0.4rem;
        color: #aaa;
        font-size: 14px;
        text-align: left;
      }
      .fee-wrapper {
        margin: 1.52rem 0 0.4rem 0;
        color: #18adfb;
        font-size: 15px;
        .fee-remark {
          font-size: 12px;
          color: #aaa;
        }
      }
      .save-wrapper {
        margin: 0 0.4rem;
        height: 1.12rem;
      }
      .float-box-wrapper {
        position: absolute;
        right: 0.4rem;
        bottom: 0.4rem;
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
      .visitor-wrapper {
        .visitor-info {
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
    .searching-parking {
      position: absolute;
      top: 0;
      left: 50%;
      margin-top: 4.96rem;
      margin-left: -1.8rem;
      .icon {
        display: block;
        width: 3.6rem;
        height: 2.4rem;
        background-size: 100%;
        background-image: url("../../assets/img/@2x/searchingParking.gif");
        margin-bottom: 0.133333rem;
      }
      .text {
        font-size: 12px;
        line-height: 12px;
        color: #333;
        margin: 0 auto;
      }
    }
  }

  [data-dpr="2"]
  .park-wrapper {
    .content-wrapper {
      .carNO-wrapper {
        .left {
          font-size: 30px;
        }
        .right {
          font-size: 42px;
        }
      }
      .inTime-wrapper {
        .top {
          .left {
            font-size: 30px;
          }
          .right {
            font-size: 24px;
          }
        }
        .bottom {
          .middle {
            font-size: 42px;
          }
        }
      }
      .outTime-wrapper {
        .top {
          font-size: 30px;
        }
        .bottom {
          .middle {
            font-size: 42px;
          }
        }
      }
      .remark-wrapper {
        font-size: 24px;
      }
      .fee-wrapper {
        font-size: 30px;
        .fee-remark {
          font-size: 24px;
        }
      }
      .float-box-wrapper {
        min-width: 3.84rem;
        font-size: 24px;
      }
      .visitor-wrapper {
        .visitor-info {
          font-size: 30px;
        }
        .operate-wrapper {
          .text {
            font-size: 34px;
          }
        }
      }
    }
    .searching-parking {
      .text {
        font-size: 24px;
        line-height: 24px;
      }
    }
  }

  [data-dpr="3"]
  .park-wrapper {
    .content-wrapper {
      .carNO-wrapper {
        background-image: url('../../assets/img/@3x/carNO-bg@3x.png');
        .left {
          font-size: 44px;
        }
        .right {
          font-size: 60px;
          .icon {
            background-image: url("../../assets/img/@3x/white-icon-right@3x.png");
          }
        }
      }
      .inTime-wrapper {
        .top {
          .left {
            font-size: 54px;
          }
          .right {
            font-size: 42px;
            .icon {
              background-image: url("../../assets/img/@3x/icon-info@3x.png");
            }
          }
        }
        .bottom {
          .middle {
            font-size: 64px;
          }
          .icon {
            background-image: url("../../assets/img/@3x/gray-icon-right@3x.png");
          }
        }
      }
      .outTime-wrapper {
        .top {
          font-size: 54px;
        }
        .bottom {
          .middle {
            font-size: 64px;
          }
          .icon {
            background-image: url("../../assets/img/@3x/gray-icon-right@3x.png");
          }
        }
      }
      .remark-wrapper {
        font-size: 36px;
      }
      .fee-wrapper {
        font-size: 44px;
        .fee-remark {
          font-size: 42px;
        }
      }
      .float-box-wrapper {
        min-width: 3.84rem;
        font-size: 36px;
      }
      .waiting2pay-wrapper {
        .title {
          font-size: 54px;
          line-height: 54px;
        }
        .total-money {
          font-size: 158px;
          line-height: 158px;
        }
        .list-wrapper {
          .order-item {
            .left, .right {
              font-size: 42px;
            }
          }
        }
      }
      .visitor-wrapper {
        .visitor-info {
          font-size: 54px;
        }
        .operate-wrapper {
          .text {
            font-size: 60px;
          }
        }
      }
    }
    .searching-parking {
      .icon {
        background-image: url("../../assets/img/@3x/searchingParking@3x.gif");
      }
      .text {
        font-size: 42px;
        line-height: 42px;
      }
    }
  }
</style>
