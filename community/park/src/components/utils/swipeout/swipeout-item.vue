<template>
  <div class="vux-swipeout-item"
       @touchstart="start"
       @mousedown="start"
       @touchmove="move"
       @mousemove="move"
       @touchend="end"
       @mouseup="end"
       @touchcancel="end">
    <div class="vux-swipeout-button-box vux-swipeout-button-box-left" :style="leftButtonBoxStyle" v-show="distX >= 0">
      <slot name="left-menu"></slot>
    </div>
    <div class="vux-swipeout-button-box" :style="rightButtonBoxStyle" v-show="distX <= 0">
      <slot name="right-menu"></slot>
    </div>
    <div class="vux-swipeout-content" :style="styles" @mousedown="onContentClick" @touchstart="onContentClick"
         ref="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
  // 获取根节点字体大小
  const htmlFontSize = getComputedStyle(window.document.documentElement)['font-size'];
  const remRate = parseInt(htmlFontSize.substring(0, (htmlFontSize.length - 2)));
  export default {
    name: 'swipeout-item',
    props: {
      sensitivity: {
        type: Number,
        default: 0
      },
      autoCloseOnButtonClick: {
        type: Boolean,
        default: true
      },
      disabled: Boolean,
      threshold: {
        type: Number,
        default: 0.3
      },
      underlayColor: String,
      transitionMode: {
        type: String,
        default: 'reveal'
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.target = this.$refs.content
        if (this.$slots['left-menu']) {
          this.hasLeftMenu = true
          this.caculateMenuWidth('left')
        }
        if (this.$slots['right-menu']) {
          this.hasRightMenu = true
          this.caculateMenuWidth('right')
        }
      })
    },
    methods: {
      caculateMenuWidth (direction) {
        const list = this.$slots[`${direction}-menu`][0].children.filter(one => one.tag)
        let width = 0
        list.forEach(one => {
          const propsData = one.componentOptions ? one.componentOptions.propsData : {}
          width += propsData.width || 1.653333
        })
        this[`${direction}MenuWidth`] = width
      },
      onContentClick () {
        if (this.styles.transform.indexOf('(0rem, 0, 0)') === -1) {
          this._setClose(200)
        }
      },
      onItemClick () {
        if (this.autoCloseOnButtonClick) {
          this._setClose()
        }
      },
      start (ev) {
        if (this.disabled || this.isOpen || ev.target.nodeName.toLowerCase() === 'button') {
          return
        }
        if (this.$parent.$options._componentTag === 'swipeout') {
          const openItems = this.$parent.$children.filter(item => item.$data.styles.transform.indexOf('(0rem, 0, 0)') === -1)
          if (openItems.length > 0) {
            openItems.forEach(item => {
              item.setOffset(0, true)
            })
            ev.preventDefault()
            return
          }
        }
        const touch = ev.touches ? ev.touches[0] : ev
        this.pageX = touch.pageX / remRate;
        this.pageY = touch.pageY / remRate;
      },
      move (ev) {
        if (this.disabled) {
          return
        }
        if (ev.target.nodeName.toLowerCase() === 'button') {
          ev.preventDefault()
          return
        }
        if (this.pageX === undefined) {
          ev.preventDefault()
          return
        }

        const touch = ev.touches ? ev.touches[0] : ev
        this.distX = touch.pageX / remRate - this.pageX
        this.distY = touch.pageY / remRate - this.pageY

        if (!this.direction) {
          this.direction = this.distX > 0 ? 'left' : 'right'
        }

        if ((this.direction === 'right' && this.distX > 0 && this.hasRightMenu) || (this.direction === 'left' && this.distX < 0 && this.hasLeftMenu)) {
          this.valid = true
          ev.preventDefault()
        }

        if (this.valid === undefined) {
          if (this.distX > 0 && this.hasLeftMenu === false) {
            this.valid = false
          } else if (this.distX < 0 && this.hasRightMenu === false) {
            this.valid = false
          } else if (Math.abs(this.distX) > this.sensitivity || Math.abs(this.distY) > this.sensitivity) {
            this.valid = Math.abs(this.distX) > Math.abs(this.distY)
          } else {
            ev.preventDefault()
          }
        }

        if (this.valid === true) {
          if (Math.abs(this.distX) <= this.menuWidth) {
            this.setOffset(this.distX, false)
          } else {
            const extra = (Math.abs(this.distX) - this.menuWidth) * 0.5
            const offset = (this.menuWidth + extra) * (this.distX < 0 ? -1 : 1)
            this.setOffset(offset, false)
          }
          ev.preventDefault()
        }
      },
      end (ev) {
        if (this.disabled) {
          return
        }
        if (ev.target.nodeName.toLowerCase() === 'button') {
          return
        }
        if (this.valid === true) {
          if (this.distX < 0 && this.direction === 'right') {
            const threshold = this.threshold <= 1 ? this.rightMenuWidth * this.threshold : this.threshold

            if (this.distX < -threshold) {
              this.setOffset(-this.rightMenuWidth, true)
              this.$emit('on-open')
              this.isOpen = true
            } else {
              this._setClose()
            }
          } else if (this.distX > 0 && this.direction === 'left') {
            const threshold = this.threshold <= 1 ? this.leftMenuWidth * this.threshold : this.threshold

            if (this.distX > threshold) {
              this.setOffset(this.leftMenuWidth, true)
              this.$emit('on-open')
              this.isOpen = true
            } else {
              this._setClose()
            }
          }
        } else if (this.pageX !== undefined) {
        }

        this.pageX = this.pageY = this.valid = undefined
        this.direction = ''
      },
      setOffset (x, animated = false, force) {
        this.isAnimated = animated
        if (this.disabled && !force) {
          return
        }
        if ((this.direction === 'right' && x > 0) || (this.direction === 'left' && x < 0)) {
          x = 0
        }

        if (x === 0) {
          setTimeout(() => {
            this.isOpen = false
          }, 300)
        }

        if (x < 0 && Math.abs(x) === this.rightMenuWidth) {
          this.distX = -this.rightMenuWidth
        } else if (x > 0 && Math.abs(x) === this.leftMenuWidth) {
          this.distX = this.leftMenuWidth
        }
        if (animated && this.target) {
          this.target && this.target.classList.add('vux-swipeout-content-animated')
          var cb = (function (self, target) {
            return function () {
              target.classList.remove('vux-swipeout-content-animated')
              self.isAnimated = false
              target.removeEventListener('webkitTransitionEnd', cb)
              target.removeEventListener('transitionend', cb)
            }
          })(this, this.target)

          this.target.addEventListener('webkitTransitionEnd', cb)
          this.target.addEventListener('transitionend', cb)
        }
        this.styles.transform = 'translate3d(' + x + 'rem, 0, 0)'
      },
      _setClose (delay = 0) {
        this.setOffset(0, true)
        this.$emit('on-close')
        if (!delay) {
          this.isOpen = false
        } else {
          setTimeout(() => {
            this.isOpen = false
          }, delay)
        }
        this.distX = 0
      },
      open (position = 'right') {
        this.setOffset(position === 'right' ? -this.rightMenuWidth : this.leftMenuWidth, true, true)
      },
      close () {
        this.setOffset(0, true, true)
      }
    },
    computed: {
      menuWidth () {
        if (!this.hasLeftMenu && this.hasRightMenu) {
          return this.rightMenuWidth
        }
        if (this.hasLeftMenu && !this.hasRightMenu) {
          return this.leftMenuWidth
        }
        if (this.hasLeftMenu && this.hasRightMenu) {
          return this.distX < 0 ? this.rightMenuWidth : this.leftMenuWidth
        }
      },
      buttonBoxStyle () {
        return {
          backgroundColor: this.underlayColor
        }
      },
      leftButtonBoxStyle () {
        let styles = JSON.parse(JSON.stringify(this.buttonBoxStyle))
        if (this.transitionMode === 'follow') {
          let offset = this.styles.transform.indexOf('(0rem, 0, 0)') === -1 ? this.leftMenuWidth - this.distX : this.leftMenuWidth
          styles.transform = `translate3d(-${offset}rem, 0, 0)`
        }
        return styles
      },
      rightButtonBoxStyle () {
        let styles = JSON.parse(JSON.stringify(this.buttonBoxStyle))
        if (this.transitionMode === 'follow') {
          let offset = this.styles.transform.indexOf('(0rem, 0, 0)') === -1 ? this.rightMenuWidth - Math.abs(this.distX) : this.rightMenuWidth
          if (offset < 0) {
            offset = 0
          }
          if (this.isAnimated) {
            styles.transition = 'transform 0.2s'
          }
          styles.transform = `translate3d(${offset}rem, 0, 0)`
        }
        return styles
      }
    },
    data () {
      return {
        pageX: undefined,
        pageY: undefined,
        distX: 0,
        distY: 0,
        hasLeftMenu: false,
        hasRightMenu: false,
        animated: false,
        isAnimated: false,
        isOpen: false,
        styles: {
          transform: 'translate3d(0rem, 0, 0)'
        },
        direction: '',
        leftMenuWidth: 3.306667,
        rightMenuWidth: 3.306667
      }
    },
    watch: {
      disabled (newVal, oldVal) {
        if (newVal === true && !oldVal) {
          this.setOffset(0, true, true)
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .vux-swipeout-item {
    position: relative;
    .vux-swipeout-button-box {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      font-size: 0;
      text-align: right;
      & > div {
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
    }
    .vux-swipeout-button-box-left {
      text-align: left;
    }
    .vux-swipeout-content {
      position: relative;
      .vux-swipeout-content-animated {
        transition: transform 0.2s;
      }
    }
  }
</style>
