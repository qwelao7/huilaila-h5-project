<template>
  <div class="myBill commonHeader">

    <view-box body-padding-top="2.96rem" body-padding-bottom="0">

      <div style="width:100%;position:absolute;left:0;top:0;z-index:100">
        <x-header slot="header" :left-options="{ backText: '' }" :title=title>
          <a class="select-time" style="color: #333" slot="right" @click="showPopupPicker">筛选</a>
        </x-header>

        <div class="tab">
          <tab :line-width=2 custom-bar-width="0.533rem" active-color="#0DAB60" v-model="currentIndex">
            <tab-item class="vux-center" :selected="index === currentIndex" v-for="(item, index) in tabs" :key="index"
                      v-text="item.text" @on-item-click="changeTab(item, index)">
            </tab-item>
          </tab>
        </div>
      </div>

      <div class="bill-list-wrapper">
        <div class="content" v-for="(item, index) in tabs" :key="index" v-show="index === currentIndex">
          <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
            <div slot="jpull-list">
              <div class="list" v-if="billList[index].length > 0">
                <div class="item" :class="{ 'border-top': hasItemBorderTop(index, subIndex) }"
                     v-for="(item, subIndex) in billList[index]" @click="billDetail(item)">
                  <div class="header" v-if="showHeader(index, subIndex)"
                       v-text="handleTime(billList[index][subIndex].intime)"></div>
                  <div class="body">
                    <span class="icon"
                          :style="{ backgroundImage: item.type === 2 && item.specialType === 24 ? 'url(' + require('../../../assets/images/billIcon/7.png') + ')' : 'url(' + require('../../../assets/images/billIcon/' + item.type + '.png') + ')' }"></span>
                    <div class="info">
                      <div class="cell top">
                        <span class="left" v-text="item.moneyChange"></span>
                        <span class="right" v-text="handlePayType(item)"></span>
                      </div>
                      <div class="cell bottom">
                        <span class="left" v-text="handleText(item)"></span>
                        <span class="right" v-text="item.intime.substring(5, 11)"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="placeholder" v-if="showPlaceholder && billList[index].length === 0">
                <img src="../../../assets/images/No-content.png">
                <p>你还没有此类账单</p>
              </div>
            </div>
          </j-pull>
        </div>
      </div>

      <div>
        <popup-picker :show-cell="false" :show.sync="popupPicker" popup-title="请选择" :data="timeData"
                      v-model="searchMonth" @on-change="chooseTime">
        </popup-picker>
      </div>

    </view-box>

  </div>
