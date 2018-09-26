<template>
  <div class="empty-wrapper">
    <div class="placeholder">
      <span class="icon"></span>
      <div class="text">暂无相关内容</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'empty',
    data () {
      return {
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.empty-wrapper {
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
      background-repeat:no-repeat;
      background-image: url("../../assets/img/@2x/placeholder.png");
    }
    .text {
      margin-top: 0.4rem;
      color: #aaa;
      font-size: 12px;
    }
  }
}
  [data-dpr="2"]
  .empty-wrapper {
    .placeholder {
      .text {
        font-size: 24px;
      }
    }
  }
  [data-dpr="3"]
  .empty-wrapper {
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
