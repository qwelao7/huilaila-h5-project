<template>
  <div class="recharge-card commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="wrapper">
        <div class="text">充值卡卡号（不区分大小写）</div>
        <x-input type="text" class="input" v-model="rechargeCard" placeholder="请输入充值卡卡号" :max="18" @on-change="changeInput"></x-input>
        <div class="button" @click="submit" :class="{ 'active': active }">确定</div>
      </div>

    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader, XInput } from 'vux'
  export default {
    name: 'recharge-card',
    components: {
      ViewBox,
      XHeader,
      XInput
    },
    data () {
      return {
        title: '充值卡充值',
        rechargeCard: undefined
      }
    },
    computed: {
      active () {
        return this.rechargeCard && this.rechargeCard.length === 18
      }
    },
    methods: {
      changeInput () {
        this.$nextTick(() => {
          this.rechargeCard = this.rechargeCard.replace(/[^a-zA-Z\d]/gi, '');
        })
      },
      submit () {
        if (this.active) {
          let _this_ = this
          _this_.$JHttp({
            method: 'POST',
            url: window.baseURL + '/treasure/submitRechargeByCard',
            params: {
              cardNo: this.rechargeCard
            }
          }).then(res => {
            if (res.status === 100) {
              _this_.$vux.confirm.show({
                title: res.msg,
                cancelText: '继续充值',
                onConfirm () {
                  _this_.$router.go(-1)
                },
                onCancel () {
                  _this_.rechargeCard = ''
                }
              })
            } else {
              _this_.$vux.toast.show({
                type: 'text',
                text: res.msg
              })
            }
          }).catch(e => {
            console.log(e)
          });
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.recharge-card {
  .wrapper {
    padding: 20px 15px 0 15px;
    .text {
      font-size: 15px;
      margin-bottom: 5px;
    }  
    /deep/ .input {
      font-size: 21px;
      width: 100%;
      padding: 0 0 13px 0;
      margin: 5px 0 20px 0;
      border: none;
      border-bottom: 1px solid #D8D8D8;
      .weui-icon-clear {
        vertical-align: -0.027rem;
      }
      &:before {
        display: none;
      }
    }
    .button {
      text-align: center;
      width: 100%;
      height: 50px;
      line-height: 50px;
      color: #FFFFFF;
      background-color: #D8D8D8;
      &.active {
        background-color: #0DAB60;
      }
    }
  }
}
</style>
