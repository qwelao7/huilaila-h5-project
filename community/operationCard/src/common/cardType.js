import common from '../components/base.vue';
import activity from '../components/activity.vue';
import broadcast from '../components/broadcast.vue';
import order from '../components/order.vue';
import iframe from '../components/iframe.vue';
import secKill from '../components/secKill.vue';
import recommendShop from '../components/recommendShop.vue';

var cardType = [
  {code: 1, name: '物业缴费', component: common, btnName: ['立即缴费', '点击查看']},
  {code: 2, name: '我的快递', component: common, btnName: ['点击领取', '点击查看']},
  {code: 3, name: '访客通行', component: common, btnName: ['查看通行证', '再次邀请']},
  {code: 4, name: '我的活动', component: common, btnName: ['点击签到', '点击查看']},
  {code: 5, name: '红包助手', component: common, btnName: ['点击查看', '']},
  {code: 6, name: '推荐好品', component: broadcast, btnName: '点击查看'},
  {code: 7, name: '秒杀活动', component: secKill},
  {code: 8, name: '巡查反馈', component: common, btnName: ['点击查看', '点击查看']},
  {code: 9, name: '我的服务', component: order, btnName: ['前往付款', '点击查看']},
  {code: 10, name: '我的服务', component: order, btnName: ['前往付款', '点击查看']},
  {code: 11, name: '售后订单', component: order, btnName: ['前往付款', '点击查看']},
  {code: 12, name: 'h5外链', component: iframe},
  {code: 13, name: '问卷调查', component: common, btnName: ['立即投票']},
  {code: 14, name: '小区活动', component: activity, btnName: ['我要报名']},
  {code: 15, name: '小区投票', component: common, btnName: ['立即投票']},
  {code: 16, name: '热门活动', component: activity, btnName: ['我要报名', '查看详情']},
  {code: 17, name: '推荐商家', component: recommendShop, btnName: '进店看看'}
];

var getCardType = function (cardDetailType) {
  var cardInfo;
  cardType.forEach(function (u) {
    if (u.code === cardDetailType) {
      cardInfo = u;
      return false;
    }
  });
  return cardInfo;
};
export {getCardType};
