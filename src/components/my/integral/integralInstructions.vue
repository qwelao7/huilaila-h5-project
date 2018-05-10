<template>
  <div class="commonHeader integralInstructions">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="积分说明">
    </x-header>
    <div class="instruction_all">
      <div class="instruction_a">
        · 如何获得积分？
      </div>
      <div v-for="item in getIntegral">
        <div class="instruction_content" style="margin-top: .4rem">
          <span class="content_name">{{item.integral}}</span>
          <span class="content_num" v-if="item.num">(+{{item.num}})</span>
        </div>
      </div>
      <div class="instruction_a">
        · 积分有什么用
      </div>
      <div class="instruction_content" style="margin-top: .4rem">
        <span class="content_name">积分兑换实物</span>
      </div>
      <div class="instruction_content" style="margin-top: .4rem">
        <span class="content_name">积分兑换红包</span>
      </div>
      <!--<div class="instruction_content" style="margin-top: .4rem">-->
        <!--<span class="content_name">积分参与活动</span>-->
      <!--</div>-->
      <div class="instruction_a">
        · 备注
      </div>
      <div class="instruction_content" style="margin-top: .4rem;padding-bottom: .3rem;">
        <span class="content_name">
          1.积分兑换标准及兑换规则均以兑换当时最新活动公告为准，公告如有有效期的，逾期则不得兑换；<br>
          2.部分兑换商品有数量限制，兑完为止；<br>
          3.利用系统漏洞或以其他方式恶意赚取积分的，经查证后，将追缴相关积分，并保留追究相关法律责任的权利；<br>
          4.若申请退货，订单中包含以积分兑换的服务，则积分不予返还；<br>
          5.若因个人填写的联系方式、收货地址等信息有误，并经三次联系未果，无法发放或无法寄送的，视同自动放弃兑换产品的资格，不再补发；<br>
          6.我方保留对积分细则的解释权，并有权根据需要对积分细则予以修订和废除。</span>
      </div>
    </div>
  </div>
</template>
<script>
  import { XHeader } from 'vux'
  const getIntegral = [
    {
      integral: '首次绑定手机号',
      num: +100
    },
    {
      integral: '首次绑定房号并通过业主信息核实',
      num: +100
    },
    {
      integral: '首次邀请家人绑定房号',
      num: +100
    },
    {
      integral: '在公众号或App中使用在线支付每实际支付满1元',
      num: +1
    },
    {
      integral: '对服务订单进行打分评价',
      num: +5
    },
    {
      integral: '对服务订单进行文字评价',
      num: +5
    },
    {
      integral: '每发布新鲜事或活动',
      num: +5
    },
    {
      integral: '发布的新鲜事或活动每获得一次点赞',
      num: +1
    },
    {
      integral: '发布的活动每获得一名参与者',
      num: +5
    },
    {
      integral: '每投票一次',
      num: +2
    },
    {
      integral: '用户每天在新鲜事和活动上获得的积分上限为100'
    }
  ];
  export default {
    name: 'integralInstructions',
    components: {
      XHeader
    },
    data () {
      return {
        getIntegral: getIntegral
      }
    },
    created () {

    },
    methods: {
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .integralInstructions{
    width:100%;
    height:100%;
    .instruction_all{
      width:90%;
      margin:0 auto;
      .instruction_a{
        width:100%;
        height:.6rem;
        font-size: 15px;
        color: #333333;
        line-height:.6rem;
        background: #f2f2f2;
        margin-top: .3rem;
        font-weight: bolder;
      }
      .instruction_content{
        width:100%;
        margin-top: .2rem;
        font-size: 15px;
        .content_name{
          display: inline-block;
          color: #333333;
        }
        .content_num{
          display: inline-block;
          color: #0DAB60;
          margin-left: .2rem;
        }
      }
    }
  }
</style>
