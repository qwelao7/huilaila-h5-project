<template>
  <div class="commonHeader signDetail">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="报名详情"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div style="height: 100%">
        <j-pull :refreshFunc="refreshData">
          <div slot="jpull-list">
            <group class="title no-margin-top">
              <cell is-link :title="applyDetail.activityName" @click.native="toDetail(applyDetail.activityId)">
                <img slot="icon" :src="applyDetail.activityPicture" alt="">
              </cell>
            </group>
            <div class="joinPeople">
              <p class="joinTit">参与人</p>
              <group class="peopleList">
                <cell v-for="(item, index) in applyDetail.joinUserDetailList" :key="index" :is-link="true" @click.native="onClickQrCode(item, applyDetail)">
                  <div slot="title" class="userTitle">
                    <span>{{item.joinUserName}}</span>
                    <span>{{item.joinUserPhone}}</span>
                  </div>
                  <i slot="icon"></i>
                  <span slot="default" class="qrcode" v-show="applyDetail.payStatus !== 1"></span>
                </cell>
              </group>
            </div>
            <div class="joinDetail">
              <p class="joinTit">参与详情</p>
              <ul>
                <li>
                  <span>报名结束时间:</span>
                  <span>{{applyDetail.applyEndDate}}</span>
                </li>
                <li>
                  <span>活动开始时间:</span>
                  <span>{{applyDetail.startDate}}</span>
                </li>
                <li>
                  <span>活动地点:</span>
                  <span>{{applyDetail.activityAddress}}</span>
                </li>
                <li v-show="applyDetail.joinMoney > 0">
                  <span>报名费:</span>
                  <span>¥{{applyDetail.joinMoney}}/人</span>
                </li>
                <!--<li class="ps">-->
                <!--<span>备注:</span>-->
                <!--<span>需要提前热身</span>-->
                <!--</li>-->
              </ul>
            </div>
          </div>
        </j-pull>
      </div>
      <div v-if="applyDetail.activityStatus < 3" class="bottom">
        <div class="" @click="cancelApply(applyDetail)" v-if="showBottom">
          <span class="cancel">取消报名</span>
          <span>{{applyDetail.applyEndDate}} 前可取消</span>
        </div>
        <div class="needPay" @click="goPay(applyDetail)" v-if="applyDetail.payStatus === 1 && applyDetail.joinUserStatus === 0">
          <span class="cancel">去支付（¥{{payFee}}）</span>
          <span>请在5分钟内支付</span>
        </div>
        <div class="" v-if="applyDetail.joinUserStatus === 3">
          <span class="outTime">超时未支付，报名已失效</span>
        </div>
        <div class="" v-if="applyDetail.joinUserStatus === 1">
          <span class="outTime">报名已取消</span>
        </div>
      </div>
    </view-box>
    <!-- 二维码 -->
    <div v-transfer-dom>
      <popup v-model="qrCodePopup" height="100%" class="QRcode">
        <div class="identity">
          <x-header
            slot="header"
            :left-options="leftOpt"
            @on-click-back="hidePopup"
            style="background-color: transparent">
            <!--<a slot="right">取消报名</a>-->
          </x-header>
          <div class="banner">
            <div class="head">
              <p>活动凭证</p>
              <p>-{{applyDetail.communityName}}-</p>
            </div>
            <div class="qrCard">
              <div class="name">
                <span>{{qrItem.joinUserName}}</span>
                <span>{{qrItem.joinUserPhone}}</span>
              </div>
              <div class="qrPic">
                <!--<span>{{qrItem.joinCode}}</span>-->
                <!--<img src="" alt="">-->
                <qrcode :value="signLink" :size="124" type="img"></qrcode>
                <img class="hasSign" v-show="qrItem.signStatus" src="../../../assets/images/signedin_icon.png"/>
              </div>
              <ul>
                <li>
                  <span>活动名称：</span>
                  <span>{{applyDetail.activityName}}</span>
                </li>
                <li>
                  <span>活动地点：</span>
                  <span>{{applyDetail.activityAddress}}</span>
                </li>
                <li>
                  <span>活动开始时间：</span>
                  <span>{{applyDetail.startDate}}</span>
                </li>
                <li v-show="applyDetail.joinMoney > 0">
                  <span>报名费：</span>
                  <span>¥{{applyDetail.joinMoney}}/人</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </popup>
    </div>
    <!-- 二维码 -->
    <!--活动取消-->
    <div v-transfer-dom class="beCanceled">
      <x-dialog v-model="isCanceled">
        <div class="cancelBanner">
          <img src="../../../assets/images/eventcancelled_Illustration.png" alt="">
          <span class="big">很遗憾</span>
          <span class="big">组织者取消了活动</span>
          <span class="small">下次再来参加哦~</span>
        </div>
      </x-dialog>
    </div>
    <!--活动取消-->
  </div>
