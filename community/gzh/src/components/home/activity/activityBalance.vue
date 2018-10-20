<template>
  <div class="publish commonHeader no-margin-top" style="background-color: #f5f5f5">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="活动结算"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div class="newThings-banner" style="background-color: #fff">
        <template v-for="(item,index) in balanceDetailList">
          <group>
            <cell class="amount-title">
              <div slot="title" @click="deleteDetail(index)" class="amountDetail-title">费用明细{{index+1}}<span
                v-if="balanceDetailList.length>1" style="display: inline-block;float: right">删除</span></div>
            </cell>
            <cell>
              <div slot="title" class="amountDetail-title">费用金额(元)</div>
              <div slot="inline-desc" class="amountDetail-info">
                <input type="number" placeholder="请输入报销金额" v-model="item.fee" @change="feeChange(item.fee,index)">
              </div>
            </cell>
            <cell>
              <div slot="title" class="amountDetail-title">费用说明</div>
              <div slot="inline-desc" class="amountDetail-info">
                <input type="text" placeholder="请输入费用描述" v-model="item.feeDesc">
              </div>
            </cell>
          </group>
        </template>
        <div class="addAmountList" @click="addDetail">+添加费用明细</div>
        <div class="spacing-container"></div>
        <group>
          <cell>
            <div slot="title" class="amountDetail-title">总费用金额 (元)：{{totalExpense}}</div>
            <div slot="title" class="amountDetail-title">总收款金额 (元)：{{totalIncome}}</div>
            <div slot="title" class="amountDetail-title">总退款金额 (元)：{{totalRefund}}</div>
          </cell>
          <cell is-link style="color: #aaa" @click.native="goToRefund()">
            <div slot="title" class="amountDetail-title">共{{refundCount}}人待退款</div>
          </cell>
        </group>
        <div class="spacing-container"></div>
        <ul class="chooseImg">
          <li v-for="(localId, index) in localIds">
            <img :src="localId" @click.prevent="showDeletePop(index)" alt="">
          </li>
          <li class="add" @click="chooseImages" v-show="localIds.length < 9"></li>
        </ul>
        <div v-transfer-dom>
          <actionsheet :menus="menus" @on-click-menu-menu="deleteImg" v-model="showDeleteMenu"
                       show-cancel></actionsheet>
        </div>
        <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
          <span class="delete-info vux-1px-b">您尚未绑定手机号</span>
          <div class="operate-wrapper">
            <span class="text vux-1px-r" @click="deleteModalShow = false">以后再说</span>
            <span class="text" @click="deleteReceiveAddress">前往绑定</span>
          </div>
        </x-dialog>
      </div>
      <div style="padding: 0 15px;margin: 50px 0">
        <x-button type="primary" action-type="button" style="background-color: #0DAB60" @click.native="publish">提 交
        </x-button>
      </div>
    </view-box>
    <div v-transfer-dom>
      <popup v-model="showInfo" position="top" :show-mask="false">
        <div class="position-vertical-demo">
          请确认您的回来啦账户余额大于总退款金额，否则将造成操作失败！
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import {
    XHeader,
    XTextarea,
    Actionsheet,
    Group,
    querystring,
    TransferDom,
    XDialog,
    Cell,
    Popup,
    PopupPicker,
    XInput,
    XButton,
    ViewBox
  } from 'vux'
  import {File} from '../../../common/js/Upload'
  import {JNavigator} from '../../../common/js/utils'
  import {Base64} from 'js-base64';

  export default {
    name: 'pub_newThings',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      XTextarea,
      Actionsheet,
      XDialog,
      Group,
      Cell,
      PopupPicker,
      XInput,
      XButton,
      ViewBox,
      Popup
    },
    data () {
      return {
        content: '',
        localIds: [],
        showDeleteMenu: false,
        currentIndex: 0,
        uploadData: new FormData(),
        menus: {
          menu: '删除'
        },
        communityId: '',
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        },
        balanceDetailList: [
          {
            fee: '',
            feeDesc: ''
          }
        ],
        refund: 0,
        totalIncome: 0,
        totalExpense: 0,
        totalRefund: 0,
        refundCount: 0,
        refundData: [],
        showInfo: false
      }
    },
    created () {
      this.$vux.loading.show({
        text: '加载中'
      });
      this.uploadData.append('type', 'nei');
      this.communityId = localStorage.getItem('communityId');
      this.getActivity()
    },
    methods: {
      getActivity () {
        let _this = this
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/balanceInfo/?activityId=' + _this.$route.params.activityId,
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            console.log(res.data)
            if (res.data.balanceId !== 0) {
              _this.$router.push('/balanceList/' + _this.$route.params.activityId)
              _this.$vux.loading.hide()
            } else {
              _this.$vux.loading.hide()
              _this.showInfo = true
              setTimeout(function () {
                _this.showInfo = false
              }, 5000)
              let refundData = [];
              let costData = [];
              if (JSON.parse(localStorage.getItem('activityId')) === _this.$route.params.activityId) {
                refundData = JSON.parse(localStorage.getItem('refundData'))
                costData = JSON.parse(localStorage.getItem('costData'))
              }
              if (refundData !== null && refundData !== undefined && refundData !== '') {
                refundData.forEach(res => {
                  if (parseFloat(res.fee) > 0) {
                    _this.refundCount += 1
                    _this.refundData.push(res)
                  }
                })
              }
              let totalCost = 0
              if (costData !== null && costData !== undefined && costData !== '') {
                _this.balanceDetailList = costData
                costData.forEach(item => {
                  totalCost += parseFloat(item.fee)
                })
              }
              _this.totalIncome = toDecimal2(res.data.totalIncome)
              _this.totalExpense = toDecimal2(totalCost)
              _this.totalRefund = toDecimal2(parseFloat(res.data.totalIncome) - totalCost)
              if (_this.totalRefund < 0) {
                _this.totalRefund = toDecimal2(0)
              }
            }
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      chooseImages () {
        let _this_ = this;
        let count = this.localIds.length;
        let leftCount = 9 - count;
        this.$wechat.chooseImage({
          count: leftCount, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            _this_.localIds = _this_.localIds.concat(res.localIds); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          }
        });
      },
      showDeletePop (index) {
        this.showDeleteMenu = true;
        this.currentIndex = index;
      },
      deleteImg () {
        this.localIds.splice(this.currentIndex, 1);
      },
      deleteReceiveAddress () {
        this.$router.push('/Login')
      },
      publish () {
        let token = localStorage.getItem('token');
        if (!token) {
          this.deleteModalShow = true;
        } else {
          let _this_ = this;
          let refundTemp = JSON.parse(localStorage.getItem('refundData'))
          let refundTep = 0;
          if (refundTemp) {
            refundTemp.forEach((item, index) => {
              refundTep += toDecimal2(item.fee);
            })
          }
          console.log('temp', refundTemp)
          console.log('tep', refundTep)
          console.log('total', _this_.totalRefund)
          if (refundTep !== toDecimal2(_this_.totalRefund)) {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: '请确认您的退款金额'
            });
            return
          }
          let balanceData = _this_.balanceDetailList;
          for (var i = 0; i < balanceData.length; i++) {
            if ((balanceData[i].fee === 0 || balanceData[i].fee === '' || balanceData[i].fee === null || balanceData[i].fee === undefined) && (balanceData[i].feeDesc === '' || balanceData[i].feeDesc === null || balanceData[i].feeDesc === undefined)) {
              balanceData.splice(i, 1)
              i = i - 1
            }
            if (i === balanceData.length - 1) {
              _this_.balanceDetailList = balanceData
            }
          }
          _this_.$vux.loading.show({
            text: '发布中...'
          });
          let localIds = this.localIds;
          let len = localIds.length;
          /* 传了图片 */
          if (len) {
            let blobs = [];
            localIds.forEach(function (localId, index) {
              _this_.$wechat.getLocalImgData({
                localId: localId, // 图片的localID
                success: function (res) {
                  let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                  if (JNavigator.isAndroid()) {
                    localData = 'data:image/jgp;base64,' + localData;
                  }
                  let file = File.dataURItoBlob(localData);
                  blobs.push(file);
                  // 合成完最后一个,开始上传
                  if (index === len - 1) {
                    _this_.uploadBlob(blobs, 'activityBalance', undefined, undefined, function (resList) {
                      let postData = {
                        imageUrls: JSON.stringify(resList),
                        activityId: _this_.$route.params.activityId,
                        // balanceData: JSON.stringify(_this_.balanceDetailList),
                        balanceData: JSON.stringify(balanceData),
                        refundData: JSON.stringify(_this_.refundData)
                      };
                      // 保存图片到业务方
                      _this_.$JHttp({
                        url: window.baseURL + '/socialactivity/addBalance?' + querystring.stringify(postData),
                        method: 'post',
                        headers: {
                          defCommunityId: _this_.communityId
                        }
                      }).then(res => {
                        if (res.status === 100) {
                          // 开始保存逻辑
                          _this_.$vux.loading.hide();
                          _this_.$vux.toast.show({
                            type: 'success',
                            text: '发布成功'
                          });
                          localStorage.removeItem('activityId')
                          localStorage.removeItem('refundData')
                          localStorage.removeItem('costData')
                          localStorage.removeItem('totalRefund')
                          setTimeout(function () {
                            _this_.$router.push('/balanceList/' + _this_.$route.params.activityId);
                          }, 2000)
                        } else {
                          _this_.$vux.toast.show({
                            type: 'cancel',
                            text: res.msg
                          });
                        }
                      }).catch(error => {
                        console.error(error);
                      });
                    })
                  }
                }
              });
            });
          } else {
            let params = {
              activityId: _this_.$route.params.activityId,
              balanceData: JSON.stringify(balanceData),
              refundData: JSON.stringify(_this_.refundData),
              imgUrls: ''
            };
            _this_.$JHttp({
              method: 'post',
              url: window.baseURL + '/socialactivity/addBalance?' + querystring.stringify(params),
              headers: {
                defCommunityId: _this_.communityId
              }
            }).then(res => {
              _this_.$vux.loading.hide();
              if (res.status === 100) {
                _this_.$vux.toast.show({
                  type: 'success',
                  text: '发布成功'
                });
                localStorage.removeItem('activityId')
                localStorage.removeItem('refundData')
                localStorage.removeItem('costData')
                localStorage.removeItem('totalRefund')
                setTimeout(function () {
                  _this_.$router.push('/balanceList/' + _this_.$route.params.activityId);
                }, 2000)
              } else {
                _this_.$vux.toast.show({
                  type: 'cancel',
                  text: res.msg
                })
              }
            }).catch(e => {
              console.error(e)
            })
          }
        }
      },
      addDetail () {
        let _this = this
        let newDetail = {}
        newDetail.fee = ''
        newDetail.feeDesc = ''
        _this.balanceDetailList.push(newDetail)
        console.log(this.balanceDetailList)
      },
      deleteDetail (val) {
        this.balanceDetailList.splice(val, 1)
        this.balanceDetailList.forEach((item, index) => {
          let count = index + 1
          item.title = '费用明细' + count
        })
      },
      feeChange (val, index) {
        let _this = this
        if (val < 0) {
          _this.$vux.toast.show({
            text: '费用金额不能小于0',
            type: 'cancel'
          })
          setTimeout(() => {
            _this.$vux.toast.hide()
          }, 3000);
          _this.balanceDetailList[index].fee = 0
        } else {
          _this.balanceDetailList[index].fee = parseFloat(val)
        }
        let expense = 0
        _this.balanceDetailList.forEach(item => {
          if (item.fee === '' || item.fee === null || item.fee === undefined || isNaN(parseFloat(item.fee))) {
            item.fee = 0
          } else {
            expense += parseFloat(item.fee)
          }
        })
        _this.totalExpense = toDecimal2(expense)
        _this.totalRefund = toDecimal2(_this.totalIncome - _this.totalExpense)
        if (_this.totalRefund < 0) {
          _this.totalRefund = 0
        }
        _this.refundData = [];
        _this.refundCount = 0;
        localStorage.removeItem('refundData')
      },
      goToRefund () {
        let _this = this
        localStorage.setItem('activityId', JSON.stringify(_this.$route.params.activityId))
        if (_this.totalRefund > 0) {
          localStorage.setItem('totalRefund', _this.totalRefund)
          let i = _this.balanceDetailList.length
          while (i--) {
            if (_this.balanceDetailList[i].fee === '' || _this.balanceDetailList[i].fee === null || _this.balanceDetailList[i].fee === undefined || parseFloat(_this.balanceDetailList[i].fee) === 0) {
              _this.balanceDetailList.splice(i, 1)
            }
          }
          localStorage.setItem('costData', JSON.stringify(_this.balanceDetailList))
          this.$router.push('/activityRefund/' + _this.$route.params.activityId)
        }
      }
    }
  }

  function toDecimal2 (x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    var f1 = Math.round(x * 100) / 100;
    var s = f1.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  }
