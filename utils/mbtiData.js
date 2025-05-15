const questions = require('./mbtiQuestions');

// MBTI 类型定义
const types = {
  "ISTJ": {
    name: "检查者型",
    description: "严谨务实，注重传统和秩序，有超强的组织能力和责任感。",
    percentage: "11.6%",
    functions: [
      { code: "Si", name: "内向感觉", description: "回顾过往经验，关注细节和事实" },
      { code: "Te", name: "外向思考", description: "逻辑分析，制定规则和计划" },
      { code: "Fi", name: "内向情感", description: "重视个人价值观和真实性" },
      { code: "Ne", name: "外向直觉", description: "探索新可能性和创新想法" }
    ]
  },
  "ISFJ": {
    name: "守卫者型",
    description: "尽职尽责的守护者，关心他人需求，重视和谐与安全。",
    percentage: "13.8%",
    functions: [
      { code: "Si", name: "内向感觉", description: "保存详细记忆，注重传统和经验" },
      { code: "Fe", name: "外向情感", description: "关注他人情感和需求，维护和谐" },
      { code: "Ti", name: "内向思考", description: "分析事物本质和逻辑一致性" },
      { code: "Ne", name: "外向直觉", description: "探索新的可能性和潜在意义" }
    ]
  },
  "INFJ": {
    name: "提倡者型",
    description: "富有理想主义和道德感，渴望为人类谋福祉，有独特的洞察力。",
    percentage: "1.5%",
    functions: [
      { code: "Ni", name: "内向直觉", description: "洞察事物本质和未来方向，形成有深度的见解" },
      { code: "Fe", name: "外向情感", description: "关注他人情感需求，建立和谐人际关系" },
      { code: "Ti", name: "内向思考", description: "分析问题并形成个人逻辑体系" },
      { code: "Se", name: "外向感觉", description: "关注当下感官体验，在压力下可能显现" }
    ]
  },
  "INTJ": {
    name: "建筑师型",
    description: "独立思考，战略规划能力强，追求知识和能力的完善。",
    percentage: "2.1%",
    functions: [
      { code: "Ni", name: "内向直觉", description: "形成长期愿景和战略规划，洞察系统本质" },
      { code: "Te", name: "外向思考", description: "组织和实施计划，运用客观事实和逻辑" },
      { code: "Fi", name: "内向情感", description: "根据内在价值观做决策，保持真实性" },
      { code: "Se", name: "外向感觉", description: "关注感官细节，在压力下可能显现" }
    ]
  },
  "ISTP": {
    name: "鉴赏家型",
    description: "善于处理危机，技术导向，喜欢冒险和动手解决问题。",
    percentage: "5.4%",
    functions: [
      { code: "Ti", name: "内向思考", description: "分析事物的工作原理，追求逻辑一致性" },
      { code: "Se", name: "外向感觉", description: "实时响应环境变化，享受动手实践" },
      { code: "Ni", name: "内向直觉", description: "洞察过程中的隐藏模式和关联" },
      { code: "Fe", name: "外向情感", description: "考虑社会和谐与人际关系的需要" }
    ]
  },
  "ISFP": {
    name: "探险家型",
    description: "敏感温和，享受当下，有强烈的审美意识和创造力。",
    percentage: "8.8%",
    functions: [
      { code: "Fi", name: "内向情感", description: "遵循个人价值观，重视真实和纯粹" },
      { code: "Se", name: "外向感觉", description: "关注当下体验和美感，喜欢实践和行动" },
      { code: "Ni", name: "内向直觉", description: "在艺术和创作中展现深度和远见" },
      { code: "Te", name: "外向思考", description: "组织外部环境以实现目标" }
    ]
  },
  "INFP": {
    name: "调停者型",
    description: "理想主义者，重视内在和谐与成长，富有同情心和包容力。",
    percentage: "4.4%",
    functions: [
      { code: "Fi", name: "内向情感", description: "根据内在价值观形成深层信念和道德准则" },
      { code: "Ne", name: "外向直觉", description: "探索新的可能性，寻找意义和连接" },
      { code: "Si", name: "内向感觉", description: "保存重要记忆和经验，重视传统" },
      { code: "Te", name: "外向思考", description: "在需要时组织外部世界和做出决策" }
    ]
  },
  "INTP": {
    name: "逻辑学家型",
    description: "追求逻辑和精确，喜欢理论探索，善于发现模式和解决问题。",
    percentage: "3.3%",
    functions: [
      { code: "Ti", name: "内向思考", description: "构建复杂的内部逻辑框架和理论体系" },
      { code: "Ne", name: "外向直觉", description: "探索多种可能性和理论连接" },
      { code: "Si", name: "内向感觉", description: "积累和分类详细信息和经验" },
      { code: "Fe", name: "外向情感", description: "考虑社交环境和他人情感需求" }
    ]
  },
  "ESTP": {
    name: "企业家型",
    description: "活力充沛，擅长谈判，喜欢冒险和解决实际问题。",
    percentage: "4.3%",
    functions: [
      { code: "Se", name: "外向感觉", description: "积极参与当下活动，适应迅速变化的环境" },
      { code: "Ti", name: "内向思考", description: "分析情境并快速解决问题" },
      { code: "Fe", name: "外向情感", description: "理解和影响他人情绪，社交灵活" },
      { code: "Ni", name: "内向直觉", description: "洞察长期趋势和战略方向" }
    ]
  },
  "ESFP": {
    name: "表演者型",
    description: "热情活泼，享受生活，善于交际，喜欢成为关注焦点。",
    percentage: "8.5%",
    functions: [
      { code: "Se", name: "外向感觉", description: "全身心投入当下体验，注重感官享受" },
      { code: "Fi", name: "内向情感", description: "根据个人价值观和喜好做决策" },
      { code: "Te", name: "外向思考", description: "实用地组织资源实现目标" },
      { code: "Ni", name: "内向直觉", description: "在安静时展现洞察力和远见" }
    ]
  },
  "ENFP": {
    name: "冒险家型",
    description: "热情洋溢，富有创造力，善于激励他人，渴望探索新可能。",
    percentage: "8.1%",
    functions: [
      { code: "Ne", name: "外向直觉", description: "不断探索新想法和可能性，激发创新" },
      { code: "Fi", name: "内向情感", description: "根据内在价值观和信念评判事物" },
      { code: "Te", name: "外向思考", description: "组织资源和信息，实现创意和目标" },
      { code: "Si", name: "内向感觉", description: "收集和回忆重要的个人经历" }
    ]
  },
  "ENTP": {
    name: "辩论家型",
    description: "好奇心强，思维敏捷，善于辩论，热爱挑战和创新。",
    percentage: "3.2%",
    functions: [
      { code: "Ne", name: "外向直觉", description: "发现新联系和可能性，挑战常规" },
      { code: "Ti", name: "内向思考", description: "分析概念和理论，追求逻辑一致性" },
      { code: "Fe", name: "外向情感", description: "理解群体动态和人际关系" },
      { code: "Si", name: "内向感觉", description: "整合过往经验和事实细节" }
    ]
  },
  "ESTJ": {
    name: "总经理型",
    description: "实际负责，注重传统和秩序，善于组织和管理。",
    percentage: "8.7%",
    functions: [
      { code: "Te", name: "外向思考", description: "组织人员和资源，建立清晰结构和流程" },
      { code: "Si", name: "内向感觉", description: "重视传统、秩序和经验教训" },
      { code: "Ne", name: "外向直觉", description: "考虑新方法和创新可能" },
      { code: "Fi", name: "内向情感", description: "在压力下反思个人价值观和信念" }
    ]
  },
  "ESFJ": {
    name: "执政官型",
    description: "热心友善，责任感强，重视传统和社会联系。",
    percentage: "12.3%",
    functions: [
      { code: "Fe", name: "外向情感", description: "关注他人需求，建立和谐关系和社区" },
      { code: "Si", name: "内向感觉", description: "重视传统、稳定性和具体细节" },
      { code: "Ne", name: "外向直觉", description: "探索新方法来帮助和支持他人" },
      { code: "Ti", name: "内向思考", description: "在压力下寻求逻辑和理性分析" }
    ]
  },
  "ENFJ": {
    name: "主人公型",
    description: "富有魅力和同情心，善于激励他人，渴望为集体创造积极影响。",
    percentage: "2.5%",
    functions: [
      { code: "Fe", name: "外向情感", description: "建立团队和谐，激励他人实现潜能" },
      { code: "Ni", name: "内向直觉", description: "为团队提供远见和目标方向" },
      { code: "Se", name: "外向感觉", description: "实时应对环境变化，关注现实需求" },
      { code: "Ti", name: "内向思考", description: "在安静时分析概念和做出判断" }
    ]
  },
  "ENTJ": {
    name: "指挥官型",
    description: "果断自信，战略性思考者，天生的领导者，追求效率和知识。",
    percentage: "1.8%",
    functions: [
      { code: "Te", name: "外向思考", description: "组织系统和结构，做出果断决策" },
      { code: "Ni", name: "内向直觉", description: "发展战略远见和长期计划" },
      { code: "Se", name: "外向感觉", description: "实时掌握关键信息，把握机会" },
      { code: "Fi", name: "内向情感", description: "在压力下反思个人价值观和道德" }
    ]
  }
};

module.exports = {
  questions,
  types
}; 