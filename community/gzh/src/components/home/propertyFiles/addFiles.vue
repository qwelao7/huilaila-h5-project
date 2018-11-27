<template>
  <div class="publish commonHeader no-margin-top">
    <!--<view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">

    </view-box>-->
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="提交房产档案">
      <a slot="right" @click="publish">上传</a>
    </x-header>
    <div class="newThings-banner">
      <group>
        <div slot="title" class="picker-title">选择一级文件分类</div>
        <popup-picker placeholder="请选择" :data="propertyList" v-model="propertyPicker"
                      show-name ref="picker" value-text-align="left"
                      @on-change="propertyChange" class="pub_option"></popup-picker>
      </group>
      <group>
        <div slot="title" class="picker-title">选择二级文件分类</div>
        <popup-picker placeholder="请选择" :data="propertyList1" v-model="propertyPicker1"
                      show-name ref="picker" value-text-align="left"
                      :disabled="disabled"
                      @on-change="propertyChange1" class="pub_option"></popup-picker>
      </group>
      <ul class="chooseImg">
        <li v-for="(localId, index) in localIds">
          <img :src="localId" @click.prevent="showDeletePop(index)" alt="">
        </li>
        <li class="add" @click="chooseImages" v-show="localIds.length < 9"></li>
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
  import {File} from '../../../common/js/Upload'
  import {JNavigator} from '../../../common/js/utils'
  import {Base64} from 'js-base64';

  export default {
    name: 'addPropertyFiles',
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
        level: null,
        propertyPicker: [],
        propertyPicker1: [],
        propertyPickerId: null,
        propertyPickerId1: null,
        propertyList: [],
        propertyList1: [],
        propertyInfo: [],
        propertyInfo1: [],
        disabled: true,
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
      this.level = parseFloat(this.$route.query.level)
      this.getPropertyFileList()
    },
    methods: {
      getPropertyFileList () {
        let _this = this
        let params = {
          categoryType: 1,
          categoryStatus: 1,
          categoryLevel: 1,
          curPage: 1,
          pageSize: 2000
        }
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/assetProfile/category?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            console.log(res)
            let tempList = []
            _this.propertyInfo = res.data.resultList
            res.data.resultList.forEach(val => {
              let tem = {}
              tem.name = val.categoryName
              tem.value = String(val.id)
              tempList.push(tem)
            })
            _this.propertyList.push(tempList)
            if (_this.level > 1) {
              _this.disabled = false
              _this.propertyPicker[0] = this.$route.query.superId
              this.propertyPickerId = parseInt(this.propertyPicker)
              _this.getPropertyFileList2(_this.propertyPicker[0])
            }
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
      getPropertyFileList2 (superId) {
        let _this = this
        let params = {
          categoryType: 1,
          categoryStatus: 1,
          categoryLevel: 2,
          superId: parseFloat(superId),
          curPage: 1,
          pageSize: 2000
        }
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/assetProfile/category?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            console.log(res)
            let tempList = []
            _this.propertyList1 = []
            _this.propertyInfo1 = res.data.resultList
            console.log(this.propertyInfo)
            res.data.resultList.forEach(val => {
              let tem = {}
              tem.name = val.categoryName
              tem.value = String(val.id)
              tempList.push(tem)
            })
            _this.propertyList1.push(tempList)
            if (_this.level === 3) {
              _this.propertyPicker1[0] = _this.$route.query.assetProfileCategoryId
              _this.propertyPickerId1 = parseInt(_this.propertyPicker1)
            }
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
        let token = localStorage.getItem('token');
        if (!token) {
          this.deleteModalShow = true;
        } else {
          let _this_ = this;
          if (!this.propertyPickerId1) {
            this.$vux.toast.show({
              type: 'cancel',
              text: '请选择文件分类'
            });
            return
          }
          let localIds = this.localIds;
          let len = localIds.length;
          /* 传了图片 */
          if (len) {
            _this_.$vux.loading.show({
              text: '发布中...'
            });
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
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              text: '请选择上传文件'
            });
          }
        }
      },
      upLoadPic (data, length, key) {
        let _this = this;
        let file = File.dataURItoBlob(data);
        _this.imgBlobs.push(file);
        // 合成完最后一个,开始上传
        if (key === length - 1) {
          _this.uploadBlobProfile(_this.imgBlobs, 'propertyFile', undefined, undefined, function (resList) {
            let roomList = []
            roomList[0] = parseFloat(localStorage.getItem('roomId'))
            let params = {
              assetProfileCategoryId: _this.propertyPickerId1,
              appShow: 1,
              communityRoomNumIdList: roomList,
              profileFList: resList
            };
            _this.pubAlbum(params)
          });
        }
      },
      pubAlbum (params) {
        let _this = this;
        _this.$JHttp({
          method: 'post',
          url: window.baseURL + '/assetProfile/assetHouseProfile',
          data: params,
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
              _this.$router.push('/myHouse');
            }, 2000)
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
      propertyChange () {
        this.disabled = false
        this.propertyPickerId = parseInt(this.propertyPicker)
        this.propertyPicker1 = []
        this.propertyPickerId1 = null
        this.getPropertyFileList2(this.propertyPicker[0])
        setTimeout(function () {
          if (this.level === 3) {
            this.propertyPicker1 = []
            this.propertyPickerId1 = null
          }
        }, 1000)
      },
      propertyChange1 () {
        this.propertyPickerId1 = parseInt(this.propertyPicker1)
      }
    }
  }
</script>
<style type="text/less" lang="less">
  .newThings-banner {
    .picker-title {
      font-size: 18px;
      padding: 15px 15px 0 15px
    }

    .tips {
      font-size: 15px;
      line-height: 21px;
      padding: 15px 15px 0 15px;
    }

    .pub_option {
      border-top: none;
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
        background-image: url("../../../assets/images/addpic-210.png");
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
          background-image: url("../../../assets/images/addpic-210.png");
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
