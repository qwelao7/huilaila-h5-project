<template>
  <div class="commonHeader message">
    <view-box body-padding-top="2.426667rem" body-padding-bottom="0">
      <div style="width:100%;position:absolute;left:0;top:0;z-index:100;" slot="header">
        <x-header
          slot="header"
          :left-options="{backText: ''}"
          title="消息">
          <a slot="right" @click="allRead">全部已读</a>
        </x-header>
        <tab :line-width=2 custom-bar-width="20px" active-color='#0DAB60'>
          <tab-item class="vux-center" :selected="selectedTab === item" v-for="(item, index) in list" @click="selectedTab = item"
                    @on-item-click="switchTabItem(index)" :key="index">
            <div class="dotTab">{{item}}
              <!--<badge class="dot"></badge>-->
            </div>
          </tab-item>
        </tab>
      </div>
      <notice :is="currentTab" keep-alive class="tabItem"></notice>
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
        index: 0,
//        showDot: true,
        selectedTab: '通知',
        list: ['通知', '评论'],
        currentTab: notice
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        let fromPath = from.path;
        if (fromPath.indexOf('/personPage') > -1 || fromPath.indexOf('/newThingsDetail') > -1) {
          vm.selectedTab = '评论';
          vm.switchTabItem(1);
        } else {
          vm.selectedTab = '通知';
          vm.switchTabItem(0);
        }
      })
    },
    created () {
     //
    },
    methods: {
      switchTabItem (index) {
        if (index === 0) {
          this.currentTab = notice
        } else if (index === 1) {
          this.currentTab = comment
        }
      },
      allRead () {
        let _this = this;
        _this.$vux.loading.show({
          text: '加载中'
        });
        _this.$JHttp({
          method: 'post',
          url: window.baseURL + '/notice/allRead'
        }).then(res => {
          if (res.status === 100) {
            _this.$vux.loading.hide();
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

