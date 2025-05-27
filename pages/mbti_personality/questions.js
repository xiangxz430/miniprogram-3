const questions = [
  // E/I维度题目 (35题)
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
    text: "在工作环境中，你更喜欢：",
    options: {
      A: "开放式办公，方便交流",
      B: "独立的空间，保持专注"
    },
    dimension: "EI"
  },
  {
    text: "面对新环境时，你会：",
    options: {
      A: "快速融入并建立联系",
      B: "慢慢适应并观察"
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
    text: "在学习新技能时，你更倾向于：",
    options: {
      A: "参加小组课程或工作坊",
      B: "自学或一对一指导"
    },
    dimension: "EI"
  },
  {
    text: "在团队项目中，你更喜欢：",
    options: {
      A: "频繁与团队成员互动",
      B: "独立完成自己的部分"
    },
    dimension: "EI"
  },
  {
    text: "当你需要充电时，你会选择：",
    options: {
      A: "与朋友出去玩",
      B: "独自放松或休息"
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
    text: "在新工作中，你会：",
    options: {
      A: "主动认识同事，建立关系",
      B: "专注于工作，逐渐熟悉环境"
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
    text: "遇到困难时，你会：",
    options: {
      A: "寻求他人帮助和建议",
      B: "自己尝试解决"
    },
    dimension: "EI"
  },
  {
    text: "在空闲时间，你更喜欢：",
    options: {
      A: "参加社交活动和聚会",
      B: "独处或安静的活动"
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
    text: "在陌生环境中，你会：",
    options: {
      A: "主动与他人交谈",
      B: "等待他人来搭话"
    },
    dimension: "EI"
  },
  {
    text: "处理问题时，你倾向于：",
    options: {
      A: "与他人讨论可能的解决方案",
      B: "独自思考和分析"
    },
    dimension: "EI"
  },
  {
    text: "在团队活动中，你更喜欢：",
    options: {
      A: "组织和领导活动",
      B: "参与和支持活动"
    },
    dimension: "EI"
  },
  {
    text: "面对新挑战时，你会：",
    options: {
      A: "寻求团队合作",
      B: "独自面对和解决"
    },
    dimension: "EI"
  },
  {
    text: "在社交网络上，你倾向于：",
    options: {
      A: "经常分享和互动",
      B: "较少发帖，主要浏览"
    },
    dimension: "EI"
  },
  {
    text: "在休息日，你更愿意：",
    options: {
      A: "参加社交活动",
      B: "独处或与家人相处"
    },
    dimension: "EI"
  },
  {
    text: "在群体活动中，你通常：",
    options: {
      A: "容易融入并活跃",
      B: "需要时间适应"
    },
    dimension: "EI"
  },
  {
    text: "当需要建议时，你会：",
    options: {
      A: "咨询多个人的意见",
      B: "自己思考或咨询最信任的人"
    },
    dimension: "EI"
  },
  {
    text: "在公共场合，你倾向于：",
    options: {
      A: "表现自然，容易与人交谈",
      B: "保持低调，较少引人注意"
    },
    dimension: "EI"
  },
  {
    text: "完成任务时，你更喜欢：",
    options: {
      A: "与他人合作",
      B: "独立完成"
    },
    dimension: "EI"
  },
  {
    text: "在新的社交场合，你会：",
    options: {
      A: "主动认识新朋友",
      B: "等待熟悉的人介绍"
    },
    dimension: "EI"
  },
  {
    text: "在工作中遇到困难时，你会：",
    options: {
      A: "寻求同事帮助",
      B: "先尝试自己解决"
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

  // S/N维度题目 (35题)
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
    text: "阅读时，你更喜欢：",
    options: {
      A: "清晰详实的描述",
      B: "富有想象力的表达"
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
    text: "你更喜欢的工作环境是：",
    options: {
      A: "稳定有序的传统环境",
      B: "充满变化和创新的环境"
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
    text: "你更喜欢的老师是：",
    options: {
      A: "讲解清晰，重视实践的",
      B: "启发思考，鼓励创新的"
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
    text: "你更喜欢的书籍类型是：",
    options: {
      A: "实用指南和历史故事",
      B: "科幻小说和理论著作"
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
    text: "你更喜欢的工作类型是：",
    options: {
      A: "有明确流程和标准的",
      B: "需要创新和突破的"
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
  {
    text: "你更喜欢的培训方式是：",
    options: {
      A: "实操演练和案例分析",
      B: "头脑风暴和理论探讨"
    },
    dimension: "SN"
  },
  {
    text: "在描述目标时，你更倾向于：",
    options: {
      A: "具体详细的行动计划",
      B: "宏观的发展愿景"
    },
    dimension: "SN"
  },
  {
    text: "你更喜欢的领导风格是：",
    options: {
      A: "务实稳健型",
      B: "创新变革型"
    },
    dimension: "SN"
  },
  {
    text: "在解决问题时，你更依靠：",
    options: {
      A: "已证实的方法和经验",
      B: "创新的思路和直觉"
    },
    dimension: "SN"
  },
  {
    text: "你更关注：",
    options: {
      A: "现实中的实际问题",
      B: "未来的发展趋势"
    },
    dimension: "SN"
  },
  {
    text: "在工作报告中，你更重视：",
    options: {
      A: "具体数据和客观事实",
      B: "趋势分析和前景预测"
    },
    dimension: "SN"
  },
  {
    text: "你更喜欢的游戏类型是：",
    options: {
      A: "基于现实的模拟游戏",
      B: "富有想象力的角色扮演"
    },
    dimension: "SN"
  },
  {
    text: "在学习新事物时，你更喜欢：",
    options: {
      A: "循序渐进的实践",
      B: "跳跃性的思考"
    },
    dimension: "SN"
  },
  {
    text: "在处理信息时，你更擅长：",
    options: {
      A: "关注细节和具体事实",
      B: "寻找规律和关联"
    },
    dimension: "SN"
  },
  {
    text: "你更喜欢的工作任务是：",
    options: {
      A: "明确具体的常规工作",
      B: "需要创意的开放性工作"
    },
    dimension: "SN"
  },
  {
    text: "在规划未来时，你更倾向于：",
    options: {
      A: "制定具体可行的计划",
      B: "构想理想的愿景"
    },
    dimension: "SN"
  },
  {
    text: "在解决问题时，你更看重：",
    options: {
      A: "实际效果",
      B: "创新程度"
    },
    dimension: "SN"
  },
  {
    text: "你更喜欢的环境是：",
    options: {
      A: "有序可预测的",
      B: "充满变化和可能的"
    },
    dimension: "SN"
  },
  {
    text: "在做决策时，你更依赖：",
    options: {
      A: "过往经验和现实条件",
      B: "直觉判断和未来展望"
    },
    dimension: "SN"
  },
  {
    text: "你对未来的态度是：",
    options: {
      A: "脚踏实地，循序渐进",
      B: "充满想象，期待可能"
    },
    dimension: "SN"
  },

  // T/F维度题目 (35题)
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
    text: "在选择工作时，你更重视：",
    options: {
      A: "职业发展和待遇",
      B: "工作环境和人际关系"
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
    text: "在团队讨论中，你更注重：",
    options: {
      A: "目标达成",
      B: "成员参与"
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
    text: "在处理矛盾时，你更倾向于：",
    options: {
      A: "分析原因",
      B: "调解关系"
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
    text: "在面对挑战时，你更重视：",
    options: {
      A: "解决方案的可行性",
      B: "团队成员的接受度"
    },
    dimension: "TF"
  },
  {
    text: "在处理投诉时，你更注重：",
    options: {
      A: "问题的解决",
      B: "客户的感受"
    },
    dimension: "TF"
  },
  {
    text: "在给予表扬时，你更倾向于：",
    options: {
      A: "肯定具体成果",
      B: "鼓励个人成长"
    },
    dimension: "TF"
  },
  {
    text: "在工作汇报时，你更重视：",
    options: {
      A: "数据和事实",
      B: "过程和体会"
    },
    dimension: "TF"
  },
  {
    text: "在处理失误时，你更关注：",
    options: {
      A: "原因分析和改进",
      B: "责任认识和成长"
    },
    dimension: "TF"
  },
  {
    text: "在团队合作时，你更看重：",
    options: {
      A: "效率和质量",
      B: "配合和氛围"
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
    text: "在选择方案时，你更重视：",
    options: {
      A: "成本效益",
      B: "人文关怀"
    },
    dimension: "TF"
  },
  {
    text: "在处理变动时，你更关注：",
    options: {
      A: "影响和结果",
      B: "过程和感受"
    },
    dimension: "TF"
  },
  {
    text: "在提供帮助时，你更倾向于：",
    options: {
      A: "解决实际问题",
      B: "提供情感支持"
    },
    dimension: "TF"
  },
  {
    text: "在评估表现时，你更看重：",
    options: {
      A: "客观指标",
      B: "主观努力"
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
  {
    text: "在做选择时，你更依赖：",
    options: {
      A: "理性分析",
      B: "价值判断"
    },
    dimension: "TF"
  },
  {
    text: "在处理反馈时，你更关注：",
    options: {
      A: "内容的准确性",
      B: "表达的方式"
    },
    dimension: "TF"
  },
  {
    text: "在团队领导中，你更重视：",
    options: {
      A: "目标完成",
      B: "成员发展"
    },
    dimension: "TF"
  },
  {
    text: "在解决问题时，你更看重：",
    options: {
      A: "效率优先",
      B: "关系优先"
    },
    dimension: "TF"
  },
  {
    text: "在处理建议时，你更倾向于：",
    options: {
      A: "评估可行性",
      B: "考虑认可度"
    },
    dimension: "TF"
  },
  {
    text: "在工作中，你更注重：",
    options: {
      A: "任务达成",
      B: "团队和谐"
    },
    dimension: "TF"
  },
  {
    text: "在处理争执时，你更倾向于：",
    options: {
      A: "讲求公平",
      B: "追求和谐"
    },
    dimension: "TF"
  },

  // J/P维度题目 (36题)
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
    text: "你更喜欢的工作方式是：",
    options: {
      A: "有明确的流程和规范",
      B: "自由发挥的空间"
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
    text: "对于计划，你更倾向于：",
    options: {
      A: "严格执行",
      B: "根据情况调整"
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
    text: "对于约会时间，你更喜欢：",
    options: {
      A: "确定具体时间",
      B: "保持灵活"
    },
    dimension: "JP"
  },
  {
    text: "在工作场所，你更注重：",
    options: {
      A: "整洁有序",
      B: "舒适随意"
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
    text: "你更喜欢的生活方式是：",
    options: {
      A: "规律有序",
      B: "随性自由"
    },
    dimension: "JP"
  },
  {
    text: "在项目管理中，你更重视：",
    options: {
      A: "按计划推进",
      B: "灵活调整"
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
    text: "在时间管理上，你更喜欢：",
    options: {
      A: "详细规划",
      B: "即兴安排"
    },
    dimension: "JP"
  },
  {
    text: "对于目标，你更倾向于：",
    options: {
      A: "制定明确的计划",
      B: "保持方向的灵活性"
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
    text: "对于决策，你更倾向于：",
    options: {
      A: "及时做出决定",
      B: "保持选项开放"
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
    text: "对于安排，你更倾向于：",
    options: {
      A: "提前计划",
      B: "临时决定"
    },
    dimension: "JP"
  },
  {
    text: "在工作中，你更喜欢：",
    options: {
      A: "明确的截止日期",
      B: "弹性的完成时间"
    },
    dimension: "JP"
  },
  {
    text: "对于计划变更，你的态度是：",
    options: {
      A: "尽量避免",
      B: "随时接受"
    },
    dimension: "JP"
  },
  {
    text: "在执行任务时，你更倾向于：",
    options: {
      A: "按步骤进行",
      B: "灵活处理"
    },
    dimension: "JP"
  },
  {
    text: "对于工作环境，你更喜欢：",
    options: {
      A: "结构化的",
      B: "适应性的"
    },
    dimension: "JP"
  },
  {
    text: "在处理事务时，你更倾向于：",
    options: {
      A: "立即处理",
      B: "等待合适时机"
    },
    dimension: "JP"
  },
  {
    text: "对于会议，你更喜欢：",
    options: {
      A: "有明确的议程",
      B: "开放式讨论"
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
  },
  {
    text: "对于任务完成，你更倾向于：",
    options: {
      A: "按时完成",
      B: "弹性处理"
    },
    dimension: "JP"
  },
  {
    text: "在处理文件时，你更喜欢：",
    options: {
      A: "系统整理",
      B: "随手放置"
    },
    dimension: "JP"
  },
  {
    text: "对于约定，你的态度是：",
    options: {
      A: "严格遵守",
      B: "视情况调整"
    },
    dimension: "JP"
  },
  {
    text: "在完成项目时，你更倾向于：",
    options: {
      A: "按计划执行",
      B: "根据情况调整"
    },
    dimension: "JP"
  },
  {
    text: "对于生活节奏，你更喜欢：",
    options: {
      A: "规律稳定",
      B: "随性自由"
    },
    dimension: "JP"
  },
  {
    text: "在做决策时，你更倾向于：",
    options: {
      A: "快速决定",
      B: "保持开放"
    },
    dimension: "JP"
  }
]

// 为每个问题添加索引
questions.forEach((q, index) => {
  q.id = index + 1
})

// export default questions
module.exports = questions 