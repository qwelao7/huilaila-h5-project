<template>
  <div class="integral_exchange">
    <view-box body-padding-top="0" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;background-color: transparent">
      </x-header>
      <div >
        <div class="exchange_banner">
          <div class="exchange_img">
            <div class="album-img"
                 v-if="item.album && item.album.length > 0">
              <swiper height="375px" :show-dots="false" :show-desc-mask="false" v-model="swiperIndex">
                <swiper-item class="img-swiper-item"
                             v-for="(imgItem, index) in getImgList(item.album)" :key="index">
                  <img class="previewer-demo-img" :src="imgItem.src" @click="showBigImg(index)">
                </swiper-item>
              </swiper>
              <div class="nav">
                <i :class="{'current':swiperIndex == index }"
                   v-for="(img,index) in item.album">
                  <span class="pagination">{{index+1}}<i style="display: inline-block">/</i>{{item.album.length}}</span>
                </i>
              </div>
              <div v-transfer-dom>
                <previewer :list="getImgList(item.album)" ref="previewer"
                           :options="options"></previewer>
              </div>
            </div>
            <!--<img :src="item.picUrl" alt="">-->
          </div>
          <div class="exchange_content">
            <div class="shop_name">{{item.name}}</div>
            <div class="shop_price">
              <p class="integral_number">
                <span class="integral_num">{{item.requiredScore}}</span>
                <span class="integral_jf">积分</span>
              </p>
              <p class="price_num">￥{{item.price}}</p>
            </div>
          </div>
        </div>
        <div class="shop_describe">
          <div class="describe_all">
            <div class="describe_tit">商品描述</div>
            <div class="shop_name_a">
              <span class="name_name" v-html="item.detailDesc"></span>
            </div>
          </div>
        </div>
        <div class="shop_describe">
          <div class="describe_all">
            <div class="describe_tit">兑换规则</div>
            <div class="rules">{{item.terms}}</div>
          </div>
        </div>
        <div class="bottom" @click="goExchange(item)">立即兑换</div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {ViewBox, XHeader, Previewer, TransferDom, Swiper, SwiperItem, querystring} from 'vux'
  export default {
    name: 'integralExchance',
    directives: {
      TransferDom
    },
    components: {
      ViewBox,
      XHeader,
      Previewer,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        swiperIndex: 0,
        item: {},
        options: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      }
    },
    created () {
      this.getInformation(true)
    },
    methods: {
      getInformation () {
        var that = this;
        that.$JHttp({
          method: 'Get',
          headers: {
            'Accept': '*/*',
            'token': localStorage.getItem('token'),
            'defCommunityId': localStorage.getItem('communityId'),
            'companyCode': window.commonConfig.companyCode
          },
          url: window.baseURL + '/integral/productDetail/' + this.$route.params.id
        }).then(function (response) {
          console.log(response, 111);
          that.item = response.data;
        })
      },
      goBack () {
        this.$router.go(-1)
      },
      goExchange (item) {
        this.$router.push('/confirmExchange/' + item.productId)
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
      showBigImg (index) {
        this.$refs.previewer.show(index);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .integral_exchange{
    height: 100%;
    background-color: #f7f7fa;;
    .exchange_banner{
      background: #ffffff;
      .exchange_img{
        position: relative;
        img{
          width: 100%;
          height: 100%;
        }
        .back{
          display: block;
          position: absolute;
          top: 10px;
          left: 15px;
          width: 35px;
          height: 35px;
          background: url("../../../assets/images/return_button_70.png") left center;
          background-size: cover;
        }
        .album-img{
          width: 100%;
          position: relative;
          .nav {
            position: absolute;
            width: 100%;
            background-color: #123;
          }
          .nav .pagination {
            position: absolute;
            bottom: 8px;
            right: 15px;
            display: none;
            text-align: center;
            background-color: rgba(51, 51, 51, 0.80);
            border-radius: 17.5px;
            line-height: 35px;
            font-size: 12px;
            width: 35px;
            height: 35px;
            color: #fff;
          }

          .nav .pagination:first-letter {
            font-size: 20px;
          }

          .nav .current .pagination {
            display: inline-block;
          }
        }
      }
      .exchange_content{
        padding: 15px;
        .shop_name{
          font-size: 18px;
          color: #333333;
          font-weight: bold;
        }
        .shop_price{
          .integral_number{
            display: inline-block;
            .integral_num{
              font-size: 24px;
              color: #0DAB60;
              font-weight: bold;
              display: inline-block;
            }
            .integral_jf{
              font-size: 15px;
              color: #333333;
              display: inline-block;
            }
          }
          .price_num{
            display: inline-block;
            color: #AAAAAA;
            text-decoration:line-through;
            margin-left: 15px;
            font-size: 15px;
          }
        }
      }
    }
    .shop_describe{
      margin-top: 10px;
      background: #ffffff;
      .describe_all{
        padding: 0 15px;
        .describe_tit{
          padding-top: 12px;
          padding-bottom: 11px;
          border-bottom: solid 0.5px #D8D8D8;
          color: #333333;
          font-size: 15px;
        }
        .shop_name_a{
          font-size: 15px;
          color: #333333;
          padding: 15px 0;
          .name_name{
            display: inline-block;
          }
        }
        .rules{
          color: #333333;
          font-size: 15px;
          padding: 15px 0;
        }
      }
    }
    .bottom{
      width:100%;
      height:50px;
      line-height: 50px;
      text-align: center;
      color: #ffffff;
      background: #0DAB60;
      font-size: 18px;
      position: fixed;
      bottom:0;

    }
  }

</style>
