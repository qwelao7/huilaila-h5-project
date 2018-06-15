<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!--<div>
      <bottomTab></bottomTab>
    </div>-->
  </div>
</template>

<script>
  import bottomTab from './components/bottomTab'
  //  import api from '@/fetch/api'
  export default {
    name: 'app',
    components: {
      bottomTab
    },
    created () {
      this.getWxVal()
    },
    methods: {
      getWxVal () {
        let _this = this;
        let url = encodeURIComponent(window.location.href.split('#')[0]);
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/weixin/jsSDKValidate?url=' + url
        }).then(res => {
          console.log(res);
          if (res.status === 100) {
            let val = res.data;
            _this.$wechat.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: val.appId,
              timestamp: JSON.stringify(val.timestamp),
              nonceStr: val.nonceStr,
              signature: val.signature,
              jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'openLocation',
                'getLocation',
                'getNetworkType',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView'] // 必填，需要使用的JS接口列表，
            })
            _this.$wechat.ready(function () {
              // 隐藏分享功能入口
              _this.$wechat.hideOptionMenu();
            })
          }
        }).catch(e => {
          console.log(e)
        })
      }
    }
  }
</script>

<style type="text/less" lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import "assets/css/reset.css";
  @import "assets/css/common";
  #app {
    position: relative;
    color: #333333;
    width: 100%;
    height: 100%;
    font-size: 100%;
    /*margin-top: 60px;*/
    /*解决滑动卡顿的情况*/
    -webkit-overflow-scrolling: touch;
    line-height: 1.5;
    background-color: #ffffff;
    font-family: 'pingfang_scregular';
    a,img,button,input,textarea,div{-webkit-tap-highlight-color:rgba(255,255,255,0);}
  }
</style>
