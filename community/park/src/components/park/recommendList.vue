<template>
  <div class="recommend-wrapper">
    <div class="content-wrapper" v-show="!searchingParking">
      <placeholder v-if="!list.length"></placeholder>
      <div v-if="list.length" class="recommend-title vux-1px-b">
        我们为您推荐了以下车位:
      </div>
      <ul v-if="list.length" class="recommend-list">
        <li class="recommend-item vux-1px-b" :class="{selected: recommend.isSelected}" v-for="recommend in list"
            @click="selectParking(recommend)">
          <div class="left" v-text="recommend.parkingNO"></div>
          <div class="right">
            <div class="top">可停至</div>
            <div class="bottom" v-text="recommend.deadTimeStr"></div>
          </div>
        </li>
      </ul>
      <div v-if="list.length" class="recommend-footer">
        <div class="parking-wrapper">
          <div class="parking-info">
            <span class="title">车位号:</span>
            <span class="value" v-text="parkingNO"></span>
          </div>
          <div class="fees">
            <span class="title">预计费用:</span>
            <span class="value" v-text="calculateRent"></span>
          </div>
          <div class="remark" v-text="remark"></div>
        </div>
        <div class="save-btn" @click="saveOrder">
          <j-button type="primary" jText="确认提交" :disabled="saveOrderDisabled"></j-button>
        </div>
      </div>
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
  </div>
</template>

