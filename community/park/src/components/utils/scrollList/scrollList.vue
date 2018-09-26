<template>
  <div class="letter-wrapper" ref="letterWrapper">
    <ul class="scroll-wrapper" ref="scrollWrapper">
      <li class="letter" v-for="outData in scrollDatas">
        <div class="letter-name" v-text="outData.letter"></div>
        <ul class="item-wrapper">
          <li class="item vux-1px-b" v-for="blockData in outData.blockList" v-if="!blockData.buildList.length"
              @click="selectItem(blockData.name, '')">
            <span class="text" v-text="blockData.name"></span>
            <span class="icon" v-if="isNeedSelected" v-show="blockData.selected"></span>
          </li>
          <li v-for="blockData in outData.blockList" v-if="blockData.buildList.length">
            <ul>
              <li class="item vux-1px-b" v-for="buildData in blockData.buildList"
                   @click="selectItem(blockData.name, buildData.name)">
                <span class="text" v-text="blockData.name ? (blockData.name + connectSymbol + buildData.name) : buildData.name"></span>
                <span class="icon" v-if="isNeedSelected" v-show="blockData.selected && buildData.selected"></span>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <div class="right-letter-list">
      <ul>
        <li class="letter-item" v-text="letter" v-for="letter in rightLetterLists" :data-anchor="letter"
            @touchmove="touchMove" @touchstart="touchStart">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  // 获取根节点字体大小
  const htmlFontSize = getComputedStyle(window.document.documentElement)['font-size'];
  const remRate = parseInt(htmlFontSize.substring(0, (htmlFontSize.length - 2)));
  const CONNECTSYMBOL = '-';
  export default {
    name: 'scrollList',
    props: {
      scrollDatas: {
        type: Array,
        default: function () {
          return [];
        }
      },
      isNeedSelected: {
        type: Boolean,
        default: true
      }
    },
    created: function () {
      this.initList();
    },
    data () {
      return {
        connectSymbol: CONNECTSYMBOL,
        scroll: undefined,
        anchorMap: {},
        touch: {},
        firstTouch: undefined
      }
    },
    computed: {
      rightLetterLists: function () {
        let y = 0;
        let titleHeight = 0.746667; // 字母div height
        let itemHeight = 1.173333; // 字母下的条目div height
        let rightLetterLists = [];
        let _this_ = this;
        this.scrollDatas.forEach(function (group) {
          let name = group.letter.substr(0, 1);
          let len = 0;
          group.blockList.forEach(function (block) {
            if (block.buildList && block.buildList.length) { // 既有苑,又有幢
              len += block.buildList.length;
            } else {
              len += 1; // 仅有苑
            }
          });
          rightLetterLists.push(name);
          _this_.anchorMap[name] = y;
          y -= titleHeight + len * itemHeight;
        });
        return rightLetterLists;
      }
    },
    methods: {
      initList: function () {
        let _this_ = this;
        setTimeout(function () {
          if (!_this_.scroll) {
            _this_.scroll = new BScroll(_this_.$refs.letterWrapper, {
              startX: 0,
              startY: 0,
              probeType: 3,
              click: true
            });
          } else {
            _this_.$nextTick(function () {
              _this_.scroll.refresh();
            })
          }
        }, 400)
      },
      scrollTo: function (anchor) {
        let letterWrapper = this.$refs.letterWrapper;
        let scrollWrapper = this.$refs.scrollWrapper;
        let maxScrollY = letterWrapper.clientHeight - scrollWrapper.clientHeight;
        let y = Math.min(0, Math.max(maxScrollY / remRate, this.anchorMap[anchor])) * remRate;
        if (typeof y !== 'undefined') {
          this.scroll.scrollTo(0, y);
        }
      },
      touchStart: function (e) {
        let anchor = e.target.getAttribute('data-anchor');
        this.firstTouch = e.touches[0];
        this.touch.y1 = this.firstTouch.pageY / remRate;
        this.touch.anchor = anchor;
        this.scrollTo(anchor);
      },
      touchMove: function (e) {
        this.firstTouch = e.touches[0];
        this.touch.y2 = this.firstTouch.pageY / remRate;
        let anchorHeight = 0.426667;
        let delta = (this.touch.y2 - this.touch.y1) / anchorHeight | 0;
        let anchor = this.rightLetterLists[this.rightLetterLists.indexOf(this.touch.anchor) + delta];
        this.scrollTo(anchor);
        e.preventDefault();
        e.stopPropagation();
      },
      selectItem: function (blockName, buildName) {
        this.$emit('getParkingList', blockName, buildName)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .letter-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    .scroll-wrapper {
      text-align: left;
      .letter {
        .letter-name {
          padding-left: 0.426667rem;
          height: 0.746667rem;
          line-height: 0.746667rem;
          background-color: #f5f5f5;
          color: #878787;
          font-size: 12px;
        }
        .item-wrapper {
          .item {
            display: flex;
            align-items:center;
            justify-content: space-between;
            height: 1.173333rem;
            padding-left: 0.426667rem;
            padding-right: 1.333333rem;
            background-color: #fff;
            color: #333;
            font-size: 14px;
            .icon {
              display: inline-block;
              width: 0.426667rem;
              height: 0.426667rem;
              background-size: 100%;
              background-repeat:no-repeat;
              background-image: url('../../../assets/img/@2x/single-checked.png');
            }
          }
        }
      }
    }
    .right-letter-list {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      z-index: 30;
      width: 0.533333rem;
      font-size: 12px;
      color: #18ADFB;
      .letter-item {
        padding-top: 0.106667rem;
      }
      .item-wrapper {
        .item {
          font-size: 30px;
        }
      }
    }
  }

  [data-dpr="2"]
  .letter-wrapper {
    .scroll-wrapper {
      .letter {
        .letter-name {
          font-size: 24px;
        }
        .item-wrapper {
          .item {
            font-size: 30px;
          }
        }
      }
    }
    .right-letter-list {
      font-size: 24px;
    }
  }

  [data-dpr="3"]
  .letter-wrapper {
    .scroll-wrapper {
      .letter {
        .letter-name {
          font-size: 42px;
        }
        .item-wrapper {
          .item {
            font-size: 54px;
            .icon {
              background-image: url('../../../assets/img/@3x/single-checked@3x.png');
            }
          }
        }
      }
    }
    .right-letter-list {
      font-size: 42px;
    }
  }
</style>
