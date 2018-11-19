<template>
  <div class="recommend">
    <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
      <div slot="jpull-list">
        <div class="swiperBanner" v-if="imgLists.length">
          <div class="swiper" v-if="communityAll=== 0">
            <swiper :list="imgLists" loop auto height="5.12rem" dots-class="custom-bottom" dots-position="right"
                    :show-desc-mask="false"></swiper>
          </div>
          <!--菜单栏-->
          <!--<div class="list-under-swiper">
            <grid>
              <grid-item :label="item.customName" v-for="item in list" :key="item.id">
                <img slot="icon" :src="item.iconUrl">
              </grid-item>
            </grid>
          </div>-->
          <!--菜单栏-->
        </div>
        <div v-for="(item, i) in recommendArr" v-show="recommendArr.length">
          <div class="activityBanner" v-if="item.dataType === '1'">
            <activityCardOne :dataList="item" :ind="i"></activityCardOne>
          </div>
          <div v-if="item.dataType === '2'">
            <comCard :buildList1="item"></comCard>
          </div>
          <div v-if="item.dataType === '5'">
            <activityList :dataList="item"></activityList>
          </div>
        </div>
        <div class="noContent" v-show="!recommendArr.length">
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
  import {Swiper, SwiperItem, Scroller, Spinner, Grid, GridItem, ViewBox, TransferDom, XDialog, querystring} from 'vux'
  import activityList from '../../common/activityCard'
  import activityCardOne from '../../common/activityCardOne'
  import comCard from '../../community/comCard'
  import JPull from '../../base/JPull/JPull'

  export default {
    name: 'recommend',
    directives: {
      TransferDom
    },
    components: {
      JPull,
      Swiper,
      SwiperItem,
      Scroller,
      Spinner,
      Grid,
      GridItem,
      ViewBox,
      XDialog,
      activityList,
      activityCardOne,
      comCard
    },
    data () {
      return {
        imgLists: [],
        list: {},
        curPage: 1,
        pageSize: 20,
        recommendArr: [],
        communityInfo: [],
        hasMore: true,
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        },
        communityId: '',
        communityAll: ''
      }
    },
    created () {
      this.communityId = localStorage.getItem('communityId')
      this.communityAll = localStorage.getItem('community_all')
      this.getCarousel();
      this.getRecommend();
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.$emit('changeIndex', 0)
        if (vm.communityId !== localStorage.getItem('communityId') || parseFloat(localStorage.getItem('community_all')) === 1) {
          vm.communityId = localStorage.getItem('communityId')
          vm.refreshData()
        }
      })
    },
    methods: {
      getCarousel (loaded) {
        let _this = this;
        if (parseFloat(localStorage.getItem('community_all')) === 1) {
        } else {
          _this.$JHttp({
            method: 'get',
            url: window.baseURL + '/index/carousel',
            headers: {
              defCommunityId: localStorage.getItem('communityId'),
              communityAll: parseFloat(localStorage.getItem('community_all'))
            }
          }).then(res => {
            if (res.status === 100) {
              if (loaded) {
                loaded()
              }
              _this.imgLists = [];
              res.data.forEach(val => {
                let url;
                if (val.focusType === '1') { // 跳转自详情
                  url = '/bannerNews/' + val.id
                } else if (val.focusType === '3') { // 跳转至外部链接
                  url = val.url
                }
                let obj = {
                  url: url,
                  img: val.smallPic,
//                title: val.title,
                  id: val.id
                };
                _this.imgLists.push(obj)
              })
            }
          }).catch(e => {
            console.log(e)
          });
        }
        //  获取中间菜单栏
        // _this.$JHttp({
        //   method: 'get',
        //   url: window.baseURL + '/home/recommendSubjects',
        //   headers: {
        //     defCommunityId: localStorage.getItem('communityId'),
        //     communityAll: parseFloat(localStorage.getItem('community_all'))
        //   }
        // }).then(res => {
        //   if (loaded) {
        //     loaded()
        //   }
        //   if (res.status === 100) {
        //     _this.list = res.data.list;
        //   }
        // }).catch(err => {
        //   console.log(err);
        // })
      },
      getRecommend (loaded) {
        let that = this;
        let params = {
          curPage: that.curPage,
          pageSize: that.pageSize
        };
        that.$vux.loading.show({
          text: '加载中'
        });
        that.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId'),
            communityAll: parseFloat(localStorage.getItem('community_all'))
          },
//          url: window.baseURL + '/neighbor/list?' + querystring.stringify(params)
          url: window.baseURL + '/recommend/index?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            this.$vux.loading.hide();
            that.hasMore = res.data.pageResult.hasMore;
            if (loaded) {
              loaded(that.hasMore)
            }
            let obj = {};
            let data = res.data.resultList;
            if (data) {
              data.forEach(value => {
                if (value.dataType === '2') {
//                  cArr.push(value);
                  obj = {
                    dataType: value.dataType,
                    name: value.title,
                    img: value.smallPic,
                    id: value.id,
                    isPraise: value.isPraise,
                    praisenum: value.praisenum,
                    commentNum: value.commentNum,
                    dataInstruction: value.intime,
                    type: value.voteId ? 'survey' : value.type
                  };
                } else if (value.dataType === '1') {
//                  vArr.push(value);
                  obj = {
                    type: 'recommend',
                    dataType: value.dataType,
                    topicType: value.topicType,
                    userId: value.userId,
                    neighborId: value.neighborId,
                    pubTime: value.inTimeTag,
                    voteId: value.voteId,
                    tags: value.topicTag,
                    user: {
                      name: value.userName,
                      avatar: value.headPicName
                    },
                    container: {
                      content: value.topicContent,
                      imgList: that.getImgList(value.annexs)
                    },
                    activity: {
                      isLike: value.isPraise,
                      like: value.topicPraiseNumber,
                      comments: value.topicCommentNumber,
                      vote: value.topicPollNumber
                    },
                    commentArr: value.comments,
                    endTimeStr: value.endTimeStr
                  };
                } else if (value.dataType === '5') {
                  obj = value
                }
                that.recommendArr.push(obj);
              });
            }
          } else {
            that.$vux.loading.hide();
            that.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e);
          that.$vux.loading.hide();
        })
      },
      getImgList (val) {
        let obj1 = {};
        let arr = [];
        if (val) {
          val.forEach(res => {
            obj1 = {
              src: res
            };
            arr.push(obj1)
          });
          return arr
        } else {
          return [{src: ''}]
        }
      },
      refreshData (loaded) {
        this.curPage = 1;
        this.recommendArr = [];
        this.communityInfo = [];
        this.imgLists = [];
        this.getRecommend(loaded);
        this.getCarousel(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getRecommend(loaded);
      },
      toPublish () {
        let token = localStorage.getItem('token')
        if (!token) {
          this.deleteModalShow = true
        } else {
          // 默认发新鲜事
          this.$router.push({
            path: '/pub_newThings',
            query: {type: 6}
          })
        }
      },
      goToBind () {
        this.$router.push('/Login')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .recommend {
    height: 100%;
    background-color: #f7f7fa;
    .swiperBanner {
      .list-under-swiper {
        background-color: #ffffff;
        .weui-grids {
          padding: 14px 0 20px 0;
          .weui-grid {
            padding: 0;
            .weui-grid__label {
              font-size: 12px;
            }
          }
          .weui-grid:before, .weui-grid:after {
            border: none;
          }
        }
        .weui-grids:before, .weui-grids:after {
          border: none;
        }
      }
    }
    .activityBanner {
      /*margin-top: 10px;*/
      /*background-color: #ffffff;*/
    }
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
