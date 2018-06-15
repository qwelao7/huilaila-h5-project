<template>
  <div class="bottomLikeTab">
    <div class="likeTab" @click="likeIt">
      <i :class="{like: showLike}"></i>
      <span :class="{isLike: showLike}">{{like}}</span>
    </div>
    <div class="commentTab">
      <i></i>
      <span>评论</span>
    </div>
  </div>
</template>
<script>
    export default {
      data () {
        return {
          showLike: false,
          like: '点赞'
        }
      },
      props: {
        isLike: {
          type: Number,
          default: 0
        }
      },
      created () {
        this.getLikeStatus()
      },
      methods: {
        getLikeStatus () {
          if (this.isLike === 0) {
            this.showLike = false;
            this.like = '点赞'
          } else {
            this.showLike = true;
            this.like = '已赞'
          }
        },
        likeIt () {
          this.showLike = !this.showLike;
          if (this.showLike) {
            this.like = '已赞'
          } else {
            this.like = '点赞'
          }
        }
      }
    }
</script>
<style type="text/less" lang="less" scoped>
  .bottomLikeTab {
    width: 100%;
    max-width: 750px;
    z-index: 500;
    padding: 11px 0;
    background-color: #fafafa;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0.5;
      font-size: 12px;
      i {
        width: 28px;
        height: 28px;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }
      span{
        margin-left: 10px;
      }
      .isLike{
        color: #FF6565;
      }
    }
    .likeTab{
      border-right: 0.5px solid #D8D8D8;
      i{
        background-image: url("../../assets/images/like_icon_56black.png");
      }
      .like{
        background-image: url("../../assets/images/liked_icon_56red.png");
      }
    }
    .commentTab{
      i{
        background-image: url("../../assets/images/comment_icon_56black.png");
      }
    }
  }
</style>
