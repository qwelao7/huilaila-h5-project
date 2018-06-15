<template>
  <div class="commonHeader tag">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="个性标签">
    </x-header>
    <div class="tagBanner">
      <p class="des">添加描述职业、兴趣爱好等方面的词语，让更多人找到你，让你找到更多同行同好的邻居</p>
      <div class="tag-wrapper">
        <div class="tag-item" v-for="tag in tagList">
          <span
            class="tag"
            :class="{choose: tag.isSelect === '1', unchoose: tag.isSelect === '0'}"
            @click="select(tag)" v-text="tag.label">
          </span>
        </div>
      </div>
      <div class="createTag">
        <i></i>
        <span>以上没有？</span>
        <span class="addTag" @click="showAddDialog">自己创建一个吧！</span>
        <!--举报弹出框 begin-->
        <popup v-model="addOnePop" class="add-one-pop">
          <div class="content">
            <x-input :show-clear="!!newLabel" ref="addInput" placeholder="添加一个自定义标签吧(2-4)个汉字" v-model="newLabel"></x-input>
          </div>
          <div @click="addOne" class="addBtn">确定</div>
        </popup>
        <div v-transfer-dom></div>
        <!--举报弹出框 end-->
      </div>
      <div class="submit">
        <x-button @click.native="saveData">确认提交</x-button>
      </div>
    </div>
  </div>
</template>
<script>
  import { XHeader, XButton, Checker, CheckerItem, XInput, Popup, TransferDom } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      XButton,
      Checker,
      CheckerItem,
      XInput,
      Popup
    },
    data () {
      return {
        addOnePop: false,
        newLabel: '',
        tagList: [],
        selectedTagCount: 0
      }
    },
    created () {
      this.getLabels();
    },
    methods: {
      getLabels () {
        this.$vux.loading.show({
          text: '加载中...'
        });
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/user/getLabels'
        }).then(res => {
          this.$vux.loading.hide();
          let status = res.status;
          if (status === 100) {
            let labelList = res.data;
            _this_.tagList = labelList;
            if (labelList && labelList.length) {
              labelList.forEach(function (label) {
                if (label.isSelect === '1') {
                  _this_.selectedTagCount++;
                }
              });
            }
          } else {
            _this_.$vux.toast.show({
              type: 'error',
              text: res.msg
            });
          }
        }).catch(error => {
          this.$vux.loading.hide();
          console.error(error);
        })
      },
      select (value) {
        if (value.isSelect === '0') {
          if (this.selectedTagCount >= 6) {
            this.$vux.toast.show({
              type: 'cancel',
              text: '最多选择6个'
            });
          } else {
            value.isSelect = '1';
            this.selectedTagCount++;
          }
        } else {
          value.isSelect = '0';
          this.selectedTagCount--;
        }
      },
      showAddDialog () {
        if (this.selectedTagCount >= 6) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '最多选择6个'
          });
          return;
        }
        this.addOnePop = true;
        let _this_ = this;
        this.$nextTick(function () {
          _this_.$refs.addInput.focus();
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
        this.selectedTagCount++;
        this.tagList.push({
          isSelect: '1',
          label: newLabel
        });
        this.addOnePop = false;
      },
      saveData () {
        let selectedTagArr = [];
        if (this.tagList && this.tagList.length) {
          this.tagList.forEach(function (tag) {
            if (tag.isSelect === '1') {
              selectedTagArr.push(tag.label);
            }
          });
        }
        this.$JHttp({
          url: window.baseURL + '/user/modifyLabels?labels=' + selectedTagArr,
          method: 'put'
        }).then(res => {
          if (res.status === 100) {
            // 修改成功
            this.$vux.toast.show({
              type: 'success',
              text: '个性标签修改成功'
            })
            this.$router.go(-1);
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.error(e);
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .tagBanner{
    padding: 20px 15px;
    .des{
      font-size: 15px;
    }
    .tag-wrapper {
      .tag-item{
        display: inline-block;
        width: 33.33%;
        .tag {
          width: 80%;
          height: 35px;
          text-align: center;
          margin-top: 15px;
          line-height: 35px;
          background: #f2f2f2;
          border-radius: 49px;
          font-size: 15px;
          margin-left: auto;
          margin-right: auto;
        }
        .unChoose{
          background: #f2f2f2;
        }
        .choose{
          background: #0DAB60;
          color: #ffffff;
        }
      }
    }
    .createTag{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      i{
        width: 28px;
        height: 28px;
        background: url("../../../assets/images/addtags_icon_32.png") center no-repeat / contain;
      }
      span{
        font-size: 15px;
        color: #333333;
      }
      .addTag{
        color: #0DAB60;
        text-decoration: underline;
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
    .submit{
      margin-top: 24px;
      button{
        background-color: #0DAB60;
        color: #ffffff;
        font-size: 18px;
      }
    }
  }
</style>
