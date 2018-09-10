<template>
  <div class="logistics-form commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="form-preview">
        <div class="title">
          <label class="form-preview-label">寄回信息</label>
        </div>
        <div class="form-preview-item">
          <label class="form-preview-label">售后地址：</label>
          <span class="form-preview-value" v-text="expressAddr"></span>
        </div>
        <div class="form-preview-item">
          <label class="form-preview-label">收件人：</label>
          <span class="form-preview-value" v-text="expressReceiveUser"></span>
        </div>
        <div class="form-preview-item">
          <label class="form-preview-label">物流内容：</label>
          <span class="form-preview-value">申请售后</span>
        </div>
      </div>

      <div class="initem">
        <div class="initem-wrapper logistics-number">
          <x-input v-model="expNum" placeholder="输入物流单号" :max="32"></x-input>
          <div class="right" @click="scanQRCode">
            <div class="icon-scan"></div>
          </div>
        </div>
      </div>

      <div class="initem" @click="showPopup">
        <div class="initem-wrapper">
          <div class="placeholder" v-if="!comName">选择物流公司</div>
          <div class="text" v-if="comName" v-text="comName"></div>
          <div class="right">
            <div class="icon-arrow"></div>
          </div>
        </div>
      </div>

      <div v-transfer-dom>
        <popup v-model="showLogisticsCompanyList" height="100%" style="background-color: #FFFFFF">
          <div class="logistics-company-list">
            <view-box body-padding-top="1.653333rem" body-padding-bottom="0">
              <x-header
                slot="header"
                title="选择物流公司"
                :left-options="{ backText: '', preventGoBack: 'true' }"
                style="width:100%;position:absolute;left:0;top:0;z-index:100"
                @on-click-back="hidePopup">
              </x-header>
              <index-list
                :data="cityData"
                :value="comCode"
                @select="selectItem">
              </index-list>
            </view-box>
          </div>
        </popup>
      </div>

      <div class="button-submit" @click="submit">确认提交</div>

      <div>
        <popup-picker ref="picker" :show-cell="false" :show.sync="popupPicker" popup-title="请选择物流公司" :data="expCompanyData" v-model="expCompany" @on-change="chooseExpCompany">
        </popup-picker>
      </div>

    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader, XInput, Popup, TransferDom, PopupPicker } from 'vux'
  import indexList from 'components/base/index-list/index-list'
  export default {
    name: 'logistics-form',
    directives: {
      TransferDom
    },
    components: {
      ViewBox,
      XHeader,
      XInput,
      Popup,
      indexList,
      PopupPicker
    },
    data () {
      return {
        title: '填写物流',
        orderServiceId: '',
        popup: false,
        expNum: '',
        expressAddr: '',
        expressReceiveUser: '',
        comName: '',
        comCode: '',
        showLogisticsCompanyList: false,
        cityData: [],
        popupPicker: false,
        expCompany: [],
        expCompanyData: []
      }
    },
    created () {
      this.orderServiceId = this.$route.query.orderServiceId
      this.expressAddr = this.$route.query.expressAddr
      this.expressReceiveUser = this.$route.query.expressReceiveUser
      this.getDate()
    },
    methods: {
      getDate () {
        let _this_ = this
        _this_.$JHttp({
          method: 'get',
          url: 'static/express_data.json'
        }).then(res => {
          _this_.cityData = res.expressList
        }).catch(e => {
          console.log(e)
        });
      },
      selectItem (item) {
        this.comName = item.name
        this.comCode = item.value
        this.hidePopup()
      },
      showPopup () {
        this.showLogisticsCompanyList = true
      },
      hidePopup () {
        this.showLogisticsCompanyList = false
      },
      chooseExpCompany () {
        this.comName = this.$refs.picker.getNameValues()
        this.comCode = this.expCompany[0]
      },
      submit () {
        let _this_ = this
        if (_this_.expNum.length === 0) {
          _this_.$vux.toast.show({
            type: 'cancel',
            text: '请输入物流单号'
          })
          return
        }
        if (_this_.comCode.length === 0) {
          _this_.$vux.toast.show({
            type: 'cancel',
            text: '请选择物流公司'
          })
          return
        }
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/getExpressNumberWhetherMatch',
          params: {
            comCode: _this_.comCode,
            expNum: _this_.expNum
          }
        }).then(res => {
          if (res.status === 100) {
            _this_.$JHttp({
              method: 'put',
              url: window.baseURL + '/afterSales/updateLogistics',
              params: {
                id: _this_.orderServiceId,
                expressCode: _this_.comCode,
                expressCompany: _this_.comName,
                expressNo: _this_.expNum
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
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
        });
      },
      scanQRCode () {
        let _this_ = this
        this.$wechat.scanQRCode({
          needResult: 1,
          scanType: ['qrCode', 'barCode'],
          success: function (res) {
            let serial = res.resultStr.split(',')
            _this_.expNum = serial[serial.length - 1]
            // 根据物流单号匹配物流公司
            _this_.$vux.loading.show({
              text: '物流公司匹配中...'
            });
            _this_.$JHttp({
              method: 'GET',
              url: window.baseURL + '/getExpCompanyListByExpNum',
              params: {
                expNum: _this_.expNum
              }
            }).then(res => {
              _this_.$vux.loading.hide();
              if (res.status === 100) {
                if (res.data && res.data.length > 0) {
                  let data = []
                  res.data.forEach(function (v) {
                    data.push({
                      'name': v.expFirm,
                      'value': v.expCode
                    })
                  })
                  _this_.expCompanyData = [data]
                  _this_.popupPicker = true
                } else {
                  _this_.$vux.toast.show({
                    type: 'text',
                    text: '暂未匹配到物流公司，请手动选择'
                  });
                }
              }
            }).catch(e => {
              _this_.$vux.loading.hide();
              console.log(e)
            });
          },
          fail: function (e) {
            console.log(e)
          }
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.logistics-company-list {
  height: 100%;
  /deep/ .vux-header {
    background-color: #FFFFFF;
    border-bottom: 0.5px solid #D8D8D8;
    margin-bottom: 15px;
    .vux-header-left {
      .left-arrow:before {
        border-color: #333333;
      }
    }
    .vux-header-title {
      color: #333333;
    }
  }
  /deep/ .cube-index-list {
    .cube-index-list-anchor {
      color: #333333;
      font-size: 15px;
      height: 24px;
      line-height: 24px;
      padding: 1.5px 0 1.5px 9.5px;
      margin: 0 15px;
      background: #F2F2F2;
    }
    .cube-index-list-group {
      .cube-index-list-item {
        padding: 0;
        margin: 0 15px;
        .cube-index-list-item-def {
          padding: 0;
        }
        &:not(:last-child) {
          border-bottom: 0.5px solid #D8D8D8;
        }
      }
    }
  }
}
.logistics-form {
  height: 100%;
  background-color: #f2f2f2;
  .form-preview {
    position: relative;
    line-height: 21px;
    font-size: 15px;
    color: #333333;
    padding: 15px;
    margin: 10px 0;
    background-color: #FFFFFF;
    .form-preview-item {
      overflow: hidden;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
      .form-preview-label {
        float: left;
        min-width: 76px;
        /*text-align: right;*/
        text-align-last: justify;
      }
      .form-preview-value {
        display: block;
        overflow: hidden;
        word-break: normal;
        word-wrap: break-word;
      }
    }
    .title {
      padding-bottom: 15px;
      margin-bottom: 15px;
      border-bottom: 0.5px solid #D8D8D8;
    }
  }
  .initem {
    background-color: #FFFFFF;
    padding: 0 15px;
    font-size: 15px;
    .initem-wrapper {
      height: 51px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .placeholder {
        color: #AAAAAA;
      }
      .text {
        color: #333333;
      }
      .right {
        display: flex;
        align-items: center;
        .icon-arrow {
          width: 7px;
          height: 15px;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          background-image: url("../../../../assets/images/arrow_icon_grey.png");
        }
        .icon-scan {
          width: 28px;
          height: 28px;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          background-image: url("../../../../assets/images/scan_icon_black56@2x.png");
        }
      }
      &.logistics-number {
        border-bottom: 0.5px solid #D8D8D8;
        .weui-cell {
          padding: 0;
          width: 88%;
          /deep/ .weui-icon-clear {
            vertical-align: -0.027rem;
          }
        }
      }
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
