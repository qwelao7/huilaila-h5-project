<template>
  <div class="check-dot-wrapper">
    <div class="outer" :style="{width: outerSize + 'px', height: outerSize + 'px', backgroundColor: outerBGColor}">
      <div class="inner" v-show="checked" :style="{width: innerSize + 'px', height: innerSize + 'px', backgroundColor: innerBGColor}"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'circleProgress',
    props: {
      outerSize: {
        type: Number,
        default: 20
      },
      innerSize: {
        type: Number,
        default: 15
      },
      outerBGColor: {
        type: String,
        default: '#EBEBEB'
      },
      innerBGColor: {
        type: String,
        default: '#00c66c'
      },
      checked: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
      }
    }
  }
</script>

<style scoped lang="less">
.check-dot-wrapper {
  .outer, .inner {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
  }
}
</style>
