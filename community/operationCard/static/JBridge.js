/* 创建wk的承载容器begin */
function setupWebViewJavascriptBridge (callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  } else {
    window.document.addEventListener('WebViewJavascriptBridgeReady', function () {
      callback(window.WebViewJavascriptBridge);
    }, false);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () { document.documentElement.removeChild(WVJBIframe); }, 0);
}
var count = 0;
var jsbridge = function (bridge) {
  if (!bridge) {
    setTimeout(function () {
      jsbridge(bridge);
      count++;
    }, 50);
  } else {
    if (count <= 5) {
      // 初始化
      if (bridge.init) {
        bridge.init();
      }
      window.bridge = bridge;
    } else {
      console.log('checkBridge init fail');
      return false;
    }
  }
};
setupWebViewJavascriptBridge(
  jsbridge
);
