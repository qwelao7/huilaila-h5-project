<template>
  <div class="commonHeader myInteractive">
    <view-box body-padding-top="2.426667rem" body-padding-bottom="0">
      <div style="width:100%;position:absolute;left:0;top:0;z-index:100;" slot="header">
        <x-header
          slot="header"
          :left-options="{backText: ''}"
          title="我的互动">
        </x-header>
        <!--<sticky></sticky>-->
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
  import { XHeader, Tab, TabItem, Sticky, Swiper, SwiperItem, ViewBox } from 'vux'
  import mySignUp from './mySignUp'
  import myVote from './myVote'
  import myActivity from './myActivity'
  export default {
    name: 'myInteractive',
    components: {
      XHeader,
      ViewBox,
      Tab,
      Sticky,
      Swiper,
      SwiperItem,
      TabItem,
      mySignUp,
      myVote,
      myActivity
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        let fromPath = from.path;
        vm.selectedTab = '我的报名';
        vm.switchTabItem(0);
        if (fromPath.indexOf('/surveyDetail') > -1) {
          vm.selectedTab = '我的投票';
          vm.switchTabItem(2);
        } else if (fromPath.indexOf('/signUpPeople') > -1 || fromPath.indexOf('/activityDetail') > -1) {
          vm.selectedTab = '我的活动';
          vm.switchTabItem(1);
        } else {
          vm.selectedTab = '我的报名';
          vm.switchTabItem(0);
        }
      })
    },
    data () {
      return {
        index: 0,
        selectedTab: '我的报名',
//        selectedTab: '我的投票',
        list2: ['我的报名', '我的活动', '我的投票'],
//        list2: ['我的投票'],
        currentTab: mySignUp,
//        currentTab: myVote,
        height: ''
      }
    },
    created () {
      this.height = (document.body.clientHeight - 101) + 'px';
    },
    methods: {
      switchTabItem (index) {
        if (index === 0) {
          this.currentTab = mySignUp
        } else if (index === 1) {
          this.currentTab = myActivity
        } else if (index === 2) {
          this.currentTab = myVote
        }
      }
    }
  }
</script>
<style>
  .myInteractive{
    height: 100%;
  }
</style>
