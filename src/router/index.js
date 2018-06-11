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
          component: resolve => require(['@/components/home/recommend/recommend'], resolve)
        },
        {
          path: '/life/newThings',
          name: 'newThings',
          component: resolve => require(['@/components/home/newThings/newThings'], resolve)
        },
        {
          path: '/life/activity',
          name: 'activity',
          component: resolve => require(['@/components/home/activity/activity'], resolve)
        },
        {
          path: '/life/group',
          name: 'group',
          component: resolve => require(['@/components/home/group/group'], resolve)
        }
      ]
    },
    {
      path: '/recommend',
      name: '推荐',
      component: resolve => require(['@/components/home/recommend/recommend'], resolve)
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
      name: '圈子',
      component: resolve => require(['@/components/home/group/group'], resolve)
    },
    {
      path: '/all_group',
      name: '所有圈子',
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
      component: resolve => require(['@/components/Service'], resolve)
    },
    {
      path: '/myHouse',
      name: '我家',
      component: resolve => require(['@/components/MyHouse'], resolve)
    },
    {
      path: '/pub_newThings',
      name: '发布新鲜事',
      component: resolve => require(['@/components/publish/pub_newThings'], resolve)
    },
    {
      path: '/pub_activity',
      name: '发布活动',
      component: resolve => require(['@/components/publish/pub_activity'], resolve)
    },
    {
      path: '/pub_album',
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
      path: '/modifyPhoneNum',
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
      component: resolve => require(['@/components/my/myAddress/myAddress'], resolve)
    },
    {
      path: '/selectReceiveAddress/:addrId',
      name: 'selectReceiveAddress',
      component: resolve => require(['@/components/my/myAddress/selectReceivingAdd'], resolve)
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
      path: '/houseDetail',
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
      component: resolve => require(['@/components/my/myInteractive/myInteractive'], resolve)
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
      component: resolve => require(['@/components/my/message/message'], resolve)
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
    }
  ]
})
