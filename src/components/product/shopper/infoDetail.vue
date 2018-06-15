<template>
  <div class="info-detail-wrapper commonHeader">
    <view-box :body-padding-top="isOut ? 0 : '1.253333rem'">
      <x-header
        v-if="!isOut"
        slot="header"
        :left-options="{backText: ''}"
        title="详情"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <j-pull :refreshFunc="refreshData">
        <div slot="jpull-list">
          <div class="title">
            <h2 v-text="infoDetail.title"></h2>
          </div>
          <div class="info-text">
            <span class="date" v-text="infoDetail.intime"></span>
            <div class="read-count-wrapper">
              <span class="read-title" v-text="'阅读:'"></span>
              <span class="count" v-text="infoDetail.viewCount"></span>
            </div>
          </div>
          <div class="content-wrapper">
            <p class="content" v-html="infoDetail.content"></p>
          </div>
        </div>
      </j-pull>
    </view-box>
  </div>
</template>

<script>
  import JPull from 'components/base/JPull/JPull';
  import {XHeader, ViewBox} from 'vux';
  export default {
    name: 'InfoDetail',
    components: {
      'j-pull': JPull,
      'view-box': ViewBox,
      'x-header': XHeader
    },
    created: function () {
      this.refreshData();
    },
    data () {
      return {
        infoDetail: {}
      }
    },
    computed: {
      isOut () {
        let outFlag = localStorage.getItem('out_flag');
        if (outFlag === '1') {
          return true;
        } else {
          return false;
        }
      },
      infoId () {
        return this.$route.params.infoId;
      }
    },
    methods: {
      getInfoDetail (loaded) {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/shop/knowledge/' + this.infoId
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            this.infoDetail = data;
            if (loaded) {
              loaded(true);
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
        this.getInfoDetail(loaded)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .info-detail-wrapper {
    height: 100%;
    .title {
      font-size: 18px;
      padding: 20px 15px 15px 15px;
      line-height: 25px;
    }
    .info-text {
      padding: 0 15px 15px 15px;
      display: flex;
      align-items: center;
      color: #aaa;
      .date {
        font-size: 12px;
        white-space: nowrap;
      }
      .read-count-wrapper {
        margin-left: 10px;
        font-size: 12px;
        display: flex;
        .read-title {
          margin-right: 5px;
        }
      }
    }
    .content-wrapper {
      padding: 0 15px;
      .content {
        word-break: break-all;
        img {
          max-width: 345px;
        }
      }
    }
  }
</style>
