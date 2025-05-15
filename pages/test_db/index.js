// 测试数据库连接页面
Page({
  data: {
    testResult: null,
    tabConfig: null,
    loading: false,
    logs: []
  },

  onLoad: function() {
    this.addLog('页面加载完成');
  },

  // 添加日志
  addLog: function(text) {
    const logs = this.data.logs;
    const timestamp = new Date().toLocaleTimeString();
    logs.push(`[${timestamp}] ${text}`);
    this.setData({ logs });
  },

  // 测试数据库连接
  testDBConnection: function() {
    this.setData({ 
      loading: true,
      testResult: null
    });
    this.addLog('开始测试数据库连接...');

    wx.cloud.callFunction({
      name: 'testDBConnection',
      success: res => {
        this.addLog('调用成功: ' + JSON.stringify(res.result));
        this.setData({
          testResult: res.result,
          loading: false
        });
      },
      fail: err => {
        this.addLog('调用失败: ' + JSON.stringify(err));
        this.setData({ 
          loading: false
        });
      }
    });
  },

  // 测试获取tab配置
  testGetTabConfig: function() {
    this.setData({ 
      loading: true,
      tabConfig: null
    });
    this.addLog('开始获取tab配置...');

    wx.cloud.callFunction({
      name: 'getTabConfig',
      success: res => {
        this.addLog('获取成功: ' + JSON.stringify(res.result));
        this.setData({
          tabConfig: res.result,
          loading: false
        });
      },
      fail: err => {
        this.addLog('获取失败: ' + JSON.stringify(err));
        this.setData({ 
          loading: false
        });
      }
    });
  },

  // 清空日志
  clearLogs: function() {
    this.setData({ logs: [] });
  }
}); 