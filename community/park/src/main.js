// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex';
import Axios from 'axios';
import {JAjax} from './common/utils';
window.homeURL = window.commonConfig.homeURL; // 接口前缀
window.uploadURL = window.commonConfig.uploadURL; // 上传接口前缀
import { Loading, AjaxPlugin, XButton, XInput, Group, XDialog, Scroller } from 'vux';
Vue.use(Vuex);
Vue.use(AjaxPlugin);
Vue.component('loading', Loading);
Vue.component('x-button', XButton);
Vue.component('x-input', XInput);
Vue.component('Group', Group);
Vue.component('x-dialog', XDialog);
Vue.component('x-scroller', Scroller);
Vue.config.productionTip = false
const FastClick = require('fastclick');
// 移除移动端点击延迟
FastClick.attach(document.body);
/* 页面切换的loading状态begin */
const store = new Vuex.Store({}) // vuex包含的模块

store.registerModule('pageLoading', { // page-loading模块,保存页面切换的加载状态
  state: {
    isLoading: false
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    }
  }
})
store.registerModule('pageCfg', { // page-loading模块,保存页面切换的加载状态
  state: {
    province: '',
    city: '',
    tabStatus: [true, false, false], // 底部tab状态
    rent: 0.00, // 园区车位租金
    maxMoney: 0.00, // 封顶价
    rentUnit: '元/时', // 园区车位租金单位
    communityName: '', // 园区名称
    propertyPhone: '15505951676', // 物业电话
    shareProtocol: '', // 共享协议
    ruleDescription: '', // 计费规则描述
    instructionPic: '', // 车位平面图
    freeLast: '15分钟', // 可免费取消订单时长,eg:15分钟
    aheadIn: '15分钟', // 可提前多长时间进场,eg:15分钟
    holdLast: '1小时', // 车位保留多长时间,eg:1小时
    selectedIntimeIndex: [], // 入场时间索引,
    ownerReceiveRate: '60%', // 业主收入分成
    propertyReceiveRate: '20%', // 物业收入分成
    industryCommitteeReceiveRate: '10%', // 业委会收入分成
    platformReceiveRate: '10%', // 平台收入分成
    orderDialog: {}, // 待支付订单实体
    blockBuilding: {}, // 苑幢列表选中的苑和幢
    selectedParking: {},
    ownerParkingList: [], // 业主已有车位号
    currentShareId: '',
    currentOrderId: '',
    sharingRepeat: '', // 共享时段的重复天数
    sharingTime: {}, // 共享时段的起止时间
    sharingTimeIndexs: [], // 共享时段选择的起止时间索引
    uploadedParkingPics: {
      pics: [], // 文件数组
      previewPics: []
    }, // 车位证明图片
    uploadedIdPics: {
      pics: [], // 文件数组
      previewPics: []
    }, // 身份证明图片
    protocolChecked: false
  },
  mutations: {
    updateProvince (state, pageCfg) {
      state.province = pageCfg.province;
    },
    updateCity (state, pageCfg) {
      state.city = pageCfg.city;
    },
    updateTabStatus (state, pageCfg) {
      state.tabStatus = pageCfg.tabStatus;
    },
    updateRent (state, pageCfg) {
      state.rent = pageCfg.rent;
    },
    updateMaxMoney (state, pageCfg) {
      state.maxMoney = pageCfg.maxMoney;
    },
    updateRentUnit (state, pageCfg) {
      state.rentUnit = pageCfg.rentUnit;
    },
    updateCommunityName (state, pageCfg) {
      state.communityName = pageCfg.communityName;
    },
    updatePropertyPhone (state, pageCfg) {
      state.propertyPhone = pageCfg.propertyPhone;
    },
    updateShareProtocol (state, pageCfg) {
      state.shareProtocol = pageCfg.shareProtocol;
    },
    updateRuleDescription (state, pageCfg) {
      state.ruleDescription = pageCfg.ruleDescription;
    },
    updateInstructionPic (state, pageCfg) {
      state.instructionPic = pageCfg.instructionPic;
    },
    updateFreeLast (state, pageCfg) {
      state.freeLast = pageCfg.freeLast;
    },
    updateAheadIn (state, pageCfg) {
      state.aheadIn = pageCfg.aheadIn;
    },
    updateHoldLast (state, pageCfg) {
      state.holdLast = pageCfg.holdLast;
    },
    updateOwnerReceiveRate (state, pageCfg) {
      state.ownerReceiveRate = pageCfg.ownerReceiveRate;
    },
    updatePropertyReceiveRate (state, pageCfg) {
      state.propertyReceiveRate = pageCfg.propertyReceiveRate;
    },
    updateIndustryCommitteeReceiveRate (state, pageCfg) {
      state.industryCommitteeReceiveRate = pageCfg.industryCommitteeReceiveRate;
    },
    updatePlatformReceiveRate (state, pageCfg) {
      state.platformReceiveRate = pageCfg.platformReceiveRate;
    },
    updateOrderDialog (state, pageCfg) {
      state.orderDialog = pageCfg.orderDialog;
    },
    updateBlockBuilding (state, pageCfg) {
      state.blockBuilding = pageCfg.blockBuilding;
    },
    updateSelectedParking (state, pageCfg) {
      state.selectedParking = pageCfg.selectedParking;
    },
    updateOwnerParkingList (state, pageCfg) {
      state.ownerParkingList = pageCfg.ownerParkingList;
    },
    updateCurrentShareId (state, pageCfg) {
      state.currentShareId = pageCfg.currentShareId;
    },
    // 当前查看的订单
    updateCurrentOrderId (state, pageCfg) {
      state.currentOrderId = pageCfg.currentOrderId;
    },
    updateSharingRepeat (state, pageCfg) {
      state.sharingRepeat = pageCfg.sharingRepeat;
    },
    updateSharingTime (state, pageCfg) {
      state.sharingTime = pageCfg.sharingTime;
    },
    updateSharingTimeIndexs (state, pageCfg) {
      state.sharingTimeIndexs = pageCfg.sharingTimeIndexs;
    },
    updateUploadedParkingPics (state, pageCfg) {
      if (pageCfg.uploadedParkingPics.pics) {
        state.uploadedParkingPics.pics = pageCfg.uploadedParkingPics.pics;
      }
      if (pageCfg.uploadedParkingPics.previewPics) {
        state.uploadedParkingPics.previewPics = pageCfg.uploadedParkingPics.previewPics;
      }
    },
    updateUploadedIdPics (state, pageCfg) {
      if (pageCfg.uploadedIdPics.pics) {
        state.uploadedIdPics.pics = pageCfg.uploadedIdPics.pics;
      }
      if (pageCfg.uploadedIdPics.previewPics) {
        state.uploadedIdPics.previewPics = pageCfg.uploadedIdPics.previewPics;
      }
    },
    updateProtocolChecked (state, pageCfg) {
      state.protocolChecked = pageCfg.protocolChecked;
    }
  }
})

Vue.use(Axios);
// 将头做成公共配置
let jAxios = Axios.create(JAjax.getHeader());
Vue.prototype.$JHttp = jAxios;
// 修改路由,改变loading状态
/* router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true});
  next();
});
router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {isLoading: false});
}); */
/* 页面切换的loading状态end */
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
