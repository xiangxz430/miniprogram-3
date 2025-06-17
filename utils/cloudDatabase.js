/**
 * 云数据库操作工具类
 * 用于管理用户信息、好友列表和伏羲历史记录
 */

class CloudDatabase {
  
  // ==================== 用户信息管理 ====================
  
  /**
   * 获取用户信息
   */
  static async getUserInfo() {
    try {
      const result = await wx.cloud.callFunction({
        name: 'userManager',
        data: {
          action: 'getUserInfo'
        }
      });
      return result.result;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return {
        code: -1,
        message: '获取用户信息失败: ' + error.message,
        data: null
      };
    }
  }

  /**
   * 更新用户信息
   * @param {Object} userInfo 用户信息对象
   */
  static async updateUserInfo(userInfo) {
    try {
      const result = await wx.cloud.callFunction({
        name: 'userManager',
        data: {
          action: 'updateUserInfo',
          data: userInfo
        }
      });
      return result.result;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      return {
        code: -1,
        message: '更新用户信息失败: ' + error.message,
        data: null
      };
    }
  }

  /**
   * 创建用户档案
   * @param {Object} userInfo 用户信息对象
   */
  static async createUserProfile(userInfo) {
    try {
      const result = await wx.cloud.callFunction({
        name: 'userManager',
        data: {
          action: 'createUserProfile',
          data: userInfo
        }
      });
      return result.result;
    } catch (error) {
      console.error('创建用户档案失败:', error);
      return {
        code: -1,
        message: '创建用户档案失败: ' + error.message,
        data: null
      };
    }
  }

  // ==================== 好友列表管理 ====================

  /**
   * 获取好友列表
   */
  static async getFriendsList() {
    try {
      const result = await wx.cloud.callFunction({
        name: 'userManager',
        data: {
          action: 'getFriendsList'
        }
      });
      return result.result;
    } catch (error) {
      console.error('获取好友列表失败:', error);
      return {
        code: -1,
        message: '获取好友列表失败: ' + error.message,
        data: null
      };
    }
  }

  /**
   * 添加好友
   * @param {string} friendOpenid 好友的openid
   * @param {Object} friendInfo 好友信息
   */
  static async addFriend(friendOpenid, friendInfo) {
    try {
      const result = await wx.cloud.callFunction({
        name: 'userManager',
        data: {
          action: 'addFriend',
          data: {
            friendOpenid,
            friendInfo
          }
        }
      });
      return result.result;
    } catch (error) {
      console.error('添加好友失败:', error);
      return {
        code: -1,
        message: '添加好友失败: ' + error.message,
        data: null
      };
    }
  }

  /**
   * 移除好友
   * @param {string} friendOpenid 好友的openid
   */
  static async removeFriend(friendOpenid) {
    try {
      const result = await wx.cloud.callFunction({
        name: 'userManager',
        data: {
          action: 'removeFriend',
          data: {
            friendOpenid
          }
        }
      });
      return result.result;
    } catch (error) {
      console.error('移除好友失败:', error);
      return {
        code: -1,
        message: '移除好友失败: ' + error.message,
        data: null
      };
    }
  }

  /**
   * 更新好友信息
   * @param {string} friendOpenid 好友的openid
   * @param {Object} friendInfo 好友信息
   */
  static async updateFriendInfo(friendOpenid, friendInfo) {
    try {
      const result = await wx.cloud.callFunction({
        name: 'userManager',
        data: {
          action: 'updateFriendInfo',
          data: {
            friendOpenid,
            friendInfo
          }
        }
      });
      return result.result;
    } catch (error) {
      console.error('更新好友信息失败:', error);
      return {
        code: -1,
        message: '更新好友信息失败: ' + error.message,
        data: null
      };
    }
  }

  // ==================== 伏羲历史记录管理 ====================

