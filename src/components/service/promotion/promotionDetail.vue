<template>
<div class="promotionDetail commonHeader" :style="{ backgroundColor: bgColor }">
  <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100" :left-options="{ backText: '' }" :title=name></x-header>
    <div class="top">
      <div class="title top-title ui-nowrap">
        <span class="title-item time" v-text="activityStatus === 1 ? activityBegintime : activityEndtime"></span>
        <span class="title-item text" v-text="activityStatus === 1 ? '大促开始' : '大促结束'"></span>
      </div>
      <img class="img" :src="bgPic">
      <ul class="redPackets">
        <li class="redPacket" v-for="(item, index) in redPackets" @click="getRedpacket(item)">
          <span class="redPacket-money">
            <label class="unit">¥ </label>
            <label class="money" v-text="item.money"></label>
          </span>
          <!-- <span class="redPacket-tips" v-text="item.redpacketTypeName"></span> -->
          <span class="redPacket-limit ui-nowrap" v-text="item.exchange"></span>
          <span class="redPacket-service ui-nowrap" v-text="item.redpacketType === 1 ? '全场通用' : (item.redpacketType === 2 ? '限' + item.shopName : '限'+ item.storeName)"></span>
        </li>
      </ul>
    </div>
    <div class="bottom">
      <div class="bottom-item" v-for="(group, groupIndex) in groups">
        <div class="title">
          <span class="title-item" v-text="group.name"></span>
        </div>
        <ul class="list">
          <li class="list-item" v-for="(good, goodIndex) in group.goods" @click="goodDetail(good)">
            <img class="list-item-img" :src="good.coverimg">
            <div class="list-item-name ui-nowrap" v-text="good.name"></div>
            <div class="list-item-desc ui-nowrap" v-text="good.skuStr"></div>
            <div class="list-item-rate">
              <div class="progress">
                <span :style="{ width: good.rate }""></span>
              </div>
              <div class="rate" v-text="'已售' + good.rate"></div>
            </div>
            <div class="list-item-price">
              <div class="price">
                <div class="current-price">
                  <span class="unit"><b>¥ </b></span>
                  <span class="price"><b v-text="good.price_before"></b></span>
                  <span><b v-text="'.' + good.price_after"></b></span>
                </div>
                <!-- <div class="original-price" v-text="'¥' + good.originalPrice"></div> -->
              </div>
              <img class="grab-icon" src="./grab.png">
            </div>
          </li>
        </ul>
      </div>
    </div>
  </view-box>
