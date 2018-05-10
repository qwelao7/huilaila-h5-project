<template>
  <div class="commonHeader myBroker">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="我的经纪人">
    </x-header>
    <div v-show="agentData.agentName">
      <div class="brokerInfo">
        <div class="baseInfo">
          <img :src="agentData.agentHeadPic" alt="">
          <div>
            <span>{{agentData.agentName}}</span>
            <span>经纪人</span>
          </div>
        </div>
        <div class="call"><a :href="'tel:'+ agentData.agentPhone"></a></div>
      </div>
      <div class="brokerIntro">
        <p class="tit">经纪人介绍：</p>
        <p>{{agentData.projectName}}</p>
      </div>
    </div>
    <div class="noContent" v-show="!agentData.agentName">
      <img src="../../../assets/images/No-content.png" alt="">
      <p>什么都没发现，去别处看看吧</p>
      <!--<span @click="toPublish">去发帖</span>-->
    </div>
  </div>
</template>
<script>
  import { XHeader, querystring } from 'vux'
  export default {
    name: 'myBroker',
    components: {
      XHeader
    },
    data () {
      return {
        agentData: {}
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData () {
        let _this_ = this;
        _this_.$vux.loading.show({
          text: '加载中'
        });
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/agent/info',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          _this_.$vux.loading.hide();
          if (res.status === 100) {
            _this_.$vux.loading.hide();
//            console.log(res);
            _this_.agentData = res.data;
          } else {
            console.log(res.msg)
          }
        }).catch(e => {
          _this_.$vux.loading.hide();
          console.log(e)
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .myBroker{
    height: 100%;
    background-color: #f7f7f7;
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
    .brokerInfo{
      background-color: #ffffff;
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .baseInfo{
        display: flex;
        align-items: center;
        img{
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
        div{
          margin-left: 12px;
          font-size: 15px;
          color: #333333;
          span:last-child{
            margin-top: 5px;
            color: #aaaaaa;
          }
        }
      }
      .call{
        a{
          display: inline-block;
          width: 24px;
          height: 24px;
          background: url("../../../assets/images/consult_icon_black.png") center no-repeat / contain;
        }
      }
    }
    .brokerIntro{
      background-color: #ffffff;
      margin-top: 10px;
      padding: 15px;
      p{
        margin-top: 10px;
      }
      .tit{
        margin-top: 0;
      }
    }
  }
</style>
