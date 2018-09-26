<template>
  <div class="block-wrapper">
    <scroll-list :scrollDatas="blockBuildList" v-on:getParkingList="getParkingList"></scroll-list>
  </div>
</template>

<script>
  import router from '../../router';
  import Toast from 'components/utils/toast/toast';
  import ScrollList from 'components/utils/scrollList/scrollList';
  export default {
    name: 'blockBuildingList',
    created: function () {
      this.initBlockBuildingList();
    },
    data () {
      return {
        blockBuildList: [],
        parkingId: ''
      }
    },
    methods: {
      initBlockBuildingList: function () {
        let _this_ = this;
        this.$JHttp.get(window.homeURL + '/sharedPark/garage/blockAndBuilding').then((res) => {
          if (res.data.status === 100) {
            let blockData = res.data.data;
            if (blockData && blockData.length) {
              let blockBuildList = blockData;
              let blockBuildListNew = [];
              // 初始化苑幢列表
              blockBuildList.forEach(function (item) {
                let blockList = item.blockList || [];
                let blockListNew = [];
                blockList.forEach(function (block) {
                  let buildList = block.buildList || [];
                  let buildListNew = [];
                  buildList.forEach(function (buildName) {
                    let buildNew = {
                      name: buildName,
                      selected: false
                    };
                    buildListNew.push(buildNew);
                  });
                  let blockNew = {
                    name: block.name,
                    buildList: buildListNew,
                    selected: false
                  }
                  blockListNew.push(blockNew);
                });
                let letterNew = {
                  letter: item.letter,
                  blockList: blockListNew
                }
                blockBuildListNew.push(letterNew);
              });
              _this_.blockBuildList = blockBuildListNew;
              // 根据路由,获取带过来的车位号Id,
              let parkingId = this.$route.params.parkingId;
              _this_.parkingId = parkingId;
              if (parkingId) { // 已经有车位号的情况下
                // 调取接口,获取车牌号所属的苑幢
                this.$JHttp.get(window.homeURL + '/sharedPark/roomInfo/' + parkingId).then((res) => {
                  if (res.data.status === 100) {
                    let data = res.data.data;
                    if (data) {
                      let blockBuilding = {
                        blockName: data.blockName,
                        buildName: data.buildingNumber
                      };
                      if (_this_.blockBuildList && _this_.blockBuildList.length) {
                        _this_.getSelectedBlockBuild(_this_.blockBuildList, blockBuilding);
                      }
                    }
                  } else {
                    // 接口没有返回数据
                    Toast(res.data.msg);
                  }
                }).catch(function (response) {
                  // 调用接口出错
                  Toast(window.commonConfig.commonError);
                });
              } else { // 没有车位号,则根据用户选过的苑幢进行判断
                _this_.getSelectedBlockBuild(_this_.blockBuildList, _this_.selectedBlockBuilding);
              }
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
      getSelectedBlockBuild: function (blockBuildList, blockBuilding) {
        if (!this.blockBuildList || !this.blockBuildList.length || !blockBuilding) {
          return;
        }
        for (let i = 0; i < this.blockBuildList.length; i++) {
          let item = this.blockBuildList[i];
          let blockList = item.blockList;
          if (blockList && blockList.length) {
            for (let j = 0; j < blockList.length; j++) {
              let block = blockList[j];
              if (block.name === blockBuilding.blockName) { // 苑相等
                block.selected = true;
                let buildList = block.buildList;
                if (buildList && buildList.length) {
                  for (var k = 0; k < buildList.length; k++) {
                    let build = buildList[k];
                    if (build.name === blockBuilding.buildName) {
                      build.selected = true;
                      return; // 快速挑出多重循环
                    }
                  }
                }
              }
            }
          }
        }
      },
      getParkingList: function (blockName, buildName) {
        // 更新苑幢的选中状态
        let blockBuilding = {
          blockName: blockName,
          buildName: buildName
        };
        this.getSelectedBlockBuild(this.blockBuildList, blockBuilding);
        // 将选择的苑幢加入到状态管理
        this.$store.commit('updateBlockBuilding', {
          blockBuilding: blockBuilding
        });
        // 跳转到车位号选择列表
        router.push({
          name: 'parkingList',
          params: {
            blockBuilding: blockBuilding,
            parkingId: this.parkingId
          }
        });
      }
    },
    computed: {
      selectedBlockBuilding: function () {
        return this.$store.state.pageCfg.blockBuilding;
      }
    },
    components: {
      'scroll-list': ScrollList
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .block-wrapper {
    width: 100%;
    height: 100%;
  }
</style>
