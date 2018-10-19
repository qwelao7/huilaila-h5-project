<template>
  <div class="bill-detail commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header"
                :left-options="{ backText: '' }" :title=title></x-header>

        <div v-if="info.sysUserAccountDetailId">

          <div class="header">
            <div class="title">
            <span class="icon"
                  :style="{ backgroundImage: info.type == 2 && info.specialType == 24 ? 'url(' + require('../../../assets/images/billIcon/7.png') + ')' : 'url(' + require('../../../assets/images/billIcon/' + info.type + '.png') + ')' }"></span>
              <span class="name" v-text="info.billTitle || info.storeName"></span>
            </div>
            <b class="money" v-text="info.moneyChange"></b>
            <span class="tips" v-text="info.type == 3 ? '退款成功' : '交易成功'"></span>
          </div>

          <div class="form-preview">
            <div class="form-preview-item">
              <label class="form-preview-label">类型：</label>
              <span class="form-preview-value" v-text="handleTypes(info)"></span>
            </div>
            <div class="form-preview-item">
              <label class="form-preview-label">时间：</label>
              <span class="form-preview-value" v-text="info.intime"></span>
            </div>
            <div class="form-preview-item">
              <label class="form-preview-label" v-text="info.type == 2 ? '支付方式：' : '来源：'"></label>
              <span class="form-preview-value" v-text="handlePayType(info)"></span>
            </div>
            <div class="form-preview-item" v-if="info.returnBackReason">
              <label class="form-preview-label">退款原因：</label>
              <span class="form-preview-value" v-text="info.returnBackReason"></span>
            </div>
            <div class="form-preview-item" v-if="!((info.type == 2 || info.type == 3) && info.moneyType !== 5)">
              <label class="form-preview-label">交易后余额：</label>
              <span class="form-preview-value" v-text="handleMoney(info.money)"></span>
            </div>
          </div>

        <div class="form-preview"
             v-if="(info.type == 2 && info.specialType == 21) || (info.type == 3 && info.specialType == 31)">
            <b class="title">内容：</b>
            <div class="form-preview-item">
              <label class="form-preview-label">订单号：</label>
              <span class="form-preview-value" v-text="info.orderNo"></span>
            </div>
            <div class="form-preview-item">
              <label class="form-preview-label">门店名称：</label>
              <span class="form-preview-value" v-text="info.storeName"></span>
            </div>
            <div class="form-preview-item" v-if="info.productList && info.productList.length > 0">
              <label class="form-preview-label">订单明细：</label>
              <span class="form-preview-value">
                <span v-for="productItem in info.productList"
                      v-text="productItem.productName + ' ' + productItem.itemPrice + productItem.productUnit + ' X' + productItem.itemNum"></span>
              </span>
            </div>
          </div>

          <div class="form-preview" v-if="info.type == 2 && info.specialType == 24">
            <b class="title">内容：</b>
            <div class="form-preview-item">
              <label class="form-preview-label">付款单号：</label>
              <span class="form-preview-value" v-text="info.serialNumber"></span>
            </div>
          <span class="estates-list" v-for="estatesItem in info.estatesList"
                v-if="info.estatesList && info.estatesList.length > 0">
              <div class="form-preview-item">
                <label class="form-preview-label">类型：</label>
                <span class="form-preview-value" v-text="estatesItem.item"></span>
              </div>
              <div class="form-preview-item">
                <label class="form-preview-label">收费地址：</label>
                <span class="form-preview-value" v-text="estatesItem.itemAddress"></span>
              </div>
              <div class="form-preview-item" v-if="estatesItem.billDetailList && estatesItem.billDetailList.length > 0">
                <label class="form-preview-label">缴费详情：</label>
                <span class="form-preview-value">
                  <span v-for="estatesItem in estatesItem.billDetailList"
                        v-text="estatesItem.billPeriod + ' ¥' + estatesItem.totalPrice"></span>
                </span>
              </div>
            </span>
          </div>

        <div class="form-preview"
             v-if="(info.type == 2 && info.specialType == 26) || (info.type == 3 && info.specialType == 36) || (info.type == 6 && info.specialType == 63)">
            <b class="title">内容：</b>
            <div class="form-preview-item">
              <label class="form-preview-label">订单号：</label>
              <span class="form-preview-value" v-text="info.orderNo"></span>
            </div>
            <div class="form-preview-item">
              <label class="form-preview-label">活动名称：</label>
              <span class="form-preview-value" v-text="info.activityName"></span>
            </div>
            <div class="form-preview-item">
              <label class="form-preview-label">报名明细：</label>
              <span class="form-preview-value">
                <span v-text="info.joinMoney + '元/人' + ' X' + info.applyUserCount"></span>
              </span>
            </div>
          </div>

        </div>

    </view-box>

  </div>
