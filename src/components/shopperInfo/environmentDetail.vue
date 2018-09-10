<template>
  <div class="environment-wrapper">
    <div class="video-wrapper" v-if="videoUrl">
      <img class="img" ref="videoCoverImg" :src="videoCoverImg" @click="playVideo">
      <video :src="videoUrl" ref="video" class="video" @click="playClick($event)"></video>
    </div>
    <div class="pic-wrapper" v-if="imgList.length">
      <img class="previewer-img" v-for="(item, index) in picList" :src="item.src" alt="" @click="show(index)">
      <div v-transfer-dom v-if="picList">
        <previewer :list="picList" ref="previewer"
                   :options="options"></previewer>
      </div>
    </div>
  </div>
</template>

<script>
import {TransferDom, Previewer} from 'vux';
import videoCoverImg from '../../assets/images/playhold_icon750.png';
export default {
  name: 'EnvironmentDetail',
  directives: {
    TransferDom
  },
  components: {
    'previewer': Previewer
  },
  created: function () {
    this.getEnvironmentDetail();
  },
  data () {
    return {
      videoCoverImg: videoCoverImg,
      videoUrl: '',
      imgList: [],
      options: {
        getThumbBoundsFn (index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.previewer-img')[index];
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
      return this.getPicList();
    }
  },
  methods: {
    getEnvironmentDetail () {
      let storeId = this.$route.params.storeId;
      let _this_ = this;
      _this_.$JHttp({
        method: 'get',
        url: window.baseURL + '/shop/store/info?storeId=' + storeId
      }).then(res => {
        if (res.status === 100) {
          let data = res.data;
          _this_.imgList = data.annexList;
          _this_.videoUrl = data.storeVideoUrl;
        } else {
          _this_.$vux.toast.show({
            type: 'cancel',
            text: res.msg
          })
        }
      }).catch(e => {
        console.log(e)
      })
    },
    playVideo () {
      let video = this.$refs.video;
      let videoCoverImg = this.$refs.videoCoverImg;
      video.play();
    },
    playClick (event) {
      let video = event.currentTarget;
      video.paused ? video.play() : video.pause()
      video.webkitEnterFullScreen();
    },
    show (index) {
      this.$refs.previewer.show(index);
    },
    getPicList () {
      let imgList = this.imgList;
      let picList = [];
      if (imgList && imgList.length) {
        imgList.forEach((src) => {
          picList.push({
            src: src
          });
        });
      }
      return picList;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.environment-wrapper {
  width: 100%;
  background-color: #fff;
  font-size: 0;
  .video-wrapper {
    display: inline-block;
    width: 375px;
    height: 375px;
    position: relative;
    margin-bottom: 1.5px;
    .img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .video {
      width: 100%;
      height: 100%;
    }
  }
  .pic-wrapper {
    text-align: justify;
    .previewer-img {
      width: 125px;
      height: 125px;
      /*margin-right: 1.5px;*/
      margin-bottom: 1.5px;
    }
    img:last-child {
      margin-right: 0;
    }
  }
}
</style>
