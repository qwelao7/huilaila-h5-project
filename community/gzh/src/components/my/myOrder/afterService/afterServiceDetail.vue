<template>
  <div class="after-service-detail commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title>
        <a slot="right" style="color: #333;font-size: 14px;" @click="goAfterServiceApply">查看申请单</a>
      </x-header>

      <div class="after-service-header">
        <span class="header" :class="(index + 1) <= stageIndex ? 'header-highlight' : ''" v-for="(stage, index) in stageList">
          <i class="icon"></i>
          <div class="text" v-text="stage"></div>
        </span>
      </div>

      <div class="after-service-info">
        <time-axis :list=list>
          <template slot-scope="slotProps">
            <div :class="slotProps.index === 0 ? 'info-highlight' : 'info'" v-text="slotProps.item.content"></div>
            <div class="time" v-text="slotProps.item.time"></div>
            <div class="button-wrapper">
              <span class="button" v-if="slotProps.index === 0 && stage === 2 && type === 2 && exp_no.length < 1" @click="goLogisticsForm">寄回商品</span>
            </div>
          </template>
        </time-axis>
      </div>
    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader } from 'vux'
  import timeAxis from '../timeAxis'
  export default {
    name: 'after-service-detail',
    components: {
      ViewBox,
      XHeader,
      timeAxis
    },
    data () {
      return {
        title: '进度',
        orderServiceId: '', // 售后记录ID
        stageIndex: 0,
        stage: 0,
        exp_no: '',
        stageList: [], // 售后阶段: 1等待受理 2寄回商品 3收货 4等待退款 5完成退款 6已经取消(业主取消) 7关闭
        list: [],
        type: 0, // 售后类型: 1申请取消订单 2退货退款 3工作人员关单
        needBackProduct: 0 // 是否寄回商品
      }
    },
    created () {
      let _this_ = this
      _this_.orderServiceId = _this_.$route.query.orderServiceId
      _this_.$JHttp({
        method: 'get',
        url: window.baseURL + '/afterSales/afterSalesDetail/' + _this_.orderServiceId
      }).then(res => {
        if (res.status === 100) {
          _this_.list = res.data.deals
          _this_.type = res.data.type
          _this_.stage = res.data.stage
          _this_.exp_no = res.data.exp_no
          _this_.needBackProduct = res.data.needBackProduct
          if (res.data.type === 1 || res.data.needBackProduct === 0) {
            _this_.stageList = ['提交申请', '等待受理', '等待退款', '完成退款'];
          } else {
            _this_.stageList = ['提交申请', '等待受理', '寄回商品', '客服收货', '完成退款']
          }
          if (res.data.stage === 4) {
            if (res.data.type === 2 && res.data.needBackProduct === 1) {
              // 点亮提交申请、等待受理 、寄回商品、客服收货
              _this_.stageIndex = 4
            } else {
              // 点亮提交申请、等待受理、等待退款
              _this_.stageIndex = 3
            }
          } else if (res.data.stage === 2) {
            // 点亮提交申请、等待受理 、寄回商品
            _this_.stageIndex = 3
          } else if (res.data.stage === 3) {
            // 点亮提交申请、等待受理 、寄回商品
            _this_.stageIndex = 3
          } else if (res.data.stage === 5) {
            if (res.data.type === 1 || res.data.needBackProduct === 0) {
              // 点亮提交申请、等待受理、等待退款、完成退款
              _this_.stageIndex = 4
            } else {
              // 点亮提交申请、等待受理 、寄回商品、客服收货、完成退款
              _this_.stageIndex = 5
            }
          } else {
            // 点亮提交申请、等待受理
            _this_.stageIndex = 2
          }
        }
      }).catch(e => {
        console.log(e)
      });
    },
    methods: {
      goAfterServiceApply () {
        this.$router.push('/afterServiceApply?orderServiceId=' + this.orderServiceId)
      },
      goLogisticsForm () {
        let _this_ = this
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/afterSales/submitAfterSalesDetail/' + _this_.orderServiceId
        }).then(res => {
          if (res.status === 100) {
            _this_.$router.push({ path: '/logisticsForm', query: { orderServiceId: _this_.orderServiceId, expressAddr: res.data.expressAddr, expressReceiveUser: res.data.expressReceiveUser } })
          }
        }).catch(e => {
          console.log(e)
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.after-service-detail {
  height: 100%;
  background-color: #f2f2f2;
  .after-service-header {
    background: #333333;
    height: 96px;
    display: flex;
    .header {
      overflow: hidden;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .icon {
        position: relative;
        width: 16px;
        height: 16px;
        background-repeat: no-repeat;
        background-image: url("../../../../assets/images/unreach_icon_32@2x.png");
        background-size: 100%;
        margin-bottom: 9.5px;
      }
      &:not(:first-child) {
        .icon {
          &::before {
            position: absolute;
            content: "";
            width: 50px;
            border-top: 1px solid #AAAAAA;
            display: block;
            top: 8px;
            right: 18px;
          }
        }
      }
      &:not(:last-child) {
        .icon {
          &::after {
            position: absolute;
            content: "";
            width: 50px;
            border-top: 1px solid #AAAAAA;
            display: block;
            top: 8px;
            left: 18px;
          }
        }
      }
      .text {
        width: 2em;
        color: #AAAAAA;
        font-size: 12px;
      }
    }
    .header-highlight {
      .icon {
        background-image: url("../../../../assets/images/reach_icon_32red@2x.png");
      }
      &:not(:first-child) {
        .icon {
          &::before {
            border-top: 1px solid #FF6648;
          }
        }
      }
      &:not(:last-child) {
        .icon {
          &::after {
            border-top: 1px solid #FF6648;
          }
        }
      }
      .text {
        color: #FF6648;
      }
    }
  }
  .after-service-info {
    padding: 0 15px;
    background-color: #FFFFFF;
    font-size: 15px;
    color: #333333;
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
    .button-wrapper {
      text-align: right;
      font-size: 12px;
      .button {
        display: inline-block;
        padding: 4.5px 14.5px;
        text-align: center;
        height: 17px;
        line-height: 17px;
        color: #FF6648;
        background: #FFFFFF;
        border: 1px solid #FF6648;
        border-radius: 100px;
      }
    }
  }
}
</style>

