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
 * 获取MBTI人格类型的AI个性化建议
 * @param {Object} mbtiInfo - MBTI测试结果信息
 * @param {Object} userInfo - 用户个人信息(可选)
 * @returns {Promise<Object>} - 包含AI生成的个性化建议
 */
function getMbtiAiAdvice(mbtiInfo, userInfo = {}) {
  return new Promise((resolve, reject) => {
    // 构建请求体
    const prompt = buildMbtiPrompt(mbtiInfo, userInfo);
    
    // 记录请求信息
    logApiActivity('请求', {
      url: DEEPSEEK_API_URL,
      method: 'POST',
      model: 'deepseek-chat',
      MBTI类型: mbtiInfo.type,
      提示词: prompt
    });
    
    // 构建消息体
    const messages = [
      {
        role: 'system',
        content: '你是一位精通MBTI人格分析和个人发展的心理学专家，请根据用户的MBTI类型提供个性化的建议和指导，帮助用户更好地发挥自己的优势并克服潜在的盲点。回答要专业深刻，同时保持实用性和可操作性。'
      },
      {
        role: 'user',
        content: prompt
      }
    ];
    
    // 调用云函数
    callDeepseek(messages)
      .then(aiResponse => {
        // 记录AI回答内容
        logApiActivity('AI回答', aiResponse);
        
        // 解析AI响应
        const parsedResult = parseMbtiAIResponse(aiResponse, mbtiInfo);
        
        // 记录解析后的结果
        logApiActivity('解析结果', {
          MBTI类型: parsedResult.type,
          整体建议: parsedResult.overallAdvice ? parsedResult.overallAdvice.substring(0, 50) + '...' : '无',
          职业建议: parsedResult.careerAdvice ? parsedResult.careerAdvice.substring(0, 50) + '...' : '无',
          人际关系: parsedResult.relationshipAdvice ? parsedResult.relationshipAdvice.substring(0, 50) + '...' : '无'
        });
        
        resolve(parsedResult);
      })
      .catch(err => {
        console.error('DeepSeek API调用失败:', err);
        logApiActivity('错误', {
          错误类型: 'API调用失败',
          详情: err
        });
        // 如果API调用失败，返回原始MBTI信息
        resolve({
          ...mbtiInfo,
          aiAdvice: {
            error: true,
            message: '获取AI建议失败，请稍后再试'
          }
        });
      });
  });
}

/**
 * 构建MBTI分析的提示词
 * @param {Object} mbtiInfo - MBTI测试结果信息
 * @param {Object} userInfo - 用户个人信息(可选)
 * @returns {String} - 构建好的提示词
 */
function buildMbtiPrompt(mbtiInfo, userInfo) {
  const date = new Date();
  const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  
  let promptText = `我的MBTI类型是${mbtiInfo.type}（${mbtiInfo.name}）。
今天是${dateStr}，请你基于我的MBTI类型和个人信息，为我提供详细且高度个性化的建议。

请包含以下内容：
1. 个性化发展建议：如何更好地发挥我的优势，克服潜在的盲点（150-200字）
2. 职业发展指导：适合我的职业方向和具体建议（100-150字）
3. 人际关系与沟通：如何改善我的人际关系和沟通方式（100-150字）
4. 压力管理策略：针对我的类型特点的减压方法（80-100字）
5. 个人成长方向：我应该重点培养的3个能力或特质
6. 应避免的3个常见误区或陷阱

在回答中，请明确指出我的个人特征如何影响这些建议，例如："因为你是${userInfo.birthdate ? '出生于' + userInfo.birthdate + '的' : ''} ${userInfo.gender || ''}性，${userInfo.age ? userInfo.age + '岁' : ''}，${userInfo.zodiac || ''}星座，${userInfo.chineseZodiac ? userInfo.chineseZodiac + '年出生' : ''}，MBTI类型为${mbtiInfo.type}，所以......"

请以JSON格式回复，包含以下字段：overallAdvice, careerAdvice, relationshipAdvice, stressManagement, growthAreas(数组), pitfalls(数组)
`;

  // 如果有用户信息，加入个性化元素
  if (userInfo) {
    let userInfoText = "\n我的个人详细情况：\n";
    
    if (userInfo.gender) {
      userInfoText += `性别：${userInfo.gender}\n`;
    }
    
    if (userInfo.birthdate) {
      userInfoText += `出生日期：${userInfo.birthdate}\n`;
    }
    
    if (userInfo.age) {
      userInfoText += `年龄：${userInfo.age}岁\n`;
    }
    
    if (userInfo.zodiac) {
      userInfoText += `星座：${userInfo.zodiac}\n`;
    }
    
    if (userInfo.chineseZodiac) {
      userInfoText += `生肖：${userInfo.chineseZodiac}\n`;
    }
    
    if (userInfo.occupation) {
      userInfoText += `职业：${userInfo.occupation}\n`;
    }
    
    if (userInfo.education) {
      userInfoText += `教育背景：${userInfo.education}\n`;
    }
    
    if (userInfo.interests && userInfo.interests.length > 0) {
      userInfoText += `兴趣爱好：${Array.isArray(userInfo.interests) ? userInfo.interests.join('、') : userInfo.interests}\n`;
    }
    
    if (userInfo.challenges) {
      userInfoText += `目前面临的挑战：${userInfo.challenges}\n`;
    }
    
    // 添加当前季节和节气信息
    const seasons = ['冬', '春', '春', '春', '夏', '夏', '夏', '秋', '秋', '秋', '冬', '冬'];
    const currentSeason = seasons[date.getMonth()];
    userInfoText += `当前季节：${currentSeason}季\n`;
    
    promptText += userInfoText;
  }
  
  return promptText;
}

