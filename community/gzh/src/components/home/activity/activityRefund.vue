<template>
  <div class="publish commonHeader no-margin-top" style="background-color: #f5f5f5">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="退款设置"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <group>
        <cell class="amount-title">
          <div slot="title" class="amountDetail-title">待退款金额(元): <span>{{totalRefund}}</span></div>
        </cell>
      </group>
      <div class="signUp">
        <ul v-if="!needDetail" v-for="(item,index) in applyList">
          <li class="others">
            <img :src="item.activityJoinUserPhoto" alt="" v-if="item.activityJoinUserPhoto">
            <img src="../../../assets/images/default_avatar.png" alt="" v-if="!item.activityJoinUserPhoto">
            <span class="others-name">{{item.activityJoinUserName}}</span><span class="applyUserCount">({{item.joinUserCount}}人)</span>
            <input type="text" class="refundMoney" placeholder="请输入退款金额" @change="refundChange(index)"
                   v-model="item.refund">
          </li>
        </ul>

        <ul v-if="needDetail" v-for="(item,index) in applyList">
          <li>
            <div class="signUpPeople_informaton">
              <div class="left">
                <div class="signUpPeople_pic">
                  <img :src="item.activityJoinUserPhoto" alt="" v-if="item.activityJoinUserPhoto">
                  <img src="../../../assets/images/default_avatar.png" alt="" v-if="!item.activityJoinUserPhoto">
                </div>
                <div class="sp_name">
                  <p class="name">
                    {{item.activityJoinUserName}}
                    <span class="num">({{item.joinUserCount}}人)</span>
                  </p>
                  <input type="text" class="refundMoney" style="float: right" placeholder="请输入退款金额"
                         v-model="item.refund"
                         @change="refundChange(index)">
                </div>
              </div>
            </div>
            <template v-for="itm in item.refundRelationUserVList">
              <div class="signUpPeople_informaton apply-user">
                <div class="left">
                  <div class="signUpPeople_pic">
                    <img :src="itm.relationUserPhoto" alt="" v-if="itm.relationUserPhoto">
                    <img src="../../../assets/images/default_avatar.png" alt="" v-if="!itm.relationUserPhoto">
                  </div>
                  <div class="sp_name">
                    <p class="name">{{itm.relationUserName}}</p>
                  </div>
                </div>
              </div>
            </template>
          </li>
        </ul>
      </div>
      <div class="btn-submit">
        <x-button type="primary" action-type="button" v-if="isBalanced" style="background-color: #0DAB60"
                  @click.native="refundConfirm">确 定
        </x-button>
        <x-button type="primary" action-type="button" v-if="!isBalanced" style="background-color: #d8d8d8">确 定
        </x-button>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {
    XHeader,
    XTextarea,
    Actionsheet,
    Group,
    querystring,
    TransferDom,
    XDialog,
    Cell,
    PopupPicker,
    XInput,
    XButton,
    ViewBox
  } from 'vux'
  import {File} from '../../../common/js/Upload'
  import {JNavigator} from '../../../common/js/utils'
  import {Base64} from 'js-base64';

  export default {
    name: 'pub_newThings',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      XTextarea,
      Actionsheet,
      XDialog,
      Group,
      Cell,
      PopupPicker,
      XInput,
      XButton,
      ViewBox
    },
    data () {
      return {
        showDeleteMenu: false,
        communityId: '',
        totalRefund: 0,
        isBalanced: false,
        needDetail: false,
        applyList: [],
        refundData: []
      }
    },
    created () {
      this.$vux.loading.show({
        text: '加载中'
      });
      this.communityId = localStorage.getItem('communityId');
      this.totalRefund = toDecimal2(localStorage.getItem('totalRefund'))
      console.log('待退款金额', this.totalRefund)
      this.getApplyUser()
    },
    methods: {
      getApplyUser () {
        let _this = this;
        let refundData = JSON.parse(localStorage.getItem('refundData'))
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/refundUserList/?activityId=' + this.$route.params.activityId
        }).then(res => {
          if (res.status === 100) {
            _this.$vux.loading.hide()
            console.log('res.data', res.data);
            _this.applyList = res.data.activityJoinUserList
            _this.applyList.forEach(res => {
              if (res.activityJoinUserPhoto) {
                res.activityJoinUserPhoto = window.aliyunHome + res.activityJoinUserPhoto
              }
            })
            if (refundData !== null && refundData !== undefined && refundData !== '') {
              _this.refundData = refundData
              _this.applyList.forEach((item, index) => {
                item.refund = _this.refundData[index].fee
              })
              let refundTemp = 0
              _this.refundData.forEach(res => {
                refundTemp += parseFloat(res.fee)
              })
              refundTemp = toDecimal2(refundTemp)
              if (refundTemp === _this.totalRefund) {
                _this.isBalanced = true
              } else {
                _this.isBalanced = false
              }
            } else {
              _this.applyList.forEach(res => {
                let temp = {}
                temp.userId = res.activityUserId
                temp.fee = 0
                _this.refundData.push(temp)
              })
            }
            console.log('refundData', _this.refundData)
            if (res.data.needUserDetail === 0) {
              _this.needDetail = false
            } else {
              _this.needDetail = true
            }
            console.log('needDetail', _this.needDetail)
          }
        }).catch(err => {
          console.log(err);
        })
      },
      showDeletePop (index) {
        this.showDeleteMenu = true;
        this.currentIndex = index;
      },
      deleteImg () {
        this.localIds.splice(this.currentIndex, 1);
      },
      deleteReceiveAddress () {
        this.$router.push('/Login')
      },
      refundChange (index) {
        let _this = this
        console.log(_this.refundData)
        if (isNaN(parseFloat(_this.applyList[index].refund))) {
          _this.applyList[index].refund = 0
        }
        _this.refundData[index].fee = toDecimal2(_this.applyList[index].refund)
        let refundTemp = 0
        _this.refundData.forEach(res => {
          refundTemp += parseFloat(res.fee)
        })
        refundTemp = toDecimal2(refundTemp)
        if (refundTemp === _this.totalRefund) {
          _this.isBalanced = true
        } else {
          _this.isBalanced = false
        }
      },
      refundConfirm () {
        localStorage.setItem('refundData', JSON.stringify(this.refundData))
        console.log(localStorage.getItem('refundData'))
        this.$router.push('/activityBalance/' + this.$route.params.activityId)
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
  .publish {
    height: 100%;
    width: 100%;
    .amount-title {
      background-color: #f5f5f5;
      font-size: 14px;
      color: #aaa;
      .amountDetail-title {
        font-size: 14px;
        color: #333;
        span {
          color: #0DAB60;
          display: inline-block;
        }
      }
    ;
    }
    .signUp {
      background-color: #fff;
      padding: 0 15px;
      .apply-user {
        margin-left: 50px;
        border-top: 0.5px solid #d8d8d8;
        padding-top: 10px;
      }
      .others {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 79px;
        line-height: 79px;
        border-bottom: 0.5px solid #D8D8D8;
        padding: 0;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        span {
          margin-left: 10px;
          font-size: 15px;
          color: #333333;
        }
        .others-name {
          max-width: 100px;
          height: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .applyUserCount {
          color: #aaa;
          flex-grow: 1;
          margin-left: 5px;
        }
      }
      ul {
        width: 100%;
        li {
          width: 100%;
          padding: 20px 0;
          border-bottom: solid 0.5px #d8d8d8;
          .signUpPeople_informaton {
            position: relative;
            display: flex;
            padding-bottom: 10px;
            /*align-items: center;*/
            justify-content: space-between;
            .left {
              flex: 1;
              display: flex;
              align-items: center;
            }
            .signUpPeople_pic {
              width: 40px;
              height: 40px;
              border-radius: 100%;
              display: inline-block;
              vertical-align: middle;
              margin-right: 10px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 100%;
              }
            }
            .sp_name {
              flex: 1;
              align-items: center;
              justify-content: center;
              vertical-align: middle;
              line-height: 30px;
              .nameBox {
                display: flex;
                align-items: center;
                margin-bottom: 3px;
              }
              .name {
                font-size: 15px;
                color: #333333;
                display: inline-block;
              }
              .num {
                display: inline-block;
                font-size: 15px;
                color: #AAAAAA;
              }
              .apply_name {
                display: inline-block;
                height: 100%;
                line-height: 40px;
              }
            }
          }
          .note {
            width: 100%;
            padding: 10px 0;
            box-sizing: border-box;
            /*background: #F5F5F5;*/
            color: #333;
            font-size: 12px;
            margin-top: 10px;
          }
        }
      }
    }
    .noContent {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 124px;
      margin-bottom: 248px;
      z-index: 999;
      img {
        width: 150px;
        height: 150px;
      }
      p {
        margin-top: 10px;
        color: #aaaaaa;
        font-size: 15px;
      }
      span {
        width: 150px;
        height: 35px;
        margin-top: 20px;
        line-height: 35px;
        text-align: center;
        background-color: #0DAB60;
        color: #ffffff;
        font-size: 15px;
        border-radius: 67px;
      }
    }
    .signUp_bottom {
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      div {
        height: 50px;
        line-height: 50px;
        background: #0DAB60;
        color: #ffffff;
        font-size: 18px;
        text-align: center;
      }
      .cantPickUp {
        display: flex;
        height: auto;
        line-height: normal;
        justify-content: center;
        flex-direction: column;
        background-color: #ffffff;
        padding: 7.5px 0;
        border-top: 0.5px solid #D8D8D8;
        p {
          text-align: center;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333333;
        }
        span {
          font-size: 12px;
        }
      }
    }
    .refundMoney {
      width: 140px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      border: 0.5px solid #d8d8d8;
      padding-left: 5px;
    }
  }

  .btn-submit {
    padding: 0 15px;
    margin: 50px 0;
  }

</style>
