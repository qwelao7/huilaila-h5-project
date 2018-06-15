<template>
  <div class="service commonHeader">
    <view-box ref="viewBox" body-padding-top="0" body-padding-bottom="1.306667rem">
      <div class="banner">
        <j-pull :refreshFunc="refreshData" :scrollFunc="onScroll" :loadMoreFunc="loadMore">
          <div slot="jpull-list">
            <div class="swiper" v-show="focusArr.length">
              <swiper :list="focusArr" loop auto height="4.266667rem" dots-class="custom-bottom" dots-position="right" :show-desc-mask="false"></swiper>
            </div>
            <div class="businessApp">
              <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false">
                <grid-item :label="item.subName" v-for="item in applicationArr" @click.native="toAppDetail(item)">
                  <img slot="icon" :src="item.subImg">
                </grid-item>
              </grid>
            </div>
            <div class="recommendTopic" v-show="recommendArr.length">
              <div class="title" @click="toRecommendTopic">
                <div>
                  <p>推荐专题</p>
                  <i></i>
                </div>
                <p>什么值得买？</p>
              </div>
              <div class="content">
                <div @click="toTopicDetail(item)" v-for="item in recommendArr">
                  <img :src="item.promotionImg" alt="">
                </div>
              </div>
            </div>
            <div class="hotAndNew" ref="hotBox">
              <tab :line-width=0>
                <tab-item class="vux-center"
                          active-class="chooseBar"
                          :selected="chooseBar === item.id"
                          v-for="(item, index) in tabItem"
                          @on-item-click="switchTabItem(item.id)"
                          :key="item.id">{{item.name}}
                </tab-item>
              </tab>
              <GoodsList :productArr="productArr"></GoodsList>
            </div>
          </div>
        </j-pull>
      </div>
      <div class="shoppingCart">
        <cart :productsNum="productsNum"></cart>
      </div>
      <bottomTab slot="bottom"></bottomTab>
    </view-box>
  </div>
</template>

