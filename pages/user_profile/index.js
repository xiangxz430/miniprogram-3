const app = getApp();
const logger = require('../../utils/logger');
const calendar = require('../../utils/lunar');
const tabConfigUtil = require('../../utils/tabConfig');

Page({
  data: {
    activeTab: 0, // 当前激活的标签页：0=个人信息, 1=我的好友
    isEditing: false, // 是否处于编辑模式
    mbtiOptions: ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'],
    mbtiIndex: 0, // MBTI选择器的索引
    userInfo: {
      avatar: null,
      nickname: '王小明',
      birthdate: '1990年8月15日', // 默认生日
      birthtime: '12:00', // 默认出生时间
      lunarDate: '庚午年七月廿五', // 默认农历
      zodiac: '天秤座', // 默认星座
      mbti: 'INFJ', // 默认MBTI
      firstLetter: '王', // 用于显示默认头像的首字母
      birthplace: '北京市', // 默认出生地
      birthplaceArray: ['北京市', '北京市', '东城区'], // 默认出生地数组
      currentLocation: '' // 当前位置
    },
    dailyData: {
      hexagram: {
        name: '泰卦',
        symbol: '䷊',
        description: '地天泰'
      },
      horoscope: {
        rating: 4 // 星级评分（1-5）
      }
    },
    dreams: [
      {
        title: '梦见在高处行走',
        date: '昨天',
        content: '梦见自己在一座很高的桥上行走，桥下是深深的峡谷，我走得很小心，但不觉得特别害怕...'
      },
      {
        title: '梦见飞翔',
        date: '3天前',
        content: '梦见自己能够飞翔，在城市上空自由翱翔，感觉非常轻松和愉快...'
      }
    ],
    friends: [
      {
        name: '张小红',
        firstLetter: '张',
        bgColor: 'bg-blue-500',
        zodiac: '射手座',
        zodiacColor: 'text-orange-500',
        mbti: 'ENFP',
        lunarYear: '乙亥年',
        relationship: '好友'
      },
      {
        name: '李小华',
        firstLetter: '李',
        bgColor: 'bg-green-500',
        zodiac: '水瓶座',
        zodiacColor: 'text-blue-500',
        mbti: 'INTJ',
        lunarYear: '丁卯年',
        relationship: '好友'
      },
      {
        name: '陈小明',
        firstLetter: '陈',
        bgColor: 'bg-pink-500',
        zodiac: '双子座',
        zodiacColor: 'text-purple-500',
        mbti: 'ESTP',
        lunarYear: '戊子年',
        relationship: '好友'
      }
    ],
    birthdays: [
      {
        name: '李小华',
        date: '11月13日',
        daysLeft: 3
      },
      {
        name: '张小红',
        date: '11月25日',
        daysLeft: 15
      }
    ],
    compatibilities: {
      wuxing: [
        {
          name: '李小华',
          percentage: 87
        },
        {
          name: '陈小明',
          percentage: 65
        }
      ],
      zodiac: [
        {
          name: '张小红',
          percentage: 92
        },
        {
          name: '陈小明',
          percentage: 78
        }
      ]
    }
  },

  onLoad: function() {
    this.initUserData();
    this.initMBTIIndex();
    
    // 确保activeTab被正确初始化
    this.setData({
      activeTab: 0
    });
    
    // 如果没有位置信息，尝试获取一次位置（仅在首次加载时）
    const userSettings = wx.getStorageSync('userSettings') || {};
    if (!userSettings.currentLocation) {
      console.log('首次加载页面，尝试获取位置');
      // 设置一个延时，等页面完全加载后再请求位置
      setTimeout(() => {
        this.getLocation();
      }, 1000);
    } else {
      // 已有位置信息，直接使用
      this.setData({
        'userInfo.currentLocation': userSettings.currentLocation
      });
      console.log('使用已保存的位置信息:', userSettings.currentLocation);
    }
    
    logger.log('页面访问', {
      页面: '用户档案',
      时间: new Date().toLocaleString()
    });
  },

  onShow: function() {
    // 页面显示时，仅刷新数据，不自动获取位置
    this.refreshDailyData();
    // 不再自动调用 this.getLocation()，改为只在用户点击按钮时获取
    
    // 输出当前标签状态，用于调试
    console.log('页面显示 - 当前activeTab:', this.data.activeTab);
    
    // 应用动态TabBar样式
    if (typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar();
      if (tabBar) {
        tabBar.setData({
          selected: 4 // 更新为4，因为首页是0，每日一挂是1，八字总运是2，MBTI测试是3
        });
      }
    }
  },

  // 初始化用户数据
  initUserData: function() {
    const globalData = app.globalData || {};
    
    // 从全局数据更新今日卦象信息
    if (globalData.hexagramInfo) {
      this.setData({
        'dailyData.hexagram': {
          name: globalData.hexagramInfo.name,
          symbol: globalData.hexagramInfo.symbol,
          description: globalData.hexagramInfo.description
        }
      });
    }

    // 如果有用户信息，更新用户信息
    if (globalData.userInfo) {
      const userInfo = globalData.userInfo;
      const firstLetter = userInfo.nickname ? userInfo.nickname.charAt(0) : '王';
      
      this.setData({
        'userInfo.avatar': userInfo.avatarUrl,
        'userInfo.nickname': userInfo.nickname || '王小明',
        'userInfo.firstLetter': firstLetter
      });
    }

    // 从本地缓存加载用户设置
    const userSettings = wx.getStorageSync('userSettings');
    if (userSettings) {
      this.setData({
        'userInfo.nickname': userSettings.nickname || this.data.userInfo.nickname,
        'userInfo.firstLetter': userSettings.firstLetter || this.data.userInfo.firstLetter,
        'userInfo.birthdate': userSettings.birthdate || this.data.userInfo.birthdate,
        'userInfo.birthtime': userSettings.birthtime || this.data.userInfo.birthtime,
        'userInfo.mbti': userSettings.mbti || this.data.userInfo.mbti,
        'userInfo.birthplace': userSettings.birthplace || this.data.userInfo.birthplace,
        'userInfo.birthplaceArray': userSettings.birthplaceArray || this.data.userInfo.birthplaceArray
      });
      
      // 如果有生日信息，更新星座和农历
      if (userSettings.birthdate) {
        const birthdate = userSettings.birthdate;
        const match = birthdate.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
        if (match) {
          const year = parseInt(match[1]);
          const month = parseInt(match[2]);
          const day = parseInt(match[3]);
          
          // 更新星座和农历
          this.updateZodiacAndLunar(year, month, day);
        }
      }
    }
  },

  // 初始化MBTI选择器的索引
  initMBTIIndex: function() {
    const mbtiIndex = this.data.mbtiOptions.indexOf(this.data.userInfo.mbti);
    if (mbtiIndex !== -1) {
      this.setData({ mbtiIndex });
    }
  },

  // 刷新每日数据
  refreshDailyData: function() {
    // 模拟获取今日卦象和运势数据
    // 实际项目中可以通过API获取
    wx.showLoading({
      title: '刷新数据中',
    });
    
    setTimeout(() => {
      wx.hideLoading();
      
      // 从全局数据更新，确保最新
      if (app.globalData && app.globalData.hexagramInfo) {
        this.setData({
          'dailyData.hexagram': app.globalData.hexagramInfo
        });
      }
      
      // 从全局数据更新运势信息
      if (app.globalData && app.globalData.horoscopeInfo) {
        this.setData({
          'dailyData.horoscope': app.globalData.horoscopeInfo
        });
      }
    }, 500);
  },

  // 切换编辑模式
  toggleEditMode: function() {
    if (this.data.isEditing) {
      // 保存编辑
      this.saveUserSettings();
    }
    
    this.setData({
      isEditing: !this.data.isEditing
    });
    
    logger.log('用户操作', {
      操作: this.data.isEditing ? '进入编辑模式' : '保存编辑'
    });
  },

  // 昵称输入事件
  inputNickname: function(e) {
    this.setData({
      'userInfo.nickname': e.detail.value
    });
    
    // 如果昵称不为空，更新首字母用于默认头像
    if (e.detail.value && e.detail.value.length > 0) {
      this.setData({
        'userInfo.firstLetter': e.detail.value.charAt(0)
      });
    }
  },

  // 出生时间选择器事件
  bindBirthtimeChange: function(e) {
    const timeStr = e.detail.value;
    
    this.setData({
      'userInfo.birthtime': timeStr
    });
  },

  // 出生地选择器事件
  bindBirthplaceChange: function(e) {
    const region = e.detail.value;
    const formattedPlace = region.join(' ');
    
    this.setData({
      'userInfo.birthplace': formattedPlace,
      'userInfo.birthplaceArray': region
    });
  },

  // 保存用户设置
  saveUserSettings: function() {
    const userSettings = {
      nickname: this.data.userInfo.nickname,
      firstLetter: this.data.userInfo.firstLetter,
      birthdate: this.data.userInfo.birthdate,
      birthtime: this.data.userInfo.birthtime,
      mbti: this.data.userInfo.mbti,
      birthplace: this.data.userInfo.birthplace,
      birthplaceArray: this.data.userInfo.birthplaceArray,
      currentLocation: this.data.userInfo.currentLocation
    };
    
    // 保存到本地存储
    wx.setStorageSync('userSettings', userSettings);
    
    // 同步到全局数据
    if (app.globalData) {
      app.globalData.userSettings = userSettings;
      // 更新全局用户信息
      if (app.globalData.userInfo) {
        app.globalData.userInfo.nickname = userSettings.nickname;
      }
    }
    
    // 提示保存成功
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });
  },

  // 生日选择器事件
  bindBirthdateChange: function(e) {
    // 将日期格式从YYYY-MM-DD转为YYYY年MM月DD日
    const dateStr = e.detail.value;
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${year}年${month}月${day}日`;
    
    this.setData({
      'userInfo.birthdate': formattedDate
    });
    
    // 更新农历和星座
    this.updateZodiacAndLunar(year, month, day);
  },

  // 更新星座和农历信息
  updateZodiacAndLunar: function(year, month, day) {
    // 计算星座
    let zodiac = this.calculateZodiac(month, day);
    
    // 使用lunar库计算农历日期
    try {
      console.log('转换农历输入 - 年:', year, '月:', month, '日:', day);
      const lunarDate = calendar.solarToLunar(year, month, day);
      console.log('转换农历结果:', lunarDate);
      
      // 构造农历日期字符串：干支年+农历月+农历日
      if (lunarDate && lunarDate.lunarYearText && lunarDate.monthStr && lunarDate.dayStr) {
        const lunarDateText = `${lunarDate.lunarYearText}${lunarDate.monthStr}月${lunarDate.dayStr}`;
        
        this.setData({
          'userInfo.zodiac': zodiac,
          'userInfo.lunarDate': lunarDateText
        });
        
        console.log('设置农历日期:', lunarDateText);
      } else {
        console.error('农历日期格式不完整:', lunarDate);
        // 使用备用方案
        this.setFallbackLunarDate(year, month, day, zodiac);
      }
    } catch (error) {
      console.error('农历转换失败:', error);
      // 如果转换失败，使用简单方法
      this.setFallbackLunarDate(year, month, day, zodiac);
    }
  },
  
  // 设置备用农历日期（当转换失败时使用）
  setFallbackLunarDate: function(year, month, day, zodiac) {
    const lunarYears = ['庚子年', '辛丑年', '壬寅年', '癸卯年', '甲辰年', '乙巳年', '丙午年', '丁未年', '戊申年', '己酉年', '庚戌年', '辛亥年'];
    const lunarYear = lunarYears[(year - 1900) % 12];
    const lunarDate = `${lunarYear}正月初一`;
    
    this.setData({
      'userInfo.zodiac': zodiac,
      'userInfo.lunarDate': lunarDate
    });
  },
  
  // 计算星座
  calculateZodiac: function(month, day) {
    let zodiac = '';
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      zodiac = '白羊座';
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      zodiac = '金牛座';
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
      zodiac = '双子座';
    } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
      zodiac = '巨蟹座';
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      zodiac = '狮子座';
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      zodiac = '处女座';
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
      zodiac = '天秤座';
    } else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
      zodiac = '天蝎座';
    } else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
      zodiac = '射手座';
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      zodiac = '摩羯座';
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      zodiac = '水瓶座';
    } else {
      zodiac = '双鱼座';
    }
    return zodiac;
  },

  // MBTI选择器事件
  bindMBTIChange: function(e) {
    const mbtiIndex = e.detail.value;
    const mbti = this.data.mbtiOptions[mbtiIndex];
    
    this.setData({
      mbtiIndex,
      'userInfo.mbti': mbti
    });
  },

  // 获取当前位置
  getLocation: function() {
    // 添加标记防止重复调用
    if (this.isGettingLocation) {
      console.log('正在获取位置，请勿重复操作');
      return;
    }
    
    this.isGettingLocation = true;
    
    wx.showLoading({
      title: '定位中...'
    });

    // 检查是否有获取位置权限
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          // 已授权，直接打开位置选择器
          this.openLocationChooser();
        } else {
          // 未授权，申请权限
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this.openLocationChooser();
            },
            fail: () => {
              wx.hideLoading();
              this.isGettingLocation = false;
              wx.showModal({
                title: '需要授权',
                content: '请授权地理位置权限，以便选择您的位置',
                confirmText: '去设置',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    wx.openSetting();
                  }
                }
              });
            }
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        this.isGettingLocation = false;
        console.error('获取设置失败:', err);
        wx.showToast({
          title: '获取位置权限失败',
          icon: 'none'
        });
      }
    });
  },
  
  // 打开位置选择器
  openLocationChooser: function() {
    // 使用微信内置的位置选择器
    wx.chooseLocation({
      success: (res) => {
        wx.hideLoading();
        this.isGettingLocation = false;
        
        // 获取详细地址
        const name = res.name || '';
        const address = res.address || '';
        let fullAddress = address;
        
        // 如果有地点名称，添加到地址前面
        if (name && !address.includes(name)) {
          fullAddress = name + (address ? '，' + address : '');
        }
        
        // 只有当地址不为空时才更新
        if (fullAddress) {
          try {
            // 更新UI
            this.setData({
              'userInfo.currentLocation': fullAddress
            });
            
            // 保存到用户设置
            const userSettings = wx.getStorageSync('userSettings') || {};
            userSettings.currentLocation = fullAddress;
            wx.setStorageSync('userSettings', userSettings);
            
            // 发送自定义事件，通知其他页面更新天气数据
            const pages = getCurrentPages();
            pages.forEach(page => {
              if (page && page.loadWeatherData) {
                page.loadWeatherData();
              }
            });
            
            console.log('位置更新成功:', fullAddress);
            logger.log('位置更新', {
              地点: fullAddress,
              详细地址: address,
              名称: name,
              经度: res.longitude,
              纬度: res.latitude
            });
            
            wx.showToast({
              title: '位置已更新',
              icon: 'success'
            });
          } catch (error) {
            console.error('保存位置信息失败:', error);
            wx.showToast({
              title: '保存位置失败',
              icon: 'none'
            });
          }
        } else {
          wx.showToast({
            title: '未获取到地址信息',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        this.isGettingLocation = false;
        console.error('选择位置失败:', err);
        
        if (err.errMsg && err.errMsg.indexOf('cancel') > -1) {
          wx.showToast({
            title: '您取消了位置选择',
            icon: 'none'
          });
        } else {
          wx.showToast({
            title: '无法获取位置',
            icon: 'none'
          });
        }
      },
      complete: () => {
        // 确保在所有情况下都重置标志
        setTimeout(() => {
          this.isGettingLocation = false;
        }, 1000);
      }
    });
  },

  // 切换标签页
  switchTab: function(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    
    // 确保index是有效的数字
    if (isNaN(index) || (index !== 0 && index !== 1)) {
      console.error('无效的标签页索引', e.currentTarget.dataset.index);
      return;
    }
    
    console.log('切换标签页 - 当前activeTab:', this.data.activeTab, '切换到:', index);
    
    this.setData({
      activeTab: index
    });
    
    console.log('标签切换完成 - 新activeTab:', this.data.activeTab);
    
    logger.log('用户操作', {
      操作: '切换标签页',
      标签页: index === 0 ? '个人信息' : '我的好友'
    });
  },

  // 添加好友
  addFriend: function() {
    wx.showToast({
      title: '添加好友功能开发中',
      icon: 'none'
    });
    
    logger.log('用户操作', {
      操作: '点击添加好友按钮'
    });
  },

  // 查看全部梦境
  viewAllDreams: function() {
    wx.navigateTo({
      url: '/pages/dream_analysis/index'
    });
    
    logger.log('用户操作', {
      操作: '查看全部梦境记录'
    });
  },

  // 查看全部生日提醒
  viewAllBirthdays: function() {
    wx.showToast({
      title: '生日提醒功能开发中',
      icon: 'none'
    });
    
    logger.log('用户操作', {
      操作: '查看全部生日提醒'
    });
  },

  // 跳转到设置页面
  goToSettings: function(e) {
    const settingType = e.currentTarget.dataset.type;
    wx.showToast({
      title: `${settingType}设置功能开发中`,
      icon: 'none'
    });
    
    logger.log('用户操作', {
      操作: '进入设置',
      设置类型: settingType
    });
  },

  // 个人信息编辑
  editUserInfo: function() {
    wx.showToast({
      title: '个人信息编辑功能开发中',
      icon: 'none'
    });
    
    logger.log('用户操作', {
      操作: '编辑个人信息'
    });
  },

  // 查看好友详情
  viewFriendDetail: function(e) {
    const index = e.currentTarget.dataset.index;
    const friend = this.data.friends[index];
    
    wx.showToast({
      title: `查看好友${friend.name}的详情功能开发中`,
      icon: 'none'
    });
    
    logger.log('用户操作', {
      操作: '查看好友详情',
      好友: friend.name
    });
  },

  // 查看关系匹配详情
  viewCompatibilityDetail: function(e) {
    const type = e.currentTarget.dataset.type;
    const index = e.currentTarget.dataset.index;
    let data;
    
    if (type === 'wuxing') {
      data = this.data.compatibilities.wuxing[index];
      wx.showToast({
        title: `与${data.name}的五行合作详情功能开发中`,
        icon: 'none'
      });
    } else if (type === 'zodiac') {
      data = this.data.compatibilities.zodiac[index];
      wx.showToast({
        title: `与${data.name}的星座合盘详情功能开发中`,
        icon: 'none'
      });
    }
    
    logger.log('用户操作', {
      操作: '查看关系匹配详情',
      类型: type,
      好友: data.name
    });
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    // 刷新数据和位置
    this.refreshDailyData();
    this.getLocation();
    
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
}); 