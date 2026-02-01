const db = wx.cloud.database();

Page({
  data: {
    allCards: [],
    groupedCards: [],
    filteredCards: []
  },

  onLoad() {
    this.loadCards();
  },

  onShow() {
    this.loadCards();
  },

  async loadCards() {
    try {
      const res = await db.collection('Cards')
        .where({
          status: 'active',
          remain_times: db.command.gt(0)
        })
        .get();
      
      const cards = res.data.map(card => ({
        ...card,
        expiry_date_display: this.formatDate(card.expiry_date),
        days_until_expiry: this.getDaysUntilExpiry(card.expiry_date)
      }));
      
      this.setData({ 
        allCards: cards,
        filteredCards: cards 
      });
      
      this.groupByGym(cards);
    } catch (err) {
      console.error('加载卡片失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  groupByGym(cards) {
    const groups = {};
    cards.forEach(card => {
      if (!groups[card.gym_name]) {
        groups[card.gym_name] = [];
      }
      groups[card.gym_name].push(card);
    });
    
    const groupedCards = Object.keys(groups).map(gymName => ({
      gymName,
      cards: groups[gymName]
    }));
    
    this.setData({ groupedCards });
  },

  getDaysUntilExpiry(expiryDate) {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },

  goToDetail(e) {
    const cardId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/card-detail/detail?id=${cardId}`
    });
  },

  onSearchInput(e) {
    const keyword = e.detail.value.toLowerCase();
    const filtered = this.data.allCards.filter(card => 
      card.gym_name.toLowerCase().includes(keyword) ||
      card.owner_name.toLowerCase().includes(keyword)
    );
    this.setData({ filteredCards: filtered });
    this.groupByGym(filtered);
  }
});
