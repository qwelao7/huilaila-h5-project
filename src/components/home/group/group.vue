<template>
  <div class="group">
    <div style="height: calc(100% - .9rem)">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <div v-for="item in dataList" v-if="dataList.length">
            <div class="activityBanner">
              <activityCardOne :dataList="item"></activityCardOne>
            </div>
          </div>
          <div class="noContent" v-if="!dataList.length">
            <img src="../../../assets/images/No-content.png" alt="">
            <p>什么都没发现，去别处看看吧</p>
            <!--<span @click="toPublish">去发帖</span>-->
          </div>
        </div>
      </j-pull>
    </div>
    <div class="allGroup" v-show="showAllGroup" @click="showGroups">
      <span>全部圈子</span>
    </div>
    <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
      <span class="delete-info vux-1px-b">您尚未绑定手机号</span>
      <div class="operate-wrapper">
        <span class="text vux-1px-r" @click="deleteModalShow = false">以后再说</span>
        <span class="text" @click="goToBind">前往绑定</span>
      </div>
    </x-dialog>
  </div>
</template>
<script>
  import { ViewBox, querystring, XDialog } from 'vux'
  import activityList from '../../common/activityCard'
  import activityCardOne from '../../common/activityCardOne'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'group',
    components: {
      JPull,
      ViewBox,
      XDialog,
      activityList,
      activityCardOne
    },
    data () {
      return {
        dataList: [],
        curPage: 1,
        hasMore: true,
        showAllGroup: false,
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.4rem 0 0 0',
          borderRadius: '20px'
        }
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData (loaded) {
        let _this = this;
        this.$vux.loading.show({
          text: '加载中'
        });
        let params = {
          topicType: 8,
          curPage: this.curPage,
          pageSize: 20
        };
        this.$JHttp({
          method: 'get',
          url: window.baseURL + '/neighbor/topic/list?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (loaded) {
            loaded(_this.hasMore)
          }
          if (res.status === 100) {
            _this.$vux.loading.hide();
            _this.showAllGroup = true;
            _this.hasMore = res.data.pageResult.hasMore;
            let data = res.data.resultList;
            let obj = {};
            data.forEach(value => {
              obj = {
                type: 'group',
                topicType: value.topicType,
                userId: value.userId,
                neighborId: value.neighborId,
                pubTime: value.inTimeTag,
                tags: value.topicTag,
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
          console.log(e)
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
      showGroups () {
//        let token = localStorage.getItem('token');
//        if (!token) {
//          this.deleteModalShow = true
//        } else {
//          this.$router.push('/all_group')
//        }
        this.$router.push('/all_group')
      },
      goToBind () {
        this.$router.push('/Login')
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
        this.$router.push('/pub_newThings')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .group{
    position: relative;
    height: 100%;
    background-color: #f7f7fa;
    .noContent{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 142.5px;
      margin-bottom: 284.5px;
      img{
        width: 150px;
        height: 150px;
      }
      p{
        margin-top: 10px;
        color: #aaaaaa;
        font-size: 15px;
      }
    }
  }
  .allGroup {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: absolute;
    z-index: 500;
    bottom: 0;
    width: 100%;
    max-width: 750px;
    justify-content: center;
    background-color: #ffffff;
    border-top: 0.5px solid #D8D8D8;
    span {
      font-size: 15px;
      color: #333333;
      text-align: center;
      height: 44px;
      line-height: 44px;
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
</style>
