<template>
  <div class="commonHeader orderDetails">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="积分订单">
    </x-header>
    <div class="order_state">
      <div class="order_three_state">
        <p class="order_states" style="padding-top: .14rem;">
          <span class="state_name">订单状态:</span>
          <span class="state_state">{{state}}</span>
        </p>
        <p class="order_states">
          <span class="state_name">订单编号:</span>
          <span class="order_num">{{orderInfo.orderCode}}</span>
        </p>
        <p class="order_states">
          <span class="state_name">下单时间:</span>
          <span class="order_num">{{orderInfo.submitDateTime}}</span>
        </p>
      </div>
    </div>
    <div class="goods_information">
      <div class="goods_content">
        <i class="goods_address_ico"></i>
        <div class="goods_right">
          <div class="goods_usename">
            <p class="goods_name">
              <span class="name_a">收货人：</span>
              <span class="name">{{orderInfo.contactName}}</span>
            </p>
            <p class="goods_phone">{{orderInfo.contactPhoneNumber}}</p>
          </div>
          <div class="goods_address">
            <span class="address_a">收货地址：{{orderInfo.contactAddress}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="consignee_a"></div>
    <div class="integral_dh">
      <div class="integral_information">
        <div class="describe_tit">积分兑换</div>
        <div class="details-box">
          <div class="details_img">
            <img :src="orderInfo.picurl" width="100%" alt="">
            <div class="integral_name">
              <div class="name_b">{{orderInfo.name}}</div>
            </div>
          </div>
          <div class="integral_num">
            <p class="integral_number">{{orderInfo.requiredScore}}  积分</p>
            <p class="integral_number" style="text-align: right">×{{orderInfo.bookedNumber}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="consumption_integral">消费积分： {{orderInfo.requiredTotalScore}}积分</div>
  </div>
</template>
<script>
  import { XHeader } from 'vux'
  export default {
    name: 'orderDetails',
    components: {
      XHeader
    },
    data () {
      return {
        orderInfo: {},
        state: ''
      }
    },
    created () {
      this.getOrderInfo();
    },
    methods: {
      getOrderInfo () {
        let _this = this;
        _this.$JHttp({
          method: 'get',
          headers: {
            'defCommunityId': localStorage.getItem('communityId')
          },
          url: window.baseURL + '/integral/orderDetail/' + this.$route.params.id
        }).then(res => {
          console.log(res, 11111111);
          _this.orderInfo = res.data;
          if (_this.orderInfo.orderStatus === 1) {
            _this.state = '待接收'
          } else if (_this.orderInfo.orderStatus === 2) {
            _this.state = '已接收'
          } else if (_this.orderInfo.orderStatus === 3) {
            _this.state = '已处理'
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .orderDetails{
    background: #F2F2F2;
    width:100%;
    height:100%;
    .order_state{
      padding: 15px;
      margin-top: 10px;
      background: #ffffff;
      .order_three_state{
        .order_states{
          margin-top: 10px;
          display: flex;
          align-items: center;
          .state_name{
            display: inline-block;
            color: #333333;
            font-size: 15px;
            font-weight: bold;
          }
          .state_state{
            width: 70px;
            height: 22px;
            line-height: 22px;
            background: #AAAAAA;
            color: #ffffff;
            font-size: 12px;
            text-align: center;
            border-radius: 50px;
            display: inline-block;
            margin-left: 10px;
          }
          .order_num{
            font-size: 15px;
            color: #333333;
            font-weight: bold;
            margin-left: 10px;
            display: inline-block;
          }
        }
        .order_states:first-child{
          margin: 0;
        }
      }
    }
    .goods_information{
      padding: 15px;
      background: #ffffff;
      margin-top: .2rem;
      .goods_content{
        display: flex;
        align-items: center;
        .goods_address_ico{
          display: block;
          width: 16px;
          height: 16px;
          background: url("../../../assets/images/address_icon_32black.png") center;
          background-size: cover;
        }
        .goods_right{
          margin-left: 15px;
          .goods_usename{
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 15px;
            color: #333333;
            font-weight: bold;
          }
          .goods_address{
            margin-top: 10px;
            color: #333333;
            font-size: 15px;
            font-weight: bold;
            span{
              word-break: break-all;
            }
          }
        }
      }
    }
    .consignee_a {
      width: 100%;
      height: 5px;
      background: url("../../../assets/images/addressline_icon.png") repeat-x;
      background-size: contain;
    }
    .integral_dh{
      margin-top: .2rem;
      background: #ffffff;
      .integral_information{
        padding: 0 15px 20px 15px;
        .describe_tit{
          padding: 12px 0 11px 0;
          border-bottom: solid 0.5px #D8D8D8;
          color: #333333;
          font-size: 15px;
        }
        .details-box{
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding-top: 15px;
        }
        .details_img{
          flex: 0.8;
          display: flex;
          align-items: flex-start;
          img{
            width: 75px;
            height: 75px;
            margin-right: 10px;
          }
        }
        .integral_name{
          .name_b{
            font-size: 15px;
            color: #333333;
            font-weight: bold;
          }
        }
        .integral_num{
          .integral_number{
            font-size: 15px;
            color: #333333;
            font-weight: bold;
          }
        }
      }
    }
    .consumption_integral{
      margin-top: 10px;
      padding: 15px;
      font-size: 15px;
      color: #333333;
      font-weight: bold;
      background: #ffffff;
    }
  }
</style>
