<template>
  <div id="app" ref='wrapper'>
    <ul class='cardlist' :class="{'newBottpm':isIos_11,'oldBottpm':!isIos_11}">
      <li v-for='item in pageList' :key='item.index' @click='pageJump(item.skipData,item.skipType)'>  <!---->
        <component :is="item.componentName" :data='item' :userId='userId' :token='token'></component>
      </li>
    </ul>
  </div>
</template>

<script>
  import qs from 'qs';
  import './assets/css/common.css';
  import {formatDate} from './common/date.js';
  import {getCardType} from './common/cardType';

  export default {
    name: 'app',
    data () {
      return {
        cardList: [],
        pageList: [],
        hasMore: true,
        curPage: 1,
        cardHeight: 0,
        ajaxTime: '',
        userId: '',
        token: '',
        isIos_11: false
      };
    },
    created () {
      var agent = navigator.userAgent.toLowerCase();
      var version;
      if (agent.indexOf('like mac os x') > 0) {
        var reg = /os [\d._]*/gi;
        var verinfo = agent.match(reg);
        version = (verinfo + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.');
        if (version.toString().indexOf('.') > -1) {
          version = version.toString().split('.')[0];
        }
        if (version >= 11) {
          this.isIos_11 = true;
        }
      }
      // this.getCardList();
      this.loadMore();
      window.addEventListener('message', function (e) {
        var jumpData = e.data;
        var newSkipData = {};
        if (jumpData.code === 1029) {
          newSkipData.detailId = '';
          newSkipData.pageId = '40000';
          newSkipData.url = jumpData.url;
          newSkipData.pageType = 4;
          newSkipData.h5NeedAuthorize = 0;
        } else if (jumpData.code === 1025) {
          newSkipData.detailId = jumpData.detailId;
          newSkipData.pageId = '20000';
          newSkipData.url = '';
          newSkipData.pageType = 1;
          newSkipData.h5NeedAuthorize = 0;
        } else if (jumpData.code === 1026) {
          newSkipData.detailId = '';
          newSkipData.pageId = '30022';
          newSkipData.url = '';
          newSkipData.pageType = 1;
          newSkipData.h5NeedAuthorize = 0;
        } else if (jumpData.code === 1027) {
          newSkipData.detailId = jumpData.detailId;
          newSkipData.pageId = '20029';
          newSkipData.url = '';
          newSkipData.pageType = 1;
          newSkipData.h5NeedAuthorize = 0;
        } else if (jumpData.code === 1028) {
          newSkipData.detailId = '';
          newSkipData.pageId = '20028';
          newSkipData.url = '';
          newSkipData.pageType = 1;
          newSkipData.h5NeedAuthorize = 0;
        }
        if (window.WebViewJavascriptBridge) {
          // alert('我要跳转了');
          window.WebViewJavascriptBridge.callHandler('_app_page_jump', JSON.stringify(newSkipData));
        } else {
          // alert('页面跳转调用失败');
        }
      }, false);
    },
    mounted () {
      window.onresize = () => {
        return (() => {
          let clientWidth = document.body.clientWidth;
          document.documentElement.style.fontSize = clientWidth / 10 + 'px';
        })();
      };
    },
    updated () {
      this.cardHeight = this.$refs.wrapper.clientHeight;
      this.setWebHeight(this.cardHeight, this.hasMore, this.curPage, this.ajaxTime);
    },
    methods: {
      getCardList: function (pageIndex) {
        let _this_ = this;
        let postData = {
          province: window.commonConfig.province,
          city: window.commonConfig.city,
          area: window.commonConfig.area,
          curPage: pageIndex || 1,
          pageSize: 100
        };
        let postDataStr = qs.stringify(postData);
        this.ajaxTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
        _this_.$JHttp.get(window.homeURL + '/card/home?' + postDataStr).then((res) => {
          if (res.data.status === 100) {
            let data = res.data.data;
            let tmpData = data.resultList;
            let dataList = [];
            if (tmpData && tmpData.length) {
              tmpData.forEach(function (item) {
              if (item.cardDetailType !== 1) {dataList.push(item);}});
            }
            if (dataList && dataList.length) {
              _this_.ajaxTime = dataList[0].requestTime;
              _this_.cardList = _this_.chunk(dataList, 10);
              _this_.pageList = _this_.getNewList(_this_.cardList[0]);
              _this_.hasMore = _this_.cardList.length > 1;
            } else {
              _this_.hasMore = false;
              _this_.setWebHeight(0, _this_.hasMore, _this_.curPage, _this_.ajaxTime);
            }
          } else {
            _this_.hasMore = false;
            _this_.setWebHeight(0, _this_.hasMore, _this_.curPage, _this_.ajaxTime);
          }
        }).catch(function (response) {
          _this_.setWebHeight(0, false, _this_.curPage, _this_.ajaxTime);
        });
      },
      setWebHeight: function (height, hasMore, currentIndex, postTime) {
        if (window.WebViewJavascriptBridge) {
          window.WebViewJavascriptBridge.callHandler('_app_home_h5_card', {
            totalHeight: height,
            hasNext: hasMore,
            currentIndex: currentIndex,
            postTime: postTime
          });
        } else {
          console.log('高度调用失败');
        }
      },
      pageJump: function (skipData, skipType) {
        if (skipType === 4) {return;}
        if (window.WebViewJavascriptBridge) {
          // alert('我要跳转了');
          window.WebViewJavascriptBridge.callHandler('_app_page_jump', skipData);
        } else {
          // alert('页面跳转调用失败');
        }
      },
      loadMore: function () {
        // console.log('loadmore');
        var _this_ = this;
        // alert('我在调用_h5_reloadNextPage');
        if (window.bridge) {
          window.bridge.registerHandler('_h5_reloadNextPage', function (data, responseCallback) {
            let newdata = JSON.parse(data);
            _this_.$JHttp.defaults.headers.token = newdata.token;
            _this_.$JHttp.defaults.headers.defRoomId = newdata.defRoomId;
            _this_.$JHttp.defaults.headers.defCommunityId = newdata.defCommunityId;
            _this_.curPage = newdata.pageIndex;
            _this_.userId = newdata.userId;
            _this_.token = newdata.token;

            _this_.$JHttp.defaults.headers.defLongitude = newdata.longitude;
            _this_.$JHttp.defaults.headers.defLatitude = newdata.latitude;
            _this_.$JHttp.defaults.headers.defAreaCode = newdata.areaCode;
            window.commonConfig.province = newdata.province;
            window.commonConfig.city = newdata.city;
            window.commonConfig.area = newdata.area;

            if (newdata.pageIndex === 1) {
              _this_.getCardList(newdata.pageIndex);
            } else {
              _this_.hasMore = _this_.cardList.length > newdata.pageIndex;
              _this_.getNewList(_this_.cardList[newdata.pageIndex - 1]).forEach(function (list) {
                _this_.pageList.push(list);
              });
            }
          });
          window.WebViewJavascriptBridge.callHandler('_app_init_call');
        } else {
          setTimeout(function () {
            // alert('我在else');
            _this_.loadMore();
          }, 100);
        }
      },
      chunk: function (array, size) {
        let [start, end, result] = [null, null, []];
        for (let i = 0; i < Math.ceil(array.length / size); i++) {
          start = i * size;
          end = start + size;
          result.push(array.slice(start, end));
        }
        return result;
      },
      getNewList: function (d) {
        let newList = [];
        d.forEach(function (list) {
          let cardinfo = getCardType(list.cardDetailType);
          // if (cardinfo) {
          list.componentName = cardinfo.component;
          list.btnName = list.cardStatus > 0 ? cardinfo.btnName[list.cardStatus - 1] : cardinfo.btnName;
          list.cardName = cardinfo.name;
          newList.push(list);
          // }
        });
        return newList;
      }
    }
  };
</script>

<style>
  html, body {
    margin: 0;
    padding: 0;
    -moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  body {
    /*border: 1px solid;*/
    /*margin-bottom: 0.4rem;*/
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #333333;
    padding: 0 0.26666666666666666rem;
    font-size: 0.4rem;
  }

  ul {
    list-style-type: none;
  }

  li {
    margin-bottom: 0.4rem;
    text-align: left;
  }

  .cardlist {
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    padding: 0.4rem 0;
  }

  .newBottpm {
    padding-bottom: 0.6rem
  }

  .oldBottpm {
    padding-bottom: 0.1rem
  }
</style>
