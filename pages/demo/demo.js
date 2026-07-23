const VIEW_META = {
  home: { title: "", bottom: "home", showBottom: true },
  mallCollection: { title: "商场集合", bottom: "home", showBottom: false },
  login: { title: "登录入会", bottom: "profile", showBottom: false },
  card: { title: "会员卡", bottom: "benefits", showBottom: true },
  growth: { title: "会员成长", bottom: "benefits", showBottom: true },
  points: { title: "积分", bottom: "benefits", showBottom: true },
  coupons: { title: "卡券与权益", bottom: "benefits", showBottom: true },
  receipt: { title: "小票积分", bottom: "services", showBottom: false },
  receiptResult: { title: "识别结果", bottom: "services", showBottom: false },
  search: { title: "找店", bottom: "search", showBottom: true },
  guide: { title: "楼层导览", bottom: "services", showBottom: false },
  store: { title: "店铺详情", bottom: "search", showBottom: false },
  parking: { title: "停车缴费", bottom: "services", showBottom: false },
  contentCenter: { title: "内容精选", bottom: "home", showBottom: false },
  contentDetail: { title: "内容详情", bottom: "home", showBottom: false },
  activityList: { title: "活动中心", bottom: "home", showBottom: false },
  activity: { title: "活动详情", bottom: "services", showBottom: false },
  activityPass: { title: "报名凭证", bottom: "profile", showBottom: false },
  activityRecap: { title: "活动回顾", bottom: "home", showBottom: false },
  groupBuy: { title: "团购精选", bottom: "benefits", showBottom: true },
  onlineShop: { title: "在线商城", bottom: "benefits", showBottom: true },
  commerceProduct: { title: "商品详情", bottom: "benefits", showBottom: false },
  mall: { title: "积分商城", bottom: "benefits", showBottom: true },
  profile: { title: "个人中心", bottom: "profile", showBottom: true },
  orders: { title: "我的订单", bottom: "profile", showBottom: false },
  messages: { title: "消息中心", bottom: "profile", showBottom: false },
  couponDetail: { title: "卡券详情", bottom: "benefits", showBottom: false },
  rewardExchange: { title: "积分换礼", bottom: "benefits", showBottom: false },
  memberProfile: { title: "会员资料", bottom: "profile", showBottom: false },
  inviteActivity: { title: "好友同行计划", bottom: "profile", showBottom: false },
  vehicles: { title: "车辆管理", bottom: "profile", showBottom: false },
  vehicleEdit: { title: "车辆信息", bottom: "profile", showBottom: false },
  merchantManage: { title: "商户管理", bottom: "profile", showBottom: false },
  settings: { title: "设置", bottom: "profile", showBottom: false },
  pageCustomize: { title: "页面自定义", bottom: "profile", showBottom: false },
  customPreview: { title: "页面预览", bottom: "profile", showBottom: false },
  cart: { title: "购物车", bottom: "benefits", showBottom: false },
  checkout: { title: "确认兑换", bottom: "benefits", showBottom: false },
  orderSuccess: { title: "兑换成功", bottom: "benefits", showBottom: false },
  parkingRecords: { title: "停车记录", bottom: "services", showBottom: false },
  invoice: { title: "停车开票", bottom: "services", showBottom: false },
  infoDetail: { title: "详情", bottom: "profile", showBottom: false },
  service: { title: "会员服务", bottom: "services", showBottom: true },
  customerService: { title: "在线客服", bottom: "services", showBottom: true },
  concierge: { title: "礼宾借用", bottom: "services", showBottom: true }
};

function buildDemoQr(seed = "member") {
  const size = 21;
  const cells = Array(size * size).fill(0);
  const reserved = Array(size * size).fill(false);
  const at = (row, column) => row * size + column;

  const drawFinder = (top, left) => {
    for (let row = -1; row <= 7; row += 1) {
      for (let column = -1; column <= 7; column += 1) {
        const y = top + row;
        const x = left + column;
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        reserved[at(y, x)] = true;
        const separator = row === -1 || row === 7 || column === -1 || column === 7;
        const outer = row === 0 || row === 6 || column === 0 || column === 6;
        const center = row >= 2 && row <= 4 && column >= 2 && column <= 4;
        cells[at(y, x)] = separator ? 0 : (outer || center ? 1 : 0);
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, 14);
  drawFinder(14, 0);

  for (let index = 8; index < 13; index += 1) {
    cells[at(6, index)] = index % 2 === 0 ? 1 : 0;
    cells[at(index, 6)] = index % 2 === 0 ? 1 : 0;
    reserved[at(6, index)] = true;
    reserved[at(index, 6)] = true;
  }

  let random = seed.split("").reduce((value, character) => value + character.charCodeAt(0), 97);
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      const index = at(row, column);
      if (reserved[index]) continue;
      random = (random * 1103515245 + 12345) & 0x7fffffff;
      cells[index] = ((random >> 12) + row + column) % 3 === 0 ? 1 : 0;
    }
  }
  cells[at(13, 8)] = 1;
  return cells;
}

const MINI_QR_CELLS = [
  1, 1, 1, 0, 1,
  1, 0, 1, 1, 0,
  1, 1, 1, 0, 1,
  0, 1, 0, 1, 0,
  1, 0, 1, 1, 1
];

const AVAILABLE_COUPONS = [
  { id: "coffee", title: "精品咖啡礼遇券", note: "指定餐饮门店可用", expiry: "2026.08.15", image: "/assets/images/pop-home/coffee-lifestyle.jpg", stock: 68, method: "免费领取", cta: "免费领取", pointCost: 0, owned: false },
  { id: "parking", title: "免费停车2小时", note: "全场停车场通用", expiry: "2026.08.31", image: "/assets/images/pop-home/mall-guide.jpg", stock: 120, method: "积分换领", cta: "600积分换领", pointCost: 600, owned: false },
  { id: "exhibition", title: "海滨艺术展双人礼券", note: "指定展览可用", expiry: "2026.08.31", image: "/assets/images/pop-home/art-festival.jpg", stock: 28, method: "积分+现金", cta: "去换领", pointCost: 1200, owned: false }
];

const OWNED_COUPONS = [
  { id: "dining", title: "艺术书廊满200减50券", note: "满200元可用", expiry: "2026.08.10", image: "/assets/images/pop-home/art-bookshop.jpg", stock: 1, statusLabel: "可使用", code: "8836 2091 6688", owned: true },
  { id: "member-parking", title: "会员停车减免券", note: "可抵扣2小时停车费", expiry: "2026.07.24", image: "/assets/images/pop-home/mall-guide.jpg", stock: 1, statusLabel: "3天后到期", code: "6208 3166 8820", owned: true }
];

const ACTIVITY_ITEMS = [
  {
    id: "coast-art", type: "艺术展览", title: "海滨当代艺术展", subtitle: "城市、海洋与未来的多元对话",
    date: "07.20—08.31", location: "艺术空间", status: "报名中", tone: "open", image: "/assets/images/pop-home/art-festival.jpg",
    memberOnly: true, joined: false, action: "立即报名", dates: ["7月26日 周日", "7月27日 周一", "7月28日 周二"],
    description: "汇聚当代艺术家代表作品，展现海洋、城市与未来的多元对话。\n在海风与艺术之间，开启一场感官与思想的沉浸之旅。",
    offer: "会员专享：双人票8折"
  },
  {
    id: "sunset-live", type: "音乐现场", title: "天台落日音乐会", subtitle: "在城市天际线旁聆听夏日旋律",
    date: "07.25 18:30", location: "屋顶花园", status: "即将开始", tone: "soon", image: "/assets/images/pop-home/rooftop-music.jpg",
    memberOnly: true, joined: false, action: "开启提醒", dates: ["7月25日 周六"],
    description: "落日时分开启限定音乐现场，集合轻爵士、独立流行与城市夜景。\n会员可提前入场，并享受专属休息席位。",
    offer: "会员专享：优先入场及预留席位"
  },
  {
    id: "design-market", type: "生活方式", title: "夏日设计市集", subtitle: "独立品牌、手作与限定联名相遇",
    date: "07.26—07.27", location: "L1 中庭", status: "报名中", tone: "open", image: "/assets/images/pop-home/family-service.jpg",
    memberOnly: false, joined: true, action: "查看报名凭证", dates: ["7月26日 周日", "7月27日 周一"],
    description: "精选独立设计品牌、手作艺术与城市创意项目，带来两日限定灵感市集。\n现场设有会员互动工作坊与积分任务。",
    offer: "会员礼遇：签到可得100积分"
  },
  {
    id: "morning-run", type: "社群活动", title: "晨光咖啡与海岸慢跑", subtitle: "用轻运动开启松弛周末",
    date: "每周日 08:00", location: "海岸广场", status: "报名中", tone: "open", image: "/assets/images/pop-home/coffee-lifestyle.jpg",
    memberOnly: true, joined: false, action: "立即报名", dates: ["7月26日 周日", "8月2日 周日", "8月9日 周日"],
    description: "沿海岸完成三公里轻松慢跑，随后领取会员限定咖啡与能量早餐。\n活动适合日常运动爱好者，无需专业装备。",
    offer: "会员礼遇：免费咖啡及能量早餐"
  },
  {
    id: "architecture-tour", type: "艺术导览", title: "建筑光影导览", subtitle: "从空间细节读懂建筑美学",
    date: "07.12—07.19", location: "艺术空间", status: "已结束", tone: "ended", image: "/assets/images/pop-home/mall-guide.jpg",
    memberOnly: false, joined: false, action: "查看活动回顾", dates: [],
    description: "跟随导览员探索建筑结构、自然采光与公共艺术之间的关系。\n活动现已结束，可查看现场精选回顾。",
    offer: "活动回顾：精选影像已上线"
  }
];