/**
 * 解析MBTI AI返回的回答
 * @param {String} aiResponse - AI返回的文本
 * @param {Object} originalMbtiInfo - 原始MBTI信息
 * @returns {Object} - 解析后的MBTI建议信息
 */
function parseMbtiAIResponse(aiResponse, originalMbtiInfo) {
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
      
      // 合并原始MBTI信息和AI解析结果
      return {
        ...originalMbtiInfo,
        aiAdvice: {
          overallAdvice: parsedData.overallAdvice || '',
          careerAdvice: parsedData.careerAdvice || '',
          relationshipAdvice: parsedData.relationshipAdvice || '',
          stressManagement: parsedData.stressManagement || '',
          growthAreas: parsedData.growthAreas || [],
          pitfalls: parsedData.pitfalls || []
        }
      };
    }
    
    // 如果无法解析JSON，构造简单结构
    logApiActivity('解析失败', {
      错误类型: '无法解析JSON',
      AI响应: aiResponse.substring(0, 200) + '...'
    });
    console.error('无法解析AI响应为JSON:', aiResponse);
    
    // 使用文本分段方式处理
    const sections = aiResponse.split(/\d+\.\s/);
    return {
      ...originalMbtiInfo,
      aiAdvice: {
        overallAdvice: sections[1] || '',
        careerAdvice: sections[2] || '',
        relationshipAdvice: sections[3] || '',
        stressManagement: sections[4] || '',
        growthAreas: extractListItems(sections[5] || ''),
        pitfalls: extractListItems(sections[6] || '')
      }
    };
  } catch (err) {
    logApiActivity('解析错误', {
      错误类型: 'JSON解析异常',
      错误信息: err.message,
      AI响应: aiResponse.substring(0, 200) + '...'
    });
    console.error('解析AI响应失败:', err);
    
    // 返回带错误信息的对象
    return {
      ...originalMbtiInfo,
      aiAdvice: {
        error: true,
        message: '解析AI建议失败',
        rawResponse: aiResponse
      }
    };
  }
}

/**
 * 从文本中提取列表项
 * @param {String} text - 包含列表的文本
 * @returns {Array} - 提取的列表项
 */
function extractListItems(text) {
  // 尝试匹配数字或者点开头的列表项
  const items = text.split(/[\n•-]+/).map(item => item.trim()).filter(Boolean);
  if (items.length > 0) {
    return items;
  }
  
  // 如果没有明确的列表标记，按句号分割
  return text.split(/。|\./).map(item => item.trim()).filter(Boolean);
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
    
    // 构建消息体
    const messages = [
      {
        role: 'system',
        content: '你是一位精通周易与风水命理的大师，请根据用户的六爻卦象提供个性化的解析和建议。回答要有文化底蕴，同时保持简洁明了，语气要温和有智慧。'
      },
      {
        role: 'user',
        content: prompt
      }
    ];
    
    // 调用云函数
    callDeepseek(messages)
      .then(aiResponse => {
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
      })
      .catch(err => {
        console.error('DeepSeek API调用失败:', err);
        logApiActivity('错误', {
          错误类型: 'API调用失败',
          详情: err
        });
        // 如果API调用失败，返回原始卦象信息
        resolve(hexagramInfo);
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
  getMbtiAiAdvice,
  callDeepseek
}; 