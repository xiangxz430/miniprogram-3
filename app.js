// app.js
const tabConfigUtil = require('./utils/tabConfig');

App({
  onLaunch: function () {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-3go3cn2v0cb22666', // 确保这个环境ID是正确的
        traceUser: true
      });
      console.log('云环境初始化成功');
      
      // 加载tab栏配置
      this.loadTabConfig();
    } else {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    }
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 加载用户设置
    this.loadUserSettings();
  },

  // 加载tab栏配置
  loadTabConfig: function() {
    console.log('开始加载tab栏配置...');
    
    // 默认清空TabBar配置
    this.globalData.tabConfig = [];
    
    // 使用Promise处理异步流程
    const loadConfigFromCloud = () => {
      return new Promise((resolve) => {
        console.log('从云函数获取tab配置...');
        wx.cloud.callFunction({
          name: 'getTabConfig',
          data: { timestamp: new Date().getTime() }, // 添加时间戳防止缓存
          success: res => {
            console.log('获取tab配置成功, 原始返回:', JSON.stringify(res.result));
            
            // 检查是否包含MBTI功能
            if (res.result && res.result.data) {
              const hasMBTI = res.result.data.some(item => 
                item.pagePath && item.pagePath.includes('mbti_personality')
              );
              console.log('配置中是否包含MBTI测试功能:', hasMBTI);
              
              // 打印每个Tab项
              console.log('配置项详情:');
              res.result.data.forEach((item, index) => {
                console.log(`Tab项 ${index+1}: 路径=${item.pagePath}, 文本=${item.text}, 索引=${item.index}`);
              });
            }
            
            if (res.result && res.result.code === 0 && res.result.data && res.result.data.length > 0) {
              const tabConfig = res.result.data;
              
              // 检查每个配置项是否具有必要的属性
              const validConfig = tabConfig.every(item => 
                item.index !== undefined && 
                item.pagePath && 
                item.text && 
                item.iconPath && 
                item.selectedIconPath
              );
              
              if (validConfig) {
                // 更新全局数据
                this.globalData.tabConfig = tabConfig;
                // 缓存到本地
                wx.setStorageSync('tabConfig', tabConfig);
                console.log('已更新全局数据并缓存有效配置');
                
                // 触发自定义TabBar更新
                this.updateCustomTabBar();
                resolve(tabConfig);
              } else {
                console.error('云函数返回的配置项缺少必要属性');
                wx.showToast({
                  title: '配置项缺少必要属性',
                  icon: 'none',
                  duration: 3000
                });
                // 如果数据不合法，清空TabBar配置
                this.globalData.tabConfig = [];
                wx.setStorageSync('tabConfig', []);
                this.updateCustomTabBar();
                resolve([]);
              }
            } else {
              console.error('云函数返回结果格式不正确或数据为空:', res.result);
              // 显示具体的错误信息
              if (res.result && res.result.message) {
                wx.showToast({
                  title: res.result.message,
                  icon: 'none',
                  duration: 3000
                });
              } else {
                wx.showToast({
                  title: '云函数返回数据格式有误或为空',
                  icon: 'none',
                  duration: 3000
                });
              }
              // 清空TabBar配置
              this.globalData.tabConfig = [];
              wx.setStorageSync('tabConfig', []);
              this.updateCustomTabBar();
              resolve([]);
            }
          },
          fail: err => {
            console.error('获取tab配置失败:', err);
            wx.showToast({
              title: '获取TabBar配置失败: ' + (err.errMsg || JSON.stringify(err)),
              icon: 'none',
              duration: 3000
            });
            // 失败时也清空TabBar配置
            this.globalData.tabConfig = [];
            wx.setStorageSync('tabConfig', []);
            this.updateCustomTabBar();
            resolve([]);
          }
        });
      });
    };
    
    // 直接从云端加载配置
    loadConfigFromCloud().then(tabConfig => {
      if (!tabConfig || tabConfig.length === 0) {
        console.log('未能获取云数据库TabBar配置或配置为空数组');
        // 不显示任何TabBar
        this.globalData.tabConfig = [];
        wx.setStorageSync('tabConfig', []);
        this.updateCustomTabBar();
      }
    });
  },
  
  // 更新自定义TabBar
  updateCustomTabBar: function() {
    // 获取当前页面栈
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const page = pages[pages.length - 1];
      // 如果页面有getTabBar方法，则调用获取自定义tabBar实例
      if (typeof page.getTabBar === 'function') {
        const tabBar = page.getTabBar();
        // 如果实例存在，则通过setData更新数据
        if (tabBar) {
          console.log('更新自定义TabBar数据:', this.globalData.tabConfig);
          tabBar.setData({
            tabConfig: this.globalData.tabConfig,
            loaded: this.globalData.tabConfig && this.globalData.tabConfig.length > 0
          }, () => {
            // 数据更新完成后，触发样式更新
            if (tabBar.updateTabBarStyle) {
              tabBar.updateTabBarStyle();
            }
            // 更新当前选中状态
          tabBar.updateCurrentTab();
            console.log('TabBar数据和样式更新完成');
          });
        }
      }
    }
  },

  // 加载用户设置
  loadUserSettings: function() {
    const userSettings = wx.getStorageSync('userSettings');
    if (userSettings) {
      this.globalData.userSettings = userSettings;
      // 确保位置信息也同步到全局数据
      if (userSettings.currentLocation) {
        this.globalData.userSettings.currentLocation = userSettings.currentLocation;
        console.log('全局数据已加载位置信息:', userSettings.currentLocation);
      }
    }
  },

  // 更新每日一挂数据（由每日一挂页面调用）
  updateHexagramInfo: function(hexagramInfo) {
    this.globalData.hexagramInfo = hexagramInfo;
    
    // 同时更新星座运势信息
    if (hexagramInfo && this.globalData.userSettings) {
      // 基于用户的星座生成匹配的运势信息
      const zodiac = this.globalData.userSettings.zodiac || '天秤座';
      this.generateHoroscopeInfo(zodiac, hexagramInfo);
    }
  },

  // 生成星座运势信息
  generateHoroscopeInfo: function(zodiac, hexagramInfo) {
    // 这里基于卦象信息和星座，生成匹配的运势
    // 实际项目中可能由AI生成或从API获取
    
    // 简单示例：基于卦象名称的首字判断运势
    let rating = 3; // 默认中等
    
    if (hexagramInfo && hexagramInfo.name) {
      const firstChar = hexagramInfo.name.charAt(0);
      
      // 简单规则：根据卦名首字得到星级
      const goodChars = ['泰', '乾', '坤', '兑', '震'];
      const badChars = ['否', '艮', '坎', '离'];
      
      if (goodChars.includes(firstChar)) {
        rating = 4 + Math.floor(Math.random() * 2); // 4-5星
      } else if (badChars.includes(firstChar)) {
        rating = 1 + Math.floor(Math.random() * 2); // 1-2星
      } else {
        rating = 3; // 中等
      }
    }
    
    // 设置星座运势信息
    this.globalData.horoscopeInfo = {
      zodiac: zodiac,
      rating: rating,
      description: this.getHoroscopeDescription(rating),
      date: new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  },

  // 获取运势描述
  getHoroscopeDescription: function(rating) {
    const descriptions = [
      '今日运势不佳，宜静不宜动，谨慎行事。',
      '今日运势一般，平常心对待，不宜冒险。',
      '今日运势平平，顺其自然，保持平和心态。',
      '今日运势不错，可把握机会，适合社交活动。',
      '今日运势极佳，诸事顺利，适合重要决策。'
    ];
    
    return descriptions[rating - 1];
  },

  globalData: {
    userInfo: null,
    userSettings: {
      birthdate: '1990年8月15日',
      zodiac: '天秤座',
      mbti: 'INFJ',
      birthplace: '北京市',
      currentLocation: ''
    },
    // Tab栏配置
    tabConfig: [],
    // 每日一挂相关信息
    hexagramInfo: {
      date: '2023年11月10日 星期五',
      time: '11:24:36',
      name: '泰卦',
      description: '地天泰 • 平安亨通',
      symbol: '䷊',
      meaning: '《焦氏易林》曰："泰卦，明夷致泰，物极必反，无往不复。至微而着，至幽而明。是以乱而治，危而安，塞而通，阂而泰。"',
      finance: '财运顺畅，适合投资与理财。财位在东南方，可佩戴黄色饰品增强运势。',
      love: '桃花位在西南方，今日易遇贵人，社交活动顺利。',
      compass: {
        finance: '东南',
        love: '西南',
        danger: '东北'
      },
      tips: {
        clothing: '今日宜穿浅蓝色系，有助于提升财运。',
        lucky: ['投资理财', '社交活动', '短途旅行'],
        unlucky: ['争执冲突', '高风险决策', '大额消费']
      }
    },
    // 星座运势信息
    horoscopeInfo: {
      zodiac: '天秤座',
      rating: 4,
      description: '今日运势不错，可把握机会，适合社交活动。',
      date: '2023年11月10日'
    }
  }
}) 