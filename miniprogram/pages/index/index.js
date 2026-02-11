Page({
  data: {
    allCards: [],
    groupedCards: [],
    filteredCards: [],
    gymList: [],
    selectedGymIndex: 0,
    groupedCardsObject: {},
    selectedGymForTab: ''
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
      expiry_date_display: card.expiry_date ? this.formatDate(card.expiry_date) : '未开卡',
      days_until_expiry: card.expiry_date ? this.getDaysUntilExpiry(card.expiry_date) : null,
      is_not_opened: !card.expiry_date
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
    
    const gymList = Object.keys(groups).sort();
    
    const groupedCards = gymList.map(gymName => ({
      gymName,
      cards: groups[gymName]
    }));
    
    this.setData({ 
      groupedCards,
      groupedCardsObject: groups,
      gymList,
      selectedGymForTab: gymList.length > 0 ? gymList[0] : ''
    });
  },

  switchGym(e) {
    const gym = e.currentTarget.dataset.gym;
    this.setData({ 
      selectedGymForTab: gym,
      selectedGymIndex: this.data.gymList.indexOf(gym)
    });
    
    if (gym) {
      const filtered = this.data.allCards.filter(card => card.gym_name === gym);
      this.setData({ filteredCards: filtered });
      this.groupByGym(filtered);
    }
  },

  getDaysUntilExpiry(expiryDate) {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  },

  goToDetail(e) {
    const cardId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/card-detail/detail?id=${cardId}`
    });
  },

  onGymChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({ selectedGymIndex: index });
    
    if (index === 0) {
      this.setData({ filteredCards: this.data.allCards });
    } else {
      const selectedGym = this.data.gymList[index];
      const filtered = this.data.allCards.filter(card => card.gym_name === selectedGym);
      this.setData({ filteredCards: filtered });
    }
    this.groupByGym(this.data.filteredCards);
  }
});
