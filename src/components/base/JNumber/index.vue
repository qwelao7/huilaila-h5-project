<template>
  <div class="j-number-wrapper">
    <div class="j-cell__ft j-cell-primary" :class="{'j-number-round': buttonStyle === 'round'}" v-show="!readonly" style="font-size:0">
      <div :style="{float:align}">
        <a @click="sub" class="j-number-selector j-number-selector-sub":class="{'j-number-disabled':disabledMin}">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18"><defs></defs><path d="M863.74455 544.00086 163.424056 544.00086c-17.664722 0-32.00086-14.336138-32.00086-32.00086s14.336138-32.00086 32.00086-32.00086l700.320495 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.440237 544.00086 863.74455 544.00086z"></path></svg>
        </a>
        <input v-model.number="currentValue" @change="onChange" :name="name" class="j-number-input" :style="{width: width}" :readonly="!fillable" pattern="[0-9]*" type="number" @blur="blur" />
        <a @click="add" class="j-number-selector j-number-selector-plus" :class="{'j-number-disabled':disabledMax}">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs></defs><path d="M863.328262 481.340895l-317.344013 0.099772L545.984249 162.816826c0-17.664722-14.336138-32.00086-32.00086-32.00086s-31.99914 14.336138-31.99914 32.00086l0 318.400215-322.368714-0.17718c-0.032684 0-0.063647 0-0.096331 0-17.632039 0-31.935493 14.239806-32.00086 31.904529-0.096331 17.664722 14.208843 32.031824 31.871845 32.095471l322.59234 0.17718 0 319.167424c0 17.695686 14.336138 32.00086 31.99914 32.00086s32.00086-14.303454 32.00086-32.00086L545.982529 545.440667l317.087703-0.099772c0.063647 0 0.096331 0 0.127295 0 17.632039 0 31.935493-14.239806 32.00086-31.904529S880.960301 481.404542 863.328262 481.340895z"></path></svg>
        </a>
      </div>
    </div>
    <div class="j-cell__ft j-cell-primary" v-show="readonly" v-text="value"></div>
  </div>
</template>

<script>
  const Big = require('./big.js')
  export default {
    name: 'x-number',
    props: {
      min: Number,
      minToastText: '超过下限了哦',
      max: Number,
      maxToastText: '超过上限了哦',
      readonly: Boolean,
      step: {
        type: Number,
        default: 1
      },
      mainObj: {
        type: Object,
        default: ''
      },
      value: {
        validator (value) {
          if (typeof value === 'number') {
            return true
          } else if (typeof value === 'string') {
            return value === ''
          }
          return false
        },
        default: 0
      },
      name: String,
      title: String,
      fillable: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '50px'
      },
      buttonStyle: {
        type: String,
        default: 'square'
      },
      align: {
        type: String,
        default: 'right'
      },
      onAdd: {
        type: Function
      },
      onSub: {
        type: Function
      },
      onChangeFunc: {
        type: Function
      }
    },
    created () {
      this.currentValue = this.value
    },
    data () {
      return {
        currentValue: 0
      }
    },
    computed: {
      disabledMin () {
        return typeof this.min === 'undefined' ? false : (this.currentValue === '' ? true : this.currentValue <= this.min)
      },
      disabledMax () {
        return typeof this.max === 'undefined' ? false : (this.currentValue === '' ? true : this.currentValue >= this.max)
      },
      labelClass () {
        return {
          'j-cell-justify': this.$parent.labelAlign === 'justify' || this.$parent.$parent.labelAlign === 'justify'
        }
      }
    },
    watch: {
      currentValue (newValue, old) {
        if (newValue !== '') {
          if (typeof this.min !== 'undefined' && this.currentValue < this.min) {
            this.currentValue = this.min
          }
          if (this.max && this.currentValue > this.max) {
            this.currentValue = this.max
          }
        }
        this.$emit('input', this.currentValue)
      },
      value (newValue) {
        this.currentValue = newValue
        this.$emit('on-change', newValue)
      }
    },
    methods: {
      add () {
        if (!this.disabledMax) {
          const x = new Big(this.currentValue);
          let val = x.plus(this.step) * 1;
          let _this_ = this;
          if (this.onAdd) {
            _this_.onAdd(this.mainObj, val, function (newVal) {
              _this_.currentValue = newVal;
            });
          } else {
            _this_.currentValue = val;
          }
        } else {
          this.$j.toast.show({
            type: 'cancel',
            text: this.maxToastText
          })
        }
      },
      sub () {
        if (!this.disabledMin) {
          const x = new Big(this.currentValue);
          let val = x.minus(this.step) * 1;
          let _this_ = this;
          if (this.onSub) {
            this.onSub(this.mainObj, val, function (newVal) {
              _this_.currentValue = val;
            });
          } else {
            _this_.currentValue = val;
          }
        } else {
          this.$j.toast.show({
            type: 'cancel',
            text: this.minToastText
          })
        }
      },
      onChange () {
        if (!this.disabledMin) {
          let val = this.currentValue;
          let oldVal = this.value;
          let _this_ = this;
          if (this.onChangeFunc) {
            this.onChangeFunc(this.mainObj, val, function (newVal) {
              _this_.currentValue = newVal;
            });
          } else {
            _this_.currentValue = val;
          }
        } else {
          this.$j.toast.show({
            type: 'cancel',
            text: this.minToastText
          })
        }
      },
      blur () {
        if (this.currentValue === '') {
          this.currentValue = 0
        }
      }
    }
  }
</script>

<style lang="less">
  .j-number-wrapper {
    .j-cell__ft {
      text-align: right;
      color: #999999;
    }
    .j-cell-primary {
      flex: 1;
    }
    .j-number-input {
      float:left;
      height:20px;
      font-size:20px;
      color: #666;
      appearance: none;
      border:1px solid #ececec;
      padding:3px 0;
      text-align:center;
      border-radius: 1px;
    }
    .j-number-round .j-number-input {
      border: none;
    }
    .j-number-selector {
      float:left;
      height:20px;
      font-size:25px;
      line-height:18px;
      color:#3cc51f;
      border:1px solid #ececec;
    }
    .j-number-round .j-number-selector {
      width: 20px;
      border-radius: 13px;
    }
    .j-number-selector svg {
      fill: #666666;
    }
    .j-number-selector.j-number-disabled svg {
      fill: #ccc;
    }
    .j-number-round .j-number-selector.j-number-disabled {
      border-color: #ececec;
    }
    .j-number-round .j-number-selector.j-number-disabled svg {
      fill: #ccc;
    }
    .j-number-selector-sub {
      border-right:none;
      padding:4px 8px 2px 8px;
      border-radius:2px 0 0 2px;
    }
    .j-number-selector-plus {
      border-left:none;
      margin-right: 5px;
      padding:3px 8px;
      border-radius:0 2px 2px 0;
    }
    .j-number-round .j-number-selector-sub svg {
      position: relative;
      top: 1px;
    }
    .j-number-round .j-number-selector-sub, .j-number-round .j-number-selector-plus {
      padding: 2px;
      border: 1px solid #3cc51f;
      text-align: center;
    }
  }
</style>
