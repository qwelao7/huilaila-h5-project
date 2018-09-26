<template>
  <div style="height: 100%;width: 100%;" v-if="!isLoading">
    <div class="carNO-list-wrapper" v-if="carNOList.length">
      <div class="list-wrapper">
        <div v-for="carNO in carNOList" class="carNO-item">
          <swipeout>
            <swipeout-item class="swipeout-carNO" :sensitivity="0.266667" transition-mode="follow">
              <div slot="right-menu">
                <swipeout-button type="primary" :width="1.653333" class="edit" @click.native="editCarNO(carNO)">编辑</swipeout-button>
                <swipeout-button type="warn" :width="1.653333" class="delete" @click.native="showDeleteModal(carNO.carId)">删除</swipeout-button>
              </div>
              <div slot="content" class="carNO" @click="chooseCarNO(carNO)">
                <div class="left">
                  <span class="car-bg"></span>
                </div>
                <div class="middle">
                  <div class="top">
                    <span v-text="carNO.carNO"></span>
                  </div>
                  <div class="bottom">
                    <span class="name" v-text="carNO.driverName"></span>
                    <span class="phone" v-text="carNO.driverPhone"></span>
                  </div>
                </div>
                <div class="right">
                  <span class="icon-check" :class="{checked: carNO.checked, unchecked: !carNO.checked}"></span>
                </div>
              </div>
            </swipeout-item>
          </swipeout>
        </div>
      </div>
      <div class="addCarNO" @click="addCarNO">
        <span class="add-icon"></span>
        <span class="add-text">新增车牌</span>
      </div>
      <!--删除车位dialog begin-->
      <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
        <span class="delete-info vux-1px-b">确定要删除吗?</span>
        <div class="operate-wrapper">
          <span class="text vux-1px-r" @click="deleteModalShow = false">取消</span>
          <span class="text" @click="deleteCarNO()">确定</span>
        </div>
      </x-dialog>
      <!--删除车位dialog end-->
    </div>
    <div class="noCarNO-wrapper" v-if="!carNOList.length">
      <div class="placeholder">
        <span class="icon"></span>
        <div class="text">您还未添加车牌</div>
      </div>
      <div class="add-btn" @click="addCarNO">
        <j-button jText="新增车牌"></j-button>
      </div>
    </div>
  </div>
</template>

