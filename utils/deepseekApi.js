// utils/deepseekApi.js
const API_CONFIG = require('./config');
const lunar = require('./lunar'); // 导入本地农历计算库

// DeepSeek API配置
const DEEPSEEK_API_KEY = API_CONFIG.DEEPSEEK.API_KEY;
const DEEPSEEK_API_URL = API_CONFIG.DEEPSEEK.API_URL;

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
    console.log('请求', {
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
        console.log('AI回答', aiResponse);
        
        // 解析AI响应
        const parsedResult = parseMbtiAIResponse(aiResponse, mbtiInfo);
        
        // 记录解析后的结果
        console.log('解析结果', {
          MBTI类型: parsedResult.type,
          整体建议: parsedResult.overallAdvice ? parsedResult.overallAdvice.substring(0, 50) + '...' : '无',
          职业建议: parsedResult.careerAdvice ? parsedResult.careerAdvice.substring(0, 50) + '...' : '无',
          人际关系: parsedResult.relationshipAdvice ? parsedResult.relationshipAdvice.substring(0, 50) + '...' : '无'
        });
        
        resolve(parsedResult);
      })
      .catch(err => {
        console.error('DeepSeek API调用失败:', err);
        console.log('错误', {
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
      console.log('JSON解析', {
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
    console.log('解析失败', {
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
    console.log('解析错误', {
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
    console.log('请求', {
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
        console.log('AI回答', aiResponse);
        
        // 解析AI响应
        const parsedResult = parseAIResponse(aiResponse, hexagramInfo);
        
        // 记录解析后的结果
        console.log('解析结果', {
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
        console.log('错误', {
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
      console.log('JSON解析', {
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
    console.log('解析失败', {
      错误类型: '无法解析JSON',
      AI响应: aiResponse.substring(0, 200) + '...'
    });
    console.error('无法解析AI响应为JSON:', aiResponse);
    return originalHexagramInfo;
  } catch (err) {
    console.log('解析错误', {
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

/**
 * 验证并纠正AI返回的农历数据
 * @param {Object} aiLunarData - AI返回的农历数据
 * @param {Date} currentDate - 当前公历日期
 * @returns {Object} - 验证和纠正后的农历数据
 */
function validateAndCorrectLunarData(aiLunarData, currentDate) {
  console.log('========== 农历数据校验开始 ==========');
  console.log('当前公历日期:', `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`);
  
  if (!aiLunarData || !aiLunarData.lunarDate) {
    console.warn('AI未返回农历数据，使用本地计算作为后备');
    return generateLocalLunarData(currentDate);
  }
  
  try {
    // 使用本地农历库计算正确的农历日期
    const correctLunar = lunar.solarToLunar(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate()
    );
    
    console.log('AI返回的农历数据:', {
      年份: aiLunarData.lunarDate?.year,
      月份: aiLunarData.lunarDate?.month,
      日期: aiLunarData.lunarDate?.day,
      生肖: aiLunarData.lunarDate?.zodiac
    });
    
    console.log('本地计算的正确农历数据:', {
      年份: correctLunar.lunarYearText,
      月份: correctLunar.lunarMonthText,
      日期: correctLunar.lunarDayText,
      生肖: correctLunar.lunarYearText ? correctLunar.lunarYearText.replace('年', '').slice(-1) : '未知',
      完整信息: correctLunar
    });
    
    // 校验标志
    let needsCorrection = false;
    const corrections = [];
    
    // 验证农历年份（只比较干支部分，如"甲辰"）
    if (aiLunarData.lunarDate?.year && correctLunar.lunarYearText) {
      const aiYearStem = extractYearStem(aiLunarData.lunarDate.year);
      const correctYearStem = extractYearStem(correctLunar.lunarYearText);
      
      if (aiYearStem && correctYearStem && aiYearStem !== correctYearStem) {
        needsCorrection = true;
        corrections.push(`农历年份: AI返回"${aiLunarData.lunarDate.year}" -> 纠正为"${correctLunar.lunarYearText}"`);
      }
    }
    
    // 验证农历月份
    if (aiLunarData.lunarDate?.month && correctLunar.lunarMonthText) {
      const aiMonth = normalizeMonthName(aiLunarData.lunarDate.month);
      const correctMonth = normalizeMonthName(correctLunar.lunarMonthText);
      
      if (aiMonth !== correctMonth) {
        needsCorrection = true;
        corrections.push(`农历月份: AI返回"${aiLunarData.lunarDate.month}" -> 纠正为"${correctLunar.lunarMonthText}"`);
      }
    }
    
    // 验证农历日期
    if (aiLunarData.lunarDate?.day && correctLunar.lunarDayText) {
      const aiDay = aiLunarData.lunarDate.day;
      const correctDay = correctLunar.lunarDayText;
      
      if (aiDay !== correctDay) {
        needsCorrection = true;
        corrections.push(`农历日期: AI返回"${aiDay}" -> 纠正为"${correctDay}"`);
      }
    }
    
    // 如果需要纠正，使用本地计算的正确数据
    if (needsCorrection) {
      console.warn('🚨 AI返回的农历数据有误，使用本地计算纠正:');
      corrections.forEach(correction => console.warn('  ✓', correction));
      
      // 构建纠正后的农历数据
      const correctedLunarData = {
        ...aiLunarData,
        lunarDate: {
          year: correctLunar.lunarYearText || aiLunarData.lunarDate?.year,
          month: correctLunar.lunarMonthText || aiLunarData.lunarDate?.month,
          day: correctLunar.lunarDayText || aiLunarData.lunarDate?.day,
          monthName: correctLunar.lunarMonthText || aiLunarData.lunarDate?.monthName,
          dayName: correctLunar.lunarDayText || aiLunarData.lunarDate?.dayName,
          zodiac: getZodiacAnimal(currentDate.getFullYear())
        },
        // 保留AI的其他数据（干支、宜忌等）
        _corrected: true,
        _corrections: corrections,
        _originalAiData: aiLunarData.lunarDate
      };
      
      console.log('✅ 农历数据纠正完成:', {
        纠正后年份: correctedLunarData.lunarDate.year,
        纠正后月份: correctedLunarData.lunarDate.month,
        纠正后日期: correctedLunarData.lunarDate.day
      });
      
      return correctedLunarData;
    }
    
    console.log('✅ AI返回的农历数据验证通过，无需纠正');
    return aiLunarData;
    
  } catch (error) {
    console.error('农历数据校验过程中出错:', error);
    console.warn('使用本地计算作为后备方案');
    return generateLocalLunarData(currentDate);
  }
}

/**
 * 提取年份干支（如从"甲辰年"提取"甲辰"）
 */
function extractYearStem(yearText) {
  if (!yearText) return null;
  return yearText.replace('年', '').trim();
}

/**
 * 标准化月份名称（处理"五月"和"五"的差异）
 */
function normalizeMonthName(monthText) {
  if (!monthText) return null;
  // 移除"月"字，统一比较
  return monthText.replace('月', '').trim();
}

/**
 * 使用本地农历库生成农历数据（当AI数据不可用时）
 */
function generateLocalLunarData(currentDate) {
  try {
    const correctLunar = lunar.solarToLunar(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate()
    );
    
    return {
      solarDate: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate(),
        weekday: ['日', '一', '二', '三', '四', '五', '六'][currentDate.getDay()]
      },
      lunarDate: {
        year: correctLunar.lunarYearText,
        month: correctLunar.lunarMonthText,
        day: correctLunar.lunarDayText,
        monthName: correctLunar.lunarMonthText,
        dayName: correctLunar.lunarDayText,
        zodiac: getZodiacAnimal(currentDate.getFullYear())
      },
      ganzhi: {
        year: extractYearStem(correctLunar.lunarYearText),
        month: '月干支',
        day: '日干支'
      },
      nayin: '五行纳音',
      suitable: ['本地生成的宜事'],
      avoid: ['本地生成的忌事'],
      directions: {
        caishen: '正北',
        xishen: '西北',
        fushen: '西南',
        taishen: '厨灶床'
      },
      chongsha: {
        chong: '冲煞',
        sha: '煞方'
      },
      gods: {
        lucky: ['吉神'],
        unlucky: ['凶神']
      },
      times: {
        lucky: ['吉时'],
        unlucky: ['凶时']
      },
      pengzu: '彭祖百忌',
      dailyWords: '每日一言',
      tips: '温馨提示',
      _isLocalGenerated: true
    };
  } catch (error) {
    console.error('生成本地农历数据失败:', error);
    return null;
  }
}

/**
 * 根据年份获取生肖
 * @param {number} year - 公历年份
 * @returns {string} - 生肖名称
 */
function getZodiacAnimal(year) {
  const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  // 生肖以立春为界，这里简化处理，使用年份计算
  const baseYear = 1900; // 1900年为鼠年
  const index = (year - baseYear) % 12;
  return zodiacAnimals[index];
}

// 获取天气预报
export const getWeatherAndAdvice = async (location, userInfo) => {
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
    MBTI类型：${userInfo.mbti || userInfo.mbtiType || '未知'}
    `;
  }
  
  // 获取当前日期信息
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[today.getDay()];
  
  console.log('开始获取天气预报和黄历信息:', {
    location,
    date: dateStr,
    userInfo: {
      ...userInfo
    }
  });

  const prompt = `请为以下位置和用户提供准确的天气预报和黄历信息:
  地点：${location.city || '杭州'}
  日期：${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 ${weekday}
 
  用户信息：${userInfoText}
  
  **重要说明：为确保同一天的黄历信息保持一致，请基于以下固定日期种子生成宜忌内容：**
  日期种子：${today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()}
  
  请提供完整的今日信息包括:
  
  1. 天气详情(温度、天气状况、湿度、风速、空气质量)
  2. 24小时天气预报
  5. 完整的传统黄历信息，包括：
     - 农历日期 
     - 年月日干支
     - 五行纳音
     - 今日宜事（基于传统黄历，6-8项具体活动，请根据日期种子确保一致性）
     - 今日忌事（基于传统黄历，6-8项具体活动，请根据日期种子确保一致性）
     - 财神方位
     - 喜神方位
     - 福神方位
     - 胎神方位
     - 冲煞信息
     - 吉神宜趋（4-6项）
     - 凶神宜忌（4-6项）
     - 吉时（3-4个时辰）
     - 凶时（3-4个时辰）
     - 彭祖百忌
     - 今日一言（传统格言）
     - 温馨提示
  
  **注意：宜事和忌事必须基于传统黄历理论，并使用提供的日期种子确保同一天的结果完全一致。**
  
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
    "lunarCalendar": {
      "solarDate": {
        "year": ${today.getFullYear()},
        "month": ${today.getMonth() + 1},
        "day": ${today.getDate()},
        "weekday": "${weekday}"
      },
      "lunarDate": {
        "year": "农历年份",
        "month": "农历月份", 
        "day": "农历日期"
      },
      "ganzhi": {
        "year": "年干支",
        "month": "月干支", 
        "day": "日干支"
      },
      "nayin": "五行纳音",
      "suitable": ["宜事1", "宜事2", "宜事3", "宜事4", "宜事5", "宜事6"],
      "avoid": ["忌事1", "忌事2", "忌事3", "忌事4", "忌事5", "忌事6"],
      "directions": {
        "caishen": "财神方位",
        "xishen": "喜神方位",
        "fushen": "福神方位",
        "taishen": "胎神方位"
      },
      "chongsha": {
        "chong": "冲",
        "sha": "煞"
      },
      "gods": {
        "lucky": ["吉神1", "吉神2", "吉神3", "吉神4"],
        "unlucky": ["凶神1", "凶神2", "凶神3", "凶神4"]
      },
      "times": {
        "lucky": ["吉时1", "吉时2", "吉时3"], 
        "unlucky": ["凶时1", "凶时2", "凶时3"]
      }
    }
  }`;
  console.log('发送的 prompt是:'+prompt);
  const messages = [
    {
      role: 'system',
      content: '你是一位专业的天气预报和传统黄历专家。请始终以JSON格式返回数据，不要包含任何其他文本。确保返回的JSON格式完全符合要求的结构，特别注意黄历信息要准确且完整。'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  try {
    console.log('正在调用AI接口获取天气和黄历信息...');
    const response = await callDeepseek(messages);
    console.log('成功获取AI响应');
    
    // 从响应中提取JSON字符串
    const jsonContent = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
    if (!jsonContent || !jsonContent[1] && !jsonContent[0]) {
      console.error('无法从响应中提取JSON内容');
      throw new Error('无法从响应中提取JSON内容');
    }

    try {
      console.log('正在解析JSON响应...');
      const jsonStr = jsonContent[1] || jsonContent[0];
      const result = JSON.parse(jsonStr);
      
      // 验证返回的数据结构
      if (!result.weather || !result.clothingAdvice || !result.lunarCalendar) {
        console.error('返回的数据结构不完整:', result);
        throw new Error('返回的数据结构不完整');
      }

      // 验证农历数据的完整性
      if (!result.lunarCalendar.lunarDate || !result.lunarCalendar.ganzhi) {
        console.error('农历数据不完整:', result.lunarCalendar);
        throw new Error('农历数据不完整，无法使用默认值');
      }

      // 仅对天气和穿衣建议提供默认值，农历数据必须从AI获取
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
        },
        // 农历数据完全来自AI，不提供任何默认值
        lunarCalendar: validateAndCorrectLunarData(result.lunarCalendar, today)
      };

      console.log('成功格式化天气和黄历数据:', {
        city: formattedResult.weather.city,
        currentTemp: formattedResult.weather.currentTemp,
        condition: formattedResult.weather.condition,
        clothingIndex: formattedResult.clothingAdvice.index,
        lunarDate: formattedResult.lunarCalendar.lunarDate,
        ganzhi: formattedResult.lunarCalendar.ganzhi
      });

      return formattedResult;
    } catch (parseError) {
      console.error('JSON解析失败:', parseError);
      throw new Error('JSON解析失败');
    }
  } catch (error) {
    console.error('获取天气和黄历数据失败:', error);
    // 接口失败时不提供假的农历数据，而是明确说明获取失败
    const defaultResult = {
      weather: {
        city: location.city,
        currentTemp: '--',
        maxTemp: '--',
        minTemp: '--',
        condition: '获取失败',
        humidity: '--',
        windSpeed: '--',
        airQuality: '--',
        hourlyForecast: []
      },
      clothingAdvice: {
        index: '无法获取',
        recommendation: '网络异常，无法获取穿衣建议',
        tips: '请检查网络连接后重试',
        zodiacAdvice: '获取失败'
      },
      lunarCalendar: null // 不提供错误的默认农历数据
    };
    console.log('AI接口失败，返回有限的默认数据（不包含农历）:', defaultResult);
    return defaultResult;
  }
};


// 格式化大运流年数据的辅助函数
function formatMajorPeriods(periods) {
  if (typeof periods === 'string') {
    return periods;
  } else if (typeof periods === 'object' && periods !== null) {
    // 如果是对象，尝试格式化为易读的文本
    if (Array.isArray(periods)) {
      return periods.join('\n');
    } else {
      // 如果是对象，将其转换为易读的键值对
      return Object.entries(periods)
        .map(([key, value]) => `${key}：${value}`)
        .join('\n');
    }
  } else {
    return '暂无分析';
  }
}

// 八字分析功能
const getBaziAnalysis = async (birthInfo = {}) => {
  try {
    // 记录请求信息
    console.log('请求', {
      功能: '八字分析',
      出生信息: birthInfo
    });


    const prompt = `请根据以下出生信息进行专业的八字分析，并同时进行姓名学分析：

基本信息：
姓名：${birthInfo.name}
出生日期：${birthInfo.birthDate}
出生时间：${birthInfo.birthTime}
性别：${birthInfo.gender}
出生地：${birthInfo.birthplace || '未知'}

请按照传统八字命理学和姓名学进行综合分析，提供以下内容：

【八字分析部分】
1. 八字排盘：准确计算年柱、月柱、日柱、时柱（天干地支）
2. 五行分析：分析八字中五行（金木水火土）的分布和强弱
3. 日主分析：确定日主（日干）的五行属性和旺衰程度
4. 用神喜忌：分析用神、忌神，以及喜用的五行

【姓名学分析部分】
5. 姓名拆解：按照姓名学将姓名拆解为天格、人格、地格、外格、总格
6. 姓名五行：分析姓名中每个字的五行属性
7. 数理分析：计算姓名的数理吉凶和含义
8. 姓名与八字匹配：分析姓名五行是否与八字用神相符，是否有助于补足八字缺陷

【综合分析部分】
9. 性格特征：结合八字和姓名分析性格优缺点和天赋才能(至少300字)
10. 事业财运：分析适合的职业方向和财运特点(100-200字)
11. 婚姻感情：分析感情运势和婚姻特点(100-200字)
12. 健康运势：分析身体健康方面需要注意的事项(100-200字)
13. 大运流年：分析人生各阶段的大运走势
14. 姓名建议：如果姓名与八字不匹配，提供改名或补救建议(200字)
15. 开运建议：提供具体的开运方法和注意事项

请以JSON格式返回，包含以下字段：
{
  "baziInfo": {
    "year": "年柱（天干地支）",
    "month": "月柱（天干地支）", 
    "day": "日柱（天干地支）",
    "hour": "时柱（天干地支）",
    "dayMaster": "日主（日干）",
    "dayMasterElement": "日主五行属性"
  },
  "wuxingAnalysis": {
    "distribution": {
      "metal": "金的个数",
      "wood": "木的个数", 
      "water": "水的个数",
      "fire": "火的个数",
      "earth": "土的个数"
    },
    "strength": "日主强弱分析",
    "pattern": "格局类型",
    "usefulGod": "用神",
    "tabooGod": "忌神"
  },
  "nameAnalysis": {
    "nameBreakdown": {
      "tianGe": "天格数理和含义",
      "renGe": "人格数理和含义",
      "diGe": "地格数理和含义",
      "waiGe": "外格数理和含义",
      "zongGe": "总格数理和含义"
    },
    "nameWuxing": {
      "characters": ["姓名每个字的五行属性"],
      "overallWuxing": "姓名整体五行属性",
      "wuxingBalance": "姓名五行是否平衡"
    },
    "nameScore": "姓名综合评分（0-100分）",
    "baziNameMatch": {
      "compatibility": "与八字匹配度（0-100分）",
      "analysis": "匹配分析详情",
      "benefitSituation": "姓名是否补益八字用神"
    }
  },
  "personalityAnalysis": "结合八字和姓名的性格特征分析",
  "careerFortune": "事业财运分析", 
  "loveFortune": "婚姻感情分析",
  "healthFortune": "健康运势分析",
  "majorPeriods": "大运流年分析",
  "nameAdvice": {
    "isNameGood": "姓名是否适合（true/false）",
    "suggestions": ["姓名改进建议"],
    "alternativeNames": ["推荐的改名方案（如果需要）"]
  },
  "luckyAdvice": {
    "colors": ["有利颜色"],
    "directions": ["有利方位"],
    "numbers": ["幸运数字"],
    "elements": ["需要补充的五行"],
    "suggestions": ["具体开运建议"]
  }
}`;

    const messages = [
      {
        role: 'system',
        content: '你是一位精通传统八字命理学和姓名学的大师，具有深厚的易学功底。请严格按照传统八字理论和姓名学理论进行分析，确保排盘准确，分析专业。对于姓名学分析，请按照五格剖象法计算天格、人格、地格、外格、总格，并结合字义五行进行分析。请始终以JSON格式返回数据，不要包含任何其他文本。'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    console.log('正在调用AI接口进行八字分析...');
    const response = await callDeepseek(messages);
    console.log('成功获取AI响应');
    
    // 记录AI回答
    console.log('AI回答', {
      原始回答: response.substring(0, 200) + '...'
    });

    // 从响应中提取JSON字符串
    const jsonContent = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
    if (!jsonContent) {
      console.error('无法从响应中提取JSON内容');
      throw new Error('无法从响应中提取JSON内容');
    }

    try {
      console.log('正在解析JSON响应...');
      const jsonStr = jsonContent[1] || jsonContent[0];
      const result = JSON.parse(jsonStr);
      
      // 验证返回的数据结构
      if (!result.baziInfo || !result.wuxingAnalysis) {
        console.error('返回的数据结构不完整:', result);
        throw new Error('返回的数据结构不完整');
      }

      // 格式化返回数据
      const formattedResult = {
        baziInfo: {
          year: result.baziInfo.year || '未知',
          month: result.baziInfo.month || '未知',
          day: result.baziInfo.day || '未知',
          hour: result.baziInfo.hour || '未知',
          dayMaster: result.baziInfo.dayMaster || '未知',
          dayMasterElement: result.baziInfo.dayMasterElement || '未知'
        },
        wuxingAnalysis: {
          distribution: {
            metal: result.wuxingAnalysis.distribution?.metal || 0,
            wood: result.wuxingAnalysis.distribution?.wood || 0,
            water: result.wuxingAnalysis.distribution?.water || 0,
            fire: result.wuxingAnalysis.distribution?.fire || 0,
            earth: result.wuxingAnalysis.distribution?.earth || 0
          },
          strength: result.wuxingAnalysis.strength || '未知',
          pattern: result.wuxingAnalysis.pattern || '未知',
          usefulGod: result.wuxingAnalysis.usefulGod || '未知',
          tabooGod: result.wuxingAnalysis.tabooGod || '未知'
        },
        nameAnalysis: {
          nameBreakdown: {
            tianGe: result.nameAnalysis?.nameBreakdown?.tianGe || '未知',
            renGe: result.nameAnalysis?.nameBreakdown?.renGe || '未知',
            diGe: result.nameAnalysis?.nameBreakdown?.diGe || '未知',
            waiGe: result.nameAnalysis?.nameBreakdown?.waiGe || '未知',
            zongGe: result.nameAnalysis?.nameBreakdown?.zongGe || '未知'
          },
          nameWuxing: {
            characters: Array.isArray(result.nameAnalysis?.nameWuxing?.characters) ? result.nameAnalysis.nameWuxing.characters : [],
            overallWuxing: result.nameAnalysis?.nameWuxing?.overallWuxing || '未知',
            wuxingBalance: result.nameAnalysis?.nameWuxing?.wuxingBalance || '未知'
          },
          nameScore: result.nameAnalysis?.nameScore || '未知',
          baziNameMatch: {
            compatibility: result.nameAnalysis?.baziNameMatch?.compatibility || '未知',
            analysis: result.nameAnalysis?.baziNameMatch?.analysis || '未知',
            benefitSituation: result.nameAnalysis?.baziNameMatch?.benefitSituation || '未知'
          }
        },
        personalityAnalysis: result.personalityAnalysis || '暂无分析',
        careerFortune: result.careerFortune || '暂无分析',
        loveFortune: result.loveFortune || '暂无分析',
        healthFortune: result.healthFortune || '暂无分析',
        majorPeriods: formatMajorPeriods(result.majorPeriods),
        nameAdvice: {
          isNameGood: result.nameAdvice?.isNameGood || false,
          suggestions: Array.isArray(result.nameAdvice?.suggestions) ? result.nameAdvice.suggestions : [],
          alternativeNames: Array.isArray(result.nameAdvice?.alternativeNames) ? result.nameAdvice.alternativeNames : []
        },
        luckyAdvice: {
          colors: Array.isArray(result.luckyAdvice?.colors) ? result.luckyAdvice.colors : [],
          directions: Array.isArray(result.luckyAdvice?.directions) ? result.luckyAdvice.directions : [],
          numbers: Array.isArray(result.luckyAdvice?.numbers) ? result.luckyAdvice.numbers : [],
          elements: Array.isArray(result.luckyAdvice?.elements) ? result.luckyAdvice.elements : [],
          suggestions: Array.isArray(result.luckyAdvice?.suggestions) ? result.luckyAdvice.suggestions : []
        }
      };

      // 记录解析结果
      console.log('解析结果', {
        八字信息: `${formattedResult.baziInfo.year} ${formattedResult.baziInfo.month} ${formattedResult.baziInfo.day} ${formattedResult.baziInfo.hour}`,
        日主: formattedResult.baziInfo.dayMaster,
        日主五行: formattedResult.baziInfo.dayMasterElement,
        五行分布: formattedResult.wuxingAnalysis.distribution,
        用神: formattedResult.wuxingAnalysis.usefulGod
      });

      console.log('八字分析成功:', {
        年柱: formattedResult.baziInfo.year,
        月柱: formattedResult.baziInfo.month,
        日柱: formattedResult.baziInfo.day,
        时柱: formattedResult.baziInfo.hour,
        日主: formattedResult.baziInfo.dayMaster,
        五行分布: formattedResult.wuxingAnalysis.distribution
      });

      return formattedResult;
    } catch (parseError) {
      console.error('JSON解析失败:', parseError);
      throw new Error('JSON解析失败');
    }
  } catch (error) {
    console.error('八字分析失败:', error);
    
    // 记录错误
    console.log('错误', {
      错误类型: '八字分析失败',
      详情: error.message
    });

    // 返回默认数据而不是抛出错误
    const defaultResult = {
      baziInfo: {
        year: '未知',
        month: '未知',
        day: '未知',
        hour: '未知',
        dayMaster: '未知',
        dayMasterElement: '未知'
      },
      wuxingAnalysis: {
        distribution: {
          metal: 0,
          wood: 0,
          water: 0,
          fire: 0,
          earth: 0
        },
        strength: '分析失败',
        pattern: '未知',
        usefulGod: '未知',
        tabooGod: '未知'
      },
      nameAnalysis: {
        nameBreakdown: {
          tianGe: '未知',
          renGe: '未知',
          diGe: '未知',
          waiGe: '未知',
          zongGe: '未知'
        },
        nameWuxing: {
          characters: [],
          overallWuxing: '未知',
          wuxingBalance: '未知'
        },
        nameScore: '未知',
        baziNameMatch: {
          compatibility: '未知',
          analysis: '未知',
          benefitSituation: '未知'
        }
      },
      personalityAnalysis: '八字分析失败，请稍后重试',
      careerFortune: '暂无分析',
      loveFortune: '暂无分析',
      healthFortune: '暂无分析',
      majorPeriods: '暂无分析',
      nameAdvice: {
        isNameGood: false,
        suggestions: ['请稍后重试'],
        alternativeNames: []
      },
      luckyAdvice: {
        colors: [],
        directions: [],
        numbers: [],
        elements: [],
        suggestions: ['请稍后重试']
      }
    };
    console.log('返回默认八字分析结果:', defaultResult);
    return defaultResult;
  }
};

module.exports = {
  getHexagramInterpretation,
  getMbtiAiAdvice,
  callDeepseek,
  getWeatherAndAdvice,
  getBaziAnalysis
}; 