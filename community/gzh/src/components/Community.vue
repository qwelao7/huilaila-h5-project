<template>
  <div class="community commonHeader">
    <!--<view-box ref="communityBody" body-padding-top="0" :body-padding-bottom="paddingBtm">-->
    <view-box ref="communityBody" body-padding-top="1.253333rem" :body-padding-bottom="paddingBtm">
      <x-header
        slot="header"
        :left-options="{showBack: false}"
        title="slot:overwrite-title"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;">
        <a slot="right" @click="showMessage" class="right"><i class="messageIcon"></i></a>
        <div class="overwrite-title-demo" slot="overwrite-title" @click="chooseAddress">
          <i class="positionIcon"></i>
          <span v-text="communityName"></span>
        </div>
      </x-header>
      <div class="picList" v-if="imgList.length > 0">
        <div class="showPic" v-if="index === 0" v-for="(item, index) in imgList">
          <img class="previewer-demo-img" :src="item.src" @click="show(index)" alt="">
        </div>
        <div class="hidPic" v-show="pullDown">
          <ul>
            <li class="pic-box" v-if="index !== 0" v-for="(item, index) in imgList">
              <img class="previewer-demo-img" :src="item.src" alt="" @click="show(index)">
            </li>
          </ul>
          <div v-transfer-dom>
            <previewer :list="imgList" ref="previewer" :options="options"></previewer>
          </div>
        </div>
        <i :class="{pullUp:pullDown, pullDown:!pullDown}" @click="displayPic"></i>
      </div>
      <div v-show="!pullDown">
        <div class="list-under-swiper">
          <grid :cols="4">
            <grid-item :label="item.name" v-for="item in list" v-if="item.visible" :key="item.id"
                       @on-item-click="onItemClick(item)">
              <img slot="icon" :src="item.icon">
            </grid-item>
          </grid>
        </div>
        <div v-if="isEmpty">
          <div class="community_nav" v-if="buildLive.isLoad">
            <comCard :buildList1="buildLive"></comCard>
          </div>
          <div class="community_nav" v-if="announceInfo.isLoad">
            <comCard :buildList1="announceInfo"></comCard>
          </div>
          <div class="community_nav" v-if="voteInfo.isLoad">
            <comCard :buildList1="voteInfo"></comCard>
          </div>
          <div class="community_nav" v-if="commiteeAchievement.isLoad">
            <comCard :buildList1="commiteeAchievement"></comCard>
          </div>
        </div>
        <div class="noContent" v-if="!isEmpty">
          <img src="../assets/images/No-content.png" alt="">
          <p>什么都没发现，去别处看看吧</p>
          <!--<span @click="toPublish">去发帖</span>-->
        </div>
      </div>
      <bottomTab v-show="!pullDown" slot="bottom"></bottomTab>
    </view-box>
    <!--     <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
      <span class="delete-info vux-1px-b">敬请期待!</span>
      <div class="operate-wrapper">
        <span class="text vux-1px-r" @click="deleteModalShow = false">确定</span>
        <span class="text" @click="goToBind">前往绑定</span>
      </div>
    </x-dialog> -->
    <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle">
      <span class="delete-info vux-1px-b">您尚未绑定手机号!</span>
      <div class="operate-wrapper">
        <span class="text vux-1px-r" @click="deleteModalShow = false">以后再说</span>
        <span class="text" @click="goBingPhone">前往绑定</span>
      </div>
    </x-dialog>
  </div>
