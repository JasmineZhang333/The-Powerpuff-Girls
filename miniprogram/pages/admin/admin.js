const app = getApp();

Page({
  data: {
    cards: [],
    newCard: {
      gym_name: '',
      owner_name: '',
      price_per_time: '',
      total_times: '',
      expiry_date: '',
      phone: ''
    }
  },

  onLoad() {
    this.loadCards();
  },

  onShow() {
    this.loadCards();
  },

  loadCards() {
    const cards = wx.getStorageSync('Cards') || [];
    this.setData({ cards });
  },

  onGymNameInput(e) {
    this.setData({ 'newCard.gym_name': e.detail.value });
  },

  onOwnerNameInput(e) {
    this.setData({ 'newCard.owner_name': e.detail.value });
  },

  onPriceInput(e) {
    this.setData({ 'newCard.price_per_time': e.detail.value });
  },

  onTotalTimesInput(e) {
    this.setData({ 'newCard.total_times': e.detail.value });
  },

  onDateChange(e) {
    this.setData({ 'newCard.expiry_date': e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ 'newCard.phone': e.detail.value });
  },

  addCard() {
    const { gym_name, owner_name, price_per_time, total_times, expiry_date, phone } = this.data.newCard;
    
    if (!gym_name || !owner_name || !price_per_time || !total_times || !expiry_date) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    
    const cards = wx.getStorageSync('Cards') || [];
    
    const newCard = {
      _id: app.generateId(),
      gym_name,
      owner_name,
      price_per_time: parseInt(price_per_time),
      total_times: parseInt(total_times),
      remain_times: parseInt(total_times),
      expiry_date: new Date(expiry_date + 'T23:59:59').toISOString(),
      phone,
      shared_with: [],
      status: 'active',
      created_at: new Date().toISOString()
    };
    
    cards.push(newCard);
    wx.setStorageSync('Cards', cards);
    
    wx.showToast({ title: '添加成功', icon: 'success' });
    
    this.setData({
      cards,
      newCard: {
        gym_name: '',
        owner_name: '',
        price_per_time: '',
        total_times: '',
        expiry_date: '',
        phone: ''
      }
    });
  },

  editCard(e) {
    const index = e.currentTarget.dataset.index;
    const card = this.data.cards[index];
    
    wx.showModal({
      title: '编辑次卡',
      editable: true,
      placeholderText: '输入剩余次数',
      success: (res) => {
        if (res.confirm) {
          const newRemainTimes = parseInt(res.content);
          if (isNaN(newRemainTimes) || newRemainTimes < 0) {
            wx.showToast({ title: '输入无效', icon: 'none' });
            return;
          }
          
          const cards = wx.getStorageSync('Cards') || [];
          cards[index].remain_times = newRemainTimes;
          cards[index].total_times = Math.max(cards[index].total_times, newRemainTimes);
          
          wx.setStorageSync('Cards', cards);
          this.setData({ cards });
          wx.showToast({ title: '修改成功', icon: 'success' });
        }
      }
    });
  },

  deleteCard(e) {
    const index = e.currentTarget.dataset.index;
    const card = this.data.cards[index];
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除「${card.gym_name}」吗？`,
      success: (res) => {
        if (res.confirm) {
          const cards = wx.getStorageSync('Cards') || [];
          cards.splice(index, 1);
          wx.setStorageSync('Cards', cards);
          this.setData({ cards });
          wx.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
  },

  exportData() {
    const data = {
      version: '1.0',
      exportTime: new Date().toISOString(),
      cards: wx.getStorageSync('Cards') || [],
      logs: wx.getStorageSync('UsageLogs') || []
    };
    
    const fileContent = JSON.stringify(data, null, 2);
    
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/climbing-cards-${Date.now()}.json`;
    
    fs.writeFile({
      filePath,
      data: fileContent,
      encoding: 'utf8',
      success: () => {
        wx.shareFileMessage({
          filePath,
          success: () => {
            wx.showToast({ title: '分享成功', icon: 'success' });
          },
          fail: (err) => {
            if (err.errMsg !== 'shareFileMessage:fail cancel') {
              wx.showToast({ title: '分享失败', icon: 'none' });
            }
          }
        });
      },
      fail: () => {
        wx.showToast({ title: '导出失败', icon: 'none' });
      }
    });
  },

  importData() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const filePath = res.tempFiles[0].path;
        
        const fs = wx.getFileSystemManager();
        fs.readFile({
          filePath,
          encoding: 'utf8',
          success: (readRes) => {
            try {
              const data = JSON.parse(readRes.data);
              
              if (!data.cards || !Array.isArray(data.cards)) {
                throw new Error('Invalid data format');
              }
              
              wx.showModal({
                title: '确认导入',
                content: `将导入 ${data.cards.length} 张次卡和 ${data.logs ? data.logs.length : 0} 条记录，覆盖当前数据？`,
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    wx.setStorageSync('Cards', data.cards);
                    wx.setStorageSync('UsageLogs', data.logs || []);
                    this.loadCards();
                    wx.showToast({ title: '导入成功', icon: 'success' });
                  }
                }
              });
            } catch (err) {
              wx.showToast({ title: '文件格式无效', icon: 'none' });
            }
          },
          fail: () => {
            wx.showToast({ title: '读取失败', icon: 'none' });
          }
        });
      }
    });
  },

  clearData() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有数据吗？此操作不可恢复！',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('Cards');
          wx.removeStorageSync('UsageLogs');
          this.setData({ cards: [] });
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  }
});
