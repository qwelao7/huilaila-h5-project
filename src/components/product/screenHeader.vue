<template>
  <div class="screen-header-wrapper">
    <div class="pull-down-search" :class="{'pull-down-search-selected': selected0}" @click="showPullDownWrapper">
      <span class="comprehensive-title" v-text="comprehensiveText"></span>
      <span class="comprehensive-icon" :class="{'comprehensive-up-icon': (isShowPullDownWrapper && selected0), 'comprehensive-icon-selected': selected0}"></span>
      <div class="pull-down-wrapper" v-show="isShowPullDownWrapper && selected0">
        <div class="comprehensive" @click.stop="sortByComprehensive">
          <span class="comprehensive-title" v-text="'综合'"></span>
          <span class="selected-icon" v-show="comprehensiveText === '综合'"></span>
        </div>
        <div class="evaluation" @click.stop="sortByEvaluation">
          <span class="evaluation-title" v-text="'评价'"></span>
          <span class="selected-icon" v-show="comprehensiveText === '评价'"></span>
        </div>
      </div>
    </div>
    <div class="sell-count" :class="{'sell-count-selected': selected1}" @click="searchByCount" v-text="'销量'"></div>
    <div class="price">
      <sort-search @search="searchByPrice" :selected="selected2" :title="'价格'" :sortsUp="'4'" :sortsDown="'5'"></sort-search>
    </div>
    <div class="grounding-time">
      <sort-search @search="searchByTime" :selected="selected3" :title="'上架时间'" :sortsUp="'6'" :sortsDown="'7'"></sort-search>
    </div>
  </div>
</template>

<script>
  import SortSearch from 'components/product/sortSearch';
  export default {
    name: 'ScreenHeader',
    components: {
      'sort-search': SortSearch
    },
    created: function () {
    },
    data () {
      return {
        isShowPullDownWrapper: false,
        comprehensiveText: '综合',
        selected0: true,
        selected01: true,
        selected02: false,
        selected1: false,
        selected2: false,
        selected3: false,
        sortType: '1'
      }
    },
    methods: {
      showPullDownWrapper () {
        this.isShowPullDownWrapper = true;
        this.selected0 = true;
      },
      sortByComprehensive () {
        this.selected0 = true;
        this.selected01 = true;
        this.selected02 = false;
        this.selected1 = false;
        this.selected2 = false;
        this.selected3 = false;
        this.sortType = '1';
        this.comprehensiveText = '综合';
        this.isShowPullDownWrapper = false;
        this.search();
      },
      sortByEvaluation () {
        this.selected0 = true;
        this.selected01 = false;
        this.selected02 = true;
        this.selected1 = false;
        this.selected2 = false;
        this.selected3 = false;
        this.sortType = '8';
        this.comprehensiveText = '评价';
        this.isShowPullDownWrapper = false;
        this.search();
      },
      searchByCount () {
        this.selected1 = true;
        this.selected0 = false;
        this.selected01 = false;
        this.selected02 = false;
        this.selected2 = false;
        this.selected3 = false;
        this.sortType = '3';
        this.search();
      },
      searchByPrice (sortType) {
        this.selected2 = true;
        this.selected0 = false;
        this.selected01 = false;
        this.selected02 = false;
        this.selected1 = false;
        this.selected3 = false;
        this.sortType = sortType;
        this.search();
      },
      searchByTime (sortType) {
        this.selected3 = true;
        this.selected0 = false;
        this.selected01 = false;
        this.selected02 = false;
        this.selected1 = false;
        this.selected2 = false;
        this.sortType = sortType;
        this.search();
      },
      search () {
        this.$emit('search', this.sortType);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.screen-header-wrapper {
  /*width: 100%;*/
  height: 49px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  .pull-down-search {
    color: #aaa;
    display: flex;
    align-items: center;
    .comprehensive-icon {
      width: 22px;
      height: 22px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url("../../assets/images/sortup_icon_grey.png");
      transform: rotate(-180deg);
    }
    .comprehensive-up-icon {
      transform: rotate(0deg);
    }
    .comprehensive-icon-selected {
      background-image: url("../../assets/images/sortup_icon_red.png");
    }
    .pull-down-wrapper {
      position: absolute;
      width: 375px;
      top: 83px;
      left: 0;
      z-index: 999;
      .shadow-wrapper {
        height: 618px;
        background-color: #fff;
        z-index: 500;
      }
      .comprehensive, .evaluation {
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 1000;
        background-color: #F8F8F8;
        padding: 0 15px;
        .selected-icon {
          width: 20px;
          height: 20px;
          background-size: 100%;
          background-repeat: no-repeat;
          background-image: url("../../assets/images/tick_icon_32red.png");
        }
      }
    }
  }
  .pull-down-search-selected {
    color: #FF6648;
  }
  .sell-count {
    color: #aaa;
  }
  .sell-count-selected {
    color: #FF6648;
  }
}
</style>
