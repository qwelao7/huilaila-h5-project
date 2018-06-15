<template>
  <div class="mySignUp">
    <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
      <div slot="jpull-list">
        <ul v-show="mySignUpInformation.length">
          <li v-for="item in mySignUpInformation" @click="toDetail(item)">
            <div class="imges"><img :src="item.activityPicture" alt=""></div>
            <div class="banner">
              <div class="head">
                <p v-text="item.activityName"></p>
                <span class="isPay" v-show="item.payStatus === 1">待支付</span>
              </div>
              <div class="banner_sign">
                <div>
                  <div class="time">
                    <span>报名结束：</span>
                    <span v-text="item.applyEndDate"></span>
                  </div>
                  <div class="time">
                    <span>活动开始：</span>
                    <span v-text="item.startDate"></span>
                  </div>
                </div>
                <div class="signUp">
                  <span class="sign" v-show="item.payStatus === 1 && item.activityStatus !== 6" style="color: #0DAB60">报名中</span>
                  <span class="sign" v-show="item.payStatus !== 1 && item.activityStatus !== 6" style="color: #0DAB60">已报名</span>
                  <span class="sign" v-show="item.activityStatus === 6" style="border-color: #aaaaaa;color: #aaaaaa">活动取消</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="noContent" v-show="!mySignUpInformation.length">
          <img src="../../../assets/images/No-interaction.png" alt="">
          <p>什么都没发现，去别处看看吧</p>
          <span v-show="!isApp" @click="toPublish">去发帖</span>
        </div>
      </div>
    </j-pull>
  </div>
</template>
<script>
  import { XDialog, querystring } from 'vux'
  import JPull from '../../base/JPull/JPull'
  export default {
    components: {
      XDialog,
      JPull
    },
    data () {
      return {
        isApp: '',
        curPage: 1,
        pageSize: 20,
        hasMore: false,
        deleteModalShow: true,
        mySignUpInformation: [],
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 0 0 0',
          borderRadius: '20px'
        }
      }
    },
    created () {
      this.isApp = localStorage.getItem('isApp')
      this.getSignUpList();
    },
    methods: {
      refreshData (loaded) {
        this.curPage = 1;
        this.mySignUpInformation = [];
        this.getSignUpList(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getSignUpList(loaded);
      },
      toDetail (val) {
        this.$router.push('/signDetail/' + val.activityJoinUserId)
      },
      getSignUpList (loaded) {
        let _this = this;
        let params = {
          curPage: _this.curPage,
          pageSize: _this.pageSize
        }
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getyMyApplyList?' + querystring.stringify(params)
        }).then(res => {
          if (loaded) {
            loaded(_this.hasMore)
          }
          _this.mySignUpInformation = _this.mySignUpInformation.concat(res.data.resultList);
          _this.hasMore = res.data.pageResult.hasMore;
        }).catch(err => {
          console.log(err);
        })
      },
      toPublish () {
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
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .mySignUp{
    height: 100%;
    ul{
      height: 100%;
      padding: 0 15px;
      li{
        width: 100%;
        margin-top: 30px;
        display: flex;
        align-items: center;
        .imges{
          width: 80px;
          height: 80px;
          img{
            width:100%;
            height:100%;
          }
        }
        .banner{
          flex: 1;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          .head{
            display: flex;
            align-items: center;
            color: #333333;
            justify-content: space-between;
            p{
              width: 210px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 15px;
              font-weight: bold;
            }
            .isPay {
              color: #FF6648;
              font-size: 12px;
            }
          }
          .banner_sign{
            margin-top: 21.5px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            span{
              font-size: 12px;
            }
          }
          .time{
            height: 20px;
            line-height: 20px;
            span{
              display: inline-block;
              height: 20px;
              line-height: 20px;
              vertical-align: middle;
            }
            span:last-child{
              width: 110px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .time:last-child{
            margin-top: 5px;
          }
          .signUp{
            .sign{
              width: 70px;
              height: 25px;
              line-height: 25px;
              color: #0DAB60;
              font-size: 15px;
              border-radius: 4px;
              text-align: center;
              border: 1px solid #0DAB60;
            }
          }
        }
      }
      li:first-child{
        margin-top: 20px;
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
          flex: 1;
          height: 100%;
          line-height: 50px;
          color: #18adfb;
          font-size: 16px;
        }
      }
    }
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
