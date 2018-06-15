<template>
  <div class="info-list-wrapper commonHeader">
    <view-box :body-padding-top="isOut ? 0 : '1.253333rem'">
      <x-header
        v-if="!isOut"
        slot="header"
        :left-options="{backText: ''}"
        title="热点资讯"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <j-pull :refreshFunc="refreshData" style="padding-top: 10px">
        <div slot="jpull-list">
          <info-item v-for="(infoItem, index) in infoList" class="info-item-content" :key="index"
                     :infoItem="infoItem" @click.native="goInfoDetail(infoItem)"></info-item>
        </div>
      </j-pull>
    </view-box>
  </div>
</template>

<script>
  import JPull from 'components/base/JPull/JPull';
  import InfoItem from './infoItem';
  import {XHeader, ViewBox} from 'vux'
  export default {
    name: 'InfoList',
    components: {
      'j-pull': JPull,
      'info-item': InfoItem,
      'view-box': ViewBox,
      'x-header': XHeader
    },
    created: function () {
      this.getInfoList();
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
      busId () {
        return this.$route.params.busId;
      }
    },
    data () {
      return {
        infoList: []
      }
    },
    methods: {
      getInfoList (loaded) {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/shop/knowledge?busId=' + this.busId
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            this.infoList = data;
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
        this.getInfoList(loaded);
      },
      goInfoDetail (info) {
        let skipType = info.skipType;
        if (skipType === 3) {
          let skipData = JSON.parse(info.skipData);
          let skipUrl = skipData.url;
          location.href = skipUrl;
        } else {
          let infoId = info.id;
          this.$router.push('/infoDetail/' + infoId);
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .info-list-wrapper {
    height: 100%;
    background-color: #f5f5f5;
    .info-item-content {
      margin-bottom: 10px;
    }
  }
</style>
