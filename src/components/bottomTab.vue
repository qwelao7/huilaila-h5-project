<template>
  <div class="bottomTab" v-model="index">
    <tabbar @on-index-change="onItemClick">
      <tabbar-item :selected="index === 0" link="/life/recommend">
        <img slot="icon" src="../assets/images/homepage_icon_56.png">
        <img slot="icon-active" src="../assets/images/homepage_icon_56link.png">
        <span slot="label">生活</span>
      </tabbar-item>
      <tabbar-item :selected="path === '/community'" link="/community"><!--path === '/community'-->
        <img slot="icon" src="../assets/images/housing_icon_56.png">
        <img slot="icon-active" src="../assets/images/housing_icon_56link.png">
        <span slot="label">小区</span>
      </tabbar-item>
      <!--<tabbar-item class="publish" link="/pub_newThings">-->
      <tabbar-item class="publish">
        <img v-model="publish" @click="toPublish" slot="icon" src="../assets/images/publish_icon_56.png">
        <!--<img v-model="publish" slot="icon" src="../assets/images/publish_icon_56.png">-->
      </tabbar-item>
      <tabbar-item :selected="path === '/service'" link="/service">
        <img slot="icon" src="../assets/images/service_icon_56.png">
        <img slot="icon-active" src="../assets/images/service_icon_56link.png">
        <span slot="label">服务</span>
      </tabbar-item>
      <tabbar-item :selected="path === '/myHouse'" link="/myHouse">
        <img slot="icon" src="../assets/images/my_icon_56.png">
        <img slot="icon-active" src="../assets/images/my_icon_56link.png">
        <span slot="label">我家</span>
      </tabbar-item>
    </tabbar>
    <div v-transfer-dom class="publishes">
      <x-dialog v-model="publish" hide-on-blur :dialog-style="{'max-width': '750px', width: '100%', height: '100%', 'background': 'none'}">
        <div class="pub-banner">
          <div class="pub">
            <div class="box">
              <div class="pub-newThings" @click="pub_newThings">
                <img src="../assets/images/publish_newthings.png" alt="">
              </div>
              <div class="pub-activity" @click="pub_activity">
                <img src="../assets/images/publish_activity.png" alt="">
              </div>
            </div>
            <div class="closeIcon" @click="publish = false">
              <img src="../assets/images/publish_icon_56link.png" alt="">
            </div>
          </div>
        </div>
      </x-dialog>
    </div>
    <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle">
      <span class="delete-info vux-1px-b">您尚未绑定手机号!</span>
      <div class="operate-wrapper">
        <span class="text vux-1px-r" @click="deleteModalShow = false">以后再说</span>
        <span class="text" @click="goBingPhone">前往绑定</span>
      </div>
    </x-dialog>
  </div>
</template>
<script>
  import { Tabbar, TabbarItem, XDialog, TransferDomDirective as TransferDom } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    name: 'bottomTab',
    components: {
      Tabbar,
      TabbarItem,
      XDialog
    },
    data () {
      return {
        index: 0,
        publish: false,
        path: this.$route.path,
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        }
      }
    },
    methods: {
      onItemClick (val) {
        this.index = val;
      },
      toPublish () {
        let token = localStorage.getItem('token')
        if (!token) {
          this.deleteModalShow = true
        } else {
          this.publish = true
        }
      },
      goBingPhone () {
        this.$router.push('/Login')
      },
      pub_newThings () {
        this.publish = false;
        let token = localStorage.getItem('token')
        if (!token) {
          this.deleteModalShow = true
        } else {
          this.$router.push('/pub_newThings')
        }
      },
      pub_activity () {
        this.publish = false;
        let token = localStorage.getItem('token')
        if (!token) {
          this.deleteModalShow = true
        } else {
//          this.$router.push('/pub_newThings')
          let _this = this;
          _this.$JHttp({
            method: 'get',
            url: window.baseURL + '/socialactivity/getCanAddActivity',
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            if (res.status === 100) {
              console.log(res)
              if (res.data === true) {
                _this.$router.push('/pub_activity')
              } else {
                _this.$vux.toast.show({
                  type: 'text',
                  text: '对不起，您没有权限进行此项操作！'
                })
              }
            } else {
              _this.$vux.toast.show({
                type: 'cancel',
                text: res.msg
              })
            }
          }).catch(e => {
            console.log(e)
          })
        }
      }
    }
  }
</script>
<style type="text/less" lang="less">
  @import '~vux/src/styles/close';
  .bottomTab{
    .weui-tabbar{
      max-width: 750px;
    }
    .publish{
      .weui-tabbar__icon{
        width: 42px;
        height: 42px;
      }
    }
  }
  .publishes{
    .weui-mask{
      max-width: 750px;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      background: none;
    }
    .pub-banner{
      width: 100%;
      height: 100%;
      /*padding-bottom: 8px;*/
      /*bottom: 0;*/
      /*left: 0;*/
      display: flex;
      align-items: flex-end;
      flex-direction: row;
      background: url("../../static/blurbg.jpg") no-repeat;
      background-position: center;
      background-size: cover;
      .pub{
        height: 70%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .box{
          display: flex;
          align-items: center;
          justify-content: space-around;
          .pub-newThings, .pub-activity{
            width: 120px;
            height: 165px;
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .closeIcon{
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        img{
          width: 42px;
          height: 100%;
        }
      }
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
        flex: 1;
        height: 100%;
        line-height: 50px;
        color: #18adfb;
        font-size: 16px;
      }
    }
  }
</style>
