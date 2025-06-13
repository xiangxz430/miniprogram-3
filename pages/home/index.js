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
    articles: [],
    autoCloseTimer: null,
    countDown: 10,
    pageHidden: false // 控制页面显示/隐藏
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
    
    // 设置10秒后自动跳转
    this.setAutoClose()
  },
  
  onShow: function() {
    // 配置TabBar选中状态 - 让自动检测处理，不手动设置
    if (typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar()
      if (tabBar) {
        // 调用updateCurrentTab让它自动检测当前页面
        tabBar.updateCurrentTab();
      }
    }
  },
  
  onHide: function() {
    // 页面隐藏时清除定时器
    this.clearAutoCloseTimer()
  },
  
  onUnload: function() {
    // 页面卸载时清除定时器
    this.clearAutoCloseTimer()
  },
  
  // 设置自动关闭定时器
  setAutoClose: function() {
    // 清除可能存在的旧定时器
    this.clearAutoCloseTimer()
    
    // 初始化倒计时
    this.setData({
      countDown: 10,
      pageHidden: false
    })
    
    // 创建倒计时定时器
    const countDownInterval = setInterval(() => {
      const currentCount = this.data.countDown - 1
      
      if (currentCount <= 0) {
        // 倒计时结束，清除间隔定时器
        clearInterval(countDownInterval)
        
        // 执行页面跳转
        this.navigateToNextPage()
      } else {
        // 更新倒计时
        this.setData({
          countDown: currentCount
        })
      }
    }, 1000)
    
    // 保存定时器ID以便后续清除
    this.setData({
      autoCloseTimer: countDownInterval
    })
  },
  
  // 关闭首页并跳转到下一个页面
  closeHomePage: function() {
    // 清除自动关闭定时器
    this.clearAutoCloseTimer()
    
    // 隐藏页面内容
    this.setData({
      pageHidden: true
    })
    
    // 执行页面跳转
    setTimeout(() => {
      this.navigateToNextPage()
    }, 100)
  },
  
  // 跳转到下一个页面
  navigateToNextPage: function() {
    // 获取应用实例
    const app = getApp()
    // 检查是否有TabBar配置
    if (app.globalData && app.globalData.tabConfig && app.globalData.tabConfig.length > 0) {
      // 获取TabBar配置
      const tabConfig = app.globalData.tabConfig
      
      // 寻找除了首页以外的第一个TabBar页面
      const currentPagePath = 'pages/home/index'
      let targetTab = null
      
      for (let tab of tabConfig) {
        // 跳过当前页面(首页)
        if (tab.pagePath !== currentPagePath) {
          targetTab = tab
          break
        }
      }
      
      // 如果找到了合适的目标页面
      if (targetTab) {
        console.log('关闭首页，跳转到:', targetTab.pagePath)
        wx.switchTab({
          url: '/' + targetTab.pagePath
        })
      } else {
        // 如果没有其他TabBar页面，跳转到首页的下一级页面或者一个通用的页面
        console.log('没有找到合适的TabBar页面，跳转到通用页面')
        wx.navigateTo({
          url: '/pages/mbti_personality/index'
        })
      }
    } else {
      // 如果没有TabBar配置，则跳转到默认页面
      console.log('没有TabBar配置，跳转到默认页面')
      // 考虑到你提到每日一挂可能不存在，这里使用MBTI测试页面作为默认备选
      wx.navigateTo({
        url: '/pages/mbti_personality/index'
      })
    }
  },
  
  // 清除自动关闭定时器
  clearAutoCloseTimer: function() {
    if (this.data.autoCloseTimer) {
      clearInterval(this.data.autoCloseTimer)
      this.setData({
        autoCloseTimer: null
      })
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
    // 取消自动跳转
    this.clearAutoCloseTimer()
    
    wx.navigateTo({
      url: '/pages/daily_hexagram/index'
    })
  },
  
  // 跳转到MBTI测试页面
  goToMbtiTest: function() {
    // 取消自动跳转
    this.clearAutoCloseTimer()
    
    wx.navigateTo({
      url: '/pages/mbti_personality/index'
    })
  },
  
  // 分享给朋友
  onShareAppMessage: function() {
    return {
      title: '性格测算 - 探索你的人格特质',
      path: '/pages/home/index',
      // imageUrl: '/images/share.jpg' // 这里需要提供分享图片
    };
  },
  
  // 下拉刷新
  onPullDownRefresh: function() {
    // 取消自动跳转
    this.clearAutoCloseTimer()
    
    // 重新生成运势数据
    this.generateRandomFortune()
    this.getRandomQuote()
    
    // 重新设置自动跳转
    this.setAutoClose()
    
    setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 1000)
  }
}) 