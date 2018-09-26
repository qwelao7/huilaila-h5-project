<template>
  <div class="addPerson commonHeader">
    <x-header
      :left-options="{backText: ''}"
      :title="title">
      <a slot="right" style="color: red" @click="delApplyUser">{{deleteUser}}</a>
    </x-header>
    <div class="itemList">
      <group class="items avatar">
        <cell is-link @click.native="chooseAvatar" v-show="!isApp">
          <span>头像</span>
          <!--<img :src="userAvatar" alt="" v-show="userAvatar">-->
          <j-img v-show="avatar" :osskey="avatar" :custom-width="35" :custom-height="35"></j-img>
          <img src="../../../assets/images/default_avatar.png" alt="" v-show="!avatar">
        </cell>
        <cell is-link v-show="isApp" class="avatarInApp">
          <label for="xFile" class="add01">
            <span>头像</span>
            <!--<img :src="userAvatar" alt="" v-show="userAvatar">-->
            <j-img v-show="avatar" :osskey="avatar" :custom-width="35" :custom-height="35"></j-img>
            <img src="../../../assets/images/default_avatar.png" alt="" v-show="!avatar">
          </label>
          <form><input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" multiple id="xFile" class="uploadPoster" @change="chooseAvatarInApp"></form>
        </cell>
      </group>
      <group class="items">
        <group-title slot="title" v-show="userName">姓名</group-title>
        <x-input placeholder="姓名" class="hasTop" :class="{noTop: userName}" v-model="userName" :show-clear="false" :min="2" :max="10"></x-input>
      </group>
      <group class="items">
        <group-title slot="title" v-show="userPhone">手机号</group-title>
        <x-input class="hasTop" :class="{noTop: userPhone}" placeholder="手机号" :max="11" v-model="userPhone" is-type="china-mobile" :show-clear="false" :readonly="readOnlyPhone"></x-input>
      </group>
      <group class="items sexOption">
        <group-title slot="title">性别</group-title>
        <cell>
          <span style="color: #333333;font-size: 21px" v-html="userSex === 2 ? '女士' : '先生'"></span>
          <div class="chooseSex">
            <span v-for="item in sexInfo" :class="{selected: item.key === sexChoose}" @click="changeSex(item)">{{item.value}}</span>
          </div>
        </cell>
      </group>
      <group class="items birthday">
        <group-title slot="title" v-show="userBirthday">出生日期</group-title>
        <cell class="hasTop" :class="{noTop: userBirthday}" :title="userBirthday || birthday" is-link @click.native="chooseBirthday"></cell>
      </group>
      <group class="items">
        <group-title slot="title" v-show="userRelation">与业主关系</group-title>
        <cell class="hasTop" :class="{noTop: userRelation}" :title="userRelation || joinRelation" is-link @click.native="chooseRelation"></cell>
      </group>
      <group style="margin-top: 20px;">
        <x-button type="primary" :show-loading="false" style="background-color: #0DAB60" @click.native="submit">保存</x-button>
      </group>
    </div>
    <!--引入一次datetime，一遍防止直接调用时间插件出现bug start -->
    <datetime style="display: none"></datetime>
    <!--引入一次datetime，一遍防止直接调用时间插件出现bug end -->
    <div v-transfer-dom>
      <popup v-model="relationPopup" height="100%" style="background-color: #ffffff;">
        <div class="commonHeader identity">
          <x-header
            slot="header"
            :left-options="leftOpt"
            @on-click-back="hidePopup"
            title="与我的关系">
          </x-header>
          <div class="list">
            <checker
              v-model="selectedRole"
              selected-item-class="selected" class="identities">
              <checker-item
                v-for="role in roleList"
                :key="role.id"
                class="li"
                :value="{id: role.id, name: role.name}"
                @on-item-click="choose">
                <div class="block">
                  <span v-text="role.name"></span>
                </div>
              </checker-item>
            </checker>
          </div>
          <!--<span class="remark">注: 请准确选择你的身份</span>-->
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import { XHeader, Group, GroupTitle, Checker, CheckerItem, TransferDom, Popup, XInput, XButton, Cell, Datetime, querystring } from 'vux'
  import {File} from '../../../common/js/Upload'
  import {JNavigator} from '../../../common/js/utils'
  import {jlDate} from 'common/js/utils';
  import JImg from 'components/common/img/jImg'
  export default {
    name: 'addPerson',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Group,
      Popup,
      GroupTitle,
      XInput,
      Cell,
      Checker,
      CheckerItem,
      XButton,
      Datetime,
      'j-img': JImg
    },
    data () {
      return {
        title: '',
        deleteUser: '',
        readOnlyPhone: false,
        id: '',
        userName: '',
        userAvatar: '',
        userPhone: '',
        userSex: '',
        userBirthday: '',
        userRelation: '',
        subUserRelation: '',
        avatar: '',
        relation: {},
        sexChoose: 1,
        sexInfo: [
          {
            value: '先生',
            key: 1
          },
          {
            value: '女士',
            key: 2
          }
        ],
        joinRelation: '与业主关系',
        birthday: '出生日期',
        leftOpt: {
          backText: '',
          preventGoBack: true
        },
        relationPopup: false,
        /* 1：本人；2：子女；3：父母；4：配偶；5：（外）祖父母；6：（外）孙子女；7：其他 */
        roleList: [
          {
            id: '1',
            name: '本人'
          }, {
            id: '2',
            name: '子女'
          }, {
            id: '3',
            name: '父母'
          }, {
            id: '4',
            name: '配偶'
          }, {
            id: '5',
            name: '（外）祖父母'
          },
          {
            id: '6',
            name: '（外）孙子女'
          },
          {
            id: '7',
            name: '其他'
          }
        ],
        selectedRole: {},
        isApp: ''
      }
    },
    created () {
      this.isApp = localStorage.getItem('isApp');
      this.getData()
    },
    methods: {
      getData () {
        let _this_ = this;
        let id = this.$route.params.id
        let userId = localStorage.getItem('userId')
        if (id !== 'addNew') {
          _this_.title = '修改参与人'
          let params = {
            userId: id
          }
          _this_.$JHttp({
            method: 'get',
            url: window.baseURL + '/socialactivity/activParticipantDetail?' + querystring.stringify(params)
          }).then(res => {
            if (res.status === 100) {
              let data = res.data;
              if (data.userId !== userId) {
                _this_.deleteUser = '删除';
              } else {
                _this_.deleteUser = '';
                _this_.readOnlyPhone = true
              }
              _this_.id = data.userId
              _this_.userName = data.joinUserName;
              _this_.avatar = data.joinUserPhoto;
              _this_.userPhone = data.joinUserPhone;
              _this_.userSex = data.joinUserSex;
              _this_.userBirthday = data.joinUserBirthday;
              _this_.sexChoose = _this_.userSex === 0 ? 1 : _this_.userSex
              _this_.subUserRelation = data.joinRelation;
              switch (data.joinRelation) {
                case 1:
                  _this_.userRelation = '本人';
                  break
                case 2:
                  _this_.userRelation = '子女';
                  break;
                case 3:
                  _this_.userRelation = '父母';
                  break
                case 4:
                  _this_.userRelation = '配偶';
                  break
                case 5:
                  _this_.userRelation = '（外）祖父母';
                  break
                case 6:
                  _this_.userRelation = '（外）孙子女';
                  break
                case 7:
                  _this_.userRelation = '其他';
                  break
              }
            }
          }).catch(e => {
            console.log(e)
          })
        } else {
          _this_.title = '新增参与人'
        }
      },
      delApplyUser () {
        let _this = this;
        _this.$vux.confirm.show({
          title: '删除参与人',
          content: '确定删除参与人？',
          onConfirm () {
            let params = {
              userId: _this.$route.params.id
            }
            _this.$JHttp({
              method: 'delete',
              url: window.baseURL + '/socialactivity/deleteJoinUser?' + querystring.stringify(params)
            }).then(res => {
              if (res.status === 100) {
                _this.$vux.toast.show({
                  type: 'success',
                  text: '删除成功'
                });
                _this.$router.go(-1)
              }
            })
          },
          onCancel () {}
        })
      },
      changeSex (value) {
        this.sexChoose = value.key;
        this.userSex = this.sexChoose
      },
      chooseAvatar () {
        let _this_ = this;
        this.$wechat.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            let localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            _this_.$wechat.getLocalImgData({
              localId: localId, // 图片的localID
              success: function (res) {
                let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                if (JNavigator.isAndroid()) {
                  localData = 'data:image/jgp;base64,' + localData;
                }
                _this_.upLoadImage(localData)
              }
            });
          }
        })
      },
      createImageFile (file) {
        if (typeof FileReader === 'undefined') {
//          alert('您的浏览器不支持图片上传，请升级您的浏览器')
          this.$vux.toast.show({
            type: 'text',
            text: '您的浏览器不支持图片上传，请升级您的浏览器'
          })
          return false
        }
        let _this = this
        let leng = file.length
        if (leng > 1) {
          _this.$vux.toast.show({
            type: 'text',
            text: '只能选择1张图片哦~~'
          })
          return
        }
        for (let i = 0; i < leng; i++) {
          let reader = new FileReader()
          reader.readAsDataURL(file[i])
          reader.onload = function (e) {
            _this.userAvatar = e.target.result
            _this.avatar = _this.userAvatar
            _this.upLoadImage(_this.userAvatar)
          }
        }
      },
      chooseAvatarInApp (e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.createImageFile(files);
      },
      upLoadImage (value) {
        let _this_ = this;
        let file = File.dataURItoBlob(value);
        _this_.uploadBlob([file], 'activity', undefined, undefined, function (resList) {
          _this_.avatar = resList[0]
        });
      },
      chooseBirthday () {
        let _this = this;
        _this.$vux.datetime.show({
          cancelText: '取消',
          clearText: '清除',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: _this.userBirthday,
          startDate: '1900-01-01',
          endDate: jlDate.Dateformat(new Date().getTime(), 'YYYY-MM-DD'),
          onConfirm (val) {
            _this.userBirthday = val;
          },
          onClear () {
            _this.userBirthday = ''
          }
        })
      },
      chooseRelation () {
        this.relationPopup = true
      },
      hidePopup () {
        this.relationPopup = false
      },
      choose (role) {
        console.log(role)
        this.relation = role;
        this.userRelation = this.relation.name;
        this.subUserRelation = role.id;
        this.relationPopup = false
      },
      submit () {
        let _this = this;
        if (!_this.userName.trim()) {
          _this.$vux.toast.show({
            type: 'text',
            text: '请输入2-10位真实姓名'
          })
          return
        }
        if (_this.userPhone === '') {
          _this.$vux.toast.show({
            type: 'text',
            text: '请输入11位手机号码'
          })
          return
        }
        if (!_this.userBirthday) {
          _this.$vux.toast.show({
            type: 'text',
            text: '请选择出生日期'
          })
          return
        }
        if (_this.subUserRelation === '') {
          _this.$vux.toast.show({
            type: 'text',
            text: '请选择与业主的关系'
          })
          return
        }
        let params = {
          joinUserPhoto: _this.avatar,
          joinUserName: _this.userName,
          joinUserPhone: _this.userPhone,
          joinUserSex: _this.userSex || _this.sexChoose,
          joinUserBirthdayDate: _this.userBirthday,
          joinRelation: _this.subUserRelation
        }
        let id = this.$route.params.id;
        if (id !== 'addNew') {
          // 修改POST
          params.userId = _this.id
          console.log(params)
          _this.$JHttp({
            method: 'post',
            url: window.baseURL + '/socialactivity/updateJoinUser?' + querystring.stringify(params),
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            if (res.status === 100) {
              _this.$vux.toast.show({
                type: 'success',
                text: '修改成功'
              })
              _this.$router.go(-1)
            }
          }).catch(e => {
            console.log(e)
          })
        } else {
          // 新增
          params.joinRelation = _this.relation.id
          console.log(111, params)
          _this.$JHttp({
            method: 'post',
            url: window.baseURL + '/socialactivity/saveJoinUser?' + querystring.stringify(params),
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            if (res.status === 100) {
              _this.$vux.toast.show({
                type: 'success',
                text: '添加成功'
              })
              _this.$router.go(-1)
            }
          }).catch(e => {
            console.log(e)
          })
        }
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .addPerson {
    .itemList{
      padding: 0 15px;
      .items{
        border-bottom: 0.5px solid #D8D8D8;
        font-size: 21px;
      }
      .avatar{
        span{
          font-size: 15px;
          color: #aaaaaa;
        }
        img{
          width: 35px;
          height: 35px;
          border: none;
          border-radius: 50%;
          margin-right: 20px;
        }
        .avatarInApp{
          .add01{
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .uploadPoster{
            position: absolute;
            left: 0;
            top: 0;
            clip: rect(0px, 0px, 0px, 0px);
            width: 100%;
            height: 100%;
          }
        }
      }
      .sexOption{
        .chooseSex{
          display: flex;
          border: 1px solid #0DAB60;
          border-radius: 5px;
          background-color: #ffffff;
          color: #0DAB60;
          font-size: 15px;
          width: 130px;
          span{
            width: 50%;
            height: 30px;
            line-height: 30px;
            text-align: center;
          }
          .selected{
            background-color: #0DAB60;
            color: #ffffff;
          }
        }
      }
    }
  }
  .identity{
    .list{
      padding: 0 15px;
    }
    .identities {
      display: flex;
      flex-direction: column;
      .li{
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 0.5px solid #D8D8D8;
        font-size: 16px;
        .block {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      .selected{
        background: url("../../../assets/images/check_icon_orange32.png") right no-repeat;
        background-size: 16px 16px;
      }
    }
  }
</style>
