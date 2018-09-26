<template>
  <div class="myActivity">
    <div class="pull-top">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <ul v-show="activityInformation.length">
            <li v-for="item in activityInformation">
              <p class="activity_title" v-text="item.activityName" @click="goActivityDetail(item.activityId)"></p>
              <div class="activity_information">
                <div class="activity_pic">
                  <img :src="item.activityPicture" alt="">
                </div>
                <!--<div class="activity_content">
                  <p>活动时间：{{item.startDate}}</p>
                  <p>活动地点：{{item.activityAddress}}</p>
                  <p v-show="item.joinMoney > 0">报名费：￥{{item.joinMoney}}/人</p>
                  <div class="activity_time">
                    <span class="time">{{item.endTimeTag}}</span>
                    <div class="activity_sin" @click="goJoinPeople(item.activityId)">查看报名人</div>
                  </div>
                </div>-->
                <ul class="activity_content">
                  <li>
                    <span>活动时间：</span>
                    <span>{{item.startDate}}</span>
                  </li>
                  <li>
                    <span>活动地点：</span>
                    <span>{{item.activityAddress}}</span>
                  </li>
                  <li v-show="item.joinMoney > 0">
                    <span>报名费：</span>
                    <span>￥{{item.joinMoney}}/人</span>
                  </li>
                  <li class="activity_time">
                    <span class="time">{{item.endTimeTag}}</span>
                    <span class="activity_sin" @click="goJoinPeople(item.activityId)">查看报名人</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <div class="noContent" v-show="!activityInformation.length">
            <img src="../../../assets/images/No-interaction.png" alt="">
            <p>什么都没发现，去别处看看吧</p>
            <span v-show="!isApp" @click="toPublish">去发帖</span>
          </div>
        </div>
      </j-pull>
    </div>
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
        activityInformation: []
      }
    },
    created () {
      this.isApp = localStorage.getItem('isApp')
      this.getMyActivityList();
    },
    methods: {
      refreshData (loaded) {
        this.curPage = 1;
        this.activityInformation = [];
        this.getMyActivityList(loaded);
      },
      loadMore (loaded) {
        this.curPage++;
        this.getMyActivityList(loaded);
      },
      getMyActivityList (loaded) {
        let params = {
          curPage: this.curPage,
          pageSize: this.pageSize
        };
        let _this = this;
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getMyActivityList?' + querystring.stringify(params)
        }).then(res => {
          if (loaded) {
            loaded(_this.hasMore)
          }
          _this.activityInformation = _this.activityInformation.concat(res.data.resultList);
          _this.hasMore = res.data.pageResult.hasMore;
        }).catch(err => {
          console.log(err);
        })
      },
      goJoinPeople (val) {
//        console.log(val, 'ggggggg');
        this.$router.push('/signUpPeople/' + val)
      },
      goActivityDetail (val) {
//        console.log(val, 'ggggggg');
        this.$router.push('/activityDetail/' + val)
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
.myActivity{
  height: 100%;
  width:90%;
  margin:0 auto;
  .pull-top{
    height: 100%;
  }
  ul{
    height: 100%;
    width: 100%;
    li{
      width:100%;
      margin-top: 15.5px;
      .activity_title{
        width:100%;
        line-height: 21px;
        color: #333333;
        font-weight: 700;
      }
      .activity_information{
        width:100%;
        height:100px;
        display: flex;
        align-items: center;
        margin-top: 10px;
        position: relative;
        .activity_pic{
          width:100px;
          height:100px;
          img{
            width:100%;
            height:100%;
          }
        }
        .activity_content{
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 10px;
          li{
            display: flex;
            align-items: center;
            margin-top: 5px;
            span{
              font-size: 15px;
              color: #333333;
            }
            span:last-child{
              width: 140px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .activity_time{
            justify-content: space-between;
            .time{
              color: #aaaaaa;
            }
            .activity_sin{
              text-align: center;
              width: 101px;
              height: 25px;
              line-height: 25px;
              color: #0DAB60;
              border-radius: 4px;
              border: 1px solid #0DAB60;
            }
          }
        }
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
