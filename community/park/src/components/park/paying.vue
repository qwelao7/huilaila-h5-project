<template>
  <div class="pay-wrapper" ref="wrapper">
    <div class="top">
      <span class="icon"></span>
    </div>
    <div class="content">
      <span class="title">正在支付中</span>
      <span class="dotting">  </span>
    </div>
  </div>
</template>

<script>
  import router from '../../router';
  import Toast from 'components/utils/toast/toast';
  export default {
    name: 'payResult',
    created: function () {
      // 2s轮询
      this.queryPayOrderStatus();
    },
    data () {
      return {
      }
    },
    methods: {
      queryPayOrderStatus: function () {
        let _this_ = this;
        setTimeout(function () {
          _this_.getPayOrderStatus();
        }, 2000)
      },
      getPayOrderStatus: function () {
        let _this_ = this;
        _this_.$JHttp.get(window.homeURL + '/sharedPark/order/unpaid/check').then((res) => {
          if (res.data.status === 100) {
            let data = res.data.data;
            if (data) {
              // 支付成功
              Toast('支付成功');
              router.replace('/home/park');
              return;
            } else {
              _this_.queryPayOrderStatus();
            }
          } else {
            // 接口没有返回数据
            Toast(window.commonConfig.commonError);
            router.replace('/home/park');
            return;
          }
        });
      }
    }
  }
</script>

<style scoped lang="less">
  .pay-wrapper {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .top {
      margin-top: 2.4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        display: inline-block;
        width: 1.6rem;
        height: 1.6rem;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url("../../assets/img/@2x/paying.png");
      }
    }
    .content {
      margin-top: 1.146667rem;
      .title {
        color: #333;
        font-size: 30px;
        line-height: 30px;
        font-weight: 700;
        text-align: center;
      }
      .dotting {
        display: inline-block;
        min-width: 0.133333rem;
        min-height: 0.133333rem;
        border-radius: 50%;
        box-shadow: 0.133333rem 0 currentColor, 0.4rem 0 currentColor, 0.666667rem 0 currentColor;
        -webkit-animation: dot 2s infinite step-start both;
        animation: dot 2s infinite step-start both;
        &::before {
          content: '';
        }
      }
      @-webkit-keyframes dot {
        25% { box-shadow: none; }
        50% { box-shadow: 0.133333rem 0 currentColor; }
        75% { box-shadow: 0.133333rem 0 currentColor, 0.4rem 0 currentColor; }
      }
      @keyframes dot {
        25% { box-shadow: none; }
        50% { box-shadow: 0.133333rem 0 currentColor; }
        75% { box-shadow: 0.133333rem 0 currentColor, 0.4rem 0 currentColor; }
      }
    }
  }

  [data-dpr="2"]
  .pay-wrapper {
    .content {
      .title {
        font-size: 56px;
        line-height: 56px;
      }
      .link-wrapper {
        .seconds, .text {
          font-size: 30px;
        }
      }
    }
  }

  [data-dpr="3"]
  .pay-wrapper {
    .top {
      .icon {
        background-image: url("../../assets/img/@3x/paying@3x.png");
      }
    }
    .content {
      .title {
        font-size: 72px;
        line-height: 72px;
      }
      .link-wrapper {
        .seconds, .text {
          font-size: 54px;
        }
      }
    }
  }
</style>
