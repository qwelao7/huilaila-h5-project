<template>
  <div class="publish group-popup commonHeader">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="全部社群"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div style="height: 100%">
        <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
          <div slot="jpull-list">
            <ul class="group-banner" v-if="groupList.length > 0">
              <li v-for="item in groupList">
                <div class="avatar"><img :src="item.groupIcon" alt=""></div>
                <div class="introduce">
                  <div class="namePart">
                    <span class="name">{{item.groupTitle}}</span>
                    <span class="join" @click="joinUs(item)">加入</span>
                  </div>
                  <div class="content">
                    <span>{{item.groupIntro}}</span>
                  </div>
                </div>
              </li>
            </ul>
            <div class="noContent" v-if="groupList.length === 0">
              <img src="../../../assets/images/No-content.png" alt="">
              <p>什么都没发现，去别处看看吧</p>
              <!--<span @click="toPublish">去发帖</span>-->
            </div>
          </div>
        </j-pull>
      </div>
    </view-box>
    <div v-transfer-dom>
      <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur :dialog-style="groupStyle">
        <div class="popupBanner">
          <p class="title">{{title}}</p>
          <ul>
            <li class="QQ">
              <span>QQ群号：</span>
              <!--<span v-model="qqNum" class="num">{{qqNum}}</span>-->
              <input type="text" v-model="qqNum" class="num" readonly>
              <button class="copy" @click.stop="onCopy(qqNum)" :class="{isCopied: copied}">复制</button>
            </li>
            <li class="wechat">
              <span>微信号：</span>
              <!--<span v-model="wxNum" class="num">{{wxNum}}</span>-->
              <input type="text" v-model="wxNum" class="num" readonly>
              <button class="copy copied" @click.stop="onCopy1(wxNum)" :class="{isCopied: copied1}">复制</button>
            </li>
            <li class="illustrate">
              <span>入群须知：</span>
              <span style="flex: 1;word-break: break-all">{{notes}}</span>
            </li>
          </ul>
          <div class="btn" @click.stop="showHideOnBlur=false">
            <span>确定</span>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import {ViewBox, XHeader, XTextarea, Group, XDialog, TransferDomDirective as TransferDom, querystring} from 'vux'
  import JPull from '../../base/JPull/JPull'

  export default {
    name: 'pub_newThings',
    directives: {
      TransferDom
    },
    components: {
      ViewBox,
      XHeader,
      XTextarea,
      Group,
      XDialog,
      JPull
    },
    data () {
      return {
        groupList: [],
        showHideOnBlur: false,
        groupStyle: {
          maxWidth: '100%',
          borderRadius: '0.106667'
        },
        title: '',
        qqNum: '',
        wxNum: '',
        notes: '',
        copied: false,
        copied1: false,
        hasMore: false,
        startRow: 0,
        row: 10,
        curPage: 1,
        pageSize: 20
      }
    },
    created () {
      this.getData()
    },
    methods: {
      refreshData (loaded) {
        this.curPage = 1
        this.groupList = []
        this.getData(loaded)
      },
      loadMore (loaded) {
        this.curPage++
        this.getData(loaded)
      },
      getData (loaded) {
        let _this = this;
        _this.$vux.loading.show({
          text: '加载中'
        });
        let params = {
          curPage: _this.curPage,
          pageSize: _this.pageSize
        };
        _this.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId'),
            communityAll: parseFloat(localStorage.getItem('community_all'))
          },
          url: window.baseURL + '/index/socialgroup?' + querystring.stringify(params)
        }).then(res => {
          if (loaded) {
            loaded(_this.hasMore)
          }
          _this.$vux.loading.hide();
          if (res.status === 100) {
            _this.hasMore = res.data.pageResult.hasMore
            _this.groupList.forEach(item => {
              if (item.groupIcon) {
                item.groupIcon = window.aliyunImgUrl + item.groupIcon
              }
            })
            _this.groupList = _this.groupList.concat(res.data.resultList)
          } else {
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          console.log(e)
        })
      },
      joinUs (item) {
        // 显示弹窗
        this.showHideOnBlur = true;
        this.title = item.groupTitle;
        this.qqNum = item.qqGroupNum;
        this.wxNum = item.ownerWeixinNum;
        this.notes = item.notes;
        this.copied = false;
        this.copied1 = false;
      },
      onCopy (val) {
        let that = this;
        this.$copyText(val).then(res => {
          that.copied = true;
          that.$vux.toast.show({
            type: 'success',
            text: '复制成功'
          });
        }, err => {
          this.$vux.toast.show({
            type: 'cancel',
            text: '复制失败'
          });
          console.log(err)
        })
      },
      onCopy1 (val) {
        let that = this;
        this.$copyText(val).then(res => {
          that.copied1 = true;
          that.$vux.toast.show({
            type: 'success',
            text: '复制成功'
          });
        }, err => {
          this.$vux.toast.show({
            type: 'cancel',
            text: '复制失败'
          });
          console.log(err)
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .group-popup {
    height: 100%;
    .noContent {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 142.5px;
      margin-bottom: 284.5px;
      img {
        width: 150px;
        height: 150px;
      }
      p {
        margin-top: 10px;
        color: #aaaaaa;
        font-size: 15px;
      }
    }
  }

  .group-banner {
    padding: 0 15px;
    li {
      width: 100%;
      display: flex;
      margin-top: 20px;
      justify-content: space-between;
      align-items: flex-start;
      .avatar {
        width: 100px;
        height: 100px;
        overflow: hidden;
        display: flex;
        align-items: center;
      }
      .introduce {
        margin-left: 10px;
        margin-top: 15px;
        flex: 1;
        .namePart {
          display: flex;
          justify-content: space-between;
          span {
            display: block;
          }
          .name {
            font-size: 18px;
            color: #333333;
            font-weight: 400;
            width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .join {
            width: 78px;
            text-align: center;
            height: 23px;
            line-height: 23px;
            color: #0DAB60;
            font-size: 12px;
            border: 1px solid #0DAB60;
            border-radius: 50px;
          }
        }
        .content {
          margin-top: 16px;
          span {
            display: block;
            font-size: 12px;
            color: #333333;
            word-break: break-all;
          }
        }
      }
    }
  }
</style>

