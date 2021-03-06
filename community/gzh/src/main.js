import Vue from 'vue';
import App from './App';
import store from './vuex/store'
import router from './router';
// import api from '@/fetch/api'
import Axios from 'axios';
import qs from 'querystring';
import {ToastPlugin, WechatPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin, ConfigPlugin, DatetimePlugin} from 'vux';
import {JAjax, JURL, jlDate} from 'common/js/utils';
import VueClipboard from 'vue-clipboard2';
import './common/js/map';
import aliOSSUtils from './common/js/aliOSSUtils'
import './common/js/uuid'
import Vconsole from 'vconsole';
 /* eslint-disable no-new */
// new Vconsole();
Vue.prototype.$qs = qs;
Vue.config.productionTip = false;
/* eslint-disable no-unused-vars */

const FastClick = require('fastclick');
// 移除移动端点击延迟
FastClick.attach(document.body);

Vue.use(ToastPlugin);
Vue.use(WechatPlugin);
Vue.use(AlertPlugin);
Vue.use(ConfirmPlugin);
Vue.use(LoadingPlugin);
Vue.use(DatetimePlugin);
Vue.use(VueClipboard);
Vue.use(ConfigPlugin, {
  $layout: 'VIEW_BOX'
});

window.store = store;
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  document.title = to.meta.title || '回来啦'
  let isOut = JURL.getHashParam('out') || JURL.getSearchParam('out');
  // 外部链接,无需进入小区选择页
  if (isOut === '1') {
    localStorage.setItem('out_flag', '1');
    next();
    return;
  } else {
    let state = JURL.getHashParam('state') || JURL.getSearchParam('state');
    // 表示重新从菜单进入的,则移除外部标识
    if (state === '123') {
      localStorage.removeItem('out_flag');
    }
    let isOut = localStorage.getItem('out_flag');
    if (isOut === '1') {
      next();
      return;
    }
  }
  let toPath = to.path;
  if (toPath !== '/changeCommunity') {
    let communityId = localStorage.getItem('communityId');
    if (!communityId) {
      next('/changeCommunity');
    } else {
      next();
    }
  } else {
    next();
  }
});
// const store = new Vuex.Store({}); // vuex包含的模块

// store.registerModule('pageCfg', { // page-loading模块,保存页面切换的加载状态
//   state: {
//   },
//   mutations: {
//   }
// });
// Vue.use(Axios);
// Vue.prototype.$Axios = Axios
/* 注入app端的参数到本地 */
let tokenURL = JURL.getSearchParam('token') || JURL.getHashParam('token');
if (tokenURL) {
  localStorage.setItem('token', tokenURL);
}
let isApp = JURL.getSearchParam('isApp') || JURL.getHashParam('isApp');
if (isApp) {
  localStorage.setItem('isApp', isApp);
}
let communityId = JURL.getSearchParam('defCommunity') || JURL.getHashParam('defCommunity');
if (communityId) {
  localStorage.setItem('communityId', communityId);
}
let userId = JURL.getSearchParam('userId') || JURL.getHashParam('userId');
if (userId) {
  localStorage.setItem('userId', userId);
}
/* 注入app端的参数到本地 */
// 注入code到localStorage
let code = JURL.getSearchParam('code') || JURL.getHashParam('code');
if (code) {
  localStorage.setItem('code', code);
}
function initialAxios () {
  let header = JAjax.getHeader();
  // 将头做成公共配置
  Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  let jAxios = Axios.create(header);

  /* 首次进入公众号更新token */
  let state = JURL.getSearchParam('state') || JURL.getHashParam('state');
  if (state === '123' && window.isNeedUpdateToken) {
    updateTokenByCode(jAxios, code)
  }
  /* 首次进入公众号更新token */
// 生成公共参数
// let commonParam = JAjax.generateCommonParam();
// http请求拦截器
  jAxios.interceptors.request.use(config => {
    let url = config.url;
    // 老接口去除自定义头
    if (url.indexOf('!') !== -1) {
      const { headers } = config
      config.headers = {};
      config.headers['Content-Type'] = headers['Content-Type'];
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  });
  jAxios.interceptors.response.use(res => {
    if (res.status !== 200) {
      return Promise.reject(res)
    }
    let data = res.data;
    if (data.status === 106 && data.msg === '账户已过期,请重新登录!') {
      let openId = localStorage.getItem('openId');
      if (openId) {
        getUserInfoByOpenId(jAxios, openId);
      } else {
        let code = localStorage.getItem('code');
        if (code) {
          getUserInfoByCode(jAxios, code);
        } else {
          alert('请退出公众号,重新进入!');
        }
      }
    } else {
      return data;
    }
  }, error => {
    return error
  });
  Vue.prototype.$JHttp = jAxios;
}

function getUserInfoByOpenId (jAxios, openId) {
  jAxios({
    method: 'get',
    url: window.baseURL + '/openid/' + openId + '/info'
  }).then(res => {
    if (res.data.status === 100) {
      let data = res.data;
      let token = data.token;
      if (token) {
        localStorage.setItem('token', token);
        window.location.reload();
      } else {
        let openId = data.openidInfo.openid;
        localStorage.setItem('openId', openId);
      }
    } else {
      alert('休息会儿,稍后再试!');
    }
  }).catch(e => {
    console.error(e);
  })
}

function getUserInfoByCode (jAxios, code) {
  jAxios({
    method: 'get',
    url: window.baseURL + '/openid/info/code?code=' + code
  }).then(res => {
    if (res.data.status === 100) {
      let data = res.data;
      let subscribe = data.subscribe;
      let token = data.token;
      // 没有关注公众号
      if (subscribe === 0) {
        this.$vux.toast.show({
          type: 'cancel',
          text: '请先关注回来啦社区公众号!'
        })
        window.close();
        // this.$wechat.closeWindow()
        return;
      }
      if (token) {
        localStorage.setItem('token', token);
        window.location.reload();
      } else {
        let openId = data.openidInfo.openid;
        localStorage.setItem('openId', openId);
      }
    }
  }).catch(e => {
    console.error(e);
  })
}

function updateTokenByCode (jAxios, code) {
  jAxios({
    method: 'get',
    url: window.baseURL + '/openid/info/code?code=' + code
  }).then(res => {
    window.isNeedUpdateToken = false;
    if (res.data.status === 100) {
      let data = res.data.data;
      let subscribe = data.subscribe;
      let token = data.token;
      // 没有关注公众号
      if (subscribe === 0) {
        this.$vux.toast.show({
          type: 'cancel',
          text: '请先关注回来啦社区公众号!'
        })
        window.close();
        return;
      }
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
        localStorage.setItem('userId', data.userInfo.id);
        // 更新请求头
        initialAxios();
      } else {
        let openId = data.openidInfo.openid;
        localStorage.setItem('openId', openId);
        // 清空老的token
        localStorage.removeItem('token');
      }
    }
  }).catch(e => {
    console.error(e);
  })
}

