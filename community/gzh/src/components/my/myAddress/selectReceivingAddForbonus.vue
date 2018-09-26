<template>
  <div class="commonHeader select-receive-address">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="我的地址">
    </x-header>
    <div class="address-wrapper">
      <cell-box :is-link="address.isCommunity !== 0 && address.verifyStatus" @click.native="modifyAddress(address)" v-for="address in addressList" :key="address.addrId">
        <div class="addressInfo">
          <div class="tags">
            <i @click.stop.prevent="selectReceiveAddress(address)" :class="{isCheck: address.addrId === currentAddressId}"></i>
          </div>
          <div class="info">
            <div class="name-wrapper">
              <span class="name" v-text="address.receiveUser"></span>
              <span class="phone" v-text="address.phone"></span>
            </div>
            <span v-text="address.areaAddr + address.detailAddr"></span>
          </div>
        </div>
      </cell-box>
    </div>
    <div class="addNewAddress" @click="addNew">
      <span>新增收货地址</span>
    </div>
  </div>
</template>
<script>
  import outDistanceImg from '../../../assets/images/beyond_tag_shopping@2x.png';
  import {XHeader, CellBox, Cell, Group, ViewBox, querystring} from 'vux'
  export default {
    name: 'receivingAdd',
    components: {
      XHeader,
      CellBox,
      Cell,
      Group,
      ViewBox
    },
    data () {
      return {
        outDistanceImg: outDistanceImg,
        addressList: [],
        currentAddressId: ''
      }
    },
    created () {
      // 先清空之前选中的收获地址
      localStorage.removeItem('currentReceiveAddress');
      this.currentAddressId = this.$route.query.addrId;
      this.getData();
    },
    methods: {
      getData () {
        let _this_ = this;
        let storeIds = this.$route.query.storeIds;
        let formData = {
          storeIds: storeIds
        }
        _this_.$JHttp({
          method: 'post',
          url: window.baseURL + '/order/receiveAddrList',
          data: formData,
          transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(res => {
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
      selectReceiveAddress (address) {
        let addrId = address.addrId;
        this.currentAddressId = addrId;
        let currentReceiveAddress = {
          ownerAssetId: addrId,
          detailAddress: address.areaAddr + address.detailAddr,
          nickName: address.receiveUser,
          mobileNum: address.phone
        };
        localStorage.setItem('currentReceiveAddress', JSON.stringify(currentReceiveAddress));
        let _this_ = this;
        setTimeout(function () {
          _this_.$router.go(-1);
        });
      },
      modifyAddress (address) {
        // 0:房产,1:非房产
        let isHouseAsset = address.isCommunity;
        // 房产地址,不能编辑(不在配送范围内的也不支持编辑)
        if (isHouseAsset === 1 && address.verifyStatus) {
          this.$router.push({
            name: 'modifyReceiveAddress',
            params: {
              addressId: address.addrId
            }
          });
        }
      },
      addNew () {
        this.$router.push('/addReceiveAddress');
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .select-receive-address {
    position: relative;
    padding-bottom: 40px;
    .weui-cell:before{
      border-top: none;
    }
    .address-wrapper {
      margin: 10px 0;
      .address-disabled {
        color: #aaa;
      }
      .addressInfo{
        min-height: 80px;
        margin-right: 30px;
        display: flex;
        align-items: center;
        .tags{
          i{
            width: 22px;
            height: 22px;
            background: url("../../../assets/images/unchecked_icon_grey.png") center no-repeat / contain;
          }
          i.isCheck{
            background: url("../../../assets/images/checkadd_icon_green44.png") center no-repeat / contain;
          }
          em{
            width: 25px;
            height: 14px;
            background: url("../../../assets/images/checking_tag_address.png") center no-repeat / contain;
          }
          em.failed{
            background: url("../../../assets/images/failed_tag_address.png") center no-repeat / contain;
          }
        }
        .info{
          margin-left: 15px;
          span{
            font-size: 15px;
          }
          .name-wrapper {
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
      }
      .out-distance-img {
        position: absolute;
        right: 40px;
        top: 10px;
        width: 80px;
        height: 80px;
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
