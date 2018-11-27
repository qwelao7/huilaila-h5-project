<template>
  <div class="commonHeader file-list-wrapper">
    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="leftOptions"
        @on-click-back="backMy"
        :title="customTitle"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;">
        <x-icon slot="right" type="ios-plus-empty" size="30" style="margin-top: -6px" @click="addFiles"></x-icon>
      </x-header>
      <div class="list-wrapper">
        <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
          <div slot="jpull-list">
            <ul v-show="fileList.length">
              <li class="file-item vux-1px-b" @click="goLevelTwo(file.id, file.categoryName)"
                  v-for="(file, index) in fileList" :key="index">
                <div class="item-wrapper">
                  <div class="left">
                    <span class="bg"></span>
                    <span class="name" v-text="file.categoryName"></span>
                  </div>
                  <span class="icon"></span>
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

  export default {
    name: 'FileList',
    created: function () {
      this.getFileList();
    },
    components: {
      'j-pull': JPull,
      ViewBox,
      XHeader
    },
    props: {
      level: ''
    },
    data () {
      return {
        leftOptions: {
          preventGoBack: true,
          backText: ''
        },
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
        if (title) {
          return decodeURI(title);
        } else {
          return '房产档案';
        }
      }
    },
    methods: {
      getFileList (loaded) {
        this.isLoading = true;
        let params = {
          roomId: localStorage.getItem('roomId'),
          categoryLevel: this.level,
          curPage: this.curPage,
          pageSize: this.pageSize
        }
        if (this.fileId) {
          params.superId = this.fileId;
        }
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/assetProfile/assetProfileCategory?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            _this_.fileList = _this_.fileList.concat(res.data.resultList);
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
      goLevelTwo (fileId, fileName) {
        if (this.level === 1) {
          this.$router.push({
            path: '/propertyFileTwo/' + fileId,
            query: {
              title: encodeURI(fileName)
            }
          });
        } else if (this.level === 2) {
          this.$router.push({
            path: '/propertyPaperList/' + fileId,
            query: {
              superId: this.fileId,
              title: encodeURI(fileName)
            }
          });
        }
      },
      addFiles () {
        if (this.level === 1) {
          this.$router.push({
            path: '/propertyFiles/addFiles',
            query: {
              level: 1
            }
          });
        } else if (this.level === 2) {
          this.$router.push({
            path: '/propertyFiles/addFiles',
            query: {
              level: 2,
              superId: this.$route.params.fileId
            }
          });
        }
      },
      backMy () {
        if (this.level === 1) {
          this.$router.push('/myHouse')
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .file-list-wrapper {
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

            .bg {
              width: 60px;
              height: 60px;
              background-image: url("../../../assets/images/propertyFile/folder_icon.png");
              background-size: 100%;
              background-repeat: no-repeat;
            }

            .name {
              margin-left: 12px;
              font-size: 15px;
            }
          }

          .icon {
            position: relative;
            width: 28px;
            height: 28px;
          }

          .icon:before {
            content: "";
            position: absolute;
            width: 14px;
            height: 14px;
            border: 1px solid #AAA;
            border-width: 1px 0 0 1px;
            transform: rotate(135deg);
            top: 7px;
            left: 7px;
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
