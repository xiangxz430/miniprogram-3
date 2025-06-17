// 云函数：用户管理
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-3go3cn2v0cb22666'  // 使用具体的环境ID
})

const db = cloud.database()
const _ = db.command

// 确保集合存在的函数
async function ensureCollectionExists(collectionName) {
  try {
    // 尝试获取集合信息，如果不存在会抛出错误
    await db.collection(collectionName).limit(1).get()
    console.log(`集合 ${collectionName} 已存在`)
    return true
  } catch (error) {
    if (error.errCode === -502005 || error.message.includes('collection not exists')) {
      console.log(`集合 ${collectionName} 不存在，尝试创建...`)
      try {
        // 创建集合（通过插入一个临时文档然后删除）
        const result = await db.collection(collectionName).add({
          data: {
            _temp: true,
            createTime: new Date()
          }
        })
        
      
        console.log(`集合 ${collectionName} 创建成功`)
        return true
      } catch (createError) {
        console.error(`创建集合 ${collectionName} 失败:`, createError)
        return false
      }
    } else {
      console.error(`检查集合 ${collectionName} 时发生错误:`, error)
      return false
    }
  }
}

exports.main = async (event, context) => {
  const { action, data = {} } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  console.log('云函数被调用，action:', action, 'openid:', openid)

  try {
    // 根据操作类型确保对应集合存在
    let collectionName = ''
    switch (action) {
      case 'getUserInfo':
      case 'updateUserInfo':
      case 'createUserProfile':
        collectionName = 'users'
        break
      case 'getFriendsList':
      case 'addFriend':
      case 'removeFriend':
      case 'updateFriendInfo':
        collectionName = 'friends'
        break
      case 'getFuxiHistory':
      case 'saveFuxiRecord':
      case 'deleteFuxiRecord':
      case 'getFuxiRecordDetail':
        collectionName = 'fuxi_history'
        break
    }

    // 确保集合存在
    if (collectionName) {
      const collectionExists = await ensureCollectionExists(collectionName)
      if (!collectionExists) {
        return {
          code: -1,
          message: `无法创建或访问集合 ${collectionName}`,
          data: null
        }
      }
    }

    switch (action) {
      // ==================== 用户信息管理 ====================
      case 'getUserInfo':
        return await getUserInfo(openid)
      
      case 'updateUserInfo':
        return await updateUserInfo(openid, data)
      
      case 'createUserProfile':
        return await createUserProfile(openid, data)

      // ==================== 好友列表管理 ====================
      case 'getFriendsList':
        return await getFriendsList(openid)
      
      case 'addFriend':
        return await addFriend(openid, data.friendOpenid, data.friendInfo)
      
      case 'removeFriend':
        return await removeFriend(openid, data.friendOpenid)
      
      case 'updateFriendInfo':
        return await updateFriendInfo(openid, data.friendOpenid, data.friendInfo)

      // ==================== 伏羲历史记录管理 ====================
      case 'getFuxiHistory':
        return await getFuxiHistory(openid, data.page, data.limit)
      
      case 'saveFuxiRecord':
        return await saveFuxiRecord(openid, data.record)
      
      case 'deleteFuxiRecord':
        return await deleteFuxiRecord(openid, data.recordId)
      
      case 'getFuxiRecordDetail':
        return await getFuxiRecordDetail(openid, data.recordId)

      default:
        return {
          code: -1,
          message: '不支持的操作类型',
          data: null
        }
    }
  } catch (error) {
    console.error('云函数执行错误:', error)
    return {
      code: -1,
      message: error.message || '服务器内部错误',
      data: null
    }
  }
}

// ==================== 用户信息相关函数 ====================

// 获取用户信息
async function getUserInfo(openid) {
  try {
    const result = await db.collection('users').where({
      openid: openid
    }).get()

    if (result.data.length > 0) {
      const user = result.data[0]
      // 移除敏感信息
      delete user.openid
      return {
        code: 0,
        message: '获取用户信息成功',
        data: user
      }
    } else {
      return {
        code: 1,
        message: '用户信息不存在',
        data: null
      }
    }
  } catch (error) {
    throw new Error('获取用户信息失败: ' + error.message)
  }
}

// 更新用户信息
async function updateUserInfo(openid, userInfo) {
  try {
    const updateData = {
      ...userInfo,
      updateTime: new Date()
    }

    const result = await db.collection('users').where({
      openid: openid
    }).update({
      data: updateData
    })

    return {
      code: 0,
      message: '更新用户信息成功',
      data: result
    }
  } catch (error) {
    throw new Error('更新用户信息失败: ' + error.message)
  }
}

