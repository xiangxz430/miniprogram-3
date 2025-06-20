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
      
      // 首先使用静态配置确保TabBar立即显示
      console.log('使用静态TabBar配置');
      app.globalData.tabConfig = staticConfig;
      // 保存到本地缓存
      wx.setStorageSync('tabConfig', staticConfig);
      
      this.setData({
        tabConfig: staticConfig,
        loaded: true
      }, () => {
        // 配置更新后立即更新样式和选中状态
        this.updateTabBarStyle();
        this.updateCurrentTab();
      });
      
      // 尝试调用云函数获取最新配置
      try {
        wx.cloud.callFunction({
          name: 'getTabConfig',
          data: { timestamp: new Date().getTime() },
          success: res => {
            console.log('自定义TabBar获取配置结果:', JSON.stringify(res.result));
            if (res.result && res.result.code === 0 && res.result.data && res.result.data.length > 0) {
              console.log('从云端获取到新的TabBar配置，开始更新');
              
              // 处理云端配置，确保必要字段存在
              const cloudConfig = res.result.data.map(item => ({
                pagePath: item.pagePath,
                text: item.text,
                iconClass: item.iconClass || this.getDefaultIconClass(item.pagePath),
                selectedIconClass: item.selectedIconClass || this.getDefaultSelectedIconClass(item.pagePath),
                // 支持动态颜色配置
                color: item.color || "#94a3b8",
                selectedColor: item.selectedColor || "#3b82f6"
              }));
              
              app.globalData.tabConfig = cloudConfig;
              // 保存到本地缓存
              wx.setStorageSync('tabConfig', cloudConfig);
              
              this.setData({
                tabConfig: cloudConfig,
                // 如果云端配置包含颜色设置，应用它们
                color: cloudConfig[0]?.color || "#94a3b8",
                selectedColor: cloudConfig[0]?.selectedColor || "#3b82f6"
              }, () => {
                // 配置更新后立即更新样式和选中状态
                console.log('云端配置已应用，更新TabBar样式');
                this.updateTabBarStyle();
                this.updateCurrentTab();
              });
            }
          },
          fail: err => {
            console.log('调用云函数失败，继续使用本地配置:', err);
          }
        });
      } catch (error) {
        console.log('云函数调用异常，继续使用本地配置:', error);
      }
    },

    // 获取默认图标类名
    getDefaultIconClass: function(pagePath) {
      const iconMap = {
        'pages/home/index': 'icon-home',
        'pages/mbti_personality/index': 'icon-mbti', 
        'pages/mental_test/index': 'icon-mental',
        'pages/user_profile/index': 'icon-user'
      };
      return iconMap[pagePath] || 'icon-home';
    },

    // 获取默认选中图标类名
    getDefaultSelectedIconClass: function(pagePath) {
      const selectedIconMap = {
        'pages/home/index': 'icon-home-active',
        'pages/mbti_personality/index': 'icon-mbti-active',
        'pages/mental_test/index': 'icon-mental-active', 
        'pages/user_profile/index': 'icon-user-active'
      };
      return selectedIconMap[pagePath] || 'icon-home-active';
    },

    // 更新TabBar样式
    updateTabBarStyle: function() {
      console.log('开始更新TabBar样式');
      const { color, selectedColor, backgroundColor } = this.data;
      
      // 应用全局样式变量（通过CSS自定义属性）
      if (typeof wx.setTabBarStyle === 'function') {
        wx.setTabBarStyle({
          color: color,
          selectedColor: selectedColor,
          backgroundColor: backgroundColor,
          success: () => {
            console.log('TabBar全局样式更新成功');
          },
          fail: (err) => {
            console.log('TabBar全局样式更新失败:', err);
          }
        });
      }
      
      // 强制重新渲染组件
      this.setData({
        color: color,
        selectedColor: selectedColor,
        backgroundColor: backgroundColor
      });
      
      console.log('TabBar样式更新完成');
    },
    
    // 更新当前选中的TabBar项
    updateCurrentTab: function() {
      const pages = getCurrentPages();
      const current = pages[pages.length - 1];
      if (!current) {
        console.log('TabBar匹配 - 无法获取当前页面');
        return;
      }
      
      const route = current.route;
      console.log('TabBar匹配 - 当前页面路径:', route);
      
      // 查找当前页面在tabConfig中的索引
      const tabConfig = this.data.tabConfig;
      if (!tabConfig || tabConfig.length === 0) {
        console.log('TabBar匹配 - TabBar配置为空');
        return;
      }
      
      console.log('TabBar匹配 - 配置:', tabConfig.map(item => item.pagePath));
      
      let matchedIndex = -1;
      
      // 改进的路径匹配逻辑
      for (let i = 0; i < tabConfig.length; i++) {
        const configPath = tabConfig[i].pagePath;
        console.log(`TabBar匹配 - 检查索引${i}: ${configPath} vs ${route}`);
        
        // 标准化路径比较（移除前导斜杠）
        const normalizedRoute = route.replace(/^\/+/, '');
        const normalizedConfigPath = configPath.replace(/^\/+/, '');
        
        if (normalizedRoute === normalizedConfigPath) {
          console.log(`TabBar匹配 - 精确匹配成功，设置索引为: ${i}`);
          matchedIndex = i;
          break;
        }
      }
      
      // 如果精确匹配失败，尝试模糊匹配
      if (matchedIndex === -1) {
        console.log('TabBar匹配 - 精确匹配失败，尝试模糊匹配');
        for (let i = 0; i < tabConfig.length; i++) {
          const configPath = tabConfig[i].pagePath;
          
          // 提取页面名称进行匹配
          const routePageName = route.split('/').pop();
          const configPageName = configPath.split('/').pop();
          
          if (routePageName === configPageName || 
              route.includes(configPath) || 
              configPath.includes(route)) {
            console.log(`TabBar匹配 - 模糊匹配成功，设置索引为: ${i}`);
            matchedIndex = i;
            break;
          }
        }
      }
      
      // 如果找到匹配的索引，更新选中状态
      if (matchedIndex !== -1) {
        if (matchedIndex !== this.data.selected) {
          console.log(`TabBar匹配 - 更新选中状态: ${this.data.selected} -> ${matchedIndex}`);
          this.setData({ 
            selected: matchedIndex 
          }, () => {
            console.log('TabBar选中状态已更新:', this.data.selected);
            // 应用选中状态的样式变化
            this.applySelectedStyle();
          });
        } else {
          console.log('TabBar匹配 - 选中状态无需更新');
        }
      } else {
        console.log('TabBar匹配 - 未找到匹配的页面路径');
      }
      
      console.log('TabBar匹配 - 最终选中索引:', this.data.selected);
    },

    // 应用选中状态的样式
    applySelectedStyle: function() {
      console.log('应用TabBar选中状态样式，当前选中索引:', this.data.selected);
      
      // 强制重新渲染组件，确保样式变化生效
      const { selected, tabConfig, color, selectedColor } = this.data;
      
      // 添加样式更新动画类
      this.setData({
        styleUpdating: true
      });
      
      // 短暂延迟后移除动画类，并强制更新样式
      setTimeout(() => {
        this.setData({
          styleUpdating: false,
          // 强制触发样式重新计算
          selected: selected,
          color: color,
          selectedColor: selectedColor
        }, () => {
          console.log('TabBar样式更新完成');
        });
      }, 300);
    },

    // 切换TabBar
    switchTab(e) {
      const dataset = e.currentTarget.dataset;
      const index = dataset.index;
      const tabItem = this.data.tabConfig[index];
      
      // 如果点击的是当前页，不做任何操作
      if (this.data.selected === index) return;
      
      console.log(`TabBar切换: 从索引${this.data.selected}切换到索引${index}`);
      
      // 先更新选中状态，但不立即触发样式更新
      const oldSelected = this.data.selected;
      this.setData({
        selected: index
      }, () => {
        console.log('TabBar选中状态已更新，开始页面切换');
        
        // 切换到对应页面
        wx.switchTab({
          url: `/${tabItem.pagePath}`,
          success: () => {
            console.log(`TabBar切换成功: ${tabItem.pagePath}`);
            // 页面切换成功后，确保样式状态正确
            setTimeout(() => {
              this.applySelectedStyle();
            }, 100);
          },
          fail: (err) => {
            console.error(`TabBar切换失败: ${tabItem.pagePath}`, err);
            // 如果切换失败，恢复原来的选中状态
            this.setData({
              selected: oldSelected
            }, () => {
              console.log('TabBar状态已恢复');
            });
          }
        });
      });
    }
  }
}); 