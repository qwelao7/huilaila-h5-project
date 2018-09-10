<template>
  <div class="star">
    <input v-model="currentValue" style="display:none">
    <div class="rateBox" >
      <span v-for="i in max" @click="handleStar(i-1)" :style="{backgroundImage:`url(${bg && bg[i-1] ? bg[i-1] : grey})`, marginRight:margin+'px', width: fontSize + 'px', height: fontSize + 'px', lineHeight: fontSize + 'px'}"></span>
    </div>
  </div>
</template>
<script>
  import grey from '../../assets/images/greystar_icon_evaluate.png'
  import yellow from '../../assets/images/yellowstar_icon_evaluate.png'
  export default {
    name: 'star',
    props: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 5
      },
      disabled: Boolean,
      value: {
        type: [Number, String],
        default: 0
      },
      fontSize: {
        type: Number,
        default: 22
      },
      margin: {
        type: Number,
        default: 15
      }
    },
    data () {
      return {
        bg: [],
        grey: grey,
        yellow: yellow,
        currentValue: 0
      }
    },
    created () {
      this.currentValue = parseInt(this.value)
    },
    mounted () {
      this.updateStyle()
    },
    methods: {
      handleStar (i) {
        if (!this.disabled) {
          if (this.currentValue === i + 1) {
            this.currentValue = i < this.min ? this.min : i
            this.updateStyle()
          } else {
            this.currentValue = (i + 1) < this.min ? this.min : (i + 1)
          }
        }
      },
      updateStyle () {
        for (let j = 0; j < this.max; j++) {
          if (j <= this.currentValue - 1) {
            this.$set(this.bg, j, this.yellow)
          } else {
            this.$set(this.bg, j, this.grey)
          }
        }
      }
    },
    watch: {
      currentValue (val) {
        this.updateStyle()
        this.$emit('onRater', val)
      },
      value (val) {
        this.currentValue = val
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .star{
    .rateBox{
      display: flex;
      align-items: center;
      span{
        margin-right: 15px;
        background-image: url("../../assets/images/greystar_icon_evaluate.png");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      span:last-child{
        margin-right: 0!important;
      }
    }
  }
</style>
