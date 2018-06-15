function shareTimeline (wechat, params) {
  wechat.onMenuShareTimeline({
    title: params.title,
    desc: params.desc, // 分享描述
    link: params.link,
    imgUrl: params.imgUrl, // 自定义图标
    success: function (res) {
      console.log(res)
    },
    cancel: function (res) {
      console.log(res)
    },
    fail: function (res) {
      console.log(res)
    }
  })
}
function shareAppMessage (wechat, params) {
  wechat.onMenuShareAppMessage({
    title: params.title,
    desc: params.desc, // 分享描述
    link: params.link,
    imgUrl: params.imgUrl, // 自定义图标
    success: function (res) {
      console.log(res)
    },
    cancel: function (res) {
      console.log(res)
    },
    fail: function (res) {
      console.log(res)
    }
  })
}
function shareQQ (wechat, params) {
  wechat.onMenuShareQQ({
    title: params.title,
    desc: params.desc, // 分享描述
    link: params.link,
    imgUrl: params.imgUrl, // 自定义图标
    success: function (res) {
      console.log(res)
    },
    cancel: function (res) {
      console.log(res)
    },
    fail: function (res) {
      console.log(res)
    }
  })
}

function initWXShare (wechat, funcName, params) {
  switch (funcName) {
    case 'timeLine':
      shareTimeline(wechat, params)
      break
    case 'appMessage':
      shareAppMessage(wechat, params)
      break
    case 'qq':
      shareQQ(wechat, params)
      break
  }
}
export {
  initWXShare
}
