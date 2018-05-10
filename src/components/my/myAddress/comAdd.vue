<template>
  <div class="comAdd no-margin-top">
    <div class="pull-top">
      <j-pull :refreshFunc="refreshData">
        <group slot="jpull-list">
          <cell-box v-if="myAddressList.length" is-link @click.native="operate(item)" v-for="item in myAddressList" :key="item.id">
            <div class="addressInfo">
              <div class="tags">
                <i v-show="item.status === '1'" @click.stop.prevent="showChangeHouseModal(item)" :class="{isCheck: item.isDefault === '1'}"></i>
                <em v-show="item.status !== '1'" :class="{failed: item.status === '2'}"></em>
              </div>
              <div class="info">
                <span>{{item.address}}</span>
                <span>{{item.position}}</span>
              </div>
            </div>
          </cell-box>
          <div class="noContent" v-if="!myAddressList.length">
            <img src="../../../assets/images/No-content.png" alt="">
            <p>什么都没发现，去别处看看吧</p>
            <!--<span @click="toPublish">去发帖</span>-->
          </div>
        </group>
      </j-pull>
    </div>
    <div class="addNewAddress" @click="addNew">
      <span>新增小区地址</span>
    </div>
    <!--切换默认住址dialog begin-->
    <x-dialog class="change-house-wrapper" v-model="changeHouseModalShow" :dialog-style="changeHouseDialogStyle" hide-on-blur>
      <span class="delete-info vux-1px-b">确认切换住址?</span>
      <div class="operate-wrapper">
        <span class="text vux-1px-r" @click="changeHouseModalShow = false">取消</span>
        <span class="text" @click="select">确定</span>
      </div>
    </x-dialog>
    <!--切换默认住址dialog end-->
  </div>
