// utils/hexagram.js

// 64卦数据
const hexagramData = [
  { symbol: '䷀', name: '乾卦', description: '天天乾 • 刚健中正', meaning: '刚健中正，自强不息。' },
  { symbol: '䷁', name: '坤卦', description: '地地坤 • 厚德载物', meaning: '柔顺利贞，厚德载物。' },
  { symbol: '䷂', name: '屯卦', description: '水雷屯 • 起始维艰', meaning: '起始维艰，但有亨通。' },
  { symbol: '䷃', name: '蒙卦', description: '山水蒙 • 启蒙教育', meaning: '启蒙教育，开启智慧。' },
  { symbol: '䷄', name: '需卦', description: '水天需 • 等待时机', meaning: '等待时机，静待雨降。' },
  { symbol: '䷅', name: '讼卦', description: '天水讼 • 谨慎诉讼', meaning: '争讼不利，宜守正道。' },
  { symbol: '䷆', name: '师卦', description: '地水师 • 统兵治众', meaning: '统兵治众，以正治军。' },
  { symbol: '䷇', name: '比卦', description: '水地比 • 亲比辅佐', meaning: '亲密无间，团结一致。' },
  { symbol: '䷈', name: '小畜卦', description: '风天小畜 • 蓄养待进', meaning: '蓄养能量，静待时机。' },
  { symbol: '䷉', name: '履卦', description: '天泽履 • 履行正道', meaning: '小心谨慎，循序渐进。' },
  { symbol: '䷊', name: '泰卦', description: '地天泰 • 平安亨通', meaning: '通达和顺，万物亨通。' },
  { symbol: '䷋', name: '否卦', description: '天地否 • 闭塞不通', meaning: '闭塞不通，万物停滞。' },
  { symbol: '䷌', name: '同人卦', description: '天火同人 • 和同一致', meaning: '和同一致，志同道合。' },
  { symbol: '䷍', name: '大有卦', description: '火天大有 • 大有所成', meaning: '大有所成，功成名就。' },
  { symbol: '䷎', name: '谦卦', description: '地山谦 • 谦虚受益', meaning: '谦虚礼让，德行恢弘。' },
  { symbol: '䷏', name: '豫卦', description: '雷地豫 • 愉悦欢乐', meaning: '愉悦欢乐，安乐自在。' },
  // 简化数据，实际应该包含全部64卦
];

// 随机卦象解析文本
const hexagramInterpretations = [
  '《焦氏易林》曰："泰卦，明夷致泰，物极必反，无往不复。至微而着，至幽而明。是以乱而治，危而安，塞而通，阂而泰。"',
  '《易经》曰："地势坤，君子以厚德载物。"',
  '《周易》曰："元亨利贞。"',
  '《序卦传》曰："有天地，然后有万物；有万物，然后有男女；有男女，然后有夫妇；有夫妇，然后有父子；有父子，然后有君臣；有君臣，然后有上下；有上下，然后礼义有所错。"'
];

// 财运解析模板
const financeTemplates = [
  '财运顺畅，适合投资与理财。财位在$direction方，可佩戴$color色饰品增强运势。',
  '财运平稳，宜稳妥规划支出。财位在$direction方，可摆放$color色物品提升财运。',
  '财运起伏，不宜大额消费。财位在$direction方，慎防冲动花销。',
  '财运良好，事业有望进步。财位在$direction方，工作上可获贵人相助。'
];

// 桃花运解析模板
const loveTemplates = [
  '桃花位在$direction方，今日易遇贵人，社交活动顺利。',
  '桃花运旺盛，异性缘佳。桃花位在$direction方，单身者有望遇到心仪对象。',
  '桃花运平平，感情需要经营。桃花位在$direction方，已有伴侣宜增进沟通。',
  '桃花运温和，人际关系和谐。桃花位在$direction方，宜参加社交活动扩展人脉。'
];

// 方位数据
const directions = ['东', '南', '西', '北', '东南', '西南', '东北', '西北'];

// 颜色数据
const colors = ['红', '黄', '蓝', '绿', '紫', '黑', '白', '橙'];

// 日期格式化
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
  
  return `${year}年${month}月${day}日 星期${weekDay}`;
};

// 时间格式化
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
};

// 随机选择数组中的一个元素
const randomPick = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// 替换模板变量
const replaceTemplate = (template, variables) => {
  let result = template;
  Object.keys(variables).forEach(key => {
    result = result.replace(`$${key}`, variables[key]);
  });
  return result;
};

// 生成当日卦象
const generateDailyHexagram = () => {
  const now = new Date();
  const dateStr = formatDate(now);
  const timeStr = formatTime(now);
  
  // 随机选择一个卦象
  const hexagram = randomPick(hexagramData);
  
  // 生成财运和桃花运解析
  const financeDirection = randomPick(directions);
  const loveDirection = randomPick(directions);
  const dangerDirection = randomPick(directions);
  const color = randomPick(colors);
  
  const finance = replaceTemplate(randomPick(financeTemplates), { 
    direction: financeDirection, 
    color: color 
  });
  
  const love = replaceTemplate(randomPick(loveTemplates), { 
    direction: loveDirection 
  });
  
  // 随机选择解析文本
  const meaning = randomPick(hexagramInterpretations);
  
  // 生成宜忌
  const lucky = ['投资理财', '社交活动', '短途旅行', '学习进修', '谈合作', '签约', '装修', '搬家', '求职面试'];
  const unlucky = ['争执冲突', '高风险决策', '大额消费', '远行', '冒险活动', '借贷', '过度劳累', '处理纠纷'];
  
  const randomLucky = [];
  const randomUnlucky = [];
  
  // 随机选择3个宜项
  while (randomLucky.length < 3) {
    const item = randomPick(lucky);
    if (!randomLucky.includes(item)) {
      randomLucky.push(item);
    }
  }
  
  // 随机选择3个忌项
  while (randomUnlucky.length < 3) {
    const item = randomPick(unlucky);
    if (!randomUnlucky.includes(item)) {
      randomUnlucky.push(item);
    }
  }
  
  return {
    date: dateStr,
    time: timeStr,
    ...hexagram,
    meaning,
    finance,
    love,
    compass: {
      finance: financeDirection,
      love: loveDirection,
      danger: dangerDirection
    },
    tips: {
      clothing: `今日宜穿${color}色系，有助于提升运势。`,
      lucky: randomLucky,
      unlucky: randomUnlucky
    }
  };
};

module.exports = {
  generateDailyHexagram,
  formatDate,
  formatTime
}; 