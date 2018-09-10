<template>
  <div class="publish commonHeader no-margin-top">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="选择发布到">
    </x-header>
    <h3 class="title">话题</h3>
    <div class="button-wrapper">
      <button class="select-button" :class="{active: topic.name === topicType.name}" v-for="topicType in topicTypes" @click="setTopic(topicType)">{{topicType.name}}</button>
    </div>
    <h3 class="title">达人</h3>
    <div class="button-wrapper">
      <button class="select-button" :class="{active: topic.name === topicType.name}" v-for="topicType in darenTopics" @click="setTopic(topicType)">{{topicType.name}}</button>
    </div>
  </div>
</template>
<script>
  import { XHeader, TransferDom } from 'vux'
  export default {
    name: 'topic-selector',
    directives: {
      TransferDom
    },
    components: {
      XHeader
    },
    data () {
      return {
        topic: {},
        topicTypes: [],
        darenTopics: []
      }
    },
    props: ['defaultTopic'],
    created () {
      this.getTopicTypes();
    },
    methods: {
      setTopic (topic) {
        this.topic = topic;
        this.$emit('selected', topic);
      },
      getTopicTypes () {
        let _this_ = this;
        this.$JHttp({
          method: 'get',
          url: `${window.baseURL}/neighbor/topic/addHome`,
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          _this_.topicTypes = res.data.topics.map(item => ({value: item.topicType, name: item.topicTitle, status: item.status})); // 普通话题
          _this_.darenTopics = res.data.workrooms.map(item => ({value: item.topicType, name: item.topicTitle, topicId: item.topicId, status: item.status})); // 达人话题
          // 初始化默认话题 没有默认类型6
          let defaultTopic = _this_.defaultTopic || '6';
          defaultTopic = String(defaultTopic);
          if (defaultTopic) {
            let topic = _this_.topicTypes.find(item => item.value === defaultTopic) // 如果找到默认话题类型
            if (defaultTopic === '7') {
              topic = _this_.darenTopics[0];
            }
            if (topic) _this_.setTopic(topic);
          }
        }).catch(e => {

        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .title{
    font-size: 21px;
    line-height: 29.5px;
    margin: 20px 15px;
    font-family: 'pingfang_scmedium pingfang_scregular';
  }
  .button-wrapper{
    padding: 0 18.5px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .select-button{
    min-width: 100px;
    height: 35px;
    border-radius: 25px;
    font-size: 15px;
    line-height: 19px;
    text-align: center;
    background-color: #F2F2F2;
    border: 0;
    margin-bottom: 20px;
    padding: 0 15px;
    &.active{
      color: #fff;
      background-color: #0DAB60;
    }
  }
</style>
