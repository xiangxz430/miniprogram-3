const app = getApp()
const questions = require('./questions.js')
const shortQuestions = require('./short_questions.js')
const mbtiTypes = require('./mbti-types.js')
const mbtiData = require('../../utils/mbtiFullDataMerged')
const deepseekApi = require('../../utils/deepseekApi')
const { getWeatherAndAdvice, getCharacterAnalysis } = deepseekApi

console.log('加载MBTI页面相关资源...');
console.log('完整版题目数量:', questions.length);
console.log('简化版题目数量:', shortQuestions.length);
console.log('types数量:', Object.keys(mbtiData.types).length);

Page({
  data: {
    activeTab: 0,           // 当前激活的标签页（0: 性格测试, 1: 玄学人格模型, 2: AI建议）
    tabItems: [
      { text: 'mbti测试' },
      { text: '人格模型' },
      { text: 'AI建议' },
      { text: '每日分析' }
    ],
    hasTestResult: false,   // 是否有测试结果
    isTestActive: false,    // 是否正在测试中
    isRetesting: false,     // 是否正在重新测试
    currentQuestion: 0,     // 当前题目索引
    selectedOption: '',     // 当前选中的选项
    questions: [],          // 当前测试的题目集
    testMode: '',           // 测试模式：'standard'(标准版) 或 'short'(简化版)
    showTestModeSelection: false, // 是否显示测试模式选择界面
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
    tabNavClass: '', // 初始化标签导航类
    
    // AI建议相关数据
    aiAdviceLoaded: false,  // AI建议是否已加载
    aiAdviceError: false,   // 加载AI建议是否出错
    aiAdviceErrorMsg: '',   // 错误信息
    aiAdvice: {            // AI建议数据
      overallAdvice: '',    // 整体发展建议
      careerAdvice: '',     // 职业建议
      relationshipAdvice: '', // 人际关系建议
      stressManagement: '', // 压力管理
      growthAreas: [],      // 成长方向
      pitfalls: []          // 需避免的陷阱
    },
    // 天气相关数据
    weatherData: {
      city: '',
      currentTemp: '--',
      maxTemp: '--',
      minTemp: '--',
      condition: '--',
      humidity: '--',
      windSpeed: '--',
      airQuality: '--',
      hourlyForecast: []
    },
    currentTime: '',
    // 穿衣建议
    clothingAdvice: {
      index: '--',
      recommendation: '',
      tips: '',
      zodiacAdvice: ''
    },
    // 字测相关
    inputCharacter: '',
    characterResult: {
      structure: {
        character: '',
        radical: '',
        strokes: 0,
        components: []
      },
      hexagram: {
        primary: '',
        secondary: '',
        interpretation: ''
      },
      interpretation: '',
      advice: {
        general: '',
        action: [],
        caution: ''
      }
    },
    divinationResult: {
      hexagram: {
        name: '',
        description: '',
        analysis: ''
      },
      trend: {
        current: '',
        future: '',
        timing: ''
      },
      guidance: {
        favorable: [],
        unfavorable: [],
        precautions: []
      },
      recommendations: {
        timing: '',
        direction: '',
        colors: [],
        actions: []
      },
      resolution: {
        challenges: [],
        solutions: []
      }
    }
  },

  onLoad(options) {
    console.log('MBTI页面加载...');
    
    this.loadTabConfig();
    
    // 初始化默认题库为完整版
    const defaultQuestions = questions || [];
    console.log('初始化默认题库，题目数量:', defaultQuestions.length);
    
    // 初始化答案数组
    const answers = new Array(defaultQuestions.length).fill(null);
    
    this.setData({ 
      questions: defaultQuestions,
      testMode: 'standard', // 默认使用标准版
      answers: answers 
    });
    
    // 加载之前保存的答题进度
    this.loadProgress();
    
    // 加载保存的测试结果
    this.loadLatestResult();
    
    // 加载测试历史和类型分布
    this.loadTestHistory();
    this.loadTypeDistribution();
    
    // 初始化模型数据（保持不变）
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
    
    this.updateCurrentTime();
    this.loadWeatherData();
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
    
    // 每分钟更新一次时间
    this.timeInterval = setInterval(() => {
      this.updateCurrentTime();
    }, 60000);
  },

  onHide() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  },

  // 选择测试模式
  selectTestMode(e) {
    const mode = e.currentTarget.dataset.mode;
    console.log('选择测试模式:', mode);
    
    let questionSet = [];
    
    if (mode === 'short') {
      // 加载简化版题库
      if (shortQuestions && Array.isArray(shortQuestions) && shortQuestions.length > 0) {
        questionSet = shortQuestions;
        console.log('加载简化版题库，题目数量:', questionSet.length);
      } else {
        console.error('简化版题库加载失败或为空');
        wx.showToast({
          title: '题库加载失败，请重试',
          icon: 'none'
        });
        return;
      }
    } else {
      // 加载标准版题库
      if (questions && Array.isArray(questions) && questions.length > 0) {
        questionSet = questions;
        console.log('加载标准版题库，题目数量:', questionSet.length);
      } else {
        console.error('标准版题库加载失败或为空');
        wx.showToast({
          title: '题库加载失败，请重试',
          icon: 'none'
        });
        return;
      }
    }
    
    // 确保题库非空
    if (questionSet.length === 0) {
      console.error('选择的题库为空');
      wx.showToast({
        title: '题库为空，请重试',
        icon: 'none'
      });
      return;
    }
    
    // 检查题库格式是否正确
    const sampleQuestion = questionSet[0];
    if (!sampleQuestion || !sampleQuestion.dimension) {
      console.error('题库格式不正确，缺少必要的dimension属性');
      wx.showToast({
        title: '题库格式错误，请重试',
        icon: 'none'
      });
      return;
    }
    
    // 清除之前的测试结果和AI建议缓存
    if (this.data.result && this.data.result.type) {
      wx.removeStorageSync('mbti_ai_advice_' + this.data.result.type);
    }
    wx.removeStorageSync('mbti_result');
    
    // 初始化新的答案数组
    const newAnswers = new Array(questionSet.length).fill(null);
    
    // 初始化测试状态
    this.setData({
      questions: questionSet,
      testMode: mode,
      currentQuestion: 0,
      selectedOption: '',
      answers: newAnswers,
      isTestActive: true,
      showTestModeSelection: false,
      currentStep: 'testing',
      testCompleted: false,
      hasTestResult: false,
      result: null
    });
    
    console.log('已初始化测试，模式:', mode, '题目数量:', questionSet.length);
    
    // 保存当前进度
    this.saveProgress();
  },

  // 开始测试 - 修改为显示测试模式选择
  startTest() {
    console.log('显示测试模式选择界面');
    
    // 如果已有测试结果，标记为重新测试并清除缓存
    const isRetesting = this.data.hasTestResult || this.data.testCompleted;
    if (isRetesting && this.data.result && this.data.result.type) {
      wx.removeStorageSync('mbti_ai_advice_' + this.data.result.type);
    }
    
    // 清除已保存的进度和结果
    wx.removeStorageSync('mbti_progress');
    if (isRetesting) {
      wx.removeStorageSync('mbti_result');
    }
    
    this.setData({
      showTestModeSelection: true,
      isTestActive: false,
      isRetesting: isRetesting,
      testCompleted: false,
      hasTestResult: false,
      currentStep: 'mode_selection',
      result: null,
      currentQuestion: 0,
      selectedOption: '',
      answers: []
    });
    
    console.log('准备开始测试，已清除之前的数据');
  },

  // 切换标签页
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    const currentIndex = this.data.activeTab;
    console.log('从标签页', currentIndex, '切换到标签页:', index);
    
    // 如果当前在测试标签页，且正在测试中，保存进度
    if (currentIndex === 0 && this.data.isTestActive && !this.data.testCompleted) {
      this.saveProgress();
      console.log('保存当前答题进度');
    }
    
    // 如果切换到人格模型标签页，确保模型数据已更新
    if (index == 1 && this.data.result) {
      this.updateModelData(this.data.result);
    }
    
    // 如果切换到AI建议标签页，并且已有测试结果但未加载AI建议
    if (index == 2 && this.data.testCompleted) {
      // 检查是否需要加载AI建议
      const mbtiType = this.data.result.type;
      const cachedAdvice = wx.getStorageSync('mbti_ai_advice_' + mbtiType);
      
      if (!cachedAdvice || !this.data.aiAdviceLoaded) {
        this.loadAiAdvice();
      }
    }
    
    // 如果切换到测试标签页，检查是否有未完成的测试
    if (index == 0) {
      // 如果正在测试中且有保存的进度，恢复进度
      if (this.data.isTestActive && !this.data.testCompleted) {
        const progress = wx.getStorageSync('mbti_progress');
        if (progress) {
          this.restoreTestProgress(progress);
          console.log('恢复答题进度');
        }
      }
    }
    
    this.setData({
      activeTab: parseInt(index)
    });
  },

  // 切换到测试标签页
  switchToTestTab() {
    this.setData({
      activeTab: 0
    });
  },

  // 选择选项
  selectOption(e) {
    const value = e.currentTarget.dataset.value;
    
    // 安全检查：确保当前问题对象存在
    const currentQuestion = this.data.questions[this.data.currentQuestion];
    if (!currentQuestion) {
      console.error('错误：当前问题对象不存在', this.data.currentQuestion);
      wx.showToast({
        title: '加载题目失败，请重试',
        icon: 'none'
      });
      return;
    }
    
    // 打印当前题目和选项信息
    console.log('当前题目:', currentQuestion);
    console.log('选择选项:', value);
    
    // 记录当前答案
    const answers = this.data.answers;
    answers[this.data.currentQuestion] = value;
    
    this.setData({
      selectedOption: value,
      answers: answers
    });
    
    // 立即保存答题进度
    this.saveProgress();
    
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
      const prevQuestion = this.data.currentQuestion - 1;
      
      // 安全检查：确保上一题存在
      if (!this.data.questions || !this.data.questions[prevQuestion]) {
        console.error('错误：上一题对象不存在', prevQuestion);
        wx.showToast({
          title: '加载题目失败，请重试',
          icon: 'none'
        });
        return;
      }
      
      // 恢复之前的选择
      const prevAnswer = this.data.answers[prevQuestion];
      
      this.setData({
        currentQuestion: prevQuestion,
        selectedOption: prevAnswer || ''
      });
      
      console.log('返回上一题:', prevQuestion);
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
    
    // 安全检查：确保当前问题对象存在
    const currentQuestion = this.data.questions[this.data.currentQuestion];
    if (currentQuestion) {
      console.log('记录答案:', this.data.currentQuestion, this.data.selectedOption);
      console.log('当前问题类型:', currentQuestion.dimension || '未知');
    } else {
      console.error('错误：当前问题对象不存在', this.data.currentQuestion);
      // 如果问题对象不存在，可能是题库未正确加载
      wx.showToast({
        title: '加载题目失败，请重试',
        icon: 'none'
      });
      return;
    }
    
    // 保存答题进度
    this.saveProgress();
    
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
        
        // 如果当前在AI建议标签页，自动加载AI建议
        if (this.data.activeTab === 2) {
          this.loadAiAdvice();
        }
        
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
    
    console.log('开始计算测试结果...');
    console.log('题目数量:', this.data.questions ? this.data.questions.length : 0);
    console.log('答案数量:', answers ? Object.keys(answers).filter(k => answers[k]).length : 0);
    console.log('测试模式:', this.data.testMode);

    // 检查题库和答案是否有效
    if (!this.data.questions || !Array.isArray(this.data.questions) || this.data.questions.length === 0) {
      console.error('题库无效，无法计算结果');
      wx.showToast({
        title: '题库加载失败，请重试',
        icon: 'none'
      });
      return null;
    }

    // 统计各维度得分并记录详细日志
    let dimensionQuestions = {
      'EI': 0, 'SN': 0, 'TF': 0, 'JP': 0
    };
    
    // 统计各维度得分
    for (let i = 0; i < this.data.questions.length; i++) {
      const question = this.data.questions[i];
      const answer = answers[i];
      
      // 安全检查：确保问题对象和答案都存在
      if (!question || !answer) {
        console.log('跳过无效题目或未答题目:', i);
        continue;  // 跳过无效题目或未答题目
      }
      
      // 安全检查：确保dimension属性存在
      const dimension = question.dimension;
      if (!dimension) {
        console.error('题目缺少dimension属性:', i, question);
        continue;
      }
      
      // 增加维度题目计数
      dimensionQuestions[dimension] = (dimensionQuestions[dimension] || 0) + 1;
      
      // 根据题目类型和答案增加相应维度得分
      if (dimension === 'EI') {
        if (answer === 'A') {
          scores.E++;
          console.log(`问题 ${i+1}: 选择A, E+1 (${scores.E})`);
        } else {
          scores.I++;
          console.log(`问题 ${i+1}: 选择B, I+1 (${scores.I})`);
        }
      } else if (dimension === 'SN') {
        if (answer === 'A') {
          scores.S++;
          console.log(`问题 ${i+1}: 选择A, S+1 (${scores.S})`);
        } else {
          scores.N++;
          console.log(`问题 ${i+1}: 选择B, N+1 (${scores.N})`);
        }
      } else if (dimension === 'TF') {
        if (answer === 'A') {
          scores.T++;
          console.log(`问题 ${i+1}: 选择A, T+1 (${scores.T})`);
        } else {
          scores.F++;
          console.log(`问题 ${i+1}: 选择B, F+1 (${scores.F})`);
        }
      } else if (dimension === 'JP') {
        if (answer === 'A') {
          scores.J++;
          console.log(`问题 ${i+1}: 选择A, J+1 (${scores.J})`);
        } else {
          scores.P++;
          console.log(`问题 ${i+1}: 选择B, P+1 (${scores.P})`);
        }
      } else {
        console.warn('未知的维度类型:', dimension);
      }
    }
    
    // 打印各维度题目分布
    console.log('各维度题目数量分布:', dimensionQuestions);
    
    // 打印各维度得分情况，便于调试
    console.log('MBTI维度得分情况：', scores);
    console.log('E vs I:', scores.E, '/', scores.I, `(${Math.round((scores.E / (scores.E + scores.I || 1)) * 100)}% : ${Math.round((scores.I / (scores.E + scores.I || 1)) * 100)}%)`);
    console.log('S vs N:', scores.S, '/', scores.N, `(${Math.round((scores.S / (scores.S + scores.N || 1)) * 100)}% : ${Math.round((scores.N / (scores.S + scores.N || 1)) * 100)}%)`);
    console.log('T vs F:', scores.T, '/', scores.F, `(${Math.round((scores.T / (scores.T + scores.F || 1)) * 100)}% : ${Math.round((scores.F / (scores.T + scores.F || 1)) * 100)}%)`);
    console.log('J vs P:', scores.J, '/', scores.P, `(${Math.round((scores.J / (scores.J + scores.P || 1)) * 100)}% : ${Math.round((scores.P / (scores.J + scores.P || 1)) * 100)}%)`);
    
    // 确定各维度的倾向性
    const type = [
      scores.E > scores.I ? 'E' : 'I',
      scores.S > scores.N ? 'S' : 'N',
      scores.T > scores.F ? 'T' : 'F',
      scores.J > scores.P ? 'J' : 'P'
    ].join('');
    
    // 验证生成的类型是否有效
    if (!type || type.length !== 4) {
      console.error('无法生成有效的MBTI类型');
      wx.showToast({
        title: '计算结果失败，请重试',
        icon: 'none'
      });
      return null;
    }
    
    console.log('测试结果类型:', type);
    
    // 计算百分比得分
    const totalQuestions = {
      'EI': answers.filter((_, i) => {
        const q = this.data.questions[i];
        return q && q.dimension === 'EI';
      }).length,
      'SN': answers.filter((_, i) => {
        const q = this.data.questions[i];
        return q && q.dimension === 'SN';
      }).length,
      'TF': answers.filter((_, i) => {
        const q = this.data.questions[i];
        return q && q.dimension === 'TF';
      }).length,
      'JP': answers.filter((_, i) => {
        const q = this.data.questions[i];
        return q && q.dimension === 'JP';
      }).length
    };
    
    console.log('各维度题目数量:', totalQuestions);
    
    // 计算各维度的百分比
    const IPercent = Math.round((scores.I / (scores.I + scores.E || 1)) * 100);
    const NPercent = Math.round((scores.N / (scores.N + scores.S || 1)) * 100);
    const FPercent = Math.round((scores.F / (scores.F + scores.T || 1)) * 100);
    const PPercent = Math.round((scores.P / (scores.P + scores.J || 1)) * 100);
    
    // 获取类型信息
    const typeInfo = this.getTypeInfo(type);
    console.log('获取到的typeInfo:', typeInfo);
    
    if (!typeInfo) {
      console.error('无法获取类型信息:', type);
      wx.showToast({
        title: '类型数据加载失败',
        icon: 'none'
      });
      return null;
    }
    
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
    
    // 清除之前的AI建议缓存
    const previousType = wx.getStorageSync('mbti_result')?.type;
    if (previousType) {
      wx.removeStorageSync('mbti_ai_advice_' + previousType);
    }
    // 清除新类型的AI建议缓存（如果存在）
    wx.removeStorageSync('mbti_ai_advice_' + type);
    // 重置AI建议相关状态
    this.setData({
      aiAdviceLoaded: false,
      aiAdviceError: false,
      aiAdviceErrorMsg: ''
    });
    
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
    
    // 如果当前在AI建议标签页，自动加载AI建议
    if (this.data.activeTab === 2) {
      this.loadAiAdvice();
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
    // 直接调用startTest方法来显示测试模式选择界面
    this.startTest();
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
          hasTestResult: true,
          result: savedResult,
          currentStep: 'result' // 设置当前步骤为结果展示
        });
      } else {
        console.log('没有找到保存的测试结果');
        this.setData({
          hasTestResult: false,
          currentStep: 'welcome' // 设置当前步骤为欢迎页
        });
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
    
    // 计算社会面具(基于MBTI认知功能理论的阴影面)
    const socialType = this.calculateSocialMask(mbtiType);
    const socialTypeInfo = this.getTypeInfo(socialType);
    
    // 根据类型生成适合的行业
    const industries = this.getIndustriesByType(mbtiType);
    
    // 根据类型生成方位建议
    const directions = this.getDirectionsByType(mbtiType);
    
    // 计算人格能量雷达数据
    const radarData = this.calculatePersonalityRadar(mbtiType);
    
    // 获取职业特质分析
    const careerTraits = this.getCareerTraits(mbtiType);
    
    // 计算适合的朋友和恋人
    const relationships = this.calculateRelationships(mbtiType);
    
    // 更新modelData
    this.setData({
      modelData: {
        nativeType: mbtiType,
        nativeName: typeInfo.name || '未知类型',
        nativeDescription: typeInfo.description || '暂无描述',
        socialType: socialType,
        socialName: socialTypeInfo.name || '未知类型',
        socialDescription: socialTypeInfo.description ? socialTypeInfo.description.substring(0, 60) + '...' : '暂无描述',
        industries: industries,
        directions: directions,
        directionTip: this.getDirectionTip(mbtiType),
        radarData: radarData,
        careerTraits: careerTraits,
        relationships: relationships // 添加关系匹配数据
      }
    });
    
    console.log('已更新人格模型数据:', mbtiType);
  },
  
  // 计算社会面具
  calculateSocialMask(mbtiType) {
    if (!mbtiType || mbtiType.length !== 4) return 'ENFP';
    
    // 实现更合理的社会面具计算规则
    // 每种MBTI类型的社会面具，通常是原生人格的"阴影面"
    // 第一个字母反转（内外向），其他根据认知功能理论调整
    
    let socialType = '';
    
    // 第一个字母E/I翻转
    const firstLetter = mbtiType.charAt(0) === 'E' ? 'I' : 'E';
    socialType += firstLetter;
    
    // 根据MBTI认知功能理论，计算社会面具
    // INFP —> ESTJ, ENFJ —> ISTP 等
    
    const socialMaskMap = {
      'INTJ': 'ESFP', // 思维型内向 —> 感觉型外向
      'INTP': 'ESFJ', // 思维型内向 —> 感觉型外向
      'ENTJ': 'ISFP', // 思维型外向 —> 感觉型内向
      'ENTP': 'ISFJ', // 思维型外向 —> 感觉型内向
      
      'INFJ': 'ESTP', // 感觉型内向 —> 思维型外向
      'INFP': 'ESTJ', // 感觉型内向 —> 思维型外向
      'ENFJ': 'ISTP', // 感觉型外向 —> 思维型内向
      'ENFP': 'ISTJ', // 感觉型外向 —> 思维型内向
      
      'ISTJ': 'ENFP', // 守卫型内向 —> 探索型外向
      'ISFJ': 'ENTP', // 守卫型内向 —> 探索型外向
      'ESTJ': 'INFP', // 守卫型外向 —> 探索型内向
      'ESFJ': 'INTP', // 守卫型外向 —> 探索型内向
      
      'ISTP': 'ENFJ', // 探索型内向 —> 守卫型外向
      'ISFP': 'ENTJ', // 探索型内向 —> 守卫型外向
      'ESTP': 'INFJ', // 探索型外向 —> 守卫型内向
      'ESFP': 'INTJ'  // 探索型外向 —> 守卫型内向
    };
    
    // 如果存在于映射表中，返回映射值，否则使用简单规则
    if (socialMaskMap[mbtiType]) {
      return socialMaskMap[mbtiType];
    } else {
      // 简单的首字母翻转规则作为后备
      return firstLetter + mbtiType.substring(1);
    }
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
  },
  
  // 计算人格能量雷达数据
  calculatePersonalityRadar(mbtiType) {
    if (!mbtiType || mbtiType.length !== 4) {
      return {
        thinking: 50,
        creativity: 50,
        execution: 50,
        perception: 50
      };
    }
    
    // 根据MBTI类型计算四个维度的能力值
    let thinking = 50;
    let creativity = 50;
    let execution = 50;
    let perception = 50;
    
    // 思考力：T > F, 内向 I 稍有加成
    if (mbtiType.includes('T')) thinking += 25;
    if (mbtiType.includes('I')) thinking += 10;
    
    // 创造力：N > S, 外向 E 稍有加成
    if (mbtiType.includes('N')) creativity += 25;
    if (mbtiType.includes('E')) creativity += 10;
    
    // 执行力：J > P, 外向 E 稍有加成
    if (mbtiType.includes('J')) execution += 25;
    if (mbtiType.includes('E')) execution += 10;
    
    // 感知力：F > T, N > S 各有加成
    if (mbtiType.includes('F')) perception += 20;
    if (mbtiType.includes('N')) perception += 15;
    
    // 根据具体类型进行额外调整
    switch(mbtiType) {
      case 'INTJ': // 学者型——思考力和创造力特别强
        thinking += 15;
        creativity += 10;
        break;
      case 'INTP': // 学者型——思考力和创造力特别强
        thinking += 10;
        creativity += 15;
        break;
      case 'ENTJ': // 指挥官——思考力和执行力特别强
        thinking += 15;
        execution += 15;
        break;
      case 'ENTP': // 辩论家——思考力和创造力特别强
        thinking += 10;
        creativity += 15;
        break;
      case 'INFJ': // 提倡者——创造力和感知力特别强
        creativity += 15;
        perception += 15;
        break;
      case 'INFP': // 调停者——创造力和感知力特别强
        creativity += 10;
        perception += 20;
        break;
      case 'ENFJ': // 主人公——执行力和感知力特别强
        execution += 15;
        perception += 15;
        break;
      case 'ENFP': // 竞选者——创造力和感知力特别强
        creativity += 15;
        perception += 15;
        break;
      case 'ISTJ': // 物流师——思考力和执行力特别强
        thinking += 10;
        execution += 20;
        break;
      case 'ISFJ': // 守卫者——执行力和感知力特别强
        execution += 15;
        perception += 15;
        break;
      case 'ESTJ': // 总经理——思考力和执行力特别强
        thinking += 10;
        execution += 20;
        break;
      case 'ESFJ': // 执政官——执行力和感知力特别强
        execution += 15;
        perception += 15;
        break;
      case 'ISTP': // 鉴赏家——思考力和感知力特别强
        thinking += 15;
        perception += 10;
        break;
      case 'ISFP': // 探险家——感知力特别强
        perception += 25;
        break;
      case 'ESTP': // 企业家——执行力特别强
        execution += 25;
        break;
      case 'ESFP': // 表演者——感知力和执行力特别强
        perception += 15;
        execution += 15;
        break;
    }
    
    // 确保数值在合理范围内(0-100)
    thinking = Math.min(Math.max(thinking, 0), 100);
    creativity = Math.min(Math.max(creativity, 0), 100);
    execution = Math.min(Math.max(execution, 0), 100);
    perception = Math.min(Math.max(perception, 0), 100);
    
    return {
      thinking,
      creativity,
      execution,
      perception
    };
  },
  
  // 获取职业特质分析
  getCareerTraits(mbtiType) {
    if (!mbtiType) return {};
    
    // 根据MBTI类型返回职业特质分析
    // 包括工作风格、团队角色和成长建议
    const careerTraitsMap = {
      'INTJ': {
        workStyle: '战略性思考者，注重效率和长期规划',
        teamRole: '战略顾问，系统设计师，革新者',
        advantage: '独立思考、善于规划、追求卓越',
        challenge: '有时过于理论化，可能忽略他人感受',
        development: '培养耐心，提高人际沟通技巧，学习接受多元观点'
      },
      'INTP': {
        workStyle: '逻辑思考者，自主性强，喜欢解决复杂问题',
        teamRole: '分析师，研究员，创新思想家',
        advantage: '逻辑清晰、创新思维、擅长系统分析',
        challenge: '可能缺乏执行力，容易陷入过度分析',
        development: '提高实践能力，设定明确期限，减少拖延'
      },
      'ENTJ': {
        workStyle: '决策者，目标导向，善于组织和领导',
        teamRole: '领导者，策略家，变革推动者',
        advantage: '领导力强、决策果断、高效组织',
        challenge: '有时过于专制，可能给他人带来压力',
        development: '学会倾听，培养同理心，提高情感智能'
      },
      'ENTP': {
        workStyle: '创新者，善于辩论，喜欢挑战和变化',
        teamRole: '创意生成者，辩论者，解决方案提供者',
        advantage: '思维敏捷、创意丰富、适应性强',
        challenge: '容易失去兴趣，项目可能半途而废',
        development: '培养恒心，设定短期目标，强化执行力'
      },
      'INFJ': {
        workStyle: '理想主义工作者，寻求意义，关注人的需求',
        teamRole: '愿景创造者，和谐促进者，人员发展者',
        advantage: '洞察力强、有创意、关注团队和谐',
        challenge: '可能过于追求完美，工作压力大',
        development: '学会放松，培养实用主义态度，设立界限'
      },
      'INFP': {
        workStyle: '价值驱动型工作者，重视真实性和个人成长',
        teamRole: '价值观守护者，创意思想家，人文关怀者',
        advantage: '有创意、有同理心、价值观坚定',
        challenge: '可能回避冲突，不擅长处理批评',
        development: '培养客观处事能力，提高实践技能，接受建设性反馈'
      },
      'ENFJ': {
        workStyle: '人员发展导向，善于激励，追求集体成功',
        teamRole: '教练，协调者，团队建设者',
        advantage: '沟通技巧强、有感染力、关注团队成长',
        challenge: '可能过度关注他人需求而忽视自己',
        development: '学会自我照顾，培养直接沟通，设立个人界限'
      },
      'ENFP': {
        workStyle: '热情的创新者，灵活多变，重视可能性',
        teamRole: '激励者，创意催化剂，连接者',
        advantage: '思维灵活、热情高涨、人际关系好',
        challenge: '可能难以坚持常规工作，注意力分散',
        development: '培养专注力，加强时间管理，坚持完成任务'
      },
      'ISTJ': {
        workStyle: '系统性工作者，负责任，关注细节和质量',
        teamRole: '组织者，执行者，稳定器',
        advantage: '可靠、有条理、注重质量',
        challenge: '可能过于保守，抗拒变化',
        development: '培养适应能力，接受新方法，增强灵活性'
      },
      'ISFJ': {
        workStyle: '服务型工作者，尽职尽责，重视他人需求',
        teamRole: '支持者，维护者，服务提供者',
        advantage: '细心、忠诚、有同理心',
        challenge: '可能难以拒绝请求，工作过度',
        development: '学会设定界限，培养自我主张，平衡工作与休息'
      },
      'ESTJ': {
        workStyle: '结构化管理者，追求效率，注重成果',
        teamRole: '管理者，监督者，传统维护者',
        advantage: '高效、有条理、结果导向',
        challenge: '可能过于强硬，忽视过程和人的感受',
        development: '培养耐心和灵活性，关注人际关系，接纳多样观点'
      },
      'ESFJ': {
        workStyle: '协作型工作者，团队导向，重视和谐关系',
        teamRole: '和谐促进者，团队建设者，服务领导者',
        advantage: '人际关系好、有合作精神、注重团队氛围',
        challenge: '可能过于在意他人评价，避免冲突',
        development: '培养独立思考，提高决策自信，学会处理冲突'
      },
      'ISTP': {
        workStyle: '实践型问题解决者，独立自主，关注效率',
        teamRole: '技术专家，故障排除者，实用创新者',
        advantage: '动手能力强、灵活应变、注重实效',
        challenge: '可能缺乏长期规划，沟通简短直接',
        development: '加强长期规划，提高沟通技巧，培养团队意识'
      },
      'ISFP': {
        workStyle: '灵活的创意工作者，重视自主性和真实表达',
        teamRole: '艺术家，审美专家，和平使者',
        advantage: '审美敏感、真诚、适应性强',
        challenge: '可能难以坚持常规工作，回避复杂问题',
        development: '培养结构化工作习惯，提高直接沟通能力，强化逻辑思维'
      },
      'ESTP': {
        workStyle: '行动导向型工作者，喜欢冒险和即时回馈',
        teamRole: '问题解决者，谈判者，行动催化剂',
        advantage: '反应迅速、务实、擅长危机处理',
        challenge: '可能缺乏耐心，忽视长期后果',
        development: '培养长期思维，提高计划能力，关注细节'
      },
      'ESFP': {
        workStyle: '社交型工作者，灵活多变，注重当下体验',
        teamRole: '调解者，团队活力源，现场应变者',
        advantage: '适应性强、人际关系好、工作热情高',
        challenge: '可能难以专注于细节，组织能力弱',
        development: '培养计划习惯，提高专注能力，完善时间管理'
      }
    };
    
    // 默认特质
    const defaultTraits = {
      workStyle: '注重平衡的工作方式，灵活适应不同环境',
      teamRole: '多功能团队成员，根据需要调整自身角色',
      advantage: '适应性强、多元思维、平衡发展',
      challenge: '可能需要更清晰的职业定位和发展方向',
      development: '明确优势领域，培养专精技能，建立职业规划'
    };
    
    return careerTraitsMap[mbtiType] || defaultTraits;
  },

  // 加载AI建议
  loadAiAdvice() {
    // 检查是否有测试结果
    if (!this.data.testCompleted || !this.data.result) {
      console.log('无法加载AI建议：尚未完成测试');
      return;
    }
    
    // 检查是否有缓存的AI建议
    const mbtiType = this.data.result.type;
    const cachedAdvice = wx.getStorageSync('mbti_ai_advice_' + mbtiType);
    
    if (cachedAdvice) {
      console.log('找到缓存的AI建议，直接使用');
      this.setData({
        aiAdvice: cachedAdvice,
        aiAdviceLoaded: true,
        aiAdviceError: false
      });
      return;
    }
    
    // 设置加载状态
    this.setData({
      aiAdviceLoaded: false,
      aiAdviceError: false,
      aiAdviceErrorMsg: ''
    });
    
    // 准备MBTI信息
    const mbtiInfo = {
      type: mbtiType,
      name: this.data.result.name,
      description: this.data.result.description
    };
    
    // 准备用户信息（从app.globalData获取）
    const userInfo = {
      gender: app.globalData.userSettings ? app.globalData.userSettings.gender : '',
      birthdate: app.globalData.userSettings ? app.globalData.userSettings.birthdate : '',
      occupation: app.globalData.userSettings ? app.globalData.userSettings.occupation : '',
      interests: app.globalData.userSettings ? app.globalData.userSettings.interests : [],
      // 添加更多用户信息
      age: app.globalData.userSettings && app.globalData.userSettings.birthdate ? this.calculateAge(app.globalData.userSettings.birthdate) : '',
      zodiac: app.globalData.userSettings && app.globalData.userSettings.birthdate ? this.getZodiacSign(app.globalData.userSettings.birthdate) : '',
      chineseZodiac: app.globalData.userSettings && app.globalData.userSettings.birthdate ? this.getChineseZodiac(app.globalData.userSettings.birthdate) : ''
    };
    
    console.log('正在请求AI建议...');
    console.log('MBTI信息:', mbtiInfo);
    console.log('用户信息:', userInfo);
    
    // 调用API获取AI建议 - 不使用wx.showLoading，因为页面已有加载动画
    deepseekApi.getMbtiAiAdvice(mbtiInfo, userInfo)
      .then(result => {
        console.log('获取AI建议成功:', result);
        
        // 更新数据
        if (result.aiAdvice && !result.aiAdvice.error) {
          this.setData({
            aiAdvice: result.aiAdvice,
            aiAdviceLoaded: true,
            aiAdviceError: false
          });
          
          // 缓存AI建议结果
          wx.setStorageSync('mbti_ai_advice_' + mbtiInfo.type, result.aiAdvice);
        } else {
          // 处理错误情况
          this.setData({
            aiAdviceError: true,
            aiAdviceErrorMsg: result.aiAdvice && result.aiAdvice.message ? result.aiAdvice.message : '获取AI建议失败',
            aiAdviceLoaded: false
          });
        }
      })
      .catch(err => {
        console.error('获取AI建议失败:', err);
        this.setData({
          aiAdviceError: true,
          aiAdviceErrorMsg: '网络错误，请稍后再试',
          aiAdviceLoaded: false
        });
      });
  },
  
  // 刷新AI建议
  refreshAiAdvice() {
    // 清除缓存的AI建议
    if (this.data.result && this.data.result.type) {
      wx.removeStorageSync('mbti_ai_advice_' + this.data.result.type);
    }
    
    // 重新加载AI建议
    this.loadAiAdvice();
  },
  
  // 计算年龄
  calculateAge(birthdate) {
    if (!birthdate) return '';
    
    // 解析生日格式 (假设格式为 YYYY-MM-DD)
    const parts = birthdate.split('-');
    if (parts.length !== 3) return '';
    
    const birthYear = parseInt(parts[0]);
    const birthMonth = parseInt(parts[1]);
    const birthDay = parseInt(parts[2]);
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    
    let age = currentYear - birthYear;
    
    // 如果今年的生日还没到，年龄减1
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      age--;
    }
    
    return age;
  },
  
  // 获取星座
  getZodiacSign(birthdate) {
    if (!birthdate) return '';
    
    // 解析生日格式
    const parts = birthdate.split('-');
    if (parts.length !== 3) return '';
    
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    
    // 星座日期范围
    const signs = [
      {name: '水瓶座', start: [1, 20], end: [2, 18]},
      {name: '双鱼座', start: [2, 19], end: [3, 20]},
      {name: '白羊座', start: [3, 21], end: [4, 19]},
      {name: '金牛座', start: [4, 20], end: [5, 20]},
      {name: '双子座', start: [5, 21], end: [6, 21]},
      {name: '巨蟹座', start: [6, 22], end: [7, 22]},
      {name: '狮子座', start: [7, 23], end: [8, 22]},
      {name: '处女座', start: [8, 23], end: [9, 22]},
      {name: '天秤座', start: [9, 23], end: [10, 23]},
      {name: '天蝎座', start: [10, 24], end: [11, 22]},
      {name: '射手座', start: [11, 23], end: [12, 21]},
      {name: '摩羯座', start: [12, 22], end: [1, 19]}
    ];
    
    for (let i = 0; i < signs.length; i++) {
      const sign = signs[i];
      
      // 处理跨年的情况（摩羯座）
      if (sign.name === '摩羯座') {
        if ((month === 12 && day >= sign.start[1]) || (month === 1 && day <= sign.end[1])) {
          return sign.name;
        }
      } 
      // 处理其他星座
      else if ((month === sign.start[0] && day >= sign.start[1]) || 
               (month === sign.end[0] && day <= sign.end[1])) {
        return sign.name;
      }
    }
    
    return '';
  },
  
  // 获取生肖
  getChineseZodiac(birthdate) {
    if (!birthdate) return '';
    
    const parts = birthdate.split('-');
    if (parts.length !== 3) return '';
    
    const year = parseInt(parts[0]);
    
    const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    
    // 计算生肖，1900年是鼠年
    const index = (year - 1900) % 12;
    return animals[(index + 12) % 12];
  },

  // 保存答题进度
  saveProgress() {
    const progress = {
      testMode: this.data.testMode,
      currentQuestion: this.data.currentQuestion,
      answers: this.data.answers,
      questions: this.data.questions
    };
    
    wx.setStorageSync('mbti_progress', progress);
    console.log('已保存答题进度:', this.data.currentQuestion + 1, '/', this.data.questions.length);
  },
  
  // 加载答题进度
  loadProgress() {
    try {
      const progress = wx.getStorageSync('mbti_progress');
      
      if (progress && progress.currentQuestion > 0) {
        console.log('发现未完成的测试:', progress.testMode);
        console.log('上次答题进度:', progress.currentQuestion + 1, '/', progress.questions.length);
        
        // 弹窗询问是否继续上次的测试
        wx.showModal({
          title: '继续测试',
          content: '发现未完成的测试，是否继续？',
          success: (res) => {
            if (res.confirm) {
              this.restoreTestProgress(progress);
            } else {
              // 清除进度，准备重新测试
              wx.removeStorageSync('mbti_progress');
            }
          }
        });
      }
    } catch (error) {
      console.error('加载答题进度失败:', error);
    }
  },
  
  // 恢复测试进度
  restoreTestProgress(progress) {
    if (!progress) return;
    
    try {
      // 根据测试模式加载对应题库
      let questionSet = [];
      if (progress.testMode === 'short') {
        if (shortQuestions && Array.isArray(shortQuestions) && shortQuestions.length > 0) {
          questionSet = shortQuestions;
          console.log('恢复简化版题库，题目数量:', questionSet.length);
        } else {
          console.error('简化版题库加载失败或为空，无法恢复进度');
          throw new Error('简化版题库加载失败');
        }
      } else {
        if (questions && Array.isArray(questions) && questions.length > 0) {
          questionSet = questions;
          console.log('恢复标准版题库，题目数量:', questionSet.length);
        } else {
          console.error('标准版题库加载失败或为空，无法恢复进度');
          throw new Error('标准版题库加载失败');
        }
      }
      
      // 检查题库的有效性
      if (questionSet.length === 0) {
        console.error('恢复的题库为空');
        throw new Error('题库为空');
      }
      
      // 检查题库格式是否正确
      const sampleQuestion = questionSet[0];
      if (!sampleQuestion || !sampleQuestion.dimension) {
        console.error('题库格式不正确，缺少必要的dimension属性');
        throw new Error('题库格式错误');
      }
      
      // 如果题库与保存的不一致，使用当前题库
      if (questionSet.length !== progress.questions.length) {
        console.log('题库变更，使用当前题库');
        // 重置答案数组
        const answers = new Array(questionSet.length).fill(null);
        
        this.setData({
          testMode: progress.testMode,
          questions: questionSet,
          currentQuestion: 0,
          selectedOption: '',
          answers: answers,
          isTestActive: true,
          showTestModeSelection: false,
          currentStep: 'testing'
        });
      } else {
        // 恢复保存的进度
        // 安全检查：确保currentQuestion在有效范围内
        const currentQuestion = Math.min(progress.currentQuestion, questionSet.length - 1);
        
        this.setData({
          testMode: progress.testMode,
          questions: questionSet,
          currentQuestion: currentQuestion,
          answers: progress.answers,
          selectedOption: progress.answers[currentQuestion] || '',
          isTestActive: true,
          showTestModeSelection: false,
          currentStep: 'testing'
        });
      }
      
      console.log('已恢复测试进度:', this.data.currentQuestion + 1, '/', this.data.questions.length);
    } catch (error) {
      console.error('恢复测试进度失败:', error);
      // 出错时重新开始测试
      wx.showToast({
        title: '恢复测试失败，请重新开始',
        icon: 'none',
        duration: 2000
      });
      this.startTest();
    }
  },

  // 计算适合的朋友和恋人类型
  calculateRelationships(mbtiType) {
    if (!mbtiType || mbtiType.length !== 4) {
      return {
        friends: [],
        partners: []
      };
    }
    
    // 适合的朋友和恋人匹配规则
    // 基于MBTI的认知功能和性格互补原则
    
    // 1. 定义匹配数据结构
    const relationships = {
      friends: [], // 适合的朋友类型
      partners: [] // 适合的恋人类型
    };
    
    // 2. 根据MBTI类型分类
    // NT: 分析家族 - INTJ, INTP, ENTJ, ENTP
    // NF: 外交家族 - INFJ, INFP, ENFJ, ENFP
    // SJ: 守卫家族 - ISTJ, ISFJ, ESTJ, ESFJ
    // SP: 探险家族 - ISTP, ISFP, ESTP, ESFP
    
    // 3. 计算匹配度的基本规则
    // - 相似的N/S偏好通常能更好地理解对方的思维方式
    // - 互补的E/I偏好可以平衡社交能量
    // - T/F互补可以提供不同视角
    // - 相似的J/P偏好在生活习惯上更协调
    
    // 获取当前类型的特性
    const isExtrovert = mbtiType.charAt(0) === 'E';
    const isIntuitive = mbtiType.charAt(1) === 'N';
    const isThinking = mbtiType.charAt(2) === 'T';
    const isJudging = mbtiType.charAt(3) === 'J';
    
    // 朋友匹配规则
    const friendMatchRules = {
      // 分析家族 NT
      'INTJ': [
        { type: 'ENTP', score: 90, reason: '思维互补，ENTP的创新思维能启发INTJ的系统思考' },
        { type: 'INFJ', score: 85, reason: '共享直觉思维，能深度理解彼此的想法和价值观' },
        { type: 'INTP', score: 80, reason: '共享对知识的追求，享受深度理性讨论' }
      ],
      'INTP': [
        { type: 'INTJ', score: 85, reason: '思维模式相似，都喜欢逻辑和理论探索' },
        { type: 'ENTP', score: 90, reason: 'ENTP的外向性平衡INTP的内向，共享创新思维' },
        { type: 'INFJ', score: 80, reason: 'INFJ的感性思维补充INTP的逻辑分析' }
      ],
      'ENTJ': [
        { type: 'INTP', score: 85, reason: 'INTP的深度思考能够丰富ENTJ的战略视野' },
        { type: 'ENFP', score: 80, reason: 'ENFP的创造力与ENTJ的执行力形成良好互补' },
        { type: 'INTJ', score: 90, reason: '思维方式相似，INTJ的深度分析能强化ENTJ的决策' }
      ],
      'ENTP': [
        { type: 'INTJ', score: 90, reason: 'INTJ的战略思维能帮助ENTP实现创意' },
        { type: 'INTP', score: 85, reason: '共享思维模式，INTP的深度思考启发ENTP' },
        { type: 'ENFJ', score: 80, reason: 'ENFJ的人际敏感性与ENTP的创新思维互补' }
      ],
      
      // 外交家族 NF
      'INFJ': [
        { type: 'ENTP', score: 85, reason: 'ENTP的创新与INFJ的洞察力形成良好互动' },
        { type: 'ENFP', score: 90, reason: '共享理想主义和创造力，能相互激励' },
        { type: 'INTJ', score: 80, reason: '思维方式相似，都有强大的内在世界' }
      ],
      'INFP': [
        { type: 'ENFJ', score: 90, reason: 'ENFJ的外向和组织能力与INFP的创意和理想互补' },
        { type: 'INFJ', score: 85, reason: '价值观相似，能理解彼此的理想主义倾向' },
        { type: 'ENTP', score: 80, reason: 'ENTP的逻辑思维能帮助INFP实现想法' }
      ],
      'ENFJ': [
        { type: 'INFP', score: 90, reason: '能深入理解INFP的内心世界，提供支持和指导' },
        { type: 'ENTP', score: 85, reason: 'ENTP的创新思维与ENFJ的人际关怀形成互补' },
        { type: 'INTJ', score: 80, reason: 'INTJ的战略思维能够平衡ENFJ的情感决策' }
      ],
      'ENFP': [
        { type: 'INFJ', score: 90, reason: 'INFJ的深度思考和稳定能平衡ENFP的活跃能量' },
        { type: 'INTJ', score: 85, reason: 'INTJ的结构化思维能帮助ENFP实现创意' },
        { type: 'ENFJ', score: 80, reason: '共享价值观和热情，都关注他人的发展' }
      ],
      
      // 守卫家族 SJ
      'ISTJ': [
        { type: 'ESTP', score: 85, reason: 'ESTP的活力能活跃ISTJ的严谨风格' },
        { type: 'ISFJ', score: 90, reason: '共享责任感和组织能力，相互理解和支持' },
        { type: 'ESFJ', score: 80, reason: 'ESFJ的社交能力平衡ISTJ的内敛' }
      ],
      'ISFJ': [
        { type: 'ESFP', score: 85, reason: 'ESFP的活力能够活跃ISFJ的日常' },
        { type: 'ISTJ', score: 90, reason: '相似的价值观和责任感，能相互理解' },
        { type: 'ENFP', score: 80, reason: 'ENFP的创造力能拓展ISFJ的视野' }
      ],
      'ESTJ': [
        { type: 'ISTP', score: 85, reason: 'ISTP的灵活性能平衡ESTJ的结构化思维' },
        { type: 'ISTJ', score: 90, reason: '共享逻辑思维和责任感，能高效协作' },
        { type: 'ESFP', score: 80, reason: 'ESFP的轻松态度能放松ESTJ的严肃风格' }
      ],
      'ESFJ': [
        { type: 'ISFP', score: 85, reason: 'ISFP的艺术才能能丰富ESFJ的生活' },
        { type: 'ISTJ', score: 80, reason: 'ISTJ的结构化思维能支持ESFJ的组织能力' },
        { type: 'ENFP', score: 90, reason: '共享人际关怀，ENFP的创造力能启发ESFJ' }
      ],
      
      // 探险家族 SP
      'ISTP': [
        { type: 'ESTP', score: 90, reason: '共享实用主义和灵活性，ESTP的社交能力互补' },
        { type: 'ISFP', score: 85, reason: '相似的灵活态度，ISFP的感性能平衡ISTP的理性' },
        { type: 'ENTJ', score: 80, reason: 'ENTJ的目标导向能给ISTP提供发展方向' }
      ],
      'ISFP': [
        { type: 'ESFP', score: 90, reason: '共享感性和审美，ESFP的外向性互补' },
        { type: 'ISTP', score: 85, reason: '相似的内在自由精神，相互理解' },
        { type: 'ENFJ', score: 80, reason: 'ENFJ的组织能力能帮助ISFP实现潜能' }
      ],
      'ESTP': [
        { type: 'ISTP', score: 90, reason: '思维方式相似，共享对自由和冒险的热爱' },
        { type: 'ESFP', score: 85, reason: '共享对当下体验的重视，能一起享受生活' },
        { type: 'ISFJ', score: 80, reason: 'ISFJ的稳定性能平衡ESTP的冒险精神' }
      ],
      'ESFP': [
        { type: 'ISFP', score: 90, reason: '共享感性和审美，能一起享受生活的乐趣' },
        { type: 'ESTP', score: 85, reason: '相似的外向和冒险精神，共享体验' },
        { type: 'ISTJ', score: 80, reason: 'ISTJ的组织能力能给ESFP的生活带来结构' }
      ]
    };
    
    // 恋人匹配规则 - 更倾向于心理函数的互补
    const partnerMatchRules = {
      // 分析家族 NT
      'INTJ': [
        { type: 'ENFP', score: 95, reason: 'ENFP的热情和创造力能平衡INTJ的理性与内敛，互相吸引' },
        { type: 'ENTP', score: 90, reason: '共享思考深度，ENTP的活力能活跃INTJ的严谨' },
        { type: 'INFJ', score: 85, reason: '思维方式相似且互补，深度连接与理解' }
      ],
      'INTP': [
        { type: 'ENFJ', score: 95, reason: 'ENFJ的情感表达和组织能力与INTP的逻辑思维高度互补' },
        { type: 'ENTJ', score: 90, reason: 'ENTJ的决断力能帮助INTP将想法转为行动' },
        { type: 'INFJ', score: 85, reason: '深度思考的共鸣，INFJ的感性平衡INTP的理性' }
      ],
      'ENTJ': [
        { type: 'INFP', score: 95, reason: 'INFP的理想主义和内在情感与ENTJ的目标导向高度互补' },
        { type: 'INTP', score: 90, reason: 'INTP的深度思考能丰富ENTJ的决策过程' },
        { type: 'ENFP', score: 85, reason: '共享创新思维，ENFP的感性平衡ENTJ的理性' }
      ],
      'ENTP': [
        { type: 'INFJ', score: 95, reason: 'INFJ的深度和洞察力与ENTP的创新思维完美互补' },
        { type: 'INTJ', score: 90, reason: '思维模式互补，INTJ的专注能帮助ENTP实现目标' },
        { type: 'ENFJ', score: 85, reason: '共享外向特质，ENFJ的情感深度平衡ENTP的逻辑' }
      ],
      
      // 外交家族 NF
      'INFJ': [
        { type: 'ENTP', score: 95, reason: 'ENTP的创新与活力能激发INFJ的深度与洞察' },
        { type: 'ENFP', score: 90, reason: '共享理想主义，ENFP的外向性平衡INFJ的内敛' },
        { type: 'INTJ', score: 85, reason: '思维深度相似，能彼此理解内心世界' }
      ],
      'INFP': [
        { type: 'ENTJ', score: 95, reason: 'ENTJ的结构和目标导向能实现INFP的理想和创意' },
        { type: 'ENFJ', score: 90, reason: 'ENFJ的关怀和组织能力支持INFP的价值实现' },
        { type: 'INTJ', score: 85, reason: '共享深度思考，互相理解内心独立性' }
      ],
      'ENFJ': [
        { type: 'INTP', score: 95, reason: 'INTP的逻辑与深度思考能平衡ENFJ的感性决策' },
        { type: 'ISFP', score: 90, reason: 'ISFP的创意与真实性能启发ENFJ的关怀特质' },
        { type: 'INFP', score: 85, reason: '共享价值导向，能深度理解彼此的理想' }
      ],
      'ENFP': [
        { type: 'INTJ', score: 95, reason: 'INTJ的深度和结构能给ENFP的创意提供方向' },
        { type: 'INFJ', score: 90, reason: '共享理想主义，INFJ的深度平衡ENFP的广度' },
        { type: 'ISTJ', score: 85, reason: 'ISTJ的务实能力能帮助ENFP实现想法' }
      ],
      
      // 守卫家族 SJ
      'ISTJ': [
        { type: 'ESFP', score: 95, reason: 'ESFP的自发性和乐观能平衡ISTJ的严谨和责任感' },
        { type: 'ENFP', score: 90, reason: 'ENFP的创意和热情能活跃ISTJ的务实风格' },
        { type: 'ESTP', score: 85, reason: 'ESTP的冒险精神与ISTJ的稳定性形成有趣的对比' }
      ],
      'ISFJ': [
        { type: 'ESTP', score: 95, reason: 'ESTP的活力和冒险精神能活跃ISFJ的关怀特质' },
        { type: 'ENTP', score: 90, reason: 'ENTP的创新思维能拓展ISFJ的传统观念' },
        { type: 'ESFP', score: 85, reason: '共享感性，ESFP的外向性平衡ISFJ的内敛' }
      ],
      'ESTJ': [
        { type: 'ISFP', score: 95, reason: 'ISFP的艺术性和灵活度能软化ESTJ的结构化风格' },
        { type: 'INFP', score: 90, reason: 'INFP的理想主义能拓展ESTJ的实用主义视野' },
        { type: 'ISTP', score: 85, reason: 'ISTP的灵活性能平衡ESTJ的计划性' }
      ],
      'ESFJ': [
        { type: 'ISTP', score: 95, reason: 'ISTP的独立性和实用技能能平衡ESFJ的人际关注' },
        { type: 'INFP', score: 90, reason: 'INFP的深度和创意能丰富ESFJ的生活' },
        { type: 'ISFP', score: 85, reason: 'ISFP的艺术感能与ESFJ的社交能力互补' }
      ],
      
      // 探险家族 SP
      'ISTP': [
        { type: 'ESFJ', score: 95, reason: 'ESFJ的情感表达和社交能力与ISTP的实用技能互补' },
        { type: 'ESTJ', score: 90, reason: 'ESTJ的组织能力能给ISTP的技能提供发展方向' },
        { type: 'ENFJ', score: 85, reason: 'ENFJ的人际关怀能平衡ISTP的独立性' }
      ],
      'ISFP': [
        { type: 'ESTJ', score: 95, reason: 'ESTJ的结构和组织能力能帮助ISFP实现创意' },
        { type: 'ENTJ', score: 90, reason: 'ENTJ的目标导向能给ISFP的艺术才能提供方向' },
        { type: 'ESFJ', score: 85, reason: '共享感性，ESFJ的社交能力平衡ISFP的内敛' }
      ],
      'ESTP': [
        { type: 'ISFJ', score: 95, reason: 'ISFJ的责任感和关怀能平衡ESTP的冒险精神' },
        { type: 'ISTJ', score: 90, reason: 'ISTJ的计划性能给ESTP的行动力提供方向' },
        { type: 'INFJ', score: 85, reason: 'INFJ的深度思考能丰富ESTP的体验导向' }
      ],
      'ESFP': [
        { type: 'ISTJ', score: 95, reason: 'ISTJ的责任感和组织能力能平衡ESFP的即兴特质' },
        { type: 'ISFJ', score: 90, reason: 'ISFJ的关怀和稳定能补充ESFP的活力' },
        { type: 'INTJ', score: 85, reason: 'INTJ的战略思维能给ESFP的创意提供结构' }
      ]
    };
    
    // 获取当前类型的匹配配置
    const friendMatches = friendMatchRules[mbtiType] || [];
    const partnerMatches = partnerMatchRules[mbtiType] || [];
    
    // 如果没有预设的匹配配置，使用通用规则生成匹配
    if (friendMatches.length === 0) {
      // 所有16种MBTI类型
      const allTypes = [
        'INTJ', 'INTP', 'ENTJ', 'ENTP',
        'INFJ', 'INFP', 'ENFJ', 'ENFP',
        'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
        'ISTP', 'ISFP', 'ESTP', 'ESFP'
      ];
      
      // 为每种类型计算一个基础匹配分数
      allTypes.forEach(type => {
        if (type !== mbtiType) {
          const otherIsExtrovert = type.charAt(0) === 'E';
          const otherIsIntuitive = type.charAt(1) === 'N';
          const otherIsThinking = type.charAt(2) === 'T';
          const otherIsJudging = type.charAt(3) === 'J';
          
          // 计算基础得分
          let score = 60; // 基础分
          
          // 相同的N/S偏好加分
          if ((isIntuitive && otherIsIntuitive) || (!isIntuitive && !otherIsIntuitive)) {
            score += 10;
          }
          
          // 互补的E/I偏好加分
          if (isExtrovert !== otherIsExtrovert) {
            score += 8;
          }
          
          // 互补的T/F偏好轻微加分
          if (isThinking !== otherIsThinking) {
            score += 5;
          }
          
          // 相同的J/P偏好轻微加分
          if (isJudging === otherIsJudging) {
            score += 7;
          }
          
          // 生成匹配原因
          let reason = '基于性格特质互补原则';
          
          // 获取类型名称
          const typeInfo = this.getTypeInfo(type);
          const typeName = typeInfo ? typeInfo.name : type;
          
          // 根据得分高低，分配到朋友或恋人类别
          if (score >= 75) {
            relationships.friends.push({
              type: type,
              typeName: typeName,
              score: score,
              reason: reason
            });
          }
          
          // 恋人匹配可以有不同的评分标准
          const romanticScore = score + (isThinking !== otherIsThinking ? 10 : 0);
          
          if (romanticScore >= 80) {
            relationships.partners.push({
              type: type,
              typeName: typeName,
              score: romanticScore,
              reason: reason + '，适合发展浪漫关系'
            });
          }
        }
      });
    } else {
      // 使用预设的匹配配置，为每个配置添加类型名称
      relationships.friends = friendMatches.map(match => {
        const typeInfo = this.getTypeInfo(match.type);
        return {
          ...match,
          typeName: typeInfo ? typeInfo.name : match.type
        };
      });
      
      relationships.partners = partnerMatches.map(match => {
        const typeInfo = this.getTypeInfo(match.type);
        return {
          ...match,
          typeName: typeInfo ? typeInfo.name : match.type
        };
      });
    }
    
    // 按匹配分数排序
    relationships.friends.sort((a, b) => b.score - a.score);
    relationships.partners.sort((a, b) => b.score - a.score);
    
    // 只保留前3个最佳匹配
    relationships.friends = relationships.friends.slice(0, 3);
    relationships.partners = relationships.partners.slice(0, 3);
    
    return relationships;
  },

  // 开始重新测试
  startRetest() {
    // 获取当前MBTI类型并清除其AI建议缓存
    if (this.data.result && this.data.result.type) {
      wx.removeStorageSync('mbti_ai_advice_' + this.data.result.type);
    }
    
    // 清除之前的答题进度
    wx.removeStorageSync('mbti_progress');
    
    // 完全重置测试状态和结果
    this.setData({
      isRetesting: true,
      isTestActive: false,
      showTestModeSelection: true,
      currentStep: 'mode_selection',
      hasTestResult: false,
      testCompleted: false,
      result: null,
      aiAdviceLoaded: false,
      aiAdviceError: false,
      answers: [],
      currentQuestion: 0,
      selectedOption: ''
    });
    
    console.log('准备重新测试，已清除之前的测试结果和答题进度');
  },

  // 加载标签页配置
  loadTabConfig: function() {
    wx.cloud.callFunction({
      name: 'getMbtiTabConfig',
      success: res => {
        console.log('获取标签配置成功:', res);
        if (res.result.code === 0 && res.result.data) {
          this.setData({
            tabItems: res.result.data
          });
        } else {
          console.error('获取标签配置失败:', res.result.message);
          // 使用默认配置
          this.setData({
            tabItems: [
              { index: 0, text: '性格测试', key: 'test' },
              { index: 1, text: '人格模型', key: 'model' },
              { index: 2, text: 'AI建议', key: 'ai' }
            ]
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败:', err);
        // 使用默认配置
        this.setData({
          tabItems: [
            { index: 0, text: '性格测试', key: 'test' },
            { index: 1, text: '人格模型', key: 'model' },
            { index: 2, text: 'AI建议', key: 'ai' }
          ]
        });
      }
    });
  },

  // 更新当前时间
  updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.setData({
      currentTime: `${hours}:${minutes}`
    });
  },

  // 加载天气数据
  async loadWeatherData() {
    try {
      // 从用户设置中获取位置信息
      const userSettings = wx.getStorageSync('userSettings') || {};
      const location = {
        city: userSettings.currentLocation ? userSettings.currentLocation.split('，')[0] : '杭州'
      };
      
      // 检查是否有当天的缓存数据，且位置未变更
      const today = new Date().toDateString();
      const cachedData = wx.getStorageSync('weatherData');
      const isSameLocation = cachedData && cachedData.location === location.city;
      
      if (cachedData && cachedData.date === today && isSameLocation) {
        this.setData({
          weatherData: cachedData.data,
          clothingAdvice: cachedData.clothingAdvice
        });
        return;
      }
      
      // 显示加载提示
      wx.showLoading({
        title: '更新天气中...',
        mask: true
      });
      
      // 调用API获取新数据
      const { weather, clothingAdvice } = await getWeatherAndAdvice(location, userSettings);
      
      // 更新数据
      this.setData({
        weatherData: weather,
        clothingAdvice
      });
      
      // 缓存数据
      wx.setStorageSync('weatherData', {
        date: today,
        location: location.city,
        data: weather,
        clothingAdvice
      });
      
      wx.hideLoading();
    } catch (error) {
      console.error('加载天气数据失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '获取天气信息失败',
        icon: 'none'
      });
    }
  },

  // 字符输入处理
  onCharacterInput(e) {
    this.setData({
      inputCharacter: e.detail.value
    });
  },

  // 提交字测分析
  async submitDivination() {
    const { inputText } = this.data;
    if (!inputText) {
      wx.showToast({
        title: '请输入想测的事情',
        icon: 'none'
      });
      return;
    }
    
    try {
      wx.showLoading({
        title: '正在解析...'
      });

      // 获取用户设置中的个人信息
      const userSettings = wx.getStorageSync('userSettings') || {};
      
      // 构建用户信息对象，使用正确的字段
      const userInfo = {
        nickname: userSettings.nickname,
        birthdate: userSettings.birthdate,
        birthtime: userSettings.birthtime,
        mbti: userSettings.mbti,
        birthplace: userSettings.birthplace,
        birthplaceArray: userSettings.birthplaceArray,
        currentLocation: userSettings.currentLocation
      };
      
      // 调用新的测事API
      const result = await this.getDivination(inputText, userInfo);
      
      this.setData({
        divinationResult: result
      });
      
      wx.hideLoading();
    } catch (error) {
      console.error('测事分析失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '解析失败，请重试',
        icon: 'none'
      });
    }
  },

  // 文本输入处理
  onTextInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  // 新增测事API调用方法
  async getDivination(text, userInfo) {
    const prompt = `用户想测的事情是："${text}"

用户基本信息：
出生日期：${userInfo.birthdate || '未知'}
出生时间：${userInfo.birthtime || '未知'}
出生地点：${userInfo.birthplace || '未知'}
当前位置：${userInfo.currentLocation || '未知'}
MBTI类型：${userInfo.mbti || '未知'}

请基于周易八卦和五行理论，结合用户的生辰信息，对此事进行分析：

1. 此事的卦象分析（200字）
2. 事情发展趋势（200字）
3. 时机选择建议（100字）
4. 趋吉避凶指导（150字）
5. 开运建议：
   - 有利时间
   - 有利方位
   - 有利颜色
   - 注意事项
6. 化解方案（如果有不利因素）

请以JSON格式返回，包含以下字段：
{
  "hexagram": {
    "name": "卦名",
    "description": "卦象描述",
    "analysis": "详细分析"
  },
  "trend": {
    "current": "当前形势",
    "future": "发展趋势",
    "timing": "时机分析"
  },
  "guidance": {
    "favorable": ["有利因素"],
    "unfavorable": ["不利因素"],
    "precautions": ["注意事项"]
  },
  "recommendations": {
    "timing": "最佳时机",
    "direction": "有利方位",
    "colors": ["有利颜色"],
    "actions": ["建议行动"]
  },
  "resolution": {
    "challenges": ["潜在挑战"],
    "solutions": ["化解方案"]
  }
}`;

    const messages = [
      {
        role: 'system',
        content: '你是一位精通周易八卦、五行和命理的大师。请基于用户的生辰信息和所问之事，进行专业的分析和指导。请始终以JSON格式返回数据，确保完全符合要求的结构。'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      const response = await deepseekApi.callDeepseek(messages);
      const jsonContent = response.match(/```json\n([\s\S]*?)\n```/);
      
      if (!jsonContent || !jsonContent[1]) {
        throw new Error('无法从响应中提取JSON内容');
      }

      const result = JSON.parse(jsonContent[1]);
      return result;
    } catch (error) {
      console.error('测事分析API调用失败:', error);
      throw error;
    }
  },

  // 返回测试模式选择
  backToTestMode() {
    this.setData({
      showTestModeSelection: true,
      currentQuestion: 0,
      selectedOption: '',
      answers: new Array(this.data.questions.length).fill(null)
    });
  }
}) 