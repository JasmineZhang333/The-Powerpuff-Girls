const db = wx.cloud.database();

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

  async loadCardDetail() {
    const cardRes = await db.collection('Cards')
      .doc(this.data.cardId)
      .get();
    
    const card = cardRes.data;
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
  },

  async loadUsageLogs() {
    const logsRes = await db.collection('UsageLogs')
      .where({ card_id: this.data.cardId })
      .orderBy('use_date', 'desc')
      .get();
    
    const logs = logsRes.data.map(log => ({
      ...log,
      use_date_display: this.formatDateTime(log.use_date)
    }));
    
    this.setData({ usageLogs: logs });
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

  async submitRecord() {
    if (!this.data.userName.trim()) {
      wx.showToast({ title: '请输入刷卡人姓名', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '提交中...' });
    
    try {
      const callRes = await wx.cloud.callFunction({
        name: 'recordCardUsage',
        data: {
          cardId: this.data.cardId,
          userName: this.data.userName.trim(),
          useCount: this.data.useCount
        }
      });
      
      wx.hideLoading();
      
      if (callRes.result.success) {
        wx.showToast({ title: '登记成功', icon: 'success' });
        this.setData({ showModal: false });
        this.loadCardDetail();
      } else {
        throw new Error(callRes.result.error);
      }
    } catch (err) {
      wx.hideLoading();
      console.error('登记失败:', err);
      wx.showToast({ title: '登记失败', icon: 'none' });
    }
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
