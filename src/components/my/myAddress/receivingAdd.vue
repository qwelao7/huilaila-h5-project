<template>
  <div class="receivingAdd no-margin-top">
    <div class="pull-top">
      <j-pull :refreshFunc="refreshData">
        <div slot="jpull-list">
          <cell-box v-if="addressList.length" :is-link="address.isCommunity !== 0" @click.native="modifyAddress(address)" v-for="address in addressList" :key="address.addrId">
            <div class="addressInfo">
              <div class="info">
                <span class="name" v-text="address.receiveUser"></span>
                <span class="phone" v-text="address.phone"></span>
              </div>
              <span v-text="address.areaAddr + address.detailAddr.replace('$#$', '')"></span>
            </div>
          </cell-box>
          <div class="noContent" v-if="!addressList.length">
            <img src="../../../assets/images/No-content.png" alt="">
            <p>什么都没发现，去别处看看吧</p>
            <!--<span @click="toPublish">去发帖</span>-->
          </div>
        </div>
      </j-pull>
    </div>
    <div class="addNewAddress" @click="addNew">
      <span>新增收货地址</span>
    </div>
  </div>
</template>
<script>
  import {CellBox, Cell, Group, ViewBox} from 'vux'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'receivingAdd',
    components: {
      JPull,
      CellBox,
      Cell,
      Group,
      ViewBox
    },
    data () {
      return {
        addressList: []
      }
    },
    created () {
      this.getData();
    },
    methods: {
      getData (loaded) {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/shippingAddress/receiveAddrList'
        }).then(res => {
          if (loaded) {
            loaded();
          }
          if (res.status === 100) {
            let data = res.data;
            _this_.addressList = data;
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
      refreshData (loaded) {
        this.getData(loaded);
      },
      loadMore () {
          //
      },
      modifyAddress (address) {
        let isHouseAsset = address.isCommunity;
        // 房产地址,不能编辑
        if (isHouseAsset === 0) {
          return;
        }
        this.$router.push({
          name: 'modifyReceiveAddress',
          params: {
            addressId: address.addrId
          }
        });
      },
      addNew () {
        this.$router.push('/addReceiveAddress');
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .receivingAdd{
    height: 100%;
    .pull-top{
      height: 100%;
    }
    .weui-cell:before{
      border-top: none;
    }
    .noContent{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 142.5px;
      margin-bottom: 284.5px;
      img{
        width: 150px;
        height: 150px;
      }
      p{
        margin-top: 10px;
        color: #aaaaaa;
        font-size: 15px;
      }
    }
    .addressInfo{
      width: 100%;
      padding: 0 !important;
      span{
        font-size: 15px;
      }
      .info{
        display: flex;
        align-items: center;
        .name{
          flex: 0 0 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .phone {
          flex: 1;
        }
      }
    }
    .addNewAddress{
      position: fixed;
      width: 100%;
      bottom: 0;
      left: 0;
      background-color: #0DAB60;
      color: #ffffff;
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
    }
  }
</style>