</template>
<script>
  import Vue from 'vue'
  import {ViewBox, XHeader, PopupPicker} from 'vux'
  import {JTab, JTabItem} from 'components/base/JTab/index'
  import JPull from 'components/base/JPull/JPull'
  export default {
    name: 'myBill',
    components: {
      'view-box': ViewBox,
      'x-header': XHeader,
      'tab': JTab,
      'tab-item': JTabItem,
      'j-pull': JPull,
      'popup-picker': PopupPicker
    },
    data () {
      return {
        title: '我的账单',
        tabs: [{
          text: '全部',
          value: undefined,
          searchMonth: ''
        }, {
          text: '充值',
          value: 1,
          searchMonth: ''
        }, {
          text: '消费',
          value: 2,
          searchMonth: ''
        }, {
          text: '退款',
          value: 3,
          searchMonth: ''
        }],
        type: ['', '充值', '消费', '退款', '', '提现', '收益'],
        payType: ['线下支付', '支付宝支付', '银联支付', '微信支付', '一网通支付', '钱包支付', '通联支付', '农行掌银支付', '', '线上支付', '回来啦社区充值卡', 'POS支付', '微信支付', '微信支付', '微信支付', '会员卡支付'],
        pageInfo: [],
        currentIndex: 0,
        currentTab: {},
        popupPicker: false,
        timeData: [],
        searchMonth: [],
        showPlaceholder: false,
        billList: []
      }
    },
    created () {
      this.currentTab = this.tabs[0]
      for (let i = 0; i < this.tabs.length; i++) {
        this.pageInfo.push({
          curPage: 1,
          pageSize: 20
        })
        this.billList.push([])
        if (i === 0) {
          this.getBillList()
        }
      }
    },
    watch: {
      currentIndex (val, oldVal) {
        let _this_ = this
        _this_.$nextTick(() => {
          // 没有筛选时间
          if (_this_.searchMonth.length === 0) {
            if (_this_.billList[_this_.currentIndex].length < 1) {
              _this_.showPlaceholder = false
              _this_.getBillList()
            }
          } else {
            if (_this_.tabs[_this_.currentIndex].searchMonth !== _this_.searchMonth[0]) {
              _this_.tabs[_this_.currentIndex].searchMonth = _this_.searchMonth[0]
              _this_.pageInfo[_this_.currentIndex].curPage = 1
              _this_.showPlaceholder = false
              _this_.getBillList()
            }
          }
        })
      }
    },
    methods: {
      handlePayType (item) {
        if (item.type === 5) { // 提现
          if (item.specialType === 50) { // 充值提现
            return '线下提现'
          }
          return '钱包支付'
        } else {
          return this.payType[item.moneyType]
        }
      },
      handleTime (time) {
        return time.substring(0, 4) + '年' + time.substring(5, 7) + '月'
      },
      hasItemBorderTop (index, subIndex) {
        return subIndex > 0 && (this.billList[index][subIndex].intime.substring(0, 7) === this.billList[index][subIndex - 1].intime.substring(0, 7))
      },
      showHeader (index, subIndex) {
        return subIndex === 0 || (this.billList[index][subIndex].intime.substring(0, 7) !== this.billList[index][subIndex - 1].intime.substring(0, 7))
      },
      format (date) {
        let month = date.getMonth() + 1
        return date.getFullYear() + '-' + (month < 10 ? '0' + month : month)
      },
      getYearMonth () {
        let date = new Date()
        date.setDate(1)
        let currentDate = this.format(date)
        let result = []
        result.push(currentDate)
        for (let i = 0; currentDate !== '2013-01'; i++) {
          date.setMonth(date.getMonth() - 1)
          currentDate = this.format(date)
          result.push(currentDate)
        }
        this.timeData.push(result)
      },
      getBillList (loaded) {
        let _this_ = this
        let currentIndex = _this_.currentIndex
        let params = {
          curPage: _this_.pageInfo[currentIndex].curPage,
          pageSize: _this_.pageInfo[currentIndex].pageSize
        }

        if (_this_.currentTab.value !== undefined) {
          params['type'] = _this_.currentTab.value
        }
        if (_this_.searchMonth.length !== 0) {
          params['month'] = _this_.searchMonth[0]
        }

        _this_.$JHttp({
          method: 'GET',
          url: window.baseURL + '/treasure/getMyBillList',
          params: params
        }).then(res => {
          _this_.showPlaceholder = true
          if (res.status === 100) {
            if (_this_.pageInfo[currentIndex].curPage === 1) {
              Vue.set(_this_.billList, currentIndex, res.data.resultList)
            } else {
              Vue.set(_this_.billList, currentIndex, _this_.billList[currentIndex].concat(res.data.resultList))
            }
            if (loaded) {
              loaded(res.data.pageResult.hasMore)
            }
          }
        }).catch(e => {
          _this_.showPlaceholder = true
          console.log(e)
        });
      },
      changeTab (item, index) {
        this.currentTab = item;
        this.currentIndex = index;
      },
      refreshData (loaded) {
        this.pageInfo[this.currentIndex].curPage = 1
        this.getBillList(loaded);
      },
      loadMore (loaded) {
        this.pageInfo[this.currentIndex].curPage++
        this.getBillList(loaded)
      },
      handleText (item) {
        let text = this.type[item.type]
        if (item.type === 1) { // 充值
          return text
        } else if (item.type === 2) { // 消费
          if (item.specialType === 21) { // 订单消费
            return text + '-' + item.storeName
          } else if (item.specialType === 24) { // 物业缴费
            return text + '-物业缴费'
          } else if (item.specialType === 26) { // 活动消费
            return text + '-活动'
          } else {
            return text
          }
        } else if (item.type === 3) { // 退款
          if (item.specialType === 31) { // 订单退款
            return text + '-' + item.storeName
          } else if (item.specialType === 36) { // 活动退款
            return text + '-活动'
          } else {
            return text
          }
        } else if (item.type === 5) { // 提现
          if (item.specialType === 50) { // 充值(提现)
            return '充值退款'
          } else {
            return text
          }
        } else if (item.type === 6) { // 收益
          if (item.specialType === 63) { // 活动收益
            return text + '-活动'
          } else {
            return text
          }
        } else {
          return text
        }
      },
      showPopupPicker () {
        if (this.timeData.length === 0) {
          this.getYearMonth()
        }
        this.popupPicker = true
      },
      chooseTime () {
        this.tabs[this.currentIndex].searchMonth = this.searchMonth[0]
        this.pageInfo[this.currentIndex].curPage = 1
        this.getBillList()
      },
      billDetail (item) {
        this.$router.push({path: '/billDetail', query: {sysUserAccountDetailId: item.sysUserAccountDetailId}})
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .myBill {
    height: 100%;
    .bill-list-wrapper {
      height: 100%;
      overflow: hidden;
      .tab {
        height: 44px;
        padding: 0 20px;
        margin-bottom: 20px;
      }
      .content {
        height: 100%;
        .list {
          padding: 0 20px;
          .item {
            .header {
              background-color: #F2F2F2;
              padding: 1.5px 0 1.5px 9.5px;
            }
            .body {
              display: flex;
              align-items: center;
              padding: 17.5px 0;
              .icon {
                margin-right: 15px;
                min-width: 35px;
                width: 35px;
                height: 35px;
                background-repeat: no-repeat;
                background-position: center center;
                background-size: cover;
              }
              .info {
                width: 280px;
                .cell {
                  display: flex;
                  justify-content: space-between;
                  .left {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap
                  }
                  .right {
                    white-space: nowrap;
                    text-align: right;
                  }
                }
                .top {
                  color: #333333;
                  margin-bottom: 8px;
                }
                .bottom {
                  color: #AAAAAA;
                }
              }
            }
            &.border-top {
              border-top: 0.5px solid #D8D8D8;
            }
          }
        }
      }
      .placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 95.5px;
        img {
          width: 150px;
          height: 150px;
          margin-bottom: 10px;
        }
        p {
          color: #AAAAAA;
          font-size: 15px;
        }
        .button-Service {
          margin-top: 10px;
          width: 150px;
          height: 35px;
          line-height: 35px;
          color: #FFFFFF;
          text-align: center;
          background: #FF6648;
          border-radius: 67px;
        }
      }
    }
  }
</style>
