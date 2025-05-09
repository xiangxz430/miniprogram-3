// app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null,
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
    }
  }
}) 