<template>
  <div class="sort-search-wrapper" @click="search">
    <span class="text" v-text="title" :style="{color: textColor}"></span>
    <div class="icon-wrapper">
      <span class="up-icon" :class="{'up-icon-selected': (selected && type === 'up')}"></span>
      <span class="down-icon" :class="{'down-icon-selected': (selected && type === 'down')}"></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SortSearch',
    props: {
      selected: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: 'xxx'
      },
      sortsUp: {
        type: String,
        default: '0'
      },
      sortsDown: {
        type: String,
        default: '1'
      },
      activeColor: {
        type: String,
        default: '#FF6648'
      },
      deActiveColor: {
        type: String,
        default: '#AAAAAA'
      }
    },
    created: function () {
    },
    data () {
      return {
        type: 'up',
        sortType: ''
      }
    },
    computed: {
      textColor () {
        if (this.selected) {
          return this.activeColor;
        } else {
          return this.deActiveColor;
        }
      }
    },
    methods: {
      search () {
        if (this.type === 'up') {
          this.type = 'down';
          this.sortType = this.sortsUp;
        } else {
          this.type = 'up';
          this.sortType = this.sortsDown;
        }
        this.$emit('search', this.sortType);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.sort-search-wrapper {
  display: flex;
  align-items: flex-end;
  .text {
    font-size: 13px;
  }
  .icon-wrapper {
    span {
      width: 14px;
      height: 11px;
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .up-icon {
      background-image: url("../../assets/images/sortup_icon_grey.png");
    }
    .up-icon-selected {
      background-image: url("../../assets/images/sortup_icon_red.png");
    }
    .down-icon {
      background-image: url("../../assets/images/sortup_icon_grey.png");
      transform: rotate(-180deg);
    }
    .down-icon-selected {
      background-image: url("../../assets/images/sortup_icon_red.png");
    }
  }
}
</style>
