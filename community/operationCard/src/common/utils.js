/*
 * Author: muxi
 * Description: 是否是Android客户端
 * Date: 2017-05-12 15:28:30
 */
function isAndroid () {
  let u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
  return isAndroid;
}
/*
 * Author: muxi
 * Description: 是否是IOS客户端
 * Date: 2017-05-12 15:28:30
 */
function isIOS () {
  let u = navigator.userAgent;
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  return isIOS;
}
/**
 * 获取通用头配置
 */
function getHeader () {
  let token = getVal('token');
  let communityId = getVal('defCommunityId');
  let roomId = getVal('defRoomId');
  if (!token) {
    token = localStorage.getItem('token');
    communityId = localStorage.getItem('communityId');
    roomId = localStorage.getItem('roomId');
  }
  localStorage.setItem('token', token);
  localStorage.setItem('communityId', communityId);
  localStorage.setItem('roomId', roomId);

  let companyCode = window.commonConfig.companyCode; // 物业公司区别码

  let mobileType = '';
  if (isAndroid()) {  // 安卓
    mobileType = '16';
  } else if (isIOS()) { // IOS
    mobileType = '17';
  }
  let header = {
    headers: {
      companyCode: companyCode,
      mobileType: mobileType,
      token: token,
      defCommunityId: communityId,
      defRoomId: roomId
    },
    timeout: 20000
  };
  return header;
}

function getVal (key) {
  var value = getRouterParam(key);
  if (value === undefined || value == null) {
    return '';
  }
  return value;
}

function getRouterParam (name) {
  var params = window.location.href.split('?')[1];
  if (params == null || params === undefined) {
    return '';
  }
  var paramList = [];
  var param = null;
  var theRequest = {};
  if (params.length > 0) {
    if (params.indexOf('&') >= 0) {
      paramList = params.split('&');
    } else {
      paramList[0] = params;
    }
    for (var i = 0; i < paramList.length; i++) {
      theRequest[paramList[i].split('=')[0]] = (paramList[i].split('=')[1]);
    }
    param = theRequest[name];
  }
  return param;
}

let JAjax = {
  getHeader: getHeader
};
export {
  JAjax
};
