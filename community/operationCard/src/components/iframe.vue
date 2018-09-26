<template>
  <div class="iframe" :class="{ 'video':data.isVideo ===1 }" ref='cardLink'>
    <div class="cardLink" v-show='data.skipType === 4' >
      <iframe class="cardLinkIframe" scrolling='no' :src="url" ></iframe>
    </div>
    <div class='coverImg' v-show='data.skipType === 3'>
      <img :src="data.picture">
    </div>
  </div>
</template>

<script>
export default {
  name: 'iframe',
  props: {
    data: {
      type: Object,
      default () {
        return {};
      }
    },
    userId: {
      type: String,
      default () {
        return '';
      }
    },
    token: {
      type: String,
      default () {
        return '';
      }
    }
  },
  data: {
    url: ''
  },
  created () {
    this.url = this.data.cardLink;
    if (this.url.indexOf('?') === -1) {
      this.url = this.url + '?userId=' + this.userId + '&token=' + this.token;
    } else {
      this.url = this.url + '&userId=' + this.userId + '&token=' + this.token;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.iframe {
  height: 4.026666666666667rem;
  /*position: relative;*/
}
.cardLinkIframe{
  width: 100%;
  height: 100%;
  border: none;
  overflow: hidden;
  position: absolute;
}
.cardLink::before{
    content: " ";
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #D8D8D8;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    box-sizing: border-box;
    z-index: -11;
}
.cardLink {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #D8D8D8;
  box-sizing: border-box;
  border-width: 0.5px;
  overflow: hidden;
  position: relative;
  /*box-shadow: inset 0px -1px 1px -1px #D8D8D8;*/
    background:
     linear-gradient(#fff, #000 100%, transparent 100%) left / 1px 100% no-repeat,
    linear-gradient(#000, #000 100%, transparent 100%) right / 1px 100% no-repeat,
    linear-gradient(#000,#000 100%, transparent 100%) top / 100% 1px no-repeat,
    linear-gradient(#000,#000 100%, transparent 100%) bottom / 100% 1px no-repeat,
}

.video {
  height: 6.88rem;
}

.coverImg {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.coverImg img {
  width: 100%;
  height: 100%;
}
</style>
