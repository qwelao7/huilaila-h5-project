<template>
  <div class="order-detail commonHeader">
    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">

      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title><a class="custom-service" :href="'tel:'+ storePhone" slot="right">联系客服</a></x-header>

      <div class="order-qrcode" @click="onClickQrCode" v-if="orderQRCodeStatus">
        <div class="left">订单二维码</div>
        <div class="right">
          <div class="icon-qrcode"></div>
          <div class="icon-arrow"></div>
        </div>
      </div>

      <div class="form-preview order-desc">
        <span class="icon-detail" @click="goHandleDetail" v-if="orderStatus !== 0 && orderStatus !== 1 && orderStatus !== 5">
          <span class="text">处理详情</span>
          <span class="icon-arrow"></span>
        </span>
        <div class="form-preview-item">
          <label class="form-preview-label">订单状态：</label>
          <span class="form-preview-value">
            <span class="order-status" v-text="orderStatus_[orderStatus].text" :style="{ background: orderStatus_[orderStatus].backgroundColor }"></span>
          </span>
        </div>
        <div class="form-preview-item">
          <label class="form-preview-label">订单编号：</label>
          <span class="form-preview-value" v-text="orderNum"></span>
        </div>
        <div class="form-preview-item">
          <label class="form-preview-label">下单时间：</label>
          <span class="form-preview-value" v-text="time"></span>
        </div>
      </div>

      <div class="logistics-list" v-if="hasLogistics">
        <div v-for="item in logisticsList" @click="clickItem(item)">
          <logistics-item :item=item></logistics-item>
        </div>
      </div>

      <div class="delivery-info">
        <div class="icon-address"></div>
        <div class="info">
          <div class="info-item">
            <div class="left" v-text="'收货人：' + name"></div>
            <div class="right" v-text="phone"></div>
          </div>
          <div class="info-item" v-text="'收货地址：' + address"></div>
        </div>
      </div>

      <div class="line"></div>

      <div class="order-info">
        <div class="title" v-text="storeName"></div>

        <product-list :productList=productList></product-list>

        <div class="form-preview info">
          <div class="form-preview-item remake">
            <label class="form-preview-label ">备注信息：</label>
            <span class="form-preview-value" v-text="orderRemark"></span>
          </div>
          <div class="form-preview-item" v-if="deliveryType_[deliveryType]">
            <label class="form-preview-label">物流方式：</label>
            <span class="form-preview-value" v-text="deliveryType_[deliveryType]"></span>
          </div>
          <div class="form-preview-item" v-if="orderDate && orderTime">
            <label class="form-preview-label">服务时间：</label>
            <span class="form-preview-value" v-text="orderDate + ' ' + orderTime"></span>
          </div>
        </div>
      </div>

      <div class="form-preview money-info">
        <div class="form-preview-item">
          <label class="form-preview-label">合计金额：</label>
          <span class="form-preview-value" v-text="'¥' + totalMoney + freightMoneyDesc"></span>
        </div>
        <div class="form-preview-item">
          <label class="form-preview-label" v-text="isPay === 1 ? '实付金额：' : '应付金额：'"></label>
          <span class="form-preview-value" v-text="'¥' + money"></span>
        </div>
        <div class="form-preview-item">
          <label class="form-preview-label">付款方式：</label>
          <span class="form-preview-value" v-text="payType"></span>
        </div>
        <div class="form-preview-item" v-if="discountNum">
          <label class="form-preview-label">抵价票券：</label>
          <span class="form-preview-value" v-text="'使用' + discountNum + '张, 共价值¥' + orderMoneyDiscount"></span>
        </div>
      </div>

      <div class="feedback-info" v-if="aLifeOrderTaskInfoV">
        <div class="title">处理反馈</div>
        <div class="info">
          <div class="info-text" v-text="aLifeOrderTaskInfoV.remark"></div>
          <div class="info-img" v-if="aLifeOrderTaskInfoV.images && aLifeOrderTaskInfoV.images.length > 0">
            <img  v-for="img in aLifeOrderTaskInfoV.images" :src="img"/>
          </div>
        </div>
      </div>

      <div class="comment-info" v-if="appraise">
        <span class="icon-detail" @click="goCommentDetail" v-if="orderStatus == 4 && appraise.appraiseAgain === '1'">
          <span class="text">评价详情</span>
          <span class="icon-arrow"></span>
        </span>
        <div class="title">服务评价</div>
        <div class="info">
          <div class="comment-star">
            <div class="quality">
              <span>服务质量：</span>
              <star v-model="appraise.appraiseQuality" disabled :margin="5" :fontSize="12"></star>
            </div>
            <div class="speed">
              <span>响应速度：</span>
              <star v-model="appraise.appraiseSpeed" disabled :margin="5" :fontSize="12"></star>
            </div>
          </div>
          <div class="comment-text" v-text="appraise.appraiseContent"></div>
          <div class="comment-time" v-text="appraise.appraiseTime"></div>
          <div class="comment-img" v-if="appraise.appraiseImgList && appraise.appraiseImgList.length > 0">
            <img v-for="img in appraise.appraiseImgList" :src="img"/>
          </div>
          <div class="reply" v-if="appraise.isReply === '1'">
            <div class="reply-text" v-text="'回复：' + appraise.replyContent"></div>
            <div class="reply-time" v-text="appraise.replyTime"></div>
          </div>
        </div>
      </div>

      <div :style="{ 'margin-bottom': showBottomButton ? '1.867rem' : '0.533rem' }" ></div>

      <div class="button-apprise" v-if="orderStatus === 3" @click="goAppraise(0)">评价</div>
      <div class="button-apprise" v-if="orderStatus === 4 && (appraise && appraise.appraiseAgain === '0')" @click="goAppraise(1)">修改评价</div>

      <div class="button-cancel" v-if="orderStatus === 1 && moneyType === 0" @click="isCancelOrder">取消订单</div>

      <div class="button-double" v-if="orderStatus === 0 && subHandle === '1'">
        <div class="button-double-item button-double-cancel" @click="isCancelOrder">取消订单</div>
        <div class="button-double-item button-double-pay" @click="goPay">付款</div>
      </div>

      <!-- <div class="button-cancel" v-if="orderStatus == 0" @click="goCanCelOrder">申请取消服务</div> -->
    </view-box>
    <!-- 二维码 -->
    <div v-transfer-dom>
      <x-dialog v-model="showScrollBox" class="qr" hide-on-blur :dialog-style="{'max-width': '100%', width: '84%'}">
        <div class="order-detail-qrcode-swapper">
          <p class="order-detail-qrcode-header">订单二维码</p>
          <div class="order-detail-qrcode-content">
            <qrcode :value="qrcode" :size="150" type="img"></qrcode>
          </div>
          <p class="order-detail-qrcode-footer">到店后请向商家出示此二维码</p>
        </div>
      </x-dialog>
    </div>
    <!-- 二维码 -->
    <!--取消订单dialog begin-->
    <x-dialog class="cancel-order-wrapper" v-model="cancelOrderModalShow" :dialog-style="cancelOrderDialogStyle" hide-on-blur>
      <span class="delete-info vux-1px-b">你确定取消订单么?</span>
      <div class="operate-wrapper">
        <span class="text vux-1px-r" @click="cancelOrderModalShow = false">取消</span>
        <span class="text" @click="cancelOrder">确定</span>
      </div>
    </x-dialog>
    <!--取消订单dialog end-->
  </div>
