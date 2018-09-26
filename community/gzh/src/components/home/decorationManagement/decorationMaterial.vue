<template>
  <div class="decoration-material-wrapper">
    <div class="list-wrapper">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <ul v-if="materialList.length">
            <li class="material-item" v-for="(material, index) in materialList" :key="index">
              <div class="header" v-if="isShowHeader(index)" v-text="material.materialType"></div>
              <div class="item-wrapper vux-1px-b">
                <div class="left">
                  <span class="name" v-text="material.materialName"></span>
                  <p class="detail" v-html="material.materialParamsText"></p>
                </div>
                <span class="right-btn" v-if="hasRepairAuth" v-text="'报修'" @click="openApp"></span>
              </div>
            </li>
          </ul>
          <div class="placeholder" v-if="!isLoading && !materialList.length">
            <span class="img"></span>
            <p class="text">什么都没发现，去别处看看吧</p>
          </div>
        </div>
      </j-pull>
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
  import JPull from 'components/base/JPull/JPull';
  import {querystring, XDialog, TransferDom} from 'vux'
  import open from '../../../common/js/openApp'
  export default {
    name: 'DecorationMaterial',
    directives: {
      TransferDom
    },
    components: {
      'j-pull': JPull,
      'x-dialog': XDialog
    },
    created: function () {
      // 查看小区是否具备报事报修服务
      this.getRepairAuth();
      this.getMaterialList();
    },
    data () {
      return {
        isLoading: true,
        hasRepairAuth: false,
        curPage: 1,
        pageSize: 20,
        materialList: [],
        isShowDialog: false,
        showDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 18px 0 18px',
          borderRadius: '20px'
        }
      }
    },
    methods: {
      getRepairAuth () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/community/houseKeepingSubCommunity'
        }).then(res => {
          let data = res.data;
          if (data && data.length) {
            let count = data.length;
            for (let i = 0; i < count; i++) {
              let service = data[i];
              let subCode = service.subCode;
              // 列表含有101,代表该小区开通了报修报事,则显示报修按钮
              if (subCode === 101) {
                _this_.hasRepairAuth = true;
                break;
              }
            }
          }
        }).catch(e => {
          console.log(e);
        });
      },
      isShowHeader (index) {
        if (index === 0) {
          return true;
        }
        let currentMaterial = this.materialList[index];
        let lastMaterial = this.materialList[index - 1];
        if (currentMaterial.materialType !== lastMaterial.materialType) {
          return true;
        } else {
          return false;
        }
      },
      getMaterialList (loaded) {
        this.isLoading = true;
        let params = {
          roomId: localStorage.getItem('roomId'),
          curPage: this.curPage,
          pageSize: this.pageSize
        }
        let material = {};
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/assetProfile/assetDecorationMaterialProfile?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            if (res.data && res.data.resultList.length) {
              res.data.resultList.forEach(function (res) {
                let paramsText = '';
                material = res;
                // 区域
                let setZone = res.setZone;
                paramsText += ('区域:&nbsp;&nbsp;' + setZone + '&nbsp;&nbsp;&nbsp;');
                // 规格
                let materialSpec = res.materialSpec;
                paramsText += ('规格:&nbsp;&nbsp;' + materialSpec + '&nbsp;&nbsp;&nbsp;');
                // 质保
                let guaranteeTime = res.guaranteeTime;
                paramsText += ('质保:&nbsp;&nbsp;' + guaranteeTime);
                material.materialParamsText = paramsText;
                _this_.materialList.push(material);
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
          _this_.isLoading = false;
          console.log(e)
        })
      },
      refreshData (loaded) {
        this.curPage = 1;
        this.materialList = [];
        this.getMaterialList(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getMaterialList(loaded);
      },
      openApp () {
        this.isShowDialog = true;
      },
      open () {
        open();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.decoration-material-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .list-wrapper {
    height: 100%;
    .material-item {
      margin: 15px 15px 0 15px;
      .header {
        padding-left: 10px;
        font-size: 15px;
        background-color: #F2F2F2;
        height: 24px;
        line-height: 24px;
      }
      .item-wrapper {
        height: 82px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          width: 265px;
          .name {
            font-size: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .detail {
            margin-top: 5px;
            font-size: 12px;
            color: #aaa;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .right-btn {
          flex: 0 0 60px;
          margin-left: 18px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          background-color: #fff;
          border-radius: 20px;
          border: 1px solid #0DAB60;
          color: #0DAB60;
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
</style>
