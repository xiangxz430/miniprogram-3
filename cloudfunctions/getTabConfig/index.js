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
    
    // 查询gnpz表而不是gnm表
    const { data } = await db.collection('gnpz').where({
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
    
    // 预定义的TabBar项，顺序与app.json中一致
    const predefinedTabBarItems = [
      {
        index: 0,
        id: 'home',
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'images/icons/home.png',
        selectedIconPath: 'images/icons/home.png'
      },
      {
        index: 1,
        id: 'daily_hexagram',
        pagePath: 'pages/daily_hexagram/index',
        text: '每日一挂',
        iconPath: 'images/icons/hexagram.png',
        selectedIconPath: 'images/icons/hexagram.png'
      },
      {
        index: 2,
        id: 'bazi_overview',
        pagePath: 'pages/bazi_overview/index',
        text: '八字总运',
        iconPath: 'images/icons/bazi.png',
        selectedIconPath: 'images/icons/bazi.png'
      },
      {
        index: 3,
        id: 'mbti_personality',
        pagePath: 'pages/mbti_personality/index',
        text: 'MBTI测试',
        iconPath: 'images/icons/mbti.png',
        selectedIconPath: 'images/icons/mbti.png'
      },
      {
        index: 4,
        id: 'user_profile',
        pagePath: 'pages/user_profile/index',
        text: '我的',
        iconPath: 'images/icons/user.png',
        selectedIconPath: 'images/icons/user.png'
      }
    ];
    
    console.log('预定义的TabBar项:', JSON.stringify(predefinedTabBarItems));
    
    // 从数据库记录中提取gnm值列表
    const enabledIds = data.map(item => item.gnm);
    console.log('启用的功能ID列表:', JSON.stringify(enabledIds));
    
    // 打印每个预定义项是否在启用列表中
    predefinedTabBarItems.forEach(item => {
      console.log(`检查ID: ${item.id}, 路径: ${item.pagePath}, 是否在启用列表中: ${enabledIds.includes(item.id)}`);
    });
    
    // 根据数据库记录过滤predefinedTabBarItems
    const filteredTabBarItems = predefinedTabBarItems.filter(item => {
      const isEnabled = enabledIds.includes(item.id);
      console.log(`过滤项 - ID: ${item.id}, 是否启用: ${isEnabled}`);
      return isEnabled;
    }).map(item => {
      // 查找对应的数据库记录，以便使用自定义文本
      const dbItem = data.find(d => d.gnm === item.id);
      console.log(`处理项 - ID: ${item.id}, 找到匹配的数据库项: ${dbItem ? '是' : '否'}`);
      
      if (dbItem) {
        console.log(`数据库项详情 - gnm: ${dbItem.gnm}, wdm: ${dbItem.wdm}, sfsy: ${dbItem.sfsy}`);
        if (dbItem.wdm) {
          console.log(`使用自定义文本: ${dbItem.wdm} 替换原文本: ${item.text}`);
          item.text = dbItem.wdm;
        }
      }
      
      const result = {
        index: item.index,
        pagePath: item.pagePath,
        text: item.text,
        iconPath: item.iconPath,
        selectedIconPath: item.selectedIconPath
      };
      
      console.log(`最终项配置 - 索引: ${result.index}, 路径: ${result.pagePath}, 文本: ${result.text}`);
      return result;
    });
    
    console.log('过滤后的TabBar项数量:', filteredTabBarItems.length);
    console.log('过滤后的TabBar项详情:', JSON.stringify(filteredTabBarItems));
    
    // 不重新分配索引，让每个TabBar项保持其原始索引
    // 这样虽然索引可能不连续，但确保了TabBar项的顺序与app.json中的顺序一致
    
    // 如果过滤后没有任何项目，返回错误信息
    if (filteredTabBarItems.length === 0) {
      console.error('过滤后没有有效的TabBar项');
      return {
        code: -1,
        data: null,
        message: '云数据库中的配置无法匹配到任何有效的TabBar项，请检查gnm字段值是否正确'
      };
    }
    
    console.log('最终TabBar配置:', JSON.stringify(filteredTabBarItems));
    
    return {
      code: 0,
      data: filteredTabBarItems,
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