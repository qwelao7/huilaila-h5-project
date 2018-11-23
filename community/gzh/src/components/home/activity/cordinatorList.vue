<template>
  <div class="signUpPeople commonHeader no-margin-top">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="活动协办人"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div class="listContainer" style="background-color: #fff;">
        <template v-if="isHost" v-for="(item,index) in vList">
          <div class="avatar">
            <div>
              <img v-if="item.headPic" :src='item.headPic' @click="toPersonPage(item)">
              <img v-if="!item.headPic" src="../../../assets/images/default_avatar.png" @click="toPersonPage(item)">
              <div class="name" @click="toPersonPage(item)" >
                <div class="personInfo" style="position: relative">
                  {{item.nickName}}
                  <span>({{item.annotation}})</span>
                  <span class="phone" @click="callApplyer(item.mobile)">
                    <div style="width: 28px;height: 28px;"></div>
                  </span>
                </div>

              </div>
            </div>
            <x-button mini v-if="item.status==='1'" class="setCBtn" text="设为协办人"
                      @click.native="setCordinator(index)"></x-button>
            <x-button mini v-if="item.status==='2'" class="cancelCBtn" text="取消协办人"
                      @click.native="cancelCordinator(index)"></x-button>
          </div>
        </template>
        <template v-if="!isHost" v-for="(item,index) in vList">
          <div class="avatar">
            <div>
              <img v-if="item.headPic" :src='item.headPic' @click="toPersonPage(item)">
              <img v-if="!item.headPic" src="../../../assets/images/default_avatar.png" @click="toPersonPage(item)">
              <div class="name" @click="toPersonPage(item)">
                <div class="personInfo" style="position: relative">
                  {{item.nickName}}
                  <span>({{item.annotation}})</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <template v-if="!isHost">
        <x-button v-if="!signUpOpt" class="signUpBtn" text="立即报名" @click.native="signUp"></x-button>
        <x-button v-if="signUpOpt" class="cancelSignUpBtn" @click.native="cancelSignUp" text="取消报名"></x-button>
        <div class="signUpAttention">
          <p>注：</p>
          <p> • 协办人是社群活动的热心参与者，将协助活动发起人共同为大家服务。</p>
          <p> • 帮助活动发起人给活动成员扫码签到</p>
        </div>
      </template>
    </view-box>
    <div v-transfer-dom>
      <alert v-model="signUpSuccess" title="申请成功" @on-show="" @on-hide="signUpSuccessHide"> 您已报名成为协办人 ！</alert>
    </div>
    <div v-transfer-dom>
      <alert v-model="cancelSignUpSuccess" title="取消申请成功" @on-hide="signUpCancelHide"> 您已取消申请成为协办人 ！</alert>
    </div>
  </div>
</template>
<script>
  import {XHeader, ViewBox, querystring, XButton, Alert, TransferDom, Toast} from 'vux'

  export default {
    name: 'cordinatorList',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      ViewBox,
      XButton,
      Alert,
      Toast
    },
    data () {
      return {
        isHost: false,
        signUpOpt: false,
        vList: [],
        signUpSuccess: false,
        cancelSignUpSuccess: false
      }
    },
    created () {
      this.getApplyList();
    },
    methods: {
      getApplyList () {
        this.$vux.loading.show({
          text: '加载中'
        });
        let _this = this;
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/helpUserList?activityId=' + _this.$route.params.id
        }).then(res => {
          if (res.status === 100) {
            this.$vux.loading.hide();
            if (res.data.isCreater === 1) {
              _this.isHost = true
            } else {
              _this.isHost = false
              if (res.data.isApply === 0) {
                _this.signUpOpt = false
              } else {
                _this.signUpOpt = true
              }
            }
            _this.vList = res.data.listVList
          }
        }).catch(err => {
          console.log(err);
        })
      },
      setCordinator (val) {
        let _this = this
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/passHelpUser?activityId=' + _this.$route.params.id + '&applyId=' + _this.vList[val].id
        }).then(res => {
          if (res.status === 100) {
            _this.vList[val].status = '2'
            _this.vList[val].annotation = '协办人'
            _this.$vux.toast.show({
              type: 'success',
              text: '设置成功'
            })
          } else {
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(err => {
          console.log(err);
        })
      },
      cancelCordinator (val) {
        let _this = this
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/notPassHelpUser?activityId=' + _this.$route.params.id + '&applyId=' + _this.vList[val].id
        }).then(res => {
          if (res.status === 100) {
            _this.vList[val].status = '1'
            _this.vList[val].annotation = '已报名'
            _this.$vux.toast.show({
              type: 'success',
              text: '设置成功'
            })
          } else {
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(err => {
          console.log(err);
        })
      },
      toPersonPage (val) {
        this.$router.push('/personPage/' + val.userId)
      },
      signUp () {
        let _this = this
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/applyHelpUser?activityId=' + _this.$route.params.id
        }).then(res => {
          if (res.status === 100) {
            _this.signUpSuccess = true;
            _this.signUpOpt = true
          } else {
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(err => {
          console.log(err);
        })
      },
      signUpSuccessHide () {
        this.signUpSuccess = false
        this.getApplyList();
      },
      signUpCancelHide () {
        this.cancelSignUpSuccess = false
        this.getApplyList();
      },
      cancelSignUp () {
        let _this = this
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/cancelHelpUser?activityId=' + _this.$route.params.id
        }).then(res => {
          if (res.status === 100) {
            _this.cancelSignUpSuccess = true
            _this.signUpOpt = false
          } else {
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(err => {
          console.log(err);
        })
      },
      callApplyer (val) {
        event.stopPropagation()
        window.location.href = `tel:${val}`
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .signUpPeople {
    height: 100%;
    width: 100%;
    .weui-tab {
      background-color: #f5f5f5;
    }
    .listContainer {
      .avatar {
        padding: 10px 0;
        margin: 0 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 0.5px solid #f5f5f5;
        :after {
          border: none;
        }
        div {
          flex: 1;
          display: flex;
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
          .name {
            flex: 1;
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            .personInfo {
              color: #333;
              font-size: 15px;
              line-height: 40px;
              span {
                display: inline-block;
                font-size: 10px;
                color: #aaa;
              }
            }
          }
        }
        button {
          color: #fff;
        }
        .setCBtn {
          background-color: #0DAB60;
        }
        .cancelCBtn {
          background-color: #d8d8d8;
        }
      }
    }
    .signUpAttention {
      padding: 0 15px;
      color: #aaa;
    }
    .signUpBtn {
      margin: 50px auto 30px;
      width: 95%;
      color: #fff;
      background-color: #0DAB60;
    }
    .cancelSignUpBtn {
      margin: 50px auto 30px;
      width: 95%;
      color: #fff;
      background-color: #d8d8d8;
    }
    .cancelSignUpBtn:after {
      border: none !important;
    }
  }

  .phone {
    display: inline-block;
    padding-top: 6px;
    margin-left: 10px;
    width: 28px;
    height: 28px;
    background: url("../../../assets/images/consult_icon_black.png") left center;
    background-size: cover;
    /*position: absolute;*/
    /*right: 0;*/
    /*top: 6px;*/
  }
</style>