  /**
   * 获取伏羲历史记录
   * @param {number} page 页码，默认为1
   * @param {number} limit 每页数量，默认为20
   */
  static async getFuxiHistory(page = 1, limit = 20) {
    try {
      const result = await wx.cloud.callFunction({
        name: 'userManager',
        data: {
          action: 'getFuxiHistory',
          data: {
            page,
            limit
          }
        }
      });
      return result.result;
    } catch (error) {
      console.error('获取伏羲历史记录失败:', error);
      return {
        code: -1,
        message: '获取伏羲历史记录失败: ' + error.message,
        data: null
      };
    }
  }

  /**
   * 保存伏羲记录
   * @param {Object} record 伏羲记录对象
   */
  static async saveFuxiRecord(record) {
    try {
      const result = await wx.cloud.callFunction({
        name: 'userManager',
        data: {
          action: 'saveFuxiRecord',
          data: {
            record
          }
        }
      });
      return result.result;
    } catch (error) {
      console.error('保存伏羲记录失败:', error);
      return {
        code: -1,
        message: '保存伏羲记录失败: ' + error.message,
        data: null
      };
    }
  }

  /**
   * 删除伏羲记录
   * @param {string} recordId 记录ID
   */
  static async deleteFuxiRecord(recordId) {
    try {
      const result = await wx.cloud.callFunction({
        name: 'userManager',
        data: {
          action: 'deleteFuxiRecord',
          data: {
            recordId
          }
        }
      });
      return result.result;
    } catch (error) {
      console.error('删除伏羲记录失败:', error);
      return {
        code: -1,
        message: '删除伏羲记录失败: ' + error.message,
        data: null
      };
    }
  }

  /**
   * 获取伏羲记录详情
   * @param {string} recordId 记录ID
   */
  static async getFuxiRecordDetail(recordId) {
    try {
      const result = await wx.cloud.callFunction({
        name: 'userManager',
        data: {
          action: 'getFuxiRecordDetail',
          data: {
            recordId
          }
        }
      });
      return result.result;
    } catch (error) {
      console.error('获取伏羲记录详情失败:', error);
      return {
        code: -1,
        message: '获取伏羲记录详情失败: ' + error.message,
        data: null
      };
    }
  }

  // ==================== 便捷方法 ====================

  /**
   * 初始化用户（如果用户不存在则创建）
   * @param {Object} userInfo 用户信息
   */
  static async initUser(userInfo) {
    try {
      // 先尝试获取用户信息
      const getUserResult = await this.getUserInfo();
      
      if (getUserResult.code === 1) {
        // 用户不存在，创建新用户
        console.log('用户不存在，创建新用户档案');
        return await this.createUserProfile(userInfo);
      } else if (getUserResult.code === 0) {
        // 用户已存在，更新信息
        console.log('用户已存在，更新用户信息');
        return await this.updateUserInfo(userInfo);
      } else {
        return getUserResult;
      }
    } catch (error) {
      console.error('初始化用户失败:', error);
      return {
        code: -1,
        message: '初始化用户失败: ' + error.message,
        data: null
      };
    }
  }

  /**
   * 保存MBTI测试结果到用户档案
   * @param {Object} mbtiResult MBTI测试结果
   */
  static async saveMbtiResult(mbtiResult) {
    try {
      const updateData = {
        mbtiType: mbtiResult.type,
        lastMbtiTest: new Date(),
        mbtiResult: mbtiResult
      };

      return await this.updateUserInfo(updateData);
    } catch (error) {
      console.error('保存MBTI测试结果失败:', error);
      return {
        code: -1,
        message: '保存MBTI测试结果失败: ' + error.message,
        data: null
      };
    }
  }

  /**
   * 保存心理健康测试结果到用户档案
   * @param {Object} mentalHealthResult 心理健康测试结果
   */
  static async saveMentalHealthResult(mentalHealthResult) {
    try {
      const updateData = {
        mentalHealthScore: mentalHealthResult.totalScore,
        lastMentalHealthTest: new Date(),
        mentalHealthResult: mentalHealthResult
      };

      return await this.updateUserInfo(updateData);
    } catch (error) {
      console.error('保存心理健康测试结果失败:', error);
      return {
        code: -1,
        message: '保存心理健康测试结果失败: ' + error.message,
        data: null
      };
    }
  }
}

module.exports = CloudDatabase; 