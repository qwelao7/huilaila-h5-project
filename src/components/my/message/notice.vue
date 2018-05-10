<template>
  <div class="notice no-margin-top">
    <div class="pull-top">
      <j-pull :refreshFunc="refreshData">
        <div slot="jpull-list">
          <ul v-if="noticeList.length">
            <li class="express" v-for="item in noticeList" :key="item.id">
              <div class="icon">
                <img :src="item.icon" alt="">
              </div>
              <div class="content" @click="toMsgList(item.type)">
                <div class="content-top">
                  <div class="name">
                    <span>{{formatType(item.type)}}</span>
                    <!--<span class="budge">{{item.msgCount}}</span>-->
                    <Badge class="budge" :text="item.msgCount" v-show="item.msgCount > 0"></Badge>
                  </div>
                  <span>{{item.time}}</span>
                </div>
                <p class="content-btm">{{item.newContent}}</p>
              </div>
            </li>
          </ul>
          <div class="noContent" v-if="!noticeList.length">
            <img src="../../../assets/images/No-content.png" alt="">
            <p>什么都没发现，去别处看看吧</p>
            <!--<span @click="toPublish">去发帖</span>-->
          </div>
        </div>
      </j-pull>
    </div>
  </div>
</template>
<script>
  import {CellBox, Group, Badge} from 'vux'
  import expressIcon from '@/assets/images/express_icon_inform.png'
  import systemIcon from '../../../assets/images/system_icon_inform.png'
  import orderIcon from '../../../assets/images/order_icon_inform.png'
  import houseKeeperIcon from '../../../assets/images/housekeeper_icon_inform.png'
  import activityIcon from '../../../assets/images/activity_icon_inform.png'
  import JPull from '../../base/JPull/JPull'

  export default {
    name: 'notice',
    components: {
      CellBox,
      Group,
      Badge,
      JPull
    },
    data () {
      return {
        noticeList: []
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
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/notice/getNoticeTypeList'
        }).then(res => {
          if (loaded) {
            loaded()
          }
          if (res.status === 100) {
            _this.$vux.loading.hide();
            let obj;
            res.data.forEach(val => {
              if (val.noticeType !== 3) { // 没有寄存通知
                obj = {
                  type: val.noticeType,
                  icon: activityIcon,
                  time: val.latestTime,
                  msgCount: val.noticeNum,
                  newContent: val.noticeTitle
                };
                _this.noticeList.push(obj)
              }
            });
            _this.noticeList.sort(_this.compare('msgCount'))
          } else {
            _this.$vux.loading.hide();
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          console.log(e)
        })
      },
      toMsgList (key) {
        this.$router.push('/systemMsg/' + key)
      },
      formatType (val) {
        let value;
        switch (val) {
          case 1:
            value = '系统通知';
            break;
          case 2:
            value = '订单通知';
            break;
          case 4:
            value = '快递通知';
            break;
          case 5:
            value = '活动推荐';
            break;
          case 6:
            value = '管家通知';
            break;
          default:
            break
        }
        return value
      },
      compare (key) {
        return function (a, b) {
          let value1 = a[key];
          let value2 = b[key];
          return value2 - value1;
        }
      },
      refreshData (loaded) {
        this.noticeList = [];
        this.getData(loaded);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .notice{
    height: 100%;
    .pull-top{
      height: 100%;
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
    }
    ul{
      height: 100%;
      padding: 0 15px;
      li{
        padding: 20px 0;
        display: flex;
        border-bottom: 0.5px solid #D8D8D8;
        .icon{
          width: 45px;
          height: 45px;
        }
        .content{
          flex: 1;
          margin-left: 10px;
          .content-top{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3px;
            span{
              font-size: 12px;
              color: #aaaaaa;
            }
            .name{
              display: flex;
              align-items: center;
              span{
                font-size: 15px;
                color: #333333;
                font-weight: bold;
                margin-right: 10px;
              }
              .budge{
                background-color: #FF6648;
                font-size: 12px;
                color: #ffffff;
                font-weight: normal;
                margin-bottom: 3px;
                padding-top: 1px;
              }
            }
          }
          .content-btm{
            font-size: 15px;
            color: #333333;
            height: 21px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
</style>
