/**
 * Created by muxi on 2017/10/19.
 */
/* 开发 begin */
// window.baseURL = 'http://192.168.20.14:7070';
// window.uploadURL = 'http://121.40.102.80:7888';
/* 开发 end */
window.iosAppStoreUrl = 'https://itunes.apple.com/cn/app/%E5%9B%9E%E6%9D%A5%E5%95%A6%E7%A4%BE%E5%8C%BA/id1364341961?mt=8';
window.androidYingYongBaoUrl = 'http://sj.qq.com/myapp/detail.htm?apkName=com.uama.smartcommunityfornjdf';
window.iosUrlSchemal = 'SmartCommunityForNJDF';
window.androidUrlSchemal = 'smartcommunityfornjdf';
window.downloadUrl = 'http://dl.huilaila.net';
window.aliyunHome = 'http://oss.huilaila.net';
var protocol = document.location.protocol;
if (protocol === 'http:') {
  window.oldBaseURL = 'http://app-admin.huilaila.net';
  window.baseURL = 'http://app-apiv14.huilaila.net:7301';
  window.uploadURL = 'http://app-img.huilaila.net:7888';
  window.aliOSSServer = 'http://app-admin.huilaila.net:7666/';
  window.GDURL = 'http://restapi.amap.com';
} else if (protocol === 'https:') {
  window.oldBaseURL = 'https://app-admin.huilaila.net';
  window.baseURL = 'https://app-apiv14.huilaila.net:7300';
  window.uploadURL = 'https://app-img.huilaila.net:7889';
  window.aliOSSServer = 'https://app-admin.huilaila.net:7660/';
  window.GDURL = 'https://restapi.amap.com';
}
window.commonConfig = {
  companyCode: 'df',
  appVersion: 'V1.3',
  passwordSalt: 'uama1209',
  phoneRegp: /^1(3|4|5|7|8|9)\d{9}$/,
  idCodeRegp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  forButler: '!1ba2-@2a1-b3d4-1!2c42-c@-13d',
  productPayBusiness: 'product',
  scheme_IOS: 'SmartCommunityForNJDF://WechatH5PayResult',
  aliOSSConfig: {
    region: 'oss-cn-hangzhou',
    bucket: 'huilaila-pub'
  },
  baseSize: 37.5
};
