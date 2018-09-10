<template>
  <div class="commonHeader qqNum">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="修改QQ号">
    </x-header>
    <div class="banner">
      <group title-color="#aaaaaa">
        <group-title slot="title">QQ号</group-title>
        <x-input type="number" :show-clear="false" :max="20" placeholder="QQ号码" v-model="qqNum"></x-input>
      </group>
      <div class="submit" >
        <x-button @click.native="updateQqNum">保存</x-button>
      </div>
      <div class="err" v-show="isShow">
        QQ号只能5—20数字
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
        qqNum: '',
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
            let qqNum = data.qqNum;
            if (qqNum) {
              _this_.qqNum = qqNum;
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
      updateQqNum () {
        let _this_ = this;
        let reg = /^[\d]{5,20}$/g;
        if (!reg.test(_this_.qqNum)) {
          _this_.isShow = true
        } else {
          _this_.$JHttp({
            method: 'put',
            url: window.baseURL + '/user/modifyQQ?qq=' + this.qqNum
          }).then(res => {
            let status = res.status;
            if (status === 100) {
              _this_.$vux.toast.show({
                type: 'success',
                text: 'QQ修改成功'
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