// 创建用户档案
async function createUserProfile(openid, userInfo) {
  try {
    const userData = {
      openid: openid,
      ...userInfo,
      createTime: new Date(),
      updateTime: new Date(),
      // 初始化默认字段
      mbtiType: '',
      mentalHealthScore: 0,
      testHistory: [],
      preferences: {},
      settings: {
        notifications: true,
        privacy: 'public'
      }
    }

    const result = await db.collection('users').add({
      data: userData
    })

    return {
      code: 0,
      message: '创建用户档案成功',
      data: result
    }
  } catch (error) {
    throw new Error('创建用户档案失败: ' + error.message)
  }
}

// ==================== 好友列表相关函数 ====================

// 获取好友列表
async function getFriendsList(openid) {
  try {
    const result = await db.collection('friends').where({
      userOpenid: openid
    }).orderBy('createTime', 'desc').get()

    return {
      code: 0,
      message: '获取好友列表成功',
      data: result.data
    }
  } catch (error) {
    throw new Error('获取好友列表失败: ' + error.message)
  }
}

// 添加好友
async function addFriend(openid, friendOpenid, friendInfo) {
  try {
    // 检查是否已经是好友
    const existingFriend = await db.collection('friends').where({
      userOpenid: openid,
      friendOpenid: friendOpenid
    }).get()

    if (existingFriend.data.length > 0) {
      return {
        code: 1,
        message: '已经是好友关系',
        data: null
      }
    }

    // 添加好友记录
    const friendData = {
      userOpenid: openid,
      friendOpenid: friendOpenid,
      friendInfo: friendInfo,
      status: 'active',
      createTime: new Date(),
      updateTime: new Date()
    }

    const result = await db.collection('friends').add({
      data: friendData
    })

    return {
      code: 0,
      message: '添加好友成功',
      data: result
    }
  } catch (error) {
    throw new Error('添加好友失败: ' + error.message)
  }
}

// 移除好友
async function removeFriend(openid, friendOpenid) {
  try {
    const result = await db.collection('friends').where({
      userOpenid: openid,
      friendOpenid: friendOpenid
    }).remove()

    return {
      code: 0,
      message: '移除好友成功',
      data: result
    }
  } catch (error) {
    throw new Error('移除好友失败: ' + error.message)
  }
}

// 更新好友信息
async function updateFriendInfo(openid, friendOpenid, friendInfo) {
  try {
    const result = await db.collection('friends').where({
      userOpenid: openid,
      friendOpenid: friendOpenid
    }).update({
      data: {
        friendInfo: friendInfo,
        updateTime: new Date()
      }
    })

    return {
      code: 0,
      message: '更新好友信息成功',
      data: result
    }
  } catch (error) {
    throw new Error('更新好友信息失败: ' + error.message)
  }
}

// ==================== 伏羲历史记录相关函数 ====================

// 获取伏羲历史记录
async function getFuxiHistory(openid, page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit
    
    const result = await db.collection('fuxi_history').where({
      userOpenid: openid
    })
    .orderBy('createTime', 'desc')
    .skip(skip)
    .limit(limit)
    .get()

    // 获取总数
    const countResult = await db.collection('fuxi_history').where({
      userOpenid: openid
    }).count()

    return {
      code: 0,
      message: '获取伏羲历史记录成功',
      data: {
        records: result.data,
        total: countResult.total,
        page: page,
        limit: limit,
        hasMore: skip + result.data.length < countResult.total
      }
    }
  } catch (error) {
    throw new Error('获取伏羲历史记录失败: ' + error.message)
  }
}

// 保存伏羲记录
async function saveFuxiRecord(openid, record) {
  try {
    const recordData = {
      userOpenid: openid,
      ...record,
      createTime: new Date(),
      updateTime: new Date()
    }

    const result = await db.collection('fuxi_history').add({
      data: recordData
    })

    return {
      code: 0,
      message: '保存伏羲记录成功',
      data: result
    }
  } catch (error) {
    throw new Error('保存伏羲记录失败: ' + error.message)
  }
}

// 删除伏羲记录
async function deleteFuxiRecord(openid, recordId) {
  try {
    const result = await db.collection('fuxi_history').where({
      _id: recordId,
      userOpenid: openid
    }).remove()

    return {
      code: 0,
      message: '删除伏羲记录成功',
      data: result
    }
  } catch (error) {
    throw new Error('删除伏羲记录失败: ' + error.message)
  }
}

// 获取伏羲记录详情
async function getFuxiRecordDetail(openid, recordId) {
  try {
    const result = await db.collection('fuxi_history').where({
      _id: recordId,
      userOpenid: openid
    }).get()

    if (result.data.length > 0) {
      return {
        code: 0,
        message: '获取伏羲记录详情成功',
        data: result.data[0]
      }
    } else {
      return {
        code: 1,
        message: '记录不存在',
        data: null
      }
    }
  } catch (error) {
    throw new Error('获取伏羲记录详情失败: ' + error.message)
  }
} 