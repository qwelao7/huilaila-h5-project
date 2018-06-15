<template>
<div class="promotionList commonHeader">
  <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
    <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100" :left-options="{ backText: '' }" :title=title></x-header>
    <div class="content">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <div class="list">
            <div class="item" v-for="item in promotionList" v-if="promotionList.length" @click="promotionDetail(item)">
              <img :src="item.promotionImg">
            </div>
          </div>
        </div>
      </j-pull>
    </div>
  </view-box>
</div>
</template>
<script>
  import { XHeader, ViewBox, querystring } from 'vux'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'promotionList',
    components: {
      XHeader,
      ViewBox,
      JPull
    },
    data () {
      return {
        title: '推荐专题',
        curPage: 1,
        pageSize: 20,
        hasMore: true,
        promotionList: []
      }
    },
    created () {
      this.getPromotionList()
    },
    methods: {
      getPromotionList (loaded) {
        let _this_ = this;
        let params = {
          curPage: this.curPage,
          pageSize: this.pageSize
        }
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/goods/getPromotionListNew?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            if (_this_.curPage === 1) {
              _this_.promotionList = res.data.resultList;
            } else {
              _this_.promotionList = _this_.promotionList.concat(res.data.resultList);
            }
            if (loaded) {
              loaded(res.data.pageResult.hasMore)
            }
          }
        }).catch(e => {
          console.log(e)
        });
      },
      refreshData (loaded) {
        this.curPage = 1;
        if (loaded) {
          loaded(true)
        }
        this.getPromotionList(loaded)
      },
      loadMore (loaded) {
        this.curPage++;
        if (loaded) {
          loaded(true)
        }
        this.getPromotionList(loaded)
      },
      promotionDetail (item) {
        let params = {
          promotionId: item.promotionId,
          storeIds: item.h5url.split('storeIds=')[1]
        }
        this.$router.push('/promotionDetail?' + querystring.stringify(params))
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.promotionList {
  height: 100%;
  .content {
    height: 100%;
    .list {
      padding: 0 15px;
      .item {
        width: 345px;
        height: 167px;
        /*border-radius: 10px;*/
        margin-top: 20px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
        /*&:first-child {*/
          /*img {*/
            /*padding-top: 20px;*/
            /*border-radius: 10px;*/
          /*}*/
        /*}*/
      }
    }
  }
}
</style>
