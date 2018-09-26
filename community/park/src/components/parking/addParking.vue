<template>
  <div class="add-parking-wrapper">
    <j-loading v-model="isLoading"></j-loading>
    <div class="parking-info">
      <div class="fees-wrapper vux-1px-b">
        <div class="left">停车费:</div>
        <div class="right" @click="showAllocationModal">
          <span class="value" v-text="rent + rentUnit"></span>
          <span class="icon"></span>
        </div>
      </div>
      <div class="parkingNO-wrapper vux-1px-b">
        <div class="left">车位号:</div>
        <div class="right" @click="selectParkingNO">
          <span class="value" v-text="currentParking.parkingNO"></span>
          <span class="icon"></span>
        </div>
      </div>
    </div>
    <div class="parking-upload">
      <div class="title" @click="showParkingPicsModal">
        <span class="text">请上传车位证明(最多3张):</span>
        <span class="icon"></span>
      </div>
      <div class="parking-pics vux-1px-b"> <!--上传车位证明-->
        <upload-parking :parkingPics="currentParking.parkingPics"></upload-parking>
      </div>
      <div class="title">
        <span class="text">请上传本人身份证照片(正反面):</span>
      </div>
      <div class="id-pics vux-1px-b">
        <upload-id :idPics="currentParking.idPics"></upload-id> <!--上传身份证照片-->
      </div>
    </div>
    <div class="protocol-wrapper">
      <span class="text">我同意</span>
      <span class="text-protocol" @click="linkToProtocol">《车位共享协议》</span>
    </div>
    <div class="save-wrapper" @click="saveParkingInfo">
      <j-button type="primary" jText="确认提交"></j-button>
    </div>
    <!--停车费用分成Modal begin-->
    <x-dialog v-model="allocationModalShow" :dialog-style="allocationDialogStyle" hide-on-blur>
      <span class="delete-text">停车费用收入将按以下比例分配:</span>
      <ul class="allocation-list-wrapper">
        <li class="allocation-item" v-if="ownerReceiveRate">
          <span class="text">业主:</span>
          <span class="rate" v-text="ownerReceiveRate + '%'"></span>
        </li>
        <li class="allocation-item" v-if="propertyReceiveRate">
          <span class="text">物业:</span>
          <span class="rate" v-text="propertyReceiveRate + '%'"></span>
        </li>
        <li class="allocation-item" v-if="industryCommitteeReceiveRate">
          <span class="text">业委会:</span>
          <span class="rate" v-text="industryCommitteeReceiveRate + '%'"></span>
        </li>
        <li class="allocation-item" v-if="platformReceiveRate">
          <span class="text">平台:</span>
          <span class="rate" v-text="platformReceiveRate + '%'"></span>
        </li>
      </ul>
    </x-dialog>
    <!--停车费用分成Modal end-->
    <!--车位证明Modal begin-->
    <x-dialog v-model="parkingPicsModalShow" :dialog-style="parkingPicsDialogStyle" hide-on-blur>
      <span>车位所有证明，包括车位租赁协议、购买协议等。</span>
    </x-dialog>
    <!--车位证明Modal end-->
  </div>
</template>

