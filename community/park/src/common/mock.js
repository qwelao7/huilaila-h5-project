/**
 * Created by Jameslin on 2017/5/14.
 */
/**
 *  入场时间格式范例
 * @type {[*]}
 */
let inTimeList = [{
  name: '今天',
  sub: [{
    name: '00',
    sub: [{
      name: '00',
      type: 2
    }, {
      name: '15',
      type: 2
    }, {
      name: '30',
      type: 2
    }, {
      name: '45',
      type: 2
    }
    ],
    type: 1
  }, {
    name: '01',
    sub: [{
      name: '00',
      type: 2
    }, {
      name: '15',
      type: 2
    }, {
      name: '30',
      type: 2
    }, {
      name: '45',
      type: 2
    }
    ],
    type: 1
  }, {
    name: '23',
    sub: [{
      name: '00',
      type: 2
    }, {
      name: '15',
      type: 2
    }, {
      name: '30',
      type: 2
    }, {
      name: '45',
      type: 2
    }
    ],
    type: 1
  }
  ],
  type: 0
}, {
  name: '明天',
  sub: [{
    name: '15',
    sub: [{
      name: '00',
      type: 2
    }, {
      name: '30',
      type: 2
    }, {
      name: '45',
      type: 2
    }
    ],
    type: 1
  }, {
    name: '20',
    sub: [{
      name: '00',
      type: 2
    }, {
      name: '15',
      type: 2
    }, {
      name: '30',
      type: 2
    }, {
      name: '45',
      type: 2
    }
    ],
    type: 1
  }, {
    name: '23',
    sub: [{
      name: '15',
      type: 2
    }, {
      name: '30',
      type: 2
    }, {
      name: '45',
      type: 2
    }
    ],
    type: 1
  }
  ],
  type: 0
}, {
  name: '后天',
  sub: [{
    name: '10',
    sub: [{
      name: '00',
      type: 2
    }, {
      name: '15',
      type: 2
    }, {
      name: '45',
      type: 2
    }
    ],
    type: 1
  }, {
    name: '18',
    sub: [{
      name: '00',
      type: 2
    }, {
      name: '15',
      type: 2
    }, {
      name: '30',
      type: 2
    }, {
      name: '45',
      type: 2
    }
    ],
    type: 1
  }, {
    name: '23',
    sub: [{
      name: '15',
      type: 2
    }, {
      name: '30',
      type: 2
    }
    ],
    type: 1
  }
  ],
  type: 0
}
];
/* 推荐车位列表begin */
let recommendList = [{
  parkingId: 'xxxxx1',
  parkingNO: '负1C145',
  deadTime: '2017-05-20 19:30'
}, {
  parkingId: 'xxxxx2',
  parkingNO: '负1C142',
  deadTime: '2017-05-20 18:30'
}, {
  parkingId: 'xxxxx3',
  parkingNO: '负1C141',
  deadTime: '2017-05-26 17:30'
}
];
/* 推荐车位列表end */

// 订单类目--待支付,待开始,计费中
let orders = [{
  status: 2,
  count: 3,
  totalMoney: 1000.00,
  list: [
    {
      orderId: 'gxtcorder1',
      money: 100.00
    }, {
      orderId: 'gxtcorder2',
      money: 200.00
    }, {
      orderId: 'gxtcorder3',
      money: 300.00
    }
  ]
}];

let shareBaseInfo = {
  todayIncome: '¥20.00',
  totalIncome: '¥500.00',
  ownerReceiveRate: '60%',
  propertyReceiveRate: '20%',
  industryCommitteeReceiveRate: '10%',
  platformReceiveRate: '10%'
};
let sharingList = [{
  parkingId: 'xxxxx1',
  parkingNO: '负1C145',
  parkingStatus: 0,
  sharingStartTime: '08:00',
  sharingEndTime: '19:00',
  sharingRepeat: '1001000',
  usedTimes: 0,
  parkingCarNO: '无'
}, {
  parkingId: 'xxxxx1',
  parkingNO: '负1C142',
  parkingStatus: 2,
  sharingStartTime: '',
  sharingEndTime: '20:00',
  sharingRepeat: '1000011',
  usedTimes: 0,
  parkingCarNO: '无'
}, {
  parkingId: 'xxxxx2',
  parkingNO: '负1C146',
  parkingStatus: 1,
  sharingStartTime: '10:00',
  sharingEndTime: '15:00',
  sharingRepeat: '0111000',
  usedTimes: 4,
  parkingCarNO: '浙ABC890'
}, {
  parkingId: 'xxxxx9',
  parkingNO: '负1C147',
  parkingStatus: 3,
  sharingStartTime: '12:00',
  sharingEndTime: '23:00',
  sharingRepeat: '1111111',
  usedTimes: 2,
  parkingCarNO: '无'
}];

