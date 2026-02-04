const app = getApp();

Page({
  data: {
    currentUser: null,
    availableCards: [],
    selectedIndex: -1,
    showUserPicker: false,
    userOptions: [
      { name: '阿卓', role: '办卡人' },
      { name: '周周', role: '办卡人' },
      { name: '小又', role: '办卡人' },
      { name: '张小葱', role: '办卡人' },
      { name: '土豆', role: '办卡人' },
      { name: '小姜', role: '办卡人' },
      { name: '大块头', role: '办卡人' },
      { name: '茄子', role: '办卡人' },
      { name: '小糕', role: '办卡人' },
      { name: '徐高兴', role: '办卡人' }
    ],
    tempUser: null,
    recentRecords: []
  },

  onLoad() {
    this.initUser();
    this.loadCards();
  },

  onShow() {
    this.loadCards();
  },

  initUser() {
    const userOptions = this.data.userOptions;
    if (userOptions.length > 0) {
      const currentUser = userOptions[0];
      this.setData({ 
        currentUser,
        tempUser: currentUser
      });
    }
  },

  loadCards() {
    const cards = wx.getStorageSync('Cards') || [];
    
    const available = cards.filter(card => 
      card.status === 'active' && 
      card.remain_times > 0
    ).map(card => ({
      ...card,
      gym_name_display: card.gym_name,
      expiry_date_display: card.expiry_date ? this.formatDate(card.expiry_date) : '无截止日期'
    }));

    this.setData({ availableCards: available });
  },

  formatDate(dateStr) {
    if (!dateStr) return '无截止日期';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },

  changeUser() {
    this.setData({ showUserPicker: true });
  },

  hideUserPicker() {
    this.setData({ showUserPicker: false });
  },

  selectTempUser(e) {
    const user = e.currentTarget.dataset.user;
    this.setData({ tempUser: user });
  },

  confirmSelectUser() {
    if (this.data.tempUser) {
      this.setData({
        currentUser: this.data.tempUser,
        showUserPicker: false
      });
      this.loadCards();
    }
  },

  selectCard(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ selectedIndex: index });
  },

  useCard(e) {
    const index = e.currentTarget.dataset.index;
    const card = this.data.availableCards[index];
    
    if (!card || card.remain_times <= 0) {
      wx.showToast({
        title: '该卡已用完',
        icon: 'none'
      });
      return;
    }

    const that = this;
    wx.showModal({
      title: '确认使用',
      content: `确定要在 "${card.gym_name}" 使用持卡人 "${card.owner_name}" 的一张次卡吗？(¥${card.price_per_time})`,
      confirmColor: '#f5a623',
      success(res) {
        if (res.confirm) {
          that.executeUseCard(card);
        }
      }
    });
  },

  executeUseCard(card) {
    const cards = wx.getStorageSync('Cards') || [];
    const cardIndex = cards.findIndex(c => c._id === card._id);
    
    if (cardIndex === -1) {
      wx.showToast({
        title: '次卡不存在',
        icon: 'none'
      });
      return;
    }

    cards[cardIndex].remain_times -= 1;
    wx.setStorageSync('Cards', cards);

    const logs = wx.getStorageSync('UsageLogs') || [];
    const newLog = {
      _id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      card_id: card._id,
      gym_name: card.gym_name,
      user_name: this.data.currentUser.name,
      use_date: new Date().toISOString(),
      use_count: 1,
      cost_at_time: card.price_per_time
    };
    logs.unshift(newLog);
    wx.setStorageSync('UsageLogs', logs);

    wx.showToast({
      title: '使用成功!',
      icon: 'success',
      duration: 2000
    });

    setTimeout(() => {
      this.loadCards();
      this.setData({ selectedIndex: -1 });
    }, 2000);
  },

  showRecentRecords() {
    const logs = wx.getStorageSync('UsageLogs') || [];
    const cards = wx.getStorageSync('Cards') || [];
    
    const recentLogs = logs.slice(0, 10).map(log => {
      const card = cards.find(c => c._id === log.card_id);
      return {
        ...log,
        gym_name: card ? card.gym_name : '未知岩馆',
        card_owner: card ? card.owner_name : '未知',
        use_date_display: this.formatDateTime(log.use_date)
      };
    });

    let content = '';
    if (recentLogs.length === 0) {
      content = '暂无使用记录';
    } else {
      content = recentLogs.map((log, index) => {
        return `${index + 1}. ${log.use_date_display} - ${log.gym_name} (${log.user_name} ¥${log.cost_at_time})`;
      }).join('\n');
    }

    wx.showModal({
      title: '最近使用记录',
      content: content,
      showCancel: false,
      confirmColor: '#f5a623'
    });
  },

  formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  },

  scanQRCode() {
    wx.showToast({
      title: '扫码功能开发中',
      icon: 'none',
      duration: 2000
    });
  },

  addQuickCard() {
    wx.showToast({
      title: '请前往"管理"页面添加',
      icon: 'none',
      duration: 2000
    });
  }
});
