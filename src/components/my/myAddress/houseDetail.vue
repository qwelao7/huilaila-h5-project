<template>
    <div class="commonHeader house-detail-wrapper">
      <view-box body-padding-top="1.253333rem" body-padding-bottom="1.333333">
        <x-header
          slot="header"
          :left-options="{backText: ''}"
          title="小区地址"
          style="width:100%;position:absolute;left:0;top:0;z-index:100;">
          <span slot="right" style="font-size: 15px; color: #333;" @click="showLeaveAddressModal">搬离此住址</span>
        </x-header>
        <div class="community-name vux-1px-b" v-text="address"></div>
        <div class="list" v-for="(member, index) in familyMembers">
          <div class="member-item vux-1px-b">
            <div class="avatar" :style="{backgroundImage: member.avatar}"></div>
            <div class="info">
              <div class="name" v-text="member.realName"></div>
              <div class="detail" v-text="member.roleAndPhone"></div>
            </div>
            <div class="operate">
              <span @click="showReportPicker(member)" v-if="index !== 0">举报</span>
            </div>
          </div>
        </div>
        <!--<div class="submit" slot="bottom"><x-button type="primary" action-type="button" @click.native="inviteRegister">邀请注册</x-button></div>-->
        <div class="submit" @click="inviteRegister" slot="bottom">
          <span>邀请家人</span>
        </div>
      </view-box>
      <!--搬离此住址dialog begin-->
      <x-dialog class="leave-wrapper" v-model="leaveModalShow" :dialog-style="leaveDialogStyle" hide-on-blur>
        <span class="delete-info vux-1px-b">确定要搬离此住址吗?</span>
        <div class="operate-wrapper">
          <span class="text vux-1px-r" @click="leaveModalShow = false">取消</span>
          <span class="text" @click="removeAddress">确定</span>
        </div>
      </x-dialog>
      <!--搬离此住址dialog end-->

      <!--举报弹出框 begin-->
      <popup v-model="reportPicker" class="report-picker">
        <div class="header">
          <span class="cancel" @click="reportPicker = false">取消</span>
          <span class="title">举报</span>
          <span class="save" @click="saveReport(user)" style="color: #0DAB60">发送</span>
        </div>
        <div class="content">
          <!--<input  autofocus>-->
          <input autofocus type="text" v-model="reportText" ref="reportTextArea">
        </div>
      </popup>
      <!--举报弹出框 end-->
    </div>
</template>

