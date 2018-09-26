<template>
  <div class="upload-wrapper">
    <div class="preview-wrapper">
      <img class="parking-previewer-img-hook pic" v-for="(item, index) in parkingPreviewPics" :src="item.src" :style="previewImgStyle"
           @click="showDeleteModal(index)">
      <label for="parkingPics" class="pic" v-show="!parkingPreviewPics[0]"></label>
      <label for="parkingPics" class="pic" v-show="!parkingPreviewPics[1]"></label>
      <label for="parkingPics" class="pic" v-show="!parkingPreviewPics[2]"></label>
      <!--<div v-transfer-dom>-->
        <!--<previewer :list="parkingPreviewPics" ref="previewer" :options="options"></previewer>-->
      <!--</div>-->
    </div>
    <!--上传车位证明begin-->
    <input type="file" :name="name" class="upload-supporter" id="parkingPics" :accept="accept"
           :multiple="multiple" @change="readFile">
    <!--上传车位证明end-->
    <!--图片操作begin-->
    <popup v-model="picDeleteShow" class="pic-delete-wrapper">
      <div class="top">
        <div class="title vux-1px-b">要删除这张照片吗?</div>
        <div class="delete" @click="deletePic">删除</div>
      </div>
      <div class="bottom">
        <div class="cancel" @click="picDeleteShow = false">取消</div>
      </div>
    </popup>
    <!--图片操作end-->
  </div>
</template>

<script>
  import {JNavigator} from '../../common/utils';
  import Toast from 'components/utils/toast/toast';
  import {zip} from '../../common/compress';
  import {Popup} from 'vux';
  export default {
    name: 'upload',
    directives: {
//      TransferDom
    },
    components: {
//      Previewer,
      Popup
    },
    props: {
      name: {
        type: String,
        default: 'parking-pics'
      },
      url: {
        type: String,
        default: window.homeURL + '/uploadAction!upload.action?module=order'
      },
      accept: {
        type: String,
        default: 'image/png, image/jpeg, image/gif, image/jpg'
      },
      multiple: {
        type: String,
        default: 'multiple'
      },
      device: {
        type: String,
        default: 'camera'
      }
    },
    computed: {
      whichDevice: function () {
        if (!this.device) {
          // android 下的qq或者微信内置浏览器,必须添加capture='camera'才能访问相机
          if (JNavigator.isAndroid() && (JNavigator.isWeiXin() || JNavigator.isQQ())) {
            return 'camera';
          } else {
            return '';
          }
        } else {
          return this.device;
        }
      }
    },
    created: function () {
      let uploadedParkingPics = this.$store.state.pageCfg.uploadedParkingPics;
      this.parkingPreviewPics = uploadedParkingPics.previewPics;
    },
    data () {
      return {
        previewImgStyle: {},
        options: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.parking-previewer-img-hook')[index];
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect();
            // w = width
            return {
              x: rect.left,
              y: rect.top + pageYScroll,
              w: rect.width
            };
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        },
        parkingPreviewPics: [],
        picDeleteShow: false,
        currentIndex: -1
      }
    },
    methods: {
//      show (index) {
//        this.$refs.previewer.show(index);
//      },
      showDeleteModal: function (index) {
        this.picDeleteShow = true;
        this.currentIndex = index;
      },
      // 删除图片
      deletePic: function () {
        let index = this.currentIndex;
        if (index === -1) {
          return;
        }
        let previewPics = [];
        let newPics = [];
        let parkingPreviewPics = this.parkingPreviewPics;
        // 删除预览图
        for (let i = 0; i < parkingPreviewPics.length; i++) {
          if (i !== index) {
            let pic = parkingPreviewPics[i];
            previewPics.push(pic);
          }
        }
        this.parkingPreviewPics = previewPics;
        // 删除文件
        let pics = this.$store.state.pageCfg.uploadedParkingPics.pics;
        for (let i = 0; i < pics.length; i++) {
          if (i !== index) {
            let pic = pics[i];
            newPics.push(pic);
          }
        }
        // 更新vuex状态
        this.$store.commit('updateUploadedParkingPics', {
          uploadedParkingPics: {
            pics: newPics,
            previewPics: this.parkingPreviewPics
          }
        });
        this.currentIndex = -1;
        this.picDeleteShow = false;
      },
      // 读取文件
      readFile: function (e) {
        let files = e.target.files || e.dataTransfer.files || []; // 获取file对象
        let pics = this.$store.state.pageCfg.uploadedParkingPics.pics;
        let exitPicLength = pics.length;
        let max = 3 - exitPicLength;
        if (files.length > max) {
          Toast('你最多只能上传3张图片');
          return;
        }
        let _this_ = this;
        zip(files, undefined, function (results) {
          if (results && results.length) {
            results.forEach(function (result) {
              _this_.parkingPreviewPics.push({
                src: result
              });
            });
          }
        }, function (blobs) {
          if (blobs && blobs.length) {
            blobs.forEach(function (blob) {
              pics.push(blob);
            });
          }
          _this_.$store.commit('updateUploadedParkingPics', {
            uploadedParkingPics: {
              pics: pics,
              previewPics: _this_.parkingPreviewPics
            }
          })
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .upload-wrapper {
    .preview-wrapper {
      padding: 0 0.4rem 0.4rem 0.4rem;
      font-size: 0;
      .pic {
        display: inline-block;
        margin-right: 0.4rem;
        width: 2.32rem;
        height: 2.32rem;
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
    .preview-wrapper span:last-child {
      margin-right: 0;
    }
    .preview-wrapper {
      .pic {
        background-image: url('../../assets/img/@2x/upload.png');
      }
    }
    .upload-supporter {
      position: fixed;
      top: -13.333333rem;
      opacity: 0;
    }
    .pic-delete-wrapper {
      background-color: #aaa;
      .top {
        background-color: #fff;
        margin-bottom: 0.16rem;
        .title {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 1.653333rem;
          font-size: 12px;
        }
        .delete {
          display: flex;
          align-items: center;
          justify-content: center;
          justify-content: center;
          height: 1.173333rem;
          color: #ff0000;
        }
      }
      .bottom {
        .cancel {
          width: 100%;
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 1.173333rem;
        }
      }
    }
  }
  [data-dpr="2"]
  .upload-wrapper {
    .pic-delete-wrapper {
      .top {
        .title {
          font-size: 24px;
        }
        .delete {
          font-size: 30px;
        }
      }
      .bottom {
        .cancel {
          font-size: 30px;
        }
      }
    }
  }
  [data-dpr="3"]
  .upload-wrapper {
    .preview-wrapper {
      .pic {
        background-image: url('../../assets/img/@3x/upload@3x.png');
      }
    }
    .pic-delete-wrapper {
      .top {
        .title {
          font-size: 42px;
        }
        .delete {
          font-size: 54px;
        }
      }
      .bottom {
        .cancel {
          font-size: 54px;
        }
      }
    }
  }
</style>
