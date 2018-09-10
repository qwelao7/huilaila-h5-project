<template>
  <div class="commonHeader treatyHistory">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="历史公约">
    </x-header>
    <div style="height: 100%">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <ul class="treatyList" v-if="treatyData.length">
            <li v-for="item in treatyData">
              <div @click="toDetail(item.id)">
                <p>{{item.title}}</p>
                <div class="comment">
                  <span>{{item.intime}}</span>
                  <div class="commentIcon">
                    <i></i>
                    <span>{{item.commentNum}}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="noContent" v-if="!treatyData.length">
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
  import {XHeader} from 'vux'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'treaty',
    components: {
      XHeader,
      JPull
    },
    data () {
      return {
        curPage: 1,
        pageSize: 10,
        type: 15,
        hasMore: false,
        treatyData: []
      }
    },
    created () {
      this.getTreatyHistory();
    },
    methods: {
      refreshData (loaded) {
        this.curPage = 1;
        this.treatyData = [];
        this.getTreatyHistory(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getTreatyHistory(loaded);
      },
      getTreatyHistory (loaded) {
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
            that.treatyData = that.treatyData.concat(res.data.resultList);
            that.treatyData.splice(0, 1)
          }
        }).catch(err => {
          console.log(err);
        })
      },
      toDetail (val) {
        this.$router.push('/treatyDetail/' + val)
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .treatyHistory{
    height: 100%;
    .treatyList{
      padding: 0 15px;
      li{
        padding: 15px 0 18px 0;
        border-bottom: 0.5px solid #D8D8D8;
        p{
          font-size: 18px;
          color: #333333;
        }
        .comment{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          span{
            flex: 1;
            color: #aaaaaa;
            font-size: 12px;
          }
          .commentIcon{
            display: flex;
            align-items: center;
            i{
              width: 21px;
              height: 21px;
              margin-right: 2px;
              background: url("../../../assets/images/comment_icon_42gray.png") no-repeat center / contain;
            }
          }
        }
      }
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
