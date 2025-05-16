const app = getApp()
const questions = require('./questions.js')
const mbtiTypes = require('./mbti-types.js')
const mbtiData = require('../../utils/mbtiFullDataMerged')

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
    },
    tabNavClass: '' // 初始化标签导航类
  },

  onLoad() {
    console.log('MBTI页面加载...');
    
    // 从mbtiData加载问题
    this.setData({
      questions: mbtiData.questions,
      activeTab: 0  // 确保默认选中"性格测试"标签页
    });
    
    // 打印问题数据，检查是否正确加载
    console.log('加载问题数量:', this.data.questions.length);
    console.log('第一个问题样例:', this.data.questions[0]);
    console.log('维度统计:', 
      this.data.questions.filter(q => q.dimension === 'EI').length, 
      this.data.questions.filter(q => q.dimension === 'SN').length,
      this.data.questions.filter(q => q.dimension === 'TF').length,
      this.data.questions.filter(q => q.dimension === 'JP').length
    );
    
    // 初始化答案数组
    const answers = new Array(this.data.questions.length).fill(null);
    this.setData({ answers });
    
    // 加载保存的测试结果
    this.loadLatestResult();
    
    // 加载测试历史和类型分布
    this.loadTestHistory();
    this.loadTypeDistribution();
    
    // 初始化模型数据
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
    });
  },

  onShow() {
    // 设置TabBar选中项（如果使用自定义TabBar）
    if (typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar()
      if (tabBar) {
        tabBar.setData({
          selected: 3 // 更新为3，因为首页是0，每日一挂是1，八字总运是2
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
    
    // 如果切换到人格模型标签页，确保模型数据已更新
    if (index == 1 && this.data.result) {
      this.updateModelData(this.data.result);
    }
    
    this.setData({
      activeTab: parseInt(index),
      currentQuestion: 0,
      selectedOption: ''
    });
    
    // 更新标签指示器位置
    if (index == 1) {
      this.setData({
        tabNavClass: 'tab-2-active'
      });
    } else {
      this.setData({
        tabNavClass: ''
      });
    }
  },

  // 切换到测试标签页
  switchToTestTab() {
    this.setData({
      activeTab: 0,
      tabNavClass: ''
    });
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
    const currentQuestion = this.data.questions[this.data.currentQuestion];
    
    // 打印当前题目和选项信息
    console.log('当前题目:', currentQuestion);
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
    // 确保已选择答案
    if (!this.data.selectedOption) {
      wx.showToast({
        title: '请选择一个选项',
        icon: 'none'
      });
      return;
    }
    
    // 记录当前答案
    const answers = this.data.answers;
    answers[this.data.currentQuestion] = this.data.selectedOption;
    
    console.log('记录答案:', this.data.currentQuestion, this.data.selectedOption);
    console.log('当前问题类型:', this.data.questions[this.data.currentQuestion].dimension);
    
    // 如果是最后一题，则计算结果
    if (this.data.currentQuestion === this.data.questions.length - 1) {
      // 显示加载中
      wx.showLoading({
        title: '分析结果中...',
        mask: true
      });
      
      console.log('完成所有问题，开始计算结果');
      console.log('问题总数:', this.data.questions.length);
      console.log('已回答问题数:', Object.keys(answers).length);
      
      setTimeout(() => {
        // 计算结果
        const result = this.calculateResult(answers);
        
        // 更新人格模型数据
        this.updateModelData(result);
        
        // 设置结果和测试完成状态
        this.setData({
          testCompleted: true,
          result: result,
          selectedOption: ''
        });
        
        // 隐藏加载提示
        wx.hideLoading();
        
        console.log('测试完成，结果:', result);
      }, 1000); // 延迟一秒以显示加载效果
      
    } else {
      // 不是最后一题，前进到下一题
      this.setData({
        currentQuestion: this.data.currentQuestion + 1,
        selectedOption: answers[this.data.currentQuestion + 1] || ''
      });
      
      console.log('前进到下一题:', this.data.currentQuestion + 1);
    }
  },

  // 计算测试结果
  calculateResult(answers) {
    // 初始化各维度得分
    let scores = {
      'E': 0, 'I': 0,
      'S': 0, 'N': 0,
      'T': 0, 'F': 0,
      'J': 0, 'P': 0
    };

    // 统计各维度得分
    for (let i = 0; i < this.data.questions.length; i++) {
      const question = this.data.questions[i];
      const answer = answers[i];
      
      if (!answer) continue;  // 跳过未答题目
      
      // 根据题目类型和答案增加相应维度得分
      if (question.dimension === 'EI') {
        answer === 'A' ? scores.E++ : scores.I++;
      } else if (question.dimension === 'SN') {
        answer === 'A' ? scores.S++ : scores.N++;
      } else if (question.dimension === 'TF') {
        answer === 'A' ? scores.T++ : scores.F++;
      } else if (question.dimension === 'JP') {
        answer === 'A' ? scores.J++ : scores.P++;
      }
    }
    
    // 打印各维度得分情况，便于调试
    console.log('MBTI维度得分情况：', scores);
    console.log('E vs I:', scores.E, '/', scores.I);
    console.log('S vs N:', scores.S, '/', scores.N);
    console.log('T vs F:', scores.T, '/', scores.F);
    console.log('J vs P:', scores.J, '/', scores.P);
    
    // 确定各维度的倾向性
    const type = [
      scores.E > scores.I ? 'E' : 'I',
      scores.S > scores.N ? 'S' : 'N',
      scores.T > scores.F ? 'T' : 'F',
      scores.J > scores.P ? 'J' : 'P'
    ].join('');
    
    // 计算百分比得分
    const totalQuestions = {
      'EI': answers.filter((_, i) => this.data.questions[i].dimension === 'EI').length,
      'SN': answers.filter((_, i) => this.data.questions[i].dimension === 'SN').length,
      'TF': answers.filter((_, i) => this.data.questions[i].dimension === 'TF').length,
      'JP': answers.filter((_, i) => this.data.questions[i].dimension === 'JP').length
    };
    
    // 计算各维度的百分比
    const IPercent = Math.round((scores.I / (scores.I + scores.E || 1)) * 100);
    const NPercent = Math.round((scores.N / (scores.N + scores.S || 1)) * 100);
    const FPercent = Math.round((scores.F / (scores.F + scores.T || 1)) * 100);
    const PPercent = Math.round((scores.P / (scores.P + scores.J || 1)) * 100);
    
    // 获取类型信息
    const typeInfo = this.getTypeInfo(type);
    console.log('获取到的typeInfo:', typeInfo);
    
    // 构建结果对象
    const now = new Date();
    
    // 确保认知功能栈数据存在
    const functions = typeInfo.functions || [];
    if (functions.length === 0) {
      console.warn(`MBTI类型 ${type} 缺少认知功能栈数据`);
    }
    
    // 构造符合模板需求的增强结果数据结构
    const result = {
      type: type,
      name: typeInfo.name || '未知类型',
      description: typeInfo.description || '暂无描述',
      fullDescription: typeInfo.fullDescription || typeInfo.description || '暂无详细描述',
      alias: typeInfo.alias || this.getTypeAlias(type),
      percentage: typeInfo.percentage || '未知',
      strengths: typeInfo.strengths || [],
      weaknesses: typeInfo.weaknesses || [],
      scores: {
        I: IPercent,
        N: NPercent,
        F: FPercent,
        P: PPercent,
        E: 100 - IPercent,
        S: 100 - NPercent,
        T: 100 - FPercent,
        J: 100 - PPercent
      },
      functions: functions,
      careers: typeInfo.careerSuggestions || [],
      relationshipStrengths: typeInfo.relationshipStrengths || '暂无数据',
      relationshipChallenges: typeInfo.relationshipChallenges || '暂无数据',
      communicationStyle: typeInfo.communicationStyle || '暂无数据',
      workStyle: typeInfo.workStyle || '暂无数据',
      stressReactions: typeInfo.stressReactions || '暂无数据',
      growthAreas: typeInfo.growthAreas || '暂无数据',
      famousPeople: typeInfo.famousPeople || [],
      date: now,
      timeStr: this.formatTime(now)
    };
    
    console.log('MBTI测试结果:', result);
    
    // 保存测试结果
    try {
      wx.setStorageSync('mbti_result', result);
      
      // 更新用户全局MBTI设置
      const userSettings = wx.getStorageSync('userSettings') || {};
      userSettings.mbtiType = type;
      userSettings.mbtiName = typeInfo.name;
      wx.setStorageSync('userSettings', userSettings);
      
      // 更新全局数据
      app.globalData.mbtiType = type;
      app.globalData.mbtiName = typeInfo.name;
      
      console.log('测试结果已保存到本地存储');
      
      // 添加到测试历史
      this.addTestHistory(result);
      
    } catch (e) {
      console.error('保存测试结果失败:', e);
    }
    
    return result;
  },
  
  // 更新用户MBTI数据到个人信息和全局数据
  updateUserMBTI: function(mbtiCode) {
    // 从本地存储获取用户设置
    const userSettings = wx.getStorageSync('userSettings') || {};
    
    // 更新MBTI类型
    userSettings.mbti = mbtiCode;
    
    // 保存到本地存储
    wx.setStorageSync('userSettings', userSettings);
    
    // 更新全局数据
    if (app.globalData) {
      // 如果存在userSettings，更新
      if (app.globalData.userSettings) {
        app.globalData.userSettings.mbti = mbtiCode;
      } else {
        // 否则创建
        app.globalData.userSettings = {
          mbti: mbtiCode
        };
      }
      
      // 如果存在用户信息，也更新
      if (app.globalData.userInfo) {
        app.globalData.userInfo.mbti = mbtiCode;
      }
    }
    
    console.log('已更新用户MBTI类型:', mbtiCode);
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
  
  // 获取MBTI类型的别名
  getTypeAlias(type) {
    const aliases = {
      'INTJ': '战略家 | 思想家',
      'INTP': '逻辑学家 | 思考者',
      'ENTJ': '指挥官 | 领导者',
      'ENTP': '辩论家 | 创新者',
      'INFJ': '提倡者 | 理想主义者',
      'INFP': '调停者 | 梦想家',
      'ENFJ': '主人公 | 导师',
      'ENFP': '冒险家 | 自由精神',
      'ISTJ': '检查者 | 守卫者',
      'ISFJ': '守护者 | 保护者',
      'ESTJ': '总经理 | 管理者',
      'ESFJ': '执政官 | 照顾者',
      'ISTP': '鉴赏家 | 技师',
      'ISFP': '探险家 | 艺术家',
      'ESTP': '企业家 | 实干家',
      'ESFP': '表演者 | 娱乐者'
    };
    
    return aliases[type] || '个性独特者';
  },
  
  // 重新测试
  restartTest() {
    // 重置测试状态
    const answers = new Array(this.data.questions.length).fill(null);
    
    this.setData({
      testCompleted: false,
      currentQuestion: 0,
      selectedOption: '',
      answers: answers,
      result: null
    });
    
    // 滚动到页面顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
    
    console.log('重新开始测试');
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
    try {
      const savedResult = wx.getStorageSync('mbti_result');
      if (savedResult) {
        console.log('找到保存的测试结果:', savedResult);
        
        // 更新人格模型数据
        this.updateModelData(savedResult);
        
        this.setData({
          testCompleted: true,
          result: savedResult
        });
      } else {
        console.log('没有找到保存的测试结果');
      }
    } catch (e) {
      console.error('加载测试结果失败:', e);
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
    console.log('获取MBTI类型信息:', type);
    // 从mbtiData中获取类型信息
    const typeInfo = mbtiData.types[type];
    
    if (!typeInfo) {
      console.error('未找到类型信息:', type);
      return {
        name: '未知类型',
        description: '无法获取该类型的详细信息',
        percentage: '未知',
        functions: []
      };
    }
    
    return typeInfo;
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
  },

  // 更新人格模型数据
  updateModelData(result) {
    if (!result || !result.type) return;
    
    // 根据MBTI类型更新人格模型数据
    const mbtiType = result.type;
    const typeInfo = this.getTypeInfo(mbtiType);
    
    // 计算社会面具(假设社会面具是首字母变成相反的类型)
    const socialType = this.calculateSocialMask(mbtiType);
    const socialTypeInfo = this.getTypeInfo(socialType);
    
    // 根据类型生成适合的行业
    const industries = this.getIndustriesByType(mbtiType);
    
    // 根据类型生成方位建议
    const directions = this.getDirectionsByType(mbtiType);
    
    // 更新modelData
    this.setData({
      modelData: {
        nativeType: mbtiType,
        nativeName: typeInfo.name || '未知类型',
        nativeDescription: typeInfo.description || '暂无描述',
        socialType: socialType,
        socialName: socialTypeInfo.name || '未知类型',
        socialDescription: socialTypeInfo.description ? socialTypeInfo.description.substring(0, 30) + '...' : '暂无描述',
        industries: industries,
        directions: directions,
        directionTip: this.getDirectionTip(mbtiType)
      }
    });
    
    console.log('已更新人格模型数据:', mbtiType);
  },
  
  // 计算社会面具
  calculateSocialMask(mbtiType) {
    if (!mbtiType || mbtiType.length !== 4) return 'ENFP';
    
    // 简单实现：将首字母E/I翻转，其他保持不变
    const firstLetter = mbtiType.charAt(0) === 'E' ? 'I' : 'E';
    return firstLetter + mbtiType.substring(1);
  },
  
  // 根据MBTI类型获取适合的行业
  getIndustriesByType(mbtiType) {
    if (!mbtiType) return [];
    
    // 根据类型配置适合的行业
    const industriesByType = {
      // 分析家族 NT
      'INTJ': [
        { name: '战略咨询', icon: 'icon-strategy' },
        { name: '系统设计', icon: 'icon-architecture' },
        { name: '科学研究', icon: 'icon-research' },
        { name: '投资分析', icon: 'icon-finance' }
      ],
      'INTP': [
        { name: '软件开发', icon: 'icon-code' },
        { name: '数据科学', icon: 'icon-data' },
        { name: '研究工作', icon: 'icon-research' },
        { name: '理论物理', icon: 'icon-science' }
      ],
      'ENTJ': [
        { name: '企业管理', icon: 'icon-management' },
        { name: '投资银行', icon: 'icon-finance' },
        { name: '法律咨询', icon: 'icon-law' },
        { name: '企业家', icon: 'icon-entrepreneur' }
      ],
      'ENTP': [
        { name: '创业领域', icon: 'icon-startup' },
        { name: '营销策略', icon: 'icon-marketing' },
        { name: '产品设计', icon: 'icon-design' },
        { name: '咨询顾问', icon: 'icon-consulting' }
      ],
      
      // 外交家族 NF
      'INFJ': [
        { name: '心理咨询', icon: 'icon-psychology' },
        { name: '人文教育', icon: 'icon-education' },
        { name: '公益组织', icon: 'icon-nonprofit' },
        { name: '艺术创作', icon: 'icon-art' }
      ],
      'INFP': [
        { name: '文学创作', icon: 'icon-writing' },
        { name: '心理辅导', icon: 'icon-counseling' },
        { name: '环保工作', icon: 'icon-environment' },
        { name: '艺术设计', icon: 'icon-design' }
      ],
      'ENFJ': [
        { name: '教育培训', icon: 'icon-teaching' },
        { name: '人力资源', icon: 'icon-hr' },
        { name: '公共关系', icon: 'icon-pr' },
        { name: '社会工作', icon: 'icon-social' }
      ],
      'ENFP': [
        { name: '创意策划', icon: 'icon-creative' },
        { name: '表演艺术', icon: 'icon-performance' },
        { name: '市场营销', icon: 'icon-marketing' },
        { name: '职业顾问', icon: 'icon-career' }
      ],
      
      // 守卫家族 SJ
      'ISTJ': [
        { name: '财务会计', icon: 'icon-finance' },
        { name: '项目管理', icon: 'icon-project' },
        { name: '质量控制', icon: 'icon-quality' },
        { name: '法律合规', icon: 'icon-law' }
      ],
      'ISFJ': [
        { name: '医疗护理', icon: 'icon-medical' },
        { name: '社会服务', icon: 'icon-service' },
        { name: '行政助理', icon: 'icon-admin' },
        { name: '教育工作', icon: 'icon-education' }
      ],
      'ESTJ': [
        { name: '行政管理', icon: 'icon-management' },
        { name: '银行金融', icon: 'icon-banking' },
        { name: '政府机构', icon: 'icon-government' },
        { name: '销售管理', icon: 'icon-sales' }
      ],
      'ESFJ': [
        { name: '客户服务', icon: 'icon-customer' },
        { name: '零售管理', icon: 'icon-retail' },
        { name: '人事管理', icon: 'icon-hr' },
        { name: '健康护理', icon: 'icon-healthcare' }
      ],
      
      // 探险家族 SP
      'ISTP': [
        { name: '技术工程', icon: 'icon-engineering' },
        { name: '机械维修', icon: 'icon-mechanics' },
        { name: 'IT支持', icon: 'icon-it' },
        { name: '紧急救援', icon: 'icon-emergency' }
      ],
      'ISFP': [
        { name: '美术设计', icon: 'icon-art' },
        { name: '个人造型', icon: 'icon-style' },
        { name: '烹饪美食', icon: 'icon-culinary' },
        { name: '室内设计', icon: 'icon-interior' }
      ],
      'ESTP': [
        { name: '体育运动', icon: 'icon-sports' },
        { name: '销售谈判', icon: 'icon-sales' },
        { name: '风险投资', icon: 'icon-venture' },
        { name: '应急管理', icon: 'icon-emergency' }
      ],
      'ESFP': [
        { name: '娱乐表演', icon: 'icon-entertainment' },
        { name: '时尚产业', icon: 'icon-fashion' },
        { name: '旅游服务', icon: 'icon-travel' },
        { name: '活动策划', icon: 'icon-events' }
      ]
    };
    
    // 默认行业
    const defaultIndustries = [
      { name: '自由职业', icon: 'icon-freelance' },
      { name: '创意工作', icon: 'icon-creative' },
      { name: '咨询服务', icon: 'icon-consulting' },
      { name: '教育培训', icon: 'icon-education' }
    ];
    
    return industriesByType[mbtiType] || defaultIndustries;
  },
  
  // 根据MBTI类型获取方位建议
  getDirectionsByType(mbtiType) {
    if (!mbtiType) return [];
    
    // 简单实现：根据类型前两个字母决定方位
    const prefix = mbtiType.substring(0, 2);
    
    const directionMap = {
      'IN': [
        { name: '北方', type: 'good' },
        { name: '西方', type: 'good' },
        { name: '南方', type: 'bad' },
        { name: '东方', type: 'bad' }
      ],
      'IS': [
        { name: '东方', type: 'good' },
        { name: '北方', type: 'good' },
        { name: '西方', type: 'bad' },
        { name: '南方', type: 'bad' }
      ],
      'EN': [
        { name: '南方', type: 'good' },
        { name: '西方', type: 'good' },
        { name: '北方', type: 'bad' },
        { name: '东方', type: 'bad' }
      ],
      'ES': [
        { name: '东方', type: 'good' },
        { name: '南方', type: 'good' },
        { name: '北方', type: 'bad' },
        { name: '西方', type: 'bad' }
      ]
    };
    
    const defaultDirections = [
      { name: '东南方', type: 'good' },
      { name: '西北方', type: 'good' },
      { name: '东北方', type: 'bad' },
      { name: '西南方', type: 'bad' }
    ];
    
    return directionMap[prefix] || defaultDirections;
  },
  
  // 获取方位提示
  getDirectionTip(mbtiType) {
    if (!mbtiType) return '';
    
    // 根据类型获取适合的方位提示
    const tipMap = {
      'INTJ': '北方方向能提升思考力和创造性，适合设立书桌和工作区。',
      'INTP': '西方方向有助于逻辑思考和分析能力，是理想的研究空间。',
      'ENTJ': '南方方向能增强领导力和决策能力，适合进行重要会议。',
      'ENTP': '西方方向能激发创意和辩论能力，有助于思想碰撞。',
      'INFJ': '北方安静区域有助于发展洞察力和直觉，是冥想的理想场所。',
      'INFP': '西方方向能激发创造力和想象力，适合艺术创作。',
      'ENFJ': '南方方向能增强人际魅力和表达能力，适合社交活动。',
      'ENFP': '南方充满活力的区域有助于激发热情和创造力。',
      'ISTJ': '东方方向有助于建立秩序和规划，适合组织工作。',
      'ISFJ': '东方方向能增强细节观察力，适合需要专注的工作。',
      'ESTJ': '东南方向有助于组织管理和执行力，适合办公区域。',
      'ESFJ': '南方方向能增强社交能力和照顾他人的能力。',
      'ISTP': '东方方向有助于发展实际技能和观察力。',
      'ISFP': '东方方向能增强感官体验和艺术感知能力。',
      'ESTP': '东南方向有助于行动力和实践能力的提升。',
      'ESFP': '南方充满活力的空间能增强表现力和感染力。'
    };
    
    return tipMap[mbtiType] || '根据你的人格类型特点，选择合适的工作方位可以有效提升工作效率和创造力。';
  }
}) 