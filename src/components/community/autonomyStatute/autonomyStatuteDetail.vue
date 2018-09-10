<template>
<div class="autonomy-statute-detail commonHeader">
  <view-box body-padding-top="1.253333rem" body-padding-bottom="0">

    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100" :left-options="{ backText: '' }" :title=title></x-header>

    <div class="wrapper">
      <div class="top">
        <div class="autonomy-title" v-text="autonomyTitle"></div>
        <div class="intime" v-text="intime"></div>
      </div>
      <div class="content" v-html="autonomyContent"></div>
    </div>

  </view-box>
</div>
</template>
<script>
  import Vue from 'vue'
  import { ViewBox, XHeader } from 'vux'
  export default {
    name: 'autonomy-statute-detail',
    components: {
      ViewBox,
      XHeader
    },
    data () {
      return {
        title: '自治规约',
        autonomyId: '',
        autonomyTitle: '',
        intime: '',
        autonomyContent: ''
      }
    },
    created () {
      this.autonomyId = this.$route.query.autonomyId
      this.getAutonomyDetail()
    },
    methods: {
      getAutonomyDetail () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'GET',
          url: window.baseURL + '/autonomy/autonomyDetail',
          params: {
            autonomyId: _this_.autonomyId
          }
        }).then(res => {
          if (res.status === 100) {
            _this_.autonomyTitle = res.data.autonomyTitle
            _this_.intime = res.data.intime
            _this_.autonomyContent = res.data.autonomyContent
          }
        }).catch(e => {
          console.log(e)
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.autonomy-statute-detail {
  height: 100%;
  .wrapper {
    .top {
      margin: 10px 15px 15px 15px;
      .autonomy-title {
        font-size: 24px;
        color: #333333;
        margin-bottom: 10px;
      }
      .intime {
        font-size: 12px;
        color: #AAAAAA;
      }
    }
  }
}
</style>
