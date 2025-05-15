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
      // 首次加载时使用全局配置或调用云函数获取
      if (app.globalData.tabConfig && app.globalData.tabConfig.length > 0) {
        console.log('自定义TabBar从全局加载配置:', JSON.stringify(app.globalData.tabConfig));
        this.setData({
          tabConfig: app.globalData.tabConfig,
          loaded: true
        });
      } else {
        console.log('自定义TabBar从云函数加载配置');
        wx.cloud.callFunction({
          name: 'getTabConfig',
          data: { timestamp: new Date().getTime() },
          success: res => {
            console.log('自定义TabBar获取配置结果:', JSON.stringify(res.result));
            if (res.result && res.result.code === 0 && res.result.data) {
              app.globalData.tabConfig = res.result.data;
              this.setData({
                tabConfig: res.result.data,
                loaded: true
              });
            } else {
              console.error('获取TabBar配置失败:', res.result);
              // 设置默认配置
              const defaultConfig = [
                {
                  index: 0,
                  pagePath: 'pages/daily_hexagram/index',
                  text: '每日一挂',
                  iconPath: 'images/icons/hexagram.png',
                  selectedIconPath: 'images/icons/hexagram.png'
                },
                {
                  index: 2,
                  pagePath: 'pages/user_profile/index',
                  text: '我的',
                  iconPath: 'images/icons/user.png',
                  selectedIconPath: 'images/icons/user.png'
                }
              ];
              this.setData({
                tabConfig: defaultConfig,
                loaded: true
              });
            }
          },
          fail: err => {
            console.error('调用云函数失败:', err);
            // 设置默认配置
            const defaultConfig = [
              {
                index: 0,
                pagePath: 'pages/daily_hexagram/index',
                text: '每日一挂',
                iconPath: 'images/icons/hexagram.png',
                selectedIconPath: 'images/icons/hexagram.png'
              },
              {
                index: 2,
                pagePath: 'pages/user_profile/index',
                text: '我的',
                iconPath: 'images/icons/user.png',
                selectedIconPath: 'images/icons/user.png'
              }
            ];
            this.setData({
              tabConfig: defaultConfig,
              loaded: true
            });
          }
        });
      }
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