<template>
  <div class="integralAll">
    <div class="pull-top">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list" class="intBox">
          <div class="integral_source" v-for="item in sourceList">
            <div class="source_left">
              <p class="source_name">{{item.remark}}</p>
              <p class="source_time">{{item.intime}}</p>
            </div>
            <div class="source_right" v-if="item.type === 0">
              <span class="right_if">+</span>
              <span class="right_if">{{item.intNum}}</span>
            </div>
            <div class="source_right" v-if="item.type === 1" @click="goDetail(item.orderId)">
              <span class="right_if" :class="{isGreen: item.type === 1}">-</span>
              <span class="right_if" :class="{isGreen: item.type === 1}">{{item.intNum}}</span><!--:class="{isGreen: item.green}"-->
              <i class="right_i" ></i>
            </div>
          </div>
        </div>
      </j-pull>
    </div>

  </div>
</template>
<script>
  import {ViewBox, querystring} from 'vux'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'integralAll',
    components: {
      JPull,
      ViewBox
    },
    data () {
      return {
        sourceList: [],
        green: false,
        curPage: 1,
        pageSize: 20,
        hasMore: true
      }
    },
    created () {
      this.judge();
      this.getIntergialList()
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
          filter: 0
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
            _this.sourceList = _this.sourceList.concat(res.data.resultList)
          }
        })
      },
      judge () {
        this.sourceList.forEach(val => {
          if (val.source < 0) {
            this.green = true;
          }
        })
      },
      goDetail (id) {
        console.log(id, 11111);
        this.$router.push('/orderDetails/' + id)
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .integralAll{
    height: 100%;
    .pull-top{
      height: calc(100%);
    }
    .intBox{
      height: 100%;
      padding: 0 15px;
    }
    .integral_source{
      display: flex;
      padding: 20px 0;
      align-items: center;
      justify-content: space-between;
      border-bottom: solid 0.5px #D8D8D8;
      .source_left{
        flex: 1;
        .source_name{
          font-size: 15px;
          color: #333333;
        }
        .source_time{
          font-size: 12px;
          color: #AAAAAA;
          margin-top: 5px;
        }
      }
      .source_right{
        .right_if{
          display: inline-block;
          vertical-align: middle;
          font-size: 18px;
          color: #FF6648;
          font-weight: bold;
        }
        .isGreen{
          color: #0DAB60;
        }
        .right_i{
          display: inline-block;
          width: 14px;
          height: 14px;
          background: url("../../../assets/images/arrow_icon_grey32.png") center;
          background-size: contain;
          vertical-align: middle;
        }
      }
    }
    .integral_source:last-child{
      border-bottom: none;
    }
  }
</style>
