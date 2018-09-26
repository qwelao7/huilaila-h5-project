<template>
  <div class="tab-container">
    <div class="tab-wrapper">
      <tab class="tab" :line-width=2 :custom-bar-width="getBarWidth" :active-color='activeColor' v-model="currentIndex">
        <tab-item class="vux-center" :selected="currentTab === item" v-for="(item, index) in tabs" :key="index"
                  @click="changeTab(item, index)" v-text="item.sectionCategoryName"></tab-item>
      </tab>
    </div>
    <list ref="list"></list>
  </div>
</template>

<script>
  import { JTab, JTabItem } from 'components/base/JTab/index';
  import { Sticky, Divider } from 'vux';
  import List from 'components/product/category/list';
  export default {
    name: 'CategoryTab',
    props: {
      tabs: {
        type: Array,
        default: []
      }
    },
    components: {
      'tab': JTab,
      'tab-item': JTabItem,
      'list': List
    },
    mounted: function () {
      let categoryParentId = this.$route.params.categoryId;
      this.$refs.list.refreshData(undefined, categoryParentId);
    },
    data () {
      return {
        activeColor: '#FF6648',
        currentTab: {},
        currentIndex: 0,
        getBarWidth: function (index) {
//          return (index + 1) * 22 + 'px';
        }
      }
    },
    watch: {
      currentIndex (val, oldVal) {
        let categoryId = this.tabs[val].sectionCategoryId;
        this.$refs.list.refreshData(undefined, categoryId);
      }
    },
    methods: {
      changeTab (item, index) {
        this.currentTab = item;
        this.currentIndex = index;
      },
      chooseItem (item, index) {
        this.currentTab = item;
        this.currentIndex = index;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .tab-container {
    width: 100%;
    height: 100%;
    position: relative;
    .tab-wrapper {
      width: 100%;
      height: 44px;
      display: flex;
      align-items: center;
      .tab {
        flex: 1;
      }
      .btn {
        flex: 0 0 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        position: relative;
        box-shadow: -9px 0px 23px -10px #888888;
        .icon {
          width: 24px;
          height: 24px;
          background-repeat: no-repeat;
          background-size: 100%;
          background-image: url("../../../assets/images/arrow_open_greysmall.png");
        }
      }
    }
    .category-wrapper {
      width: 100%;
      background-color: #fff;
      position: absolute;
      top: 0;
      .shadow-box {
        position: fixed;
        /*left: 0;*/
        /*top: 124px;*/
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 500;
      }
      .content {
        position: fixed;
        background-color: #fff;
        z-index: 501;
        width: 100%;
        .header {
          width: 100%;
          height: 44px;
          display: flex;
          .left {
            flex: 1;
            display: flex;
            align-items: center;
            margin-left: 15px;
            .text {
              font-size: 15px;
              color: #333;
            }
          }
          .right {
            flex: 0 0 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: -9px 0px 23px -10px #888888;
            .icon {
              display: inline-block;
              width: 15px;
              height: 15px;
              background-size: 100%;
              background-repeat: no-repeat;
              background-image: url('../../../assets/images/close_icon_myorder.png');
            }
          }
        }
        .list {
          width: 100%;
          padding: 20px 18px;
          .item {
            width: 100px;
            height: 35px;
            border-radius: 25px;
            background-color: #F2F2F2;
            border: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0 20px;
            font-size: 15px;
            color: #333;
            margin-right: 20px;
            margin-bottom: 15px;
          }
          .selected-item {
            background-color: #FF6648;
          }
        }
      }
    }
  }
</style>
