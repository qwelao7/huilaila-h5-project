<template>
  <div class="Life">
    <view-box body-padding-top="1.153333rem" body-padding-bottom="1.306667rem">
      <tab :line-width="2" custom-bar-width="30px" active-color="#0DAB60" default-color="#333333" slot="header"
           style="width:100%;position:absolute;left:0;top:0;z-index:100;">
        <tab-item
          :selected="index === item.id"
          v-for="item in tabList"
          @on-item-click="toggleTab(item)"
          :key="item.id">
          <router-link :to="/life/ + item.value" tag="li">{{item.name}}</router-link>
        </tab-item>
      </tab>
      <router-view></router-view>
      <bottomTab slot="bottom"></bottomTab>
    </view-box>
  </div>
</template>
<script>
  import store from '@/vuex/store'
  import { Tab, TabItem, ViewBox } from 'vux'
  //  import swipers from '../assets/swiper/swiper-4.1.0.min.css'
  import JPull from './base/JPull/JPull'
  import bottomTab from '../components/bottomTab'
  // ['推荐', '新鲜事', '活动', '圈子']
  const tabList = () => [
    {
      name: '推荐',
      id: 0,
      value: 'recommend'
    },
    {
      name: '新鲜事',
      id: 1,
      value: 'newThings'
    },
    {
      name: '活动',
      id: 2,
      value: 'activity'
    },
    {
      name: '圈子',
      id: 3,
      value: 'group'
    }
  ];
  export default {
    name: 'Life',
    components: {
      JPull,
      ViewBox,
      bottomTab,
      Tab,
      TabItem
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        let toPath = to.path;
        if (toPath === '/life/newThings') {
          vm.index = 1;
        } else if (toPath === '/life/activity') {
          vm.index = 2;
        } else if (toPath === '/life/group') {
          vm.index = 3;
        } else {
          vm.index = 0;
        }
      })
    },
    created () {
      //
    },
    data () {
      return {
        tabList: tabList(),
        index: 0
      }
    },
    methods: {
      toggleTab (val) {
//        this.index = val.id;
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .Life {
    height: 100%;
    width: 100%;
    background-color: #f7f7f7;
    position: relative;
    .vux-tab .vux-tab-item {
      font-size: 15px;
      color: #333333;
    }
    .vux-tab .vux-tab-item.vux-tab-selected {
      color: #0DAB60;
      border-bottom: 3px solid #0DAB60;
    }
  }
</style>
