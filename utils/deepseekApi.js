// utils/deepseekApi.js
const API_CONFIG = require('./config');
const logger = require('./logger');

// DeepSeek API配置
const DEEPSEEK_API_KEY = API_CONFIG.DEEPSEEK.API_KEY;
const DEEPSEEK_API_URL = API_CONFIG.DEEPSEEK.API_URL;

/**
 * 日志记录函数
 * @param {String} type - 日志类型
 * @param {any} data - 要记录的数据
 */
function logApiActivity(type, data) {
  switch (type) {
    case '请求':
      logger.logRequest(data);
      break;
    case '响应状态':
    case 'AI回答':
    case '解析结果':
    case 'JSON解析':
      logger.logResponse(data);
      break;
    case '错误':
    case '解析失败':
    case '解析错误':
      logger.logError(data);
      break;
    default:
      logger.log(type, data);
  }
}

/**
 * 调用DeepSeek API获取每日一挂的解析
 * @param {Object} hexagramInfo - 卦象基本信息
 * @param {Object} userInfo - 用户个人信息(可选)
 * @returns {Promise<Object>} - 包含AI生成的解析结果
 */
function getHexagramInterpretation(hexagramInfo, userInfo = {}) {
  return new Promise((resolve, reject) => {
    // 构建请求体
    const prompt = buildPrompt(hexagramInfo, userInfo);
    
    // 记录请求信息
    logApiActivity('请求', {
      url: DEEPSEEK_API_URL,
      method: 'POST',
      model: 'deepseek-chat',
      卦象: `${hexagramInfo.name}(${hexagramInfo.symbol})`,
      提示词: prompt
    });
    
    // 调用API
    wx.request({
      url: DEEPSEEK_API_URL,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      data: {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位精通周易与风水命理的大师，请根据用户的六爻卦象提供个性化的解析和建议。回答要有文化底蕴，同时保持简洁明了，语气要温和有智慧。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      },
      success: (res) => {
        // 记录API响应
        logApiActivity('响应状态', {
          状态码: res.statusCode,
          响应头: res.header
        });
        
        if (res.statusCode === 200 && res.data && res.data.choices && res.data.choices.length > 0) {
          const aiResponse = res.data.choices[0].message.content;
          
          // 记录AI回答内容
          logApiActivity('AI回答', aiResponse);
          
          // 解析AI响应
          const parsedResult = parseAIResponse(aiResponse, hexagramInfo);
          
          // 记录解析后的结果
          logApiActivity('解析结果', {
            卦象: parsedResult.name,
            解析: parsedResult.meaning ? parsedResult.meaning.substring(0, 50) + '...' : '无',
            整体运势: parsedResult.overall ? parsedResult.overall.substring(0, 50) + '...' : '无',
            财运: parsedResult.finance ? parsedResult.finance.substring(0, 50) + '...' : '无',
            桃花运: parsedResult.love ? parsedResult.love.substring(0, 50) + '...' : '无'
          });
          
          resolve(parsedResult);
        } else {
          console.error('DeepSeek API调用失败:', res);
          logApiActivity('错误', {
            错误类型: 'API调用失败',
            详情: res
          });
          // 如果API调用失败，返回原始卦象信息
          resolve(hexagramInfo);
        }
      },
      fail: (err) => {
        console.error('DeepSeek API请求失败:', err);
        logApiActivity('错误', {
          错误类型: '网络请求失败',
          详情: err
        });
        // 如果网络请求失败，返回原始卦象信息
        resolve(hexagramInfo);
      }
    });
  });
}

/**
 * 构建发送给AI的提示词
 * @param {Object} hexagramInfo - 卦象基本信息
 * @param {Object} userInfo - 用户个人信息(可选)
 * @returns {String} - 构建好的提示词
 */
function buildPrompt(hexagramInfo, userInfo) {
  const date = new Date();
  const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  
  let promptText = `今天是${dateStr}，抽到的卦象是${hexagramInfo.name}（${hexagramInfo.symbol}）：${hexagramInfo.description}。
请你基于这个卦象，为我提供以下内容：
1. 卦象的深度解析（100字左右）
2. 今日整体运势（80字左右）
3. 今日财运（60字左右）
4. 今日感情/人际关系（60字左右）
5. 今日事业/学业（60字左右）
6. 开运建议：今日宜做的3件事
7. 今日忌讳：今日应避免的3件事
8. 开运方位：财位、桃花位、避煞位各一个
9. 开运颜色建议

请以JSON格式回复，包含以下字段：meaning, overall, finance, love, career, lucky(数组), unlucky(数组), compass(对象，包含finance, love, danger), color
`;

  // 如果有用户信息，可以加入个性化元素
  if (userInfo.birthdate) {
    promptText += `\n用户出生日期：${userInfo.birthdate}，请将这一信息考虑到解析中，使预测更加个性化。`;
  }
  
  return promptText;
}

/**
 * 解析AI返回的回答
 * @param {String} aiResponse - AI返回的文本
 * @param {Object} originalHexagramInfo - 原始卦象信息
 * @returns {Object} - 解析后的卦象信息
 */
function parseAIResponse(aiResponse, originalHexagramInfo) {
  try {
    // 尝试直接解析JSON响应
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      
      // 记录JSON解析过程
      logApiActivity('JSON解析', {
        提取的JSON字符串长度: jsonStr.length,
        JSON示例: jsonStr.substring(0, 100) + '...'
      });
      
      const parsedData = JSON.parse(jsonStr);
      
      // 合并原始卦象信息和AI解析结果
      return {
        ...originalHexagramInfo,
        meaning: parsedData.meaning || originalHexagramInfo.meaning,
        finance: parsedData.finance || originalHexagramInfo.finance,
        love: parsedData.love || originalHexagramInfo.love,
        career: parsedData.career || '',  // 新增字段
        overall: parsedData.overall || '', // 新增字段
        compass: parsedData.compass || originalHexagramInfo.compass,
        tips: {
          clothing: parsedData.color ? `今日宜穿${parsedData.color}色系，有助于提升运势。` : originalHexagramInfo.tips.clothing,
          lucky: parsedData.lucky || originalHexagramInfo.tips.lucky,
          unlucky: parsedData.unlucky || originalHexagramInfo.tips.unlucky
        }
      };
    }
    
    // 如果无法解析JSON，返回原始数据
    logApiActivity('解析失败', {
      错误类型: '无法解析JSON',
      AI响应: aiResponse.substring(0, 200) + '...'
    });
    console.error('无法解析AI响应为JSON:', aiResponse);
    return originalHexagramInfo;
  } catch (err) {
    logApiActivity('解析错误', {
      错误类型: 'JSON解析异常',
      错误信息: err.message,
      AI响应: aiResponse.substring(0, 200) + '...'
    });
    console.error('解析AI响应失败:', err);
    return originalHexagramInfo;
  }
}

/**
 * 通过云函数调用 DeepSeek API
 * @param {Array} messages - openai标准消息体
 * @param {String} model - 模型名，默认 deepseek-chat
 * @returns {Promise<Object>} - AI返回内容
 */
function callDeepseek(messages, model = 'deepseek-chat') {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'deepseekProxy',
      data: {
        apiKey: require('./config').DEEPSEEK.API_KEY,
        messages,
        model
      },
      success: res => {
        if (res.result && res.result.choices && res.result.choices.length > 0) {
          resolve(res.result.choices[0].message.content);
        } else {
          reject(res.result);
        }
      },
      fail: err => {
        reject(err);
      }
    });
  });
}

module.exports = {
  getHexagramInterpretation,
  callDeepseek
}; 