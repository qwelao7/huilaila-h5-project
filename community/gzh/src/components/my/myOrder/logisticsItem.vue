<template>
	<div class="logistics-item">
    <div class="left"></div>
    <div class="center">
      <div class="time" v-if="item.expTime" v-text="item.expTime"></div>
      <div class="info" v-text="item.expMark || '安排发货中'"></div>
      <div class="name" v-if="item.productName" v-text="'商品：' + item.productName"></div>
    </div>
    <div class="right"></div>
	</div>
</template>
<script>
export default {
  name: 'logistics-item',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style type="text/less" lang="less" scoped>
.logistics-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  .left {
    width: 16px;
    height: 16px;
    background-image: url("../../../assets/images/express_icon_32black.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .center {
    width: 297px;
    margin: 0 10px 0 15px;
    font-size: 15px;
    color: #333333;
    .name {
      color: #FF6648;
    }
  }
  .right {
    width: 7px;
    height: 15px;
    background-image: url("../../../assets/images/arrow_icon_grey.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
}
</style>
