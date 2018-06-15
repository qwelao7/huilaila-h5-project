<template>
  <div class="bannerNewsDetail commonHeader">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="焦点新闻">
    </x-header>
    <div class="newsContent">
      <div class="title"><h1>{{bannerData.title}}</h1></div>
      <div class="pubTime">
        <span>{{bannerData.intime}}</span>
        <span class="readCount">阅读数：{{bannerData.pageview}}</span>
      </div>
      <div class="content">
        <img :src="bannerData.smallPic" alt="">
        <div v-html="bannerData.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { XHeader, querystring } from 'vux'
  export default {
    name: 'bannerNewsDetail',
    components: {
      XHeader
    },
    created () {
      this.getData()
    },
    data () {
      return {
        bannerData: {}
      }
    },
    methods: {
      getData () {
        this.$vux.loading.show({
          text: '加载中'
        });
        let that = this;
        let params = {
          fid: this.$route.params.id
        };
        that.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/focusInfo/focusDetail?' + querystring.stringify(params)
        }).then(res => {
          this.$vux.loading.hide();
          if (res.status === 100) {
            that.bannerData = res.data;
            console.log(res.data)
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          this.$vux.loading.hide();
          console.log(e);
        })
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  .bannerNewsDetail{
    background-color: #ffffff;
    .newsContent{
      padding: 10px 15px;
      .title{
        h1{
          font-size: 24px;
        }
      }
      .pubTime{
        margin-top: 10px;
        color: #aaaaaa;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span{
          width: 100%;
        }
        .readCount{
          text-align: right;
        }
      }
      .content{
        margin-top: 15px;
        p{
          font-size: 12px;
          text-indent: 2em;
        }
      }
    }
  }
</style>
