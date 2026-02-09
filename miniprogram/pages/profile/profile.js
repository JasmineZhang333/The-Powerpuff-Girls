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
      { name: '小又', role: '办卡人' },
      { name: '张小葱', role: '办卡人' },
      { name: '土豆', role: '办卡人' },
      { name: '小姜', role: '办卡人' },
      { name: '大块头', role: '办卡人' },
      { name: '茄子', role: '办卡人' },
      { name: '小糕', role: '办卡人' },
      { name: '徐高兴', role: '办卡人' }
    ]
  },

  onShow() {
    if (this.data.currentUser) {
      this.loadMyData();
    }
  },

  loadMyData() {
    this.loadMyCards();
    this.loadMyUsageRecords();
  },

  loadMyCards() {
    const cards = wx.getStorageSync('Cards') || [];
    const myCards = cards.filter(card => 
      card.owner_name === this.data.currentUser.name && 
      card.status === 'active'
    );
    this.setData({ myCards });
  },

  loadMyUsageRecords() {
    const logs = wx.getStorageSync('UsageLogs') || [];
    const cards = wx.getStorageSync('Cards') || [];
    
    const myLogs = logs.filter(log => log.user_name === this.data.currentUser.name);
    
    const records = myLogs.map(log => {
      const card = cards.find(c => c._id === log.card_id);
      return {
        ...log,
        gym_name: card ? card.gym_name : '未知岩馆',
        card_owner: card ? card.owner_name : '未知',
        use_date_display: this.formatDate(log.use_date)
      };
    });
    
    this.setData({ myUsageRecords: records });
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
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
});
