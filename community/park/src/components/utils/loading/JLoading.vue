<template>
  <transition name="vux-mask">
    <div class="jui-loading_toast" v-show="show">
      <div class="jui-mask_transparent"></div>
      <div class="jui-toast" :style="{ position: position }">
        <i class="jui-loading jui-icon_toast"></i>
        <p class="jui-toast__content" v-text="text"><slot></slot></p>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      text: {
        type: String,
        default: ''
      },
      position: String
    },
    created () {
      this.show = this.value
    },
    data () {
      return {
        show: false
      }
    },
    watch: {
      value (val) {
        this.show = val
      },
      show (val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style scoped lang="less">
  @import './styles/jui_mask.less';
  @import './styles/jui_toast.less';
  @import './styles/jui-loading.less';

  .jui-icon_toast.jui-loading {
    width: 0.933333rem;
    height: 0.933333rem;
    vertical-align: baseline;
    display: inline-block;
  }
  .vux-mask-enter, .vux-mask-leave-active {
    opacity: 0;
  }
  .vux-mask-leave-active, .vux-mask-enter-active {
    transition: opacity 300ms;
  }
</style>
