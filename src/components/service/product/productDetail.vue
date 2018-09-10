<style type="text/less" lang="less" scoped>

  .match-parent {
    width: 100%;
    height: 100%;
  }

  .product-detail{
    background-color: #fbf9fe;
    margin-bottom: 50px;
    height: 100%;
  }
  .product-detail .top-header{
    width:100%;
    position:fixed;
    left:0;
    top:0;
    z-index:100;
    background-color: transparent
  }
  .tag-video, .tag-img {
    background: rgba(51, 51, 51, 0.35);
    padding: 0 0 0 4px;
    color: #fff;
    text-align: center;
    line-height: 26px;
    border-radius: 50px;
    width: 60px;
    height: 26px;
    font-size: 12px;
    display: inline-block;
  }

  .tag-video:before {
    content: "";
    -webkit-backface-visibility: hidden;
    position: absolute;
    left: 8px;
    top: 6px;
    width: 0;
    height: 0;
    border-width: 5px;
    border-style: dashed;
    border-color: transparent transparent transparent #fff;
    font-size: 0;
    line-height: 0;
  }

  .video-play-btn {
    width: 65px;
    height: 65px;
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    margin-left: -32.5px;
    margin-top: -32.5px
  }

  .video-playing .video-play-btn {
    display: none;
  }

  .product-detail-video {
    display: none;
    width: 100%;
    margin-top: 40px;
  }

  .video-playing .product-detail-video {
    display: inline-block;
  }

  .video-cover-img {
    display: block
  }

  .video-playing .video-cover-img {
    display: none;
  }

  .video-swiper-item {
    width: 100%;
    height: 100%;
  }

  .video-img {
    width: 100%;
    position: relative;
  }

  .nav {
    position: absolute;
    width: 100%;
    background-color: #123;
  }

  .nav .tag-switch {
    position: absolute;
    left: 50%;
    bottom: 8px;
    margin-left: -70px;
  }

  .nav .tag-switch-select {
    background: #FF6648;
  }

  .nav .pagination {
    position: absolute;
    bottom: 8px;
    right: 15px;
    display: none;
    text-align: center;
    background-color: rgba(51, 51, 51, 0.80);
    border-radius: 17.5px;
    line-height: 35px;
    font-size: 12px;
    width: 35px;
    height: 35px;
    color: #fff;
  }

  .nav .pagination:first-letter {
    font-size: 20px;
  }

  .nav .current .pagination {
    display: inline-block;
  }

  .product-base-info .product-name {
    color: #333333;
    font-size: 18px;
    margin: 15px 15px 0 15px;
    font-weight: bold;
  }
  .product-common-margin{
    margin-left: 15px;
    margin-right: 15px;
  }


  .product-base-info  .product-tag {
    height: 18px;
    line-height: 18px;
    margin-top: 5px;
  }
  .product-base-info .product-tag-item {
    color: #FF6648 ;
    background: rgba(255,102,72,0.10);
    border: 0.5px solid #FF6648;
    border-radius: 3px;
    text-align: center;
    font-size: 11px;
    height: 17px;
    line-height: 20px;
    display: inline-block;
    margin-right: 10px;
    padding: 0 6px 0 6px;
  }
  .product-base-info .price-info{
    margin-top: 8px;
  }
  .product-base-info .sell-price, sku-popup-container .sell-price{
    color: #FF6648;
    font-size: 12px;
    display: inline-block;
  }

  .product-base-info .original-price{
    color: #aaa;
    font-size: 12px;
    display: inline-block;
    margin-left: 10px;
    text-decoration: line-through;
  }

  .product-base-info .big-price{
    font-size: 18px;
    display: inline-block;
    font-weight: bold;
  }

  .product-base-info .product-freight{
    margin-top: 3px;
    /*display: inline-block;*/
    position: relative;
    height: 30px;
  }
  .product-base-info .freight{
    display: inline-block;
    position: relative;
    font-size: 15px;
    color: #aaa;
    letter-spacing: 0.47px;
  }

  .product-base-info .sold-num{
    display: inline-block;
    position: absolute;
    right: 15px;
    font-size: 15px;
    color: #aaa;
  }

  .product-detail .divider{
    background-color: #d5d5d5;
    margin-top: 10px;
    margin-bottom: 10px;
    height: 0.5px;
  }

  .product-base-info .activity-tip{
    margin-bottom: 10px;
  }
  .product-base-info .activity-item{
    font-size: 15px;
    color: #333;
    padding: 2.5px 0;
  }

  .product-base-info .activity-tag{
    border-radius: 3px;
    font-size: 12px;
    margin-right: 7px;
    color: #FFFFFF;
    display: inline-block;
    padding: 2px 5px;
  }
  .product-base-info .limitation{
    background: #FF8E13;

  }

  .product-base-info .freightfree{
    background: #FF3939;
  }

  .product-parameter{
    font-size: 15px;
    color: #333;
    line-height: 25px;
  }

  .product-parameter-dialog .parameter-title{
    font-size: 18px;
    color:#333;
    font-weight: bolder;
    text-align: left;
    margin: 20px 0 0 20px;
  }
  .product-parameter-dialog  .parameter-content{
    margin: 10px 0 20px 0;
  }
  .product-parameter-dialog  .parameter-item{
    width: 100%;
    font-size: 15px;
    color: #333;
    letter-spacing: 0.31px;
    line-height: 30px;
    display: inline-block;
  }

  .product-parameter-dialog .parameter-item-left{
    width: 30%;
    display: inline-block;
    text-align: left;

  }

  .product-parameter-dialog  .parameter-item-right{
    width: 55%;
    display: inline-block;
    text-align: left;
  }

  .product-parameter-dialog  .parameter-close{
    background: #FF6648;
    color: #fff;
    line-height: 50px;
  }

  .product-store .store-info{
    margin-top: 15px;
    display: flex;
    display: -webkit-flex;

  }

  .store-info .store-logo{
    width: 40px;
    height: 40px;
    display: flex;
    display: -webkit-flex;
    margin-right: 10px;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;
  }

  .store-info .store-name{
    display: flex;
    display: -webkit-flex;
    color: #333;
    flex: 1;
    font-size: 18px;
    font-weight: bold;
    -webkit-flex: 1;
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
    flex-direction: column;
    -webkit-flex-direction: column;
  }

  .store-info .store-tag{
    font-size: 12px;
    font-weight: normal;
    color: #aaa;
    letter-spacing: 0.2px;
  }

  .store-info .good-rate-key{
    font-size: 12px;
    color: #333;
  }

  .store-info .good-rate-value{
    font-size: 18px;
    color: #FF6648;
    font-weight: bold;
  }

  .product-store .store-btn{
    position: relative;
    left: 50%;
    margin-left: -95px;
    margin-bottom: 20px;
    margin-top: 15px;
  }
  .product-detail .oval-btn{
    background: #FFFFFF;
    border: 1px solid #FF6648;
    color: #FF6648;
    border-radius: 100px;
    font-size: 15px;
    height: 30px;
    line-height: 30px;
    width: 90px;
    text-align: center;
    display: inline-block;
  }

  .store-btn .right-btn{
    margin-left: 10px;
  }

  .product-appraise .product-appraise-title{
    font-size: 15px;
    color: #333;
  }

  .product-appraise .appraise-number{
    margin-top: 15px;
    display: inline-block;
  }

  .product-appraise .appraise-user{
    display: inline-block;
    margin-top: 10px;
    text-align: center;
    vertical-align: middle;

  }

  .appraise-user .user-avatar{
    display: inline-block;
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }

  .appraise-user .user-name{
    display: inline-block;
    font-size: 15px;
    color: #aaa;
    margin-left: 10px;
  }

  .product-appraise .appraise-content{
    font-size: 18px;
    color: #333333;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .product-appraise .all-appraise{
    font-size: 12px;
    left: 50%;
    line-height: 25px;
    height: 25px;
    width: 100px;
    margin-left: -50px;
    position: relative;
    margin-bottom: 20px;
  }

  .product-detail .page-divider{
    padding: 15px 10px;
  }

  .bottom-shopping-cart{
    height: 50px;
    width: 375px;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    font-size: 0px;
    border: solid #D8D8D8;
    border-width:0.5px 0 0 0 ;
  }

  .bottom-shopping-cart .shoppingcart{
    width: 82px;
    height: 50px;
    line-height: 50px;
    display: inline-block;
    position: relative;
    font-size: 18px;

  }

  .shoppingcart .shoppingcart-img{
    width: 28px;
    height: 28px;
    display: inline-block;
    position: relative;
    left: 50%;
    top: 50%;
    margin-left: -14px;
    margin-top: -14px;
  }

  .shoppingcart .shoppingcart-num{
    display: inline-block;
    background-color: #FF6648;
    color: #fff;
    border-radius: 50%;
    position: absolute;
    left: 60%;
    top: 10%;
    height: 18px;
    width: 18px;
    line-height: 19px;
    font-size: 12px;
    text-align: center;

  }

  .bottom-shopping-cart .buy-now{
    display: inline-block;
    width: 146.5px;
    height: 50px;
    line-height: 50px;
    background: #FF6648;
    text-align: center;
    color: #fff;
    font-size: 18px;

  }

  .bottom-shopping-cart .add-cart{
    display: inline-block;
    width: 146.5px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #FF8E13;
    color: #fff;
    font-size: 18px;

  }

  .sku-popup-container{
    background-color: #fff;
  }
  .sku-popup-container .sku-popup-title{
    margin: 10px 15px;
  }
  .sku-popup-container .popup-title{
    display: inline-block;
    font-size: 15px;
    color: #333;
  }
  .sku-popup-container .popup-close{
    display: inline-block;
    position: absolute;
    right: 5px;
    padding: 5px 10px;
  }

  .sku-popup-container .popup-close-img{
    width: 16px;
    height: 16px;
  }

  .sku-popup-container .divider{
    background-color: #d5d5d5;
    margin-left: 15px;
    margin-right: 15px;
    height: 0.5px;
  }

  .sku-popup-container .sku-popup-product-info{
    margin: 15px;
    display: flex;
    display: -webkit-flex;
  }
  .sku-popup-container .popup-product-img{
    width: 75px;
    height: 75px;
    display: flex;
    display: -webkit-flex;
    margin-right: 10px;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;

  }

  .sku-popup-container .popup-product-info{
    display: flex;
    display: -webkit-flex;
    color: #333;
    flex: 1;
    font-size: 15px;
    -webkit-flex: 1;
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
    flex-direction: column;
    -webkit-flex-direction: column;
  }

  .sku-popup-container .popup-product-price{
    color: #FF6648;
    font-size: 12px;
  }

  .sku-popup-container .big-price{
    font-size: 18px;
    display: inline-block;
  }

  .sku-popup-container .popup-product-stock{
    color: #333;
  }

  .sku-popup-container .popup-product-category{
    color: #aaa;
  }

  .sku-popup-container .sku-popup-select{
    margin-left: 15px;
    margin-right: 15px;
  }

  .sku-popup-container .sku-popup-buy-count{
    color: #aaa;
    font-size: 15px;
  }

  .sku-popup-container .sku-popup-confirm-btn{
    height: 50px;
    background-color:#FF6648;
    color: white;
    text-align: center;
    line-height: 50px;
    font-size: 18px;
    position: fixed;
    width: 100%;
    bottom: 0px;
    border-width:0;
    -webkit-appearance:none;
    outline:0;
  }
  .sku-popup-container .sku-property-name{
    font-size: 15px;
    color: #333;
    margin-bottom: 10px;
  }
  .sku-popup-container .sku-property-value-btn{
    background-color: #f2f2f2;
    border-radius: 100px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    display: inline-block;
    min-width:45px;
    margin-right: 10px;
    margin-bottom: 15px;
    font-size: 12px;
    padding: 0 10px;
    border-width:0;
    -webkit-appearance:none;
    outline:0;
  }

  .sku-popup-container .sku-property-value-btn-select{
    background: #FF6648;
    color: #fff;
  }

  .sku-popup-container .sku-property-value-btn-unable{
    color: #d8d8d8;
    background-color: #f2f2f2;
  }

  .sku-popup-container .sku-popup-confirm-btn-unable{
    background-color: #d8d8d8;
  }

  .product-detail .detail-introduce{
    background-color: #fff;
    padding: 10px 15px;
    word-break: break-all;
  }

  .product-snapshot .sold-out-tip-btn{
    color: #fff;
    background-color: #d8d8d8 ;
    font-size: 18px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: fixed;
    width: 100%;
    bottom: 0px;
    border-width:0;
    -webkit-appearance:none;
    outline:0;
  }

  .product-detail .no-product-info{
    color: #aaa;
    font-size: 15px;
    position: relative;
    .no-product-container{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, 50%);
      margin-top: 80px;
    }
    .no-product-img {
      width: 150px;
      height: 150px;
    }
    .no-product-tip {
      height: 24px;
      margin-top: 10px;
      line-height: 24px;
    }
  }


