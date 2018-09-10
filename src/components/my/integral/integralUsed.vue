<template>
  <div class="integralUsed">
    <div class="pull-top">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list" class="intBox">
          <div class="integral_source" v-for="item in sourceList">
            <div @click="onItemClick(item.orderId)" class="detBox">
              <div class="source_left">
                <p class="source_name">{{item.remark}}</p>
                <p class="source_time">{{item.intime}}</p>
              </div>
              <div class="source_right">
                <span class="right_if">-{{item.intNum}}</span><!--:class="{isGreen: item.green}"-->
                <i class="right_i"></i>
              </div>
            </div>
          </div>
        </div>
      </j-pull>
    </div>
  </div>
</template>
<script>
  import {querystring} from 'vux'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'integralUsed',
    components: {
      JPull
    },
    data () {
      return {
        sourceList: [],
        id: '',
        curPage: 1,
        pageSize: 20,
        hasMore: true
      }
    },
    created () {
      this.getIntergialList();
    },
    methods: {
      refreshData (loaded) {
        this.curPage = 1;
        this.sourceList = [];
        this.getIntergialList(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getIntergialList(loaded);
      },
      getIntergialList (loaded) {
        let params = {
          curPage: this.curPage,
          pageSize: this.pageSize,
          filter: 1
        };
        let _this = this;
        _this.$JHttp({
          method: 'get',
          headers: {
            'defCommunityId': localStorage.getItem('communityId')
          },
          url: window.baseURL + '/integral/userIntLog?' + querystring.stringify(params)
        }).then(res => {
          if (loaded) {
            loaded(_this.hasMore)
          }
          console.log(res, '积分明细');
          if (res.status === 100) {
            _this.hasMore = res.data.pageResult.hasMore;
            _this.sourceList = _this.sourceList.concat(res.data.resultList);
//            _this.sourceList = res.data.resultList;
            _this.id = res.data.resultList.orderId
          }
        })
      },
      onItemClick (id) {
//        console.log(id, 11111);
        this.$router.push('/orderDetails/' + id)
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .integralUsed{
    height: 100%;
    .pull-top{
      height: calc(100%);
    }
    .intBox{
      height: 100%;
      padding: 0 15px;
    }
    .integral_source{
      .detBox{
        display: flex;
        padding: 20px 0;
        align-items: center;
        justify-content: space-between;
        border-bottom: solid 0.5px #D8D8D8;
      }
      .source_left{
        flex: 1;
        .source_name{
          font-size: 15px;
          color: #333333;
        }
        .source_time{
          margin-top: 5px;
          font-size: 12px;
          color: #AAAAAA;
        }
      }
      .source_right{
        .right_if{
          display: inline-block;
          vertical-align: middle;
          font-size: 18px;
          color: #0DAB60;
          font-weight: bold;
        }
        .right_i{
          display: inline-block;
          width: 14px;
          height: 14px;
          background: url("../../../assets/images/arrow_icon_grey32.png") left center;
          background-size: cover;
          vertical-align: middle;
        }
      }
    }
  }
</style>
