<template>
  <div class="mySurvey">
    <div class="pull-top">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <div v-for="(item, index) in surveyList" v-if="surveyList.length">
            <comCard :buildList1="item" :key="index"></comCard>
          </div>
          <div class="noContent" v-if="!surveyList.length">
            <img src="../../../assets/images/No-content.png" alt="">
            <p>什么都没发现，去别处看看吧</p>
            <!--<span @click="toPublish">去发帖</span>-->
          </div>
        </div>
      </j-pull>
    </div>
  </div>
</template>
<script>
  import { querystring } from 'vux'
  import JPull from '../../base/JPull/JPull'
  import comCard from '../../community/comCard'
  export default {
    name: 'mySurvey',
    components: {
      JPull,
      comCard
    },
    data () {
      return {
        curPage: 1,
        pageSize: 20,
        hasMore: false,
        surveyList: []
      }
    },
    created () {
      this.getVoteList()
    },
    methods: {
      getVoteList (loaded) {
        let _this_ = this;
        let params = {
          curPage: this.curPage,
          pageSize: this.pageSize
        };
        _this_.$vux.loading.show({
          text: '加载中'
        });
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/interactive/voteList?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (loaded) {
            loaded(_this_.hasMore)
          }
          if (res.status === 100) {
            _this_.$vux.loading.hide();
            _this_.hasMore = res.data.pageResult.hasMore;
            let data = res.data.resultList;
            let obj = {};
            data.forEach(val => {
              obj = {
                title: '调查投票',
                name: val.topicTitle,
                img: val.topicCoverimg,
                like: val.praisenum,
                isPraise: val.isPraise,
                praisenum: val.topicPraiseNumber,
                commentNum: val.topicCommentNumber,
                joinUserCnt: val.topicPollNumber,
                dataInstruction: val.endTimeStr,
                id: val.voteId,
                neighborId: val.neighborId,
                value: 'survey',
                type: 'survey'

              };
              _this_.surveyList.push(obj);
            })
          } else {
            _this_.$vux.loading.hide();
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e);
          _this_.$vux.loading.hide();
        })
      },
//      isEnd (val) {
//        let res;
//        if (val === 0) {
//          res = '投票中'
//        } else if (val === 1) {
//          res = '已结束'
//        }
//        return res;
//      },
      refreshData (loaded) {
        this.curPage = 1;
        this.surveyList = [];
        this.getVoteList(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getVoteList(loaded);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .mySurvey{
    height: 100%;
    background-color: #f7f7f7;
    .pull-top{
      height: 100%;
    }
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
