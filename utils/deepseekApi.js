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
在每个内容中，请明确指出我的个人特征如何影响这些建议，回答格式例如："因为你是${userInfo.birthdate ? '出生于' + userInfo.birthdate + '的' : ''} ${userInfo.gender || ''}性，${userInfo.age ? userInfo.age + '岁' : ''}，${userInfo.zodiac || ''}星座，${userInfo.chineseZodiac ? userInfo.chineseZodiac + '年出生' : ''}，MBTI类型为${mbtiInfo.type}，所以......"
请包含以下内容：
1. 个性化发展建议：如何更好地发挥我的优势，克服潜在的盲点（400-500字）
2. 职业发展指导：适合我的职业方向和具体建议（100-150字）
3. 人际关系与沟通：如何改善我的人际关系和沟通方式（100-150字）
4. 压力管理策略：针对我的类型特点的减压方法（80-100字）
5. 个人成长方向：我应该重点培养的3个能力或特质
6. 应避免的3个常见误区或陷阱


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

// 获取天气预报和穿衣建议
export const getWeatherAndAdvice = async (location, userInfo) => {


  console.log('开始获取天气预报和穿衣建议:', {
    location,
    userInfo: {
      ...userInfo,
      zodiac: userInfo.zodiac || '未知'
    }
  });

  const prompt = `基于以下信息生成天气预报和穿衣建议:
  地点: ${location.city}
  请明确指出我的个人特征如何影响这些建议，个人信息包括："${userInfo.birthdate ? '出生于' + userInfo.birthdate + '的' : ''} ${userInfo.gender || ''}性，${userInfo.age ? userInfo.age + '岁' : ''}，${userInfo.zodiac || ''}星座，${userInfo.chineseZodiac ? userInfo.chineseZodiac + '年出生' : ''}，MBTI类型为${mbtiInfo.type}，所以......"
  请包含以下内容：
  请提供:
  1. 当前天气详情(温度、天气状况、湿度、风速、空气质量)
  2. 24小时天气预报
  3. 基于个人信息结合天气给的穿衣建议200字
  4. 运势提示 300字
  
  请以JSON格式返回，包含以下字段：
  {
    "weather": {
      "currentTemp": "当前温度",
      "maxTemp": "最高温度",
      "minTemp": "最低温度",
      "condition": "天气状况",
      "humidity": "湿度",
      "windSpeed": "风速",
      "airQuality": "空气质量",
      "hourlyForecast": [
        {
          "time": "时间点",
          "temp": "温度",
          "rainProb": "降水概率"
        }
      ]
    },
    "clothingAdvice": {
      "index": "穿衣指数",
      "recommendation": "推荐搭配",
      "tips": "特别提示",
      "zodiacAdvice": "星座运势提示"
    }
  }`;
  
  const messages = [
    {
      role: 'system',
      content: '你是一位专业的天气预报和穿衣搭配顾问。请始终以JSON格式返回数据，不要包含任何其他文本。确保返回的JSON格式完全符合要求的结构。'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  try {
    console.log('正在调用AI接口获取天气建议...');
    const response = await callDeepseek(messages);
    console.log('成功获取AI响应');
    
    // 从响应中提取JSON字符串
    const jsonContent = response.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonContent || !jsonContent[1]) {
      console.error('无法从响应中提取JSON内容');
      throw new Error('无法从响应中提取JSON内容');
    }

    try {
      console.log('正在解析JSON响应...');
      const result = JSON.parse(jsonContent[1]);
      
      // 验证返回的数据结构
      if (!result.weather || !result.clothingAdvice) {
        console.error('返回的数据结构不完整:', result);
        throw new Error('返回的数据结构不完整');
      }

      // 确保返回默认值
      const formattedResult = {
        weather: {
          city: location.city,
          currentTemp: result.weather.currentTemp || '--',
          maxTemp: result.weather.maxTemp || '--',
          minTemp: result.weather.minTemp || '--',
          condition: result.weather.condition || '未知',
          humidity: result.weather.humidity || '--',
          windSpeed: result.weather.windSpeed || '--',
          airQuality: result.weather.airQuality || '--',
          hourlyForecast: result.weather.hourlyForecast || []
        },
        clothingAdvice: {
          index: result.clothingAdvice.index || '舒适',
          recommendation: result.clothingAdvice.recommendation || '暂无建议',
          tips: result.clothingAdvice.tips || '暂无提示',
          zodiacAdvice: result.clothingAdvice.zodiacAdvice || '暂无星座建议'
        }
      };

      console.log('成功格式化天气数据:', {
        city: formattedResult.weather.city,
        currentTemp: formattedResult.weather.currentTemp,
        condition: formattedResult.weather.condition,
        clothingIndex: formattedResult.clothingAdvice.index
      });

      return formattedResult;
    } catch (parseError) {
      console.error('JSON解析失败:', parseError);
      throw new Error('JSON解析失败');
    }
  } catch (error) {
    console.error('获取天气数据失败:', error);
    // 返回默认数据而不是抛出错误
    const defaultResult = {
      weather: {
        city: location.city,
        currentTemp: '--',
        maxTemp: '--',
        minTemp: '--',
        condition: '未知',
        humidity: '--',
        windSpeed: '--',
        airQuality: '--',
        hourlyForecast: []
      },
      clothingAdvice: {
        index: '舒适',
        recommendation: '暂无建议',
        tips: '获取数据失败，请稍后再试',
        zodiacAdvice: '暂无星座建议'
      }
    };
    console.log('返回默认天气数据:', defaultResult);
    return defaultResult;
  }
};

// 字测分析
export const getCharacterAnalysis = async (character, userInfo) => {
  console.log('开始字测分析:', {
    character,
    userInfo: {
      ...userInfo,
      birthdate: userInfo.birthdate || '未知',
      gender: userInfo.gender || '未知',
      zodiac: userInfo.zodiac || '未知',
      chineseZodiac: userInfo.chineseZodiac || '未知',
      bazi: userInfo.bazi || '未知'
    }
  });

  // 构建用户信息文本
  let userInfoText = '';
  if (userInfo) {
    userInfoText = `
    性别：${userInfo.gender || '未知'}
    出生日期：${userInfo.birthdate || '未知'}
    年龄：${userInfo.age || '未知'}
    星座：${userInfo.zodiac || '未知'}
    生肖：${userInfo.chineseZodiac || '未知'}
    八字：${userInfo.bazi || '未知'}
    命主：${userInfo.dayMaster || '未知'}
    五行分布：${userInfo.elementDist ? JSON.stringify(userInfo.elementDist) : '未知'}
    `;
  }

  const prompt = `用户输入了"${character}"字进行测字分析。

用户基本信息：${userInfoText}

请基于用户的生辰八字、五行分布和所测之字，按照以下步骤进行深度分析:

1. 拆解该字的结构(偏旁部首、笔画数等)，并分析与用户八字的关联
2. 根据焦氏易林原理结合用户生辰八字进行卦象分析（200字）
3. 分析此字与用户命理五行的相生相克关系
4. 猜测用户心中所想的事，将所测之字与用户八字、五行特征相结合进行解读（300字）
5. 结合用户命理特征，给出运势建议和行动指南
  
请以JSON格式返回，包含以下字段：
{
  "structure": {
    "character": "输入的汉字",
    "radical": "偏旁部首",
    "strokes": "笔画数",
    "components": ["组成部件"],
    "wuxing": "字的五行属性",
    "baziRelation": "与用户八字的关系分析"
  },
  "hexagram": {
    "primary": "主卦",
    "secondary": "变卦",
    "interpretation": "结合八字的卦象解释"
  },
  "wuxingAnalysis": {
    "characterWuxing": "字的五行属性",
    "userWuxing": "用户命局五行特征",
    "relationship": "相生相克分析",
    "influence": "对运势的影响"
  },
  "interpretation": "关联解读",
  "advice": {
    "general": "总体建议",
    "action": ["具体行动建议"],
    "caution": "需要注意的事项",
    "timing": "最佳行动时机",
    "direction": "有利方位"
  }
}`;

  const messages = [
    {
      role: 'system',
      content: '你是一位精通汉字结构、易经卦象和八字命理的大师。请结合用户的生辰八字和五行特征，对所测之字进行全面分析。请始终以JSON格式返回数据，不要包含任何其他文本。确保返回的JSON格式完全符合要求的结构。'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  try {
    console.log('正在调用AI接口进行字测分析...');
    const response = await callDeepseek(messages);
    console.log('成功获取AI响应');
    
    // 从响应中提取JSON字符串
    const jsonContent = response.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonContent || !jsonContent[1]) {
      console.error('无法从响应中提取JSON内容');
      throw new Error('无法从响应中提取JSON内容');
    }

    try {
      console.log('正在解析JSON响应...');
      const result = JSON.parse(jsonContent[1]);
      
      // 验证返回的数据结构
      if (!result.structure || !result.hexagram || !result.interpretation || !result.advice) {
        console.error('返回的数据结构不完整:', result);
        throw new Error('返回的数据结构不完整');
      }

      // 格式化返回数据
      const formattedResult = {
        structure: {
          character: result.structure.character || character,
          radical: result.structure.radical || '未知',
          strokes: result.structure.strokes || 0,
          components: Array.isArray(result.structure.components) ? result.structure.components : [],
          wuxing: result.structure.wuxing || '未知',
          baziRelation: result.structure.baziRelation || '暂无分析'
        },
        hexagram: {
          primary: result.hexagram.primary || '未知',
          secondary: result.hexagram.secondary || '未知',
          interpretation: result.hexagram.interpretation || '暂无解析'
        },
        wuxingAnalysis: {
          characterWuxing: result.wuxingAnalysis?.characterWuxing || '未知',
          userWuxing: result.wuxingAnalysis?.userWuxing || '未知',
          relationship: result.wuxingAnalysis?.relationship || '暂无分析',
          influence: result.wuxingAnalysis?.influence || '暂无分析'
        },
        interpretation: result.interpretation || '暂无解读',
        advice: {
          general: result.advice.general || '暂无建议',
          action: Array.isArray(result.advice.action) ? result.advice.action : ['请稍后再试'],
          caution: result.advice.caution || '暂无注意事项',
          timing: result.advice.timing || '暂无时机建议',
          direction: result.advice.direction || '暂无方位建议'
        }
      };

      console.log('成功格式化字测分析结果:', {
        character: formattedResult.structure.character,
        radical: formattedResult.structure.radical,
        strokes: formattedResult.structure.strokes,
        wuxing: formattedResult.structure.wuxing,
        primaryHexagram: formattedResult.hexagram.primary,
        baziRelation: formattedResult.structure.baziRelation
      });

      return formattedResult;
    } catch (parseError) {
      console.error('JSON解析失败:', parseError);
      throw new Error('JSON解析失败');
    }
  } catch (error) {
    console.error('字测分析失败:', error);
    // 返回默认数据而不是抛出错误
    const defaultResult = {
      structure: {
        character: character,
        radical: '未知',
        strokes: 0,
        components: [],
        wuxing: '未知',
        baziRelation: '暂无分析'
      },
      hexagram: {
        primary: '未知',
        secondary: '未知',
        interpretation: '分析失败，请稍后再试'
      },
      wuxingAnalysis: {
        characterWuxing: '未知',
        userWuxing: '未知',
        relationship: '暂无分析',
        influence: '暂无分析'
      },
      interpretation: '暂无解读',
      advice: {
        general: '暂无建议',
        action: ['请稍后再试'],
        caution: '暂无注意事项',
        timing: '暂无时机建议',
        direction: '暂无方位建议'
      }
    };
    console.log('返回默认字测分析结果:', defaultResult);
    return defaultResult;
  }
};

module.exports = {
  getHexagramInterpretation,
  getMbtiAiAdvice,
  callDeepseek,
  getWeatherAndAdvice,
  getCharacterAnalysis
}; 