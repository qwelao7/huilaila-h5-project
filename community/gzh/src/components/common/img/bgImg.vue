<template>
  <span class="bg-img-wrapper"
        :data-bg-img="bgImgUrl"
        :class="customClasses"
        :style="{width: remWidth, height: remHeight, backgroundImage: bgUrl}"></span>
</template>

<script>
  const htmlFontSize = getComputedStyle(window.document.documentElement)['font-size'];
  const remRate = parseFloat(htmlFontSize.substring(0, (htmlFontSize.length - 2)));
  export default {
    name: 'BGImg',
    props: {
      osskey: '',
      extendStyle: '',
      customClass: '',
      type: {
        type: String,
        default: 'small'
      },
      customWidth: '',
      customHeight: ''
    },
    created: function () {
      if (typeof this.customClass === 'string') {
        this.customClasses = this.customClass.split(',');
      } else if (typeof this.customClass === 'object') {
        this.customClasses = this.customClass;
      }
    },
    data () {
      return {
        bgUrl: '',
        customClasses: []
      }
    },
    computed: {
      width () {
        if (this.customWidth) {
          return this.customWidth;
        }
        if (this.type === 'small') {
          return '30';
        } else if (this.type === 'middle') {
          return '100';
        } else if (this.type === 'big') {
          return '350';
        }
      },
      remWidth () {
        // 图片适配不同机型(等价于rem布局)
        let remWidth = this.width / window.commonConfig.baseSize;
        let fitWidth = (remWidth * remRate).toFixed(0);
        return fitWidth + 'px';
      },
      height () {
        if (this.customHeight) {
          return this.customHeight;
        }
        if (this.type === 'small') {
          return '30';
        } else if (this.type === 'middle') {
          return '100';
        } else if (this.type === 'big') {
          return '350';
        }
      },
      remHeight () {
        let remHeight = this.height / window.commonConfig.baseSize;
        let fitHeight = (remHeight * remRate).toFixed(0);
        return fitHeight + 'px';
      },
      bgImgUrl () {
        let _this_ = this;
        this.fitBGImg(this.osskey, this.width, this.height, function (res) {
          if (_this_.extendStyle) {
            res = _this_.extendStyle + ' ' + res;
          }
          _this_.bgUrl = res;
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.bg-img-wrapper {
  background-size: 100%;
  background-repeat: no-repeat;
}
</style>
