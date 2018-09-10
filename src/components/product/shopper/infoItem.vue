<template>
  <div class="info-item-wrapper">
    <img :src="infoItem.picUrl" class="img" alt="">
    <div class="content">
      <p class="title" v-text="infoItem.title"></p>
      <span class="date" v-text="infoItem.intime"></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InfoItem',
    components: {
    },
    props: {
      infoItem: {
        type: Object,
        default: {}
      }
    },
    created: function () {
    },
    data () {
      return {
      }
    },
    methods: {
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
  .info-item-wrapper {
    padding: 15px;
    display: flex;
    background-color: #fff;
    align-items: center;
    .img {
      width: 75px;
      height: 75px;
      margin-right: 10px
    }
    .content {
      flex: 1;
      height: 70px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        font-size: 15px;
        color: #333;
      }
      .date {
        font-size: 12px;
        color: #aaa;
      }
    }
  }
</style>
