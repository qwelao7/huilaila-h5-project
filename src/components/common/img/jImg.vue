<template>
  <img :data-bg-img="imgUrl" :src="url" :class="customClasses" :style="{width: remWidth, height: remHeight}" alt="">
</template>

<script>
  const htmlFontSize = getComputedStyle(window.document.documentElement)['font-size'];
  const remRate = parseFloat(htmlFontSize.substring(0, (htmlFontSize.length - 2)));
  export default {
    name: 'Jimg',
    props: {
      osskey: '',
      customClass: '', // 一个自定义类传字符串,多个则传数组
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
        url: '',
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
      imgUrl () {
        let _this_ = this;
        // 图片处理为两倍图防模糊
        this.fitImg(this.osskey, Number(this.width) * 2, Number(this.height) * 2, function (res) {
          _this_.url = res;
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