</template>
<script>
  import {CellBox, Group, ViewBox, XDialog} from 'vux'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'receivingAdd',
    components: {
      CellBox,
      Group,
      ViewBox,
      XDialog,
      JPull
    },
    data () {
      return {
        myAddressList: [],
        changeHouseModalShow: false,
        changeHouseDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 0 0 0',
          borderRadius: '20px'
        },
        currentAssetId: ''
      }
    },
    created () {
      this.getData()
    },
    methods: {
      refreshData (loaded) {
        this.getData(loaded);
      },
      getData (loaded) {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/ownerAsset/queryUserAddress'
        }).then(res => {
          if (loaded) {
            loaded();
          }
          if (res.status === 100) {
            let data = res.data;
            let noPassList = data.npassList;
            let passList = data.passList;
            let pendingList = data.pendList;
            let addressList = [];
            if (noPassList && noPassList.length) {
              addressList = addressList.concat(noPassList);
            }
            if (passList && passList.length) {
              addressList = addressList.concat(passList);
            }
            if (pendingList && pendingList.length) {
              addressList = addressList.concat(pendingList);
            }
            let addressList_ = [];
            if (addressList && addressList.length) {
              addressList.forEach(function (addressInfo) {
                let addressInfo_ = {};
                let userType = addressInfo.userType;
                addressInfo_.status = addressInfo.isExamine;
                addressInfo_.userType = userType;
                addressInfo_.isDefault = addressInfo.isDefault;
                let address = addressInfo.communityName + '-';
                if (addressInfo.blockName) {
                  address += (addressInfo.blockName + '-');
                }
                if (addressInfo.buildingNumber) {
                  address += (addressInfo.buildingNumber + '-');
                }
                if (addressInfo.unit) {
                  address += (addressInfo.unit + '-');
                }
                if (addressInfo.room) {
                  address += (addressInfo.room);
                }
                addressInfo_.address = address;
                let userTypeStr = '';
                switch (userType) {
                  case '1':
                    userTypeStr = '业主';
                    break;
                  case '2':
                    userTypeStr = '家属';
                    break;
                  case '3':
                    userTypeStr = '租客';
                    break;
                  case '4':
                    userTypeStr = '伙伴';
                    break;
                  case '5':
                    userTypeStr = '嘉宾';
                    break;
                  default:
                    break;
                }
                addressInfo_.position = userTypeStr;
                addressInfo_.role = {
                  id: userType,
                  name: userTypeStr
                };
                addressInfo_.community = {
                  id: addressInfo.communityId,
                  name: addressInfo.communityName
                };
                addressInfo_.yuan = addressInfo.blockName;
                addressInfo_.zhuang = addressInfo.buildingNumber;
                addressInfo_.roomInfo = {
                  id: addressInfo.roomId,
                  room: addressInfo.room,
                  unit: addressInfo.unit
                }
                addressInfo_.ownerAssetId = addressInfo.ownerAssetId;
                addressList_.push(addressInfo_);
              });
            }
            _this_.myAddressList = addressList_;
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
      showChangeHouseModal (house) {
        let isDefault = house.isDefault;
        // 已经是默认房号了,不需要切换
        if (isDefault === '1') {
          return;
        }
        let assetId = house.ownerAssetId;
        this.currentAssetId = assetId;
        this.changeHouseModalShow = true;
      },
      select () {
        let assetId = this.currentAssetId;
        let _this_ = this;
        this.$JHttp({
          method: 'put',
          url: window.baseURL + '/ownerAsset/updateDefaultAddress?assetId=' + assetId,
          transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        }).then(res => {
          if (res.status === 100) {
            // 重新获取列表数据
            _this_.getData();
            _this_.changeHouseModalShow = false;
          } else {
            // 更新默认房产失败
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      addNew () {
        // 清空选中的地址树
        this.$store.state.address = {};
        localStorage.setItem('address', JSON.stringify({}));
        this.$router.push('/addCommunityAddress')
      },
      operate (addressItem) {
        this.$store.commit('updateAssetId', addressItem.ownerAssetId);
        localStorage.setItem('assetId', addressItem.ownerAssetId);
        let status = addressItem.status;
        if (status === '1') {
          this.$router.push('/houseDetail');
        } else {
          this.editAsset(addressItem);
        }
      },
      editAsset (addressItem) {
        // 构造选中的房产树
        let address = {
          community: addressItem.community,
          yuan: addressItem.yuan,
          zhuang: addressItem.zhuang,
          roomInfo: addressItem.roomInfo,
          role: addressItem.role
        };
        // 将选中的房产树加入状态管理
        this.$store.commit('updateAddress', address);
        localStorage.setItem('address', JSON.stringify(address));
        this.$router.push('/editCommunityAddress');
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .comAdd{
    position: relative;
    height: 100%;
    .pull-top{
      height: 100%;
    }
    .weui-cell:before{
      border-top: none;
    }
    .addressInfo{
      margin-right: 20px;
      display: flex;
      height:90px;
      align-items: center;
      .tags{
        i{
          width: 25px;
          height: 22px;
          background-image: url("../../../assets/images/unchecked_icon_grey.png");
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center center;
          /*background: url("../../../assets/images/unchecked_icon_grey.png") center no-repeat / contain;*/
        }
        i.isCheck{
          background-image: url("../../../assets/images/checkadd_icon_green44.png");
          /*background: url("../../../assets/images/checkadd_icon_green44.png") center no-repeat / contain;*/
        }
        em{
          width: 25px;
          height: 14px;
          background-image: url("../../../assets/images/checking_tag_address.png");
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center center;
          /*background: url("../../../assets/images/checking_tag_address.png") center no-repeat / contain;*/
        }
        em.failed{
          background-image: url("../../../assets/images/failed_tag_address.png");
          /*background: url("../../../assets/images/failed_tag_address.png") center no-repeat / contain;*/
        }
      }
      .info{
        margin-left: 15px;
        span{
          font-size: 15px;
        }
        span:last-child{
          color: #aaaaaa;
        }
      }
    }
    .addNewAddress{
      position: fixed;
      width: 100%;
      max-width: 750px;
      margin: 0 auto;
      bottom: 0;
      background-color: #0DAB60;
      color: #ffffff;
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
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
    .change-house-wrapper {
      .delete-info {
        color: #333;
        font-size: 14px;
        font-weight: bold;
        display: inline-block;
        width: 100%;
        padding-bottom: 20px;
      }
      .operate-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        .text {
          display: inline-block;
          width: 50%;
          height: 100%;
          line-height: 50px;
          color: #18adfb;
          font-size: 16px;
        }
      }
    }
  }
</style>
