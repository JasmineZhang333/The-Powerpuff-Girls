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
          total_times: 1,
          remain_times: 1,
          expiry_date: '',
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_2',
          gym_name: '一起攀岩',
          owner_name: '阿卓',
          price_per_time: 95,
          total_times: 1,
          remain_times: 1,
          expiry_date: '',
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_3',
          gym_name: 'CAMP4',
          owner_name: '阿卓',
          price_per_time: 95,
          total_times: 6,
          remain_times: 6,
          expiry_date: '',
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_4',
          gym_name: 'COB',
          owner_name: '阿卓',
          price_per_time: 90,
          total_times: 4,
          remain_times: 4,
          expiry_date: new Date('2027-12-31T23:59:59.000Z').toISOString(),
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_5',
          gym_name: 'COG',
          owner_name: '阿卓',
          price_per_time: 90,
          total_times: 4,
          remain_times: 4,
          expiry_date: new Date('2026-02-11T23:59:59.000Z').toISOString(),
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_6',
          gym_name: '飞猫',
          owner_name: '阿卓',
          price_per_time: 82,
          total_times: 1,
          remain_times: 1,
          expiry_date: '',
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
          total_times: 7,
          remain_times: 7,
          expiry_date: '',
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_8',
          gym_name: '青山',
          owner_name: '阿卓',
          price_per_time: 85,
          total_times: 1,
          remain_times: 1,
          expiry_date: '',
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_azhuo_9',
          gym_name: 'Mellow',
          owner_name: '阿卓',
          price_per_time: 94,
          total_times: 1,
          remain_times: 1,
          expiry_date: new Date('2027-12-31T23:59:59.000Z').toISOString(),
          phone: '18612261453',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhouzhou_1',
          gym_name: '日坛',
          owner_name: '周周',
          price_per_time: 88,
          total_times: 1,
          remain_times: 1,
          expiry_date: '',
          phone: '18340325013',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhouzhou_2',
          gym_name: '青藤',
          owner_name: '周周',
          price_per_time: 95,
          total_times: 1,
          remain_times: 1,
          expiry_date: '',
          phone: '18340325013',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhouzhou_3',
          gym_name: '岩时',
          owner_name: '周周',
          price_per_time: 104,
          total_times: 1,
          remain_times: 1,
          expiry_date: '',
          phone: '18340325013',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhouzhou_4',
          gym_name: 'Bloc1',
          owner_name: '周周',
          price_per_time: 88,
          total_times: 1,
          remain_times: 1,
          expiry_date: '',
          phone: '18340325013',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhouzhou_5',
          gym_name: 'COB',
          owner_name: '周周',
          price_per_time: 90,
          total_times: 1,
          remain_times: 1,
          expiry_date: '',
          phone: '18340325013',
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
          expiry_date: '',
          phone: '13520196361',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_zhangxiaocong_1',
          gym_name: '北顶',
          owner_name: '张小葱',
          price_per_time: 92.5,
          total_times: 1,
          remain_times: 1,
          expiry_date: '',
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
          total_times: 1,
          remain_times: 1,
          expiry_date: '',
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
          total_times: 1,
          remain_times: 1,
          expiry_date: '',
          phone: '15652171866',
          shared_with: [],
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          _id: 'card_tudou_1',
          gym_name: '日坛',
          owner_name: '土豆',
          price_per_time: 87,
          total_times: 1,
          remain_times: 1,
          expiry_date: '',
          phone: '19545331524',
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
