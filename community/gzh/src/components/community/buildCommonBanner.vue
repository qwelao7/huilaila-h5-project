<template>
  <div class="detailBanner">
    <div>
      <p class="title padding">{{commonLists.title}}</p>
      <p class="time padding">{{commonLists.intime}}</p>
      <!--<div v-if="commonLists.previewPic">-->
        <!--<div class="image" >-->
          <!--<img v-for="(item, index) in commonLists.previewPic" class="previewer-demo-img" :src="item.src" alt="" @click="show(index)">-->
        <!--</div>-->
        <!--<div v-transfer-dom v-if="commonLists.previewPic">-->
          <!--<previewer :list="commonLists.previewPic" ref="previewer" :options="options"></previewer>-->
        <!--</div>-->
      <!--</div>-->
      <div class="description padding" style="overflow: hidden">
        <p v-html="commonLists.content"></p>
      </div>
    </div>
  </div>
</template>
<script>
  import {TransferDom, Previewer} from 'vux'
  export default {
    name: 'detailBanner',
    directives: {
      TransferDom
    },
    components: {Previewer},
    props: {
      commonLists: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data () {
      return {
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
        },
        list: []
      }
    },
    created () {
      this.list = this.commonLists.previewPic
    },
    methods: {
      show (index) {
        this.$refs.previewer.show(index)
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .detailBanner{
    background-color: #ffffff;
    padding-top: 10px;
    .padding{
      padding: 0 15px;
    }
    .title{
      word-break: break-all;
      margin-bottom: 10px;
      font-size: 24px;
      color: #333333;
      font-weight: bold;
    }
    .time{
      font-size: 12px;
      color: #aaaaaa;
      margin-bottom: 15px;
    }
    .image{
      height: 217px;
      margin-bottom: 15px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .description{
      word-break: break-all;
      font-size: 14px;
      /*font-weight: bold;*/
      color: #333333;
      line-height: 2;
      padding-bottom: 20px;
      p{
        text-indent: 2em;
      }
    }
  }
</style>
