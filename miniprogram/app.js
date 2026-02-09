App({
  onLaunch() {
    this.initLocalData();
  },

  initLocalData() {
    const cards = wx.getStorageSync('Cards');
    if (!cards || cards.length === 0) {
      const initialCards = [
        {
          _id: 'card_azhuo_1',
          gym_name: 'Bloc1',
          owner_name: '阿卓',
          price_per_time: 88,
          total_times: 10,
          remain_times: 10,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_2',
          gym_name: 'CAMP4',
          owner_name: '阿卓',
          price_per_time: 95,
          total_times: 6,
          remain_times: 6,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_3',
          gym_name: 'COB&COG',
          owner_name: '阿卓',
          price_per_time: 90,
          total_times: 4,
          remain_times: 4,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_4',
          gym_name: 'Mellow',
          owner_name: '阿卓',
          price_per_time: 94,
          total_times: 18,
          remain_times: 18,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_5',
          gym_name: '飞猫',
          owner_name: '阿卓',
          price_per_time: 82,
          total_times: 35,
          remain_times: 35,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_6',
          gym_name: '青山',
          owner_name: '阿卓',
          price_per_time: 85,
          total_times: 50,
          remain_times: 50,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_7',
          gym_name: '我攀',
          owner_name: '阿卓',
          price_per_time: 111,
          total_times: 4,
          remain_times: 4,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_8',
          gym_name: '一起攀岩',
          owner_name: '阿卓',
          price_per_time: 95,
          total_times: 10,
          remain_times: 10,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhouzhou_1',
          gym_name: 'Bloc1',
          owner_name: '周周',
          price_per_time: 88,
          total_times: 20,
          remain_times: 20,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '18340325013',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhouzhou_2',
          gym_name: 'COB&COG',
          owner_name: '周周',
          price_per_time: 90,
          total_times: 20,
          remain_times: 20,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '18340325013',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhouzhou_3',
          gym_name: '青藤',
          owner_name: '周周',
          price_per_time: 95,
          total_times: 20,
          remain_times: 20,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '18340325013',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhouzhou_4',
          gym_name: '日坛',
          owner_name: '周周',
          price_per_time: 88,
          total_times: 20,
          remain_times: 20,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '18340325013',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhouzhou_5',
          gym_name: '岩时',
          owner_name: '周周',
          price_per_time: 104,
          total_times: 20,
          remain_times: 20,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '18340325013',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhangxiaocong_1',
          gym_name: '北顶',
          owner_name: '张小葱',
          price_per_time: 92.5,
          total_times: 11,
          remain_times: 11,
          expiry_date: new Date('2026-10-11T23:59:59.000Z').toISOString(),
          phone: '15652171866',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhangxiaocong_2',
          gym_name: '我攀',
          owner_name: '张小葱',
          price_per_time: 111,
          total_times: 2,
          remain_times: 2,
          expiry_date: new Date('2026-08-11T23:59:59.000Z').toISOString(),
          phone: '15652171866',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhangxiaocong_3',
          gym_name: '一直',
          owner_name: '张小葱',
          price_per_time: 85,
          total_times: 20,
          remain_times: 20,
          expiry_date: new Date('2029-01-01T23:59:59.000Z').toISOString(),
          phone: '15652171866',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhangxiaocong_4',
          gym_name: '青山',
          owner_name: '张小葱',
          price_per_time: 85,
          total_times: 20,
          remain_times: 20,
          expiry_date: '',
          phone: '15652171866',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_xiaoyou_1',
          gym_name: '先锋',
          owner_name: '小又',
          price_per_time: 99,
          total_times: 1,
          remain_times: 1,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '13520196361',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_tudou_1',
          gym_name: '日坛',
          owner_name: '土豆',
          price_per_time: 87,
          total_times: 20,
          remain_times: 20,
          expiry_date: new Date('2026-12-31T23:59:59.000Z').toISOString(),
          phone: '19545331524',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_xiaojiang_1',
          gym_name: '我攀',
          owner_name: '小姜',
          price_per_time: 111,
          total_times: 4,
          remain_times: 4,
          expiry_date: new Date('2026-08-30T23:59:59.000Z').toISOString(),
          phone: '18222330621',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_xiaojiang_2',
          gym_name: '飞猫',
          owner_name: '小姜',
          price_per_time: 82,
          total_times: 20,
          remain_times: 20,
          expiry_date: '',
          phone: '18222330621',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        }
      ];
      wx.setStorageSync('Cards', initialCards);
    }

    const logs = wx.getStorageSync('UsageLogs');
    if (!logs || logs.length === 0) {
      const initialLogs = [];
      wx.setStorageSync('UsageLogs', initialLogs);
    }
  },

  generateId() {
    return 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  globalData: {
    userInfo: null
  }
});
