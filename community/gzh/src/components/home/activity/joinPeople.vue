<template>
  <div class="joinPeople commonHeader">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="1.333333rem">
      <x-header
        slot="header"
        :left-options="{backText: ''}" title="活动参与人" style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <div style="height: 100%">
        <j-pull :refreshFunc="refreshData">
          <div slot="jpull-list">
            <div class="personList">
              <ul>
                <li v-for="(item, index) in dataList" :key="item.id" class="liItem">
                  <div class="info" @click="chooseItem(item)">
                    <i :class="{choosed: item.choose}"></i>
                    <img :src="item.joinUserPhoto" alt="" v-if="item.joinUserPhoto">
                    <img src="../../../assets/images/default_avatar.png" alt="" v-if="!item.joinUserPhoto">
                    <span>{{item.joinUserName}}</span>
                  </div>
                  <div class="rightBan" @click="changeUserInfo(item)">
                    <span v-show="!item.completed" class="unPerfect">未完善</span>
                    <i class="arrow"></i>
                  </div>
                </li>
              </ul>
              <div class="added" @click="add">
                <i></i>
                <span>添加</span>
              </div>
            </div>
          </div>
        </j-pull>
      </div>
      <div type="primary" class="submit" @click="chooseOk">选好了</div>
    </view-box>
  </div>
</template>
<script>
  import { XHeader, ViewBox, Group, CellBox, Checklist, Checker, CheckerItem, XButton } from 'vux'
  import JPull from '../../base/JPull/JPull'
  export default {
    name: 'joinPeople',
    components: {
      XHeader,
      ViewBox,
      JPull,
      Group,
      CellBox,
      Checklist,
      Checker,
      CheckerItem,
      XButton
    },
    data () {
      return {
        dataList: [],
        setApplyInfo: JSON.parse(localStorage.getItem('setApplyInfo')) || []
      }
    },
    created () {
      this.getJoinList();
    },
    methods: {
      refreshData (loaded) {
        this.dataList = [];
        this.getJoinList(loaded);
      },
      getJoinList (loaded) {
        let _this = this;
        _this.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/getJoinUserList'
        }).then(res => {
          if (loaded) {
            loaded()
          }
          let data = res.data;
          let id = localStorage.getItem('userId')
          data.forEach(rst => {
            let obj = {
              completed: rst.completed,
              intime: rst.intime,
              inuser: rst.inuser,
              joinRelation: rst.joinRelation,
              joinUserBirthday: rst.joinUserBirthday,
              joinUserName: rst.joinUserName,
              joinUserPhone: rst.joinUserPhone,
              joinUserPhoto: rst.joinUserPhoto,
              joinUserSex: rst.joinUserSex,
              status: rst.status,
              userId: rst.userId,
              choose: false
            }
//            if (id === rst.userId && rst.completed) {
//              rst.choose = true
//            }
            if (_this.setApplyInfo.length) {
              _this.setApplyInfo.forEach(val => {
                if (val.userId === rst.userId) {
                  obj.choose = true
                }
              })
            }
            _this.dataList.push(obj)
          })
        }).catch(err => {
          console.log(err);
        })
      },
      chooseItem (value) {
        if (!value.completed) {
          this.$vux.toast.show({
            type: 'text',
            text: '请先完善用户信息！'
          })
        } else {
          value.choose = !value.choose;
        }
      },
      chooseOk () {
        this.setApplyInfo = []
        this.dataList.forEach(res => {
          if (res.choose) {
            this.setApplyInfo.push(res)
          }
        })
//        localStorage.removeItem('setApplyInfo');
        localStorage.setItem('setApplyInfo', JSON.stringify(this.setApplyInfo));
        this.$router.go(-1);
      },
      add () {
        this.$router.push('/addPerson/' + 'addNew')
      },
      changeUserInfo (val) {
        let id = localStorage.getItem('userId');
        if (id === val.userId && val.completed) {
          this.$router.push('/applyUserInfo/' + val.userId)
        } else {
          this.$router.push('/addPerson/' + val.userId)
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .joinPeople{
    height: 100%;
    background-color: #ffffff;
    .personList{
      .liItem{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
        border-bottom: 0.5px solid #D8D8D8;
        .info{
          display: flex;
          align-items: center;
          i{
            width: 22px;
            height: 22px;
            background-repeat: no-repeat;
            background: url("../../../assets/images/unchecked_icon_grey.png") left center / cover;
          }
          .choosed{
            background: url("../../../assets/images/checked_icon_green.png") left center / cover;
          }
          img{
            margin-left: 18px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
          span{
            font-size: 18px;
            margin-left: 15px;
          }
        }
        .rightBan{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .unPerfect{
            display: inline-block;
            margin-right: 13px;
            font-size: 12px;
            color: #FF5858;
          }
          .arrow{
            display: inline-block;
            width: 8px;
            height: 18px;
            background-image: url("../../../assets/images/arrow_icon_grey.png");
            background-repeat: no-repeat;
            background-position: left center;
            background-size: contain;
          }
        }
      }
      .liItem:last-child{
        border-bottom: none;
      }
      .added{
        margin: 0 15px;
        padding: 14px 0;
        border-bottom: 0.5px solid #D8D8D8;
        border-top: 0.5px solid #D8D8D8;
        display: flex;
        align-items: center;
        justify-content: center;
        i{
          width: 28px;
          height: 28px;
          background-image: url("../../../assets/images/add_icon_56black.png");
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
        }
        span{
          margin-left: 5px;
          font-size: 18px;
        }
      }
    }
    .submit{
      position: fixed;
      bottom: 0;
      left: 0;
      border-radius: 0;
      width:100%;
      text-align: center;
      color: #ffffff;
      font-size: 18px;
      height: 49px;
      line-height: 49px;
      background-color: #0DAB60;
    }
  }
</style>
