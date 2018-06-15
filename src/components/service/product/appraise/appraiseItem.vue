<template>
  <div class="appraise-item">
    <div class="appraise-user ">
      <img class="user-avatar" src="../../../../assets/images/default_avatar.png" v-if="!item.headPicName">
      <img class="user-avatar" :src="item.headPicName" v-if="item.headPicName">
      <p class="user-name">{{item.nickName}}：</p>
      <rater v-model="item.productScore" :font-size="15" disabled
             :margin="1"></rater>
    </div>
    <div>
      <span class="appraise-time">{{item.appraiseTime}}</span>
      <span class="appraise-sku-info">{{getSkuInfo}}</span>
    </div>
    <p class="appraise-content" v-if="item.appraiseContent">{{item.appraiseContent}}</p>
    <div class="content-img-wrapper" v-if="item.appraiseImgs && item.appraiseImgs.length">
      <img-list-view v-if="item.appraiseImgs && item.appraiseImgs.length > 0" :imgList="item.appraiseImgs"></img-list-view>
    </div>
    <p class="appraise-reply " v-if="item.replyContent">回复：{{item.replyContent}}</p>
    <div class="divider"></div>
  </div>
</template>
<script>
  import { Rater } from 'vux'
  import ImgListView from 'components/common/imgListView';

  export default {
    name: 'appraiseItem',
    props: {
      item: {
        appraiseContent: ' ',
        appraiseCount: 0,
        appraiseTime: '',
        appraiseUser: '',
        headPicName: '',
        isReply: 0,
        nickName: '',
        appraiseImgs: [],
        replyContent: '',
        productScore: 5,
        satisfaction: '',
        skuProperties: ''
      }
    },
    components: {
      Rater,
      'img-list-view': ImgListView
    },
    data () {
      return {
      }
    },
    computed: {
      getSkuInfo () {
        console.log(this.item)
        console.log(this.item.skuProperties)
        var skus = this.item.skuProperties.split(' ');
        return skus.join(';')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .appraise-item {
    .appraise-user {
      display: inline-block;
      margin-top: 15px;
      margin-left: 15px;
      text-align: center;
      vertical-align: middle;
      .user-avatar{
        display: inline-block;
        width: 25px;
        height: 25px;
        border-radius: 50%;
      }
      .user-name{
        display: inline-block;
        font-size: 15px;
        color: #aaa;
        margin-left: 10px;
      }
    }
    .appraise-time ,.appraise-sku-info{
      display: inline-block;
      color: #aaa;
      font-size: 12px;
      margin-left: 15px;
      margin-top: 10px;
    }
    .appraise-content{
      font-size: 18px;
      margin-left: 15px;
      color: #333333;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .content-img-wrapper {
      margin: 15px 15px 0 15px;
    }
    .appraise-reply {
      font-size: 15px;
      color: #333;
      background-color: #f8f8f8;
      margin: 10px 15px;
      padding: 10px;
    }
    .divider{
      background-color: #d5d5d5;
      margin: 15px 15px 0px 15px;
      height: 1px;
    }
  }
</style>
