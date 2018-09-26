<template>
  <div class="jl-picker">
    <div class="jl-picker-panel">
      <div class="jl-picker-choose vux-1px-b">
        <span class="cancel" v-text="cancelText">取消</span>
        <span class="confirm" v-text="finishText">完成</span>
        <h1 class="jl-picker-title" v-text="infoText">选择时间</h1>
      </div>
      <div class="jl-picker-content">
        <div class="mask-top vux-1px-b"></div>
        <div class="mask-bottom vux-1px-t"></div>
        <div class="wheel-wrapper">
          <div class="wheel" id="dayWheel">
            <ul class="wheel-scroll">
              <li class="wheel-item" v-for="day in availableDays">
                {{day.name}}
              </li>
            </ul>
          </div>
          <div class="wheel">
            <ul class="wheel-scroll">
              <li class="wheel-item" v-for="hour in availableHours">
                {{hour.name}}
              </li>
            </ul>
          </div>
          <div class="wheel">
            <ul class="wheel-scroll">
              <li class="wheel-item" v-for="minute in availableMinutes">
                {{minute.name}}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="jl-picker-footer" v-text="footerText"></div>
    </div>
  </div>
</template>

<script>
  import {PopupPicker} from 'vux';
  import BScroll from 'better-scroll';
  export default {
    name: 'JLPicker',
    props: {
      cancelText: {
        type: String,
        default: ''
      },
      finishText: {
        type: String,
        default: ''
      },
      infoText: {
        type: String,
        default: ''
      },
      footerText: {
        type: String,
        default: ''
      },
      data: {
        type: Array,
        default: []
      }
    },
    created: function () {
      var _this_ = this;
      this.$nextTick(() => {
        setTimeout(function () {
          _this_.initScroll('dayWheel');
          alert(_this_.bScroll);
        }, 100)
      });
      this.isShow = this.showInTimePicker;
      // TODO ajax获取可用的hour数组
    },
    data () {
      return {
        isShow: false,
        bScroll: undefined,
        availableDays: [{
          name: '今天',
          value: 'today',
          parent: 0
        }, {
          name: '明天',
          value: 'tomorrow',
          parent: 0
        }, {
          name: '后天',
          value: 'theDayAfterTomorrow',
          parent: 0
        }, {
          name: '今天',
          value: 'today',
          parent: 0
        }, {
          name: '明天',
          value: 'tomorrow',
          parent: 0
        }, {
          name: '后天',
          value: 'theDayAfterTomorrow',
          parent: 0
        }],
        availableHours: [],
        availableMinutes: []
      }
    },
    computed: {
      timeDatas: function () {
        let Datas = new Array(5);
        Datas.push(this.availableDays);
        return Datas;
      }
    },
    methods: {
      initScroll: function (id) {
        if (!this.bScroll) {
          let ele = document.getElementById(id);
          this.bScroll = new BScroll(ele, {
            startX: 0,
            startY: 0
          });
        } else {
          this.bScroll.refresh();
        }
      }
    },
    components: {
      PopupPicker
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .jl-picker {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: center;
    font-size: 14px;
    background-color: rgba(37, 38, 45, .4);
    .jl-picker-panel {
      position: absolute;
      z-index: 600;
      bottom: 0;
      width: 100%;
      height: 6.54rem;
      background: #fff;
      .jl-picker-choose {
        position: relative;
        height: 0.9375rem;
        color: #999;
        .cancel, .confirm {
          position: absolute;
          padding: 0.213333rem;
          font-size: 14px;
        }
        .cancel {
          left: 0;
        }
        .confirm {
          right: 0;
          color: #fc9153;
        }
        .jl-picker-title {
          margin: 0;
          line-height: 0.9375rem;
          font-weight: 400;
          text-align: center;
          font-size: 18px;
          color: #333;
        }
      }
      .jl-picker-footer {
        margin-top: 0.933333rem;
        height: 0.773333rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
      }
      .jl-picker-content {
        position: relative;
        top: 0.533333rem;
        .mask-top, .mask-bottom {
          z-index: 10;
          width: 100%;
          height: 1.263333rem;
          pointer-events: none;
          transform: translateZ(0);
        }
        .mask-top {
          position: absolute;
          top: 0;
          background: linear-gradient(0deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
        }
        .mask-bottom {
          position: absolute;
          bottom: 1px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
        }
        .wheel-wrapper {
          display: flex;
          padding: 0 0.25rem;
          .wheel {
            flex: 1;
            width: 1%;
            height: 3.602212rem;
            overflow: hidden;
            font-size: 20px;
            .wheel-scroll {
              padding: 0;
              margin-top: 1.34rem;
              line-height: 0.96rem;
              list-style: none;
              .wheel-item {
                list-style: none;
                height: 0.96rem;
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
  .jl-picker {
    font-size: 24px;
    .jl-picker-panel {
      .jl-picker-choose {
        .cancel, .confirm {
          font-size: 26px;
        }
        .jl-picker-title {
          font-size: 30px;
        }
      }
      .jl-picker-content {
        .wheel-wrapper {
          .wheel {
            font-size: 30px;
          }
        }
      }
      .jl-picker-footer {
        font-size: 24px;
      }
    }
  }

  [data-dpr="3"]
  .jl-picker {
    font-size: 36px;
    .jl-picker-panel {
      .jl-picker-choose {
        .cancel, .confirm {
          font-size: 38px;
        }
        .jl-picker-title {
          font-size: 44px;
        }
      }
      .jl-picker-content {
        .wheel-wrapper {
          .wheel {
            font-size: 44px;
          }
        }
      }
      .jl-picker-footer {
        font-size: 38px;
      }
    }
  }


</style>
