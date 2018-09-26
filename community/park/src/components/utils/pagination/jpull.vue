<template>
  <!-- content -->
  <div class="list-wrapper list-wrapper-hook">
    <div>
      <!-- 顶部提示信息 -->
      <div class="top-tip" v-show="isScrollable">
        <span class="pull-icon" :class="pullDownClass"></span>
        <span class="refresh-hook refresh-text" v-text="pullDownText"></span>
      </div>
      <!-- 列表 -->
      <slot></slot>
      <!--
        1、底部提示信息
        2、这里有一种情况,就是没有更多数据时,这里的文本应该显示"暂无更多数据"
      -->
      <div class="bottom-tip" v-show="isScrollable">
        <span class="pull-icon" :class="pullUpClass"></span>
        <span class="loading-hook loading-text" v-text="pullUpText"></span>
      </div>
    </div>
    <!-- 刷新成功提示 -->
    <div class="alert" :class="{success: isRefreshSuccess, error: !isRefreshSuccess}"
         v-text="isRefreshSuccess ? pullDownConfig.refreshSuccess : pullDownConfig.refreshError"
         v-show="isRefreshSuccess"></div>
  </div>
  <!-- content end  -->
</template>
<script>
  // 获取根节点字体大小
  const htmlFontSize = getComputedStyle(window.document.documentElement)['font-size'];
  const remRate = parseInt(htmlFontSize.substring(0, (htmlFontSize.length - 2)));
  import BScroll from 'better-scroll';
  export default {
    name: 'j-pull',
    props: {
      pullDownConfig: {
        type: Object,
        default: function () {
          return {
            height: 0.8, // 60px
            downTips: '下拉刷新',
            upTips: '释放刷新',
            refreshTips: '刷新中',
            refreshSuccess: '刷新成功',
            refreshError: '刷新失败'
          }
        }
      },
      pullUpConfig: {
        type: Object,
        default: function () {
          return {
            height: 0.8, // 60px
            upTips: '上拉加载更多',
            downTips: '释放加载',
            loadTips: '加载中',
            noDataText: '没有更多了'
          }
        }
      },
      refreshFunc: {
        type: Function
      },
      loadMore: {
        type: Function
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.initScroll();
      })
    },
    data () {
      return {
        scroll: undefined,
        pullDownClass: 'down',
        pullUpClass: 'up',
        pullDownText: '',
        pullUpText: '',
        pageIndex: 1,
        pageSize: 20,
        isRefreshSuccess: false,
        hasMore: true
      }
    },
    computed: {
      isScrollable: function () {
        if (!this.scroll || this.scroll.maxScrollY === 0) {
          return false;
        } else {
          return true;
        }
      }
    },
    methods: {
      initScroll: function () {
        // 下拉刷新
        this.pullDownText = this.pullDownConfig.downTips;
        // 上拉加载更多
        this.pullUpText = this.pullUpConfig.upTips;
        let _this_ = this;
        setTimeout(function () {
          if (!_this_.scroll) {
            _this_.scroll = new BScroll(_this_.$el, {
              startX: 0,
              startY: 0,
              probeType: 1,
              click: true
            });
          } else {
            _this_.$nextTick(function () {
              _this_.scroll.refresh();
            })
          }
          // 滑动中
          _this_.scroll.on('scroll', function (position) {
            let y = position.y / remRate;
            if (y > 0) {
              if (y > _this_.pullDownConfig.height) {
                // 释放刷新
                _this_.pullDownText = _this_.pullDownConfig.upTips;
                _this_.pullDownClass = 'up';
              } else {
                // 下拉刷新
                _this_.pullDownText = _this_.pullDownConfig.downTips;
                _this_.pullDownClass = 'down';
              }
            } else {
              if (_this_.hasMore && y < (_this_.scroll.maxScrollY / remRate) - _this_.pullUpConfig.height) {
                // 释放加载
                _this_.pullUpText = _this_.pullUpConfig.downTips;
                _this_.pullUpClass = 'down';
              } else {
                // 上拉加载更多
                _this_.pullUpText = _this_.pullUpConfig.upTips;
                _this_.pullUpClass = 'up';
              }
            }
          });
          /*
           * @ touchend:滑动结束的状态
           * @ maxScrollY:屏幕最大滚动高度
           */
          _this_.scroll.on('touchend', function (position) {
            let y = position.y / remRate;
            if (y > _this_.pullUpConfig.height) {
              // 刷新中
              _this_.pullDownText = _this_.pullDownConfig.refreshTips;
              _this_.pullDownClass = 'loading';
              _this_.scroll.scrollTo(0, 100);
              /*
               * 这里发送ajax刷新数据
               * 刷新后,后台只返回第1页的数据,无论用户是否已经上拉加载了更多
               */
              _this_.refreshFunc(1, _this_.pageSize, function (status) {
                // 恢复文本值
                _this_.pullDownText = _this_.pullDownConfig.downTips;
                _this_.pullUpText = _this_.pullUpConfig.upTips;
                _this_.hasMore = true;
                // 显示刷新成功tips
                if (status) { // 刷新成功
                  _this_.isRefreshSuccess = true;
                  _this_.pageIndex = 1;
                } else { // 刷新失败
                  _this_.isRefreshSuccess = false;
                }
                // 刷新列表后,重新计算滚动区域高度
                _this_.$nextTick(function () {
                  _this_.scroll.refresh();
                })
                _this_.scroll.scrollTo(0, 0);
                _this_.pullDownClass = 'down';
              });
            } else if (y < (_this_.scroll.maxScrollY / remRate) - _this_.pullUpConfig.height) {
              // 没有更多了
              if (!_this_.hasMore) {
                _this_.pullUpClass = '';
                _this_.pullUpText = _this_.pullUpConfig.noDataText;
              } else {
                // 加载中
                _this_.pullDownText = _this_.pullDownConfig.loadTips;
                _this_.pullUpClass = 'loading';
                // 更新页码
                _this_.pageIndex += 1;
                /*
                 * 这里发送ajax加载更多数据
                 */
                _this_.loadMore(_this_.pageIndex, _this_.pageSize, function (hasMore) {
                  // 恢复文本值
                  _this_.pullUpText = _this_.pullUpConfig.upTips;
                  _this_.pullUpClass = 'up';
                  _this_.hasMore = hasMore;
                  // 刷新列表后,重新计算滚动区域高度
                  _this_.$nextTick(function () {
                    _this_.scroll.refresh();
                  })
                });
              }
            }
          });
        }, 10)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  /* 列表容器 */
  .list-wrapper {
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* 下拉提示信息 */
    .top-tip{
      position: absolute;
      top: -0.533333rem;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 0.533333rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #333;
      font-size: 0;
      .refresh-text {
        font-size: 12px;
      }
      .pull-icon {
        display: inline-block;
        width: 0.426667rem;
        height: 0.426667rem;
        background-size: 100%;
        background-repeat: no-repeat;
        margin-right: 0.133333rem;
      }
      .up {
        background-image: url('../../../assets/img/@2x/pull-up-icon.png')
      }
      .down {
        background-image: url('../../../assets/img/@2x/pull-down-icon.png')
      }
      .loading {
        background-image: url('../../../assets/img/@2x/pull-loading.gif')
      }
    }
    /* 上拉提示信息 */
    .bottom-tip{
      position: absolute;
      bottom: -0.533333rem;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 0.533333rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #333;
      font-size: 0;
      .loading-text {
        font-size: 12px;
      }
      .pull-icon {
        display: inline-block;
        width: 0.426667rem;
        height: 0.426667rem;
        background-size: 100%;
        background-repeat: no-repeat;
        margin-right: 0.133333rem;
      }
      .up {
        background-image: url('../../../assets/img/@2x/pull-up-icon.png')
      }
      .down {
        background-image: url('../../../assets/img/@2x/pull-down-icon.png')
      }
    }
    /* 全局提示信息 */
    .alert{
      display: none;
      position: fixed;
      top: 0.733333rem;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 0.466667rem;
      line-height: 0.466667rem;
      text-align: center;
      color: #18adfb;
      font-size: 12px;
    }
    /* 刷新失败 */
    .error {
      color: red;
    }
  }
  [data-dpr="2"]
  .list-wrapper {
    .top-tip {
      .refresh-text {
        font-size: 24px;
      }
    }
    .bottom-tip {
      .loading-text {
        font-size: 24px;
      }
    }
    /* 全局提示信息 */
    .alert {
      display: none;
      position: fixed;
      top: 0.733333rem;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 0.466667rem;
      line-height: 0.466667rem;
      text-align: center;
      color: #18adfb;
      font-size: 12px;
    }
    /* 刷新失败 */
    .error {
      color: red;
    }
  }
  [data-dpr="3"]
  .list-wrapper {
    .alert {
      font-size: 42px;
    }
    .top-tip {
      .refresh-text {
        font-size: 42px;
      }
      .up {
        background-image: url('../../../assets/img/@3x/pull-up-icon@3x.png');
      }
      .down {
        background-image: url('../../../assets/img/@3x/pull-down-icon@3x.png');
      }
    }
    .bottom-tip {
      .loading-text {
        font-size: 42px;
      }
      .up {
        background-image: url('../../../assets/img/@3x/pull-up-icon@3x.png');
      }
      .down {
        background-image: url('../../../assets/img/@3x/pull-down-icon@3x.png');
      }
    }
  }
</style>