<script>
  import router from '../../router';
  import {mapState} from 'vuex';
  import JButton from 'components/utils/jbutton';
  import Toast from 'components/utils/toast/toast';
  import JLoading from 'components/utils/loading/JLoading';
  import UploadParking from 'components/upload/upload-parking';
  import UploadId from 'components/upload/upload-id';
  export default {
    name: 'addParking',
    created: function () {
      // 先进入协议页面
      if (!this.protocolChecked) {
        router.push('/share/protocol');
      }
      document.title = '新增车位';
      this.initOwnerParkingList();
      let _this_ = this;
      setTimeout(function () {
        _this_.initParking();
      })
    },
    data () {
      return {
        isLoading: false,
        ownerParkingList: [],
        parkingPicsModalShow: false,
        parkingPicsDialogStyle: {
          maxWidth: '100%',
          width: '60%',
          borderRadius: '0.266667rem',
          padding: '0.6rem 0.213333rem',
          color: '#333'
        },
        url: window.homeURL + '/uploadAction!upload.action?module=order',
        allocationModalShow: false,
        allocationDialogStyle: {
          maxWidth: '100%',
          width: '80%',
          borderRadius: '0.266667rem',
          padding: '0.6rem 0',
          color: '#333'
        },
        currentParking: {
          parkingId: '',
          parkingNO: '请选择',
          parkingPics: [],
          idPics: []
        }
      }
    },
    computed: mapState({
      rent: state => state.pageCfg.rent, // 租金
      rentUnit: state => state.pageCfg.rentUnit, // 租金单位
      ownerReceiveRate: state => state.pageCfg.ownerReceiveRate, // 业主收入分成
      propertyReceiveRate: state => state.pageCfg.propertyReceiveRate, // 物业收入分成
      industryCommitteeReceiveRate: state => state.pageCfg.industryCommitteeReceiveRate, // 业委会收入分成
      platformReceiveRate: state => state.pageCfg.platformReceiveRate, // 平台收入分成
      uploadedParkingPics: state => state.pageCfg.uploadedParkingPics, // 车位证明
      uploadedIdPics: state => state.pageCfg.uploadedIdPics, // 身份证
      protocolChecked: state => state.pageCfg.protocolChecked // 车位共享协议选中状态
    }),
    methods: {
      // 获取业主名下车位号列表
      initOwnerParkingList: function () {
        let _this_ = this;
        this.$JHttp.get(window.homeURL + '/sharedPark/userParkingSpaces').then((res) => {
          if (res.data.status === 100) {
            let data = res.data.data;
            if (data && data.length) {
              let ownerParkingList = [];
              let dataList = res.data.data;
              dataList.forEach(function (parking) {
                let parkingNO = '';
                if (parking.unit) {
                  parkingNO = parking.unit + '-' + parking.room;
                } else {
                  parkingNO = parking.room;
                }
                ownerParkingList.push({
                  parkingId: parking.id,
                  parkingNO: parkingNO
                })
              });
              _this_.ownerParkingList = ownerParkingList;
              _this_.$store.commit('updateOwnerParkingList', {
                ownerParkingList: ownerParkingList
              });
            }
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
      },
      // 获取当前车位信息
      initParking: function () {
        let parkingId = '';
        let selectedParking = this.$store.state.pageCfg.selectedParking;
        let unPassParkingId = this.$route.params.unPassParkingId;
        if (selectedParking && selectedParking.parkingId) { // 代表用户已经进入到车位选择页,并且选择了车位
          parkingId = selectedParking.parkingId;
        } else if (unPassParkingId) { // 代表用户点击未通过的车位,重新发起共享申请
          parkingId = unPassParkingId;
        } else if (this.ownerParkingList && this.ownerParkingList.length) { // 默认带出业主名下车位(多个则展示第一个)
          parkingId = this.ownerParkingList[0].parkingId;
        } else {
          parkingId = '';
        }
        // 根据车位id获取车位详情
        if (parkingId) {
          let _this_ = this;
          this.$JHttp.get(window.homeURL + '/sharedPark/roomInfo/' + parkingId).then((res) => {
            if (res.data.status === 100) {
              let data = res.data.data;
              if (data) {
                let parkingNO = data.blockName + data.buildingNumber + data.unit + data.room;
                _this_.$set(_this_.currentParking, 'parkingId', parkingId);
                _this_.$set(_this_.currentParking, 'parkingNO', parkingNO);
                // TODO parkingPics
                // TODO idPics
              }
            } else {
              // 接口没有返回数据
              Toast(res.data.msg);
            }
          }).catch(function (response) {
            // 调用接口出错
            Toast(window.commonConfig.commonError);
          });
        }
      },
      showAllocationModal: function () {
        this.allocationModalShow = true;
      },
      showParkingPicsModal: function () {
        this.parkingPicsModalShow = true;
      },
      // 跳转到共享车位协议页
      linkToProtocol: function () {
        router.push('/share/protocol');
      },
      // 选择车位号
      selectParkingNO: function () {
        if (this.ownerParkingList && this.ownerParkingList.length >= 2) { // 业主名下已有车位号>=2,先进入中间页
          router.push({
            name: 'ownerParkingList',
            params: {
              parkingId: this.parkingId
            }
          });
        } else { // 否则直接进入苑幢列表页
          router.push({
            name: 'blockBuildingList',
            params: {
              parkingId: this.parkingId
            }
          });
        }
      },
      // 检查车位号的完整性
      checkParkingId: function () {
        if (!this.currentParking.parkingId) {
          Toast('请先选择车位号');
          return false;
        }
        return true;
      },
      // 检查车位证明的合法性
      checkParkingPics: function () {
        if (!this.uploadedParkingPics.pics.length) {
          Toast('请上传车位证明');
          return false;
        }
        return true;
      },
      // 检查身份证照片合法性
      checkIdPics: function () {
        if (this.uploadedIdPics.pics.length !== 2) {
          Toast('请上传本人身份证照片');
          return false;
        }
        return true;
      },
      // 检查协议是否勾选
      checkProtocol: function () {
        if (!this.protocolChecked) {
          Toast('请先同意协议');
          return false;
        }
        return true;
      },
      // 保存车位信息
      saveParkingInfo: function () {
        this.isLoading = true;
        if (!this.checkParkingId() || !this.checkParkingPics() || !this.checkIdPics() || !this.checkProtocol()) {
          this.isLoading = false;
          return;
        }
        let _this_ = this;
        let uploadData = new FormData();
        let uploadedParkingPics = this.uploadedParkingPics;
        let parkingFiles = uploadedParkingPics.pics;
        uploadData.append('type', 'ad');
        for (let i = 0; i < parkingFiles.length; i++) {
          let file = parkingFiles[i];
          if (file.type === 'zipped') {
            uploadData.append('files', file.file, file.fileName); // blob对象,自己手动加上文件名
          } else {
            uploadData.append('files', file.file);
          }
        }
        let uploadedIdPics = this.uploadedIdPics;
        let idFiles = uploadedIdPics.pics;
        for (let i = 0; i < idFiles.length; i++) {
          let file = idFiles[i];
          if (file.type === 'zipped') {
            uploadData.append('files', file.file, file.fileName); // blob对象,自己手动加上文件名
          } else {
            uploadData.append('files', file.file);
          }
        }
        this.$JHttp.post(window.uploadURL + '/upload', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((res) => {
          if (res.data.status === 100) {
            let parkingId = this.currentParking.parkingId;
            let postData = new FormData();
            postData.append('roomId', parkingId);
            let uploadedPics = res.data.data;
            let parkingPicsCount = _this_.uploadedParkingPics.pics.length;
            for (let i = 0; i < uploadedPics.length; i++) {
              if (i < parkingPicsCount) { // 车位证明
                postData.append('certificateImgs', uploadedPics[i]);
              } else { // 身份证明
                postData.append('idCardImgs', uploadedPics[i]);
              }
            }
            _this_.$JHttp.post(window.homeURL + '/sharedPark/parkingSpace', postData).then((res) => {
              _this_.isLoading = false;
              if (res.data.status === 100) {
                router.go(-1);
              } else {
                // 接口没有返回数据
                Toast(res.data.msg);
              }
            }).catch(function (response) {
              // 调用接口出错
              _this_.isLoading = false;
              Toast(window.commonConfig.commonError);
            });
          } else {
            // 接口没有返回数据
            _this_.isLoading = false;
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          _this_.isLoading = false;
          Toast(window.commonConfig.commonError);
        });
      }
    },
    components: {
      'j-button': JButton,
      'j-loading': JLoading,
      'upload-parking': UploadParking,
      'upload-id': UploadId
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .add-parking-wrapper {
    font-size: 14px;
    text-align: left;
    padding-top: 0.213333rem;
    background-color: #ebebeb;
    .parking-info {
      background-color: #fff;
      .fees-wrapper {
        display: flex;
        align-items: center;
        height: 1.173333rem;
        padding: 0 0.4rem;
      }
      .fees-wrapper {
        .left {
          flex: 0 0 2.506667rem;
        }
        .right {
          flex: 1;
          display: flex;
          align-items: center;
          font-size: 0;
          .value {
            font-size: 14px;
          }
          .icon {
            display: inline-block;
            width: 0.32rem;
            height: 0.32rem;
            margin-left: 0.213333rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url('../../assets/img/@2x/icon-info.png');
          }
        }
      }
      .parkingNO-wrapper {
        display: flex;
        align-items: center;
        padding: 0.32rem 0.4rem;
        .left {
          flex: 0 0 2.506667rem;
        }
        .right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .value {
            font-size: 14px;
            text-align: right;
            padding-right: 0.266667rem;
            max-width: 6.253333rem;
          }
          .icon {
            display: inline-block;
            width: 0.213333rem;
            height: 0.426667rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url('../../assets/img/@2x/gray-icon-right.png');
          }
        }
      }
    }
    .parking-upload {
      .title {
        display: flex;
        align-items: center;
        background-color: #fff;
        font-size: 0;
        padding: 0.453333rem 0.4rem 0.4rem 0.4rem;
        .text {
          font-size: 14px;
          line-height: 14px;
        }
        .icon {
          display: inline-block;
          width: 0.32rem;
          height: 0.32rem;
          margin-left: 0.213333rem;
          background-size: 100%;
          background-repeat: no-repeat;
          background-image: url('../../assets/img/@2x/icon-info.png');
        }
      }
      .parking-pics, .id-pics {
        background-color: #fff;
      }
    }
    .protocol-wrapper {
      display: flex;
      align-items: center;
      padding: 0.4rem;
      .icon {
        display: inline-block;
        width: 0.906667rem;
        height: 0.906667rem;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url('../../assets/img/@2x/protocol-unchecked.png');
      }
      .checked {
        background-image: url('../../assets/img/@2x/protocol-checked.png');
      }
      .text {
        color: #333;
        font-size: 12px;
        line-height: 12px;
      }
      .text-protocol {
        color: #18ADFB;
        font-size: 12px;
        line-height: 20px;
        text-decoration: underline;
      }
    }
    .save-wrapper {
      margin: 0 0.4rem;
      height: 1.12rem;
    }
    .upload-placeholder {
      position: fixed;
      top: -13.333333rem;
      opacity: 0;
    }
  }

  [data-dpr="2"]
  .add-parking-wrapper {
    font-size: 30px;
    .parking-info {
      .fees-wrapper {
        .right {
          .value {
            font-size: 30px;
            line-height: 30px;
          }
        }
      }
      .parkingNO-wrapper {
        .right {
          .value {
            font-size: 30px;
          }
        }
      }
    }
    .parking-upload {
      .title {
        .text {
          font-size: 30px;
          line-height: 30px;
        }
        .icon {
          background-image: url('../../assets/img/@3x/icon-info@3x.png');
        }
      }
    }
    .protocol-wrapper {
      .text {
        font-size: 24px;
        line-height: 24px;
      }
      .text-protocol {
        font-size: 24px;
        line-height: 33px;
      }
    }
  }

  [data-dpr="3"]
  .add-parking-wrapper {
    font-size: 54px;
    .parking-info {
      .fees-wrapper {
        .right {
          .value {
            font-size: 54px;
            line-height: 54px;
          }
          .icon {
            background-image: url('../../assets/img/@3x/icon-info@3x.png');
          }
        }
      }
      .parkingNO-wrapper {
        .right {
          .value {
            font-size: 54px;
          }
          .icon {
            background-image: url('../../assets/img/@3x/gray-icon-right@3x.png');
          }
        }
      }
    }
    .parking-upload {
      .title {
        .text {
          font-size: 54px;
          line-height: 54px;
        }
      }
      .parking-pics {
        .bg {
          .pic {
            background-image: url('../../assets/img/@3x/upload@3x.png');
          }
        }
      }
      .id-pics {
        .bg {
          .pic-front {
            background-image: url('../../assets/img/@3x/idcard-down@3x.png');
          }
          .pic-back {
            background-image: url('../../assets/img/@2x/idcard-up.png');
          }
        }
      }
    }
    .protocol-wrapper {
      .icon {
        background-image: url('../../assets/img/@3x/protocol-unchecked@3x.png');
      }
      .checked {
        background-image: url('../../assets/img/@3x/protocol-checked@3x.png');
      }
      .text {
        font-size: 42px;
        line-height: 42px;
      }
      .text-protocol {
        font-size: 42px;
        line-height: 58px;
      }
    }
  }
</style>
