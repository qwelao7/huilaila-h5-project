<template>
  <div class="newGoods">
    <newGoods :productArr="productArr"></newGoods>
  </div>
</template>
<script>
  import newGoods from '../goodsList'
  import img from '../../../assets/微信图片_20180102135200.jpg'
  export default {
    name: 'new',
    components: {
      newGoods
    },
    data () {
      return {
        goodsList: [
          {
            img: img,
            name: '洋娃娃',
            price: '63.6',
            sellNum: 30,
            tag: '包邮'
          },
          {
            img: img,
            name: '洋娃娃',
            price: '63.6',
            sellNum: 30,
            tag: '包邮'
          },
          {
            img: img,
            name: '洋娃娃',
            price: '63.6',
            sellNum: 30,
            tag: '包邮'
          },
          {
            img: img,
            name: '洋娃娃',
            price: '63.6',
            sellNum: 30,
            tag: '包邮'
          },
          {
            img: img,
            name: '洋娃娃',
            price: '63.6',
            sellNum: 30,
            tag: '包邮'
          },
          {
            img: img,
            name: '洋娃娃',
            price: '63.6',
            sellNum: 30,
            tag: '包邮'
          },
          {
            img: img,
            name: '洋娃娃',
            price: '63.6',
            sellNum: 30,
            tag: '包邮'
          },
          {
            img: img,
            name: '洋娃娃',
            price: '63.6',
            sellNum: 30,
            tag: '包邮'
          },
          {
            img: img,
            name: '洋娃娃',
            price: '63.6',
            sellNum: 30,
            tag: '包邮'
          }
        ]
      }
    }
  }
</script>
<style></style>
