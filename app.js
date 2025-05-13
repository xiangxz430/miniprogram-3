// app.js
App({
  onLaunch: function () {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-3go3cn2v0cb22666', // 已替换为你的实际环境ID
        traceUser: true
      });
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

  // 加载用户设置
  loadUserSettings: function() {
    const userSettings = wx.getStorageSync('userSettings');
    if (userSettings) {
      this.globalData.userSettings = userSettings;
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