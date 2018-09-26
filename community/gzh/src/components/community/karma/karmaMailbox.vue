<template>
  <div class="karma-mailbox commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">

      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="wrapper">
        <b class="label">业委会信箱</b>
        <group class="textarea">
          <x-textarea :placeholder="placeholder" :height=190 :max=500 :show-counter="false" v-model="content"></x-textarea>
        </group>
        <div class="button" @click="submit">确认提交</div>
      </div>

    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader, Group, XTextarea } from 'vux'
  export default {
    name: 'karma-mailbox',
    components: {
      ViewBox,
      XHeader,
      Group,
      XTextarea
    },
    data () {
      return {
        title: '业委会',
        cancelApplyModalShow: false,
        placeholder: '您可对园区的规约、管理、环境、活动等各方面提出您宝贵的意见和建议，感谢您为园区建设贡献一份力量。',
        content: ''
      }
    },
    methods: {
      submit () {
        let _this_ = this
        if (!_this_.content.trim()) {
          _this_.$vux.toast.show({
            type: 'cancel',
            text: '请输入内容'
          });
          return
        }
        _this_.$JHttp({
          method: 'POST',
          url: window.oldBaseURL + '/scNeighborActionV36!privateLetter.action',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          params: {
            defCommunityId: localStorage.getItem('communityId'),
            companyCode: window.commonConfig.companyCode,
            token: localStorage.getItem('token'),
            type: 1,
            messageInfo: _this_.content
          }
        }).then(res => {
          if (res.status === '100') {
            _this_.$vux.toast.show({
              type: 'success',
              text: '提交成功'
            });
            _this_.$router.go(-1)
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          console.log(e)
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.karma-mailbox {
  height: 100%;
  .wrapper {
    margin: 15px 15px 0 15px;
    .label {
      font-size: 27px;
      color: #333333;
      margin-bottom: 20px;
    }
    .textarea {
      margin-bottom: 52px;
    }
    .button {
      text-align: center;
      height: 50px;
      line-height: 50px;
      color: #FFFFFF;
      background: #0DAB60;
    }
    /deep/ .weui-cells {
      margin: 0;
      .weui-cell {
        padding: 0;
      }
      &:before {
        display: none;
      }
      &:after {
        display: none;
      }
    }
  }
}
</style>
