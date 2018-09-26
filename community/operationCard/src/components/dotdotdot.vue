<template>
    <div class="dotdotdot">
        <span class='dotimg' @click="showTip"></span>
        <div class='ignore-lay' v-show="isShow" ref="ignoreLay" @click="handleBodyClick($event)">
          <div class='ignore-laybody'>
            <div class='ignore' @click="ignoreItem">
                <img src='../assets/img/ignore_icon@2x.png' width="16">
                <span>忽略此动态</span>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      isShow: false
    };
  },
  created () {
    // document.addEventListener('click', this.handleBodyClick(this.$refs.ignoreLay));
  },
  methods: {
    showTip: function () {
      this.isShow = !this.isShow;
    },
    ignoreItem: function () {
      this.$emit('remove');
      this.isShow = false;
    },
    handleBodyClick: function (e) {
      if (e.target.getAttribute('class') === 'ignore') {
        return false;
      } else {
        this.isShow = false;
      }
    }
  }
};
</script>

<style scoped>
.dotdotdot {
    flex: 0 0 0.7466666666666667rem;
    height: 0.7466666666666667rem;
}
.dotimg{
    background: url('../assets/img/dotdotdot_icon@2x.png');
    background-size: 100% 100%;
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
}
.ignore-lay{
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 111;
}
.ignore-laybody{
    /*position: relative;*/
    width: 100%;
    height: 100%;
}
.ignore{
    position: absolute;
    right: 0.2666666666666667rem;
    top: 1.28rem;
    height: 1.6rem;
    background-color: rgba(0,0,0,0.80);
    color: #fff;
    border-radius: 0.1066666666666667rem;
    width: 5.3333333333333rem;
    font-size: 0.4rem;
    font-weight: 400;
    display: flex;
    align-items: center;
}
.ignore img{
   padding: 0 0.4rem;
}
</style>
