<template>
  <div class="personPage">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      style="width:100%;position:absolute;left:0;top:0;z-index:100;background-color: transparent">
    </x-header>
    <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
      <div slot="jpull-list">
        <div class="infoBanner">
          <div class="bgImg"><!--@click="changeBanner"-->
            <img src="../../../assets/images/banner_personalhomepage.jpg" alt="" v-show="!bannerPic">
            <!--<img :src="bannerPic" alt="" v-show="bannerPic">-->
            <j-img v-show="bannerPic" :osskey="bannerPic" :custom-width="375" :custom-height="217"></j-img>
          </div>
          <div class="personInfo">
            <div class="avatarBox">
              <!--<img :src="info.headPicName" alt="">-->
              <j-img  :osskey="info.headPicName" :custom-width="86" :custom-height="86"></j-img>
            </div>
            <div class="info">
              <div class="isModify">
                <div class="name">
                  <span>{{info.nickName}}</span>
                  <i class="sex" :class="{'male': info.sex === 1,'female': info.sex === 2}"></i>
                  <i class="position" v-if="info.isExamine === 1"></i>
                </div>
                <span class="modify" v-show="info.self" @click="toModify">编辑</span>
              </div>
              <div class="tag">
                <span v-for="item in info.labelList" class="tabBox"><i>·</i><span>{{item.label}}</span></span>
              </div>
            </div>
          </div>
          <div v-if="dataList.length" v-for="item in dataList">
            <div v-if="item.dataType === '1'">
              <activityCardOne :dataList="item"></activityCardOne>
            </div>
            <div v-if="item.dataType === '5'">
              <activityList :dataList="item"></activityList>
            </div>
          </div>
          <div v-if="!dataList.length">
            <div class="noContent" v-if="info.self">
              <img src="../../../assets/images/No-post.png" alt="">
              <p>迫不及待听你说</p>
              <span @click="toPublish">去发帖</span>
            </div>
          </div>
        </div>
      </div>
    </j-pull>
    <div v-transfer-dom class="choosePhoto">
      <actionsheet :menus="menus" v-model="showMenus" show-cancel></actionsheet>
    </div>
  </div>