// sharingList = [];

// 车位详情
let parkingDetail = {
  parkingNO: 'xxxxx2',
  parkingStatus: 1,
  sharingStartTime: '10:00',
  sharingEndTime: '15:00',
  sharingRepeat: '0111000',
  usedTimes: 4,
  todayOrderList: [{
    baseInfo: {
      orderStatus: 1, // 1 待支付，2 待开始 3 计费中 4 已完成
      carNO: '浙ABC895',
      carOwnerName: '冷库',
      carOwnerPhone: '15313118386', // 车主电话
      appointerPhone: '15313118386', // 预约人电话
      carStatus: '3', // 1未入场 2 已入场 3 已离场
      inTime: '2017-05-28 14:00', // 入场时间
      outTime: '2017-05-28 16:40' // 离场时间
    },
    chargeInfo: {
      normalTimeLast: '120分钟', // 正常时段持续时长
      normalBeginChargeTime: '2017-05-28 14:00', // 正常时段开始计价时间
      normalEndChargeTime: '2017-05-28 16:00', // 正常时段结束计价时间
      normalMoney: '10.00', // 正常时段金额
      overtimeLast: '40分钟', // 超时时段持续时长
      overtimeBeginChargeTime: '2017-05-28 16:00',
      overtimeEndChargeTime: '2017-05-28 16:40',
      overtimeMoney: '60',
      totalMoney: '70.00'
    }
  }, {
    baseInfo: {
      orderStatus: 2, // 1 待支付，2 待开始 3 计费中 4 已支付
      carNO: '浙ABC890',
      carOwnerName: '刘涛',
      carOwnerPhone: '15313118386', // 车主电话
      appointerPhone: '15313118386', // 预约人电话
      carStatus: '1', // 1未入场 2 已入场 3 已离场
      inTime: '', // 入场时间
      outTime: '' // 离场时间
    },
    chargeInfo: {
      normalTimeLast: '120分钟', // 正常时段持续时长
      normalBeginChargeTime: '2017-05-30 19:00', // 正常时段开始计价时间
      normalEndChargeTime: '2017-05-30 21:00', // 正常时段结束计价时间
      normalMoney: '10.00', // 正常时段金额
      overtimeLast: '', // 超时时段持续时长
      overtimeBeginChargeTime: '',
      overtimeEndChargeTime: '',
      overtimeMoney: '0.00',
      totalMoney: '10.00'
    }
  }, {
    baseInfo: {
      orderStatus: 3, // 1 待支付，2 待开始 3 计费中 4 已支付
      carNO: '浙ABC891',
      carOwnerName: '王大锤',
      carOwnerPhone: '15313118386', // 车主电话
      appointerPhone: '15505951676', // 预约人电话
      carStatus: '2', // 1未入场 2 已入场 3 已离场
      inTime: '2017-05-30 17:06', // 入场时间
      outTime: '' // 离场时间
    },
    chargeInfo: {
      normalTimeLast: '120分钟', // 正常时段持续时长
      normalBeginChargeTime: '2017-05-30 17:00', // 正常时段开始计价时间
      normalEndChargeTime: '2017-05-30 19:00', // 正常时段结束计价时间
      normalMoney: '10.00', // 正常时段金额
      overtimeLast: '40分钟', // 超时时段持续时长
      overtimeBeginChargeTime: '2017-05-30 19:00',
      overtimeEndChargeTime: '2017-05-30 19:40',
      overtimeMoney: '60.00',
      totalMoney: '70.00'
    }
  }, {
    baseInfo: {
      orderStatus: 3, // 1 待支付，2 待开始 3 计费中 4 已支付
      carNO: '浙ABC892',
      carOwnerName: '赵括',
      carOwnerPhone: '15313118386', // 车主电话
      appointerPhone: '15505951676', // 预约人电话
      carStatus: '3', // 1未入场 2 已入场 3 已离场
      inTime: '2017-05-30 17:06', // 入场时间
      outTime: '2017-05-30 19:40' // 离场时间
    },
    chargeInfo: {
      normalTimeLast: '120分钟', // 正常时段持续时长
      normalBeginChargeTime: '2017-05-30 17:00', // 正常时段开始计价时间
      normalEndChargeTime: '2017-05-30 19:00', // 正常时段结束计价时间
      normalMoney: '10.00', // 正常时段金额
      overtimeLast: '40分钟', // 超时时段持续时长
      overtimeBeginChargeTime: '2017-05-30 19:00',
      overtimeEndChargeTime: '2017-05-30 19:40',
      overtimeMoney: '60.00',
      totalMoney: '70.00'
    }
  }, {
    baseInfo: {
      orderStatus: 4, // 1 待支付，2 待开始 3 计费中 4 已支付
      carNO: '浙ABC893',
      carOwnerName: '李四',
      carOwnerPhone: '15313118386', // 车主电话
      appointerPhone: '15505951676', // 预约人电话
      carStatus: '3', // 1未入场 2 已入场 3 已离场
      inTime: '2017-05-28 14:06', // 入场时间
      outTime: '2017-05-28 16:40' // 离场时间
    },
    chargeInfo: {
      normalTimeLast: '120分钟', // 正常时段持续时长
      normalBeginChargeTime: '2017-05-28 14:00', // 正常时段开始计价时间
      normalEndChargeTime: '2017-05-28 16:00', // 正常时段结束计价时间
      normalMoney: '10.00', // 正常时段金额
      overtimeLast: '40分钟', // 超时时段持续时长
      overtimeBeginChargeTime: '2017-05-28 16:00',
      overtimeEndChargeTime: '2017-05-28 16:40',
      overtimeMoney: '60.00',
      totalMoney: '70.00'
    }
  }],
  waitingToPayOrderList: [{
    baseInfo: {
      orderStatus: 1, // 1 待支付，2 待开始 3 计费中 4 已支付
      carNO: '浙ABC895',
      carOwnerName: '张宇',
      carOwnerPhone: '15313118386', // 车主电话
      appointerPhone: '15313118386', // 预约人电话
      carStatus: '3', // 1未入场 2 已入场 3 已离场
      inTime: '2017-05-28 14:00', // 入场时间
      outTime: '2017-05-28 16:40' // 离场时间
    },
    chargeInfo: {
      normalTimeLast: '120分钟', // 正常时段持续时长
      normalBeginChargeTime: '2017-05-28 14:00', // 正常时段开始计价时间
      normalEndChargeTime: '2017-05-28 16:00', // 正常时段结束计价时间
      normalMoney: '10.00', // 正常时段金额
      overtimeLast: '40分钟', // 超时时段持续时长
      overtimeBeginChargeTime: '2017-05-28 16:00',
      overtimeEndChargeTime: '2017-05-28 16:40',
      overtimeMoney: '60',
      totalMoney: '70.00'
    }
  }, {
    baseInfo: {
      orderStatus: 1, // 1 待支付，2 待开始 3 计费中 4 已支付
      carNO: '浙ABC890',
      carOwnerName: '张三',
      carOwnerPhone: '15313118386', // 车主电话
      appointerPhone: '15313118386', // 预约人电话
      carStatus: '1', // 1未入场 2 已入场 3 已离场
      inTime: '2017-05-28 14:00', // 入场时间
      outTime: '2017-05-28 16:40' // 离场时间
    },
    chargeInfo: {
      normalTimeLast: '120分钟', // 正常时段持续时长
      normalBeginChargeTime: '2017-05-30 19:00', // 正常时段开始计价时间
      normalEndChargeTime: '2017-05-30 21:00', // 正常时段结束计价时间
      normalMoney: '10.00', // 正常时段金额
      overtimeLast: '40分钟', // 超时时段持续时长
      overtimeBeginChargeTime: '2017-05-28 16:00',
      overtimeEndChargeTime: '2017-05-28 16:40',
      overtimeMoney: '60.00',
      totalMoney: '70.00'
    }
  }]
}

