/**
 * MBTI人格测试简化版题库 - 31题版本
 * 每个维度约7-8题，保持测试的有效性同时减少测试时间
 */

const shortQuestions = [
  // EI维度题目 - 8题
  {
    text: "在社交场合，你通常会：",
    dimension: "EI",
    options: {
      A: "与许多人交流，能量增加",
      B: "与少数人深入交流，或更喜欢独处"
    }
  },
  {
    text: "你更倾向于：",
    dimension: "EI",
    options: {
      A: "主动发起话题，分享自己的想法",
      B: "倾听他人，深思后再发言"
    }
  },
  {
    text: "长时间的社交活动后，你通常会：",
    dimension: "EI",
    options: {
      A: "感到精力充沛，想继续互动",
      B: "需要独处时间来恢复能量"
    }
  },
  {
    text: "在工作中，你更喜欢：",
    dimension: "EI",
    options: {
      A: "团队合作，与他人一起解决问题",
      B: "独立工作，专注于自己的任务"
    }
  },
  {
    text: "当你有困难时，你更可能：",
    dimension: "EI",
    options: {
      A: "向朋友寻求建议和讨论",
      B: "自己思考解决方案"
    }
  },
  {
    text: "你认为自己：",
    dimension: "EI",
    options: {
      A: "认识很多人，社交圈广泛",
      B: "有少数亲密朋友，注重深度交流"
    }
  },
  {
    text: "周末，你更倾向于：",
    dimension: "EI",
    options: {
      A: "参加聚会或社交活动",
      B: "在家放松或与亲密朋友小聚"
    }
  },
  {
    text: "你通常被描述为：",
    dimension: "EI",
    options: {
      A: "外向、健谈的人",
      B: "内敛、安静的人"
    }
  },

  // SN维度题目 - 8题
  {
    text: "在获取信息时，你更注重：",
    dimension: "SN",
    options: {
      A: "具体事实和细节",
      B: "整体概念和可能性"
    }
  },
  {
    text: "你更欣赏：",
    dimension: "SN",
    options: {
      A: "实用性和可靠性",
      B: "创新性和独特视角"
    }
  },
  {
    text: "解决问题时，你更依赖：",
    dimension: "SN",
    options: {
      A: "过去经验和已知方法",
      B: "直觉和新颖思路"
    }
  },
  {
    text: "你更关注：",
    dimension: "SN",
    options: {
      A: "当下的现实情况",
      B: "未来的可能性"
    }
  },
  {
    text: "你更喜欢的工作是：",
    dimension: "SN",
    options: {
      A: "有明确步骤和预期结果的",
      B: "允许创新和多种可能性的"
    }
  },
  {
    text: "你更容易记住：",
    dimension: "SN",
    options: {
      A: "具体细节和事实",
      B: "概念和整体印象"
    }
  },
  {
    text: "阅读时，你更喜欢：",
    dimension: "SN",
    options: {
      A: "直接描述事件的文章",
      B: "充满隐喻和想象的文章"
    }
  },
  {
    text: "你更相信：",
    dimension: "SN",
    options: {
      A: "直接经验和观察",
      B: "理论和直觉感受"
    }
  },

  // TF维度题目 - 8题
  {
    text: "做决定时，你更倾向于考虑：",
    dimension: "TF",
    options: {
      A: "逻辑分析和客观事实",
      B: "个人价值观和对他人的影响"
    }
  },
  {
    text: "在批评他人时，你更可能：",
    dimension: "TF",
    options: {
      A: "直接指出问题，注重解决方案",
      B: "考虑对方感受，注重表达方式"
    }
  },
  {
    text: "你认为更重要的是：",
    dimension: "TF",
    options: {
      A: "保持公正和逻辑一致",
      B: "维护和谐与共识"
    }
  },
  {
    text: "面对争论，你更关注：",
    dimension: "TF",
    options: {
      A: "找出真相和正确答案",
      B: "理解各方立场和感受"
    }
  },
  {
    text: "你更喜欢的领导风格是：",
    dimension: "TF",
    options: {
      A: "公正、客观、注重结果",
      B: "体贴、和谐、关注团队氛围"
    }
  },
  {
    text: "当朋友有问题时，你更倾向于：",
    dimension: "TF",
    options: {
      A: "提供解决方案和分析",
      B: "提供情感支持和倾听"
    }
  },
  {
    text: "你更看重：",
    dimension: "TF",
    options: {
      A: "诚实直接，即使可能伤害感情",
      B: "善意体贴，避免造成不必要的伤害"
    }
  },
  {
    text: "你通常被描述为：",
    dimension: "TF",
    options: {
      A: "理性、分析型的人",
      B: "感性、富有同情心的人"
    }
  },

  // JP维度题目 - 7题
  {
    text: "你更喜欢：",
    dimension: "JP",
    options: {
      A: "有计划和安排的生活",
      B: "灵活自由的生活方式"
    }
  },
  {
    text: "面对截止日期，你通常：",
    dimension: "JP",
    options: {
      A: "提前完成任务",
      B: "在最后期限前突击完成"
    }
  },
  {
    text: "你的工作环境通常是：",
    dimension: "JP",
    options: {
      A: "井然有序，一切都有固定位置",
      B: "灵活多变，根据需要随时调整"
    }
  },
  {
    text: "旅行时，你更喜欢：",
    dimension: "JP",
    options: {
      A: "详细规划行程和活动",
      B: "保持灵活，根据情况即时决定"
    }
  },
  {
    text: "你更重视：",
    dimension: "JP",
    options: {
      A: "按时完成既定计划",
      B: "探索新的可能性和机会"
    }
  },
  {
    text: "生活中意外变化让你感到：",
    dimension: "JP",
    options: {
      A: "不安和压力",
      B: "兴奋和新鲜感"
    }
  },
  {
    text: "你更倾向于：",
    dimension: "JP",
    options: {
      A: "做决定，获得确定感",
      B: "保持选择开放，等待更多信息"
    }
  }
];

// 导出简化版题库
module.exports = shortQuestions; 