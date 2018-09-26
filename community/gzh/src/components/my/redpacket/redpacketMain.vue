<template>
  <div class="redpacket-main commonHeader">
    <view-box body-padding-top="98px" body-padding-bottom="0">
    <div style="width:100%;position:absolute;left:0;top:0;z-index:100;" slot="header">
      <x-header
        slot="right"
        title="红包"
        :left-options="{backText: ''}">
        <a slot="right" style="color: #333;font-size: 14px;" @click="goInstructions">红包说明</a>
      </x-header>
      <tab :line-width="2" custom-bar-width="30px" active-color="#0DAB60" default-color="#333333" slot="header">
        <tab-item v-for="item in tabList"
                  :selected="index === item.id"
                  @on-item-click="clickTab(item)"
                  :key="item.id">
          <router-link :to="/redpacket/ + item.value" tag="li" replace>{{item.name}}</router-link>
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
  import {XHeader, Tab, TabItem, ViewBox} from 'vux'
  const tabList = () => [
    {
      name: '可使用',
      id: 0,
      value: 'enableRedpacket'
    },
    {
      name: '已使用',
      id: 1,
      value: 'usedRedpacket'
    },
    {
      name: '已过期',
      id: 2,
      value: 'overdueRedpacket'
    }
  ];
  export default {
    name: 'redpacketMain',
    components: {XHeader, Tab, TabItem, ViewBox},
    data () {
      return {
        index: 0,
        tabList: tabList()
      }
    },
    methods: {
      clickTab (val) {
        console.log('切换到tab index：' + val.id)
        this.index = val.id;
        console.log(this.$route.params)
      },
      goInstructions () {
        this.$router.push('/redpacketInstructions')
      }
    }
  }
</script>

<style scoped>
.redpacket-main{
  height: 100%;
}
</style>
