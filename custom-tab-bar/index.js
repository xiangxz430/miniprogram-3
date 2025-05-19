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
      console.log('自定义TabBar从云函数加载配置');
      
      // 首先尝试获取本地缓存的配置
      const cachedConfig = wx.getStorageSync('tabConfig');
      if (cachedConfig && cachedConfig.length > 0) {
        console.log('自定义TabBar从本地缓存加载配置:', JSON.stringify(cachedConfig));
        // 使用缓存配置
        app.globalData.tabConfig = cachedConfig;
        this.setData({
          tabConfig: cachedConfig,
          loaded: cachedConfig.length > 0 // 仅当有效配置不为空数组时才显示TabBar
        });
      } else {
        // 如果没有缓存，确保不显示TabBar
        this.setData({
          tabConfig: [],
          loaded: false
        });
      }
      
      // 无论是否有缓存，都调用云函数获取最新配置
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
              tabConfig: res.result.data,
              loaded: true // 设置为已加载
            });
            
            // 更新当前选中的Tab
            setTimeout(() => {
              this.updateCurrentTab();
            }, 100);
          } else {
            console.error('获取TabBar配置失败或配置为空:', res.result);
            // 清空配置和缓存
            app.globalData.tabConfig = [];
            wx.setStorageSync('tabConfig', []);
            this.setData({
              tabConfig: [],
              loaded: false // 设置为未加载，不显示TabBar
            });
          }
        },
        fail: err => {
          console.error('调用云函数失败:', err);
          // 调用失败时，清空配置和缓存
          app.globalData.tabConfig = [];
          wx.setStorageSync('tabConfig', []);
          this.setData({
            tabConfig: [],
            loaded: false // 设置为未加载，不显示TabBar
          });
          
          // 显示错误提示
          wx.showToast({
            title: '加载TabBar失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    },
    // 更新当前选中的TabBar项
    updateCurrentTab: function() {
      const pages = getCurrentPages();
      const current = pages[pages.length - 1];
      const route = current.route;
      
      // 查找当前页面在tabConfig中的索引
      const tabConfig = this.data.tabConfig;
      for (let i = 0; i < tabConfig.length; i++) {
        const path = tabConfig[i].pagePath;
        // 考虑到pagePath可能带不带前导"/"
        if (path === route || path === `/${route}` || `/${path}` === route) {
          this.setData({ selected: i });
          break;
        }
      }
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