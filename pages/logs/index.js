const logger = require('../../utils/logger');
const { getHexagramInterpretation } = require('../../utils/deepseekApi.js');

Page({
  data: {
    logFiles: [],
    selectedLog: '',
    logContent: '',
    isLoading: false,
    logDir: ''
  },

  onLoad: function() {
    this.loadLogFiles();
    // DeepSeek API 测试
    const testHexagram = {
      name: '乾卦',
      symbol: '䷀',
      description: '天天乾 • 刚健中正'
    };
    const userInfo = {
      name: '测试用户',
      birthdate: '1990-01-01'
    };
    getHexagramInterpretation(testHexagram, userInfo).then(res => {
      console.log('DeepSeek API 测试结果：', res);
      wx.showModal({
        title: 'DeepSeek API 测试',
        content: JSON.stringify(res).substring(0, 200)
      });
    }).catch(err => {
      wx.showModal({
        title: 'DeepSeek API 测试失败',
        content: JSON.stringify(err)
      });
    });
  },

  // 加载日志文件列表
  loadLogFiles: function() {
    this.setData({
      isLoading: true
    });
    
    try {
      const logFiles = logger.getLogFiles();
      
      // 按日期降序排列，特殊处理api_log.txt文件
      logFiles.sort((a, b) => {
        if (a === 'api_log.txt') return -1; // 备用日志文件排在最前面
        if (b === 'api_log.txt') return 1;
        
        const dateA = a.match(/api_log_(\d{8})\.log/);
        const dateB = b.match(/api_log_(\d{8})\.log/);
        
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        return dateB[1] - dateA[1];
      });
      
      this.setData({
        logFiles: logFiles,
        isLoading: false,
        logDir: logger.logDir || wx.env.USER_DATA_PATH
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
      console.error('加载日志文件列表失败:', e);
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
        logContent: content || '日志内容为空',
        isLoading: false
      });
    } catch (e) {
      wx.showToast({
        title: '读取日志内容失败',
        icon: 'none'
      });
      console.error('读取日志内容失败:', e);
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
            console.error('清理日志失败:', e);
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
    // 处理备用日志文件
    if (fileName === 'api_log.txt') {
      return '备用日志';
    }
    
    const match = fileName.match(/api_log_(\d{4})(\d{2})(\d{2})\.log/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return fileName;
  },
  
  // 显示日志存储路径
  showLogPath: function() {
    wx.showModal({
      title: '日志存储路径',
      content: this.data.logDir || '未知',
      showCancel: false
    });
  }
}); 