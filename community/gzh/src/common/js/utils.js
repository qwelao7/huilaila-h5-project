/**
 * webapp中h5的定位函数
 * @author muxi
 * @date 2017/05/02 16:09
 * @param success 定位成功的回调函数
 * @param error 定位失败的回调函数
 */
function getLocation (success, error) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert('您的浏览器不支持h5的定位功能!');
  }
}
/**
 * 扩展对象（常用与配置对象的扩展）
 * @param target 目标对象
 * @param source 原对象
 */
function extend (target, source) {
  for (var key in source) {
    target[key] = source[key];
  }
};

/**
 * 日期加上天数,得到新的日期
 * @param dateTemp 需要参加计算的日期
 * @param days 要添加的天数
 * @returns 得到新的日期
 */
function addDays (dateTemp, days) {
  var millSeconds = dateTemp.getTime() + (days * 86400000); // 24 * 60 * 60 * 1000 => 86400000
  var rDate = new Date(millSeconds);
  return rDate;
}

/**
 * 日期加上小时,得到新的日期
 * @param dateTemp 需要参加计算的日期
 * @param days 要添加的小时数
 * @returns 得到新的日期
 */
function addHours (dateTemp, hours) {
  var millSeconds = dateTemp.getTime() + (hours * 3600000); // 60 * 60 * 1000 => 3600000
  var rDate = new Date(millSeconds);
  return rDate;
}

/**
 * 日期加上分钟,得到新的日期
 * @param dateTemp 需要参加计算的日期
 * @param days 要添加的分钟数
 * @returns 得到新的日期
 */
function addMinutes (dateTemp, minutes) {
  var millSeconds = dateTemp.getTime() + (minutes * 60000); // 60 * 1000 =>60000
  var rDate = new Date(millSeconds);
  return rDate;
}
/**
 * 获取指定时间的month-date格式，如03-12
 * @param time 时间
 * @returns {string} 返回月日字符串
 */
function getMonthDayStr (time) {
  let month = time.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  let day = time.getDate();
  day = day < 10 ? '0' + day : day;
  return month + '-' + day;
}
/**
 * 将指定的日期格式化
 * @param date 指定的日期
 * @param fmt 格式
 * @returns {string} 格式化后的字符串
 */
