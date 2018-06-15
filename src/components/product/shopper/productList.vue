<template>
  <div class="shopper-product-wrapper">
    <div class="shopper-cover">
      <div class="header">
        <span class="icon" @click="goBack"></span>
        <span class="detail" @click="goShopperDetail">详情</span>
      </div>
      <div class="content">
        <img class="img" :src="shopBaseInfo.storeLogo" />
        <div class="right">
          <div class="title">
            <span class="name" v-text="shopBaseInfo.storeName"></span>
            <span class="authorization-text" v-if="authorizationText" v-text="authorizationText"></span>
          </div>
          <div class="carriage-fee" v-text="storeRemark"></div>
          <div class="description" @click="showDescriptionDetail">
            <span class="text" v-text="shopBaseInfo.storeNotice"></span>
            <span class="icon"></span>
          </div>
        </div>
      </div>
      <div class="background">
        <img class="img" :src="shopBaseInfo.storeLogo" />
      </div>
      <div class="description-detail" v-show="isShowDescriptionDetail" @click="hideDescriptionDetail">
        <div class="detail-wrapper">
          <span class="title">公告</span>
          <span class="description-text" v-text="shopBaseInfo.storeNotice"></span>
        </div>
        <span class="icon-close"></span>
      </div>
    </div>
    <div class="infomation-wrapper vux-1px-b" v-if="shopBaseInfo.baseKnowledgeInfoShortVList && shopBaseInfo.baseKnowledgeInfoShortVList.length">
      <img :src="infomationIcon" class="img" alt="">
      <div class="info-text">
        <marquee>
          <marquee-item v-for="(info, index) in shopBaseInfo.baseKnowledgeInfoShortVList" :key="index" @click.native="goInfoDetail(info)" class="text-item" v-text="info.title"></marquee-item>
        </marquee>
      </div>
      <div class="btn" v-text="'更多'" @click="goInfoList"></div>
    </div>
    <div class="shopper-product-list-wrapper" v-if="tabs.length">
      <scroll-tab :tabs="tabs">
      </scroll-tab>
    </div>
  </div>
</template>

