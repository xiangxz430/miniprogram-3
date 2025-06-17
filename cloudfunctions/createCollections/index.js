// 云函数：初始化数据库集合
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-3go3cn2v0cb22666'  // 使用具体的环境ID
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  console.log('开始初始化数据库集合...')

  try {
    const results = []

    // 创建users集合
    try {
      await db.collection('users').add({
        data: {
          openid: openid,
          nickname: '初始化用户',
          _temp: true,
          createTime: new Date()
        }
      })
      results.push('users集合创建成功')
      console.log('users集合创建成功')
    } catch (error) {
      if (error.message.includes('duplicate')) {
        results.push('users集合已存在')
      } else {
        results.push('users集合创建失败: ' + error.message)
      }
    }

    // 创建friends集合
    try {
      const friendResult = await db.collection('friends').add({
        data: {
          userOpenid: openid,
          friendOpenid: 'temp_friend',
          _temp: true,
          createTime: new Date()
        }
      })
      // 删除临时记录
     
      console.log('friends集合创建成功')
    } catch (error) {
      if (error.message.includes('duplicate')) {
        results.push('friends集合已存在')
      } else {
        results.push('friends集合创建失败: ' + error.message)
      }
    }

    // 创建fuxi_history集合
    try {
      const fuxiResult = await db.collection('fuxi_history').add({
        data: {
          userOpenid: openid,
          question: '初始化测试',
          _temp: true,
          createTime: new Date()
        }
      })
      // 删除临时记录
      
    } catch (error) {
      if (error.message.includes('duplicate')) {
        results.push('fuxi_history集合已存在')
      } else {
        results.push('fuxi_history集合创建失败: ' + error.message)
      }
    }

    // 清理users集合中的临时数据
    

    return {
      code: 0,
      message: '数据库初始化完成',
      data: results
    }

  } catch (error) {
    console.error('数据库初始化失败:', error)
    return {
      code: -1,
      message: '数据库初始化失败: ' + error.message,
      data: null
    }
  }
} 