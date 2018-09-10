<template>
  <div class="myOrder commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">

      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="order-list-wrapper">
        <scroll-tab :tabs="tabs">
        </scroll-tab>
      </div>

    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader } from 'vux'
  import scrollTab from './scrollTab/scrollTab'
  export default {
    name: 'myOrder',
    components: {
      ViewBox,
      XHeader,
      scrollTab
    },
    data () {
      return {
        title: '我的服务',
        tabs: [{
          text: '全部',
          type: 0,
          value: undefined,
          redPoint: false
        }, {
          text: '待付款',
          type: 0,
          value: 0,
          redPoint: false
        }, {
          text: '待处理',
          type: 0,
          value: 6,
          redPoint: false
        }, {
          text: '处理中',
          type: 0,
          value: 2,
          redPoint: false
        }, {
          text: '待评价',
          type: 0,
          value: 3,
          redPoint: false
        }, {
          text: '售后记录',
          type: 1,
          value: undefined,
          redPoint: false
        }]
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.myOrder {
  .list {
    .item {
      padding: 0 15px;
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0 11px 0;
        .left {
          display: flex;
          align-items: center;
          .store-name {
            font-size: 15px;
            color: #333333;
            margin-right: 5px;
          }
          .serial-number {
            font-size: 12px;
            color: #AAAAAA;
          }
        }
        .order-status {
          font-size: 15px;
          color: #AAAAAA;
        }
        .order-time {
          font-size: 15px;
          color: #FF6648;
        }
      }
      .footer {
        .info {
          display: flex;
          padding: 13.5px 0 9px 0;
          .text {
            margin-right: 5px;
          }
        }
        .operation {
          display: flex;
          justify-content: flex-end;
          padding-bottom: 9px;
          .button {
            padding: 4.5px 14.5px;
            text-align: center;
            height: 17px;
            line-height: 17px;
            color: #FF6648;
            background: #FFFFFF;
            border: 2px solid #FF6648;
            border-radius: 100px;
            &:not(:last-child) {
              margin-right: 5px;
            };
          }
        }
      }
    }
  }
}
</style>