// 苑幢列表
let blockBuildList = [{
  letter: '#',
  blockList: [{
    name: '会所',
    buildList: []
  }, {
    name: '开发路商铺',
    buildList: []
  }, {
    name: '生活服务中心',
    buildList: []
  }]
}, {
  letter: 'Q',
  blockList: [{
    name: '栖霞苑东',
    buildList: [
      '35幢', '36幢', '37幢', '38幢', '39幢'
    ]
  }, {
    name: '栖霞苑西',
    buildList: [
      '10幢', '11幢', '12幢', '13幢', '14幢'
    ]
  }]
}, {
  letter: 'S',
  blockList: [{
    name: '社群苑东',
    buildList: [
      'A1幢', 'A2幢', 'A3幢', 'B1幢', 'B2幢', 'B3幢', 'B4幢', '别墅1', '别墅2', '别墅3'
    ]
  }, {
    name: '社群苑西',
    buildList: [
      '11幢', '12幢', '13幢', '14幢', '15幢'
    ]
  }]
}, {
  letter: 'W',
  blockList: [{
    name: '望湖苑',
    buildList: [
      '04幢', '05幢', '06幢', '07幢', '08幢'
    ]
  }, {
    name: '雾犀苑',
    buildList: [
      '01幢', '02幢', '03幢', '04幢', '05幢'
    ]
  }]
}, {
  letter: 'Y',
  blockList: [{
    name: '玉华苑',
    buildList: [
      '20幢', '21幢', '22幢', '23幢', '24幢', '25幢'
    ]
  }]
}, {
  letter: 'Z',
  blockList: [{
    name: '紫竹苑',
    buildList: [
      'A1幢', 'A2幢', 'A3幢', 'B1幢', 'B2幢', 'B3幢'
    ]
  }, {
    name: '紫曦苑',
    buildList: [
      'A1幢', 'A2幢', 'A3幢', 'A4幢'
    ]
  }]
}];

