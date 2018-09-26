<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="less">
  @import '../node_modules/vux/src/styles/reset.less';
  @import '../node_modules/vux/src/styles/1px.less';
  @import '../node_modules/vux/src/styles/close.less';
  html, body,#app {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  #app {
    font-family: 'Microsoft YaHei', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #ebebeb;
    text-align: center;
    color: #2c3e50;
    /*解决滑动卡顿的情况*/
    -webkit-overflow-scrolling: touch;
  }
</style>
