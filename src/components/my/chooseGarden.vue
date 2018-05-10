<template>
  <div class="commonHeader chooseGarden">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="选择苑-幢">
    </x-header>
    <div class="list">
      <checker
        v-model="selectedGarden"
        selected-item-class="selected" class="communities">
        <checker-item
          v-for="(items, index) in comList"
          :key="index"
          class="li"
          :value="items"
          @on-item-click="choose">
          <div class="block">
            <span v-show="items.blockName">{{items.blockName}}-</span>
            <span>{{items.buildingNumber}}</span>
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
        selectedGarden: {}
      }
    },
    created () {
      this.getData();
      this.getSelectedGarden();
    },
    methods: {
      getData () {
        let communityId = this.$store.state.address.community.id;
        if (!communityId) {
          let address = localStorage.getItem('address');
          address = JSON.parse(address);
          communityId = address.community.id;
        }
        this.$JHttp({
          method: 'get',
          url: window.baseURL + '/community/queryGardenBuilding?communityId=' + communityId
        }).then(res => {
          if (res.status === 100) {
            let obj;
            res.data.forEach(res => {
              obj = {
                blockName: res.blockName,
                buildingNumber: res.buildingNumber
              };
              this.comList.push(obj);
            });
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
      getSelectedGarden () {
        let address = this.$store.state.address;
        if (!address || !address.community || !address.community.id) {
          let address = localStorage.getItem('address');
          address = JSON.parse(address);
        }
        this.selectedGarden = {
          blockName: address.yuan,
          buildingNumber: address.zhuang
        };
      },
      choose (value) {
        let yuan = value.blockName;
        let zhuang = value.buildingNumber;
        let address = JSON.parse(localStorage.getItem('address'));
        if (yuan !== address.yuan || zhuang !== address.zhuang) {
          localStorage.setItem('address', JSON.stringify({
            community: address.community,
            yuan: yuan,
            zhuang: zhuang
          }));
          this.$store.commit('updateAddress', {
            community: address.community,
            yuan: yuan,
            zhuang: zhuang
          });
        }
        let source = this.$route.params.source;
        if (source) {
          this.$router.push({
            name: 'chooseRoom',
            params: {
              source: source
            }
          })
        } else {
          this.$router.push('/chooseRoom');
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
