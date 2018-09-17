<template>
  <div class="cardInfo commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">

      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header"
                :left-options="{ backText: '' }" :title=title></x-header>

      <div class="list">
        <div class="item">
          <img src="../../../assets/images/card1.png" alt="">
          <div class="card-info">
            <em>卡内余额：</em>
            <span>￥10000</span>
          </div>
        </div>
      </div>
      <div class="btn-group" style="">
        <button class="btn">充 值</button>
        <!--<button class="btn">开 通</button>-->
      </div>
      <group class='detail' label-width="4em" title="会员卡详情" title-color="#333">
        <cell align-items="flex-start" value-align="left" class="detail-info">
            <span slot="title" class="detail-title">发行方</span>
            <span class="detail-desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam autem consequatur dolores ea et illo incidunt, iste, nesciunt obcaecati odit pariatur quasi, rem repudiandae sed suscipit totam ullam voluptate voluptates.</span>
        </cell>
        <cell align-items="flex-start" value-align="left" class="detail-info">
            <span slot="title" class="detail-title">发行方</span>
            <span class="detail-desc">宝华桃李春风</span>
        </cell>
      </group>

      <div class="spacing-container"></div>
      <group class="store-list" title="适用门店" title-color="#333">
        <cell>
          <div slot="title">
            <span class="store-title">小桃红餐厅店</span>
            <span class="store-addr">宝华桃李春风揽月菀123号</span>
          </div>
          <div>
            <span class="store-desc">部分商品</span>
            <span class="store-discount">9折</span>
          </div>
        </cell>
      </group>
    </view-box>

  </div>
</template>
<script>
  import {ViewBox, XHeader, Cell, Group} from 'vux'

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
        title: 'card1',
        showPlaceholder: false,
        list: []
      }
    },
    created () {
      this.getCardInfo()
    },
    methods: {
      getCardInfo () {
        let _this_ = this
        _this_.$JHttp({
          method: 'GET',
          url: window.baseURL + '/agent/info',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            _this_.showPlaceholder = true
            _this_.list = res.data || []
          }
        }).catch(e => {
          console.log(e)
        });
      }
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
          left: 50%;
          top: 50%;
          transform: translate(-55%, -40%);
          -webkit-transform: translate(-55%, -40%);
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
    .detail{
      :after{
        border: 1px solid #fff;
      }
      .detail-info{
        .detail-title{
          color: #ababab;
          font-size: 13px;
        }
        .detail-desc{
          color: #333;
          font-size: 13px;
          text-align: left;
          margin-top: 4px;
        }
      }
    }
    .spacing-container {
      width: 100%;
      height: 10px;
      background-color: #f5f5f5;
    }
    .store-list{
      .store-title{
        color: #333;
        font-size: 13px;
      }
      .store-addr{
        color: #ababab;
        font-size: 11px;
        margin-top: 4px;
      }
      .store-desc{
        color: #ababab;
        font-size: 10px;
        display: inline;
      }
      .store-discount{
        color: #333;
        font-size: 13px;
        display: inline;
      }
    }
  }
</style>
