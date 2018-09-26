<template>
  <div class="commonHeader daren-container">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      :title="title">
      <span class="right-btn" slot="right">1/3</span>
    </x-header>
    <div class="content no-margin-top">
      <img src="../../../assets/images/openstudio_Illustration_750.png" alt="">
      <group>
        <x-input class="xinput" v-model="darenName" :show-clear="false" ref="nameInput" placeholder="给自己的达人主页取个名字吧" :max="20"></x-input>
      </group>
      <div class="next-step-btn" @click="nextStep">
        <x-icon type="ios-arrow-right" size="25"></x-icon>
      </div>
    </div>
  </div>
</template>
<script>
  import {TransferDom, XHeader, Group, XInput, Msg} from 'vux'
  export default {
    name: 'topicList',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Group,
      XInput
    },
    props: ['initName', 'title'],
    data () {
      return {
        darenName: ''
      }
    },
    watch: {
      initName (val) {
        this.darenName = val;
      }
    },
    created () {
      this.init();
    },
    methods: {
      nextStep () {
        if (!this.darenName) {
          this.$vux.toast.show({
            type: 'text',
            text: '请输入达人称呼'
          })
          this.$refs.nameInput.focus();
          return;
        }
        this.$emit('finish', this.darenName);
      },
      init () {
        if (this.initName) this.darenName = this.initName;
        this.$nextTick(() => {
          this.$refs.nameInput.focus();
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .daren-container{
    height: 100%;
  }
  .next-step-btn{
    width: 48px;
    height: 48px;
    background: rgba(13,171,96,0.60);
    position: fixed;
    right: 15px;
    bottom: 30px;
    border-radius: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vux-x-icon{
    fill: #fff;
  }
  .xinput{
    caret-color:#00C66C;
  }
</style>
