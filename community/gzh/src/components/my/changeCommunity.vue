<template>
  <div class="commonHeader chooseCommunity">
    <view-box ref="viewBox" body-padding-top="3.333333rem" body-padding-bottom="0">
      <div slot="header" style="position: absolute;top: 0;left: 0;z-index: 999;width: 100%">
        <x-header
          :left-options="{backText: ''}"
          title="选择小区">
        </x-header>
        <div class="search">
          <search
            @result-click="resultClick"
            @on-change="getSearchResult"
            @on-focus="setFocus"
            @on-cancel="onCancel"
            :results="searchResultList"
            v-model="searchWords"
            placeholder="请输入小区名称"
            position="absolute"
            auto-scroll-to-top top="47px"
            ref="search"></search><!--@on-submit="onSubmit"-->
        </div>
        <div class="currentPosition">
          <span>当前定位城市</span>
          <div class="position" v-if="position">
            <i></i>
            <span>{{position}}</span>
          </div>
          <span v-if="!position" @click="rePosition">定位失败，请点击重试</span>
        </div>
      </div>
      <div class="allPosition" v-if="showAll" @click="selectAll">
        <span>全部小区</span>
      </div>
      <div class="communityList" v-show="showCommunityList">
        <!--<checker-->
        <!--v-model="all"-->
        <!--selected-item-class="selected" class="communities">-->
        <!--<checker-item-->
        <!--key="-1"-->
        <!--class="li"-->
        <!--value="全部">-->
        <!--&lt;!&ndash;@on-item-click="choose(items)"&ndash;&gt;-->
        <!--全部-->
        <!--</checker-item>-->
        <!--</checker>-->
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
              :value="items.key"
              @on-item-click="choose(items)">{{items.value}}
            </checker-item>
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
  import {mapActions} from 'vuex';
  import {initialAxios} from '../../main';
  import {XHeader, Search, Group, Checker, CheckerItem, ViewBox} from 'vux';

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
        community: this.$store.state.communityId || localStorage.getItem('communityId'),
        showChoose: false,
        position: '',
        fromPath: '',
        showAll: false,
        showCommunityList: true
      }
    },
    created () {
      this.getData()
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.fromPath = from.path;
        if (vm.fromPath === '/life/recommend' || vm.fromPath === '/life/topic' || vm.fromPath === '/life/activity' || vm.fromPath === '/life/daren' || vm.fromPath === '/life/group') {
          vm.showAll = true
        }
      })
    },
    mounted () {
      this.getCityPosition()
    },
    methods: {
      setFocus () {
        this.$refs.search.setFocus()
        this.showCommunityList = false;
      },
      onCancel () {
        this.$refs.search.setBlur()
        this.showCommunityList = true;
      },
      resultClick (item) {
        this.choose(item.other);
      },
      getSearchResult (searchWords) {
        // 搜索模块
        let _this = this;
        let resultList = [];
        let allCommunityList = _this.allCommunityList;
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
      onSubmit (value) {
        this.$refs.search.setBlur();
        console.log(value)
        this.getSearchResult(value)
      },
      getData () {
        let _this_ = this;
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
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            });
          }
        }).catch(e => {
          console.error(e)
        });
      },
      choose (item) {
        // 调用接口,切换默认房号
        let _this_ = this
        _this_.$JHttp({
          method: 'put',
          url: window.baseURL + '/community/switchCommunity/' + item.key
        }).then(res => {
          if (res.status === 100) {
            _this_.community = item.key;
            localStorage.setItem('communityName', item.value);
            localStorage.setItem('communityId', _this_.community);
            localStorage.setItem('areaCode', item.areaCode);
            localStorage.setItem('longitude', item.longitude);
            localStorage.setItem('latitude', item.latitude);
            localStorage.setItem('community_all', 0)
            // 更新头部信息
            initialAxios();
            _this_.$router.go(-1)
          }
        }).catch(e => {
          console.log(e)
        });
      },
      selectAll () {
        localStorage.setItem('community_all', 1)
        initialAxios();
        this.$router.go(-1)
      },
      getCityPosition () {
        let _this = this;
        /**
         *没有选择全部，则定位到默认小区
         */
        if (parseFloat(localStorage.getItem('community_all')) === 0) {
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
//                  console.log(111, _this.$refs.cityNameBox);
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
        }
      },
      rePosition () {
        this.getCityPosition()
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .chooseCommunity {
    height: 100%;
    background-color: #ffffff;
    .currentPosition {
      background-color: #ffffff;
      padding: 0 15px;
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 15px;
        color: #333333;
      }
      .position {
        display: flex;
        align-items: center;
        font-size: 15px;
        i {
          margin-right: 6px;
          width: 16px;
          height: 16px;
          background: url("../../assets/images/location_icon_black.png") center no-repeat / contain;
        }
      }
    }
    .allPosition {
      background-color: #ffffff;
      padding: 15px;
      padding-bottom: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 15px;
        color: #333333;
      }
    }
    .communityList {
      padding: 0 15px;
      padding-top: 15px;
      .city {
        background-color: #f2f2f2;
        font-size: 15px;
        color: #333333;
        height: 24px;
        line-height: 24px;
        padding-left: 10px;
      }
      .communities {
        display: flex;
        flex-direction: column;
        .li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 0.5px solid #D8D8D8;
          font-size: 14px;
        }
        .li:last-child {
          border-bottom: none;
        }
        .selected {
          background: url("../../assets/images/check_icon_orange32.png") right no-repeat;
          background-size: 16px 16px
        }
      }
    }
    .noContent {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 124px;
      margin-bottom: 248px;
      z-index: 999;
      img {
        width: 150px;
        height: 150px;
      }
      p {
        margin-top: 10px;
        color: #aaaaaa;
        font-size: 15px;
      }
      span {
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
