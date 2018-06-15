<template>
  <div class="commonHeader buildLive">
    <view-box ref="viewBox" body-padding-top=".94rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="小区动态"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      </x-header>
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <div v-for="item in buildLiveList" v-if="buildLiveList.length">
            <comCard :buildList1="item"></comCard>
          </div>
        </div>
      </j-pull>
    </view-box>
  </div>
</template>
<script>
  import {XHeader, ViewBox} from 'vux'
  import comCard from '../comCard'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'buildLive',
    components: {
      XHeader,
      ViewBox,
      JPull,
      comCard
    },
    data () {
      return {
        curPage: 1,
        pageSize: 10,
        type: 12,
        hasMore: true,
        buildLiveList: [],
        buildList1: [{
          title: '',
          name: '',
          img: '',
          like: '',
          message: '',
          dataInstruction: '',
          value: ''
        }]
      }
    },
    created () {
      this.getBuildLive();
    },
    methods: {
      refreshData (loaded) {
        this.curPage = 1;
        this.buildLiveList = [];
        this.getBuildLive(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getBuildLive(loaded);
      },
      getBuildLive (loaded) {
        this.$vux.loading.show({
          text: '加载中'
        });
        let that = this;
        that.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/community/focusinfo/list?type=' + that.type + '&curPage=' + that.curPage + '&pageSize=' + that.pageSize
        }).then(res => {
          if (loaded) {
            loaded(that.hasMore)
          }
          if (res.status === 100) {
            this.$vux.loading.hide();
            that.hasMore = res.data.pageResult.hasMore;
            let data = res.data.resultList;
            data.forEach(res => {
              let obj = {
                name: res.title,
                img: res.smallPic,
                like: res.praisenum,
                message: res.commentNum,
                dataInstruction: res.intime,
                id: res.id,
                isPraise: res.isPraise,
                praisenum: res.praisenum,
                commentNum: res.commentNum,
                value: 'buildLive',
                type: res.type
              };
              that.buildLiveList.push(obj)
            });
          } else {
            this.$vux.loading.hide();
            this.$vux.toast.show({
              type: 'cancel',
              title: res.msg
            })
          }
        }).catch(err => {
          this.$vux.loading.hide();
          this.$vux.toast.show({
            type: 'cancel',
            title: err
          })
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .buildLive{
    height: 100%;
    background-color: #f7f7fa;
  }
</style>
