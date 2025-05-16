// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('开始初始化TabBar配置...');
    
    // 检查是否存在配置
    const { data: existingConfigs } = await db.collection('gnpz').get();
    console.log('查询到现有配置数量:', existingConfigs.length);
    
    // 如果已存在配置，先删除
    if (existingConfigs.length > 0) {
      console.log('清除现有配置...');
      
      // 逐个删除现有配置
      for (const config of existingConfigs) {
        await db.collection('gnpz').doc(config._id).remove();
      }
      
      console.log('已清除所有现有配置');
    }
    
    // 要添加的功能项
    const features = [
      {
        gnm: 'home',  // 功能名称
        wdm: '首页',  // 文字描述名
        sfsy: true    // 是否使用
      },
      {
        gnm: 'daily_hexagram',
        wdm: '每日一挂',
        sfsy: true
      },
      {
        gnm: 'bazi_overview',
        wdm: '八字总运',
        sfsy: true
      },
      {
        gnm: 'mbti_personality',
        wdm: 'MBTI测试',
        sfsy: true
      },
      {
        gnm: 'user_profile',
        wdm: '我的',
        sfsy: true
      }
    ];
    
    console.log('准备添加的配置项:', JSON.stringify(features));
    
    // 添加新配置
    const addPromises = features.map(feature => {
      return db.collection('gnpz').add({
        data: feature
      });
    });
    
    const results = await Promise.all(addPromises);
    console.log('添加结果:', JSON.stringify(results));
    
    return {
      code: 0,
      message: '初始化TabBar配置成功',
      data: {
        added: features.length,
        results
      }
    };
  } catch (error) {
    console.error('初始化失败:', error);
    return {
      code: -1,
      message: '初始化TabBar配置失败',
      error: error
    };
  }
} 