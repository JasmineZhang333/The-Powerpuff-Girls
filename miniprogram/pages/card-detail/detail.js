const app = getApp();

Page({
  data: {
    cardId: '',
    card: {},
    usageLogs: [],
    usagePercent: 0,
    showModal: false,
    useCount: 1,
    userName: ''
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ cardId: options.id });
      this.loadCardDetail();
    }
  },

  onShow() {
    if (this.data.cardId) {
      this.loadCardDetail();
    }
  },

  loadCardDetail() {
    const cards = wx.getStorageSync('Cards') || [];
    const card = cards.find(c => c._id === this.data.cardId);
    
    if (card) {
      const usagePercent = ((card.total_times - card.remain_times) / card.total_times * 100).toFixed(0);
      
      this.setData({
        card: {
          ...card,
          expiry_date_display: this.formatDate(card.expiry_date),
          days_until_expiry: this.getDaysUntilExpiry(card.expiry_date)
        },
        usagePercent
      });
      
      this.loadUsageLogs();
    }
  },

  loadUsageLogs() {
    const logs = wx.getStorageSync('UsageLogs') || [];
    const cardLogs = logs
      .filter(log => log.card_id === this.data.cardId)
      .sort((a, b) => new Date(b.use_date) - new Date(a.use_date))
      .map(log => ({
        ...log,
        use_date_display: this.formatDateTime(log.use_date)
      }));
    
    this.setData({ usageLogs: cardLogs });
  },

  makePhoneCall() {
    if (this.data.card.phone) {
      wx.makePhoneCall({
        phoneNumber: this.data.card.phone,
        fail: (err) => {
          if (err.errMsg !== 'makePhoneCall:fail cancel') {
            wx.showToast({ title: '拨打电话失败', icon: 'none' });
          }
        }
      });
    }
  },

  showRecordModal() {
    if (this.data.card.remain_times <= 0) {
      wx.showToast({ title: '次数已用完', icon: 'none' });
      return;
    }
    this.setData({ showModal: true, useCount: 1, userName: '' });
  },

  hideRecordModal() {
    this.setData({ showModal: false });
  },

  preventClose() {},

  onUserNameInput(e) {
    this.setData({ userName: e.detail.value });
  },

  increaseCount() {
    const maxCount = Math.min(5, this.data.card.remain_times);
    if (this.data.useCount < maxCount) {
      this.setData({ useCount: this.data.useCount + 1 });
    }
  },

  decreaseCount() {
    if (this.data.useCount > 1) {
      this.setData({ useCount: this.data.useCount - 1 });
    }
  },

  submitRecord() {
    if (!this.data.userName.trim()) {
      wx.showToast({ title: '请输入刷卡人姓名', icon: 'none' });
      return;
    }
    
    const cards = wx.getStorageSync('Cards') || [];
    const cardIndex = cards.findIndex(c => c._id === this.data.cardId);
    
    if (cardIndex === -1) {
      wx.showToast({ title: '卡片不存在', icon: 'none' });
      return;
    }
    
    if (cards[cardIndex].remain_times < this.data.useCount) {
      wx.showToast({ title: '剩余次数不足', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '提交中...' });
    
    setTimeout(() => {
      const now = new Date().toISOString();
      
      const newLog = {
        _id: 'log_' + Date.now(),
        card_id: this.data.cardId,
        gym_name: this.data.card.gym_name,
        user_name: this.data.userName.trim(),
        use_date: now,
        use_count: this.data.useCount,
        cost_at_time: this.data.card.price_per_time
      };
      
      cards[cardIndex].remain_times -= this.data.useCount;
      
      if (cards[cardIndex].remain_times <= 0) {
        cards[cardIndex].status = 'inactive';
        cards[cardIndex].remain_times = 0;
      }
      
      const logs = wx.getStorageSync('UsageLogs') || [];
      logs.unshift(newLog);
      
      wx.setStorageSync('Cards', cards);
      wx.setStorageSync('UsageLogs', logs);
      
      wx.hideLoading();
      
      wx.showToast({ title: '登记成功', icon: 'success' });
      this.setData({ showModal: false });
      this.loadCardDetail();
    }, 500);
  },

  getDaysUntilExpiry(expiryDate) {
    const now = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
});
