<template>
  <div class="publish commonHeader no-margin-top">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="发布帖子">
      <a slot="right" @click="publish">发布</a>
    </x-header>
    <div class="newThings-banner">
      <group>
        <cell title="选择发布小区" :value="communityName" is-link link="/changeCommunity" class="pub_option"
              style="padding: 15px;border-bottom: 1px solid #d8d8d8"></cell>
      </group>
      <div class="publish-header" @click="showTopicSelector">
        <p class="tips">选择发布到</p>
        <group>
          <cell-box is-link>
            #{{topic.name}}
          </cell-box>
        </group>
        <div class="border1"></div>
      </div>
      <group>
        <x-textarea :height="130" :max="500" :show-counter="false" :rows="8" :cols="30" placeholder="输入内容..."
                    v-model="content"></x-textarea>
      </group>
      <ul class="chooseImg">
        <li v-for="(localId, index) in localIds">
          <img :src="localId" @click.prevent="showDeletePop(index)" alt="">
        </li>
        <li class="add" @click="chooseImages" v-show="localIds.length < 9"></li>
      </ul>

      <div v-transfer-dom>
        <actionsheet :menus="menus" @on-click-menu-menu="deleteImg" v-model="showDeleteMenu" show-cancel></actionsheet>
      </div>
      <div v-transfer-dom>
        <popup v-model="selectorVisible" height="100%" style="background-color: #ffffff">
          <topic-selector @selected="setTopic" :defaultTopic="type"></topic-selector>
        </popup>

      </div>
      <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
        <span class="delete-info vux-1px-b">您尚未绑定手机号</span>
        <div class="operate-wrapper">
          <span class="text vux-1px-r" @click="deleteModalShow = false">以后再说</span>
          <span class="text" @click="deleteReceiveAddress">前往绑定</span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import {XHeader, XTextarea, Actionsheet, Group, querystring, TransferDom, XDialog, CellBox, Cell, Popup} from 'vux'
  import {File} from '../../common/js/Upload'
  import {JNavigator} from '../../common/js/utils'
  import {Base64} from 'js-base64';
  import TopicSelector from './topicSelector';

  export default {
    name: 'pub_newThings',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      XTextarea,
      Actionsheet,
      XDialog,
      Group,
      Cell,
      CellBox,
      TopicSelector,
      Popup
    },
    props: ['tid', 'type'],
    data () {
      return {
        content: '',
        localIds: [],
        showDeleteMenu: false,
        currentIndex: 0,
        uploadData: new FormData(),
        menus: {
          menu: '删除'
        },
        communityId: '',
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.533333rem 0 0 0',
          borderRadius: '0.533333rem'
        },
        topicTypes: [],
        curTopicTypes: [],
        topic: {},
        selectorVisible: false
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.communityId !== localStorage.getItem('communityId')) {
          vm.communityId = localStorage.getItem('communityId')
          vm.refresh()
        }
      })
    },
    created () {
      // this.uploadData.append('type', 'nei');
      this.communityId = localStorage.getItem('communityId');
      this.communityName = localStorage.getItem('communityName');
    },
    methods: {
      chooseImages () {
        let _this_ = this;
        let count = this.localIds.length;
        let leftCount = 9 - count;
        this.$wechat.chooseImage({
          count: leftCount, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            _this_.localIds = _this_.localIds.concat(res.localIds); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          }
        });
      },
      showDeletePop (index) {
        this.showDeleteMenu = true;
        this.currentIndex = index;
      },
      deleteImg () {
        this.localIds.splice(this.currentIndex, 1);
      },
      deleteReceiveAddress () {
        this.$router.push('/Login')
      },
      publish () {
        let _this_ = this;
        const doPublish = (params = {}) => {
          let postData = {
            topicType: _this_.topic.value // 当前话题类型
          };
          postData = {...postData, ...params}
          // 如是topicType为7就上送id
          if (postData.topicType === '7') {
            postData.topicId = _this_.topic.topicId;
          }
          // 保存图片到业务方
          _this_.$JHttp({
            url: window.baseURL + '/neighbor/topic/add?' + querystring.stringify(postData),
            method: 'post',
            headers: {
              defCommunityId: _this_.communityId
            }
          }).then(res => {
            if (res.status === 100) {
              // 开始保存逻辑
              _this_.$vux.loading.hide();
              _this_.$vux.toast.show({
                type: 'success',
                text: '发布成功'
              });
              setTimeout(function () {
                _this_.content = '';
                if (_this_.topic.value > 6) {
                  _this_.$router.go(-1);
                } else {
                  _this_.$router.replace(`/topicDetail/${_this_.topic.value}`);
                }
              }, 2000)
            } else {
              _this_.$vux.toast.show({
                type: 'cancel',
                text: res.msg
              });
            }
          }).catch(error => {
            console.error(error);
          });
        }
        let token = localStorage.getItem('token');
        if (!token) {
          this.deleteModalShow = true;
        } else {
          let content = this.content.trim();
          const isNeedOpenDaren = this.topic.status !== 1 && this.topic.value === '7'; // 是否需要开通达人
          if (isNeedOpenDaren) {
            this.$vux.confirm.show({
              content: '开通后，可以发布帖子到自己的达人中，是否现在开通',
              confirmText: '前去开通',
              cancelText: '不，我后悔了',
              onConfirm () {
                _this_.$router.push({path: '/darenApply', query: {title: '申请达人'}});
              }
            });
            return;
          }
          if (!content) {
            this.$vux.toast.show({
              type: 'cancel',
              text: '发布内容不能为空'
            });
            return;
          }
          _this_.$vux.loading.show({
            text: '发布中...'
          });
          let localIds = this.localIds;
          let len = localIds.length;
          /* 传了图片 */
          if (len) {
            let blobs = [];
            localIds.forEach(function (localId, index) {
              _this_.$wechat.getLocalImgData({
                localId: localId, // 图片的localID
                success: function (res) {
                  let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                  if (JNavigator.isAndroid()) {
                    localData = 'data:image/jgp;base64,' + localData;
                  }
                  let file = File.dataURItoBlob(localData);
                  blobs.push(file);
                  // 合成完最后一个,开始上传
                  if (index === len - 1) {
                    _this_.uploadBlob(blobs, 'neighbor', undefined, undefined, function (resList) {
                      let params = {
                        topicContent: content,
                        imageUrls: JSON.stringify(resList)
                      }
                      doPublish(params);
                    });
                  }
                }
              });
            });
          } else {
            let params = {
              topicContent: content
            }
            doPublish(params)
          }
        }
      },
      setTopic (topic) {
        this.topic = topic;
        this.selectorVisible = false;
      },
      showTopicSelector () {
        this.selectorVisible = true;
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  @import "../../assets/css/_mixin";

  .newThings-banner {
    .publish-header {
      padding: 10px 15px;
      .tips {
        font-size: 15px;
        line-height: 21px;
      }
      .weui-cell {
        padding: 0;
        font-size: 21px;
        line-height: 40px;
        font-family: 'pingfang_scmedium pingfang_scregular';
        margin-bottom: 10px;
      }
      .border1 {
        .border-1px(#d8d8d8);
      }
    }
    .chooseImg {
      display: flex;
      flex-wrap: wrap;
      /*justify-content: space-between;*/
      align-items: center;
      padding: 10px 15px;
      li {
        width: 105px;
        height: 105px;
        margin-left: 15px;
        margin-top: 15px;
        /*overflow: hidden;*/
        /*display: flex;*/
        /*align-items: center;*/
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
        /*border: 1px dashed #D8D8D8;*/
        background-image: url("../../assets/images/addpic-210.png");
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
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
  }

  .pub_option {
    border-bottom: 0.5px solid #d8d8d8;
    margin: 0 15px 0 0;
    padding: 5px 0;
    .weui-cell {
      padding: 10px 0;
    }
  }
</style>
