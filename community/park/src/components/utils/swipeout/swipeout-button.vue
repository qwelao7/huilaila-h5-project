<template>
  <button class="vux-swipeout-button"
  :class="{'vux-swipeout-button-primary': type === 'primary', 'vux-swipeout-button-warn': type === 'warn', 'vux-swipeout-button-default': type === 'default'}" :style="{width: `${width}rem`, backgroundColor: backgroundColor}" @click="onButtonClick" type="button">
    <slot>{{text}}</slot>
  </button>
</template>

<script>
export default {
  props: {
    text: String,
    backgroundColor: String,
    type: String,
    width: {
      type: Number,
      default: '1.653333'
    }
  },
  methods: {
    onButtonClick () {
      if (this.$parent.$options._componentTag === 'swipeout-item') {
        this.$parent.onItemClick(this.text)
      }
    }
  }
}
</script>
<style scoped lang="less">
  .vux-swipeout-button {
    height: 1.333333rem;
    text-align: center;
    font-size: 16px;
    color: #fff;
    border: none;
  }
  .vux-swipeout-button-primary {
    background-color: #09d6d9;
  }
  .vux-swipeout-button-warn {
    background-color: #fa5757;
  }
  .vux-swipeout-button-default {
    background-color: #c8c7cd;
  }
  [data-dpr="2"]
  .vux-swipeout-button {
    font-size: 30px;
  }

  [data-dpr="3"]
  .vux-swipeout-button {
    font-size: 54px;
  }
</style>
