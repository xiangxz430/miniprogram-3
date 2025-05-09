const fs = wx.getFileSystemManager();

/**
 * 日志记录类
 */
class Logger {
  constructor() {
    // 确保使用wx.env.USER_DATA_PATH作为基础路径
    this.logDir = `${wx.env.USER_DATA_PATH}/logs`;
    this.initLogDir();
    this.currentDate = this.getDateString();
    this.logFile = `${this.logDir}/api_log_${this.currentDate}.log`;
    
    // 测试目录是否可写
    this.testWritePermission();
  }

  /**
   * 测试目录是否可写
   */
  testWritePermission() {
    try {
      const testFile = `${this.logDir}/test_write.txt`;
      fs.writeFileSync(testFile, 'test write permission', 'utf8');
      fs.unlinkSync(testFile);
      console.log('日志目录写入权限正常');
    } catch (e) {
      console.error('日志目录写入测试失败:', e);
      // 尝试使用备用路径
      this.logDir = `${wx.env.USER_DATA_PATH}`;
      this.logFile = `${this.logDir}/api_log_${this.currentDate}.log`;
      console.log('使用备用日志路径:', this.logDir);
    }
  }

  /**
   * 初始化日志目录
   */
  initLogDir() {
    try {
      try {
        fs.accessSync(this.logDir);
        console.log('日志目录已存在:', this.logDir);
      } catch (e) {
        console.log('创建日志目录:', this.logDir);
        fs.mkdirSync(this.logDir, true);
      }
    } catch (e) {
      console.error('创建日志目录失败:', e);
      // 如果创建目录失败，使用根目录
      this.logDir = wx.env.USER_DATA_PATH;
      console.log('改用根目录作为日志目录:', this.logDir);
    }
  }

  /**
   * 获取当前日期字符串
   */
  getDateString() {
    const date = new Date();
    return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  }

  /**
   * 获取当前时间字符串
   */
  getTimeString() {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
  }

  /**
   * 写入日志
   * @param {String} type - 日志类型 
   * @param {any} data - 日志数据
   */
  log(type, data) {
    try {
      // 检查日期是否变更，如果变更则更新日志文件名
      const currentDate = this.getDateString();
      if (currentDate !== this.currentDate) {
        this.currentDate = currentDate;
        this.logFile = `${this.logDir}/api_log_${this.currentDate}.log`;
      }

      const time = this.getTimeString();
      let content = `[${time}] [${type}]\n`;

      if (typeof data === 'object') {
        try {
          content += JSON.stringify(data, null, 2);
        } catch (e) {
          content += String(data);
        }
      } else {
        content += String(data);
      }
      content += '\n--------------------------------------------------\n';

      // 输出到控制台
      console.log(`[${type}] ${time}`);
      console.log(data);
      console.log('--------------------------------------------------');

      try {
        // 将日志写入文件
        fs.appendFileSync(this.logFile, content, 'utf8');
      } catch (writeError) {
        console.error('写入日志文件失败:', writeError);
        // 尝试使用备用文件名
        try {
          const backupFile = `${wx.env.USER_DATA_PATH}/api_log.txt`;
          fs.appendFileSync(backupFile, content, 'utf8');
          console.log('已写入备用日志文件:', backupFile);
        } catch (backupError) {
          console.error('写入备用日志文件也失败:', backupError);
        }
      }
    } catch (e) {
      console.error('写入日志失败:', e);
    }
  }

  /**
   * 记录请求日志
   * @param {Object} data - 请求数据
   */
  logRequest(data) {
    this.log('API请求', data);
  }

  /**
   * 记录响应日志
   * @param {Object} data - 响应数据
   */
  logResponse(data) {
    this.log('API响应', data);
  }

  /**
   * 记录错误日志
   * @param {Object} data - 错误数据
   */
  logError(data) {
    this.log('错误', data);
  }

  /**
   * 获取所有日志文件
   * @returns {Array} 日志文件列表
   */
  getLogFiles() {
    try {
      let files = [];
      try {
        // 尝试读取日志目录
        files = fs.readdirSync(this.logDir);
      } catch (e) {
        console.error('读取日志目录失败:', e);
        // 如果读取失败，尝试读取根目录
        files = fs.readdirSync(wx.env.USER_DATA_PATH);
      }
      
      // 过滤出api_log开头的文件
      return files.filter(file => file.startsWith('api_log'));
    } catch (e) {
      console.error('获取日志文件失败:', e);
      return [];
    }
  }

  /**
   * 读取指定日志文件内容
   * @param {String} fileName - 文件名
   * @returns {String} 文件内容
   */
  readLogFile(fileName) {
    try {
      // 尝试从日志目录读取
      let filePath = `${this.logDir}/${fileName}`;
      try {
        return fs.readFileSync(filePath, 'utf8');
      } catch (e) {
        // 如果读取失败，尝试从根目录读取
        filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
        return fs.readFileSync(filePath, 'utf8');
      }
    } catch (e) {
      console.error('读取日志文件失败:', e);
      return '读取日志文件失败: ' + e.message;
    }
  }

  /**
   * 清除过期日志（保留最近7天的日志）
   */
  cleanOldLogs() {
    try {
      const files = this.getLogFiles();
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const sevenDaysAgoStr = `${sevenDaysAgo.getFullYear()}${(sevenDaysAgo.getMonth() + 1).toString().padStart(2, '0')}${sevenDaysAgo.getDate().toString().padStart(2, '0')}`;

      files.forEach(file => {
        const dateMatch = file.match(/api_log_(\d{8})\.log/) || file.match(/api_log\.txt/);
        if (dateMatch && dateMatch[1] < sevenDaysAgoStr) {
          try {
            // 尝试从日志目录删除
            fs.unlinkSync(`${this.logDir}/${file}`);
          } catch (e) {
            // 如果删除失败，尝试从根目录删除
            try {
              fs.unlinkSync(`${wx.env.USER_DATA_PATH}/${file}`);
            } catch (e2) {
              console.error('删除日志文件失败:', file, e2);
            }
          }
        }
      });
    } catch (e) {
      console.error('清除过期日志失败:', e);
    }
  }
}

// 创建单例
const logger = new Logger();

module.exports = logger; 