</template>
<script>
  import { XHeader, ViewBox, Group, Cell, TransferDom, Popup, Qrcode, querystring, XDialog } from 'vux'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'signDetail',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      ViewBox,
      JPull,
      Group,
      Cell,
      Popup,
      Qrcode,
      XDialog
    },
    data () {
      return {
        isCanceled: false,
        qrCodePopup: false,
        leftOpt: {
          backText: '',
          preventGoBack: true
        },
        applyDetail: {},
        qrItem: {},
        signLink: '',
        payFee: ''
      }
    },
    created () {
      this.getData()
    },
    computed: {
      showBottom () {
        if (this.applyDetail.activityStatus === 2 && this.applyDetail.joinUserStatus === 0 && this.applyDetail.payStatus !== 1) {
          return true
        } else {
          console.log(222)
          return false
        }
      }
    },
    methods: {
      refreshData (loaded) {
        this.applyDetail = [];
        this.getData(loaded)
      },
      getData (loaded) {
        let params = {
          activityJoinUserId: this.$route.params.id
        }
        let _this = this;
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getMyApplyDetail?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          console.log(res)
          if (loaded) {
            loaded()
          }
          if (res.status === 100) {
            _this.applyDetail = res.data
            if (_this.applyDetail.joinUserStatus === 2) {
              _this.isCanceled = true
            }
            _this.payFee = toDecimal2(_this.applyDetail.joinMoney * _this.applyDetail.joinUserDetailList.length)
//            if (_this.applyDetail.joinUserStatus === 3) {
//              _this.cancelApply(_this.applyDetail)
//            }
          }
        }).catch(e => {
          console.log(e)
        })
      },
      cancelApply (val) {
        let _this = this;
        let content;
        if (val.joinType === 0 && val.refundType === 1) {
          content = '确定取消报名？'
        } else if (val.joinType === 1 && val.refundType === 0) {
          content = '取消报名后，所有报名费将原路退回'
        } else if (val.joinType === 1 && val.refundType === 1) {
          content = '取消报名后，报名费将不可退回'
        }
        _this.$vux.confirm.show({
          title: '取消报名',
          content: content,
          confirmText: '确定',
          cancelText: '再想想',
          onConfirm () {
            let params = {
              activityJoinUserId: val.activityJoinUserId,
              signUserId: val.signUserId
            }
            _this.$JHttp({
              method: 'post',
              url: window.baseURL + '/socialactivity/cancelApplye?' + querystring.stringify(params),
              headers: {
                defCommunityId: localStorage.getItem('communityId')
              }
            }).then(res => {
              console.log(res)
              if (res.status === 100) {
                if (val.payStatus === 2 && !val.refundType) {
                  // 退款
                  let reFoundParams = {
                    activityJoinUserId: val.activityJoinUserId,
                    userId: val.signUserId
                  }
                  _this.$JHttp({
                    method: 'post',
                    url: window.baseURL + '/socialactivity/activityApplyFeeRefundApply?' + querystring.stringify(reFoundParams)
                  }).then(res => {
                    if (res.status === 100) {
                      _this.$vux.toast.show({
                        type: 'success',
                        text: '报名已取消'
                      })
                      _this.applyDetail.joinUserStatus = 1
                    }
                  }).catch(err => {
                    console.log(err)
                  })
                } else if (val.payStatus === 0) {
                  _this.$vux.toast.show({
                    type: 'success',
                    text: '报名已取消'
                  })
                  _this.applyDetail.joinUserStatus = 1
                } else if (val.refundType) {
                  _this.$vux.toast.show({
                    type: 'success',
                    text: '报名已取消'
                  })
                  _this.applyDetail.joinUserStatus = 1
                }
              } else {
                _this.$vux.toast.show({
                  type: 'cancel',
                  text: res.msg
                })
              }
            }).catch(e => {
              console.log(e)
            })
          },
          onCancel () {}
        })
      },
      toDetail (key) {
        this.$router.push('/activityDetail/' + key)
      },
      onClickQrCode (item, value) {
        if (value.payStatus !== 1 && value.joinUserStatus === 0) {
          this.qrCodePopup = true
          this.qrItem = item
          let businessParam = {
            businessCode: 30,
            idCode: item.joinCode
          };
          let location = window.location;
          this.signLink = location.origin + location.pathname + '#/oauth?out=1&businessParam=' + encodeURI(JSON.stringify(businessParam))
        }
      },
      hidePopup () {
        this.qrCodePopup = false
      },
      goPay (value) {
//        if (value.joinUserStatus)
        let _this = this;
        let params = {
          prepayId: value.prepayid,
          payType: 'WXPAY',
          serialNumber: value.serialNumber
        }
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getParamForPaymentInvoke?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            let val = res.data;
            _this.$wechat.chooseWXPay({
              timestamp: val.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: val.nonceStr, // 支付签名随机串，不长于 32 位
              package: val.packageStr, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: val.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: val.paySign, // 支付签名
              success: function (res) { // 支付成功后的回调函数
                console.log('微信支付结果', res)
                if (res.errMsg === 'chooseWXPay:ok') {
                  let backParams = {
                    activityJoinUserId: value.activityJoinUserId,
                    serialNumber: value.serialNumber
                  }
                  _this.$JHttp({
                    method: 'put',
                    url: window.baseURL + '/socialactivity/activityApplyOrderSuc?' + querystring.stringify(backParams)
                  }).then(res => {
                    if (res.status === 100) {
                      // 支付成功
                      _this.$router.push('/payResult')
                    }
                  }).catch(e => {
                    console.log(e)
                  })
                }
              },
              fail: function (err) {
                console.log(err)
              }
            })
          } else {
            _this.$vux.toast.show({
              type: 'text',
              text: res.msg
            })
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          }
        })
      }
    }
  }
  function toDecimal2 (x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    var f1 = Math.round(x * 100) / 100;
    var s = f1.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  }