<script>
  import {ViewBox, XDialog, XHeader, Swiper, SwiperItem, Grid, GridItem, Tab, TabItem, TransferDom, Badge, querystring} from 'vux'
  import bottomTab from '../components/bottomTab'
  import JPull from './base/JPull/JPull'
  import cart from './service/shoppingCart'
  import newGoods from './service/hotAndNew/new'
  import GoodsList from '../components/service/goodsList'
  import hotGoods from './service/hotAndNew/hot'
  export default {
    name: 'Service',
    directives: {
      TransferDom
    },
    components: { ViewBox, XDialog, XHeader, bottomTab, Swiper, SwiperItem, Grid, GridItem, JPull, Tab, TabItem, Badge, querystring, cart, GoodsList, newGoods, hotGoods },
    data () {
      return {
        index: 0,
        curPage: 1,
        pageSize: 20,
        hasMore: false,
        focusArr: [],
        applicationArr: [],
        recommendArr: [],
        productArr: [],
        newProductArr: [],
        tabItem: [
          {
            name: '新品',
            id: 0,
            value: 'new'
          },
          {
            name: '热门',
            id: 1,
            value: 'hot'
          }
        ],
        chooseBar: 0,
        currentTab: newGoods,
        productsNum: 0,
        showCart: false
      }
    },
    created () {
      this.getApplication()
      this.getNew()
      this.getShopCartNum()
    },
    methods: {
      refreshData (loaded) {
        this.productArr = []
        this.getApplication(loaded)
        this.getShopCartNum(loaded)
        this.switchTabItem(0, loaded)
      },
      loadMore (loaded) {
        this.curPage++;
        if (this.chooseBar) {
          this.getHot(loaded)
        } else {
          this.getNew(loaded)
        }
      },
      onScroll (event) {
//        this.scrollTop = event.target.scrollTop
      },
      getApplication () {
        console.log(navigator.appVersion)
        let this_ = this;
        this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/goods/getLifeHomePage',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          console.log(res)
          if (res.status === 100) {
            this_.focusArr = [];
            let data = res.data
            this_.applicationArr = data.aLifeIndexSubjectInfoV.subjectList // 应用列表
            this_.recommendArr = data.promotionTopicList // 推荐专题列表
//            data.focusInfoVList.forEach()
//            this_.focusArr = this_.getImgList(data.focusInfoVList) // 轮播图列表
            data.focusInfoVList.forEach(val => {
              let url;
              if (val.focusType === '1') { // 跳转至详情
                url = '/bannerNews/' + val.focusDetailId
              } else if (val.focusType === '3') { // 跳转至外部链接
                url = JSON.parse(val.skipData).url
              }
              let obj = {
                url: url,
                img: val.smallPic,
                id: val.focusDetailId
              };
              this_.focusArr.push(obj)// 轮播图列表
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      getHot (loaded) {
        let this_ = this;
        let params = {
          type: 0, // 0热门，1新品
          curPage: this_.curPage,
          pageSize: this_.pageSize
        }
        this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/goods/getLifeHomePageProduct?' + querystring.stringify(params)
        }).then(res => {
          if (loaded) {
            loaded(this_.hasMore)
          }
          if (res.status === 100) {
            let data = res.data
            this_.hasMore = data.pageResult.hasMore
            this_.productArr = this_.productArr.concat(data.resultList) // 热门商品列表
          }
        }).catch(e => {
          console.log(e)
        })
      },
      getNew (loaded) {
        let this_ = this;
        let params = {
          type: 1, // 0热门，1新品
          curPage: this_.curPage,
          pageSize: this_.pageSize
        }
        this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/goods/getLifeHomePageProduct?' + querystring.stringify(params)
        }).then(res => {
          if (loaded) {
            loaded(this_.hasMore)
          }
          if (res.status === 100) {
            let data = res.data
            this_.hasMore = data.pageResult.hasMore
            this_.productArr = this_.productArr.concat(data.resultList) // 新品商品列表
            console.log(this_.productArr)
          }
        }).catch(e => {
          console.log(e)
        })
      },
      getShopCartNum () {
        let this_ = this;
        this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/productCarts/getProductCartsCount'
        }).then(res => {
          if (res.status === 100) {
            this_.productsNum = res.data.out
          }
        }).catch(e => {
          console.log(e)
        })
      },
      switchTabItem (val, loaded) {
        this.curPage = 1;
        this.productArr = []
        this.chooseBar = val
        if (val) {
          this.getHot(loaded)
//          this.currentTab = hotGoods
        } else {
          this.getNew(loaded)
//          this.currentTab = newGoods
        }
      },
      toAppDetail (val) {
        // subType (integer, optional): 服务显示类型：2电商商家,7 H5服务,8原生功能, 10资讯, 11商品、12 帖子、13 商品标签 ,
        // subRelationId (string, optional): sub_type为2时为门店id，为10是资讯分类code，为11时为商品一级类目id，为13时为商品标签id ,
        switch (val.subType) {
          case 2:
            this.$router.push('/shopperProductList/' + val.subRelationId)
            break
          case 7:
            location.href = val.subUrl
            break
          case 8:
            this.$vux.alert.show({
              title: '提示',
              content: '本模块正在开发中，敬请期待',
              buttonText: '好的'
            })
            break
          case 11:
            this.$router.push('/categoryProductList/' + val.subRelationId)
            break
          case 13:
            this.$router.push({
              path: '/labelProductList/' + val.subRelationId,
              query: {subName: val.subName}
            })
            break;
        }
      },
      toRecommendTopic () {
        this.$router.push('/promotionList')
      },
      toTopicDetail (val) {
        let storeId = val.h5url.split('storeIds=')[1]
        this.$router.push({
          path: '/promotionDetail',
          query: {
            promotionId: val.promotionId,
            storeIds: storeId
          }
        })
      },
      getImgList (val) {
        let obj1 = {};
        let arr = [];
        if (val) {
          val.forEach(res => {
            obj1 = {
              src: res.smallPic
            };
            arr.push(obj1)
          });
          return arr
        } else {
          return [{src: ''}]
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .service{
    height: 100%;
    width: 100%;
    /*background-color: #f7f7f7;*/
    position: relative;
    .banner{
      height: 100%;
      .businessApp{
        background-color: #ffffff;
      }
      .recommendTopic{
        margin-top: 26px;
        padding: 0 15px;
        .title{
          div{
            display: flex;
            align-items: center;
            justify-content: space-between;
            p{
              font-size: 21px;
              color: #333333;
              font-weight: 400;
            }
            i{
              display: block;
              width: 18px;
              height: 18px;
              background: url("../assets/images/arrow_icon_grey32.png") no-repeat;
              background-position: center;
              background-size: cover;
            }
          }
          p{
            margin-top: 5px;
            font-size: 12px;
            color: #aaaaaa;
          }
        }
        .content{
          margin-top: 20px;
          div{
            width: 100%;
            height: 147px;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          img{
            width: 100%;
            height: 100%;
            border-radius: 10px;
          }
        }
      }
      .hotAndNew{
        margin-top: 20px;
        padding: 0 15px;
        .chooseBar{
          color: #ffffff;
          background-color: #0DAB60;
        }
      }
    }
    .shoppingCart{
      position: fixed;
      right: 18.5px;
      bottom: 84px;
    }
  }
</style>
