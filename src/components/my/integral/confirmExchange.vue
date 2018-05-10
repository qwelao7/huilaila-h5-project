<template>
  <div class="commonHeader confirmExchange">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="确认兑换">
    </x-header>
    <div class="consignee">
      <div class="consignee_content" @click="getAddress(ownerAssetId)">
        <div class="consignee_address">
          <div class="address_name">{{address}}</div>
          <i class="address_i"></i>
        </div>
        <div class="consignee_name">
          <span class="name">{{addressList.nickName}}，</span>
          <span class="phone">{{addressList.mobileNum}}</span>
        </div>
      </div>
      <div class="consignee_a"></div>
      <div class="shop_details">
        <div class="shop_details_a">
          <div class="details_top">
            <div class="details_img">
              <img :src="informationList.picUrl" width="100%;" alt="">
            </div>
            <div class="details_right">
              <div class="details_name">{{informationList.name}}</div>
              <div class="details_num">
                <span class="details_number">{{informationList.requiredScore}}积分</span>
                <div class="by_num">
                  <x-number width="30px" v-model="shopNum" :min="0" @on-change="change"></x-number>
                </div>
              </div>
            </div>
          </div>
          <div class="details_bottom">
            按需兑换，兑完即止
          </div>
        </div>
      </div>
      <div class="submit" @click="joinUs">确认提交</div>
    </div>
    <x-dialog v-model="showCodeDialog" :hide-on-blur="false" class="bind">
      <div class="bindBanner">
        <div class="verFiled">
          <p>您还没有绑定房号</p>
        </div>
        <div class="btn">
          <span @click="bindSoon">取消</span>
          <span @click="bind">立即绑定</span>
        </div>
      </div>
    </x-dialog>
  </div>
