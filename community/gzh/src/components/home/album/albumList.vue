<template>
  <div class="newThings commonHeader">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="活动相册"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      </x-header>
      <tabbar style="background-color: #0DAB60" @click.native="addAlbum">
        <tabbar-item>
          <span slot="label" style="color: #fff;font-size: 16px">提交照片</span>
        </tabbar-item>
      </tabbar>
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <div v-for="item in dataList" v-if="dataList.length">
            <div class="activityBanner">
              <activityCardOne :dataList="item"></activityCardOne>
            </div>
          </div>
          <div class="noContent" v-if="!dataList.length">
            <img src="../../../assets/images/No-post.png" alt="">
            <p>迫不及待听你说</p>
            <span @click="toPublish">去发帖</span>
          </div>
        </div>
      </j-pull>
      <div v-transfer-dom>
        <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
          <span class="delete-info vux-1px-b">您尚未绑定手机号</span>
          <div class="operate-wrapper">
            <span class="text vux-1px-r" @click="deleteModalShow = false">以后再说</span>
            <span class="text" @click="goToBind">前往绑定</span>
          </div>
        </x-dialog>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {querystring, TransferDom, XDialog, ViewBox, XHeader, Tabbar, TabbarItem} from 'vux'
  import activityCardOne from '../../common/activityCardOne'
  import JPull from '../../base/JPull/JPull'

  export default {
    name: 'albumList',
    directives: {
      TransferDom
    },
    components: {
      XDialog,
      JPull,
      activityCardOne,
      ViewBox,
      XHeader,
      Tabbar,
      TabbarItem
    },
    data () {
      return {
        dataList: [],
        curPage: 1,
        pageSize: 20,
        hasMore: true,
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        }
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData (loaded) {
        let _this = this;
        _this.$vux.loading.show({
          text: '加载中'
        });
        let params = {
          topicType: 11,
          curPage: _this.curPage,
          pageSize: _this.pageSize,
          activityId: _this.$route.params.activityId
        };
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/album/list?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (loaded) {
            loaded(_this.hasMore)
          }
          if (res.status === 100) {
            _this.$vux.loading.hide();
            console.log(res.data);
            _this.hasMore = res.data.pageResult.hasMore;
            let data = res.data.resultList;
            let obj = {};
            data.forEach(value => {
              obj = {
                type: 'album',
                topicType: value.topicType,
                userId: value.userId,
                neighborId: value.neighborId,
                pubTime: value.inTimeTag,
                user: {
                  name: value.userName,
                  avatar: value.headPicName
                },
                container: {
                  content: value.topicContent,
                  imgList: _this.getImgList(value.annexs)
                },
                activity: {
                  isLike: value.isPraise,
                  like: value.topicPraiseNumber,
                  comments: value.topicCommentNumber
                },
                commentArr: value.comments
              };
              _this.dataList.push(obj);
            });
          } else {
            _this.$vux.loading.hide();
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e);
          _this.$vux.loading.hide();
        })
      },
      getImgList (val) {
        let obj1 = {};
        let arr = [];
        val.forEach(res => {
          obj1 = {
            src: res
          };
          arr.push(obj1)
        });
        return arr
      },
      refreshData (loaded) {
        this.curPage = 1;
        this.dataList = [];
        this.getData(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getData(loaded);
      },
      toPublish () {
        let token = localStorage.getItem('token')
        if (!token) {
          this.deleteModalShow = true
        } else {
          this.$router.push('/pub_album/' + this.$route.params.activityId)
        }
      },
      goToBind () {
        this.$router.push('/Login')
      },
      addAlbum () {
        this.$router.push('/pub_album/' + this.$route.params.activityId)
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .newThings {
    height: 100%;
    /*height: 100%;*/
    /*padding-bottom: .98rem;*/
    background-color: #f7f7fa;
    .noContent {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 124px;
      margin-bottom: 248px;
      img {
        width: 150px;
        height: 150px;
      }
      p {
        margin-top: 10px;
        color: #aaaaaa;
        font-size: 15px;
      }
      span {
        width: 150px;
        height: 35px;
        margin-top: 20px;
        line-height: 35px;
        text-align: center;
        background-color: #0DAB60;
        color: #ffffff;
        font-size: 15px;
        border-radius: 67px;
      }
    }
  }
</style>
