<template>
  <div class="commonHeader verifiedName">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="实名认证">
    </x-header>
    <div class="unVerified" v-show="(status === 2 || status === 3)">
      <div class="pic">
        <img src="../../../assets/images/notpass_illutration.png" alt="" onclick="return false">
        <span>实名认证后，您可以更便捷地使用更多服务！</span>
      </div>
      <div class="input">
        <group class="optionItem">
          <group-title slot="title" v-show="realName">姓名（姓名需与身份证上相同）</group-title>
          <x-input class="hasTop" :class="{noTop: realName}" :show-clear="false" placeholder="姓名" v-model="realName" @on-change="onInput"></x-input>
        </group>
        <group class="optionItem">
          <group-title slot="title" v-show="idCode">身份证号</group-title>
          <x-input class="hasTop" :class="{noTop: idCode}" :show-clear="false" placeholder="身份证号" v-model="idCode"></x-input>
        </group>
      </div>
      <div class="idPic">
        <p>上传身份证照片：</p>
        <div class="uploadBanner">
          <div v-show="!idImg1" class="front">
            <i class="font_i" @click="upLoad"></i>
            <!--<img src="../../../assets/images/IDPhoto_icon_330front.png" @click="upLoad" alt="">-->
          </div>
          <div v-show="idImg1" class="front">
            <img :src="idImg1" alt="" @click.prevent="deleteFront">
          </div>
          <div v-show="!idImg2" class="back">
            <i class="back_i" @click="upLoad"></i>
            <!--<img src="../../../assets/images/IDPhoto_icon_330back.png" alt="" @click="upLoad">-->
          </div>
          <div v-show="idImg2" class="back">
            <img :src="idImg2" alt="" @click.prevent="deleteBack">
          </div>
          <div v-transfer-dom>
            <actionsheet :menus="menus" @on-click-menu-menu="deleteImg" v-model="showDeleteMenu" show-cancel></actionsheet>
          </div>
        </div>
        <div class="submit">
          <x-button type="primary" @click.native="saveData">确认提交</x-button>
        </div>
      </div>
    </div>
    <div class="isVerified" v-show="status === 1">
      <group class="optionItem">
        <group-title slot="title">姓名</group-title>
        <x-input class="hasTop" :class="{noTop: realName}" :show-clear="false"  placeholder="姓名" readonly v-model="realName"></x-input>
      </group>
      <div class="pic">
        <!--<i style="background-image: url('../../../assets/images/pass_illutration.png')"></i>-->
        <img src="../../../assets/images/pass_illutration.png" alt="" onclick="return false">
        <span>您已通过实名认证，如需修改真实姓名请联系生活服务中心！</span>
      </div>
    </div>
    <div class="isVerified" v-show="status === 0">
      <group class="optionItem">
        <group-title slot="title">姓名</group-title>
        <x-input class="hasTop" :class="{noTop: preViewName}" :show-clear="false" placeholder="姓名" readonly v-model="preViewName"></x-input>
      </group>
      <div class="pic">
        <!--<i style="background-image: url('../../../assets/images/notpass_illutration.png')"></i>-->
        <img src="../../../assets/images/notpass_illutration.png" alt="" onclick="return false">
        <span>实名信息审核中，请耐心等待结果！</span>
      </div>
    </div>

  </div>
