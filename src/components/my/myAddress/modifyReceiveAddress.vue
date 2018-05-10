<template>
  <div class="commonHeader modifyAddress">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="修改收货地址">
      <span slot="right" style="font-size: 16px; color: #333;" @click="showDeleteReceiveAddressModal">删除地址</span>
    </x-header>
    <div class="addressOption">
      <group title="">
        <group title-color="#aaa">
          <group-title slot="title" style="color: #aaa;">收货人</group-title>
          <x-input v-model="formItem.name" :show-clear="!!formItem.name" placeholder="请输入收货人姓名"></x-input>
        </group>
      </group>
      <group title="">
        <group title-color="#aaa">
          <group-title slot="title" style="color: #aaa;">手机号</group-title>
          <x-input v-model="formItem.phoneNum" type="tel" :show-clear="!!formItem.phoneNum" placeholder="请输入收货人手机号"></x-input>
        </group>
      </group>
      <group title="">
        <group title-color="#aaa">
          <group-title slot="title" style="color: #aaa;">省、市、区</group-title>
          <div class="placeholder" v-show="!formItem.area" @click="chooseAddress" style="color: #aaa; padding: 10px 15px;font-size: 16px;">请选择省、市、区</div>
          <div v-text="formItem.area" v-show="formItem.area" @click="chooseAddress" style="padding: 10px 15px;"></div>
          <div v-if="cityPickerReady">
            <city-picker ref="picker" @select="chooseCity" :data="cityData" :selected-index="selectedIndex" :cancel-txt="cancelText" :confirm-txt="confirmText"></city-picker>
          </div>
        </group>
      </group>
      <group class="lastGroup">
        <x-textarea v-model="formItem.address" placeholder="请输入详细地址"></x-textarea>
      </group>
      <div class="submit"><x-button type="primary" action-type="button" @click.native="saveAddress">保存</x-button></div>
      <!--删除收货地址dialog begin-->
      <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
        <span class="delete-info vux-1px-b">确定要删除该地址吗?</span>
        <div class="operate-wrapper">
          <span class="text vux-1px-r" @click="deleteModalShow = false">取消</span>
          <span class="text" @click="deleteReceiveAddress">确定</span>
        </div>
      </x-dialog>
      <!--删除收货地址dialog end-->
    </div>
  </div>
</template>
<script>
  import { XHeader, Group, GroupTitle, XInput, XTextarea, XButton, querystring, XDialog } from 'vux';
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
      XDialog,
      'city-picker': CityPicker
    },
    data () {
      return {
        formItem: {
          addressId: '',
          name: '',
          phoneNum: '',
          areaId: '',
          area: '',
          address: ''
        },
        cityData: [],
        cityPickerReady: false,
        selectedIndex: [0, 0, 0],
        cancelText: '取消',
        confirmText: '完成',
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 0 0 0',
          borderRadius: '20px'
        }
      }
    },
    created () {
      this.cityData = [provinceList, cityList, areaList];
      this.getReceiveAddressData();
    },
    methods: {
      getReceiveAddressData () {
        let addressId = this.$route.params.addressId;
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/shippingAddress/getShippingAddress?addrId=' + addressId
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            _this_.formItem = {
              addressId: data.addrId,
              name: data.receiveUser,
              phoneNum: data.phone,
              areaId: data.areaId,
              area: data.areaAddr,
              address: data.detailAddr
            }
            let areaId = data.areaId;
            let cityId, provinceId;
            let areas, areaItem, citys, cityItem, province;
            let cityIndex = 0;
            let provinceIndex = 0;
            let areaIndex = 0;
            /* eslint-disable no-labels */
            outer:
            for (let areaKey in areaList) {
              areas = areaList[areaKey];
              for (let i = 0; i < areas.length; i++) {
                areaItem = areas[i];
                if (areaItem.value === areaId) {
                  areaIndex = i;
                  cityId = areaKey;
                  for (let cityKey in cityList) {
                    citys = cityList[cityKey];
                    for (let j = 0; j < citys.length; j++) {
                      cityItem = citys[j];
                      if (cityItem.value === cityId) {
                        cityIndex = j;
                        provinceId = cityKey;
                        for (let provinceKey in provinceList) {
                          province = provinceList[provinceKey];
                          if (province.value === provinceId) {
                            break outer;
                          }
                          provinceIndex++;
                        }
                      }
                    }
                  }
                }
              }
            }
//            _this_.selectedIndex = [provinceIndex, cityIndex, areaIndex];
            _this_.selectedIndex = [0, 0, 0];
            _this_.cityPickerReady = true;
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      chooseAddress () {
        this.$refs.picker.show();
      },
      chooseCity (data) {
        let provinceList = this.cityData[0];
        let cityList = this.cityData[1];
        let areaList = this.cityData[2];
        let provinceIndex = data[0];
        let province = provinceList[provinceIndex].text;
        let provinceValue = provinceList[provinceIndex].value;
        let cityIndex = data[1];
        let city = cityList[provinceValue][cityIndex].text;
        let cityValue = cityList[provinceValue][cityIndex].value;
        let areaIndex = data[2];
        let area = areaList[cityValue][areaIndex].text;
        let areaValue = areaList[cityValue][areaIndex].value;
        this.formItem.area = province + city + area;
        this.formItem.areaId = areaValue;
      },
      saveAddress () {
        let form = this.formItem;
        let addressForm = {
          addressId: form.addressId,
          name: form.name,
          phone: form.phoneNum,
          areaId: form.areaId,
          areaAddress: form.area,
          houseAddress: form.address
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
      showDeleteReceiveAddressModal () {
        this.deleteModalShow = true;
      },
      deleteReceiveAddress () {
        let _this_ = this;
        let addressId = this.formItem.addressId;
        _this_.$JHttp({
          url: window.baseURL + '/shippingAddress/removeReceiveAddr?addressId=' + addressId,
          method: 'delete'
        }).then(res => {
          if (res.status === 100) {
            _this_.$vux.toast.show({
              type: 'success',
              text: '删除成功!'
            })
            _this_.$router.go(-1);
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.error(e);
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .modifyAddress{
    .vux-header .vux-header-right a{
      font-size: 15px;
      color: #333333;
    }
    .submit{
      padding: 0 15px;
      button{
        background-color: #0DAB60;
      }
    }
    .delete-wrapper {
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
  }

</style>

