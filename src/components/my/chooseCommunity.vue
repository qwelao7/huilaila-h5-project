<template>
  <div class="commonHeader chooseCommunity">
    <view-box ref="viewBox" body-padding-top="3.333333rem" body-padding-bottom="0">
      <div slot="header" style="position: absolute;top: 0;left: 0;z-index: 999;width: 100%">
        <x-header
          slot="header"
          :left-options="{backText: ''}"
          title="选择小区">
        </x-header>
        <div class="search">
          <search
            @result-click="resultClick"
            @on-change="getSearchResult"
            :results="searchResultList"
            v-model="searchWords"
            placeholder="请输入小区名称"
            position="absolute"
            auto-scroll-to-top top="47px"
            @on-focus="setFocus"
            @on-cancel="onCancel"
            ref="search"></search>
        </div>
        <!--<div class="currentPosition">
          <span>当前定位城市</span>
          <div class="position">
            <i></i>
            <span>{{position}}</span>
          </div>
        </div>-->
        <div class="currentPosition">
          <span>当前定位城市</span>
          <div class="position" v-if="position">
            <i></i>
            <span>{{position}}</span>
          </div>
          <span v-if="!position" @click="rePosition">定位失败，请点击重试</span>
        </div>
      </div>
      <div class="communityList" v-show="showCommunityList">
        <div class="myRoom" v-if="houseList.length">
          <span class="title">我的房号</span>
          <div class="house-item vux-1px-b" v-for="house in houseList">
            <span v-text="house"></span>
          </div>
        </div>
        <div v-for="item in comList">
          <div class="city" ref="cityNameBox">
            <span>{{item.cityName}}</span>
          </div>
          <checker
            v-model="community"
            selected-item-class="selected" class="communities">
            <checker-item
              v-for="(items, index) in item.communityList"
              :key="index"
              class="li"
              :value="{id: items.key, name: items.value}"
              @on-item-click="choose">{{items.value}}</checker-item>
          </checker>
        </div>
      </div>
      <div class="noContent" v-if="!showCommunityList && !searchResultList.length">
        <img src="../../assets/images/No-content.png" alt="">
        <p>什么都没发现，去别处看看吧~</p>
      </div>
    </view-box>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import { XHeader, Search, Group, Checker, CheckerItem, ViewBox } from 'vux'
  export default {
    name: 'chooseCommunity',
    components: {
      ViewBox,
      XHeader,
      Search,
      Group,
      Checker,
      CheckerItem
    },
    data () {
      return {
        houseList: [],
        searchResultList: [],
        searchWords: '',
        comList: [],
        allCommunityList: [],
        community: {},
        showChoose: false,
        position: '',
        fromPath: '',
        showCommunityList: true
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.fromPath = from.path;
      })
    },
    created () {
      this.getMyHouseList();
      this.getData();
    },
    mounted () {
      this.getCityPosition()
    },
    methods: {
      ...mapActions({
        choose: 'updateCommunityId'
      }),
      setFocus () {
        this.$refs.search.setFocus()
        this.showCommunityList = false;
      },
      onCancel () {
        this.$refs.search.setBlur()
        this.showCommunityList = true;
      },
      resultClick (item) {
        this.choose({
          id: item.other.key,
          name: item.other.value
        });
      },
      getSearchResult (searchWords) {
        // 搜索模块
        let resultList = [];
        let allCommunityList = this.allCommunityList;
        if (allCommunityList && allCommunityList.length) {
          if (searchWords) {
            allCommunityList.forEach(function (community) {
              let value = community.value;
              if (value.includes(searchWords)) {
                resultList.push({
                  title: value,
                  other: community
                });
              }
            });
          }
        }
        this.searchResultList = resultList;
      },
      onSubmit () {
        this.$refs.search.setBlur();
        this.$vux.toast.show({
          type: 'text',
          position: 'top',
          text: 'on submit'
        })
      },
      // 获取我的房号列表
      getMyHouseList () {
        let _this_ = this;
        this.$JHttp({
          method: 'get',
          url: window.baseURL + '/home/getUserInfoAndAsset'
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            let ownerAssetList = data.ownerAssetList;
            if (ownerAssetList && ownerAssetList.length) {
              let houseList = [];
              ownerAssetList.forEach(function (house) {
                let address = '';
                address += (house.communityName + '-');
                let yuan = house.blockName;
                let zhuang = house.buildingNumber;
                let unit = house.unit;
                let room = house.room;
                if (yuan) {
                  address += (yuan + '-');
                }
                if (zhuang) {
                  address += (zhuang + '-');
                }
                if (unit) {
                  address += (unit + '-');
                }
                if (room) {
                  address += (room + '-');
                }
                let len = address.length;
                address = address.substr(0, len - 1)
                houseList.push(address);
              });
              _this_.houseList = houseList;
            }
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          console.error(e)
        });
      },
      // 获取所有小区
      getData () {
        let _this_ = this;
        let community = this.$store.state.address.community;
        if (!community) {
          community = JSON.parse(localStorage.getItem('community'))
        }
        if (community) {
          this.community = community;
        }
        this.$JHttp({
          method: 'get',
          url: window.baseURL + '/community/queryCommunityNewForCityAsTree'
        }).then(res => {
          if (res.status === 100) {
            let treeData = res.data;
            this.comList = treeData;
            if (treeData && treeData.length) {
              let treeList = [];
              treeData.forEach(function (item) {
                let subs = item.communityList;
                if (subs && subs.length) {
                  subs.forEach(function (sub) {
                    treeList.push(sub);
                  })
                }
              });
              _this_.allCommunityList = treeList;
            }
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          console.log(e)
        });
      },
      choose (val) {
        localStorage.setItem('communityId', val.id);
        localStorage.setItem('communityName', val.name);
        let address = JSON.parse(localStorage.getItem('address'));
        if (!address || !address.community || (val.id !== address.community.id)) {
          localStorage.setItem('address', JSON.stringify({
            community: val
          }));
          this.$store.commit('updateAddress', {
            community: val
          });
        }
        this.$router.push('/chooseGarden');
      },
      getCityPosition () {
        let _this = this;
        if (window.AMap) {
          setTimeout(function () {
            window.AMap.service('AMap.CitySearch', function () {
              let city = new window.AMap.CitySearch({
                city: '010'
              });
              city.getLocalCity((status, result) => {
                if (status === 'complete' && result.info === 'OK') {
                  _this.position = result.city;
                  let offsetTop;
                  _this.$refs.cityNameBox.forEach((value) => {
                    if (value.textContent === _this.position) {
                      offsetTop = value.offsetTop
                    }
                  });
                  _this.$nextTick(() => {
                    _this.$refs.viewBox.scrollTo(offsetTop - 142)
                  })
                }
              });
            })
          }, 500)
        }
      },
      rePosition () {
        this.getCityPosition()
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .chooseCommunity{
    height: 100%;
    background-color: #ffffff;
    .currentPosition{
      background-color: #ffffff;
      display: flex;
      padding: 0 15px;
      padding-top: 15px;
      justify-content: space-between;
      align-items: center;
      font-size: 15px;
      .position{
        display: flex;
        align-items: center;
        i{
          margin-right: 6px;
          width: 16px;
          height: 16px;
          background: url("../../assets/images/location_icon_black.png") center no-repeat / contain;
        }
      }
    }
    .communityList{
      padding: 0 15px;
      .myRoom {
        padding-bottom: 15px;
        .title {
          padding: 1px 10px;
          color: #869DC7;
          background-color: #F2F2F2;
        }
        .house-item {
          padding: 12px 0;
          font-size: 14px;
        }
      }
      .city{
        background-color: #f2f2f2;
        font-size: 15px;
        height: 24px;
        line-height: 24px;
        padding-left: 10px;
      }
      .communities{
        display: flex;
        flex-direction: column;
        .li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 0.5px solid #D8D8D8;
          font-size: 14px;
        }
        .li:last-child{
          border-bottom: none;
        }
        .selected{
          background: url("../../assets/images/check_icon_orange32.png") right no-repeat ;
          background-size: 16px 16px;
        }
      }
    }
    .noContent{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 124px;
      margin-bottom: 248px;
      z-index: 999;
      img{
        width: 150px;
        height: 150px;
      }
      p{
        margin-top: 10px;
        color: #aaaaaa;
        font-size: 15px;
      }
      span{
        width: 150px;
        height: 35px;
        margin-top: 20px;
        line-height: 35px;
        text-align: center;
        background-color: #0DAB60;
        color: #ffffff;
        font-size: 15px;
        border-radius: 67px;
      }
    }
  }
</style>
