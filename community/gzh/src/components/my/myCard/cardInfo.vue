<template>
  <div class="cardInfo commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">

      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header"
                :left-options="{ backText: '' }" :title=title></x-header>

      <div class="list">
        <div class="item">
          <img :src=cardPic alt="">
          <div class="card-info">
            <em v-if="money>0" style="margin-right: 15px">友元余额：{{money}}</em>
            <em v-if="validDate">有效期：{{validDate}}</em>
          </div>
          <!--<div class="card-share">享</div>-->
        </div>
      </div>
      <!--<div class="btn-group">-->
      <!--<button class="btn">充 值</button>-->
      <!--<button class="btn" @click="activeCard">开 通</button>-->
      <!--</div>-->

      <!--会员卡详情-->
      <group class='detail' label-width="4em" title="会员卡详情" title-color="#333">
        <cell align-items="flex-start" value-align="left" class="detail-info">
          <span slot="title" class="detail-title">特权说明</span>
          <span class="detail-desc">{{rightsDesc}}</span>
        </cell>
        <cell align-items="flex-start" value-align="left" class="detail-info">
          <span slot="title" class="detail-title">发行方</span>
          <span class="detail-desc">{{publicPlatform}}</span>
        </cell>
        <cell align-items="flex-start" value-align="left" class="detail-info">
          <span slot="title" class="detail-title">客服电话</span>
          <a class="detail-desc" :href="'tel:'+ serviceHotline">{{serviceHotline}}</a>
        </cell>
        <cell align-items="flex-start" value-align="left" class="detail-info" v-if="validDate">
          <span slot="title" class="detail-title">有效期</span>
          <span class="detail-desc">{{validDate}}</span>
        </cell>
        <cell align-items="flex-start" value-align="left" class="detail-info">
          <span slot="title" class="detail-title">获取方式</span>
          <span class="detail-desc">{{getTypeDesc}}</span>
        </cell>
      </group>

      <div class="spacing-container"></div>
      <!--适用门店-->
      <group class="store-list" title="适用门店" title-color="#333" v-if="storeList.length>0">
        <cell v-for="store in storeList" :link="'/shopperProductList/' + store.storeId">
          <div slot="title">
            <span class="store-title">{{store.storeName}}</span>
            <span class="store-addr">{{store.storeAddress}}</span>
          </div>
          <div>
            <span class="store-desc">部分商品</span>
            <span class="store-discount">{{store.discount}}折</span>
          </div>
        </cell>
      </group>
    </view-box>

  </div>
</template>
<script>
  import {ViewBox, XHeader, Cell, Group} from 'vux'
  import {jlDate} from 'common/js/utils';

  export default {
    name: 'cardInfo',
    components: {
      ViewBox,
      XHeader,
      Cell,
      Group
    },
    data () {
      return {
        title: '会员卡信息',
        storeList: [],
        money: 0,
        cardPic: '',
        rightsDesc: '',
        publicPlatform: '',
        serviceHotline: '',
        validDate: '',
        getTypeDesc: ''
      }
    },
    created () {
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.getCardInfo()
    },
    methods: {
      getCardInfo () {
        let that = this
        let cardId = this.$route.params.cardId;
        that.$JHttp({
          method: 'GET',
          url: window.baseURL + '/order/memberCard/' + cardId,
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          this.$vux.loading.hide()
          if (res.status === 100) {
            console.log(res.data)
            that.storeList = res.data.cardInfo.storeList;
            that.cardPic = window.aliyunHome + res.data.cardInfo.cardPic;
            that.rightsDesc = res.data.cardInfo.rightsDesc;
            that.getTypeDesc = res.data.cardInfo.getTypeDesc;
            that.publicPlatform = res.data.cardInfo.publicPlatform;
            that.serviceHotline = res.data.cardInfo.serviceHotline;
            if (res.data.userCardInfo) {
              that.money = res.data.userCardInfo.money;
              that.validDate = res.data.userCardInfo.validDate ? jlDate.Dateformat(res.data.userCardInfo.validDate, 'YYYY-MM-DD') : '长期有效'
            } else {
              that.validDate = res.data.cardInfo.expiredTime
            }
          } else {
            that.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          console.log(e)
        });
      },
      goToStore (id) {
        this.$router.push('/shopperProductList/' + id)
      }
      // activeCard () {
      //   this.$vux.confirm.show({
      //     // 组件除show外的属性
      //     content: '确认开通',
      //     showCancelButton: false,
      //     onConfirm () {
      //       console.log(111)
      //     }
      //   })
      // }
    }
  }
</script>
<style type="text/less" lang="less">
  .cardInfo {
    height: 100%;
    background: #FFFFFF;
    .list {
      margin-top: 10px;
      background: #fff;
      .item {
        display: block;
        padding: 10px 15px;
        position: relative;

        .card-info {
          position: absolute;
          color: #fff;
          vertical-align: middle;
          left: 10%;
          bottom: 12%;

          em {
            display: inline;
          }
          span {
            display: inline;
            font-size: 27.5px;
            vertical-align: middle
          }
        }
      }
    }

    .btn-group {
      background: #fff;
      display: flex;
      justify-content: center;

      .btn {
        width: 88px;
        height: 30px;
        background-color: #00ae57;
        color: #fff;
        border: none;
        border-radius: 1px;
      }
    }
    .detail {
      :after {
        border: 1px solid #fff;
      }
      .detail-info {
        .detail-title {
          color: #ababab;
          font-size: 13px;
        }
        .detail-desc {
          color: #333;
          font-size: 13px;
          text-align: left;
          margin-top: 5px;
        }
      }
    }
    .spacing-container {
      width: 100%;
      height: 10px;
      background-color: #f5f5f5;
    }
    .store-list {
      margin-bottom: 20px;
      .store-title {
        color: #333;
        font-size: 13px;
      }
      .store-addr {
        color: #ababab;
        font-size: 11px;
        margin-top: 4px;
      }
      .store-desc {
        color: #ababab;
        font-size: 10px;
        display: inline;
      }
      .store-discount {
        color: #333;
        font-size: 13px;
        display: inline;
      }
    }

    .card-share {
      width: 30px;
      height: 30px;
      background-color: #0DAB60;
      color: #fff;
      position: absolute;
      bottom: 22px;
      right: 24px;
      line-height: 30px;
      text-align: center;
      border-top-left-radius: 50%;
      border-bottom-right-radius: 12px;
    }
  }
</style>
