<template>
  <div class="after-service-apply commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="form-preview info">
        <div class="form-preview-item">
          <label class="form-preview-label">申请时间：</label>
          <span class="form-preview-value" v-text="intime"></span>
        </div>
        <div class="form-preview-item">
          <label class="form-preview-label">订单号：</label>
          <span class="form-preview-value" v-text="orderSerialNumber"></span>
        </div>
        <div class="form-preview-item">
          <label class="form-preview-label">申请单号：</label>
          <span class="form-preview-value" v-text="serialNumber"></span>
        </div>
      </div>

      <span v-if="type === 1">
        <div class="form-preview info">
          <div class="form-preview-item">
            <label class="form-preview-label">门店名称：</label>
            <span class="form-preview-value" v-text="storeName"></span>
          </div>
        </div>

        <div class="form-preview info">
          <div class="form-preview-item">
            <label class="form-preview-label">取消原因：</label>
            <span class="form-preview-value" v-text="reason"></span>
          </div>
          <div class="form-preview-item explains" v-if="explains">
            <label class="form-preview-label">取消说明：</label>
            <span class="form-preview-value" v-text="explains"></span>
          </div>
        </div>
      </span>

      <span v-if="type === 2">

        <div class="product-list-wrapper">
          <product-list :productList="productList" :isClick="false"></product-list>
        </div>

        <div class="form-preview info">
          <div class="form-preview-item reson">
            <label class="form-preview-label">售后原因：</label>
            <span class="form-preview-value" v-text="reason"></span>
          </div>
          <span class="top-line" v-if="explains || pics.length > 0">
            <div class="form-preview-item explains" v-if="explains">
              <label class="form-preview-label">售后说明：</label>
              <span class="form-preview-value" v-text="explains"></span>
            </div>
            <div class="pics" v-if="pics.length > 0">
              <img class="previewer-demo-img" v-for="(pic, index) in pics" :src="pic" @click="showPreviewer(index)">
            </div>
          </span>
        </div>
      </span>

      <div class="info" v-if="type === 2 && expressNo.length > 0" v-for="item in list" @click="clickItem(item)">
        <logistics-item :item=item></logistics-item>
      </div>

      <div class="button" v-if="stage === 1" @click="cancelApply">取消申请</div>
      <div class="button" v-if="stage === 2 && type === 2 && expressNo.length < 1" @click="logisticsForm">填写物流</div>

      <x-dialog class="cancel-apply-wrapper" v-model="cancelApplyModalShow" :dialog-style="cancelApplyDialogStyle" hide-on-blur>
        <span class="delete-info vux-1px-b">是否取消售后申请?</span>
        <div class="operate-wrapper">
          <span class="text vux-1px-r" @click="cancelApplyModalShow = false">否</span>
          <span class="text" @click="select">是</span>
        </div>
      </x-dialog>

    </view-box>

    <div v-transfer-dom>
      <previewer :list="imgList" ref="previewer" :options="options"></previewer>
    </div>

  </div>
