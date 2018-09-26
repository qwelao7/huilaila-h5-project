<template>
  <div class="parking-list-wrapper">
    <ul class="parking-list">
      <li class="parking-item vux-1px-b" v-for="parking in parkingList" @click="selectParking(parking)">
        <span class="text" v-text="parking.parkingNO"></span>
        <span class="icon" v-show="parking.selected"></span>
      </li>
    </ul>
  </div>
</template>

<script>
  import router from '../../router';
  import {querystring} from 'vux';
  import Toast from 'components/utils/toast/toast';
  export default {
    name: 'parkingList',
    created: function () {
      this.initParkingList();
    },
    data () {
      return {
        parkingList: []
      }
    },
    computed: {
      ownerParkingList: function () {
        return this.$store.state.pageCfg.ownerParkingList;
      },
      currentParkingId: function () {
        let selectedParking = this.$store.state.pageCfg.selectedParking;
        if (selectedParking) {
          return selectedParking.parkingId;
        }
      }
    },
    methods: {
      initParkingList: function () {
        // 根据路由获取苑,幢名称和车位号ID
        let blockBuilding = this.$route.params.blockBuilding;
        let parkingId = this.currentParkingId;
        // 调用获取车位号列表的接口
        let _this_ = this;
        let postData = {
          blockName: blockBuilding.blockName,
          buildingNumber: blockBuilding.buildName
        };
        let postDataStr = querystring.stringify(postData);
        this.$JHttp.get(window.homeURL + '/sharedPark/garage/unitAndGarage?' + postDataStr).then((res) => {
          if (res.data.status === 100) {
            let data = res.data.data;
            if (data && data.length) {
              let parkingList = [];
              data.forEach(function (parking) {
                parkingList.push({
                  parkingId: parking.id,
                  parkingNO: parking.name
                })
              });
              _this_.parkingList = parkingList;
              // 从中间页跳转过来的,需要排除业主已有的车位号
              if (_this_.parkingList.length && _this_.ownerParkingList && _this_.ownerParkingList.length >= 2) {
                _this_.parkingList = _this_.removeOwnerParkingList(_this_.parkingList, _this_.ownerParkingList);
              }
              _this_.parkingList.forEach(function (item) {
                _this_.$set(item, 'selected', false); // 初始化为false
              });
              _this_.getSelectedParking(this.parkingList, parkingId);
            }
          } else {
            // 接口没有返回数据
            Toast(res.data.msg);
          }
        }).catch(function (response) {
          // 调用接口出错
          Toast(window.commonConfig.commonError);
        });
      },
      removeOwnerParkingList: function (allParkingList, ownerParkingList) {
        let resList = [];
        /* eslint-disable no-labels */
        outer:
        for (let i = 0; i < allParkingList.length; i++) {
          let parking = allParkingList[i];
          inner:
          for (let j = 0; j < ownerParkingList.length; j++) {
            let ownerParking = ownerParkingList[j];
            if (parking.parkingId === ownerParking.parkingId) {
              continue outer;
            }
          }
          resList.push(parking);
        }
        return resList;
      },
      /**
       *  获取用户当前的车位号,并打钩
       * @param parkingList  所选苑幢下的车位号集合
       * @param parkingId 用户持有的车位号Id
       */
      getSelectedParking: function (parkingList, parkingId) {
        if (!parkingList || !parkingList.length || !parkingId) {
          return;
        }
        let _this_ = this;
        parkingList.forEach(function (parking) {
          if (parking.parkingId === parkingId) {
            _this_.$set(parking, 'selected', true);
          }
        });
      },
      /**
       *  选择车位号,并跳转值添加车位页面
       * @param parking 车位号对象
       */
      selectParking: function (parking) {
        // 将选择的车位号加入状态管理
        this.$store.commit('updateSelectedParking', {
          selectedParking: parking
        });
        // 返回到添加车位页面
        let ownerParkingList = this.ownerParkingList;
        if (ownerParkingList && ownerParkingList.length >= 2) {
          router.go(-3);
        } else {
          router.go(-2);
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.parking-list-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .parking-list {
    padding: 0 0.4rem;
    .parking-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1.173333rem;
      text-align: left;
      .text {
        color: #333;
        font-size: 14px;
      }
      .icon {
        display: inline-block;
        width: 0.426667rem;
        height: 0.426667rem;
        background-size: 100%;
        background-repeat:no-repeat;
        background-image: url('../../assets/img/@2x/single-checked.png');
      }
    }
  }
}
  [data-dpr="2"]
  .parking-list-wrapper {
    .parking-list {
      .parking-item {
        .text {
          font-size: 30px;
        }
      }
    }
  }

[data-dpr="3"]
  .parking-list-wrapper {
  .parking-list {
    .parking-item {
      .text {
        font-size: 54px;
      }
      .icon {
        background-image: url('../../assets/img/@3x/single-checked@3x.png');
      }
    }
  }
}
</style>
