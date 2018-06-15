<template>
  <div class="my commonHeader">
    <view-box body-padding-top="1.253333rem" body-padding-bottom="1.306667rem">
      <x-header
        slot="header"
        :left-options="{showBack: false}"
        title="slot:overwrite-title"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;">
        <a slot="right" @click="showMessage" class="right"><i class="messageIcon"></i></a>
        <div class="overwrite-title-demo" slot="overwrite-title" @click="chooseAddress">
          <i class="positionIcon"></i>
          <span v-text="communityName"></span>
        </div>
      </x-header>
      <div>
        <div class="myInfo">
          <div class="modifyInfo" @click="toInfo(personalInfo.avatar)">
            <div>
              <p class="name" v-text="personalInfo.nickName"></p>
              <p>查看/编辑账户资料</p>
            </div>
            <div class="avatar">
              <img :src="personalInfo.avatar" alt="">
            </div>
          </div>
          <ul class="wallet">
            <li>
              <span>钱包</span>
              <span>{{treasure.money}}</span>
            </li>
            <li @click="goRedpacket">
              <span>红包</span>
              <span>{{treasure.myRedPacketCount}}</span>
            </li>
            <li @click="goIntegral">
              <span>积分</span>
              <span>{{treasure.allScore}}</span>
            </li>
          </ul>
        </div>
        <div class="infoList no-margin-top">
          <group>
            <cell-box is-link @click.native="goMyOrder">
              <span class="myServeice">
                <span>我的服务</span>
                <span class="number" v-if="myServeiceNum" v-text="myServeiceNum"></span>
              </span>
            </cell-box>
            <cell-box is-link @click.native="goPersonPage">
              <span>个人主页</span>
            </cell-box>
            <cell-box link="/myInteractive">
              <span>我的互动</span>
            </cell-box>
            <cell-box link="/myAddress">
              <span>我的地址</span>
            </cell-box>
          </group>
          <group class="broker">
            <cell-box link="/myBroker">
              <span>我的经纪人</span>
            </cell-box>
          </group>
          <!--<group class="broker">-->
            <!--<cell-box @click.native="signOut">-->
              <!--<span>退出登录-测试</span>-->
            <!--</cell-box>-->
          <!--</group>-->
        </div>
      </div>
      <bottomTab slot="bottom"></bottomTab>
    </view-box>
  </div>
</template>
<script>
  import bottomTab from '../components/bottomTab'
  import {File} from '../common/js/Upload'
  import { XHeader, Cell, CellBox, Group, Scroller, ViewBox } from 'vux'
  import {initialAxios} from '../main'
  export default {
    name: 'MyHouse',
    components: {
      ViewBox,
      Scroller,
      bottomTab,
      XHeader,
      Cell,
      CellBox,
      Group
    },
    data () {
      return {
        communityName: '',
        personalInfo: {
          userId: '',
          nickName: '',
          avatar: '',
          balance: 0.00,
          redPacket: 0,
          bonus: 0
        },
        treasure: {},
        myServeiceNum: 0
      }
    },
    created () {
      let token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/Login/');
      } else {
//        localStorage.setItem('communityId', '9e1afefa-2548-11e5-901d-ac853da49bf6')
//        localStorage.setItem('communityName', '测试：绿漫实验园')
        let communityName = localStorage.getItem('communityName');
        this.communityName = communityName;
        this.getPersonalInfo();
        this.getTreasure();
        this.getBonus();
        this.getOrderCount();
      }
    },
    methods: {
      getOrderCount () {
        let _this_ = this
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/order/getOrderCount'
        }).then(res => {
          if (res.status === 100) {
            _this_.myServeiceNum = res.data.noPayCount + res.data.noAppraiseCount
          }
        }).catch(e => {
          console.log(e)
        });
      },
      getPersonalInfo () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/home/getUserInfoAndAsset'
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            let data = res.data;
            _this_.personalInfo.userId = data.userId;
            let defaultHouse = data.ownerAsset;
            if (defaultHouse && !_this_.communityName) {
              _this_.communityName = defaultHouse.communityName;
            }
            let nickName = data.nickName;
            let avatar = data.headPicName;
            if (nickName) {
              _this_.personalInfo.nickName = nickName;
            }
            if (avatar) {
              _this_.personalInfo.avatar = avatar;
            }
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
      goPersonPage () {
        this.$router.push('/personPage/' + this.personalInfo.userId);
      },
      goMyOrder () {
        this.$router.push('/myOrder');
      },
      getBalance () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/treasure/getMyMoney'
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            _this_.personalInfo.balance = res.data;
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
      getRedPacket () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/redpacket/getRedPacket' // TODO 获取个人红包
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            _this_.personalInfo.redPacket = res.data;
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
      getBonus () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/integral/userInt'
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            _this_.personalInfo.bonus = res.data;
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
      getTreasure () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/treasure/treasureHome',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            _this_.treasure = res.data;
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
      chooseAddress () {
        this.$router.push('/changeCommunity');
      },
      showMessage () {
        this.$router.push('/message');
      },
      toInfo (key) {
        this.$router.push('/personInfo');
      },
      goIntegral () {
        this.$router.push('/integral')
      },
      goRedpacket () {
        // 跳转到红包
        this.$router.push('/redpacket')
      },
      // 清空localStorage
      signOut () {
        let _this = this;
        _this.$vux.confirm.show({
          title: '您正在进行退出登录的操作！',
          content: '确定退出登录？',
          onConfirm () {
            localStorage.clear();
            _this.$router.go(-1)
          }
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .overwrite-title-demo {
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 100%;
    justify-content: center;
    .positionIcon {
      display: inline-block;
      /*flex: 1;*/
      width: 20px;
      height: 34px;
      background-image: url("../assets/images/address_icon_32black.png");
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
    }
    span {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 18px;
      color: #333333;
      margin-left: 3px;
    }
  }
  .messageIcon{
    width: 28px;
    height: 28px;
    background: url("../assets/images/message_icon_black.png") center / cover ;
  }
  .my{
    height: 100%;
    width: 100%;
    background-color: #f7f7f7;
    position: relative;
    .myInfo{
      background-color: #ffffff;
      padding: 20px 28px 12px 15px;
      .modifyInfo{
        display: flex;
        justify-content: space-between;
        p{
          font-size: 12px;
        }
        .name{
          font-size: 27px;
          font-weight: bold;
        }
        .avatar{
          width: 76px;
          height: 76px;
          box-shadow: 0 6px 14px 0 rgba(170,181,171,0.5);
          border-radius: 50%;
          img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
      .wallet{
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-top: 19px;
        li{
          text-align: center;
          font-size: 12px;
          span:last-child{
            font-size: 15px;
            font-weight: bold;
          }
        }
      }
    }
    .infoList{
      margin-top: 10px;
      .myServeice {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .number {
          padding: 0 7px;
          height: 17.5px;
          line-height: 17.5px;
          margin-right: 20px;
          background: #FF6648;
          border-radius: 42px;
          font-size: 12px;
          color: #FFFFFF;
        }
      }
      span{
        font-size: 15px;
      }
      .broker{
        margin-top: 10px;
      }
    }
  }
</style>
