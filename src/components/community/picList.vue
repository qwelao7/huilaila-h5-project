<template>
  <div class="picList">
    <div class="showPic">
      <img  :src='firstPicList.src' alt="">
    </div>
    <div class="hidPic" v-show="pullDown">
      <ul>
        <li class="pic-box" v-for="(item, index) in picList">
          <img class="previewer-demo-img" :src="item.src" alt="" @click="show(index)">
        </li>
      </ul>
      <div v-transfer-dom>
        <previewer :list="picList" ref="previewer" :options="options"></previewer>
      </div>
    </div>
    <i :class="{pullUp:pullDown, pullDown:!pullDown}" @click="pullDown = !pullDown"></i>
  </div>
</template>
<script>
  import { Previewer, TransferDom } from 'vux'
  export default {
    name: 'picList',
    directives: {
      TransferDom
    },
    props: {
      imgList: {
        type: Array,
        default: []
      }
    },
    components: {
      Previewer
    },
    data () {
      return {
        picList: [],
        firstPicList: '',
        pullDown: false,
        options: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index];
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect();
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      }
    },
    created () {
      this.getCommunityPicList()
    },
    methods: {
      getCommunityPicList () {
        if (this.imgList.length) {
          this.firstPicList = this.imgList.splice(0, 1)[0];
          this.picList = this.imgList
        }
      },
      show (index) {
        this.$refs.previewer.show(index);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .picList{
    position: relative;
    i{
      position: absolute;
      left: 50%;
      margin-left: -14px;
      bottom: 5px;
      display: block;
      width: 28px;
      height: 28px;
      background: url("../../assets/images/down_button_buildingimages.png") center center / cover no-repeat;
      /*box-shadow: 0 5px 5px red;*/
    }
    .pullDown {
      -webkit-animation: sdb04 3s infinite;
      animation: sdb04 3s infinite;
    }
    .pullUp{
      -webkit-animation: sdb04rotated 3s infinite;
      animation: sdb04rotated 3s infinite;
    }
    @keyframes sdb04 {
      0% {
        transform: rotate(0deg) translate(0, 0);
      }
      50% {
        transform: rotate(0deg) translate(0, 5px);
      }
      100% {
        transform: rotate(0deg) translate(0, 0);
      }
    }
    @-webkit-keyframes sdb04 {
      0% {
        transform: rotate(0deg) translate(0, 0);
      }
      50% {
        transform: rotate(0deg) translate(0, 5px);
      }
      100% {
        transform: rotate(0deg) translate(0, 0);
      }
    }
    @keyframes sdb04rotated {
      0% {
        transform: rotate(180deg) translate(0, 0);
      }
      50% {
        transform: rotate(180deg) translate(0, 5px);
      }
      100% {
        transform: rotate(180deg) translate(0, 0);
      }
    }
    @-webkit-keyframes sdb04rotated {
      0% {
        transform: rotate(180deg) translate(0, 0);
      }
      50% {
        transform: rotate(180deg) translate(0, 5px);
      }
      100% {
        transform: rotate(180deg) translate(0, 0);
      }
    }
  }
  .showPic {
    width: 100%;
    height: 217px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .hidPic {
    ul{
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .pic-box{
      height: 150px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .pic-box:nth-child(5n) {
      width: 100%;
    }
    .pic-box:nth-child(10n+1), .pic-box:nth-child(10n+4), .pic-box:nth-child(10n+6), .pic-box:nth-child(10n+9) {
      width: 40%;
    }
    .pic-box:nth-child(10n+2), .pic-box:nth-child(10n+3), .pic-box:nth-child(10n+7), .pic-box:nth-child(10n+8) {
      width: 60%;
    }
  }
</style>
