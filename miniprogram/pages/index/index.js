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

  loadCards() {
    const cards = wx.getStorageSync('Cards') || [];
    
    const filtered = cards.filter(card => 
      card.status === 'active' && card.remain_times > 0
    );
    
    const processedCards = filtered.map(card => ({
      ...card,
      expiry_date_display: this.formatDate(card.expiry_date),
      days_until_expiry: this.getDaysUntilExpiry(card.expiry_date)
    }));
    
    this.setData({ 
      allCards: processedCards,
      filteredCards: processedCards 
    });
    
    this.groupByGym(processedCards);
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
