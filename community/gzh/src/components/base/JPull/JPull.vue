<template>
  <div class="pull-wrapper" ref="pullWrapper">
    <pull-to :top-load-method="refreshFunc ? refresh : undefined" :bottom-load-method="loadMoreFunc ? loadMore : undefined"
             @top-state-change="topStateChange" @bottom-state-change="bottomStateChange"
             @bottom-pull="pullUp" @top-pull="pullDown" @infinite-scroll="bottomScroll" @scroll="scroll"
             :is-throttle-top-pull="isThrottleTopPull" :is-throttle-bottom-pull="isThrottleBottomPull"
             :top-config="pullDownConfig" :bottom-config="pullUpConfig" ref="pullWrapper">
      <template slot="top-block" slot-scope="props">
        <div class="top-load-wrapper">
          <svg class="icon"
               :class="{
                  'icon-arrow': props.state === 'trigger',
                  'icon-loading': props.state === 'loading'
                }"
               aria-hidden="true">
            <use :xlink:href="topIconLink"></use>
          </svg>
          {{ props.stateText }}
        </div>
      </template>
      <slot name="jpull-list"></slot>
      <template slot="bottom-block" slot-scope="props">
        <div class="bottom-load-wrapper" v-show="hasMore">
          <svg class="icon"
               :class="{
                  'icon-arrow': props.state === 'pull',
                  'icon-loading': props.state === 'loading'
                }"
               aria-hidden="true">
            <use :xlink:href="bottomIconLink"></use>
          </svg>
          {{ props.stateText }}
        </div>
        <divider style="margin-top: .3rem; font-size: 12px" v-show="!hasMore">我是有底线的</divider>
      </template>
    </pull-to>
  </div>
</template>

<script>
  import PullTo from 'vue-pull-to'
  import { Divider } from 'vux'
  require('./icon/iconfont');
  //  require('./base.less');
  export default {
    name: 'JPull',
    props: {
      isNeedAutoRefresh: false,
      isThrottleTopPull: false,
      isThrottleBottomPull: false,
      pullDownConfig: {
        type: Object,
        default: function () {
          return {
            pullText: '下拉刷新', // 下拉时显示的文字
            triggerText: '释放刷新', // 下拉到触发距离时显示的文字
            loadingText: '加载中...', // 加载中的文字
            doneText: '加载完成', // 加载完成的文字
            failText: '加载失败', // 加载失败的文字
            loadedStayTime: 400, // 加载完后停留的时间ms
            stayDistance: 50, // 触发刷新后停留的距离
            triggerDistance: 70 // 下拉刷新触发的距离
          }
        }
      },
      pullUpConfig: {
        type: Object,
        default: function () {
          return {
            pullText: '上拉加载',
            triggerText: '释放加载更多',
            loadingText: '加载中...',
            doneText: '加载完成',
            failText: '加载失败',
            loadedStayTime: 400,
            stayDistance: 50,
            triggerDistance: 70
          }
        }
      },
      refreshFunc: {
        type: Function
      },
      loadMoreFunc: {
        type: Function
      },
      // 上拉时触发,distance为上拉距离
      pullUpFunc: {
        type: Function
      },
      // 下拉时触发,distance为下拉距离
      pullDownFunc: {
        type: Function
      },
      // 无限加载情景下,滚动到底部时,触发(我是有底线的)
      bottomFunc: {
        type: Function
      },
      scrollFunc: {
        type: Function
      }
    },
    components: {
      PullTo,
      Divider
    },
    mounted: function () {
      if (this.isNeedAutoRefresh) {
        this.refresh(this.$refs.pullWrapper.actionLoaded);
      }
    },
    data () {
      return {
        topIconLink: '',
        bottomIconLink: '',
        hasMore: true
      }
    },
    methods: {
      refresh (loaded) {
        let _this_ = this;
        this.refreshFunc(function (hasMore) {
          _this_.hasMore = hasMore;
          loaded('done');
        });
      },
      topStateChange (state) {
        if (state === 'pull' || state === 'trigger') {
          this.topIconLink = '#icon-arrow-bottom';
        } else if (state === 'loading') {
          this.topIconLink = '#icon-loading';
        } else if (state === 'loaded-done') {
          this.topIconLink = '#icon-finish';
        }
      },
      bottomStateChange (state) {
        if (state === 'pull' || state === 'trigger') {
          this.bottomIconLink = '#icon-arrow-bottom';
        } else if (state === 'loading') {
          this.bottomIconLink = '#icon-loading';
        } else if (state === 'loaded-done') {
          this.bottomIconLink = '#icon-finish';
        }
      },
      loadMore (loaded) {
        let _this_ = this;
        if (this.hasMore) {
          this.loadMoreFunc(function (hasMore) {
            _this_.hasMore = hasMore;
            loaded('done');
          });
        } else {
          loaded('done');
        }
      },
      // 上拉时触发,distance为上拉距离
      pullUp (distance) {
        if (this.pullUpFunc) {
          this.pullUpFunc(distance);
        }
      },
      // 下拉时触发,distance为下拉距离
      pullDown (distance) {
        if (this.pullDownFunc) {
          this.pullDownFunc(distance);
        }
      },
      // 滚动到底部时,触发
      bottomScroll () {
        if (this.bottomFunc) {
          this.bottomFunc();
        }
      },
      scroll (event) {
        if (this.scrollFunc) {
          this.scrollFunc(event);
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .pull-wrapper {
    overflow-y: hidden;
    height: 100%;
  }
  .top-load-wrapper {
    line-height: 50px;
    text-align: center;
  }
  .icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .icon-arrow {
    transition: .2s;
    transform: rotate(180deg);
  }
  .bottom-load-wrapper {
    line-height: 50px;
    text-align: center;
  }
  .icon-loading {
    transform: rotate(0deg);
    animation-name: loading;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
  @keyframes loading
  {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
  }
</style>
