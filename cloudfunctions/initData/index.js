const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    const initialCards = [
      {
        gym_name: 'CAMP4',
        owner_name: '阿卓',
        price_per_time: 95,
        total_times: 10,
        remain_times: 4,
        expiry_date: new Date('2025-06-30T23:59:59.000Z'),
        phone: '13800138000',
        shared_with: ['小王', '小李'],
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        gym_name: '日坛公园攀岩场',
        owner_name: '周周',
        price_per_time: 88,
        total_times: 15,
        remain_times: 12,
        expiry_date: new Date('2025-08-15T23:59:59.000Z'),
        phone: '13900139000',
        shared_with: ['阿卓'],
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        gym_name: 'CAMP4',
        owner_name: '小王',
        price_per_time: 95,
        total_times: 20,
        remain_times: 18,
        expiry_date: new Date('2025-09-30T23:59:59.000Z'),
        phone: '13600136000',
        shared_with: ['阿卓'],
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        gym_name: 'Boulder Plus',
        owner_name: '小李',
        price_per_time: 85,
        total_times: 30,
        remain_times: 25,
        expiry_date: new Date('2025-07-31T23:59:59.000Z'),
        phone: '13700137000',
        shared_with: ['阿卓', '周周'],
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        gym_name: '日坛公园攀岩场',
        owner_name: '阿卓',
        price_per_time: 88,
        total_times: 10,
        remain_times: 0,
        expiry_date: new Date('2025-01-15T23:59:59.000Z'),
        phone: '13800138000',
        shared_with: [],
        status: 'inactive',
        created_at: new Date('2024-10-01'),
        updated_at: new Date()
      },
      {
        gym_name: 'CAMP4',
        owner_name: '周周',
        price_per_time: 95,
        total_times: 10,
        remain_times: 2,
        expiry_date: new Date('2025-03-15T23:59:59.000Z'),
        phone: '13900139000',
        shared_with: ['小王'],
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    const cardResults = await Promise.all(
      initialCards.map(card => db.collection('Cards').add({ data: card }))
    );
    
    const usageLogs = [
      {
        card_id: cardResults[0]._id,
        gym_name: 'CAMP4',
        user_name: '阿卓',
        use_date: new Date('2025-01-20T10:30:00.000Z'),
        use_count: 1,
        cost_at_time: 95,
        operator: '阿卓',
        created_at: new Date()
      },
      {
        card_id: cardResults[0]._id,
        gym_name: 'CAMP4',
        user_name: '小王',
        use_date: new Date('2025-01-22T14:00:00.000Z'),
        use_count: 1,
        cost_at_time: 95,
        operator: '阿卓',
        created_at: new Date()
      },
      {
        card_id: cardResults[0]._id,
        gym_name: 'CAMP4',
        user_name: '阿卓',
        use_date: new Date('2025-01-25T09:00:00.000Z'),
        use_count: 2,
        cost_at_time: 95,
        operator: '阿卓',
        created_at: new Date()
      },
      {
        card_id: cardResults[1]._id,
        gym_name: '日坛公园攀岩场',
        user_name: '周周',
        use_date: new Date('2025-01-18T11:00:00.000Z'),
        use_count: 1,
        cost_at_time: 88,
        operator: '周周',
        created_at: new Date()
      },
      {
        card_id: cardResults[1]._id,
        gym_name: '日坛公园攀岩场',
        user_name: '阿卓',
        use_date: new Date('2025-01-23T16:30:00.000Z'),
        use_count: 1,
        cost_at_time: 88,
        operator: '周周',
        created_at: new Date()
      },
      {
        card_id: cardResults[1]._id,
        gym_name: '日坛公园攀岩场',
        user_name: '周周',
        use_date: new Date('2025-01-28T10:15:00.000Z'),
        use_count: 1,
        cost_at_time: 88,
        operator: '周周',
        created_at: new Date()
      }
    ];
    
    await Promise.all(
      usageLogs.map(log => db.collection('UsageLogs').add({ data: log }))
    );
    
    return {
      success: true,
      message: '初始化成功',
      cardsCreated: initialCards.length,
      logsCreated: usageLogs.length
    };
    
  } catch (error) {
    console.error('初始化数据失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
