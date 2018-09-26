<template>
  <div class="receive-wrapper">
    <div class="placeholder" v-if="!isLoading && !receiveList.length">
      <span class="icon"></span>
      <div class="text">暂无相关内容</div>
    </div>
    <j-pull v-if="receiveList.length" :refreshFunc="refreshFunc" :loadMore="loadMore">
      <ul class="receive-list-wrapper">
        <li class="receive-item vux-1px-b" v-for="receive in receiveList">
          <div class="left">
            <div class="top">收入</div>
            <div class="bottom" v-text="receive.date"></div>
          </div>
          <div class="right">
            <div class="top" v-text="receive.money"></div>
            <div class="bottom" v-text="receive.balance" v-if="false"></div>
          </div>
        </li>
      </ul>
    </j-pull>
  </div>
</template>

<script>
  import JPull from 'components/utils/pagination/jpull';
  import {querystring} from 'vux';
  import Toast from 'components/utils/toast/toast';
  export default {
    name: 'receive',
    created: function () {
      this.initReceiveList(1, 20);
    },
    data () {
      return {
        isLoading: true,
        receiveList: []
      }
    },
    methods: {
      initReceiveList: function (pageIndex, pageSize, cb) {
        this.isLoading = true;
        let postData = {
          curPage: 1,
          pageSize: 20
        };
        let postDataStr = querystring.stringify(postData);
        let _this_ = this;
        _this_.$JHttp.get(window.homeURL + '/sharedPark/funds/daily?' + postDataStr).then((res) => {
          if (res.data.status === 100) {
            let receiveList = res.data.data.resultList;
            let receives = [];
            if (receiveList && receiveList.length) {
              receiveList.forEach(function (receive) {
                receives.push({
                  money: '+' + receive.income,
                  date: receive.statisticsDate,
                  balance: '100.00'
                });
              });
            }
            _this_.receiveList = receives;
            let isRefreshSuccess = true;
            cb && cb(isRefreshSuccess);
          } else {
            // 接口没有返回数据
            console.error(res.data.msg);
            let isRefreshSuccess = false;
            cb && cb(isRefreshSuccess);
          }
          _this_.isLoading = false;
        }).catch(function () {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
          _this_.isLoading = false;
        });
      },
      refreshFunc: function (pageIndex, pageSize, cb) {
        this.initReceiveList(pageIndex, pageSize, cb);
      },
      loadMore: function (pageIndex, pageSize, cb) {
        let postData = {
          pageIndex: pageIndex,
          pageSize: pageSize
        };
        let postDataStr = querystring.stringify(postData);
        let _this_ = this;
        _this_.$JHttp.get(window.homeURL + '/sharedPark/funds/daily?' + postDataStr).then((res) => {
          if (res.data.status === 100) {
            let receiveList = res.data.data.resultList;
            let receives = [];
            if (receiveList && receiveList.length) {
              receiveList.forEach(function (receive) {
                receives.push({
                  money: '+' + receive.income,
                  date: receive.statisticsDate,
                  balance: '100.00'
                });
              });
            }
            _this_.receiveList = receives;
            let hasMore = res.data.data.pageResult.hasMore || false;
            this.$nextTick(() => {
              setTimeout(function () {
                cb && cb(hasMore);
              }, 10);
            });
          } else {
            // 接口没有返回数据
            console.error(res.data.msg);
            let hasMore = true;
            cb(hasMore);
          }
        }).catch(function () {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
      }
    },
    components: {
      'j-pull': JPull
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .receive-wrapper {
    width: 100%;
    height: 100%;
    background-color: #ebebeb;
    .placeholder {
      padding-top: 4.72rem;
      .icon {
        display: block;
        width: 2.666667rem;
        height: 2.666667rem;
        margin: 0 auto;
        background-size: 100%;
        background-repeat:no-repeat;
        background-image: url("../../assets/img/@2x/placeholder.png");
      }
      .text {
        margin-top: 0.4rem;
        color: #aaa;
        font-size: 12px;
      }
    }
    .receive-item {
      padding: 0 0.4rem;
      background-color: #fff;
      height: 1.44rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        text-align: left;
        .top {
          color: #333;
          font-size: 14px;
          line-height: 14px;
          margin-bottom: 0.133333rem;
        }
        .bottom {
          color: #aaa;
          font-size: 12px;
          line-height: 12px;
        }
      }
      .right {
        text-align: right;
        .top {
          color: #18adfb;
          font-size: 14px;
          line-height: 14px;
          /*margin-bottom: 0.186667rem;*/
        }
        .bottom {
          color: #aaa;
          font-size: 12px;
          line-height: 12px;
        }
      }
    }
  }

  [data-dpr="2"]
  .receive-wrapper {
    .placeholder {
      .text {
        font-size: 24px;
      }
    }
    .receive-item {
      .left {
        .top {
          font-size: 30px;
          line-height: 30px;
        }
        .bottom {
          font-size: 20px;
          line-height: 20px;
        }
      }
      .right {
        text-align: right;
        .top {
          font-size: 30px;
          line-height: 30px;
        }
        .bottom {
          font-size: 20px;
          line-height: 20px;
        }
      }
    }
  }

  [data-dpr="3"]
  .receive-wrapper {
    .placeholder {
      .icon {
        background-image: url("../../assets/img/@3x/placeholder@3x.png");
      }
      .text {
        font-size: 42px;
      }
    }
    .receive-item {
      .left {
        .top {
          font-size: 54px;
          line-height: 54px;
        }
        .bottom {
          font-size: 40px;
          line-height: 40px;
        }
      }
      .right {
        text-align: right;
        .top {
          font-size: 54px;
          line-height: 54px;
        }
        .bottom {
          font-size: 40px;
          line-height: 40px;
        }
      }
    }
  }
</style>