<script>
  import router from '../../router';
  import {mapState} from 'vuex';
  import {jlDate} from '../../common/utils';
  import Toast from 'components/utils/toast/toast';
  import JButton from 'components/utils/jbutton';
  import placeholder from 'components/home/empty';
  export default {
    name: 'recommendList',
    created: function () {
      // 通过路由参数,拿到系统推荐的车位列表
      this.initList();
    },
    data () {
      return {
        saveOrderDisabled: false,
        searchingParking: false,
        isParkNow: false,
        list: [],
        currentParking: {},
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
        }
      }
    },
    computed: {
      ...mapState({
        rent: state => state.pageCfg.rent,
        freeLast: state => state.pageCfg.freeLast,
        aheadIn: state => state.pageCfg.aheadIn,
        holdLast: state => state.pageCfg.holdLast
      }),
      parkingNO: function () {
        return this.currentParking.parkingNO;
      },
      remark: function (state) {
        return '注：计费将从预约的入场时间开始，您可提前' + this.aheadIn + '入场。车位将为您保留' + this.holdLast +
          '，若您未在' + this.holdLast + '内进入，则将收取' + this.holdLast + '停车费用。'
      },
      calculateRent: function () {
        let inTime = new Date(this.currentParking.inTime.replace(/-/g, '/'));
        let chargeBegin = inTime;
        if (this.isParkNow) { // 即时停车,计费时间=预计入场时间+免费时长
          let freeLast = this.freeLast;
          let value = freeLast.replace(/[^0-9]/ig, '');
          chargeBegin = jlDate.addMinutes(inTime, value);
        }
        let outTime = new Date(this.currentParking.deadTime.replace(/-/g, '/'));
        // 进出场时间非法
        if ('Invalid Date' == inTime || 'Invalid Date' == outTime || inTime >= outTime) { // eslint-disable-line
          return window.commonConfig.RMBSymbol + '0.00';
        } else {
          // 计算预计停车费用
          let milliSeconds = (outTime - chargeBegin); // 停车持续的毫秒值
          let totalHours = Math.ceil(milliSeconds / 3600000); // 1000 * 60 * 60,向上取整
          let rent = this.$store.state.pageCfg.rent;
          let money = totalHours * rent; // 总金额
          let maxMoney = this.$store.state.pageCfg.maxMoney;
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
    },
    methods: {
      initList: function () {
        // 停车类型
        this.isParkNow = this.$route.params.isParkNow;
        this.list = this.$route.params.recommendList;
        if (this.list && this.list.length) {
          this.$set(this.list[0], 'isSelected', true);
          this.currentParking = this.list[0];
        }
      },
      selectParking: function (recommend) {
        let parkingId = recommend.parkingId;
        var _this_ = this;
        this.list.forEach(function (recommend) {
          // 切换选中项的背景颜色
          if (recommend.parkingId === parkingId) {
            _this_.$set(recommend, 'isSelected', true);
          } else {
            _this_.$set(recommend, 'isSelected', false);
          }
        });
        this.currentParking = recommend;
      },
      saveOrder: function () {
        this.saveOrderDisabled = true; // 防止重复提交
        let postData = new FormData();
        postData.append('carId', this.currentParking.carId);
        postData.append('spaceId', this.currentParking.parkingId);
        postData.append('beginTime', this.currentParking.inTime);
        postData.append('endTime', this.currentParking.deadTime);
        postData.append('live', this.currentParking.live);
        postData.append('forcedCloseVisitor', this.visitorModal.forcedCloseVisitor);
        let _this_ = this;
        // 显示停车动效
        this.searchingParking = true;
        this.$JHttp.post(window.homeURL + '/sharedPark/order', postData).then((res) => {
          _this_.searchingParking = false;
          if (res.data.status === 100) {
            let data = res.data.data;
            let result = data.result;
            if (result === 0) { // 下单成功
              Toast('预约成功');
              router.replace('/home/records');
            } else if (result === 1) {
              Toast('服务器忙,请稍后再试');
            } else if (result === 2) {
              Toast('您最多只可预约3个车位');
              router.replace('/home/records');
            } else if (result === 7) {
              Toast('您还有待支付的订单');
              router.replace('/home/park');
            } else if (result === 4) { // 有未完成的访客记录
              this.visitorModal.forcedCloseVisitor = 0;
              _this_.visitorModal.isShow = true;
            } else if (result === 6) { // 不能匹配到车位
              Toast('车位被抢走啦，请重新选择');
              router.replace('/home/park');
            } else if (result === 3) { // 该车辆还有待支付的订单
              Toast('该车牌已预约车位，订单结束后才能再约哦。');
              router.replace('/home/park');
            } else if (result === 5) { // 再次推荐,不作处理
              Toast('推荐失败了。');
              router.replace('/home/park');
            } else {
              Toast(window.commonConfig.commonError);
            }
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
          _this_.saveOrderDisabled = false;
        }).catch(function (response) {
          // 调用接口出错
          _this_.searchingParking = false;
          Toast(window.commonConfig.commonError);
          _this_.saveOrderDisabled = false;
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
        this.saveOrder();
        this.visitorModal.isShow = false;
      }
    },
    components: {
      'j-button': JButton,
      'placeholder': placeholder
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .recommend-wrapper {
    color: #333;
    height: 100%;
    .content-wrapper {
      width: 100%;
      height: 100%;
      .recommend-title {
        background-color: #fff;
        font-size: 14px;
        color: #18adfb;
        text-align: left;
        height: 1.36rem;
        line-height: 1.36rem;
        padding-left: 0.4rem;
      }
      .recommend-list {
        .recommend-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #fff;
          height: 2.48rem;
          padding: 0 0.4rem;
          .left {
            font-size: 16px;
            text-align: left;
          }
          .right {
            min-width: 2.346667rem;
            padding-left: 0.64rem;
            .top {
              font-size: 14px;
              line-height: 14px;
              text-align: right;
            }
            .bottom {
              font-size: 16px;
              line-height: 16px;
              margin-top: 0.186667rem;
            }
          }
        }
        .selected {
          background-color: #bde8ff;
        }
      }
      .recommend-footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        background-color: #fff;
        .parking-wrapper {
          padding: 0 0.4rem;
          text-align: left;
          .parking-info, .fees {
            font-size: 14px;
            display: flex;
            .title {
              flex: 0 0 2.4rem;
            }
            .value {
              flex: 1;
            }
          }
          .parking-info {
            margin-top: 0.586667rem;
            .value {
              font-size: 16px;
            }
          }
          .fees {
            color: #18adfb;
            margin-top: 0.4rem;
            margin-bottom: 0.613333rem;
          }
          .remark {
            font-size: 12px;
            margin-bottom: 0.4rem;
          }
        }
        .save-btn {
          width: 100%;
          height: 1.2rem;
        }
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
  .recommend-wrapper {
    .content-wrapper {
      .recommend-title {
        font-size: 30px;
      }
      .recommend-list {
        .recommend-item {
          .left {
            font-size: 36px;
          }
          .right {
            .top {
              font-size: 30px;
              line-height: 30px;
            }
            .bottom {
              font-size: 36px;
              line-height: 36px;
            }
          }
        }
      }
      .recommend-footer {
        .parking-wrapper {
          .parking-info, .fees {
            font-size: 30px;
          }
          .parking-info {
            .value {
              font-size: 36px;
            }
          }
          .remark {
            font-size: 24px;
          }
        }
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
  .recommend-wrapper {
    .content-wrapper {
      .recommend-title {
        font-size: 54px;
      }
      .recommend-list {
        .recommend-item {
          .left{
            font-size: 58px;
          }
          .right {
            .top {
              font-size: 50px;
              line-height: 50px;
            }
            .bottom {
              font-size: 58px;
              line-height: 58px;
            }
          }
        }
      }
      .recommend-footer {
        .parking-wrapper {
          .parking-info, .fees {
            font-size: 50px;
          }
          .parking-info {
            .value {
              font-size: 58px;
            }
          }
          .remark {
            font-size: 42px;
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
