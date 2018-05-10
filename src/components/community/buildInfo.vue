<template>
  <div class="commonHeader buildInfo">
    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="小区信息"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      </x-header>
      <div class="infoBanner" v-if="buildInfoList">
        <div class="normalBanner">
          <div class="pic_banner">
            <img :src="buildInfoList.sitePlan" alt="">
          </div>
          <ul class="bannerLi">
            <li class="phone">
              <div>
                <span>联系电话：</span>
                <span>{{buildInfoList.communityPhone}}</span>
              </div>
              <a class="green-border" :href="'tel:'+ buildInfoList.communityPhone">
                <span>咨询</span>
                <i class="phone_pic"></i>
              </a>
            </li>
            <li class="address">
              <div>
                <span>楼盘地址：</span>
                <span>{{buildInfoList.communityAddress}}</span>
              </div>
              <!--<a class="green-border" @click="toMap">
                <span>导航</span>
                <i class="address_pic"></i>
              </a>-->
            </li>
            <li class="more-or-less" v-show="!show">
              <div @click="showMore">
                <span class="more_tit">{{more}}</span>
                <i class="more_pic"></i>
              </div>
            </li>
          </ul>
          <ul class="bannerLi bannerLi-more" v-show="show">
            <!--<li>-->
            <!--<span>户型介绍：</span>-->
            <!--<span>{{buildInfoList.mainUnit}}</span>-->
            <!--</li>-->
            <li>
              <span>交付时间：</span>
              <span>{{buildInfoList.deliveryTime}}</span>
            </li>
            <li>
              <span>产权年限：</span>
              <span>{{buildInfoList.rightTime}}</span>
            </li>
            <li>
              <span>容积率：</span>
              <span>{{buildInfoList.plotRatio}}</span>
            </li>
            <li>
              <span>绿化率：</span>
              <span>{{buildInfoList.greeningRate}}</span>
            </li>
            <li>
              <span>总幢数：</span>
              <span>{{buildInfoList.totalBuilding}}</span>
            </li>
            <!--<li>-->
            <!--<span>总户数：</span>-->
            <!--<span>{{buildInfoList.planHouseholds}}</span>-->
            <!--</li>-->
            <!--<li>-->
            <!--<span>车位信息：</span>-->
            <!--<span>{{buildInfoList.carNumber}}</span>-->
            <!--</li>-->
            <!--<li>-->
            <!--<span>建筑类型：</span>-->
            <!--<span>{{buildInfoList.communityType}}</span>-->
            <!--</li>-->
            <li>
              <span>占地面积：</span>
              <span>{{buildInfoList.cover}}</span>
            </li>
            <li>
              <span>建筑面积：</span>
              <span>{{buildInfoList.buildArea}}</span>
            </li>
            <li>
              <span>装修情况：</span>
              <span>{{buildInfoList.decoration}}</span>
            </li>
            <li>
              <span>物业公司：</span>
              <span>{{buildInfoList.propertyCompany}}</span>
            </li>
            <li>
              <span>物业费：</span>
              <span>{{buildInfoList.condoFee}}</span>
            </li>
            <!--<li>-->
            <!--<span>设计单位：</span>-->
            <!--<span>{{buildInfoList.builder}}</span>-->
            <!--</li>-->
            <li>
              <span>景观单位：</span>
              <span>{{buildInfoList.landscapeUnit}}</span>
            </li>
            <li class="more-or-less" v-show="show">
              <div @click="showMore">
                <span>{{more}}</span>
                <i class="less_pic"></i>
              </div>
            </li>
          </ul>
        </div>
        <div class="niceBanner">
          <p>项目亮点：</p>
          <p class="content">{{buildInfoList.communityRemark}}</p>
          <div class="img">
            <img :src="buildInfoList.sitePlan" alt="">
          </div>
        </div>
      </div>
      <div class="noContent" v-if="!buildInfoList">
        <img src="../../assets/images/No-content.png" alt="">
        <p>什么都没发现，去别处看看吧</p>
        <!--<span @click="toPublish">去发帖</span>-->
      </div>
    </view-box>
  </div>
</template>
<script>
  import { XHeader, ViewBox } from 'vux'
  export default {
    name: 'pub_newThings',
    components: {
      XHeader,
      ViewBox
    },
    data () {
      return {
        buildInfoList: {},
        more: '更多',
        show: false
      }
    },
    created () {
      this.getBuildInfo();
    },
    methods: {
      getBuildInfo () {
        let that = this;
        that.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/community/info'
        }).then(res => {
          if (res.status === 100) {
            that.buildInfoList = res.data;
            console.log(res, 12121221);
          }
        }).catch(err => {
          console.log(err);
        })
      },
      showMore () {
        this.show = !this.show;
        if (this.show) {
          this.more = '收起'
        } else {
          this.more = '更多'
        }
      },
      toMap () {
        let params = {};
        this.$router.push('/loadMap')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .buildInfo{
    height: 100%;
    position: relative;
    background-color: #f7f7f7;
    .noContent{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 142.5px;
      margin-bottom: 284.5px;
      img{
        width: 150px;
        height: 150px;
      }
      p{
        margin-top: 10px;
        color: #aaaaaa;
        font-size: 15px;
      }
    }
  }
  .infoBanner{
    .normalBanner{
      background-color: #ffffff;
      .pic_banner{
        width: 100%;
        height: 217px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .bannerLi{
        padding: 8px 15px 12px 15px;
        li{
          display: flex;
          font-size: 15px;
          margin-top: 10px;
        }
        .phone, .address{
          justify-content: space-between;
          align-items: center;
          div{
            display: flex;
            align-items: center;
            justify-content: space-around;
          }
          div:first-child{
            flex: 1;
            justify-content: flex-start;
            align-items: flex-start;
            span:last-child{
              flex: 1;
            }
          }
          .green-border{
            display: flex;
            align-items: center;
            justify-content: space-around;
            width: 60px;
            height: 19px;
            text-align: center;
            color: #0DAB60;
            font-size: 14px;
            float: right;
            border: 1px solid #0DAB60;
            border-radius: 4px;
            i{
              width: 12px;
              height: 12px;
              background-repeat: no-repeat;
              background-position: center center;
              background-size: contain;
            }
            .phone_pic{
              background-image: url("../../assets/images/consult_icon_black.png");
            }
            .address_pic{
              background-image: url("../../assets/images/navigation_icon_black.png");
            }
          }
        }
        li:first-child{
          margin-top: 0;
        }
        .more-or-less{
          justify-content: center;
          div{
            display: flex;
            align-items: center;
            .more_pic{
              width:16px;
              height:16px;
              background: url("../../assets/images/arrow_open_greysmall.png") center no-repeat / contain ;
            }
            .less_pic{
              width:16px;
              height:16px;
              background: url("../../assets/images/arrow_close_greysmall.png") center no-repeat / contain ;
            }
          }
        }
      }
      .bannerLi-more{
        padding-top: 0;
      }
    }
    .niceBanner{
      background: #ffffff;
      margin-top: 10px;
      padding: 10px 15px 20px 15px;
      p{
        font-size: 15px;
        margin-top: 10px;
      }
      .content{
        text-indent: 2em;
      }
      .img{
        margin-top: 12px;
        width: 100%;
        height: 217px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
