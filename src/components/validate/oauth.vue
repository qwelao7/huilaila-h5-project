<template>
  <div class="oauth-wrapper">

  </div>
</template>
<script>
  import {JURL} from '../../common/js/utils';
  const businessType = {
    10: {name: '积分商品', path: 'integralCheckStand'},
    20: {name: '邀请注册', path: 'autoBindHouse'},
    30: {name: '活动签到', path: 'signUpDetail'},
    40: {name: '活动分享', path: 'activityDetail'}
  }
  const scope = 'snsapi_userinfo' // snsapi_base
  export default {
    created () {
      this.getBusinessParam();
      this.oauth();
    },
    data () {
      return {
        businessParam: {}
      }
    },
    methods: {
      getBusinessParam () {
        let businessParam = JURL.getHashParam('businessParam');
        businessParam = JSON.parse(decodeURI(businessParam).replace(new RegExp(/%3A/g), ':'));
        this.businessParam = businessParam;
      },
      oauth () {
        let location = window.location;
        // 通用参数
        let businessParam = this.businessParam;
        // 业务code
        let businessCode = businessParam.businessCode;
        let isApp = JURL.getSearchParam('isApp') || JURL.getHashParam('isApp');
//        let forButler = JURL.getSearchParam('forButler') || JURL.getHashParam('forButler');
//        if (forButler === window.commonConfig.forButler) {
//          this.$vux.alert.show({
//            title: '',
//            content: '',
//            onHide () {
//              this.$router.push('/')
//            }
//          })
//        }
        if (isApp) { // App扫码逻辑
          let url = location.origin + location.pathname + '#/signUpDetail?isApp=1&out=1&idCode=' + businessParam.idCode
          window.location.href = url;
        } else {
          // 映射路径
          let businessPath = businessType[businessCode].path;
          let path = location.pathname;
          let commonPath = path.substr(0, path.lastIndexOf('/'));
          let redirectURI = location.origin + commonPath + '/middle.html?path=' + businessPath;
          let postData = {
            redirectURI: redirectURI,
            scope: scope,
            params: JSON.stringify(businessParam)
          };
          this.$JHttp({
            url: window.baseURL + '/weixin/oauth2/authorize',
            method: 'post',
            data: postData
          }).then((res) => {
            window.location.href = res;
          }).catch(e => {
            console.log(e);
          });
        }
      }
    }
  }
</script>
<style></style>
