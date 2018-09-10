<template>
  <div class="label-product-wrapper commonHeader">
    <view-box body-padding-top="1.253333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        :title="subName"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div class="label-product-list-wrapper">
        <list ref="list"></list>
      </div>
    </view-box>
  </div>
</template>

<script>
  import List from 'components/product/label/list';
  import {ViewBox, XHeader} from 'vux';
  export default {
    name: 'LabelProductList',
    components: {
      'view-box': ViewBox,
      'x-header': XHeader,
      'list': List
    },
    created: function () {
      this.subName = this.$route.query.subName;
    },
    mounted: function () {
      this.getLabelProductList();
    },
    data () {
      return {
        sortType: '1',
        subName: ''
      }
    },
    computed: {
      labelId () {
        return this.$route.params.labelId;
      }
    },
    methods: {
      goBack () {
        this.$router.go(-1);
      },
      getLabelProductList () {
        this.$refs.list.getProductList(this.labelId, this.sortType);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .label-product-wrapper {
    height: 100%;
    .label-product-list-wrapper {
      height: 100%;
    }
  }
</style>
