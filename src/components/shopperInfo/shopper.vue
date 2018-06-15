<template>
  <div class="shopper-detail-wrapper commonHeader">
    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="商家详情"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <tab :line-width="2" custom-bar-width="30px" active-color="#FF6648" default-color="#333">
        <tab-item
          :selected="index === item.id"
          v-for="item in tabList"
          :key="item.id"
          @on-item-click="changeTabItem">
          {{item.name}}
        </tab-item>
      </tab>
      <div class="tab-wrapper">
        <shopper-detail :storeId="storeId" v-show="index === 0"></shopper-detail>
        <shopper-evaluation :storeId="storeId" v-show="index === 1"></shopper-evaluation>
      </div>
    </view-box>
  </div>
</template>

<script>
import {XHeader, ViewBox, Tab, TabItem, querystring} from 'vux';
import JPull from 'components/base/JPull/JPull';
import ShopperDetail from 'components/shopperInfo/detail';
import ShopperEvaluation from 'components/shopperInfo/evaluation';
const tabList = () => [
  {
    name: '商家',
    id: 0,
    value: 'detail'
  },
  {
    name: '评价',
    id: 1,
    value: 'evaluation'
  }
];
export default {
  name: 'ShopperBase',
  components: {
    'x-header': XHeader,
    'view-box': ViewBox,
    'j-pull': JPull,
    'tab': Tab,
    'tab-item': TabItem,
    'shopper-detail': ShopperDetail,
    'shopper-evaluation': ShopperEvaluation
  },
  created: function () {
  },
  computed: {
    storeId () {
      return this.$route.params.storeId;
    }
  },
  data () {
    return {
      tabList: tabList(),
      index: 0
    }
  },
  methods: {
    backMy () {
      this.$router.replace('/shopperProductList/' + this.storeId)
    },
    changeTabItem (val) {
      this.index = val;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.shopper-detail-wrapper {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
</style>
