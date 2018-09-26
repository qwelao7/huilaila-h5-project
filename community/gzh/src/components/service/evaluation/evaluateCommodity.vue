<template>
  <div class="commodityRating">
    <ul class="ratingBox">
      <li class="quality">
        <div class="rater">
          <img src="../../../assets/a3.jpg" alt="">
          <span>服务质量</span>
          <star v-model="qualityValue" :margin="15" :fontSize="22"></star>
        </div>
        <div>
          <span>{{qualityText}}</span>
        </div>
      </li>
    </ul>
    <div class="inputArea">
      <group>
        <x-textarea :max="250" name="detail" :placeholder="placeholder" :show-counter="false" @on-change="onInput"></x-textarea>
      </group>
      <ul>
        <li class="showPic" v-for="item,index in picList" v-show="picList.length">
          <img :src="item" alt="" @click="showDelPopup(index)">
        </li>
        <li class="addPic" v-show="picList.length < 4">
          <img src="../../../assets/images/addpic-210.png" alt="" @click="addPic">
        </li>
      </ul>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="delMenu" @on-click-menu-menu="delPic" v-model="showDeleteMenu" show-cancel></actionsheet>
    </div>
  </div>
</template>
<script>
  import {Group, XTextarea, Actionsheet, TransferDom} from 'vux'
  import star from '../../common/star'
  export default {
    name: 'commodityRating',
    directives: {
      TransferDom
    },
    components: {
      Group,
      XTextarea,
      Actionsheet,
      star
    },
    data () {
      return {
        placeholder: '商品满足你的期待吗？将你的心得分享给大家吧',
        qualityValue: 4,
        speedValue: 5,
        picList: [],
        currentIndex: '',
        delMenu: {
          menu: '删除'
        },
        showDeleteMenu: false
      }
    },
    computed: {
      qualityText () {
        let text
        switch (this.qualityValue) {
          case 3:
            text = '一般';
            break;
          case 4:
            text = '满意';
            break;
          case 5:
            text = '惊喜';
            break;
          default:
            text = '失望';
        }
        return text
      },
      speedText () {
        let text
        switch (this.speedValue) {
          case 3:
            text = '一般';
            break;
          case 4:
            text = '满意';
            break;
          case 5:
            text = '惊喜';
            break;
          default:
            text = '失望';
        }
        return text
      }
    },
    methods: {
      onInput () {
        //
      },
      addPic () {
        let _this_ = this;
        let count = this.picList.length;
        let leftCount = 4 - count;
        this.$wechat.chooseImage({
          count: leftCount, // 默认9
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            _this_.picList = _this_.picList.concat(res.localIds);
            console.log(_this_.picList)
          }
        });
      },
      showDelPopup (index) {
        this.showDeleteMenu = true;
        this.currentIndex = index;
      },
      delPic () {
        this.picList.splice(this.currentIndex, 1);
        this.$vux.toast.show({
          type: 'text',
          text: '删除成功'
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .commodityRating{
    .ratingBox{
      margin-top: 20px;
      li{
        padding: 20px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .rater{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          img{
            width: 30px;
            height: 30px;
            margin-right: 5px;
          }
          span{
            font-size: 15px;
            margin-right: 10px;
          }
        }
        span:last-child{
          font-size: 15px;
          color: #FF6648;
        }
      }
      .quality{
        border-bottom: 0.5px solid #D8D8D8;
      }
    }
    .inputArea{
      margin-top: 20px;
      .weui-cell{
        padding: 0;
      }
      .weui-cells:after{
        border: none;
      }
      ul{
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        li{
          width: 75px;
          height: 75px;
          margin-right: 15px;
          :last-child{
            margin-right: 0;
          }
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
</style>
