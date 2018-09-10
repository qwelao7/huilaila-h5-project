<template>
  <div class="commonHeader">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="房产档案"
      style="width:100%;position:absolute;left:0;top:0;z-index:100;">
    </x-header>
    <j-pull :refreshFunc="refresh" :loadMoreFunc="loadMore">
      <div slot="jpull-list">
        <group>
          <cell-box is-link v-for="item in lists">
            测试
          </cell-box>
        </group>
      </div>
    </j-pull>
  </div>
</template>
<script>
  import {querystring, TransferDom, XDialog, ViewBox, XHeader, Group, CellBox} from 'vux'
  import JPull from '../base/JPull/JPull'
  export default {
    name: 'estateList',
    directives: {
      TransferDom
    },
    components: {
      XDialog,
      JPull,
      ViewBox,
      XHeader,
      CellBox,
      Group
    },
    data () {
      return {
        list: ['一级目录名称1', '一级目录名称2', '一级目录名称3', '一级目录名称3', '一级目录名称3', '一级目录名称3'],
        list2: [{name: '测试图片', url: 'http://121.40.102.80:7080///img/201807/shopgoodscover/shopgoodscover153127318333711.jpg'}],
        lists: new Array(20)
      }
    },
    created () {},
    methods: {
      refresh (loaded) {
        // this.$vux.loading.show({text: '加载中'});
        setTimeout(() => {
          loaded();
          // this.$vux.loading.hide();
        }, 4000);
        return null;
      },
      loadMore (loaded) {
        // this.$vux.loading.show({text: '加载中'});
        setTimeout(() => {
          loaded(true);
          // this.$vux.loading.hide();
        }, 3000);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .weui-cells{
    margin-top: 0;
  }
</style>