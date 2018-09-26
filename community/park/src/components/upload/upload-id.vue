<template>
  <div class="upload-wrapper">
    <div class="preview-wrapper">
      <img class="id-previewer-img-hook pic" v-for="(item, index) in idPreviewPics"  :src="item.src"
           @click="showDeleteModal(index)">
      <label class="pic pic-front" for="idPics" v-show="!idPreviewPics[0]"></label>
      <label class="pic pic-back" for="idPics" v-show="!idPreviewPics[1]"></label>
      <!--<div v-transfer-dom>-->
      <!--<previewer :list="idPreviewPics" ref="previewer" :options="options"></previewer>-->
      <!--</div>-->
    </div>
    <!--上传身份证begin-->
    <input type="file" :name="name" class="upload-supporter" id="idPics" :accept="accept"
           :multiple="multiple" @change="readFile">
    <!--上传身份证end-->
    <!--删除操作begin-->
    <popup v-model="picDeleteShow" class="pic-delete-wrapper">
      <div class="top">
        <div class="title vux-1px-b">要删除这张照片吗?</div>
        <div class="delete" @click="deletePic">删除</div>
      </div>
      <div class="bottom">
        <div class="cancel" @click="picDeleteShow = false">取消</div>
      </div>
    </popup>
    <!--删除操作end-->
  </div>
</template>

<script>
  import {JNavigator} from '../../common/utils';
  import Toast from 'components/utils/toast/toast';
  import {Popup} from 'vux';
  import {zip} from '../../common/compress';
  export default {
    name: 'upload',
    components: {
      Popup
    },
    props: {
      name: {
        type: String,
        default: 'id-pics'
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
        default: ''
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
      let uploadedIdPics = this.$store.state.pageCfg.uploadedIdPics;
      this.idPreviewPics = uploadedIdPics.previewPics;
    },
    data () {
      return {
        idPreviewPics: [],
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
        // 删除预览图
        let idPreviewPics = this.idPreviewPics;
        for (let i = 0; i < idPreviewPics.length; i++) {
          if (i !== index) {
            let pic = idPreviewPics[i];
            previewPics.push(pic);
          }
        }
        this.idPreviewPics = previewPics;
        // 删除文件
        let pics = this.$store.state.pageCfg.uploadedIdPics.pics;
        for (let i = 0; i < pics.length; i++) {
          if (i !== index) {
            let pic = pics[i];
            newPics.push(pic);
          }
        }
        // 更新vuex状态
        this.$store.commit('updateUploadedIdPics', {
          uploadedIdPics: {
            pics: newPics,
            previewPics: this.idPreviewPics
          }
        });
        this.currentIndex = -1;
        this.picDeleteShow = false;
      },
      // 读取文件
      readFile: function (e) {
        let files = e.target.files || e.dataTransfer.files || []; // 获取file对象
        let pics = this.$store.state.pageCfg.uploadedIdPics.pics;
        let exitPicLength = pics.length;
        let max = 2 - exitPicLength;
        if (files.length > max) {
          Toast('你最多只能上传2张图片');
          return;
        }
        let _this_ = this;
        zip(files, undefined, function (results) {
          if (results && results.length) {
            results.forEach(function (result) {
              _this_.idPreviewPics.push({
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
          _this_.$store.commit('updateUploadedIdPics', {
            uploadedIdPics: {
              pics: pics,
              previewPics: _this_.idPreviewPics
            }
          });
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .upload-wrapper {
    .bg, .preview-wrapper {
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
      .pic-front {
        background-image: url('../../assets/img/@2x/idcard-down.png');
      }
      .pic-back {
        background-image: url('../../assets/img/@2x/idcard-up.png');
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
      .pic-front {
        background-image: url('../../assets/img/@3x/idcard-down@3x.png');
      }
      .pic-back {
        background-image: url('../../assets/img/@2x/idcard-up.png');
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
