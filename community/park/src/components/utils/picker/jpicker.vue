<template>
  <div class="picker-wrapper" v-on:touchmove="preventDefault">
    <div class="picker-panel" ref="panelEl">
      <div class="picker-content">
        <div class="mask-top vux-1px-b"></div>
        <div class="mask-bottom vux-1px-t"></div>
        <div class="wheel-wrapper wheel-wrapper-hook">
          <div class="wheel" ref="wheelEl" v-for="columnData in this.defaultOptions.data">
            <ul class="wheel-scroll" ref="scrollEl">
              <li class="wheel-item" v-for="item in columnData" v-text="item.text" :value="item.value"></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import {extend} from '../../../common/utils';
  export default {
    name: 'picker',
    props: {
      options: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    mounted: function () {
      this.scrollEl = this.$refs.scrollEl;
      this.wheelEl = this.$refs.wheelEl;
      this.panelEl = this.$refs.panelEl;
    },
    created: function () {
      this.init();
    },
    data () {
      return {
        defaultOptions: {
          selectedIndex: null,
          data: []
        },
        wheelEl: undefined,
        scrollEl: undefined,
        panelEl: undefined,
        _events: {},
        currentIndex: []
      }
    },
    methods: {
      init: function () {
        extend(this.defaultOptions, this.options);
        this.initSelected();
        this.$nextTick(function () {
          this.show();
        });
      },
      initSelected () {
        this.selectedIndex = [];
        if (this.defaultOptions.selectedIndex) {
          this.selectedIndex = this.defaultOptions.selectedIndex;
        } else {
          for (let i = 0; i < this.data.length; i++) {
            this.selectedIndex[i] = 0;
          }
        }
        this.currentIndex = this.selectedIndex;
      },
      preventDefault: function (e) {
        e.preventDefault();
      },
      _createWheel (wheelEl, i) {
        this.wheels[i] = new BScroll(wheelEl[i], {
          wheel: true,
          selectedIndex: this.selectedIndex[i]
        });
        let _this_ = this;
        ((index) => {
          this.wheels[index].on('scrollEnd', () => {
            let currentIndex = this.wheels[index].getSelectedIndex();
            if (this.selectedIndex[i] !== currentIndex) {
              if (i === 0) { // 改变第一列, 联动第二列
                let sharingBeginTime = _this_.defaultOptions.data[0][currentIndex];
                let secondColumnDatas = _this_.getSecondColumnData(sharingBeginTime.value);
                _this_.$set(_this_.defaultOptions.data, 1, secondColumnDatas);
                _this_.scrollColumn(1, 0);
                _this_.currentIndex[1] = 0;
              }
              this.selectedIndex[i] = currentIndex;
              _this_.currentIndex[i] = currentIndex;
              this.trigger('picker.change', index, currentIndex);
              _this_.$emit('getCurrentIndex', _this_.currentIndex);
            }
          });
        })(i);
        return this.wheels[i];
      },
      // 动态获取第二列数据
      getSecondColumnData: function (sharingStartTime) {
        let secondColumnDatas = [];
        let sharingStartTimes = sharingStartTime.split(':');
        let sharingStartIndex = parseInt(sharingStartTimes[0]);
        let sharingEndIndex = parseInt(sharingStartTimes[1]);
        let endTimeObj;
        for (let i = sharingStartIndex + 1; i <= sharingStartIndex + 24; i++) {
          if (i >= 24 && (i % 24) === sharingStartIndex) { // 结束时间的小时部分 = 开始时间的小时部分(理论上只会出现一次),需对分钟作限制
            for (let j = 0; j <= sharingEndIndex; j += 15) {
              let hour = '';
              let minute = '';
              if (i < 10) {
                hour = '0' + i;
              } else {
                hour = i;
              }
              if (j < 10) {
                minute = '0' + j;
              } else {
                minute = j;
              }
              if (i >= 24) {
                let nextI = i % 24;
                if (nextI < 10) {
                  nextI = '0' + nextI
                }
                endTimeObj = {
                  text: nextI + ':' + minute + '次日',
                  value: nextI + ':' + minute
                }
                secondColumnDatas.push(endTimeObj);
              } else {
                endTimeObj = {
                  text: hour + ':' + minute,
                  value: hour + ':' + minute
                }
                secondColumnDatas.push(endTimeObj);
              }
            }
          } else {
            if (i === sharingStartIndex + 1) { // 结束时间小时部分 = 开始时间+1的小时部分,需要限定分钟
              for (let j = sharingEndIndex; j <= 45; j += 15) {
                let hour = '';
                let minute = '';
                if (i < 10) {
                  hour = '0' + i;
                } else {
                  hour = i;
                }
                if (j < 10) {
                  minute = '0' + j;
                } else {
                  minute = j;
                }
                if (i >= 24) {
                  let nextI = i % 24;
                  if (nextI < 10) {
                    nextI = '0' + nextI
                  }
                  endTimeObj = {
                    text: nextI + ':' + minute + '次日',
                    value: nextI + ':' + minute
                  }
                  secondColumnDatas.push(endTimeObj);
                } else {
                  endTimeObj = {
                    text: hour + ':' + minute,
                    value: hour + ':' + minute
                  }
                  secondColumnDatas.push(endTimeObj);
                }
              }
            } else {
              for (let j = 0; j <= 45; j += 15) {
                let hour = '';
                let minute = '';
                if (i < 10) {
                  hour = '0' + i;
                } else {
                  hour = i;
                }
                if (j < 10) {
                  minute = '0' + j;
                } else {
                  minute = j;
                }
                if (i >= 24) {
                  let nextI = i % 24;
                  if (nextI < 10) {
                    nextI = '0' + nextI
                  }
                  endTimeObj = {
                    text: nextI + ':' + minute + '次日',
                    value: nextI + ':' + minute
                  }
                  secondColumnDatas.push(endTimeObj);
                } else {
                  endTimeObj = {
                    text: hour + ':' + minute,
                    value: hour + ':' + minute
                  }
                  secondColumnDatas.push(endTimeObj);
                }
              }
            }
          }
        }
        return secondColumnDatas;
      },
      show () {
        window.setTimeout(() => {
          if (!this.wheels) {
            this.wheels = [];
            for (let i = 0; i < this.defaultOptions.data.length; i++) {
              this._createWheel(this.wheelEl, i);
            }
          } else {
            for (let i = 0; i < this.defaultOptions.data.length; i++) {
              this.wheels[i].enable();
              this.wheels[i].wheelTo(this.selectedIndex[i]);
            }
          }
        }, 0);
      },
      // 填充某列数据
      refillColumn (index, data) {
        let scrollEl = this.scrollEl[index];
        let wheel = this.wheels[index];
        if (scrollEl && wheel) {
          let oldData = this.defaultOptions.data[index];
          this.defaultOptions.data[index] = data;
          this.datas[index] = data;
          let selectedIndex = wheel.getSelectedIndex();
          let dist = 0;
          if (oldData.length) {
            let oldValue = oldData[selectedIndex].value;
            for (let i = 0; i < data.length; i++) {
              if (data[i].value === oldValue) {
                dist = i;
                break;
              }
            }
          }
          this.selectedIndex[index] = dist;
          wheel.refresh();
          wheel.wheelTo(dist);
          return dist;
        }
      },
      // 重新填充数据
      refill (datas) {
        let ret = [];
        if (!datas.length) {
          return ret;
        }
        datas.forEach((data, index) => {
          ret[index] = this.refillColumn(index, data);
        });
        return ret;
      },
      // 滑动某列到指定位置
      scrollColumn (index, dist) {
        let wheel = this.wheels[index];
        wheel.wheelTo(dist);
      },
      trigger (type) {
        let events = this._events[type];
        if (!events) {
          return;
        }
        let len = events.length;
        let eventsCopy = [...events];
        for (let i = 0; i < len; i++) {
          let event = eventsCopy[i];
          let [fn, context] = event;
          if (fn) {
            fn.apply(context, [].slice.call(arguments, 1));
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .picker-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    user-select: none;
    .picker-panel {
      width: 100%;
      height: 4.533333rem;
      .picker-content {
        position: relative;
        .mask-top, .mask-bottom {
          position: absolute;
          width: 100%;
          height: 1.813333rem;
          z-index: 10;
          pointer-events: none;
        }
        .mask-top {
          top: 0;
          background: -webkit-gradient(linear,left bottom,left top,from(hsla(0,0%,100%,.4)),to(hsla(0,0%,100%,.8)));
        }
        .mask-bottom {
          bottom: 0;
          background: -webkit-gradient(linear,left top,left bottom,from(hsla(0,0%,100%,.4)),to(hsla(0,0%,100%,.8)));
        }
        .wheel-wrapper {
          display: flex;
          justify-content: space-around;
          padding: 0 0.266667rem;
          .wheel {
            display: flex;
            height: 4.533333rem;
            overflow: hidden;
            font-size: 24px;
            .wheel-scroll {
              margin-top: 1.766666rem;
              line-height: 1rem;
              .wheel-item {
                height: 1rem;
                overflow: hidden;
                white-space: nowrap;
                color: #333;
              }
            }
          }
        }
      }
    }
  }
  [data-dpr="2"]
  .picker-wrapper {
    font-size: 30px;
    .picker-panel {
      .picker-content {
        .wheel-wrapper {
          .wheel {
            font-size: 46px;
          }
        }
      }
    }
  }
  [data-dpr="3"]
  .picker-wrapper {
    font-size: 54px;
    .picker-panel {
      .picker-content {
        .wheel-wrapper {
          .wheel {
            font-size: 84px;
          }
        }
      }
    }
  }


</style>
