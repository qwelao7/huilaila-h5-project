<template>
  <div class="shopper-detail-wrapper">
    <div class="base-info-wrapper">
      <div class="header vux-1px-b">
        <div class="top">
          <img :src="shopperInfo.storeLogo" class="img" alt="">
          <div class="content">
            <div class="title">
              <span class="title-text" v-text="shopperInfo.storeName"></span>
              <span class="authorization-text" v-if="authorizationText" v-text="authorizationText"></span>
            </div>
            <div class="label" v-if="shopperInfo.storeLabel" v-html="storeLabelStr"></div>
            <div class="point">
              <star :disabled="true" :fontSize="12" :margin="5" v-if="shopperInfo.storeScore" :value="shopperInfo.storeScore"></star>
              <span class="point-value" v-text="pointStr"></span>
            </div>
            <div class="service-wrapper">
              <span class="service-item" v-for="(item, intex) in services" v-text="item"></span>
            </div>
          </div>
        </div>
        <div class="bottom">
          <span class="left" v-html="priceDescription.leftText"></span>
          <span class="right" v-text="priceDescription.rightText"></span>
        </div>
      </div>
      <div class="address-wrapper vux-1px-b">
        <span class="left-icon"></span>
        <p class="address-text" v-text="shopperInfo.storeAddress"></p>
        <a :href="telStr">
          <span class="tel-icon"></span>
        </a>
      </div>
      <div class="transfer-wrapper vux-1px-b" v-if="transferTypeStr">
        <span class="left-icon"></span>
        <div class="transfer-type">
          <span class="transfer-title" v-text="'物流方式:'"></span>
          <span class="transfer-value" v-text="transferTypeStr"></span>
        </div>
      </div>
      <div class="time-wrapper" v-if="priceDescription.selfGetTime || priceDescription.enterFamilyTime">
        <span class="left-icon"></span>
        <div class="right-time">
          <div class="top" v-if="priceDescription.enterFamilyTime">
            <span class="top-title" v-text="'上门时间:'"></span>
            <span class="top-value" v-html="priceDescription.enterFamilyTime"></span>
          </div>
          <div class="bottom" v-if="priceDescription.selfGetTime">
            <span class="bottom-title" v-text="'自提时间:'"></span>
            <span class="bottom-value" v-html="priceDescription.selfGetTime"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="business-environment-wrapper" v-if="shopperInfo.storeVideoUrl || picList.length">
      <div class="top" @click="showShopperEnvironmentDetail">
        <span class="left-title" v-text="'商家环境'"></span>
        <div class="right-icon"></div>
      </div>
      <div class="bottom">
        <scroller lock-y :scrollbar-x=false>
          <div class="box" :style="{width: boxWidth}">
            <div class="video-wrapper" v-if="shopperInfo.storeVideoUrl">
              <img class="img" ref="videoCoverImg" :src="videoCoverImg" @click="playVideo">
              <video :src="shopperInfo.storeVideoUrl" ref="video" class="video" @click="playClick($event)"></video>
            </div>
            <img class="previewer-img" v-for="(item, index) in picList" :src="item.src" alt="" @click="show(index)">
            <div v-transfer-dom v-if="picList">
              <previewer :list="picList" ref="previewer"
                         :options="options"></previewer>
            </div>
          </div>
        </scroller>
      </div>
    </div>
    <div class="business-info-wrapper">
      <p class="top-title" v-text="'商家信息'"></p>
      <p class="business-text" v-text="shopperInfo.storeRemarks"></p>
    </div>
    <div class="business-qualification-wrapper" v-if="shopperInfo.businessLicense">
      <p class="top-title" v-text="'营业资质'"></p>
      <img class="business-license-img" :src="shopperInfo.businessLicense" @click="showBusinessLicense(0)" alt="">
      <div v-transfer-dom>
        <previewer :list="[{src: shopperInfo.businessLicense}]" ref="businessLicensePreviewer"
                   :options="businessLicenseOptions"></previewer>
      </div>
    </div>
  </div>
</template>

