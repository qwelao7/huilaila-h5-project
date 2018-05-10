<template>
  <div class="announcement commonHeader">
    <view-box ref="viewBox" body-padding-top=".94rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="小区公告"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      </x-header>
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <div v-for="item in announcementList" v-if="announcementList.length">
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
    name: 'announcement',
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
        type: 13,
        hasMore: true,
        announcementList: []
      }
    },
    created () {
      this.getAnnouncementList();
    },
    methods: {
      refreshData (loaded) {
        this.curPage = 1;
        this.announcementList = [];
        this.getAnnouncementList(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getAnnouncementList(loaded);
      },
      getAnnouncementList (loaded) {
        let that = this;
        this.$vux.loading.show({
          text: '加载中'
        });
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
            that.hasMore = res.data.pageResult.hasMore;
            this.$vux.loading.hide();
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
                value: 'announcement'
              };
              that.announcementList.push(obj)
            });
          }
        }).catch(err => {
          that.$vux.loading.show({
            text: err.msg
          });
          this.$vux.loading.hide();
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .announcement{
    height: 100%;
    background-color: #f7f7f7;
  }
</style>
