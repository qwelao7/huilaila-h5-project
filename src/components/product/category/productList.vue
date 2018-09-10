<template>
  <div class="category-product-wrapper">
    <div class="category-product-list-wrapper" v-if="tabs.length">
      <category-tab :tabs="tabs"></category-tab>
    </div>
  </div>
</template>

<script>
  import CategoryTab from 'components/product/category/CategoryTab';
  export default {
    name: 'ShopperProductList',
    components: {
      'category-tab': CategoryTab
    },
    data () {
      return {
        tabs: []
      }
    },
    created () {
      this.getCategoryInfo();
    },
    computed: {
      categoryId () {
        return this.$route.params.categoryId;
      }
    },
    methods: {
      getCategoryInfo () {
        let categoryId = this.$route.params.categoryId;
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/goodsCategory/getSectionCategoryByParentId?categoryId=' + categoryId
        }).then(res => {
          if (res.status === 100) {
            let data = res.data;
            _this_.tabs = data;
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .shopper-product-wrapper {
    .shopper-cover {
      width: 100%;
      position: relative;
      background: rgba(51, 51, 51, 0.3);
      .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        -webkit-filter: blur(25px);
        filter: blur(25px);
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .header {
        position: relative;
        z-index: 1;
        padding: 10px 15px 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon {
          position: relative;
          width: 28px;
          height: 28px;
        }
        .icon:before {
          content: "";
          position: absolute;
          width: 14px;
          height: 14px;
          border: 1px solid #fff;
          border-width: 1px 0 0 1px;
          transform: rotate(315deg);
          top: 7px;
          left: 7px;
        }
        .detail {
          font-size: 15px;
          line-height: 21px;
          color: #fff;
        }
      }
      .content {
        position: relative;
        z-index: 1;
        padding: 11px 15px 10px 15px;
        display: flex;
        align-items: center;
        .img {
          flex: 0 0 60px;
          height: 60px;
          border-radius: 100%;
          border: 2px solid #fff;
          background-size: 100%;
          background-repeat: no-repeat;
          margin-right: 10px;
        }
        .right {
          color: #fff;
          width: 275px;
          .title {
            font-size: 21px;
            line-height: 30px;
          }
          .carriage-fee {
            font-size: 12px;
            line-height: 17px;
          }
          .description {
            display: flex;
            align-items: center;
            .text {
              flex: 1;
              font-size: 12px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .icon {
              flex: 0 0 16px;
              height: 16px;
              position: relative;
            }
            .icon:before {
              content: "";
              position: absolute;
              width: 10px;
              height: 10px;
              border: 1px solid #fff;
              border-width: 1px 0 0 1px;
              transform: rotate(-225deg);
              top: 3px;
              left: 3px;
            }
          }
        }
      }
      .description-detail {
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        -webkit-transition: all 0.5s;
        transition: all 0.5s;
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        opacity: 1;
        background: rgba(7,17,27,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        .detail-wrapper {
          text-align: center;
          margin: 0 15px;
          .title {
            font-size: 16px;
            margin-bottom: 20px;
          }
          .description-text {
            font-size: 14px;
          }
        }
        .icon-close {
          position: absolute;
          bottom: 20px;
          width: 22px;
          height: 22px;
          background-size: 100%;
          background-repeat: no-repeat;
          background-image: url("../../../assets/images/close_icon_myorder.png");
        }
      }
    }
    .shopper-product-list-wrapper {
      width: 100%;
      height: 544px;
    }
  }
</style>
