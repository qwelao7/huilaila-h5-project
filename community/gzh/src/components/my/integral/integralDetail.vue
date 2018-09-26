<template>
  <div class="commonHeader myInteractive">
    <view-box body-padding-top="2.426667rem" body-padding-bottom="0">
      <div style="width:100%;position:absolute;left:0;top:0;z-index:100;" slot="header">
        <x-header
          slot="header"
          :left-options="{backText: ''}"
          title="积分明细">
        </x-header>
        <tab :line-width=2 custom-bar-width="20px" active-color='#0DAB60'>
          <tab-item class="vux-center" :selected="selectedTab === item" v-for="(item, index) in list2" @click="selectedTab = item"
                    @on-item-click="switchTabItem(index)" :key="index">{{item}}</tab-item>
        </tab>
      </div>
      <comAdd :is="currentTab" keep-alive class="tabItem"></comAdd>
    </view-box>
  </div>
</template>
<script>
  import { XHeader, Tab, TabItem, ViewBox } from 'vux'
  import integralAll from './integralAll'
  import integralUsed from './integralUsed'
  export default {
    name: 'myInteractive',
    components: {
      XHeader,
      ViewBox,
      Tab,
      TabItem,
      integralUsed,
      integralAll
    },
    data () {
      return {
        index: 0,
        selectedTab: '全部',
        list2: ['全部', '已兑换'],
        currentTab: integralAll,
        height: ''
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        let fromPath = from.path;
        if (fromPath.indexOf('/orderDetails') > -1) {
          vm.selectedTab = '已兑换';
          vm.switchTabItem(1);
        } else {
          vm.selectedTab = '全部';
          vm.switchTabItem(0);
        }
      })
    },
    created () {
      // orderDetails
      this.height = (document.body.clientHeight - 101) + 'px';
    },
    methods: {
      switchTabItem (index) {
        if (index === 0) {
          this.currentTab = integralAll
        } else if (index === 1) {
          this.currentTab = integralUsed
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .myInteractive{
    height: 100%;
    position: relative;
  }
</style>
