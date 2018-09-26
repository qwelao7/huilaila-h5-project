<template>
  <div class="j-scroll"
       :class="{'down':(state === 0), 'up':(state === 1), 'refresh':(state === 2), 'touch': touching}"
       @touchstart="touchStart($event)"
       @touchmove="touchMove($event)"
       @touchend="touchEnd($event)"
       @scroll="(onInfinite || infiniteLoading) ? onScroll($event) : undefined">
    <section class="inner" :style="{ transform: 'translate3d(0rem, ' + top + 'rem, 0rem)' }">
      <header class="pull-refresh">
        <slot name="pull-refresh">
          <span class="down-tip">下拉更新</span>
          <span class="up-tip">松开更新</span>
          <span class="refresh-tip">更新中</span>
        </slot>
      </header>
      <slot></slot>
      <footer class="load-more">
        <slot name="load-more">
          <span>加载中……</span>
        </slot>
      </footer>
    </section>
  </div>
</template>

<script>
  // 获取根节点字体大小
  const htmlFontSize = getComputedStyle(window.document.documentElement)['font-size'];
  const remRate = parseInt(htmlFontSize.substring(0, (htmlFontSize.length - 2)));
  export default {
    props: {
      offset: {
        type: Number,
        default: 0.533333
      },
      enableInfinite: {
        type: Boolean,
        default: true
      },
      enableRefresh: {
        type: Boolean,
        default: true
      },
      onRefresh: {
        type: Function,
        default: undefined,
        required: false
      },
      onInfinite: {
        type: Function,
        default: undefined,
        require: false
      }
    },
    data () {
      return {
        top: 0,
        state: 0,
        startY: 0,
        startScroll: 0,
        touching: false,
        infiniteLoading: false
      }
    },
    methods: {
      touchStart (e) {
        this.startY = e.targetTouches[0].pageY / remRate;
        this.startScroll = (this.$el.scrollTop || 0) / remRate;
        this.touching = true
      },
      touchMove (e) {
        if (!this.enableRefresh || this.$el.scrollTop > 0 || !this.touching) {
          return;
        }
        let diff = e.targetTouches[0].pageY / remRate - this.startY - this.startScroll;
        if (diff > 0) {
          e.preventDefault();
        }
        this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset / remRate : 0)
        if (this.state === 2) { // in refreshing
          return;
        }
        if (this.top >= this.offset / remRate) {
          this.state = 1;
        } else {
          this.state = 0;
        }
      },
      touchEnd (e) {
        if (!this.enableRefresh) {
          return;
        }
        this.touching = false;
        if (this.state === 2) { // in refreshing
          this.state = 2;
          this.top = this.offset / remRate;
          return
        }
        if (this.top >= this.offset / remRate) { // do refresh
          this.refresh();
        } else { // cancel refresh
          this.state = 0;
          this.top = 0;
        }
      },
      refresh () {
        this.state = 2;
        this.top = this.offset / remRate;
        this.onRefresh(this.refreshDone);
      },
      refreshDone () {
        this.state = 0;
        this.top = 0;
      },
      infinite () {
        this.infiniteLoading = true;
        this.onInfinite(this.infiniteDone);
      },
      infiniteDone () {
        this.infiniteLoading = false;
      },
      onScroll (e) {
        if (!this.enableInfinite || this.infiniteLoading) {
          return;
        }
        let outerHeight = this.$el.clientHeight / remRate;
        let innerHeight = this.$el.querySelector('.inner').clientHeight / remRate;
        let scrollTop = this.$el.scrollTop / remRate;
        let ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-refresh').clientHeight / remRate : 0
        let infiniteHeight = this.$el.querySelector('.load-more').clientHeight / remRate;
        let bottom = (innerHeight - outerHeight - scrollTop - ptrHeight) / remRate;
        if (bottom < infiniteHeight) this.infinite()
      }
    }
  }
</script>
<style scoped lang="less">
  .j-scroll {
    font-size: 24px;
    position: absolute;
    top: 80px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    z-index: 100;
    height: auto;
    -webkit-overflow-scrolling: touch;
    .inner {
      position: absolute;
      top: -5rem;
      width: 100%;
      height: auto;
      transition-duration: 300ms;
      .pull-refresh {
        position: relative;
        left: 0;
        top: 0;
        width: 100%;
        height: 5rem;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
      }
      .load-more {
        height: 5rem;
        line-height: 5rem;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        display: none;
      }
      .nullData {
        //暂无更多数据样式
        font-size: 26px;
        color: #999999;
        height: 100px;
        line-height: 80px;
        text-align: center;
      }
      .down-tip,
      .refresh-tip,
      .up-tip {
        display: none;
      }
      .up-tip:before,
      .refresh-tip:before {
        content: '';
        display: inline-block;
        width: 160px;
        height: 70px;
        background-size: 70% !important;
        position: absolute;
        top: 0;
        left: 20%;
      }
      .up-tip:before {
        /*background: url(../img/pull-refresh/down-logo.png) no-repeat center;*/
      }
      .refresh-tip:before {
        /*background: url(../img/pull-refresh/refresh-logo.gif) no-repeat center;*/
      }
    }
  }

  .j-scroll.touch .inner {
    transition-duration: 0;
  }

  .j-scroll.down .down-tip {
    display: block;
  }

  .j-scroll.up .up-tip {
    display: block;
  }

  .j-scroll.refresh .refresh-tip {
    display: block;
  }
</style>