const CONTENT_ITEMS = [
  {
    id: "coast-day", category: "专题", title: "海滨艺术一日攻略", subtitle: "从展览、书店到海景咖啡，收藏一条松弛的艺术路线",
    image: "/assets/images/pop-home/art-festival.jpg", malls: ["海境艺术中心"], audience: "星艺卡会员", recommend: "为你推荐", publish: "今日 10:00", readTime: "阅读 4 分钟",
    intro: "把一天交给海风与艺术。从上午的沉浸展览，到午后的设计书廊与海景咖啡，这份路线把内容灵感自然连接到店铺、权益与到店服务。",
    sections: [
      { title: "10:30 · 先看一场展", text: "从海滨当代艺术展开始，沿着城市、海洋与未来的主题线索进入艺术空间。星艺卡会员可享双人票专属礼遇。" },
      { title: "14:00 · 在书与设计之间停留", text: "前往艺术书廊挑选设计读物与限定文创，出示会员码可领取满减礼券。" },
      { title: "17:30 · 用咖啡收尾", text: "到海岸咖啡领取会员升杯权益，窗边座位适合慢慢回看今天的灵感。" }
    ],
    related: [
      { icon: "展", type: "活动", title: "海滨当代艺术展", caption: "报名中 · 会员优先", target: "activityList", action: "去报名" },
      { icon: "店", type: "店铺", title: "艺术书廊", caption: "L1 · 设计与阅读", target: "store", action: "进店看看" },
      { icon: "券", type: "卡券", title: "精品咖啡礼遇券", caption: "免费领取 · 限量68份", target: "coupons", action: "立即领取" },
      { icon: "导", type: "服务", title: "路线与楼层导览", caption: "规划到店动线", target: "guide", action: "开始导航" }
    ],
    primaryTarget: "coupons", primaryAction: "领取专题关联权益"
  },
  {
    id: "bookshop-story", category: "品牌故事", title: "一间书廊如何收藏城市灵感", subtitle: "走进艺术书廊，认识书、器物与空间背后的选择",
    image: "/assets/images/pop-home/art-bookshop.jpg", malls: ["海境艺术中心", "湾岸生活馆"], audience: "艺术兴趣客群", recommend: "兴趣匹配", publish: "07月20日", readTime: "阅读 5 分钟",
    intro: "艺术书廊不只是售卖书籍的店铺，它更像一间持续更新的城市灵感档案。选书、展陈和器物共同组成可以被带回家的艺术日常。",
    sections: [
      { title: "从一本书开始", text: "书廊以建筑、摄影、设计与当代艺术为主要选题，每月围绕一个城市文化主题更新陈列。" },
      { title: "把展览带回生活", text: "限定文创与艺术衍生品来自展览合作艺术家，让观看之后的感受继续留在日常。" }
    ],
    related: [
      { icon: "店", type: "店铺", title: "艺术书廊", caption: "营业至22:00", target: "store", action: "查看店铺" },
      { icon: "券", type: "卡券", title: "满200减50礼券", caption: "会员免费领取", target: "coupons", action: "领取礼券" }
    ],
    primaryTarget: "store", primaryAction: "走进品牌空间"
  },
  {
    id: "summer-info", category: "商场资讯", title: "夏季延时营业与出行提示", subtitle: "周末延时开放，停车、客服与服务时间一览",
    image: "/assets/images/pop-home/mall-guide.jpg", malls: ["海境艺术中心", "云庭城市广场", "湾岸生活馆"], audience: "全部会员", recommend: "本周资讯", publish: "07月21日", readTime: "阅读 2 分钟",
    intro: "为方便会员参与夏季夜间活动，本周五至周日部分区域延时开放。到店前可提前查看停车、客服及礼宾服务安排。",
    sections: [
      { title: "营业时间", text: "公共区域开放至22:30，餐饮店铺最晚营业至23:00，具体以店铺现场公告为准。" },
      { title: "到店服务", text: "会员客服、礼宾借用与停车缴费均可通过小程序提前查询和办理。" }
    ],
    related: [
      { icon: "停", type: "服务", title: "停车缴费", caption: "会员停车权益可用", target: "parking", action: "查看停车" },
      { icon: "服", type: "服务", title: "会员服务中心", caption: "客服与礼宾随时响应", target: "service", action: "查看服务" }
    ],
    primaryTarget: "service", primaryAction: "查看本周服务安排"
  },
  {
    id: "sunset-guide", category: "活动攻略", title: "天台落日音乐会观演指南", subtitle: "入场、座位、停车与餐饮安排一次看懂",
    image: "/assets/images/pop-home/rooftop-music.jpg", malls: ["云庭城市广场"], audience: "乐游卡会员", recommend: "活动前必读", publish: "定时 07.25 10:00", readTime: "阅读 3 分钟",
    intro: "音乐会将在落日前一小时开放入场。建议提前抵达，先完成签到并领取会员座位凭证，再到天台花园等待演出开始。",
    sections: [
      { title: "建议到场时间", text: "17:30开放会员签到，18:00开始入场，18:30演出正式开始。" },
      { title: "会员专享", text: "乐游卡会员享优先入场、预留席位与限定饮品，可在活动详情页提前开启提醒。" }
    ],
    related: [
      { icon: "活", type: "活动", title: "天台落日音乐会", caption: "即将开始", target: "activityList", action: "开启提醒" },
      { icon: "停", type: "服务", title: "停车2小时兑换券", caption: "600积分换领", target: "coupons", action: "立即换领" }
    ],
    primaryTarget: "activityList", primaryAction: "查看活动并开启提醒"
  },
  {
    id: "family-service", category: "服务推荐", title: "带孩子轻松逛商场的五个准备", subtitle: "亲子空间、婴儿车、洗手间与客服位置提前收藏",
    image: "/assets/images/pop-home/floor-guide-colorful.jpg", malls: ["海境艺术中心", "云庭城市广场", "湾岸生活馆"], audience: "亲子客群", recommend: "亲子会员推荐", publish: "07月19日", readTime: "阅读 3 分钟",
    intro: "从停车入场到临时借用物品，提前了解服务位置可以让亲子到店更加从容。小程序已整合导览、客服和礼宾借用入口。",
    sections: [
      { title: "先收藏服务位置", text: "楼层导览可以快速查找亲子洗手间、母婴室、客服台与直梯位置。" },
      { title: "需要时在线借用", text: "婴儿车、雨伞与充电宝可在礼宾服务页查看库存并提交借用。" }
    ],
    related: [
      { icon: "导", type: "服务", title: "楼层导览", caption: "设施查找与路线规划", target: "guide", action: "查看地图" },
      { icon: "借", type: "服务", title: "礼宾物品借用", caption: "婴儿车库存6件", target: "concierge", action: "立即借用" },
      { icon: "客", type: "服务", title: "在线客服", caption: "实时会话", target: "customerService", action: "联系客服" }
    ],
    primaryTarget: "service", primaryAction: "打开亲子服务"
  },
  {
    id: "morning-map", category: "专题", title: "湾岸晨光生活地图", subtitle: "慢跑、咖啡与生活美学店铺组成的清晨路线",
    image: "/assets/images/pop-home/coffee-lifestyle.jpg", malls: ["湾岸生活馆"], audience: "生活方式客群", recommend: "湾岸精选", publish: "07月18日", readTime: "阅读 4 分钟",
    intro: "从三公里海岸慢跑开始，在晨光咖啡领取能量早餐，再到生活美学馆挑选自然器物，体验一段松弛的湾岸早晨。",
    sections: [
      { title: "08:00 · 海岸集合", text: "会员晨光计划每周日出发，适合日常运动爱好者参与。" },
      { title: "09:00 · 咖啡与生活好物", text: "完成活动后可领取早餐权益，并使用生活好物会员礼券。" }
    ],
    related: [
      { icon: "活", type: "活动", title: "晨光咖啡与海岸慢跑", caption: "每周日08:00", target: "activityList", action: "立即报名" },
      { icon: "券", type: "卡券", title: "早餐组合立减20", caption: "会员专享", target: "coupons", action: "领取礼券" }
    ],
    primaryTarget: "activityList", primaryAction: "报名晨光计划"
  }
];

function buildContentState(mallName, contentFilter = "推荐") {
  const mallContents = CONTENT_ITEMS.filter((item) => item.malls.includes(mallName));
  const visibleContents = contentFilter === "推荐"
    ? mallContents.slice(1)
    : mallContents.filter((item) => item.category === contentFilter);
  return {
    contentFilter,
    visibleContents,
    featuredContent: mallContents[0] || CONTENT_ITEMS[0]
  };
}

const INITIAL_CONTENT_STATE = buildContentState("海境艺术中心");

const MALL_HOME_CONFIGS = {
  "海境艺术中心": {
    memberName: "星艺卡",
    memberLabel: "星艺卡会员",
    memberMark: "星",
    memberEnglish: "ART STAR CLUB",
    memberTheme: "star",
    memberNextLevel: "星耀卡",
    memberRoadmap: [
      { name: "初遇卡", value: "2,000", active: false },
      { name: "星艺卡", value: "8,000", active: true },
      { name: "星耀卡", value: "15,000", active: false },
      { name: "典藏卡", value: "30,000", active: false }
    ],
    heroImage: "/assets/images/pop-home/art-festival.jpg",
    eyebrow: "艺术地标",
    heroTitle: "寻迹 艺游空间\n开启海滨艺术之旅",
    heroRibbon: "艺术漫游日",
    heroDate: "7.01 — 8.31",
    heroAction: "了解更多",
    memberPosition: "flow",
    bannerTone: "coast",
    bannerImage: "/assets/images/pop-home/art-festival.jpg",
    bannerKicker: "限时艺术季",
    bannerTitle: "海风入境 · 夏日艺术漫游",
    bannerNote: "即日起至 8月31日 · 会员优先预约",
    layout: ["coupon", "banner", "member", "inspiration"],
    inspirationTitle: "探索灵感",
    inspirationSub: "发现城市生活新灵感",
    inspirations: [
      { title: "海滨艺术一日攻略", caption: "展览、书店与咖啡路线", image: "/assets/images/pop-home/art-festival.jpg", contentId: "coast-day" },
      { title: "艺术书廊故事", caption: "设计与阅读的灵感", image: "/assets/images/pop-home/art-bookshop.jpg", contentId: "bookshop-story" },
      { title: "夏季到店资讯", caption: "营业与服务安排", image: "/assets/images/pop-home/mall-guide.jpg", contentId: "summer-info" }
    ],
    feed: [
      { label: "会员积分", title: "邀请好友注册，双方都有礼", caption: "好友完成注册，你可获得300积分", image: "/assets/images/pop-home/family-service.jpg", target: "inviteActivity", height: "tall", kind: "invite" },
      { label: "店铺优惠", title: "海岸咖啡 第二杯半价", caption: "会员到店出示会员码即可享受", target: "coupons", height: "short", kind: "coupon", tone: "amber" },
      { label: "人气店铺", title: "艺术书廊", caption: "设计书籍与艺术衍生品精选", image: "/assets/images/pop-home/art-bookshop.jpg", target: "store", height: "tall", kind: "store" },
      { label: "可领券", title: "艺术书廊 满200减50", caption: "免费领取 · 指定商品可用", target: "coupons", height: "short", kind: "coupon", tone: "ink" },
      { label: "新店推荐", title: "海境设计集合店", caption: "生活器物与独立设计品牌", image: "/assets/images/pop-home/coffee-lifestyle.jpg", target: "store", height: "tall", kind: "store" },
      { label: "积分换券", title: "免费停车2小时", caption: "600积分换领 · 当日有效", target: "coupons", height: "short", kind: "coupon", tone: "sage" },
      { label: "店铺优惠", title: "海景餐厅 双人套餐礼遇", caption: "会员专享价 · 周末可用", target: "coupons", height: "tall", kind: "coupon", tone: "rose" },
      { label: "精选店铺", title: "光影生活美学馆", caption: "家居、香氛与艺术摆件", image: "/assets/images/pop-home/mall-guide.jpg", target: "store", height: "short", kind: "store" }
    ]
  },
  "云庭城市广场": {
    memberName: "乐游卡",
    memberLabel: "乐游卡会员",
    memberMark: "乐",
    memberEnglish: "CITY JOY CLUB",
    memberTheme: "joy",
    memberNextLevel: "乐享卡",
    memberRoadmap: [
      { name: "新友卡", value: "2,000", active: false },
      { name: "乐游卡", value: "8,000", active: true },
      { name: "乐享卡", value: "15,000", active: false },
      { name: "城市玩家", value: "30,000", active: false }
    ],
    heroImage: "/assets/images/pop-home/rooftop-music.jpg",
    eyebrow: "城市欢聚",
    heroTitle: "云上夏日奇遇\n解锁灵感生活节",
    heroRibbon: "屋顶音乐周",
    heroDate: "FRI — SUN",
    heroAction: "查看活动",
    memberPosition: "flow",
    couponShowcaseAboveServices: true,
    bannerTone: "sunset",
    bannerImage: "/assets/images/pop-home/rooftop-music.jpg",
    bannerKicker: "周末特别企划",
    bannerTitle: "天台落日音乐会",
    bannerNote: "本周六 18:30 · 乐游卡会员专席",
    layout: ["banner", "member", "inspiration", "coupon"],
    inspirationTitle: "城市热事",
    inspirationSub: "此刻值得出发的新鲜体验",
    inspirations: [
      { title: "落日观演指南", caption: "入场、停车与会员席位", image: "/assets/images/pop-home/rooftop-music.jpg", contentId: "sunset-guide" },
      { title: "亲子到店指南", caption: "轻松逛商场的五个准备", image: "/assets/images/pop-home/family-service.jpg", contentId: "family-service" },
      { title: "夏季到店资讯", caption: "营业与服务安排", image: "/assets/images/pop-home/mall-guide.jpg", contentId: "summer-info" }
    ],
    feed: [
      { label: "会员积分", title: "好友同行计划", caption: "邀请好友注册，成功即可得300积分", image: "/assets/images/pop-home/family-service.jpg", target: "inviteActivity", height: "short", kind: "invite" },
      { label: "人气店铺", title: "云庭城市书房", caption: "阅读、展览与城市文化空间", image: "/assets/images/pop-home/art-bookshop.jpg", target: "store", height: "tall", kind: "store" },
      { label: "可领券", title: "精品咖啡 免费升杯", caption: "会员免费领取 · 每人限领1张", target: "coupons", height: "tall", kind: "coupon", tone: "amber" },
      { label: "店铺上新", title: "城市设计集合店", caption: "独立品牌与限定联名好物", image: "/assets/images/pop-home/coffee-lifestyle.jpg", target: "store", height: "short", kind: "store" },
      { label: "限时优惠", title: "周末餐饮 满300减80", caption: "指定餐饮门店通用", target: "coupons", height: "short", kind: "coupon", tone: "rose" },
      { label: "精选店铺", title: "天台花园餐厅", caption: "落日景观与创意融合菜", image: "/assets/images/pop-home/rooftop-music.jpg", target: "store", height: "tall", kind: "store" },
      { label: "积分换券", title: "停车2小时兑换券", caption: "600积分换领 · 全场通用", target: "coupons", height: "short", kind: "coupon", tone: "sage" },
      { label: "会员专享", title: "设计好物 9折礼遇", caption: "出示会员码即可使用", target: "coupons", height: "tall", kind: "coupon", tone: "ink" }
    ]
  },
  "湾岸生活馆": {
    memberName: "潮享卡",
    memberLabel: "潮享卡会员",
    memberMark: "潮",
    memberEnglish: "COAST LIFE CLUB",
    memberTheme: "tide",
    memberNextLevel: "海岸卡",
    memberRoadmap: [
      { name: "晨光卡", value: "2,000", active: false },
      { name: "潮享卡", value: "8,000", active: true },
      { name: "海岸卡", value: "15,000", active: false },
      { name: "松弛家", value: "30,000", active: false }
    ],
    heroImage: "/assets/images/pop-home/coffee-lifestyle.jpg",
    eyebrow: "湾岸日常",
    heroTitle: "向海而居\n遇见松弛生活灵感",
    heroRibbon: "清晨生活提案",
    heroDate: "08:00 DAILY",
    heroAction: "即刻探索",
    memberPosition: "flow",
    bannerTone: "garden",
    bannerImage: "/assets/images/pop-home/coffee-lifestyle.jpg",
    bannerKicker: "会员生活提案",
    bannerTitle: "晨光咖啡与海岸慢跑",
    bannerNote: "每日 08:00 开始 · 到店领取能量补给",
    layout: ["inspiration", "banner", "coupon", "member"],
    inspirationTitle: "湾岸精选",
    inspirationSub: "慢下来，发现生活的质感",
    inspirations: [
      { title: "湾岸晨光地图", caption: "慢跑、咖啡与轻社交", image: "/assets/images/pop-home/coffee-lifestyle.jpg", contentId: "morning-map" },
      { title: "亲子到店指南", caption: "导览与礼宾服务收藏", image: "/assets/images/pop-home/family-service.jpg", contentId: "family-service" },
      { title: "书廊品牌故事", caption: "书、器物与空间选择", image: "/assets/images/pop-home/art-bookshop.jpg", contentId: "bookshop-story" }
    ],
    feed: [
      { label: "会员积分", title: "邀请好友，共享湾岸时光", caption: "好友注册成功，你可获得300积分", image: "/assets/images/pop-home/family-service.jpg", target: "inviteActivity", height: "tall", kind: "invite" },
      { label: "晨间优惠", title: "晨光咖啡 早餐组合立减20", caption: "每日11点前会员专享", target: "coupons", height: "short", kind: "coupon", tone: "amber" },
      { label: "生活店铺", title: "湾岸生活美学馆", caption: "家居、香氛与自然器物", image: "/assets/images/pop-home/coffee-lifestyle.jpg", target: "store", height: "tall", kind: "store" },
      { label: "可领券", title: "生活好物 9折券", caption: "免费领取 · 部分联名款除外", target: "coupons", height: "short", kind: "coupon", tone: "sage" },
      { label: "精选店铺", title: "海岸艺术书店", caption: "设计读物与限定文创", image: "/assets/images/pop-home/art-bookshop.jpg", target: "store", height: "tall", kind: "store" },
      { label: "积分换券", title: "免费停车2小时", caption: "600积分换领 · 当日可用", target: "coupons", height: "short", kind: "coupon", tone: "ink" },
      { label: "店铺礼遇", title: "海景餐厅 下午茶双人券", caption: "会员专享价 · 需提前预约", target: "coupons", height: "short", kind: "coupon", tone: "rose" },
      { label: "新店推荐", title: "湾岸手作集合店", caption: "独立创作者与限量生活好物", image: "/assets/images/pop-home/art-festival.jpg", target: "store", height: "tall", kind: "store" }
    ]
  }
};

