<template>
  <div class="after-service-list commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="content-warpper">
        <j-pull :refreshFunc="refreshData" :loadMoreFunc="loadMore">
          <div slot="jpull-list">
            <div class="list">
              <div class="item" v-for="item in list" @click="clickItem(item)">
                <div class="after-service-content">
                  <div class="left">
                    <div class="form-preview">
                      <div class="form-preview-item">
                        <label class="form-preview-label">申请时间：</label>
                        <span class="form-preview-value" v-text="item.intime"></span>
                      </div>
                      <div class="form-preview-item">
                        <label class="form-preview-label">订单号：</label>
                        <span class="form-preview-value" v-text="item.orderSerialNumber"></span>
                      </div>
                      <div class="form-preview-item">
                        <label class="form-preview-label">申请单号：</label>
                        <span class="form-preview-value" v-text="item.serialNumber"></span>
                      </div>
                      <div class="form-preview-item">
                        <label class="form-preview-label" v-text="item.productList ? '售后商品：' : '门店名称：'"></label>
                        <span class="form-preview-value" v-text="item.productList ? item.productList : item.storeName"></span>
                      </div>
                    </div>
                  </div>
                  <div class="right">
                    <span class="stage" v-text="stage[item.stage]"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </j-pull>
      </div>

    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader } from 'vux'
  import JPull from 'components/base/JPull/JPull'
  export default {
    name: 'after-service-list',
    components: {
      ViewBox,
      XHeader,
      JPull
    },
    data () {
      return {
        title: '售后记录',
        stage: ['', '等待受理', '寄回商品', '客服收货', '等待退款', '完成退款', '已经取消', '已经关闭'],
        orderId: '',
        curPage: 1,
        pageSize: 20,
        list: []
      }
    },
    created () {
      this.orderId = this.$route.query.orderId
      this.getData()
    },
    methods: {
      getData (loaded) {
        let _this_ = this
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/afterSales/afterSalesDetailsList?orderId=' + _this_.orderId + '&curPage=' + _this_.curPage + '&pageSize=' + _this_.pageSize
        }).then(res => {
          if (res.status === 100) {
            if (_this_.curPage === 1) {
              _this_.list = res.data.resultList
            } else {
              _this_.list = _this_.list.concat(res.data.resultList)
            }
            if (loaded) {
              loaded(res.data.pageResult.hasMore)
            }
          }
        }).catch(e => {
          console.log(e)
        });
      },
      refreshData (loaded) {
        this.curPage = 1
        this.getData(loaded);
      },
      loadMore (loaded) {
        this.curPage++
        this.getData(loaded)
      },
      clickItem (item) {
        this.$router.push('/afterServiceDetail?orderServiceId=' + item.orderServiceId)
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.after-service-list {
  height: 100%;
  background-color: #f2f2f2;
  .content-warpper {  
    height: 100%;
    background-color: #f2f2f2;
    .list {
      .item {
        background-color: #FFFFFF;
        padding: 0 15px;
        margin-top: 10px;
        .after-service-content {
          padding: 15px 0;
          display: flex;
          align-items: center;
          .left {
            flex: 1;
            .form-preview {
              line-height: 21px;
              font-size: 15px;
              color: #333333;
              .form-preview-item {
                overflow: hidden;
                &:not(:last-child) {
                  margin-bottom: 10px;
                }
                .form-preview-label {
                  float: left;
                  min-width: 76px;
                  /*text-align: right;*/
                  text-align-last: justify;
                }
                .form-preview-value {
                  display: block;
                  overflow: hidden;
                  max-width: 200px;
  /*                word-break: normal;
                  word-wrap: break-word;*/
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
          .right {
            min-width: 63px;
            width: 63px;
            height: 55px;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-image: url('../../../../assets/images/aftersale_icon_frame@2x.png');
            .stage {
              line-height: 16.5px;
              padding: 11px 14px 11px 24px;
              font-size: 12px;
              color: #333333;
            }
          }
        }
      }
    }
  }
}
</style>
