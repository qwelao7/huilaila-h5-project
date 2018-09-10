<template>
  <div class="commonHeader systemMsg">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        :title="formatType"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
        <a slot="right" @click="clearMsg">清空</a>
      </x-header>
      <div class="mgsList" v-show="dataList.length">
        <ul>
          <li v-for="item in dataList">
            <span class="pubTime">{{item.latestTime}}</span>
            <div class="banner" @click="toDetail(item)">
              <div class="name"><p>{{item.noticeTitle}}</p></div>
              <div class="cover" v-show="item.imgUrl"><img :src="item.imgUrl" alt=""></div>
              <div class="description">
                <p>{{item.noticeSummary}}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="noContent" v-if="!dataList.length">
        <img src="../../../assets/images/No-content.png" alt="">
        <p>什么都没发现，去别处看看吧</p>
        <!--<span @click="toPublish">去发帖</span>-->
      </div>
      <x-dialog class="change-house-wrapper" v-model="changeHouseModalShow" :dialog-style="changeHouseDialogStyle" hide-on-blur>
        <span class="delete-info vux-1px-b">是否清空所有通知?</span>
        <div class="operate-wrapper">
          <span class="text vux-1px-r" @click="changeHouseModalShow = false">否</span>
          <span class="text" @click="clear">是</span>
        </div>
      </x-dialog>
    </view-box>
  </div>
</template>
<script>
  import { ViewBox, XHeader, XDialog, querystring } from 'vux'
  export default {
    name: 'systemMsg',
    components: {
      ViewBox,
      XHeader,
      XDialog
    },
    data () {
      return {
        dataList: [],
        noticeType: '',
        changeHouseModalShow: false,
        changeHouseDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 0 0 0',
          borderRadius: '20px'
        }
      }
    },
    created () {
      //
      this.getData()
    },
    methods: {
      getData () {
        let _this = this;
        _this.$vux.loading.show({
          text: '加载中'
        });
        this.noticeType = _this.$route.params.id;
        let params = {
          noticeType: this.noticeType,
          curPage: 1,
          pageSize: 10
        };
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/notice/getNoticeList?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            _this.$vux.loading.hide();
            console.log(res.data);
            _this.dataList = res.data.resultList
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
      toDetail (val) {
        console.log(val);
        this.$router.push({
          name: 'noticeDetail',
          params: {id: val.noticeId, type: val.sendType, title: this.formatType}});
      },
      clearMsg () {
        if (this.dataList.length) {
          this.changeHouseModalShow = true;
        } else {
          this.$vux.toast.show({
            type: 'cancel',
            text: '当前没有可清理的通知'
          })
        }
      },
      clear () {
        let _this = this;
        let params = {
          noticeType: this.noticeType
        };
        _this.$vux.loading.show({
          text: '清理中'
        });
        _this.$JHttp({
          method: 'post',
          url: window.baseURL + '/notice/clearNotice?' + querystring.stringify(params)
        }).then(res => {
          _this.$vux.loading.hide();
          if (res.status === 100) {
            _this.dataList = [];
            _this.changeHouseModalShow = false;
            _this.$vux.toast.show({
              type: 'success',
              text: '清理完成'
            })
          } else {
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          console.log(e)
        })
      }
    },
    computed: {
      formatType: function () {
        let value = '';
        switch (parseInt(this.noticeType)) {
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
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .systemMsg{
    height: 100%;
    background-color: #ffffff;
    .vux-header .vux-header-right a{
      font-size: 15px;
      color: #333333;
    }
    .mgsList{
      padding: 20px 15px;
      padding-top: 0;
      ul{
        display: flex;
        flex-direction: column;
        li{
          display: flex;
          flex-direction: column;
          align-items: center;
          .pubTime{
            margin: 20px 0 15px 0;
            height: 20px;
            line-height: 20px;
            background: #E0E1E5;
            border-radius: 100px;
            text-align: center;
            font-size: 12px;
            color: #ffffff;
            padding: 0 12px;
          }
          .banner{
            border: 0.5px solid #D8D8D8;
            border-radius: 5px;
            padding: 15px;
            width: 315px;
            .name{
              font-size: 18px;
              font-weight: bold;
            }
            .cover{
              margin-top: 15px;
              width: 100%;
              height: 150px;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .description{
              margin-top: 15px;
              p{
                font-size: 15px;
                /*height: 63px;*/
                /*width: 313px;*/
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #aaaaaa;
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
    }
    .change-house-wrapper {
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
  }
</style>
