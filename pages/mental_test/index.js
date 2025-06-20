const app = getApp()

Page({
  data: {
    // 李克特量表选项定义
    likertFrequencyOptions: [
      { value: 0, label: '从不', icon: '😌' },
      { value: 1, label: '几乎不', icon: '😐' },
      { value: 2, label: '有时', icon: '😟' },
      { value: 3, label: '经常', icon: '😞' }
    ],
    likertAgreementOptions: [
      { value: 1, label: '完全不同意', icon: '👎' },
      { value: 2, label: '不同意', icon: '😐' },
      { value: 3, label: '中立', icon: '😑' },
      { value: 4, label: '同意', icon: '😊' },
      { value: 5, label: '完全同意', icon: '👍' }
    ],
    
    // 测试状态变量
    showTestModal: false,
    currentTest: null,
    currentQuestion: null,
    currentQuestionIndex: 0,
    selectedAnswer: null,
    testAnswers: {},
    testResult: null,
    testHistory: [],
    
    // 测试分类
    categories: [
      { id: 'all', name: '全部' },
      { id: 'emotion', name: '情绪类' },
      { id: 'personality', name: '人格特质' },
      { id: 'health', name: '心理健康' },
      { id: 'social', name: '人际关系' },
      { id: 'stress', name: '压力管理' }
    ],
    currentCategory: 'all',
    
    // 专业测试列表数据
    testList: [
      {
        id: 'depression_screening',
        name: '抑郁症筛查量表',
        category: '心理健康',
        categoryId: 'health',
        description: '基于PHQ-9量表，科学评估抑郁症状',
        duration: 15,
        questionsCount: 9,
        difficulty: '专业',
        completion: 0,
        color: 'blue',
        icon: '🧠',
        tags: ['抑郁筛查', 'PHQ-9', '专业量表'],
        questions: [
          {
            id: 1,
            question: '在过去两周内，您感到情绪低落、沮丧或绝望的频率是？',
            type: 'likert_frequency',
            dimension: 'mood',
            weight: 1
          },
          {
            id: 2,
            question: '在过去两周内，您对平时感兴趣或愉快的事情失去兴趣的频率是？',
            type: 'likert_frequency',
            dimension: 'anhedonia',
            weight: 1
          },
          {
            id: 3,
            question: '在过去两周内，您入睡困难、睡眠不安或睡眠过多的频率是？',
            type: 'likert_frequency',
            dimension: 'sleep',
            weight: 1
          },
          {
            id: 4,
            question: '在过去两周内，您感到疲倦或没有精力的频率是？',
            type: 'likert_frequency',
            dimension: 'energy',
            weight: 1
          },
          {
            id: 5,
            question: '在过去两周内，您食欲不振或吃得过多的频率是？',
            type: 'likert_frequency',
            dimension: 'appetite',
            weight: 1
          },
          {
            id: 6,
            question: '在过去两周内，您觉得自己很糟糕或认为自己让家人失望的频率是？',
            type: 'likert_frequency',
            dimension: 'self_worth',
            weight: 1
          },
          {
            id: 7,
            question: '在过去两周内，您注意力不集中（如阅读报纸或看电视时）的频率是？',
            type: 'likert_frequency',
            dimension: 'concentration',
            weight: 1
          },
          {
            id: 8,
            question: '在过去两周内，您动作或说话速度缓慢，或坐立不安、烦躁的频率是？',
            type: 'likert_frequency',
            dimension: 'psychomotor',
            weight: 1
          },
          {
            id: 9,
            question: '在过去两周内，您有想要伤害自己或认为死了更好的想法的频率是？',
            type: 'likert_frequency',
            dimension: 'suicidal_ideation',
            weight: 2
          }
        ]
      },
      {
        id: 'anxiety_screening',
        name: '焦虑症筛查量表',
        category: '心理健康',
        categoryId: 'health',
        description: '基于GAD-7量表，评估广泛性焦虑障碍',
        duration: 10,
        questionsCount: 7,
        difficulty: '专业',
        completion: 0,
        color: 'purple',
        icon: '😰',
        tags: ['焦虑筛查', 'GAD-7', '专业量表'],
        questions: [
          {
            id: 1,
            question: '在过去两周内，您感到紧张、焦虑或急躁的频率是？',
            type: 'likert_frequency',
            dimension: 'nervousness',
            weight: 1
          },
          {
            id: 2,
            question: '在过去两周内，您无法停止或控制担忧的频率是？',
            type: 'likert_frequency',
            dimension: 'uncontrollable_worry',
            weight: 1
          },
          {
            id: 3,
            question: '在过去两周内，您对各种各样的事情担忧过多的频率是？',
            type: 'likert_frequency',
            dimension: 'excessive_worry',
            weight: 1
          },
          {
            id: 4,
            question: '在过去两周内，您很难放松的频率是？',
            type: 'likert_frequency',
            dimension: 'trouble_relaxing',
            weight: 1
          },
          {
            id: 5,
            question: '在过去两周内，您坐立不安，很难安静地坐着的频率是？',
            type: 'likert_frequency',
            dimension: 'restlessness',
            weight: 1
          },
          {
            id: 6,
            question: '在过去两周内，您变得容易烦恼或急躁的频率是？',
            type: 'likert_frequency',
            dimension: 'irritability',
            weight: 1
          },
          {
            id: 7,
            question: '在过去两周内，您感到似乎有什么可怕的事要发生的频率是？',
            type: 'likert_frequency',
            dimension: 'fear_something_awful',
            weight: 1
          }
        ]
      },
      {
        id: 'stress_assessment',
        name: '压力感知量表',
        category: '压力管理',
        categoryId: 'stress',
        description: '评估您对生活压力的感知和应对能力',
        duration: 12,
        questionsCount: 10,
        difficulty: '中等',
        completion: 0,
        color: 'red',
        icon: '🧘',
        tags: ['压力评估', '应对能力', '生活压力'],
        questions: [
          {
            id: 1,
            question: '在过去一个月中，您因某些意想不到的事情的发生而感到心烦意乱的频率？',
            type: 'likert_frequency',
            dimension: 'unexpected_events',
            weight: 1
          },
          {
            id: 2,
            question: '在过去一个月中，您感到无法控制生活中重要事情的频率？',
            type: 'likert_frequency',
            dimension: 'lack_control',
            weight: 1
          },
          {
            id: 3,
            question: '在过去一个月中，您感到紧张和有压力的频率？',
            type: 'likert_frequency',
            dimension: 'nervous_stressed',
            weight: 1
          },
          {
            id: 4,
            question: '在过去一个月中，您成功应对恼人的生活麻烦的频率？',
            type: 'likert_frequency_reverse',
            dimension: 'coping_success',
            weight: 1
          },
          {
            id: 5,
            question: '在过去一个月中，您感觉自己能够有效地应对生活中发生的重要改变的频率？',
            type: 'likert_frequency_reverse',
            dimension: 'effective_coping',
            weight: 1
          },
          {
            id: 6,
            question: '在过去一个月中，您对自己有能力处理个人问题感到自信的频率？',
            type: 'likert_frequency_reverse',
            dimension: 'personal_confidence',
            weight: 1
          },
          {
            id: 7,
            question: '在过去一个月中，您感到事情进展顺利的频率？',
            type: 'likert_frequency_reverse',
            dimension: 'things_going_well',
            weight: 1
          },
          {
            id: 8,
            question: '在过去一个月中，您发现自己无法应付所有需要做的事情的频率？',
            type: 'likert_frequency',
            dimension: 'unable_cope',
            weight: 1
          },
          {
            id: 9,
            question: '在过去一个月中，您能够控制生活中恼人的事情的频率？',
            type: 'likert_frequency_reverse',
            dimension: 'control_irritations',
            weight: 1
          },
          {
            id: 10,
            question: '在过去一个月中，您感到自己掌控一切的频率？',
            type: 'likert_frequency_reverse',
            dimension: 'in_control',
            weight: 1
          }
        ]
      },
      {
        id: 'big_five_personality',
        name: '大五人格测试',
        category: '人格特质',
        categoryId: 'personality',
        description: '基于心理学大五人格理论，全面评估人格特质',
        duration: 20,
        questionsCount: 25,
        difficulty: '中等',
        completion: 0,
        color: 'green',
        icon: '🎭',
        tags: ['人格测试', '大五理论', '特质分析'],
        questions: [
          // 外向性维度 (Extraversion)
          {
            id: 1,
            question: '我是一个健谈的人',
            type: 'likert_agreement',
            dimension: 'extraversion',
            weight: 1,
            reverse: false
          },
          {
            id: 2,
            question: '我倾向于对他人保持沉默',
            type: 'likert_agreement',
            dimension: 'extraversion',
            weight: 1,
            reverse: true
          },
          {
            id: 3,
            question: '我充满活力',
            type: 'likert_agreement',
            dimension: 'extraversion',
            weight: 1,
            reverse: false
          },
          {
            id: 4,
            question: '我产生很多热情',
            type: 'likert_agreement',
            dimension: 'extraversion',
            weight: 1,
            reverse: false
          },
          {
            id: 5,
            question: '我倾向于安静',
            type: 'likert_agreement',
            dimension: 'extraversion',
            weight: 1,
            reverse: true
          },
          // 宜人性维度 (Agreeableness)
          {
            id: 6,
            question: '我倾向于相信他人',
            type: 'likert_agreement',
            dimension: 'agreeableness',
            weight: 1,
            reverse: false
          },
          {
            id: 7,
            question: '我倾向于找他人的毛病',
            type: 'likert_agreement',
            dimension: 'agreeableness',
            weight: 1,
            reverse: true
          },
          {
            id: 8,
            question: '我乐于助人，对他人无私',
            type: 'likert_agreement',
            dimension: 'agreeableness',
            weight: 1,
            reverse: false
          },
          {
            id: 9,
            question: '我对他人有冷酷的态度',
            type: 'likert_agreement',
            dimension: 'agreeableness',
            weight: 1,
            reverse: true
          },
          {
            id: 10,
            question: '我对他人很宽容',
            type: 'likert_agreement',
            dimension: 'agreeableness',
            weight: 1,
            reverse: false
          },
          // 尽责性维度 (Conscientiousness)
          {
            id: 11,
            question: '我彻底地完成工作',
            type: 'likert_agreement',
            dimension: 'conscientiousness',
            weight: 1,
            reverse: false
          },
          {
            id: 12,
            question: '我倾向于懒惰',
            type: 'likert_agreement',
            dimension: 'conscientiousness',
            weight: 1,
            reverse: true
          },
          {
            id: 13,
            question: '我有效率地做事',
            type: 'likert_agreement',
            dimension: 'conscientiousness',
            weight: 1,
            reverse: false
          },
          {
            id: 14,
            question: '我倾向于无组织',
            type: 'likert_agreement',
            dimension: 'conscientiousness',
            weight: 1,
            reverse: true
          },
          {
            id: 15,
            question: '我制定计划并坚持执行',
            type: 'likert_agreement',
            dimension: 'conscientiousness',
            weight: 1,
            reverse: false
          },
          // 神经质维度 (Neuroticism)
          {
            id: 16,
            question: '我压抑情绪',
            type: 'likert_agreement',
            dimension: 'neuroticism',
            weight: 1,
            reverse: false
          },
          {
            id: 17,
            question: '我在压力下保持冷静',
            type: 'likert_agreement',
            dimension: 'neuroticism',
            weight: 1,
            reverse: true
          },
          {
            id: 18,
            question: '我容易紧张',
            type: 'likert_agreement',
            dimension: 'neuroticism',
            weight: 1,
            reverse: false
          },
          {
            id: 19,
            question: '我情绪稳定',
            type: 'likert_agreement',
            dimension: 'neuroticism',
            weight: 1,
            reverse: true
          },
          {
            id: 20,
            question: '我容易感到沮丧',
            type: 'likert_agreement',
            dimension: 'neuroticism',
            weight: 1,
            reverse: false
          },
          // 开放性维度 (Openness)
          {
            id: 21,
            question: '我有创意',
            type: 'likert_agreement',
            dimension: 'openness',
            weight: 1,
            reverse: false
          },
          {
            id: 22,
            question: '我没有艺术兴趣',
            type: 'likert_agreement',
            dimension: 'openness',
            weight: 1,
            reverse: true
          },
          {
            id: 23,
            question: '我喜欢思考深入的想法',
            type: 'likert_agreement',
            dimension: 'openness',
            weight: 1,
            reverse: false
          },
          {
            id: 24,
            question: '我有生动的想象力',
            type: 'likert_agreement',
            dimension: 'openness',
            weight: 1,
            reverse: false
          },
          {
            id: 25,
            question: '我喜欢尝试新事物',
            type: 'likert_agreement',
            dimension: 'openness',
            weight: 1,
            reverse: false
          }
        ]
      },
      {
        id: 'social_skills_assessment',
        name: '社交能力评估',
        category: '人际关系',
        categoryId: 'social',
        description: '评估社交技巧和人际沟通能力',
        duration: 15,
        questionsCount: 20,
        difficulty: '简单',
        completion: 0,
        color: 'orange',
        icon: '👥',
        tags: ['社交技巧', '人际沟通', '关系建立'],
        questions: [
          {
            id: 1,
            question: '在新的社交场合中，我能很快适应',
            type: 'likert_agreement',
            dimension: 'social_comfort',
            weight: 1
          },
          {
            id: 2,
            question: '我很容易与陌生人开始对话',
            type: 'likert_agreement',
            dimension: 'conversation_initiation',
            weight: 1
          },
          {
            id: 3,
            question: '我能准确读懂他人的情绪',
            type: 'likert_agreement',
            dimension: 'emotional_reading',
            weight: 1
          },
          {
            id: 4,
            question: '我在群体讨论中表现活跃',
            type: 'likert_agreement',
            dimension: 'group_participation',
            weight: 1
          },
          {
            id: 5,
            question: '当有人心情不好时，我知道如何安慰他们',
            type: 'likert_agreement',
            dimension: 'empathy_support',
            weight: 1
          },
          {
            id: 6,
            question: '我能很好地处理人际冲突',
            type: 'likert_agreement',
            dimension: 'conflict_resolution',
            weight: 1
          },
          {
            id: 7,
            question: '我在社交场合中感到自信',
            type: 'likert_agreement',
            dimension: 'social_confidence',
            weight: 1
          },
          {
            id: 8,
            question: '我善于维持长期的友谊',
            type: 'likert_agreement',
            dimension: 'relationship_maintenance',
            weight: 1
          },
          {
            id: 9,
            question: '我很容易获得他人的信任',
            type: 'likert_agreement',
            dimension: 'trust_building',
            weight: 1
          },
          {
            id: 10,
            question: '我能有效地表达自己的观点',
            type: 'likert_agreement',
            dimension: 'self_expression',
            weight: 1
          },
          {
            id: 11,
            question: '我在团队中能发挥领导作用',
            type: 'likert_agreement',
            dimension: 'leadership_skills',
            weight: 1
          },
          {
            id: 12,
            question: '我能很好地倾听他人',
            type: 'likert_agreement',
            dimension: 'listening_skills',
            weight: 1
          },
          {
            id: 13,
            question: '我在社交媒体上与人互动良好',
            type: 'likert_agreement',
            dimension: 'digital_communication',
            weight: 1
          },
          {
            id: 14,
            question: '我能适当地使用幽默来缓解气氛',
            type: 'likert_agreement',
            dimension: 'humor_usage',
            weight: 1
          },
          {
            id: 15,
            question: '我在公开场合发言时感到自在',
            type: 'likert_agreement',
            dimension: 'public_speaking',
            weight: 1
          },
          {
            id: 16,
            question: '我能敏感地察觉社交线索',
            type: 'likert_agreement',
            dimension: 'social_awareness',
            weight: 1
          },
          {
            id: 17,
            question: '我在工作场所的人际关系很好',
            type: 'likert_agreement',
            dimension: 'workplace_relations',
            weight: 1
          },
          {
            id: 18,
            question: '我能给出建设性的反馈',
            type: 'likert_agreement',
            dimension: 'feedback_giving',
            weight: 1
          },
          {
            id: 19,
            question: '我善于调节群体氛围',
            type: 'likert_agreement',
            dimension: 'atmosphere_regulation',
            weight: 1
          },
          {
            id: 20,
            question: '我在压力大的社交情况下仍能表现良好',
            type: 'likert_agreement',
            dimension: 'stress_management',
            weight: 1
          }
        ]
      }
    ],
  },

  onLoad(options) {
    this.initializeData()
    this.loadTestHistory()
    
    // 支持从URL参数直接开始测试
    if (options.startTest) {
      const test = this.data.testList.find(t => t.id === options.startTest)
      if (test) {
        setTimeout(() => {
          this.startNewTest(test)
        }, 500) // 延迟一点时间确保页面已加载完成
      }
    }
  },

  onShow() {
    this.loadTestHistory()
    this.updateTestCompletionStatus()
    
    // 设置TabBar选中状态 - 让自动检测处理，不手动设置
    if (typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar();
      if (tabBar) {
        tabBar.updateCurrentTab();
      }
    }
  },

  initializeData() {
    // 初始化数据和恢复状态
    const savedProgress = wx.getStorageSync('mental_test_progress')
    if (savedProgress) {
      this.setData({
        testAnswers: savedProgress.answers || {},
        currentQuestionIndex: savedProgress.questionIndex || 0
      })
    }
  },

  loadTestHistory() {
    try {
      const history = wx.getStorageSync('mental_test_history') || []
      this.setData({ testHistory: history.slice(0, 10) }) // 只显示最近10次
      console.log('加载测试历史成功，记录数量:', history.length)
      if (history.length > 0) {
        console.log('最新测试记录:', history[0])
      }
    } catch (error) {
      console.error('加载测试历史失败:', error)
    }
  },

  saveTestHistory() {
    try {
      const history = wx.getStorageSync('mental_test_history') || []
      history.unshift(this.data.testResult)
      // 保留最近50次记录
      if (history.length > 50) {
        history.splice(50)
      }
      wx.setStorageSync('mental_test_history', history)
      
      // 立即更新页面显示的历史数据
      this.setData({ 
        testHistory: history.slice(0, 10) 
      })
      
      console.log('测试历史已保存，当前历史记录数量:', history.length)
    } catch (error) {
      console.error('保存测试历史失败:', error)
    }
  },

  get filteredTests() {
    if (this.data.currentCategory === 'all') {
      return this.data.testList
    }
    return this.data.testList.filter(test => test.categoryId === this.data.currentCategory)
  },

  switchCategory(e) {
    const category = e.currentTarget.dataset.category
    this.setData({ currentCategory: category })
  },

  startQuickTest(e) {
    const type = e.currentTarget.dataset.type
    let testId
    
    if (type === 'health') {
      testId = 'depression_screening'
    } else if (type === 'stress') {
      testId = 'stress_assessment'
    } else {
      testId = 'anxiety_screening'
    }
    
    const test = this.data.testList.find(t => t.id === testId)
    if (test) {
      this.startTest({ currentTarget: { dataset: { test } } })
    }
  },

  startTest(e) {
    const test = e.currentTarget.dataset.test
    if (!test) return
    
    console.log('开始测试:', test.name, 'ID:', test.id)
    
    // 检查是否有该测试的历史结果
    const latestResult = this.getLatestTestResult(test.id)
    
    console.log('查找历史结果:', latestResult ? '找到' : '未找到')
    if (latestResult) {
      console.log('历史结果详情:', latestResult)
    }
    
    // 如果有历史结果，询问用户是查看结果还是重新测试
    if (latestResult) {
      wx.showModal({
        title: '测试选择',
        content: `您之前已完成过"${test.name}"测试，请选择您要进行的操作：`,
        cancelText: '查看结果',
        confirmText: '重新测试',
        success: (res) => {
          if (res.confirm) {
            // 用户选择重新测试
            this.startNewTest(test)
            console.log('开始重新测试')
          } else {
            // 用户选择查看结果，跳转到结果页面
            wx.navigateTo({
              url: `/pages/mental_test/result?resultId=${latestResult.id}`
            })
            console.log('跳转到结果页面查看历史结果')
          }
        }
      })
    } else {
      // 如果没有历史结果，直接开始新测试
      this.startNewTest(test)
      console.log('开始新测试')
    }
  },

  // 获取指定测试的最新结果
  getLatestTestResult(testId) {
    const history = this.data.testHistory
    return history.find(result => result.testId === testId) || null
  },

  // 开始新测试
  startNewTest(test) {
    this.setData({
      currentTest: test,
      currentQuestionIndex: 0,
      currentQuestion: test.questions[0],
      selectedAnswer: null,
      testAnswers: {},
      showTestModal: true
    })
    
    // 清除之前的进度
    wx.removeStorageSync('mental_test_progress')
  },

  closeTest() {
    // 保存当前进度
    if (this.data.currentTest && Object.keys(this.data.testAnswers).length > 0) {
      this.autoSaveProgress()
      
      wx.showModal({
        title: '保存进度',
        content: '您的答题进度已自动保存，下次可以继续完成',
        showCancel: false,
        confirmText: '知道了'
      })
    }
    
    this.setData({
      showTestModal: false,
      currentTest: null,
      currentQuestion: null,
      selectedAnswer: null
    })
  },

  selectOption(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ selectedAnswer: value })
    
    // 自动保存答案
    setTimeout(() => {
      this.saveCurrentAnswer()
      
      // 延迟一下然后自动进入下一题
      setTimeout(() => {
        this.autoNextQuestion()
      }, 500)
    }, 300)
  },

  // 自动进入下一题
  autoNextQuestion() {
    if (this.data.currentQuestionIndex < this.data.currentTest.questions.length - 1) {
      this.nextQuestion()
    } else {
      // 如果是最后一题，不自动提交，而是提示用户点击完成测试
      wx.showToast({
        title: '所有题目已完成，请点击"完成测试"提交',
        icon: 'none',
        duration: 2000
      })
    }
  },

  onSliderChange(e) {
    const value = e.detail.value
    this.setData({ selectedAnswer: value })
    this.saveCurrentAnswer()
  },

  saveCurrentAnswer() {
    if (this.data.selectedAnswer === null || this.data.selectedAnswer === undefined) return
    
    const answers = { ...this.data.testAnswers }
    answers[this.data.currentQuestion.id] = this.data.selectedAnswer
    this.setData({ testAnswers: answers })
    
    this.autoSaveProgress()
  },

  autoSaveProgress() {
    try {
      const progressData = {
        testId: this.data.currentTest.id,
        answers: this.data.testAnswers,
        questionIndex: this.data.currentQuestionIndex,
        timestamp: Date.now()
      }
      wx.setStorageSync('mental_test_progress', progressData)
    } catch (error) {
      console.error('自动保存失败:', error)
    }
  },

  // 添加previousQuestion函数，映射到prevQuestion
  previousQuestion() {
    this.prevQuestion()
  },

  prevQuestion() {
    if (this.data.currentQuestionIndex > 0) {
      const newIndex = this.data.currentQuestionIndex - 1
      const newQuestion = this.data.currentTest.questions[newIndex]
      const savedAnswer = this.data.testAnswers[newQuestion.id]
      
      this.setData({
        currentQuestionIndex: newIndex,
        currentQuestion: newQuestion,
        selectedAnswer: savedAnswer || null
      })
    }
  },

  nextQuestion() {
    this.saveCurrentAnswer()
    
    if (this.data.currentQuestionIndex < this.data.currentTest.questions.length - 1) {
      const newIndex = this.data.currentQuestionIndex + 1
      const newQuestion = this.data.currentTest.questions[newIndex]
      const savedAnswer = this.data.testAnswers[newQuestion.id]
      
      this.setData({
        currentQuestionIndex: newIndex,
        currentQuestion: newQuestion,
        selectedAnswer: savedAnswer || null
      })
    } else {
      // 如果是最后一题，直接提交测试
      this.submitTest()
    }
  },

  submitTest() {
    this.saveCurrentAnswer()
    
    // 检查是否所有问题都已回答
    const questions = this.data.currentTest.questions
    const answers = this.data.testAnswers
    const unansweredQuestions = questions.filter(q => !(q.id in answers))
    
    if (unansweredQuestions.length > 0) {
      wx.showModal({
        title: '测试未完成',
        content: `还有${unansweredQuestions.length}道题未回答，是否继续提交？`,
        success: (res) => {
          if (res.confirm) {
            this.calculateProfessionalResult()
          }
        }
      })
    } else {
      this.calculateProfessionalResult()
    }
  },

  calculateProfessionalResult() {
    const test = this.data.currentTest
    const answers = this.data.testAnswers
    
    console.log('开始计算测试结果，当前测试:', test.name)
    console.log('用户答案:', answers)
    
    // 检查答案是否完整
    const answerCount = Object.keys(answers).length
    const totalQuestions = test.questions.length
    
    if (answerCount < totalQuestions) {
      wx.showModal({
        title: '测试未完成',
        content: `您还有 ${totalQuestions - answerCount} 道题未回答，请完成所有题目后再提交。`,
        showCancel: false,
        confirmText: '继续答题'
      })
      return
    }
    
    wx.showLoading({ title: '智能分析中...', mask: true })
    
    // 延迟执行以显示专业的加载效果
    setTimeout(() => {
      let result
      
      try {
        result = this.calculateScoreByTestType(test, answers)
        
        console.log('结果计算完成:', result)
        console.log('准备跳转到结果页面')
        
        // 保存结果到历史记录
        this.setData({
          testResult: result
        }, () => {
          // 保存历史记录
          this.saveTestHistory()
          this.updateTestCompletionStatus()
          // 清除进度数据
          wx.removeStorageSync('mental_test_progress')
          
          wx.hideLoading()
          
          // 跳转到结果页面
          wx.redirectTo({
            url: `/pages/mental_test/result?resultId=${result.id}`
          })
          
          console.log('已跳转到结果页面')
        })
        
        console.log('专业测试结果计算完成:', result)
        
      } catch (error) {
        console.error('计算结果失败:', error)
        wx.hideLoading()
        wx.showModal({
          title: '分析失败',
          content: '测试结果分析失败，请重试',
          showCancel: false,
          confirmText: '确定'
        })
      }
    }, 2000) // 延长加载时间，让用户感受到专业的分析过程
  },

  calculateScoreByTestType(test, answers) {
    const testId = test.id
    
    switch (testId) {
      case 'depression_screening':
        return this.calculatePHQ9Score(test, answers)
      case 'anxiety_screening':
        return this.calculateGAD7Score(test, answers)
      case 'stress_assessment':
        return this.calculateStressScore(test, answers)
      case 'big_five_personality':
        return this.calculateBigFiveScore(test, answers)
      case 'social_skills_assessment':
        return this.calculateSocialSkillsScore(test, answers)
      default:
        throw new Error('未知的测试类型')
    }
  },

  // PHQ-9 抑郁症筛查量表评分
  calculatePHQ9Score(test, answers) {
    const questions = test.questions
    let totalScore = 0
    const dimensionScores = {}
    
    // 计算总分和各维度得分
    questions.forEach(question => {
      const answer = answers[question.id] || 0
      const score = answer * question.weight
      totalScore += score
      
      if (!dimensionScores[question.dimension]) {
        dimensionScores[question.dimension] = 0
      }
      dimensionScores[question.dimension] += score
    })
    
    // PHQ-9 分级标准
    let level, levelColor, summary, riskLevel
    if (totalScore <= 4) {
      level = '正常'
      levelColor = 'green'
      summary = '您的抑郁症状很轻微，心理状态良好'
      riskLevel = 'low'
    } else if (totalScore <= 9) {
      level = '轻度抑郁'
      levelColor = 'yellow'
      summary = '您可能存在轻度的抑郁症状，建议关注情绪变化'
      riskLevel = 'mild'
    } else if (totalScore <= 14) {
      level = '中度抑郁'
      levelColor = 'orange'
      summary = '您可能存在中度的抑郁症状，建议寻求专业帮助'
      riskLevel = 'moderate'
    } else if (totalScore <= 19) {
      level = '中重度抑郁'
      levelColor = 'red'
      summary = '您可能存在中重度的抑郁症状，强烈建议咨询心理专家'
      riskLevel = 'severe'
    } else {
      level = '重度抑郁'
      levelColor = 'red'
      summary = '您可能存在重度的抑郁症状，请立即寻求专业医疗帮助'
      riskLevel = 'severe'
    }
    
    // 维度分析
    const dimensions = this.generatePHQ9Dimensions(answers, test)
    
    // 生成建议
    const suggestions = this.generateDepressionSuggestions(riskLevel, totalScore)
    
    return {
      id: Date.now().toString(),
      testId: test.id,
      testName: test.name,
      icon: test.icon,
      color: test.color,
      score: Math.round((totalScore / 27) * 100), // 转换为百分制
      totalScore,
      maxScore: 27,
      level,
      levelColor,
      summary,
      riskLevel,
      dimensions,
      suggestions,
      date: new Date().toLocaleDateString('zh-CN'),
      timestamp: Date.now()
    }
  },

  // GAD-7 焦虑症筛查量表评分
  calculateGAD7Score(test, answers) {
    const questions = test.questions
    let totalScore = 0
    const dimensionScores = {}
    
    questions.forEach(question => {
      const answer = answers[question.id] || 0
      const score = answer * question.weight
      totalScore += score
      
      if (!dimensionScores[question.dimension]) {
        dimensionScores[question.dimension] = 0
      }
      dimensionScores[question.dimension] += score
    })
    
    // GAD-7 分级标准
    let level, levelColor, summary, riskLevel
    if (totalScore <= 4) {
      level = '正常'
      levelColor = 'green'
      summary = '您的焦虑症状很轻微，心理状态良好'
      riskLevel = 'low'
    } else if (totalScore <= 9) {
      level = '轻度焦虑'
      levelColor = 'yellow'
      summary = '您可能存在轻度的焦虑症状，建议学习放松技巧'
      riskLevel = 'mild'
    } else if (totalScore <= 14) {
      level = '中度焦虑'
      levelColor = 'orange'
      summary = '您可能存在中度的焦虑症状，建议寻求专业指导'
      riskLevel = 'moderate'
    } else {
      level = '重度焦虑'
      levelColor = 'red'
      summary = '您可能存在重度的焦虑症状，强烈建议咨询心理专家'
      riskLevel = 'severe'
    }
    
    const dimensions = this.generateGAD7Dimensions(answers, test)
    const suggestions = this.generateAnxietySuggestions(riskLevel, totalScore)
    
    return {
      id: Date.now().toString(),
      testId: test.id,
      testName: test.name,
      icon: test.icon,
      color: test.color,
      score: Math.round((totalScore / 21) * 100),
      totalScore,
      maxScore: 21,
      level,
      levelColor,
      summary,
      riskLevel,
      dimensions,
      suggestions,
      date: new Date().toLocaleDateString('zh-CN'),
      timestamp: Date.now()
    }
  },

  // 压力感知量表评分
  calculateStressScore(test, answers) {
    const questions = test.questions
    let totalScore = 0
    const dimensionScores = {}
    const dimensionCounts = {}
    
    questions.forEach(question => {
      let answer = answers[question.id] || 0
      
      // 处理反向计分题
      if (question.type === 'likert_frequency_reverse') {
        answer = 3 - answer
      }
      
      const score = answer * question.weight
      totalScore += score
      
      if (!dimensionScores[question.dimension]) {
        dimensionScores[question.dimension] = 0
        dimensionCounts[question.dimension] = 0
      }
      dimensionScores[question.dimension] += score
      dimensionCounts[question.dimension] += 1
    })
    
    // 压力感知量表分级
    let level, levelColor, summary, riskLevel
    if (totalScore <= 13) {
      level = '低压力'
      levelColor = 'green'
      summary = '您的压力感知水平较低，具有良好的应对能力'
      riskLevel = 'low'
    } else if (totalScore <= 26) {
      level = '中等压力'
      levelColor = 'yellow'
      summary = '您的压力感知处于中等水平，需要注意压力管理'
      riskLevel = 'moderate'
    } else {
      level = '高压力'
      levelColor = 'red'
      summary = '您的压力感知水平较高，建议学习有效的压力管理技巧'
      riskLevel = 'high'
    }
    
    const dimensions = this.generateStressDimensions(dimensionScores, dimensionCounts)
    const suggestions = this.generateStressSuggestions(totalScore)
    
    return {
      id: Date.now().toString(),
      testId: test.id,
      testName: test.name,
      icon: test.icon,
      color: test.color,
      score: Math.round((totalScore / 30) * 100),
      totalScore,
      maxScore: 30,
      level,
      levelColor,
      summary,
      riskLevel,
      dimensions,
      suggestions,
      date: new Date().toLocaleDateString('zh-CN'),
      timestamp: Date.now()
    }
  },

  // 大五人格测试评分
  calculateBigFiveScore(test, answers) {
    const questions = test.questions
    const dimensionScores = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    }
    const dimensionCounts = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    }
    
    questions.forEach(question => {
      let answer = answers[question.id] || 3 // 默认中立
      
      // 处理反向计分题
      if (question.reverse) {
        answer = 6 - answer
      }
      
      const score = answer * question.weight
      dimensionScores[question.dimension] += score
      dimensionCounts[question.dimension] += 1
    })
    
    // 计算各维度平均分和生成维度数据
    const finalDimensions = []
    const avgScores = {}
    const dimensionNames = {
      extraversion: '外向性',
      agreeableness: '宜人性', 
      conscientiousness: '尽责性',
      neuroticism: '神经质',
      openness: '开放性'
    }
    
    Object.keys(dimensionScores).forEach(dimension => {
      const avgScore = dimensionScores[dimension] / dimensionCounts[dimension]
      avgScores[dimension] = avgScore
      
      // 生成维度数据
      const maxScore = 5
      const percentage = (avgScore / maxScore) * 100
      
      let color = 'blue'
      if (percentage >= 80) color = 'green'
      else if (percentage >= 60) color = 'blue'
      else if (percentage >= 40) color = 'yellow'
      else color = 'red'
      
      finalDimensions.push({
        name: dimensionNames[dimension],
        score: Math.round(avgScore),
        maxScore,
        percentage: Math.round(percentage),
        description: this.getBigFiveDimensionDescription(dimension, avgScore),
        color
      })
    })
    
    // 计算总体人格特征
    const overallScore = Object.values(avgScores).reduce((a, b) => a + b, 0) / 5
    const personalityType = this.getBigFivePersonalityType(avgScores)
    
    const suggestions = this.generatePersonalitySuggestions(personalityType, finalDimensions)
    
    return {
      id: Date.now().toString(),
      testId: test.id,
      testName: test.name,
      icon: test.icon,
      color: test.color,
      score: Math.round((overallScore / 5) * 100),
      totalScore: Math.round(overallScore * 20),
      maxScore: 100,
      level: personalityType.name,
      levelColor: personalityType.color,
      summary: personalityType.description,
      dimensions: finalDimensions,
      suggestions,
      date: new Date().toLocaleDateString('zh-CN'),
      timestamp: Date.now()
    }
  },

  // 社交能力评估评分
  calculateSocialSkillsScore(test, answers) {
    const questions = test.questions
    let totalScore = 0
    const dimensionScores = {}
    const dimensionCounts = {}
    
    questions.forEach(question => {
      const answer = answers[question.id] || 3
      const score = answer * question.weight
      totalScore += score
      
      if (!dimensionScores[question.dimension]) {
        dimensionScores[question.dimension] = 0
        dimensionCounts[question.dimension] = 0
      }
      dimensionScores[question.dimension] += score
      dimensionCounts[question.dimension] += 1
    })
    
    // 社交能力分级
    const maxPossibleScore = questions.length * 5
    const percentage = (totalScore / maxPossibleScore) * 100
    
    let level, levelColor, summary
    if (percentage >= 80) {
      level = '优秀'
      levelColor = 'green'
      summary = '您具有出色的社交能力，在人际交往中表现优异'
    } else if (percentage >= 60) {
      level = '良好'
      levelColor = 'blue'
      summary = '您的社交能力良好，在大多数社交场合都能应对自如'
    } else if (percentage >= 40) {
      level = '一般'
      levelColor = 'yellow'
      summary = '您的社交能力处于平均水平，还有提升的空间'
    } else {
      level = '需要提升'
      levelColor = 'red'
      summary = '您的社交能力需要加强，建议多参与社交活动练习'
    }
    
    const dimensions = this.generateSocialSkillsDimensions(dimensionScores, dimensionCounts)
    const suggestions = this.generateSocialSkillsSuggestions(percentage)
    
    return {
      id: Date.now().toString(),
      testId: test.id,
      testName: test.name,
      icon: test.icon,
      color: test.color,
      score: Math.round(percentage),
      totalScore,
      maxScore: maxPossibleScore,
      level,
      levelColor,
      summary,
      dimensions,
      suggestions,
      date: new Date().toLocaleDateString('zh-CN'),
      timestamp: Date.now()
    }
  },

  // 生成抑郁症建议
  generateDepressionSuggestions(riskLevel, score) {
    const suggestions = []
    
    // 根据风险等级提供专业建议
    if (riskLevel === 'severe') {
      suggestions.push({
        icon: '🚨',
        title: '立即寻求专业医疗帮助',
        description: '您的测试结果显示可能存在重度抑郁症状，强烈建议立即咨询精神科医生或心理专家，进行专业评估和干预治疗。',
        color: 'red'
      })
      suggestions.push({
        icon: '📞',
        title: '心理危机热线',
        description: '如有紧急情况，可拨打心理危机干预热线：400-161-9995（24小时）或当地心理援助热线。',
        color: 'red'
      })
    } else if (riskLevel === 'moderate') {
      suggestions.push({
        icon: '👩‍⚕️',
        title: '专业心理咨询',
        description: '建议寻求专业心理咨询师的帮助，通过认知行为疗法（CBT）或其他心理治疗方法改善症状。',
        color: 'orange'
      })
    } else if (riskLevel === 'mild') {
      suggestions.push({
        icon: '💪',
        title: '积极心理调节',
        description: '通过自我调节、心理健康教育等方式，学习管理情绪和压力的技巧。',
        color: 'yellow'
      })
    }
    
    // 通用建议
    suggestions.push({
      icon: '🏃‍♂️',
      title: '规律运动疗法',
      description: '每天进行30-45分钟中等强度运动，如快走、慢跑、游泳或瑜伽，运动可以有效改善抑郁情绪。',
      color: 'blue'
    })
    
    suggestions.push({
      icon: '😴',
      title: '睡眠卫生管理',
      description: '建立规律作息：晚上10-11点睡觉，早上6-7点起床，睡前避免使用电子设备，创造舒适的睡眠环境。',
      color: 'purple'
    })
    
    suggestions.push({
      icon: '🧘‍♀️',
      title: '正念冥想练习',
      description: '每天练习10-20分钟正念冥想、深呼吸或放松训练，帮助缓解焦虑和抑郁情绪。',
      color: 'green'
    })
    
    suggestions.push({
      icon: '👥',
      title: '社交支持网络',
      description: '主动与亲友保持联系，参加社交活动，避免过度独处，寻求并接受他人的理解和支持。',
      color: 'blue'
    })
    
    suggestions.push({
      icon: '📝',
      title: '情绪日记记录',
      description: '每天记录情绪变化、触发因素和应对方式，有助于识别情绪模式和改善策略。',
      color: 'yellow'
    })
    
    return suggestions
  },

  // 生成焦虑症建议
  generateAnxietySuggestions(riskLevel, score) {
    const suggestions = []
    
    // 根据风险等级提供专业建议
    if (riskLevel === 'severe') {
      suggestions.push({
        icon: '👩‍⚕️',
        title: '专业心理治疗',
        description: '建议尽快寻求专业心理咨询师帮助，通过认知行为疗法（CBT）、暴露疗法等专业治疗方法缓解焦虑症状。',
        color: 'red'
      })
      suggestions.push({
        icon: '💊',
        title: '医学评估咨询',
        description: '如焦虑严重影响日常生活，建议咨询精神科医生评估是否需要药物辅助治疗。',
        color: 'red'
      })
    } else if (riskLevel === 'moderate') {
      suggestions.push({
        icon: '🎯',
        title: '焦虑管理技巧',
        description: '学习专业的焦虑管理策略，如渐进式肌肉放松、认知重构等技巧。',
        color: 'orange'
      })
    }
    
    // 通用建议
    suggestions.push({
      icon: '🧘‍♂️',
      title: '呼吸放松技巧',
      description: '学习4-7-8呼吸法：吸气4秒，憋气7秒，呼气8秒。每天练习3-5次，有效缓解急性焦虑。',
      color: 'blue'
    })
    
    suggestions.push({
      icon: '💭',
      title: '认知重构训练',
      description: '识别和挑战消极思维模式，用更现实、积极的想法替代灾难性思维。',
      color: 'purple'
    })
    
    suggestions.push({
      icon: '📊',
      title: '渐进式暴露',
      description: '逐步、安全地接触引起焦虑的情境，建立信心，减少回避行为。',
      color: 'green'
    })
    
    suggestions.push({
      icon: '⏰',
      title: '时间管理优化',
      description: '制定合理的日程安排，设置可达成的目标，避免过度承诺和时间压力。',
      color: 'yellow'
    })
    
    suggestions.push({
      icon: '🌱',
      title: '生活方式调整',
      description: '减少咖啡因摄入，避免酒精和尼古丁，保持规律饮食，限制社交媒体使用时间。',
      color: 'green'
    })
    
    suggestions.push({
      icon: '🎨',
      title: '创意表达活动',
      description: '参与绘画、音乐、写作等创意活动，通过艺术表达释放情绪压力。',
      color: 'purple'
    })
    
    return suggestions
  },

  // 其他辅助方法
  generatePHQ9Dimensions(answers, test) {
    const dimensions = [
      { name: '情绪低落', dimension: 'mood', description: '抑郁情绪的核心症状' },
      { name: '兴趣缺失', dimension: 'anhedonia', description: '对活动失去兴趣或愉悦感' },
      { name: '睡眠问题', dimension: 'sleep', description: '睡眠质量和睡眠模式的改变' },
      { name: '精力不足', dimension: 'energy', description: '感到疲倦或缺乏精力' },
      { name: '食欲变化', dimension: 'appetite', description: '食欲显著增加或减少' },
      { name: '自我价值', dimension: 'self_worth', description: '自我评价和自我价值感' },
      { name: '注意力', dimension: 'concentration', description: '注意力集中困难' },
      { name: '精神运动', dimension: 'psychomotor', description: '行动和思维速度的改变' },
      { name: '自伤想法', dimension: 'suicidal_ideation', description: '自伤或自杀的想法' }
    ]
    
    return dimensions.map(dim => {
      const question = test.questions.find(q => q.dimension === dim.dimension)
      const answer = answers[question?.id] || 0
      const maxScore = 3
      const percentage = (answer / maxScore) * 100
      
      let color = 'green'
      if (percentage >= 67) color = 'red'
      else if (percentage >= 33) color = 'yellow'
      
      return {
        name: dim.name,
        score: answer,
        maxScore,
        percentage: Math.round(percentage),
        description: dim.description,
        color
      }
    })
  },

  generateGAD7Dimensions(answers, test) {
    const dimensions = [
      { name: '紧张焦虑', dimension: 'nervousness', description: '基本的焦虑情绪体验' },
      { name: '担忧控制', dimension: 'uncontrollable_worry', description: '无法控制的过度担忧' },
      { name: '过度担心', dimension: 'excessive_worry', description: '对各种事情的过度担忧' },
      { name: '放松困难', dimension: 'trouble_relaxing', description: '难以放松和平静下来' },
      { name: '坐立不安', dimension: 'restlessness', description: '身体上的不安和躁动' },
      { name: '易怒急躁', dimension: 'irritability', description: '情绪上的易怒和急躁' },
      { name: '恐惧预期', dimension: 'fear_something_awful', description: '对未来的恐惧和不安' }
    ]
    
    return dimensions.map(dim => {
      const question = test.questions.find(q => q.dimension === dim.dimension)
      const answer = answers[question?.id] || 0
      const maxScore = 3
      const percentage = (answer / maxScore) * 100
      
      let color = 'green'
      if (percentage >= 67) color = 'red'
      else if (percentage >= 33) color = 'yellow'
      
      return {
        name: dim.name,
        score: answer,
        maxScore,
        percentage: Math.round(percentage),
        description: dim.description,
        color
      }
    })
  },

  generateStressDimensions(dimensionScores, dimensionCounts) {
    const dimensionInfo = {
      unexpected_events: { name: '意外事件应对', description: '应对突发事件的能力' },
      lack_control: { name: '控制感', description: '对生活的掌控感' },
      nervous_stressed: { name: '紧张程度', description: '日常生活中的紧张和压力水平' },
      coping_success: { name: '应对成功', description: '成功处理问题的能力' },
      effective_coping: { name: '有效应对', description: '应对重要变化的有效性' },
      personal_confidence: { name: '个人信心', description: '处理个人问题的信心' },
      things_going_well: { name: '顺利感', description: '感觉事情进展顺利的程度' },
      unable_cope: { name: '应对困难', description: '无法应付所有事情的感觉' },
      control_irritations: { name: '控制烦恼', description: '控制生活中烦恼事情的能力' },
      in_control: { name: '掌控感', description: '感觉自己掌控一切的程度' }
    }
    
    return Object.keys(dimensionScores).map(dim => {
      const rawScore = dimensionScores[dim] / dimensionCounts[dim]
      const maxScore = 3
      const percentage = (rawScore / maxScore) * 100
      
      let color = 'green'
      if (percentage >= 67) color = 'red'
      else if (percentage >= 33) color = 'yellow'
      
      const info = dimensionInfo[dim] || { name: dim, description: '压力维度分析' }
      
      return {
        name: info.name,
        score: Math.round(rawScore),
        maxScore,
        percentage: Math.round(percentage),
        description: info.description,
        color
      }
    })
  },

  generateSocialSkillsDimensions(dimensionScores, dimensionCounts) {
    const dimensionInfo = {
      social_comfort: { name: '社交舒适度', description: '在社交场合的舒适程度' },
      communication: { name: '沟通技巧', description: '表达和理解他人的能力' },
      relationship_building: { name: '关系建立', description: '建立和维护人际关系的能力' },
      empathy: { name: '共情能力', description: '理解和感受他人情感的能力' },
      assertiveness: { name: '自信表达', description: '适当表达自己观点和需求的能力' },
      conflict_resolution: { name: '冲突解决', description: '处理和解决人际冲突的能力' }
    }
    
    return Object.keys(dimensionScores).map(dim => {
      const rawScore = dimensionScores[dim] / dimensionCounts[dim]
      const maxScore = 5
      const percentage = (rawScore / maxScore) * 100
      
      let color = 'green'
      if (percentage >= 80) color = 'green'
      else if (percentage >= 60) color = 'blue'
      else if (percentage >= 40) color = 'yellow'
      else color = 'red'
      
      const info = dimensionInfo[dim] || { name: dim, description: '社交技能维度' }
      
      return {
        name: info.name,
        score: Math.round(rawScore),
        maxScore,
        percentage: Math.round(percentage),
        description: info.description,
        color
      }
    })
  },

  generateStressSuggestions(percentage) {
    const suggestions = []
    
    if (percentage >= 67) {
      suggestions.push({
        icon: '👩‍⚕️',
        title: '考虑专业咨询',
        description: '您的压力水平较高，建议寻求专业心理咨询师的帮助',
        color: 'red'
      })
    }
    
    suggestions.push({
      icon: '🧘‍♂️',
      title: '练习压力管理技巧',
      description: '学习深呼吸、冥想、渐进式肌肉放松等压力管理技巧',
      color: 'blue'
    })
    
    suggestions.push({
      icon: '⏰',
      title: '合理安排时间',
      description: '制定合理的时间计划，避免过度承担责任',
      color: 'green'
    })
    
    suggestions.push({
      icon: '🤝',
      title: '寻求社会支持',
      description: '与家人朋友分享感受，建立强大的社会支持网络',
      color: 'purple'
    })
    
    return suggestions
  },

  generatePersonalitySuggestions(personalityType, dimensions) {
    const suggestions = []
    
    // 根据大五人格维度生成建议
    dimensions.forEach(dim => {
      if (dim.name === '外向性' && dim.score < 40) {
        suggestions.push({
          icon: '🗣️',
          title: '增强社交信心',
          description: '尝试参加小规模的社交活动，逐步建立社交信心',
          color: 'blue'
        })
      }
      
      if (dim.name === '神经质' && dim.score > 70) {
        suggestions.push({
          icon: '🧘',
          title: '情绪调节训练',
          description: '学习情绪管理技巧，如正念冥想和认知重构',
          color: 'purple'
        })
      }
      
      if (dim.name === '开放性' && dim.score < 40) {
        suggestions.push({
          icon: '📚',
          title: '拓展新体验',
          description: '尝试新的活动、学习新技能或探索不同的兴趣领域',
          color: 'green'
        })
      }
    })
    
    // 如果建议太少，添加通用建议
    if (suggestions.length < 3) {
      suggestions.push({
        icon: '🌱',
        title: '持续自我发展',
        description: '保持对自我的了解，持续学习和成长',
        color: 'blue'
      })
    }
    
    return suggestions.slice(0, 4) // 最多返回4个建议
  },

  generateSocialSkillsSuggestions(percentage) {
    const suggestions = []
    
    if (percentage < 40) {
      suggestions.push({
        icon: '👥',
        title: '参加社交技能训练',
        description: '考虑参加社交技能培训课程或支持小组',
        color: 'red'
      })
    }
    
    suggestions.push({
      icon: '🎭',
      title: '练习积极倾听',
      description: '在对话中专注于理解他人，提问并给予反馈',
      color: 'blue'
    })
    
    suggestions.push({
      icon: '💬',
      title: '改善沟通技巧',
      description: '学习清晰表达想法，使用"我"语句表达感受',
      color: 'green'
    })
    
    suggestions.push({
      icon: '🤝',
      title: '扩展社交圈子',
      description: '参加兴趣小组或志愿活动，结识新朋友',
      color: 'purple'
    })
    
    return suggestions
  },

  getBigFiveDimensionDescription(dimension, score) {
    const descriptions = {
      extraversion: {
        high: '您是一个外向、活跃、喜欢社交的人',
        medium: '您在社交方面表现适中，能够适应不同的社交环境',
        low: '您偏向内向，更喜欢安静的环境和独处的时间'
      },
      agreeableness: {
        high: '您是一个友善、合作、信任他人的人',
        medium: '您在人际关系中表现平衡，既有同情心也有适度的怀疑',
        low: '您倾向于独立思考，对他人的动机可能持怀疑态度'
      },
      conscientiousness: {
        high: '您是一个有组织、负责任、自律的人',
        medium: '您在工作和生活中表现出适度的组织性和责任感',
        low: '您更喜欢灵活性和自发性，不太喜欢严格的计划'
      },
      neuroticism: {
        high: '您可能更容易体验到焦虑、沮丧等负面情绪',
        medium: '您的情绪稳定性适中，大多数时候能够保持平衡',
        low: '您情绪稳定，很少被压力或困难所困扰'
      },
      openness: {
        high: '您富有想象力，喜欢新体验和创新思维',
        medium: '您在传统和创新之间保持平衡',
        low: '您更偏好传统和熟悉的事物，注重实用性'
      }
    }
    
    const dimensionDesc = descriptions[dimension]
    if (!dimensionDesc) return '人格维度分析'
    
    if (score >= 4) return dimensionDesc.high
    else if (score >= 2.5) return dimensionDesc.medium
    else return dimensionDesc.low
  },

  getBigFiveDimensionInfo(dimensionScores) {
    // 保留此函数以防其他地方引用
    return {}
  },

  getBigFivePersonalityType(dimensionScores) {
    const { extraversion, agreeableness, conscientiousness, neuroticism, openness } = dimensionScores
    
    // 基于维度分数判断人格类型
    if (extraversion > 70 && agreeableness > 70) {
      return {
        name: '社交型',
        color: 'blue',
        description: '您是一个外向且友善的人，擅长与他人建立良好关系'
      }
    } else if (conscientiousness > 80 && neuroticism < 30) {
      return {
        name: '可靠型',
        color: 'green',
        description: '您是一个高度负责任且情绪稳定的人，值得信赖'
      }
    } else if (openness > 80 && extraversion > 60) {
      return {
        name: '创新型',
        color: 'purple',
        description: '您富有创造力和想象力，喜欢探索新的可能性'
      }
    } else if (neuroticism > 70) {
      return {
        name: '敏感型',
        color: 'red',
        description: '您比较敏感，容易受到情绪波动的影响'
      }
    } else if (conscientiousness > 70 && openness < 40) {
      return {
        name: '传统型',
        color: 'orange',
        description: '您注重秩序和传统，喜欢稳定和可预测的环境'
      }
    } else {
      return {
        name: '平衡型',
        color: 'blue',
        description: '您的人格特质比较平衡，能够适应多种情况'
      }
    }
  },

  // 查看测试结果
  viewTestResult(e) {
    const result = e.currentTarget.dataset.result
    if (!result || !result.id) {
      wx.showToast({
        title: '结果数据错误',
        icon: 'error'
      })
      return
    }
    
    // 跳转到结果页面
    wx.navigateTo({
      url: `/pages/mental_test/result?resultId=${result.id}`
    })
  },

  // 更新测试完成状态
  updateTestCompletionStatus() {
    const testList = this.data.testList.map(test => {
      const latestResult = this.getLatestTestResult(test.id)
      const updatedTest = {
        ...test,
        completion: latestResult ? 100 : 0,
        latestResult: latestResult,
        hasResult: !!latestResult
      }
      
      if (latestResult) {
        console.log(`测试 ${test.name} 已完成，最新结果:`, latestResult)
      }
      
      return updatedTest
    })
    
    this.setData({ testList })
    console.log('测试完成状态已更新')
  },
}) 