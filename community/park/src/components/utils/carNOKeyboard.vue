<template>
  <div class="keyboard-wrapper">
    <div class="province-container">
      <div class="province-row" v-for="(sn, indexOuter) in snProvince">
        <div class="province-item" v-for="(snRow, indexInner) in sn">
          <span class="keyboard" v-text="snRow.name" :class="snRow.isSelect"
                @click="selectProvince(indexOuter, indexInner)"></span>
        </div>
      </div>
    </div>
    <div class="save-wrapper" @click="ok">
      <j-button type="primary" jText="确定"></j-button>
    </div>
  </div>
</template>

<script>
  import JButton from 'components/utils/jbutton';
  export default {
    name: 'snProvince',
    props: {
      shortProvince: {
        type: String
      }
    },
    created: function () {
      this.initDefaultSelected();
    },
    data () {
      return {
        snProvince: [
          [{name: '京', isSelect: ''}, {name: '沪', isSelect: ''}, {name: '浙', isSelect: ''},
            {name: '苏', isSelect: ''}, {name: '粤', isSelect: ''}, {name: '鲁', isSelect: ''}],
          [{name: '晋', isSelect: ''}, {name: '冀', isSelect: ''}, {name: '豫', isSelect: ''},
            {name: '川', isSelect: ''}, {name: '渝', isSelect: ''}, {name: '辽', isSelect: ''}],
          [{name: '吉', isSelect: ''}, {name: '黑', isSelect: ''}, {name: '皖', isSelect: ''},
            {name: '鄂', isSelect: ''}, {name: '湘', isSelect: ''}, {name: '赣', isSelect: ''}],
          [{name: '闽', isSelect: ''}, {name: '陕', isSelect: ''}, {name: '甘', isSelect: ''},
            {name: '宁', isSelect: ''}, {name: '蒙', isSelect: ''}, {name: '津', isSelect: ''}],
          [{name: '贵', isSelect: ''}, {name: '云', isSelect: ''}, {name: '桂', isSelect: ''},
            {name: '琼', isSelect: ''}, {name: '青', isSelect: ''}, {name: '新', isSelect: ''}],
          [{name: '藏', isSelect: ''}]],
        currentValue: ''
      }
    },
    computed: {},
    methods: {
      initDefaultSelected: function () {
        this.currentValue = this.shortProvince; // 初始化当前城市
        for (let i = 0; i < this.snProvince.length; i++) {
          let temp = this.snProvince[i];
          for (let j = 0; j < temp.length; j++) {
            let itemIn = temp[j];
            if (itemIn.name === this.shortProvince) {
              itemIn.isSelect = 'selected';
              return; // 快速退出多重循环
            }
          }
        }
      },
      selectProvince: function (indexOuter, indexInner) {
        // 车牌按钮
        if (!this.snProvince[indexOuter][indexInner].isSelect) { // 当前车牌未选中
          // 全部清空
          this.snProvince.forEach(function (item) {
            item.forEach(function (item) {
              item.isSelect = '';
            });
          });
          // 更改选中项的颜色
          this.snProvince[indexOuter][indexInner].isSelect = 'selected';
          this.currentValue = this.snProvince[indexOuter][indexInner].name;
        }
      },
      ok: function () {
        this.$emit('setShortProvince', this.currentValue);
      }
    },
    components: {
      'j-button': JButton
    }
  }
</script>

<style scoped lang="less">
  .keyboard-wrapper {
    padding: 0.4rem;
    background-color: #ebebeb;
    .province-container {
      .province-row {
        display: flex;
        margin-bottom: 0.133333rem;
        .province-item {
          width: 16.666666%;
          .keyboard {
            display: inline-block;
            width: 100%;
            height: 1.066667rem;
            line-height: 1.066667rem;
            background: #fff;
            color: #333;
            border: 1px solid #d3d3d3;
            font-size: 14px;
          }
          .selected {
            color: #fff;
            background-color: #18adfb;
          }
        }
      }
      .province-row div:last-child {
        margin-bottom: 0;
      }
    }
    .save-wrapper {
      margin-top: 0.4rem;
      height: 1.12rem;
    }
  }

  [data-dpr="2"]
   .keyboard-wrapper {
    .province-container {
      .province-row {
        .province-item {
          .keyboard {
            font-size: 30px;
          }
        }
      }
    }
  }

  [data-dpr="3"]
  .keyboard-wrapper {
    .province-container {
      .province-row {
        .province-item {
          .keyboard {
            font-size: 42px;
          }
        }
      }
    }
  }
</style>
