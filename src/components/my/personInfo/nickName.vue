<template>
  <div class="commonHeader nickName">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="修改昵称">
    </x-header>
    <div class="banner">
      <group title-color="#aaaaaa">
        <group-title slot="title">昵称</group-title>
        <x-input :show-clear="nickName" placeholder="昵称" v-model="nickName"></x-input>
      </group>
      <div class="submit">
        <x-button @click.native="updateNickName">保存</x-button>
        <p>为保护个人隐私，在互动时将显示昵称</p>
      </div>
    </div>

  </div>
</template>
<script>
  import { XHeader, Group, GroupTitle, XInput, XButton } from 'vux'
  export default {
    components: {
      XHeader,
      XInput,
      Group,
      GroupTitle,
      XButton
    },
    data () {
      return {
        nickName: ''
      }
    },
    created () {
      this.getPersonalInfo();
    },
    methods: {
      getPersonalInfo () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/home/getUserInfoAndAsset'
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            let data = res.data;
            let nickName = data.nickName;
            if (nickName) {
              _this_.nickName = nickName;
            }
          } else {
            _this_.$vux.toast.show({
              type: 'error',
              text: res.msg
            });
          }
        }).catch(error => {
          console.error(error);
        })
      },
      updateNickName () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'put',
          url: window.baseURL + '/user/modifyNickname?nickname=' + this.nickName
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            _this_.$vux.toast.show({
              type: 'success',
              text: '昵称修改成功'
            });
            _this_.$router.go(-1);
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(error => {
          console.error(error);
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .nickName{
    .banner{
      padding: 0 15px;
      .weui-cell{
        padding: 5px 0;
      }
      .weui-cells__title{
        padding-left: 0;
      }
      .submit{
        margin-top: 10px;
        button{
          height: 44px;
          margin: 10px 0 15px 0;
          background: #0DAB60;
          border-radius: 5px;
          color: #ffffff;
          font-size: 18px;
        }
        p{
          font-size: 12px;
        }
      }
    }
  }
</style>
