<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" :stroke-width="strokeWidth" fill="transparent"/>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-width="strokeWidth" :stroke-dasharray="dashArray"
                      :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'circleProgress',
    props: {
      radius: {
        type: [Number, String],
        default: 28
      },
      percent: {
        type: Number,
        default: 0
      },
      strokeWidth: {
        type: Number,
        default: 2
      }
    },
    data () {
      return {
        dashArray: Math.PI * 100
      }
    },
    computed: {
      dashOffset () {
        return (1 - this.percent) * this.dashArray
      }
    }
  }
</script>

<style scoped lang="less">
.progress-circle {
  position: relative;
  circle {
    transform-origin: center;
  }
  .progress-background {
    transform: scale(0.9);
    stroke: #dcdcdc;
  }
  .progress-bar {
    transform: scale(0.9) rotate(0deg);
    stroke: #FF6648;
  }
}
</style>
