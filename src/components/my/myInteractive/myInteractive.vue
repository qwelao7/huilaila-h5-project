<template>
  <div class="commonHeader myInteractive">
    <view-box body-padding-top="2.426667rem" body-padding-bottom="0">
      <div style="width:100%;position:absolute;left:0;top:0;z-index:100;" slot="header">
        <x-header
          :left-options="leftOptions"
          @on-click-back="backMy"
          title="我的互动">
        </x-header>
        <!--<sticky></sticky>-->
        <tab :line-width=2 custom-bar-width="20px" active-color='#0DAB60'>
          <tab-item class="vux-center"
                    :selected="selectedTab === item.id"
                    v-for="(item, index) in list3"
                    @on-item-click="clickTab(item)"
                    :key="item.id">
            <router-link :to="/myInteractive/ + item.value" tag="li">{{item.name}}</router-link>
          </tab-item>
        </tab>
      </div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
      <!--<comAdd :is="currentTab" keep-alive class="tabItem"></comAdd>-->
    </view-box>
  </div>
</template>
<script>
  import { XHeader, Tab, TabItem, Swiper, SwiperItem, ViewBox } from 'vux'
  export default {
    name: 'myInteractive',
    components: {
      XHeader,
      ViewBox,
      Tab,
      Swiper,
      SwiperItem,
      TabItem
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        let toPath = to.path;
        if (toPath === '/myInteractive/mySignUp') {
          vm.selectedTab = 0;
        } else if (toPath === '/myInteractive/myActivity') {
          vm.selectedTab = 1;
        } else if (toPath === '/myInteractive/myVote') {
          vm.selectedTab = 2;
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
        list3: [
          {
            name: '我的报名',
            id: 0,
            value: 'mySignUp'
          },
          {
            name: '我的活动',
            id: 1,
            value: 'myActivity'
          },
          {
            name: '我的投票',
            id: 2,
            value: 'myVote'
          }
        ]
      }
    },
    created () {
      //
    },
    methods: {
      backMy () {
        this.$router.push('/myHouse')
      },
      clickTab (val) {
        this.selectedTab = val.id
      }
    }
  }
</script>
<style>
  .myInteractive{
    height: 100%;
  }
</style>
