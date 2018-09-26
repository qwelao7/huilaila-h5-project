/**
 * Created By muxi on 2017/5/2
 */
// 引入地图搜索组件
import 'lib/citySearch';
/**
 * 根据IP查询当前城市
 */
function showCityInfo (success, error) {
  // 实例化城市查询类
  /* eslint-disable no-undef */
  var citysearch = new AMap.CitySearch();
  // 自动获取用户IP，返回当前城市
  citysearch.getLocalCity(function (status, result) {
    if (status === 'complete' && result.info === 'OK') {
      if (result && result.city && result.bounds) {
        success(result.city);
      }
    } else {
      error(result.info);
    }
  });
}
/**
 * 根据IP查询当前省份
 */
function showProvinceInfo (success, error) {
  // 实例化城市查询类
  var citysearch = new AMap.CitySearch();
  // 自动获取用户IP，返回当前城市
  citysearch.getLocalCity(function (status, result) {
    if (status === 'complete' && result.info === 'OK') {
      if (result && result.province && result.bounds) {
        success(result.province);
      }
    } else {
      error(result.info);
    }
  });
}
export var map = {
  getLocalCity: showCityInfo,
  getLocalProvince: showProvinceInfo
}
