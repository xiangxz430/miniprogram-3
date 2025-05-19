// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('开始查询gnpz集合数据...');
    
    // 查询gnpz2表
    const { data } = await db.collection('gnpz2').where({
      sfsy: true // 是否使用 = 是
    }).get();
    
    console.log('查询到的gnpz记录:', JSON.stringify(data));
    console.log('查询到的记录数量:', data.length);
    
    // 如果没有数据，返回错误信息，让客户端知道需要配置数据库
    if (!data || data.length === 0) {
      console.log('未找到配置数据，返回错误信息');
      return {
        code: -1,
        data: null,
        message: '云数据库中未找到有效的TabBar配置数据，请确保gnpz集合中存在sfsy=true的记录'
      };
    }
    
    // 处理数据，确保每个记录都有必需的字段
    const tabBarItems = data.map(item => {
      // 确保每个记录有必需的字段
      if (!item.pagePath || !item.text || !item.iconPath || !item.selectedIconPath) {
        console.error('记录缺少必需字段:', item);
        return null;
      }
      
      // 返回格式化后的TabBar项
      return {
        index: item.index || 0,
        pagePath: item.pagePath,
        text: item.text,
        iconPath: item.iconPath,
        selectedIconPath: item.selectedIconPath
      };
    }).filter(item => item !== null); // 过滤掉无效的记录
    
    // 按index排序
    tabBarItems.sort((a, b) => a.index - b.index);
    
    console.log('格式化后的TabBar项数量:', tabBarItems.length);
    console.log('格式化后的TabBar项详情:', JSON.stringify(tabBarItems));
    
    // 如果过滤后没有任何项目，返回错误信息
    if (tabBarItems.length === 0) {
      console.error('过滤后没有有效的TabBar项');
      return {
        code: -1,
        data: null,
        message: '云数据库中的配置缺少必要字段，请检查每条记录是否包含pagePath、text、iconPath和selectedIconPath字段'
      };
    }
    
    console.log('最终TabBar配置:', JSON.stringify(tabBarItems));
    
    return {
      code: 0,
      data: tabBarItems,
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