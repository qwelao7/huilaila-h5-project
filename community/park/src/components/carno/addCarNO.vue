<template>
  <div class="addCarNO-wrapper">
    <loading v-model="isLoading"></loading>
    <j-tab :tabtitles="tabTitles"
           :cur-page="currentTab" v-on:setPage="setPage">
      <div class="tab-content-container">
        <div class="carNO">
          <j-input title="车牌:" v-model="commonCarNO" :maxLength="6" placeholder="请输入车牌号">
            <div slot="content-label" class="content-label" @click="showCarNOKeyboard">
              <span class="title" v-text="shortProvince"></span>
              <span class="icon"></span>
            </div>
          </j-input>
        </div>
        <div class="realName vux-1px-b">
          <j-input title="姓名:" v-model="realName" :maxLength="10" placeholder="请输入驾驶者姓名"></j-input>
        </div>
        <div class="phone">
          <j-input title="手机号:" v-model="phone" type="phone" :maxLength="11" placeholder="请输入手机号"></j-input>
        </div>
        <div class="btn-save">
          <j-button jText="确认提交" type="primary" :disabled="disabled" @click.native="saveCarNOInfo"></j-button>
        </div>
      </div>
      <div class="tab-content-container">
        <div class="carNO">
          <j-input title="车牌:" v-model="specialCarNO" :maxLength="10" placeholder="请输入车牌号"></j-input>
        </div>
        <div class="realName vux-1px-b">
          <j-input title="姓名:" v-model="realName" :maxLength="10" placeholder="请输入驾驶者姓名"></j-input>
        </div>
        <div class="phone">
          <j-input title="手机号:" v-model="phone" type="phone" :maxLength="11" value="13809871568"
                   placeholder="请输入手机号"></j-input>
        </div>
        <div class="btn-save">
          <j-button jText="确认提交" @click.native="saveCarNOInfo"></j-button>
        </div>
      </div>
    </j-tab>
    <!--车牌键盘begin-->
    <div>
      <popup v-model="carNOKeyboardShow">
        <carNO-keyboard :shortProvince="shortProvince" v-on:setShortProvince="setShortProvince"></carNO-keyboard>
      </popup>
    </div>
    <!--车牌键盘end-->
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import {getShortProvince} from '../../common/utils';
  import JTab from 'components/utils/tab/jtab';
  //  import {map} from '../../common/map';
  import router from '../../router';
  import {Popup} from 'vux';
  import JButton from 'components/utils/jbutton';
  import JInput from 'components/utils/jinput';
  import carNOKeyboard from 'components/utils/carNOKeyboard';
  import Toast from 'components/utils/toast/toast';
  /* 定义错误常亮begin **/
  /* eslint-disable no-unused-vars */
  // 车牌号的友情提示
  const carNOError = {
    commonCarNOError: {
      length: 6,
      errorMsg: '请输入正确的车牌号'
    },
    specialCarNOError: {
      min: 1,
      max: 10,
      errorMsg: '请输入正确的车牌号'
    }
  }
  // 姓名的友情提示
  const nameError = {
    min: 2,
    max: 10,
    errorMsg: '姓名请使用2-10位中英文'
  };
  // 手机号的友情提示
  const phoneError = {
    errorMsg: '请输入11位有效手机号'
  };
  /* 定义错误常亮end **/
  export default {
    name: 'addCarNO',
    created: function () {
      document.title = '新增车牌';
      this.shortProvince = this.currentProvince;
    },
    components: {
      Popup,
      'j-tab': JTab,
      'j-button': JButton,
      'j-input': JInput,
      'carNO-keyboard': carNOKeyboard
    },
    data () {
      return {
        shortProvince: '',
        tabTitles: ['普通车牌', '特殊车牌'],
        currentTab: 1,
        disabled: false,
        commonCarNO: '',
        specialCarNO: '',
        carNOKeyboardShow: false,
        realName: '',
        phone: ''
      }
    },
    computed: {
      ...mapState({
        isLoading: state => state.pageLoading.isLoading,
        currentProvince: state => getShortProvince(state.pageCfg.province.substr(0, 2))
      })
    },
    methods: {
      setPage: function (pageIndex) {
        this.currentTab = pageIndex;
      },
      showCarNOKeyboard: function () {
        this.carNOKeyboardShow = true;
      },
      setShortProvince: function (shortProvince) {
        this.shortProvince = shortProvince;
        this.carNOKeyboardShow = false;
      },
      // 校验车牌合法性
      checkCarNO: function () {
        if (this.currentTab === 1) { // 普通车牌
          let regp = /^[a-zA-Z0-9]+$/; // 英文和数字
          if (!this.shortProvince || this.commonCarNO.length !== carNOError.commonCarNOError.length || !regp.test(this.commonCarNO)) {
            Toast(carNOError.commonCarNOError.errorMsg); // TODO 提醒方式
            return false;
          } else {
            return true;
          }
        } else { // 特殊车牌
          let regp = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
          if (this.specialCarNO.length < carNOError.specialCarNOError.min || this.specialCarNO.length > carNOError.specialCarNOError.max || !regp.test(this.specialCarNO)) {
            Toast(carNOError.specialCarNOError.errorMsg); // TODO 提醒方式
            return false;
          } else {
            return true;
          }
        }
      },
      // 校验姓名合法性
      checkName: function (name) {
        let regp = /^[a-zA-Z\u4e00-\u9fa5]+$/;
        if (this.realName.length < nameError.min || this.realName.length > nameError.max || !regp.test(this.realName)) {
          Toast(nameError.errorMsg); // TODO 提醒方式
          return false;
        } else {
          return true;
        }
      },
      // 校验手机号合法性
      checkPhone: function (phone) {
        let regp = window.commonConfig.phoneRegp;
        if (!regp.test(this.phone)) {
          Toast(phoneError.errorMsg);
          return false;
        } else {
          return true;
        }
      },
      saveCarNOInfo: function () {
        // 防止重复提交,先置灰
        this.disabled = true;
        if (!this.checkCarNO()) {
          this.disabled = false;
          return;
        }
        if (!this.checkName()) {
          this.disabled = false;
          return;
        }
        if (!this.checkPhone()) {
          this.disabled = false;
          return;
        }
        // 调用新增车牌的接口
        let _this_ = this;
        let carNum = '';
        let type = 1;
        if (this.currentTab === 1) { // 普通车牌
          carNum = this.shortProvince + this.commonCarNO;
          type = 0;
        } else { // 特殊车牌
          carNum = this.specialCarNO;
          type = 1;
        }
        let postData = new FormData();
        postData.append('carNum', carNum);
        postData.append('driverMobile', this.phone);
        postData.append('driverName', this.realName);
        postData.append('type', type);
        this.$JHttp.post(window.homeURL + '/sharedPark/car', postData).then((res) => {
          if (res.data.status === 100) { // 新增车牌成功
            router.go(-1);
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
          _this_.disabled = false;
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
          _this_.disabled = false;
        });
      }
    },
    watch: {
      commonCarNO: function (val) {
        if (val) {
          this.commonCarNO = val.toUpperCase();
        }
      },
      specialCarNO: function (val) {
        if (val) {
          this.specialCarNO = val.toUpperCase();
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .addCarNO-wrapper {
    height: 100%;
    .tab-content-container {
      height: 100%;
      background-color: #ebebeb;
      padding-top: 0.4rem;
      .carNO, .realName, .phone {
        display: flex;
        height: 1.173333rem;
        padding: 0 0.4rem;
        background-color: #fff;
        text-align: left;
      }
      .carNO {
        margin-bottom: 0.213333rem;
        .content-label {
          display: flex;
          align-items: center;
          .title {
            font-size: 20px;
            font-weight: 600;
            margin-right: 0.08rem;
            white-space: nowrap;
          }
          .icon {
            display: inline-block;
            width: 0.586667rem;
            height: 0.586667rem;
            margin-right: 0.08rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url('../../assets/img/@2x/gray-icon-down.png');
          }
        }
      }
      .btn-save {
        width: 9.2rem;
        height: 1.12rem;
        margin: 0.4rem 0.4rem 0 0.4rem;
      }
    }
  }

  [data-dpr="2"]
  .addCarNO-wrapper {
    .tab-content-container {
      .carNO {
        .content-label {
          .title {
            font-size: 36px;
          }
        }
      }
    }
  }

  [data-dpr="3"]
  .addCarNO-wrapper {
    .tab-content-container {
      .carNO {
        .content-label {
          .title {
            font-size: 54px;
          }
          .icon {
            background-image: url('../../assets/img/@3x/gray-icon-down@3x.png');
          }
        }
      }
    }
  }
</style>
