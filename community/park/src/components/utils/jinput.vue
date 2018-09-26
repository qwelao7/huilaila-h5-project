<template>
  <div class="jl-input-wrapper">
    <div class="jl-input-hd"
         :style="{textAlign: jlInputStyle.hdTextAlign, color: jlInputStyle.hdColor, flex: hdFlexWidth}">
      <label class="jl-input-hd-title" v-text="title"></label>
    </div>
    <div class="jl-input-content"
         :style="{textAlign: jlInputStyle.contentTextAlign, color: jlInputStyle.contentColor, flex: contentFlexWidth}">
      <slot name="content-label" :style="contentLabelStyle"></slot>
      <input class="jl-input" v-if="type === 'text'" type="text" :name="name"
             :placeholder="placeholder" :readonly="readonly" :disabled="disabled" :maxlength="maxLength" v-model="currentValue"
             @input="inputHandler" @focus="focusHandler" @blur="blurHandler" ref="input">
      <input class="jl-input" v-if="type === 'number'" type="number" :name="name"
             :placeholder="placeholder" :readonly="readonly" :disabled="disabled" :maxlength="maxLength" v-model="currentValue"
             @input="inputHandler" @focus="focusHandler" @blur="blurHandler" ref="input">
      <input class="jl-input" v-if="type === 'phone'" type="tel" :name="name"
             :placeholder="placeholder" :readonly="readonly" :disabled="disabled" :maxlength="maxLength" v-model="currentValue"
             @input="inputHandler" @focus="focusHandler" @blur="blurHandler" ref="input">
      <input class="jl-input" v-if="type === 'email'" type="email" :name="name"
             :placeholder="placeholder" :readonly="readonly" :disabled="disabled" :maxlength="maxLength" v-model="currentValue"
             @input="inputHandler" @focus="focusHandler" @blur="blurHandler" ref="input">
      <input class="jl-input" v-if="type === 'password'" type="password" :name="name"
             :placeholder="placeholder" :readonly="readonly" :disabled="disabled" :maxlength="max" v-model="currentValue"
             @input="inputHandler" @focus="focusHandler" @blur="blurHandler" ref="input"/>
    </div>
    <div class="jl-input-ft"
         :style="{textAlign: jlInputStyle.ftTextAlign, color: jlInputStyle.ftColor, flex: ftFlexWidth}">
      <div class="clear" v-if="showClear" v-show="currentValue" @click="clearVal">
        <x-icon type="ios-close-outline"></x-icon>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'jlInput',
    created: function () {
      this.currentValue = this.value;
    },
    props: {
      name: {
        type: String
      },
      title: {
        type: String
      },
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String
      },
      value: [String, Number],
      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      maxLength: {
        type: Number
      },
      showClear: {
        type: Boolean,
        default: true
      },
      contentLabelStyle: {
        type: Object,
        default: function () {
          return {
            marginRight: '0.08rem'
          }
        }
      },
      jlInputStyle: {
        type: Object,
        default: function () {
          return {
            hdTextAlign: 'left',
            hdColor: '#333',
            hdWidth: '2.0rem',
            contentTextAlign: 'left',
            contentColor: '#333',
            contentWidth: '1',
            ftTextAlign: 'right',
            ftColor: '#999',
            ftWidth: '0.8rem'
          };
        }
      }
    },
    data () {
      return {
        currentValue: ''
      }
    },
    computed: {
      hdFlexWidth: function () {
        return '0 0 ' + this.jlInputStyle.hdWidth;
      },
      contentFlexWidth: function () {
        return this.jlInputStyle.contentWidth;
      },
      ftFlexWidth: function () {
        return '0 0 ' + this.jlInputStyle.ftWidth;
      }
    },
    watch: {
      value: function (newVal) {
        this.currentValue = newVal;
      },
      currentValue (newVal) {
        this.$emit('input', newVal);
      }
    },
    methods: {
      focusHandler () {
        this.$emit('on-focus', this.currentValue)
      },
      blurHandler () {
        this.$emit('on-blur', this.currentValue)
      },
      inputHandler () {
        this.$emit('on-input', this.currentValue);
      },
      clearVal: function () {
        this.currentValue = '';
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .jl-input-wrapper {
    width: 100%;
    display: flex;
    align-items:center;
    justify-content: center;
    .jl-input-hd {
      font-size: 14px;
    }
    .jl-input-content {
      display: flex;
      .jl-input {
        width: 100%;
        outline: 0;
        border: 0;
        font-size: 14px;
      }
      jl-input::-webkit-input-placeholder {
        color: #aaa;
      }
      jl-input:-moz-placeholder {
        color: #aaa;
      }
      jl-input::-moz-placeholder {
        color: #aaa;
      }
    ;
      jl-input:-ms-input-placeholder {
        color: #aaa;
      }
    }
    .jl-input-ft {
      display: flex;
      justify-content: flex-end;
      .clear {
        display: flex;
        padding: 0.266667rem 0 0.266667rem 0.4rem;
      }
    }
  }

  [data-dpr="2"]
  .jl-input-wrapper {
    .jl-input-hd {
      font-size: 30px;
    }
    .jl-input-content {
      .jl-input {
        font-size: 30px;
      }
    }
  }

  [data-dpr="3"]
  .jl-input-wrapper {
    .jl-input-hd {
      font-size: 48px;
    }
    .jl-input-content {
      .jl-input {
        font-size: 48px;
      }
    }
  }
</style>
