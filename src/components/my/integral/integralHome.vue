<template>
  <div class="commonHeader integral">
    <x-header
      slot="right"
      :left-options="{backText: ''}">
      <a slot="right" style="color: #333;font-size: 14px;" @click="goInstructions">积分说明</a>
    </x-header>
    <div class="integral_top">
      <p class="integral_name">积分</p>
      <p class="integral_num">{{integralNum}}</p>
      <p class="integral_more" @click="goDetail">
        <span class="more_name">明细</span>
        <i class="more_right"></i>
      </p>
    </div>
    <div class="scoll_top">
      <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
        <div class="integral_shop" slot="jpull-list" v-for="item, index in lists">
          <div class="shop_list">
            <div class="list-left">
              <div class="shop_images">
                <img :src="item.picUrl" alt="">
              </div>
              <div class="shop_information">
                <p class="shop_name">{{item.name}}</p>
                <div class="shop_integral">
                  <p class="integral_numAll">
                    <span class="integral_number">{{item.requiredScore}}</span>
                    积分
                  </p>
                  <p class="integral_price">￥{{item.price}}</p>
                </div>
                <p class="shop_number">
                  限量
                  <span class="shop_num">{{item.remainingNumber}}</span>
                  件
                </p>
              </div>
            </div>
            <div>
              <div class="integral_right" v-if="item.exchanging" :key="item.productId" @click="onItemClick(item.productId)">
                兑换
              </div>
              <div class="integral_right_1" v-if="item.exchangeEnd">
                兑换结束
              </div>
              <div class="integral_right_1" v-if="item.exchangeUnStart">
                兑换未开始
              </div>
            </div>
          </div>
        </div>
        <load-more tip="loading"></load-more>
      </j-pull>
    </div>
  </div>
</template>
<script>
  import { XHeader, Tab, TabItem, ViewBox, LoadMore, Loading } from 'vux'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'integral',
    components: {
      JPull,
      LoadMore,
      Loading,
      XHeader,
      ViewBox,
      Tab,
      TabItem
    },
    data () {
      return {
        integralNum: '',
        hasMore: '',
        PageIndex: 1, // 页码从第一页开始
        PageSize: 10, // 每页显示的条数
        isShow: true, // 是否显示scroller,第一次请求数据过程中隐藏插件，不隐藏的时候会显示“请上拉刷新数据”的字样，不好看
        showloading: false,
        textloading: '加载中',
        showUp: true,
        isbounce: false,
        lists: [],
        isShowLoading: false,
        textLoading: '加载中',
        scrollerStatus: {
          pullupStatus: 'default'
        }
      }
    },
    created () {
    },
    mounted () {
      // 第一次加载
      this.getNewsList();
    },
    methods: {
      refreshData (loaded) {
        this.PageIndex = 1;
        this.lists = [];
        this.getNewsList(loaded);
      },
      loadMore (loaded) {
        this.PageIndex ++;
        this.getNewsList(loaded);
      },
      // 第一次加载的时候容易为空true
      getNewsList (loaded) {
        let that = this;
        // 获取用户总积分
        that.$JHttp({
          method: 'get',
          headers: {
            'defCommunityId': localStorage.getItem('communityId')
          },
          url: window.baseURL + '/integral/userInt'
        }).then(res => {
          that.integralNum = res.data;
          console.log(res);
        }).catch(err => {
          console.log(err);
        });
        //  获取积分商品
        let time = new Date().getTime();
        let second = Math.floor(time / 1000);
        that.showloading = true;
        that.$JHttp({
          method: 'get',
          headers: {
            'defCommunityId': localStorage.getItem('communityId')
          },
          url: window.baseURL + '/integral/getProductList?curPage=' + this.PageIndex + '&pageSize=' + this.PageSize
        }).then(response => {
          // sucess callback
          let data = response.data.resultList;
          that.hasMore = response.data.pageResult.hasMore;
          data.forEach(function (v, i) {
            if (v.availableFrom > second) {
              v.exchangeEnd = false;
              v.exchanging = false;
              v.exchangeUnStart = true;
            } else if (second > v.availableTo) {
              v.exchangeEnd = true;
              v.exchangeUnStart = false;
              v.exchanging = false;
            } else if (v.availableFrom < second && v.availableTo > second) {
              v.exchangeEnd = false;
              v.exchangeUnStart = false;
              v.exchanging = true;
            }
          });
          for (let i = 0; i < data.length; i++) {
            that.lists.push(data[i]);
          }
          if (loaded) {
            loaded(that.hasMore)
          }
          that.isShow = true;
          that.showloading = false;
        }, function (erro) {
          // error callback
          that.isShow = false
        })
      },
      goDetail () {
        this.$router.push('/integralDetail')
      },
      onItemClick (v) {
        console.log(v);
        this.$router.push('/integralExchange/' + v)
      },
      goInstructions () {
        this.$router.push('/integralInstructions')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .integral{
    /*padding-bottom:.3rem;*/
    height:100%;
    .scoll_top{
      height: calc(100% - 27px);
      width:100%;
    }
    .integral_top{
      padding-top: 19px;
      padding-bottom: 28px;
      border-bottom: solid 0.5px #D8D8D8;
      .integral_name{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        color: #333333;
      }
      .integral_num {
        display: flex;
        justify-content: center;
        font-size: 36px;
        color: #0DAB60;
        height: 50px;
        line-height: 50px;
        letter-spacing: 0;
        font-weight: 700;
      }
      .integral_more{
        display: flex;
        justify-content: center;
        color: #AAAAAA;
        .more_name{
          display: inline-block;
          font-size: 12px;
          line-height: 16px;
          height: 16px;
          vertical-align: middle;
          margin-right: 3px;
        }
        .more_right{
          display: inline-block;
          margin-top: 1px;
          width: 12px;
          height: 12px;
          background: url("../../../assets/images/arrow_icon_grey32.png") center;
          background-size: contain;
        }
      }
    }
    .integral_shop{
      padding: 0 15px;
    }
    .shop_list{
      border-bottom: solid 0.5px #D8D8D8;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 0;
      .list-left{
        display: flex;
        align-items: center;
      }
      .shop_images{
        width: 78px;
        height: 78px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .shop_information{
        margin-left: 14.7px;
        flex:1;
        .shop_name{
          font-size: 15px;
          color: #333333;
        }
        .shop_integral{
          margin-top: 9px;
          .integral_numAll{
            display: inline-block;
            font-size: 12px;
            color: #0DAB60;
            .integral_number{
              display: inline-block;
            }
          }
          .integral_price{
            display: inline-block;
            margin-left: 15px;
            font-size: 12px;
            color: #AAAAAA;
            text-decoration:line-through;
            .price_num{
              display: inline-block;
            }
          }
        }
        .shop_number{
          font-size: 10px;
          color: #AAAAAA;
          margin-top: 5px;
          .shop_num{
            display: inline-block;
          }
        }
      }
      .integral_right{
        width: 80px;
        height: 24px;
        line-height: 24px;
        border: 1px solid #0DAB60;
        border-radius: 20px;
        font-size: 12px;
        color: #0DAB60;
        text-align: center;
      }
      .integral_right_1{
        width: 80px;
        height: 24px;
        line-height: 24px;
        border: 1px solid #aaa;
        border-radius: 20px;
        font-size: 12px;
        color: #aaa;
        text-align: center;
      }
    }
  }
</style>
