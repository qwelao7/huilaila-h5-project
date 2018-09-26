<template>
  <transition name='fade'>
    <div v-show='visible' :class='position' class='toast'>
      <span>{{message}}</span>
    </div>
  </transition>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        message: '',
        position: ''
      };
    }
  }
</script>


<style scoped lang="less">
  .toast {
    position: fixed;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    word-wrap: break-word;
    padding: 0.213333rem;
    text-align: center;
    z-index: 99999;
    font-size: 14px;
    max-width: 80%;
    color: #fff;
    border-radius: 0.066667rem;
    background: rgba(0, 0, 0, 0.7);
    overflow: hidden;
    &.middle {
      top: 50%;
    }
    &.top {
      top: 10%;
    }
    &.bottom {
      top: 90%;
    }
  }
  [data-dpr="2"]
  .toast {
    font-size: 28px;
  }
  [data-dpr="3"]
  .toast {
    font-size: 50px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: transform .5s
  }

  .fade-enter, .fade-leave-active {
    transform: translate(-50%, -50%) scale(0);
  }
</style>
