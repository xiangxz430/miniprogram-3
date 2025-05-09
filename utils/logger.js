const fs = wx.getFileSystemManager();

/**
 * 日志记录类
 */
class Logger {
  constructor() {
    this.logDir = `${wx.env.USER_DATA_PATH}/logs`;
    this.initLogDir();
    this.currentDate = this.getDateString();
    this.logFile = `${this.logDir}/api_log_${this.currentDate}.log`;
  }

  /**
   * 初始化日志目录
   */
  initLogDir() {
    try {
      try {
        fs.accessSync(this.logDir);
      } catch (e) {
        fs.mkdirSync(this.logDir, true);
      }
    } catch (e) {
      console.error('创建日志目录失败:', e);
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

      // 将日志写入文件
      fs.appendFileSync(this.logFile, content, 'utf8');
      
      // 同时输出到控制台
      console.log(`[${type}] ${time}`);
      console.log(data);
      console.log('--------------------------------------------------');
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
      return fs.readdirSync(this.logDir).filter(file => file.startsWith('api_log_'));
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
      const filePath = `${this.logDir}/${fileName}`;
      return fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      console.error('读取日志文件失败:', e);
      return '';
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
        const dateMatch = file.match(/api_log_(\d{8})\.log/);
        if (dateMatch && dateMatch[1] < sevenDaysAgoStr) {
          fs.unlinkSync(`${this.logDir}/${file}`);
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