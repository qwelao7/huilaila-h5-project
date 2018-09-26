<template>
  <div class="pay-wrapper" ref="wrapper">
    <div class="top">
      <span class="icon"></span>
    </div>
    <div class="content">
      <div class="title">支付成功</div>
      <div class="link-wrapper">
        <span class="seconds" v-text="leftSeconds"></span>
        <span class="text">秒后将跳转至回来啦社区App</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'payResult',
    created: function () {
      this.countDown();
    },
    data () {
      return {
        leftSeconds: 4
      }
    },
    methods: {
      countDown: function () {
        let _this_ = this;
        _this_.leftSeconds--;
        if (_this_.leftSeconds === 0) {
          let token = localStorage.getItem('token');
          let communityId = localStorage.getItem('communityId');
          let roomId = localStorage.getItem('roomId');
          window.location.href = 'index.html#home/park?token=' + token + '&defCommunityId=' + communityId + '&defRoomId=' + roomId;
          return;
        }
        setTimeout(function () {
          _this_.countDown();
        }, 1000)
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
        background-image: url("./assets/img/@2x/pay-success.png");
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
      .link-wrapper {
        margin-top: 0.533333rem;
        font-size: 0;
        text-align: center;
        .seconds {
          font-size: 14px;
          color: #7bd1fd;
        }
        .text {
          font-size: 14px;
          color: #333;
        }
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
        background-image: url("./assets/img/@3x/pay-success@3x.png");
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
