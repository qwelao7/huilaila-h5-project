<template>
    <div class="log-item-wrapper">
      <div class="header">
        <!--<img class="header-img" :src="log.headPicName" alt="">-->
        <j-img :osskey="log.headPicName" :custom-class="'header-img'" :custom-width="40" :custom-height="40"></j-img>
        <div class="info">
          <span class="name" v-text="log.nickname"></span>
          <span class="time" v-text="log.intime"></span>
        </div>
      </div>
      <div class="introduce" v-text="log.content"></div>
      <div class="content-img-wrapper" v-if="log.picSrcList && log.picSrcList.length">
        <!--<img class="previewer-demo-img" v-for="(items, index) in log.picSrcList" :key="index" :class="{'previewer-demo-img-wrap': (index + 1) % 3 === 0}" :src="items.src"-->
             <!--alt="" @click="show(index)">-->
        <j-img v-for="(items, index) in log.picSrcList" :key="index"
               :osskey="items.src" :custom-class="['previewer-demo-img', 'previewer-demo-img-' + picIndex, (index + 1) % 3 === 0 ? 'previewer-demo-img-wrap' : '']"
               :custom-width="113" :custom-height="113"
               @click.native="show(index)"></j-img>
        <div v-transfer-dom>
          <previewer :ref="'previewer-' + picIndex" :list="log.picSrcList" :options="options">
          </previewer>
        </div>
      </div>
    </div>
</template>

<script>
  import {Previewer, TransferDom} from 'vux'
  import JImg from 'components/common/img/jImg'
  export default {
    name: 'LogItem',
    directives: {
      TransferDom
    },
    components: {
      Previewer,
      'j-img': JImg
    },
    props: {
      log: {},
      picIndex: 0
    },
    created: function () {
    },
    data () {
      let _this_ = this;
      return {
        options: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-demo-img-' + _this_.picIndex)[index];
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect();
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          }
        }
      }
    },
    methods: {
      show (index) {
        this.$refs['previewer-' + this.picIndex].show(index);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.log-item-wrapper {
  background-color: #fff;
  margin-top: 10px;
  padding: 0 0.4rem;
  .header {
    padding-top: 10px;
    display: flex;
    .header-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .info {
      .name {
        font-size: 15px;
      }
      .time {
        font-size: 12px;
        white-space: nowrap;
      }
    }
  }
  .introduce {
    word-wrap: break-word;
    margin: 12px 0;
  }
  .content-img-wrapper {
    padding-bottom: 18px;
    .previewer-demo-img {
      width: 113px;
      height: 113px;
      margin-bottom: 2px;
      margin-right: 3px;
    }
    .previewer-demo-img-wrap {
      margin-right: 0;
    }
  }
}
</style>