</template>
<script>
  import { XHeader, Actionsheet, TransferDom, Group, GroupTitle, XInput, XButton, querystring } from 'vux'
  import {File} from '../../../common/js/Upload'
  import {JNavigator} from '../../../common/js/utils'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Actionsheet,
      XInput,
      Group,
      GroupTitle,
      XButton
    },
    data () {
      return {
        communityId: '',
        roomId: '',
        status: 3,
        realName: '', // 真实姓名
        preViewName: '',
        idCode: '', // 身份证
        idImg1: '', // 正面
        idImg2: '', // 反面
        uploadData: new FormData(),
        menus: {
          menu: '删除'
        },
        showFrontDeleteMenu: false,
        showBackDeleteMenu: false,
        showDeleteMenu: false
      }
    },
    created () {
      this.uploadData.append('type', 'ad');
      this.getPersonalInfo();
    },
    methods: {
      getPersonalInfo () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/home/getUserInfoAndAsset',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            let data = res.data;
            let ownerAsset = data.ownerAsset;
            if (!ownerAsset) {
              _this_.$vux.toast.show({
                type: 'cancel',
                text: '请先绑定房号再试!'
              })
              setTimeout(function () {
                _this_.$router.push('/addCommunityAddress')
              }, 2000);
            }
            _this_.communityId = ownerAsset.communityId;
            _this_.roomId = ownerAsset.roomId;
            let status = data.realnameApproveStatus;
            _this_.status = status;
            let realName = data.userName;
            _this_.realName = realName;
            _this_.preViewName = data.mOwnerRealnameDetailV.userName
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
      upLoad () {
        let _this_ = this;
        let count = 2;
        if (_this_.idImg1 || _this_.idImg2) {
          count = 1;
        }
        this.$wechat.chooseImage({
          count: count, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            localIds.forEach(function (localId, index) {
              if (index === 0) {
                if (!_this_.idImg1) {
                  _this_.idImg1 = localId;
                } else {
                  _this_.idImg2 = localId;
                }
              }
              if (index === 1) {
                _this_.idImg2 = localId;
              }
            });
          }
        });
      },
      deleteFront () {
        this.showFrontDeleteMenu = true;
        this.showBackDeleteMenu = false;
        this.showDeleteMenu = true;
      },
      deleteBack () {
        this.showBackDeleteMenu = true;
        this.showFrontDeleteMenu = false;
        this.showDeleteMenu = true;
      },
      deleteImg () {
        // 删除身份证正面
        if (this.showFrontDeleteMenu) {
          this.idImg1 = '';
          this.uploadData.delete('files');
        } else { // 删除身份证反面
          this.idImg2 = '';
          this.uploadData.delete('files');
        }
      },
      saveData () {
        let _this_ = this;
        let realName = this.realName;
        if (!realName) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入姓名'
          });
          return;
        }
        let idCode = this.idCode;
        // 正则校验身份证
        if (!window.commonConfig.idCodeRegp.test(idCode)) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入有效的身份证'
          });
          return;
        }
        let localId1 = this.idImg1;
        let localId2 = this.idImg2;
        if (!localId1) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请上传身份证正面'
          });
          return;
        }
        if (!localId2) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请上传身份证反面'
          });
          return;
        }
        let blobs = [];
        _this_.$wechat.getLocalImgData({
          localId: localId1, // 图片的localID
          success: function (res) {
            let frontData = res.localData; // localData是图片的base64数据，可以用img标签显示
            if (JNavigator.isAndroid()) {
              frontData = 'data:image/jgp;base64,' + frontData;
            }
            let file = File.dataURItoBlob(frontData);
            blobs.push(file);
            _this_.$wechat.getLocalImgData({
              localId: localId2, // 图片的localID
              success: function (res) {
                let backData = res.localData; // localData是图片的base64数据，可以用img标签显示
                if (JNavigator.isAndroid()) {
                  backData = 'data:image/jgp;base64,' + backData;
                }
                let file = File.dataURItoBlob(backData);
                blobs.push(file);
                _this_.uploadBlob(blobs, 'head', undefined, undefined, function (resList) {
                  let postData = {
                    realname: realName,
                    cardNum: idCode,
                    imageUrls: JSON.stringify(resList)
                  }
                  // 保存图片到业务方
                  _this_.$JHttp({
                    url: window.baseURL + '/owner/commitRealnameApprove?' + querystring.stringify(postData),
                    method: 'post',
                    headers: {
                      defCommunityId: _this_.communityId,
                      defRoomId: _this_.roomId
                    }
                  }).then(res => {
                    if (res.status === 100) {
                      console.log(res)
                      // 开始保存逻辑
                      _this_.$vux.toast.show({
                        type: 'success',
                        text: '保存成功'
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
                  });
                });
              }
            });
          }
        });
      },
      onInput (value) {
        this.preViewName = value;
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .unVerified{
    padding: 0 15px;
    .weui-cells__title{
      padding-left: 0;
    }
    .idPic{
      margin-top: 20px;
      p{
        font-size: 15px;
        color: #333333;
      }
      .uploadBanner{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 15px;
        .front, .back{
          width: 165px;
          height: 105px;
        }
        i{
          width: 100%;
          height: 100%;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
        .font_i{
          background-image: url("../../../assets/images/IDPhoto_icon_330front.png");
        }
        .back_i{
          background-image: url("../../../assets/images/IDPhoto_icon_330back.png");
        }
        img{
          width: 100%;
          height: 100%;
        }
      }
      .submit{
        margin-top: 15px;
        button{
          height: 44px;
          /*margin: 10px 0 7.5px 0;*/
          background: #0DAB60;
          border-radius: 5px;
          color: #ffffff;
          font-size: 18px;
        }
      }
    }
  }
  .isVerified{
    padding: 0 15px;
  }
  .optionItem{
    height: 55px;
    line-height: 55px;
    padding: 15px 0 15px 5px;
    border-bottom: 0.2px solid #D8D8D8;
    font-size: 21px;
  }
  .hasTop{
    margin-top: 26px;
  }
  .noTop{
    margin-top: 0;
  }
  .pic{
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      margin-top: 15px;
      width: 184px;
      height: 80px;
    }
    span{
      margin-top: 15px;
      width: 100%;
      text-align: center;
      font-size: 12px;
      color: #aaaaaa;
    }
  }
</style>