</template>
<script>
  import { XHeader, Group, Cell, XNumber, querystring, XDialog } from 'vux'
  export default {
    name: 'confirmExchange',
    components: {
      XHeader,
      Group,
      Cell,
      XNumber,
      XDialog
    },
    data () {
      return {
        informationList: {},
        shopNum: 1,
        address: '',
        mobileNum: '',
        userName: '',
        addressList: {},
        ownerAsset: {},
        showCodeDialog: false,
        ownerAssetId: ''
      }
    },
    created () {
      this.getShopInformation();
    },
    methods: {
      getShopInformation () {
        console.log(this.$route.params.id);
        let _this = this;
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/integral/productDetail/' + this.$route.params.id
        }).then(res => {
          _this.informationList = res.data;
        }).catch(err => {
          console.log(err);
        });
        _this.$JHttp({
          method: 'get',
          headers: {
            'defCommunityId': localStorage.getItem('communityId')
          },
          url: window.baseURL + '/home/getUserInfoAndAsset'
        }).then(res => {
          console.log(res, 222222);
          _this.ownerAsset = JSON.parse(localStorage.getItem('currentReceiveAddress'));
          console.log(_this.ownerAsset, '31311313');
          if (res.data.ownerAsset === null) {
            _this.showCodeDialog = true;
          } else {
            if (_this.ownerAsset !== null) {
              _this.addressList = _this.ownerAsset;
              _this.ownerAssetId = _this.ownerAsset.ownerAssetId;
              _this.address = _this.ownerAsset.detailAddress;
              _this.mobileNum = _this.ownerAsset.mobileNum;
              _this.userName = _this.ownerAsset.nickName
            } else {
              _this.addressList = res.data;
              _this.ownerAssetId = res.data.ownerAsset.ownerAssetId;
              _this.ownerAsset = res.data.ownerAsset;
              _this.mobileNum = res.data.mobileNum;
              _this.userName = res.data.userName;
              _this.address = _this.ownerAsset.communityName + '-' + _this.ownerAsset.buildingNumber + '-' + _this.ownerAsset.unit + '-' + _this.ownerAsset.room;
            }
          }
        }).catch(err => {
          console.log(err);
        });
      },
      bindSoon () {
        this.$router.go(-1)
      },
      bind () {
        this.$router.push('/myAddress')
      },
      getAddress (id) {
        this.$router.push('/selectReceiveAddress/' + id)
      },
      change (val) {
        this.shopNum = val;
      },
      joinUs () {
        // 显示
        let this_ = this;
        let data = {
          itemNum: this.shopNum,
          requiredTotalScore: this_.informationList.requiredScore * this.shopNum,
          specId: this.$route.params.id,
          userAddress: this_.address,
          mobileNum: this_.mobileNum,
          userName: this_.userName
        };
        this_.$JHttp({
          method: 'post',
          headers: {
            'defCommunityId': localStorage.getItem('communityId')
          },
          url: window.baseURL + '/integral/productBuy?' + querystring.stringify(data)
        }).then(res => {
          console.log(res, 'ok');
          if (res.status === 100) {
            this_.$vux.toast.show({
              text: '订单提交成功'
            });
            setTimeout(function () {
              this_.$vux.toast.hide();
              this_.$router.go(-2)
            }, 500)
          } else {
            this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
            setTimeout(function () {
              this_.$vux.toast.hide();
            }, 500)
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .confirmExchange{
    background: #F2F2F2;
    width:100%;
    height:100%;
    .bindBanner{
      border-radius: 4px;
      .verFiled{
        padding: 0 19px;
        padding-top: 20px;
        .title{
          font-size: 18px;
          color: #333333;
        }
        .weui-cell{
          margin: 20px 0;
          .weui-input{
            padding: 14px 0;
          }
        }
      }
      .btn{
        border-top: 1px solid #E5E5E5;
        span{
          height: 50px;
          line-height: 50px;
        }
      }
    }
    .weui-cells:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 0!important;
      color: #d9d9d9;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .weui-cells:after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      /* height: 1px; */
      border-bottom: none!important;
      color: #d9d9d9;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .consignee{
      .consignee_content{
        background-color: #ffffff;
        padding: 15px;
        margin:0 auto;
        .consignee_address{
          display: flex;
          align-items: center;
          justify-content: space-between;
          .address_name{
            font-size: 15px;
            font-weight: 500;
            color: #333333;
            float: left;
          }
          .address_i{
            display: inline-block;
            width: 15px;
            height: 15px;
            background: url("../../../assets/images/arrow_icon_grey32.png") left center;
            background-size: cover;
            vertical-align: middle;
          }
        }
        .consignee_name{
          margin-top: 5px;
          font-size: 15px;
          font-weight: 500;
        }
        .name,.phone{
          display: inline-block;
        }
      }
      .consignee_a {
        width: 100%;
        height: 5px;
        background: url("../../../assets/images/addressline_icon.png") repeat-x;
        background-size: contain;
      }
      .shop_details{
        padding: 15px 15px 20px 15px;
        background: #ffffff;
        .shop_details_a{
          .details_top{
            display: flex;
            align-items: center;
            .details_img{
              width: 75px;
              height: 75px;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .details_right{
              flex: 1;
              margin-left: 10px;
              display: flex;
              flex-direction: column;
              .details_name{
                font-size: 15px;
                color: #333333;
              }
              .details_num{
                font-size: 15px;
                color: #0DAB60;
                font-weight: bold;
                margin-top: 13px;
                /*display: inline-block;*/
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .details_number{
                  display: inline-block;
                }
              }
              .by_num{

              }
            }
          }
          .details_bottom{
            font-size: 12px;
            color: #AAAAAA;
            margin-top: 10px;
          }
        }
      }
      .submit{
        height: 44px;
        background: #0DAB60;
        text-align: center;
        line-height: 44px;
        color: #ffffff;
        font-size: 18px;
        margin: 20px 15px 0 15px;
        border-radius: 4px;
      }
    }
  }
</style>
