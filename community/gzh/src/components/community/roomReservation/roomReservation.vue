<template>
  <div class="room-reservation commonHeader">

    <view-box body-padding-top="1.253333rem" body-padding-bottom="0">

      <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100" slot="header" :left-options="{ backText: '' }" :title=title></x-header>

      <div class="wrapper">
        <div class="banner"></div>
        <div class="label">联系人</div>
        <div class="info">
          <b class="name" v-text="name"></b>
          <b v-text="phone"></b>
        </div>
        <div class="service-time" @click="popupPicker = true">
          <div class="left" :class="{ 'placeholder': serviceTime.length === 0 }" v-text="serviceTime.length ? serviceTime[0] + ' ' + serviceTime[1] : '服务时间'"></div>
          <div class="right-arrow"></div>
        </div>
        <div>驾车来访(选填)</div>
        <x-input class="input" v-model="remark" placeholder="请输入车牌号后三位" :max="3"></x-input>
        <div class="button-submit" @click="submit">确认提交</div>
      </div>

      <div>
        <popup-picker :show-cell="false" :show.sync="popupPicker" :columns="2" popup-title="请选择" :data="timeData" v-model="serviceTime">
        </popup-picker>
      </div>

    </view-box>

  </div>
</template>
<script>
  import { ViewBox, XHeader, PopupPicker, XInput } from 'vux'
  export default {
    name: 'room-reservation',
    components: {
      ViewBox,
      XHeader,
      PopupPicker,
      XInput
    },
    data () {
      return {
        title: '看房预约',
        subCode: 0,
        subCommunityId: '',
        name: '',
        phone: '',
        serviceTime: [],
        remark: '',
        popupPicker: false,
        timeData: []
      }
    },
    created () {
      this.subCode = this.$route.query.subCode
      this.subCommunityId = this.$route.query.subCommunityId
      this.getPersonalInfo()
      this.getServerTime()
    },
    methods: {
      getPersonalInfo () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'GET',
          url: window.baseURL + '/home/getUserInfoAndAsset'
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            _this_.name = res.data.userName || res.data.nickName
            _this_.phone = res.data.mobileNum.substr(0, 3) + '****' + res.data.mobileNum.substr(res.data.mobileNum.length - 4)
          } else {
            _this_.$vux.toast.show({
              type: 'error',
              text: res.msg
            });
          }
        }).catch(error => {
          console.error(error);
        })
      },
      getServerTime () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'GET',
          url: window.baseURL + '/server/serverTime/' + _this_.subCommunityId
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            let data = res.data;
            let arr = []
            _this_.timeToday = []
            _this_.timeTomorrow = []
            data.days.forEach(d => {
              let obj = {
                name: d,
                value: d,
                parent: 0
              }
              arr.push(obj)
              // 本日取timeZero, 明日及以后日期取timeNormal
              if (new Date(d).toDateString() === new Date().toDateString()) {
                data.timeZero.forEach(t => {
                  let obj1 = {
                    name: t,
                    value: t,
                    parent: d
                  }
                  _this_.timeToday.push(obj1)
                })
              } else {
                data.timeNormal.forEach(t => {
                  let obj2 = {
                    name: t,
                    value: t,
                    parent: d
                  }
                  _this_.timeTomorrow.push(obj2)
                })
              }
            })
            _this_.timeData = _this_.timeData.concat(arr)
            _this_.timeData = _this_.timeData.concat(_this_.timeToday)
            _this_.timeData = _this_.timeData.concat(_this_.timeTomorrow)
          } else {
            _this_.$vux.toast.show({
              type: 'error',
              text: res.msg
            });
          }
        }).catch(error => {
          console.error(error);
        })
      },
      submit () {
        if (this.serviceTime.length === 0) {
          this.$vux.toast.show({
            type: 'text',
            text: '请选择服务时间'
          })
          return
        }
        let _this_ = this
        let communityId = localStorage.getItem('communityId')
        _this_.$JHttp({
          method: 'POST',
          url: window.baseURL + '/order/insertOrderInfo',
          params: {
            communityId: communityId,
            moneyType: 0,
            sourceType: 6,
            orderDate: _this_.serviceTime[0],
            orderTime: _this_.serviceTime[1],
            orderRemark: _this_.remark,
            subCode: _this_.subCode,
            subCommunityId: _this_.subCommunityId
          }
        }).then(res => {
          if (res.status === 100) {
            _this_.$router.push('/roomReservationResult')
          } else {
            _this_.$vux.toast.show({
              type: 'text',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
.room-reservation {
  .wrapper {
    margin: 10px 15px 0 15px;
    font-size: 15px;
    color: #333333;
    .banner {
      width: 345px;
      height: 80px;
      margin-bottom: 25px;
      background-image: url("../../../assets/images/reservation.png");
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
    }
    .label {
      color: #AAAAAA;
      margin-bottom: 4.5px;
    }
    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 21px;
      font-size: 21px;
      padding-bottom: 15px;
      margin-bottom: 41px;
      border-bottom: 1px solid #D8D8D8;
      .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .service-time {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 21px;
      padding-bottom: 15px;
      margin-bottom: 20px;
      border-bottom: 1px solid #D8D8D8;
      .placeholder {
        color: #AAAAAA;
      }
      .left {
        width: 100%;
      }
      .right-arrow {
        width: 7px;
        height: 15px;
        background-image: url("../../../assets/images/arrow_icon_grey.png");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
    }
    .button-submit {
      color: #FFFFFF;
      text-align: center;
      height: 44px;
      line-height: 44px;
      background: #0DAB60;
    }
    /deep/ .input {
      font-size: 21px;
      width: 100%;
      padding: 0 0 10px 0;
      margin-bottom: 20px;
      border: none;
      border-bottom: 1px solid #D8D8D8;
      .weui-icon-clear {
        vertical-align: -0.027rem;
      }
      &:before {
        display: none;
      }
    }
  }
}
</style>
