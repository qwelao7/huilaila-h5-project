<template>
  <div class="rule-wrapper">
    <div class="placeholder" v-if="!ruleDescription">
      <span class="icon"></span>
      <div class="text">暂无相关内容</div>
    </div>
    <div v-html="ruleDescription" v-if="ruleDescription" class="rule-description"></div>
  </div>
</template>

<script>
  export default {
    name: 'ruleDescription',
    created: function () {
    },
    data () {
      return {}
    },
    computed: {
      ruleDescription: function () {
        return this.$store.state.pageCfg.ruleDescription;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .rule-wrapper {
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
    .rule-description {
      padding: 0.4rem;
      text-align: left;
      font-size: 12px;
      & img {
        max-width: 100%;
      }
    }
  }
  [data-dpr="2"]
  .rule-wrapper {
    .placeholder {
      .text {
        font-size: 24px;
      }
    }
    .rule-description {
      font-size: 24px;
    }
  }
  [data-dpr="3"]
  .rule-wrapper {
    .placeholder {
      .icon {
        background-image: url("../../assets/img/@3x/placeholder@3x.png");
      }
      .text {
        font-size: 42px;
      }
    }
    .rule-description {
      font-size: 42px;
    }
  }
</style>
