<template>
  <div class="commonHeader modifyAddress">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="新增收货地址">
    </x-header>
    <div class="addressOption">
      <group title="">
        <group title-color="#aaa">
          <group-title slot="title" style="color: #aaa;">收货人</group-title>
          <x-input v-model="formItem.name" :show-clear="!!formItem.name" placeholder="请输入收货人姓名" :max="10" :min="2"></x-input>
        </group>
      </group>
      <group title="">
        <group title-color="#aaa">
          <group-title slot="title" style="color: #aaa;">手机号</group-title>
          <x-input v-model="formItem.phoneNum" :max="11" type="tel" :show-clear="!!formItem.phoneNum" placeholder="请输入收货人手机号"></x-input>
        </group>
      </group>
      <group title="">
        <group title-color="#aaa">
          <group-title slot="title" style="color: #aaa;">省、市、区</group-title>
          <div class="placeholder" v-show="!formItem.area" @click="chooseAddress"
               style="color: #aaa; padding: 10px 15px;font-size: 16px;">请选择省、市、区
          </div>
          <div v-text="formItem.area" v-show="formItem.area" @click="chooseAddress" style="padding: 10px 15px;"></div>
          <city-picker ref="picker" @select="chooseCity" :data="cityData" :selected-index="selectedIndex"
                       :cancel-txt="cancelText" :confirm-txt="confirmText"></city-picker>
        </group>
      </group>
      <group class="lastGroup">
        <x-input v-model="formItem.address" ref="detailAddressInput" @on-change="searchPlace"
                 @on-blur="hideSearchResult"
                 @on-focus="openSearch" placeholder="请输入详细地址" :min="5" :max="150"></x-input>
        <div class="search-result-wrapper" v-show="isShowSearResult">
          <div class="search-item vux-1px-b" v-for="(searchItem, index) in searchResultList" :key="index"
               @click="chooseDetailAddress(searchItem)">
            <div class="left"><span class="icon"></span></div>
            <div class="right">
              <span class="top" v-text="searchItem.name"></span>
              <span class="bottom" v-text="searchItem.address"></span>
            </div>
          </div>
        </div>
      </group>
      <div class="submit">
        <x-button type="primary" action-type="button" @click.native="saveAddress">保存</x-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {XHeader, Group, GroupTitle, XInput, XTextarea, XButton, querystring} from 'vux';
  import CityPicker from 'components/common/cityPicker';
  import {provinceList, cityList, areaList} from '../../../assets/json/areaData';

  export default {
    name: 'modifyAddress',
    components: {
      XHeader,
      Group,
      GroupTitle,
      XInput,
      XTextarea,
      XButton,
      'city-picker': CityPicker
    },
    data () {
      return {
        formItem: {
          name: '',
          phoneNum: '',
          areaId: '',
          area: '',
          address: '',
          lat: '',
          lng: '',
          areaCode: ''
        },
        isShowSearResult: false,
        isNeedSearch: true,
        provinceName: '',
        cityName: '',
        cityData: [],
        selectedIndex: [0, 0, 0],
        searchResultList: [],
        cancelText: '取消',
        confirmText: '完成'
      }
    },
    created () {
      this.cityData = [provinceList, cityList, areaList];
    },
    methods: {
      chooseAddress () {
        this.$refs.picker.show();
      },
      chooseCity (data) {
        let provinceList = this.cityData[0];
        let cityList = this.cityData[1];
        let areaList = this.cityData[2];
        let provinceIndex = data[0];
        let province = provinceList[provinceIndex].text;
        this.provinceName = province;
        let provinceValue = provinceList[provinceIndex].value;
        let cityIndex = data[1];
        let city = cityList[provinceValue][cityIndex].text;
        this.cityName = city;
        let cityValue = cityList[provinceValue][cityIndex].value;
        let areaIndex = data[2];
        let area = areaList[cityValue][areaIndex].text;
        let areaValue = areaList[cityValue][areaIndex].value;
        this.formItem.area = province + city + area;
        this.formItem.areaId = areaValue;
        let _this_ = this;
        let cityParam = '';
        if (province.indexOf('市') !== -1) {
          cityParam = province;
        } else if (city) {
          cityParam = city;
        }
        this.formItem.address = '';
        this.isShowSearResult = false;
        this.isNeedSearch = false;
        let params = {
          key: '633e91beb360db909e0e9f13c0a15338',
          city: cityParam,
          citylimit: true,
          extensions: 'all',
          keywords: area,
          offset: 1
        }
        _this_.$JHttp({
          method: 'get',
          url: window.GDURL + '/v3/place/text?' + querystring.stringify(params),
          headers: undefined
        }).then(res => {
          if (res.status === '1') {
            let poisList = res.pois;
            if (poisList && poisList.length) {
              let address = poisList[0];
              let location = address.location;
              let locations = location.split(',');
              this.formItem.lat = locations[1];
              this.formItem.lng = locations[0];
              this.formItem.areaCode = address.adcode;
            }
          }
        }).catch(e => {
          console.log(e)
        })
      },
      chooseDetailAddress (address) {
        this.formItem.address = address.name;
        let location = address.location;
        let locations = location.split(',');
        this.formItem.lat = locations[1];
        this.formItem.lng = locations[0];
        this.formItem.areaCode = address.adcode;
        this.isShowSearResult = false;
        this.isNeedSearch = false;
      },
      hideSearchResult () {
        this.isShowSearResult = false;
      },
      openSearch () {
        // 没有选择省市区
        if (!this.formItem.areaId) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请先选择省市区'
          });
          this.formItem.address = '';
          this.isShowSearResult = false;
          this.$refs.detailAddressInput.blur();
          return;
        }
        this.isNeedSearch = true;
      },
      searchPlace (keywords) {
        if (this.isNeedSearch && keywords) {
          let provinceName = this.provinceName;
          let cityName = this.cityName;
          let city = '';
          if (provinceName.indexOf('市') !== -1) {
            city = provinceName;
          } else if (cityName) {
            city = cityName;
          }
          let params = {
            key: '633e91beb360db909e0e9f13c0a15338',
            city: city,
            citylimit: true,
            extensions: 'all',
            keywords: keywords
          }
          let _this_ = this;
          _this_.$JHttp({
            method: 'get',
            url: window.GDURL + '/v3/place/text?' + querystring.stringify(params),
            headers: undefined
          }).then(res => {
            if (res.status === '1') {
              let poisList = res.pois;
              if (poisList && poisList.length) {
                _this_.isShowSearResult = true;
                _this_.searchResultList = res.pois;
              } else {
                _this_.searchResultList = [];
                _this_.isShowSearResult = false;
              }
            } else {
              _this_.searchResultList = [];
              _this_.isShowSearResult = false;
            }
          }).catch(e => {
            console.log(e)
          })
        }
      },
      saveAddress () {
        let form = this.formItem;
        console.log(this.getStrLen(form.name))
        if (!form.name) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入收货人姓名!'
          });
          return;
        }
        if (this.getStrLen(form.name) < 2 || this.getStrLen(form.name) > 12) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入2-10位收货人姓名!'
          });
          return;
        }
        if (!window.commonConfig.phoneRegp.test(form.phoneNum)) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入有效手机号!'
          });
          return;
        }
        if (!form.areaId) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请选择省市区!'
          });
          return;
        }
        if (!form.address) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入详细地址!'
          });
          return;
        }
        if (this.getStrLen(form.address) < 5 || this.getStrLen(form.address) > 150) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入5-150字详细地址!'
          });
          return;
        }
        let addressForm = {
          name: form.name,
          phone: form.phoneNum,
          areaId: form.areaId,
          areaAddress: form.area,
          houseAddress: form.address,
          areaCode: form.areaCode,
          latitude: form.lat,
          longitude: form.lng
        };
        this.$JHttp({
          url: window.baseURL + '/shippingAddress/updateReceiveAddr?' + querystring.stringify(addressForm),
          method: 'post'
        }).then(res => {
          if (res.status === 100) {
            this.$router.go(-1);
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.error(e);
        });
      },
      // 获得字符串实际长度，中文2，英文1
      getStrLen (str) {
        if (str === null) return 0
        if (typeof str !== 'string') {
          str += ''
        }
        return str.replace(/[^\x00-\xff]/g, '01').length
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .modifyAddress {
    .vux-header .vux-header-right a {
      font-size: 15px;
      color: #333333;
    }
    .submit {
      margin-top: 210px;
      padding: 0 15px;
      button {
        background-color: #0DAB60;
      }
    }
    .search-result-wrapper {
      /*position: absolute;*/
      top: 89px;
      width: 100%;
      height: 216px;
      overflow-y: auto;
      background-color: #F5F5F5;
      .search-item {
        margin: 0 15px;
        height: 72px;
        display: flex;
        align-items: center;
        .left {
          .icon {
            display: inline-block;
            width: 24px;
            height: 24px;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url("../../../assets/images/address_icon_32black.png");
          }
          margin-right: 6px;
        }
        .right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .top {
            line-height: 25px;
            font-size: 18px;
          }
          .bottom {
            line-height: 17px;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

</style>