const MALL_COMMERCE_CONFIGS = {
  "海境艺术中心": {
    groupBuys: [
      { id: "coast-group-exhibition", type: "group", badge: "2人团", name: "《潮汐与光》沉浸艺术展双人票", store: "海境当代艺术馆", spec: "双人通票｜当日单次入场", price: "128", originalPrice: "196", sold: "已团268份", stock: 36, groupSize: 2, image: "/assets/images/pop-home/art-festival.jpg", fulfillment: "到店出示电子票核销", description: "含双人展览通票与语音导览，周二至周日10:00—20:30可用。" },
      { id: "coast-group-tea", type: "group", badge: "3人团", name: "海景露台双人下午茶套餐", store: "潮汐餐厅", spec: "甜点6款＋饮品2杯｜双人份", price: "168", originalPrice: "258", sold: "已团186份", stock: 24, groupSize: 3, image: "/assets/images/pop-home/rooftop-music.jpg", fulfillment: "到店消费，需提前2小时预约", description: "包含季节甜点、咸点与指定饮品，周末及法定节假日通用。" },
      { id: "coast-group-coffee", type: "group", badge: "4人团", name: "海岸咖啡手冲体验课", store: "SEAWIND COFFEE", spec: "90分钟｜含2款精品豆品鉴", price: "88", originalPrice: "138", sold: "已团92份", stock: 18, groupSize: 4, image: "/assets/images/pop-home/coffee-lifestyle.jpg", fulfillment: "到店预约参与", description: "咖啡师带领完成研磨、注水与风味记录，每场最多8人。" },
      { id: "coast-group-book", type: "group", badge: "2人团", name: "艺术书廊阅读礼盒", store: "艺术书廊", spec: "设计刊物1册＋限定书签2枚", price: "79", originalPrice: "118", sold: "已团154份", stock: 42, groupSize: 2, image: "/assets/images/pop-home/art-bookshop.jpg", fulfillment: "L1艺术书廊到店领取", description: "可从当月精选设计刊物中任选1册，附商场限定金属书签。" },
      { id: "coast-group-family", type: "group", badge: "3人团", name: "亲子艺术工作坊家庭套票", store: "小小创想实验室", spec: "1大1小｜材料包1套", price: "109", originalPrice: "168", sold: "已团73份", stock: 15, groupSize: 3, image: "/assets/images/pop-home/family-service.jpg", fulfillment: "周六日指定场次到店使用", description: "适合5—10岁儿童，完成一件可带走的混合媒介艺术作品。" }
    ],
    shopProducts: [
      { id: "coast-shop-print", type: "shop", badge: "馆藏限定", name: "海风入境艺术微喷版画", store: "海境艺术商店", spec: "30×40cm｜编号版｜含画框", price: "299", originalPrice: "368", sold: "月售86件", stock: 28, image: "/assets/images/pop-home/art-festival.jpg", fulfillment: "顺丰包邮｜48小时内发货", description: "展览主题授权微喷版画，采用无酸艺术纸，每件附独立收藏编号。" },
      { id: "coast-shop-cup", type: "shop", badge: "设计好物", name: "潮线手作釉彩咖啡杯", store: "海境设计集合店", spec: "320ml｜米白蓝纹｜单只", price: "129", originalPrice: "159", sold: "月售143件", stock: 51, image: "/assets/images/pop-home/coffee-lifestyle.jpg", fulfillment: "支持快递或门店自提", description: "手工施釉形成自然潮线纹理，杯口圆润，适合咖啡与日常饮品。" },
      { id: "coast-shop-bag", type: "shop", badge: "会员价", name: "ART WALK厚帆布托特包", store: "海境艺术商店", spec: "38×34cm｜内袋＋磁扣", price: "89", originalPrice: "119", sold: "月售208件", stock: 76, image: "/assets/images/pop-home/family-service.jpg", fulfillment: "满99元包邮｜门店可自提", description: "12安厚帆布与双层提手，适合装载画册、电脑和日常随身物品。" },
      { id: "coast-shop-book", type: "shop", badge: "编辑推荐", name: "《海滨建筑散步》城市读本", store: "艺术书廊", spec: "精装｜256页｜中英双语", price: "98", originalPrice: "128", sold: "月售69件", stock: 34, image: "/assets/images/pop-home/art-bookshop.jpg", fulfillment: "当日发货｜破损包退", description: "收录18座海滨公共建筑与3条步行路线，附建筑摄影折页地图。" },
      { id: "coast-shop-scent", type: "shop", badge: "新品", name: "海盐与雪松空间香氛", store: "光影生活美学馆", spec: "100ml｜扩香约60天", price: "168", originalPrice: "198", sold: "月售57件", stock: 22, image: "/assets/images/pop-home/mall-guide.jpg", fulfillment: "快递配送｜不支持航空件", description: "以海盐、鼠尾草和雪松构成清爽木质气息，适合玄关与书房。" },
      { id: "coast-shop-card", type: "shop", badge: "小众文创", name: "海境建筑线稿明信片组", store: "海境艺术商店", spec: "8张套装｜特种纸印刷", price: "39", originalPrice: "49", sold: "月售312件", stock: 120, image: "/assets/images/pop-home/mall-guide.jpg", fulfillment: "单件运费6元｜满99元包邮", description: "精选商场建筑与滨海雕塑线稿，适合收藏、书写与装裱。" }
    ]
  },
  "云庭城市广场": {
    groupBuys: [
      { id: "city-group-music", type: "group", badge: "2人团", name: "天台落日音乐会双人席", store: "云庭天台花园", spec: "双人座｜含无酒精特调2杯", price: "99", originalPrice: "168", sold: "已团386份", stock: 32, groupSize: 2, image: "/assets/images/pop-home/rooftop-music.jpg", fulfillment: "活动当日凭电子码入场", description: "18:00开始检票，座位按到场顺序安排，雨天活动将顺延。" },
      { id: "city-group-hotpot", type: "group", badge: "4人团", name: "川味鲜切牛肉火锅四人餐", store: "椒里鲜切牛肉", spec: "锅底＋8荤6素｜建议3—4人", price: "268", originalPrice: "428", sold: "已团521份", stock: 60, groupSize: 4, image: "/assets/images/pop-home/coffee-lifestyle.jpg", fulfillment: "B1门店核销｜免预约", description: "含招牌吊龙、嫩肉、毛肚与时蔬拼盘，餐具和茶位费已包含。" },
      { id: "city-group-kids", type: "group", badge: "3人团", name: "城市攀爬乐园亲子畅玩票", store: "UP KIDS运动馆", spec: "1大1小｜3小时畅玩", price: "79", originalPrice: "128", sold: "已团244份", stock: 45, groupSize: 3, image: "/assets/images/pop-home/family-service.jpg", fulfillment: "L3门店使用｜需穿防滑袜", description: "包含攀爬、滑梯与积木区，适合3—10岁儿童，成人需陪同入场。" },
      { id: "city-group-movie", type: "group", badge: "2人团", name: "IMAX电影双人观影套餐", store: "星幕影城", spec: "2张电影票＋中爆米花1份", price: "119", originalPrice: "176", sold: "已团632份", stock: 80, groupSize: 2, image: "/assets/images/pop-home/art-festival.jpg", fulfillment: "线上选座｜特殊厅补差价", description: "适用于普通2D及IMAX影片，春节档及特殊场次以影院说明为准。" },
      { id: "city-group-burger", type: "group", badge: "3人团", name: "炙烤牛肉堡双人分享餐", store: "YARD BURGER", spec: "汉堡2份＋小食2份＋饮品2杯", price: "88", originalPrice: "136", sold: "已团318份", stock: 50, groupSize: 3, image: "/assets/images/pop-home/coffee-lifestyle.jpg", fulfillment: "L1门店核销｜无需预约", description: "汉堡可选经典牛肉或香辣鸡腿，饮品限门店指定软饮。" }
    ],
    shopProducts: [
      { id: "city-shop-speaker", type: "shop", badge: "潮流首发", name: "MINI LOOP便携蓝牙音箱", store: "城市设计集合店", spec: "湖蓝色｜12小时续航｜IPX5", price: "239", originalPrice: "299", sold: "月售176件", stock: 38, image: "/assets/images/pop-home/rooftop-music.jpg", fulfillment: "全国包邮｜一年质保", description: "支持蓝牙5.3与双机串联，机身仅重380g，适合露营和桌面使用。" },
      { id: "city-shop-cap", type: "shop", badge: "音乐周限定", name: "SUNSET LIVE刺绣棒球帽", store: "云庭快闪商店", spec: "可调节帽围｜黑色｜中性款", price: "79", originalPrice: "99", sold: "月售228件", stock: 65, image: "/assets/images/pop-home/rooftop-music.jpg", fulfillment: "门店自提优先｜支持快递", description: "落日音乐周限定图形刺绣，弧形帽檐与吸汗棉带适合夏日佩戴。" },
      { id: "city-shop-lamp", type: "shop", badge: "设计精选", name: "折叠磁吸氛围灯", store: "BETA生活研究所", spec: "暖白光｜USB-C充电｜三档", price: "159", originalPrice: "199", sold: "月售94件", stock: 27, image: "/assets/images/pop-home/mall-guide.jpg", fulfillment: "满99元包邮｜7天退换", description: "磁吸折叠结构可作为桌灯、壁灯和露营灯使用，满电续航约10小时。" },
      { id: "city-shop-game", type: "shop", badge: "聚会好物", name: "城市玩家桌游礼盒", store: "PLAYMORE玩具社", spec: "4款游戏｜适合3—8人", price: "188", originalPrice: "238", sold: "月售71件", stock: 19, image: "/assets/images/pop-home/family-service.jpg", fulfillment: "顺丰包邮｜赠规则教学视频", description: "包含反应、推理、协作与派对类游戏各1款，中文规则清晰易上手。" },
      { id: "city-shop-bottle", type: "shop", badge: "会员9折", name: "CITY WALK随行保温杯", store: "云庭城市书房", spec: "480ml｜奶油白｜316不锈钢", price: "109", originalPrice: "139", sold: "月售163件", stock: 48, image: "/assets/images/pop-home/art-bookshop.jpg", fulfillment: "支持刻字｜3个工作日发货", description: "轻量杯身与旋拧防漏杯盖，保温约6小时，可选8字以内激光刻字。" },
      { id: "city-shop-tote", type: "shop", badge: "环保系列", name: "周末市集再生布购物袋", store: "城市设计集合店", spec: "42×36cm｜肩背款｜双面印花", price: "59", originalPrice: "79", sold: "月售287件", stock: 92, image: "/assets/images/pop-home/art-festival.jpg", fulfillment: "满99元包邮｜门店可自提", description: "使用再生聚酯面料制作，轻盈耐磨，可折叠收纳于内置口袋。" }
    ]
  },
  "湾岸生活馆": {
    groupBuys: [
      { id: "bay-group-brunch", type: "group", badge: "2人团", name: "海岸早午餐双人套餐", store: "MORNING TIDE", spec: "主食2份＋饮品2杯＋沙拉", price: "118", originalPrice: "178", sold: "已团296份", stock: 40, groupSize: 2, image: "/assets/images/pop-home/coffee-lifestyle.jpg", fulfillment: "每日08:00—14:00到店使用", description: "主食可选班尼迪克蛋、牛油果吐司或烟熏三文鱼贝果。" },
      { id: "bay-group-run", type: "group", badge: "4人团", name: "湾岸晨跑训练营体验课", store: "RUNLAB湾岸跑站", spec: "60分钟｜含体态评估与补给", price: "49", originalPrice: "89", sold: "已团168份", stock: 25, groupSize: 4, image: "/assets/images/pop-home/mall-guide.jpg", fulfillment: "周日08:00集合｜需预约", description: "专业教练带领热身、配速跑与拉伸，完成后赠电解质饮品1瓶。" },
      { id: "bay-group-pet", type: "group", badge: "3人团", name: "宠物基础洗护套餐", store: "PAW PAW宠物生活", spec: "10kg以内犬猫｜基础洗护", price: "79", originalPrice: "138", sold: "已团203份", stock: 30, groupSize: 3, image: "/assets/images/pop-home/family-service.jpg", fulfillment: "电话预约｜节假日加收20元", description: "包含清洁、吹干、剪指甲与耳道护理，长毛及特殊犬种以门店评估为准。" },
      { id: "bay-group-flower", type: "group", badge: "2人团", name: "自然系桌花手作体验", store: "岛屿花房", spec: "90分钟｜鲜花材料1套", price: "99", originalPrice: "159", sold: "已团87份", stock: 16, groupSize: 2, image: "/assets/images/pop-home/art-festival.jpg", fulfillment: "周六指定场次到店参与", description: "花艺师讲解配色与结构，完成作品可直接带走，工具由门店提供。" },
      { id: "bay-group-tea", type: "group", badge: "3人团", name: "海景茶室双人品茗套餐", store: "汀岸茶事", spec: "茶品2泡＋茶点4款｜双人", price: "128", originalPrice: "198", sold: "已团112份", stock: 20, groupSize: 3, image: "/assets/images/pop-home/rooftop-music.jpg", fulfillment: "到店预约｜使用时长2小时", description: "可选凤凰单丛或白茶，搭配当日手作茶点，提供临窗海景座位。" }
    ],
    shopProducts: [
      { id: "bay-shop-aroma", type: "shop", badge: "湾岸限定", name: "晨光无火香薰礼盒", store: "湾岸生活美学馆", spec: "100ml香薰＋陶瓷扩香片", price: "188", originalPrice: "228", sold: "月售132件", stock: 33, image: "/assets/images/pop-home/coffee-lifestyle.jpg", fulfillment: "全国包邮｜礼盒防撞包装", description: "佛手柑、白茶与轻木香调，清爽柔和，礼盒内含手写祝福卡。" },
      { id: "bay-shop-mat", type: "shop", badge: "生活好物", name: "天然亚麻野餐垫", store: "SLOW DAY生活选物", spec: "140×180cm｜防潮底｜可机洗", price: "219", originalPrice: "269", sold: "月售76件", stock: 21, image: "/assets/images/pop-home/family-service.jpg", fulfillment: "顺丰包邮｜7天无理由", description: "亚麻混纺表层搭配轻薄防潮底，可折叠收纳为手提包形态。" },
      { id: "bay-shop-coffee", type: "shop", badge: "新鲜烘焙", name: "湾岸日晒精品咖啡豆", store: "MORNING TIDE", spec: "200g｜中浅烘｜莓果与可可风味", price: "88", originalPrice: "108", sold: "月售241件", stock: 58, image: "/assets/images/pop-home/coffee-lifestyle.jpg", fulfillment: "下单后48小时内新鲜烘焙", description: "埃塞俄比亚日晒咖啡豆，适合手冲与冷萃，可免费选择研磨度。" },
      { id: "bay-shop-vase", type: "shop", badge: "手作器物", name: "海砂肌理陶瓷花器", store: "湾岸手作集合店", spec: "高18cm｜手工拉坯｜米砂色", price: "149", originalPrice: "189", sold: "月售64件", stock: 17, image: "/assets/images/pop-home/art-festival.jpg", fulfillment: "专业防碎包装｜破损补发", description: "手工拉坯保留自然纹理，每件器形与釉色略有差异，可插鲜花或干枝。" },
      { id: "bay-shop-towel", type: "shop", badge: "亲肤系列", name: "有机棉海风浴巾", store: "NEST HOME", spec: "70×140cm｜480g｜雾蓝色", price: "129", originalPrice: "169", sold: "月售118件", stock: 45, image: "/assets/images/pop-home/mall-guide.jpg", fulfillment: "满99元包邮｜支持门店自提", description: "高克重有机棉织造，吸水快且触感蓬松，使用环保活性染色。" },
      { id: "bay-shop-notebook", type: "shop", badge: "书店精选", name: "海岸散步布面手账", store: "海岸艺术书店", spec: "A5｜192页｜方格内页", price: "68", originalPrice: "86", sold: "月售196件", stock: 70, image: "/assets/images/pop-home/art-bookshop.jpg", fulfillment: "当日发货｜满99元包邮", description: "布面精装与180度平摊装订，附湾岸路线贴纸和透明收纳袋。" }
    ]
  }
};

