<template>
  <div class="commonHeader personInfo">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="账户资料">
    </x-header>
    <div class="infoLi">
      <group class="normal no-margin-top">
        <cell-box is-link @click.native="chooseImg">
          <div class="avatar">
            <span>头像</span>
            <j-img :osskey="personalInfo.avatar" :custom-width="28" :custom-height="28"></j-img>
          </div>
        </cell-box>
        <cell-box @click.native="goVerifyName" is-link>
          <div>
            <span>姓名</span>
            <span class="name-wrapper">
              <span class="remark" v-text="personalInfo.nameRemark" :class="personalInfo.nameRemarkCss"></span>
              <span class="name" v-text="personalInfo.name"></span>
            </span>
          </div>
        </cell-box>
        <cell-box link="/nickName">
          <div>
            <span>昵称</span>
            <span v-text="personalInfo.nickName"></span>
          </div>
        </cell-box>
        <cell-box :link="'/modifyPhoneNum/' + personalInfo.mobilePhone">
          <div>
            <span>手机号</span>
            <span v-text="personalInfo.mobilePhone"></span>
          </div>
        </cell-box>
        <popup-picker style="padding: 5px 0" title="性别" popup-title="请选择性别" confirm-text="确定" :data="sexList" @on-hide="chooseSex" v-model="personalInfo.sex"></popup-picker>
        <datetime
          v-model="personalInfo.birthday"
          @on-confirm="chooseBirthday"
          @on-clear="clearValue"
          clear-text="清除"
          :minYear = "minYear"
          :end-date="endDate"
          ref="birthdayPicker"
          placeholder="请选择出生日期"
          title="出生日期"></datetime>
        <cell-box link="/QQ">
          <div>
            <span>QQ号</span>
            <span v-text="personalInfo.qq" v-if="personalInfo.qq !== ''"></span>
            <span v-if="personalInfo.qq === ''" style="color: #aaaaaa">{{notComplete}}</span>
          </div>
        </cell-box>
        <cell-box link="/weChat">
          <div>
            <span>微信号</span>
            <span v-html="personalInfo.wx" v-if="personalInfo.wx !== ''"></span>
            <span v-if="personalInfo.wx === ''" style="color: #aaaaaa">{{notComplete}}</span>
          </div>
        </cell-box>
      </group>
      <group class="tag">
        <cell-box link="/tag">
          <div>
            <span class="label-title">个性标签</span>
            <!--<span class="label-value" v-text="personalInfo.labels"></span>-->
            <span class="label-value" v-html="personalInfo.labels" v-if="personalInfo.labels !== ''"></span>
            <span v-if="personalInfo.labels === ''" style="color: #aaaaaa">{{notComplete}}</span>
          </div>
        </cell-box>
      </group>
      <group class="tag">
        <cell-box link="/payPassword">
          <div>
            <span>支付密码</span>
            <span class="name-wrapper">
              <span class="remark" :style="{color:isClass ? '#AAAAAA' : '#333'}" v-text="personalInfo.isPassword"></span>
            </span>
          </div>
        </cell-box>
      </group>
    </div>
  </div>
