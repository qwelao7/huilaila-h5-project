<template>
  <div class="publish commonHeader no-margin-top" style="background-color: #f5f5f5">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        left-options.preventGoBack="true"
        @on-click-back="clickBack()"
        title="活动结算"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div class="newThings-banner" style="background-color: #fff">
        <template v-for="(item,index) in balanceInfo.balanceDetailVList">
          <group>
            <cell class="amount-title">
              <div slot="title" class="amount-title">费用明细{{index+1}}</div>
            </cell>
            <cell class="amount-list" title="费用金额(元)">{{item.fee}}</cell>
            <cell class="amount-list" title="费用说明">{{item.feeDesc}}</cell>
          </group>
          <div class="spacing-container"></div>
        </template>
        <group>
          <cell>
            <div slot="title" class="amountDetail-title">总费用金额 (元)：{{balanceInfo.totalExpense}}</div>
            <div slot="title" class="amountDetail-title">总收款金额 (元)：{{balanceInfo.totalIncome}}</div>
            <div slot="title" class="amountDetail-title">总退款金额 (元)：{{balanceInfo.totalRefund}}</div>
          </cell>
        </group>
        <div class="imgList" v-if="imgList&&imgList.length">
          <ul>
            <li class="first-item" v-for="(items, index) in imgList"
                v-bind:class="{ onePic: isOne }" style="">
              <img class="previewer-demo-img" :src="items.src" alt="" @click="show(index)">
            </li>
          </ul>
          <div v-transfer-dom>
            <previewer ref="previewer" :list="imgList" :options="options">
            </previewer>
          </div>
        </div>
        <div class="spacing-container"></div>
        <group>
          <ul style="margin: 0 15px">
            <template v-if="balanceInfo.balanceRefundVList.length>0">
              <cell style="color: #aaa;border-bottom: 0.5px solid #d8d8d8;padding: 10px 0">
                <div slot="title" class="amountDetail-title">共向{{balanceInfo.balanceRefundVList.length}}人退款</div>
              </cell>
            </template>
            <li class="others" v-for="item in balanceInfo.balanceRefundVList">
              <img :src="item.userHeadPhoto" alt="" v-if="item.userHeadPhoto">
              <img v-if="!item.userHeadPhoto" src="../../../assets/images/default_avatar.png" alt="">
              <span>{{item.userName}}</span><span class="applyUserCount">({{item.joinUserCount}}人)</span>
              <span>￥{{item.refundFee}}</span>
            </li>
          </ul>
        </group>
        <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
          <span class="delete-info vux-1px-b">您尚未绑定手机号</span>
          <div class="operate-wrapper">
            <span class="text vux-1px-r" @click="deleteModalShow = false">以后再说</span>
            <span class="text" @click="deleteReceiveAddress">前往绑定</span>
          </div>
        </x-dialog>
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
    Previewer,
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
      Previewer,
      ViewBox
    },
    data () {
      return {
        itemsIndex: '',
        isOne: false,
        localIds: [],
        showDeleteMenu: false,
        currentIndex: 0,
        menus: {
          menu: '删除'
        },
        communityId: '',
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        },
        balanceInfo: {},
        refund: 0,
        options: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index];
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect();
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        },
        imgList: []
      }
    },
    created () {
      this.$vux.loading.show({
        text: '加载中'
      });
      this.getInformation();
    },
    methods: {
      getInformation () {
        let _this = this
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/balanceInfo/?activityId=' + _this.$route.params.activityId,
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            _this.$vux.loading.hide()
            _this.balanceInfo = res.data
            _this.balanceInfo.totalExpense = toDecimal2(_this.balanceInfo.totalExpense)
            _this.balanceInfo.totalIncome = toDecimal2(_this.balanceInfo.totalIncome)
            _this.balanceInfo.totalRefund = toDecimal2(_this.balanceInfo.totalRefund)
            console.log(_this.balanceInfo)
            _this.balanceInfo.pictures.forEach(res => {
              let temp = {}
              temp.src = res
              _this.imgList.push(temp)
            })
            let length = _this.imgList.length;
            if (length === 1) {
              _this.isOne = true
            }
          }
        })
      },
      deleteReceiveAddress () {
        this.$router.push('/Login')
      },
      show (index) {
        this.$refs.previewer.show(index);
      },
      clickBack () {
        this.$router.push('/activityDetail/' + this.$route.params.activityId)
      }
      // goBack () {
      //   this.$router.push('/activityDetail/' + this.$route.params.activityId)
      // }
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
  }

  .newThings-banner {
    .pub_option {
      border-bottom: 0.5px solid #d8d8d8;
      margin: 0 15px;
      padding: 5px 0;
      .weui-cell {
        padding: 10px 0;
      }
    }
    .others {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 69px;
      line-height: 69px;
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
      .applyUserCount {
        color: #aaa;
        flex-grow: 1;
        margin-left: 0;
      }
    }
    .delete-wrapper {
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
    .amountDetail-title {
      font-size: 14px;
      color: #aaa;
    }
    .amount-title {
      height: 20px;
      font-size: 14px;
      color: #0DAB60;
    }
    .amount-list {
      height: 36px;
    }
    .spacing-container {
      width: 100%;
      height: 10px;
      background-color: #f5f5f5;
    }
    .addAmountList {
      display: flex;
      width: 100%;
      height: 40px;
      font-size: 14px;
      align-items: center;
      color: #0DAB60;
      justify-content: center;
      border-top: 0.5px solid #d8d8d8;
    }
    .weui-cell__ft {
      color: #333;
    }
    .imgList {
      margin-top: 12px;
      ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 15px;
        margin: 10px 0;
        li {
          width: 113.5px;
          height: 113.5px;
          margin-bottom: 2px;
          margin-left: 1.25px;
          overflow: hidden;
          display: flex;
          align-items: center;
          img {
            width: 100%;
            height: 50vw;
          }
        }
        .onePic {
          overflow: hidden;
          display: flex;
          align-items: center;
          width: 100%;
          height: 200px;
          img {
            width: 100%;
            height: auto;
          }
        }
        li:nth-child(3n+1) {
          margin-left: 0;
        }
      }
    }
  }
</style>
