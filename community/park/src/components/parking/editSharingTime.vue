<template>
  <div class="sharingTime-wrapper">
    <div class="top vux-1px-b">
      <span class="left">开始时间</span>
      <span class="right">结束时间</span>
    </div>
    <div class="time-wrapper">
      <j-picker v-if="jPickerOpt.data" :options="jPickerOpt" v-on:getCurrentIndex="getSelectedTime"></j-picker>
    </div>
    <div class="repeat" @click="chooseRepeat">
      <div class="left">重复:</div>
      <div class="right">
        <span class="value" v-text="sharing.sharingRepeatStr"></span>
        <span class="icon"></span>
      </div>
    </div>
    <div class="remark" v-text="sharing.remark"></div>
    <div class="save-wrapper" @click="saveSharingTime">
      <j-button jText='保存' type="primary"></j-button>
    </div>
  </div>
</template>

<script>
  import router from '../../router';
  import JButton from 'components/utils/jbutton';
  import {jlDate} from '../../common/utils';
  import JPicker from 'components/utils/picker/jpicker';
  import {querystring} from 'vux';
  import Toast from 'components/utils/toast/toast';
  export default {
    name: 'editSharingTime',
    created: function () {
      document.title = '请选择';
      this.initSharing();
    },
    data () {
      return {
        sharing: {},
        times: [],
        jPickerOpt: {}
      }
    },
    computed: {
      aheadIn: function () {
        return this.$store.state.pageCfg.aheadIn;
      },
      currentShareId: function () {
        return this.$store.state.pageCfg.currentShareId;
      },
      sharingRepeat: function () {
        return this.$store.state.pageCfg.sharingRepeat;
      },
      sharingTime: function () {
        return this.$store.state.pageCfg.sharingTime;
      },
      sharingTimeIndexs: function () {
        return this.$store.state.pageCfg.sharingTimeIndexs;
      }
    },
    components: {
      'j-button': JButton,
      'j-picker': JPicker
    },
    methods: {
      initSharing: function () {
        // eslint-disable-next-line no-unused-vars
        let currentShareId = this.currentShareId;
        let _this_ = this;
        // 调用接口,获取车位的共享时段信息
        this.$JHttp.get(window.homeURL + '/sharedPark/parkingSpace/' + currentShareId + '/schedule').then((res) => {
          if (res.data.status === 100) {
            let data = res.data.data;
            this.sharing = {
              sharingStartTime: data.beginTime,
              sharingEndTime: data.endTime,
              sharingRepeat: data.weekday + ''
            };
            // 表明共享时段已经初始化
            if (_this_.sharingTime) {
              let sharingStartTime = _this_.sharingTime.sharingStartTime;
              let sharingEndTime = _this_.sharingTime.sharingEndTime;
              _this_.$set(_this_.sharing, 'sharingStartTime', sharingStartTime);
              _this_.$set(_this_.sharing, 'sharingEndTime', sharingEndTime);
            }
            // 表明是从重复页面保存后跳转回来的
            if (_this_.sharingRepeat) {
              _this_.$set(_this_.sharing, 'sharingRepeat', _this_.sharingRepeat);
            }
            let sharingRepeatStr = jlDate.getSharingRepeatStr(_this_.sharing.sharingRepeat);
            this.$set(_this_.sharing, 'sharingRepeatStr', sharingRepeatStr);
            let remark = '注: 预约车辆可提前' + _this_.aheadIn + '入场,请您预留好时间,提前挪车。';
            _this_.$set(_this_.sharing, 'remark', remark);
            _this_.initJPickerOpt();
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
      },
      initJPickerOpt: function () {
        let beginTime = [];
        let endTime = [];
        let beginIndex = 32; // 08:00
        let endIndex = 36; // 18:00
        let count = -1;
        let beginTimeObj;
        let endTimeObj;
        for (let i = 0; i <= 23; i++) {
          for (let j = 0; j <= 45; j += 15) {
            count++;
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
            beginTimeObj = {
              text: hour + ':' + minute,
              value: hour + ':' + minute
            };
            if (beginTimeObj.value === this.sharing.sharingStartTime) {
              beginIndex = count;
            }
            beginTime.push(beginTimeObj);
          }
        }
        let sharingStartTime = this.sharing.sharingStartTime || '08:00';
        let sharingStartTimes = sharingStartTime.split(':');
        let sharingStartIndex = parseInt(sharingStartTimes[0]);
        let sharingEndIndex = parseInt(sharingStartTimes[1]);
        count = -1;
        for (let i = sharingStartIndex + 1; i <= sharingStartIndex + 24; i++) {
          if (i >= 24 && (i % 24) === sharingStartIndex) { // 次日结束时间的小时部分 = 开始时间的小时部分(理论上只会循环一次),需对分钟作限制
            for (let j = 0; j <= sharingEndIndex; j += 15) {
              count++;
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
                endTime.push(endTimeObj);
                if (endTimeObj.value === this.sharing.sharingEndTime) {
                  endIndex = count;
                }
              } else {
                endTimeObj = {
                  text: hour + ':' + minute,
                  value: hour + ':' + minute
                }
                if (endTimeObj.value === this.sharing.sharingEndTime) {
                  endIndex = count;
                }
                endTime.push(endTimeObj);
              }
            }
          } else {
            if (i === sharingStartIndex + 1) { // 结束时间小时部分 = 开始时间+1的小时部分,需要限定分钟
              for (let j = sharingEndIndex; j <= 45; j += 15) {
                count++;
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
                  endTime.push(endTimeObj);
                  if (endTimeObj.value === this.sharing.sharingEndTime) {
                    endIndex = count;
                  }
                } else {
                  endTimeObj = {
                    text: hour + ':' + minute,
                    value: hour + ':' + minute
                  }
                  if (endTimeObj.value === this.sharing.sharingEndTime) {
                    endIndex = count;
                  }
                  endTime.push(endTimeObj);
                }
              }
            } else {
              for (let j = 0; j <= 45; j += 15) {
                count++;
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
                  endTime.push(endTimeObj);
                  if (endTimeObj.value === this.sharing.sharingEndTime) {
                    endIndex = count;
                  }
                } else {
                  endTimeObj = {
                    text: hour + ':' + minute,
                    value: hour + ':' + minute
                  }
                  if (endTimeObj.value === this.sharing.sharingEndTime) {
                    endIndex = count;
                  }
                  endTime.push(endTimeObj);
                }
              }
            }
          }
        }
        let data = [beginTime, endTime];
        this.$set(this.jPickerOpt, 'data', data);
        // 首次设置时，默认开始时间为08:00，默认结束时间为18:00
        let selectedIndex = [beginIndex, endIndex];
        // 代表已经选择过时间序列,并且进入了选择重复时间,返回过来的
        if (this.sharingTimeIndexs && this.sharingTimeIndexs.length) {
          selectedIndex = this.sharingTimeIndexs;
        }
        this.$set(this.jPickerOpt, 'selectedIndex', selectedIndex);
        let beginTimeText = data[0][selectedIndex[0]].value;
        this.$set(this.sharing, 'sharingStartTime', beginTimeText);
        let endTimeText = data[1][selectedIndex[1]].value;
        this.$set(this.sharing, 'sharingEndTime', endTimeText);
        this.$store.commit('updateSharingTimeIndexs', {
          sharingTimeIndexs: selectedIndex
        });
        let sharingTime = {
          sharingStartTime: beginTimeText,
          sharingEndTime: endTimeText
        }
        this.$store.commit('updateSharingTime', {
          sharingTime: sharingTime
        });
      },
      // 获取选择的时间
      getSelectedTime: function (selectedIndex) {
        let data = this.jPickerOpt.data;
        let beginTimeText = data[0][selectedIndex[0]].value;
        this.$set(this.sharing, 'sharingStartTime', beginTimeText);
        let endTimeText = data[1][selectedIndex[1]].value;
        this.$set(this.sharing, 'sharingEndTime', endTimeText);
        this.$store.commit('updateSharingTimeIndexs', {
          sharingTimeIndexs: selectedIndex
        });
        let sharingTime = {
          sharingStartTime: beginTimeText,
          sharingEndTime: endTimeText
        }
        this.$store.commit('updateSharingTime', {
          sharingTime: sharingTime
        });
      },
      // 跳转到选择共享时间重复页面
      chooseRepeat: function () {
        router.push({
          name: 'repeat',
          params: {
            repeats: this.sharing.sharingRepeat
          }
        });
      },
      checkSharingTime: function () {
        let beginTime = this.sharing.sharingStartTime;
        let entTime = this.sharing.sharingEndTime;
        if (!beginTime || !entTime) {
          Toast('请选择共享时段');
          return false;
        }
        return true;
      },
      checkSharingRepeat: function () {
        let sharingRepeat = this.sharing.sharingRepeat;
        if (!sharingRepeat || sharingRepeat === '0000000') {
          Toast('请选择重复周期');
          return false;
        }
        return true;
      },
      // 保存车位的共享时段信息
      saveSharingTime: function () {
        if (!this.checkSharingTime() || !this.checkSharingRepeat()) {
          return false;
        }
        let currentShareId = this.currentShareId;
        let postData = {
          id: currentShareId,
          weekday: this.sharing.sharingRepeat,
          beginTime: this.sharing.sharingStartTime,
          endTime: this.sharing.sharingEndTime
        };
        let postDataStr = querystring.stringify(postData);
        this.$JHttp.put(window.homeURL + '/sharedPark/parkingSpace/' + currentShareId, postDataStr, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          if (res.data.status === 100) {
            // 成功,跳转到车位详情
            router.go(-1);
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
      }
    }
  }
</script>

<style scoped lang="less">
  .sharingTime-wrapper {
    width: 100%;
    height: 100%;
    padding-top: 0.213333rem;
    background-color: #ebebeb;
    .top {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      -webkit-align-items: center;
      justify-content: space-around;
      -webkit-justify-content: space-around;
      height: 2.4rem;
      color: #333;
      background-color: #fff;
      font-size: 14px;
    }
    .time-wrapper {
      width: 100%;
      height: 4.533333rem;
      background-color: #fff;
    }
    .repeat {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      justify-content: space-between;
      height: 1.173333rem;
      padding: 0 0.4rem;
      background-color: #fff;
      font-size: 0;
      .left {
        text-align: left;
        font-size: 14px;
        color: #333;
      }
      .right {
        display: flex;
        align-items: center;
        .value {
          font-size: 14px;
          color: #333;
          margin-right: 0.266667rem;
        }
        .icon {
          display: inline-block;
          width: 0.213333rem;
          height: 0.426667rem;
          background-size: 100%;
          background-repeat: no-repeat;
          background-image: url('../../assets/img/@2x/gray-icon-right.png');
        }
      }
    }
    .remark {
      padding: 0.4rem;
      font-size: 12px;
      line-height: 12px;
      color: #aaa;
      text-align: left;
    }
    .save-wrapper {
      padding: 0 0.4rem;
      height: 1.12rem;
    }
  }

  [data-dpr="2"]
  .sharingTime-wrapper {
    .top {
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 30px;
    }
    .repeat {
      .left {
        font-size: 30px;
      }
      .right {
        .value {
          font-size: 30px;
        }
      }
    }
    .remark {
      font-size: 24px;
      line-height: 24px;
    }
  }

  [data-dpr="3"]
  .sharingTime-wrapper {
    .top {
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 54px;
    }
    .repeat {
      .left {
        font-size: 54px;
      }
      .right {
        .value {
          font-size: 54px;
        }
        .icon {
          background-image: url('../../assets/img/@3x/gray-icon-right@3x.png');
        }
      }
    }
    .remark {
      font-size: 42px;
      line-height: 42px;
    }
  }
</style>