<script>
  import { XHeader, ViewBox, Group, GroupTitle, XInput, XTextarea, XButton, querystring, XDialog, Popup, TransferDom } from 'vux';
  export default {
    name: 'houseDetail',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      ViewBox,
      Group,
      GroupTitle,
      XInput,
      XTextarea,
      XButton,
      XDialog,
      Popup
    },
    data () {
      return {
        assetId: '',
        address: '',
        roomId: '',
        communityId: '',
        familyMembers: [],
        user: {},
        reportText: '此人非我房下人,将此人请出去',
        leaveModalShow: false,
        leaveDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        },
        reportPicker: false
      }
    },
    created () {
      this.getFamilyData();
    },
    methods: {
      getFamilyData () {
        let assetId = this.$store.state.assetId;
        if (!assetId) {
          assetId = localStorage.getItem('assetId');
        }
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/ownerAsset/theSameHouse?assetId=' + assetId
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            let asset = data.asset;
            let yuan = asset.blockName;
            let zhuang = asset.buildingNumber;
            let unit = asset.unit;
            let room = asset.room;
            let address = '';
            address += (asset.communityName + '-');
            if (yuan) {
              address += (yuan + '-');
            }
            if (zhuang) {
              address += (zhuang + '-');
            }
            if (unit) {
              address += (unit + '-');
            }
            if (room) {
              address += (room);
            }
            address.substr(0, address.length - 1);
            _this_.address = address;
            _this_.roomId = asset.roomId;
            _this_.communityId = asset.communityId;
            let memberList = data.users;
            let familyMembers = [];
            if (memberList && memberList.length) {
              memberList.forEach(function (item) {
                let mobileNum = item.mobileNum;
                let mobileNumStr = mobileNum.substr(0, 3);
                mobileNumStr += '****';
                mobileNumStr += mobileNum.substr(7, 4);
                familyMembers.push({
                  avatar: 'url(' + item.headPicName + ')',
                  userId: item.userId,
                  realName: item.userName,
                  roleAndPhone: item.userType + '(手机: ' + mobileNumStr + ')'
                });
              });
              _this_.familyMembers = familyMembers;
            }
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      inviteRegister () {
        this.$router.push('/inviteRegister');
      },
      showReportPicker (user) {
        // 弹出举报输入框
        this.reportPicker = true;
        this.user = user;
        this.$refs.reportTextArea.focus();
//        this.$nextTick(function () {
//          this.$refs.reportTextArea.focus();
//        })
      },
      saveReport (user) {
        console.log(this.$store.state)
        let _this_ = this;
        let postData = {
          reUserId: user.userId,
          assetId: this.$store.state.assetId,
          communityId: this.communityId,
          reportReason: this.reportText
        };
        this.$JHttp({
          url: window.baseURL + '/ownerAsset/reportAddress?' + querystring.stringify(postData),
          method: 'post',
          headers: {
            defRoomId: this.roomId
          }
        }).then(res => {
          if (res.status === 100) {
            _this_.$vux.toast.show({
              type: 'success',
              text: '举报成功'
            });
            _this_.reportPicker = false;
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
            // 已被举报,关闭举报窗口
            if (res.msg === '该用户已被举报!') {
              _this_.reportPicker = false;
            }
          }
        }).catch(e => {
          console.error(e);
        });
      },
      showLeaveAddressModal () {
        this.leaveModalShow = true;
      },
      removeAddress () {
        let _this_ = this;
        let assetId = this.$store.state.assetId;
        _this_.$JHttp({
          url: window.baseURL + '/ownerAsset/deleteAddress?assetId=' + assetId,
          method: 'delete'
        }).then(res => {
          if (res.status === 100) {
            _this_.$vux.toast.show({
              type: 'success',
              text: '搬离成功!'
            })
            _this_.$router.go(-1);
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.error(e);
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/less" scoped lang="less">
  .house-detail-wrapper {
    height: 100%;
    .community-name {
      border-bottom-color: #D8D8D8;
      padding: 15px 0;
      margin: 0 15px;
      font-size: 15px;
    }
    .list {
      margin: 0 15px;
      .member-item {
        padding: 15px 0;
        border-bottom-color: #D8D8D8;
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-size: cover;
          background-repeat: no-repeat;
          margin-right: 15px;
        }
        .info {
          flex: 1;
          .name{
            font-size: 15px;
          }
          .detail{
            color: #aaaaaa;
          }
        }
        .operate {
          width: 60px;
          text-align: center;
        }
      }
    }
    .submit {
      position: fixed;
      width: 100%;
      max-width: 750px;
      margin: 0 auto;
      bottom: 0;
      background-color: #0DAB60;
      color: #ffffff;
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
    }
    .leave-wrapper {
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
    .report-picker {
      .header {
        display: flex;
        align-items: center;
        height: 48px;
        .cancel {
          display: inline-block;
          margin-left: 20px;
          font-size: 15px;
        }
        .title {
          display: inline-block;
          font-size: 18px;
          flex: 1;
          text-align: center;
        }
        .save {
          display: inline-block;
          margin-right: 20px;
          font-size: 15px;
        }
      }
      .content {
        margin: 0 15px 15px;
        height: 132px;
        background-color: #ffffff;
        overflow: hidden;
        input{
          background-color: #ffffff;
          border: none;
          height: 20px;
          line-height: 20px;
          width: 100%;
          padding: 10px;
          font-size: 15px;
        }
      }
    }
  }

</style>
