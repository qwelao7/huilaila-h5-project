<template>
  <div class="commonHeader newThings">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      :title="topicTitle">
    </x-header>
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
  </div>
</template>
<script>
  import { querystring, TransferDom, XDialog, XHeader } from 'vux'
  import activityCardOne from '../../common/activityCardOne'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'topicDetail',
    directives: {
      TransferDom
    },
    components: {
      XDialog,
      JPull,
      activityCardOne,
      XHeader
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
        },
        topicTitle: ''
      }
    },
    created () {
      this.getTopicTitle();
      this.getData();
    },
    methods: {
      // 请求话题列表数据
      getData (loaded) {
        this.$vux.loading.show({
          text: '加载中'
        });
        let params = {
          topicType: this.$route.params.topicType,
          curPage: this.curPage,
          pageSize: this.pageSize
        };
        this.$JHttp({
          method: 'get',
          url: window.baseURL + '/neighbor/topic/list?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (loaded) {
            loaded(this.hasMore)
          }
          if (res.status === 100) {
            this.$vux.loading.hide();
            this.hasMore = res.data.pageResult.hasMore;
            let data = res.data.resultList;
            let obj = {};
            data.forEach(value => {
              obj = {
                type: 'newThing',
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
                  imgList: this.getImgList(value.annexs)
                },
                activity: {
                  isLike: value.isPraise,
                  like: value.topicPraiseNumber,
                  comments: value.topicCommentNumber
                },
                commentArr: value.comments
              };
              this.dataList.push(obj);
            });
          } else {
            this.$vux.loading.hide();
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e);
          this.$vux.loading.hide();
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
          let topicType = this.$route.params.topicType;
          this.$router.push({path: '/pub_newThings', query: {type: topicType}});
        }
      },
      goToBind () {
        this.$router.push('/Login')
      },
      // 获取话题种类列表
      getTopicTitle () {
        this.$JHttp({
          method: 'get',
          url: `${window.baseURL}/neighbor/topic/home`,
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          let topic = res.data.find(item => item.topicType === this.$route.params.topicType);
          this.topicTitle = topic && topic.topicTitle;
        }).catch(e => {

        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .newThings{
    height: 100%;
    /*height: 100%;*/
    /*padding-bottom: .98rem;*/
    background-color: #f7f7fa;
    .noContent{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 124px;
      margin-bottom: 248px;
      img{
        width: 150px;
        height: 150px;
      }
      p{
        margin-top: 10px;
        color: #aaaaaa;
        font-size: 15px;
      }
      span{
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
