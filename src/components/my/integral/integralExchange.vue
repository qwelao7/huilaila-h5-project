<template>
  <div class="integral_exchange">
    <view-box body-padding-top="0" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;background-color: transparent">
      </x-header>
      <div v-for="item in dataList">
        <div class="exchange_banner">
          <div class="exchange_img">
            <!--<i class="back" @click="goBack"></i>-->
            <img :src="item.picUrl" alt="">
          </div>
          <div class="exchange_content">
            <div class="shop_name">{{item.name}}</div>
            <div class="shop_price">
              <p class="integral_number">
                <span class="integral_num">{{item.requiredScore}}</span>
                <span class="integral_jf">积分</span>
              </p>
              <p class="price_num">￥{{item.price}}</p>
            </div>
          </div>
        </div>
        <div class="shop_describe">
          <div class="describe_all">
            <div class="describe_tit">商品描述</div>
            <div class="shop_name_a">
              <span class="name_name" v-html="item.detailDesc"></span>
            </div>
          </div>
        </div>
        <div class="shop_describe">
          <div class="describe_all">
            <div class="describe_tit">兑换规则</div>
            <div class="rules">{{item.terms}}</div>
          </div>
        </div>
        <div class="bottom" @click="goExchange(item.productId)">立即兑换</div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {ViewBox, XHeader, querystring} from 'vux'
  export default {
    name: 'integralExchance',
    components: {
      ViewBox,
      XHeader
    },
    data () {
      return {
        dataList: []
      }
    },
    created () {
      this.getInformation(true)
    },
    methods: {
      getInformation () {
        console.log(this.$route.params.id);
        var that = this;
        that.$JHttp({
          method: 'Get',
          headers: {
            'Accept': '*/*',
            'token': localStorage.getItem('token'),
            'defCommunityId': localStorage.getItem('communityId'),
            'companyCode': window.commonConfig.companyCode
          },
          url: window.baseURL + '/integral/productDetail/' + this.$route.params.id
        }).then(function (response) {
          console.log(response, 111);
          var dataList = response.data;
          that.dataList.push(dataList)
        })
      },
      goBack () {
        this.$router.go(-1)
      },
      goExchange (id) {
        this.$router.push('/confirmExchange/' + id)
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .integral_exchange{
    height: 100%;
    background-color: #f7f7fa;;
    .exchange_banner{
      background: #ffffff;
      .exchange_img{
        height: 375px;
        position: relative;
        img{
          width: 100%;
          height: 100%;
        }
        .back{
          display: block;
          position: absolute;
          top: 10px;
          left: 15px;
          width: 35px;
          height: 35px;
          background: url("../../../assets/images/return_button_70.png") left center;
          background-size: cover;
        }

      }
      .exchange_content{
        padding: 15px;
        .shop_name{
          font-size: 18px;
          color: #333333;
          font-weight: bold;
        }
        .shop_price{
          .integral_number{
            display: inline-block;
            .integral_num{
              font-size: 24px;
              color: #0DAB60;
              font-weight: bold;
              display: inline-block;
            }
            .integral_jf{
              font-size: 15px;
              color: #333333;
              display: inline-block;
            }
          }
          .price_num{
            display: inline-block;
            color: #AAAAAA;
            text-decoration:line-through;
            margin-left: 15px;
            font-size: 15px;
          }
        }
      }
    }
    .shop_describe{
      margin-top: 10px;
      background: #ffffff;
      .describe_all{
        padding: 0 15px;
        .describe_tit{
          padding-top: 12px;
          padding-bottom: 11px;
          border-bottom: solid 0.5px #D8D8D8;
          color: #333333;
          font-size: 15px;
        }
        .shop_name_a{
          font-size: 15px;
          color: #333333;
          padding: 15px 0;
          .name_name{
            display: inline-block;
          }
        }
        .rules{
          color: #333333;
          font-size: 15px;
          padding: 15px 0;
        }
      }
    }
    .bottom{
      width:100%;
      height:50px;
      line-height: 50px;
      text-align: center;
      color: #ffffff;
      background: #0DAB60;
      font-size: 18px;
      position: fixed;
      bottom:0;

    }
  }

</style>
