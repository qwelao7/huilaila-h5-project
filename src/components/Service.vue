<template>
  <div class="service">
    <view-box body-padding-top="0" body-padding-bottom="1.306667rem">
      <div class="serMask">
        <!--<img src="../assets/service.jpg" alt="">-->
      </div>
      <bottomTab slot="bottom"></bottomTab>
    </view-box>
    <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle">
      <span class="delete-info vux-1px-b">敬请期待!</span>
      <div class="operate-wrapper">
        <span class="text vux-1px-r" @click="back">确定</span>
      </div>
    </x-dialog>
  </div>
</template>

<script>
  import {ViewBox, XDialog} from 'vux'
  import bottomTab from '../components/bottomTab'
  export default {
    name: 'Service',
    components: {
      ViewBox,
      XDialog,
      bottomTab
    },
    data () {
      return {
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 0 0 0',
          borderRadius: '20px'
        }
      }
    },
    methods: {
      back () {
//        this.deleteModalShow = false;
//        this.$router.go(-1)
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .service{
    height: 100%;
    width: 100%;
    background-color: #f7f7f7;
    position: relative;
    .serMask{
      width: 100%;
      height: 100%;
      background: url("../../static/service.jpg") no-repeat;
      background-size: 100% 100%;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .delete-wrapper {
      .delete-info {
        color: #333;
        font-size: 14px;
        font-weight: bold;
        display: inline-block;
        width: 100%;
        padding-bottom: 20px;
      }
      .operate-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        .text {
          display: inline-block;
          flex: 1;
          height: 100%;
          line-height: 50px;
          color: #18adfb;
          font-size: 16px;
        }
      }
    }
  }
</style>
