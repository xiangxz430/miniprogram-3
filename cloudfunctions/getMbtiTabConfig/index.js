// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('开始查询MBTI标签页配置数据...');
    
    // 查询gnpz3表中的MBTI标签配置
    const { data } = await db.collection('gnpz3').where({
      sfsy: true        // 是否使用 = 是
    }).get();
    
    console.log('查询到的MBTI标签配置记录:', JSON.stringify(data));
    console.log('查询到的记录数量:', data.length);
    
    // 如果没有数据，返回错误信息
    if (!data || data.length === 0) {
      console.log('未找到配置数据，返回错误信息');
      return {
        code: -1,
        data: null,
        message: '云数据库中未找到有效的MBTI标签页配置数据'
      };
    }
    
    // 处理数据，确保每个记录都有必需的字段
    const tabItems = data.map(item => {
      // 确保每个记录有必需的字段
      if (!item.text || typeof item.index !== 'number') {
        console.error('记录缺少必需字段:', item);
        return null;
      }
      
      // 返回格式化后的标签项
      return {
        index: item.index,
        text: item.text,
        key: item.key || item.text // 如果没有key，使用text作为key
      };
    }).filter(item => item !== null); // 过滤掉无效的记录
    
    // 按index排序
    tabItems.sort((a, b) => a.index - b.index);
    
    console.log('格式化后的标签项数量:', tabItems.length);
    console.log('格式化后的标签项详情:', JSON.stringify(tabItems));
    
    // 如果过滤后没有任何项目，返回错误信息
    if (tabItems.length === 0) {
      console.error('过滤后没有有效的标签项');
      return {
        code: -1,
        data: null,
        message: '云数据库中的配置缺少必要字段，请检查每条记录是否包含text和index字段'
      };
    }
    
    return {
      code: 0,
      data: tabItems,
      message: '获取成功'
    };
  } catch (error) {
    console.error('查询发生错误:', error);
    return {
      code: -1,
      data: null,
      message: '获取失败',
      error: error
    };
  }
} 