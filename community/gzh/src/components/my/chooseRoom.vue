<template>
  <div class="commonHeader room">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="选择单元-室">
    </x-header>
    <div class="list">
      <checker
        v-model="selectedRoom"
        selected-item-class="selected" class="communities">
        <checker-item
          v-for="(items, index) in comList"
          :key="index"
          class="li"
          :value="{id: items.id, unit: items.unit, room: items.room}"
          @on-item-click="choose">
          <div class="block">
            <span v-show="items.unit">{{items.unit}}-</span>
            <span>{{items.room}}</span>
          </div>
          </checker-item>
      </checker>
    </div>
  </div>
</template>
<script>
  import { XHeader, Checker, CheckerItem } from 'vux'
  export default {
    components: {
      XHeader,
      Checker,
      CheckerItem
    },
    data () {
      return {
        comList: [],
        selectedRoom: {}
      }
    },
    created () {
      this.getData();
      this.getSelectedUnitRoom();
    },
    methods: {
      getData () {
        let communityId = this.$store.state.address.community.id;
        let address = localStorage.getItem('address');
        address = JSON.parse(address);
        if (!communityId) {
          communityId = address.comunity.id;
        }
        let yuan = this.$store.state.address.yuan;
        if (!yuan) {
          yuan = address.yuan;
        }
        let zhuang = this.$store.state.address.zhuang;
        if (!zhuang) {
          zhuang = address.zhuang;
        }
        let url = '';
        if (yuan) {
          url = window.baseURL + '/community/queryUnitRoom?communityId=' + communityId + '&blockName=' + yuan + '&buildingNumber=' + zhuang;
        } else {
          url = window.baseURL + '/community/queryUnitRoom?communityId=' + communityId + '&buildingNumber=' + zhuang;
        }
        this.$JHttp({
          method: 'get',
          url: url
        }).then(res => {
          if (res.status === 100) {
            let obj;
            let list = res.data;
            if (list && list.length === 1) {
              let roomInfo0 = list[0];
              let roomInfo = {
                id: roomInfo0.roomId,
                unit: roomInfo0.unit,
                room: roomInfo0.room
              }
              this.choose(roomInfo);
            } else {
              list.forEach(res => {
                obj = {
                  id: res.roomId,
                  unit: res.unit,
                  room: res.room
                };
                this.comList.push(obj);
              });
            }
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
        });
      },
      getSelectedUnitRoom () {
        let address = this.$store.state.address;
        if (!address) {
          let address = localStorage.getItem('address');
          address = JSON.parse(address);
        }
        if (address) {
          let roomInfo = address.roomInfo;
          if (roomInfo) {
            this.selectedRoom = {
              id: roomInfo.id,
              unit: roomInfo.unit,
              room: roomInfo.room
            }
          }
        }
      },
      choose (roomInfo) {
        let source = this.$route.params.source;
        let address = this.$store.state.address;
        if (!address || !address.community || !address.community.id) {
          address = JSON.parse(localStorage.getItem('address'));
        }
        if (address) {
          let roomInfo0 = address.roomInfo;
          if (roomInfo0 && roomInfo0.id === roomInfo.id) {
            if (source) {
              this.$router.go(-2);
            } else {
              this.$router.go(-3);
            }
            return;
          }
        }
        localStorage.setItem('address', JSON.stringify({
          community: address.community,
          yuan: address.yuan,
          zhuang: address.zhuang,
          roomInfo: {
            id: roomInfo.id,
            unit: roomInfo.unit,
            room: roomInfo.room
          }
        }));
        this.$store.commit('updateAddress', {
          community: address.community,
          yuan: address.yuan,
          zhuang: address.zhuang,
          roomInfo: {
            id: roomInfo.id,
            unit: roomInfo.unit,
            room: roomInfo.room
          }
        });
        if (source) {
          this.$router.go(-2);
        } else {
          this.$router.go(-3);
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .list{
    padding: 0 .3rem;
  }
  .communities{
    display: flex;
    flex-direction: column;
    .li{
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 0.5px solid #D8D8D8;
      font-size: 14px;
      .block{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .li:last-child{
      border-bottom: none;
    }
    .selected{
      background: url("../../assets/images/check_icon_orange32.png") right no-repeat ;
      background-size: .32rem .32rem;
    }
  }
</style>
