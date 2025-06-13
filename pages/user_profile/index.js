const app = getApp();
const calendar = require('../../utils/lunar');
const tabConfigUtil = require('../../utils/tabConfig');
const { getBaziAnalysis } = require('../../utils/deepseekApi');

Page({
  data: {
    activeTab: 0, // 当前激活的标签页：0=个人信息, 1=高级功能, 2=我的好友
    // 标签页配置数据
    tabItems: [
      { index: 0, text: '个人分析', key: 'personal' },
      { index: 1, text: '高级功能', key: 'advanced' },
      { index: 2, text: '我的好友', key: 'friends' }
    ],
    isEditing: false, // 是否处于编辑模式
    mbtiOptions: ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'],
    mbtiIndex: 0, // MBTI选择器的索引
    genderOptions: ['男', '女'], // 性别选项
    genderIndex: 0, // 性别选择器的索引
    
    // 八字分析相关数据
    baziForm: {
      name: '',
      birthDate: '',
      birthTime: '',
      gender: '',
      genderIndex: 0,
      birthplace: '',
      birthplaceArray: []
    },
    baziAnalysisResult: null, // 八字分析结果
    isCalculatingBazi: false, // 是否正在计算八字
    canCalculateBazi: false, // 是否可以计算八字
    wuxingItems: [], // 五行分布数据
    
    userInfo: {
      avatar: null,
      nickname: '无姓名',
      birthdate: '1990年8月15日', // 默认生日
      birthtime: '12:00', // 默认出生时间
      gender: '男', // 默认性别
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
    birthdays: [],
   
    
    // 好友功能相关数据
    showFriendModal: false, // 是否显示好友添加/编辑模态框
    showFriendDetailModal: false, // 是否显示好友详情模态框
    isEditingFriend: false, // 是否处于编辑好友模式
    editingFriendIndex: -1, // 正在编辑的好友索引
    selectedFriend: null, // 选中的好友信息
    selectedFriendIndex: -1, // 选中的好友索引
    canSaveFriend: false, // 是否可以保存好友
    relationshipOptions: ['朋友', '家人', '同事', '同学', '恋人', '其他'], // 关系选项
    
    // 好友表单数据
    friendForm: {
      name: '',
      birthDate: '',
      birthTime: '',
      gender: '',
      genderIndex: 0,
      birthplace: '',
      birthplaceArray: [],
      relationship: '',
      relationshipIndex: 0,
      mbti: '',
      mbtiIndex: 0
    }
  },

  onLoad: function() {
    // 加载标签页配置
    this.loadTabConfig();
    
    this.initUserData();
    this.initMBTIIndex();
    this.initGenderIndex();
    this.initBaziFormWithUserInfo(); // 初始化八字表单数据
    
    // 确保activeTab被正确初始化
    this.setData({
      activeTab: 0
    });
    
    // 检查是否已有位置信息，如果没有则提示用户设置
    const userSettings = wx.getStorageSync('userSettings') || {};
    if (!userSettings.currentLocation) {
      console.log('未检测到保存的位置信息，用户可以手动点击设置位置');
    } else {
      console.log('已加载保存的位置信息:', userSettings.currentLocation);
    }
    
    // 加载已保存的八字分析结果
    this.loadSavedBaziResult();
  },

  onShow: function() {
    // 页面显示时，仅刷新数据，不自动获取位置
    this.refreshDailyData();
    // 不再自动调用 this.getLocation()，改为只在用户点击按钮时获取
    
    // 输出当前标签状态，用于调试
    console.log('页面显示 - 当前activeTab:', this.data.activeTab);
    
    // 应用动态TabBar样式 - 让自动检测处理，不手动设置
    if (typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar();
      if (tabBar) {
        tabBar.updateCurrentTab();
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
        'userInfo.gender': userSettings.gender || this.data.userInfo.gender,
        'userInfo.mbti': userSettings.mbti || this.data.userInfo.mbti,
        'userInfo.birthplace': userSettings.birthplace || this.data.userInfo.birthplace,
        'userInfo.birthplaceArray': userSettings.birthplaceArray || this.data.userInfo.birthplaceArray,
        'userInfo.currentLocation': userSettings.currentLocation || this.data.userInfo.currentLocation
      });
      
      // 加载八字分析结果
      if (userSettings.baziAnalysisResult) {
        const wuxingItems = this.processWuxingData(userSettings.baziAnalysisResult.wuxingAnalysis.distribution);
        this.setData({
          baziAnalysisResult: userSettings.baziAnalysisResult,
          wuxingItems: wuxingItems
        });
      }
      
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
      
      // 如果成功加载到位置信息，输出日志
      if (userSettings.currentLocation) {
        console.log('成功加载已保存的位置信息:', userSettings.currentLocation);
      }
    }
    
    // 从本地存储加载朋友列表
    const friendsList = wx.getStorageSync('friendsList');
    if (friendsList && Array.isArray(friendsList)) {
      this.setData({
        friends: friendsList
      });
      // 更新生日提醒
      this.updateBirthdayReminders(friendsList);
    } else {
      // 如果没有保存的朋友列表，使用默认数据并更新生日提醒
      this.updateBirthdayReminders(this.data.friends);
    }
  },

  // 初始化MBTI选择器的索引
  initMBTIIndex: function() {
    const mbtiIndex = this.data.mbtiOptions.indexOf(this.data.userInfo.mbti);
    if (mbtiIndex !== -1) {
      this.setData({ mbtiIndex });
    }
  },

  // 初始化性别选择器的索引
  initGenderIndex: function() {
    const genderIndex = this.data.genderOptions.indexOf(this.data.userInfo.gender);
    if (genderIndex !== -1) {
      this.setData({ genderIndex });
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
      'userInfo.birthtime': timeStr,
      // 同时更新八字表单中的出生时间
      'baziForm.birthTime': timeStr
    });
    
    // 检查八字表单是否完整
    this.checkCanCalculateBazi();
  },

  // 出生地选择器事件
  bindBirthplaceChange: function(e) {
    const region = e.detail.value;
    const formattedPlace = region.join(' ');
    
    this.setData({
      'userInfo.birthplace': formattedPlace,
      'userInfo.birthplaceArray': region,
      // 同时更新八字表单中的出生地
      'baziForm.birthplace': formattedPlace,
      'baziForm.birthplaceArray': region
    });
    
    // 检查八字表单是否完整
    this.checkCanCalculateBazi();
  },

  // 性别选择器事件
  bindGenderChange: function(e) {
    const genderIndex = parseInt(e.detail.value);
    const gender = this.data.genderOptions[genderIndex];
    this.setData({
      genderIndex: genderIndex,
      'userInfo.gender': gender,
      // 同时更新八字表单中的性别
      'baziForm.gender': gender,
      'baziForm.genderIndex': genderIndex
    });
    
    // 检查八字表单是否完整
    this.checkCanCalculateBazi();
  },

  // 保存用户设置
  saveUserSettings: function() {
    const userSettings = {
      nickname: this.data.userInfo.nickname,
      firstLetter: this.data.userInfo.firstLetter,
      birthdate: this.data.userInfo.birthdate,
      birthtime: this.data.userInfo.birthtime,
      gender: this.data.userInfo.gender,
      mbti: this.data.userInfo.mbti,
      birthplace: this.data.userInfo.birthplace,
      birthplaceArray: this.data.userInfo.birthplaceArray,
      currentLocation: this.data.userInfo.currentLocation,
      // 保存八字分析结果
      baziAnalysisResult: this.data.baziAnalysisResult
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
    
    console.log('用户设置已保存，包括位置信息:', userSettings.currentLocation);
  },

  // 生日选择器事件
  bindBirthdateChange: function(e) {
    // 将日期格式从YYYY-MM-DD转为YYYY年MM月DD日
    const dateStr = e.detail.value;
    
    // 使用字符串分割而不是Date对象来避免时区问题
    const dateParts = dateStr.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    
    const formattedDate = `${year}年${month}月${day}日`;
    
    console.log('生日选择器输入:', dateStr);
    console.log('解析结果 - 年:', year, '月:', month, '日:', day);
    console.log('格式化结果:', formattedDate);
    
    this.setData({
      'userInfo.birthdate': formattedDate,
      // 同时更新八字表单中的出生日期
      'baziForm.birthDate': dateStr
    });
    
    // 更新农历和星座
    this.updateZodiacAndLunar(year, month, day);
    
    // 检查八字表单是否完整
    this.checkCanCalculateBazi();
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
            
            // 立即保存用户设置，确保位置信息被持久化
            this.saveUserSettings();
            
            // 发送自定义事件，通知其他页面更新天气数据
            const pages = getCurrentPages();
            pages.forEach(page => {
              if (page && page.loadWeatherData) {
                page.loadWeatherData();
              }
            });
            
            console.log('位置更新并保存成功:', fullAddress);
            
            wx.showToast({
              title: '位置已永久保存',
              icon: 'success',
              duration: 2000
            });
            
            // 延迟显示提示，告知用户位置已保存到本地
            setTimeout(() => {
              wx.showModal({
                title: '位置保存成功',
                content: '您的位置信息已保存到本地，下次进入小程序时会自动加载，无需重新选择。',
                showCancel: false,
                confirmText: '知道了'
              });
            }, 2500);
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
    if (isNaN(index) || (index !== 0 && index !== 1 && index !== 2)) {
      console.error('无效的标签页索引', e.currentTarget.dataset.index);
      return;
    }
    
    console.log('切换标签页 - 当前activeTab:', this.data.activeTab, '切换到:', index);
    
    this.setData({
      activeTab: index
    });
    
    console.log('标签切换完成 - 新activeTab:', this.data.activeTab);
  },

  // 添加好友
  addFriend: function() {
    wx.showToast({
      title: '添加好友功能开发中',
      icon: 'none'
    });
  },

  // 查看全部梦境
  viewAllDreams: function() {
    wx.navigateTo({
      url: '/pages/dream_analysis/index'
    });
  },

  // 查看全部生日提醒
  viewAllBirthdays: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 跳转到设置页面
  goToSettings: function(e) {
    const settingType = e.currentTarget.dataset.type;
    wx.showToast({
      title: `${settingType}设置功能开发中`,
      icon: 'none'
    });
  },

  // 个人信息编辑
  editUserInfo: function() {
    wx.showToast({
      title: '个人信息编辑功能开发中',
      icon: 'none'
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
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    // 刷新数据和位置
    this.refreshDailyData();
    this.getLocation();
    
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  // 八字分析相关方法
  
  // 姓名输入
  onBaziNameChange: function(e) {
    this.setData({
      'baziForm.name': e.detail.value
    });
    this.checkCanCalculateBazi();
  },

  // 出生日期选择
  onBaziBirthDateChange: function(e) {
    this.setData({
      'baziForm.birthDate': e.detail.value
    });
    this.checkCanCalculateBazi();
  },

  // 出生时间选择
  onBaziBirthTimeChange: function(e) {
    this.setData({
      'baziForm.birthTime': e.detail.value
    });
    this.checkCanCalculateBazi();
  },

  // 性别选择
  onBaziGenderChange: function(e) {
    const genderIndex = parseInt(e.detail.value);
    const genders = ['男', '女'];
    this.setData({
      'baziForm.genderIndex': genderIndex,
      'baziForm.gender': genders[genderIndex]
    });
    this.checkCanCalculateBazi();
  },

  // 出生地选择
  onBaziBirthplaceChange: function(e) {
    const birthplaceArray = e.detail.value;
    const birthplace = birthplaceArray.join('');
    this.setData({
      'baziForm.birthplaceArray': birthplaceArray,
      'baziForm.birthplace': birthplace
    });
    this.checkCanCalculateBazi();
  },

  // 检查是否可以计算八字
  checkCanCalculateBazi: function() {
    const { name, birthDate, birthTime, gender, birthplace } = this.data.baziForm;
    const canCalculate = name && birthDate && birthTime && gender && birthplace;
    this.setData({
      canCalculateBazi: canCalculate
    });
  },

  // 开始八字分析
  calculateBazi: async function() {
    if (!this.data.canCalculateBazi || this.data.isCalculatingBazi) {
      return;
    }

    // 设置计算状态
    this.setData({
      isCalculatingBazi: true
    });

    wx.showLoading({
      title: '正在分析八字...',
      mask: true
    });

    try {
      // 构建出生信息
      const birthInfo = {
        name: this.data.baziForm.name,
        birthDate: this.data.baziForm.birthDate,
        birthTime: this.data.baziForm.birthTime,
        gender: this.data.baziForm.gender,
        birthplace: this.data.baziForm.birthplace
      };

      // 构建用户信息
      const userInfo = {
        nickname: this.data.userInfo.nickname,
        gender: this.data.baziForm.gender,
        birthplace: this.data.baziForm.birthplace,
        zodiac: this.data.userInfo.zodiac,
        mbti: this.data.userInfo.mbti
      };

      console.log('开始调用八字分析API...', { birthInfo, userInfo });

      // 调用八字分析API
      const result = await getBaziAnalysis(birthInfo, userInfo);

      console.log('八字分析结果:', result);

      // 处理五行数据用于可视化
      const wuxingItems = this.processWuxingData(result.wuxingAnalysis.distribution);

      // 保存结果到页面数据 - 直接使用原始数据结构
      this.setData({
        baziAnalysisResult: result, // 直接使用原始结果，不修改nameAnalysis结构
        wuxingItems: wuxingItems
      });

      // 保存到本地存储
      wx.setStorageSync('baziAnalysisResult', result);
      wx.setStorageSync('baziBirthInfo', birthInfo);
      
      // 更新userSettings中的八字分析结果
      const userSettings = wx.getStorageSync('userSettings') || {};
      userSettings.baziAnalysisResult = result;
      wx.setStorageSync('userSettings', userSettings);

      wx.hideLoading();
      wx.showToast({
        title: '八字分析完成',
        icon: 'success'
      });

      // 记录日志
      console.log('八字分析成功:', {
        操作: '计算八字',
        出生日期: birthInfo.birthDate,
        出生时间: birthInfo.birthTime,
        性别: birthInfo.gender,
        出生地: birthInfo.birthplace,
        分析结果: result.baziInfo
      });

    } catch (error) {
      console.error('八字分析失败:', error);
      wx.hideLoading();
      wx.showModal({
        title: '分析失败',
        content: '八字分析失败，请检查网络连接后重试',
        showCancel: false
      });

      // 记录错误日志
      console.error('八字分析失败详情:', {
        错误: error.message,
        出生信息: this.data.baziForm
      });
    } finally {
      // 重置计算状态
      this.setData({
        isCalculatingBazi: false
      });
    }
  },

  // 处理五行数据用于可视化
  processWuxingData: function(distribution) {
    const wuxingConfig = [
      { name: '金', element: 'metal', color: '#FFD700' },
      { name: '木', element: 'wood', color: '#228B22' },
      { name: '水', element: 'water', color: '#1E90FF' },
      { name: '火', element: 'fire', color: '#FF6347' },
      { name: '土', element: 'earth', color: '#D2691E' }
    ];

    // 计算总数
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);

    return wuxingConfig.map(config => {
      const count = distribution[config.element] || 0;
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      
      return {
        name: config.name,
        element: config.element,
        count: count,
        percentage: percentage,
        color: config.color
      };
    });
  },

  // 重新分析八字
  resetBaziAnalysis: function() {
    wx.showModal({
      title: '确认重新分析',
      content: '确定要重新进行八字分析吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            baziAnalysisResult: null,
            wuxingItems: [],
            'baziForm.name': '',
            'baziForm.birthDate': '',
            'baziForm.birthTime': '',
            'baziForm.gender': '',
            'baziForm.genderIndex': 0,
            'baziForm.birthplace': '',
            'baziForm.birthplaceArray': [],
            canCalculateBazi: false
          });

          // 清除本地存储
          wx.removeStorageSync('baziAnalysisResult');
          wx.removeStorageSync('baziBirthInfo');
          
          // 从userSettings中删除八字分析结果
          const userSettings = wx.getStorageSync('userSettings') || {};
          delete userSettings.baziAnalysisResult;
          wx.setStorageSync('userSettings', userSettings);
        }
      }
    });
  },

  // 保存为我的八字
  saveAsMyBazi: function() {
    wx.showModal({
      title: '保存为我的八字',
      content: '确定要将此八字信息保存为您的个人八字吗？这将更新您的个人信息。',
      success: (res) => {
        if (res.confirm) {
          const baziForm = this.data.baziForm;
          const baziResult = this.data.baziAnalysisResult;
          
          // 更新个人信息
          const updatedUserInfo = {
            ...this.data.userInfo,
            nickname: baziForm.name,
            firstLetter: baziForm.name ? baziForm.name.charAt(0) : this.data.userInfo.firstLetter,
            birthdate: this.formatDateForDisplay(baziForm.birthDate),
            birthtime: baziForm.birthTime,
            gender: baziForm.gender,
            birthplace: baziForm.birthplace,
            birthplaceArray: baziForm.birthplaceArray
          };
          
          // 更新星座和农历信息
          if (baziForm.birthDate) {
            const date = new Date(baziForm.birthDate);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            this.updateZodiacAndLunar(year, month, day);
          }
          
          // 更新页面数据
          this.setData({
            userInfo: updatedUserInfo
          });
          
          // 保存到userSettings
          const userSettings = {
            nickname: baziForm.name,
            firstLetter: baziForm.name ? baziForm.name.charAt(0) : this.data.userInfo.firstLetter,
            birthdate: this.formatDateForDisplay(baziForm.birthDate),
            birthtime: baziForm.birthTime,
            gender: baziForm.gender,
            mbti: this.data.userInfo.mbti,
            birthplace: baziForm.birthplace,
            birthplaceArray: baziForm.birthplaceArray,
            currentLocation: this.data.userInfo.currentLocation,
            baziAnalysisResult: baziResult
          };
          
          wx.setStorageSync('userSettings', userSettings);
          
          // 同步到全局数据
          if (app.globalData) {
            app.globalData.userSettings = userSettings;
            if (app.globalData.userInfo) {
              app.globalData.userInfo.nickname = baziForm.name;
            }
          }
          
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 保存为我的朋友
  saveAsFriend: function() {
    const baziForm = this.data.baziForm;
    const baziResult = this.data.baziAnalysisResult;
    
    if (!baziForm.name || !baziResult) {
      wx.showToast({
        title: '数据不完整',
        icon: 'none'
      });
      return;
    }
    
    // 计算星座
    let zodiac = '未知';
    if (baziForm.birthDate) {
      const date = new Date(baziForm.birthDate);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      zodiac = this.calculateZodiac(month, day);
    }
    
    // 构造朋友数据
    const friendData = {
      name: baziForm.name,
      firstLetter: baziForm.name.charAt(0),
      bgColor: this.getRandomBgColor(),
      zodiac: zodiac,
      zodiacColor: this.getZodiacColor(zodiac),
      mbti: 'UNKNOWN', // 可以后续完善
      lunarYear: baziResult.baziInfo.year || '未知',
      relationship: '朋友',
      birthdate: this.formatDateForDisplay(baziForm.birthDate),
      birthtime: baziForm.birthTime,
      gender: baziForm.gender,
      birthplace: baziForm.birthplace,
      baziInfo: baziResult
    };
    
    // 获取现有朋友列表
    const currentFriends = this.data.friends || [];
    
    // 检查是否已存在同名朋友
    const existingFriend = currentFriends.find(friend => friend.name === baziForm.name);
    if (existingFriend) {
      wx.showModal({
        title: '朋友已存在',
        content: `朋友列表中已有名为"${baziForm.name}"的朋友，是否覆盖其信息？`,
        success: (res) => {
          if (res.confirm) {
            this.updateFriendsList(friendData, currentFriends);
          }
        }
      });
    } else {
      // 直接添加新朋友
      this.updateFriendsList(friendData, currentFriends);
    }
  },

  // 更新朋友列表
  updateFriendsList: function(friendData, currentFriends) {
    // 查找是否已存在
    const existingIndex = currentFriends.findIndex(friend => friend.name === friendData.name);
    
    if (existingIndex >= 0) {
      // 更新现有朋友
      currentFriends[existingIndex] = friendData;
    } else {
      // 添加新朋友
      currentFriends.push(friendData);
    }
    
    // 更新页面数据
    this.setData({
      friends: currentFriends
    });
    
    // 保存到本地存储
    wx.setStorageSync('friendsList', currentFriends);
    
    wx.showToast({
      title: '已保存到朋友列表',
      icon: 'success'
    });
  },

  // 获取随机背景色
  getRandomBgColor: function() {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  // 获取星座颜色
  getZodiacColor: function(zodiac) {
    const colorMap = {
      '白羊座': 'text-red-500',
      '金牛座': 'text-green-500',
      '双子座': 'text-blue-500',
      '巨蟹座': 'text-purple-500',
      '狮子座': 'text-yellow-500',
      '处女座': 'text-gray-500',
      '天秤座': 'text-pink-500',
      '天蝎座': 'text-indigo-500',
      '射手座': 'text-orange-500',
      '摩羯座': 'text-brown-500',
      '水瓶座': 'text-cyan-500',
      '双鱼座': 'text-teal-500'
    };
    return colorMap[zodiac] || 'text-gray-500';
  },

  // 格式化日期为显示格式
  formatDateForDisplay: function(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  },

  // 页面加载时检查是否有已保存的八字分析结果
  loadSavedBaziResult: function() {
    try {
      const savedResult = wx.getStorageSync('baziAnalysisResult');
      const savedBirthInfo = wx.getStorageSync('baziBirthInfo');
      
      if (savedResult && savedBirthInfo) {
        console.log('加载已保存的八字分析结果');
        
        // 处理五行数据
        const wuxingItems = this.processWuxingData(savedResult.wuxingAnalysis.distribution);
        
        this.setData({
          baziAnalysisResult: savedResult,
          wuxingItems: wuxingItems,
          'baziForm.birthDate': savedBirthInfo.birthDate,
          'baziForm.birthTime': savedBirthInfo.birthTime,
          'baziForm.gender': savedBirthInfo.gender,
          'baziForm.birthplace': savedBirthInfo.birthplace,
          canCalculateBazi: true
        });
      }
    } catch (error) {
      console.error('加载八字分析结果失败:', error);
    }
  },

  // 初始化八字表单数据
  initBaziFormWithUserInfo: function() {
    const userInfo = this.data.userInfo;
    
    // 转换出生日期格式：从"YYYY年MM月DD日"转换为"YYYY-MM-DD"
    let birthDate = '';
    if (userInfo.birthdate) {
      const match = userInfo.birthdate.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (match) {
        const year = match[1];
        const month = match[2].padStart(2, '0');
        const day = match[3].padStart(2, '0');
        birthDate = `${year}-${month}-${day}`;
      }
    }
    
    this.setData({
      'baziForm.name': userInfo.nickname || '',
      'baziForm.birthDate': birthDate,
      'baziForm.birthTime': userInfo.birthtime || '',
      'baziForm.gender': userInfo.gender || '',
      'baziForm.genderIndex': this.data.genderOptions.indexOf(userInfo.gender || '') >= 0 ? this.data.genderOptions.indexOf(userInfo.gender) : 0,
      'baziForm.birthplace': userInfo.birthplace || '',
      'baziForm.birthplaceArray': userInfo.birthplaceArray || []
    });
    
    // 检查是否可以计算八字
    this.checkCanCalculateBazi();
  },

  // ==================== 好友功能相关方法 ====================

  // 显示添加好友模态框
  showAddFriendModal: function() {
    this.setData({
      showFriendModal: true,
      isEditingFriend: false,
      friendForm: {
        name: '',
        birthDate: '',
        birthTime: '',
        gender: '',
        genderIndex: 0,
        birthplace: '',
        birthplaceArray: [],
        relationship: '',
        relationshipIndex: 0,
        mbti: '',
        mbtiIndex: 0
      },
      relationshipOptions: ['朋友', '家人', '同事', '同学', '恋人', '其他'],
      canSaveFriend: false
    });
  },

  // 隐藏好友模态框
  hideFriendModal: function() {
    this.setData({
      showFriendModal: false
    });
  },

  // 防止模态框关闭
  preventModalClose: function() {
    // 阻止事件冒泡
  },

  // 好友表单输入处理
  onFriendNameChange: function(e) {
    this.setData({
      'friendForm.name': e.detail.value
    });
    this.checkCanSaveFriend();
  },

  onFriendBirthDateChange: function(e) {
    this.setData({
      'friendForm.birthDate': e.detail.value
    });
    this.checkCanSaveFriend();
  },

  onFriendBirthTimeChange: function(e) {
    this.setData({
      'friendForm.birthTime': e.detail.value
    });
    this.checkCanSaveFriend();
  },

  onFriendGenderChange: function(e) {
    const genderIndex = parseInt(e.detail.value);
    const gender = ['男', '女'][genderIndex];
    this.setData({
      'friendForm.genderIndex': genderIndex,
      'friendForm.gender': gender
    });
    this.checkCanSaveFriend();
  },

  onFriendBirthplaceChange: function(e) {
    const region = e.detail.value;
    const formattedPlace = region.join(' ');
    this.setData({
      'friendForm.birthplace': formattedPlace,
      'friendForm.birthplaceArray': region
    });
    this.checkCanSaveFriend();
  },

  onFriendRelationshipChange: function(e) {
    const relationshipIndex = parseInt(e.detail.value);
    const relationship = this.data.relationshipOptions[relationshipIndex];
    this.setData({
      'friendForm.relationshipIndex': relationshipIndex,
      'friendForm.relationship': relationship
    });
    this.checkCanSaveFriend();
  },

  onFriendMbtiChange: function(e) {
    const mbtiIndex = parseInt(e.detail.value);
    const mbti = this.data.mbtiOptions[mbtiIndex];
    this.setData({
      'friendForm.mbtiIndex': mbtiIndex,
      'friendForm.mbti': mbti
    });
  },

  // 检查是否可以保存好友
  checkCanSaveFriend: function() {
    const form = this.data.friendForm;
    const canSave = form.name && form.birthDate && form.birthTime && form.gender && form.birthplace && form.relationship;
    this.setData({
      canSaveFriend: canSave
    });
  },

  // 保存好友
  saveFriend: function() {
    const form = this.data.friendForm;
    const friends = this.data.friends || [];
    
    // 计算星座
    let zodiac = '未知';
    if (form.birthDate) {
      const date = new Date(form.birthDate);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      zodiac = this.calculateZodiac(month, day);
    }
    
    // 计算农历年份
    let lunarYear = '未知';
    if (form.birthDate) {
      const date = new Date(form.birthDate);
      try {
        const lunarData = calendar.solarToLunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
        if (lunarData && lunarData.gzYear) {
          lunarYear = lunarData.gzYear + '年';
        }
      } catch (error) {
        console.error('计算农历年份失败:', error);
      }
    }
    
    // 构造好友数据
    const friendData = {
      name: form.name,
      firstLetter: form.name.charAt(0),
      bgColor: this.getRandomBgColor(),
      zodiac: zodiac,
      zodiacColor: this.getZodiacColor(zodiac),
      mbti: form.mbti || 'UNKNOWN',
      lunarYear: lunarYear,
      relationship: form.relationship,
      birthdate: this.formatDateForDisplay(form.birthDate),
      birthtime: form.birthTime,
      gender: form.gender,
      birthplace: form.birthplace,
      baziInfo: null // 八字信息待后续计算
    };
    
    if (this.data.isEditingFriend) {
      // 编辑模式：更新现有好友
      const editIndex = this.data.editingFriendIndex;
      friends[editIndex] = friendData;
      wx.showToast({
        title: '好友信息已更新',
        icon: 'success'
      });
    } else {
      // 添加模式：检查重名
      const existingFriend = friends.find(friend => friend.name === form.name);
      if (existingFriend) {
        wx.showModal({
          title: '好友已存在',
          content: `好友列表中已有名为"${form.name}"的好友，是否覆盖其信息？`,
          success: (res) => {
            if (res.confirm) {
              const existingIndex = friends.findIndex(friend => friend.name === form.name);
              friends[existingIndex] = friendData;
              this.updateFriendsData(friends);
            }
          }
        });
        return;
      } else {
        friends.push(friendData);
        wx.showToast({
          title: '好友添加成功',
          icon: 'success'
        });
      }
    }
    
    this.updateFriendsData(friends);
    this.hideFriendModal();
  },

  // 更新好友数据
  updateFriendsData: function(friends) {
    this.setData({
      friends: friends
    });
    // 保存到本地存储
    wx.setStorageSync('friendsList', friends);
    // 更新生日提醒
    this.updateBirthdayReminders(friends);
  },

  // 查看好友详情
  viewFriendDetail: function(e) {
    const index = e.currentTarget.dataset.index;
    const friend = this.data.friends[index];
    this.setData({
      selectedFriend: friend,
      selectedFriendIndex: index,
      showFriendDetailModal: true
    });
  },

  // 隐藏好友详情模态框
  hideFriendDetailModal: function() {
    this.setData({
      showFriendDetailModal: false
    });
  },

  // 编辑好友
  editFriend: function(e) {
    const index = e.currentTarget.dataset.index;
    const friend = this.data.friends[index];
    
    // 转换出生日期格式
    let birthDate = '';
    if (friend.birthdate) {
      const match = friend.birthdate.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (match) {
        const year = match[1];
        const month = match[2].padStart(2, '0');
        const day = match[3].padStart(2, '0');
        birthDate = `${year}-${month}-${day}`;
      }
    }
    
    this.setData({
      showFriendModal: true,
      isEditingFriend: true,
      editingFriendIndex: index,
      friendForm: {
        name: friend.name,
        birthDate: birthDate,
        birthTime: friend.birthtime,
        gender: friend.gender,
        genderIndex: ['男', '女'].indexOf(friend.gender),
        birthplace: friend.birthplace,
        birthplaceArray: friend.birthplace ? friend.birthplace.split(' ') : [],
        relationship: friend.relationship,
        relationshipIndex: this.data.relationshipOptions.indexOf(friend.relationship),
        mbti: friend.mbti || '',
        mbtiIndex: friend.mbti ? this.data.mbtiOptions.indexOf(friend.mbti) : 0
      },
      relationshipOptions: ['朋友', '家人', '同事', '同学', '恋人', '其他']
    });
    this.checkCanSaveFriend();
  },

  // 从详情页面编辑好友
  editFriendFromDetail: function(e) {
    this.hideFriendDetailModal();
    setTimeout(() => {
      this.editFriend(e);
    }, 300);
  },

  // 删除好友
  deleteFriend: function(e) {
    const index = e.currentTarget.dataset.index;
    const friend = this.data.friends[index];
    
    wx.showModal({
      title: '删除好友',
      content: `确定要删除好友"${friend.name}"吗？此操作不可恢复。`,
      success: (res) => {
        if (res.confirm) {
          const friends = this.data.friends;
          friends.splice(index, 1);
          this.updateFriendsData(friends);
          wx.showToast({
            title: '好友已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 从详情页面删除好友
  deleteFriendFromDetail: function(e) {
    this.hideFriendDetailModal();
    setTimeout(() => {
      this.deleteFriend(e);
    }, 300);
  },

  // 查看好友八字
  viewFriendBazi: function(e) {
    const index = e.currentTarget.dataset.index;
    const friend = this.data.friends[index];
    
    if (!friend.baziInfo) {
      wx.showModal({
        title: '八字信息缺失',
        content: '该好友还没有八字信息，是否现在为其计算八字？',
        success: (res) => {
          if (res.confirm) {
            this.calculateFriendBazi(index);
          }
        }
      });
    } else {
      // 显示好友八字详情
      this.showFriendBaziDetail(friend);
    }
  },

  // 计算好友八字
  calculateFriendBazi: function(friendIndex) {
    const friend = this.data.friends[friendIndex];
    
    if (!friend.birthdate || !friend.birthtime || !friend.birthplace) {
      wx.showToast({
        title: '好友信息不完整',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '计算八字中...'
    });
    
    // 构造八字计算参数
    let birthDate = '';
    const match = friend.birthdate.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    if (match) {
      const year = match[1];
      const month = match[2].padStart(2, '0');
      const day = match[3].padStart(2, '0');
      birthDate = `${year}-${month}-${day}`;
    }
    
    const baziParams = {
      name: friend.name,
      birthDate: birthDate,
      birthTime: friend.birthtime,
      gender: friend.gender,
      birthplace: friend.birthplace
    };
    
    getBaziAnalysis(baziParams)
      .then(result => {
        wx.hideLoading();
        
        // 更新好友的八字信息
        const friends = this.data.friends;
        friends[friendIndex].baziInfo = result;
        this.updateFriendsData(friends);
        
        // 显示八字详情
        this.showFriendBaziDetail(friends[friendIndex]);
      })
      .catch(error => {
        wx.hideLoading();
        console.error('计算好友八字失败:', error);
        wx.showToast({
          title: '计算失败，请重试',
          icon: 'none'
        });
      });
  },

  // 显示好友八字详情
  showFriendBaziDetail: function(friend) {
    // 可以导航到专门的八字详情页面，或者在当前页面显示
    wx.showModal({
      title: `${friend.name}的八字`,
      content: `八字：${friend.baziInfo.baziInfo.year} ${friend.baziInfo.baziInfo.month} ${friend.baziInfo.baziInfo.day} ${friend.baziInfo.baziInfo.hour}\n日主：${friend.baziInfo.baziInfo.dayMaster} (${friend.baziInfo.baziInfo.dayMasterElement})`,
      showCancel: false
    });
  },

  // 计算匹配度
  calculateCompatibility: function(e) {
    const index = e.currentTarget.dataset.index;
    const friend = this.data.friends[index];
    const myBaziInfo = this.data.baziAnalysisResult;
    
    if (!myBaziInfo) {
      wx.showToast({
        title: '请先分析自己的八字',
        icon: 'none'
      });
      return;
    }
    
    if (!friend.baziInfo) {
      wx.showToast({
        title: '好友八字信息缺失',
        icon: 'none'
      });
      return;
    }
    
    // 简单的匹配度计算逻辑
    const compatibility = this.calculateBaziCompatibility(myBaziInfo, friend.baziInfo);
    
    wx.showModal({
      title: `与${friend.name}的匹配度`,
      content: `八字匹配度：${compatibility.bazi}%\n五行互补：${compatibility.wuxing}%\n综合评分：${compatibility.overall}%`,
      showCancel: false
    });
  },

  // 计算八字匹配度（简化版本）
  calculateBaziCompatibility: function(myBazi, friendBazi) {
    // 这里是简化的匹配度计算逻辑
    // 实际项目中可以实现更复杂的匹配算法
    
    let baziScore = Math.floor(Math.random() * 30) + 60; // 60-90的随机分数
    let wuxingScore = Math.floor(Math.random() * 25) + 65; // 65-90的随机分数
    let overallScore = Math.round((baziScore + wuxingScore) / 2);
    
    return {
      bazi: baziScore,
      wuxing: wuxingScore,
      overall: overallScore
    };
  },

  // 更新生日提醒
  updateBirthdayReminders: function(friends) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const birthdays = [];
    
    friends.forEach(friend => {
      if (friend.birthdate) {
        const match = friend.birthdate.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
        if (match) {
          const month = parseInt(match[2]);
          const day = parseInt(match[3]);
          
          // 计算今年的生日
          const birthdayThisYear = new Date(currentYear, month - 1, day);
          let birthdayToCheck = birthdayThisYear;
          
          // 如果今年的生日已过，计算明年的生日
          if (birthdayThisYear < today) {
            birthdayToCheck = new Date(currentYear + 1, month - 1, day);
          }
          
          const daysLeft = Math.ceil((birthdayToCheck - today) / (1000 * 60 * 60 * 24));
          
          if (daysLeft <= 30) { // 只显示30天内的生日
            birthdays.push({
              name: friend.name,
              date: `${month}月${day}日`,
              daysLeft: daysLeft
            });
          }
        }
      }
    });
    
    // 按剩余天数排序
    birthdays.sort((a, b) => a.daysLeft - b.daysLeft);
    
    this.setData({
      birthdays: birthdays
    });
  },

  // 加载标签页配置
  loadTabConfig: function() {
    wx.cloud.callFunction({
      name: 'getUserTabConfig',
      success: res => {
        console.log('获取用户资料页标签配置成功:', res);
        if (res.result.code === 0 && res.result.data) {
          this.setData({
            tabItems: res.result.data
          });
        } else {
          console.error('获取标签配置失败:', res.result.message);
          // 使用默认配置
          this.setData({
            tabItems: [
              { index: 0, text: '个人信息', key: 'personal' }
            ]
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败:', err);
        // 使用默认配置
        this.setData({
          tabItems: [
            { index: 0, text: '个人信息', key: 'personal' }
          ]
        });
      }
    });
  },

  // 处理姓名解析数据
  processNameAnalysisData: function(nameAnalysis) {
    if (!nameAnalysis) {
      return null;
    }

    try {
      // 确保数据结构完整
      const processedData = {
        nameBreakdown: {
          tianGe: nameAnalysis.nameBreakdown?.tianGe || '未知',
          renGe: nameAnalysis.nameBreakdown?.renGe || '未知',
          diGe: nameAnalysis.nameBreakdown?.diGe || '未知',
          waiGe: nameAnalysis.nameBreakdown?.waiGe || '未知',
          zongGe: nameAnalysis.nameBreakdown?.zongGe || '未知'
        },
        nameWuxing: {
          chars: this.processNameCharacters(nameAnalysis.nameWuxing?.characters || []),
          summary: nameAnalysis.nameWuxing?.overallWuxing || '姓名五行分析暂无'
        },
        mathAnalysis: nameAnalysis.nameScore ? `综合评分：${nameAnalysis.nameScore}分` : '数理分析暂无',
        baziMatch: {
          score: this.parseScore(nameAnalysis.baziNameMatch?.compatibility),
          analysis: nameAnalysis.baziNameMatch?.analysis || '匹配度分析暂无'
        },
        suggestions: this.formatNameSuggestions(nameAnalysis.nameAdvice)
      };

      return processedData;
    } catch (error) {
      console.error('处理姓名解析数据时出错:', error);
      return {
        nameBreakdown: {
          tianGe: '数据解析失败',
          renGe: '数据解析失败', 
          diGe: '数据解析失败',
          waiGe: '数据解析失败',
          zongGe: '数据解析失败'
        },
        nameWuxing: {
          chars: [],
          summary: '数据解析失败'
        },
        mathAnalysis: '数据解析失败',
        baziMatch: {
          score: 0,
          analysis: '数据解析失败'
        },
        suggestions: '数据解析失败'
      };
    }
  },

  // 处理姓名字符的五行数据
  processNameCharacters: function(characters) {
    if (!Array.isArray(characters) || characters.length === 0) {
      return [];
    }

    return characters.map((item, index) => {
      if (typeof item === 'string') {
        // 如果是字符串，尝试解析
        return {
          char: item,
          wuxing: '未知'
        };
      } else if (typeof item === 'object') {
        return {
          char: item.char || item.character || `字${index + 1}`,
          wuxing: item.wuxing || item.element || '未知'
        };
      }
      return {
        char: `字${index + 1}`,
        wuxing: '未知'
      };
    });
  },

  // 解析分数
  parseScore: function(scoreStr) {
    if (!scoreStr) return 0;
    
    // 提取数字
    const match = scoreStr.toString().match(/(\d+)/);
    if (match) {
      const score = parseInt(match[1]);
      return Math.min(100, Math.max(0, score)); // 确保在0-100范围内
    }
    return 0;
  },

  // 格式化姓名建议
  formatNameSuggestions: function(nameAdvice) {
    if (!nameAdvice) {
      return '暂无建议';
    }

    let suggestions = [];
    
    if (nameAdvice.isNameGood) {
      suggestions.push('✅ 您的姓名与八字匹配较好');
    } else {
      suggestions.push('⚠️ 您的姓名与八字匹配度有待提升');
    }

    if (Array.isArray(nameAdvice.suggestions) && nameAdvice.suggestions.length > 0) {
      suggestions = suggestions.concat(nameAdvice.suggestions);
    }

    if (Array.isArray(nameAdvice.alternativeNames) && nameAdvice.alternativeNames.length > 0) {
      suggestions.push('💡 推荐改名：' + nameAdvice.alternativeNames.join('、'));
    }

    return suggestions.length > 0 ? suggestions.join('\n') : '暂无建议';
  }
}); 