</template>
<script>
  import { XHeader, Actionsheet, TransferDom, ButtonTab, ButtonTabItem, Scroller, querystring } from 'vux'
  import activityList from '../../common/activityCard'
  import activityCardOne from '../../common/activityCardOne'
  import JPull from '../../base/JPull/JPull'
  import {File} from '../../../common/js/Upload'
  import {JNavigator} from '../../../common/js/utils'
  import JImg from 'components/common/img/jImg'
  export default {
    name: 'personPage',
    directives: {
      TransferDom
    },
    components: {
      JPull,
      XHeader,
      Actionsheet,
      ButtonTab,
      ButtonTabItem,
      Scroller,
      activityCardOne,
      activityList,
      'j-img': JImg
    },
    data () {
      return {
        info: {},
        menus: {},
        curPage: 1,
        pageSize: 20,
        hasMore: false,
        dataList: [],
        showMenus: false,
        bannerPic: ''
      }
    },
    created () {
      this.getBaseInfo();
      this.getData()
    },
    methods: {
      getBaseInfo (loaded) {
        let userId = this.$route.params;
        this.$JHttp({
          methods: 'get',
          url: window.baseURL + '/neighbor/user/home?' + querystring.stringify(userId),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          console.log('个人信息>>>：', res);
          if (loaded) {
            loaded()
          }
          if (res.status === 100) {
            this.info = res.data;
          }
        }).catch(e => {
          console.log(e)
        });
      },
      getData (loaded) {
        let _this = this;
        _this.$vux.loading.show({
          text: '加载中'
        });
        let userId = this.$route.params.userId;
        let params = {
          userId: userId,
          curPage: _this.curPage,
          pageSize: _this.pageSize
        };
        this.$JHttp({
          methods: 'get',
          url: window.baseURL + '/neighbor/user/list?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          console.log(res);
          if (loaded) {
            loaded(_this.hasMore)
          }
          if (res.status === 100) {
            _this.$vux.loading.hide();
            _this.hasMore = res.data.pageResult.hasMore
            let data = res.data.resultList;
            let obj = {};
            data.forEach(value => {
              if (value.dataType === '1') {
                obj = {
                  dataType: value.dataType,
                  type: 'newThing',
                  userId: value.userId,
                  neighborId: value.neighborId,
                  pubTime: value.inTimeTag,
                  topicType: value.topicType,
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
              } else if (value.dataType === '5') {
                obj = value
              }
              _this.dataList.push(obj);
            });
            console.log(111, _this.dataList)
          } else {
            _this.$vux.loading.hide();
          }
        }).catch(e => {
          _this.$vux.loading.hide();
          console.log(e)
        });
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
        this.getBaseInfo(loaded);
      },
      loadMore (loaded) {
        this.curPage ++
        this.getData(loaded);
      },
      changeBanner () {
        let _this_ = this;
        this.$wechat.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            let localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            _this_.$wechat.getLocalImgData({
              localId: localId, // 图片的localID
              success: function (res) {
                let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                if (JNavigator.isAndroid()) {
                  localData = 'data:image/jgp;base64,' + localData;
                }
                let file = File.dataURItoBlob(localData);
                let uploadData = new FormData();
                uploadData.append('type', 'nei');
                uploadData.append('files', file.blob, file.fileName); // blob对象,自己手动加上文件名
                _this_.$JHttp.post(window.uploadURL + '/upload', uploadData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                }).then(res => {
                  if (res.status === 100) {
                    let data = res.data;
                    // 保存图片到业务方
                    _this_.$JHttp({
                      url: window.baseURL + '/user/modifyHeadPic?imageUrls=' + JSON.stringify(data),
                      method: 'post'
                    }).then(res => {
                      if (res.status === 100) {
                        _this_.$vux.toast.show({
                          type: 'success',
                          text: '修改成功'
                        });
                        _this_.bannerPic = localId;
                      } else {
                        _this_.$vux.toast.show({
                          type: 'cancel',
                          text: res.msg
                        });
                      }
                    }).catch(error => {
                      console.error(error);
                    });
                  } else {
                    _this_.$vux.toast.show({
                      type: 'cancel',
                      text: res.msg
                    });
                  }
                }).catch(error => {
                  console.error(error);
                });
              }
            });
          }
        });
      },
      toModify () {
        this.$router.push('/personInfo')
      },
      toPublish () {
        this.$router.push('/pub_newThings')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .personPage {
    height: 100%;
    overflow: hidden;
    background-color: #f7f7f7;
    .infoBanner{
      height: 100%;
      .noContent{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        /*margin-bottom: 248px;*/
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
      .bgImg{
        width: 100%;
        height: 217px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .personInfo{
        /*position: relative;*/
        padding: 0 15px;
        background-color: #ffffff;
        z-index: 999;
        .avatarBox{
          background-color: transparent;
          margin-top: -45px;
          img{
            width: 86px;
            height: 86px;
            border: 2px solid #ffffff;
            /*width: 100%;*/
            /*height: 100%;*/
            border-radius: 50%;
          }
        }
        .info{
          padding: 15px 0;
          .isModify{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .name{
              display: flex;
              align-items: center;
              span{
                font-size: 24px;
                font-weight: bolder;
                color: #333333;
              }
              i{
                height: 16px;
                margin-left: 8px;
              }
              .sex{
                width: 16px;
              }
              .female{
                background: url("../../../assets/images/female_icon_32.png") no-repeat center / contain;
              }
              .male{
                background: url("../../../assets/images/male_icon_32.png") no-repeat center / contain;
              }
              .position{
                width: 45px;
                background: url("../../../assets/images/owner_icon_32.png") no-repeat center;
                background-size: contain;
              }
            }
            .modify{
              width: 56px;
              height: 21px;
              line-height: 21px;
              text-align: center;
              font-size: 12px;
              color: #0DAB60;
              border: 1px solid #0DAB60;
              border-radius: 100px;
            }
          }
          .tag{
            display: flex;
            margin-top: 10px;
            .tabBox{
              display: flex;
              align-items: center;
              font-size: 12px;
              color: #aaaaaa;
              i{
                margin: 0 0.5px;
              }
            }
            .tabBox:first-child i{
              display: none;
            }
          }
        }
      }
    }
  }
</style>
