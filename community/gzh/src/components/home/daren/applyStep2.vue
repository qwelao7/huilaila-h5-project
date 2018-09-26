<template>
  <div class="commonHeader">
    <x-header
      slot="header"
      :left-options="{backText: '', preventGoBack: true}"
      @on-click-back="back"
      :title="title">
      <span class="right-btn" slot="right">2/3</span>
    </x-header>
    <div class="daren-container">
      <div v-if="!bgPath" class="daren-bg" @click="chooseImage">
        <a class="img-add-btn">点击添加达人背景图</a>
      </div>
      <bg-img v-if="bgPath" :custom-class="'daren-bg'" :extend-style="extendStyle" :osskey="bgPath"
              @click.native="chooseImage" :custom-width="375" :custom-height="250">
      </bg-img>
      <a class="img-add-btn" v-if="bgPath" style="position: absolute;" @click="chooseImage">点击替换达人背景图</a>
      <div class="daren-content">
        <p class="breif" v-if="!workRoomId">给自己添加几个标签吧，方便大家查找</p>
        <div class="btn-group">
          <div class="tag-btn" :class="{'active':item.isSelect === '1'}" v-for="item in labels" @click="selectLabel(item)">{{item.label}}</div>
        </div>
        <div class="tag-adder">
          <img src="../../../assets/images/addtags_icon_32.png" alt="">
          <span>以上没有？</span>
          <a @click="showAddDialog">自己创建一个吧！</a>
        </div>
        <popup v-model="popVisible" class="add-one-pop">
          <div class="content">
            <x-input :show-clear="!!newLabel" ref="addInput" placeholder="添加一个自定义标签吧(2-4)个汉字" v-model="newLabel"></x-input>
          </div>
          <div @click="addOne" class="addBtn">确定</div>
        </popup>
        <div class="next-step-btn" @click="nextStep">
          <x-icon type="ios-arrow-right" size="25"></x-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {TransferDom, XHeader, XInput, Popup} from 'vux'
  import BGimg from 'components/common/img/bgImg'
  import { File } from '../../../common/js/Upload'
  import { JNavigator } from '../../../common/js/utils'
  export default {
    name: 'topicList',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      XInput,
      Popup,
      'bg-img': BGimg
    },
    props: ['workRoomId', 'bgIcon', 'title'],
    data () {
      return {
        extendStyle: 'linear-gradient(to bottom,rgba(255,255,255,0) 200px,rgba(255,255,255,1) 250px),',
        bgPath: '',
        labels: [],
        newLabel: '',
        popVisible: false
      }
    },
    created () {
      this.bgPath = this.bgIcon;
      this.getLabels();
    },
    methods: {
      chooseImage () {
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
                _this_.uploadBlob([file], 'neighbor', undefined, undefined, function (resList) {
                  _this_.bgPath = resList[0];
                })
              }
            });
          }
        });
      },
      getLabels () {
        let url = `${window.oldBaseURL}/scNeighborGroupActionV36!queryWorkRoomLabels.action`;
        let params = {}
        if (this.workRoomId) params.workRoomId = this.workRoomId;
        this.fetchFormData(url, params, data => {
          this.labels = data;
        });
      },
      selectLabel (item) {
        let selected = this.labels.filter(item => item.isSelect === '1');
        if (selected.length >= 6) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '最多选择6个'
          });
          return;
        }
        item.isSelect = item.isSelect === '1' ? '0' : '1';
      },
      nextStep () {
        let selectedLabel = this.labels.filter(item => item.isSelect === '1');
        if (selectedLabel.length === 0) {
          this.$vux.toast.show({
            type: 'text',
            text: '请至少选择一个标签'
          });
          return;
        }
        let applyParamsStep2 = {
          selectedLabel,
          bgPath: this.bgPath
        }
        this.$emit('finish', applyParamsStep2);
      },
      showAddDialog () {
        let selected = this.labels.filter(item => item.isSelect === '1');
        if (selected.length >= 6) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '最多选择6个'
          });
          return;
        }
        this.popVisible = true;
        this.$nextTick(() => {
          this.$refs.addInput.focus();
        });
      },
      addOne () {
        let newLabel = this.newLabel;
        let labelReg = /^[\u4E00-\u9FA5]{2,4}$/;
        if (!labelReg.test(newLabel)) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请输入(2-4)个汉字'
          });
          return;
        }
        this.labels.push({
          isSelect: '1',
          label: newLabel
        })
        this.popVisible = false;
        this.newLabel = '';
      },
      back () {
        this.$emit('on-back');
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .daren-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    .daren-bg {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: linear-gradient(to bottom,rgba(255,255,255,0) 200px,rgba(255,255,255,1) 250px), url("../../../assets/images/openstudio_Illustration_750blur.png");
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      min-height: 250px;
      width: 100%;
    }
    .img-add-btn{
      width: 270px;
      height: 35px;
      margin-top: 73px;
      color: #fff;
      border: 1px solid #fff;
      border-radius: 17.5px;
      background: transparent;
      font-size: 15px;
      text-align: center;
      line-height: 35px;
    }
    .daren-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      left: 0;
      right: 0;
      top: 190px;
      .breif{
        font-size: 15px;
        color: #fff;
        margin-bottom: 15px;
      }
      .btn-group{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-left: 9.5px;
      }
      .tag-btn{
        width: 100px;
        height: 35px;
        font-size: 15px;
        text-align: center;
        line-height: 35px;
        border-radius: 17.5px;
        border: 0;
        background-color: #f2f2f2;
        margin-bottom: 15px;
        margin-left: 9.5px;
        margin-right: 9.5px;
        &.active{
          color: #fff;
          background-color: #0DAB60;
        }
      }
      .tag-adder{
        height: 28px;
        margin-top: 23px;
        text-align: center;
        display: flex;
        align-items: center;
        img{
          height: 28px;
          margin-right: 9px;
        }
        span{
          font-size: 15px;
          display: inline;
        }
        a{
          font-size: 15px;
          color: #0DAB60;
          text-decoration: underline;
        }
      }
      .next-step-btn{
        width: 48px;
        height: 48px;
        background: rgba(13,171,96,0.60);
        position: fixed;
        right: 15px;
        bottom: 30px;
        border-radius: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .vux-x-icon{
        fill: #fff;
      }
      .add-one-pop {
        display: flex;
        align-items: center;
        .content {
          flex: 1;
          border: 1px solid #aaa;
          margin: 15px;
          border-radius: 8px;
          .weui-cell {
            padding: 5px 10px;
          }
        }
        .addBtn {
          flex: 0 0 15%;
          text-align: center;
          color: #0DAB60;
        }
      }
    }
  }
</style>
