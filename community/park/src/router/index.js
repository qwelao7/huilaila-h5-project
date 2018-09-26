import Vue from 'vue'
import Router from 'vue-router'
import index from 'components/home/index';
Vue.use(Router)

export default new Router({
  routes: [
    { // 路由占位页
      path: '/home',
      name: 'index',
      component: index,
      children: [
        { // 我要停车首页
          path: '/home/park',
          name: 'park',
          component: resolve => require(['components/park/park'], resolve)
        }, { // 我要共享首页
          path: '/home/share',
          component: resolve => require(['components/share/share'], resolve)
        }, { // 停车记录首页
          path: '/home/records',
          component: resolve => require(['components/records/records'], resolve)
        }
      ]
    },
    { // 待支付页
      path: '/home/waiting2pay',
      name: 'waiting2pay',
      component: resolve => require(['components/park/waitingToPay'], resolve)
    },
    { // 正在支付中
      path: '/home/paying',
      name: 'balancePaying',
      component: resolve => require(['components/park/paying'], resolve)
    },
    { // 占位图页面
      path: '/home/empty',
      name: 'empty',
      component: resolve => require(['components/home/empty'], resolve)
    },
    { // 车牌列表
      path: '/carNO/list',
      name: 'carNOList',
      component: resolve => require(['components/carno/list'], resolve)
    },
    { // 新增车牌
      path: '/carNO/addCarNO',
      name: 'addCarNO',
      component: resolve => require(['components/carno/addCarNO'], resolve)
    },
    { // 编辑车牌
      path: '/carNO/editCarNO',
      name: 'editCarNO',
      component: resolve => require(['components/carno/editCarNO'], resolve)
    },
    { // 推荐车位页
      path: '/park/recommend',
      name: 'recommendList',
      component: resolve => require(['components/park/recommendList'], resolve)
    },
    { // 添加共享车位号
      path: '/share/addParking',
      name: 'addParking',
      component: resolve => require(['components/parking/addParking'], resolve)
    },
    { // 共享车位协议页
      path: '/share/protocol',
      name: 'protocol',
      component: resolve => require(['components/share/protocol'], resolve)
    },
    { // 收益列表页
      path: '/share/receive',
      name: 'receive',
      component: resolve => require(['components/share/receive'], resolve)
    },
    { // 共享车位详情
      path: '/share/parkingDetail',
      name: 'parkingDetail',
      component: resolve => require(['components/parking/parkingDetail'], resolve)
    },
    { // 编辑共享时段页面
      path: '/share/editSharingTime',
      name: 'editSharingTime',
      component: resolve => require(['components/parking/editSharingTime'], resolve)
    },
    { // 重复页面
      path: '/share/repeat',
      name: 'repeat',
      component: resolve => require(['components/parking/repeat'], resolve)
    },
    { // 业主名下的车位号列表
      path: '/share/ownerParkingList',
      name: 'ownerParkingList',
      component: resolve => require(['components/parking/ownerParkingList'], resolve)
    },
    { // 苑幢列表
      path: '/share/blockBuildingList',
      name: 'blockBuildingList',
      component: resolve => require(['components/parking/blockBuildingList'], resolve)
    },
    { // 某苑幢下的车位号列表
      path: '/share/parkingList',
      name: 'parkingList',
      component: resolve => require(['components/parking/parkingList'], resolve)
    },
    { // 停车记录详情(订单详情)
      path: '/records/recordDetail',
      name: 'recordDetail',
      component: resolve => require(['components/records/recordDetail'], resolve)
    },
    { // 金额明细
      path: '/records/moneyDetail',
      name: 'moneyDetail',
      component: resolve => require(['components/records/moneyDetail'], resolve)
    },
    { // 订单状态(时间轴)
      path: '/records/orderTimeLine',
      name: 'orderTimeLine',
      component: resolve => require(['components/records/orderTimeLine'], resolve)
    }, { // 计费规则描述
      path: '/records/ruleDescription',
      name: 'ruleDescription',
      component: resolve => require(['components/records/ruleDescription'], resolve)
    }, { // 车位平面图
      path: '/records/parkingPlan',
      name: 'parkingPlan',
      component: resolve => require(['components/records/parkingPlan'], resolve)
    }
  ]
})
