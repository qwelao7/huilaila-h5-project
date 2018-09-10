<template>
  <div class="commonHeader daren-container">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="达人守则">
    </x-header>
    <div class="container">
      <p>我们在这里展示自己独具创意的作品与思想，与邻居们共同分享更多的美丽的瞬间。为了维护良好的邻里关系，在达人中发布的信息不允许出现下列情况：</p>
      <p>1.广告：发布的内容中以产品分销、代购为主导，含大量链接、二维码等。</p>
      <p>2.夸大宣传：发布的内容中有如“全市最低”、“包治百病”等广告词句。</p>
      <p>3.恶意刷屏：发布的内容多次相同或者相似。</p>
      <p>4.含有其他违反相关法律法规和不良信息的内容，用户不得使用隐晦表达等方式规避以上限制。</p>
      <button class="finish-btn" @click="nextStep">我已阅读并同意</button>
    </div>

  </div>
</template>
<script>
  import {TransferDom, XHeader} from 'vux'
  export default {
    name: 'topicList',
    directives: {
      TransferDom
    },
    components: {
      XHeader
    },
    data () {
      return {
      }
    },
    created () {
    },
    methods: {
      nextStep () {
        this.$emit('finish');
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .container{
    padding: 0 15px;
    margin-top: 20px;
  }
  .finish-btn{
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