</script>
<style type="text/less" lang="less">
  .beCanceled {
    .weui-mask {
      top: 44px;
    }
    .weui-dialog{
      width: 216px;
      height: 200px;
      border-radius: 10px;
      box-shadow: 1px 1px 4px 0;
      .cancelBanner{
        width: 120px;
        margin: 0 auto;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .big{
          font-size: 15px;
          color: #000000;
          font-weight: 600;
        }
        .small{
          margin-top: 10px;
          font-size: 12px;
          color: #aaaaaa;
        }
        img{
          width: 57.5px;
          height: 57.5px;
        }
      }

    }
  }
</style>
<style type="text/less" lang="less" scoped>
  .signDetail{
    background-color: #f7f7f7;
    height: 100%;
    .title{
      margin: 10px 0;
      background-color: #ffffff;
      padding: 15px;
      .weui-cell{
        padding: 0;
      }
      img{
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }
    .joinTit{
      font-size: 15px;
      padding: 15px;
    }
    .joinPeople{
      background-color: #ffffff;
      .peopleList{
        .weui-cell{
          padding: 15px;
        }
        .userTitle{
          span{
            font-size: 15px;
            display: inline-block;
          }
        }
        i{
          width: 16px;
          height: 16px;
          background-image: url("../../../assets/images/user_icon_32black.png");
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          margin-right: 15px;
        }
        .qrcode{
          width: 21px;
          height: 21px;
          background-image: url("../../../assets/images/QRcode_icon_fitment.png");
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          margin-right: 10px;
        }
        .check{
          color: #FF6648;
          font-size: 15px;
        }
      }
    }
    .joinDetail{
      background: #ffffff;
      margin-top: 10px;
      padding: 0 15px;
      p{
        border-bottom: 0.5px solid #D8D8D8;
        padding: 15px 0;
      }
      ul{
        padding: 15px 0;
        li{
          display: flex;
          padding-bottom: 10px;
          font-size: 15px;
          span:last-child{
            flex: 1;
            margin-left: 5px;
          }
        }
        .ps{
         padding-bottom: 0;
          padding-top: 5px;
        }
      }
    }
    .bottom{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: column;
      /*margin-top: 50px;*/
      /*align-items: center;*/
      justify-content: space-between;
      background-color: #aaaaaa;
      div{
        height: 50px;
        /*line-height: 50px;*/
      }
      span{
        font-size: 14px;
        color: #ffffff;
        text-align: center;
      }
      .cancel{
        font-size: 18px;
        /*background-color: #0DAB60;*/
      }
      .outTime{
        height: 50px;
        line-height: 50px;
        font-size: 18px;
      }
    }
    .needPay{
      background-color: #0DAB60;
    }
  }
</style>
