<template>
  <div class="myBroker commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">

      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="list" v-if="list.length > 0" v-for="item in list">
        <div class="item">
          <img v-if="item.agentHeadPic" :src="item.agentHeadPic">
          <img v-if="!item.agentHeadPic" src="../../../assets/images/headportrait.png">
          <div class="info"> 
            <span class="name" v-text="item.agentName"></span>
            <span class="address">经纪人</span>
          </div>
          <a :href="'tel:'+ item.agentPhone"></a>
        </div>
      </div>

      <div class="placeholder-warpper" v-if="showPlaceholder && list.length === 0">
        <img src="../../../assets/images/No-content.png">
        <p>什么都没发现，去别处看看吧</p>
      </div>

    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader } from 'vux'
  export default {
    name: 'myBroker',
    components: {
      ViewBox,
      XHeader
    },
    data () {
      return {
        title: '我的经纪人',
        showPlaceholder: false,
        list: []
      }
    },
    created () {
      this.getBrokerList()
    },
    methods: {
      getBrokerList () {
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
<style type="text/less" lang="less" scoped>
.myBroker {
  height: 100%;
  background-color: #f2f2f2;
  .list {
    margin-top: 10px;
    .item {
      display: flex;
      align-items: center;
      background: #FFFFFF;
      padding: 20px 15px;
      margin-bottom: 10px;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .info {
        flex: 1;
        .name {
          height: 25px;
          line-height: 25px;
          font-size: 18px;
          color: #333333;
          margin-bottom: 4px;
        }
        .address {
          height: 21px;
          line-height: 21px;
          font-size: 15px;
          color: #AAAAAA;
        }
      }
      a {
        display: inline-block;
        width: 18px;
        height: 18px;
        padding: 5px;
        background-image: url("../../../assets/images/consult_icon_black.png");
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
  }
  .placeholder-warpper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 95.5px;
    img {
      width: 150px;
      height: 150px;
      margin-bottom: 10px;
    }
    p {
      color: #AAAAAA;
      font-size: 15px;
    }
    .button-Service {
      margin-top: 10px;
      width: 150px;
      height: 35px;
      line-height: 35px;
      color: #FFFFFF;
      text-align: center;
      background: #FF6648;
      border-radius: 67px;
    }
  }
}
</style>
