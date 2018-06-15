<template>
  <div class="tab-container">
    <div class="tab-wrapper" v-show="!isShowCategoryList">
      <tab class="tab" :line-width=2 custom-bar-width="0.533rem" :active-color='activeColor' v-model="currentIndex">
        <tab-item class="vux-center" :class="{'red-point': item.redPoint}" :selected="index === currentIndex" v-for="(item, index) in tabs" :key="index"
                  @on-item-click="changeTab(item, index)" v-text="item.text"></tab-item>
      </tab>
      <div class="btn" @click="showCategoryList">
        <span class="icon"></span>
      </div>
    </div>
    <div class="content-warpper" v-for="(item, index) in tabs" :key="index" v-show="index === currentIndex">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div slot="jpull-list">
          <div class="list" v-if="orderList[index].length > 0">
            <div class="item" v-for="item in orderList[index]" @click="orderDetail(item.orderId)">
              <div class="header">
                <div class="left">
                  <div class="store-name" v-text="item.storeName"></div>
                  <div class="serial-number" v-text="'(' + item.serialNumber + ')'"></div>
                </div>
                <div class="order-status" v-text="orderStatus[item.orderStatus] && orderStatus[item.orderStatus].text" v-if="item.orderStatus !== 0"></div>
                <div class="order-time" v-text="item.payRemainingTimeStr" v-if="item.orderStatus === 0"></div>
              </div>
              <product-list :productList=item.orderItem :isClick=isClick></product-list>

              <div class="server-time" v-if="item.orderDate && item.orderTime" v-text="'服务时间：' + item.orderDate + ' ' + item.orderTime"></div>

              <div class="footer">
                <div class="info">
                  <div class="text">合计：</div>
                  <div class="order-money" v-text="'¥' + (item.orderMoneyTotal.toString().indexOf('.') === -1 ? item.orderMoneyTotal + '.00' : item.orderMoneyTotal)"></div>
                  <div class="order-freight" v-if="item.freightMoney !== 0" v-text="'（含运费¥' + item.freightMoney + '）'"></div>
                </div>
                <div class="operation">
                  <div class="button" v-if="item.hasLogistics" @click.stop="logistics(item)">查看物流</div>
                  <div class="button" v-if="item.orderStatus === 3" @click.stop="evaluate(item)">评价</div>
                  <div class="button" v-if="item.orderStatus === 0" @click.stop="payment(item)">付款</div>
                </div>
              </div>
            </div>
          </div>
          <div class="placeholder-warpper" v-if="showPlaceholder && orderList[index].length === 0">
            <img src="../../../../assets/images/No-content.png">
            <p>啊哦~你还没有相关的订单</p>
            <p>可以去看看有哪些想买的</p>
            <div class="button-Service" @click="Service">去逛逛</div>
          </div>
        </div>
      </j-pull>
    </div>
    <div class="category-wrapper" v-show="isShowCategoryList">
      <div class="shadow-box" @click="hideCategoryList"></div>
      <div class="content">
        <div class="header vux-1px-b">
          <div class="left">
            <span class="text">请选择类别:</span>
          </div>
          <div class="right" @click="hideCategoryList">
            <span class="icon"></span>
          </div>
        </div>
        <div class="list">
          <button class="item" :class="{'selected-item': (index === currentIndex)}"
                  v-for="(item, index) in tabs" :key="index" v-text="item.text"
                  @click="chooseItem(item, index)">
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { querystring } from 'vux'
  import { JTab, JTabItem } from 'components/base/JTab/index'
  import JPull from 'components/base/JPull/JPull'
  import productList from 'components/my/productList'
  export default {
    name: 'ScrollTab',
    props: {
      tabs: {
        type: Array,
        default: []
      }
    },
    components: {
      'tab': JTab,
      'tab-item': JTabItem,
      'j-pull': JPull,
      'product-list': productList
    },
    data () {
      return {
        isClick: false,
        activeColor: '#FF6648',
        orderStatus: [{
          text: '待付款'
        }, {
          text: '待接收'
        }, {
          text: '处理中'
        }, {
          text: '待评价'
        }, {
          text: '已完成'
        }, {
          text: '已关闭'
        }, {
          text: '待处理'
        }],
        showPlaceholder: false,
        currentIndex: 0,
        currentTab: {},
        isShowCategoryList: false,
        pageInfo: [],
        orderList: []
      }
    },
    created () {
      this.getOrderCount()
      this.currentTab = this.tabs[0]
      for (let i = 0; i < this.tabs.length; i++) {
        this.pageInfo.push({
          curPage: 1,
          pageSize: 20
        })
        this.orderList.push([])
        if (i === 0) {
          this.showPlaceholder = false
          this.getOrderList()
        }
      }
    },
    watch: {
      currentIndex (val, oldVal) {
        this.$nextTick(() => {
          if (this.orderList[this.currentIndex].length < 1) {
            this.showPlaceholder = false
            this.getOrderList()
          }
        })
      }
    },
    methods: {
      getOrderCount () {
        let _this_ = this
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/order/getOrderCount'
        }).then(res => {
          if (res.status === 100) {
            if (res.data.noPayCount > 0) {
              _this_.tabs[1].redPoint = true
            }
            if (res.data.noAppraiseCount > 0) {
              _this_.tabs[4].redPoint = true
            }
          }
        }).catch(e => {
          console.log(e)
        });
      },
      getOrderList (loaded) {
        let _this_ = this
        let params = {
          curPage: _this_.pageInfo[_this_.currentIndex].curPage,
          pageSize: _this_.pageInfo[_this_.currentIndex].pageSize
        }
        if (_this_.currentTab.value !== undefined) {
          params['orderStatus'] = _this_.currentTab.value
        }
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/order/getUserOrderList?' + querystring.stringify(params)
        }).then(res => {
          _this_.showPlaceholder = true
          if (res.status === 100) {
            if (_this_.pageInfo[_this_.currentIndex].curPage === 1) {
              Vue.set(_this_.orderList, _this_.currentIndex, res.data.resultList)
            } else {
              Vue.set(_this_.orderList, _this_.currentIndex, _this_.orderList[_this_.currentIndex].concat(res.data.resultList))
            }
            // 有待付款/待评价的订单时在tab右上角显示红点
            if (_this_.currentIndex === 1) {
              _this_.tabs[1].redPoint = !!(_this_.orderList[_this_.currentIndex].length > 0)
            }
            if (_this_.currentIndex === 4) {
              _this_.tabs[4].redPoint = !!(_this_.orderList[_this_.currentIndex].length > 0)
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
      showCategoryList () {
        this.isShowCategoryList = true;
      },
      hideCategoryList () {
        this.isShowCategoryList = false;
      },
      changeTab (item, index) {
        this.currentTab = item;
        this.currentIndex = index;
      },
      chooseItem (item, index) {
        this.currentTab = item
        this.currentIndex = index
        this.hideCategoryList()
      },
      refreshData (loaded) {
        this.pageInfo[this.currentIndex].curPage = 1
        this.getOrderList(loaded);
      },
      loadMore (loaded) {
        this.pageInfo[this.currentIndex].curPage++
        this.getOrderList(loaded)
      },
      orderDetail (orderId) {
        this.$router.push('/orderDetail/' + orderId)
      },
      logistics (item) {
        if (item.orderItem.length > 1) {
          this.$router.push('logisticsList?orderId=' + item.orderId)
        } else {
          let params = {
            expCode: item.orderItem[0].expFirmCode,
            expNum: item.orderItem[0].expNo,
            orderId: item.orderItem[0].orderId
          }
          this.$router.push('/logisticsDetail?' + querystring.stringify(params))
        }
      },
      evaluate (item) {
        let params = {
          orderId: item.orderId,
          isModify: 0
        }
        this.$router.push('/evaluationForLifeService?' + querystring.stringify(params))
      },
      payment (item) {
        this.$router.push('/selectPayType/' + item.orderId)
      },
      Service () {
        this.$router.push('/Service')
      }
    }
  }
</script>

<style scoped lang="less">
  .tab-container {
    width: 100%;
    height: 100%;
    position: relative;
    .tab-wrapper {
      width: 100%;
      height: 44px;
      display: flex;
      align-items: center;
      .tab {
        flex: 1;
        .red-point {
          position: relative;
        }
        .red-point:before {
          position: absolute;
          content: " ";
          border: 4px solid red;
          border-radius: 50%;
          right: 4px;
          top: 4px;
          z-index: 1000;
        }
      }
      .btn {
        flex: 0 0 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        position: relative;
        box-shadow: -9px 0px 23px -10px #888888;
        .icon {
          width: 24px;
          height: 24px;
          background-repeat: no-repeat;
          background-size: 100%;
          background-image: url("../../../../assets/images/arrow_open_greysmall.png");
        }
      }
    }
    .content-warpper {
      height: 576px;
      background-color: #f2f2f2;
      .list {
        .item {
          background-color: #ffffff;
          padding: 0 15px;
          margin-top: 10px;
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 0 11px 0;
            .left {
              display: flex;
              align-items: center;
              flex: 1;
              width: 0%;
              .store-name {
                font-size: 15px;
                color: #333333;
                margin-right: 5px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .serial-number {
                font-size: 12px;
                color: #AAAAAA;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            .order-status {
              font-size: 15px;
              color: #AAAAAA;
              white-space: nowrap;
            }
            .order-time {
              font-size: 15px;
              color: #FF6648;
              white-space: nowrap;
            }
          }
          .server-time {
            padding: 13.5px 0;
          }
          .footer {
            .info {
              display: flex;
              padding: 13.5px 0 9px 0;
              border-top: 0.5px solid #D8D8D8;
              .text {
                margin-right: 5px;
              }
            }
            .operation {
              display: flex;
              justify-content: flex-end;
              padding-bottom: 9px;
              .button {
                padding: 4.5px 14.5px;
                text-align: center;
                height: 17px;
                line-height: 17px;
                color: #FF6648;
                background: #FFFFFF;
                border: 1px solid #FF6648;
                border-radius: 100px;
                &:not(:last-child) {
                  margin-right: 5px;
                };
              }
            }
          }
        }
      }
    }
    .placeholder-warpper {
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
    .category-wrapper {
      width: 100%;
      background-color: #fff;
      position: absolute;
      top: 0;
      .shadow-box {
        position: fixed;
        /*left: 0;*/
        /*top: 124px;*/
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 500;
      }
      .content {
        position: fixed;
        background-color: #fff;
        z-index: 501;
        width: 100%;
        .header {
          width: 100%;
          height: 44px;
          display: flex;
          .left {
            flex: 1;
            display: flex;
            align-items: center;
            margin-left: 15px;
            .text {
              font-size: 15px;
              color: #333;
            }
          }
          .right {
            flex: 0 0 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: -9px 0px 23px -10px #888888;
            .icon {
              display: inline-block;
              width: 15px;
              height: 15px;
              background-size: 100%;
              background-repeat: no-repeat;
              background-image: url('../../../../assets/images/close_icon_myorder.png');
            }
          }
        }
        .list {
          width: 100%;
          padding: 20px 18px;
          .item {
            width: 100px;
            height: 35px;
            border-radius: 25px;
            background-color: #F2F2F2;
            border: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0 20px;
            font-size: 15px;
            color: #333;
            margin-right: 20px;
            margin-bottom: 15px;
          }
          .selected-item {
            background-color: #FF6648;
          }
        }
      }
    }
  }
</style>
