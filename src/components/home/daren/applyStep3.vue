<template>
  <div class="commonHeader">
    <x-header
      slot="header"
      :left-options="{backText: '', preventGoBack: true}"
      @on-click-back="back"
      :title="title">
      <span class="right-btn" slot="right">3/3</span>
    </x-header>
    <img v-if="!bgIcon" class="customer-img" src="../../../assets/images/openstudio_Illustration_750.png" alt="">
    <bg-img v-if="bgIcon" :custom-class="'daren-bg'" :extend-style="extendStyle" :osskey="bgIcon"
            :custom-width="375" :custom-height="250">
    </bg-img>
    <div class="daren-container no-margin-top">
      <group>
        <x-input class="xinput" :show-clear="false" ref="desInput" v-model="introduce" placeholder="用几句话描述一下自己吧…" :max="50"></x-input>
      </group>
      <button class="finish-btn" @click="finish">完成</button>
    </div>
  </div>
</template>
<script>
  import {TransferDom, XHeader, Group, XInput} from 'vux'
  import BGImg from 'components/common/img/bgImg'
  export default {
    name: 'topicList',
    props: {
      initIntroduce: '',
      bgIcon: '',
      title: ''
    },
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Group,
      XInput,
      'bg-img': BGImg
    },
    data () {
      return {
        introduce: '',
        extendStyle: 'linear-gradient(to bottom,rgba(255,255,255,0) 200px,rgba(255,255,255,1) 250px),'
      }
    },
    created () {
      this.$nextTick(() => {
        this.introduce = this.initIntroduce;
        this.$refs.desInput.focus();
      });
    },
    methods: {
      finish () {
        this.$emit('finish', {
          introduce: this.introduce
        });
      },
      back () {
        this.$emit('on-back');
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .customer-img{

  }
  .daren-bg {
    background: linear-gradient(to bottom,rgba(255,255,255,0) 200px,rgba(255,255,255,1) 250px), url("../../../assets/images/openstudio_Illustration_750blur.png");
    background-repeat: no-repeat;
    background-size: contain;
    height: 250px;
    width: 100%;
  }
  .xinput{
    caret-color:#00C66C;
  }
  .daren-container{
    padding: 0 15px;
  }
  .finish-btn{
    margin-top: 37px;
    color: #fff;
    font-size: 18px;
    width: 100%;
    height: 44px;
    border: 0;
    border-radius: 4px;
    background: #0DAB60;
  }
</style>