const PRIMARY_HERO_ACTIVITY = {
  coast: "architecture-tour",
  sunset: "design-market",
  garden: "morning-run"
};

Object.keys(MALL_HOME_CONFIGS).forEach((mallName) => {
  const config = MALL_HOME_CONFIGS[mallName];
  config.commerce = MALL_COMMERCE_CONFIGS[mallName];
  config.heroSlides = [
    {
      id: `${config.bannerTone}-main`,
      activityId: PRIMARY_HERO_ACTIVITY[config.bannerTone],
      tone: config.bannerTone,
      image: config.heroImage,
      eyebrow: config.eyebrow,
      title: config.heroTitle,
      ribbon: config.heroRibbon,
      date: config.heroDate,
      action: config.heroAction
    },
    {
      id: "rooftop-live",
      activityId: "sunset-live",
      tone: "sunset",
      image: "/assets/images/pop-home/hero-rooftop-live-v2.jpg",
      eyebrow: "音乐现场",
      title: "天台落日音乐会\n把晚风唱进夏天",
      ribbon: "会员专席开放",
      date: "07.25 18:30",
      action: "立即预约"
    },
    {
      id: "coastal-art",
      activityId: "coast-art",
      tone: "coast",
      image: "/assets/images/pop-home/hero-coastal-art-v2.jpg",
      eyebrow: "滨海艺术季",
      title: "海风里的当代艺术展",
      ribbon: "双人礼遇",
      date: "07.20 — 08.31",
      action: "预约观展"
    }
  ];
});

function buildHomeFeedState(config, visibleCount = 4) {
  const items = (config.feed || []).slice(0, visibleCount).map((item, index) => Object.assign({}, item, {
    delay: (index % 4) * 80
  }));
  return {
    homeFeedLeft: items.filter((item, index) => index % 2 === 0),
    homeFeedRight: items.filter((item, index) => index % 2 === 1),
    homeFeedVisibleCount: items.length,
    homeFeedHasMore: items.length < (config.feed || []).length
  };
}

const INITIAL_HOME_FEED_STATE = buildHomeFeedState(MALL_HOME_CONFIGS["海境艺术中心"]);

const PAGE_COMPONENT_GROUPS = [
  {
    name: "通用组件",
    items: [
      { name: "图文导航", icon: "导", selected: false },
      { name: "公告", icon: "告", selected: false },
      { name: "页签", icon: "签", selected: false },
      { name: "文本", icon: "文", selected: false },
      { name: "视频", icon: "视", selected: false },
      { name: "标题", icon: "题", selected: true },
      { name: "分隔占位", icon: "隔", selected: false },
      { name: "悬浮窗", icon: "浮", selected: false },
      { name: "主菜单", icon: "菜", selected: true },
      { name: "竖版Banner", icon: "竖", selected: false }
    ]
  },
  {
    name: "图片组件",
    items: [
      { name: "轮播", icon: "轮", selected: true },
      { name: "热区图", icon: "热", selected: false },
      { name: "单排图", icon: "图", selected: false },
      { name: "魔方图", icon: "方", selected: false }
    ]
  },
  {
    name: "商品",
    items: [
      { name: "商品列表", icon: "商", selected: true },
      { name: "专题推荐", icon: "专", selected: false }
    ]
  },
  {
    name: "店铺",
    items: [
      { name: "店铺列表", icon: "店", selected: false },
      { name: "精准化推荐", icon: "准", selected: false }
    ]
  },
  {
    name: "营销",
    items: [
      { name: "优惠券", icon: "券", selected: true },
      { name: "倒计时", icon: "时", selected: false },
      { name: "排行榜", icon: "榜", selected: false }
    ]
  },
  {
    name: "广告位组件",
    items: [
      { name: "分类页", icon: "分", selected: false }
    ]
  }
];

const DETAIL_LIBRARY = {
  birthday: {
    navTitle: "权益说明", eyebrow: "会员等级权益", title: "生日当月双倍积分",
    summary: "生日当月在参与活动的店铺消费，基础消费积分自动翻倍，无需手动领取。",
    rows: [
      { label: "生效时间", value: "生日所在自然月" },
      { label: "适用范围", value: "参与会员积分的线下店铺" },
      { label: "积分到账", value: "消费完成后24小时内" }
    ],
    note: "需提前在会员资料中完善生日；生日每年仅可修改一次。"
  },
  pointsRules: {
    navTitle: "积分规则", eyebrow: "POINTS GUIDE", title: "积分获取与使用规则",
    summary: "消费、活动签到和会员任务均可获得积分，积分可用于换礼、停车抵扣及会员卡券。",
    rows: [
      { label: "消费积分", value: "每消费1元积1分" },
      { label: "抵扣比例", value: "100积分约抵1元" },
      { label: "有效期", value: "到账次年12月31日" },
      { label: "小票补登", value: "消费后7日内提交" }
    ],
    note: "退款时相应积分会同步扣回；不同活动的加赠积分以活动详情为准。"
  },
  privacy: {
    navTitle: "隐私设置", eyebrow: "PRIVACY", title: "个人信息与授权管理",
    summary: "你可以查看本演示涉及的信息范围，并随时调整非必要授权。",
    rows: [
      { label: "手机号", value: "用于会员身份识别" },
      { label: "位置", value: "仅用于商场与导览推荐" },
      { label: "相册", value: "仅在上传小票或保存券码时使用" }
    ],
    note: "演示版不会向真实业务后台提交个人数据。"
  },
  about: {
    navTitle: "关于小程序", eyebrow: "DEMO VERSION", title: "商场会员小程序演示版",
    summary: "用于展示会员、卡券、活动、积分商城、到店服务与商户运营的完整交互。",
    rows: [
      { label: "当前版本", value: "2.1.47" },
      { label: "更新日期", value: "2026.07.21" },
      { label: "运行模式", value: "前端演示数据" }
    ],
    note: "本版本不连接正式会员、支付或核销后台。"
  },
  contentStats: {
    navTitle: "内容数据", eyebrow: "CONTENT INSIGHT", title: "本周内容触达与转化",
    summary: "从内容曝光到权益领取、活动报名的演示数据，用于呈现运营优化链路。",
    rows: [
      { label: "内容曝光", value: "12,800 · 较上周+18%" },
      { label: "内容点击率", value: "18.6% · 较上周+3.2%" },
      { label: "权益领取", value: "326次 · 转化率13.7%" },
      { label: "活动报名", value: "89人 · 转化率7.4%" }
    ],
    note: "可按商场、客群与内容类型进一步拆分查看。"
  },
  couponRules: {
    navTitle: "使用规则", eyebrow: "COUPON GUIDE", title: "卡券使用说明",
    summary: "到店结算前出示券码，由店员完成核销；部分卡券支持静态码离线使用。",
    rows: [
      { label: "适用门店", value: "卡券标注的参与门店" },
      { label: "使用次数", value: "单张券仅限核销一次" },
      { label: "叠加规则", value: "不可与同类优惠叠加" }
    ],
    note: "券码核销后即时失效，过期未使用不补发。"
  }
};

