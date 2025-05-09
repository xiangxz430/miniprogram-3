const logger = require('../../utils/logger');

Page({
  data: {
    logFiles: [],
    selectedLog: '',
    logContent: '',
    isLoading: false
  },

  onLoad: function() {
    this.loadLogFiles();
  },

  // 加载日志文件列表
  loadLogFiles: function() {
    this.setData({
      isLoading: true
    });
    
    try {
      const logFiles = logger.getLogFiles();
      // 按日期降序排列
      logFiles.sort((a, b) => {
        const dateA = a.match(/api_log_(\d{8})\.log/)[1];
        const dateB = b.match(/api_log_(\d{8})\.log/)[1];
        return dateB - dateA;
      });
      
      this.setData({
        logFiles: logFiles,
        isLoading: false
      });
      
      // 默认选中最新的日志
      if (logFiles.length > 0) {
        this.selectLog(logFiles[0]);
      }
    } catch (e) {
      wx.showToast({
        title: '加载日志文件失败',
        icon: 'none'
      });
      this.setData({
        isLoading: false
      });
    }
  },

  // 选择日志文件
  selectLog: function(fileName) {
    if (typeof fileName === 'object') {
      // 事件触发
      fileName = fileName.currentTarget.dataset.file;
    }
    
    this.setData({
      isLoading: true,
      selectedLog: fileName
    });
    
    try {
      const content = logger.readLogFile(fileName);
      this.setData({
        logContent: content,
        isLoading: false
      });
    } catch (e) {
      wx.showToast({
        title: '读取日志内容失败',
        icon: 'none'
      });
      this.setData({
        logContent: '读取失败: ' + e.message,
        isLoading: false
      });
    }
  },

  // 清理过期日志
  cleanOldLogs: function() {
    wx.showModal({
      title: '确认清理',
      content: '确定要清理7天前的日志吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            logger.cleanOldLogs();
            this.loadLogFiles();
            wx.showToast({
              title: '清理完成',
              icon: 'success'
            });
          } catch (e) {
            wx.showToast({
              title: '清理失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 刷新日志
  refreshLogs: function() {
    this.loadLogFiles();
  },

  // 复制日志内容
  copyLogContent: function() {
    wx.setClipboardData({
      data: this.data.logContent,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        });
      }
    });
  },

  // 格式化日期
  formatDate: function(fileName) {
    const match = fileName.match(/api_log_(\d{4})(\d{2})(\d{2})\.log/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return fileName;
  }
}); 