<template>
  <div class="commonHeader commentPage">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="评论">
      <a slot="right">发送</a>
    </x-header>
    <div>
      <group class="no-margin-top ">
        <x-textarea :height="150">
          <span slot="label">回复李大白：</span>
        </x-textarea>
      </group>
    </div>
  </div>
</template>
<script>
  import { XHeader, Group, XTextarea } from 'vux'
  export default {
    components: {
      XHeader,
      Group,
      XTextarea
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .commentPage{
    .vux-header .vux-header-right a{
      font-size: 15px;
      color:  #0DAB60;
    }
  }
</style>
