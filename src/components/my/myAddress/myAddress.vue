<template>
  <div class="commonHeader myAddress">
    <view-box body-padding-top="2.426667rem" body-padding-bottom="1.333333rem">
      <div style="width:100%;position:absolute;left:0;top:0;z-index:100;" slot="header">
        <x-header
          slot="header"
          :left-options="{backText: ''}"
          title="我的地址">
        </x-header>
        <tab :line-width=2 custom-bar-width="20px" active-color='#0DAB60'>
          <tab-item class="vux-center" :selected="selectedTab === item" v-for="(item, index) in tabs" @click="selectedTab = item"
                    @on-item-click="switchTabItem(index)" :key="index">{{item}}</tab-item>
        </tab>
      </div>
      <comAdd :is="currentTab" keep-alive class="tabItem"></comAdd>
    </view-box>
  </div>
</template>
<script>
  import { XHeader, Tab, TabItem, ViewBox } from 'vux'
  import receivingAdd from './receivingAdd'
  import comAdd from './comAdd'
  export default {
    name: 'myAddress',
    components: {
      XHeader,
      Tab,
      TabItem,
      ViewBox,
      comAdd,
      receivingAdd
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        let fromPath = from.path;
        if (fromPath === '/modifyReceiveAddress' || fromPath === '/addReceiveAddress') {
          vm.selectedTab = '收货地址';
          vm.switchTabItem(1);
        } else {
          vm.selectedTab = '小区地址';
          vm.switchTabItem(0);
        }
      })
    },
    data () {
      return {
        index: 0,
        selectedTab: '小区地址',
        tabs: ['小区地址', '收货地址'],
        currentTab: comAdd,
        height: ''
      }
    },
    created () {
      this.height = (document.body.clientHeight - 101) + 'px';
//      console.log(111111, this.height)
    },
    methods: {
      switchTabItem (index) {
        if (index === 0) {
          this.currentTab = comAdd
        } else if (index === 1) {
          this.currentTab = receivingAdd
        }
//        this.$vux.loading.show({
//          text: 'loading'
//        });
//        setTimeout(() => {
//          this.$vux.loading.hide();
//          if (index === 0) {
//            this.currentTab = comAdd
//          } else if (index === 1) {
//            this.currentTab = receivingAdd
//          }
//          this.index = index
//        }, 1000)
      }
    }
  }
</script>
<style>
  .myAddress{
    height: 100%;
  }
</style>
