<template>
  <div class="commonHeader message">
    <view-box body-padding-top="2.426667rem" body-padding-bottom="0">
      <div style="width:100%;position:absolute;left:0;top:0;z-index:100;" slot="header">
        <x-header
          slot="header"
          :left-options="leftOptions"
          @on-click-back="backMy"
          title="消息">
          <!--<a slot="overwrite-left" @click="backMy"></a>-->
          <a slot="right" @click="allRead">全部已读</a>
        </x-header>
        <tab :line-width=2 custom-bar-width="20px" active-color='#0DAB60'>
          <tab-item class="vux-center"
                    :selected="selectedTab === item.id"
                    v-for="(item, index) in tabs"
                    @on-item-click="clickTab(item)"
                    :key="item.id">
            <router-link :to="/message/ + item.value" tag="li">{{item.name}}</router-link>
          </tab-item>
        </tab>
      </div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" ref="item"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" ref="item"></router-view>
    </view-box>
  </div>
</template>
<script>
  import { XHeader, Tab, TabItem, ViewBox, Badge } from 'vux'
  import notice from './notice'
  import comment from './comment'
  export default {
    name: 'message',
    components: {
      XHeader,
      Tab,
      TabItem,
      ViewBox,
      Badge,
      notice,
      comment
    },
    data () {
      return {
        leftOptions: {
          // preventGoBack: true,
          backText: ''
        },
        selectedTab: 0,
        tabs: [
          {
            name: '通知',
            id: 0,
            value: 'notice'
          },
          {
            name: '评论',
            id: 1,
            value: 'comment'
          }
        ]
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        let toPath = to.path;
        if (toPath === '/message/notice') {
          vm.selectedTab = 0
        } else if (toPath === '/message/comment') {
          vm.selectedTab = 1
        } else {
          vm.selectedTab = 0
        }
      })
    },
    methods: {
      clickTab (val) {
        this.selectedTab = val.id
        console.log(val.name)
      },
      backMy () {
        this.$router.push('/myHouse')
      },
      allRead () {
        let _this = this;
        if (_this.selectedTab === 0) {
          _this.$vux.loading.show({
            text: '加载中'
          });
          _this.$JHttp({
            method: 'post',
            url: window.baseURL + '/notice/allRead'
          }).then(res => {
            if (res.status === 100) {
              _this.$vux.loading.hide();
              _this.$refs.item.allRead && _this.$refs.item.allRead();
  //            _this.showDot = false;
            } else {
              _this.$vux.loading.hide();
              _this.$vux.toast.show({
                type: 'cancel',
                text: res.msg
              });
            }
          }).catch(e => {
            console.log(e)
          })
        } else if (_this.selectedTab === 1) {
          _this.$refs.item.allRead && _this.$refs.item.allRead();
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .message {
    height: 100%;
    .vux-header .vux-header-right a{
      font-size: 15px;
      color: #333333;
    }
    .dotTab{
      position: relative;
      .dot{
        position: absolute;
        top: 13px;
        padding: 3px;
        margin-left: 5px;
      }
    }
  }
</style>

