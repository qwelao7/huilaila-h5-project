<template>
  <div class="commonHeader paper-list-wrapper">
    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        :title="customTitle"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      </x-header>
      <div class="list-wrapper">
        <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
          <div slot="jpull-list">
            <ul v-show="fileList.length">
              <li class="file-item vux-1px-b" v-for="(file, index) in fileList" :key="index">
                <div class="item-wrapper" @click="goDetail(file.profilePath)">
                  <div class="left">
                    <span v-if="!file.isImg" class="bg" :class="file.className"></span>
                    <bg-img v-if="file.isImg" :osskey="file.imgUrl" :type="'small'"></bg-img>
                    <div class="content">
                      <span class="name" v-text="file.profileName"></span>
                      <span class="time" v-text="file.intime"></span>
                    </div>
                  </div>
                  <span class="size" v-text="file.fileSizeStr"></span>
                </div>
              </li>
            </ul>
            <div class="placeholder" v-show="!isLoading && !fileList.length">
              <span class="img"></span>
              <p class="text">什么都没发现，去别处看看吧</p>
            </div>
          </div>
        </j-pull>
      </div>
    </view-box>
  </div>
</template>

<script>
import JPull from 'components/base/JPull/JPull';
import {XHeader, ViewBox, querystring} from 'vux'
import aliOSSUtils from '../../../common/js/aliOSSUtils'
import {JNavigator} from '../../../common/js/utils'
import BGImg from '../../common/img/bgImg.vue'
import open from '../../../common/js/openApp'
export default {
  name: 'FileList',
  created: function () {
    this.getFileList();
  },
  components: {
    'j-pull': JPull,
    ViewBox,
    XHeader,
    'bg-img': BGImg
  },
  props: {
    level: ''
  },
  data () {
    return {
      isLoading: true,
      curPage: 1,
      pageSize: 20,
      fileList: []
    }
  },
  computed: {
    fileId () {
      return this.$route.params.fileId;
    },
    customTitle () {
      let title = this.$route.query.title;
      return decodeURI(title);
    }
  },
  methods: {
    getFileList (loaded) {
      this.isLoading = true;
      let params = {
        roomId: localStorage.getItem('roomId'),
        categoryId: this.fileId,
        curPage: this.curPage,
        pageSize: this.pageSize
      }
      let file = {};
      let _this_ = this;
      _this_.$JHttp({
        method: 'get',
        url: window.baseURL + '/assetProfile/assetDecorationProfile?' + querystring.stringify(params)
      }).then(res => {
        if (res.status === 100) {
          if (res.data && res.data.resultList.length) {
            res.data.resultList.forEach(function (res) {
              file = res;
              let fileName = res.profileName;
              // 处理文件格式,转化成不同的class
              if (fileName.lastIndexOf('.xlsx') !== -1 || fileName.indexOf('.xls') !== -1) {
                file.className = 'file-type-excel';
              } else if (fileName.lastIndexOf('.docx') !== -1 || fileName.indexOf('.doc') !== -1) {
                file.className = 'file-type-word';
              } else if (fileName.lastIndexOf('.pptx') !== -1 || fileName.indexOf('.ppt') !== -1) {
                file.className = 'file-type-ppt';
              } else if (fileName.lastIndexOf('.jpeg') !== -1 || fileName.indexOf('.jpg') !== -1 ||
                fileName.indexOf('.png') !== -1 || fileName.indexOf('.gif') !== -1 ||
                fileName.indexOf('.bmp') !== -1) {
                file.isImg = true;
                file.imgUrl = file.profilePath;
              } else if (fileName.lastIndexOf('.pdf') !== -1) {
                file.className = 'file-type-pdf';
              } else {
                file.className = 'file-type-other';
              }
              let fileSize = res.profileSize;
              let fileSizeStr = '';
              if (fileSize >= 1024) {
                fileSizeStr = Math.round(fileSize / 1024).toFixed(1) + 'MB';
              } else {
                fileSizeStr = fileSize.toFixed(1) + 'KB';
              }
              file.fileSizeStr = fileSizeStr;
              _this_.fileList.push(file);
            });
          }
          if (loaded) {
            let hasMore = res.data.pageResult.hasMore;
            loaded(hasMore);
          }
          _this_.isLoading = false;
        } else {
          _this_.$vux.toast.show({
            type: 'cancel',
            text: res.msg
          })
          _this_.isLoading = false;
        }
      }).catch(e => {
        console.log(e)
        _this_.isLoading = false;
      })
    },
    refreshData (loaded) {
      this.curPage = 1;
      this.fileList = [];
      this.getFileList(loaded);
    },
    loadMore (loaded) {
      this.curPage++;
      this.getFileList(loaded);
    },
    goDetail (key) {
      window.location.href = window.aliyunHome + key.split('.com')[1];
      setTimeout(function () {
        alert('此文件暂不支持公众号预览,即将前往回来啦App');
        if (JNavigator.isIOS()) {
          open();
        }
      }, 3000);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.paper-list-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .list-wrapper {
    height: 100%;
    .file-item {
      height: 79px;
      margin: 0 10px;
      .item-wrapper {
        height: 100%;
        padding: 0 7px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          font-size: 0;
          display: flex;
          align-items: center;
          /*max-width: 280px;*/
          .bg {
            width: 30px;
            height: 30px;
            background-size: 100%;
            background-repeat: no-repeat;
          }
          .file-type-excel {
            background-image: url("../../../assets/images/propertyFile/excel_icon_80.png");
          }
          .file-type-word {
            background-image: url("../../../assets/images/propertyFile/word_icon_80.png");
          }
          .file-type-ppt {
            background-image: url("../../../assets/images/propertyFile/ppt_icon_80.png");
          }
          .file-type-pdf {
            background-image: url("../../../assets/images/propertyFile/pdf_icon_80.png");
          }
          .file-type-other {
            background-image: url("../../../assets/images/propertyFile/unknown_icon_80.png");
          }
          .content {
            margin-left: 12px;
            display: flex;
            flex-direction: column;
            .name {
              font-size: 15px;
              max-width: 240px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .time {
              font-size: 12px;
              white-space: nowrap;
            }
          }
        }
      }
    }
    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      .img {
        width: 225px;
        height: 225px;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url('../../../assets/images/No-content.png');
      }
      .text {
        font-size: 15px;
      }
    }
  }
}
</style>
