<template>
  <div class="cart" @click="toShoppingCart" >
    <img src="../../assets/images/cart.png" alt="">
    <badge style="line-height: 17px" :text="productsNum" v-if="productsNum"></badge>
  </div>
</template>
<script>
  import {Badge} from 'vux'
  export default {
    name: 'shoppingCart',
    components: {
      Badge
    },
    props: {
      productsNum: {
        type: Number,
        default: 0
      }
    },
    methods: {
      toShoppingCart () {
        // todo 进入购物车
        this.$router.push('/shoppingCart/detail')
      }
    }
  }
</script>
<style type="text/less" scoped lang="less">
  .cart{
    width: 45px;
    height: 45px;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    span{
      position: absolute;
      right: 0;
      top: 0;
      background-clip: border-box;
    }
  }
</style>
