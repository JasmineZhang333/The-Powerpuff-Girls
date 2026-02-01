const db = wx.cloud.database();

Page({
  data: {
    currentUser: null,
    activeTab: 'myCards',
    myCards: [],
    myUsageRecords: [],
    showPicker: false,
    showAddUserModal: false,
    newUserName: '',
    userOptions: [
      { name: '阿卓', role: '办卡人' },
      { name: '周周', role: '办卡人' },
      { name: '小王', role: '共同使用者' },
      { name: '小李', role: '共同使用者' }
    ]
  },

  onShow() {
    if (this.data.currentUser) {
      this.loadMyData();
    }
  },

  async loadMyData() {
    await Promise.all([
      this.loadMyCards(),
      this.loadMyUsageRecords()
    ]);
  },

  async loadMyCards() {
    try {
      const res = await db.collection('Cards')
        .where({
          owner_name: this.data.currentUser.name,
          status: 'active'
        })
        .get();
      
      this.setData({ myCards: res.data });
    } catch (err) {
      console.error('加载我的卡片失败:', err);
    }
  },

  async loadMyUsageRecords() {
    try {
      const res = await db.collection('UsageLogs')
        .where({
          user_name: this.data.currentUser.name
        })
        .orderBy('use_date', 'desc')
        .get();
      
      const records = await Promise.all(res.data.map(async log => {
        const cardRes = await db.collection('Cards')
          .doc(log.card_id)
          .get();
        return {
          ...log,
          gym_name: cardRes.data ? cardRes.data.gym_name : '未知岩馆',
          card_owner: cardRes.data ? cardRes.data.owner_name : '未知',
          use_date_display: this.formatDate(log.use_date)
        };
      }));
      
      this.setData({ myUsageRecords: records });
    } catch (err) {
      console.error('加载刷卡记录失败:', err);
    }
  },

  showUserPicker() {
    this.setData({ showPicker: true });
  },

  hideUserPicker() {
    this.setData({ showPicker: false });
  },

  selectUser(e) {
    const user = e.currentTarget.dataset.user;
    this.setData({
      currentUser: user,
      showPicker: false
    });
    this.loadMyData();
  },

  showAddUserModal() {
    this.setData({ showAddUserModal: true, newUserName: '' });
  },

  hideAddUserModal() {
    this.setData({ showAddUserModal: false });
  },

  onNewUserName(e) {
    this.setData({ newUserName: e.detail.value });
  },

  confirmAddUser() {
    const name = this.data.newUserName.trim();
    if (!name) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    
    const newUser = { name, role: '共同使用者' };
    const options = [...this.data.userOptions, newUser];
    
    this.setData({
      userOptions: options,
      currentUser: newUser,
      showAddUserModal: false,
      showPicker: false
    });
    
    this.loadMyData();
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  goToCardDetail(e) {
    const cardId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/card-detail/detail?id=${cardId}`
    });
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
});
