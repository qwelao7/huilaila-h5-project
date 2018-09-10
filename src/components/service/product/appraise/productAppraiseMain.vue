<template>
  <div class="product-appraise-main commonHeader">
    <view-box body-padding-top="175px"  body-padding-bottom="0">
    <div style="width:100%;position:absolute;left:0;top:0;z-index:100;background-color: #fff" slot="header">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        class="top-header"
        title="全部评价">
      </x-header>
      <div>
        <div style="background-color: #F5F5F5;height: 10px"></div>
        <div class="word-check">
        <span @click='changeCheckWorld'>
          <img class="checkbox-icon" :class="{'checkbox-icon-normal': !isOnlyWorld}"
               src="../../../../assets/images/uncheckcircle_button.png">
          <img class="checkbox-icon" :class="{'checkbox-icon-checked': isOnlyWorld}"
               src="../../../../assets/images/checkcircle_button.png">
          <span class="checkbox-label">只看有文字的评论</span>
        </span>
          <span class="good-satisfaction" v-if="this.appraiseCount.satisfaction">好评率<span>{{this.appraiseCount.satisfaction}}</span></span>
        </div>
        <div class="divider"></div>
        <tab :line-width="2" custom-bar-width="25px" active-color="#FF6648" default-color="#333333" scroll-threshold="6">
          <tab-item v-for="item  in tabList"
                    :selected="index === item.id"
                    @on-item-click="clickTab(item)"
                    :key="item.id">
            <router-link :to="'/productAppraise/' + item.value + '/' + productId" tag="li" replace><span v-html="getTabTitle(item)"></span>
            </router-link>
          </tab-item>
        </tab>
      </div>
    </div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!--<div class="content">-->
      <!--<keep-alive>-->
        <!--<router-view v-if="$route.meta.keepAlive"></router-view>-->
      <!--</keep-alive>-->
      <!--<router-view v-if="!$route.meta.keepAlive"></router-view>-->
    <!--</div>-->
    </view-box>
  </div>
</template>
<script>
  import {XHeader, Tab, TabItem, CheckIcon, ViewBox, querystring} from 'vux'
  import JPull from '../../../base/JPull/JPull'

  const tabList = () => [
    {
      name: '全部',
      id: 0,
      value: 'allAppraiseList'
    },
    {
      name: '满意',
      id: 1,
      value: 'goodAppraiseList'
    },
    {
      name: '一般',
      id: 2,
      value: 'normalAppraiseList'
    },
    {
      name: '失望',
      id: 3,
      value: 'disappointmentAppraiseList'
    },
    {
      name: '有图',
      id: 4,
      value: 'havaImgAppraiseList'
    }
  ];
  export default {
    name: '',
    components: {
      JPull,
      XHeader,
      Tab,
      TabItem,
      CheckIcon,
      ViewBox
    },
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      console.log('productAppraiseMain--beforeRouteLeave to:' + to.path);
      console.log('productAppraiseMain--beforeRouteLeave from:' + from.path);
      next();
    },
    created () {
      console.log('created--productId:' + this.$route.params.productId);
      // this.productId = this.$route.params.productId;
      // this.index = 0;
      this.getProductAppraiseCount();
    },
    computed: {
      productId () {
        return this.$route.params.productId;
      },
      checkboxIcon () {
        if (this.isOnlyWorld) {
          return '../../../../assets/images/checkcircle_button.png'
        } else {
          return '../../../../assets/images/uncheckcircle_button.png'
        }
      }
    },
    data () {
      return {
        leftOptions: {
          preventGoBack: true,
          backText: ''
        },
        index: 0,
        // productId: '',
        tabList: tabList(),
        isOnlyWorld: true,
        appraiseCount: {
          allCount: 0,
          badCount: 0,
          generalCount: 0,
          goodCount: 0,
          imgCount: 0,
          satisfaction: ''
        }
      }
    },
    methods: {
      clickTab (val) {
        console.log('切换到tab index：' + val.id)
        this.index = val.id;
        console.log(this.$route.params)
      },
      getTabTitle (item) {
        if (item.id === 0) {
          return item.name + '<br>' +
            this.appraiseCount.allCount
        } else if (item.id === 1) {
          return item.name + '<br>' + this.appraiseCount.goodCount
        } else if (item.id === 2) {
          return item.name + '<br>' + this.appraiseCount.generalCount
        } else if (item.id === 3) {
          return item.name + '<br>' + this.appraiseCount.badCount
        } else if (item.id === 4) {
          return item.name + '<br>' + this.appraiseCount.imgCount
        }
      },
      getProductAppraiseCount () {
        let params = {
          productId: this.productId
        };
        let url = window.baseURL + '/serverShu/product/appraiseCount?' + querystring.stringify(params);
        this.$JHttp({
          method: 'post',
          url: url,
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          console.log('获取商品评论数>>>：', res);
          if (res.status === 100) {
            this.appraiseCount = res.data;
          }
        }).catch(e => {
          console.log(e)
        });
      },
      changeCheckWorld () {
        console.log('changeCheckWorld---------')
        this.isOnlyWorld = !this.isOnlyWorld;
        this.$store.commit('updateIsOnlyWorld', this.isOnlyWorld);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .product-appraise-main {
    background-color: #fff;
    height: 100%;
     .appraise-main-top{
      width:100%;
      position:fixed;
      left:0;
      top:0;
      z-index:100;
      background-color: #fff;
       /*color: red;*/
    }
    .vux-tab {
      height: 50px;
      top: 10px;
      margin-bottom: 15px;
      .vux-tab-item {
        line-height: 20px;
        font-size: 12px;
      }
    }
    span {
      display: inline-block;
    }

    .content{
      /*margin-top: 175px;*/
      /*transform:translateY(175px);*/
      /*margin-top: 15px;*/
    }
    .word-check{
      line-height: 46px;
      font-size: 12px;
      padding-left: 15px;
      span{
        display: inline-block;
      }
      i{
        display: inline-block;
        padding-top: 20px;
      }
      .checkbox-label{
        margin-left: 5px;
      }
      .good-satisfaction{
        color: #FF6648;
        font-size: 12px;
        position: absolute;
        right: 15px;
      }
    }

    .divider{
      background-color: #d5d5d5;
      margin: 5px 15px 5px 15px;
      height: 0.5px;
    }

    .vux-check-icon{
      line-height: 46px;
      text-align: center;
    }
    .vux-header .vux-header-left .left-arrow{
      border-color: #333;
    }
    .checkbox-icon{
      width: 15px;
      height: 15px;
      display: none;
      margin-top: 14px;
    }

    .checkbox-icon-checked{
      display: inline-block;
    }

    .checkbox-icon-normal{
      display: none;
      display: inline-block;

    }
  }
</style>
