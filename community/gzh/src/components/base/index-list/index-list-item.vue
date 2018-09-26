<template>
  <li
    class="cube-index-list-item"
    :class="itemClass"
    @click="selectItem()">
    <slot>
<!--       <div class="cube-index-list-item-def border-bottom-1px">
        {{item.name}}
      </div> -->
      <div class="cube-index-list-item-def">
        <div class="cube-index-list-item-def-left">
          <span class="icon" :style="{ backgroundImage: 'url(' + require('../../../assets/images/expressIcon/' + item.value + '.png') + ')' }" v-if="item.shortPin === 'hot'"></span>
          <span v-text="item.name"></span>
        </div>
        <div class="cube-index-list-item-def-right"></div>
      </div>
    </slot>
  </li>
</template>

<script>
  import {
    addClass,
    removeClass
  } from './dom'
  const COMPONENT_NAME = 'cube-index-list-item'
  const ACTIVE_CLS = 'cube-index-list-item_active'
  const EVENT_SELECT = 'select'
  export default {
    name: COMPONENT_NAME,
    props: {
      value: {
        type: String,
        default () {
          return ''
        }
      },
      item: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      itemClass () {
        return this.item.value === this.value ? ACTIVE_CLS : ''
      }
    },
    methods: {
      // addActiveCls (e) {
      //   addClass(e.currentTarget, ACTIVE_CLS)
      // },
      // removeActiveCls (e) {
      //   removeClass(e.currentTarget, ACTIVE_CLS)
      // },
      selectItem () {
        this.$emit(EVENT_SELECT, this.item)
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  .cube-index-list-item-def {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 62px;
    font-size: 14px;
    color: #333;
    .cube-index-list-item-def-left {
      display: flex;
      align-items: center;
      .icon {
        margin-right: 15px;
        width: 30px;
        height: 30px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
    }
    .cube-index-list-item-def-right {
      margin-right: 10px;
      width: 22px;
      height: 22px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      background-image: url("../../../assets/images/empty-select.png");
    }
  }
  .cube-index-list-item_active {
    .cube-index-list-item-def-right {
      background-image: url("../../../assets/images/checked_icon_orange.png");
    }
  }
/*  .cube-index-list-item_active {
    background: $index-list-item-active-bgc
  }*/
</style>