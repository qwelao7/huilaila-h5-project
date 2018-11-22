<template>
  <div class="publish commonHeader no-margin-top">
    <!--<view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">

    </view-box>-->
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="发布相册">
      <a slot="right" @click="publish">发布</a>
    </x-header>
    <div class="newThings-banner">
      <group>
        <cell title="选择发布小区" :value="communityName" is-link link="/changeCommunity" class="pub_option"
              style="padding: 15px 0"></cell>
      </group>
      <group v-if="showSelect">
        <!--<cell title="选择发布到" is-link class="pub_option"></cell>-->
        <popup-picker title="选择发布到" :data="activityList" v-model="activityPicker" show-name ref="picker"
                      @on-change="activityChange" class="pub_option"></popup-picker>
      </group>
      <group>
        <x-textarea :height="130" :max="500" :show-counter="false" :rows="8" :cols="30" placeholder="说点什么吧~"
                    v-model="content"></x-textarea>
      </group>
      <ul class="chooseImg" v-show="!isApp">
        <li v-for="(localId, index) in localIds">
          <img :src="localId" @click.prevent="showDeletePop(index)" alt="">
        </li>
        <li class="add" @click="chooseImages" v-show="localIds.length < 9"></li>
      </ul>
      <ul class="chooseImg" v-show="isApp">
        <li v-for="(localId, index) in localIds">
          <img :src="localId" @click="showDeletePop(index)" alt="">
        </li>
        <li class="addInApp" @click="chooseImages" v-show="localIds.length < 9">
          <label for="imgInApp"></label>
          <form><input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" multiple
                       id="imgInApp" class="uploadImg" @change="chooseImg_app"></form>
        </li>
      </ul>
      <div v-transfer-dom>
        <actionsheet :menus="menus" @on-click-menu-menu="deleteImg" v-model="showDeleteMenu" show-cancel></actionsheet>
      </div>
      <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
        <span class="delete-info vux-1px-b">您尚未绑定手机号</span>
        <div class="operate-wrapper">
          <span class="text vux-1px-r" @click="deleteModalShow = false">以后再说</span>
          <span class="text" @click="deleteReceiveAddress">前往绑定</span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import {XHeader, XTextarea, Actionsheet, Group, querystring, TransferDom, XDialog, Cell, PopupPicker} from 'vux'
  import {File} from '../../common/js/Upload'
  import {JNavigator} from '../../common/js/utils'
  import {Base64} from 'js-base64';

  export default {
    name: 'pub_album',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      XTextarea,
      Actionsheet,
      XDialog,
      Group,
      Cell,
      PopupPicker
    },
    data () {
      return {
        isApp: '',
        content: '',
        localIds: [],
        showDeleteMenu: false,
        currentIndex: 0,
        uploadData: new FormData(),
        menus: {
          menu: '删除'
        },
        communityId: '',
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        },
        activityPicker: [''],
        activityPickerId: null,
        activityList: [],
        activityInfo: [],
        imgBlobs: [],
        showSelect: true
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.communityId !== localStorage.getItem('communityId')) {
          vm.communityId = localStorage.getItem('communityId')
          vm.refresh()
        }
      })
    },
    created () {
      this.isApp = localStorage.getItem('isApp');
      this.uploadData.append('type', 'nei');
      this.communityId = localStorage.getItem('communityId');
      this.communityName = localStorage.getItem('communityName');
      this.getActivity()
      let tempId = parseInt(this.$route.params.activityId)
      if (tempId >= 0) {
        this.showSelect = false
        this.activityPickerId = tempId
      }
    },
    methods: {
      getActivity () {
        let _this = this
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/top/10',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            let tempList = []
            _this.activityInfo = res.data
            console.log(this.activityInfo)
            res.data.forEach(val => {
              let tem = {}
              tem.name = val.activityName
              tem.value = String(val.activityId)
              tempList.push(tem)
            })
            _this.activityList.push(tempList)
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
          this.$vux.toast.show({
            type: 'cancel',
            text: e.msg
          })
        })
      },
      chooseImages () {
        let _this_ = this;
        let count = this.localIds.length;
        let leftCount = 9 - count;
        this.$wechat.chooseImage({
          count: leftCount, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            _this_.localIds = _this_.localIds.concat(res.localIds); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          }
        });
      },
      chooseImg_app (e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.createImage(files);
      },
      createImage (file) {
        if (typeof FileReader === 'undefined') {
//          alert('您的浏览器不支持图片上传，请升级您的浏览器')
          this.$vux.toast.show({
            type: 'text',
            text: '您的浏览器不支持图片上传，请升级您的浏览器'
          })
          return false
        }
        let _this = this
        let leng = file.length
        let totaLength = leng + _this.localIds.length
        if (totaLength > 9) {
          _this.$vux.toast.show({
            type: 'text',
            text: '最多只能选择9张图片哦~~'
          })
          return
        }
        for (let i = 0; i < leng; i++) {
          let reader = new FileReader()
          reader.readAsDataURL(file[i])
          reader.onload = function (e) {
//            if (_this.imgList.length && _this.imgList.length > 9) {
//              console.log(222, _this.imgList.length)
//            } else {
//              _this.imgList.push(e.target.result)
//            }
            _this.localIds.push(e.target.result)
          }
        }
      },
      showDeletePop (index) {
        this.showDeleteMenu = true;
        this.currentIndex = index;
      },
      deleteImg () {
        this.localIds.splice(this.currentIndex, 1);
      },
      deleteReceiveAddress () {
        this.$router.push('/Login')
      },
      publish () {
        console.log(this.activityPickerId)
        let token = localStorage.getItem('token');
        if (!token) {
          this.deleteModalShow = true;
        } else {
          let _this_ = this;
          let content = _this_.content.trim();
          if (!content) {
            this.$vux.toast.show({
              type: 'cancel',
              text: '发布内容不能为空'
            });
            return;
          }
          _this_.$vux.loading.show({
            text: '发布中...'
          });
          let localIds = this.localIds;
          let len = localIds.length;
          /* 传了图片 */
          if (len) {
            localIds.forEach(function (imgId, index) {
              if (_this_.isApp) {
                //
                _this_.upLoadPic(imgId, len, index)
              } else {
                _this_.$wechat.getLocalImgData({
                  localId: imgId, // 图片的localID
                  success: function (res) {
                    let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                    if (JNavigator.isAndroid()) {
                      localData = 'data:image/jgp;base64,' + localData;
                    }
                    _this_.upLoadPic(localData, len, index)
                  }
                });
              }
            })
            // let blobs = [];
            // localIds.forEach(function (localId, index) {
            //   _this_.$wechat.getLocalImgData({
            //     localId: localId, // 图片的localID
            //     success: function (res) {
            //       let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
            //       if (JNavigator.isAndroid()) {
            //         localData = 'data:image/jgp;base64,' + localData;
            //       }
            //       let file = File.dataURItoBlob(localData);
            //       // _this_.uploadData.append('files', file.blob, file.fileName); // blob对象,自己手动加上文件名
            //       blobs.push(file);
            //       // 合成完最后一个,开始上传
            //       if (index === len - 1) {
            //         _this_.uploadBlob(blobs, 'album', undefined, undefined, function (resList) {
            //           let postData = {
            //             topicContent: content,
            //             topicType: 11, // 活动相册
            //             imageUrls: JSON.stringify(resList),
            //             activityId: _this_.activityPickerId
            //           };
            //           // 保存图片到业务方
            //           _this_.$JHttp({
            //             url: window.baseURL + '/socialactivity/album/add?' + querystring.stringify(postData),
            //             method: 'post',
            //             headers: {
            //               defCommunityId: _this_.communityId
            //             }
            //           }).then(res => {
            //             if (res.status === 100) {
            //               // 开始保存逻辑
            //               _this_.$vux.loading.hide();
            //               _this_.$vux.toast.show({
            //                 type: 'success',
            //                 text: '发布成功'
            //               });
            //               setTimeout(function () {
            //                 _this_.content = '';
            //                 _this_.$router.go(-1);
            //               }, 2000)
            //             } else {
            //               _this_.$vux.toast.show({
            //                 type: 'cancel',
            //                 text: res.msg
            //               });
            //             }
            //           }).catch(error => {
            //             console.error(error);
            //           });
            //         })
            //       }
            //     }
            //   });
            // });
          } else {
            let params = {
              topicContent: content,
              topicType: 11,
              actId: _this_.activityPickerId
            };
            _this_.pubAlbum(params)
          }
        }
      },
      upLoadPic (data, length, key) {
        let _this = this;
        let file = File.dataURItoBlob(data);
        _this.imgBlobs.push(file);
        // 合成完最后一个,开始上传
        if (key === length - 1) {
          _this.uploadBlob(_this.imgBlobs, 'album', undefined, undefined, function (resList) {
            let params = {
              topicContent: _this.content.trim(),
              topicType: 11, // 活动相册
              imageUrls: JSON.stringify(resList),
              actId: _this.activityPickerId
            };
            _this.pubAlbum(params)
          });
        }
      },
      pubAlbum (params) {
        let _this = this;
        if (!params.actId) {
        _this.$vux.loading.hide();
          _this.$vux.toast.show({
            type: 'cancel',
            text: '请选择发布相册所属活动！'
          })
          return
        }
        _this.$JHttp({
          method: 'post',
          url: window.baseURL + '/socialactivity/album/add?' + querystring.stringify(params),
          headers: {
            defCommunityId: _this.communityId
          }
        }).then(res => {
          if (res.status === 100) {
            _this.$vux.loading.hide();
            _this.$vux.toast.show({
              type: 'success',
              text: '发布成功'
            })
            setTimeout(function () {
              _this.content = '';
              _this.$router.go(-1);
            }, 2000)
            // 代表在app打开的
            // if (_this.isApp === '1') {
            //   if (window.WebViewJavascriptBridge) {
            //     // 通知客户端,活动发布成功了
            //     window.WebViewJavascriptBridge.callHandler('_app_post_activity_success');
            //   }
            // } else {
            // _this.$router.go(-1)
            // }
          } else {
            _this.$vux.loading.hide();
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(err => {
          _this.$vux.loading.hide();
          _this.$vux.toast.show({
            type: 'cancel',
            text: err.msg
          })
        })
      },
      activityChange () {
        this.activityPickerId = parseInt(this.activityPicker)
      }
    }
  }
</script>
<style type="text/less" lang="less">
  .newThings-banner {
    .pub_option {
      border-bottom: 0.5px solid #d8d8d8;
      margin: 0 15px;
      padding: 5px 0;
      .weui-cell {
        padding: 10px 0;
      }
    }
    .chooseImg {
      display: flex;
      flex-wrap: wrap;
      /*justify-content: space-between;*/
      align-items: center;
      padding: 10px 15px;
      li {
        width: 105px;
        height: 105px;
        margin-left: 15px;
        margin-top: 15px;
        /*overflow: hidden;*/
        /*display: flex;*/
        /*align-items: center;*/
        img {
          width: 100%;
          height: 100%;
        }
      }
      li:nth-child(3n + 1) {
        margin-left: 0;
      }
      .add {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 103px;
        height: 103px;
        /*border: 1px dashed #D8D8D8;*/
        background-image: url("../../assets/images/addpic-210.png");
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
      }
      .addInApp {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 103px;
        height: 103px;
        position: relative;
        label {
          width: 103px;
          height: 103px;
          background-image: url("../../assets/images/addpic-210.png");
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }
        .uploadImg {
          position: absolute;
          left: 0;
          top: 0;
          clip: rect(0px, 0px, 0px, 0px);
          width: 100%;
          height: 5.706667rem;
        }
      }
    }
    .delete-wrapper {
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
  }
</style>
