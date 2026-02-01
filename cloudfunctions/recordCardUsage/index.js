const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { cardId, userName, useCount } = event;
  
  if (!cardId || !userName || !useCount) {
    return { success: false, error: '参数不完整' };
  }
  
  try {
    const transaction = await db.startTransaction();
    
    const card = await transaction.collection('Cards')
      .doc(cardId)
      .get();
    
    if (!card.data) {
      await transaction.rollback();
      return { success: false, error: '卡片不存在' };
    }
    
    if (card.data.remain_times < useCount) {
      await transaction.rollback();
      return { success: false, error: '剩余次数不足' };
    }
    
    const now = new Date();
    
    const logResult = await transaction.collection('UsageLogs').add({
      data: {
        card_id: cardId,
        gym_name: card.data.gym_name,
        user_name: userName,
        use_date: now,
        use_count: useCount,
        cost_at_time: card.data.price_per_time,
        operator: userName,
        created_at: now
      }
    });
    
    const updateResult = await transaction.collection('Cards')
      .doc(cardId)
      .update({
        data: {
          remain_times: _.inc(-useCount),
          updated_at: now
        }
      });
    
    if (card.data.remain_times - useCount <= 0) {
      await transaction.collection('Cards')
        .doc(cardId)
        .update({
          data: {
            status: 'inactive'
          }
        });
    }
    
    await transaction.commit();
    
    return {
      success: true,
      message: '登记成功',
      logId: logResult._id,
      remainingTimes: card.data.remain_times - useCount
    };
    
  } catch (error) {
    console.error('登记失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
