<template>
  <div class="projectProgress commonHeader">
    <view-box ref="viewBox" body-padding-top=".94rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="工程进度"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      </x-header>
      <div style="height: 100%">
        <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
          <div slot="jpull-list">
            <div v-for="item in progressData" v-if="progressData.length">
              <comCard :buildList1="item"></comCard>
            </div>
            <div class="noContent" v-if="!progressData.length">
              <img src="../../../assets/images/No-content.png" alt="">
              <p>什么都没发现，去别处看看吧</p>
              <!--<span @click="toPublish">去发帖</span>-->
            </div>
          </div>
        </j-pull>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {XHeader, ViewBox} from 'vux'
  import JPull from '../../base/JPull/JPull'
  import comCard from '../comCard'
  export default {
    name: 'projectProgress',
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
        type: 14,
        hasMore: false,
        isShow: false,
        progressData: []
      }
    },
    created () {
      this.getProjectProgress()
    },
    methods: {
      refreshData (loaded) {
        this.curPage = 1;
        this.progressData = [];
        this.getProjectProgress(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getProjectProgress(loaded);
      },
      getProjectProgress (loaded) {
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
            that.hasMore = res.data.pageResult.hasMore;
            that.isShow = true;
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
                value: 'project',
                type: 'project'
              };
              that.progressData.push(obj)
            })
//            that.buildList1 = res.data.resultList;
//            that.buildList1.forEach((v, i) => {
//              that.buildList1[i].title = v.title;
//              that.buildList1[i].name = v.communityName;
//              that.buildList1[i].img = v.smallPic;
//              that.buildList1[i].like = v.praisenum;
//              that.buildList1[i].message = v.commentNum;
//              that.buildList1[i].dataInstruction = v.intime;
//              that.buildList1[i].type = 'project';
//              that.buildList1[i].value = 'project';
//            }
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .projectProgress{
    height: 100%;
    background-color: #f7f7f7;
    .noContent{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 142.5px;
      margin-bottom: 284.5px;
      img{
        width: 150px;
        height: 150px;
      }
      p{
        margin-top: 10px;
        color: #aaaaaa;
        font-size: 15px;
      }
    }
  }
</style>
