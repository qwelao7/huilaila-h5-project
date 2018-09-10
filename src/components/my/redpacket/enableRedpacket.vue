<template>
  <div class="enable-redpacket">
    <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
      <div slot="jpull-list">
        <redpacketItem v-for="item in redpacketList" :item="item" :isEnable="true"></redpacketItem>
        <div class="no-content-container" v-if="!redpacketList.length">
          <img class="no-content-img" src="../../../assets/images/No-signal.png"/>
          <span class="no-content-tip">您目前还没有相关红包</span>
        </div>
      </div>
    </j-pull>
  </div>
</template>

<script>
  import {querystring} from 'vux'
  import JPull from '../../base/JPull/JPull'
  import redpacketItem from './redpacketItem'
  export default {
    name: 'enableRedpacket',
    components: {
      JPull,
      redpacketItem
    },
    data () {
      return {
        curPage: 1,
        pageSize: 20,
        redpacketList: []
      }
    },
    created () {
      this.getData();
    },
    methods: {
      getData (loaded) {
        let this_ = this;
        let params = {
          curPage: this_.curPage,
          pageSize: this_.pageSize,
          type: 0 // 0表示可使用红包，2已使用，3已过期
        };
        this_.$vux.loading.show({
          text: '加载中'
        });
        this_.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/treasureShu/getMyRedPacketList?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            this_.$vux.loading.hide();
            this_.hasMore = res.data.pageResult.hasMore;
            if (loaded) {
              loaded(this_.hasMore)
            }

            let obj = {};
            let data = res.data.resultList;
            if (data) {
              data.forEach(value => {
                obj = {
                  fromDate: value.fromDate,
                  minMoney: value.minMoney,
                  money: value.money,
                  redPacketId: value.redPacketId,
                  shopId: value.shopId,
                  shopName: value.shopName,
                  storeId: value.storeId,
                  storeName: value.storeName,
                  toDate: value.toDate,
                  type: value.type,
                  typeName: value.typeName
                };
                this.redpacketList.push(obj);
              })
            }
          } else {
            this_.$vux.loading.hide();
            this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e);
          this_.$vux.loading.hide();
        })
      },
      refreshData (loaded) {
        this.redpacketList = [];
        this.curPage = 1;
        this.getData(loaded)
        console.log('刷新')
      },
      loadMore (loaded) {
        this.curPage++;
        this.getData(loaded);
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  .enable-redpacket  {
    width: 100%;
    height: 100%;
    .no-content-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 142.5px;
      margin-bottom: 284.5px;
    }
    .no-content-img {
      width: 150px;
      height: 150px;
    }
    .no-content-tip {
      display: inline-block;
      height: 24px;
      margin-top: 10px;
      line-height: 24px;
    }
  }
</style>
