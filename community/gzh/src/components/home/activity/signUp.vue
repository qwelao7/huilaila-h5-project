<template>
  <div class="signUp commonHeader">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}" title="报名"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div class="signUpBanner">
        <group class="signUpList">
          <cell-box class="item">
            <div class="address">
              <i class="icon"></i>
              <span>{{signInfo.activityAddress}}</span>
            </div>
          </cell-box>
          <cell-box class="item noline">
            <div class="address">
              <i class="icon_1"></i>
              <span>{{signInfo.startDate}}</span>
            </div>
          </cell-box>
          <cell-box class="item noline" v-show="signInfo.joinMoney">
            <div class="address">
              <i class="icon_2"></i>
              <span>¥ {{signInfo.joinMoney}}/人</span>
            </div>
          </cell-box>
        </group>
        <div class="spacing-container"></div>
        <group class="signUpList">
          <cell-box link="/joinPeople" class="item noline" v-show="signInfo.needUserDetail">
            <div class="people">
              <i class="icon"></i>
              <span>{{ApplyInfo.length}}人</span>
              <!--<span>{{joinPeopleAccount}}人</span>-->
              <ul>
                <li v-for="item in showApply">
                  <div v-if="item.completed">
                    <img style="width: 100%;height: 100%;" :src="item.joinUserPhoto" alt="" v-show="item.joinUserPhoto">
                    <img style="width: 100%;height: 100%;" src="../../../assets/images/default_avatar.png" alt=""
                         v-show="!item.joinUserPhoto">
                  </div>
                </li>
              </ul>
            </div>
          </cell-box>
          <cell-box class="item" v-show="!signInfo.needUserDetail">
            <div class="people noDetail">
              <div>
                <i class="icon"></i>
                <!--<span>{{signInfo.applyUserCount}}人</span>-->
                <span>{{joinPeopleAccount}}人</span>
              </div>
              <x-number :min="1" :max="99" :value="1" @on-change="change" v-model="joinPeopleAccount"
                        fillable></x-number>
            </div>
          </cell-box>
          <!--<template v-for="item in extraInfo" v-if="extraInfo.length>0">-->
            <!--<x-input :placeholder="item.columnName" v-model="item.columnValue" required></x-input>-->
          <!--</template>-->
        </group>
        <group v-if="extraInfo.length>0">
          <cell v-for="item in extraInfo">
            <div slot="title" class="amountDetail-title">{{item.columnName}}</div>
            <div slot="inline-desc" class="amountDetail-info">
              <x-input type="text" v-model="item.columnValue" required></x-input>
            </div>
          </cell>
        </group>

        <group class="options">
          <x-textarea placeholder="如您有什么特别需求可告知我们..." :height="130" :rows="8" :cols="30" :max="500"
                      :show-counter="false" v-model="note" @on-focus="showBtn = false"
                      @on-blur="showBtn = true"></x-textarea>
        </group>
      </div>
      <div slot="bottom" v-show="isOriginHei">
        <div class="signUp_bottom" v-show="signInfo.joinMoney">
          <div class="refund_time" v-show="!signInfo.refundType">{{signInfo.applyEndDate}} 前取消报名可全额退款</div>
          <div class="refund_time" v-show="signInfo.refundType">注意啦，报名费不可退</div>
          <div class="signUp_next">
            <div class="activity_pic">
              <span class="all">合计：</span>
              <span class="price">
            <span style="font-size: 12px;">¥</span>
            {{payMoney}}
          </span>
              <i :class="{activity_i: showDetail}" @click="showMore" v-show="payMoney > 0"></i>
            </div>
            <div class="activity_next" @click="submit">下一步</div>
          </div>
        </div>
        <div v-show="!signInfo.joinMoney" class="signUp_up" @click="submit">确认提交</div>
      </div>
    </view-box>
    <div v-transfer-dom>
      <popup v-model="showPayWay" posotion="bottom" class="feePopup payPopup" :hide-on-blur="false">
        <div class="wholePage">
          <div class="total">
            <i @click="paySoon"></i>
            <p>应付金额</p>
            <p class="money">¥<span>{{payMoney}}</span></p>
          </div>
          <div class="reFound">
            <group title="选择支付方式">
              <radio :options="PaySelection" @on-change="selectPayType" v-model="payType"></radio>
            </group>
          </div>
          <div class="goPay">
            <button @click="toPay">确认支付</button>
          </div>
        </div>
      </popup>
    </div>
    <div v-transfer-dom class="payFeePopup">
      <!--<popup v-model="showDetail" class="payPopup" height="100%" :show-mask="false" :popup-style="style">-->

      <!--<div class="content">-->
      <!--<div class="content-tit">-->
      <!--<p class="items">报名费</p>-->
      <!--<p class="plus">¥<span>{{signInfo.joinMoney}}</span>X<span>{{ApplyInfo.length}}</span></p>-->
      <!--</div>-->
      <!--</div>-->
      <!--</popup>-->
      <popup v-model="showDetail" class="payPopup" height="70%" :popup-style="{'background-color': '#f5f5f5'}">
        <div class="content">
          <div class="content-tit">
            <p class="items">报名费</p>
            <p class="plus" v-show="signInfo.needUserDetail">¥<span>{{signInfo.joinMoney}}</span>×<span>{{ApplyInfo.length}}</span>
            </p>
            <p class="plus" v-show="!signInfo.needUserDetail">¥<span>{{signInfo.joinMoney}}</span>×<span>{{joinPeopleAccount}}</span>
            </p>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import {
    XHeader,
    ViewBox,
    Group,
    CellBox,
    XTextarea,
    XButton,
    XInput,
    XNumber,
    Popup,
    Radio,
    TransferDom,
    querystring
  } from 'vux'
  import wallet from '../../../assets/images/wallet_icon_payway.png'
  import wePay from '../../../assets/images/wechat_icon_payway.png'

  export default {
    name: 'signUp',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      ViewBox,
      Group,
      CellBox,
      XTextarea,
      XInput,
      XNumber,
      XButton,
      Popup,
      Radio
    },
    data () {
      return {
        extraInfo: [],
        joinPeopleAccount: 0,
        signInfo: {},
        note: '',
        ApplyInfo: JSON.parse(localStorage.getItem('setApplyInfo')) || [],
        joinUserIds: [],
        showApply: {},
        showDetail: false,
        showMoneyDetail: false,
        showPayWay: false,
        PaySelection: [
//          {
//            icon: wallet,
//            key: 0,
//            value: '钱包支付'
//          },
          {
            icon: wePay,
            key: 1,
            value: '微信支付'
          }
        ],
//        payMoney: 0,
        payType: 1,
        style: {
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          bottom: '50px'
        },
        payData: {},
        applyId: '',
        isOriginHei: true,
        screenHeight: document.body.clientHeight, // 这里是给到了一个默认值 （这个很重要）
        originHeight: document.body.clientHeight, // 默认高度在watch里拿来做比较
        isApp: '',
        payNo: '',
        flag: true
      }
    },
    created () {
      this.isApp = localStorage.getItem('isApp')
      this.getData()
    },
    beforeRouteLeave (to, from, next) {
      if (to.path.match('/activityDetail')) {
        localStorage.removeItem('setApplyInfo')
        next()
      } else {
        next()
      }
    },
    mounted () {
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenHeight = document.body.clientHeight
          that.screenHeight = window.screenHeight
        })()
      }
    },
    watch: {
      screenHeight (val) {
        if (this.flag) {
          this.flag = false
          return
        }
        this.screenHeight = val
        if (this.originHeight !== val) {
          this.isOriginHei = false
        } else {
          this.isOriginHei = true
        }
      }
    },
    computed: {
      payMoney () {
        let val = 0;
        if (this.signInfo.needUserDetail) {
          val = toDecimal2(this.signInfo.joinMoney * this.ApplyInfo.length)
        } else {
          val = toDecimal2(this.signInfo.joinMoney * this.joinPeopleAccount)
        }
        return val
      }
    },
    methods: {
      getData () {
        // /activity/apply/detail
        let _this = this;
        let params = {
          activityId: _this.$route.params.id
        };
        _this.$vux.loading.show({
          text: '加载中'
        });
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getActivityDetail?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            _this.$vux.loading.hide();
            _this.signInfo = res.data;
//            if (_this.signInfo.joinMoney > 0 && _this.ApplyInfo.length > 0) {
//              _this.payMoney = toDecimal2(_this.signInfo.joinMoney * _this.ApplyInfo.length)
//            }
            _this.showApply = _this.ApplyInfo;
            _this.extraInfo = res.data.formColumnList
            console.log(_this.extraInfo)
            if (_this.showApply.length >= 6) {
              _this.showApply = _this.showApply.slice(0, 6);
            }
          }
        }).catch(e => {
          console.log(e)
        })
      },
      change (value) {
        this.joinPeopleAccount = value
        this.signInfo.applyUserCount = value
      },
      submit () {
        if (this.signInfo.needUserDetail) {
          if (this.ApplyInfo.length) {
            let arr = []
            this.ApplyInfo.forEach(res => {
              arr.push(res.userId)
            })
            this.joinUserIds = arr.join(',')
            this.joinPeopleAccount = this.ApplyInfo.length
            this.signInfo.applyUserCount = this.ApplyInfo.length
          } else {
            this.$vux.toast.show({
              type: 'text',
              text: '报名人信息不能为空'
            })
            return
          }
        } else {
          if (this.joinPeopleAccount <= 0) {
            this.$vux.toast.show({
              type: 'text',
              text: '报名人数不能为空'
            })
            return
          }
        }
        if (this.note && !this.note.trim()) {
          this.$vux.toast.show({
            type: 'text',
            text: '备注不能为空！'
          })
          return
        }
        let columnTemp = []
        this.extraInfo.forEach(res => {
          if (!res.columnValue.trim()) {
            this.$vux.toast.show({
              type: 'text',
              text: '附加信息不能为空！'
            })
            return
          }
          columnTemp.push(res.columnId + ':' + res.columnValue)
        })
        let params = {
          activityId: this.signInfo.activityId,
          joinUserCount: this.joinPeopleAccount,
          joinUserIds: this.joinUserIds,
          note: this.note,
          formColumnsList: columnTemp,
          wxPayCallType: ''
        }
        if (this.signInfo.joinType) {
          if (this.isApp) {
            params.wxPayCallType = 2
          } else {
            params.wxPayCallType = 1
          }
        }
        console.log(111, params)
        this.$vux.loading.show({
          text: ' '
        })
        let _this = this;
        _this.$JHttp({
          method: 'post',
          url: window.baseURL + '/socialactivity/activityApply?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          localStorage.removeItem('setApplyInfo')
          _this.$vux.loading.hide()
          if (res.status === 100) {
            if (_this.signInfo.joinMoney > 0) {
              _this.showPayWay = true;
              _this.payData = res.data.prepayOrder;
              _this.payNo = res.data.payNo
            } else {
              _this.$vux.toast.show({
                type: 'success',
                text: '报名成功'
              })
//              _this.$router.go(-1)
              setTimeout(function () {
                _this.$router.go(-1)
              }, 2000)
            }
          } else {
            _this.$vux.toast.show({
              type: 'text',
              text: res.msg
            })
          }
        }).catch(e => {
          _this.$vux.loading.hide()
          console.log(e)
        })
      },
      showMore () {
        if (this.payMoney > 0) {
          this.showDetail = !this.showDetail
        }
      },
      selectPayType (value, label) {
        this.payType = value;
      },
      paySoon () {
        let _this = this;
        _this.$vux.confirm.show({
          title: '稍后付款',
          content: '5分钟内未支付成功，报名将被取消，请尽快完成支付\n',
          confirmText: '稍后付款',
          cancelText: '继续付款',
          onConfirm () {
            _this.$router.go(-1)
          },
          onCancel () {
            _this.$vux.confirm.hide()
          }
        })
      },
      toPay () {
        let _this = this;
        _this.showPayWay = false;
        if (_this.payType === 1) {
          // prePay
          if (_this.isApp) {
//            console.log(11, _this.payData.mwebUrl)
//            alert(_this.payData.mwebUrl)
            location.href = _this.payData.mwebUrl
          } else {
            setTimeout(function () {
              _this.wxPay(_this.payData)
            }, 200)
          }
        } else {
          _this.$vux.toast.show({
            type: 'text',
            text: '请选择支付方式'
          })
        }
      },
      wxPay (data) {
        let _this = this;
        let params = {
//          prepayId: data.prepayid,
          payNo: _this.payNo,
          payType: 'WXPAY',
          serialNumber: data.serialNumber,
          wxPayCallType: ''
        }
        if (this.isApp) {
          params.wxPayCallType = 2
        } else {
          params.wxPayCallType = 1
        }
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getParamForPaymentInvoke?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          console.log(res)
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
//                    activityJoinUserId: _this.applyId,
                    serialNumber: data.serialNumber
                  }
                  _this.$JHttp({
                    method: 'put',
                    url: window.baseURL + '/socialactivity/activityApplyOrderSuc?' + querystring.stringify(backParams)
                  }).then(res => {
                    if (res.status === 100) {
                      // 支付成功，清除信息
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
            setTimeout(function () {
              _this.$router.go(-1)
            }, 2000)
          }
        }).catch(e => {
          console.log(e)
        })
      }
    }
  }

  // 制保留2位小数，不够的补上00即20.00
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
<style type="text/less" lang="less" scoped>
  .signUp {
    height: 100%;
    background-color: #ffffff;
    .signUpBanner {
      .spacing-container {
        width: 100%;
        height: 10px;
        background-color: #f5f5f5;
      }
      .item {
        div {
          display: flex;
          align-items: center;
          span {
            font-size: 15px;
            color: #333333;
            margin-left: 18px;
          }
          ul {
            display: flex;
            align-items: center;
            li:first-child {
              margin-left: 0;
            }
            li {
              border: 4px solid #ffffff;
              margin-left: -9px;
              border-radius: 50%;
              div {
                width: 26px;
                height: 26px;
                img {
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                }
              }
            }
          }
        }
        .people {
          i {
            background-image: url("../../../assets/images/user_icon_32black.png");
          }
          span {
            margin-left: 15px;
          }
        }
        .address .icon {
          background-image: url("../../../assets/images/address_icon_32black.png");
        }
        .address .icon_1 {
          background-image: url("../../../assets/images/time_icon_32black.png");
        }
        .address .icon_2 {
          background-image: url("../../../assets/images/fee_icon_32black.png");
        }
        .address {
          flex: 1;
          height: 21px;
          line-height: 21px;
          display: flex;
          align-items: center;
        }
        .address span {
          vertical-align: middle;
          flex: 1;
          font-size: 15px;
        }
        .icon {
          vertical-align: middle;
          width: 16px;
          height: 16px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
        .icon_1 {
          vertical-align: middle;
          width: 16px;
          height: 16px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
        .icon_2 {
          vertical-align: middle;
          width: 16px;
          height: 16px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
      .options{
        .weui-cells:before{
          border: none;
        }
        span{
          font-size: 21px;
          font-weight: bold;
        }
        .choose{
          color: #aaaaaa;
        }
        .arrow{
          width: .35rem;
          height: .35rem;
          background: url("../../../assets/images/arrow_icon_grey32.png") center no-repeat / contain;
        }
      }
    }
    .submitArea {
      /*flex: 1;*/
      padding: 20px 15px;
      display: flex;
      flex-direction: column;
      .linkTo{
        font-size: 12px;
        display: flex;
        flex-direction: row;
        a{
          color: #0DAB60;
          text-decoration: underline;
        }
      }
      .weui-btn_primary {
        margin: 20px auto;
        height: 44px;
        line-height: 44px;
        background-color: #0DAB60;
      }
    }
    .wholePage {
      background-color: #f7f7fa;
    }
    .signUp_bottom {
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      .refund_time {
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding-left: 15px;
        background: #f7f7f7;
        color: #869dc7;
      }
      .signUp_next{
        width:100%;
        height:50px;
        line-height: 50px;
        .activity_pic{
          width:50%;
          height:100%;
          float: left;
          border-top:solid 0.5px #D8D8D8;
          .all{
            color: #333;
            font-size: 12px;
            margin-left: 15px;
            display: inline-block;
          }
          .price {
            span {
              display: inline-block;
            }
            font-size: 18px;
            font-weight: 700;
            color: #0DAB60;
            display: inline-block;
          }
          i {
            width: 24px;
            height: 24px;
            display: block;
            background: url("../../../assets/images/arrow_close_greysmall.png") no-repeat;
            background-position: center;
            background-size: contain;
            float: right;
            margin-top: 13px;
            margin-right: 10px;
          }
          .activity_i {
            width: 24px;
            height: 24px;
            display: block;
            background: url("../../../assets/images/arrow_open_greysmall.png") no-repeat;
            background-position: center;
            background-size: contain;
            float: right;
            margin-top: 13px;
            margin-right: 10px;
          }
        }
        .activity_next {
          float: left;
          width: 50%;
          background: #0DAB60;
          color: #ffffff;
          height: 100%;
          line-height: 50px;
          font-size: 18px;
          text-align: center;
        }
      }
    }
    .signUp_up {
      width: 100%;
      height: 50px;
      background: #0DAB60;
      color: #ffffff;
      font-size: 18px;
      text-align: center;
      line-height: 50px;
      position: fixed;
      bottom: 0;
      left: 0;
    }
  }

  .amountDetail-title {
    font-size: 14px;
    color: #aaa;
  }

  .amountDetail-info {
    input {
      border: none;
      width: 100%;
      height: 26px;
      font-size: 20px;
      margin-top: 10px;
      line-height: 26px;
    }
  }
</style>
