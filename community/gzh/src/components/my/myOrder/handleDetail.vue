<template>
  <div class="handle-detail commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="handle-info">
        <time-axis :list=list>
          <template slot-scope="slotProps">
            <div class="header">
              <div v-text="slotProps.item.status"></div>
              <div class="time" v-text="slotProps.item.time"></div>
            </div>
            <div :class="slotProps.index === 0 ? 'status-highlight' : 'status'" class="info" v-text="slotProps.item.remark"></div>
            <div class="pics" v-if="slotProps.item.pics && slotProps.item.pics.length > 0">
              <img class="previewer-demo-img" v-for="(pic, index) in slotProps.item.pics" :src="pic" @click="showPreviewer(index)"/>
            </div>
            <div class="footer">
              <div class="left">
                <img :src="slotProps.item.headPicName"/>
              </div>
              <div class="right">
                <div class="user-name" v-text="slotProps.item.userName"></div>
                <div class="role-name" v-text="slotProps.item.roleName"></div>
              </div>
            </div>
          </template>
        </time-axis>
      </div>
    </view-box>

    <div v-transfer-dom>
      <previewer :list="imgList" ref="previewer" :options="options"></previewer>
    </div>

  </div>
</template>
<script>
  import { ViewBox, XHeader, TransferDom, Previewer } from 'vux'
  import timeAxis from './timeAxis'
  export default {
    name: 'handle-detail',
    directives: {
      TransferDom
    },
    components: {
      ViewBox,
      XHeader,
      Previewer,
      timeAxis
    },
    data () {
      return {
        title: '处理详情',
        list: [],
        imgList: [],
        options: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index];
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect();
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      }
    },
    created () {
      this.orderId = this.$route.params.orderId
      this.getHandleDetail()
    },
    methods: {
      getHandleDetail () {
        let _this_ = this
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/order/getOrderDealList?orderId=' + _this_.orderId
        }).then(res => {
          if (res.status === 100) {
            _this_.list = res.data
            _this_.list.forEach(function (v, i) {
              if (v.pics && v.pics.length > 0) {
                v.pics.forEach(function (p) {
                  _this_.imgList.push({ src: p });
                })
              }
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      showPreviewer (index) {
        this.$refs.previewer.show(index);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.handle-detail {
  height: 100%;
  background-color: #f2f2f2;
  .handle-info {
    padding: 0 15px;
    margin-top: 10px;
    background-color: #FFFFFF;
    font-size: 12px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 5px;
      .status {
        color: #333333;
      }
      .time {
        white-space: nowrap;
        color: #AAAAAA;
      }
    }
    .info {
      font-size: 15px;
      color: #333333;
      margin-bottom: 5px;
    }
    .pics {
      display: flex;
      margin-bottom: 5px;
      img {
        width: 70px;
        height: 70px;
        &:not(:last-child) {
          margin-right: 12px;
        };
      }
    }
    .footer {
      display: flex;
      background: #F5F5F5;
      border-radius: 8px;
      .left {
        width: 40px;
        height: 40px;
        margin: 10px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .user-name {
          font-size: 15px;
          color: #333333;
          margin-bottom: 2.5px;
        }
        .role-name {
          font-size: 12px;
          color: #AAAAAA;
        }
      }
    }
    .status-highlight {
      color: #FF6648;
    }
  }
}
</style>

