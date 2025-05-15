const app = getApp()
const questions = require('./questions.js')
const mbtiTypes = require('./mbti-types.js')
const mbtiData = require('../../utils/mbtiData')

console.log('加载MBTI页面相关资源...');
console.log('questions数量:', mbtiData.questions.length);
console.log('types数量:', Object.keys(mbtiData.types).length);

Page({
  data: {
    activeTab: 0,           // 当前激活的标签页（0: 性格测试, 1: 玄学人格模型）
    hasTestResult: false,   // 是否有测试结果
    isTestActive: false,    // 是否正在测试中
    isRetesting: false,     // 是否正在重新测试
    currentQuestion: 0,     // 当前题目索引
    selectedOption: '',     // 当前选中的选项
    questions: mbtiData.questions,
    mbtiResult: {          // MBTI测试结果
      code: '',            // MBTI类型代码
      name: '',            // MBTI类型名称
      percent: 0,          // 该类型的人群占比
      description: '',     // 类型描述
      scores: {           // 各维度得分
        I: 0, E: 0,
        N: 0, S: 0,
        T: 0, F: 0,
        J: 0, P: 0
      },
      functions: [],      // 认知功能栈
      socialMask: {       // 社会面具
        code: '',
        name: ''
      },
      careers: [],        // 适合的职业
      directions: []      // 工作方位
    },
    answers: {},
    currentStep: 'welcome', // welcome, testing, result
    currentQuestionIndex: 0,
    scores: {
      EI: 0,
      SN: 0,
      TF: 0,
      JP: 0
    },
    result: null,
    testHistory: [],
    typeDistribution: [],
    loading: false,
    testCompleted: false,
    modelData: {
      nativeType: 'INTJ',
      nativeName: '建筑师',
      nativeDescription: '战略性思考者，擅长发现模式，开发创新解决方案',
      socialType: 'ENTJ',
      socialName: '统帅',
      socialDescription: '在社交环境中表现出领导特质，高效组织者',
      industries: [
        { name: '软件开发', icon: 'icon-code' },
        { name: '系统设计', icon: 'icon-architecture' },
        { name: '科学研究', icon: 'icon-research' },
        { name: '战略咨询', icon: 'icon-strategy' }
      ],
      directions: [
        { name: '东南方', type: 'good' },
        { name: '西北方', type: 'good' },
        { name: '东北方', type: 'bad' },
        { name: '西南方', type: 'bad' }
      ],
      directionTip: '东南方向适合设立工作台，有助于提升思考能力和创造力。'
    }
  },

  onLoad() {
    // 从mbtiData加载问题
    console.log('从mbtiData加载问题...');
    this.setData({
      questions: mbtiData.questions,
      activeTab: 0  // 确保默认选中"性格测试"标签页
    })
    
    this.loadLatestResult()
    this.loadTestHistory()
    this.loadTypeDistribution()

    // 初始化模型数据（假数据）
    this.setData({
      modelData: {
        nativeType: 'INTJ',
        nativeName: '建筑师',
        nativeDescription: '战略性思考者，擅长发现模式，开发创新解决方案',
        socialType: 'ENTJ',
        socialName: '统帅',
        socialDescription: '在社交环境中表现出领导特质，高效组织者',
        industries: [
          { name: '软件开发', icon: 'icon-code' },
          { name: '系统设计', icon: 'icon-architecture' },
          { name: '科学研究', icon: 'icon-research' },
          { name: '战略咨询', icon: 'icon-strategy' }
        ],
        directions: [
          { name: '东南方', type: 'good' },
          { name: '西北方', type: 'good' },
          { name: '东北方', type: 'bad' },
          { name: '西南方', type: 'bad' }
        ],
        directionTip: '东南方向适合设立工作台，有助于提升思考能力和创造力。'
      }
    })
    
    // 检查是否有保存的测试结果
    const savedResult = wx.getStorageSync('mbti_result')
    if (savedResult) {
      this.setData({
        testCompleted: true,
        result: savedResult
      })
    }
    
    // 初始化答案数组
    const answers = new Array(this.data.questions.length).fill(null)
    this.setData({ answers })
  },

  onShow() {
    // 设置TabBar选中项（如果使用自定义TabBar）
    if (typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar()
      if (tabBar) {
        tabBar.setData({
          selected: 2
        })
      }
    }
  },

  // 加载题目
  loadQuestions() {
    // TODO: 从云数据库或本地加载MBTI题目
    const questions = require('./questions.js')
    this.setData({ questions: questions.default })
  },

  // 检查是否有已存在的测试结果
  async checkExistingResult() {
    try {
      const db = wx.cloud.database()
      const userInfo = await db.collection('users').where({
        _openid: app.globalData.openid
      }).field({
        mbtiResult: true
      }).get()

      if (userInfo.data.length > 0 && userInfo.data[0].mbtiResult) {
        this.setData({
          hasTestResult: true,
          mbtiResult: userInfo.data[0].mbtiResult
        })
      }
    } catch (error) {
      console.error('检查测试结果失败：', error)
    }
  },

  // 切换标签页
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    console.log('切换到标签页:', index);
    this.setData({
      activeTab: parseInt(index),
      currentQuestion: 0,
      selectedOption: ''
    });
  },

  // 切换到测试标签页
  switchToTestTab() {
    this.setData({ activeTab: 0 })
  },

  // 开始测试
  startTest() {
    this.setData({
      currentStep: 'testing',
      currentQuestionIndex: 0,
      answers: {},
      scores: {
        EI: 0,
        SN: 0,
        TF: 0,
        JP: 0
      }
    })
  },

  // 开始重新测试
  startRetest() {
    this.setData({
      isRetesting: true,
      isTestActive: true,
      currentQuestion: 0,
      selectedOption: '',
      hasTestResult: false
    })
  },

  // 选择选项
  selectOption(e) {
    const value = e.currentTarget.dataset.value;
    console.log('选择选项:', value);
    this.setData({
      selectedOption: value
    });
    
    // 短暂延迟后自动进入下一题（如果不是最后一题）
    if (this.data.currentQuestion < this.data.questions.length - 1) {
      setTimeout(() => {
        this.nextQuestion();
      }, 300);
    }
  },

  // 上一题
  prevQuestion() {
    if (this.data.currentQuestion > 0) {
      const prevQuestion = this.data.currentQuestion - 1
      // 恢复之前的选择
      const prevAnswer = this.data.answers[prevQuestion]
      
      this.setData({
        currentQuestion: prevQuestion,
        selectedOption: prevAnswer || ''
      })
    }
  },

  // 下一题或完成测试
  nextQuestion() {
    if (!this.data.selectedOption) return
    
    // 保存当前答案
    const answers = [...this.data.answers]
    answers[this.data.currentQuestion] = this.data.selectedOption
    
    // 如果是最后一题
    if (this.data.currentQuestion === this.data.questions.length - 1) {
      // 计算结果
      const result = this.calculateResult(answers)
      
      this.setData({
        testCompleted: true,
        result: result,
        answers: answers
      })
      
      // 保存测试结果
      wx.setStorageSync('mbti_result', result)
      
      // 添加到测试历史
      this.addTestHistory(result)
    } else {
      // 进入下一题
      const nextQuestion = this.data.currentQuestion + 1
      // 预设之前选择过的答案（如果有）
      const nextAnswer = answers[nextQuestion]
      
      this.setData({
        currentQuestion: nextQuestion,
        selectedOption: nextAnswer || '',
        answers: answers
      })
    }
  },

  // 计算测试结果
  calculateResult(answers) {
    console.log('计算测试结果...');
    // 计数各维度得分
    let E = 0, I = 0, S = 0, N = 0, T = 0, F = 0, J = 0, P = 0
    
    answers.forEach((answer, index) => {
      const question = this.data.questions[index]
      const dimension = question.dimension
      
      switch (dimension) {
        case 'EI':
          if (answer === 'A') E++
          else I++
          break
        case 'SN':
          if (answer === 'A') S++
          else N++
          break
        case 'TF':
          if (answer === 'A') T++
          else F++
          break
        case 'JP':
          if (answer === 'A') J++
          else P++
          break
      }
    })
    
    console.log(`测试结果得分: E=${E}, I=${I}, S=${S}, N=${N}, T=${T}, F=${F}, J=${J}, P=${P}`);
    
    // 确定性格类型
    const type = [
      I > E ? 'I' : 'E',
      N > S ? 'N' : 'S',
      F > T ? 'F' : 'T',
      P > J ? 'P' : 'J'
    ].join('')
    
    console.log(`确定的MBTI类型: ${type}`);
    
    // 计算各维度百分比
    const total = {
      EI: E + I,
      SN: S + N,
      TF: T + F,
      JP: J + P
    }
    
    const scores = {
      E: Math.round(E / total.EI * 100),
      I: Math.round(I / total.EI * 100),
      S: Math.round(S / total.SN * 100),
      N: Math.round(N / total.SN * 100),
      T: Math.round(T / total.TF * 100),
      F: Math.round(F / total.TF * 100),
      J: Math.round(J / total.JP * 100),
      P: Math.round(P / total.JP * 100)
    }
    
    // 获取类型描述
    const typeInfo = mbtiData.types[type] || {
      name: '未知类型',
      description: '未能找到该类型的描述信息。',
      percentage: '0.8%',
      functions: []
    }
    
    console.log(`获取到类型信息:`, typeInfo);
    
    // 格式化测试时间
    const now = new Date();
    const timeStr = this.formatTime(now);
    
    return {
      type: type,
      name: typeInfo.name,
      description: typeInfo.description,
      percentage: typeInfo.percentage,
      timestamp: now.getTime(),
      timeStr: timeStr,
      scores: scores,
      functions: typeInfo.functions || [],
      alias: this.getTypeAlias(type)
    }
  },
  
  // 格式化时间
  formatTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    return `${year}年${month}月${day}日 ${hour}:${minute < 10 ? '0' + minute : minute}`;
  },
  
  // 获取类型别称
  getTypeAlias(type) {
    const aliases = {
      'INTJ': '建筑师',
      'INTP': '逻辑学家',
      'ENTJ': '指挥官',
      'ENTP': '辩论家',
      'INFJ': '提倡者',
      'INFP': '调停者',
      'ENFJ': '主人公',
      'ENFP': '竞选者',
      'ISTJ': '物流师',
      'ISFJ': '守卫者',
      'ESTJ': '总经理',
      'ESFJ': '执政官',
      'ISTP': '鉴赏家',
      'ISFP': '探险家',
      'ESTP': '企业家',
      'ESFP': '表演者'
    };
    
    return aliases[type] || '';
  },
  
  // 重新开始测试
  restartTest() {
    console.log('重新开始测试');
    // 初始化答案数组
    const answers = new Array(this.data.questions.length).fill(null)
    
    this.setData({
      testCompleted: false,
      currentQuestion: 0,
      selectedOption: '',
      answers
    })
  },
  
  // 添加测试历史
  addTestHistory(result) {
    let history = wx.getStorageSync('mbti_history') || []
    history.unshift({
      type: result.type,
      timestamp: result.timestamp
    })
    
    // 只保留最近10条记录
    if (history.length > 10) {
      history = history.slice(0, 10)
    }
    
    wx.setStorageSync('mbti_history', history)
  },
  
  // 加载最近一次测试结果
  loadLatestResult() {
    const result = wx.getStorageSync('mbti_result')
    if (result) {
      this.setData({
        result: result,
        testCompleted: true
      })
    }
  },
  
  // 加载测试历史
  loadTestHistory() {
    const history = wx.getStorageSync('mbti_history') || []
    this.setData({
      testHistory: history
    })
  },
  
  // 加载类型分布
  loadTypeDistribution() {
    // 此功能可以在有更多用户数据时实现
    // 目前使用静态数据
    this.setData({
      typeDistribution: [
        { type: 'INTJ', count: 56 },
        { type: 'INFJ', count: 43 },
        { type: 'INTP', count: 32 },
        { type: 'INFP', count: 28 }
      ]
    })
  },

  // 返回首页
  goToWelcome() {
    this.setData({
      currentStep: 'welcome'
    })
  },

  // 重新测试
  retakeTest() {
    this.startTest()
  },

  // 获取MBTI类型详细信息
  getTypeInfo(type) {
    const typeInfoMap = {
      'INTJ': {
        name: '建筑师',
        percent: 2.1,
        description: 'INTJ型的人富有想象力和战略性思维，是天生的规划者。他们以独特的创造力和创新思维著称。',
        functions: [
          {
            code: 'Ni',
            name: '内向直觉',
            description: '能够看到事物背后的联系和模式，善于预测未来趋势。'
          },
          {
            code: 'Te',
            name: '外向思维',
            description: '善于逻辑分析和系统规划，追求效率和目标达成。'
          },
          {
            code: 'Fi',
            name: '内向情感',
            description: '有强烈的个人价值观和道德准则，重视真实性。'
          },
          {
            code: 'Se',
            name: '外向感觉',
            description: '关注当下的具体细节，但可能是较弱的功能。'
          }
        ],
        socialMask: {
          code: 'ENTJ',
          name: '指挥官'
        },
        careers: [
          { name: '战略规划', icon: 'icon-strategy', bgColor: '#3b82f6' },
          { name: '系统架构', icon: 'icon-architecture', bgColor: '#8b5cf6' },
          { name: '科学研究', icon: 'icon-research', bgColor: '#10b981' },
          { name: '管理咨询', icon: 'icon-consulting', bgColor: '#f59e0b' }
        ],
        directions: [
          { name: '北向', isGood: true },
          { name: '东向', isGood: true },
          { name: '南向', isGood: false },
          { name: '西向', isGood: false }
        ]
      },
      // 这里添加其他15种MBTI类型的详细信息...
    }

    return typeInfoMap[type] || {
      name: '未知类型',
      percent: 0,
      description: '无法确定具体的性格类型。',
      functions: [],
      socialMask: { code: '', name: '' },
      careers: [],
      directions: []
    }
  },

  // 分享功能
  onShareAppMessage() {
    const title = this.data.testCompleted 
      ? `我的MBTI类型是${this.data.result.type}(${this.data.result.name})` 
      : 'MBTI人格测试'
      
    return {
      title,
      path: '/pages/mbti_personality/index',
      imageUrl: '/images/share_mbti.png' // 这里需要提供分享图片
    }
  }
}) 