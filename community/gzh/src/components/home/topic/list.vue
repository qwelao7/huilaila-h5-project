<template>
  <div class="commonHeader">
    <j-pull :refreshFunc="refresh" :loadMoreFunc="loadMore">
      <div slot="jpull-list">
        <ul class="topic-list" v-show="list.length > 0">
          <li v-for="item in list" @click="linkTo(item.topicType)">
            <img :src="item.topicIcon" alt="">
            <div class="wrapper">
              <div class="head">
                <div class="title" v-text="item.topicTitle"></div>
                <div class="number-wrapper">
                  <img src="../../../assets/images/participation_icon_32red.png" alt="">
                  <span class="number" v-text="item.topicNumber"></span>
                </div>
              </div>
              <div class="basic-info" v-text="item.topicContent"></div>
            </div>
          </li>
        </ul>
        <div class="placeholder" v-show="!list.length">
          <span class="img"></span>
          <p class="text">什么都没发现，去别处看看吧</p>
        </div>
      </div>
    </j-pull>

  </div>
</template>
<script>
  import {querystring, TransferDom, XDialog, ViewBox, XHeader, Group, CellBox, Badge} from 'vux'
  import JPull from '../../base/JPull/JPull'

  export default {
    name: 'topicList',
    directives: {
      TransferDom
    },
    components: {
      XDialog,
      JPull,
      ViewBox,
      XHeader,
      CellBox,
      Group,
      Badge
    },
    data () {
      return {
        list: [],
        communityId: ''
      }
    },
    created () {
      this.communityId = localStorage.getItem('communityId')
      this.community_all = localStorage.getItem('community_all')
      this.getData();
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.$emit('changeIndex', 1)
        if (vm.communityId !== localStorage.getItem('communityId')) {
          vm.communityId = localStorage.getItem('communityId')
          vm.refresh()
        }
        if (vm.community_all !== localStorage.getItem('community_all')) {
          vm.community_all = localStorage.getItem('community_all')
          vm.refresh()
        }
      })
    },
    methods: {
      refresh (loaded) {
        this.getData(loaded);
      },
      loadMore (loaded) {
        this.getData(loaded);
      },
      getData (loaded) {
        this.$vux.loading.show({text: '加载中'});
        this.$JHttp({
          method: 'get',
          url: `${window.baseURL}/neighbor/topic/home`,
          headers: {
            defCommunityId: localStorage.getItem('communityId'),
            communityAll: localStorage.getItem('community_all')
          }
        }).then(res => {
          this.list = res.data;
          if (loaded) loaded();
          this.$vux.loading.hide();
        }).catch(e => {
          this.$vux.loading.hide();
        })
      },
      linkTo (topicType) {
        this.$router.push(`/topicDetail/${topicType}`);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .commonHeader {
    height: 100%;
  }

  ul.topic-list {
    background: #fff;
    padding: 　0 .533rem .4rem;
    li {
      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        margin-bottom: 0;
      }
      height: 2.133rem;
      display: flex;
      margin: 0.533rem 0;
      & > img {
        width: 1.653rem;
        height: 1.653rem;
        align-self: center;
      }
      .wrapper {
        margin-left: .48rem;
        width: 100%;
      }
      .head {
        width: 100%;
        height: .666rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: .213rem;
        .title {
          color: #333;
          font-size: .48rem;
          line-height: .666rem;
        }
        img {
          width: .32rem;
          height: .32rem;
        }
        .number {
          font-size: .32rem;
          color: #333;
          height: .4rem;
          line-height: .4rem;
          margin-left: .2rem;
        }
        .number-wrapper {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }
      .basic-info {
        width: 100%;
        font-size: .32rem;
        color: #333;
        line-height: .44rem;
        margin: .4rem 0;
      }
    }
  }

  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    .img {
      width: 225px;
      height: 225px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url('../../../assets/images/No-content.png');
    }
    .text {
      font-size: 15px;
    }
  }
</style>