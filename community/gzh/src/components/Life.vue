<template>
  <div class="Life commonHeader">
    <view-box body-padding-top="2.406666rem" body-padding-bottom="1.306667rem">
      <x-header
        slot="header"
        :left-options="{showBack: false}"
        title="slot:overwrite-title"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;">
        <a slot="right" @click="showMessage" class="right"><i class="messageIcon"></i></a>
        <div class="overwrite-title-demo" slot="overwrite-title" @click="chooseAddress">
          <i class="positionIcon"></i>
          <span v-text="communityName"></span>
        </div>
      </x-header>
      <tab :line-width="2" custom-bar-width="30px" active-color="#0DAB60" default-color="#333333" slot="header"
           style="width:100%;position:absolute;left:0;top:1.253333rem;z-index:100;">
        <tab-item
          :selected="index === item.id"
          v-for="item in tabList"
          @on-item-click="clickTab(item)"
          :key="item.id">
          <router-link :to="/life/ + item.value" tag="li">{{item.name}}</router-link>
        </tab-item>
      </tab>
      <!--       <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view> -->
      <keep-alive>
        <router-view @changeIndex="changeIndex"></router-view>
      </keep-alive>
      <bottomTab slot="bottom"></bottomTab>
    </view-box>
  </div>
</template>
<script>
  import store from '@/vuex/store'
  import {XHeader, Tab, TabItem, ViewBox} from 'vux'
  //  import swipers from '../assets/swiper/swiper-4.1.0.min.css'
  import JPull from './base/JPull/JPull'
  import bottomTab from '../components/bottomTab'
  // ['推荐', '话题', '活动', '社群']
  const tabList = () => [
    {
      name: '推荐',
      id: 0,
      value: 'recommend'
    },
    {
      name: '话题',
      id: 1,
      value: 'topic'
    },
    {
      name: '活动',
      id: 2,
      value: 'activity'
    },
    {
      name: '达人',
      id: 4,
      value: 'daren'
    },
    {
      name: '社群',
      id: 3,
      value: 'group'
    }
  ];
  export default {
    name: 'Life',
    components: {
      XHeader,
      JPull,
      ViewBox,
      bottomTab,
      Tab,
      TabItem
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
    //     let toPath = to.path;
    //     if (toPath === '/life/topic') {
    //       vm.index = 1;
    //     } else if (toPath === '/life/activity') {
    //       vm.index = 2;
    //     } else if (toPath === '/life/group') {
    //       vm.index = 3;
    //     } else if (toPath === '/life/daren') {
    //       vm.index = 4;
    //     } else {
    //       vm.index = 0;
    //     }
        let communityName = ''
        if (parseFloat(localStorage.getItem('community_all')) === 1) {
          communityName = '全部小区'
        } else {
          communityName = localStorage.getItem('communityName');
        }
        vm.communityName = communityName;
      })
    },
    created () {
      let communityName = ''
      if (parseFloat(localStorage.getItem('community_all')) === 1) {
        communityName = '全部小区'
      } else {
        communityName = localStorage.getItem('communityName');
      }
      this.communityName = communityName;
      //
    },
    data () {
      return {
        communityName: '',
        tabList: tabList(),
        index: 0
      }
    },
    methods: {
      clickTab (val) {
        this.index = val.id;
      },
      changeIndex (index) {
        this.index = index
      },
      chooseAddress () {
        this.$router.push('/changeCommunity');
      },
      showMessage () {
        this.$router.push('/message');
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .overwrite-title-demo {
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 100%;
    justify-content: center;
    .positionIcon {
      display: inline-block;
      /*flex: 1;*/
      width: 20px;
      height: 34px;
      background-image: url("../assets/images/address_icon_32black.png");
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
    }
    span {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 18px;
      color: #333333;
      margin-left: 3px;
    }
  }

  .messageIcon {
    width: 28px;
    height: 28px;
    background: url("../assets/images/message_icon_black.png") center / cover;
  }

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
    .scrollable .vux-tab-item {
      flex: 0 0 20%;
    }
  }
</style>
