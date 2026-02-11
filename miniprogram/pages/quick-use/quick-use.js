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
    recentRecords: [],
    
    // 岩馆分组
    gymList: [],
    selectedGym: '',
    groupedCards: {},
    
    // 二维码弹窗
    showQRCodeModal: false,
    currentQRCode: {
      ownerName: '',
      imagePath: '',
      price: ''
    }
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
    
    // 过滤有效次卡
    const available = cards.filter(card => 
      card.status === 'active' && 
      card.remain_times > 0
    ).map(card => ({
      ...card,
      gym_name_display: card.gym_name,
      expiry_date_display: card.expiry_date ? this.formatDate(card.expiry_date) : '无截止日期',
      phone_display: card.phone ? this.formatPhone(card.phone) : ''
    }));

    // 按岩馆分组
    const gymMap = {};
    const gymList = [];
    
    available.forEach(card => {
      if (!gymMap[card.gym_name]) {
        gymMap[card.gym_name] = [];
        gymList.push(card.gym_name);
      }
      gymMap[card.gym_name].push(card);
    });

    // 按岩馆名称排序
    gymList.sort();

    this.setData({ 
      availableCards: available,
      gymList: gymList,
      selectedGym: gymList.length > 0 ? gymList[0] : '',
      groupedCards: gymMap
    });
  },

  formatDate(dateStr) {
    if (!dateStr) return '无截止日期';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  },

  formatPhone(phone) {
    if (!phone) return '';
    return phone;
  },

  getQRCodePath(ownerName) {
    const qrCodeMap = {
      '阿卓': '../../images/qrcodes/azhuo.png',
      '周周': '../../images/qrcodes/zhouzhou.png',
      '小又': '../../images/qrcodes/xiaoyou.png',
      '张小葱': '../../images/qrcodes/zhangxiaocong.png',
      '土豆': '../../images/qrcodes/tudou.png',
      '小姜': '../../images/qrcodes/xiaojiang.png',
      '大块头': '../../images/qrcodes/dakuaitou.png',
      '茄子': '../../images/qrcodes/qiezi.png',
      '小糕': '../../images/qrcodes/xiaogao.png',
      '徐高兴': '../../images/qrcodes/xugaoxing.png'
    };
    return qrCodeMap[ownerName] || '';
  },

  showQRCodeModal(card) {
    const imagePath = this.getQRCodePath(card.owner_name);
    this.setData({
      showQRCodeModal: true,
      currentQRCode: {
        ownerName: card.owner_name,
        imagePath: imagePath,
        price: card.price_per_time,
        gymName: card.gym_name,
        cardId: card._id
      }
    });
  },

  hideQRCodeModal() {
    this.setData({ showQRCodeModal: false });
  },

  onQRCodeError(e) {
    console.log('QR code image load failed:', e);
  },

  confirmPayment() {
    const qrCodeData = this.data.currentQRCode;
    const cards = wx.getStorageSync('Cards') || [];
    const card = cards.find(c => c._id === qrCodeData.cardId);
    
    if (!card) {
      wx.showToast({
        title: '次卡不存在',
        icon: 'none'
      });
      return;
    }

    this.executeUseCard(card);
    this.hideQRCodeModal();
  },

  onGymChange(e) {
    const index = parseInt(e.detail.value);
    const selectedGym = this.data.gymList[index];
    this.setData({ selectedGym });
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
    const card = e.currentTarget.dataset.card;
    
    if (!card || card.remain_times <= 0) {
      wx.showToast({
        title: '该卡已用完',
        icon: 'none'
      });
      return;
    }

    this.showQRCodeModal(card);
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