</style>
<template>
  <div class="product-detail">
    <view-box ref="viewBox" body-padding-top="0" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        class="top-header">
      </x-header>
      <div class="normal-product" v-if="information && !information.snapShoot">
        <div>
          <div class="video-img"
               v-if="information.productVideoUrl || (information.productCoverimgs && information.productCoverimgs.length > 0)">
            <swiper height="375px" :show-dots="false" :show-desc-mask="false" v-model="swiperIndex"
                    @on-index-change="onSwiperIndexChange">
              <swiper-item class="video-swiper-item" v-if="information.productVideoUrl">
                <div :class="{'video-playing':isPlaying || isPause}" class="match-parent"
                     style="background-color: black">
                  <video id="product-video-play" preload class="product-detail-video" auto
                         :src="information.productVideoUrl" controls palysinline="true" webkit-palysinline="true"></video>
                  <img class="video-cover-img match-parent" :src="information.productImg">
                  <img class="video-play-btn" @click="playVideo()"
                       src="../../../assets/images/vidio_play_button_shopping.png" alt="">
                </div>

              </swiper-item>
              <swiper-item class="img-swiper-item" v-if="information.productCoverimgs"
                           v-for="(imgItem, index) in getImgList(information.productCoverimgs)" :key="index">
                <img class="previewer-demo-img match-parent" :src="imgItem.src" @click="showBigImg(index)">
              </swiper-item>
            </swiper>
            <div class="nav">
              <i class="tag-switch"
                 v-if="information.productVideoUrl && information.productCoverimgs && information.productCoverimgs.length > 0">
                <span class="tag-video" :class="{'tag-switch-select':swiperIndex == 0}" @click="switchToVideo">视频</span>
                <span class="tag-img" :class="{'tag-switch-select':swiperIndex > 0}" style="margin-left: 20px;"
                      @click="switchToImg">图片</span>
              </i>
              <i :class="{'current':swiperIndex == (information.productVideoUrl?index+1 :index) }"
                 v-for="(item,index) in information.productCoverimgs">
                <span class="pagination">{{index+1}}<i style="display: inline-block">/</i>{{information.productCoverimgs.length}}</span>
              </i>
            </div>
            <div v-transfer-dom>
              <previewer :list="getImgList(information.productCoverimgs)" ref="previewer"
                         :options="options"></previewer>
            </div>
          </div>
          <group class="product-base-info" gutter="10px">
            <div class="product-name">{{information.productName}}</div>
            <div class="product-common-margin product-tag" v-if="information.labelList">
              <span class="product-tag-item" v-for="tag in information.labelList">{{tag}}</span>
            </div>
            <div class="price-info product-common-margin">
              <div class="sell-price">¥ <span class="big-price">{{splitMoney(information.productPrice).int}}</span>{{splitMoney(information.productPrice).float}}{{information.productUnit}}
              </div>
              <div class="original-price">¥ {{information.productOriginalPrice.toFixed(2)}}{{information.productUnit}}
              </div>
            </div>
            <div class="product-freight product-common-margin">
              <span class="freight" v-show="isShowFright"><span style="display: inline-block">{{realFrightOrServiceKey}}：¥&nbsp;</span>{{realFrightOrServiceMoney.toFixed(2)}}</span>
              <span class="sold-num"><span style="display: inline-block">已售：</span>{{information.productSold}}</span>
            </div>
            <div class="divider product-common-margin" v-show="isShowFright || information.productLimitopt"></div>
            <div class="activity-tip product-common-margin" v-show="isShowFright || information.productLimitopt">
              <div class="activity-item" v-show="information.productLimitopt"><span
                class="activity-tag limitation">限购</span>每次限购{{information.productLimitopt}}件
              </div>
              <div class="activity-item" v-show="realFrightOrServiceActivityTip"><span
                class="activity-tag freightfree">免邮</span>{{realFrightOrServiceActivityTip}}
              </div>
            </div>
          </group>
          <group v-if="information.specificationList && information.specificationList.length > 0" gutter="10px">
            <cell title="产品参数" is-link @click.native="showParameterDialog">
              <span slot="title" class="product-parameter">产品参数</span>
            </cell>
          </group>
          <group gutter="10px" class="product-store">
            <div class="store-info product-common-margin">
              <img class="store-logo" :src="information.storeLogo" alt="">
              <div class="store-name">
                <i>{{information.storeName}}</i>
                <i class="store-tag" v-if="information.storeLabelList && information.storeLabelList.length > 0">
                  {{information.storeLabelList.join(' | ')}}
                </i>
              </div>
              <div>
                <p class="good-rate-key">好评率</p>
                <p class="good-rate-value">{{information.favorableRate}}</p>
              </div>
            </div>
            <div class="store-btn">
              <!--<span class="oval-btn" @click="callServicePhone()"></span>-->
              <a class="oval-btn" :href="storeTelphone">客服电话</a>
              <span class="oval-btn right-btn" @click="toStoreDetail()">进入店铺</span>
            </div>
          </group>
          <group class="product-appraise" gutter="10px" v-if="information.mOrderDetailAppraiseV">
            <div class="product-appraise-title product-common-margin">商品评价<span class="appraise-number">（{{information.mOrderDetailAppraiseV.appraiseCount}}</span>）
            </div>
            <div class="divider product-common-margin"></div>
            <div class="appraise-user product-common-margin">
              <img class="user-avatar" :src="information.mOrderDetailAppraiseV.headPicName" alt="用户头像">
              <p class="user-name">{{information.mOrderDetailAppraiseV.nickName}}：</p>
              <rater v-model="information.mOrderDetailAppraiseV.productScore" :font-size="15" disabled
                     :margin="1"></rater>
            </div>
            <p class="appraise-content product-common-margin">{{information.mOrderDetailAppraiseV.appraiseContent}}</p>
            <span class="oval-btn all-appraise" @click="toAllAppraise()">查看全部评价</span>
          </group>
          <div class="page-divider">
            <divider>继续拖动，查看图文详情</divider>
          </div>
          <div v-transfer-dom>
            <popup v-model="showSkuPopup" position="bottom" max-height="90%" class="sku-popup-container"
                   :should-rerender-on-show="true" :should-scroll-top-on-show="true" @on-hide="onSkuPopupHide">
              <div class="sku-popup-title">
                <i class="popup-title">{{skuPopupType==1 ? '加入购物车':'立即购买'}}</i>
                <i class="popup-close" @click="hideSkuPopup">
                  <img class="popup-close-img" src="../../../assets/images/popup_close_icon.png">
                </i>
              </div>
              <div class="divider"></div>
              <div class="sku-popup-product-info">
                <img class="popup-product-img" :src="information.productImg">
                <div class="popup-product-info">
                  <i class="popup-product-price">¥ <span class="big-price">{{splitMoney(selectSkuPrice()).int}}</span>{{splitMoney(selectSkuPrice()).float}}{{information.productUnit}}</i>
                  <i class="popup-product-stock">库存：{{selectSkuStock()}}</i>
                  <i class="popup-product-category" v-if="information.enableSku">请选择 {{skuPropertyTip}}</i>
                </div>
              </div>
              <div class="sku-popup-select" v-if="information.enableSku">
                <div class="property-item" v-for="(categoryProperty,propertyIndex) in categoryPropertyList"
                     :key="propertyIndex">
                  <div class="sku-property-name">{{categoryProperty.propertyName}}</div>
                  <div class="property-value-item">
                    <button v-for="(propertyValue,valueIndex ) in categoryProperty.propertyValueList" :key="valueIndex"
                            class="sku-property-value-btn" :class="{'sku-property-value-btn-select':propertyValue.btnState === 2,
                            'sku-property-value-btn-unable':propertyValue.btnState === 0}"
                            :disabled='propertyValue.btnState === 0' @click="clickSkuBtn(propertyIndex,valueIndex)">
                      {{propertyValue.propertyValueName}}
                    </button>
                  </div>
                </div>
              </div>
              <div class="divider"></div>
              <group gutter="5px" style="margin-bottom: 60px">
                <x-number title="购买数量" v-model="buyCount" :fillable="true" :min="minBuyNumber"
                          :max="maxBuyNumber"></x-number>
              </group>
              <button class="sku-popup-confirm-btn" :class="{'sku-popup-confirm-btn-unable':!confirmBtnState.isEnabled}"
                      :disabled="!confirmBtnState.isEnabled" @click="onSkuConfirmBtnClick">{{confirmBtnState.text}}
              </button>
            </popup>
          </div>
        </div>
        <div class="detail-introduce" v-if="information.productContent">
          <!--<span>图文详情</span>-->
          <span v-html="information.productContent"></span>
        </div>
      </div>
      <div class="product-snapshot" v-if="information && information.snapShoot">
        <div class="video-img" v-if="information.productCoverimgs">
          <swiper height="375px" :list="productCoverImgArray" :show-dots="false"
                  :show-desc-mask="false" v-model="swiperIndex"
                  @on-index-change="onSwiperIndexChange">
          </swiper>
          <div class="nav">
            <i :class="{'current':swiperIndex == index }"
               v-for="(item,index) in information.productCoverimgs">
              <span class="pagination">{{index+1}}<i style="display: inline-block">/</i>{{information.productCoverimgs.length}}</span>
            </i>
          </div>
          <div v-transfer-dom>
            <previewer :list="getImgList(information.productCoverimgs)" ref="previewer"
                       :options="options"></previewer>
          </div>
        </div>
        <div class="product-base-info" style="background-color: #fff;margin-bottom: 10px;padding-top: 15px">
          <div class="product-name">{{information.productName}}</div>
          <div class="price-info product-common-margin">
            <div class="sell-price">¥ <span class="big-price">{{splitMoney(information.productPrice).int}}</span>{{splitMoney(information.productPrice).float}}{{information.productUnit}}
            </div>
          </div>
        </div>
        <div class="detail-introduce" v-if="information.productContent">
          <!--<span>图文详情</span>-->
          <span v-html="information.productContent"></span>
        </div>
        <button class="sold-out-tip-btn" @click="goServiceHome">商品已下架，去看看其他商品</button>

      </div>
      <div class="no-product-info" v-if="isUnSale">
        <div class="no-product-container">
          <img class="no-product-img" src="../../../assets/images/No-signal.png"/>
          <span class="no-product-tip">啊哦，商品已经下架了</span>
        </div>
      </div>
    </view-box>
    <div class="bottom-shopping-cart">
      <div class="shoppingcart" @click="goShoppingCart">
        <img class="shoppingcart-img" src="../../../assets/images/productdetail_shoppingcart.png">
        <span class="shoppingcart-num" v-show="showCartsNumber">{{showCartsNumber}}</span>
      </div>
      <div class="add-cart" @click="clickAddCartBtn">加入购物车</div>
      <div class="buy-now" @click="clickBuyNowBtn">立即购买</div>
    </div>
    <div v-transfer-dom v-if="information">
      <x-dialog v-model="isShowParameterDialog" hide-on-blur class="product-parameter-dialog">
        <div class="parameter-title">产品参数</div>
        <div class="parameter-content">
          <div class="parameter-item" v-for="item in information.specificationList">
            <span class="parameter-item-left">{{item.specification.split('：')[0]}}：</span>
            <span class="parameter-item-right">{{item.specification.split('：')[1]}}</span>
          </div>
        </div>
        <div class="parameter-close" @click="isShowParameterDialog=false">
          <span>知道了</span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import {XHeader, Group, Cell, Swiper, SwiperItem, ViewBox, Previewer, TransferDomDirective as TransferDom, XDialog, Rater, Divider,
    Popup, XNumber, querystring} from 'vux'
  import {initSKU} from '../../../common/js/sku'
  export default {
    name: 'productDetail',
    directives: {
      TransferDom
    },
    components: {
      XHeader, Group, Cell, Swiper, SwiperItem, ViewBox, Previewer, XDialog, Rater, Divider, Popup, XNumber
    },
    data () {
      return {
        productId: '',
        swiperIndex: 0,
        isPlaying: false,
        isPause: false,
        isLimit: false,
        isFreightFree: false,
        isUnSale: false,
        isShowParameterDialog: false,
        showSkuPopup: false,
        skuPopupType: 1, // 1：加入购物车，2：立即购买
        buyCount: 1, // 购买数量
        shoppingCartCount: 0, // 购物车数量
        options: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        },
        information: null,
        categoryPropertyList: [],
        productInfoList: []
      }
    },
    created () {
      console.log('created---');
      console.log(this.$route.query.productId)
      console.log(this.$route.query.orderId)
      this.productId = this.$route.query.productId;
      // 1.获取商品详情数据
      // 请求获取到sku数据之后调用
      this.getProductDetail();
      this.getShoppingCartsCount();
    },
    methods: {
      getProductDetail () {
        let this_ = this;
        // 获取商品详情
        // productId会随着选择不同的sku而变化
        let productId = this.productId;
        let orderId = this.$route.query.orderId;
        let url = window.baseURL + '/shopGoods/getProductDetailInfo?productId=' + productId;
        if (orderId) {
          // 我的订单，查看快照过来会有orderId
          url += '&orderId=';
          url += orderId;
        }
        this_.$vux.loading.show({
          text: '加载中'
        });
        this_.$JHttp({
          methods: 'get',
          url: url,
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          console.log('获取商品详情>>>：', res);
          if (res.status === 100) {
            this_.$vux.loading.hide();
            if (res.data) {
              this_.information = res.data;
            } else {
              this_.isUnSale = true;
              console.log(res)
            }
          }
        }).catch(e => {
          this_.$vux.loading.hide();
          console.log(e)
        });
      },
      getShoppingCartsCount () {
        // 获取购物车数量
        let token = localStorage.getItem('token');
        if (!token) {
          // 未登录不需要查询购物车数量
          return;
        }
        this.$JHttp({
          url: window.baseURL + '/productCarts/getProductCartsCount',
          method: 'get'
        }).then(res => {
          console.log('获取购物车数量>>>：', res);
          if (res.status === 100) {
            this.shoppingCartCount = res.data.out;
          }
        }).catch(e => {
          console.log(e)
        });
      },
      getSkuInfo () {
        // 获取商品sku信息，每次弹出sku popup时调用
        let _this = this;
        let params = {
          storeId: _this.information.storeId,
          goodsId: _this.information.goodsId
        };
        this.$JHttp({
          method: 'get',
          url: window.baseURL + '/shopGoods/getProductSKUInfo?' + querystring.stringify(params)
        }).then(res => {
          console.log('获取商品sku信息>>>：', res);
          if (res.status === 100) {
            if (res.data) {
              this.productInfoList = res.data.productInfoList;
              this.categoryPropertyList = res.data.categoryPropertyList;
              if (this.categoryPropertyList) {
                this.categoryPropertyList.forEach(categoryProperty => {
                  if (categoryProperty && categoryProperty.propertyValueList) {
                    categoryProperty.propertyValueList.forEach(propertyValue => {
                      // 给没改属性值对象加上属性id
                      propertyValue.propertyId = categoryProperty.propertyId;
                    })
                  }
                })
              }
              this.initDefaultSku();
              this.trialSkuBtnState()
            }
          }
        }).catch(e => {
          console.log(e)
        });
      },
      requestAddShoppingCart () {
        // 加入购物车请求;
        let _this = this;
        let params = {
          productId: _this.information.productId,
          itemNum: _this.buyCount
        };
        this.$JHttp({
          method: 'post',
          url: window.baseURL + '/productCarts/addProductCarts?' + querystring.stringify(params)
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            _this.$vux.toast.show({
              type: 'success',
              text: '成功加入购物车'
            });
            _this.getShoppingCartsCount();
            _this.hideSkuPopup();
          } else {
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(error => {
          console.error(error);
        });
      },
      switchToImg () {
        // alert('切换到图片');
        this.swiperIndex = 1;
        // 切换到swiper第2项
        if (this.isPlaying) {
          this.pauseVideo();
        }
      },
      switchToVideo () {
        // alert('切换到视频');
        this.swiperIndex = 0;
        if (this.isPause) {
          this.playVideo();
        }
      },
      onSwiperIndexChange (index) {
        if (index === 0 && this.isPause) {
          this.playVideo();
        } else if (index > 0 && this.isPlaying) {
          this.pauseVideo();
        }
      },
      showBigImg (index) {
        this.$refs.previewer.show(index);
      },
      playVideo () {
        var vdo = document.getElementById('product-video-play');
        if (vdo) {
          vdo.play();
          vdo.webkitEnterFullScreen();
          this.isPlaying = true;
          this.isPause = false;
        }
      },
      pauseVideo () {
        var vdo = document.getElementById('product-video-play');
        if (vdo && this.isPlaying) {
          vdo.pause();
          this.isPlaying = false;
          this.isPause = true;
        }
      },
      getImgList (val) {
        let obj1 = {};
        let arr = [];
        val.forEach(res => {
          obj1 = {
            src: res
          };
          arr.push(obj1)
        });
        return arr
      },
      showParameterDialog () {
        this.isShowParameterDialog = true;
      },
      toStoreDetail () {
        // console.log('跳转到门店详情');
        this.$router.push('/shopperProductList/' + this.information.storeId);
      },
      toAllAppraise () {
        // console.log('跳转到全部评价');
        this.$router.push('/productAppraise/' + this.information.productId);
      },
      clickAddCartBtn () {
        let token = localStorage.getItem('token')
        if (token) {
          this.showSkuPopup = true;
          this.skuPopupType = 1;
          // 每次弹出sku选择框都重新获取下sku信息
          this.getSkuInfo()
        } else {
          // todo 这里要添加绑定手机号&房号的验证逻辑
          this.$vux.toast.show({
            type: 'text',
            text: '绑定手机号，可享受更多服务'
          })
        }
      },
      clickBuyNowBtn () {
        let token = localStorage.getItem('token')
        if (token) {
          this.showSkuPopup = true;
          this.skuPopupType = 2;
          // 每次弹出sku选择框都重新获取下sku信息
          this.getSkuInfo()
        } else {
          // todo 这里要添加绑定手机号&房号的验证逻辑
          this.$vux.toast.show({
            type: 'text',
            text: '绑定手机号，可享受更多服务'
          })
        }
      },
      hideSkuPopup () {
        this.showSkuPopup = false;
      },
      clickSkuBtn (propertyIndex, valueIndex) {
        let this_ = this;
        for (var index = 0; index < this_.categoryPropertyList[propertyIndex].propertyValueList.length; index++) {
          var propertyValue = this_.categoryPropertyList[propertyIndex].propertyValueList[index];
          if (index === valueIndex) {
            // 点击的按钮，选中自己，自己切换选中还是非选中状态
            if (propertyValue.btnState === 1) {
              this_.$set(propertyValue, 'btnState', 2);
            } else {
              // 如果想可以取消已选中的，打开这行代码既可
              this_.$set(propertyValue, 'btnState', 1);
            }
          } else {
            // 未点击的按钮 ，兄弟节点取消选中
            this_.$set(propertyValue, 'btnState', 1);
          }
        }
        // 切换到其他sku，可购买上限可能发生变化，要保证当前购买数量不能超出范围
        if (this_.buyCount > this_.maxBuyNumber) {
          this_.buyCount = this_.maxBuyNumber
        }
        if (this_.buyCount < this_.minBuyNumber) {
          this_.buyCount = this_.minBuyNumber
        }
        // 切换到其他sku，商品详情信息也要更新到对应的sku商品信息
        if (this_.selectUniqueSku()) {
          this_.information.productImg = this_.selectUniqueSku().productImg;
          this_.information.productPrice = this_.selectUniqueSku().productPrice;
          this_.information.productId = this_.selectUniqueSku().productId;
          this_.information.skuId = this_.selectUniqueSku().skuId;
          this_.information.productStatus = this_.selectUniqueSku().productStatus;
          this_.information.productLimitopt = this_.selectUniqueSku().productLimitopt;
          this_.information.isJoinActivity = this_.selectUniqueSku().isJoinActivity;
          this_.information.onsiteMinprice = this_.selectUniqueSku().onsiteMinprice;
          this_.information.productStock = this_.selectUniqueSku().productStock;
          this_.productId = this_.selectUniqueSku().productId;
          // console.log('切换到sku商品-sku：' + this_.selectUniqueSku().productId);
        }
        this.trialSkuBtnState();
      },
      initDefaultSku () {
        // 初始化默认sku时，
        let this_ = this;
        var defaultSkuId = this_.information.skuId;
        var defaultSelectIds; // 样例： ["1","2","4"],
        // 找的默认选中sku的组合id
        this.productInfoList.forEach(product => {
          if (product.skuId === defaultSkuId) {
            defaultSelectIds = product.propertyValueId;
          }
        });
        if (!defaultSelectIds) {
          // 没找的默认sku组合
          return
        }
        for (var property of this_.categoryPropertyList) {
          for (var propertyValue of property.propertyValueList) {
            if (defaultSelectIds.find(function (value, index, arr) {
              return (value + '') === (propertyValue.propertyValueId + '');
            })) {
              this_.$set(propertyValue, 'btnState', 2);
            } else {
              this_.$set(propertyValue, 'btnState', 1);
            }
          }
        }
      },
      trialSkuBtnState () {
        // 用已选中的节点验证待测试节点 ,目的是为了设置btnState，从而引起sku属性按钮状态样式变化
        // 每次sku按钮点击后需要调用这方法，初始化设置默认sku也需要调用，
        // 试算方法：找的所有未选中的节点，对这些节点遍历，---》每个节点替换跟已选中的sku组合中对应属性的属性值，生成一个新的sku组合，
        // 然后拿这个sku组合跟skuPermutationList对比，如果能找到，则节点可点击，找不到则不可点击
        let this_ = this;
        var selectPropertyValues = this_.selectSku().selectPropertyValues;  // selectSkuIds可能是部分属性，没全选中
        for (var property of this_.categoryPropertyList) {
          for (var propertyValueObj of property.propertyValueList) {
            if (propertyValueObj.btnState !== 2) {
              var cacheSelect = [];
              cacheSelect.push(propertyValueObj)
              for (var selectPropertyValue of selectPropertyValues) {
                if (selectPropertyValue.propertyId !== propertyValueObj.propertyId) {
                  cacheSelect.push(selectPropertyValue)
                }
              }
              //  到这里cacheSelect里面已经保存了试算用的sku属性值组合，可能会重复选试算中的sku属性值
              var cacheSelectValueIds = [];
              for (var cachePropertyValue of cacheSelect) {
                cacheSelectValueIds.push(cachePropertyValue.propertyValueId);
              }
              cacheSelectValueIds.sort(function (value1, value2) {
                return parseInt(value1) - parseInt(value2);
              });
              var cacheSelectPermutationItem = this_.skuPermutationList[cacheSelectValueIds.join(';')]
              if (cacheSelectPermutationItem && cacheSelectPermutationItem.count > 0) {
                this_.$set(propertyValueObj, 'btnState', 1);
              } else {
                this_.$set(propertyValueObj, 'btnState', 0);
              }
            }
          }
        }
      },
      onSkuPopupHide () {
        // sku 弹窗消失，如果选择的sku发生变化，想重新查询商品详情，这里处理
      },
      goShoppingCart () {
        this.$router.push('/shoppingCart/detail');
      },
      onSkuConfirmBtnClick () {
        if (this.skuPopupType === 1) {
          // 请求加入购物车
          console.log('请求加入购物车')
          this.requestAddShoppingCart()
        } else {
          console.log('立即购买-跳转到确认订单页面')
          // 立即购买-跳转到确认订单页面
          let num = this.buyCount;
          let productId = this.information.productId;
          let productObj = {productId: productId, itemNum: num}
          this.$router.push({
            path: '/confirmOrders',
            query: {productList: JSON.stringify([productObj])}
          });
        }
      },
      goServiceHome () {
        console.log('跳转到服务首页')
      },
      selectSku () {
        // 获取选中的sku组合，在categoryPropertyList中，选取btnState===2的
        let selectSkuIds = []; // 选中的sku组合，[属性1选中的值id,属性2选中的值id,属性2-选中的值id,...]
        let selectPropertyValues = []; // 选中的sku属性对象集合，[]
        let selectSkuObj = {}; // 选中的sku对象，包含{库存，价格数组，sku商品对象集}
        for (var property of this.categoryPropertyList) {
          // 遍历属性列表
          for (var propertyValue of property.propertyValueList) {
            // 遍历属性值列表
            if (propertyValue.btnState === 2) {
              selectSkuIds.push(propertyValue.propertyValueId);
              selectPropertyValues.push(propertyValue);
              // 在该属性中找到一个选中的属性值，跳出循环
              break;
            }
          }
        }
        // 排序主要是避免同一个sku商品因为sku组合顺序不同当着不同商品
        selectSkuIds.sort(function (value1, value2) {
          return parseInt(value1) - parseInt(value2);
        });
        selectPropertyValues.sort(function (value1, value2) {
          return parseInt(value1.propertyValueId) - parseInt(value2.propertyValueId);
        });
        selectSkuObj = this.skuPermutationList[selectSkuIds.join(';')]
        return {
          selectSkuIds: selectSkuIds,
          selectPropertyValues: selectPropertyValues,
          selectSkuObj: selectSkuObj
        }
      },
      selectUniqueSku () {
        // 商品的所有sku属性都有选择，指定到唯一sku商品时，会返回sku商品对象
        if (this.selectSku().selectSkuIds.length === this.categoryPropertyList.length) {
          if (this.selectSku().selectSkuObj.products) {
            return this.selectSku().selectSkuObj.products[0];
          }
        }
      },
      selectSkuPrice () {
        // 当前选择sku对应的价格，暂时不考虑未选全时显示价格区间，如果以后要显示价格区间，在这里处理就行
        // var prices = this.selectSku().selectSkuObj.prices;
        // var maxPrice = Math.max.apply(Math, prices);
        // var minPrice = Math.min.apply(Math, prices);
        // var pristr = maxPrice > minPrice ? minPrice + '-' + maxPrice : maxPrice;
        // // return prices[0];
        // return pristr;

        if (!this.selectSku() ||
          !this.selectSku().selectSkuObj ||
          !this.selectSku().selectSkuObj.prices) {
          return '';
        }
        if (this.selectSku().selectSkuObj.prices.length > 0) {
          return this.selectSku().selectSkuObj.prices[0];
        }
        return ''
      },
      selectSkuStock () {
        // 计算选中的sku商品对应的库存，如果是多个sku商品则库存和
        var count = 0;
        if (!this.selectSku() ||
          !this.selectSku().selectSkuObj) {
          // 没选择任何sku属性，取各sku商品库存和
          this.productInfoList.forEach(item => {
            count += parseInt(item.productStock);
          })
          return count;
        }
        return this.selectSku().selectSkuObj.count;
      },
      splitMoney (money) {
        // 金钱整数跟小数分开，主要是为了不同显示效果
        if (!money) {
          return {
            int: '0',
            float: '.00'
          };
        }
        let tempArray = money.toFixed(2).split('.');
        return {
          int: tempArray[0],
          float: '.' + tempArray[1]
        }
      }
    },
    computed: {
      isShowFright () {
        if (!this.information) {
          return false
        }
        // 无物流或者只有用户自提时，不显示运费
        if (this.information.deliverySetting === 1 || this.information.deliverySetting === '1') {
          // 无物流
          return false
        } else {
          if (this.information.deliveryType === 3 || this.information.deliveryType === '3') {
            // 只有用户自提
            return false
          }
        }
        return true;
      },
      realFrightOrServiceKey () {
        if (!this.information) {
          return ''
        }
        // 根据物流方式获取要显示的费用名
        if (this.information.deliverySetting === 2 || this.information.deliverySetting === '2') {
          // 有物流
          if (this.information.deliveryType.indexOf('1') !== -1) {
            // 快递
            return '运费';
          } else if (this.information.deliveryType.indexOf('2') !== -1) {
            // 送货上门
            return '服务费';
          }
        }
        return '运费';
      },
      realFrightOrServiceMoney () {
        // 根据物流方式获取要显示免邮提示
        if (!this.information) {
          return 0
        }
        if (this.information.deliverySetting === 2 || this.information.deliverySetting === '2') {
          // 有物流
          if (this.information.deliveryType.indexOf('1') !== -1) {
            // 快递
            return this.information.freightMoney;
          } else if (this.information.deliveryType.indexOf('2') !== -1) {
            // 送货上门
            return this.information.onsiteServiceExpense;
          }
        }
        return 0;
      },
      realFrightOrServiceActivityTip () {
        // 根据物流方式获取要显示免邮提示
        if (!this.information) {
          return '';
        }

        if (this.information.deliverySetting === 1 || this.information.deliverySetting === '1') {
          // 无物流
          return '';
        }
        if (this.information.deliveryType.indexOf('1') !== -1) {
          // 快递
          if (parseFloat(this.information.freightMoney) === 0 || parseFloat(this.information.minMoney) === 0) {
            // minMoney如果是0，则不需要运费；-1则需要运费
            return '全场包邮';
          } else if (parseFloat(this.information.minMoney) > 0) {
            return '满' + this.information.minMoney + '元免' + this.information.freightMoney + '元运费'
          }
        } else if (this.information.deliveryType.indexOf('2') !== -1) {
          // 送货上门
          if (parseFloat(this.information.onsiteServiceExpense) === 0 || parseFloat(this.information.onsiteFreeService) === 0) {
            // onsiteFreeService如果是0，则不需要服务费；-1则需服务费
            return '全场免服务费';
          } else if (parseFloat(this.information.onsiteFreeService) > 0) {
            return '满' + this.information.onsiteFreeService + '元免' + this.information.onsiteServiceExpense + '元服务费'
          }
        }
        return '';
      },
      skuPropertyTip () {
        let arr = [];
        this.categoryPropertyList.forEach(item => { arr.push(item.propertyName); })
        return arr.join(' ');
      },
      skuPermutationList () {
        // 将原始productInfoList数据经过拆分排列处理后的数据，万分重要
        return initSKU(this.productInfoList);
      },
      maxBuyNumber () {
        // 最大可购数目-综合考虑库存，限购
        if (!this.selectSku() ||
          !this.selectSku().selectSkuObj) {
          if (this.selectSkuStock() > 0) {
            return this.selectSkuStock();
          } else {
            return 0;
          }
        }
        if (this.selectSku().selectSkuObj.products.length === 1) {
          // 每种sku属性全部都有选择--选到了sku商品
          var product = this.selectSku().selectSkuObj.products[0];
          if (product.productLimitopt > 0 && this.selectSkuStock() > product.productLimitopt) {
            // 库存大于限购，上限为限购
            return product.productLimitopt
          } else {
            return this.selectSkuStock()
          }
        } else {
          return this.selectSkuStock();
        }
      },
      minBuyNumber () {
        if (this.selectSkuStock() > 0) {
          return 1;
        } else {
          return 0
        }
      },
      confirmBtnState () {
        // 确认按钮状态，需要考虑sku属性是否都选中，限购，库存，购买数量（大于0），起送价（大于起送价）
        let confirmBtnState = {
          isEnabled: true,
          text: '确定'
        }
        // console.log('confirmBtnState---');
        if (this.information.enableSku === 1) {
          // sku商品
          if (!this.selectSku() ||
            !this.selectSku().selectSkuObj ||
            !this.selectSku().selectSkuIds ||
            this.selectSku().selectSkuIds.length < this.categoryPropertyList.length) {
            // 未全选sku属性----选中属性个数少于属性总数
            confirmBtnState.isEnabled = false;
            return confirmBtnState;
          }
          if (this.selectSku().selectSkuObj.products.length === 1) {
            if (this.selectSku().selectSkuObj.products[0].productLimitopt === -1) {
              // 商品目前不支持购买
              confirmBtnState.isEnabled = false;
              confirmBtnState.text = '暂停销售';
              return confirmBtnState;
            }
          }
          if (this.selectSkuStock() < 1) {
            confirmBtnState.isEnabled = false;
            confirmBtnState.text = '暂无库存';
            return confirmBtnState;
          }
        } else {
          // 非sku产品
          if (this.information.productLimitop === -1) {
            confirmBtnState.isEnabled = false;
            confirmBtnState.text = '暂停销售';
            return confirmBtnState;
          }
          if (this.information.productStock < 1) {
            confirmBtnState.isEnabled = false;
            confirmBtnState.text = '暂无库存';
            return confirmBtnState;
          }
        }

        if (this.buyCount < 1) {
          confirmBtnState.isEnabled = false;
          return confirmBtnState;
        }
        if (this.skuPopupType === 2) {
          // 立即购买
          var price = parseFloat(this.information.productPrice);
          var onsiteMinprice = parseFloat(this.information.onsiteMinprice);
          var total = price * this.buyCount;
          if (total < onsiteMinprice) {
            var shortMoney = onsiteMinprice - total;
            confirmBtnState.isEnabled = false;
            confirmBtnState.text = '¥' + onsiteMinprice + '起送，还差¥' + shortMoney.toFixed(2);
            return confirmBtnState
          }
        }
        return confirmBtnState;
      },
      showCartsNumber () {
        if (this.shoppingCartCount < 1) {
          return '';
        } else if (this.shoppingCartCount <= 99) {
          return this.shoppingCartCount;
        } else {
          return '...';
        }
      },
      productCoverImgArray () {
        if (this.information.productCoverimgs) {
          let obj1 = {};
          let arr = [];
          this.information.productCoverimgs.forEach(res => {
            obj1 = {
              img: res
            };
            arr.push(obj1)
          });
          return arr
        }
      },
      storeTelphone () {
        let phone = 'tel:';
        phone += this.information.storePhone;
        return phone;
      }
    }
  }
</script>

