<template>
  <div class="publishActivity commonHeader">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="{backText: ''}"
        title="发布活动"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;">
        <a slot="right" @click="publish" :class="{readyPublish: isOk}">发布</a><!---->
      </x-header>
      <div class="pubBanner">
        <ul class="choosePoster">
          <li class="poster" v-show="posters">
            <img :src="posters" alt="" @click.prevent="showMenu">
          </li>
          <li class="add" @click="choosePoster" v-show="!posters">
            <i></i>
            <span>添加活动海报</span>
          </li>
        </ul>
        <div class="options">
          <div class="beforeFee borderBtm">
            <group class="optionItem theme">
              <group-title slot="title" v-show="formItem.theme">主题</group-title>
              <x-input ref="theme" @on-focus="onFocusTheme" required :max="50" class="hasTop"
                       :class="{noTop: formItem.theme}" placeholder="主题" v-model="formItem.theme"></x-input>
            </group>
            <group class="optionItem">
              <group-title slot="title" v-show="formItem.ActivityStartTime">活动开始时间</group-title>
              <cell class="hasTop" :class="{noTop: formItem.ActivityStartTime}"
                    :title="formItem.ActivityStartTime || activityStart" is-link
                    @click.native="showActivityStart"></cell>
            </group>
            <group class="optionItem">
              <group-title slot="title" v-show="formItem.ActivityEndTime">活动结束时间</group-title>
              <cell class="hasTop" :class="{noTop: formItem.ActivityEndTime}"
                    :title="formItem.ActivityEndTime || activityEnd" is-link @click.native="showActivityEnd"></cell>
            </group>

          </div>
          <span class="ps" v-show="formItem.needSignerDetail">注：为是时，报名时参与人需填写详细个人信息</span>
          <div class="beforeFee">
            <group class="optionItem specialItem">
              <x-switch title="收取报名费：" v-model="formItem.needFee"></x-switch>
            </group>
            <group class="optionItem fee" v-show="formItem.needFee">
              <group-title slot="title" v-show="formItem.registeryFee">报名费</group-title>
              <cell class="hasTop" :class="{noTop: formItem.registeryFee}" :title="tips || fee" is-link
                    @click.native="showFeePopup">
                <!--<span slot="title">{{tips}}</span>-->
              </cell>
            </group>
          </div>
          <span class="ps" v-show="formItem.needFee">注：报名结束后您可提取报名费用，提取后将不可取消活动</span>
          <div class="afterFee">
            <group class="optionItem">
              <group-title slot="title" v-show="formItem.ActivityAddress">活动地点</group-title>
              <x-input ref="address" @on-focus="onFocusAddress" required :max="50" class="hasTop"
                       :class="{noTop: formItem.ActivityAddress}" placeholder="活动地点" v-model="formItem.ActivityAddress"
                       @on-change="onChange"></x-input>
            </group>
            <group class="optionItem description">
              <x-textarea :max="500" :show-counter="false" placeholder="描述一下您活动的具体内容，如主题、形式、特别注意事项等..."
                          v-model="formItem.ActivityDescription" :rows="2" ref="content"
                          @on-focus="onFocusContent"></x-textarea>
            </group>
            <ul class="chooseImg">
              <li v-for="(imgList, index) in imgList">
                <img :src="imgList" @click="showDeletePop(index)" alt="">
              </li>
              <li class="add" @click="chooseImages" v-show="imgList.length < 9"></li>
            </ul>
          </div>
          <div class="spacing-container"></div>
          <div class="optionItem extraOptions" @click="onExtra">
            <group-title slot="title" class="extraText">更多设置</group-title>
            <x-icon type="ios-arrow-down" class="arrow-down" v-show="extraOptions"></x-icon>
            <x-icon type="ios-arrow-up" class="arrow-down" v-show="!extraOptions"></x-icon>
          </div>
          <div class="afterFee" v-show="!extraOptions">
            <group class="optionItem">
              <group-title slot="title" v-show="formItem.signStartTime">报名开始时间</group-title>
              <cell class="hasTop" :class="{noTop: formItem.signStartTime}" :title="formItem.signStartTime || signStart"
                    is-link @click.native="showSignStart"></cell>
            </group>
            <group class="optionItem">
              <group-title slot="title" v-show="formItem.signEndTime">报名结束时间</group-title>
              <cell class="hasTop" :class="{noTop: formItem.signEndTime}" :title="formItem.signEndTime || signEnd"
                    is-link @click.native="showSignEnd"></cell>
            </group>
            <group class="optionItem">
              <group-title slot="title" v-show="formItem.limitCounter">报名人数限制（不填默认无限制）</group-title>
              <x-input ref="limitCount" :max="5" class="hasTop" :class="{noTop: formItem.limitCounter}" type="tel"
                       placeholder="报名人数限制（不填默认无限制）" v-model="formItem.limitCounter" @on-change="onInput"></x-input>
            </group>
            <group class="optionItem specialItem" :class="{needDetail: formItem.needSignerDetail}">
              <x-switch title="需要报名人详细信息：" v-model="formItem.needSignerDetail"></x-switch>
            </group>
            <group class="optionItem specialItem">
              <x-switch title="仅限本小区业主报名：" v-model="formItem.isLimited"></x-switch>
            </group>
          </div>
          <div class="spacing-container" v-show="!extraOptions"></div>
          <div class="afterFee extraSheet" v-show="!extraOptions">
            <group class="optionItem ">
              <group-title>报名表单设置</group-title>
            </group>
            <group class="optionItem" v-for="(item,index) in extraInfo">
              <cell>
                <span slot="title" class="extraAddTitle">{{item}}</span>
                <x-icon type="ios-close" class="cell-x-icon" @click="deleteExtra(index)"></x-icon>
              </cell>
            </group>
            <group class="optionItem extraOptionsAdd">
              <group-title slot="title" class="extraAdd" @click.native="onExtraAdd">+添加字段</group-title>
            </group>
          </div>

        </div>

      </div>
    </view-box>
    <div v-transfer-dom>
      <actionsheet :menus="menus" @on-click-menu-menu="changeImg" v-model="showChangeMenu" show-cancel></actionsheet>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="delMenu" @on-click-menu-menu="deleteImg" v-model="showDeleteMenu" show-cancel></actionsheet>
    </div>
    <div v-transfer-dom>
      <popup v-model="showSignFee" height="100%" style="background-color: #F2F2F2;">
        <div class="feePopup">
          <x-header
            slot="header"
            :left-options="popupOpt"
            title="报名费"
            @on-click-back="showSignFee = false">
          </x-header>
          <div class="bannerFee">
            <group class="feeNum">
              <group-title slot="title" v-show="feeNumber">金额（元/人）</group-title>
              <x-input class="hasTop" :class="{noTop: feeNumber}" type="number" placeholder="金额（元/人）"
                       @on-change="inputFee" :is-type="amount" v-model="feeNumber"></x-input>
            </group>
            <div class="reFound">
              <!--<span class="title">退款方式：</span>
              <ul class="radioSelect"> @on-change="inputFee"
                <li v-for="(item, index) in reFoundSelection" @click="chooseReFoundWay(item, index)">
                  <span>{{item.value}}</span>
                  <i :class="{checked: isCheck}"></i>
                </li>
              </ul>-->
              <group title="退款方式：">
                <radio :options="reFoundSelection" @on-change="chooseReFoundWay" v-model="formItem.reFundWay"></radio>
              </group>
            </div>
            <div class="confirm">
              <x-button type="primary" @click.native="saveFeeWay">保存</x-button>
            </div>
          </div>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
        <span class="delete-info vux-1px-b">您尚未绑定手机号</span>
        <div class="operate-wrapper">
          <span class="text vux-1px-r" @click="bindSoon">以后再说</span>
          <span class="text" @click="goBindPhone">前往绑定</span>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="isPublish"
                :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
        <br>
        <div style="display: flex;align-items: center;justify-content: center">
          <p style="font-size:16px;color:#fff;margin-right: 10px">{{pubText}}</p>
          <spinner type="dots"></spinner>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import {
    ViewBox,
    XHeader,
    XInput,
    XButton,
    XTextarea,
    Actionsheet,
    Popup,
    TransferDom,
    Group,
    Cell,
    GroupTitle,
    Datetime,
    XSwitch,
    Radio,
    XDialog,
    Spinner,
    querystring,
    ConfirmPlugin,
    DatetimePlugin
  } from 'vux'
  import {jlDate} from 'common/js/utils';
  import {File} from '../../common/js/Upload'
  import {JNavigator} from '../../common/js/utils'

  export default {
    name: 'pub_activity',
    directives: {
      TransferDom
    },
    components: {
      ViewBox,
      XHeader,
      XInput,
      XButton,
      Actionsheet,
      Popup,
      XTextarea,
      Cell,
      XDialog,
      Datetime,
      XSwitch,
      Radio,
      Group,
      GroupTitle,
      Spinner,
      ConfirmPlugin,
      DatetimePlugin
    },
    data () {
      return {
        isOk: false,
        uploadData1: new FormData(),
        posters: '',
        poster: '',
        showChangeMenu: false,
        menus: {
          menu: '更换海报'
        },
        delMenu: {
          menu: '删除'
        },
        showDeleteMenu: false,
        currentIndex: 0,
        signStartMin: jlDate.Dateformat(new Date().getTime(), 'YYYY-MM-DD'),
        signStartHour: new Date().getHours(),
        signStartMax: jlDate.Dateformat(jlDate.addDays(new Date(), 180).getTime(), 'YYYY-MM-DD'),
        signEndMin: '',
        signEndMax: '',
        activityStartMin: '',
        activityStartMax: '',
        activityEndMin: '',
        activityEndMax: '',
        formItem: {
          theme: '',
          signStartTime: '',
          signEndTime: '',
          limitCounter: '',
          counter: '',
          needSignerDetail: false,
          needFee: false,
          registeryFee: '',
          reFundWay: 1,
          isLimited: false,
          ActivityStartTime: '',
          ActivityEndTime: '',
          ActivityAddress: '',
          ActivityDescription: ''
        },
        signStart: '报名开始时间',
        signEnd: '报名结束时间',
        activityStart: '活动开始时间',
        activityEnd: '活动结束时间',
        fee: '报名费',
        tips: '',
        showSignFee: false,
        popupOpt: {
          backText: '',
          preventGoBack: true
        },
        feeNumber: '',
        reFoundSelection: [
          {
            key: 0,
            value: '报名结束前均可退款'
          },
          {
            key: 1,
            value: '不支持退款'
          }
        ],
        isCheck: false,
        imgList: [],
        imgLists: [],
        communityId: '',
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        },
        isPublish: false,
        pubText: '活动发布中',
        extraOptions: true,
        extraInfo: []
      }
    },
    created () {
      this.uploadData1.append('type', 'nei');
      this.communityId = localStorage.getItem('communityId');
//      console.log(3333, Number(true))
      this.validate()
      this.formItem.signStartTime = jlDate.Dateformat(new Date(), 'YYYY-MM-DD HH:mm')
    },
    methods: {
      choosePoster () {
        let _this_ = this;
        let count = _this_.posters.length;
        let leftCount = 1 - count;
        this.$wechat.chooseImage({
          count: 1, // 默认9
          success: function (res) {
            _this_.posters = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
//            let posterLen = _this_.posters.length;
            _this_.$wechat.getLocalImgData({
              localId: _this_.posters, // 图片的localID
              success: function (res) {
                let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                if (JNavigator.isAndroid()) {
                  localData = 'data:image/jgp;base64,' + localData;
                }
                let file = File.dataURItoBlob(localData);
                let uploadData = new FormData();
                uploadData.append('type', 'nei');
                uploadData.append('files', file.blob, file.fileName); // blob对象,自己手动加上文件名
                _this_.$JHttp.post(window.uploadURL + '/upload', uploadData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                }).then(res => {
                  if (res.status === 100) {
                    _this_.poster = res.data[0];
                    console.log(666, _this_.poster);
                  }
                })
              }
            });
          }
        });
      },
      showMenu () {
        this.showChangeMenu = true
      },
      changeImg () {
        this.choosePoster()
      },
      cancel () {
        console.log('cancel')
      },
      showSignStart () {
        let _this = this;
        _this.$vux.datetime.show({
          cancelText: '取消',
          clearText: '清除',
          confirmText: '确定',
          format: 'YYYY-MM-DD HH:mm',
          value: _this.formItem.signStartTime,
          startDate: _this.signStartMin,
          endDate: _this.signStartMax,
//          minHour: _this.signStartHour,
          yearRow: '{value}年',
          monthRow: '{value}月',
          dayRow: '{value}日',
          hourRow: '{value}时',
          minuteRow: '{value}分',
          onConfirm (val) {
            // 修改验证
            // let timeVal = val.replace(/-/g, '/');
            if (!_this.formItem.signEndTime) {
              // if (new Date().getTime() >= new Date(timeVal).getTime()) {
              //   _this.$vux.toast.show({
              //     type: 'text',
              //     text: '报名时间不得早于当前时间'
              //   })
              // } else {
              _this.formItem.signStartTime = val;
              let time = _this.formItem.signStartTime.replace(new RegExp('-', 'gm'), '/');
              _this.signEndMin = jlDate.Dateformat(jlDate.addMinutes(new Date(time), 1), 'YYYY-MM-DD HH:mm');
              _this.signEndMax = jlDate.Dateformat(jlDate.addDays(new Date(time), 180), 'YYYY-MM-DD HH:mm');
              // }
            } else {
              let time = val.replace(/-/g, '/');
              let time1 = _this.formItem.signEndTime.replace(/-/g, '/');
              if (new Date(time1).getTime() <= new Date(time).getTime()) {
                _this.$vux.toast.show({
                  type: 'text',
                  text: '报名开始时间必须小于报名结束时间'
                })
              } else {
                // if (new Date().getTime() >= new Date(timeVal).getTime()) {
                //   _this.$vux.toast.show({
                //     type: 'text',
                //     text: '报名时间不得早于当前时间'
                //   })
                // } else {
                _this.formItem.signStartTime = val;
                let time = _this.formItem.signStartTime.replace(new RegExp('-', 'gm'), '/');
                _this.signEndMin = jlDate.Dateformat(jlDate.addMinutes(new Date(time), 1), 'YYYY-MM-DD HH:mm');
                _this.signEndMax = jlDate.Dateformat(jlDate.addDays(new Date(time), 180), 'YYYY-MM-DD HH:mm');
                // }
              }
            }
          },
          onClear () {
            _this.formItem.signStartTime = ''
          }
        })
      },
      showSignEnd () {
        if (!this.formItem.signStartTime) {
          this.$vux.toast.show({
            type: 'text',
            text: '请先选择报名开始时间'
          })
        } else {
          let _this = this;
          _this.$vux.datetime.show({
            cancelText: '取消',
            clearText: '清除',
            confirmText: '确定',
            format: 'YYYY-MM-DD HH:mm',
            value: _this.formItem.signEndTime,
            startDate: _this.signEndMin,
            endDate: _this.signEndMax,
            yearRow: '{value}年',
            monthRow: '{value}月',
            dayRow: '{value}日',
            hourRow: '{value}时',
            minuteRow: '{value}分',
            onConfirm (val) {
              let time = val.replace(/-/g, '/');
              let time1 = _this.formItem.signStartTime.replace(/-/g, '/');
              if (new Date(time).getTime() <= new Date(time1).getTime()) {
                _this.$vux.toast.show({
                  type: 'text',
                  text: '报名结束时间必须大于报名开始时间'
                })
              } else {
                if (!_this.formItem.ActivityStartTime) {
                  _this.formItem.signEndTime = val;
                  let time = _this.formItem.signEndTime.replace(new RegExp('-', 'gm'), '/');
                  _this.activityStartMin = jlDate.Dateformat(jlDate.addMinutes(new Date(time), 1), 'YYYY-MM-DD HH:mm');
                  _this.activityStartMax = jlDate.Dateformat(jlDate.addDays(new Date(time), 180), 'YYYY-MM-DD HH:mm');
                } else {
                  let startTime = _this.formItem.ActivityStartTime.replace(new RegExp('-', 'gm'), '/');
                  if (new Date(time).getTime() >= new Date(startTime).getTime()) {
                    _this.$vux.toast.show({
                      type: 'text',
                      text: '报名结束时间不得大于活动开始时间'
                    })
                  } else {
                    _this.formItem.signEndTime = val;
                    let time = _this.formItem.signEndTime.replace(new RegExp('-', 'gm'), '/');
                    _this.activityStartMin = jlDate.Dateformat(jlDate.addMinutes(new Date(time), 1), 'YYYY-MM-DD HH:mm');
                    _this.activityStartMax = jlDate.Dateformat(jlDate.addDays(new Date(time), 180), 'YYYY-MM-DD HH:mm');
                  }
                }
              }
            },
            onClear () {
              _this.formItem.signEndTime = ''
            }
          })
        }
      },
      onInput (value) {
        let regu = /^[1-9]\d*$/;
        console.log(regu.test(value));
        if (!regu.test(value)) {
          this.$vux.toast.show({
            type: 'text',
            text: '输入正确的数字'
          })
        }
      },
      showActivityStart () {
        if (!this.formItem.theme) {
          this.$vux.toast.show({
            type: 'text',
            text: '请先添加主题'
          })
        } else {
          let _this = this;
          _this.$vux.datetime.show({
            cancelText: '取消',
            clearText: '清除',
            confirmText: '确定',
            format: 'YYYY-MM-DD HH:mm',
            value: _this.formItem.ActivityStartTime,
            startDate: _this.activityStartMin,
            endDate: _this.activityStartMax,
//            minHour: _this.signStartHour,
            yearRow: '{value}年',
            monthRow: '{value}月',
            dayRow: '{value}日',
            hourRow: '{value}时',
            minuteRow: '{value}分',
            onConfirm (val) {
              let time = val.replace(/-/g, '/');
              let time1 = _this.formItem.signEndTime.replace(/-/g, '/');
              if (new Date(time).getTime() <= new Date(time1).getTime()) {
                _this.$vux.toast.show({
                  type: 'text',
                  text: '活动开始时间需大于报名结束时间'
                })
              } else {
                if (!_this.formItem.ActivityEndTime) {
                  _this.formItem.ActivityStartTime = val;
                  if (!_this.formItem.signEndTime) {
                    _this.formItem.signEndTime = val;
                  }
                  let time = _this.formItem.ActivityStartTime.replace(new RegExp('-', 'gm'), '/');
                  _this.activityEndMin = jlDate.Dateformat(jlDate.addMinutes(new Date(time), 1), 'YYYY-MM-DD HH:mm');
                  _this.activityEndMax = jlDate.Dateformat(jlDate.addDays(new Date(time), 180), 'YYYY-MM-DD HH:mm');
                } else {
                  let endTime = _this.formItem.ActivityEndTime.replace(new RegExp('-', 'gm'), '/');
                  if (new Date(time).getTime() >= new Date(endTime).getTime()) {
                    _this.$vux.toast.show({
                      type: 'text',
                      text: '活动开始时间不得大于活动结束时间'
                    })
                  } else {
                    _this.formItem.ActivityStartTime = val;
                    if (!_this.formItem.signEndTime) {
                      _this.formItem.signEndTime = val;
                    }
                    let time = _this.formItem.ActivityStartTime.replace(new RegExp('-', 'gm'), '/');
                    _this.activityEndMin = jlDate.Dateformat(jlDate.addMinutes(new Date(time), 1), 'YYYY-MM-DD HH:mm');
                    _this.activityEndMax = jlDate.Dateformat(jlDate.addDays(new Date(time), 180), 'YYYY-MM-DD HH:mm');
                  }
                }
              }
            },
            onClear () {
              _this.formItem.ActivityStartTime = ''
            }
          })
        }
      },
      showActivityEnd () {
        if (!this.formItem.ActivityStartTime) {
          this.$vux.toast.show({
            type: 'text',
            text: '请先选择活动开始时间'
          })
        } else {
          let _this = this;
          _this.$vux.datetime.show({
            cancelText: '取消',
            clearText: '清除',
            confirmText: '确定',
            format: 'YYYY-MM-DD HH:mm',
            value: _this.formItem.ActivityEndTime,
            startDate: _this.activityEndMin,
            endDate: _this.activityEndMax,
//            minHour: _this.signStartHour,
            yearRow: '{value}年',
            monthRow: '{value}月',
            dayRow: '{value}日',
            hourRow: '{value}时',
            minuteRow: '{value}分',
            onConfirm (val) {
              let time = val.replace(/-/g, '/');
              let time1 = _this.formItem.ActivityStartTime.replace(/-/g, '/');
              if (new Date(time).getTime() <= new Date(time1).getTime()) {
                _this.$vux.toast.show({
                  type: 'text',
                  text: '活动结束时间必须大于活动开始时间'
                })
              } else {
                _this.formItem.ActivityEndTime = val;
              }
            },
            onClear () {
              _this.formItem.ActivityEndTime = ''
            }
          })
        }
      },
      chooseImages () {
        let _this_ = this;
        let count = this.imgList.length;
        let leftCount = 9 - count;
        this.$wechat.chooseImage({
          count: leftCount, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            _this_.imgList = _this_.imgList.concat(res.localIds); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          }
        });
      },
      showDeletePop (index) {
        this.showDeleteMenu = true;
        this.currentIndex = index;
      },
      deleteImg () {
        this.imgList.splice(this.currentIndex, 1);
      },
      showFeePopup () {
        this.showSignFee = true
      },
      chooseReFoundWay (value, label) {
        console.log(value, label);
        this.formItem.reFundWay = value;
      },
      inputFee (value) {
        console.log(value)
        if (!value.trim()) {
          this.$vux.toast.show({
            type: 'text',
            text: '报名费用不能为空'
          })
        } else if (value <= 0) {
          this.$vux.toast.show({
            type: 'text',
            text: '金额需大于等于0.01元'
          })
        }
      },
      amount (v) {
        return {
          valid: /^\d+(\.\d{1,2})?$/.test(v),
          msg: '请输入两位小数'
        }
      },
      saveFeeWay () {
        if (!this.feeNumber || !this.feeNumber.trim()) {
          this.$vux.toast.show({
            type: 'text',
            text: '请输入正确的报名费用'
          })
        } else if (this.feeNumber <= 0) {
          this.$vux.toast.show({
            type: 'text',
            text: '金额需大于等于0.01元'
          })
        } else {
          let reg = /^\d+(\.\d{1,2})?$/
          if (!reg.test(this.feeNumber)) {
            this.$vux.toast.show({
              type: 'text',
              text: '请输入两位小数'
            })
            return
          }
//          console.log(this.feeNumber, this.formItem.reFundWay);
          this.showSignFee = false;
          this.formItem.registeryFee = this.feeNumber
          if (!this.formItem.reFundWay) {
            this.tips = '¥' + this.feeNumber + '/人（报名结束前均可退款）'
          } else {
            this.tips = '¥' + this.feeNumber + '/人（不支持退款）'
          }
        }
      },
      onChange (value) {
        if (value.trim()) {
          this.isOk = true
        }
      },
      onFocusTheme () {
        if (!this.posters.length) {
          this.$vux.toast.show({
            type: 'text',
            text: '请上传活动海报'
          });
          this.$refs.theme.blur()
        }
      },
      onFocusAddress () {
        if (!this.formItem.ActivityEndTime) {
          this.$vux.toast.show({
            type: 'text',
            text: '请选择活动结束时间'
          });
          this.$refs.address.blur()
        }
      },
      onFocusContent () {
        if (!this.formItem.ActivityAddress.trim()) {
          this.$vux.toast.show({
            type: 'text',
            text: '请输入活动地点'
          });
        }
      },
      publish () {
        let _this = this;
        let token = localStorage.getItem('token');
        if (!token) {
          this.deleteModalShow = true;
        } else {
          _this.isPublish = true
          if (!_this.posters.length) {
            _this.isPublish = false
            _this.$vux.toast.show({
              type: 'text',
              text: '请上传活动海报'
            });
            return
          }
          if (!_this.formItem.theme.trim()) {
            _this.isPublish = false
            _this.$vux.toast.show({
              type: 'text',
              text: '请输入主题'
            });
            return
          }
          if (!_this.formItem.signStartTime) {
            _this.isPublish = false
            _this.$vux.toast.show({
              type: 'text',
              text: '请选择报名时间'
            });
            return
          } else {
            let signStart = _this.formItem.signStartTime.replace(/-/g, '/');
            let signEnd = _this.formItem.signEndTime.replace(/-/g, '/');
            let signStartTime = new Date(signStart).getTime()
            let signEndTime = new Date(signEnd).getTime()
            // let now = new Date().getTime()
            // if (signStartTime <= now) {
            //   _this.isPublish = false
            //   _this.$vux.toast.show({
            //     type: 'text',
            //     text: '报名时间不得早于当前时间'
            //   });
            //   return
            // }
            if (signEndTime <= signStartTime) {
              _this.isPublish = false
              _this.$vux.toast.show({
                type: 'text',
                text: '报名结束时间不得早于报名开始时间'
              });
              return
            }
          }
          if (_this.formItem.limitCounter && !/^[1-9]\d*$/.test(_this.formItem.limitCounter)) {
            _this.isPublish = false
            _this.$vux.toast.show({
              type: 'text',
              text: '输入正确的数字'
            });
            return
          }
          if (!_this.formItem.ActivityStartTime) {
            _this.isPublish = false
            _this.$vux.toast.show({
              type: 'text',
              text: '请选择活动时间'
            });
            return
          }
          if (!_this.formItem.ActivityAddress.trim()) {
            _this.isPublish = false
            _this.$vux.toast.show({
              type: 'text',
              text: '请输入活动地点'
            });
            return
          }
          if (!_this.formItem.ActivityDescription.trim()) {
            _this.isPublish = false
            _this.$vux.toast.show({
              type: 'text',
              text: '请输入活动内容'
            });
            return
          }
          let img = _this.imgList
          let imgLen = img.length;
          console.log(777, imgLen)
          if (imgLen) {
            img.forEach(function (imgId, index) {
              _this.$wechat.getLocalImgData({
                localId: imgId, // 图片的localID
                success: function (res) {
                  let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                  if (JNavigator.isAndroid()) {
                    localData = 'data:image/jgp;base64,' + localData;
                  }
                  let file = File.dataURItoBlob(localData);
//                  _this.uploadData1 = new FormData();
//                  _this.uploadData1.append('type', 'nei');
                  _this.uploadData1.append('files', file.blob, file.fileName); // blob对象,自己手动加上文件名
                  // 合成完最后一个,开始上传
                  if (index === imgLen - 1) {
                    _this.$JHttp.post(window.uploadURL + '/upload', _this.uploadData1, {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    }).then(res => {
                      if (res.status === 100) {
                        console.log(888, res.data)
//                        _this.imgLists = res.data;
                        console.log(111, _this.formItem.theme)
                        let params = {
                          activityName: _this.formItem.theme,
                          activityPicture: _this.poster,
                          picList: res.data,
                          activityAddress: _this.formItem.ActivityAddress,
                          limitCount: _this.formItem.limitCounter || 0,
                          activityApplyStartDate: _this.formItem.signStartTime,
                          activityApplyEndDate: _this.formItem.signEndTime,
                          activityStartDate: _this.formItem.ActivityStartTime,
                          activityEndDate: _this.formItem.ActivityEndTime,
                          content: _this.formItem.ActivityDescription,
                          needUserDetail: Number(_this.formItem.needSignerDetail),
                          joinType: Number(_this.formItem.needFee),
                          joinMoney: _this.formItem.registeryFee || 0,
                          refundType: Number(_this.formItem.reFundWay),
                          joinOtherCommunity: Number(_this.formItem.isLimited),
                          formColumns: _this.extraInfo
                        };
                        console.log(222, params)
                        _this.pubActivity(params)
                      } else {
                        _this.$vux.toast.show({
                          type: 'text',
                          text: '发布失败，请稍后重试'
                        })
                        _this.$router.go(-1)
                      }
                    })
                  }
                }
              });
            })
          } else {
            let params = {
              activityName: _this.formItem.theme,
              activityPicture: _this.poster,
              picList: [],
              activityAddress: _this.formItem.ActivityAddress,
              limitCount: _this.formItem.limitCounter || 0,
              activityApplyStartDate: _this.formItem.signStartTime,
              activityApplyEndDate: _this.formItem.signEndTime,
              activityStartDate: _this.formItem.ActivityStartTime,
              activityEndDate: _this.formItem.ActivityEndTime,
              content: _this.formItem.ActivityDescription,
              needUserDetail: Number(_this.formItem.needSignerDetail),
              joinType: Number(_this.formItem.needFee),
              joinMoney: _this.formItem.registeryFee || 0,
              refundType: Number(_this.formItem.reFundWay),
              joinOtherCommunity: Number(_this.formItem.isLimited),
              formColumns: _this.extraInfo
            };
            console.log(222, params)
            _this.pubActivity(params)
          }
        }
      },
      pubActivity (params) {
        console.log(123)
        let _this = this;
        _this.$JHttp({
          method: 'post',
          // url: window.baseURL + '/socialactivity/addActivit?' + querystring.stringify(params),
          url: window.baseURL + '/socialactivity/addActivit',
          headers: {
            defCommunityId: _this.communityId
          },
          data: params
        }).then(res => {
          _this.isPublish = false
          if (res.status === 100) {
            _this.$vux.toast.show({
              type: 'success',
              text: '发布成功'
            })
          } else {
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
          _this.$router.go(-1)
        }).catch(err => {
          _this.isPublish = false
          console.log(err)
        })
      },
      goBindPhone () {
        this.$router.push('/Login')
      },
      bindSoon () {
        this.$router.push('/')
      },
      validate () {
        let token = localStorage.getItem('token');
        if (!token) {
          this.deleteModalShow = true;
        } else {
          let _this = this;
          _this.$JHttp({
            method: 'get',
            url: window.baseURL + '/socialactivity/getCanAddActivity',
            headers: {
              defCommunityId: localStorage.getItem('communityId')
            }
          }).then(res => {
            if (res.status === 100) {
              //
              if (!res.data) {
                _this.$vux.toast.show({
                  type: 'text',
                  text: '对不起，您没有权限进行此项操作！'
                })
                this.$router.push('/')
              }
            }
          }).catch(err => {
            console.log(err)
          })
        }
      },
      onExtra () {
        this.extraOptions = !this.extraOptions
      },
      onExtraAdd () {
        let _this = this;
        this.$vux.confirm.prompt('请输入需要增加的字段', {
          title: '新增字段',
          onConfirm (msg) {
            _this.extraInfo.push(msg)
          }
        })
      },
      deleteExtra (index) {
        let _this = this;
        _this.extraInfo.splice(index, 1)
      }
    }
  }
