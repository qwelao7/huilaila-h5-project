<template>
  <div class="shopper-evaluation-wrapper">
    <div class="header-wrapper">
      <div class="circle-wrapper">
        <circle-score :radius="radius" :percent="percent" :strokeWidth="strokeWidth"></circle-score>
      </div>
      <div class="content-wrapper">
        <span class="score" v-text="dealScore"></span>
        <div class="score-star">
          <star :disabled="true" :fontSize="12" :margin="5" v-if="dealScore" :value="dealScore"></star>
        </div>
        <div class="description">
          <span class="left-title" v-text="'综合评分'"></span>
          <div class="operate-wrapper">
            <check-dot class="check-dot" @click.native="search" :checked="checked"></check-dot>
            <span class="check-text" v-text="'只看有文字的评论'"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="evaluation-list-wrapper">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore" v-if="evaluationList.length">
        <div slot="jpull-list">
          <evaluation-item v-for="(evaluationItem, index) in evaluationList" :key="index" :evaluationItem="evaluationItem"></evaluation-item>
        </div>
      </j-pull>
      <div class="placeholder" v-if="!evaluationList.length">
        <span class="img"></span>
        <p class="text">什么都没发现，去别处看看吧</p>
      </div>
    </div>
  </div>
</template>

<script>
import CircleProgress from 'components/common/circleProgress';
import Star from 'components/common/star';
import CheckDot from 'components/common/checkDot';
import EvaluationItem from './evaluationItem';
import JPull from 'components/base/JPull/JPull';
import {querystring} from 'vux';
export default {
  name: 'shopperEvaluation',
  components: {
    'circle-score': CircleProgress,
    'star': Star,
    'check-dot': CheckDot,
    'evaluation-item': EvaluationItem,
    'j-pull': JPull
  },
  props: {
    storeId: {
      type: String,
      required: true
    }
  },
  created: function () {
    this.getShopperScore();
    this.refreshData();
  },
  data () {
    return {
      radius: 55,
      strokeWidth: 4,
      score: '',
      checked: true,
      evaluationList: [],
      curPage: 1,
      pageSize: 20
    }
  },
  computed: {
    dealScore () {
      let score = this.score;
      if (!score) {
        return '0.0'
      } else {
        return parseFloat(this.score).toFixed(1);
      }
    },
    percent () {
      let score = this.score;
      if (!score || score === '0.0') {
        return 0;
      } else {
        return parseInt(score) / 5;
      }
    }
  },
  methods: {
    getShopperScore () {
      let _this_ = this;
      _this_.$JHttp({
        method: 'get',
        url: window.baseURL + '/shop/store/info?storeId=' + this.storeId
      }).then(res => {
        if (res.status === 100) {
          let data = res.data;
          this.score = data.storeScore;
        } else {
          _this_.$vux.toast.show({
            type: 'cancel',
            text: res.msg
          })
        }
      }).catch(e => {
        console.log(e)
      })
    },
    getAppraiseData (loaded) {
      let includeContent = 0;
      if (this.checked) {
        includeContent = 1;
      }
      let params = {
        curPage: this.curPage,
        pageSize: this.pageSize,
        includeContent: includeContent,
        storeId: this.storeId
      }
      let _this_ = this;
      _this_.$JHttp({
        method: 'get',
        url: window.baseURL + '/serverShu/store/appraiseList?' + querystring.stringify(params)
      }).then(res => {
        if (res.status === 100) {
          let data = res.data.resultList;
          let hasMore = res.data.pageResult.hasMore;
          if (data && data.length) {
            data.forEach(function (item) {
              let appraiseQuality = item.appraiseQuality;
              let appraiseSpeed = item.appraiseSpeed;
              item.averagePoint = (appraiseQuality + appraiseSpeed) / 2;
            });
            _this_.evaluationList = data;
          }
          if (loaded) {
            loaded(hasMore);
          }
        } else {
          _this_.$vux.toast.show({
            type: 'cancel',
            text: res.msg
          })
        }
      }).catch(e => {
        console.log(e)
      })
    },
    refreshData (loaded) {
      this.curPage = 1;
      this.getAppraiseData(loaded);
    },
    loadMore (loaded) {
      this.curPage++;
      this.getAppraiseData(loaded);
    },
    search () {
      this.checked = !this.checked
      this.refreshData();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.shopper-evaluation-wrapper {
  width: 100%;
  .header-wrapper {
    margin-top: 10px;
    background-color: #fff;
    padding: 15px;
    display: flex;
    .circle-wrapper {
      width: 55px;
      height: 55px;
      margin-right: 18px;
    }
    .content-wrapper {
      flex: 1;
      .score {
        font-size: 28px;
        font-weight: 600;
        line-height: 38px;
      }
      .description {
        margin-top: 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left-title {
          font-size: 12px;
        }
        .operate-wrapper {
          font-size: 12px;
          display: flex;
          align-items: center;
          .check-dot {
            margin-right: 10px;
          }
        }
      }
    }
  }
  .evaluation-list-wrapper {
    height: 441px;
    margin-top: 10px;
    background-color: #fff;
    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      .img {
        width: 225px;
        height: 225px;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url('../../assets/images/No-content.png');
      }
      .text {
        font-size: 15px;
      }
    }
  }
}
</style>