</template>
<script>
  import { ViewBox, XHeader, XDialog, TransferDom, Previewer } from 'vux'
  import productList from '../../productList'
  import logisticsItem from '../logisticsItem'
  export default {
    name: 'after-service-apply',
    directives: {
      TransferDom
    },
    components: {
      ViewBox,
      XHeader,
      XDialog,
      productList,
      logisticsItem,
      Previewer
    },
    data () {
      return {
        title: '申请单',
        cancelApplyModalShow: false,
        cancelApplyDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 0 0 0',
          borderRadius: '20px'
        },
        stage: 0,
        type: 0,
        expressNo: '',
        orderServiceId: '',
        intime: '',
        orderSerialNumber: '',
        serialNumber: '',
        storeName: '',
        reason: '',
        explains: '',
        productList: [],
        pics: [],
        expressAddr: '',
        expressReceiveUser: '',
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
      let _this_ = this
      _this_.orderServiceId = _this_.$route.query.orderServiceId
      _this_.$JHttp({
        method: 'get',
        url: window.baseURL + '/afterSales/submitAfterSalesDetail/' + _this_.orderServiceId
      }).then(res => {
        if (res.status === 100) {
          _this_.type = res.data.type
          _this_.stage = res.data.stage
          _this_.intime = res.data.intime
          _this_.orderSerialNumber = res.data.orderSerialNumber
          _this_.serialNumber = res.data.serialNumber
          _this_.storeName = res.data.storeName
          _this_.reason = res.data.reason
          _this_.explains = res.data.explains
          _this_.productList = [res.data.product]
          _this_.pics = res.data.pics
          _this_.pics.forEach(function (v, i) {
            _this_.imgList.push({ src: v });
          })
          _this_.expressAddr = res.data.expressAddr
          _this_.expressReceiveUser = res.data.expressReceiveUser
          _this_.expressNo = res.data.expressNo
          _this_.list = [{
            'orderId': res.data.orderId,
            'status': res.data.expressContent ? 1 : 0,
            'productItemName': res.data.product.itemName,
            'expNo': res.data.expressNo,
            'expCode': res.data.expressCode,
            'expTime': res.data.expressTime,
            'expMark': res.data.expressContent || '物流信息获取中，请耐心等待...'
          }]
        }
      }).catch(e => {
        console.log(e)
      });
    },
    methods: {
      cancelApply () {
        this.cancelApplyModalShow = true
      },
      select () {
        this.cancelApplyModalShow = false
        let _this_ = this
        _this_.$JHttp({
          method: 'put',
          url: window.baseURL + '/afterSales/cancelAfterSalesSubmit',
          params: {
            id: _this_.orderServiceId
          }
        }).then(res => {
          if (res.status === 100) {
            _this_.$vux.toast.show({
              type: 'success',
              text: '取消成功'
            })
            _this_.$router.go(-1)
          }
        }).catch(e => {
          console.log(e)
        });
      },
      clickItem (item) {
        if (item.status === 0) {
          this.$vux.toast.show({
            type: 'text',
            text: item.expMark
          })
        } else {
          this.$router.push({ path: '/logisticsDetail', query: { orderId: item.orderId, expCode: item.expCode, expNum: item.expNo, productName: item.productItemName } })
        }
      },
      logisticsForm () {
        this.$router.push({ path: '/logisticsForm', query: { orderServiceId: this.orderServiceId, expressAddr: this.expressAddr, expressReceiveUser: this.expressReceiveUser } })
      },
      showPreviewer (index) {
        this.$refs.previewer.show(index);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.after-service-apply {
  height: 100%;
  background-color: #f2f2f2;
  .cancel-apply-wrapper {
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
  .product-list-wrapper {
    background-color: #FFFFFF;
    padding: 0 15px;
    margin-top: 10px;
    /deep/ .product-item {
      border-top: none;
    }
  }
  .form-preview {
    position: relative;
    background-color: #ffffff;
    line-height: 21px;
    font-size: 15px;
    color: #333333;
    padding: 15px;
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
        word-break: normal;
        word-wrap: break-word;
      }
    }
  }
  .info {
    margin-top: 10px;
    background-color: #FFFFFF;
    .top-line {
      border-top: 0.5px solid #D8D8D8;
      margin-top: 10px;
    }
    .reson {
      margin-bottom: 0 !important;
    }
    .explains {
      margin-bottom: 0 !important;
      padding-top: 10px;
    }
    .pics {
      display: flex;
      /*justify-content: space-between;*/
      padding-top: 15px;
      overflow: hidden;
      img {
        width: 70px;
        height: 70px;
        &:not(:last-child) {
          margin-right: 21.5px;
        }
      }
    }
  }
  .button {
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #FFFFFF;
    background: #FF6648;
  }
  .button-double {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #FFFFFF;
    text-align: center;
    .button-double-item {
      width: 50%;
    }
    .button-double-cancel {
      background: #AAAAAA;
    }
    .button-double-pay {
      background: #FF6648;
    }
  }
}
</style>

