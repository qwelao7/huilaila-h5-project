/* 创建wk的承载容器begin */
function setupWebViewJavascriptBridge (callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  } else {
    window.document.addEventListener('WebViewJavascriptBridgeReady', function () {
      callback(window.WebViewJavascriptBridge)
    }, false)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback]
  var WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
}
setupWebViewJavascriptBridge(function (bridge) {
  // 初始化
  if (bridge.init) {
    bridge.init()
  }

  window.bridge = bridge

  /* OC调用JS的方法列表begin */
  // if (window.bridge) {
    // 返回
    // bridge.registerHandler('_app_goBack', function (data, responseCallback) {
      // alert('返回')
      // responseCallback(true)
    // })
  // } else {
    // console.error('bridge不存在,请在app内调用原生方法')
  // }
  /* OC调用JS的方法列表end */
})
/* 创建wk的承载容器end */
