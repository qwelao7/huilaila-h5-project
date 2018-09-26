<template>
  <div class="waiting2pay-wrapper">
    <div class="title">
      <span class="left">您还有</span>
      <span class="middle" v-text="dialog.count || '0'"></span>
      <span class="right">个待支付的订单，请尽快支付。</span>
    </div>
    <div class="total-money" v-text="'¥' + (dialog.totalMoney || '0.00')"></div>
    <div class="list-wrapper">
      <ul class="waitingToPayList">
        <li class="order-item" @click="showOrderDetail(order.id)" v-for="order in dialog.waitingToPayList">
          <span class="left" v-text="order.title"></span>
          <span class="right" v-text="'¥ ' + (order.money || '0.00')"></span>
        </li>
      </ul>
    </div>
    <div class="save-btn" @click="showPayPop">
      <j-button type="primary" :jText="saveBtnText"></j-button>
    </div>

    <!--支付弹出层begin-->
    <div>
      <popup v-model="payPopShow">
        <pay :order-list="dialog.waitingToPayList" :totalMoney = 'dialog.totalMoney'
        v-on:refreshPage="initPark"></pay>
      </popup>
    </div>
    <!--支付弹出层end-->
  </div>
</template>

<script>
  import router from '../../router';
  import Popup from '../utils/popup/index';
  import JButton from 'components/utils/jbutton';
  import Pay from './pay'
  export default {
    name: 'waitingToPay',
    data () {
      return {
        payPopShow: false,
        dialog: {}
      }
    },
    created: function () {
      this.dialog = this.$store.state.pageCfg.orderDialog;
      // 支付数据非法(ps: 选择支付宝支付,未支付,再回到回来啦社区,点击返回)
      if (!this.dialog.waitingToPayList || !this.dialog.waitingToPayList.length) {
        router.replace('/home/park');
        return;
      }
    },
    computed: {
      saveBtnText: function () {
        if (this.dialog.waitingToPayList && this.dialog.waitingToPayList.length === 1) {
          return '去支付';
        } else {
          return '合并支付';
        }
      }
    },
    methods: {
      initPark: function () {
        this.payPopShow = false;
        router.replace('/home/park');
      },
      showOrderDetail: function (orderId) {
        // 更新当前查看的订单ID
        this.$store.commit('updateCurrentOrderId', {
          currentOrderId: orderId
        });
        // 跳转到订单详情页
        router.push('/records/recordDetail');
      },
      showPayPop: function () {
        this.payPopShow = true;
      }
    },
    components: {
      Popup,
      'j-button': JButton,
      'pay': Pay
    }
  }
</script>

<style scoped lang="less">
  .waiting2pay-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #fff;
    color: #333;
    .title {
      margin-top: 1.093333rem;
      font-size: 14px;
      line-height: 14px;
      .middle {
        color: #18adfb;
      }
    }
    .total-money {
      margin: 3.413333rem 0;
      font-size: 52px;
      line-height: 52px;
    }
    .list-wrapper {
      .order-item {
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 0;
        color: #18adfb;
        .left {
          padding-right: 0.8rem;
        }
        .left, .right {
          font-size: 12px;
          border-bottom: 1px solid #18adfb;
        }
      }
    }
    .save-btn {
      position: fixed;
      bottom: 0.4rem;
      padding: 0 0.4rem;
      height: 1.12rem;
      width: 9.2rem;
    }
  }
  [data-dpr="2"]
  .waiting2pay-wrapper {
    .title {
      font-size: 30px;
      line-height: 30px;
    }
    .total-money {
      font-size: 96px;
      line-height: 96px;
    }
    .list-wrapper {
      .order-item {
        .left, .right {
          font-size: 24px;
        }
      }
    }
  }
  [data-dpr="3"]
  .waiting2pay-wrapper {
    .title {
      font-size: 54px;
      line-height: 54px;
    }
    .total-money {
      font-size: 158px;
      line-height: 158px;
    }
    .list-wrapper {
      .order-item {
        .left, .right {
          font-size: 42px;
        }
      }
    }
  }
</style>
