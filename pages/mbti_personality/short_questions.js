const shortQuestions = [
  // E/I维度题目 (15题)
  {
    text: "在社交场合中，你通常会：",
    options: {
      A: "主动与他人交谈，认识新朋友",
      B: "等待他人来与你交谈"
    },
    dimension: "EI"
  },
  {
    text: "与他人相处时，你倾向于：",
    options: {
      A: "广泛交友，保持开放的社交圈",
      B: "与少数密友保持深入的关系"
    },
    dimension: "EI"
  },
  {
    text: "在团体活动中，你更喜欢：",
    options: {
      A: "成为注意力的焦点",
      B: "作为观察者或支持者"
    },
    dimension: "EI"
  },
  {
    text: "休息时，你更倾向于：",
    options: {
      A: "外出参加社交活动",
      B: "在家独处或与亲密的人相处"
    },
    dimension: "EI"
  },
  {
    text: "遇到问题时，你会：",
    options: {
      A: "与他人讨论以获得想法",
      B: "独自思考解决方案"
    },
    dimension: "EI"
  },
  {
    text: "在会议中，你倾向于：",
    options: {
      A: "积极发言，分享想法",
      B: "仔细聆听，必要时发言"
    },
    dimension: "EI"
  },
  {
    text: "处理情绪时，你更倾向于：",
    options: {
      A: "向他人倾诉寻求支持",
      B: "自己消化和处理"
    },
    dimension: "EI"
  },
  {
    text: "周末时，你更喜欢：",
    options: {
      A: "参加聚会或群体活动",
      B: "进行独处或安静的活动"
    },
    dimension: "EI"
  },
  {
    text: "在派对上，你通常会：",
    options: {
      A: "与多人交谈，保持活跃",
      B: "与一两个人进行深入交谈"
    },
    dimension: "EI"
  },
  {
    text: "面对压力时，你会：",
    options: {
      A: "寻找他人倾诉和支持",
      B: "独自思考和解决"
    },
    dimension: "EI"
  },
  {
    text: "在决策时，你倾向于：",
    options: {
      A: "征求他人意见和建议",
      B: "独立思考和判断"
    },
    dimension: "EI"
  },
  {
    text: "在团体讨论中，你通常：",
    options: {
      A: "积极参与和发言",
      B: "更多倾听和观察"
    },
    dimension: "EI"
  },
  {
    text: "当有好消息时，你会：",
    options: {
      A: "立即与他人分享",
      B: "等待合适的时机再告诉他人"
    },
    dimension: "EI"
  },
  {
    text: "在工作场合，你更喜欢：",
    options: {
      A: "团队合作的项目",
      B: "独立负责的任务"
    },
    dimension: "EI"
  },
  {
    text: "在闲暇时光，你更喜欢：",
    options: {
      A: "与朋友一起活动",
      B: "独自享受时光"
    },
    dimension: "EI"
  },

  // S/N维度题目 (15题)
  {
    text: "在解决问题时，你更倾向于：",
    options: {
      A: "关注具体的事实和细节",
      B: "寻找潜在的模式和可能性"
    },
    dimension: "SN"
  },
  {
    text: "当面对新项目时，你通常会：",
    options: {
      A: "按步就班地执行已proven的方法",
      B: "尝试创新的解决方案"
    },
    dimension: "SN"
  },
  {
    text: "在学习新知识时，你更关注：",
    options: {
      A: "实际应用和具体例子",
      B: "概念和理论框架"
    },
    dimension: "SN"
  },
  {
    text: "在工作中，你更重视：",
    options: {
      A: "实践经验和具体成果",
      B: "创新想法和未来可能"
    },
    dimension: "SN"
  },
  {
    text: "解决问题时，你更依赖：",
    options: {
      A: "过往的经验和事实",
      B: "直觉和灵感"
    },
    dimension: "SN"
  },
  {
    text: "在描述事物时，你倾向于：",
    options: {
      A: "具体而详细",
      B: "比喻和联想"
    },
    dimension: "SN"
  },
  {
    text: "你更相信：",
    options: {
      A: "亲眼所见和实际体验",
      B: "直觉感受和未来预测"
    },
    dimension: "SN"
  },
  {
    text: "在做计划时，你更注重：",
    options: {
      A: "现实可行性",
      B: "创新可能性"
    },
    dimension: "SN"
  },
  {
    text: "在观察事物时，你更注意：",
    options: {
      A: "当前的实际状况",
      B: "未来的发展可能"
    },
    dimension: "SN"
  },
  {
    text: "面对新技术时，你更关注：",
    options: {
      A: "具体的使用方法",
      B: "潜在的应用可能"
    },
    dimension: "SN"
  },
  {
    text: "在处理任务时，你更擅长：",
    options: {
      A: "按既定流程完成",
      B: "探索新的方法"
    },
    dimension: "SN"
  },
  {
    text: "在团队中，你的优势是：",
    options: {
      A: "执行力和实践能力",
      B: "创新力和洞察力"
    },
    dimension: "SN"
  },
  {
    text: "做决定时，你更看重：",
    options: {
      A: "现实条件和具体情况",
      B: "未来影响和发展前景"
    },
    dimension: "SN"
  },
  {
    text: "在谈话中，你更倾向于讨论：",
    options: {
      A: "具体的事件和经历",
      B: "抽象的概念和想法"
    },
    dimension: "SN"
  },
  {
    text: "在评估方案时，你更关注：",
    options: {
      A: "实际可行性和具体细节",
      B: "创新程度和未来潜力"
    },
    dimension: "SN"
  },

  // T/F维度题目 (15题)
  {
    text: "做决定时，你更看重：",
    options: {
      A: "逻辑和客观分析",
      B: "个人价值观和感受"
    },
    dimension: "TF"
  },
  {
    text: "在团队中，你更倾向于：",
    options: {
      A: "保持专业和理性",
      B: "注重和谐与人际关系"
    },
    dimension: "TF"
  },
  {
    text: "在处理冲突时，你会：",
    options: {
      A: "分析问题，寻找解决方案",
      B: "考虑各方感受，寻求共识"
    },
    dimension: "TF"
  },
  {
    text: "当朋友遇到问题时，你会：",
    options: {
      A: "提供解决方案和建议",
      B: "倾听和情感支持"
    },
    dimension: "TF"
  },
  {
    text: "在评价他人时，你更注重：",
    options: {
      A: "能力和成果",
      B: "态度和努力"
    },
    dimension: "TF"
  },
  {
    text: "在工作中，你更重视：",
    options: {
      A: "效率和结果",
      B: "团队氛围和协作"
    },
    dimension: "TF"
  },
  {
    text: "面对批评时，你更关注：",
    options: {
      A: "批评的合理性",
      B: "表达的方式"
    },
    dimension: "TF"
  },
  {
    text: "在给出反馈时，你更倾向于：",
    options: {
      A: "直接指出问题",
      B: "委婉表达建议"
    },
    dimension: "TF"
  },
  {
    text: "在处理分歧时，你更看重：",
    options: {
      A: "事实和逻辑",
      B: "情感和关系"
    },
    dimension: "TF"
  },
  {
    text: "在表达观点时，你更倾向于：",
    options: {
      A: "客观分析利弊",
      B: "考虑他人感受"
    },
    dimension: "TF"
  },
  {
    text: "在处理问题时，你更依赖：",
    options: {
      A: "逻辑思维",
      B: "价值判断"
    },
    dimension: "TF"
  },
  {
    text: "在做决策时，你更看重：",
    options: {
      A: "客观事实",
      B: "主观感受"
    },
    dimension: "TF"
  },
  {
    text: "在评价项目时，你更关注：",
    options: {
      A: "完成度和效果",
      B: "团队合作和过程"
    },
    dimension: "TF"
  },
  {
    text: "在解决争议时，你更倾向于：",
    options: {
      A: "讲道理",
      B: "讲情面"
    },
    dimension: "TF"
  },
  {
    text: "在处理意见时，你更重视：",
    options: {
      A: "合理性分析",
      B: "情感表达"
    },
    dimension: "TF"
  },

  // J/P维度题目 (14题)
  {
    text: "你更喜欢：",
    options: {
      A: "按计划行事，提前安排",
      B: "随机应变，保持灵活"
    },
    dimension: "JP"
  },
  {
    text: "对于deadline，你通常会：",
    options: {
      A: "提前完成任务",
      B: "在最后期限前完成"
    },
    dimension: "JP"
  },
  {
    text: "在工作中，你更倾向于：",
    options: {
      A: "制定详细的计划",
      B: "根据情况随机应变"
    },
    dimension: "JP"
  },
  {
    text: "对于规则，你的态度是：",
    options: {
      A: "严格遵守",
      B: "灵活变通"
    },
    dimension: "JP"
  },
  {
    text: "在安排时间时，你更倾向于：",
    options: {
      A: "制定具体的计划表",
      B: "保持时间的灵活性"
    },
    dimension: "JP"
  },
  {
    text: "对于变化，你的态度是：",
    options: {
      A: "谨慎对待，充分准备",
      B: "欣然接受，随机应对"
    },
    dimension: "JP"
  },
  {
    text: "在做决定时，你更喜欢：",
    options: {
      A: "尽快做出决定",
      B: "保持选项开放"
    },
    dimension: "JP"
  },
  {
    text: "你更喜欢的环境是：",
    options: {
      A: "井然有序",
      B: "灵活多变"
    },
    dimension: "JP"
  },
  {
    text: "在处理任务时，你更倾向于：",
    options: {
      A: "一次完成一项",
      B: "同时进行多项"
    },
    dimension: "JP"
  },
  {
    text: "面对新任务，你会：",
    options: {
      A: "先制定计划再开始",
      B: "直接开始尝试"
    },
    dimension: "JP"
  },
  {
    text: "对于意外情况，你更倾向于：",
    options: {
      A: "提前预防",
      B: "临时应对"
    },
    dimension: "JP"
  },
  {
    text: "在日常生活中，你更喜欢：",
    options: {
      A: "按部就班",
      B: "随机应变"
    },
    dimension: "JP"
  },
  {
    text: "在处理问题时，你更喜欢：",
    options: {
      A: "系统化的方法",
      B: "灵活的方式"
    },
    dimension: "JP"
  },
  {
    text: "在生活中，你更注重：",
    options: {
      A: "计划性",
      B: "自发性"
    },
    dimension: "JP"
  }
]

// 为每个问题添加索引
shortQuestions.forEach((q, index) => {
  q.id = index + 1
})

export default shortQuestions 