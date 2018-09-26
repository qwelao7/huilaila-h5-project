<template>
  <!--订单评价-->
  <div class="commonHeader modifyOrderAppraise">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header slot="header" :left-options="{backText: ''}" style="width:100%;position:absolute;left:0;top:0;z-index:100">修改评价</x-header>
      <div class="LifeServiceBox">
        <div class="serviceRating">
          <div class="species">
            <img :src="orderData.storeLogo" alt="">
            <span>服务评分</span>
          </div>
          <ul class="ratingBox">
            <li class="quality">
              <div class="rater">
                <span>服务质量</span>
                <star v-model="orderData.appraiseQuality" :margin="15" :fontSize="22" @onRater="showQualityStar"></star>
              </div>
              <div>
                <span>{{serverQualityText}}</span>
              </div>
            </li>
            <li class="speed">
              <div class="rater">
                <span>响应速度</span>
                <star v-model="orderData.appraiseSpeed" :margin="15" :fontSize="21" @onRater="showSpeedStar"></star>
              </div>
              <div>
                <span>{{serverSpeedText}}</span>
              </div>
            </li>
          </ul>
          <div class="inputArea">
            <group>
              <x-textarea v-model="orderData.appraiseContent" :max="250" name="detail" :placeholder="placeholder" :show-counter="false"></x-textarea>
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
            <actionsheet :menus="serverDelMenu" @on-click-menu-menu="delServerPic()" v-model="showServerDelMenu" show-cancel></actionsheet>
          </div>
        </div>
        <div class="commodityRateList">
          <div class="commodityRating" v-for="(item, index) in productList">
            <ul class="ratingBox">
              <li class="quality">
                <div class="rater">
                  <div><img :src="item.productCoverimg" alt=""></div>
                  <span>商品评分</span>
                  <!--<star v-model="item.productScore" :margin="15" :fontSize="22" @onRater="showStar()"></star>-->
                  <star v-model="item.productScore" :margin="15" :fontSize="22" @onRater="showStar" @click.native="onClick(item)"></star>
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
                <li class="showPic" v-for="(value, i) in item.appraiseImgs" v-show="item.appraiseImgs.length">
                  <img :src="value" alt="" @click="showDelPopup(i, index)">
                </li>
                <li class="addPic" v-show="item.appraiseImgs.length < 4">
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
          <button>修改</button>
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
    name: 'modifyOrderAppraise',
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
        orderData: {},
        productList: [],
        coverImg: [],
        placeholder: '服务满足你的期待吗？将你的心得分享给大家吧',
        placeholder1: '商品满足你的期待吗？将你的心得分享给大家吧',
        serverAppraiseContent: '',
        serverQualityValue: '',
        serverSpeedValue: '',
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
        switch (this.orderData.appraiseQuality) {
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
      serverSpeedText () {
        let text
        switch (this.orderData.appraiseSpeed) {
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
      this.modifyEvaluation()
    },
    methods: {
      modifyEvaluation () {
        let this_ = this;
        let params = {
          orderId: this_.orderId
        }
        this_.$JHttp({
          method: 'post',
          url: window.baseURL + '/serverShu/order/appraise',
          data: querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            this_.orderData = res.data
            this_.serverPostPic = this_.orderData.appraiseImg.split('|')
//            this_.picLists = this_.orderData.appraiseImg.split('|')
            this_.serverPicList = this_.orderData.appraiseImgs
            this_.orderData.orderDetailAppraise.forEach(val => {
              let obj = {
                productName: val.productName,
                orderId: val.orderId,
                orderDetailId: val.orderDetailId,
                productId: val.productId,
                appraiseContent: val.appraiseContent,
                productScore: val.productScore,
                appraiseImgs: val.appraiseImgs,
                picLists: val.appraiseImg.split('|'),
                qualityText: '',
                productCoverimg: val.productCoverimg
              }
              switch (val.productScore) {
                case 1:
                  obj.qualityText = '失望'
                  break
                case 2:
                  obj.qualityText = '失望'
                  break
                case 3:
                  obj.qualityText = '一般'
                  break
                case 4:
                  obj.qualityText = '满意'
                  break
                case 5:
                  obj.qualityText = '惊喜'
                  break
                default:
                  obj.qualityText = ''
              }
              // this_.coverImg.push(val.productCoverimg)
              this_.productList.push(obj)
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      addServerPic () {
        let _this_ = this;
        let count = _this_.serverPicList.length;
        let leftCount = 4 - count;
        this.$wechat.chooseImage({
          count: leftCount, // 默认9
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            _this_.serverPicList = _this_.serverPicList.concat(res.localIds);
//            let uploadData = new FormData()
//            uploadData.append('type', 'nei')
            let blobs = [];
            res.localIds.forEach(function (imgId, index) {
              _this_.$wechat.getLocalImgData({
                localId: imgId, // 图片的localID
                success: function (response) {
                  let localData = response.localData; // localData是图片的base64数据，可以用img标签显示
                  if (JNavigator.isAndroid()) {
                    localData = 'data:image/jgp;base64,' + localData;
                  }
                  let file = File.dataURItoBlob(localData);
                  blobs.push(file);
//                  uploadData.append('files', file.blob, file.fileName);
                  // 合成完最后一个,开始上传
                  if (index === res.localIds.length - 1) {
                    _this_.uploadBlob(blobs, 'appraise', undefined, undefined, function (resList) {
                      _this_.serverPostPic = _this_.serverPostPic.concat(resList);
                    });
//                    _this_.$JHttp.post(window.uploadURL + '/upload', uploadData, {
//                      headers: {
//                        'Content-Type': 'multipart/form-data'
//                      }
//                    }).then(res => {
//                      if (res.status === 100) {
//                        _this_.serverPostPic = _this_.serverPostPic.concat(res.data)
//                      }
//                    })
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
      addPic (value) {
        let _this_ = this;
        let count = value.appraiseImgs.length;
        let leftCount = 4 - count;
        this.$wechat.chooseImage({
          count: leftCount, // 默认9
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            value.appraiseImgs = value.appraiseImgs.concat(res.localIds);
            // let uploadData = new FormData()
            // uploadData.append('type', 'nei')
            let blobs = [];
            res.localIds.forEach(function (imgId, index) {
              _this_.$wechat.getLocalImgData({
                localId: imgId, // 图片的localID
                success: function (response) {
                  let localData = response.localData; // localData是图片的base64数据，可以用img标签显示
                  if (JNavigator.isAndroid()) {
                    localData = 'data:image/jgp;base64,' + localData;
                  }
                  let file = File.dataURItoBlob(localData);
                  blobs.push(file);
                  // uploadData.append('files', file.blob, file.fileName);
                  // 合成完最后一个,开始上传
                  if (index === res.localIds.length - 1) {
                    _this_.uploadBlob(blobs, 'appraise', undefined, undefined, function (resList) {
                      value.picLists = value.picLists.concat(resList)
                    });
//                     _this_.$JHttp.post(window.uploadURL + '/upload', uploadData, {
//                       headers: {
//                         'Content-Type': 'multipart/form-data'
//                       }
//                     }).then(res => {
//                       if (res.status === 100) {
//                         value.picLists = value.picLists.concat(res.data)
// //                        console.log(value.productId)
// //                        _this_.productList.forEach(r => {
// //                          if (value.productId === r.productId) {
// //                            value.appraiseImgs = _this_.picLists
// //                          }
// //                        })
//                       }
//                     })
                  }
                }
              });
            })
          }
        });
      },
      showDelPopup (i, index) {
        this.showDeleteMenu = true;
        this.currentIndex = i;
        this.productIndex = index;
      },
      delPic () {
        this.productList[this.productIndex].picLists.splice(this.currentIndex, 1);
        this.productList[this.productIndex].appraiseImgs.splice(this.currentIndex, 1);
        this.$vux.toast.show({
          type: 'text',
          text: '删除成功'
        })
      },
      showQualityStar (val) {
        this.orderData.appraiseQuality = val
      },
      showSpeedStar (val) {
        this.orderData.appraiseSpeed = val
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
      submitAppraise () {
        let this_ = this;
        let data = this_.orderData;
        if (!data.appraiseQuality) {
          this_.$vux.toast.show({
            type: 'text',
            text: '请为服务评分'
          })
          return
        }
        if (!data.appraiseSpeed) {
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
        let arr = []
        this_.productList.forEach(val => {
          let obj = {
            productName: val.productName,
            orderId: val.orderId,
            orderDetailId: val.orderDetailId,
            productId: val.productId,
            appraiseContent: val.appraiseContent,
            productScore: val.productScore,
            appraiseImgs: val.picLists
          }
          arr.push(obj)
        })
        let params = querystring.stringify({
          appraiseAgain: this_.isModify,
          appraiseContent: data.appraiseContent,
          appraiseQuality: data.appraiseQuality,
          appraiseSpeed: data.appraiseSpeed,
          objId: '',
          orderId: data.orderId,
          appraiseImgs: JSON.stringify(this_.serverPostPic), // 商家评价图片
          orderDetailAppraise: JSON.stringify(arr)
        })
        // console.log(params)
        this_.$JHttp({
          method: 'post',
          url: window.baseURL + '/serverShu/serviceRating',
          data: params
        }).then(res => {
          if (res.status === 100) {
            this_.$vux.toast.show({
              type: 'text',
              text: '修改成功'
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
  .modifyOrderAppraise{
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