window.isNeedUpdateToken = true;
initialAxios();
export {
  initialAxios
}

// 切换默认房产,更新当前停留小区
updateHeaderByCurrentAsset();

function updateHeaderByCurrentAsset () {
  Vue.prototype.$JHttp({
    method: 'get',
    url: window.baseURL + '/home/getUserInfoAndAsset'
  }).then(res => {
    if (res.status === 100) {
      let data = res.data;
      let ownerAsset = data.ownerAsset;
      // 有房产了,设置默认房产下的经纬度及areaCode作为头
      if (ownerAsset) {
        let longitude = ownerAsset.longitude;
        let latitude = ownerAsset.latitude;
        let areaCode = ownerAsset.areaCode;
        let communityId = ownerAsset.communityId;
        let communityName = ownerAsset.communityName;
        localStorage.setItem('communityId', communityId);
        localStorage.setItem('communityName', communityName);
        localStorage.setItem('longitude', longitude);
        localStorage.setItem('latitude', latitude);
        localStorage.setItem('areaCode', areaCode);
        initialAxios();
      }
    }
  }).catch(e => {
    console.error(e);
  })
}

// 调用老调口的方法
Vue.prototype.fetchFormData = function (url, params = {}, successCallback, errorCallback) {
  let payload = {
    defCommunityId: localStorage.getItem('communityId'),
    companyCode: window.commonConfig.companyCode,
    token: localStorage.getItem('token'),
    ...params
  }
  this.$JHttp({
    method: 'post',
    url: url,
    data: payload,
    transformRequest: [function (data) {
      let ret = '';
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(res => {
    if (res.status === '100') {
      if (typeof successCallback === 'function') successCallback(res.data);
    } else {
      this.$vux.toast.show({
        type: 'text',
        text: res.msg
      });
    }
  }).catch(e => {
    if (typeof errorCallback === 'function') errorCallback(e);
  })
}

// 全局代码共享
Vue.mixin({
  methods: {
    fitBGImg (objectKey, width, height, cb) {
      if (!objectKey) {
        return;
      }
      aliOSSUtils.fitImg(objectKey, function (res) {
        res = 'url(' + res + ')';
        cb(res);
      }, width, height);
    },
    fitImg (objectKey, width, height, cb) {
      if (!objectKey) {
        return;
      }
      aliOSSUtils.fitImg(objectKey, function (res) {
        cb(res);
      }, width, height);
    },
    uploadImg (files, path, cb, progressCB) {
      aliOSSUtils.uploadFile(files, path, cb, progressCB);
    },
    /**
     * 上传blob对象
     * @param blobs blobs数组
     * @param path 路径
     * @param cb 单个blob上传成功的回调
     * @param progressCB 单个blog上传的进度回调
     * @param finishCB 所有blob上传成功的回调
     */
    uploadBlob (blobs, path, cb, progressCB, finishCB) {
      aliOSSUtils.uploadBlob(blobs, path, cb, progressCB, finishCB);
    },
    uploadBlobProfile (blobs, path, cb, progressCB, finishCB) {
      aliOSSUtils.uploadBlobProfile(blobs, path, cb, progressCB, finishCB);
    },
    downloadStaticSource (key, fileName, cb) {
      aliOSSUtils.download(key, fileName, function (result) {
        cb(result);
      });
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
