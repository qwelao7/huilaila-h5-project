<template>
	<div class="time-axis">
    <div class="list">
      <div class="item" v-for="(item, index) in list">
        <div class="icon" :class="index === 0 ? 'icon-highlight' : 'icon-grey'"></div>
        <slot :item=item :index=index></slot>
      </div>
    </div>
	</div>
</template>
<script>
export default {
  name: 'time-axis',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style type="text/less" lang="less" scoped>
.time-axis {
  .list {
    .item {
      position: relative;
      margin-left: 9px;
      padding: 20px 0 0 18.5px;
      border-left: 0.5px solid #D8D8D8;
      padding-bottom: 20px;
      .icon {
        position: absolute;
        top: 40%;
        left: 0;
      }
      .icon-highlight {
        margin-left: -9px;
        width: 18px;
        height: 18px;
        background-image: url("../../../assets/images/redpoint_icon_express.png");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
      .icon-grey {
        margin-left: -6px;
        width: 12px;
        height: 12px;
        background-image: url("../../../assets/images/greypoint_icon_express.png");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
    }
  }
}
</style>
