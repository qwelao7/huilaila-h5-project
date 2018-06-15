import Vue from 'vue';
import App from './App';
import store from './vuex/store'
import router from './router';
// import api from '@/fetch/api'
import Axios from 'axios';
import {ToastPlugin, WechatPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin, ConfigPlugin, DatetimePlugin} from 'vux';
import {JAjax, JURL, jlDate} from 'common/js/utils';
import VueClipboard from 'vue-clipboard2';
import './common/js/map'
// import Vconsole from 'vconsole';
 /* eslint-disable no-new */
// new Vconsole();

Vue.config.productionTip = false;

/* eslint-disable no-unused-vars */
// import vConsole from 'vConsole'

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
  let isOut = JURL.getHashParam('out') || JURL.getSearchParam('out');
  // 外部链接,无需进入小区选择页
  if (isOut === '1') {
    localStorage.setItem('out_flag', '1');
    next();
    return;
  } else {
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
// 注入code到localStorage
let code = JURL.getSearchParam('code') || JURL.getHashParam('code');
if (code) {
  localStorage.setItem('code', code);
}
function initialAxios () {
  let header = JAjax.getHeader();
  // 将头做成公共配置
  let jAxios = Axios.create(header);

  /* 首次进入公众号更新token */
  let token_ = localStorage.getItem('token');
  let state = JURL.getSearchParam('state') || JURL.getHashParam('state');
  if (state === '123') {
    updateTokenByCode(jAxios, code)
  }
  /* 首次进入公众号更新token */
// 生成公共参数
// let commonParam = JAjax.generateCommonParam();
// http请求拦截器
  jAxios.interceptors.request.use(config => {
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
    // console.log(99999, res)
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
        localStorage.setItem('userId', data.userInfo.id);
        window.location.reload();
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

initialAxios();
export {
  initialAxios
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
