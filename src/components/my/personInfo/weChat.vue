<template>
  <div class="commonHeader qqNum">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="修改微信号">
    </x-header>
    <div class="banner">
      <group title-color="#aaaaaa">
        <group-title slot="title">微信号</group-title>
        <x-input :show-clear="false" placeholder="微信号码" v-model="weichatNum"></x-input>
      </group>
      <div class="submit" >
        <x-button @click.native="updateWeichatNum">保存</x-button>
      </div>
      <div class="err" v-show="isShow">
        微信号只能6—20个字母、数字、下划线和减号，必须以字母开头（不区分大小写），不支持设置中文
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
        weichatNum: '',
        isShow: false
      }
    },
    created () {
      this.getPersonalInfo()
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
            let weichatNum = data.weichatNum;
            if (weichatNum) {
              _this_.weichatNum = weichatNum;
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
      updateWeichatNum () {
        let _this_ = this;
        let reg = /^[a-zA-Z][a-zA-Z0-9_-]{5,21}$/g;
        if (!reg.test(_this_.weichatNum)) {
          _this_.isShow = true;
        } else {
          _this_.$JHttp({
            method: 'put',
            url: window.baseURL + '/user/modifyWeiChat?weichat=' + this.weichatNum
          }).then(res => {
            let status = res.status;
            if (status === 100) {
              _this_.$vux.toast.show({
                type: 'success',
                text: '微信修改成功'
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
  }
</script>
<style type="text/less" lang="less" scoped>
  .qqNum{
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
      .err{
        width:100%;
        color: #333333;
        font-size: 12px;
        margin-top:15px;
      }
    }
  }
</style>