function Dateformat (date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'))
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  var o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

function Dateformat2 (date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'))
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}

/**
 * 根据指定时间,计算中文通俗时间 eg: 今天 18:30
 * @param time 指定的时间
 * @returns {string} 返回中文通俗时间
 */
function getChineseTime (time) {
  let today = new Date();
  let currentDate = today.getDate();
  let targetDate = time.getDate();
  let gapDays = targetDate - currentDate;
  let monthDayStr = getMonthDayStr(time);
  let timeStr = time.toTimeString().substring(0, 5);
  let res = '';
  switch (gapDays) {
    case 0:
      res = '今天 ' + timeStr;
      break;
    case 1:
      res = '明天 ' + timeStr;
      break;
    case 2:
      res = '后天 ' + timeStr;
      break;
    case -1:
      res = '昨天 ' + timeStr;
      break;
    case -2:
      res = '前天 ' + timeStr;
      break;
    default:
      res = monthDayStr + ' ' + timeStr;
      break;
  }
  return res;
}
/**
 * 将中文通俗时间转化为yyyy-MM-dd HH:mm格式字符串
 * @param timeZN 中文通俗时间,eg: 明天 17:35
 * @returns {string} 格式化后的字符串
 */
function translateChineseTime (timeZN) {
  let first2Character = timeZN.substring(0, 2);
  let timePartStr = timeZN.substring(3, timeZN.length);
  let res = '';
  let today = new Date();
  switch (first2Character) {
    case '今天':
      res = Dateformat(today, 'yyyy-MM-dd') + ' ' + timePartStr;
      break;
    case '明天':
      res = Dateformat(addDays(today, 1), 'yyyy-MM-dd') + ' ' + timePartStr;
      break;
    case '后天':
      res = Dateformat(addDays(today, 2), 'yyyy-MM-dd') + ' ' + timePartStr;
      break;
    case '昨天':
      res = Dateformat(addDays(today, -1), 'yyyy-MM-dd') + ' ' + timePartStr;
      break;
    case '前天':
      res = Dateformat(addDays(today, -2), 'yyyy-MM-dd') + ' ' + timePartStr;
      break;
    default:
      res = today.getFullYear() + '-' + timeZN;
      break;
  }
  return res;
}

/**
 * 获取两个时间间隔的分钟数
 * @param bTime 开始时间
 * @param eTime 结束时间
 * @returns {number} 相差的分钟数
 */
function getMinutesInterval (bTime, eTime) {
  // 间隔的毫秒值
  let intervalMilliSeconds = eTime - bTime;
  return intervalMilliSeconds / 60000; // 1000 * 60
}
/**
 * 获取两个时间间隔的小时数
 * @param bTime 开始时间
 * @param eTime 结束时间
 * @returns {number} 相差的小时数
 */
function getHoursInterval (bTime, eTime) {
  // 间隔的毫秒值
  let intervalMilliSeconds = eTime - bTime;
  return intervalMilliSeconds / 3600000; // 1000 * 60 * 60
}
/**
 * 获取两个时间间隔的天数
 * @param bTime 开始时间
 * @param eTime 结束时间
 * @returns {number} 相差的天数
 */
function getDaysInterval (bTime, eTime) {
  // 间隔的毫秒值
  let intervalMilliSeconds = eTime - bTime;
  return intervalMilliSeconds / 86400000; // 1000 * 60 * 60 * 24
}
/**
 * 根据七位二进制字符串转化成星期字符串
 * @param binaryStr eg：1001101
 * @returns {string} 返回 eg周日，周三，周四，周六
 */
function getSharingRepeatStr (binaryStr) {
  if (!binaryStr) {
    return '';
  }
  if (binaryStr === '0000000') {
    return '未设置';
  }
  if (binaryStr === '1111111') {
    return '每天';
  } else if (binaryStr === '1111100') {
    return '工作日';
  }
  let res = '';
  let binaryStrs = binaryStr.split('');
  binaryStrs.forEach(function (strItem, index) {
    if (strItem === '1') {
      switch (index) {
        case 0:
          res += '周一、';
          break;
        case 1:
          res += '周二、';
          break;
        case 2:
          res += '周三、';
          break;
        case 3:
          res += '周四、';
          break;
        case 4:
          res += '周五、';
          break;
        case 5:
          res += '周六、';
          break;
        case 6:
          res += '周日、';
          break;
        default:
          res += '';
          break;
      }
    }
  });
  // 去除最后一个逗号
  if (res[res.length - 1] === '、') {
    res = res.substring(0, res.length - 1);
  }
  return res;
}
/**
 * 根据七位二进制字符串转化成星期数组
 * @param binaryStr eg：1001101
 * @returns {string} 返回 eg repeats
 */
function getSharingRepeatArray (binaryStr) {
  let repeats = [{
    text: '每周一',
    value: '0'
  }, {
    text: '每周二',
    value: '0'
  }, {
    text: '每周三',
    value: '0'
  }, {
    text: '每周四',
    value: '0'
  }, {
    text: '每周五',
    value: '0'
  }, {
    text: '每周六',
    value: '0'
  }, {
    text: '每周日',
    value: '0'
  }];
  if (!binaryStr) {
    return repeats;
  }
  let strs = binaryStr.split('');
  strs.forEach(function (str, index) {
    repeats[index].value = str;
  })
  return repeats;
}

let jlDate = {
  addDays: addDays,
  addHours: addHours,
  addMinutes: addMinutes,
  getMonthDayStr: getMonthDayStr,
  getChineseTime: getChineseTime,
  translateChineseTime: translateChineseTime,
  getMinutesInterval: getMinutesInterval,
  getHoursInterval: getHoursInterval,
  getDaysInterval: getDaysInterval,
  getSharingRepeatStr: getSharingRepeatStr,
  getSharingRepeatArray: getSharingRepeatArray,
  Dateformat: Dateformat,
  Dateformat2: Dateformat2
}
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
/*
 * Author: muxi
 * Description: 是否是微信浏览器
 * Date: 2017-05-12 13:03:30
 */
function isWeiXin () {
  let ua = navigator.userAgent.toLowerCase();
  /* eslint-disable eqeqeq */
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}
/*
 * Author: muxi
 * Description: 是否是qq浏览器
 * Date: 2017-03-12 09:40:05
 */
function isQQ () {
  let ua = navigator.userAgent.toLowerCase();
  if (ua.match(/QQ/i) === 'qq') {
    return true;
  } else {
    return false;
  }
}

let JNavigator = {
  isAndroid: isAndroid,
  isIOS: isIOS,
  isWeiXin: isWeiXin,
  isQQ: isQQ
}

/**
 *  获取url常规参数(?)
 * @param name 参数名
 * @returns {*}
 */
function getSearchParam (name) {
  if (!name) {
    return;
  }
  let params = location.search && location.search.split('?')[1];
  let paramList = [];
  let param = null;
  let parami;
  if (params.length > 0) {
    if (params.indexOf('&') >= 0) {
      paramList = params.split('&');
    } else {
      paramList[0] = params;
    }
    for (let i = 0, listLength = paramList.length; i < listLength; i++) {
      parami = paramList[i].indexOf(name + '=');
      if (parami >= 0) {
        param = paramList[i].substr(parami + (name + '=').length);
      }
    }
  }
  return param;
}

/**
 * 获取hash参数
 * @param name 参数名
 * @returns {*} 值
 */
function getHashParam (name) {
  try {
    if (!name) {
      return '';
    }
    if (location.hash.indexOf('?') === -1) {
      return '';
    }
    let params = location.hash.split('?')[1];
    let paramList = [];
    var param = null;
    let theRequest = {};
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
  } catch (error) {
    return ''
  }
}

function generateCommonParam () {
  let commonParamObj = {
    token: undefined,
    mobileNo: undefined, // 手机序列号
    mobileName: undefined, // 手机型号
    mobileType: undefined, // 手机类型
    appVersion: undefined, // app版本号
    sign: undefined, // 加签
    mobileVersion: undefined, // 手机系统版本号
    fieds: undefined,
    version: undefined,
    companyCode: undefined, // 物业公司编码
    province: undefined, // 当前省份
    city: undefined, // 当前市
    area: undefined, // 当前区
    id: undefined, // 当前活动ID
    mobile: undefined // 报名人手机号
  };
  // 获取公共参数
  for (let key in commonParamObj) {
    getSingleParam(key, commonParamObj);
  }
  window.commonParamObj = commonParamObj;
  return commonParamObj;
}

// 获取单个公共参数
function getSingleParam (name, commonParamObj) {
  commonParamObj[name] = decodeURI(getHashParam(name));
  if (commonParamObj[name] !== 'undefined') {
    if (!commonParamObj[name]) {
      commonParamObj[name] = localStorage.getItem(name);
    } else {
      localStorage.setItem(name, commonParamObj[name]);
    }
  } else {
    commonParamObj[name] = undefined;
  }
}

let JURL = {
  getHashParam: getHashParam,
  getSearchParam: getSearchParam
};
/**
 * 获取通用头配置
 */
function gerHeader () {
  let token = localStorage.getItem('token');
  let communityId = localStorage.getItem('communityId');
  let roomId = localStorage.getItem('roomId') || '';
  let latitude = localStorage.getItem('latitude');
  let longitude = localStorage.getItem('longitude');
  let areaCode = localStorage.getItem('areaCode');
  let companyCode = window.commonConfig.companyCode; // 物业公司区别码
  let mobileType = '';
  if (isAndroid()) {
    mobileType = 16
  } else if (isIOS()) {
    mobileType = 17;
  }
  let header = {
    headers: {
      companyCode: companyCode,
      appVersion: window.commonConfig.appVersion,
      token: token,
      defCommunityId: communityId,
      // defRoomId: roomId,
      mobileType: mobileType,
      defLatitude: latitude,
      defLongitude: longitude,
      defAreaCode: areaCode
    },
    timeout: 20000
  };
  return header;
}

let JAjax = {
  getHeader: gerHeader
};

/**
 * 全部替换 <=> replaceAll
 * @param str 原始字符串
 * @param oldVal 需要被替换的值
 * @param val 替换的值
 * @returns {string} 返回替换后的值
 * @constructor
 */
function replaceAll (str, oldVal, val) {
  let reg = new RegExp(oldVal, 'g'); // 创建正则RegExp对象
  return str.replace(reg, val);
}

let JString = {
  replaceAll: replaceAll
}

export {
  getLocation, extend, jlDate, JNavigator, JURL, JAjax, JString
}
