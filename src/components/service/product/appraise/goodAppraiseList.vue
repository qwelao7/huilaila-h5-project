<template>
  <div class="good-appraise">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <appraiseItem v-for="item in appraiseList" :item="item"></appraiseItem>
          <div class="no-product-info" v-if="!this.appraiseList || this.appraiseList.length < 1">
            <div class="no-product-container">
              <img class="no-product-img" src="../../../../assets/images/No-signal.png"/>
              <span class="no-product-tip">哎呀~这里什么都没有</span>
            </div>
          </div>
        </div>
      </j-pull>
  </div>
</template>
<script>
  import {querystring} from 'vux'
  import JPull from '../../../base/JPull/JPull'
  import appraiseItem from './appraiseItem'

  export default{
    name: 'productAppraiseList',
    components: {
      JPull,
      appraiseItem
    },
    created () {
      console.log(this.$route.params.productId);
      this.getData();
    },
    props: {
      hasWord: Boolean
    },
    data () {
      return {
        curPage: 1,
        pageSize: 20,
        appraiseList: []
      }
    },
    methods: {
      getData (loaded) {
        let this_ = this;
        let params = {
          curPage: this_.curPage,
          pageSize: this_.pageSize,
          productId: this_.$route.params.productId,
          appraiseFilter: 5, // 0表示全部，5表示满意，3表示一般，1表示失望，6表示有图
          hasWord: this_.isOnlyWorld ? 1 : 0 // 查看有文字评论，否则为全部
        };
        this_.$vux.loading.show({
          text: '加载中'
        });
        this_.$JHttp({
          method: 'post',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/serverShu/product/appraiseList?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            this_.$vux.loading.hide();
            this_.hasMore = res.data.pageResult.hasMore;
            if (loaded) {
              loaded(this_.hasMore)
            }
            let obj = {};
            let data = res.data.resultList;
            if (data) {
              data.forEach(value => {
                obj = {
                  appraiseContent: value.appraiseContent,
                  appraiseCount: value.appraiseCount,
                  appraiseTime: value.appraiseTime,
                  appraiseUser: value.appraiseUser,
                  headPicName: value.headPicName,
                  isReply: value.isReply,
                  nickName: value.nickName,
                  appraiseImgs: value.appraiseImgs,
                  replyContent: value.replyContent,
                  productScore: value.productScore,
                  productId: value.productId,
                  satisfaction: value.satisfaction,
                  skuProperties: value.skuProperties
                };
                this.appraiseList.push(obj);
              })
            }
          } else {
            this_.$vux.loading.hide();
            this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e);
          this_.$vux.loading.hide();
        })
      },
      refreshData (loaded) {
        this.appraiseList = [];
        this.curPage = 1;
        this.getData(loaded)
        console.log('刷新')
      },
      loadMore (loaded) {
        this.curPage++;
        this.getData(loaded);
      }
    },
    computed: {
      isOnlyWorld () {
        return this.$store.state.isOnlyWorld;
      }
    },
    watch: {
      isOnlyWorld: function () {
        this.refreshData()
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .good-appraise {
      height: 100%;
      width: 100%;
    .no-product-info {
      color: #aaa;
      font-size: 15px;
      position: relative;
      .no-product-container {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, 50%);
      }
      .no-product-img {
        width: 150px;
        height: 150px;
      }
      .no-product-tip {
        height: 24px;
        margin-top: 10px;
        line-height: 24px;
      }
    }
  }
</style>