<script>
  import ScrollTab from 'components/product/shopper/scrollTab';
  import infomationIcon from '../../../assets/images/infomation-icon.png';
  import { Marquee, MarqueeItem } from 'vux'
  export default {
    name: 'ShopperProductList',
    components: {
      'scroll-tab': ScrollTab,
      'marquee': Marquee,
      'marquee-item': MarqueeItem
    },
    created: function () {
      // 获取商家基础信息
      this.getShopperInfo();
      // 获取商家类目列表
      this.getClassInfo();
    },
    computed: {
      storeId () {
        return this.$route.params.storeId;
      },
      authorizationText () {
        let storeExamine = this.shopBaseInfo.storeExamine;
        let authorizationText = '';
        if (storeExamine === 2) {
          authorizationText = '已认证'
        }
        return authorizationText;
      },
      storeRemark () {
        let storeRemark = '';
        if (this.shopBaseInfo.storeExt) {
          // 有无物流(1:无物流,2:有物流)
          let deliverySetting = this.shopBaseInfo.storeExt.deliverySetting;
          // 支持物流方式: 1快递配送  2预约上门 3用户自提(ps:1&2是互斥的)
          let deliverType = this.shopBaseInfo.storeExt.deliveryType;
          // 服务费
          let onsiteServiceExpense = parseFloat(this.shopBaseInfo.storeExt.onsiteServiceExpense);
          // 免服务费条件
          let onsiteFreeService = parseFloat(this.shopBaseInfo.storeExt.onsiteFreeService);
          // 运费
          let freightMoney = parseFloat(this.shopBaseInfo.freightMoney);
          // 免运费条件(0:不需要运费,-1:不减免运费,其他:满xxx免运费)
          let minMoney = this.shopBaseInfo.minMoney;
          // 有物流(无物流不需要考虑)
          if (deliverySetting === 2) {
            // 预约上门&用户自提(用户自提不需要考虑相关费用)
            if (deliverType.indexOf('2') !== -1) {
              if (onsiteServiceExpense <= 0) {
                storeRemark = '免服务费';
              } else {
                // 不免服务费
                if (onsiteFreeService === -1) {
                  storeRemark += '服务费:' + onsiteServiceExpense.toFixed(0) + '元';
                } else if (onsiteFreeService <= 0) { // 免服务费
                  storeRemark = '免服务费';
                } else if (onsiteFreeService > 0) {
                  storeRemark = '满' + onsiteFreeService.toFixed(0) + '元免服务费';
                }
              }
            }
            // 快递配送&用户自提(用户自提不需要考虑相关费用)
            if (deliverType.indexOf('1') !== -1) {
              if (freightMoney <= 0) {
                storeRemark = '全场包邮';
              } else {
                if (minMoney === -1) {
                  storeRemark = '运费:' + freightMoney.toFixed(0) + '元';
                } else if (minMoney === 0) {
                  storeRemark = '全场包邮';
                } else if (minMoney > 0) {
                  storeRemark = '满' + minMoney.toFixed(0) + '元包邮';
                }
              }
            }
          }
        }
        return storeRemark;
      }
    },
    data () {
      return {
        isShowDescriptionDetail: false,
        infomationIcon: infomationIcon,
        shopBaseInfo: {
          storeLogo: '',
          storeName: '',
          carriageInfo: '',
          storeNotice: ''
        },
        tabs: []
      }
    },
    methods: {
      goBack () {
        this.$router.go(-1);
      },
      showDescriptionDetail () {
        this.isShowDescriptionDetail = true;
      },
      hideDescriptionDetail () {
        this.isShowDescriptionDetail = false;
      },
      getShopperInfo () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/shop/store/info?storeId=' + this.storeId
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            this.shopBaseInfo = data;
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
      getClassInfo () {
        let storeId = this.$route.params.storeId;
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/shop/store/productTypeList?storeId=' + storeId
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            _this_.tabs = data;
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
      goInfoList () {
        this.$router.push('/infoList/' + this.shopBaseInfo.busId)
      },
      goInfoDetail (info) {
        let skipType = info.skipType;
        if (skipType === 3) {
          let skipData = JSON.parse(info.skipData);
          let skipUrl = skipData.url;
          location.href = skipUrl;
        } else {
          let infoId = info.id;
          this.$router.push('/infoDetail/' + infoId);
        }
      },
      goShopperDetail () {
        this.$router.push('/shopperInfo/shopper/' + this.storeId);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .shopper-product-wrapper {
    .shopper-cover {
      width: 100%;
      position: relative;
      background: rgba(51, 51, 51, 0.3);
      .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        -webkit-filter: blur(25px);
        filter: blur(25px);
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .header {
        position: relative;
        z-index: 1;
        padding: 10px 15px 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon {
          position: relative;
          width: 28px;
          height: 28px;
        }
        .icon:before {
          content: "";
          position: absolute;
          width: 14px;
          height: 14px;
          border: 1px solid #fff;
          border-width: 1px 0 0 1px;
          transform: rotate(315deg);
          top: 7px;
          left: 7px;
        }
        .detail {
          font-size: 15px;
          line-height: 21px;
          color: #fff;
        }
      }
      .content {
        position: relative;
        z-index: 1;
        padding: 11px 15px 10px 15px;
        display: flex;
        align-items: center;
        .img {
          flex: 0 0 60px;
          height: 60px;
          border-radius: 100%;
          border: 2px solid #fff;
          background-size: 100%;
          background-repeat: no-repeat;
          margin-right: 10px;
        }
        .right {
          color: #fff;
          width: 275px;
          .title {
            display: flex;
            align-items: center;
            margin-bottom: 3px;
            .name {
              font-size: 21px;
              line-height: 21px;
            }
            .authorization-text {
              margin-left: 10px;
              flex: 0 0 50px;
              line-height: 21px;
              height: 21px;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #FF6648;
              color: #fff;
              border-radius: 4px;
              font-size: 12px;
            }
          }
          .carriage-fee {
            font-size: 12px;
            line-height: 17px;
          }
          .description {
            display: flex;
            align-items: center;
            margin-top: 3px;
            .text {
              flex: 1;
              font-size: 12px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .icon {
              flex: 0 0 16px;
              height: 16px;
              position: relative;
            }
            .icon:before {
              content: "";
              position: absolute;
              width: 10px;
              height: 10px;
              border: 1px solid #fff;
              border-width: 1px 0 0 1px;
              transform: rotate(-225deg);
              top: 3px;
              left: 3px;
            }
          }
        }
      }
      .description-detail {
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        -webkit-transition: all 0.5s;
        transition: all 0.5s;
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        opacity: 1;
        background: rgba(7,17,27,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        .detail-wrapper {
          text-align: center;
          margin: 0 15px;
          .title {
            font-size: 16px;
            margin-bottom: 20px;
          }
          .description-text {
            font-size: 14px;
          }
        }
        .icon-close {
          position: absolute;
          bottom: 20px;
          width: 22px;
          height: 22px;
          background-size: 100%;
          background-repeat: no-repeat;
          background-image: url("../../../assets/images/close_icon_myorder.png");
        }
      }
    }
    .infomation-wrapper {
      height: 44px;
      margin: 0 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      .img {
        width: 31px;
        height: 23px;
        margin-right: 10px;
      }
      .info-text {
        flex: 1;
        overflow: hidden;
        .text-item {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .btn {
        width: 40px;
        height: 20px;
        border-radius: 10px;
        text-align: center;
        line-height: 20px;
        border: 1px solid #333;
        font-size: 12px;
        margin-left: 10px;
      }
    }
    .shopper-product-list-wrapper {
      width: 100%;
      height: 544px;
    }
  }
</style>
