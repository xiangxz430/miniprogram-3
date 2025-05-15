const app = getApp()
const hexagramUtil = require('../../utils/hexagram')
const deepseekApi = require('../../utils/deepseekApi')
const tabConfigUtil = require('../../utils/tabConfig')

Page({
  data: {
    showOverlay: true,  // 是否显示占卜覆盖层
    isFlipping: false,  // 硬币是否在翻转
    hexagramInfo: {},   // 卦象信息
    currentDate: '',    // 当前日期
    deviceInfo: {},     // 设备信息（用于自适应）
    isLoading: false,   // 加载状态
    loadingText: ''     // 加载文本
  },

  onLoad: function() {
    // 获取设备信息
    const info = wx.getSystemInfoSync();
    this.setData({
      deviceInfo: info
    });

    // 获取当前日期
    this.getCurrentDate();

    // 判断是否已经有今日卦象
    const todayKey = this.getTodayKey();
    const savedHexagram = wx.getStorageSync(todayKey);
    
    if (savedHexagram) {
      // 如果有今日卦象，直接使用
      this.setData({
        hexagramInfo: savedHexagram,
        showOverlay: false
      });
    } else {
      // 使用全局数据（仅作为备选）
      this.setData({
        hexagramInfo: app.globalData.hexagramInfo || {}
      });
    }
  },

  onShow: function() {
    // 应用动态TabBar样式
    if (typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar();
      if (tabBar) {
        tabBar.setData({
          selected: 0
        });
      }
    }
  },

  // 获取当前日期的存储键
  getTodayKey: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `hexagram_${year}${month}${day}`;
  },

  // 获取当前日期
  getCurrentDate: function() {
    const date = new Date();
    this.setData({
      currentDate: hexagramUtil.formatDate(date)
    });
  },

  // 开始占卜
  startDivination: function() {
    // 设置硬币翻转动画
    this.setData({
      isFlipping: true,
      isLoading: true,
      loadingText: '正在占卜中...'
    });
    
    // 3秒后停止翻转，准备请求AI解析
    setTimeout(() => {
      // 生成新的卦象数据
      const basicHexagramInfo = hexagramUtil.generateDailyHexagram();
      
      this.setData({
        isFlipping: false,
        loadingText: '正在解析卦象...'
      });
      
      // 调用DeepSeek API获取更个性化的解析
      deepseekApi.getHexagramInterpretation(basicHexagramInfo)
        .then(enhancedHexagramInfo => {
          // 保存卦象数据到本地存储
          const todayKey = this.getTodayKey();
          wx.setStorageSync(todayKey, enhancedHexagramInfo);
          
          this.setData({
            hexagramInfo: enhancedHexagramInfo,
            isLoading: false
          });
          
          // 隐藏覆盖层，显示结果
          setTimeout(() => {
            this.setData({
              showOverlay: false
            });
          }, 500);
        })
        .catch(err => {
          console.error('获取AI解析失败:', err);
          
          // 保存基础卦象数据到本地存储
          const todayKey = this.getTodayKey();
          wx.setStorageSync(todayKey, basicHexagramInfo);
          
          this.setData({
            hexagramInfo: basicHexagramInfo,
            isLoading: false
          });
          
          // 隐藏覆盖层，显示结果
          setTimeout(() => {
            this.setData({
              showOverlay: false
            });
            
            // 提示用户AI解析失败
            wx.showToast({
              title: 'AI解析失败，已使用基础解析',
              icon: 'none',
              duration: 2000
            });
          }, 500);
        });
    }, 3000);
  },

  // 重新占卜
  reDivination: function() {
    this.setData({
      showOverlay: true
    });
  },
  
  // 分享功能
  onShareAppMessage: function() {
    return {
      title: '今日运势：' + this.data.hexagramInfo.name,
      path: '/pages/daily_hexagram/index',
      imageUrl: '/images/share_hexagram.png' // 这里需要提供分享图片
    };
  }
}) 