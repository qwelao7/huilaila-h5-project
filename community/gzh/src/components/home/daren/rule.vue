<template>
  <div class="commonHeader daren-container">
    <view-box body-padding-top="1.253333rem">
      <!--<x-header-->
      <!--slot="header"-->
      <!--:left-options="{backText: ''}"-->
      <!--title="达人守则">-->
      <!--</x-header>-->
      <x-header
        slot="header"
        :left-options="{showBack: false}"
        title="slot:overwrite-title"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;">
        <a slot="right" @click="showMessage" class="right"><i class="messageIcon"></i></a>
        <div class="overwrite-title-demo" slot="overwrite-title" @click="chooseAddress">
          <i class="positionIcon"></i>
          <span v-text="communityName"></span>
        </div>
      </x-header>
      <div class="container">
        <p>我们在这里展示自己独具创意的作品与思想，与邻居们共同分享更多的美丽的瞬间。为了维护良好的邻里关系，在达人中发布的信息不允许出现下列情况：</p>
        <p>1.广告：发布的内容中以产品分销、代购为主导，含大量链接、二维码等。</p>
        <p>2.夸大宣传：发布的内容中有如“全市最低”、“包治百病”等广告词句。</p>
        <p>3.恶意刷屏：发布的内容多次相同或者相似。</p>
        <p>4.含有其他违反相关法律法规和不良信息的内容，用户不得使用隐晦表达等方式规避以上限制。</p>
        <button class="finish-btn" @click="nextStep">我已阅读并同意</button>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {TransferDom, XHeader, ViewBox} from 'vux'

  export default {
    name: 'topicList',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      ViewBox
    },
    data () {
      return {}
    },
    created () {
      this.$JHttp({
        method: 'get',
        headers: {
          defCommunityId: localStorage.getItem('communityId')
        },
        url: window.baseURL + '/workroom/opened'
      })
        .then(res => {
          if (res.status === 100) {
            this.$router.push({path: '/darenDetail?id=' + res.data});
          }
        })
        .catch(e => {
          this.$vux.toast.show({
            type: 'cancel',
            text: e.msg
          })
        })
      let communityName = localStorage.getItem('communityName');
      this.communityName = communityName;
    },
    methods: {
      nextStep () {
        this.$emit('finish');
      },
      chooseAddress () {
        this.$router.push('/changeCommunity');
      },
      showMessage () {
        this.$router.push('/message');
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .overwrite-title-demo {
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 100%;
    justify-content: center;
    .positionIcon {
      display: inline-block;
      /*flex: 1;*/
      width: 20px;
      height: 34px;
      background-image: url("../../../assets/images/address_icon_32black.png");
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
    }
    span {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 18px;
      color: #333333;
      margin-left: 3px;
    }
  }

  .messageIcon {
    width: 28px;
    height: 28px;
    margin-top: -4px;
    background: url("../../../assets/images/message_icon_black.png") center / cover;
  }

  .container {
    padding: 50px 15px 0 15px;
  }

  .finish-btn {
    margin-top: 20px;
    color: #fff;
    font-size: 18px;
    width: 100%;
    height: 44px;
    border: 0;
    border-radius: 4px;
    background: #0DAB60;
  }
</style>
