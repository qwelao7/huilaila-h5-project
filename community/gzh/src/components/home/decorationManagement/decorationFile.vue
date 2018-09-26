<template>
  <div class="decoration-file-wrapper">
    <file-list :level="1"></file-list>
  </div>
</template>

<script>
  import FileList from './fileList'
  export default {
    name: 'DecorationFileLevelOne',
    components: {
      'file-list': FileList
    },
    data () {
      return {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .decoration-file-wrapper {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>
