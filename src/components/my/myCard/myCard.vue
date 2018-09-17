<template>
  <div class="myCard commonHeader">

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
        <div class="item">
          <img src="../../../assets/images/card2.png" alt="">
        </div>

      </div>


      <div class="add-item" @click="addCard">
        <img src="../../../assets/images/add_card.png" alt="">
      </div>


      <div class="placeholder-warpper" v-if="showPlaceholder && list.length === 0">
        <img src="../../../assets/images/No-content.png">
        <p>什么都没发现，去别处看看吧</p>
      </div>

    </view-box>

  </div>
</template>
<script>
  import {ViewBox, XHeader} from 'vux'

  export default {
    name: 'myCard',
    components: {
      ViewBox,
      XHeader
    },
    data () {
      return {
        title: '我的会员卡',
        showPlaceholder: false,
        list: []
      }
    },
    created () {
      this.getCardList()
    },
    methods: {
      getCardList () {
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
      },
      addCard () {
        this.$router.push('/myCard/newCard');
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .myCard {
    height: 100%;
    background-color: #f2f2f2;
    .add-item {
      display: block;
      background: #FFFFFF;
      padding: 10px 15px;
    }
    .list {
      margin-top: 10px;
      .item {
        display: block;
        background: #FFFFFF;
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
