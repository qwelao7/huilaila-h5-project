<template>
  <div class="evaluation-item vux-1px-b">
    <div class="header">
      <img class="head-img" :src="evaluationItem.headPicName" alt="" v-if="evaluationItem.headPicName">
      <img class="head-img" src="../../assets/images/default_avatar.png" alt="" v-if="!evaluationItem.headPicName">
      <span class="nick-name" v-text="evaluationItem.nickName"></span>
      <star :disabled="true" :fontSize="12" :margin="5" :value="evaluationItem.averagePoint"></star>
    </div>
    <div class="time-wrapper" v-text="evaluationItem.appraiseTime"></div>
    <div class="content-text-wrapper" v-text="evaluationItem.appraiseContent"></div>
    <div class="content-img-wrapper" v-if="evaluationItem.appraiseImgs && evaluationItem.appraiseImgs.length">
      <img-list-view :imgList="evaluationItem.appraiseImgs"></img-list-view>
    </div>
    <div class="reply-wrapper" v-if="evaluationItem.replyContent">
      <span class="reply-title" v-text="'回复:'"></span>
      <p class="reply-content" v-text="evaluationItem.replyContent"></p>
    </div>
  </div>
</template>

<script>
  import Star from 'components/common/star';
  import ImgListView from 'components/common/imgListView';
  export default {
    name: 'EvaluationItem',
    components: {
      'star': Star,
      'img-list-view': ImgListView
    },
    props: {
      evaluationItem: {
        type: Object,
        default: {}
      }
    },
    created: function () {
    },
    data () {
      return {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.evaluation-item {
  padding: 20px 0;
  margin: 0 15px;
  .header {
    display: flex;
    align-items: center;
    .head-img {
      width: 25px;
      height: 25px;
      border-radius: 100%;
      margin-right: 10px;
    }
    .nick-name {
      font-size: 15px;
      margin-right: 10px;
    }
  }
  .time-wrapper {
    margin-top: 10px;
    font-size: 12px;
    color: #aaa;
  }
  .content-text-wrapper {
    margin-top: 10px;
    font-size: 18px;
    line-height: 25px;
  }
  .content-img-wrapper {
    margin-top: 15px;
  }
  .reply-wrapper {
    margin-top: 15px;
    padding: 10px;
    width: 325px;
    background-color: #F8F8F8;
    display: flex;
    align-items: center;
    .reply-title {
      margin-right: 6px;
    }
  }

}
</style>
