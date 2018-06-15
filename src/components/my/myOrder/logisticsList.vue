<template>
  <div class="logistics-list commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div v-for="item in list" @click="clickItem(item)">
        <logistics-item :item=item></logistics-item>
      </div>

    </view-box>

  </div>
</template>
<script>
  import logisticsItem from './logisticsItem'
  import { ViewBox, XHeader, querystring } from 'vux'
  export default {
    name: 'logistics-list',
    components: {
      ViewBox,
      XHeader,
      logisticsItem
    },
    data () {
      return {
        title: '追踪物流',
        orderId: '',
        list: []
      }
    },
    created () {
      let _this_ = this
      _this_.orderId = _this_.$route.query.orderId
      _this_.$JHttp({
        method: 'get',
        url: window.baseURL + '/afterSales/getLogisticsList?orderId=' + _this_.orderId
      }).then(res => {
        if (res.status === 100) {
          _this_.list = res.data
        }
      }).catch(e => {
        console.log(e)
      });
    },
    methods: {
      clickItem (item) {
        if (!item.expStatus) {
          this.$vux.toast.show({
            width: '11em',
            type: 'text',
            text: '<span style="font-size: 12px">商家通知物流揽件中,请耐心等待...</span>'
          })
          return
        }
        let params = {
          expCode: item.expFirmCode,
          expNum: item.expNo,
          orderId: item.orderId
        }
        this.$router.push('/logisticsDetail?' + querystring.stringify(params))
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.logistics-list {
  height: 100%;
  background-color: #f2f2f2;
  .logistics-item {
    margin-top: 10px;
    background-color: #FFFFFF;
  }
}
</style>

