<template>
  <div class="repeat-wrapper">
    <ul>
      <li class="repeat-item vux-1px-b" v-for="(repeat, index) in repeats"
      @click="changeRepeat(index)">
        <span class="left" v-text="repeat.text"></span>
        <span class="right" :class="{selected: (repeat.value === '1')}"></span>
      </li>
    </ul>
    <div class="save-wrapper" @click="saveRepeat">
      <j-button jText="保存" type="primary"></j-button>
    </div>
  </div>
</template>

<script>
  import router from '../../router';
  import JButton from 'components/utils/jbutton';
  import {jlDate} from '../../common/utils';
  export default {
    name: 'repeat',
    created: function () {
      document.title = '重复';
      this.initRepeats();
    },
    data () {
      return {
        repeats: []
      }
    },
    computed: {
      repeatStr: function () {
        if (!this.repeats.length) {
          return '0000000';
        } else {
          let repeats = this.repeats;
          let repeatStr = '';
          repeats.forEach(function (repeat) {
            repeatStr += repeat.value;
          });
          return repeatStr;
        }
      }
    },
    components: {
      'j-button': JButton
    },
    methods: {
      initRepeats: function () {
        let repeats = this.$route.params.repeats;
        this.repeats = jlDate.getSharingRepeatArray(repeats);
      },
      // 选择或取消选择重复项
      changeRepeat: function (index) {
        let repeatObj = this.repeats[index];
        if (repeatObj.value === '0') {
          this.$set(repeatObj, 'value', '1');
        } else {
          this.$set(repeatObj, 'value', '0');
        }
      },
      // 保存重复项
      saveRepeat: function () {
        // 跳转到编辑时段页面
        this.$store.commit('updateSharingRepeat', {
          sharingRepeat: this.repeatStr
        });
        router.go(-1);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .repeat-wrapper {
    width: 100%;
    height: 100%;
    background-color: #ebebeb;
    padding-top: 0.213333rem;
    .repeat-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 1.173333rem;
      background-color: #fff;
      padding: 0 0.4rem;
      .left {
        font-size: 14px;
      }
      .right {
        display: inline-block;
        width: 0.586667rem;
        height: 0.586667rem;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url('../../assets/img/@2x/empty-select.png');
      }
      .selected {
        background-image: url('../../assets/img/@2x/selected.png');
      }
    }
    .save-wrapper {
      height: 1.12rem;
      padding: 0.4rem;
    }
  }
  [data-dpr="2"]
  .repeat-wrapper {
    .repeat-item {
      .left {
        font-size: 30px;
      }
    }
  }
  [data-dpr="3"]
  .repeat-wrapper {
    .repeat-item {
      .left {
        font-size: 54px;
      }
      .right {
        background-image: url('../../assets/img/@3x/empty-select@3x.png');
      }
      .selected {
        background-image: url('../../assets/img/@3x/selected@3x.png');
      }
    }
  }
</style>
