<template>
  <div class="autonomy-statute-list commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="content">
        <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
          <div slot="jpull-list">
            <div class="list">
              <div class="item" v-for="item in autonomyStatuteList" v-if="autonomyStatuteList.length" @click="autonomyStatuteDetail(item.autonomyId)">
                <div class="title" v-text="item.autonomyTitle"></div>
                <div class="time" v-text="item.intime"></div>
              </div>
            </div>
          </div>
        </j-pull>
      </div>

    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader } from 'vux'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'autonomy-statute-list',
    components: {
      ViewBox,
      XHeader,
      JPull
    },
    data () {
      return {
        title: '自治规约',
        curPage: 1,
        pageSize: 20,
        hasMore: true,
        autonomyStatuteList: []
      }
    },
    created () {
      this.getAutonomyList()
    },
    methods: {
      getAutonomyList (loaded) {
        let _this_ = this;
        _this_.$JHttp({
          method: 'GET',
          url: window.baseURL + '/autonomy/autonomyList',
          params: {
            curPage: _this_.curPage,
            pageSize: _this_.pageSize
          }
        }).then(res => {
          if (res.status === 100) {
            if (_this_.curPage === 1) {
              _this_.autonomyStatuteList = res.data.resultList;
            } else {
              _this_.autonomyStatuteList = _this_.autonomyStatuteList.concat(res.data.resultList);
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
        this.getAutonomyList(loaded)
      },
      loadMore (loaded) {
        this.curPage++;
        if (loaded) {
          loaded(true)
        }
        this.getAutonomyList(loaded)
      },
      autonomyStatuteDetail (autonomyId) {
        this.$router.push('/autonomyStatuteDetail?autonomyId=' + autonomyId)
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.autonomy-statute-list {
  height: 100%;
  .content {
    height: 100%;
    .list {
      padding: 0 15px;
      .item {
        margin-top: 15px;
        padding-bottom: 18px;
        border-bottom: 1px solid #D8D8D8;
        .title {
          font-size: 18px;
          color: #333333;
          margin-bottom: 10px;
        }
        .time {
          font-size: 12px;
          color: #AAAAAA;
        }
      }
    }
  }
}
</style>
