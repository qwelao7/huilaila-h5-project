<template>
  <div class="commonHeader integralCheckstand">
    <x-header
      slot="header"
      :left-options="{showBack: false}" style="background: #0DAB60;"
      title="收银台">
    </x-header>
    <div class="check_top">
      <div class="check_banner">
        <img :src="informationList.picUrl" width="100%" alt="">
      </div>
      <div class="check_text" v-text="informationList.name"></div>
    </div>
    <div class="check">
      <div class="check_more">
        <p>消费金额（当前最多可用{{allPrice}}元）</p>
      </div>
      <div class="check_input">
        <span class="check_input_y">￥</span>
        <input type="number" class="check_price" v-model="priceNum">
        <!--<i class="check_i" @click=""></i>-->
      </div>
      <div class="check_more" style="margin-top: .3rem;">
        <p v-show="isTrue">您此次消费将使用 <span style="display: inline-block;color: #0DAB60;">{{userIntergial}}</span>积分抵扣</p>
        <p v-show="isIntergial">剩余积分：<span style="display: inline-block;color: #0DAB60;">{{allIntergial}}</span></p>
        <p v-show="isBeyond" style="color: #FF6648;">消费金额超限</p>
      </div>
      <div class="submit" v-show="!isShow" @click="confirm(specId)">立即支付</div>
      <!--@click="goPayIntegral(specId)"-->
      <div class="submit_a" v-show="isShow">立即支付</div>
    </div>
  </div>
</template>
<script>
  import {XHeader, querystring} from 'vux'
  import {JURL} from '../../../common/js/utils';
  export default {
    name: 'integralCheckstand',
    components: {
      XHeader
    },
    data () {
      return {
        priceNum: '',
        informationList: {},
        specId: '',
        userIntergial: 0,
        allPrice: 300,
        allIntergial: 3000,
        isShow: false,
        isIntergial: false,
        isBeyond: false,
        isTrue: true,
        price: '',
        token: localStorage.getItem('token'),
        defCommunityId: localStorage.getItem('communityId')
      }
    },
    watch: {
      priceNum: function (val, oldVal) {
        let price = val;
        this.userIntergial = (price * 100).toFixed(1);
        if (price === '') {
          this.isIntergial = true;
          this.isShow = true;
          this.isTrue = false;
          this.isBeyond = false;
        } else if (price > this.allPrice) {
          this.isShow = true;
          this.isBeyond = true;
          this.isTrue = false;
          this.isIntergial = false;
        } else {
          this.isShow = false;
          this.isBeyond = false;
          this.isIntergial = false;
          this.isTrue = true;
        }
      }
    },
    created () {
//      this.validation();
      if (!this.token) {
//        alert(this.token);
        this.$router.push('/Login');
      } else {
//        alert(111);
        if (!this.defCommunityId) {
          this.$router.push('/addCommunityAddress');
        } else {
          this.getIntegralData();
          this.goPay()
        }
      }
      console.log(window.location)
    },
    methods: {
      validation () {
        alert(this.token);
        alert(this.defCommunityId)
      },
      getIntegralData () {
        if (this.priceNum === '') {
          this.isIntergial = true;
          this.isShow = true;
          this.isTrue = false;
          this.isBeyond = false;
        }
        let that = this;
        // 获取用户总积分
        that.$JHttp({
          method: 'get',
          headers: {
            'defCommunityId': localStorage.getItem('communityId')
          },
          url: window.baseURL + '/integral/userInt'
        }).then(res => {
          console.log(res, '用户总积分');
          that.allIntergial = res.data;
          that.allPrice = that.allIntergial / 100;
        }).catch(err => {
          console.log(err);
        });
      },
      goPay () {
        let that = this;
        // 根据idCode,获取基础信息
        let state = JURL.getHashParam('state');
        // 根据state获取业务参数
        this.$JHttp({
          url: window.baseURL + '/weixin/oauth2/getState?state=' + state,
          method: 'get'
        }).then((res) => {
          console.log(res, '获取基础信息');
          if (res.status === 100) {
            that.specId = res.data.goodsId;
//            that.getHouseInfo();
            // 获取积分商品信息
            that.$JHttp({
              method: 'get',
              url: window.baseURL + '/integral/productDetail/' + res.data.goodsId
            }).then(res => {
              that.informationList = res.data;
            }).catch(err => {
              console.log(err);
            });
          } else {
            that.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          console.log(e);
        });
      },
      confirm (value) {
        // 订单确认页面
        let reg = /^\d+(\.\d{1,2})?$/;
        if (!reg.test(this.priceNum)) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入小数点后两位'
          });
        } else {
          let that = this;
          let data = {
            itemNum: that.userIntergial / 1,
            requiredTotalScore: that.userIntergial,
            specId: value
          };
          console.log(data)
          this.$router.push('/confirmIntegral/' + querystring.stringify(data))
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .integralCheckstand{
    background-color: #f7f7f7;
    padding-bottom: 53px;
    .check_top{
      width:100%;
      height:126px;
      background: #0DAB60;
      .check_banner{
        width:59.5px;
        height:59.5px;
        margin: 0 auto;
        padding-top: 18px;
        border-radius: 100%;
        img{
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }
      .check_text{
        width:100%;
        height:21px;
        line-height: 21px;
        color: #ffffff;
        font-size: 15px;
        text-align: center;
        margin-top: 10px;
      }
    }
    .check{
      width:90%;
      margin:15px auto 0;
      .check_more{
        width:100%;
        height: 21px;
        line-height:21px;
        color: #AAAAAA;
        font-size:15px;
      }
      .check_input{
        width:100%;
        height:30px;
        line-height:30px;
        margin-top: 10px;
        position: relative;
        .check_input_y{
          display: inline-block;
          width:21px;
          height:100%;
          color: #333333;
          font-size: 21px;
          margin-right: 10px;
          vertical-align: middle;
        }
        .check_price{
          width:295px;
          height:100%;
          border:none;
          background: #f7f7f7;
          border-bottom: solid 0.5px #D8D8D8;
          vertical-align: middle;
          color: #333333;
          font-size: 21px;
        }
        .check_i{
          display: block;
          position: absolute;
          width: 16px;
          height:.16px;
          background: url("../../../assets/images/delete_icon_gray.png");
          background-size: cover;
          top: 7.5px;
          right:10px;
        }
      }
      .submit{
        width:100%;
        height:44px;
        background: #0DAB60;
        text-align: center;
        line-height:44px;
        color: #ffffff;
        font-size: 18px;
        margin:20px auto;
        border-radius: 2px;
      }
      .submit_a{
        width:100%;
        height:44px;
        background: #d3d3d3;
        text-align: center;
        line-height:44px;
        color: #ffffff;
        font-size: 18px;
        margin:20px auto;
        border-radius: 2px;
      }
    }
  }
</style>
