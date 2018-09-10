<template>
  <div class="jbutton-wrapper">
    <button class="jbutton" v-text="jText" :style="jstyle" :class="{'jbutton-primary': type === 'primary', 'jbutton-cancel': type === 'cancel',
     'jbutton-warn': type === 'warn', 'jbutton-disabled': type === 'disabled'}" :disabled="disabled"></button>
  </div>
</template>
<script>
  export default {
    props: {
      jText: {
        type: String,
        default: '确认提交'
      },
      jstyle: {
        type: Object,
        default: function () {
          return {};
        }
      },
      type: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    name: 'JButton'
  }
</script>

<style scoped lang="less">
  .jbutton-wrapper {
    width: 100%;
    height: 100%;
    .jbutton {
      width: 100%;
      height: 100%;
      border-width: 0;
      outline: 0;
      -webkit-appearance: none;
      background-color: #18ADFB;
      border-radius: 0.053333rem;
      font-size: 18px;
      color: #fff;
    }
    .jbutton-primary {
      background-color: #FF6648;;
    }
    .jbutton-primary:active {
      background-color: #FF6648;
    }
    .jbutton-cancel {
      background-color: #aaa;
    }
    jbutton-cancel:active {
      background-color: #F8F8F8;
    }
    .jbutton-warn {
      background-color: #E64340;
    }
    .jbutton-warn:active {
      background-color: #CE3C39;
    }
    .jbutton-disabled {
      background-color: #aaa
    }
  }

  [data-dpr="2"]
  .jbutton-wrapper {
    .jbutton {
      font-size: 36px;
    }
  }

  [data-dpr="3"]
  .jbutton-wrapper {
    .jbutton {
      font-size: 52px;
    }
  }
</style>
