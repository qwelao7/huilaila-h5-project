<template>
  <div class="bannerNewsDetail commonHeader">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      :title="title">
    </x-header>
    <div class="newsContent">
      <div class="title"><h1>{{infoData.noticeTitle}}</h1></div>
      <div class="pubTime">
        <span>{{infoData.intime}}</span>
      </div>
      <div class="content" v-html="infoData.noticeContent
">
        <!--<img src="../../../assets/newsimg.jpg" alt="">-->
        <!--<p>{{infoData.noticeSummary}}</p>-->
      </div>
    </div>
  </div>
</template>
<script>
  import { XHeader, querystring } from 'vux'
  export default {
    components: {
      XHeader
    },
    data () {
      return {
        infoData: {},
        title: ''
      }
    },
    created () {
      console.log(this.$route.params);
      this.title = this.$route.params.title;
      this.getData()
    },
    methods: {
      getData () {
        let params = {
          noticeId: this.$route.params.id,
          sendType: this.$route.params.type
        };
        let _this = this;
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/notice/getNoticeDetail?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            console.log(111, res);
            this.infoData = res.data
          }
        }).catch(e => {
          console.log(e)
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
          text-align: center;
          font-size: 24px;
        }
      }
      .pubTime{
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #aaaaaa;
        font-size: 12px;
      }
      .content{
        margin-top: 15px;
        p{
          font-size: 15px;
        }
      }
    }
  }
</style>
