<template>
  <div class="survey commonHeader">
    <view-box ref="viewBox" body-padding-top=".94rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="调查投票"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      </x-header>
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <div v-for="(item, index) in surveyList" v-if="surveyList.length">
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
        type: 1,
        hasMore: true,
        surveyList: []
      }
    },
    created () {
      this.getSurveyList();
    },
    methods: {
      refreshData (loaded) {
        this.curPage = 1;
        this.surveyList = [];
        this.getSurveyList(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getSurveyList(loaded);
      },
      getSurveyList (loaded) {
        let that = this;
        that.$vux.loading.show({
          text: '加载中'
        });
        that.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/vote/list?type=' + that.type + '&curPage=' + that.curPage + '&pageSize=' + that.pageSize
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
                img: res.icoUrl,
                like: res.praisenum,
                message: res.commentNum,
                dataInstruction: res.endTimeStr,
                neiId: res.neiId,
                id: res.id,
                joinUserCnt: res.joinUserCnt,
                isPraise: res.isPraise,
                praisenum: res.praisenum,
                commentNum: res.commentNum,
                value: 'survey',
                type: 'survey'
              };
              that.surveyList.push(obj)
            });
          }
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .survey{
    height: 100%;
    background-color: #f7f7f7;
  }
</style>
