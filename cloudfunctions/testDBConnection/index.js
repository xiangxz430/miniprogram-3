// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('开始测试数据库连接...');
    
    // 直接尝试查询 gnpz 集合，不使用 listCollections
    let collections = [];
    let gnpzExists = false;
    
    try {
      // 尝试获取 gnpz 集合数据
      const gnpzResult = await db.collection('gnpz').count();
      console.log('gnpz 集合数据条数:', gnpzResult.total);
      gnpzExists = true;
      collections.push('gnpz');
      
      // 尝试获取其他可能的集合
      try {
        const gnmResult = await db.collection('gnm').count();
        collections.push('gnm');
        console.log('gnm 集合数据条数:', gnmResult.total);
      } catch (e) {
        console.log('gnm 集合不存在或无法访问');
      }
    } catch (e) {
      console.log('gnpz 集合不存在或无法访问，将尝试创建');
      gnpzExists = false;
    }
    
    // 尝试查询 gnpz 集合数据
    let gnpzData = [];
    if (gnpzExists) {
      try {
        const result = await db.collection('gnpz').get();
        gnpzData = result.data;
        console.log('gnpz 集合中的数据:', gnpzData);
      } catch (error) {
        console.error('查询 gnpz 集合失败:', error);
      }
    }
    
    // 如果 gnpz 集合不存在或为空，尝试创建并添加测试数据
    if (!gnpzExists || gnpzData.length === 0) {
      try {
        if (!gnpzExists) {
          console.log('gnpz 集合不存在，但无法手动创建集合，将直接添加数据（集合会自动创建）');
        }
        
        const testData = [
          {
            gnm: 'daily_hexagram',
            wdm: '每日一挂',
            sfsy: true,
            data_id: 'TEST001'
          },
          {
            gnm: 'bazi_overview',
            wdm: '八字总运',
            sfsy: true,
            data_id: 'TEST002'
          },
          {
            gnm: 'user_profile',
            wdm: '我的',
            sfsy: true,
            data_id: 'TEST003'
          }
        ];
        
        for (const item of testData) {
          await db.collection('gnpz').add({
            data: item
          });
          console.log(`添加测试数据成功: ${item.gnm}`);
        }
        
        // 再次查询确认数据已写入
        const newResult = await db.collection('gnpz').get();
        console.log('写入后的 gnpz 集合数据:', newResult.data);
        
        gnpzData = newResult.data;
        
        if (!gnpzExists) {
          // 如果之前 gnpz 不存在，现在应该已经自动创建了
          collections.push('gnpz');
        }
      } catch (error) {
        console.error('写入测试数据失败:', error);
      }
    }
    
    return {
      code: 0,
      message: '测试完成',
      data: {
        collections: collections,
        gnpzData: gnpzData
      }
    };
  } catch (error) {
    console.error('测试过程中发生错误:', error);
    return {
      code: -1,
      message: '测试失败',
      error: error
    };
  }
}; 