// 云函数入口文件
const OpenAI = require('openai');

// 云函数入口函数
exports.main = async (event, context) => {
  const { apiKey, messages, model = 'deepseek-chat' } = event;
  if (!apiKey || !messages) {
    return {
      code: 400,
      message: 'apiKey和messages为必填参数',
    };
  }
  try {
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey,
    });
    const completion = await openai.chat.completions.create({
      messages,
      model,
    });
    return completion;
  } catch (err) {
    return {
      code: 500,
      message: 'DeepSeek API调用失败',
      error: err.message,
    };
  }
}; 