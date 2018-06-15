<template>
  <!--订单评价-->
  <div class="commonHeader evaluationForLifeService">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header slot="header" :left-options="{backText: ''}" style="width:100%;position:absolute;left:0;top:0;z-index:100">评价</x-header>
      <div class="LifeServiceBox">
        <div class="serviceRating">
          <div class="species">
            <img :src="storeLogo" alt="">
            <span>服务评分</span>
          </div>
          <ul class="ratingBox">
            <li class="quality">
              <div class="rater">
                <span>服务质量</span>
                <star :margin="15" :fontSize="22" @onRater="showQualityStar"></star>
              </div>
              <div>
                <span>{{serverQualityText}}</span>
              </div>
            </li>
            <li class="speed">
              <div class="rater">
                <span>响应速度</span>
                <star :margin="15" :fontSize="21" @onRater="showSpeedStar"></star>
              </div>
              <div>
                <span>{{speedText}}</span>
              </div>
            </li>
          </ul>
          <div class="inputArea">
            <group>
              <x-textarea v-model="serverAppraiseContent" :max="250" name="detail" :placeholder="placeholder" :show-counter="false"></x-textarea>
            </group>
            <ul>
              <li class="showPic" v-for="item,index in serverPicList" v-show="serverPicList.length">
                <img :src="item" alt="" @click="showServerDelPopup(index)">
              </li>
              <li class="addPic" v-show="serverPicList.length < 4">
                <img src="../../../assets/images/addpic-210.png" alt="" @click="addServerPic">
              </li>
            </ul>
          </div>
          <div v-transfer-dom>
            <actionsheet :menus="serverDelMenu" @on-click-menu-menu="delServerPic" v-model="showServerDelMenu" show-cancel></actionsheet>
          </div>
        </div>
        <div class="commodityRateList">
          <div class="commodityRating" v-for="item in productList">
            <ul class="ratingBox">
              <li class="quality">
                <div class="rater">
                  <div><img :src="item.productCoverimg" alt=""></div>
                  <span>商品评分</span>
                  <star :margin="15" :fontSize="22" @onRater="showStar" @click.native="onClick(item)"></star>
                </div>
                <div>
                  <span>{{item.qualityText}}</span>
                </div>
              </li>
            </ul>
            <div class="inputArea">
              <group>
                <x-textarea v-model="item.appraiseContent" :max="250" name="detail" :placeholder="placeholder1" :show-counter="false"></x-textarea>
              </group>
              <ul>
                <li class="showPic" v-for="(value,index) in picList" v-show="picList.length">
                  <img :src="value" alt="" @click="showDelPopup(index)">
                </li>
                <li class="addPic" v-show="picList.length < 4">
                  <img src="../../../assets/images/addpic-210.png" alt="" @click="addPic(item)">
                </li>
              </ul>
            </div>
            <div v-transfer-dom>
              <actionsheet :menus="delMenu" @on-click-menu-menu="delPic" v-model="showDeleteMenu"
                           show-cancel></actionsheet>
            </div>
          </div>
        </div>
        <div slot="bottom" class="submit" @click="submitAppraise">
          <button>确认提交</button>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {XHeader, ViewBox, querystring, Group, XTextarea, Actionsheet, TransferDom} from 'vux'
  import star from '../../common/star'
  import {File} from '../../../common/js/Upload'
  import {JNavigator} from '../../../common/js/utils'
  export default {
    name: 'evaluationForLifeService',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      ViewBox,
      Group,
      XTextarea,
      Actionsheet,
      star
    },
    data () {
      return {
        isModify: '',
        orderId: '',
        storeLogo: '',
        productList: [],
        coverImg: [],
        placeholder: '服务满足你的期待吗？将你的心得分享给大家吧',
        placeholder1: '商品满足你的期待吗？将你的心得分享给大家吧',
        serverAppraiseContent: '',
        serverQualityValue: 0,
        serverSpeedValue: 0,
        serverPicList: [],
        serverPostPic: [],
        currentServerIndex: '',
        serverDelMenu: {
          menu: '删除'
        },
        showServerDelMenu: false,
        showDeleteMenu: false,
        delMenu: {
          menu: '删除'
        },
        currentIndex: '',
        currentValue: '',
        picList: [],
        picLists: [],
        qualityValue: '',
        speedValue: '',
        appraiseContent: ''
      }
    },
    computed: {
      serverQualityText () {
        let text
        switch (this.serverQualityValue) {
          case 1:
            text = '失望';
            break;
          case 2:
            text = '失望';
            break;
          case 3:
            text = '一般';
            break;
          case 4:
            text = '满意';
            break;
          case 5:
            text = '惊喜';
            break;
          default:
            text = '';
        }
        return text
      },
      speedText () {
        let text
        switch (this.serverSpeedValue) {
          case 1:
            text = '失望';
            break;
          case 2:
            text = '失望';
            break;
          case 3:
            text = '一般';
            break;
          case 4:
            text = '满意';
            break;
          case 5:
            text = '惊喜';
            break;
          default:
            text = '';
        }
        return text
      }
    },
    created () {
      this.isModify = this.$route.query.isModify
      this.orderId = this.$route.query.orderId
      this.startEvaluation()
    },
    methods: {
      startEvaluation () {
        let this_ = this;
        let params = {
          orderId: this_.orderId
        }
        this_.$JHttp({
          method: 'post',
          url: window.baseURL + '/serverShu/order/detail?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            this_.storeLogo = data.storeLogo;
            this_.orderId = data.orderId;
            this_.serverPicList = [];
            data.orderDetailList.forEach(res => {
              let obj = {
                productName: res.productName,
                orderId: res.orderId,
                orderDetailId: res.orderDetailId,
                productId: res.productId,
                appraiseContent: '',
                productScore: 0,
                appraiseImgs: [],
                qualityText: '',
                productCoverimg: res.productCoverimg
              }
              // this_.coverImg.push(res.productCoverimg)
              this_.productList.push(obj)
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      showQualityStar (val) {
        this.serverQualityValue = val
      },
      showSpeedStar (val) {
        this.serverSpeedValue = val;
      },
      showStar (val) {
        let current = this.currentValue
        this.productList.forEach(res => {
          if (res.productId === current.productId) {
            current.productScore = val
            switch (current.productScore) {
              case 1:
                current.qualityText = '失望'
                break
              case 2:
                current.qualityText = '失望'
                break
              case 3:
                current.qualityText = '一般'
                break
              case 4:
                current.qualityText = '满意'
                break
              case 5:
                current.qualityText = '惊喜'
                break
              default:
                current.qualityText = ''
            }
          }
        })
      },
      onClick (res) {
        this.currentValue = res
      },
      addServerPic () {
        let _this_ = this;
        let count = this.serverPicList.length;
        let leftCount = 4 - count;
        this.$wechat.chooseImage({
          count: leftCount, // 默认9
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            _this_.serverPicList = _this_.serverPicList.concat(res.localIds);
            let uploadData = new FormData()
            uploadData.append('type', 'nei')
            _this_.serverPicList.forEach(function (imgId, index) {
              _this_.$wechat.getLocalImgData({
                localId: imgId, // 图片的localID
                success: function (res) {
                  let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                  if (JNavigator.isAndroid()) {
                    localData = 'data:image/jgp;base64,' + localData;
                  }
                  let file = File.dataURItoBlob(localData);
                  uploadData.append('files', file.blob, file.fileName);
                  // 合成完最后一个,开始上传
                  if (index === _this_.serverPicList.length - 1) {
                    _this_.$JHttp.post(window.uploadURL + '/upload', uploadData, {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    }).then(res => {
                      if (res.status === 100) {
                        _this_.serverPostPic = res.data
                      }
                    })
                  }
                }
              });
            })
          }
        });
      },
      showServerDelPopup (index) {
        this.showServerDelMenu = true;
        this.currentServerIndex = index;
      },
      delServerPic () {
        this.serverPicList.splice(this.currentServerIndex, 1);
        this.serverPostPic.splice(this.currentServerIndex, 1);
        this.$vux.toast.show({
          type: 'text',
          text: '删除成功'
        })
      },
      addPic (val) {
        let _this_ = this;
        let count = _this_.picList.length;
        let leftCount = 4 - count;
        this.$wechat.chooseImage({
          count: leftCount, // 默认9
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            _this_.picList = _this_.picList.concat(res.localIds);
            let uploadData = new FormData()
            uploadData.append('type', 'nei')
            _this_.picList.forEach(function (imgId, index) {
              _this_.$wechat.getLocalImgData({
                localId: imgId, // 图片的localID
                success: function (res) {
                  let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                  if (JNavigator.isAndroid()) {
                    localData = 'data:image/jgp;base64,' + localData;
                  }
                  let file = File.dataURItoBlob(localData);
                  uploadData.append('files', file.blob, file.fileName);
                  // 合成完最后一个,开始上传
                  if (index === _this_.picList.length - 1) {
                    _this_.$JHttp.post(window.uploadURL + '/upload', uploadData, {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    }).then(res => {
                      if (res.status === 100) {
                        _this_.picLists = [];
                        _this_.picLists = res.data
                        console.log(val.productId)
                        _this_.productList.forEach(r => {
                          if (val.productId === r.productId) {
                            val.appraiseImgs = _this_.picLists
                          }
                        })
                      }
                    })
                  }
                }
              });
            })
          }
        });
      },
      showDelPopup (index) {
        this.showDeleteMenu = true;
        this.currentIndex = index;
      },
      delPic () {
        this.picList.splice(this.currentIndex, 1);
        this.picLists.splice(this.currentIndex, 1);
        this.$vux.toast.show({
          type: 'text',
          text: '删除成功'
        })
      },
      submitAppraise () {
        let this_ = this;
        if (!this_.serverQualityValue) {
          this_.$vux.toast.show({
            type: 'text',
            text: '请为服务评分'
          })
          return
        }
        if (!this_.serverSpeedValue) {
          this_.$vux.toast.show({
            type: 'text',
            text: '请为服务评分'
          })
          return
        }
        for (let i = 0; i < this_.productList.length; i++) {
          let index = this_.productList[i];
          if (!index.productScore) {
            this_.$vux.toast.show({
              type: 'text',
              text: '请为商品评分'
            })
            return
          }
        }
        let appraiseArr = []
        this_.productList.forEach(res => {
          let obj = {
            productName: res.productName,
            orderId: res.orderId,
            orderDetailId: res.orderDetailId,
            productId: res.productId,
            appraiseContent: res.appraiseContent,
            productScore: res.productScore,
            appraiseImgs: res.appraiseImgs
          }
          appraiseArr.push(obj)
        })
        let params = querystring.stringify({
          appraiseAgain: this_.isModify,
          appraiseContent: this_.serverAppraiseContent,
          appraiseQuality: this_.serverQualityValue,
          appraiseSpeed: this_.serverSpeedValue,
          objId: '',
          orderId: this_.orderId,
          appraiseImgs: JSON.stringify(this_.serverPostPic), // 商家评价图片
//          orderDetailAppraise: JSON.stringify(this_.productList)
          orderDetailAppraise: JSON.stringify(appraiseArr)
        })
        console.log(666, params)
        this_.$JHttp({
          method: 'post',
          url: window.baseURL + '/serverShu/serviceRating',
          data: params
        }).then(res => {
          if (res.status === 100) {
            this_.$vux.toast.show({
              type: 'success',
              text: '评价成功'
            })
            this_.$router.go(-1)
          }
        }).catch(e => {
          console.log(e)
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .evaluationForLifeService{
    position: relative;
    background-color: #ffffff;
    height: 100%;
    .LifeServiceBox{
      padding: 10px 15px 0 15px;
      .serviceRating{
        .species{
          display: flex;
          align-items: center;
          img{
            width: 30px;
            height: 30px;
            margin-right: 10px;
          }
          span{
            font-size: 18px;
            color: #333333;
          }
        }
        .ratingBox{
          margin-top: 10px;
          li{
            padding: 20px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .rater{
              display: flex;
              justify-content: flex-start;
              align-items: center;
              span:first-child{
                font-size: 15px;
                margin-right: 10px;
              }
            }
            span:last-child{
              font-size: 15px;
              color: #FF6648;
            }
          }
          .quality{
            border-bottom: 0.5px solid #D8D8D8;
          }
        }
        .inputArea{
          margin-top: 20px;
          .weui-cell{
            padding: 0;
          }
          .weui-cells:after{
            border: none;
          }
          ul{
            display: flex;
            align-items: center;
            padding-bottom: 20px;
            li{
              width: 75px;
              height: 75px;
              margin-right: 15px;
              :last-child{
                margin-right: 0;
              }
              img{
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
      .commodityRateList{
        .commodityRating{
          border-top: 0.5px solid #D8D8D8;
          .ratingBox{
            margin-top: 20px;
            li{
              padding: 20px 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .rater{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                img{
                  width: 30px;
                  height: 30px;
                  margin-right: 5px;
                }
                span{
                  font-size: 15px;
                  margin-right: 10px;
                }
              }
              span:last-child{
                font-size: 15px;
                color: #FF6648;
              }
            }
            .quality{
              border-bottom: 0.5px solid #D8D8D8;
            }
          }
          .inputArea{
            margin-top: 20px;
            .weui-cell{
              padding: 0;
            }
            .weui-cells:after{
              border: none;
            }
            ul{
              display: flex;
              align-items: center;
              padding-bottom: 20px;
              li{
                width: 75px;
                height: 75px;
                margin-right: 15px;
                :last-child{
                  margin-right: 0;
                }
                img{
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
        }
      }
      .submit{
        padding-bottom: 20px;
        button{
          width: 100%;
          height: 44px;
          line-height: 44px;
          border: none;
          background-color: #FF6648;
          font-size: 18px;
          color: #ffffff;
          border-radius: 4px;
        }
      }
    }
  }
</style>
