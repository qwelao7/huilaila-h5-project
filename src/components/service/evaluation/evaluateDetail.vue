<template>
  <div class="evaluateDetail commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">

      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div v-for="item in list">
        <div class="comment-info">
          <div class="title" v-text="item.title"></div>
          <div class="info">
            <div class="comment-star">
              <div class="quality">
                <span>服务质量：</span>
                <star v-model="item.appraise.appraiseQuality" disabled :margin="5" :fontSize="12"></star>
              </div>
              <div class="speed">
                <span>响应速度：</span>
                <star v-model="item.appraise.appraiseSpeed" disabled :margin="5" :fontSize="12"></star>
              </div>
            </div>
            <div class="comment-text" v-text="item.appraise.appraiseContent"></div>
            <div class="comment-time" v-text="item.appraise.appraiseTime"></div>
            <div class="comment-img" v-if="item.appraise.appraiseImgList && item.appraise.appraiseImgList.length > 0">
              <img v-for="img in item.appraise.appraiseImgList" :src="img"/>
            </div>
            <div class="reply" v-if="item.appraise.isReply === '1'">
              <div class="reply-text" v-text="'回复：' + item.appraise.replyContent"></div>
              <div class="reply-time" v-text="item.appraise.replyTime"></div>
            </div>
          </div>
        </div>
      </div>

    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader } from 'vux'
  import Star from '../../common/star'
  export default {
    name: 'evaluateDetail',
    components: {
      ViewBox,
      XHeader,
      Star
    },
    data () {
      return {
        title: '评价详情',
        list: [{
          title: '修改服务评价',
          appraise: {}
        }, {
          title: '服务评价',
          appraise: {}
        }]
      }
    },
    created () {
      this.list[0].appraise = this.$route.query.appraise
      this.list[1].appraise = this.$route.query.oldAppraise
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.evaluateDetail {
  height: 100%;
  background-color: #f2f2f2;
  .comment-info {
    background-color: #FFFFFF;
    padding: 11.5px 15px 0;
    margin-top: 10px;
    .title {
      padding-bottom: 11.5px;
      border-bottom: 0.5px solid #D8D8D8;
    }
    .info {
      .comment-star {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 20px 0 11px 0;
        .quality {
          display: flex;
          align-items: center;
          margin-right: 20px;
        }
        .speed {
          display: flex;
          align-items: center;
        }
      }
      .comment-text {
        font-size: 18px;
        color: #333333;
        margin-bottom: 5px;
      }
      .comment-time {
        font-size: 12px;
        color: #AAAAAA;
        padding-bottom: 15px;
      }
      .comment-img {
        display: flex;
        padding-bottom: 20px;
        img {
          width: 75px;
          height: 75px;
          &:not(:last-child) {
            margin-right: 15px;
          };
        }
      }
      .reply {
        background: #F8F8F8;
        padding: 10px;
        .reply-text {
          font-size: 15px;
          color: #333333;
          margin-bottom: 10px;
        }
        .reply-time {
          font-size: 12px;
          color: #AAAAAA;
        }
      }
    }
  }
}
</style>
