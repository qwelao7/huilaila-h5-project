<template>
  <div>
    <div id="container" style="width:500px; height:300px"></div>
    <p>{{msg1}}</p>
  </div>
</template>
<script>
//  import AMap from 'AMap'
  import '../../common/js/map'
  export default {
    data () {
      return {
        msg: '',
        msg1: ''
      }
    },
    mounted: function () {
      this.init()
    },
    methods: {
      init: function () {
        let _this = this;
        window.AMap.service('AMap.CitySearch', function () {
          let city = new window.AMap.CitySearch({
            city: '010'
          });
          city.getLocalCity((status, result) => {
            _this.msg1 = result.city
          });
        })
        let mapObj = new window.AMap.Map('container', {
          center: [116.397428, 39.90923],
          resizeEnable: true,
          zoom: 16
        });
        window.AMap.service('AMap.Driving', function () { // 回调函数
          // 实例化Driving
          let driving = new window.AMap.Driving({
            map: mapObj,
            panel: 'result1'
          });
//          driving.search([116.379028, 39.865042], [116.427281, 39.903719], function (status, result) {
//            alert(status)
//          });
          driving.search([{keyword: '武林广场', city: '杭州市'}, {keyword: '汽车北站'}], function (status, result) {
            console.log(result);
            alert(status, 1111)
          });
        });
        mapObj.plugin('AMap.Geolocation', function () {
          let geolocation = new window.AMap.Geolocation({
            timeout: 10000,
            GeoLocationFirst: false,
            maximumAge: 0
          });
          mapObj.addControl(geolocation);
          geolocation.getCurrentPosition();
          window.AMap.event.addListener(geolocation, 'complete', function (data) {
            console.log(222, data)
            data.position.getLng();
            data.position.getLat()
          });
          window.AMap.event.addListener(geolocation, 'error', function (data) {
            if (data.info === 'FAILED') {
              console.log(data);
              alert('获取您当前位置失败！')
            }
          });
        });
      }
    }
  }
</script>
<style>
</style>
