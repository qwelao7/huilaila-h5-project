import Vue from 'vue';
import Axios from 'axios';
import App from './App.vue';
import { JAjax } from './common/utils';
// import Vconsole from 'vconsole';

let header = JAjax.getHeader();

Vue.prototype.$ajax = Axios;
// 将头做成公共配置
let jAxios = Axios.create(header);

// http请求拦截器
jAxios.interceptors.request.use(config => {
  if (config.method === 'post') {
    config.data = {
      ...config.data
    };
  } else if (config.method === 'get') {
    config.params = {
      ...config.params
    };
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});
Vue.prototype.$JHttp = jAxios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
});
// new Vconsole();
