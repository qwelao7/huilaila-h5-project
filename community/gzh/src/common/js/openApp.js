/**
 * Created by fulin.liu on 2018/8/1.
 */
  import {JNavigator} from './utils'
  function open () {
    // 判断浏览器
    if (JNavigator.isWeiXin()) {
      // 引导用户在浏览器中打开
      openInWX();
      return;
    }
    var d = new Date();
    var t0 = d.getTime();
    openApp();
    downloadApp(t0);
  }

  function downloadApp (t0) {
    // 由于打开需要1～2秒，利用这个时间差来处理－－打开app后，返回h5页面会出现页面变成app下载页面，影响用户体验
    var delay = setInterval(function () {
      var d = new Date();
      var t1 = d.getTime();
      if (t1 - t0 < 3000 && t1 - t0 > 2000) {
        alert('请下载APP');
        window.location.href = window.downloadUrl;
      }
      if (t1 - t0 >= 3000) {
        clearInterval(delay);
      }
    }, 1000);
  }
  function openApp () {
    // 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为
    // 否则打开a标签的href链接
    let src;
    if (JNavigator.isAndroid()) {
      src = window.androidUrlSchemal + '://splash';
    } else if (JNavigator.isIOS()) {
      src = window.iosUrlSchemal + '://';
    }
    var ifr = document.createElement('iframe');
    ifr.src = src;
    ifr.style.display = 'none';
    document.body.appendChild(ifr);
    window.setTimeout(function () {
      document.body.removeChild(ifr);
    }, 2000);
  }
  function openInWX () {
    // 跳转到回来啦下载地址
    window.location.href = window.downloadUrl;
    // if (JNavigator.isAndroid()) {
    //   window.location.href = window.androidYingYongBaoUrl;
    // } else if (JNavigator.isIOS()) {
    //   window.location.href = window.iosAppStoreUrl;
    // }
  }
  export default open;
