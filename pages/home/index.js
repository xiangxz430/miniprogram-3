const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    currentDate: '',
    fortuneScore: null,
    fortuneAdvice: '',
    luckLevel: {
      finance: null,
      love: null,
      health: null
    },
    dailyQuote: {
      content: '',
      author: ''
    },
    articles: []
  },

  onLoad: function() {
    // 获取当前日期
    this.setCurrentDate()
    
    // 生成随机运势数据（实际项目中应该从服务器获取）
    this.generateRandomFortune()
    
    // 获取每日一言（实际项目中应该从服务器获取）
    this.getRandomQuote()

    // 添加页面加载动画效果
    this.addLoadingAnimation()
  },
  
  onShow: function() {
    // 配置TabBar选中状态
    if (typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar()
      if (tabBar) {
        tabBar.setData({
          selected: 0
        })
      }
    }
  },
  
  // 设置当前日期
  setCurrentDate: function() {
    const date = new Date()
    const formattedDate = util.formatTime(date).split(' ')[0] // 只取日期部分
    this.setData({
      currentDate: formattedDate
    })
  },
  
  // 添加页面加载动画效果
  addLoadingAnimation: function() {
    // 可以使用wx.createAnimation等实现更复杂的动画效果
    // 这里通过CSS动画实现，不需要额外的JS代码
  },
  
  // 生成随机运势数据（模拟）
  generateRandomFortune: function() {
    // 使用日期作为种子确保当天运势固定
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    
    // 基于种子生成伪随机数
    const randomFromSeed = (max, offset = 0) => {
      const x = Math.sin(seed + offset) * 10000
      return Math.floor((x - Math.floor(x)) * max)
    }
    
    // 随机运势指数（60-99）
    const score = 60 + randomFromSeed(40)
    
    // 运势建议集合
    const adviceSet = [
      '今日宜沉稳，静心思考，忌冲动行事',
      '适合开展新项目，把握难得的机会',
      '今日人缘佳，适合社交与互动交流',
      '宜专注自我提升，避免不必要的冲突',
      '可能有意外收获，保持开放的心态',
      '适合深度思考，理清思路和计划',
      '宜放松心情，享受生活的美好时刻',
      '今日创造力旺盛，可尝试艺术创作'
    ]
    
    // 运势等级集合
    const levelSet = ['较差', '一般', '良好', '很好', '极佳']
    
    // 随机选择建议
    const adviceIndex = randomFromSeed(adviceSet.length)
    const advice = adviceSet[adviceIndex]
    
    // 基于总分生成各方面运势评级
    const getLevelByScore = (baseScore, offset) => {
      let adjustedScore = baseScore + randomFromSeed(20, offset) - 10
      adjustedScore = Math.max(60, Math.min(99, adjustedScore))
      const levelIndex = Math.floor((adjustedScore - 60) / 8)
      return levelSet[Math.min(levelIndex, levelSet.length - 1)]
    }
    
    // 生成各方面运势
    const finance = getLevelByScore(score, 1)
    const love = getLevelByScore(score, 2)
    const health = getLevelByScore(score, 3)
    
    this.setData({
      fortuneScore: score,
      fortuneAdvice: advice,
      luckLevel: {
        finance: finance,
        love: love,
        health: health
      }
    })
  },
  
  // 获取随机名言（模拟）
  getRandomQuote: function() {
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    
    const quotes = [
      {
        content: '人生如棋，落子无悔。把握当下，静观未来。',
        author: '古谚语'
      },
      {
        content: '命由己造，相由心生，境随心转，相随心变。',
        author: '佛家智慧'
      },
      {
        content: '知命而不惑，知天而不怨，知人而不厌。',
        author: '孔子'
      },
      {
        content: '一花一世界，一叶一菩提，一念一清净，一行一山河。',
        author: '华严经'
      },
      {
        content: '万事万物皆有定数，但命运掌握在自己手中。',
        author: '道家思想'
      },
      {
        content: '不问收获，但问耕耘，静待花开，随缘随喜。',
        author: '禅宗智慧'
      },
      {
        content: '万法由心造，心静自然清。不以物喜，不以己悲。',
        author: '佛学箴言'
      }
    ]
    
    // 基于日期选择固定的名言，确保当天显示固定内容
    const index = seed % quotes.length
    const randomQuote = quotes[index]
    
    this.setData({
      dailyQuote: randomQuote
    })
  },
  
  // 查看更多运势
  viewMoreFortune: function() {
    wx.navigateTo({
      url: '/pages/daily_hexagram/index'
    })
  },
  
  // 跳转到MBTI测试页面
  goToMbtiTest: function() {
    wx.navigateTo({
      url: '/pages/mbti_personality/index'
    })
  },
  
  // 分享功能
  onShareAppMessage: function() {
    return {
      title: '每日运势 - 探索命理的奥秘',
      path: '/pages/home/index',
      imageUrl: '/images/share.jpg' // 这里需要提供分享图片
    }
  },
  
  // 下拉刷新
  onPullDownRefresh: function() {
    // 重新生成运势数据
    this.generateRandomFortune()
    this.getRandomQuote()
    
    setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 1000)
  }
}) 