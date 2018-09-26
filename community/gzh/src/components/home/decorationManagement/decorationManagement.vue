<template>
  <div class="commonHeader decoration-management-wrapper">
    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="装修管理"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <tab :line-width="2" custom-bar-width="30px" active-color="#0DAB60" default-color="#333">
        <tab-item
          :selected="index === item.id"
          v-for="item in tabList"
          :key="item.id"
          @on-item-click="changeTabItem">
          {{item.name}}
        </tab-item>
      </tab>
      <div class="tab-wrapper">
        <decoration-log v-show="index === 0"></decoration-log>
        <decoration-material v-show="index === 1"></decoration-material>
        <decoration-file v-show="index === 2"></decoration-file>
      </div>
    </view-box>
  </div>
</template>

<script>
  import {XHeader, ViewBox, Tab, TabItem, querystring} from 'vux';
  import JPull from 'components/base/JPull/JPull';
  import DecorationLog from './log/decorationLog';
  import DecorationMaterial from './decorationMaterial';
  import DecorationFile from './decorationFile';
  const tabList = () => [
    {
      name: '装修日志',
      id: 0,
      value: 'decorationLog'
    },
    {
      name: '装修材料',
      id: 1,
      value: 'decorationMaterial'
    },
    {
      name: '装修档案',
      id: 2,
      value: 'decorationFile'
    }]

  export default {
    name: 'DecorationManagement',
    components: {
      'x-header': XHeader,
      'view-box': ViewBox,
      'j-pull': JPull,
      'tab': Tab,
      'tab-item': TabItem,
      'decoration-log': DecorationLog,
      'decoration-material': DecorationMaterial,
      'decoration-file': DecorationFile
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        let fromPath = from.path;
        // 表示从装修档案二级页回来的
        if (fromPath.indexOf('decorationFileLevelTwo') !== -1) {
          vm.index = 2;
        } else {
          vm.index = 0;
        }
      })
    },
    created: function () {
    },
    data () {
      return {
        tabList: tabList(),
        index: 0
      }
    },
    methods: {
      changeTabItem (val) {
        this.index = val;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.decoration-management-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .tab-wrapper {
    height: 576.04px;
  }
}
</style>