</template>
<script>
  import {ViewBox, XHeader} from 'vux'

  export default {
    name: 'bill-detail',
    components: {
      ViewBox,
      XHeader
    },
    data () {
      return {
        title: '账单详情',
        types: ['', '充值', '消费', '退款', '', '提现', '收益'],
        payType: ['线下支付', '支付宝支付', '银联支付', '微信支付', '一网通支付', '钱包支付', '通联支付', '农行掌银支付', '', '线上支付', '回来啦社区充值卡', 'POS支付', '微信支付', '微信支付', '微信支付', '会员卡支付'],
        sysUserAccountDetailId: '',
        info: {}
      }
    },
    created () {
      let _this_ = this
      _this_.sysUserAccountDetailId = _this_.$route.query.sysUserAccountDetailId
      _this_.$JHttp({
        method: 'GET',
        url: window.baseURL + '/userAccount/myBillDetail/' + _this_.sysUserAccountDetailId
      }).then(res => {
        if (res.status === 100) {
          _this_.info = res.data
        }
      }).catch(e => {
        console.log(e)
      });
    },
    methods: {
      handleMoney (money) {
        let arr = (money + '').split('.')
        if (arr[1]) {
          if (arr[1].length === 1) {
            arr[1] = arr[1] + '0'
            return '¥' + arr.join('.')
          } else {
            return '¥' + money
          }
        } else {
          return '¥' + arr[0] + '.00'
        }
      },
      handleTypes (info) {
        if (info.type === 5 && info.specialType === 50) { // 提现 - 充值提现
          return '充值退款'
        } else {
          return this.types[info.type]
        }
      },
      handlePayType (info) {
        if (info.type === 5) { // 提现
          if (info.specialType === 50) { // 充值提现
            return '线下提现'
          }
          return '钱包支付'
        } else {
          return this.payType[info.moneyType]
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .bill-detail {
  height: 100%;
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #333333;
    margin: 0 15px;
    .title {
      display: flex;
      align-items: center;
      .icon {
        width: 22px;
        height: 22px;
        margin: 15px 10px 20px 0;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
      .name {
        font-size: 15px;
      }
    }
    .money {
      font-size: 27px;
    }
    .tips {
      font-size: 12px;
      margin-bottom: 19px;
    }
  }
  .form-preview {
    position: relative;
    background-color: #ffffff;
    line-height: 21px;
    font-size: 15px;
    color: #333333;
    margin: 0 15px;
    padding: 15px 0;
    border-top: 1px dashed #AAAAAA;
    .title {
      font-size: 18px;
      color: #333333;
      margin-bottom: 15px;
    }
    .estates-list {
      &:not(:last-child) {
        padding-bottom: 15px;
        margin-bottom: 15px;
        border-bottom: 0.026667rem dashed #AAAAAA;
      }
    }
    .form-preview-item {
      overflow: hidden;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
      .form-preview-label {
        float: left;
        min-width: 76px;
        text-align: left;
        /*text-align-last: justify;*/
      }
      .form-preview-value {
        display: block;
        overflow: hidden;
        word-break: normal;
        word-wrap: break-word;
        text-align: right;
      }
    }
  }
  }
</style>
