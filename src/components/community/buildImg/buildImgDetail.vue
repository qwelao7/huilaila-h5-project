<template>
  <div class="commonHeader buildImgDetail">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      :title="title">
    </x-header>
  </div>
</template>
<script>
  import {XHeader} from 'vux'
  export default {
    name: 'buildImgDetail',
    components: {
      XHeader
    },
    data () {
      return {
        current: 11,
        total: 40,
        title: ''
      }
    },
    created () {
      this.title = this.current + '/' + this.total
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .buildImgDetail{}
</style>
