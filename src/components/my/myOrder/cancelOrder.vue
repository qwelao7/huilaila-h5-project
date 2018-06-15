<template>
  <div class="cancelOrder commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="reason" @click="showReasonPopup">
        <div>取消原因</div>
        <div class="right">
          <div class="text" v-text="reasonText"></div>
          <div class="icon-arrow"></div>
        </div>
      </div>

       </group class="textarea">
        <x-textarea placeholder="亲~你正在取消服务，请尽量详细地填写取消说明(1-500字)。以便我们为你尽快进行售后处理，通常需要1-3个工作日" :height=190 :max=500 :show-counter="false"></x-textarea>
       </group>

      <div class="button-submit" @click="submit">确认提交</div>
    </view-box>
    <div v-transfer-dom>
      <popup v-model="reasonPopup" style="background-color: #ffffff;">
        <div class="reason-popup">
          <div class="title">取消原因</div>
          <div class="list">
            <div class="item" v-for="(reason, index) in reasonList" @click="selectReason(index)">
              <span v-text="reason.text"></span>
              <span class="icon-selected" v-if="index === reasonIndex"></span>
            </div>
          </div>
          <div class="close" @click="hideReasonPopup">取消</div>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import { ViewBox, XHeader, Group, XTextarea, TransferDom, Popup } from 'vux'
  export default {
    name: 'cancelOrder',
    directives: {
      TransferDom
    },
    components: {
      ViewBox,
      XHeader,
      Group,
      XTextarea,
      Popup
    },
    data () {
      return {
        title: '申请取消服务',
        reasonPopup: false,
        reasonIndex: '',
        reasonText: '',
        reasonList: [{
          text: '我不想买了'
        }, {
          text: '信息填写错误'
        }, {
          text: '与服务商协商取消'
        }, {
          text: '其他'
        }]
      }
    },
    methods: {
      showReasonPopup () {
        this.reasonPopup = true
      },
      hideReasonPopup () {
        this.reasonPopup = false
      },
      selectReason (index) {
        this.reasonIndex = index
        this.reasonText = this.reasonList[index].text
        this.hideReasonPopup()
      },
      submit () {
        console.log('submit')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.reason-popup {
  padding: 0 15px;
  .title {
    height: 25px;
    font-size: 18px;
    padding: 15px 0;
    text-align: center;
    color: #333333;
  }
  .item {
    display: flex;
    justify-content: space-between;
    height: 21px;
    font-size: 15px;
    padding: 15px 0;
    border-bottom: 0.5px solid #AAAAAA;
  }
  .icon-selected {
    width: 21px;
    height: 16px;
    background-image: url("../../../assets/images/check_icon_orange32.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .close {
    height: 25px;
    font-size: 18px;
    padding: 12px 0;
    text-align: center;
    color: #333333;
  }
}
.cancelOrder {
  background-color: #f2f2f2;
  height: 100%;
  .reason {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #FFFFFF;
    height: 51px;
    margin: 10px 0;
    padding: 0 15px;
    font-size: 15px;
    color: #333333;
    .right {
      display: flex;
      align-items: center;
      .text {
        font-size: 15px;
        color: #333333;
        margin-right: 10.5px;
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
  .weui-cell {
    background-color: #FFFFFF;
    padding: 20px 15px;
    margin-bottom: 20px;
  }
  .button-submit {
    margin-top: 20px;
    text-align: center;
    /*width: 345px;*/
    height: 44px;
    line-height: 44px;
    background: #FF6648;
    margin: 0 15px;
  }
}
</style>

