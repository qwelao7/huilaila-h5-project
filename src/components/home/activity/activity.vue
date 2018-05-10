<template>
  <div class="activity">
    <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
      <div slot="jpull-list">
        <div v-for="item in dataList" v-show="dataList.length">
          <activityList :dataList="item"></activityList>
        </div>
        <div class="noContent" v-show="!dataList.length">
          <img src="../../../assets/images/No-interaction.png" alt="">
          <p>好像有点懒</p>
          <span @click="toPublish">去互动</span>
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
  import { querystring, TransferDom, XDialog } from 'vux'
  import activityListOne from '../../common/activityCardOne'
  import activityList from '../../common/activityCard'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'newThings',
    directives: {
      TransferDom
    },
    components: {
      XDialog,
      JPull,
      activityList,
      activityListOne
    },
    data () {
      return {
        curPage: 1,
        pageSize: 20,
        hasMore: false,
        headers: {
          defCommunityId: localStorage.getItem('communityId')
        },
        dataList: [],
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
      refreshData (loaded) {
        this.curPage = 1;
        this.dataList = [];
        this.getData(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getData(loaded);
      },
      getData (loaded) {
        this.$vux.loading.show({
          text: '加载中'
        });
        let params = {
          curPage: this.curPage,
          pageSize: this.pageSize
        };
        let _this = this;
        this.$JHttp({ // 官方活动
          method: 'get',
          url: window.baseURL + '/socialactivity/getActivityList?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (loaded) {
            loaded(_this.hasMore)
          }
          if (res.status === 100) {
            this.$vux.loading.hide();
            _this.hasMore = res.data.pageResult.hasMore;
            let data = res.data.resultList;
//            let data = res.data;
            data.forEach(val => {
              _this.dataList.push(val)
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
        });
      },
      toPublish () {
//        alert(1111)
        let token = localStorage.getItem('token')
        if (!token) {
          this.deleteModalShow = true
        } else {
//          this.$router.push('/pub_newThings')
          let _this = this;
          _this.$JHttp({
            method: 'get',
            url: window.baseURL + '/socialactivity/getCanAddActivity',
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            if (res.status === 100) {
              console.log(res)
              if (res.data === true) {
                _this.$router.push('/pub_activity')
              } else {
                _this.$vux.toast.show({
                  type: 'text',
                  text: '对不起，您没有权限进行此项操作！'
                })
              }
            } else {
              _this.$vux.toast.show({
                type: 'cancel',
                text: res.msg
              })
            }
          }).catch(e => {
            console.log(e)
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
  .activity{
    height: 100%;
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
