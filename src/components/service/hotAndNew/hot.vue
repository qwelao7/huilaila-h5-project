<template>
  <div class="hotGoods">
    <newGoods :productArr="productArr"></newGoods>
  </div>
</template>
<script>
  import newGoods from '../goodsList'
  import img from '../../../assets/a3.jpg'
  export default {
    name: 'new',
    components: {
      newGoods
    },
    props: {
      ProductArr: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        goodsList: [
          {
            img: img,
            name: '好次的',
            price: '13.6',
            sellNum: 30,
            tag: '包邮'
          },
          {
            img: img,
            name: '好次的',
            price: '13.6',
            sellNum: 30,
            tag: '包邮'
          },
          {
            img: img,
            name: '好次的',
            price: '13.6',
            sellNum: 30,
            tag: '包邮'
          }
        ]
      }
    }
  }
</script>
<style></style>
