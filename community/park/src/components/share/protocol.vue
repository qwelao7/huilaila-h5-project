<template>
  <div class="protocol-wrapper">
    <div class="placeholder" v-if="!shareProtocol">
      <span class="icon"></span>
      <div class="text">暂无相关内容</div>
    </div>
    <div v-if="shareProtocol">
      <div class="share-protocol" v-html="shareProtocol"></div>
      <div class="btn-fixed">
        <div class="save-wrapper" @click="agreeProtocol">
          <j-button type="primary" jText="同意"></j-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import router from '../../router';
  import JButton from 'components/utils/jbutton';
  export default {
    name: 'protocol',
    data () {
      return {
      }
    },
    created: function () {
      document.title = '车位共享协议';
    },
    computed: {
      shareProtocol: function () {
        return this.$store.state.pageCfg.shareProtocol || '';
      }
    },
    components: {
      'j-button': JButton
    },
    methods: {
      agreeProtocol: function () {
        this.$store.commit('updateProtocolChecked', {
          protocolChecked: true // 同意协议
        });
        router.go(-1);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .protocol-wrapper {
    width: 100%;
    height: 100%;
    background-color: #ebebeb;
    .placeholder {
      padding-top: 4.72rem;
      .icon {
        display: block;
        width: 2.666667rem;
        height: 2.666667rem;
        margin: 0 auto;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url("../../assets/img/@2x/placeholder.png");
      }
      .text {
        margin-top: 0.4rem;
        color: #aaa;
        font-size: 12px;
      }
    }
    .share-protocol {
      padding: 0.4rem;
      text-align: left;
      color: #333;
      font-size: 20px;
      line-height: 40px;
      margin-bottom: 1.12rem;
      background-color: #fff;
      & img {
        max-width: 100%;
      }
    }
    .btn-fixed {
      position: fixed;
      width: 100%;
      bottom: 0;
      left: 0;
      .save-wrapper {
        height: 1.12rem;
      }
    }
  }
  [data-dpr="2"]
  .protocol-wrapper {
    .placeholder {
      .text {
        font-size: 24px;
      }
    }
    .share-protocol {
      font-size: 36px;
      line-height: 60px;
    }
  }
  [data-dpr="3"]
  .protocol-wrapper {
    .placeholder {
      .icon {
        background-image: url("../../assets/img/@3x/placeholder@3x.png");
      }
      .text {
        font-size: 42px;
      }
    }
    .share-protocol {
      font-size: 64px;
      line-height: 110px;
    }
  }
</style>
