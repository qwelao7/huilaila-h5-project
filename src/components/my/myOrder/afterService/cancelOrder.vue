<template>
  <div class="cancelOrder commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="product-list-wrapper">
        <product-list :productList="productList" :isClick="false"></product-list>
      </div>

      <div class="reason" @click="showReasonPopup">
        <div v-text="reason"></div>
        <div class="right">
          <div class="text" v-text="reasonText"></div>
          <div class="icon-arrow"></div>
        </div>
      </div>

      <group class="textarea">
        <x-textarea :placeholder="placeholder" :height=190 :max=500 :show-counter="false" v-model="explain"></x-textarea>
      </group>

      <ul class="pic-list" v-if="type === 2">
        <li class="pic-item" v-for="(item, index) in picList" v-show="picList.length">
          <img :src="item" @click="showServerDelPopup(index)">
        </li>
        <li class="pic-item" v-show="picList.length < 4">
            <img src="../../../../assets/images/addpic-210.png" @click="addServerPic">
        </li>
      </ul>

      <div class="button-submit" @click="submit">确认提交</div>
    </view-box>
    <div v-transfer-dom>
      <popup v-model="reasonPopup" style="background-color: #ffffff;">
        <div class="reason-popup">
          <div class="title" v-text="reason"></div>
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
  import { JNavigator } from 'common/js/utils'
  import { File } from '../../../../common/js/Upload'
  import productList from '../../productList'
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
      Popup,
      productList
    },
    data () {
      return {
        title: '',
        orderId: '', // 订单Id
        productList: [], // 商品信息
        type: 0, // 申请取消订单 - 1, 申请售后 - 2
        explain: '', // 取消说明/售后说明
        reasonText: '', // 取消原因/售后原因
        picList: [],
        postPicList: [],
        detailId: '', // 申请售后时需要此参数
        reasonPopup: false,
        reason: '',
        placeholder: '',
        reasonIndex: '',
        reasonList: []
      }
    },
    created () {
      this.orderId = this.$route.params.orderId
      this.detailId = this.$route.query.detailId
      this.productList = this.$route.query.productList
      this.type = this.$route.query.type
      if (this.type === 1) {
        this.title = '申请取消服务'
        this.reason = '取消原因'
        this.placeholder = '亲~你正在取消服务，请尽量详细的填写取消说明(1-500字)。以便我们为你尽快进行售后处理，通常需要1-2个工作日'
        this.reasonList = [{
          text: '我不想买了'
        }, {
          text: '信息填写错误'
        }, {
          text: '与服务商协商取消'
        }, {
          text: '其他'
        }]
      } else if (this.type === 2) {
        this.title = '申请售后'
        this.reason = '售后原因'
        this.placeholder = '亲~你正在申请售后，请你尽量详细填写反馈内容(1-500字)。客服将在1-2个工作日联系你对接售后问题，给你带来不便，敬请谅解。'
        this.reasonList = [{
          text: '不喜欢'
        }, {
          text: '与描述不符'
        }, {
          text: '商品质量问题'
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
      showServerDelPopup (index) {
        this.showServerDelMenu = true;
        this.currentServerIndex = index;
      },
      addServerPic () {
        let _this_ = this;
        let count = this.picList.length;
        let leftCount = 4 - count;
        this.$wechat.chooseImage({
          count: leftCount, // 默认9
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            _this_.picList = _this_.picList.concat(res.localIds);
            // let uploadData = new FormData()
            // uploadData.append('type', 'nei')
            let blobs = []
            _this_.picList.forEach(function (imgId, index) {
              _this_.$wechat.getLocalImgData({
                localId: imgId, // 图片的localID
                success: function (res) {
                  let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                  if (JNavigator.isAndroid()) {
                    localData = 'data:image/jgp;base64,' + localData;
                  }
                  let file = File.dataURItoBlob(localData);
                  blobs.push(file)
                  // uploadData.append('files', file.blob, file.fileName);
                  // 合成完最后一个,开始上传
                  if (index === _this_.picList.length - 1) {
                    _this_.uploadBlob(blobs, 'afterService', undefined, undefined, function (resList) {
                      _this_.postPicList = resList
                    });
                    // _this_.$JHttp.post(window.uploadURL + '/upload', uploadData, {
                    //   headers: {
                    //     'Content-Type': 'multipart/form-data'
                    //   }
                    // }).then(res => {
                    //   if (res.status === 100) {
                    //     _this_.postPicList = res.data
                    //   }
                    // })
                  }
                }
              });
            })
          }
        });
      },
      submit () {
        let _this_ = this
        if (!_this_.reasonText) {
          _this_.$vux.toast.show({
            type: 'cancel',
            text: '请选择' + _this_.reason
          })
          return
        }
        if (_this_.reasonText === '其他') {
          if (_this_.explain.trim().length === 0) {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: _this_.type === 1 ? '请填写取消说明' : '请填写售后说明'
            })
            return
          }
        }
        _this_.$JHttp({
          method: 'POST',
          url: window.baseURL + '/afterSales/submitAfterSales',
          params: {
            explain: _this_.explain,
            orderId: _this_.orderId,
            reason: _this_.reasonText,
            type: _this_.type,
            detailId: _this_.detailId,
            imageUrls: JSON.stringify(_this_.postPicList)
          }
        }).then(res => {
          if (res.status === 100) {
            _this_.$vux.toast.show({
              type: 'success',
              text: '提交成功'
            })
            _this_.$router.go(-1)
          }
        }).catch(e => {
          console.log(e)
        });
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
    background-image: url("../../../../assets/images/check_icon_orange32.png");
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
  .product-list-wrapper {
    background-color: #FFFFFF;
    padding: 0 15px;
    margin-top: 10px;
    /deep/ .product-item {
      border-top: none;
    }
  }
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
        background-image: url("../../../../assets/images/arrow_icon_grey.png");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
    }
  }
  .pic-list {
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    padding: 0 15px 20px 15px;
    .pic-item {
      width: 75px;
      height: 75px;
      margin-right: 15px;
      :last-child {
        margin-right: 0;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .weui-cell {
    background-color: #FFFFFF;
    padding: 20px 15px;
  }
  /deep/ .vux-no-group-title {
    &::before {
      display: none;
    }
    &::after {
      display: none;
    }
  }
  .button-submit {
    color: #FFFFFF;
    margin-top: 20px;
    text-align: center;
    /*width: 345px;*/
    height: 44px;
    line-height: 44px;
    background: #FF6648;
    margin: 20px 15px 0 15px;
  }
}
</style>