</template>
<script>
  import { XHeader, Cell, CellBox, Group, ViewBox, Datetime, PopupPicker } from 'vux'
  import { File } from '../../../common/js/Upload'
  import { JNavigator, jlDate } from '../../../common/js/utils'
  import { Base64 } from 'js-base64';
  import JImg from 'components/common/img/jImg'
  export default {
    name: 'personInfo',
    components: {
      XHeader,
      Cell,
      CellBox,
      Group,
      ViewBox,
      Datetime,
      PopupPicker,
      'j-img': JImg
    },
    data () {
      return {
        minYear: 1818,
        maxYear: 2218,
        endDate: jlDate.Dateformat(new Date().getTime(), 'YYYY-MM-DD'),
        isClass: false,
        personalInfo: {
          avatar: '',
          nameRemark: '未实名',
          isPassword: '未设置',
          nameRemarkCss: 'real-name-unapproved',
          verifyStatus: 3,
          name: '去完善',
          nickName: '',
          mobilePhone: '去完善',
          sex: ['去完善'],
          oldBirthday: '去完善',
          birthday: '去完善',
          qq: '去完善',
          wx: '去完善',
          labels: '去完善'
        },
        notComplete: '去完善',
        sexList: [['男', '女']]
      }
    },
    created: function () {
      this.getPersonalInfo();
    },
    methods: {
      getPersonalInfo () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/home/getUserInfoAndAsset'
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            let data = res.data;
            let labelList = data.labelList;
            let labelStr = '';
            if (labelList && labelList.length) {
              labelList.forEach(function (item) {
                labelStr += (item.label + '、');
              });
              labelStr = labelStr.substr(0, (labelStr.length - 1));
            }
            let sexInt = data.sex;
            let sex = ['去完善'];
            if (sexInt === 1) {
              sex = ['男'];
            } else if (sexInt === 2) {
              sex = ['女'];
            }
            let nameRemark = '';
            let isPassword = '';
            let nameRemarkCss = '';
            let realnameApproveStatus = data.realnameApproveStatus;
            if (realnameApproveStatus === 1) { // 已审核通过
              nameRemark = '已实名';
              nameRemarkCss = 'real-name-approved'
            } else {
              nameRemark = '未实名';
              nameRemarkCss = 'real-name-unapproved';
            }
            if (data.isSetPaymentPassword === true) {
              isPassword = '已设置';
              this.isClass = false;
            } else {
              this.isClass = true;
              isPassword = '未设置';
            }
            let personalInfo = {
              nickName: data.nickName,
              avatar: data.headPicName,
              nameRemark: nameRemark,
              isPassword: isPassword,
              nameRemarkCss: nameRemarkCss,
              name: data.userName,
              mobilePhone: data.mobileNum,
              sex: sex,
              oldBirthday: data.briefBirthday,
              birthday: data.briefBirthday,
              qq: data.qqNum,
              wx: data.weichatNum,
              labels: labelStr
            }
            _this_.personalInfo = {
              ..._this_.personalInfo,
              ...personalInfo
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
      chooseImg () {
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
                let file = File.dataURItoBlob(localData);
                _this_.uploadBlob([file], 'head', undefined, undefined, function (resList) {
                  let data = resList;
                  // 保存图片到业务方
                  _this_.$JHttp({
                    url: window.baseURL + '/user/modifyHeadPic?imageUrls=' + JSON.stringify(data),
                    method: 'post'
                  }).then(res => {
                    if (res.status === 100) {
                      _this_.$vux.toast.show({
                        type: 'success',
                        text: '头像修改成功'
                      });
                      _this_.personalInfo.avatar = data[0];
                    } else {
                      _this_.$vux.toast.show({
                        type: 'cancel',
                        text: res.msg
                      });
                    }
                  }).catch(error => {
                    console.error(error);
                  });
                })
              }
            });
          }
        });
      },
      goVerifyName () {
        this.$router.push('/verifiedName');
      },
      chooseSex (closeType) {
        // 表示完成
        if (closeType) {
          let sex = this.personalInfo.sex;
          let sexInt = 0;
          if (sex[0] === '男' || sex[0] === '去完善') {
            sexInt = 1;
          } else if (sex[0] === '女') {
            sexInt = 2;
          }
          let _this_ = this;
          _this_.$JHttp({
            method: 'put',
            url: window.baseURL + '/user/modifySex?sex=' + sexInt
          }).then(res => {
            let status = res.status;
            if (status === 100) {
              _this_.$vux.toast.show({
                type: 'success',
                text: '性别修改成功'
              });
              if (sexInt === 1) {
                _this_.personalInfo.sex = ['男'];
              } else {
                _this_.personalInfo.sex = ['女'];
              }
              return true;
            } else {
              _this_.$vux.toast.show({
                type: 'cancel',
                text: res.msg
              });
              return false;
            }
          }).catch(error => {
            console.error(error);
          })
        }
      },
      chooseBirthday () {
        this.$nextTick(function () {
          let _this_ = this;
          _this_.$JHttp({
            method: 'put',
            url: window.baseURL + '/user/modifyBirthday?birthday=' + this.personalInfo.birthday
          }).then(res => {
            let status = res.status;
            if (status === 100) {
              _this_.$vux.toast.show({
                type: 'success',
                text: '生日修改成功'
              });
            } else {
              _this_.$vux.toast.show({
                type: 'cancel',
                text: res.msg
              });
              // 修改失败,恢复为原有生日(显示问题)
              _this_.personalInfo.birthday = _this_.personalInfo.oldBirthday;
            }
          }).catch(error => {
            console.error(error);
          })
        })
      },
      clearValue () {
        this.personalInfo.birthday = ''
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .personInfo{
    height: 100%;
    background-color: #f7f7f7;
    .infoLi{
      .weui-cell{
        padding: 15px;
        font-size: 14px;
        div{
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-right: 20px;
        }
      }
      .normal{
        span{
          font-size: 14px;
        }
        .avatar{
          img{
            width: 28px;
            height: 28px;
            border-radius: 50%;
          }
        }
        .name-wrapper {
          display: flex;
          .remark {
            width: 50px;
            height: 25px;
            background-size: 100%;
            background-repeat: no-repeat;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
          }
          .real-name-unapproved {
            background-color: #aaa;
            color: #ffffff;
          }
          .real-name-approved {
            background-color: #0DAB60;
            color: #fff;
          }
          .name {
            height: 25px;
            display: flex;
            align-items: center;
          }
        }
        /*.sexBox, .timeBox {
          border-top: 0.5px solid #D8D8D8;
        }*/
      }
      .tag {
        .label-title {
          flex: 0 0 160px;
        }
        .label-value {
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
</style>
