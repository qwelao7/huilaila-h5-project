<template>
  <div class="newCard commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">

      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header"
                :left-options="{ backText: '' }" :title=title></x-header>

      <div class="list">
        <div class="item" v-for="card in list" @click="toCardInfo(card.id)">
          <img :src=card.cardPic>
          <div class="card-info">
            <span>查看详情 ></span>
          </div>
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
  import {ViewBox, XHeader} from 'vux'

  export default {
    name: 'newCard',
    components: {
      ViewBox,
      XHeader
    },
    data () {
      return {
        title: '未开通会员卡',
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
          url: window.baseURL + '/order/memberCard/notOpen',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            _this_.showPlaceholder = true
            _this_.list = res.data || []
            _this_.list.forEach(function (item) {
              item.cardPic = window.aliyunHome + item.cardPic
            })
          }
        }).catch(e => {
          console.log(e)
        });
      },
      toCardInfo (cardId) {
        this.$router.push('/myCard/cardInfo/' + cardId);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .newCard {
    height: 100%;
    background-color: #fff;
    .list {
      margin-top: 10px;
      .item {
        display: block;
        padding: 10px 15px;
        position: relative;
        .card-info {
          position: absolute;
          bottom: 15%;
          right: 15%;
          color: #fff;
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
