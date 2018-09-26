<template>
  <div class="index-wrapper">
    <div class="content-wrapper">
      <router-view></router-view>
    </div>
    <div class="tab-wrapper">
      <div class="top-line"></div>
      <div class="tab-item" :class="{activated: tabStatus[0]}" @click="changeTab(0)">
        <span class="icon icon-park"></span>
        <span class="title">我要停车</span>
      </div>
      <div class="tab-item" :class="{activated: tabStatus[1]}" @click="changeTab(1)">
        <span class="icon icon-share"></span>
        <span class="title">我要共享</span>
      </div>
      <div class="tab-item" :class="{activated: tabStatus[2]}" @click="changeTab(2)">
        <span class="icon icon-record"></span>
        <span class="title">停车记录</span>
      </div>
    </div>
    <div class="home-dir-wrapper" v-if="showDirModal">
      <!--首屏指引Modal begin-->
      <div class="mask"></div>
      <span class="home-dir"></span>
      <div class="btn-know" @click="hideModal"></div>
      <!--首屏指引Modal end-->
    </div>
  </div>
</template>

<script>
  import router from '../../router/index';
  import {Group, Cell} from 'vux';
  export default {
    name: 'app',
    data () {
      return {
        isNeedHomeDir: true
      }
    },
    computed: {
      tabStatus: function () {
        return this.$store.state.pageCfg.tabStatus;
      },
      showDirModal1: function () {
        return false;
      },
      showDirModal: function () {
        let token = localStorage.getItem('token');
        let key = token + '_dir';
        let showDirModalStr = localStorage.getItem(key);
        if (showDirModalStr === '0') {
          return false;
        } else {
          if (this.isNeedHomeDir) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    methods: {
      changeTab: function (index) {
        if (index === 0) {
          this.$store.commit('updateTabStatus', {
            tabStatus: [true, false, false]
          });
          router.push('/home/park');
        } else if (index === 1) {
          this.$store.commit('updateTabStatus', {
            tabStatus: [false, true, false]
          });
          router.push('/home/share');
        } else if (index === 2) {
          this.$store.commit('updateTabStatus', {
            tabStatus: [false, false, true]
          });
          router.push('/home/records');
        }
      },
      hideModal: function () {
        let token = localStorage.getItem('token');
        let key = token + '_dir';
        localStorage.setItem(key, '0');
        // 同时关闭指引
        this.isNeedHomeDir = false;
      }
    },
    components: {
      Group,
      Cell
    }
  }
</script>

<style scoped lang="less">
  @import '../../styles/setOnepx';
  .index-wrapper {
    display: flex;
    flex-direction: column;
    position: fixed;
    width: 100%;
    height: 100%;
    .content-wrapper {
      flex: 1;
      overflow: auto;
      position: relative;
      /*解决滑动卡顿的情况*/
      -webkit-overflow-scrolling: touch;
      z-index: 1;
    }
    .tab-wrapper {
      flex: 0 0 1.56rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: #fff;
      position: relative;
      .top-line {
        .setTopLine(#ebebeb);
      }
      .tab-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.133333rem 0;
        .icon {
          display: block;
          width: 0.733333rem;
          height: 0.746667rem;
          background-size: 100%;
          background-repeat: no-repeat;
        }
        .icon-park {
          background-image: url("../../assets/img/@2x/park-nav.png");
        }
        .icon-share {
          background-image: url("../../assets/img/@2x/share-nav.png");
        }
        .icon-record {
          background-image: url("../../assets/img/@2x/record-nav.png");
        }
        .title {
          font-size: 12px;
          color: #aaa;
        }
      }
      .activated {
        .icon-park {
          background-image: url("../../assets/img/@2x/park-nav-activated.png");
        }
        .icon-share {
          background-image: url("../../assets/img/@2x/share-nav-activated.png");
        }
        .icon-record {
          background-image: url("../../assets/img/@2x/record-nav-activated.png");
        }
        .title {
          color: #18adfb
        }
      }
    }
    .home-dir-wrapper {
      position: absolute;
      width: 100%;
      height: 100%;
      .mask {
        position: fixed;
        z-index: 1000;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
      }
      .home-dir {
        z-index: 9999;
        position: fixed;
        width: 5.306667rem;
        height: 3.066667rem;
        left: 50%;
        bottom: 1.78rem;
        transform: translateX(-50%);
        display: inline-block;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url("../../assets/img/@2x/home-dir@2x.png");
      }
      .btn-know {
        z-index: 9999;
        position: fixed;
        left: 50%;
        bottom: 2.2rem;
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        transform: translateX(-50%);
        width: 1.46rem;
        height: 0.666667rem;
      }
    }
  }

  [data-dpr="2"]
  .index-wrapper {
    .tab-wrapper {
      .tab-item {
        .title {
          font-size: 20px;
        }
      }
    }
  }

  [data-dpr="3"]
  .index-wrapper {
    .tab-wrapper {
      .tab-item {
        .icon-park {
          background-image: url("../../assets/img/@3x/park-nav@3x.png");
        }
        .icon-share {
          background-image: url("../../assets/img/@3x/share-nav@3x.png");
        }
        .icon-record {
          background-image: url("../../assets/img/@3x/record-nav@3x.png");
        }
        .title {
          font-size: 38px;
        }
      }
      .activated {
        .icon-park {
          background-image: url("../../assets/img/@3x/park-nav-activated@3x.png");
        }
        .icon-share {
          background-image: url("../../assets/img/@3x/share-nav-activated@3x.png");
        }
        .icon-record {
          background-image: url("../../assets/img/@3x/record-nav-activated@3x.png");
        }
      }
    }
    .home-dir-wrapper {
      .home-dir {
        background-image: url("../../assets/img/@3x/home-dir@3x.png");
      }
    }
  }

</style>
