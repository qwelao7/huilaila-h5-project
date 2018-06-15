<template>
  <div class="commonHeader redpacketInstructions">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="红包说明">
    </x-header>
    <div class="instruction_all">
      <div class="instruction_a">
        · 红包获取
      </div>
      <div class="instruction_content" style="margin-top: .4rem">
        <p>回来啦社区将不定期开展活动，赠送用户各种不同面值的红包；此外，用户也可通过“积分兑换”功能以积分换取红包。</p>
      </div>
      <div class="instruction_a">
        · 红包使用范围
      </div>
      <div class="instruction_content" style="margin-top: .4rem">
        红包可在回来啦社区所有自有服务中涉及线上支付的服务订单结算时使用；所有通过“授权登录”方式登录由第三方开发的网页中的服务，暂无法使用（例如：衣交所、双城免税店等）。
      </div>
      <div class="instruction_a">
        · 红包使用规则
      </div>
      <div class="instruction_content" style="margin-top: .4rem;padding-bottom: .3rem;">
        <p>
          1.红包仅可在线上支付情况下使用，若红包金额大于订单金额，差额不找零，红包不退回；
        </p>
        <p>2.每个服务订单仅可使用一个红包；</p>
        <p>3.不同的红包有不同的使用起始金额，服务订单达到起始金额时方可使用红包进行抵扣；</p>
        <p>4.不同的红包有不同的使用有效期，超出有效期将自动作废；</p>
        <p>5.若红包符合使用规则且在有效期内，则在服务订单确认时系统将默认勾选，并自动读取红包优惠券金额，显示待付款金额，用户只需支付剩余金额即可；用户若无意使用，也可手动取消勾选，暂不使用；</p>
        <p>6.若红包有多个，系统将默认选择可抵扣金额最高的红包，若默认可抵扣金额最高的红包不止1个，则优先选取有效期临近的红包；用户若想使用其他红包，也可手动更改选择；</p>
        <p>7.用户可在回来啦社区的“我家”版块中“红包”栏目，查询用户所拥有的红包详情。</p>
      </div>
    </div>
  </div>
</template>
<script>
  import { XHeader } from 'vux'
  export default {
    name: 'redpacketInstructions',
    components: {
      XHeader
    },
    data () {
      return {
      }
    },
    created () {

    },
    methods: {
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .redpacketInstructions{
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
        padding: 5px 0;
        font-weight: bolder;
      }
      .instruction_content{
        width:100%;
        margin-top: .2rem;
        font-size: 15px;
        display: inline-block;
        color: #333333;
        line-height: 30px;
      }
    }
  }
</style>
