<template>
  <div class="redpacket-item" :class="{'normal-item':isEnable ,'grey-item':!isEnable}">
    <div class="item-top">
      <span class="redpacket-type">{{item.typeName}}</span>
    </div>
    <div style="display: inline-block">
      <div class="item-left">
        <div class="redpacket-amount">¥<span class="big-money">{{moneyStr}}</span></div>
        <div class="redpacket-exchange">{{item.minMoney}}</div>
      </div>
      <div class="item-right">
        <div class="redpacket-purpose">{{redpacketPurpose}}</div>
        <div class="redpacket-time">有效期：{{item.fromDate}}至{{item.toDate}}</div>
      </div>
    </div>
    <div class="divider"></div>
  </div>
</template>

<script>
  export default {
    name: 'redpacketItem',
    props: {
      item: {},
      isEnable: true
    },
    data () {
      return {
      }
    },
    computed: {
      redpacketPurpose () {
        if (this.item.type === 2) {
          return this.item.shopName
        } else if (this.item.type === 3) {
          return this.item.storeName;
        } else if (this.item.type === 1) {
          return '全平台通用'
        } else {
          return ''
        }
      },
      moneyStr () {
        return this.item.money.toFixed(2);
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  .redpacket-item {
    .item-top{
      position: relative;
      height: 36px;
      font-size: 12px;
      .redpacket-type{
        position: absolute;
        right: 15px;
        top: 10px;
      }
    }
    .item-left{
      display: inline-block;
      width: 130px;
      text-align: center;
      .redpacket-amount {
        display: inline-block;
        .big-money{
          display: inline-block;
          font-size: 20px;
        }
      }
      .redpacket-exchange{
        display: inline-block;
        margin-top: 5px;
        overflow:hidden;
        vertical-align: bottom;
        white-space:nowrap;
        text-overflow:ellipsis;
        width: 110px;
      }
    }

    .item-right{
      display: inline-block;
      width: 230px;
      .redpacket-purpose{
        display: inline-block;
      }
      .redpacket-time{
        margin-top: 5px;
      }
    }
    .divider {
      margin: 15px 15px 0px 15px;
      /*background-color: #d5d5d5;*/
      /*height: 1px;*/
      border-bottom: 1px solid #d5d5d5;
    }

  }
  .grey-item{
    color: #aaa;
    font-size: 11px;
    .redpacket-amount{
      color: #aaa;
    }
  }
  .normal-item {
    color: #333;
    font-size: 12px;
    .redpacket-amount{
      color: #0DAB60;
    }
  }
</style>