</template>
<script>
  //  import {Grid, GridItem, Group, Cell} from 'vux'
  import {XHeader, Grid, GridItem, ViewBox, XDialog, Previewer, TransferDom} from 'vux'
  import bannerPic from './community/picList'
  import comCard from './community/comCard'
  import bottomTab from '../components/bottomTab'
  import icon1 from '../assets/images/icon01.png'
  import icon2 from '../assets/images/icon02.png'
  import icon3 from '../assets/images/icon03.png'
  import icon4 from '../assets/images/icon04.png'
  import icon5 from '../assets/images/icon05.png'

  // const list = [
  //   {
  //     name: '小区信息',
  //     value: 'buildInfo',
  //     icon: icon1,
  //     id: 1
  //   },
  //   {
  //     name: '小区图片',
  //     value: 'buildImg',
  //     icon: icon2,
  //     id: 2
  //   },
  //   {
  //     name: '工程进度',
  //     value: 'projectProgress',
  //     icon: icon3,
  //     id: 3
  //   },
  //   {
  //     name: '小区公约',
  //     value: 'treaty',
  //     icon: icon4,
  //     id: 4
  //   },
  //   {
  //     name: '万家灯火',
  //     value: 'lighted',
  //     icon: icon5,
  //     id: 5
  //   }
  // ];

  export default {
    name: 'Community',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Previewer,
      bottomTab,
      Grid,
      GridItem,
      ViewBox,
      XDialog,
      bannerPic,
      comCard
    },
    data () {
      return {
        communityName: '',
        isEmpty: true,
        list: [],
        pullDown: false,
        options: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index];
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect();
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        },
        imgList: [],
        buildLive: {},
        announceInfo: {},
        voteInfo: {},
        commiteeAchievement: {},
        priceList: [],
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        },
        paddingBtm: '1.306667rem'
      }
    },
    created () {
      let communityName = localStorage.getItem('communityName');
      this.communityName = communityName;
      this.getBuildList();
      this.getAppList();
    },
    methods: {
      getAppList () {
        let that = this;
        that.$JHttp({
          method: 'get',
          url: window.baseURL + '/community/communityAppSubCommunity'
        }).then(res => {
          if (res.status === 100) {
            let list = res.data.list
            list.forEach(function (v, i) {
              that.list.push({
                id: i,
                name: v.subName,
                icon: v.subImg,
                subCode: v.subCode,
                subCommunityId: v.subCommunityId,
                subUrl: v.subUrl,
                visible: true
              });
              // 隐藏自治表决
              if (v.subCode === 603) {
                that.list[i].visible = false
              }
              if (v.subCode === 131) { // 小区图片
                that.list[i].value = 'buildImg'
              } else if (v.subCode === 132) { // 工程进度
                that.list[i].value = 'projectProgress'
              } else if (v.subCode === 130) { // 小区信息
                that.list[i].value = 'buildInfo'
              } else if (v.subCode === 133) { // 小区公约
                that.list[i].value = 'treaty'
              } else if (v.subCode === 895) { // 自治规约
                that.list[i].value = 'autonomyStatuteList'
              } else if (v.subCode === 601) { // 业委会
                that.list[i].value = 'karma'
              } else if (v.subCode === 105) { // 看房预约
                that.list[i].value = 'roomReservation'
                // 需要绑定手机号
                that.list[i].needBingPhone = true
              }
            });
          } else {
            that.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getBuildList () {
        let that = this;
        that.$vux.loading.show({
          text: '加载中'
        });
        that.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/index'
        }).then(res => {
          if (res.status === 100) {
            this.$vux.loading.hide();
            if (!res.data.communityNews && !res.data.communityNotice && !res.data.communityPicList.length && !res.data.voteInfo && !res.data.commiteeAchievement) {
              that.isEmpty = false
            }
            if (res.data.communityPicList) {
              that.priceList = res.data.communityPicList;
              let list = [];
              that.priceList.forEach(function (v, i) {
                list.push({src: v});
              });
              that.imgList = list;
            }
            if (res.data.commiteeAchievement) {
              let commiteeAchievement = res.data.commiteeAchievement;
              that.commiteeAchievement = {
                isLoad: true,
                title1: '业委会成果',
                value: 'commiteeAchievement',
                type: 'commiteeAchievement',
                name: commiteeAchievement.title,
                img: commiteeAchievement.smallPic,
                like: commiteeAchievement.praisenum,
                message: commiteeAchievement.commentNum,
                dataInstruction: commiteeAchievement.intime,
                id: commiteeAchievement.id,
                isPraise: commiteeAchievement.isPraise,
                praisenum: commiteeAchievement.praisenum,
                commentNum: commiteeAchievement.commentNum
              };
            }
            if (res.data.communityNews) {
              let live = res.data.communityNews;
              that.buildLive = {
                isLoad: true,
                title1: '小区动态',
                value: 'buildLive',
                type: 'buildLive',
                name: live.title,
                img: live.smallPic,
                like: live.praisenum,
                message: live.commentNum,
                dataInstruction: live.intime,
                id: live.id,
                isPraise: live.isPraise,
                praisenum: live.praisenum,
                commentNum: live.commentNum
              };
            }
            if (res.data.communityNotice) {
              let announce = res.data.communityNotice;
              that.announceInfo = {
                isLoad: true,
                title1: '小区公告',
                type: 'announcement',
                value: 'announcement',
                name: announce.title,
                img: announce.smallPic,
                like: announce.praisenum,
                message: announce.commentNum, // endTimeStr
                dataInstruction: announce.intime,
                id: announce.id,
                isPraise: announce.isPraise,
                praisenum: announce.praisenum,
                commentNum: announce.commentNum
              };
            }
            if (res.data.voteInfo) {
              let vote = res.data.voteInfo;
              that.voteInfo = {
                isLoad: true,
                title1: '调查投票',
                type: 'survey',
                value: 'survey',
                name: vote.title,
                img: vote.icoUrl,
                like: vote.praisenum,
                message: vote.commentNum,
                dataInstruction: vote.endTimeStr,
                neiId: vote.neiId,
                id: vote.id,
                joinUserCnt: vote.joinUserCnt,
                isPraise: vote.isPraise,
                praisenum: vote.praisenum,
                commentNum: vote.commentNum
              };
            }
          } else {
            that.$vux.loading.hide();
            that.$vux.toast.show({
              type: 'cancel',
              title: res.msg
            });
          }
        }).catch(err => {
          console.log(err);
          this.$vux.loading.hide();
        })
      },
      show (index) {
        this.$refs.previewer.show(index);
      },
      goBingPhone () {
        this.$router.push('/Login')
      },
      onItemClick (val) {
        // if (val.id === 5) {
        if (val.value) {
          if (val.needBingPhone) {
            let token = localStorage.getItem('token')
            if (!token) {
              this.deleteModalShow = true
              return
            }
          }
          this.$router.push('/' + val.value + '?subCode=' + val.subCode + '&subCommunityId=' + val.subCommunityId)
        } else {
          // this.$vux.toast.show({
          //   type: 'cancel',
          //   text: 'H5链接'
          // });
          if (val.subUrl) {
            window.location.href = val.subUrl
          }
        }
      },
      displayPic () {
        this.pullDown = !this.pullDown
        this.$refs.communityBody.scrollTo(top)
        if (this.pullDown) {
          this.paddingBtm = '0'
        }
      },
      chooseAddress () {
        this.$router.push('/changeCommunity');
      },
      showMessage () {
        this.$router.push('/message');
      },
      goToBind () {
        this.$router.push('/Login')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .overwrite-title-demo {
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 100%;
    justify-content: center;
    .positionIcon {
      display: inline-block;
      /*flex: 1;*/
      width: 20px;
      height: 34px;
      background-image: url("../assets/images/address_icon_32black.png");
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
    }
    span {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 18px;
      color: #333333;
      margin-left: 3px;
    }
  }

  .messageIcon {
    width: 28px;
    height: 28px;
    margin-top: -4px;
    background: url("../assets/images/message_icon_black.png") center / cover;
  }

  .community {
    height: 100%;
    width: 100%;
    background-color: #f7f7f7;
    position: relative;
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

  .community_banner {
    width: 100%;
    position: relative;
  }

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

  .picList {
    position: relative;
    i {
      position: absolute;
      left: 50%;
      margin-left: -14px;
      bottom: 5px;
      display: block;
      width: 28px;
      height: 28px;
      background: url("../assets/images/down_button_buildingimages.png") center center / cover no-repeat;
      /*box-shadow: 0 5px 5px red;*/
    }
    .pullDown {
      -webkit-animation: sdb04 3s infinite;
      animation: sdb04 3s infinite;
    }
    .pullUp {
      position: fixed;
      -webkit-animation: sdb04rotated 3s infinite;
      animation: sdb04rotated 3s infinite;
    }
    @keyframes sdb04 {
      0% {
        transform: rotate(0deg) translate(0, 0);
      }
      50% {
        transform: rotate(0deg) translate(0, 5px);
      }
      100% {
        transform: rotate(0deg) translate(0, 0);
      }
    }
    @-webkit-keyframes sdb04 {
      0% {
        transform: rotate(0deg) translate(0, 0);
      }
      50% {
        transform: rotate(0deg) translate(0, 5px);
      }
      100% {
        transform: rotate(0deg) translate(0, 0);
      }
    }
    @keyframes sdb04rotated {
      0% {
        transform: rotate(180deg) translate(0, 0);
      }
      50% {
        transform: rotate(180deg) translate(0, 5px);
      }
      100% {
        transform: rotate(180deg) translate(0, 0);
      }
    }
    @-webkit-keyframes sdb04rotated {
      0% {
        transform: rotate(180deg) translate(0, 0);
      }
      50% {
        transform: rotate(180deg) translate(0, 5px);
      }
      100% {
        transform: rotate(180deg) translate(0, 0);
      }
    }
  }

  .showPic {
    width: 100%;
    height: 217px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .hidPic {
    ul {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .pic-box {
      height: 150px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .pic-box:nth-child(5n) {
      width: 100%;
    }
    .pic-box:nth-child(10n+1), .pic-box:nth-child(10n+4), .pic-box:nth-child(10n+6), .pic-box:nth-child(10n+9) {
      width: 40%;
    }
    .pic-box:nth-child(10n+2), .pic-box:nth-child(10n+3), .pic-box:nth-child(10n+7), .pic-box:nth-child(10n+8) {
      width: 60%;
    }
  }
</style>