<script>
import Star from 'components/common/star';
import videoCoverImg from '../../assets/images/playhold_icon200.png';
import {Scroller, TransferDom, Previewer} from 'vux';
// 获取根节点字体大小
const htmlFontSize = getComputedStyle(window.document.documentElement)['font-size'];
const remRate = parseFloat(htmlFontSize.substring(0, (htmlFontSize.length - 2)));
export default {
  name: 'shopperDetail',
  directives: {
    TransferDom
  },
  components: {
    'star': Star,
    'scroller': Scroller,
    'previewer': Previewer
  },
  props: {
    storeId: {
      type: String,
      required: true
    }
  },
  created: function () {
    this.getShopperInfo();
  },
  data () {
    return {
      options: {
        getThumbBoundsFn (index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.previewer-img')[index];
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
      businessLicenseOptions: {
        getThumbBoundsFn (index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.business-license-img')[index];
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
      videoCoverImg: videoCoverImg,
      shopperInfo: {}
    }
  },
  computed: {
    authorizationText () {
      let storeExamine = this.shopperInfo.storeExamine;
      let authorizationText = '';
      if (storeExamine === 2) {
        authorizationText = '已认证'
      }
      return authorizationText;
    },
    storeLabelStr () {
      let labels = this.shopperInfo.storeLabel;
      let labelStr = '';
      if (labels) {
        let labelArr = labels.split(',');
        labelStr = labelArr.join('&nbsp;&nbsp;|&nbsp;&nbsp;');
      }
      return labelStr;
    },
    pointStr () {
      let score = this.shopperInfo.storeScore;
      let pointStr = '';
      if (score) {
        pointStr = parseFloat(score).toFixed(1);
      } else {
        pointStr = '暂无评价';
      }
      return pointStr;
    },
    services () {
      let storeService = this.shopperInfo.storeService;
      let services = [];
      if (storeService) {
        services = storeService.split(',');
      }
      return services;
    },
    priceDescription () {
      let leftText = '';
      let rightText = '';
      let enterFamilyTime = '';
      let selfGetTime = '';
      if (this.shopperInfo.storeExt) {
        // 有无物流(1:无物流,2:有物流)
        let deliverySetting = this.shopperInfo.storeExt.deliverySetting;
        // 支持物流方式: 1快递配送  2预约上门 3用户自提(ps:1&2是互斥的)
        let deliverType = this.shopperInfo.storeExt.deliveryType;
        // 起送价
        let onsiteMinprice = parseFloat(this.shopperInfo.storeExt.onsiteMinprice);
        // 服务费
        let onsiteServiceExpense = parseFloat(this.shopperInfo.storeExt.onsiteServiceExpense);
        // 免服务费条件(0:不需要服务费,-1:不减免服务费,其他:满xxx免服务费)
        let onsiteFreeService = parseFloat(this.shopperInfo.storeExt.onsiteFreeService);
        // 运费
        let freightMoney = parseFloat(this.shopperInfo.freightMoney);
        // 免运费条件(0:不需要运费,-1:不减免运费,其他:满xxx免运费)
        let minMoney = parseFloat(this.shopperInfo.minMoney);
        // 有物流(无物流不考虑)
        if (deliverySetting === 2) {
          // 预约上门(用户自提不考虑)
          if (deliverType.indexOf('2') !== -1) {
            let onsiteIsOpenTime = this.shopperInfo.storeExt.onsiteIsOpenTime;
            if (onsiteIsOpenTime === 1) {
              enterFamilyTime = this.shopperInfo.storeExt.onsiteTimes + '&nbsp;-&nbsp;' + this.shopperInfo.storeExt.onsiteTimee;
            }
            leftText += '起送价:&nbsp;&nbsp;' + onsiteMinprice.toFixed(0) + '元';
            if (onsiteServiceExpense <= 0) {
              rightText = '免服务费';
            } else {
              // 不免服务费
              if (onsiteFreeService === -1) {
                leftText += '&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;服务费:&nbsp;&nbsp;' + onsiteServiceExpense.toFixed(0) + '元';
              } else if (onsiteFreeService <= 0) { // 免服务费
                rightText = '免服务费';
              } else if (onsiteFreeService > 0) {
                leftText += '&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;服务费:&nbsp;&nbsp;' + onsiteServiceExpense.toFixed(0) + '元';
                rightText = '满' + onsiteFreeService.toFixed(0) + '元免服务费';
              }
            }
          }
          // 快递配送(用户自提不考虑)
          if (deliverType.indexOf('1') !== -1) {
            if (freightMoney <= 0) {
              rightText = '包邮';
            } else {
              if (minMoney === -1) {
                leftText += '运费:&nbsp;&nbsp;' + freightMoney.toFixed(0) + '元';
              } else if (minMoney === 0) {
                rightText = '包邮';
              } else if (minMoney > 0) {
                leftText += '运费:&nbsp;&nbsp;' + freightMoney.toFixed(0) + '元';
                rightText = '满' + minMoney.toFixed(0) + '元包邮';
              }
            }
          }
          if (deliverType.indexOf('3') !== -1) { // 用户自提
            selfGetTime = this.shopperInfo.storeExt.userSelfTimes + '&nbsp;-&nbsp;' + this.shopperInfo.storeExt.userSelfTimee;
          }
        }
      }
      return {
        leftText: leftText,
        rightText: rightText,
        enterFamilyTime: enterFamilyTime,
        selfGetTime: selfGetTime
      };
    },
    transferTypeStr () {
      let transferTypeStr = '';
      if (this.shopperInfo.storeExt) {
        let deliverSetting = this.shopperInfo.storeExt.deliverySetting;
        let deliverType = this.shopperInfo.storeExt.deliveryType;
        if (deliverSetting === 1) { // 1:无物流,2:有物流
          return transferTypeStr;
        }
        if (deliverType.indexOf('1') !== -1) {
          transferTypeStr += '快递配送/'
        }
        if (deliverType.indexOf('2') !== -1) {
          transferTypeStr += '预约上门/'
        }
        if (deliverType.indexOf('3') !== -1) {
          transferTypeStr += '用户自提/'
        }
        if (transferTypeStr[transferTypeStr.length - 1] === '/') {
          transferTypeStr = transferTypeStr.substr(0, transferTypeStr.length - 1)
        }
      }
      return transferTypeStr;
    },
    telStr () {
      return 'tel:' + this.shopperInfo.storePhone;
    },
    picList () {
      let picList = [];
      if (this.shopperInfo.annexList) {
        picList = this.getPreviewImgList(this.shopperInfo.annexList);
      }
      return picList;
    },
    boxWidth () {
      let len = this.picList.length;
      let videoSrc = this.shopperInfo.storeVideoUrl;
      if (videoSrc) {
        len++;
      }
      if (len) {
        return ((115 * (len - 1) + 100) / remRate) + 'rem';
      } else {
        return 0;
      }
    }
  },
  methods: {
    getShopperInfo () {
      let _this_ = this;
      _this_.$JHttp({
        method: 'get',
        url: window.baseURL + '/shop/store/info?storeId=' + this.storeId
      }).then(res => {
        if (res.status === 100) {
          let data = res.data;
          this.shopperInfo = data;
        } else {
          _this_.$vux.toast.show({
            type: 'cancel',
            text: res.msg
          })
        }
      }).catch(e => {
        console.log(e)
      })
    },
    getPreviewImgList (list) {
      let img = {};
      let imgList = [];
      list.forEach((res, index) => {
        if (index <= 5) {
          img = {
            msrc: res,
            src: res
          };
          imgList.push(img)
        }
      });
      return imgList
    },
    show (index) {
      this.$refs.previewer.show(index);
    },
    showShopperEnvironmentDetail () {
      this.$router.push('/shopperInfo/detail/' + this.storeId + '/environment');
    },
    playVideo () {
      let video = this.$refs.video;
      let videoCoverImg = this.$refs.videoCoverImg;
      video.play();
    },
    playClick (event) {
      let video = event.currentTarget;
      video.paused ? video.play() : video.pause()
      video.webkitEnterFullScreen();
    },
    showBusinessLicense (index) {
      this.$refs.businessLicensePreviewer.show(index);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.base-info-wrapper {
  background-color: #fff;
  .header {
    margin: 15px 15px 0 15px;
    padding-bottom: 15px;
    .top {
      padding-top: 15px;
      display: flex;
      .img {
        height: 100px;
        flex: 0 0 100px;
        margin-right: 10px;
      }
      .content {
        width: 235px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title {
          display: flex;
          .title-text {
            flex: 1;
          }
          .authorization-text {
            flex: 0 0 50px;
            line-height: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #FF6648;
            color: #fff;
            border-radius: 4px;
            font-size: 12px;
            margin-left: 5px;
          }
        }
        .label {
          margin-top: 7px;
          line-height: 21px;
          /*overflow: hidden;*/
          /*white-space: nowrap;*/
          /*text-overflow: ellipsis;*/
          font-size: 15px;
          color: #aaa;
        }
        .point {
          margin-top: 5px;
          display: flex;
          align-items: center;
          .point-value {
            font-size: 12px;
            margin-top: 3px;
            margin-left: 15px;
          }
        }
        .service-wrapper {
          margin-top: 10px;
          display: flex;
          align-items: center;
          .service-item {
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: 90px;
            height: 18px;
            font-size: 12px;
            color: #FF6648;
            border-radius: 3px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            background-color: rgba(255,102,72,0.10);
            border: 1px solid red;
            padding: 0 8px;
            margin-right: 8px;
          }
          span:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .bottom {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        font-size: 12px;
        color: #333;
      }
      .right {
        font-size: 12px;
        color: #FF6648;
      }
    }
  }
  .address-wrapper {
    margin: 0 15px;
    padding: 15px 0;
    display: flex;
    align-items: center;
    .left-icon {
      width: 18px;
      height: 18px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url("../../assets/images/address_icon_32black.png");
      margin-right: 15px;
    }
    .address-text {
      flex: 1;
      font-size: 15px;
      color: #333;
      line-height: 21px;
    }
    .tel-icon {
      width: 18px;
      height: 18px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url("../../assets/images/call_icon_green.png");
      margin-left: 15px;
    }
  }
  .transfer-wrapper {
    margin: 0 15px;
    padding: 15px 0;
    display: flex;
    align-items: center;
    .left-icon {
      width: 18px;
      height: 18px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url('../../assets/images/express_icon_32black.png');
      margin-right: 15px;
    }
    .transfer-type {
      flex: 1;
      font-size: 0;
      display: flex;
      align-items: center;
      .transfer-title {
        font-size: 15px;
        margin-right: 8px;
      }
      .transfer-value {
        font-size: 15px;
      }
    }
  }
  .time-wrapper {
    margin: 0 15px;
    padding: 15px 0;
    display: flex;
    align-items: center;
    .left-icon {
      width: 18px;
      height: 18px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url('../../assets/images/time_icon_32black.png');
      margin-right: 15px;
    }
    .right-time {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .top {
        display: flex;
        align-items: center;
        font-size: 15px;
        .top-title {
          margin-right: 8px;
        }
      }
      .bottom {
        display: flex;
        align-items: center;
        font-size: 15px;
        .bottom-title {
          margin-right: 8px;
        }
      }
    }
  }
}
.business-environment-wrapper {
  margin-top: 10px;
  background-color: #fff;
  padding: 15px;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    .left-title {
      font-size: 15px;
    }
    .right-icon {
      flex: 0 0 16px;
      height: 16px;
      position: relative;
    }
    .right-icon:before {
      content: "";
      position: absolute;
      width: 10px;
      height: 10px;
      border: 1px solid #aaa;
      border-width: 1px 0 0 1px;
      transform: rotate(-225deg);
      top: 3px;
      left: 3px;
    }
  }
  .bottom {
    height: 100px;
    .box {
      width: 1345px;
      height: 100px;
      position: relative;
      font-size: 0;
      .video-wrapper {
        display: inline-block;
        margin-right: 15px;
        width: 100px;
        height: 100px;
        position: relative;
        .img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        .video {
          width: 100%;
          height: 100%;
        }
      }
      .previewer-img {
        width: 100px;
        height: 100px;
        margin-right: 15px;
      }
      img:last-child {
        margin-right: 0;
      }
    }
  }
}
.business-info-wrapper {
  margin-top: 10px;
  background-color: #fff;
  padding: 15px;
  .top-title {
    padding-bottom: 15px;
    font-size: 15px;
    color: #333;
  }
  .business-text {
    font-size: 15px;
    /*display: -webkit-box;*/
    /*-webkit-line-clamp: 3;*/
    /*-webkit-box-orient: vertical;*/
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    color: #333;
  }
}
.business-qualification-wrapper {
  margin-top: 10px;
  background-color: #fff;
  padding: 15px;
  .top-title {
    padding-bottom: 15px;
    font-size: 15px;
    color: #333;
  }
  .business-license-img {
    width: 100px;
    height: 100px;
  }
}
</style>
