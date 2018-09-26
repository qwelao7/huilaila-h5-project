<template>
  <div class="owner-parking-list-wrapper">
    <ul class="parking-wrapper">
      <li class="parking-item vux-1px-b" v-for="parking in ownerParkingList" @click="selectOwnerParking(parking)">
        <span class="text" v-text="parking.parkingNO"></span>
        <span class="icon" v-show="parking.selected"></span>
      </li>
    </ul>
    <div class="save-wrapper" @click="selectOtherParking">
      <j-button type="primary" jText="其他车位"></j-button>
    </div>
  </div>
</template>

<script>
  import router from '../../router';
  import JButton from 'components/utils/jbutton';
  export default {
    name: 'ownerParkingList',
    created: function () {
      this.initOwnerParkingList();
    },
    data () {
      return {
      }
    },
    components: {
      'j-button': JButton
    },
    computed: {
      ownerParkingList: function () {
        return this.$store.state.pageCfg.ownerParkingList;
      }
    },
    methods: {
      initOwnerParkingList: function () {
        let parkingId = this.$route.params.parkingId;
        this.parkingId = parkingId;
        let _this_ = this;
        if (this.ownerParkingList && this.ownerParkingList.length) {
          this.ownerParkingList.forEach(function (parking) {
            if (parking.parkingId === parkingId) {
              _this_.$set(parking, 'selected', true); // 当前绑定的车位
            } else {
              _this_.$set(parking, 'selected', false); // 业主的其他车位
            }
          });
        }
      },
      selectOwnerParking: function (parking) {
        // 先取消所有选择
        this.ownerParkingList.forEach(function (parking) {
          parking.selected = false;
        });
        // 再选中当前项
        parking.selected = true;
        // 将选择的车位号加入状态管理
        this.$store.commit('updateSelectedParking', {
          selectedParking: parking
        });
        // 返回到添加车位页面
        router.go(-1);
      },
      selectOtherParking: function () {
        router.push({ // 进入苑幢列表页
          name: 'blockBuildingList',
          params: {
            parkingId: this.parkingId
          }
        });
      }
    }
  }
</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped lang="less">
  .owner-parking-list-wrapper {
    width: 100%;
    height: 100%;
    background-color: #ebebeb;
    .parking-wrapper {
      padding: 0 0.4rem;
      background-color: #fff;
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
    .save-wrapper {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 1.12rem;
    }
}
    [data-dpr="2"]
    .owner-parking-list-wrapper {
      .parking-wrapper {
        .parking-item {
          .text {
            font-size: 30px;
          }
        }
      }
    }
  [data-dpr="3"]
    .owner-parking-list-wrapper {
    .parking-wrapper {
      .parking-item {
        .text {
          font-size: 54px;
        }
      }
    }
  }
</style>