</div>
</template>
<script>
  import Vue from 'vue'
  import { ViewBox, XHeader } from 'vux'
  export default {
    name: 'promotionDetail',
    components: {
      ViewBox,
      XHeader
    },
    data () {
      return {
        promotionId: '',
        storeIds: '',
        bgColor: '',
        name: '',
        activityStatus: 0,
        activityBegintime: '',
        activityEndtime: '',
        bgPic: '',
        groups: [],
        redPackets: []
      }
    },
    created () {
      this.promotionId = this.$route.query.promotionId
      this.storeIds = this.$route.query.storeIds
      this.getPromotionDetail()
    },
    methods: {
      getRedpacket (item) {
        let _this_ = this
        _this_.$JHttp({
          method: 'post',
          url: window.baseURL + '/promotion/haveGetRedpacket?topicId=' + item.id + '&topicRedPacketId=' + item.topicRedPacketId
        }).then(res => {
          if (res.status === 100) {
            if (res.data === 0) {
              _this_.$JHttp({
                method: 'post',
                url: window.baseURL + '/promotion/getRedpacket?topicId=' + item.id + '&topicRedPacketId=' + item.topicRedPacketId
              }).then(res => {
                if (res.status === 100) {
                  if (res.data === 0) {
                    _this_.$vux.toast.show({
                      type: 'text',
                      text: '领取成功'
                    })
                  } else {
                    _this_.$vux.toast.show({
                      type: 'text',
                      text: '领取不成功'
                    })
                  }
                }
              }).catch(e => {
                console.log(e)
              });
            } else if (res.data === 1) {
              _this_.$vux.toast.show({
                type: 'text',
                text: '您已经领过该红包了'
              })
            } else if (res.data === 2) {
              _this_.$vux.toast.show({
                type: 'text',
                text: '手慢了,红包被已经领完了'
              })
            }
          }
        }).catch(e => {
          console.log(e)
        });
      },
      goodDetail (item) {
        this.$router.push({path: '/productDetail', query: {productId: item.id}});
      },
      getPromotionDetail (loaded) {
        let _this_ = this;
        // _this_.$vux.loading.show({
        //   text: '加载中'
        // });
        _this_.$JHttp({
          method: 'post',
          url: window.baseURL + '/promotion/getTopicDetail?id=' + this.promotionId + '&storeIds=' + this.storeIds
        }).then(res => {
          // _this_.$vux.loading.hide();
          if (res.status === 100) {
            _this_.name = res.data.name
            _this_.activityStatus = res.data.activityStatus
            _this_.activityBegintime = res.data.activityBegintime
            _this_.activityEndtime = res.data.activityEndtime
            _this_.bgColor = res.data.bgColor
            _this_.bgPic = res.data.bgPic
            _this_.groups = res.data.groups
            _this_.redPackets = res.data.redPackets
            _this_.groups.forEach((group) => {
              group.goods.forEach((good, index) => {
                if (good.price.toString().indexOf('.') === -1) {
                  Vue.set(group.goods[index], 'price_before', good.price)
                  Vue.set(group.goods[index], 'price_after', '00')
                } else {
                  Vue.set(group.goods[index], 'price_before', good.price.toString().split('.')[0])
                  Vue.set(group.goods[index], 'price_after', good.price.toString().split('.')[1] ? good.price.toString().split('.')[1] : '00')
                }
              })
            })
          }
        }).catch(e => {
          // _this_.$vux.loading.hide();
          console.log(e)
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.promotionDetail {
  height: 100%;
  .ui-nowrap {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .title {
    width: 345px;
    height: 40px;
    margin: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(51,51,51,0.20);
    border-radius: 10px;
    .title-item {
      height: 25px;
      line-height: 25px;
      font-size: 18px;
      color: #FFFFFF;
    }
  }
  .top {
    display: inline-block;
    /*background-color: #921C2A;*/
    padding-bottom: 1.5px;
    .top-title {
      height: 35px;
      margin: 7.5px 15px;
      .time {
        margin-right: 10px;
      }
    }
    .img {
      width: 375px;
      height: 217.5px;
    }
    .redPackets {
      background: rgba(51,51,51,0.20);
      box-shadow: inset 0 1px 3px 0 rgba(0,0,0,0.50);
      height: 100%;
      padding: 10px 15px;
      .redPacket {
        display: inline-block;
        color: #FFFFFF;
        width: 87px;
        height: 94px;
        text-align: center;
        background-image: url('redbag_bg.png');
        background-size: 100% 100%;
        &:not(:last-child) {
          margin-right: 42px;
        }
        .redPacket-money {
          height: 41px;
          margin-bottom: 3px;
          .unit {
            font-size: 12px;
          }
          .money {
            font-size: 24px;
          }
        }
        .redPacket-tips {
          display: inline-block;
          height: 10px;
          line-height: 10px;
          position: relative;
          font-size: 10px;
          padding: 4px;
          margin: 3px 0 2px 0;
        }
        .redPacket-tips:before {
          position: absolute;
          top: 0;
          left: 0;
          content: '';
          width: 200%;
          height: 200%;
          border: 1px solid #FFFFFF;
          border-radius: 15px;
          transform-origin: 0 0;
          transform: scale(0.5, 0.5);
          box-sizing: border-box;
        }
        .redPacket-limit {
          display: block;
          color: #ffb8b6;
          height: 14px;
          line-height: 14px;
          font-size: 12px;
          padding: 10px 10px 3px;
        }
        .redPacket-service {
          display: block;
          color: #ffb8b6;
          height: 14px;
          line-height: 14px;
          font-size: 12px;
          padding: 0 10px;
        }
      }
    }
  }
  .bottom {
    .bottom-item {
      display: inline-block;
      /*background-color: #921C2A;*/
      .list {
        display: flex;
        flex-flow: row wrap;
        background-color: #FFFFFF;
        padding: 15px 15px 0;
        .list-item {
          width: 165px;
          padding-bottom: 20px;
          &:nth-child(odd) {
            padding-right: 15px;
          }
          .list-item-img {
            width: 165px;
            height: 165px;
            margin-bottom: 5px;
          }
          .list-item-name {
            height: 21px;
            line-height: 21px;
            color: #333333;
            font-size: 15px;
            margin-bottom: 2px;
          }
          .list-item-desc {
            height: 16.5px;
            line-height: 16.5px;
            color: #AAAAAA;
            font-size: 12px;
            margin-bottom: 8px;
          }
          .list-item-rate {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;
            .progress {
              height: 13px;
              background: #f3bdbd;
              -webkit-border-radius: 20px;
              border: 1px solid #fa5757;
              overflow: hidden; width: 100px;
              font-size: 0px;
              background-color: #f3bdbd;
              box-sizing: border-box;
              span {
                display: block;
                width: 0%;
                background: #FF3939;
                height: 100%;
                animation: animate-positive 2s;
              }
            }
            .rate {
              height: 10px;
              line-height: 10px;
              color: #AAAAAA;
              font-size: 10px;
            }
          }
          .list-item-price {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            .price {
              display: flex;
              align-items: flex-end;
              .current-price {
                height: 12px;
                line-height: 12px;
                display: inline-flex;
                align-items: baseline;
                justify-content: flex-start;
                font-size: 12px;
                color: #FF3939;
                margin-right: 4px;
                .unit {
                  margin-right: 4px;
                }
                .price {
                  font-size: 18px;
                }
              }
              .original-price {
                height: 10px;
                line-height: 10px;
                display: inline-block;
                color: #AAAAAA;
                font-size: 10px;
                text-decoration:line-through;
              }
            }
            .grab-icon {
              width: 28px;
              height: 28px;
            }
          }
        }
      }
    }
  }
}
</style>
