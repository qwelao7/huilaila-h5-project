<template>
  <view-box body-padding-bottom="0">
    <div class="decoration-log-wrapper">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <ul v-if="logList.length">
            <log-item v-for="(log, index) in logList" :key="index" :log="log" :pic-index="index"></log-item>
          </ul>
          <div class="placeholder" v-if="!isLoading && !logList.length">
            <span class="img"></span>
            <p class="text">什么都没发现，去别处看看吧</p>
          </div>
        </div>
      </j-pull>
    </div>
  </view-box>
</template>

<script>
  import LogItem from './logItem';
  import JPull from 'components/base/JPull/JPull';
  import {XHeader, ViewBox, querystring} from 'vux'
  export default {
    name: 'DecorationLog',
    components: {
      'log-item': LogItem,
      'j-pull': JPull,
      XHeader,
      ViewBox
    },
    created: function () {
      this.getLogList();
    },
    data () {
      return {
        isLoading: true,
        curPage: 1,
        pageSize: 20,
        logList: []
      }
    },
    methods: {
      getLogList (loaded) {
        this.isLoading = true;
        let params = {
          roomId: localStorage.getItem('roomId'),
          curPage: this.curPage,
          pageSize: this.pageSize
        }
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/assetProfile/assetDecorationJournalProfile?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            let resData = {};
            let list = res.data.resultList;
            if (list && list.length) {
              list.forEach(function (item) {
                resData = item;
                resData.picSrcList = [];
                let picUrlList = item.picUrlList;
                if (picUrlList && picUrlList.length) {
                  picUrlList.forEach(function (pic) {
                    let picItem = {};
                    picItem.src = pic;
                    resData.picSrcList.push(picItem);
                  })
                }
                _this_.logList.push(resData);
              });
            }
            if (loaded) {
              let hasMore = res.data.pageResult.hasMore;
              loaded(hasMore);
            }
            _this_.isLoading = false;
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
            _this_.isLoading = false;
          }
        }).catch(e => {
          console.log(e)
          _this_.isLoading = false;
        })
      },
      refreshData (loaded) {
        this.curPage = 1;
        this.logList = [];
        this.getLogList(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getLogList(loaded);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.decoration-log-wrapper {
  width: 100%;
  height: 100%;
  background-color: #f7f7fa;
  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    .img {
      width: 225px;
      height: 225px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url('../../../../assets/images/No-content.png');
    }
    .text {
      font-size: 15px;
    }
  }
}
</style>