const MALL_PRODUCTS = [
  { name: "艺术展双人票", points: 2000, category: "卡券", image: "/assets/images/pop-home/art-festival.jpg" },
  { name: "精品咖啡礼券", points: 800, category: "美食", image: "/assets/images/pop-home/coffee-lifestyle.jpg" },
  { name: "免费停车2小时", points: 600, category: "停车", image: "/assets/images/pop-home/mall-guide.jpg" },
  { name: "设计师帆布袋", points: 3600, category: "好物", image: "/assets/images/pop-home/family-service.jpg" },
  { name: "艺术书廊阅读礼", points: 1200, category: "好物", image: "/assets/images/pop-home/art-bookshop.jpg" },
  { name: "海景下午茶礼券", points: 1600, category: "美食", image: "/assets/images/pop-home/rooftop-music.jpg" }
];

const PLATE_PROVINCES = ["粤", "京", "沪", "浙", "苏", "川", "渝", "湘", "鄂", "鲁", "闽", "桂", "琼"];

function buildVehicleForm(province = "粤", cityCode = "B", number = "", type = "燃油车") {
  const cleanProvince = PLATE_PROVINCES.includes(province) ? province : "粤";
  const cleanCityCode = String(cityCode || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
  const maxLength = type === "新能源" ? 6 : 5;
  const cleanNumber = String(number || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, maxLength);
  return {
    vehicleProvince: cleanProvince,
    vehicleProvinceIndex: Math.max(0, PLATE_PROVINCES.indexOf(cleanProvince)),
    vehicleCityCode: cleanCityCode,
    vehicleNumber: cleanNumber,
    vehicleNumberMaxLength: maxLength,
    vehiclePlateSlots: Array.from({ length: maxLength }, (_, index) => ({ key: `slot-${index}`, value: cleanNumber[index] || "" })),
    vehicleFormPlate: `${cleanProvince}${cleanCityCode}·${cleanNumber}`,
    vehicleFormType: type,
    vehicleFormValid: Boolean(cleanCityCode && cleanNumber.length === maxLength)
  };
}

function parseVehicleForm(plate, type) {
  const compact = String(plate || "").toUpperCase().replace(/[·\s]/g, "");
  return buildVehicleForm(compact[0] || "粤", compact[1] || "B", compact.slice(2), type || "燃油车");
}

Page({
  data: Object.assign({}, INITIAL_HOME_FEED_STATE, INITIAL_CONTENT_STATE, buildVehicleForm("粤", "B", "", "燃油车"), {
    currentView: "home",
    viewTitle: "",
    statusBarHeight: 44,
    showBottom: true,
    bottomActive: "home",
    leaving: false,
    viewStack: [],
    mallName: "海境艺术中心",
    selectedMall: "海境艺术中心",
    mallSheetOpen: false,
    mallWelcomeAdOpen: false,
    mallWelcomeAdAccepted: false,
    selectedMallDetail: "海境艺术中心",
    homeRefreshing: false,
    heroCurrent: 0,
    homeConfig: MALL_HOME_CONFIGS["海境艺术中心"],
    homeFeedLoading: false,
    contentFilters: ["推荐", "专题", "品牌故事", "商场资讯", "活动攻略", "服务推荐"],
    contents: CONTENT_ITEMS,
    selectedContent: CONTENT_ITEMS[0],
    contentOpsMetrics: [
      { label: "内容曝光", value: "12.8K", trend: "+18%" },
      { label: "点击率", value: "18.6%", trend: "+3.2%" },
      { label: "权益领取", value: "326", trend: "+42" },
      { label: "活动报名", value: "89", trend: "+16" }
    ],
    contentSchedule: [
      { title: "海滨艺术一日攻略", audience: "星艺卡会员", status: "已发布", time: "今日 10:00", tone: "live" },
      { title: "天台落日音乐会观演指南", audience: "活动兴趣客群", status: "定时发布", time: "07.25 10:00", tone: "scheduled" }
    ],
    malls: [
      {
        name: "海境艺术中心", initial: "海", note: "滨海艺术 · 沉浸展览", tone: "coast", eyebrow: "滨海艺术地标",
        image: "/assets/images/pop-home/art-festival.jpg", location: "南山区 · 海境路88号", hours: "10:00—22:00", distance: "距你 1.2km",
        tags: ["当代艺术", "海景空间", "会员专场"], eventTitle: "海风入境 · 夏日艺术漫游", eventNote: "即日起至8月31日 · 会员优先预约",
        benefit: "星艺卡会员展览双人票8折", service: "艺术导览 · 停车 · 礼宾",
        stats: [{ value: "6场", label: "本月活动" }, { value: "12张", label: "会员券" }, { value: "86家", label: "精选店铺" }]
      },
      {
        name: "云庭城市广场", initial: "云", note: "城市社交 · 潮流活动", tone: "sunset", eyebrow: "城市潮流会客厅",
        image: "/assets/images/pop-home/rooftop-music.jpg", location: "福田区 · 云庭大道16号", hours: "10:00—22:30", distance: "距你 5.8km",
        tags: ["潮流首店", "天台花园", "亲子友好"], eventTitle: "天台落日音乐会", eventNote: "本周六18:30 · 乐游卡会员专席",
        benefit: "周末餐饮满300减80", service: "亲子空间 · 客服 · 停车",
        stats: [{ value: "8场", label: "本月活动" }, { value: "16张", label: "会员券" }, { value: "128家", label: "精选店铺" }]
      },
      {
        name: "湾岸生活馆", initial: "湾", note: "生活美学 · 松弛体验", tone: "garden", eyebrow: "湾岸生活目的地",
        image: "/assets/images/pop-home/coffee-lifestyle.jpg", location: "宝安区 · 湾岸路6号", hours: "09:30—22:00", distance: "距你 9.6km",
        tags: ["生活美学", "晨光咖啡", "宠物友好"], eventTitle: "晨光咖啡与海岸慢跑", eventNote: "每周日08:00 · 到店领取能量补给",
        benefit: "晨间早餐组合立减20", service: "海岸导览 · 借用 · 停车",
        stats: [{ value: "5场", label: "本月活动" }, { value: "10张", label: "会员券" }, { value: "72家", label: "精选店铺" }]
      }
    ],
    points: 12800,
    pointCash: 128,
    couponTab: "可领取",
    availableCoupons: AVAILABLE_COUPONS,
    ownedCoupons: OWNED_COUPONS,
    availableCouponCount: AVAILABLE_COUPONS.length,
    ownedCouponCount: OWNED_COUPONS.length,
    selectedCoupon: OWNED_COUPONS[0],
    codeMode: "动态码",
    exchangeCouponMode: false,
    rewardPoints: 1200,
    rewardCash: "48.00",
    rewardPayment: "微信支付",
    floor: "L1",
    searchValue: "艺术展览",
    searchFilter: "全部",
    scanning: false,
    parkingPaid: false,
    parkingPayment: "微信支付",
    selectedParkingPlate: "粤B·A6688",
    invoiceTitle: "陈女士",
    invoiceEmail: "chen@example.com",
    invoiceSubmitted: false,
    agreementChecked: true,
    coffeeBenefitClaimed: false,
    storeOfferClaimed: false,
    pointsTab: "明细",
    selectedTransaction: null,
    couponWalletFilter: "可使用",
    usedCoupons: [
      { id: "used-coffee", title: "精品咖啡升杯券", note: "海岸咖啡已核销", expiry: "2026.07.18", image: "/assets/images/pop-home/coffee-lifestyle.jpg", statusLabel: "已使用", code: "2088 6631 5020", owned: true }
    ],
    expiredCoupons: [
      { id: "expired-show", title: "春季艺术展礼券", note: "有效期已结束", expiry: "2026.06.30", image: "/assets/images/pop-home/art-festival.jpg", statusLabel: "已过期", code: "3106 8820 0915", owned: true }
    ],
    guideMode: "默认",
    facilityFilter: "全部",
    activityJoined: false,
    activityReminder: false,
    activityCredential: "",
    activityFilter: "全部",
    activityFilters: ["全部", "报名中", "即将开始", "已结束"],
    activities: ACTIVITY_ITEMS,
    visibleActivities: ACTIVITY_ITEMS,
    selectedActivity: ACTIVITY_ITEMS[0],
    selectedDate: "7月26日 周日",
    mallTab: "好物",
    selectedCommerceProduct: MALL_COMMERCE_CONFIGS["海境艺术中心"].groupBuys[0],
    commerceQuantity: 1,
    commerceOrderStatus: "",
    commerceCartCount: 0,
    exchangeOpen: false,
    exchangeProduct: null,
    cartCount: 1,
    cartItems: [
      { name: "设计师帆布袋", points: 1800, cash: 39, qty: 1, image: "/assets/images/pop-home/family-service.jpg" }
    ],
    cartTotalPoints: 1800,
    cartTotalCash: "39.00",
    checkoutMaxPoints: 1800,
    checkoutPoints: 1800,
    checkoutCash: "39.00",
    checkoutPayment: "微信支付",
    orderNumber: "",
    addressName: "陈女士",
    addressPhone: "138 6688 8866",
    addressDetail: "深圳市南山区海境路88号 8栋1206",
    memberBirthday: "1992-08-18",
    memberGender: "女",
    memberPhone: "13866888866",
    inviteCode: "ART1288",
    invitedCount: 2,
    invitePoints: 600,
    cacheSize: "12.8MB",
    infoDetail: DETAIL_LIBRARY.pointsRules,
    inviteRecords: [
      { name: "林女士", initial: "林", time: "07-18 14:20", status: "已注册", points: "+300" },
      { name: "周先生", initial: "周", time: "07-16 09:35", status: "已注册", points: "+300" },
      { name: "好友邀请", initial: "友", time: "07-20 20:10", status: "待注册", points: "待入账" }
    ],
    pageComponentGroups: PAGE_COMPONENT_GROUPS,
    selectedComponents: ["标题", "主菜单", "轮播", "商品列表", "优惠券"],
    vehicles: [
      { plate: "粤B·A6688", type: "燃油车", primary: true },
      { plate: "粤B·D88888", type: "新能源", primary: false },
      { plate: "粤B·F20666", type: "新能源", primary: false }
    ],
    vehicleEditIndex: -1,
    plateProvinces: PLATE_PROVINCES,
    merchantPanel: "home",
    merchantProfileCompletion: 86,
    merchantPendingCount: 3,
    merchantBrandName: "艺术书廊",
    merchantDescription: "精选设计、艺术与城市文化读物，让灵感成为日常的一部分。",
    merchantHours: "10:00 - 22:00",
    merchantPhone: "138 0000 0000",
    merchantAddress: "商场A区1层 A118",
    merchantNewsTitle: "夏日新品即刻上架",
    merchantNewsContent: "输入新品亮点、活动信息及门店服务内容",
    merchantNewsAudience: "全部会员",
    merchantCover: "/assets/images/pop-home/family-service.jpg",
    merchantMarketingType: "优惠券",
    merchantMarketingTypes: ["优惠券", "会员活动", "首页推荐"],
    merchantMarketingTitle: "夏日艺术好物会员礼遇",
    merchantMarketingNote: "面向当前会员等级发放限量到店礼遇，带动新品关注与门店到访。",
    merchantApprovalFilter: "全部",
    merchantApprovalFilters: ["全部", "审核中", "已通过", "待修改"],
    merchantImageCount: 3,
    merchantVideoCount: 1,
    merchantApprovals: [
      { type: "新品快讯", title: "夏日新品即刻上架", time: "07-18 14:30", status: "审核中", tone: "review", note: "正在审核，请耐心等待" },
      { type: "资料维护", title: "店铺资料更新", time: "07-16 10:08", status: "已通过", tone: "approved", note: "已完成资料同步" },
      { type: "营销申请", title: "至臻好物会员礼遇", time: "07-14 16:21", status: "待修改", tone: "revise", note: "请补充活动素材" }
    ],
    chatInput: "",
    chatMessages: [
      { side: "service", text: "您好，我是艺术中心会员客服，请问有什么可以帮您？", time: "14:20" },
      { side: "user", text: "请问今天的艺术展几点结束？", time: "14:21" },
      { side: "service", text: "展览开放至21:30，建议您提前30分钟入场。", time: "14:21" }
    ],
    borrowItems: [
      { name: "婴儿车", icon: "婴", stock: 6, note: "适合6个月至3岁" },
      { name: "轮椅", icon: "轮", stock: 3, note: "礼宾台凭证借用" },
      { name: "充电宝", icon: "电", stock: 12, note: "支持多种接口" },
      { name: "雨伞", icon: "伞", stock: 8, note: "雨天免费借用" }
    ],
    loanRecords: [],
    qrCells: buildDemoQr("member-88886688"),
    miniQrCells: MINI_QR_CELLS,
    transactions: [
      { icon: "袋", title: "消费积分", date: "07-18 14:32", value: "+268", positive: true },
      { icon: "星", title: "活动奖励", date: "07-15 10:20", value: "+100", positive: true },
      { icon: "礼", title: "积分兑换", date: "07-12 18:05", value: "-500", positive: false },
      { icon: "停", title: "停车抵扣", date: "07-10 09:41", value: "-200", positive: false }
    ],
    allProducts: MALL_PRODUCTS,
    products: MALL_PRODUCTS.filter((item) => item.category === "好物")
  }),

  onLoad(options = {}) {
    const app = getApp();
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const requestedView = options.view || app.globalData.entryView;
    const initialView = VIEW_META[requestedView] ? requestedView : "home";
    app.globalData.entryView = "";
    const initialState = { statusBarHeight: windowInfo.statusBarHeight || 44 };
    if (options.activityId) {
      const activity = ACTIVITY_ITEMS.find((item) => item.id === options.activityId);
      if (activity) Object.assign(initialState, { selectedActivity: activity, selectedDate: activity.dates[0] || "", activityJoined: activity.joined });
    }
    if (options.contentId) {
      const content = CONTENT_ITEMS.find((item) => item.id === options.contentId);
      if (content) initialState.selectedContent = content;
    }
    this.setData(initialState);
    this.syncView(initialView, []);
  },

  onShareAppMessage() {
    if (this.data.currentView === "activity" || this.data.currentView === "activityPass") {
      const activity = this.data.selectedActivity;
      return {
        title: `${activity.title}｜一起参加吧`,
        path: `/pages/demo/demo?view=activity&activityId=${activity.id}`,
        imageUrl: activity.image
      };
    }
    if (this.data.currentView === "contentDetail") {
      const content = this.data.selectedContent;
      return {
        title: content.title,
        path: `/pages/demo/demo?view=contentDetail&contentId=${content.id}`,
        imageUrl: content.image
      };
    }
    if (this.data.currentView === "inviteActivity") {
      return {
        title: "好友同行计划｜注册会员得积分",
        path: `/pages/demo/demo?view=inviteActivity&invite=${this.data.inviteCode}`,
        imageUrl: "/assets/images/pop-home/art-festival.jpg"
      };
    }
    return { title: `${this.data.mallName}会员礼遇`, path: "/pages/demo/demo?view=home" };
  },

  onShareTimeline() {
    const shared = this.onShareAppMessage();
    return { title: shared.title, query: shared.path.split("?")[1] || "view=home", imageUrl: shared.imageUrl };
  },

  syncView(target, stack) {
    const meta = VIEW_META[target] || VIEW_META.home;
    this.setData({
      currentView: target,
      viewTitle: target === "infoDetail" ? (this.data.infoDetail.navTitle || "详情") : meta.title,
      showBottom: meta.showBottom,
      bottomActive: meta.bottom,
      viewStack: stack,
      leaving: false
    });
    if (this._viewReady) {
      wx.pageScrollTo({ scrollTop: 0, duration: 0, fail: () => {} });
    }
    this._viewReady = true;
  },

  navigate(event) {
    const target = event.currentTarget.dataset.target;
    if (!target || target === this.data.currentView || !VIEW_META[target]) {
      this.tapFeedback(event);
      return;
    }
    const nextStack = this.data.viewStack.concat(this.data.currentView);
    const nextData = { leaving: true };
    if (event.currentTarget.dataset.couponTab) {
      nextData.couponTab = event.currentTarget.dataset.couponTab;
      if (nextData.couponTab === "我的卡券") nextData.couponWalletFilter = "可使用";
    }
    this.setData(nextData);
    setTimeout(() => this.syncView(target, nextStack), 110);
  },

  switchBottom(event) {
    const target = event.currentTarget.dataset.target;
    if (!target) return;
    this.setData({ leaving: true });
    setTimeout(() => this.syncView(target, []), 100);
  },

  goBack() {
    if (this.data.currentView === "merchantManage" && this.data.merchantPanel !== "home") {
      this.setData({ merchantPanel: "home" });
      wx.pageScrollTo({ scrollTop: 0, duration: 160, fail: () => {} });
      return;
    }
    const stack = this.data.viewStack.slice();
    const target = stack.pop() || "home";
    this.setData({ leaving: true });
    setTimeout(() => this.syncView(target, stack), 100);
  },

  tapFeedback(event) {
    const text = event.currentTarget.dataset.feedback || "演示功能已响应";
    wx.showToast({ title: text, icon: "none", duration: 1100 });
  },

  openInfoDetail(event) {
    const key = event.currentTarget.dataset.detail;
    let detail = DETAIL_LIBRARY[key];
    if (key === "transaction") {
      const transaction = this.data.transactions[Number(event.currentTarget.dataset.index)] || this.data.transactions[0];
      detail = {
        navTitle: "积分详情", eyebrow: "POINTS RECORD", title: transaction.title,
        summary: transaction.positive ? "本笔积分已入账，可用于积分商城、卡券换领及停车抵扣。" : "本笔积分已完成扣减，可在对应业务记录中查看使用结果。",
        rows: [
          { label: "积分变动", value: transaction.value + "积分" },
          { label: "发生时间", value: transaction.date },
          { label: "交易状态", value: "已完成" },
          { label: "流水号", value: `JF202607${Number(event.currentTarget.dataset.index) + 1801}` }
        ],
        note: "如对记录有疑问，可从会员服务进入在线客服。"
      };
    }
    if (key === "couponStatus") {
      detail = {
        navTitle: "卡券状态", eyebrow: "COUPON STATUS", title: this.data.selectedCoupon.statusLabel,
        summary: `${this.data.selectedCoupon.title}已进入会员卡包，可在有效期内到店出示二维码使用。`,
        rows: [
          { label: "有效期至", value: this.data.selectedCoupon.expiry },
          { label: "券码", value: this.data.selectedCoupon.code },
          { label: "核销状态", value: "尚未核销" }
        ],
        note: "动态码会定时更新；网络不佳时可切换静态码。"
      };
    }
    if (key === "couponRecords") {
      detail = {
        navTitle: "使用记录", eyebrow: "USAGE RECORD", title: "暂无核销记录",
        summary: "此卡券尚未使用。完成到店核销后，门店、时间与核销流水会显示在这里。",
        rows: [{ label: "卡券名称", value: this.data.selectedCoupon.title }, { label: "当前状态", value: this.data.selectedCoupon.statusLabel }],
        note: "核销记录由门店确认后生成。"
      };
    }
    if (key === "merchantApproval") {
      const approval = this.data.merchantApprovals[Number(event.currentTarget.dataset.index)] || this.data.merchantApprovals[0];
      detail = {
        navTitle: "审批详情", eyebrow: approval.type, title: approval.title, summary: approval.note,
        rows: [
          { label: "提交时间", value: approval.time },
          { label: "当前状态", value: approval.status },
          { label: "审批节点", value: approval.status === "已通过" ? "内容已同步上线" : "商场运营审核" }
        ],
        note: approval.status === "待修改" ? "请补充活动素材后重新提交。" : "状态变化后会通过消息中心通知。"
      };
    }
    if (!detail) return;
    this.setData({ infoDetail: detail });
    this.syncView("infoDetail", this.data.viewStack.concat(this.data.currentView));
  },

  toggleAgreement() {
    this.setData({ agreementChecked: !this.data.agreementChecked });
  },

  claimCoffeeBenefit() {
    if (this.data.coffeeBenefitClaimed) {
      this.setData({ couponTab: "我的卡券" });
      this.syncView("coupons", this.data.viewStack.concat(this.data.currentView));
      return;
    }
    const coupon = {
      id: "monthly-coffee", title: "会员咖啡买一赠一", note: "指定品牌门店可用", expiry: "2026.08.31",
      image: "/assets/images/pop-home/coffee-lifestyle.jpg", stock: 1, statusLabel: "可使用", code: "6688 2031 7720", owned: true
    };
    const ownedCoupons = [coupon].concat(this.data.ownedCoupons);
    this.setData({ coffeeBenefitClaimed: true, ownedCoupons, ownedCouponCount: ownedCoupons.length });
    wx.showToast({ title: "已放入卡包", icon: "success" });
  },

  setPointsTab(event) {
    this.setData({ pointsTab: event.currentTarget.dataset.tab });
  },

  setCouponWalletFilter(event) {
    this.setData({ couponWalletFilter: event.currentTarget.dataset.filter });
  },

  setGuideMode(event) {
    const mode = event.currentTarget.dataset.mode;
    this.setData({ guideMode: mode });
    if (mode === "重置") this.setData({ floor: "L1", facilityFilter: "全部", guideMode: "默认" });
  },

  setFacilityFilter(event) {
    this.setData({ facilityFilter: event.currentTarget.dataset.facility, guideMode: "设施" });
  },

  claimStoreOffer() {
    if (this.data.storeOfferClaimed) {
      this.setData({ couponTab: "我的卡券" });
      this.syncView("coupons", this.data.viewStack.concat(this.data.currentView));
      return;
    }
    const coupon = {
      id: "store-200-50", title: "艺术书廊满200减50券", note: "艺术书廊到店可用", expiry: "2026.08.31",
      image: "/assets/images/pop-home/art-bookshop.jpg", stock: 1, statusLabel: "可使用", code: "8820 6671 2055", owned: true
    };
    const ownedCoupons = [coupon].concat(this.data.ownedCoupons);
    this.setData({ storeOfferClaimed: true, ownedCoupons, ownedCouponCount: ownedCoupons.length });
    wx.showToast({ title: "领取成功", icon: "success" });
  },

  callStore() {
    wx.showModal({
      title: "联系艺术书廊", content: "0755-8888 6688", confirmText: "拨打电话",
      success: (result) => { if (result.confirm) wx.makePhoneCall({ phoneNumber: "075588886688", fail: () => {} }); }
    });
  },

  chooseParkingPlate() {
    const plates = this.data.vehicles.map((item) => `${item.plate}${item.type === "新能源" ? " · 新能源" : ""}`);
    wx.showActionSheet({
      itemList: plates,
      success: (result) => this.setData({ selectedParkingPlate: this.data.vehicles[result.tapIndex].plate })
    });
  },

  chooseParkingPayment() {
    wx.showActionSheet({
      itemList: ["微信支付", "到店支付"],
      success: (result) => this.setData({ parkingPayment: result.tapIndex === 0 ? "微信支付" : "到店支付" })
    });
  },

  openMallSheet() {
    this.setData({ mallSheetOpen: true, selectedMall: this.data.mallName });
  },

  closeMallSheet() {
    this.setData({ mallSheetOpen: false });
  },

  openMallCollection(event) {
    const selectedMallDetail = event.currentTarget.dataset.mall || this.data.mallName;
    const nextStack = this.data.viewStack.concat(this.data.currentView);
    this.setData({ mallSheetOpen: false, selectedMallDetail, leaving: true });
    setTimeout(() => this.syncView("mallCollection", nextStack), 110);
  },

  stopBubble() {},

  selectMall(event) {
    this.setData({ selectedMall: event.currentTarget.dataset.mall });
  },

  confirmMall() {
    const mallName = this.data.selectedMall;
    if (mallName === this.data.mallName) {
      this.setData({ mallSheetOpen: false });
      wx.showToast({ title: "当前已是该商场", icon: "none" });
      return;
    }
    const homeConfig = MALL_HOME_CONFIGS[mallName] || MALL_HOME_CONFIGS["海境艺术中心"];
    const feedState = buildHomeFeedState(homeConfig);
    const contentState = buildContentState(mallName);
    this.setData({ mallSheetOpen: false, homeRefreshing: true });
    setTimeout(() => {
      const mallWelcomeAdOpen = this.shouldShowMallWelcomeAd(mallName);
      this.setData(Object.assign({ mallName, homeConfig, heroCurrent: 0, mallWelcomeAdOpen, homeRefreshing: false, homeFeedLoading: false, selectedContent: contentState.featuredContent }, feedState, contentState));
      if (mallWelcomeAdOpen) this.syncView("home", []);
      wx.pageScrollTo({ scrollTop: 0, duration: 280, fail: () => {} });
      if (!mallWelcomeAdOpen) wx.showToast({ title: `已切换至${mallName}`, icon: "none" });
    }, 140);
  },

  enterMallFromCollection(event) {
    const mallName = event.currentTarget.dataset.mall;
    if (!mallName) return;
    const homeConfig = MALL_HOME_CONFIGS[mallName] || MALL_HOME_CONFIGS["海境艺术中心"];
    const feedState = buildHomeFeedState(homeConfig);
    const contentState = buildContentState(mallName);
    this.setData({ selectedMall: mallName, selectedMallDetail: mallName, homeRefreshing: true, leaving: true });
    setTimeout(() => {
      const mallWelcomeAdOpen = this.shouldShowMallWelcomeAd(mallName);
      this.setData(Object.assign({ mallName, homeConfig, heroCurrent: 0, mallWelcomeAdOpen, homeRefreshing: false, homeFeedLoading: false, selectedContent: contentState.featuredContent }, feedState, contentState));
      this.syncView("home", []);
      if (!mallWelcomeAdOpen) wx.showToast({ title: `已进入${mallName}`, icon: "none" });
    }, 180);
  },

  shouldShowMallWelcomeAd(mallName) {
    if (mallName !== "云庭城市广场") return false;
    this._mallWelcomeAdSeen = this._mallWelcomeAdSeen || {};
    return !this._mallWelcomeAdSeen[mallName];
  },

  finishMallWelcomeAd(accepted) {
    this._mallWelcomeAdSeen = this._mallWelcomeAdSeen || {};
    this._mallWelcomeAdSeen["云庭城市广场"] = true;
    this.setData({ mallWelcomeAdOpen: false, mallWelcomeAdAccepted: Boolean(accepted) });
    wx.showToast({ title: accepted ? "活动提醒已开启" : "已进入云庭城市广场", icon: "none" });
  },

  acceptMallWelcomeAd() {
    this.finishMallWelcomeAd(true);
  },

  closeMallWelcomeAd() {
    this.finishMallWelcomeAd(false);
  },

  onReachBottom() {
    if (this.data.currentView === "home") this.loadMoreHomeFeed();
  },

  loadMoreHomeFeed() {
    if (this.data.currentView !== "home" || this.data.homeFeedLoading || !this.data.homeFeedHasMore) {
      if (this.data.currentView === "home" && !this.data.homeFeedHasMore) {
        wx.showToast({ title: "更多灵感正在准备中", icon: "none" });
      }
      return;
    }
    this.setData({ homeFeedLoading: true });
    setTimeout(() => {
      const feedState = buildHomeFeedState(this.data.homeConfig, this.data.homeFeedVisibleCount + 2);
      this.setData(Object.assign({}, feedState, { homeFeedLoading: false }));
    }, 520);
  },

  copyInviteCode() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success: () => wx.showToast({ title: "邀请码已复制", icon: "success" })
    });
  },

  shareInvite() {
    wx.showLoading({ title: "生成邀请卡", mask: true });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: "邀请卡已生成，可分享给好友", icon: "none", duration: 1600 });
    }, 650);
  },

  loginSuccess() {
    if (!this.data.agreementChecked) {
      wx.showToast({ title: "请先同意服务协议", icon: "none" });
      return;
    }
    wx.showLoading({ title: "正在登录", mask: true });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: "登录成功", icon: "success" });
      this.syncView("card", ["home"]);
    }, 700);
  },

  setCouponTab(event) {
    this.setData({ couponTab: event.currentTarget.dataset.tab });
  },

  openCoupon(event) {
    const source = event.currentTarget.dataset.source || "owned";
    const index = Number(event.currentTarget.dataset.index || 0);
    const coupons = source === "available" ? this.data.availableCoupons : this.data.ownedCoupons;
    const selectedCoupon = coupons[index] || coupons[0];
    this.setData({
      selectedCoupon,
      codeMode: "动态码",
      qrCells: buildDemoQr(`${selectedCoupon.id}-${Date.now()}`)
    });
    this.syncView("couponDetail", this.data.viewStack.concat(this.data.currentView));
  },

  claimCoupon() {
    const coupon = this.data.selectedCoupon;
    if (!coupon || coupon.owned) return;
    if (coupon.method === "积分+现金") {
      this.setData({ exchangeCouponMode: true });
      this.syncView("rewardExchange", this.data.viewStack.concat("couponDetail"));
      return;
    }
    if (coupon.pointCost > this.data.points) {
      wx.showToast({ title: "积分不足", icon: "none" });
      return;
    }
    this.moveCouponToWallet(coupon, coupon.pointCost || 0);
  },

  moveCouponToWallet(coupon, spentPoints = 0) {
    const availableCoupons = this.data.availableCoupons.filter((item) => item.id !== coupon.id);
    const ownedCoupon = Object.assign({}, coupon, {
      owned: true,
      stock: 1,
      statusLabel: "可使用",
      code: `${Date.now()}`.slice(-12).replace(/(.{4})/g, "$1 ").trim()
    });
    const ownedCoupons = [ownedCoupon].concat(this.data.ownedCoupons);
    const points = this.data.points - spentPoints;
    this.setData({
      availableCoupons,
      ownedCoupons,
      availableCouponCount: availableCoupons.length,
      ownedCouponCount: ownedCoupons.length,
      couponTab: "我的卡券",
      selectedCoupon: ownedCoupon,
      points,
      pointCash: Math.floor(points / 100),
      exchangeCouponMode: false,
      qrCells: buildDemoQr(ownedCoupon.code)
    });
    wx.showToast({ title: "领取成功，已放入卡包", icon: "success" });
    setTimeout(() => this.syncView("coupons", []), 650);
  },

  setCodeMode(event) {
    const codeMode = event.currentTarget.dataset.mode;
    const seed = codeMode === "动态码" ? `${this.data.selectedCoupon.code}-${Date.now()}` : this.data.selectedCoupon.code;
    this.setData({ codeMode, qrCells: buildDemoQr(seed) });
  },

  saveLongCode() {
    this.setData({
      infoDetail: {
        navTitle: "离线券码", eyebrow: "OFFLINE CODE", title: "长效券码已生成",
        summary: "弱网环境下可打开此页面出示长效券码，也可复制券码备用。",
        rows: [
          { label: "卡券", value: this.data.selectedCoupon.title },
          { label: "券码", value: this.data.selectedCoupon.code },
          { label: "有效期至", value: this.data.selectedCoupon.expiry }
        ],
        note: "长效码只适用于当前卡券，请勿转发给他人。"
      }
    });
    this.syncView("infoDetail", this.data.viewStack.concat(this.data.currentView));
  },

  changeRewardPoints(event) {
    const rewardPoints = Number(event.detail.value);
    const rewardCash = Math.max(0, 60 - rewardPoints / 100).toFixed(2);
    this.setData({ rewardPoints, rewardCash });
  },

  setRewardPayment(event) {
    this.setData({ rewardPayment: event.currentTarget.dataset.payment });
  },

  confirmRewardExchange() {
    const title = this.data.rewardPayment === "微信支付" ? "微信支付演示已完成" : "订单已生成，到店支付余款";
    wx.showToast({ title, icon: "none", duration: 1600 });
    if (this.data.exchangeCouponMode) {
      setTimeout(() => this.moveCouponToWallet(this.data.selectedCoupon, this.data.rewardPoints), 450);
    }
  },

  setFloor(event) {
    const floor = event.currentTarget.dataset.floor;
    this.setData({ floor });
    wx.showToast({ title: `已切换至${floor}`, icon: "none", duration: 800 });
  },

  onSearchInput(event) {
    this.setData({ searchValue: event.detail.value });
  },

  setSearch(event) {
    this.setData({ searchValue: event.currentTarget.dataset.value });
  },

  setSearchFilter(event) {
    this.setData({ searchFilter: event.currentTarget.dataset.filter });
  },

  startScan() {
    if (this.data.scanning) return;
    this.setData({ scanning: true });
    wx.showLoading({ title: "正在识别", mask: true });
    setTimeout(() => {
      wx.hideLoading();
      this.setData({ scanning: false });
      this.syncView("receiptResult", this.data.viewStack.concat("receipt"));
    }, 1100);
  },

  confirmReceipt() {
    const transactions = [{ icon: "审", title: "小票积分审核中", date: "刚刚提交", value: "+268", positive: true }].concat(this.data.transactions);
    this.setData({ transactions, pointsTab: "明细" });
    wx.showToast({ title: "已提交审核", icon: "success" });
    setTimeout(() => this.syncView("points", []), 600);
  },

  payParking() {
    if (this.data.parkingPaid) {
      wx.showToast({ title: "本次停车已支付", icon: "none" });
      return;
    }
    wx.showLoading({ title: "支付处理中", mask: true });
    setTimeout(() => {
      wx.hideLoading();
      this.setData({ parkingPaid: true });
      wx.showToast({ title: "支付成功", icon: "success" });
    }, 850);
  },

  chooseDate(event) {
    this.setData({ selectedDate: event.currentTarget.dataset.date });
  },

  setContentFilter(event) {
    const contentFilter = event.currentTarget.dataset.filter;
    const contentState = buildContentState(this.data.mallName, contentFilter);
    this.setData(contentState);
  },

  openContent(event) {
    const content = this.data.contents.find((item) => item.id === event.currentTarget.dataset.id);
    if (!content) {
      wx.showToast({ title: "内容正在准备中", icon: "none" });
      return;
    }
    const nextStack = this.data.viewStack.concat(this.data.currentView);
    this.setData({ selectedContent: content, leaving: true });
    setTimeout(() => this.syncView("contentDetail", nextStack), 110);
  },

  setActivityFilter(event) {
    const activityFilter = event.currentTarget.dataset.filter;
    const visibleActivities = activityFilter === "全部"
      ? this.data.activities
      : this.data.activities.filter((item) => item.status === activityFilter);
    this.setData({ activityFilter, visibleActivities });
  },

  openActivity(event) {
    const activity = this.data.activities.find((item) => item.id === event.currentTarget.dataset.id);
    if (!activity) {
      wx.showToast({ title: "活动信息正在准备中", icon: "none" });
      return;
    }
    const nextStack = this.data.viewStack.concat(this.data.currentView);
    this.setData({
      selectedActivity: activity,
      selectedDate: activity.dates[0] || "",
      activityJoined: activity.joined,
      leaving: true
    });
    setTimeout(() => this.syncView("activity", nextStack), 110);
  },

  onHeroChange(event) {
    this.setData({ heroCurrent: event.detail.current });
  },

  openHeroSlide(event) {
    const activityId = event.currentTarget.dataset.id;
    if (!activityId) {
      this.syncView("activityList", this.data.viewStack.concat(this.data.currentView));
      return;
    }
    this.openActivity({ currentTarget: { dataset: { id: activityId } } });
  },

  joinActivity() {
    if (this.data.selectedActivity.status === "已结束") {
      this.syncView("activityRecap", this.data.viewStack.concat(this.data.currentView));
      return;
    }
    if (this.data.selectedActivity.status === "即将开始") {
      this.setData({ activityReminder: !this.data.activityReminder });
      wx.showToast({ title: this.data.activityReminder ? "提醒已开启" : "提醒已关闭", icon: "success" });
      return;
    }
    if (this.data.activityJoined) {
      this.syncView("activityPass", this.data.viewStack.concat(this.data.currentView));
      return;
    }
    const activities = this.data.activities.map((item) => item.id === this.data.selectedActivity.id ? Object.assign({}, item, { joined: true }) : item);
    const visibleActivities = this.data.activityFilter === "全部" ? activities : activities.filter((item) => item.status === this.data.activityFilter);
    this.setData({
      activityJoined: true,
      activityCredential: `HD${Date.now()}`.slice(-12),
      selectedActivity: Object.assign({}, this.data.selectedActivity, { joined: true }),
      activities,
      visibleActivities
    });
    wx.showToast({ title: "报名成功", icon: "success" });
    setTimeout(() => this.syncView("activityPass", this.data.viewStack.concat(this.data.currentView)), 520);
  },

  setMallTab(event) {
    const mallTab = event.currentTarget.dataset.tab;
    this.setData({ mallTab, products: this.data.allProducts.filter((item) => item.category === mallTab) });
  },

  openCommerceProduct(event) {
    const type = event.currentTarget.dataset.type;
    const index = Number(event.currentTarget.dataset.index);
    const list = type === "shop" ? this.data.homeConfig.commerce.shopProducts : this.data.homeConfig.commerce.groupBuys;
    const selectedCommerceProduct = list[index];
    if (!selectedCommerceProduct) {
      this.tapFeedback(event);
      return;
    }
    const nextStack = this.data.viewStack.concat(this.data.currentView);
    this.setData({ selectedCommerceProduct, commerceQuantity: 1, commerceOrderStatus: "", leaving: true });
    setTimeout(() => this.syncView("commerceProduct", nextStack), 110);
  },

  changeCommerceQuantity(event) {
    const delta = Number(event.currentTarget.dataset.delta);
    const max = Math.min(9, Number(this.data.selectedCommerceProduct.stock || 9));
    this.setData({ commerceQuantity: Math.max(1, Math.min(max, this.data.commerceQuantity + delta)) });
  },

  submitCommerceOrder() {
    const product = this.data.selectedCommerceProduct;
    if (this.data.commerceOrderStatus) {
      wx.showToast({ title: product.type === "group" ? "拼团订单已创建" : "商品已加入订单", icon: "none" });
      return;
    }
    const commerceOrderStatus = product.type === "group" ? `还差${Math.max(1, product.groupSize - 1)}人，邀请好友成团` : "已加入商城订单，等待结算";
    const nextData = { commerceOrderStatus };
    if (product.type === "shop") nextData.commerceCartCount = this.data.commerceCartCount + this.data.commerceQuantity;
    this.setData(nextData);
    wx.showToast({ title: product.type === "group" ? "开团成功" : "已加入商城订单", icon: "success" });
  },

  openExchange(event) {
    const index = Number(event.currentTarget.dataset.index);
    this.setData({ exchangeOpen: true, exchangeProduct: this.data.products[index] });
  },

  addToCart(event) {
    const index = Number(event.currentTarget.dataset.index);
    const product = this.data.products[index];
    const items = this.data.cartItems.slice();
    const found = items.find((item) => item.name === product.name);
    if (found) found.qty += 1;
    else items.push(Object.assign({}, product, { cash: 0, qty: 1 }));
    this.updateCart(items);
    wx.showToast({ title: "已加入购物车", icon: "success" });
  },

  changeCartQty(event) {
    const index = Number(event.currentTarget.dataset.index);
    const delta = Number(event.currentTarget.dataset.delta);
    const items = this.data.cartItems.slice();
    items[index].qty = Math.max(1, items[index].qty + delta);
    this.updateCart(items);
  },

  updateCart(items) {
    const cartCount = items.reduce((sum, item) => sum + item.qty, 0);
    const cartTotalPoints = items.reduce((sum, item) => sum + item.points * item.qty, 0);
    const cartTotalCash = items.reduce((sum, item) => sum + (item.cash || 0) * item.qty, 0).toFixed(2);
    this.setData({
      cartItems: items,
      cartCount,
      cartTotalPoints,
      cartTotalCash,
      checkoutMaxPoints: cartTotalPoints,
      checkoutPoints: cartTotalPoints,
      checkoutCash: cartTotalCash
    });
  },

  changeCheckoutPoints(event) {
    const checkoutPoints = Number(event.detail.value);
    const baseCash = Number(this.data.cartTotalCash);
    const extraCash = Math.max(0, this.data.checkoutMaxPoints - checkoutPoints) / 100;
    this.setData({ checkoutPoints, checkoutCash: (baseCash + extraCash).toFixed(2) });
  },

  setCheckoutPayment(event) {
    this.setData({ checkoutPayment: event.currentTarget.dataset.payment });
  },

  updateAddress(event) {
    const field = event.currentTarget.dataset.field;
    const update = {};
    update[field] = event.detail.value;
    this.setData(update);
  },

  submitOrder() {
    if (!this.data.addressName || !this.data.addressPhone || !this.data.addressDetail) {
      wx.showToast({ title: "请完善收货地址", icon: "none" });
      return;
    }
    const orderNumber = `DH${Date.now()}`;
    const nextPoints = Math.max(0, this.data.points - this.data.checkoutPoints);
    this.setData({ orderNumber, points: nextPoints, pointCash: Math.floor(nextPoints / 100) });
    this.syncView("orderSuccess", this.data.viewStack.concat(this.data.currentView));
  },

  changeBirthday(event) {
    this.setData({ memberBirthday: event.detail.value });
  },

  setGender(event) {
    this.setData({ memberGender: event.currentTarget.dataset.gender });
  },

  updateMemberPhone(event) {
    this.setData({ memberPhone: event.detail.value });
  },

  saveProfile() {
    wx.showToast({ title: "会员资料已保存", icon: "success" });
  },

  setPrimaryVehicle(event) {
    const index = Number(event.currentTarget.dataset.index);
    const vehicles = this.data.vehicles.map((item, itemIndex) => Object.assign({}, item, { primary: itemIndex === index }));
    this.setData({ vehicles });
    wx.showToast({ title: "已设为默认车辆", icon: "success" });
  },

  addVehicle() {
    if (this.data.vehicles.length >= 3) {
      wx.showModal({ title: "车辆数量已达上限", content: "最多可录入3辆车，请编辑现有车辆后继续使用。", showCancel: false });
      return;
    }
    this.setData(Object.assign({ vehicleEditIndex: -1 }, buildVehicleForm("粤", "B", "", "燃油车")));
    this.syncView("vehicleEdit", this.data.viewStack.concat(this.data.currentView));
  },

  editVehicle(event) {
    const index = Number(event.currentTarget.dataset.index);
    const vehicle = this.data.vehicles[index];
    if (!vehicle) return;
    this.setData(Object.assign({ vehicleEditIndex: index }, parseVehicleForm(vehicle.plate, vehicle.type)));
    this.syncView("vehicleEdit", this.data.viewStack.concat(this.data.currentView));
  },

  selectVehicleProvince(event) {
    const index = Number(event.detail.value) || 0;
    this.setData(buildVehicleForm(this.data.plateProvinces[index], this.data.vehicleCityCode, this.data.vehicleNumber, this.data.vehicleFormType));
  },

  updateVehicleCity(event) {
    this.setData(buildVehicleForm(this.data.vehicleProvince, event.detail.value, this.data.vehicleNumber, this.data.vehicleFormType));
  },

  updateVehicleNumber(event) {
    this.setData(buildVehicleForm(this.data.vehicleProvince, this.data.vehicleCityCode, event.detail.value, this.data.vehicleFormType));
  },

  setVehicleType(event) {
    this.setData(buildVehicleForm(this.data.vehicleProvince, this.data.vehicleCityCode, this.data.vehicleNumber, event.currentTarget.dataset.type));
  },

  saveVehicle() {
    if (!this.data.vehicleFormValid) {
      wx.showToast({ title: "请输入完整车牌", icon: "none" });
      return;
    }
    const vehicles = this.data.vehicles.slice();
    const duplicated = vehicles.some((item, index) => index !== this.data.vehicleEditIndex && item.plate === this.data.vehicleFormPlate);
    if (duplicated) {
      wx.showToast({ title: "该车牌已录入", icon: "none" });
      return;
    }
    const primary = this.data.vehicleEditIndex >= 0 ? Boolean(vehicles[this.data.vehicleEditIndex].primary) : vehicles.length === 0;
    const vehicle = { plate: this.data.vehicleFormPlate, type: this.data.vehicleFormType, primary };
    if (this.data.vehicleEditIndex >= 0) vehicles[this.data.vehicleEditIndex] = Object.assign({}, vehicles[this.data.vehicleEditIndex], vehicle);
    else if (vehicles.length < 3) vehicles.push(vehicle);
    else {
      wx.showModal({ title: "无法继续添加", content: "最多可录入3辆车。", showCancel: false });
      return;
    }
    this.setData({ vehicles });
    wx.showToast({ title: "车辆已保存", icon: "success" });
    setTimeout(() => this.syncView("vehicles", []), 450);
  },

  openMerchantPanel(event) {
    const panel = event.currentTarget.dataset.panel || "home";
    this.setData({ merchantPanel: panel });
    wx.pageScrollTo({ scrollTop: 0, duration: 180, fail: () => {} });
  },

  updateMerchantField(event) {
    const field = event.currentTarget.dataset.field;
    if (!field) return;
    const update = {};
    update[field] = event.detail.value;
    this.setData(update);
  },

  addMerchantMedia(event) {
    const media = event.currentTarget.dataset.media || "图片";
    wx.chooseMedia({
      count: media === "视频" ? 1 : 3,
      mediaType: media === "视频" ? ["video"] : ["image"],
      sourceType: ["album", "camera"],
      success: (result) => {
        const count = result.tempFiles.length;
        if (media === "视频") this.setData({ merchantVideoCount: this.data.merchantVideoCount + count });
        else this.setData({ merchantImageCount: this.data.merchantImageCount + count });
        wx.showToast({ title: `已添加${count}个素材`, icon: "success" });
      }
    });
  },

  saveMerchantProfile() {
    wx.showLoading({ title: "正在提交", mask: true });
    setTimeout(() => {
      const approvals = [{ type: "资料维护", title: "店铺资料更新", time: "刚刚", status: "审核中", tone: "review", note: "已提交，等待商场审核" }].concat(this.data.merchantApprovals);
      this.setData({ merchantProfileCompletion: 100, merchantPendingCount: this.data.merchantPendingCount + 1, merchantApprovals: approvals });
      wx.hideLoading();
      wx.showToast({ title: "资料已提交审核", icon: "success" });
    }, 520);
  },

  chooseMerchantCover(event) {
    this.setData({ merchantCover: event.currentTarget.dataset.cover });
  },

  setMerchantAudience(event) {
    this.setData({ merchantNewsAudience: event.currentTarget.dataset.audience });
  },

  submitMerchantNews() {
    wx.showLoading({ title: "正在提交", mask: true });
    setTimeout(() => {
      const approvals = [{ type: "新品快讯", title: this.data.merchantNewsTitle, time: "刚刚", status: "审核中", tone: "review", note: "内容已提交，等待审核" }].concat(this.data.merchantApprovals);
      this.setData({ merchantPendingCount: this.data.merchantPendingCount + 1, merchantApprovals: approvals });
      wx.hideLoading();
      wx.showToast({ title: "新品快讯已提交", icon: "success" });
    }, 520);
  },

  selectMarketingType(event) {
    this.setData({ merchantMarketingType: event.currentTarget.dataset.type });
  },

  submitMarketingApply() {
    wx.showLoading({ title: "正在提交", mask: true });
    setTimeout(() => {
      const approvals = [{ type: "营销申请", title: this.data.merchantMarketingTitle, time: "刚刚", status: "审核中", tone: "review", note: `${this.data.merchantMarketingType}方案等待审核` }].concat(this.data.merchantApprovals);
      this.setData({ merchantPendingCount: this.data.merchantPendingCount + 1, merchantApprovals: approvals });
      wx.hideLoading();
      wx.showToast({ title: "营销申请已提交", icon: "success" });
    }, 520);
  },

  setMerchantApprovalFilter(event) {
    this.setData({ merchantApprovalFilter: event.currentTarget.dataset.filter });
  },

  togglePageComponent(event) {
    const groupIndex = Number(event.currentTarget.dataset.groupIndex);
    const componentIndex = Number(event.currentTarget.dataset.componentIndex);
    const groups = this.data.pageComponentGroups.map((group, currentGroupIndex) => ({
      name: group.name,
      items: group.items.map((item, currentComponentIndex) => {
        if (currentGroupIndex !== groupIndex || currentComponentIndex !== componentIndex) return item;
        return Object.assign({}, item, { selected: !item.selected });
      })
    }));
    const selectedComponents = [];
    groups.forEach((group) => group.items.forEach((item) => {
      if (item.selected) selectedComponents.push(item.name);
    }));
    const selectedItem = groups[groupIndex] && groups[groupIndex].items[componentIndex];
    this.setData({ pageComponentGroups: groups, selectedComponents });
    wx.showToast({
      title: `${selectedItem.name}${selectedItem.selected ? "已添加" : "已移除"}`,
      icon: "none"
    });
  },

  previewCustomPage() {
    this.syncView("customPreview", this.data.viewStack.concat(this.data.currentView));
  },

  saveCustomPage() {
    wx.showLoading({ title: "正在保存", mask: true });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: "页面配置已保存", icon: "success" });
    }, 650);
  },

  logoutDemo() {
    wx.showToast({ title: "已退出演示账号", icon: "none" });
    setTimeout(() => this.syncView("login", []), 500);
  },

  clearDemoCache() {
    this.setData({ cacheSize: "0KB" });
    wx.showToast({ title: "缓存已清理", icon: "success" });
  },

  updateInvoiceField(event) {
    const update = {};
    update[event.currentTarget.dataset.field] = event.detail.value;
    this.setData(update);
  },

  submitInvoice() {
    if (!this.data.invoiceTitle || !this.data.invoiceEmail) {
      wx.showToast({ title: "请完善开票信息", icon: "none" });
      return;
    }
    this.setData({ invoiceSubmitted: true });
  },

  onChatInput(event) {
    this.setData({ chatInput: event.detail.value });
  },

  useQuickMessage(event) {
    this.setData({ chatInput: event.currentTarget.dataset.message });
  },

  sendMessage() {
    const text = this.data.chatInput.trim();
    if (!text) {
      wx.showToast({ title: "请输入咨询内容", icon: "none" });
      return;
    }
    const messages = this.data.chatMessages.concat({ side: "user", text, time: "现在" });
    this.setData({ chatMessages: messages, chatInput: "" });
    wx.showToast({ title: "消息已发送", icon: "success" });
  },

  borrowItem(event) {
    const name = event.currentTarget.dataset.name;
    const items = this.data.borrowItems.map((item) => item.name === name ? Object.assign({}, item, { stock: Math.max(0, item.stock - 1) }) : item);
    const record = { name, code: `LY${String(Date.now()).slice(-6)}`, status: "待领取", location: "L1会员礼宾台" };
    this.setData({ borrowItems: items, loanRecords: [record].concat(this.data.loanRecords) });
    wx.showToast({ title: "申请成功", icon: "success" });
  },

  closeExchange() {
    this.setData({ exchangeOpen: false, exchangeProduct: null });
  },

  confirmExchange() {
    const product = this.data.exchangeProduct;
    if (!product) return;
    if (this.data.points < product.points) {
      wx.showToast({ title: "积分不足", icon: "none" });
      return;
    }
    const nextPoints = this.data.points - product.points;
    this.setData({
      points: nextPoints,
      pointCash: Math.floor(nextPoints / 100),
      exchangeOpen: false,
      exchangeProduct: null
    });
    wx.showToast({ title: "兑换成功", icon: "success" });
  }
});
