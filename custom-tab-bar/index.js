Component({
  data: {
    selected: 0,
    tabConfig: [],
    color: "#94a3b8",
    selectedColor: "#3b82f6",
    backgroundColor: "#ffffff",
    loaded: false
  },
  lifetimes: {
    attached: function() {
      this.loadTabConfig();
    },
    ready: function() {
      // 在组件在视图层布局完成后执行
      this.updateCurrentTab();
    }
  },
  pageLifetimes: {
    show: function() {
      this.updateCurrentTab();
    }
  },
  methods: {
    // 加载TabBar配置
    loadTabConfig: function() {
      const app = getApp();
      console.log('加载TabBar配置');
      
      // 静态TabBar配置
      const staticConfig = [
        {
          "pagePath": "pages/home/index",
          "text": "首页",
          "iconClass": "icon-home",
          "selectedIconClass": "icon-home-active"
        },
        {
          "pagePath": "pages/mbti_personality/index",
          "text": "MBTI测试",
          "iconClass": "icon-mbti",
          "selectedIconClass": "icon-mbti-active"
        },
        {
          "pagePath": "pages/mental_test/index",
          "text": "心理测试",
          "iconClass": "icon-mental",
          "selectedIconClass": "icon-mental-active"
        },
        {
          "pagePath": "pages/user_profile/index",
          "text": "我的",
          "iconClass": "icon-user",
          "selectedIconClass": "icon-user-active"
        }
      ];
      
      // 首先尝试获取本地缓存的配置
      const cachedConfig = wx.getStorageSync('tabConfig');
      // 暂时注释掉缓存逻辑，强制使用静态配置
      /*
      if (cachedConfig && cachedConfig.length > 0) {
        console.log('自定义TabBar从本地缓存加载配置');
        // 使用缓存配置
        app.globalData.tabConfig = cachedConfig;
        this.setData({
          tabConfig: cachedConfig,
          loaded: true
        });
      } else {
      */
        // 使用静态配置
        console.log('使用静态TabBar配置');
        app.globalData.tabConfig = staticConfig;
        // 保存到本地缓存
        wx.setStorageSync('tabConfig', staticConfig);
        
        this.setData({
          tabConfig: staticConfig,
          loaded: true
        });
      // }
      
      // 更新当前选中的Tab
      setTimeout(() => {
        this.updateCurrentTab();
      }, 100);
      
      // 尝试调用云函数获取最新配置
      try {
        wx.cloud.callFunction({
          name: 'getTabConfig',
          data: { timestamp: new Date().getTime() },
          success: res => {
            console.log('自定义TabBar获取配置结果:', JSON.stringify(res.result));
            if (res.result && res.result.code === 0 && res.result.data && res.result.data.length > 0) {
              app.globalData.tabConfig = res.result.data;
              // 保存到本地缓存
              wx.setStorageSync('tabConfig', res.result.data);
              
              this.setData({
                tabConfig: res.result.data
              });
              
              // 更新当前选中的Tab
              this.updateCurrentTab();
            }
          },
          fail: err => {
            console.log('调用云函数失败，使用本地配置:', err);
          }
        });
      } catch (error) {
        console.log('云函数调用异常，使用本地配置:', error);
      }
    },
    // 更新当前选中的TabBar项
    updateCurrentTab: function() {
      const pages = getCurrentPages();
      const current = pages[pages.length - 1];
      if (!current) return;
      
      const route = current.route;
      console.log('TabBar匹配 - 当前页面路径:', route);
      
      // 查找当前页面在tabConfig中的索引
      const tabConfig = this.data.tabConfig;
      console.log('TabBar匹配 - 配置:', tabConfig.map(item => item.pagePath));
      
      for (let i = 0; i < tabConfig.length; i++) {
        const path = tabConfig[i].pagePath;
        console.log(`TabBar匹配 - 检查索引${i}: ${path} vs ${route}`);
        // 考虑到pagePath可能带不带前导"/"
        if (path === route || path === `/${route}` || `/${path}` === route) {
          console.log(`TabBar匹配 - 匹配成功，设置索引为: ${i}`);
          this.setData({ selected: i });
          break;
        }
      }
      console.log('TabBar匹配 - 最终选中索引:', this.data.selected);
    },
    // 切换TabBar
    switchTab(e) {
      const dataset = e.currentTarget.dataset;
      const index = dataset.index;
      const tabItem = this.data.tabConfig[index];
      
      // 如果点击的是当前页，不做任何操作
      if (this.data.selected === index) return;
      
      // 切换到对应页面
      wx.switchTab({
        url: `/${tabItem.pagePath}`
      });
    }
  }
}); 