</script>
<style type="text/less" lang="less">
  .publish {
    height: 100%;
  }

  .newThings-banner {
    .pub_option {
      border-bottom: 0.5px solid #d8d8d8;
      margin: 0 15px;
      padding: 5px 0;
      .weui-cell {
        padding: 10px 0;
      }
    }
    .chooseImg {
      display: flex;
      flex-wrap: wrap;
      /*justify-content: space-between;*/
      align-items: center;
      padding: 10px 15px 25px 15px;
      li {
        width: 105px;
        height: 105px;
        margin-left: 15px;
        margin-top: 15px;
        /*overflow: hidden;*/
        /*display: flex;*/
        /*align-items: center;*/
        img {
          width: 100%;
          height: 100%;
        }
      }
      li:nth-child(3n + 1) {
        margin-left: 0;
      }
      .add {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 103px;
        height: 103px;
        /*border: 1px dashed #D8D8D8;*/
        background-image: url("../../../assets/images/addpic-210.png");
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
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
          width: 50%;
          height: 100%;
          line-height: 50px;
          color: #18adfb;
          font-size: 16px;
        }
      }
    }
    .amountDetail-title {
      font-size: 14px;
      color: #aaa;
    }
    .amountDetail-info {
      input {
        border: none;
        width: 100%;
        height: 26px;
        font-size: 20px;
        margin-top: 10px;
        line-height: 26px;
      }
    }
    .amount-title {
      background-color: #f5f5f5;
      font-size: 14px;
      color: #aaa;
      span {
        color: #0DAB60;
      }
    ;
    }
    .spacing-container {
      width: 100%;
      height: 10px;
      background-color: #f5f5f5;
    }
    .addAmountList {
      display: flex;
      width: 100%;
      height: 40px;
      font-size: 14px;
      align-items: center;
      color: #0DAB60;
      justify-content: center;
      border-top: 0.5px solid #d8d8d8;
    }
  }

  .position-vertical-demo {
    background-color: #ffe26d;
    color: #000;
    text-align: center;
    padding: 10px;
  }
</style>
