import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/bottomTab'
import Home from '@/components/Life'
// 通用
// import personPage from '@/components/home/personPage/personPage'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      redirect: {name: 'recommend'}
    },
    {
      path: '/Error',
      name: 'error',
      component: resolve => require(['@/components/Error'], resolve)
    },
    {
      path: '/Login/:openId',
      name: 'Login',
      component: resolve => require(['@/components/validate/login'], resolve)
    },
    {
      path: '/Login',
      name: 'Login',
      component: resolve => require(['@/components/validate/login'], resolve)
    },
    {
      path: '/oauth',
      name: 'Oauth',
      component: resolve => require(['@/components/validate/oauth'], resolve)
    },
    {
      path: '/life',
      name: '生活',
      component: Home,
      redirect: {name: 'recommend'},
      children: [
        {
          path: '/life/recommend',
          name: 'recommend',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/home/recommend/recommend'], resolve)
        },
        {
          path: '/life/newThings',
          name: 'newThings',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/home/newThings/newThings'], resolve)
        },
        {
          path: '/life/activity',
          name: 'activity',
          meta: {
            title: '活动',
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/home/activity/activity'], resolve)
        },
        {
          path: '/life/group',
          name: 'group',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/home/group/group'], resolve)
        },
        {
          path: '/life/topic',
          name: 'topic',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/home/topic/list'], resolve)
        },
        {
          path: '/life/daren',
          name: 'daren',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/home/daren/list'], resolve)
        }
      ]
    },
    {
      path: '/recommend',
      name: '推荐',
      meta: {
        keepAlive: false // 需要被缓存
      },
      component: resolve => require(['@/components/home/recommend/recommend'], resolve)
    },
    {
      path: '/activity',
      name: 'activity',
      meta: {
        title: '活动',
        keepAlive: false // 需要被缓存
      },
      component: resolve => require(['@/components/home/activity/activity'], resolve)
    },
    {
      path: '/bannerNews/:id',
      name: 'bannerNews',
      component: resolve => require(['@/components/home/recommend/bannerNews'], resolve)
    },
    {
      path: '/newThings',
      name: '新鲜事',
      component: resolve => require(['@/components/home/newThings/newThings'], resolve)
    },
    {
      path: '/newThingsDetail/:neighborId',
      name: '新鲜事详情',
      component: resolve => require(['@/components/home/newThings/newThingsDetail'], resolve)
    },
    {
      path: '/onReport/:id',
      name: '举报',
      component: resolve => require(['@/components/home/newThings/onReport'], resolve)
    },
    {
      path: '/likePeopleList/:id',
      name: '/praiseList',
      component: resolve => require(['@/components/home/newThings/likePeopleList'], resolve)
    },
    {
      path: '/activity',
      name: '活动',
      component: resolve => require(['@/components/home/activity/activity'], resolve)
    },
    {
      path: '/voteDetail/:id',
      name: 'voteDetail',
      component: resolve => require(['@/components/home/activity/voteDetail'], resolve)
    },
    {
      path: '/activityDetail/:activityId',
      name: '/activityDetail',
      component: resolve => require(['@/components/home/activity/activityDetail'], resolve)
    },
    {
      path: '/signUp/:id',
      name: '活动报名',
      component: resolve => require(['@/components/home/activity/signUp'], resolve)
    },
    {
      path: '/joinPeople',
      name: '添加活动参与人',
      component: resolve => require(['@/components/home/activity/joinPeople'], resolve)
    },
    {
      path: '/signUpPeople/:id',
      name: 'signUpPeople',
      component: resolve => require(['@/components/home/activity/signUpPeople'], resolve)
    },
    {
      path: '/cordinatorActive/:id',
      name: '开启活动协办',
      component: resolve => require(['@/components/home/activity/cordinatorActive'], resolve)
    },
    {
      path: '/cordinatorList/:id',
      name: '活动协办人',
      component: resolve => require(['@/components/home/activity/cordinatorList'], resolve)
    },
    {
      path: '/signUpDetail',
      name: '活动签到',
      component: resolve => require(['@/components/home/activity/signUpDetail'], resolve)
    },
    {
      path: '/addPerson/:id',
      name: '新增参与人',
      component: resolve => require(['@/components/home/activity/addPerson'], resolve)
    },
    {
      path: '/applyUserInfo/:id',
      name: 'applyUserInfo',
      component: resolve => require(['@/components/home/activity/applyUserInfo'], resolve)
    },
    // {
    //   path: '/chooseRelationShip',
    //   name: 'chooseRelationShip',
    //   component: resolve => require(['@/components/home/activity/chooseRelationShip'], resolve)
    // },
    // {
    //   path: '/timeList/:id',
    //   name: 'ActivityTime',
    //   component: resolve => require(['@/components/home/activity/timeList'], resolve)
    // },
    {
      path: '/vote',
      name: '投票',
      component: resolve => require(['@/components/home/activity/vote'], resolve)
    },
    {
      path: '/group',
      name: '社群',
      component: resolve => require(['@/components/home/group/group'], resolve)
    },
    {
      path: '/all_group',
      name: '所有社群',
      component: resolve => require(['@/components/home/group/allGroup'], resolve)
    },
    {
      path: '/community',
      name: '小区',
      component: resolve => require(['@/components/Community'], resolve)
    },
    {
      path: '/service',
      name: '服务',
      // meta: {
      //   keepAlive: false // 需要被缓存
      // },
      redirect: {
        name: 'new'
      },
      component: resolve => require(['@/components/Service'], resolve),
      children: [
        {
          path: '/service/new',
          name: 'new',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/service/hotAndNew/new'], resolve)
        },
        {
          path: '/service/hot',
          name: '热门',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/service/hotAndNew/hot'], resolve)
        }
      ]
    },
    {
      path: '/labelProductList/:labelId',
      name: 'labelProductList',
      meta: {
        keepAlive: false // 需要被缓存
      },
      component: resolve => require(['@/components/product/label/productList'], resolve)
    },
    {
      path: '/categoryProductList/:categoryId',
      name: 'categoryProductList',
      meta: {
        keepAlive: false // 需要被缓存
      },
      component: resolve => require(['@/components/product/category/productList'], resolve)
    },
    {
      path: '/shopperProductList/:storeId',
      name: 'shopperProductList',
      meta: {
        keepAlive: false // 需要被缓存
      },
      component: resolve => require(['@/components/product/shopper/productList'], resolve)
    },
    {
      path: '/infoList/:busId',
      name: 'infoList',
      meta: {
        keepAlive: false // 需要被缓存
      },
      component: resolve => require(['@/components/product/shopper/infoList'], resolve)
    },
    {
      path: '/infoDetail/:infoId',
      name: 'infoDetail',
      meta: {
        keepAlive: false // 需要被缓存
      },
      component: resolve => require(['@/components/product/shopper/infoDetail'], resolve)
    },
    {
      path: '/shoppingCart/detail',
      name: '购物车',
      meta: {
        keepAlive: false // 不需要被缓存
      },
      component: resolve => require(['@/components/shoppingCart/shoppingCart'], resolve)
    },
    {
      path: '/shopperInfo/shopper/:storeId',
      name: 'shopperInfo',
      meta: {
        keepAlive: false // 不需要被缓存
      },
      redirect: {name: 'shopperDetail'},
      component: resolve => require(['@/components/shopperInfo/shopper'], resolve),
      children: [{
        path: '/shopperInfo/shopper/detail/:storeId',
        name: 'shopperDetail',
        meta: {
          keepAlive: false // 需要被缓存
        },
        component: resolve => require(['@/components/shopperInfo/detail'], resolve)
      }, {
        path: '/shopperInfo/shopper/evaluation/:storeId',
        name: 'shopperEvaluation',
        meta: {
          keepAlive: false // 不需要被缓存
        },
        component: resolve => require(['@/components/shopperInfo/evaluation'], resolve)
      }]
    },
    {
      path: '/shopperInfo/detail/:storeId/environment',
      name: 'shopperEnvironment',
      component: resolve => require(['@/components/shopperInfo/environmentDetail'], resolve)
    },
    {
      path: '/myHouse',
      name: '我家',
      meta: {
        // keepAlive: false // 需要被缓存
      },
      component: resolve => require(['@/components/MyHouse'], resolve)
    },
    {
      path: '/pub_newThings',
      name: '发布新鲜事',
      component: resolve => require(['@/components/publish/pub_newThings'], resolve),
      props: (route) => ({ tid: route.query.tid, type: route.query.type })
    },
    {
      path: '/pub_activity',
      name: '发布活动',
      component: resolve => require(['@/components/publish/pub_activity'], resolve)
    },
    {
      path: '/pub_album/:activityId',
      name: '发布活动相册',
      component: resolve => require(['@/components/publish/pub_album'], resolve)
    },
    {
      path: '/albumList/:activityId',
      name: '活动相册',
      component: resolve => require(['@/components/home/album/albumList'], resolve)
    },
    {
      path: '/albumDetail/:neighborId',
      name: '活动相册',
      component: resolve => require(['@/components/home/album/albumDetail'], resolve)
    },
    {
      path: '/personPage/:userId',
      name: '个人主页',
      component: resolve => require(['@/components/home/personPage/personPage'], resolve)
    },
    {
      path: '/buildInfo',
      name: '小区信息',
      component: resolve => require(['@/components/community/buildInfo'], resolve)
    },
    {
      path: '/loadMap',
      name: 'loadMap',
      component: resolve => require(['@/components/community/loadMap'], resolve)
    },
    {
      path: '/buildImg',
      name: '小区图片',
      component: resolve => require(['@/components/community/buildImg/buildImg'], resolve)
    },
    {
      path: '/buildImgDetail',
      name: '小区图片详情',
      component: resolve => require(['@/components/community/buildImg/buildImgDetail'], resolve)
    },
    {
      path: '/projectProgress',
      name: '工程进度',
      component: resolve => require(['@/components/community/project/projectProgress'], resolve)
    },
    {
      path: '/projectDetail/:id',
      name: '/projectDetail',
      component: resolve => require(['@/components/community/project/projectDetail'], resolve)
    },
    {
      path: '/treaty',
      name: 'treaty',
      component: resolve => require(['@/components/community/treaty/treaty'], resolve)
    },
    {
      path: '/treatyHistory',
      name: 'treatyHistory',
      component: resolve => require(['@/components/community/treaty/treatyHistory'], resolve)
    },
    {
      path: '/treatyDetail/:id',
      name: 'treatyDetail',
      component: resolve => require(['@/components/community/treaty/treatyDetail'], resolve)
    },
    {
      path: '/buildLive',
      name: '楼盘动态',
      component: resolve => require(['@/components/community/buildLive/buildLive'], resolve)
    },
    {
      path: '/buildLiveDetail/:id',
      name: '/buildLiveDetail',
      component: resolve => require(['@/components/community/buildLive/buildLiveDetail'], resolve)
    },
    {
      path: '/survey',
      name: '调查投票',
      component: resolve => require(['@/components/community/survey/survey'], resolve)
    },
    {
      path: '/surveyDetail/:id/:neiId',
      name: '/surveyDetail',
      component: resolve => require(['@/components/community/survey/surveyDetail'], resolve)
    },
    {
      path: '/announcement',
      name: '小区公告',
      component: resolve => require(['@/components/community/announcement/announcement'], resolve)
    },
    {
      path: '/announcementDetail/:id',
      name: '/announcementDetail',
      component: resolve => require(['@/components/community/announcement/announcementDetail'], resolve)
    },
    {
      path: '/voteSelect/:id',
      name: '/voteSelect',
      component: resolve => require(['@/components/common/voteSelect'], resolve)
    },
    {
      path: '/voteResult/:id',
      name: '/voteResult',
      component: resolve => require(['@/components/common/voteResult'], resolve)
    },
    {
      path: '/personInfo',
      name: '账户资料',
      component: resolve => require(['@/components/my/personInfo/personInfo'], resolve)
    },
    {
      path: '/verifiedName',
      name: 'verifiedName',
      component: resolve => require(['@/components/my/personInfo/verifiedName'], resolve)
    },
    {
      path: '/nickName',
      name: 'nickName',
      component: resolve => require(['@/components/my/personInfo/nickName'], resolve)
    },
    {
      path: '/modifyPhoneNum/:oldPhone',
      name: '修改手机号',
      component: resolve => require(['@/components/my/personInfo/modifyPhoneNum'], resolve)
    },
    {
      path: '/QQ',
      name: 'qq',
      component: resolve => require(['@/components/my/personInfo/QQ'], resolve)
    },
    {
      path: '/weChat',
      name: 'weChat',
      component: resolve => require(['@/components/my/personInfo/weChat'], resolve)
    },
    {
      path: '/tag',
      name: '个性标签',
      component: resolve => require(['@/components/my/personInfo/tag'], resolve)
    },
    {
      path: '/payPassword',
      name: '重置支付密码',
      component: resolve => require(['@/components/my/personInfo/payPassword'], resolve)
    },
    {
      path: '/myAddress',
      name: '我的地址',
      component: resolve => require(['@/components/my/myAddress/myAddress'], resolve),
      redirect: {name: 'myCommunityAddress'},
      children: [
        {
          path: '/myAddress/comAdd',
          name: 'myCommunityAddress',
          meta: {
            keepAlive: false
          },
          component: resolve => require(['@/components/my/myAddress/comAdd'], resolve)
        },
        {
          path: '/myAddress/receivingAdd',
          name: 'receivingAdd',
          meta: {
            keepAlive: false
          },
          component: resolve => require(['@/components/my/myAddress/receivingAdd'], resolve)
        }
      ]
    },
    {
      path: '/selectReceiveAddress',
      name: 'selectReceiveAddress',
      component: resolve => require(['@/components/my/myAddress/selectReceivingAdd'], resolve)
    },
    {
      path: '/selectReceivingAddForbonus',
      name: 'selectReceivingAddForbonus',
      component: resolve => require(['@/components/my/myAddress/selectReceivingAddForbonus'], resolve)
    },
    {
      path: '/modifyReceiveAddress',
      name: 'modifyReceiveAddress',
      component: resolve => require(['@/components/my/myAddress/modifyReceiveAddress'], resolve)
    },
    {
      path: '/addReceiveAddress',
      name: '新增收货地址',
      component: resolve => require(['@/components/my/myAddress/addReceiveAddress'], resolve)
    },
    {
      path: '/addCommunityAddress',
      name: 'addCommunityAddress',
      component: resolve => require(['@/components/my/myAddress/addCommunityAddress'], resolve)
    },
    {
      path: '/editCommunityAddress',
      name: 'editCommunityAddress',
      component: resolve => require(['@/components/my/myAddress/editCommunityAddress'], resolve)
    },
    {
      path: '/houseDetail/:status',
      name: 'houseDetail',
      component: resolve => require(['@/components/my/myAddress/houseDetail'], resolve)
    },
    {
      path: '/inviteRegister',
      name: 'inviteRegister',
      component: resolve => require(['@/components/my/myAddress/inviteRegister'], resolve)
    },
    {
      path: '/autoBindHouse',
      name: 'autoBindHouse',
      component: resolve => require(['@/components/my/myAddress/autoBindHouse'], resolve)
    },
    {
      path: '/myInteractive',
      name: '我的互动',
      component: resolve => require(['@/components/my/myInteractive/myInteractive'], resolve),
      redirect: {name: 'mySignUp'},
      children: [
        {
          path: '/myInteractive/mySignUp',
          name: 'mySignUp',
          meta: {
            keepAlive: false
          },
          component: resolve => require(['@/components/my/myInteractive/mySignUp'], resolve)
        },
        {
          path: '/myInteractive/myActivity',
          name: 'myActivity',
          meta: {
            keepAlive: false
          },
          component: resolve => require(['@/components/my/myInteractive/myActivity'], resolve)
        },
        {
          path: '/myInteractive/myVote',
          name: 'myVote',
          meta: {
            keepAlive: false
          },
          component: resolve => require(['@/components/my/myInteractive/myVote'], resolve)
        }
      ]
    },
    {
      path: '/mySignUp',
      name: 'mySignUp',
      meta: {
        keepAlive: false
      },
      component: resolve => require(['@/components/my/myInteractive/mySignUp'], resolve)
    },
    {
      path: '/myActivity',
      name: 'myActivity',
      meta: {
        keepAlive: false
      },
      component: resolve => require(['@/components/my/myInteractive/myActivity'], resolve)
    },
    {
      path: '/signDetail/:id',
      name: '报名详情',
      component: resolve => require(['@/components/my/myInteractive/signDetail'], resolve)
    },
    {
      path: '/QRcode',
      name: '活动二维码',
      component: resolve => require(['@/components/my/myInteractive/QRcode'], resolve)
    },
    {
      path: '/myBroker',
      name: '我的经纪人',
      component: resolve => require(['@/components/my/myBroker/myBroker'], resolve)
    },
    {
      path: '/changeCommunity',
      name: '切换小区',
      component: resolve => require(['@/components/my/changeCommunity'], resolve)
    },
    {
      path: '/chooseCommunity',
      name: '选择小区',
      component: resolve => require(['@/components/my/chooseCommunity'], resolve)
    },
    {
      path: '/chooseGarden',
      name: 'chooseGarden',
      component: resolve => require(['@/components/my/chooseGarden'], resolve)
    },
    {
      path: '/chooseRoom',
      name: 'chooseRoom',
      component: resolve => require(['@/components/my/chooseRoom'], resolve)
    },
    {
      path: '/chooseIdentity',
      name: 'chooseIdentity',
      component: resolve => require(['@/components/my/chooseIdentity'], resolve)
    },
    {
      path: '/message',
      name: '消息',
      component: resolve => require(['@/components/my/message/message'], resolve),
      redirect: {name: 'notice'},
      children: [
        {
          path: '/message/notice',
          name: 'notice',
          meta: {
            keepAlive: false
          },
          component: resolve => require(['@/components/my/message/notice'], resolve)
        },
        {
          path: '/message/comment',
          name: 'comment',
          meta: {
            keepAlive: false
          },
          component: resolve => require(['@/components/my/message/comment'], resolve)
        }
      ]
    },
    {
      path: '/systemMsg/:id',
      name: '系统通知',
      component: resolve => require(['@/components/my/message/systemMsg'], resolve)
    },
    {
      path: '/noticeDetail/:id/:type',
      name: 'noticeDetail',
      component: resolve => require(['@/components/my/message/noticeDetail'], resolve)
    },
    {
      path: '/commentPage',
      name: '评论',
      component: resolve => require(['@/components/my/message/commentPage'], resolve)
    },
    {
      path: '/integral',
      name: '积分',
      component: resolve => require(['@/components/my/integral/integralHome'], resolve)
    },
    {
      path: '/integralDetail',
      name: '积分明细',
      component: resolve => require(['@/components/my/integral/integralDetail'], resolve)
    },
    {
      path: '/integralExchange/:id',
      name: 'integralExchange',
      component: resolve => require(['@/components/my/integral/integralExchange'], resolve)
    },
    {
      path: '/confirmExchange/:id',
      name: '确认兑换',
      component: resolve => require(['@/components/my/integral/confirmExchange'], resolve)
    },
    {
      path: '/integralInstructions',
      name: '积分说明',
      component: resolve => require(['@/components/my/integral/integralInstructions'], resolve)
    },
    {
      path: '/orderDetails/:id',
      name: '积分订单说明',
      component: resolve => require(['@/components/my/integral/orderDetails'], resolve)
    },
    {
      path: '/integralCheckStand',
      name: 'integralCheckStand',
      component: resolve => require(['@/components/my/integral/integralCheckstand'], resolve)
    },
    {
      path: '/payResult',
      name: 'payResult',
      component: resolve => require(['@/components/payResult'], resolve)
    },
    {
      path: '/promotionList',
      name: 'promotionList',
      component: resolve => require(['@/components/service/promotion/promotionList'], resolve)
    },
    {
      path: '/promotionDetail',
      name: 'promotionDetail',
      component: resolve => require(['@/components/service/promotion/promotionDetail'], resolve)
    },
    {
      path: '/evaluationForLifeService',
      name: 'evaluationForLifeService',
      component: resolve => require(['@/components/service/evaluation/evaluationForLifeService'], resolve)
    },
    {
      path: '/modifyOrderAppraise',
      name: 'modifyOrderAppraise',
      component: resolve => require(['@/components/service/evaluation/modifyOrderAppraise'], resolve)
    },
    {
      path: '/evaluateDetail',
      name: 'evaluateDetail',
      component: resolve => require(['@/components/service/evaluation/evaluateDetail'], resolve)
    },
    {
      path: '/productDetail',
      name: 'productDetail',
      component: resolve => require(['@/components/service/product/productDetail'], resolve)
      // this.$router.push({path: '/productDetail', query: { productId: 'pid_1231313，orderId: 'oId_4324324' }});
    },
    {
      path: '/myOrder',
      name: 'myOrder',
      component: resolve => require(['@/components/my/myOrder/myOrder'], resolve)
    },
    {
      path: '/orderDetail/:orderId',
      name: 'orderDetail',
      component: resolve => require(['@/components/my/myOrder/OrderDetail'], resolve)
    },
    {
      path: '/logisticsList',
      name: 'logisticsList',
      component: resolve => require(['@/components/my/myOrder/logisticsList'], resolve)
    },
    {
      path: '/logisticsDetail',
      name: 'logisticsDetail',
      component: resolve => require(['@/components/my/myOrder/logisticsDetail'], resolve)
    },
    {
      path: '/handleDetail/:orderId',
      name: 'handleDetail',
      component: resolve => require(['@/components/my/myOrder/handleDetail'], resolve)
    },
    {
      path: '/confirmOrders',
      name: 'confirmOrders',
      component: resolve => require(['@/components/service/orders/confirmOrders'], resolve)
    },
    {
      path: '/selectPayType/:orderId', // 选择支付方式
      name: 'selectPayType',
      component: resolve => require(['@/components/service/orders/selectPayType'], resolve)
    },
    {
      path: '/productAppraise/:productId',
      name: 'productAppraise',
      component: resolve => require(['@/components/service/product/appraise/productAppraiseMain'], resolve),
      redirect: {name: 'allAppraise'},
      children: [
        {
          path: '/productAppraise/allAppraiseList/:productId',
          name: 'allAppraise',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/service/product/appraise/allAppraiseList'], resolve)
        },
        {
          path: '/productAppraise/goodAppraiseList/:productId',
          name: 'goodAppraise',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/service/product/appraise/goodAppraiseList'], resolve)
        },
        {
          path: '/productAppraise/normalAppraiseList/:productId',
          name: 'normalAppraise',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/service/product/appraise/normalAppraiseList'], resolve)
        },
        {
          path: '/productAppraise/disappointmentAppraiseList/:productId',
          name: 'disappointmentAppraise',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/service/product/appraise/disappointmentAppraiseList'], resolve)
        },
        {
          path: '/productAppraise/havaImgAppraiseList/:productId',
          name: 'haveImgAppraise',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/service/product/appraise/havaImgAppraiseList'], resolve)
        }
      ]
    },
    {
      path: '/submitSuccess',
      name: 'submitSuccess',
      component: resolve => require(['@/components/service/orders/submitSuccess'], resolve)
    },
    {
      path: '/redpacket',
      name: 'redpacket',
      redirect: {name: 'enableRedpacket'},
      component: resolve => require(['@/components/my/redpacket/redpacketMain'], resolve),
      children: [
        {
          path: '/redpacket/enableRedpacket',
          name: 'enableRedpacket',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/my/redpacket/enableRedpacket'], resolve)
        },
        {
          path: '/redpacket/usedRedpacket',
          name: 'usedRedpacket',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/my/redpacket/usedRedpacket'], resolve)
        },
        {
          path: '/redpacket/overdueRedpacket',
          name: 'overdueRedpacket',
          meta: {
            keepAlive: false // 需要被缓存
          },
          component: resolve => require(['@/components/my/redpacket/overdueRedpacket'], resolve)
        }
      ]
    },
    {
      path: '/redpacketInstructions',
      name: '红包说明',
      component: resolve => require(['@/components/my/redpacket/redpacketInstructions'], resolve)
    },
    {
      path: '/paySuccess',
      name: 'paySuccess',
      component: resolve => require(['@/components/paySuccess'], resolve)
    },
    {
      path: '/confirmIntegral/:paramsObj',
      name: 'confirmIntegral',
      component: resolve => require(['@/components/my/integral/confirmIntegral'], resolve)
    },
    {
      path: '/activityBalance/:activityId',
      name: '/activityBalance',
      component: resolve => require(['@/components/home/activity/activityBalance'], resolve)
    },
    {
      path: '/activityRefund/:activityId',
      name: '/activityRefund',
      component: resolve => require(['@/components/home/activity/activityRefund'], resolve)
    },
    {
      path: '/balanceList/:activityId',
      name: '/balanceList',
      component: resolve => require(['@/components/home/activity/balanceList'], resolve)
    },
    {
      path: '/propertyFiles',
      name: '/propertyFiles',
      component: resolve => require(['@/components/home/propertyFiles/propertyLevelOne'], resolve)
    },
    {
      path: '/propertyFileTwo/:fileId',
      name: '/propertyFileLevelTwo',
      component: resolve => require(['@/components/home/propertyFiles/propertyLevelTwo'], resolve)
    },
    {
      path: '/propertyPaperList/:fileId',
      name: '/propertyPaperList',
      component: resolve => require(['@/components/home/propertyFiles/paperList'], resolve)
    },
    {
      path: '/decorationFileLevelTwo/:fileId',
      name: '/decorationFileLevelTwo',
      component: resolve => require(['@/components/home/decorationManagement/decorationFileLevelTwo'], resolve)
    },
    {
      path: '/decorationPaperList/:fileId',
      name: '/decorationPaperList',
      component: resolve => require(['@/components/home/decorationManagement/paperList'], resolve)
    },
    {
      path: '/decorationManagement',
      name: '/decorationManagement',
      component: resolve => require(['@/components/home/decorationManagement/decorationManagement'], resolve)
    },
    {
      path: '/balanceList/:activityId',
      name: '/balanceList',
      component: resolve => require(['@/components/home/activity/balanceList'], resolve)
    },
    {
      path: '/estateDoc',
      name: '/estateDoc',
      component: resolve => require(['@/components/estateDoc/list'], resolve)
    },
    {
      path: '/topicDetail/:topicType',
      name: 'topicDetail',
      meta: {
        keepAlive: false // 需要被缓存
      },
      component: resolve => require(['@/components/home/topic/detail'], resolve)
    },
    {
      path: '/darenApply',
      name: 'darenApply',
      component: resolve => require(['@/components/home/daren/apply'], resolve),
      props: (route) => ({ id: route.query.id, title: route.query.title })
    },
    {
      path: '/darenDetail',
      name: 'darenDetail',
      component: resolve => require(['@/components/home/daren/detail'], resolve),
      props: (route) => ({ id: route.query.id })
    },
    {
      path: '/butler', // 我家-我的管家
      name: '/butler',
      component: resolve => require(['@/components/my/butler/butlerList'], resolve)
    },
    {
      path: '/afterServiceList', // 售后列表
      name: '/afterServiceList',
      component: resolve => require(['@/components/my/myOrder/afterService/afterServiceList'], resolve)
    }, {
      path: '/afterServiceDetail', // 售后详情
      name: '/afterServiceDetail',
      component: resolve => require(['@/components/my/myOrder/afterService/afterServiceDetail'], resolve)
    },
    {
      path: '/cancelOrder/:orderId', // 申请取消服务/申请售后
      name: 'cancelOrder',
      component: resolve => require(['@/components/my/myOrder/afterService/cancelOrder'], resolve)
    },
    {
      path: '/afterServiceApply', // 申请单
      name: '/afterServiceApply',
      component: resolve => require(['@/components/my/myOrder/afterService/afterServiceApply'], resolve)
    },
    {
      path: '/logisticsForm', // 填写物流
      name: '/logisticsForm',
      component: resolve => require(['@/components/my/myOrder/afterService/logisticsForm'], resolve)
    },
    {
      path: '/myBill', // 我的账单
      name: '/myBill',
      component: resolve => require(['@/components/my/myBill/myBill'], resolve)
    },
    {
      path: '/billDetail', // 账单详情
      name: '/billDetail',
      component: resolve => require(['@/components/my/myBill/billDetail'], resolve)
    },
    {
      path: '/myWallet', // 我的钱包
      name: '/myWallet',
      component: resolve => require(['@/components/my/myWallet/myWallet'], resolve)
    },
    {
      path: '/secureProtocolWallet', // 我的钱包 - 安全协议
      name: '/secureProtocolWallet',
      component: resolve => require(['@/components/my/myWallet/secureProtocolWallet'], resolve)
    },
    {
      path: '/recharge', // 我的钱包 - 充值
      name: '/recharge',
      component: resolve => require(['@/components/my/myWallet/recharge'], resolve)
    },
    {
      path: '/rechargeCard', // 我的钱包 - 充值卡充值
      name: '/rechargeCard',
      component: resolve => require(['@/components/my/myWallet/rechargeCard'], resolve)
    },
    {
      path: '/enchashment', // 我的钱包 - 提现
      name: '/enchashment',
      component: resolve => require(['@/components/my/myWallet/enchashment'], resolve)
    },
    {
      path: '/enchashmentResult', // 我的钱包 - 提现结果
      name: '/enchashmentResult',
      component: resolve => require(['@/components/my/myWallet/enchashmentResult'], resolve)
    },
    {
      path: '/roomReservation', // 看房预约
      name: '/roomReservation',
      component: resolve => require(['@/components/community/roomReservation/roomReservation'], resolve)
    },
    {
      path: '/roomReservationResult', // 看房预约-成功
      name: '/roomReservationResult',
      component: resolve => require(['@/components/community/roomReservation/roomReservationResult'], resolve)
    },
    {
      path: '/autonomyStatuteList', // 自治规约
      name: '/autonomyStatuteList',
      component: resolve => require(['@/components/community/autonomyStatute/autonomyStatuteList'], resolve)
    },
    {
      path: '/autonomyStatuteDetail', // 自治规约
      name: '/autonomyStatuteDetail',
      component: resolve => require(['@/components/community/autonomyStatute/autonomyStatuteDetail'], resolve)
    },
    {
      path: '/karma', // 业委会
      name: '/karma',
      component: resolve => require(['@/components/community/karma/karma'], resolve)
    },
    {
      path: '/karmaMailbox', // 业委会信箱
      name: '/karmaMailbox',
      component: resolve => require(['@/components/community/karma/karmaMailbox'], resolve)
    },
    {
      path: '/commiteeAchievement', // 业委会成果列表
      name: '/commiteeAchievement',
      component: resolve => require(['@/components/community/commiteeAchievement/commiteeAchievement'], resolve)
    },
    {
      path: '/commiteeAchievementDetail/:id', // 业委会成果详情
      name: '/commiteeAchievementDetail',
      component: resolve => require(['@/components/community/commiteeAchievement/commiteeAchievementDetail'], resolve)
    },
    {
      path: '/myCard', // 我的会员卡
      name: '/myCard',
      component: resolve => require(['@/components/my/myCard/myCard'], resolve)
    },
    {
      path: '/myCard/newCard', // 未开通会员卡
      name: '/newCard',
      component: resolve => require(['@/components/my/myCard/newCard'], resolve)
    },
    {
      path: '/myCard/cardInfo/:cardId', // 未开通会员卡
      name: '/cardInfo',
      component: resolve => require(['@/components/my/myCard/cardInfo'], resolve)
    }
  ]
})
