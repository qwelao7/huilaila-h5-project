<template>
  <div class="signUpPeople commonHeader">
    <view-box ref="viewBox" body-padding-top="1.253333rem" :body-padding-bottom="showBtn ? '1.333333rem' : '0'">
      <!--1.333333rem-->
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        :title="title"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div style="height: 100%">
        <j-pull>
          <!-- :refreshFunc="refreshData" :loadMoreFunc="loadMore"-->
          <div slot="jpull-list">
            <div class="signUp"
                 v-if="applyUserListInformation.applyItemList&&applyUserListInformation.applyUserCount>0">
              <ul v-if="applyUserListInformation.userRole===0||applyUserListInformation.userRole===4">
                <li class="others" v-for="item in applyUserListInformation.applyItemList">
                  <img :src="item.applyUserPhoto" alt="" v-if="item.applyUserPhoto">
                  <img src="../../../assets/images/default_avatar.png" alt="" v-if="!item.applyUserPhoto">
                  <span>{{item.applyUserName}}</span><span class="applyUserCount">({{item.applyUserCount}}人)</span>
                </li>
              </ul>

              <ul
                v-if="applyUserListInformation.userRole===1||applyUserListInformation.userRole===2||applyUserListInformation.userRole===6">
                <li v-for="(item, index) in applyUserListInformation.applyItemList">
                  <div class="signUpPeople_informaton">
                    <div class="left">
                      <div class="signUpPeople_pic">
                        <img :src="item.applyUserPhoto" alt="" v-if="item.applyUserPhoto">
                        <img src="../../../assets/images/default_avatar.png" alt="" v-if="!item.applyUserPhoto">
                      </div>
                      <div class="sp_name">
                        <p class="name">
                          {{item.applyUserName}}
                          <span class="num">({{item.applyUserCount}}人)</span>
                        </p>
                        <div class="note" v-show="item.note" v-text="item.note"></div>
                        <div style="width: 100%;height: 20px" v-show="!item.note"></div>
                        <template v-if="!applyUserListInformation.needUserDetail">
                          <p>
                            <x-button style="float: right" mini type="primary" text="签 到"
                                      @click.native="goSignAll(item.applyId,index)"></x-button>
                          </p>
                          <br>
                          <div class="signCount" v-if="item.signCount>0">
                            已签到{{item.signCount}}人次
                          </div>
                        </template>
                      </div>
                    </div>
                    <div class="phone">
                      <a style="width: 100%;height: 100%;display: block;" :href="'tel:' + item.applyUserPhone"></a>
                    </div>
                  </div>
                  <div class="apply-extra"
                       v-if="item.columnList.length>0">
                    <template v-for="column in item.columnList">
                      <p>{{column.columnName}}:{{column.columnValue}}</p>
                    </template>
                  </div>
                  <template v-if="item.joinUserList.length>0 && applyUserListInformation.needUserDetail"
                            v-for="(itm, idx) in item.joinUserList">
                    <div class="signUpPeople_informaton apply-user">
                      <div class="left">
                        <div class="signUpPeople_pic">
                          <img :src="itm.joinUserPhoto" alt="" v-if="itm.joinUserPhoto">
                          <img src="../../../assets/images/default_avatar.png" alt="" v-if="!itm.joinUserPhoto">
                        </div>
                        <div class="sp_name">
                          <p class="name">
                            {{itm.joinUserName}}
                            <i class="sex"
                               :class="{'sex_male': itm.joinUserSex === '1','sex_female': itm.joinUserSex === '2'}"></i>
                          </p>
                          <p>{{itm.joinUserBirthday}}</p>
                          <p>
                            <x-button style="float: right" mini type="primary" text="签 到"
                                      @click.native="goSign(itm.joinUserId,index,idx)"></x-button>
                          </p>
                          <br>
                          <div class="signCount" v-if="itm.signCount>0">
                            已签到{{itm.signCount}}人次
                          </div>
                        </div>
                      </div>
                      <div class="phone_joiner">
                        <a style="width: 100%;height: 100%;display: block;" :href="'tel:' + itm.joinUserPhone"></a>
                      </div>
                    </div>
                  </template>
                </li>
              </ul>
            </div>
            <div class="noContent" v-if="!applyUserListInformation.applyUserCount">
              <img src="../../../assets/images/No-content.png" alt="">
              <p>什么都没发现，去别处看看吧~</p>
            </div>
          </div>
        </j-pull>
      </div>
      <div slot="bottom" class="signUp_bottom" v-if="showBtn">
        <div v-show="!applyEnd && applyUserListInformation.applyUserCount" class="cantPickUp">
          <p>已收报名费：<span style="color: #0DAB60">¥{{totalFee}}</span></p>
          <span style="color: #aaaaaa">{{applyUserListInformation.applyEndDate}} 后可提取</span>
        </div>
        <div v-show="canGet" @click="pickUpFee">
          <span>提取报名费（¥{{totalFee}}）</span>
        </div>
        <div v-show="applyUserListInformation.withdrawFlag" style="background-color: #aaaaaa">
          <span>已提取报名费：¥{{totalFee}}</span>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {XHeader, ViewBox, XButton, querystring} from 'vux'
  import JPull from '../../base/JPull/JPull'

  export default {
    name: 'signUpPeople',
    components: {
      XHeader,
      XButton,
      ViewBox,
      JPull
    },
    data () {
      return {
        totalFee: '',
        applyEnd: false,
        applyUserListInformation: {},
        needDetail: '',
        title: ''
      }
    },
    created () {
      this.getApplyUserList();
      this.getTotalFee()
    },
    computed: {
      showBtn () {
        if (this.applyUserListInformation.userRole === 1 && this.applyUserListInformation.activityStatus !== 6 && this.applyUserListInformation.joinType) {
          return true
        } else {
          return false
        }
      },
      canGet () {
        if (!this.applyUserListInformation.withdrawFlag && this.applyEnd && this.applyUserListInformation.applyUserCount) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      getTotalFee () {
        let _this = this;
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getTotalApplyFee?activityId=' + this.$route.params.id
        }).then(res => {
          if (res.status === 100) {
            _this.totalFee = toDecimal2(res.data.totalMoney)
          }
        })
      },
      getApplyUserList () {
        let _this = this;
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getApplyUserList?activityId=' + this.$route.params.id
        }).then(res => {
          console.log(res, '参与人信息');
          if (res.status === 100) {
            _this.needDetail = res.data.needUserDetail
            _this.applyUserListInformation = res.data;
            _this.title = res.data.applyUserCount + '人报名'
            let time = new Date().getTime()
            let endTime = new Date(res.data.applyEndDate.replace(new RegExp('-', 'gm'), '/')).getTime()
            console.log(time, endTime, this.applyEnd)
            if (time > endTime) {
              _this.applyEnd = true
            }
          }
        }).catch(err => {
          console.log(err);
        })
      },
      pickUpFee () { // 提现
        let _this = this;
        _this.$vux.confirm.show({
          title: '提示',
          content: '报名费将提取至“回来啦-我的钱包”中，提取后将不可取消活动。',
          confirmText: '确定',
          cancelText: '取消',
          onConfirm (value) {
            let params = {
//          userId: value.signUserId,
              activityId: _this.$route.params.id,
              money: _this.totalFee,
              remark: 'Get registration fee'
            }
            _this.$JHttp({
              method: 'post',
              url: window.baseURL + '/socialactivity/withdrawActivityApplyFee?' + querystring.stringify(params),
              headers: {
                defCommunityId: localStorage.getItem('communityId')
              }
            }).then(res => {
              if (res.status === 100) {
                console.log(res)
                _this.$vux.toast.show({
                  type: 'success',
                  text: '提现成功'
                })
                setTimeout(function () {
                  _this.applyUserListInformation.withdrawFlag = 1
                }, 500)
              }
            }).catch(e => {
              console.log(e)
              _this.$vux.toast.show({
                type: 'cancel',
                text: e
              })
            })
          },
          onCancel () {
            //
          }
        })
      },
      goSign (val, index, idx) {
        this.$vux.loading.show({});
        let _this = this;
        let params = {
          id: this.applyUserListInformation.applyItemList[index].joinUserList[idx].joinUserDetailId,
          signSource: 1
        }
        _this.$JHttp({
          method: 'post',
          url: window.baseURL + '/socialactivity/signActivity?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            console.log(res)
            this.applyUserListInformation.applyItemList[index].joinUserList[idx].signCount += 1
            this.$vux.loading.hide();
          } else {
            _this.$vux.toast.show({
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
          _this.$vux.toast.show({
            text: e.msg
          })
        })
      },
      goSignAll (val, index) {
        this.$vux.loading.show({});
        let _this = this;
        let params = {
          id: this.applyUserListInformation.applyItemList[index].applyId,
          signSource: 1
        }
        _this.$JHttp({
          method: 'post',
          url: window.baseURL + '/socialactivity/signActivityAll?' + querystring.stringify(params),
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          if (res.status === 100) {
            console.log(res)
            this.applyUserListInformation.applyItemList[index].signCount += parseFloat(this.applyUserListInformation.applyItemList[index].applyUserCount)
            this.$vux.loading.hide();
          } else {
            _this.$vux.toast.show({
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
          _this.$vux.toast.show({
            text: e.msg
          })
        })
      }
    }
  }

  // 制保留2位小数，不够的补上00即20.00
  function toDecimal2 (x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    var f1 = Math.round(x * 100) / 100;
    var s = f1.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  }
</script>
<style type="text/less" lang="less" scoped>
  .signUpPeople {
    width: 100%;
    height: 100%;
    .sex {
      width: 16px;
    }
    .female {
      background: url("../../../assets/images/female_icon_32.png") no-repeat center / contain;
    }
    .male {
      background: url("../../../assets/images/male_icon_32.png") no-repeat center / contain;
    }
    .signUp_1 {
      height: 100%;
      padding: 0 15px;
      .others {
        div {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 79px;
          line-height: 79px;
          border-bottom: 0.5px solid #D8D8D8;
          padding: 0;
        }
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        span {
          margin-left: 10px;
          font-size: 15px;
          color: #333333;
        }
      }
    }
    .signUp {
      height: 100%;
      padding: 0 15px;
      .apply-extra {
        border-top: 0.5px solid #d8d8d8;
        color: #aaa;
        margin-left: 50px;
        padding: 10px 0;
        font-size: 12px;
      }
      .apply-user {
        margin-left: 50px;
        border-top: 0.5px solid #d8d8d8;
        padding-top: 10px;
      }
      .others {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 79px;
        line-height: 79px;
        border-bottom: 0.5px solid #D8D8D8;
        padding: 0;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        span {
          margin-left: 10px;
          font-size: 15px;
          color: #333333;
        }
        .applyUserCount {
          color: #aaa;
        }
      }
      ul {
        width: 100%;
        li {
          width: 100%;
          padding: 20px 0;
          border-bottom: solid 0.5px #d8d8d8;
          .signUpPeople_informaton {
            position: relative;
            display: flex;
            /*align-items: center;*/
            justify-content: space-between;
            .left {
              flex: 1;
              display: flex;
              /*align-items: center;*/
            }
            .signUpPeople_pic {
              width: 40px;
              height: 40px;
              border-radius: 100%;
              display: inline-block;
              vertical-align: middle;
              margin-right: 10px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 100%;
              }
            }
            .sp_name {
              flex: 1;
              .nameBox {
                display: flex;
                align-items: center;
                margin-bottom: 3px;
              }
              .name {
                font-size: 15px;
                color: #333333;
                font-weight: 500;
                max-width: 250px;
                word-wrap: break-word;
              }
              .num {
                display: inline-block;
                font-size: 12px;
                color: #AAAAAA;
              }
            }
            .sex_male {
              display: inline-block;
              width: 16px;
              height: 16px;
              background: url("../../../assets/images/male_icon_32.png") left center;
              background-size: cover;
              margin-left: 8px;
            }
            .sex_female {
              display: inline-block;
              width: 16px;
              height: 16px;
              background: url("../../../assets/images/female_icon_32.png") left center;
              background-size: cover;
              margin-left: 8px;
            }
            .phone {
              width: 28px;
              height: 28px;
              background: url("../../../assets/images/consult_icon_black.png") left center;
              background-size: cover;
              position: absolute;
              right: 0;
              top: 0;
            }
            .phone_joiner {
              width: 28px;
              height: 28px;
              background: url("../../../assets/images/consult_icon_black.png") left center;
              background-size: cover;
              position: absolute;
              right: 0;
              top: 10px;
            }
          }
          .note {
            width: 100%;
            padding: 10px 0;
            box-sizing: border-box;
            /*background: #F5F5F5;*/
            color: #333;
            font-size: 12px;
            margin-top: 10px;
            max-width: 300px;
            word-wrap: break-word;
          }
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
    .signUp_bottom {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      div {
        height: 50px;
        line-height: 50px;
        background: #0DAB60;
        color: #ffffff;
        font-size: 18px;
        text-align: center;
      }
      .cantPickUp {
        display: flex;
        height: auto;
        line-height: normal;
        justify-content: center;
        flex-direction: column;
        background-color: #ffffff;
        padding: 7.5px 0;
        border-top: 0.5px solid #D8D8D8;
        p {
          text-align: center;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333333;
        }
        span {
          font-size: 12px;
        }
      }
    }
  }

  .signCount {
    display: block;
    width: 100%;
    text-align: right;
    padding-top: 10px;
  }
</style>
