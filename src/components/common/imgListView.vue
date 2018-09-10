<template>
  <div class="img-list-wrapper" v-if="imgList && imgList.length">
    <div class="one-img-wrapper" v-if="imgList.length === 1">
      <img class="one-img previewer-img-1" :src="imgList[0]" @click="show1(0)">
      <div v-transfer-dom>
        <previewer :list="picList" ref="previewer1"
                   :options="options1"></previewer>
      </div>
    </div>
    <div class="two-img-wrapper" v-if="imgList.length === 2">
      <img  class="img previewer-img-2" :src="imgList[0]" @click="show2(0)">
      <img  class="img previewer-img-2" :src="imgList[1]" @click="show2(1)">
      <div v-transfer-dom>
        <previewer :list="picList" ref="previewer2"
                   :options="options2"></previewer>
      </div>
    </div>
    <div class="three-img-wrapper" v-if="imgList.length === 3">
      <img class="three-img-first previewer-img-3" :src=imgList[0] @click="show3(0)">
      <div class="three-img-second">
        <img class="img previewer-img-3" :src="imgList[1]" @click="show3(1)">
        <img class="img previewer-img-3" :src="imgList[2]" @click="show3(2)">
      </div>
      <div v-transfer-dom>
        <previewer :list="picList" ref="previewer3"
                   :options="options3"></previewer>
      </div>
    </div>
    <div class="four-img-wrapper" v-if="imgList.length === 4">
      <img class="img previewer-img-4" v-for="(url, index) in imgList" :key="index" :src="url" @click="show4(index)">
      <div v-transfer-dom>
        <previewer :list="picList" ref="previewer4"
                   :options="options4"></previewer>
      </div>
    </div>
    <div class="more-img-wrapper" v-if="imgList.length > 4">
      <scroller lock-y :scrollbar-x=false>
        <div class="box" :style="{width: boxWidth}">
          <img class="previewer-img-more" v-for="(item, index) in picList" :src="item.src" alt="" @click="showMore(index)">
          <div v-transfer-dom v-if="picList">
            <previewer :list="picList" ref="previewerMore"
                       :options="optionsMore"></previewer>
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>
<script>
  import {Scroller, TransferDom, Previewer} from 'vux';
  // 获取根节点字体大小
  const htmlFontSize = getComputedStyle(window.document.documentElement)['font-size'];
  const remRate = parseFloat(htmlFontSize.substring(0, (htmlFontSize.length - 2)));
  export default {
    name: 'ImgListView',
    props: {
      imgList: {
        type: Array,
        default () {
          return []
        }
      }
    },
    directives: {
      TransferDom
    },
    components: {
      'scroller': Scroller,
      'previewer': Previewer
    },
    data () {
      return {
        options1: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-img-1')[index];
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
        options2: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-img-2')[index];
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
        options3: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-img-3')[index];
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
        options4: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-img-4')[index];
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
        optionsMore: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-img-more')[index];
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
    computed: {
      picList () {
        let picList = this.getPreviewImgList(this.imgList);
        return picList;
      },
      boxWidth () {
        let len = this.picList.length;
        if (len) {
          return ((115 * (len - 1) + 100) / remRate) + 'rem';
        } else {
          return 0;
        }
      }
    },
    methods: {
      getPreviewImgList (list) {
        let img = {};
        let imgList = [];
        list.forEach((res, index) => {
          if (index <= 5) {
            img = {
              msrc: res,
              src: res
            };
            imgList.push(img)
          }
        });
        return imgList
      },
      show1 (index) {
        this.$refs.previewer1.show(index);
      },
      show2 (index) {
        this.$refs.previewer2.show(index);
      },
      show3 (index) {
        this.$refs.previewer3.show(index);
      },
      show4 (index) {
        this.$refs.previewer4.show(index);
      },
      showMore (index) {
        this.$refs.previewerMore.show(index);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .img-list-wrapper {
    width: 100%;
    font-size: 0;
    background-color: #fff;
    .one-img-wrapper {
      .one-img {
        width: 173px;
        height: 173px;
      }
    }
    .two-img-wrapper {
      .img {
        width: 165px;
        height: 165px;
        margin-right: 15px;
      }
      img:last-child {
        margin-right: 0;
      }
    }
    .three-img-wrapper {
      display: flex;
      .three-img-first {
        width: 170px;
        height: 170px;
        margin-right: 15px;
      }
      .three-img-second {
        width: 170px;
        height: 170px;
        display: flex;
        flex-direction: column;
        -webkit-flex-direction: column;
        .img {
          height: 80px;
          width: 160px;
          margin-bottom: 10px;
        }
      }
    }
    .four-img-wrapper {
      .img {
        width: 75px;
        height: 75px;
        margin-right: 15px;
      }
      img:last-child {
        margin-right: 0;
      }
    }
    .more-img-wrapper {
      .previewer-img {
        width: 75px;
        height: 75px;
        margin-right: 15px;
      }
      img:last-child {
        margin-right: 0;
      }
    }

  }

</style>