// 某苑幢下的所有车位号列表
let parkingList = [{
  parkingId: 'xxx01',
  parkingNO: '负1A100'
}, {
  parkingId: 'xxx02',
  parkingNO: '负1A101'
}, {
  parkingId: 'xxx03',
  parkingNO: '负1A102'
}, {
  parkingId: 'xxx04',
  parkingNO: '负1A103'
}, {
  parkingId: 'xxx05',
  parkingNO: '负1A104'
}, {
  parkingId: 'xxx06',
  parkingNO: '负1A105'
}, {
  parkingId: 'xxx07',
  parkingNO: '负1A106'
}, {
  parkingId: 'xxx08',
  parkingNO: '负1A107'
}];

// 停车记录列表(订单列表,不含待支付订单)
let records = {
  list: [{
    orderId: 'order01',
    orderStatus: 5, // 订单状态,2: 待开始, 3:计费中 4.已支付, 5:已取消
    orderType: 1, // 订单类型 1: 即时停车, 2: 预约停车
    carStatus: 0, // 0 未入场, 1 已入场 , 2 已离场
    inTime: '2017-06-01 17:30', // 业主下单时选择的预计入场时间
    outTime: '2017-06-01 21:00', // 业主下单时选择的预计离场时间
    parkingCloseTime: '2017-06-01 22:00', // 车位关闭时间
    leaveTime: '2017-06-01 23:00', // 司机实际离场时间
    parkingNO: 'xxxx01', // 车位号
    carNO: '浙ABC890', // 车牌号
    totalMoney: '180.00' // 合计金额
  }, {
    orderId: 'order01',
    orderStatus: 2, // 订单状态,2: 待开始, 3:计费中 4.已支付, 5:已取消
    orderType: 2, // 订单类型 1: 即时停车, 2: 预约停车
    carStatus: 0, // 0 未入场, 1 已入场 , 2 已离场
    inTime: '2017-06-02 20:12', // 业主下单时选择的预计入场时间
    outTime: '2017-06-02 21:00', // 业主下单时选择的预计离场时间
    parkingCloseTime: '2017-06-02 22:00', // 车位关闭时间
    leaveTime: '', // 司机实际离场时间
    parkingNO: 'xxxx01', // 车位号
    carNO: '浙ABC890', // 车牌号
    totalMoney: '180.00' // 合计金额
  }, {
    orderId: 'order01',
    orderStatus: 3, // 订单状态,2: 待开始, 3:计费中 4.已支付, 5:已取消
    orderType: 2, // 订单类型 1: 即时停车, 2: 预约停车
    carStatus: 1, // 0 未入场, 1 已入场 , 2 已离场
    inTime: '2017-06-01 18:00', // 业主下单时选择的预计入场时间
    outTime: '2017-06-01 21:00', // 业主下单时选择的预计离场时间
    parkingCloseTime: '2017-06-01 22:00', // 车位关闭时间
    leaveTime: '', // 司机实际离场时间
    parkingNO: 'xxxx01', // 车位号
    carNO: '浙ABC890', // 车牌号
    totalMoney: '180.00' // 合计金额
  }, {
    orderId: 'order01',
    orderStatus: 5, // 订单状态,2: 待开始, 3:计费中 4.已支付, 5:已取消
    orderType: 1, // 订单类型 1: 即时停车, 2: 预约停车
    carStatus: 0, // 0 未入场, 1 已入场 , 2 已离场
    inTime: '2017-06-01 17:30', // 业主下单时选择的预计入场时间
    outTime: '2017-06-01 21:00', // 业主下单时选择的预计离场时间
    parkingCloseTime: '2017-06-01 22:00', // 车位关闭时间
    leaveTime: '2017-06-01 23:00', // 司机实际离场时间
    parkingNO: 'xxxx01', // 车位号
    carNO: '浙ABC890', // 车牌号
    totalMoney: '180.00' // 合计金额
  }, {
    orderId: 'order01',
    orderStatus: 2, // 订单状态,2: 待开始, 3:计费中 4.已支付, 5:已取消
    orderType: 2, // 订单类型 1: 即时停车, 2: 预约停车
    carStatus: 0, // 0 未入场, 1 已入场 , 2 已离场
    inTime: '2017-06-02 20:12', // 业主下单时选择的预计入场时间
    outTime: '2017-06-02 21:00', // 业主下单时选择的预计离场时间
    parkingCloseTime: '2017-06-02 22:00', // 车位关闭时间
    leaveTime: '', // 司机实际离场时间
    parkingNO: 'xxxx01', // 车位号
    carNO: '浙ABC890', // 车牌号
    totalMoney: '180.00' // 合计金额
  }, {
    orderId: 'order01',
    orderStatus: 4, // 订单状态,2: 待开始, 3:计费中 4.已支付, 5:已取消
    orderType: 2, // 订单类型 1: 即时停车, 2: 预约停车
    carStatus: 2, // 0 未入场, 1 已入场 , 2 已离场
    inTime: '2017-06-01 18:00', // 业主下单时选择的预计入场时间
    outTime: '2017-06-01 21:00', // 业主下单时选择的预计离场时间
    parkingCloseTime: '2017-06-01 22:00', // 车位关闭时间
    leaveTime: '2017-06-01 21:30', // 司机实际离场时间
    parkingNO: 'xxxx01', // 车位号
    carNO: '浙ABC890', // 车牌号
    totalMoney: '180.00' // 合计金额
  }],
  pageInfo: {
    hasMore: true // 是否还有更多
  }
};

let mockData = {
  park: {
    inTimeList: inTimeList,
    orders: orders,
    recommendList: recommendList
  },
  share: {
    sharingList: sharingList,
    shareBaseInfo: shareBaseInfo,
    parkingDetail: parkingDetail,
    blockBuildList: blockBuildList,
    parkingList: parkingList
  },
  records: {
    records: records
  }
}
export { mockData }