<script>
  import router from '../../router';
  import {Swipeout, SwipeoutItem, SwipeoutButton} from 'components/utils/swipeout/index';
  import JButton from 'components/utils/jbutton';
  import Toast from 'components/utils/toast/toast';
  export default {
    name: 'list',
    created: function () {
      document.title = '我的车牌';
      // 请求车牌列表接口
      this.getCarNOList();
    },
    data () {
      return {
        isLoading: true,
        carNOList: [],
        hideOnBlur: true,
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '0.4rem 0 0 0',
          borderRadius: '0.266667rem'
        },
        deleteCarId: ''
      }
    },
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      'j-button': JButton
    },
    methods: {
      getCarNOList: function () {
        let _this_ = this;
        this.$JHttp.get(window.homeURL + '/sharedPark/car').then((res) => {
          if (res.data.status === 100) {
            let dataList = res.data.data;
            if (dataList && dataList.length) {
              let carNOList = [];
              dataList.forEach(function (car) {
                carNOList.push({
                  carId: car.id,
                  carNO: car.carNum,
                  driverName: car.driverName,
                  driverPhone: car.driverMobile,
                  checked: car.isDefault,
                  type: car.type // 0 普通, 1 特殊
                })
              });
              _this_.carNOList = carNOList;
            } else {
              _this_.carNOList = [];
            }
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
          _this_.isLoading = false;
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
          _this_.isLoading = false;
        });
      },
      addCarNO: function () {
        router.push('/carNO/addCarNO');
      },
      editCarNO: function (car) {
        router.push({
          name: 'editCarNO',
          params: {
            car: car
          }
        });
      },
      showDeleteModal: function (carId) {
        this.deleteModalShow = true;
        this.deleteCarId = carId;
      },
      deleteCarNO: function () {
        // 调用删除车牌的接口
        let _this_ = this;
        this.$JHttp.delete(window.homeURL + '/sharedPark/car/' + this.deleteCarId).then((res) => {
          if (res.data.status === 100) {
            // 成功,则重新调用获取车牌列表接口
            _this_.getCarNOList();
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
        this.deleteModalShow = false;
        this.deleteCarId = '';
      },
      chooseCarNO: function (carNO) {
        // 调用设置默认车牌的接口
        this.$JHttp.put(window.homeURL + '/sharedPark/car/' + carNO.carId + '/default').then((res) => {
          if (res.data.status === 100) {
            // 成功,则设置默认车牌为勾选状态
            var _this_ = this;
            this.carNOList.forEach(function (item) {
              _this_.$set(item, 'checked', false);
            });
            this.$set(carNO, 'checked', true);
            // 跳转到我要停车首页
            router.push('/home/park');
          } else {
            // 接口没有返回数据
            Toast(res.data.errMsg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .carNO-list-wrapper {
    background-color: #ebebeb;
    padding: 0.4rem;
    .list-wrapper {
      .carNO-item {
        margin-bottom: 0.4rem;
        .swipeout-carNO {
          height: 4.133333rem;
          .vux-swipeout-button-box {
            left: auto;
          }
          .vux-swipeout-content {
            height: 100%;
            border-radius: 0.266667rem;
            background-image: -webkit-linear-gradient(-360deg, #0ad5db, #18b0f9);
            .carNO {
              height: 100%;
              display: flex;
              color: #fff;
              .left {
                flex: 0 0 30%;
                display: flex;
                align-items: center;
                .car-bg {
                  display: inline-block;
                  width: 2.586667rem;
                  height: 3.333333rem;
                  background-size: 100%;
                  background-repeat: no-repeat;
                  background-image: url('../../assets/img/@2x/carNO.png');
                }
              }
              .middle {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: left;
                .top {
                  font-size: 28px;
                  line-height: 28px;
                  padding-bottom: 0.826667rem;
                }
                .bottom {
                  font-size: 14px;
                  line-height: 14px;
                  .name {
                    display: block;
                    margin-bottom: 0.16rem;
                  }
                }
              }
              .right {
                flex: 0 0 20%;
                display: flex;
                justify-content: center;
                align-items: center;
                .icon-check {
                  display: inline-block;
                  width: 0.986667rem;
                  height: 0.986667rem;
                  background-size: 100%;
                  background-repeat: no-repeat;
                }
                .checked {
                  background-image: url('../../assets/img/@2x/carNO-selected.png');
                }
                .unchecked {
                  background-image: url('../../assets/img/@2x/carNO-empty.png');
                }
              }
            }
          }

        }
      }
    }
    .list-wrapper div:last-child {
      margin-bottom: 0;
    }
    .addCarNO {
      margin-top: 0.8rem;
      .add-icon {
        display: inline-block;
        width: 0.426667rem;
        height: 0.426667rem;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url('../../assets/img/@2x/add.png');
      }
      .add-text {
        margin-left: 0.133333rem;
        color: #aaa;
        font-size: 18px;
      }
    }
    .delete-wrapper {
      .delete-info {
        color: #333;
        font-size: 14px;
        display: inline-block;
        width: 100%;
        padding-bottom: 0.4rem;
      }
      .operate-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.44rem;
        .text {
          display: inline-block;
          width: 50%;
          height: 100%;
          line-height: 1.44rem;
          color: #18adfb;
          font-size: 16px;
        }
      }
    }
  }
  [data-dpr="2"]
  .carNO-list-wrapper {
    .list-wrapper {
      .carNO-item {
        .swipeout-carNO {
          .vux-swipeout-content {
            .carNO {
              .middle {
                .top {
                  font-size: 50px;
                  line-height: 50px;
                }
                .bottom {
                  font-size: 24px;
                  line-height: 24px;
                }
              }
            }
          }
        }
      }
    }
    .addCarNO {
      .add-text {
        font-size: 36px;
      }
    }
    .delete-wrapper {
      .delete-info {
        font-size: 30px;
      }
      .operate-wrapper {
        .text {
          font-size: 34px;
        }
      }
    }
  }
  [data-dpr="3"]
  .carNO-list-wrapper {
    .list-wrapper {
      .carNO-item {
        .swipeout-carNO {
          .vux-swipeout-content {
            .carNO {
              .left {
                .car-bg {
                  background-image: url('../../assets/img/@3x/carNO@3x.png');
                }
              }
              .middle {
                .top {
                  font-size: 74px;
                  line-height: 74px;
                }
                .bottom {
                  font-size: 40px;
                  line-height: 40px;
                }
              }
              .right {
                .checked {
                  background-image: url('../../assets/img/@3x/carNO-selected@3x.png');
                }
                .unchecked {
                  background-image: url('../../assets/img/@3x/carNO-empty@3x.png');
                }
              }
            }
          }
        }
      }
    }
    .addCarNO {
      .add-icon {
        background-image: url('../../assets/img/@3x/add@3x.png');
      }
      .add-text {
        font-size: 54px;
      }
    }
    .delete-wrapper {
      .delete-info {
        font-size: 54px;
      }
      .operate-wrapper {
        .text {
          font-size: 60px;
        }
      }
    }
  }

  .noCarNO-wrapper {
    width: 100%;
    height: 100%;
    background-color: #ebebeb;
    .placeholder {
      padding-top: 4.72rem;
      .icon {
        display: block;
        width: 2.666667rem;
        height: 2.666667rem;
        margin: 0 auto;
        background-size: 100%;
        background-repeat:no-repeat;
        background-image: url("../../assets/img/@2x/placeholder.png");
      }
      .text {
        margin-top: 0.4rem;
        color: #aaa;
        font-size: 12px;
      }
    }
    .add-btn {
      position: fixed;
      bottom:0;
      left:0;
      width:100%;
      height: 1.2rem;
    }
  }
  [data-dpr="2"]
  .noCarNO-wrapper {
    .placeholder {
      .text {
        font-size: 24px;
      }
    }
  }
  [data-dpr="3"]
  .noCarNO-wrapper {
    .placeholder {
      .icon {
        background-image: url("../../assets/img/@3x/placeholder@3x.png");
      }
      .text {
        font-size: 42px;
      }
    }
  }
</style>
