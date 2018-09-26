<template>
  <div class="buildImg commonHeader">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="小区图片">
    </x-header>
    <div class="imgBanner" v-if="imgData.length">
      <div class="imgList" v-for="(item, i) in imgData">
        <p>{{item.name}}</p>
        <ul class="friends-item">
          <li v-for="(items, index) in item.picList">
            <!--<img class="previewer-demo-img" :src="imgs.url" alt="">-->
            <img class="previewer-demo-img" :src="items.src" alt="" @click="show(index, i)">
          </li>
        </ul>
        <div v-transfer-dom>
          <previewer ref="previewer" :list="item.picList" :options="options(i)"></previewer>
        </div>
      </div>
    </div>
    <div class="noContent" v-if="!imgData.length">
      <img src="../../../assets/images/No-content.png" alt="">
      <p>什么都没发现，去别处看看吧</p>
      <!--<span @click="toPublish">去发帖</span>-->
    </div>
  </div>
</template>
<script>
  import { XHeader, Previewer, TransferDom } from 'vux'
  export default {
    name: 'buildImg',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Previewer
    },
    data () {
      return {
        imgData: []
      }
    },
    created () {
      this.getImagesList();
    },
    methods: {
      getImagesList () {
        let that = this;
        that.$vux.loading.show({
          text: '加载中'
        });
        that.$JHttp({
          method: 'get',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          },
          url: window.baseURL + '/community/pic'
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            that.$vux.loading.hide();
//            that.imgData = res.data;
            data.forEach(res => {
              let obj = {
                name: res.name,
                picList: that.getImgList(res.picList)
              };
              that.imgData.push(obj)
            })
          }
        }).catch(err => {
          console.log(err);
        })
      },
      show (index, i) {
        this.$refs.previewer[i].show(index)
      },
      options (i) {
        let that = this;
        return {
          getThumbBoundsFn (index) {
            // find thumbnail element
//            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index];
            let thumbnail = document.querySelectorAll('.friends-item')[i].querySelectorAll('.previewer-demo-img')[index];
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect();
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      },
      getImgList (val) {
        let obj1 = {};
        let arr = [];
        if (val) {
          val.forEach(res => {
            obj1 = {
              src: res.url
            };
            arr.push(obj1)
          });
          return arr
        } else {
          return [{src: ''}]
        }
      },
      clickToShow (val) {
        console.log(val);
//        this.$router.push('/buildImgDetail')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .noContent{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 142.5px;
    margin-bottom: 284.5px;
    img{
      width: 150px;
      height: 150px;
    }
    p{
      margin-top: 10px;
      color: #aaaaaa;
      font-size: 15px;
    }
  }
  .imgBanner{
    background-color: #ffffff;
    padding: 0 15px;
    .imgList{
      padding-top: 20px;
      p{
        font-size: 18px;
        color: #333333;
      }
      ul{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
        margin-top: 15px;
        li{
          width: 109px;
          height: 109px;
          /*height: 100px;*/
          margin-bottom: 9px;
          margin-left: 9px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        li:nth-child(3n + 1){
          margin-left: 0;
        }
      }
    }
    .imgList:first-child {
      padding-top: 15px;
    }
  }
</style>