</template>
<script>
  import { ViewBox, XHeader, TransferDom, XDialog, Qrcode, querystring } from 'vux'
  import productList from '../productList'
  import logisticsItem from './logisticsItem'
  import Star from '../../common/star'
  export default {
    name: 'order-detail',
    directives: {
      TransferDom
    },
    components: {
      ViewBox,
      XHeader,
      XDialog,
      Qrcode,
      Star,
      productList,
      logisticsItem
    },
    data () {
      return {
        cancelOrderModalShow: false,
        cancelOrderDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 0 0 0',
          borderRadius: '20px'
        },
        showBottomButton: false,
        title: '服务详情',
        orderId: '',
        storePhone: '',
        showScrollBox: false,
        orderQRCodeStatus: 0,
        qrcode: '',
        orderStatus_: [{
          text: '待付款',
          backgroundColor: '#D8D8D8'
        }, {
          text: '待接收',
          backgroundColor: '#D8D8D8'
        }, {
          text: '处理中',
          backgroundColor: '#FF8E13'
        }, {
          text: '待评价',
          backgroundColor: '#D8D8D8'
        }, {
          text: '已完成',
          backgroundColor: '#D8D8D8'
        }, {
          text: '已关闭',
          backgroundColor: '#D8D8D8'
        }, {
          text: '待处理',
          backgroundColor: '#D8D8D8'
        }],
        orderStatus: 0,
        orderNum: '',
        time: '',
        isPay: 0,
        hasLogistics: false,
        logisticsList: [],
        name: '',
        phone: '',
        address: '',
        productList: [],
        orderRemark: '',
        deliveryType_: ['', '快递', '预约上门', '用户自提'],
        deliveryType: '',
        storeName: '',
        orderTime: '',
        orderDate: '',
        totalMoney: '',
        freightMoneyDesc: '',
        money: '',
        orderMoneyExpenses: '',
        moneyType: 0,
        payType_: ['线下支付', '支付宝支付', '银联支付', '微信支付', '一网通支付', '钱包支付', '通联支付', '农行掌银支付', '', '线上支付', '回来啦社区充值卡', 'POS支付', '微信支付', '微信支付', '微信支付'],
        payType: '',
        aLifeOrderTaskInfoV: '',
        appraise: '',
        oldAppraise: '',
        subHandle: '',
        discountNum: '',
        orderMoneyDiscount: ''
      }
    },
    created () {
      this.orderId = this.$route.params.orderId
      this.getOrderDetail()
    },
    methods: {
      getOrderDetail (loaded) {
        let _this_ = this
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/order/getUserOrderDetail?orderId=' + _this_.orderId
        }).then(res => {
          if (res.status === 100) {
            _this_.orderStatus = res.data.orderStatus
            _this_.orderQRCodeStatus = res.data.orderQRCodeStatus
            _this_.qrcode = res.data.orderQRCode
            _this_.storePhone = res.data.storePhone
            _this_.orderNum = res.data.serialNumber
            _this_.time = res.data.referTime
            _this_.hasLogistics = !!res.data.hasLogistics
            if (_this_.hasLogistics) {
              _this_.$JHttp({
                method: 'get',
                url: window.baseURL + '/afterSales/getLogisticsList?orderId=' + _this_.orderId
              }).then(res => {
                if (res.status === 100) {
                  _this_.logisticsList = res.data
                }
              }).catch(e => {
                console.log(e)
              });
            }
            _this_.name = res.data.userName
            _this_.phone = res.data.userPhone.substring(0, 3) + '****' + res.data.userPhone.substring(7, 11)
            _this_.address = res.data.userAddress
            _this_.storeName = res.data.storeName
            _this_.productList = res.data.orderItem
            _this_.orderRemark = res.data.orderRemark || '无'
            _this_.deliveryType = Number(res.data.deliveryType)
            _this_.orderDate = res.data.orderDate
            _this_.orderTime = res.data.orderTime
            _this_.isPay = res.data.isPay
            _this_.totalMoney = res.data.orderMoneyTotal.toString().indexOf('.') === -1 ? res.data.orderMoneyTotal + '.00' : res.data.orderMoneyTotal
            _this_.money = res.data.orderMoney.toString().indexOf('.') === -1 ? res.data.orderMoney + '.00' : res.data.orderMoney
            _this_.orderMoneyExpenses = res.data.orderMoneyExpenses.toString().indexOf('.') === -1 ? res.data.orderMoneyExpenses + '.00' : res.data.orderMoneyExpenses
            _this_.discountNum = res.data.discountNum
            _this_.orderMoneyDiscount = res.data.orderMoneyDiscount.toString().indexOf('.') === -1 ? res.data.orderMoneyDiscount + '.00' : res.data.orderMoneyDiscount
            if (_this_.orderMoneyExpenses > 0) {
              if (res.data.deliveryType === '1') {
                _this_.freightMoneyDesc = '（含运费¥' + _this_.orderMoneyExpenses + '）'
              } else if (res.data.deliveryType === '2') {
                _this_.freightMoneyDesc = '（含服务费¥' + _this_.orderMoneyExpenses + '）'
              } else {
                _this_.freightMoneyDesc = ''
              }
            } else {
              if (res.data.deliveryType === '1') {
                _this_.freightMoneyDesc = '（免运费）'
              } else if (res.data.deliveryType === '2') {
                _this_.freightMoneyDesc = '（免服务费）'
              } else {
                _this_.freightMoneyDesc = ''
              }
            }
            _this_.moneyType = res.data.moneyType
            _this_.payType = _this_.payType_[_this_.moneyType] || '线上支付'
            _this_.subHandle = res.data.subHandle
            _this_.aLifeOrderTaskInfoV = res.data.aLifeOrderTaskInfoV
            _this_.appraise = res.data.appraise
            _this_.oldAppraise = res.data.oldAppraise
            if (_this_.orderStatus === 3 || (_this_.orderStatus === 4 && (_this_.appraise && _this_.appraise.appraiseAgain === '0')) || (_this_.orderStatus === 1 && _this_.moneyType === 0) || (_this_.orderStatus === 0 && _this_.subHandle === '1')) {
              _this_.showBottomButton = true
            } else {
              _this_.showBottomButton = false
            }
          }
        }).catch(e => {
          console.log(e)
        });
      },
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
      },
      onClickQrCode () {
        this.showScrollBox = true
      },
      goHandleDetail () {
        this.$router.push('/handleDetail/' + this.orderId)
      },
      goCommentDetail () {
        this.$router.push({
          path: '/evaluateDetail',
          query: {
            appraise: this.appraise,
            oldAppraise: this.oldAppraise
          }
        })
      },
      goAppraise (status) {
        let params = {
          orderId: this.orderId,
          isModify: status
        }
        let url = status === 0 ? '/evaluationForLifeService?' : '/modifyOrderAppraise?'
        this.$router.push(url + querystring.stringify(params))
      },
      isCancelOrder () {
        this.cancelOrderModalShow = true;
      },
      cancelOrder () {
        let _this_ = this
        _this_.$JHttp({
          method: 'put',
          url: window.baseURL + '/order/cancelOrder',
          params: {
            orderId: _this_.orderId
          }
        }).then(res => {
          if (res.status === 100) {
            _this_.$vux.toast.show({
              type: 'success',
              text: '取消成功'
            })
            _this_.$router.go(-1)
          }
        }).catch(e => {
          console.log(e)
        });
        _this_.cancelOrderModalShow = false
      },
      goPay () {
        this.$router.push('/selectPayType/' + this.orderId)
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.order-detail-qrcode-swapper {
  .order-detail-qrcode-header {
    font-size: 18px;
    color: #333333;
    padding: 12.5px 0;
    border-bottom: 0.5px dashed #AAAAAA;
  }
  .order-detail-qrcode-content {
    padding: 25px 0;
  }
  .order-detail-qrcode-footer {
    font-size: 12px;
    color: #333333;
    padding: 17px 0;
    border-top: 0.5px dashed #AAAAAA;
  }
}
.cancel-order-wrapper {
  .delete-info {
    color: #333;
    font-size: 14px;
    font-weight: bold;
    display: inline-block;
    width: 100%;
    padding-bottom: 20px;
  }
  .operate-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    .text {
      display: inline-block;
      width: 50%;
      height: 100%;
      line-height: 50px;
      color: #18adfb;
      font-size: 16px;
    }
  }
}
.order-detail {
  height: 100%;
  background-color: #f2f2f2;
  .custom-service {
    font-size: 15px;
    color: #333333;
  }
  .order-qrcode {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 345px;
    height: 51px;
    margin: 10px 0 0 0;
    padding: 0 15px;
    background-color: #ffffff;
    font-size: 15px;
    color: #333333;
    .left {
      height: 21px;
    }
    .right {
      display: flex;
      align-items: center;
      .icon-qrcode {
        margin-right: 10px;
        width: 16px;
        height: 16px;
        background-image: url("../../../assets/images/QRcode_icon_fitment.png");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
      .icon-arrow {
        width: 7px;
        height: 15px;
        background-image: url("../../../assets/images/arrow_icon_grey.png");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
    }
  }
  .order-status {
    width: 70px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    font-size: 12px;
    color: #FFFFFF;
    border-radius: 100px;
  }
  .icon-detail {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    width: 72px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    font-size: 12px;
    color: #FFFFFF;
    background: #FF6648;
    border-radius: 100px 0 0 100px;
    .text {
      margin-right: 5px;
    }
    .icon-arrow {
      width: 4px;
      height: 7.5px;
      background-image: url("../../../assets/images/arrow_icon_white.png");
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
    }
  }
  .form-preview {
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
  .order-desc {
    position: relative;
    margin: 10px 0;
  }

  .logistics-list {
    background-color: #FFFFFF;
    margin-bottom: 10px;
    padding: 0 15px;
    .logistics-item {
      &:not(:last-child) {
        border-bottom: 0.5px solid #D8D8D8;
      }
    }
  }

  .delivery-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: #FFFFFF;
    padding: 15px;
    .icon-address {
      width: 10px;
      height: 13.2px;
      padding: 1.3px 3px;
      margin-right: 15px;
      background-image: url("../../../assets/images/address_icon_32black.png");
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
    }
    .info {
      width: 100%;
      .info-item {
        &:not(:last-child) {
          margin-bottom: 10px;
        }
        .left {
          float: left;
        }
        .right {
          display: block;
          overflow: hidden;
          text-align: right;
        }
      }
    }
  }
  .money-info {
    margin-bottom: 15px;
  }
  .line {
    width: 100%;
    height: 5px;
    background: url("../../../assets/images/addressline_icon.png") repeat-x;
    background-size: contain;
    margin-bottom: 10px;
  }
  .order-info {
    background-color: #FFFFFF;
    padding: 12px 15px 20px;
    margin-bottom: 10px;
    .title {
      padding-bottom: 15px;
      /*border-bottom: 0.5px solid #D8D8D8;*/
    }
    .info {
      padding: 0;
      .remake {
        padding-bottom: 15px;
        margin-bottom: 20px;
        border-bottom: 0.5px solid #D8D8D8;
      }
    }
  }
  .feedback-info {
    background-color: #FFFFFF;
    padding: 15px;
    margin-bottom: 10px;
    font-size: 15px;
    color: #333333;
    .title {
      padding-bottom: 15px;
      border-bottom: 0.5px solid #D8D8D8;
    }
    .info {
      .info-text {
        padding: 15px 0;
      }
      .info-img {
        display: flex;
        img {
          width: 70px;
          height: 70px;
          &:not(:last-child) {
            margin-right: 21.5px;
          };
        }
      }
    }
  }
  .comment-info {
    position: relative;
    background-color: #FFFFFF;
    padding: 11.5px 15px 0;
    .title {
      padding-bottom: 11.5px;
      border-bottom: 0.5px solid #D8D8D8;
    }
    .info {
      .comment-star {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 20px 0 11px 0;
        .quality {
          display: flex;
          align-items: center;
          margin-right: 20px;
        }
        .speed {
          display: flex;
          align-items: center;
        }
      }
      .comment-text {
        font-size: 18px;
        color: #333333;
        margin-bottom: 5px;
      }
      .comment-time {
        font-size: 12px;
        color: #AAAAAA;
        padding-bottom: 15px;
      }
      .comment-img {
        display: flex;
        padding-bottom: 20px;
        img {
          width: 75px;
          height: 75px;
          &:not(:last-child) {
            margin-right: 15px;
          };
        }
      }
      .reply {
        background: #F8F8F8;
        padding: 10px;
        .reply-text {
          font-size: 15px;
          color: #333333;
          margin-bottom: 10px;
        }
        .reply-time {
          font-size: 12px;
          color: #AAAAAA;
        }
      }
    }
  }
  .button-cancel {
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #FFFFFF;
    background: #AAAAAA;
  }
  .button-apprise {
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #FFFFFF;
    background: #FF6648;
  }
  .button-double {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #FFFFFF;
    text-align: center;
    .button-double-item {
      width: 50%;
    }
    .button-double-cancel {
      background: #AAAAAA;
    }
    .button-double-pay {
      background: #FF6648;
    }
  }
}
</style>