</script>
<style>
  .readyPublish {
    color: #0DAB60 !important;
  }

  .vux-spinner {
    fill: #fff !important;
    stroke: #fff !important;
  }

  .cell-x-icon {
    fill: #64a36c
  }
</style>
<style type="text/less" lang="less" scoped>
  .publishActivity {
    position: relative;
    height: 100%;
    .pubBanner {
      height: 100%;
      width: 100%;
      position: relative;
      .choosePoster {
        li {
          width: 100%;
          height: 214px;
          overflow: hidden;
          display: flex;
          align-items: center;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .add {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          i {
            width: 35px;
            height: 35px;
            background-image: url("../../assets/images/plus_70.png");
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            /*<!--background: url("../../assets/images/plus_70.png") center no-repeat / contain;-->*/
          }
          span {
            margin-top: 15px;
            font-size: 15px;
            color: #aaaaaa;
          }
        }
      }
      .options {
        .beforeFee, .afterFee {
          padding: 0 15px;
        }
        .ps {
          padding: 15px 15px 25px 15px;
          background-color: #f5f5f5;
          font-size: 12px;
          color: #aaaaaa;
        }
        .optionItem {
          background-color: #ffffff;
          height: 55px;
          line-height: 55px;
          padding: 15px 0 15px 5px;
          border-bottom: 0.5px solid #D8D8D8;
          font-size: 21px;
        }
        .fee {
          border-bottom: none;
        }
        .theme {
          border-top: 0.5px solid #D8D8D8;
        }
        .description {
          border-bottom: none;
        }
        .specialItem {
          width: 100%;
          display: flex;
          align-items: center;
          /*padding: 18px 0*/
        }
        .needDetail {
          border-bottom: none;
        }
        .spacing-container {
          width: 100%;
          height: 10px;
          background-color: #f5f5f5;
        }
        .extraOptions, .extraOptionsAdd {
          text-align: center;
          padding: 15px 0;
          .extraText, .extraAdd {
            font-size: 21px;
            padding: 0;
            line-height: 36px;
          }
          .arrow-down, .arrow-up {
            fill: #aaa;
          }
        }
        .extraOptionsAdd {
          padding-bottom: 0;
        }
      }
      .chooseImg {
        display: flex;
        flex-wrap: wrap;
        /*justify-content: space-between;*/
        align-items: center;
        padding: 10px 0;
        padding-bottom: 30px;
        li {
          width: 105px;
          height: 105px;
          margin-left: 15px;
          margin-top: 15px;
          overflow: hidden;
          display: flex;
          align-items: center;
          img {
            width: 100%;
            height: 100%;
          }
        }
        li:nth-child(3n + 1) {
          margin-left: 0;
        }
        .add {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 103px;
          height: 103px;
          background-image: url("../../assets/images/addpic-210.png");
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          /*background: url("../../assets/images/addpic-210.png") center no-repeat / contain;*/
        }
      }
    }
    .hasTop {
      margin-top: 26px;
    }
    .noTop {
      margin-top: 0;
      .noTop {
        margin-top: 0;
        .vux-label {
          color: #333333 !important;
        }
      }
    }

  }

  .extraSheet {
    .weui-cells__title, .extraAddTitle {
      color: #333 !important;
      font-size: 21px;
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
        width: 50%;
        height: 100%;
        line-height: 50px;
        color: #18adfb;
        font-size: 16px;
      }
    }
  }
</style>
