<template>
  <div class="commonHeader">
    <div class="commonHeader">
      <j-pull :refreshFunc="refresh" :loadMoreFunc="loadMore"
              :style="{height: isServe ? 'calc(100% - 1.173rem)' : '100%'}">
        <div slot="jpull-list">
          <div v-if="isServe">
            <ul class="daren" v-show="list.length > 0">
              <li v-for="item in list" @click="goDetial(item)">
                <img v-if="!item.groupIcon" src="../../../assets/images/studio_Illustration_200.png" alt="">
                <j-img v-if="item.groupIcon" :osskey="item.groupIcon" :custom-width="100"
                       :custom-height="100"></j-img>
                <div class="info">
                  <p class="title">{{item.groupTitle}}</p>
                  <p class="brief" style="-webkit-box-orient: vertical;">{{item.groupIntro}}</p>
                  <p class="tags">
                    <span>#{{item.groupTag}}</span>
                  </p>
                </div>
              </li>
            </ul>
            <div class="serve-close" v-show="!list.length">
              <img src="../../../assets/images/No-interaction.png" alt="">
              <p>什么都没发现，去别处看看吧</p>
            </div>
          </div>
          <div class="serve-close" v-if="!isServe">
            <img src="../../../assets/images/No-interaction.png" alt="">
            <p>达人已关闭，如有问题请联系生活服务中心</p>
          </div>
        </div>
      </j-pull>
    <router-link v-if="homePageVisible" class="bottom-btn" :to="`/darenDetail`">我的达人主页</router-link>
    <a v-if="applyBtnVisible" class="bottom-btn" @click="apply">申请成为达人</a>
    </div>
  </div>

</template>
<script>
  import {querystring, TransferDom} from 'vux'
  import JPull from '../../base/JPull/JPull'
  import JImg from 'components/common/img/jImg'

  export default {
    name: 'topicList',
    directives: {
      TransferDom
    },
    components: {
      JPull,
      'j-img': JImg
    },
    data () {
      return {
        list: [],
        isDaren: false,
        hasToken: false, // 是否token值，用来判断是否是游客
        isServe: true,
        curPage: 1,
        pageSize: 10,
        hasMore: true,
        communityId: ''
      }
    },
    computed: {
      homePageVisible: function () {
        return this.isServe && this.isDaren && this.hasToken;
      },
      applyBtnVisible: function () {
        return this.isServe && !this.isDaren && this.hasToken;
      }
    },
    created () {
      this.communityId = localStorage.getItem('communityId')
      this.community_all = localStorage.getItem('community_all')
      this.hasToken = Boolean(localStorage.getItem('token'));
      this.getData();
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.$emit('changeIndex', 4)
        if (vm.communityId !== localStorage.getItem('communityId')) {
          vm.communityId = localStorage.getItem('communityId')
          vm.refresh()
        } else if (vm.hasToken !== Boolean(localStorage.getItem('token'))) {
          vm.hasToken = Boolean(localStorage.getItem('token'))
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
        this.curPage = 1;
        this.list = [];
        this.getData(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getData(loaded);
      },
      getData (loaded) {
        let that = this;
        let params = {
          curPage: this.curPage,
          pageSize: this.pageSize
        }
        this.$vux.loading.show({text: '加载中'});
        this.$JHttp({
          method: 'get',
          //   url: `${window.oldBaseURL}/scNeighborGroupActionV36!queryWorkRoomList.action`,
          //   data: params,
          //   transformRequest: [function (data) {
          //     let ret = '';
          //     for (let it in data) {
          //       ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          //     }
          //     return ret
          //   }],
          //   headers: {
          //     'Content-Type': 'application/x-www-form-urlencoded'
          //   }
          headers: {
            defCommunityId: localStorage.getItem('communityId'),
            communityAll: localStorage.getItem('community_all')
          },
          url: window.baseURL + '/index/workroom?' + querystring.stringify(params)
        })
        .then(res => {
            that.$vux.loading.hide();
            console.log(res.data)
            that.hasMore = res.data.data.pageResult.hasMore;
          if (loaded) loaded(this.hasMore);
          if (res.data) {
              that.isServe = res.data.isOpenWorkRoomSubject === true;
              that.isDaren = res.data.isApplyWorkRoom === true; // 是否开通达人
              if (res.data.data.resultList) {
                that.list = [...that.list, ...res.data.data.resultList];
              }
              that.list.forEach(item => {
                if (item.groupIcon) {
                  item.groupIcon = window.aliyunImgUrl + item.groupIcon
            }
              })
          }
          })
          .catch(() => {
            that.$vux.loading.hide();
        })
      },
      apply () {
        localStorage.removeItem('daren.apply.params');
        this.$router.push({path: '/darenApply', query: {title: '申请达人'}});
      },
      goDetial (item) {
        this.$router.push({path: '/darenDetail', query: {id: item.id}})
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  ul.daren {
    padding: 0 15px;
    padding-top: 20px;
    background-color: #fff;
    li {
      display: flex;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      & > img {
        width: 100px;
        height: 100px;
        min-width: 100px;
      }
      .info {
        margin-left: 10px;
        .title {
          font-size: 18px;
          line-height: 25px;
          margin-top: 8px;
          margin-bottom: 17px;
          font-family: 'pingfang_scmedium pingfang_scregular'
        }
        .brief {
          font-size: 12px;
          line-height: 17.5px;
          margin-bottom: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          word-break: break-all;
        }
        .tags {
          font-size: 12px;
          line-height: 17.5px;
        }
        span {
          display: inline;
        }
      }
    }
  }

  .bottom-btn {
    font-size: 15px;
    text-align: center;
    line-height: 44px;
    height: 44px;
    overflow: hidden;
    position: absolute;
    background-color: #fff;
    box-shadow: 0 -1px 0 0 #D8D8D8;
    width: 100%;
    bottom: 0;
    z-index: 500;
    color: #333;
  }

  .commonHeader {
    position: relative;
    height: 100%;
  }

  .serve-close {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 124px;
    margin-bottom: 248px;
    img {
      width: 150px;
      height: 150px;
    }
    p {
      margin-top: 10px;
      color: #aaaaaa;
      font-size: 15px;
    }
  }
</style>
