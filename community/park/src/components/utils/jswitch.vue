<template>
  <div class="jswitch-wrapper">
    <input type="checkbox" class="j-switch" :disabled="disabled" v-model="currentValue"
    @change="switchStatus">
  </div>
</template>

<script>
  export default {
    name: 'JSwitch',
    props: {
      disabled: Boolean,
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentValue: this.value
      }
    },
    methods: {
      switchStatus: function () {
        // 先不改变其状态
        this.currentValue = !this.currentValue;
        this.$emit('switchStatus');
      }
    },
    watch: {
      currentValue (val) {
        this.$emit('input', val)
        this.$emit('on-change', val)
      },
      value (val) {
        this.currentValue = val
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .jswitch-wrapper {
    font-size: 0;
    .j-switch {
      position: relative;
      width: 1.466667rem;
      height: 0.846rem;
      border: 1px solid #DFDFDF;
      outline: 0;
      border-radius: 0.533333rem;
      box-sizing: border-box;
      background-color: #DFDFDF;
      transition: background-color 0.1s, border 0.1s;
      -webkit-appearance: none;
      &[disabled] {
        opacity: 0.6;
      }
      &:before {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 1.386667rem;
        height: 0.8rem;
        border-radius: 0.4rem;
        background-color: #FDFDFD;
        transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
      }
      &:after {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 0.4rem;
        background-color: #FFFFFF;
        box-shadow: 0 0.053333rem 0.106667rem rgba(0, 0, 0, 0.4);
        transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
      }
      &:checked {
        border-color: #18adfb;
        background-color: #18adfb;
        &:before {
          transform: scale(0);
        }
        &:after {
          transform: translateX(0.666667rem);
        }
      }
    }
  }
</style>
