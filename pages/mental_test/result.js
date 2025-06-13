Page({
  data: {
    result: null,
    loading: true,
    showSuggestionDetail: false,
    selectedSuggestion: null
  },

  onLoad(options) {
    console.log('结果页面加载，参数:', options)
    
    if (options.resultId) {
      this.loadResultById(options.resultId)
    } else if (options.testId) {
      this.loadLatestResult(options.testId)
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'error'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  onShow() {
    // 设置导航栏标题
    if (this.data.result) {
      wx.setNavigationBarTitle({
        title: this.data.result.testName + ' - 结果报告'
      })
    }
  },

  // 根据结果ID加载特定结果
  loadResultById(resultId) {
    try {
      const history = wx.getStorageSync('mental_test_history') || []
      const result = history.find(r => r.id === resultId)
      
      if (result) {
        this.setData({ 
          result,
          loading: false 
        })
        
        wx.setNavigationBarTitle({
          title: result.testName + ' - 结果报告'
        })
      } else {
        wx.showToast({
          title: '结果不存在',
          icon: 'error'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    } catch (error) {
      console.error('加载结果失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    }
  },

  // 加载指定测试的最新结果
  loadLatestResult(testId) {
    try {
      const history = wx.getStorageSync('mental_test_history') || []
      const result = history.find(r => r.testId === testId)
      
      if (result) {
        this.setData({ 
          result,
          loading: false 
        })
        
        wx.setNavigationBarTitle({
          title: result.testName + ' - 结果报告'
        })
      } else {
        wx.showToast({
          title: '暂无测试结果',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    } catch (error) {
      console.error('加载结果失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    }
  },

  // 重新测试
  retakeTest() {
    wx.showModal({
      title: '重新测试',
      content: '确定要重新进行测试吗？之前的结果将被保留在历史记录中。',
      success: (res) => {
        if (res.confirm) {
          // 跳转回测试页面并开始新测试
          wx.redirectTo({
            url: `/pages/mental_test/index?startTest=${this.data.result.testId}`
          })
        }
      }
    })
  },

  // 分享结果
  shareResult() {
    const result = this.data.result
    if (!result) return

    // 生成分享内容
    const shareContent = `我刚完成了${result.testName}，得分${result.score}分，等级：${result.level}。${result.summary}`
    
    wx.showActionSheet({
      itemList: ['分享给朋友', '保存截图', '复制结果'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            // 分享功能
            wx.showToast({
              title: '分享功能开发中',
              icon: 'none'
            })
            break
          case 1:
            // 保存截图功能
            this.saveScreenshot()
            break
          case 2:
            // 复制结果
            wx.setClipboardData({
              data: shareContent,
              success: () => {
                wx.showToast({
                  title: '已复制到剪贴板',
                  icon: 'success'
                })
              }
            })
            break
        }
      }
    })
  },

  // 保存截图
  saveScreenshot() {
    wx.showToast({
      title: '截图功能开发中',
      icon: 'none'
    })
  },

  // 查看建议详情
  viewSuggestionDetail(e) {
    const suggestion = e.currentTarget.dataset.suggestion
    this.setData({
      selectedSuggestion: suggestion,
      showSuggestionDetail: true
    })
  },

  // 关闭建议详情
  closeSuggestionDetail() {
    this.setData({
      showSuggestionDetail: false,
      selectedSuggestion: null
    })
  },

  // 咨询专家
  consultExpert() {
    wx.showModal({
      title: '专家咨询',
      content: '如果您需要专业心理咨询，建议联系当地心理健康机构或拨打心理援助热线：400-161-9995（24小时）',
      showCancel: true,
      cancelText: '取消',
      confirmText: '拨打热线',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-161-9995'
          })
        }
      }
    })
  },

  // 紧急求助
  emergencyHelp() {
    wx.showModal({
      title: '紧急求助',
      content: '如果您有自伤或自杀想法，请立即联系：\n\n1. 拨打120急救电话\n2. 联系家人朋友陪伴\n3. 前往最近的医院急诊科\n\n24小时心理危机干预热线：400-161-9995',
      showCancel: true,
      cancelText: '我知道了',
      confirmText: '拨打120',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '120'
          })
        }
      }
    })
  },

  // 查看所有历史记录
  viewHistory() {
    wx.navigateTo({
      url: '/pages/mental_test/history'
    })
  },

  // 返回测试首页
  backToTest() {
    wx.navigateBack()
  },

  // 获取风险等级样式
  getRiskLevelClass(level) {
    const colorMap = {
      'green': 'success',
      'blue': 'primary', 
      'yellow': 'warning',
      'orange': 'warning',
      'red': 'danger',
      'purple': 'primary'
    }
    return colorMap[level] || 'primary'
  },

  // 预览维度图表
  previewChart() {
    wx.showToast({
      title: '图表功能开发中',
      icon: 'none'
    })
  }
}) 