<template>
  <div class="plan-wrapper">
    <div class="placeholder" v-if="!instructionPic">
      <span class="icon"></span>
      <div class="text">暂无相关内容</div>
    </div>
    <img :src="instructionPic" alt="" class="plan-img">
  </div>
</template>

<script>
  export default {
    name: 'plan',
    created: function () {
    },
    data () {
      return {}
    },
    computed: {
      instructionPic: function () {
        return this.$store.state.pageCfg.instructionPic;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .plan-wrapper {
    width: 100%;
    height: 100%;
    background-color: #ebebeb;
    .placeholder {
      padding-top: 4.72rem;
      .icon {
        display: block;
        width: 2.666667rem;
        height: 2.666667rem;
        margin: 0 auto;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url("../../assets/img/@2x/placeholder.png");
      }
      .text {
        margin-top: 0.4rem;
        color: #aaa;
        font-size: 12px;
      }
    }
    .plan-img {
      background-size: 100%;
      max-width: 100%;
    }
  }

  [data-dpr="2"]
  .plan-wrapper {
    .placeholder {
      .text {
        font-size: 24px;
      }
    }
  }

  [data-dpr="3"]
  .plan-wrapper {
    .placeholder {
      .icon {
        background-image: url("../../assets/img/@3x/placeholder@3x.png");
      }
      .text {
        font-size: 42px;
      }
    }
  }
</style>
