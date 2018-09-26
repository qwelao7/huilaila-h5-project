<template>
  <div class="commonHeader myAddress">
    <view-box body-padding-top="2.426667rem" body-padding-bottom="1.333333rem">
      <div style="width:100%;position:absolute;left:0;top:0;z-index:100;" slot="header">
        <x-header
          slot="header"
          :left-options="leftOptions"
          @on-click-back="backMy"
          title="我的地址">
        </x-header>
        <tab :line-width=2 custom-bar-width="20px" active-color='#0DAB60'>
          <tab-item class="vux-center"
                    :selected="selectedTab === item.id"
                    v-for="(item, index) in tabs"
                    @on-item-click="clickTab(item)"
                    :key="item.id">
            <router-link :to="/myAddress/ + item.value" tag="li">{{item.name}}</router-link>
          </tab-item>
        </tab>
      </div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </view-box>
  </div>
</template>
<script>
  import { XHeader, Tab, TabItem, ViewBox } from 'vux'
  export default {
    name: 'myAddress',
    components: {
      XHeader,
      Tab,
      TabItem,
      ViewBox
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        let toPath = to.path;
        if (toPath === '/myAddress/receivingAdd') {
          vm.selectedTab = 1
        } else {
          vm.selectedTab = 0;
        }
      })
    },
    data () {
      return {
        leftOptions: {
          preventGoBack: true,
          backText: ''
        },
        selectedTab: 0,
        tabs: [
          {
            name: '小区地址',
            id: 0,
            value: 'comAdd'
          },
          {
            name: '收货地址',
            id: 1,
            value: 'receivingAdd'
          }
        ]
      }
    },
    created () {
      //
    },
    methods: {
      backMy () {
        this.$router.go(-1)
      },
      clickTab (val) {
        this.selectedTab = val.id
        console.log(val.name)
      }
    }
  }
</script>
<style>
  .myAddress{
    height: 100%;
  }
</style>
