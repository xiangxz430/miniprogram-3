/**
 * TabBar配置工具函数
 * 由于微信小程序不支持完全动态的TabBar配置，
 * 我们采取"半动态"的方式，即:
 * 1. 所有可能的页面路径都预先注册在app.json中
 * 2. 从云数据库获取配置决定显示哪些tab以及显示顺序
 */

// 将云数据库配置转换为tabBar配置
const convertToTabBarConfig = (dbConfig) => {
  console.log('接收到的dbConfig数据:', JSON.stringify(dbConfig));
  
  if (!dbConfig || !Array.isArray(dbConfig) || dbConfig.length === 0) {
    console.warn('dbConfig无效或为空');
    return null;
  }
  
  // 直接返回带有 index 属性的配置
  if (dbConfig.every(item => typeof item.index === 'number')) {
    console.log('dbConfig已包含index属性，直接使用');
    return dbConfig;
  }
  
  // 页面路径映射表（gnm字段值 -> 实际页面路径）
  const pathMap = {
    'home': 'pages/home/index',
    'daily_hexagram': 'pages/daily_hexagram/index',
    'bazi_overview': 'pages/bazi_overview/index',
    'mbti_personality': 'pages/mbti_personality/index',
    'user_profile': 'pages/user_profile/index'
  };
  
  // 图标映射表（gnm字段值 -> 图标名称）
  const iconMap = {
    'home': 'home',
    'daily_hexagram': 'hexagram',
    'bazi_overview': 'bazi',
    'mbti_personality': 'mbti',
    'user_profile': 'user'
  };
  
  // 文本映射表（gnm字段值 -> 显示文本）
  const textMap = {
    'home': '首页',
    'daily_hexagram': '每日一挂',
    'bazi_overview': '八字总运',
    'mbti_personality': 'MBTI测试',
    'user_profile': '我的'
  };
  
  // 索引映射表（gnm字段值 -> 索引）
  const indexMap = {
    'home': 0,
    'daily_hexagram': 1,
    'bazi_overview': 2,
    'mbti_personality': 3,
    'user_profile': 4
  };
  
  // 转换配置
  const result = dbConfig.map(item => {
    console.log('处理item:', JSON.stringify(item));
    const gnm = item.gnm || '';
    return {
      index: indexMap[gnm] !== undefined ? indexMap[gnm] : 0,
      pagePath: pathMap[gnm] || `pages/${gnm}/index`,
      text: item.wdm || textMap[gnm] || gnm,
      iconPath: `images/icons/${iconMap[gnm] || gnm}.png`,
      selectedIconPath: `images/icons/${iconMap[gnm] || gnm}.png`
    };
  }).filter(item => {
    // 过滤掉无效的配置
    const pageExists = !!item.pagePath;
    if (!pageExists) {
      console.warn(`页面 ${item.pagePath} 不存在，已从TabBar中移除`);
    }
    return pageExists;
  });
  
  console.log('转换后的tabConfig:', JSON.stringify(result));
  return result;
};

// 应用TabBar配置
const applyTabBarStyle = () => {
  return new Promise((resolve, reject) => {
    try {
      const app = getApp();
      const tabConfig = app.globalData.tabConfig || [];
      
      console.log('开始应用TabBar样式, 配置:', JSON.stringify(tabConfig));
      
      if (!tabConfig || !Array.isArray(tabConfig) || tabConfig.length === 0) {
        console.warn('TabBar配置为空，不应用任何样式');
        resolve(false);
        return;
      }
      
      // 设置TabBar样式（颜色等）
      wx.setTabBarStyle({
        color: "#94a3b8",
        selectedColor: "#3b82f6",
        backgroundColor: "#ffffff",
        borderStyle: "white",
        success: () => {
          console.log('设置TabBar样式成功');
          
          // 使用Promise.all处理所有TabBar项的设置
          const promises = [];
          
          // 设置每个TabBar项（使用配置中的index）
          tabConfig.forEach(item => {
            // 确保有index属性
            if (typeof item.index !== 'number') {
              console.warn(`TabBar项缺少有效的index属性:`, JSON.stringify(item));
              return;
            }
            
            const promise = new Promise((resolveItem) => {
              // 设置TabBar项内容
              console.log(`设置TabBar项 ${item.index}:`, JSON.stringify(item));
              
              wx.setTabBarItem({
                index: item.index,
                text: item.text,
                iconPath: item.iconPath,
                selectedIconPath: item.selectedIconPath,
                success: () => {
                  console.log(`设置TabBar项 ${item.index} 成功`);
                  resolveItem(true);
                },
                fail: (err) => {
                  console.error(`设置TabBar项 ${item.index} 失败:`, err);
                  // 记录完整错误信息
                  console.error('错误详情:', JSON.stringify(err));
                  resolveItem(false);
                }
              });
            });
            
            promises.push(promise);
          });
          
          // 等待所有TabBar项操作完成
          Promise.all(promises).then((results) => {
            const allSuccessful = results.every(result => result === true);
            console.log('所有TabBar项设置完成, 全部成功:', allSuccessful);
            resolve(allSuccessful);
          });
        },
        fail: (err) => {
          console.error('设置TabBar样式失败:', err);
          reject(err);
        }
      });
    } catch (error) {
      console.error('应用TabBar样式时发生错误:', error);
      reject(error);
    }
  });
};

module.exports = {
  convertToTabBarConfig,
  applyTabBarStyle
}; 