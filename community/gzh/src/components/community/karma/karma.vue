<template>
  <div class="karma commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">

      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div>
        <div class="list" v-if="list.length > 0" v-for="item in list" :key="item.id">
          <div class="item" @click="showDialog(item)">
            <img v-if="item.headPicName" :src="item.headPicName">
            <img v-if="!item.headPicName" src="../../../assets/images/headportrait.png">
            <div class="info">
              <span class="name" v-text="item.userName"></span>
              <span class="role" v-text="item.role"></span>
            </div>
          </div>
        </div>
        <div class="button-wrapper">
          <div class="button phone" @click="callPhone">业委会电话</div>
          <div class="button mailbox" @click="mailbox">业委会信箱</div>
        </div>
      </div>

      <div class="placeholder-warpper" v-if="showPlaceholder && list.length === 0">
        <img src="../../../assets/images/No-content.png">
        <p>什么都没发现，去别处看看吧</p>
      </div>

      <div class="fixed-icon" v-show="cancelApplyModalShow" @click="cancelApplyModalShow = false;">
        <x-icon type="ios-close-outline" class="icon-red" size="40"></x-icon>
      </div>
    </view-box>
    <div v-transfer-dom>
      <x-dialog class="dialog-wrapper" v-model="cancelApplyModalShow" :dialog-style="cancelApplyDialogStyle" hide-on-blur>
        <div class="top">
          <div class="bg bg-blur" v-if="headPicName" :style="{ backgroundImage: 'url(' + headPicName + ')' }"></div>
          <div class="bg bg-blur" v-if="!headPicName" style="{ backgroundImage: 'url(../../../assets/images/headportrait.png' }"></div>
          <div class="content">
            <img class="img" v-if="headPicName" :src="headPicName">
            <img class="img" v-if="!headPicName" src="../../../assets/images/headportrait.png">
            <div class="name" v-text="userName"></div>
          </div>
        </div>
        <div class="bottom">
          <div class="title" v-text="'岗位: ' + role"></div>
          <div class="content" v-text="introduce"></div>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <x-dialog class="cancel-order-wrapper" v-model="isShowDialog" :dialog-style="showDialogStyle" hide-on-blur>
        <span class="delete-info vux-1px-b">该功能只在“回来啦社区”APP中提供，跳转至APP？</span>
        <div class="operate-wrapper">
          <span class="text vux-1px-r" @click="isShowDialog = false">取消</span>
          <span class="text" @click="open">确定</span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import { ViewBox, XHeader, XDialog, TransferDom } from 'vux'
  import open from '../../../common/js/openApp'
  export default {
    name: 'karma',
    directives: {
      TransferDom
    },
    components: {
      ViewBox,
      XHeader,
      XDialog
    },
    data () {
      return {
        title: '业委会',
        showPlaceholder: false,
        cancelApplyModalShow: false,
        cancelApplyDialogStyle: {
          maxWidth: '100%',
          width: '85.33%',
          borderRadius: '10px'
        },
        headPicName: '',
        userName: '',
        role: '',
        introduce: '',
        list: [],
        phone: '',
        isShowDialog: false,
        showDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 18px 0 18px',
          borderRadius: '20px'
        }
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData () {
        let _this_ = this
        _this_.$JHttp({
          method: 'GET',
          url: window.oldBaseURL + '/scOwnerSelfRuleActionV36!ownersCommitteeMembers.action',
          params: {
            defCommunityId: localStorage.getItem('communityId'),
            companyCode: window.commonConfig.companyCode,
            token: localStorage.getItem('token')
          }
        }).then(res => {
          _this_.showPlaceholder = true
          if (res.status === '100') {
            _this_.phone = res.data.phone
            _this_.list = res.data.resultList
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          _this_.showPlaceholder = true
          console.log(e)
        });
      },
      showDialog (item) {
        this.headPicName = item.headPicName
        this.userName = item.userName
        this.role = item.role
        this.introduce = item.introduce
        this.cancelApplyModalShow = true
      },
      callPhone () {
        if (!this.phone.trim()) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '拨打失败，手机号码不存在'
          });
          return
        }
        window.location.href = 'tel:' + this.phone;
      },
      mailbox () {
        this.isShowDialog = true;
//        if (this.list.length === 0) {
//          this.$vux.toast.show({
//            type: 'cancel',
//            text: '无业委会成员'
//          });
//          return
//        }
//        this.$router.push('/karmaMailbox')
      },
      open () {
        open();
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.dialog-wrapper {
  .top {
    position: relative;
    .bg {
      width: 100%;
      height: 110px;
      line-height: 110px;
    }
    .bg-blur {
      float: left;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      -webkit-filter: blur(22px);
      filter: blur(22px);
    }
    .content {
      position: absolute;
      left: 50%;
      top: 14px;
      transform: translate3d(-50%, 0, 0);
      display: inline-block;
      .img {
        width: 60px;
        height: 60px;
        margin-bottom: 5px;
        border-radius: 50%;
      }
      .name {
        font-size: 15px;
        color: #FFFFFF;
      }
    }
  }
  .bottom {
    margin: 130px 7px 20px 15px;
    height: 240px;
    background-color: #FFFFFF;
    text-align: left;
    font-size: 15px;
    color: #333333;
    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 20px;
    }
    .content {
      overflow-y: scroll;
      height: 160px;
      word-break: break-all;
    }
  }
}
.cancel-order-wrapper {
  .delete-info {
    color: #333;
    font-size: 14px;
    font-weight: bold;
    display: inline-block;
    width: 100%;
    padding-bottom: 20px;
  }
  .operate-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    .text {
      display: inline-block;
      width: 50%;
      height: 100%;
      line-height: 50px;
      color: #18adfb;
      font-size: 16px;
    }
  }
}
.karma {
  height: 100%;
  background-color: #f2f2f2;
  .fixed-icon {
    position: fixed;
    z-index: 9999;
    bottom: 33px;
    left: 50%;
    transform: translateX(-50%);
  }
  .list {
    margin-top: 10px;
    .item {
      display: flex;
      align-items: center;
      background: #FFFFFF;
      padding: 20px 15px;
      margin-bottom: 10px;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .info {
        flex: 1;
        .name {
          height: 25px;
          line-height: 25px;
          font-size: 18px;
          color: #333333;
          margin-bottom: 4px;
        }
        .role {
          height: 21px;
          line-height: 21px;
          font-size: 15px;
          color: #AAAAAA;
        }
      }
      a {
        display: inline-block;
        width: 18px;
        height: 18px;
        padding: 5px;
        background-image: url("../../../assets/images/consult_icon_black.png");
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
  }
  .button-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    .button {
      text-align: center;
      width: 50%;
      height: 50px;
      line-height: 50px;
    }
    .phone {
      color: #FFFFFF;
      background: #0DAB60;
    }
    .mailbox {
      color: #FFFFFF;
      background: #18ADFB;
    }
  }
  .placeholder-warpper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 95.5px;
    img {
      width: 150px;
      height: 150px;
      margin-bottom: 10px;
    }
    p {
      color: #AAAAAA;
      font-size: 15px;
    }
    .button-Service {
      margin-top: 10px;
      width: 150px;
      height: 35px;
      line-height: 35px;
      color: #FFFFFF;
      text-align: center;
      background: #FF6648;
      border-radius: 67px;
    }
  }
}
</style>
