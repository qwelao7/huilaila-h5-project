<template>
  <div class="signUpPeople commonHeader">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="活动协办人"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div class="signUp">
        <template v-for="item in cordinatorDetail">
          <p>• {{item}}</p>
        </template>
        <x-button action-type="button" @click.native="openCordinator">立即开通</x-button>
      </div>
    </view-box>
    <div v-transfer-dom>
      <alert v-model="openConfirm" title="开通成功" @on-hide="onConfirmHide">
        活动协办人功能开通成功！
      </alert>
    </div>
  </div>
</template>
<script>
  import {XHeader, ViewBox, querystring, XButton, Alert, TransferDom} from 'vux'

  export default {
    name: 'signUpPeople',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      ViewBox,
      XButton,
      Alert
    },
    data () {
      return {
        openConfirm: false,
        cordinatorDetail: [
          '若活动规模比较大，您需要几位志原者帮助您组织开展活动，您可开通‘活动协办人”功能。',
          '所有用户将在活动详情页看到”活动协办人”入口，并向您报名成为此活动的协办人。',
          '您可选择合适的人员成为活动协办人。'
        ]
      }
    },
    created () {
      this.getApplyUserList();
    },
    methods: {
      getApplyUserList () {
        let _this = this;
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getApplyUserList?activityId=' + this.$route.params.id
        }).then(res => {
          console.log(res, '参与人信息');
          if (res.status === 100) {
            _this.needDetail = res.data.needUserDetail
            _this.applyUserListInformation = res.data;
            _this.title = res.data.applyUserCount + '人报名'
            let time = new Date().getTime()
            let endTime = new Date(res.data.applyEndDate.replace(new RegExp('-', 'gm'), '/')).getTime()
            console.log(time, endTime, this.applyEnd)
            if (time > endTime) {
              _this.applyEnd = true
            }
          }
        }).catch(err => {
          console.log(err);
        })
      },
      onConfirmHide () {
        this.$router.push('/cordinatorList/' + this.$route.params.id)
      },
      openCordinator () {
        let _this = this
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/openHelpUser?activityId=' + this.$route.params.id
        }).then(res => {
          if (res.status === 100) {
            this.openConfirm = true;
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .signUpPeople {
    width: 100%;
    .signUp {
      height: 100%;
      padding: 20% 15px 0;
      p {
        margin-bottom: 30px;
        text-indent: -12px;
        margin-left: 12px;
      }
      button {
        background-color: #0DAB60;
        color: #fff;
      }
    }
  }
</style>
