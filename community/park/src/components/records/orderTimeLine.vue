<template>
  <div class="order-timeline-wrapper">
    <placeholder v-if="!timeLine.length"></placeholder>
    <ul v-if="timeLine.length">
      <li class="time-item vux-1px-b" v-for="time in timeLine">
        <span class="time" v-text="time.time"></span>
        <span class="text" v-text="time.status"></span>
      </li>
    </ul>
  </div>
</template>

<script>
  import Toast from 'components/utils/toast/toast';
  import placeholder from 'components/home/empty';
  export default {
    name: 'orderTimeLine',
    created: function () {
      document.title = '订单状态';
      this.initTimeLine();
    },
    data () {
      return {
        timeLine: []
      }
    },
    computed: {
      orderId: function () {
        // 获取当前查看的订单
        return this.$store.state.pageCfg.currentOrderId;
      }
    },
    methods: {
      initTimeLine: function () {
        // eslint-disable-next-line no-unused-vars
        let orderId = this.orderId;
        // 调用获取订单时间轴接口
        this.$JHttp.get(window.homeURL + '/sharedPark/order/' + orderId + '/log').then((res) => {
          if (res.data.status === 100) {
            let records = res.data.data;
            if (records && records.length) {
              this.timeLine = records;
            }
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
      }
    },
    components: {
      'placeholder': placeholder
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.order-timeline-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .time-item {
    height: 1.173333rem;
    display: flex;
    align-items: center;
    text-align: left;
    margin: 0 0.4rem;
    font-size: 0;
    color: #333;
    .time, .text {
      font-size: 14px;
    }
    .time {
      margin-right: 0.213333rem;
    }
  }
}
  [data-dpr="2"]
  .order-timeline-wrapper {
    .time-item {
      .time, .text {
        font-size: 30px;
      }
    }
  }
[data-dpr="3"]
  .order-timeline-wrapper {
  .time-item {
    .time, .text {
      font-size: 54px;
    }
  }
}
</style>
