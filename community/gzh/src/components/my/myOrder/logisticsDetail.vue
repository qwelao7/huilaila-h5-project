<template>
  <div class="logistics-detail commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="form-preview logistics-desc">
        <div class="form-preview-item" v-if="productName">
          <label class="form-preview-label">商品名称：</label>
          <span class="form-preview-value" v-text="productName"></span>
        </div>
        <div class="form-preview-item">
          <label class="form-preview-label">物流公司：</label>
          <span class="form-preview-value" v-text="expCompany"></span>
        </div>
        <div class="form-preview-item">
          <label class="form-preview-label">运单编号：</label>
          <span class="form-preview-value" v-text="expNum"></span>
        </div>
      </div>

      <div class="logistics-info">
        <div class="title">物流跟踪</div>
        <time-axis :list=list>
          <template slot-scope="slotProps">
            <div :class="slotProps.index === 0 ? 'info-highlight' : 'info'" v-text="slotProps.item.context"></div>
            <div class="time" v-text="slotProps.item.ftime"></div>
          </template>
        </time-axis>
      </div>
    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader } from 'vux'
  import timeAxis from './timeAxis'
  export default {
    name: 'logistics-detail',
    components: {
      ViewBox,
      XHeader,
      timeAxis
    },
    data () {
      return {
        title: '物流信息',
        productName: '',
        expCompany: '',
        expNum: '',
        list: []
      }
    },
    created () {
      let _this_ = this
      _this_.orderId = _this_.$route.query.orderId
      _this_.expCode = _this_.$route.query.expCode
      _this_.expNum = _this_.$route.query.expNum
      _this_.productName = _this_.$route.query.productName
      _this_.$JHttp({
        method: 'get',
        url: window.baseURL + '/getExpressDetails?orderId=' + _this_.orderId + '&expCode=' + _this_.expCode + '&expNum=' + _this_.expNum
      }).then(res => {
        if (res.status === 100) {
          _this_.expCompany = res.data.expCompany
          _this_.expNum = res.data.expNum
          _this_.list = res.data.expContext
        }
      }).catch(e => {
        console.log(e)
      });
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.logistics-detail {
  height: 100%;
  background-color: #f2f2f2;
  .form-preview {
    position: relative;
    background-color: #ffffff;
    line-height: 21px;
    font-size: 15px;
    color: #333333;
    padding: 15px;
    .form-preview-item {
      overflow: hidden;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
      .form-preview-label {
        float: left;
        min-width: 76px;
        text-align: right;
        /*text-align-last: justify;*/
      }
      .form-preview-value {
        display: block;
        overflow: hidden;
        word-break: normal;
        word-wrap: break-word;
      }
    }
  }
  .logistics-desc {
    margin-top: 10px;
    background-color: #FFFFFF;
  }
  .logistics-info {
    padding: 0 15px;
    margin-top: 10px;
    background-color: #FFFFFF;
    font-size: 15px;
    color: #333333;
    .title {
      padding: 12.5px 0;
      border-bottom: 0.5px solid #D8D8D8;
    }
    .info-highlight {
      font-size: 15px;
      color: #FF6648;
    }
    .info {
      font-size: 15px;
    }
    .time {
      font-size: 12px;
      color: #AAAAAA;
    }
  }
}
</style>

