// MBTI测试问题 - 共141题
const questions = [
  // EI维度问题 (1-35)
  {
    question: "在社交场合，我通常：",
    optionA: "与很多人交谈，包括不认识的人",
    optionB: "主要与认识的朋友交谈",
    dimension: "EI"
  },
  {
    question: "我倾向于：",
    optionA: "先说出想法，然后思考",
    optionB: "先思考，然后再表达想法",
    dimension: "EI"
  },
  {
    question: "当我需要在团队中完成工作时，我更喜欢：",
    optionA: "积极参与讨论并提出建议",
    optionB: "先听取他人意见，然后提供自己的想法",
    dimension: "EI"
  },
  {
    question: "在闲暇时间，我更倾向于：",
    optionA: "参加社交活动，与朋友相处",
    optionB: "独自进行自己感兴趣的活动",
    dimension: "EI"
  },
  {
    question: "我更喜欢的工作环境是：",
    optionA: "开放的办公室，可以随时与同事交流",
    optionB: "相对安静，可以专注思考的空间",
    dimension: "EI"
  },
  {
    question: "当面对新环境时，我通常会：",
    optionA: "主动与人交流，快速融入",
    optionB: "花时间观察，慢慢适应",
    dimension: "EI"
  },
  {
    question: "我认为自己是：",
    optionA: "善于表达，容易被人了解的人",
    optionB: "内敛深沉，需要时间被人了解的人",
    dimension: "EI"
  },
  {
    question: "在会议上，我更倾向于：",
    optionA: "积极发言，分享自己的想法",
    optionB: "仔细聆听，必要时才发言",
    dimension: "EI"
  },
  {
    question: "经过一天忙碌的工作或学习后，我更喜欢：",
    optionA: "与朋友聚会，放松心情",
    optionB: "独处一段时间，恢复精力",
    dimension: "EI"
  },
  {
    question: "当需要解决问题时，我通常会：",
    optionA: "与他人讨论，集思广益",
    optionB: "自己思考，形成方案后再与人分享",
    dimension: "EI"
  },
  {
    question: "我获取能量的方式更多是通过：",
    optionA: "与人互动和交流",
    optionB: "自我反思和内心探索",
    dimension: "EI"
  },
  {
    question: "在团队项目中，我更喜欢：",
    optionA: "参与多人合作的任务",
    optionB: "负责可以独立完成的部分",
    dimension: "EI"
  },
  {
    question: "当遇到困难时，我更倾向于：",
    optionA: "寻求他人的建议和支持",
    optionB: "自己思考解决方案",
    dimension: "EI"
  },
  {
    question: "我更容易：",
    optionA: "在集体环境中感到舒适和自在",
    optionB: "在独处时感到放松和自在",
    dimension: "EI"
  },
  {
    question: "我通常被描述为：",
    optionA: "外向、健谈的人",
    optionB: "内敛、安静的人",
    dimension: "EI"
  },
  {
    question: "在做决定前，我倾向于：",
    optionA: "与他人讨论，听取不同意见",
    optionB: "独自思考，权衡各种因素",
    dimension: "EI"
  },
  {
    question: "当面对新的社交场合时，我的感受通常是：",
    optionA: "兴奋和期待",
    optionB: "有些紧张或疲惫",
    dimension: "EI"
  },
  {
    question: "我更喜欢的学习方式是：",
    optionA: "小组讨论和互动",
    optionB: "自学和独立研究",
    dimension: "EI"
  },
  {
    question: "当我有好消息时，我通常会：",
    optionA: "立即与多人分享",
    optionB: "只告诉亲近的人",
    dimension: "EI"
  },
  {
    question: "我更容易建立：",
    optionA: "广泛的社交圈，认识很多人",
    optionB: "深厚的友谊，但朋友数量较少",
    dimension: "EI"
  },
  {
    question: "在休闲活动中，我更喜欢：",
    optionA: "参加聚会或团体活动",
    optionB: "进行个人爱好或与一两个朋友相处",
    dimension: "EI"
  },
  {
    question: "当我需要激励自己时，我通常会：",
    optionA: "寻求他人的支持和鼓励",
    optionB: "依靠自己的内在动力",
    dimension: "EI"
  },
  {
    question: "我更喜欢的工作方式是：",
    optionA: "与团队成员频繁互动",
    optionB: "相对独立，定期汇报进度",
    dimension: "EI"
  },
  {
    question: "在旅行时，我更倾向于：",
    optionA: "结交新朋友，体验当地社交文化",
    optionB: "观察当地风景和文化，保持个人空间",
    dimension: "EI"
  },
  {
    question: "我的理想周末是：",
    optionA: "参加社交活动，与朋友共度时光",
    optionB: "有充足的个人时间，做自己喜欢的事",
    dimension: "EI"
  },
  {
    question: "当我思考问题时，我更倾向于：",
    optionA: "边说边思考，通过交流澄清想法",
    optionB: "内心思考成熟后再与人分享",
    dimension: "EI"
  },
  {
    question: "在接受新工作或任务时，我更关注：",
    optionA: "团队协作和人际关系",
    optionB: "工作内容和个人发展空间",
    dimension: "EI"
  },
  {
    question: "我更喜欢的居住环境是：",
    optionA: "热闹、便于社交的地方",
    optionB: "安静、私密的空间",
    dimension: "EI"
  },
  {
    question: "当我遇到问题需要解决时，我更倾向于：",
    optionA: "马上与他人讨论可能的解决方案",
    optionB: "先自己思考，整理好想法后再分享",
    dimension: "EI"
  },
  {
    question: "我在以下场景中感觉更舒适：",
    optionA: "热闹的派对或聚会",
    optionB: "与一两个好友的深入交谈",
    dimension: "EI"
  },
  {
    question: "在新的工作环境中，我通常会：",
    optionA: "主动认识同事，快速建立关系网",
    optionB: "专注于工作任务，随着时间逐渐认识同事",
    dimension: "EI"
  },
  {
    question: "我更容易：",
    optionA: "在社交活动后感到精力充沛",
    optionB: "在独处后感到精力恢复",
    dimension: "EI"
  },
  {
    question: "当面对重要决定时，我倾向于：",
    optionA: "咨询多人意见，讨论各种可能性",
    optionB: "独自深入思考，可能只与少数人商量",
    dimension: "EI"
  },
  {
    question: "我更喜欢的沟通方式是：",
    optionA: "面对面交流或电话联系",
    optionB: "文字交流如邮件或消息",
    dimension: "EI"
  },
  {
    question: "我通常被他人描述为：",
    optionA: "活力四射、善于社交的人",
    optionB: "深思熟虑、善于倾听的人",
    dimension: "EI"
  },
  
  // SN维度问题 (36-70)
  {
    question: "当解决问题时，我更倾向于：",
    optionA: "依靠经验和已知的解决方案",
    optionB: "尝试创新的方法和想法",
    dimension: "SN"
  },
  {
    question: "我更关注：",
    optionA: "当前的实际情况和具体细节",
    optionB: "未来的可能性和整体概念",
    dimension: "SN"
  },
  {
    question: "我更喜欢阅读的内容是：",
    optionA: "描述现实生活的作品",
    optionB: "充满想象力和创意的作品",
    dimension: "SN"
  },
  {
    question: "我更感兴趣的是：",
    optionA: "实际可行的方案和计划",
    optionB: "新的创意和可能性",
    dimension: "SN"
  },
  {
    question: "在工作中，我更注重：",
    optionA: "按照既定流程完成任务",
    optionB: "探索改进流程的新方法",
    dimension: "SN"
  },
  {
    question: "我认为更重要的是：",
    optionA: "脚踏实地，关注现实",
    optionB: "具有远见，关注未来",
    dimension: "SN"
  },
  {
    question: "我更容易记住：",
    optionA: "具体的事实和细节",
    optionB: "概念和理论",
    dimension: "SN"
  },
  {
    question: "我更倾向于：",
    optionA: "相信亲眼所见和实际体验",
    optionB: "寻找事物背后的意义和联系",
    dimension: "SN"
  },
  {
    question: "我更喜欢的工作是：",
    optionA: "有明确指导和具体步骤的工作",
    optionB: "允许发挥创意和想象力的工作",
    dimension: "SN"
  },
  {
    question: "当描述事物时，我倾向于：",
    optionA: "提供准确的细节和具体事实",
    optionB: "使用比喻和类比，关注整体印象",
    dimension: "SN"
  },
  {
    question: "我更相信：",
    optionA: "实际经验和可靠数据",
    optionB: "直觉和灵感",
    dimension: "SN"
  },
  {
    question: "我更欣赏的人是：",
    optionA: "实际、可靠的人",
    optionB: "富有想象力、创新的人",
    dimension: "SN"
  },
  {
    question: "在做决定时，我更看重：",
    optionA: "已经证实的方法和经验",
    optionB: "新的可能性和创新方法",
    dimension: "SN"
  },
  {
    question: "我更愿意：",
    optionA: "专注于当下和实际情况",
    optionB: "思考未来和可能性",
    dimension: "SN"
  },
  {
    question: "我更倾向于：",
    optionA: "注重实际应用和具体结果",
    optionB: "关注概念和理论框架",
    dimension: "SN"
  },
  {
    question: "在学习新知识时，我更喜欢：",
    optionA: "从具体实例开始，逐步理解原理",
    optionB: "先了解整体概念，再关注细节",
    dimension: "SN"
  },
  {
    question: "我更关注：",
    optionA: "如何有效解决当前问题",
    optionB: "未来可能出现的机会和挑战",
    dimension: "SN"
  },
  {
    question: "在解释事物时，我倾向于：",
    optionA: "使用具体的例子和事实",
    optionB: "探讨概念和理论",
    dimension: "SN"
  },
  {
    question: "我更看重：",
    optionA: "实际经验和现实观察",
    optionB: "理论知识和抽象思考",
    dimension: "SN"
  },
  {
    question: "我认为自己更像：",
    optionA: "脚踏实地、注重细节的实践者",
    optionB: "富有想象力、关注可能性的思想家",
    dimension: "SN"
  },
  {
    question: "在进行项目时，我更注重：",
    optionA: "按部就班地执行计划",
    optionB: "不断调整和创新方法",
    dimension: "SN"
  },
  {
    question: "我更容易：",
    optionA: "注意到具体的细节和实际情况",
    optionB: "发现潜在的模式和联系",
    dimension: "SN"
  },
  {
    question: "我更喜欢的课程或工作内容是：",
    optionA: "有明确结构和实际应用的",
    optionB: "探索性质和理论导向的",
    dimension: "SN"
  },
  {
    question: "我更倾向于：",
    optionA: "保持传统和验证过的方法",
    optionB: "尝试新方法和创新思路",
    dimension: "SN"
  },
  {
    question: "在解决问题时，我更依赖：",
    optionA: "过去的经验和已知事实",
    optionB: "直觉和创新思维",
    dimension: "SN"
  },
  {
    question: "我更关注：",
    optionA: "事物的实际用途和功能",
    optionB: "事物的潜在发展和可能性",
    dimension: "SN"
  },
  {
    question: "我认为更重要的是：",
    optionA: "掌握实用技能和具体知识",
    optionB: "培养创造力和想象力",
    dimension: "SN"
  },
  {
    question: "在讨论中，我更倾向于：",
    optionA: "关注具体事实和现实考量",
    optionB: "探索不同的观点和可能性",
    dimension: "SN"
  },
  {
    question: "我更欣赏的作品是：",
    optionA: "描述具体现实和生活的",
    optionB: "表达创意和独特想法的",
    dimension: "SN"
  },
  {
    question: "在旅行时，我更看重：",
    optionA: "具体的体验和实际安排",
    optionB: "探索未知和发现新可能",
    dimension: "SN"
  },
  {
    question: "我更擅长：",
    optionA: "处理具体数据和实际问题",
    optionB: "提出新想法和概念性思考",
    dimension: "SN"
  },
  {
    question: "对我来说，更有价值的是：",
    optionA: "切实可行的方法和成果",
    optionB: "创新的想法和未来展望",
    dimension: "SN"
  },
  {
    question: "我更愿意从事：",
    optionA: "能看到具体成果的工作",
    optionB: "允许创新和探索的工作",
    dimension: "SN"
  },
  {
    question: "我通常被描述为：",
    optionA: "现实、实际的人",
    optionB: "有创意、有远见的人",
    dimension: "SN"
  },
  
  // TF维度问题 (71-105)
  {
    question: "在做决定时，我更倾向于：",
    optionA: "依据逻辑和分析",
    optionB: "考虑人的感受和价值观",
    dimension: "TF"
  },
  {
    question: "我认为更重要的是：",
    optionA: "保持客观和公正",
    optionB: "保持和谐与同理心",
    dimension: "TF"
  },
  {
    question: "当朋友面临问题时，我更倾向于：",
    optionA: "分析情况并提供解决方案",
    optionB: "提供情感支持和理解",
    dimension: "TF"
  },
  {
    question: "在评价他人工作时，我更注重：",
    optionA: "工作的质量和效率",
    optionB: "付出的努力和态度",
    dimension: "TF"
  },
  {
    question: "我更看重：",
    optionA: "清晰的规则和公平的标准",
    optionB: "个人情况和特殊需求",
    dimension: "TF"
  },
  {
    question: "在处理冲突时，我更倾向于：",
    optionA: "直接指出问题所在",
    optionB: "考虑各方感受，寻求和谐",
    dimension: "TF"
  },
  {
    question: "我认为自己更像：",
    optionA: "头脑冷静、理性分析的人",
    optionB: "富有同情心、关注他人的人",
    dimension: "TF"
  },
  {
    question: "当需要做出困难决定时，我更相信：",
    optionA: "逻辑推理和客观分析",
    optionB: "个人价值观和对他人的影响",
    dimension: "TF"
  },
  {
    question: "我更容易被以下品质打动：",
    optionA: "思维清晰和逻辑严密",
    optionB: "真诚善良和富有同情心",
    dimension: "TF"
  },
  {
    question: "在团队中，我更看重：",
    optionA: "能力和效率",
    optionB: "合作和谐与相互支持",
    dimension: "TF"
  },
  {
    question: "我更喜欢的工作环境是：",
    optionA: "注重结果和绩效的",
    optionB: "重视团队氛围和个人发展的",
    dimension: "TF"
  },
  {
    question: "我更关注：",
    optionA: "事物的客观事实和逻辑",
    optionB: "事物对人的影响和意义",
    dimension: "TF"
  },
  {
    question: "在给予反馈时，我更倾向于：",
    optionA: "直接坦率地指出问题",
    optionB: "注意措辞，避免伤害对方感受",
    dimension: "TF"
  },
  {
    question: "我更欣赏的领导风格是：",
    optionA: "有原则，注重绩效和结果",
    optionB: "理解下属，关注团队和谐",
    dimension: "TF"
  },
  {
    question: "在解决问题时，我更重视：",
    optionA: "找到最有效的解决方案",
    optionB: "考虑方案对所有人的影响",
    dimension: "TF"
  },
  {
    question: "当面对矛盾观点时，我更倾向于：",
    optionA: "分析各方论据，找出逻辑漏洞",
    optionB: "理解各方立场，寻求共识",
    dimension: "TF"
  },
  {
    question: "我更容易：",
    optionA: "保持客观，不受情绪影响",
    optionB: "感同身受，关注情感变化",
    dimension: "TF"
  },
  {
    question: "在做决策时，我更重视：",
    optionA: "事实、原则和逻辑分析",
    optionB: "价值观、和谐与个人感受",
    dimension: "TF"
  },
  {
    question: "我更喜欢的沟通方式是：",
    optionA: "直接、简洁、基于事实",
    optionB: "体贴、友善、考虑关系",
    dimension: "TF"
  },
  {
    question: "在评估一个想法时，我首先考虑：",
    optionA: "它是否合理、有效",
    optionB: "它对人们的影响如何",
    dimension: "TF"
  },
  {
    question: "我更擅长：",
    optionA: "分析问题，找出解决方案",
    optionB: "理解他人，建立良好关系",
    dimension: "TF"
  },
  {
    question: "我更倾向于：",
    optionA: "基于客观标准做决定",
    optionB: "考虑个人价值观和人际关系",
    dimension: "TF"
  },
  {
    question: "我通常被描述为：",
    optionA: "理性、客观的人",
    optionB: "热情、体贴的人",
    dimension: "TF"
  },
  {
    question: "在工作中，我更看重：",
    optionA: "达成目标和解决问题",
    optionB: "保持团队和谐和成员满意度",
    dimension: "TF"
  },
  {
    question: "在面对批评时，我更希望：",
    optionA: "直接坦率地指出问题",
    optionB: "照顾我的感受，委婉表达",
    dimension: "TF"
  },
  {
    question: "我更容易被说服的方式是：",
    optionA: "通过逻辑和数据",
    optionB: "通过价值观和个人故事",
    dimension: "TF"
  },
  {
    question: "在团队讨论中，我更倾向于：",
    optionA: "关注任务和目标",
    optionB: "关注成员感受和参与度",
    dimension: "TF"
  },
  {
    question: "我更欣赏的品质是：",
    optionA: "清晰的思维和坚定的立场",
    optionB: "同理心和处理关系的能力",
    dimension: "TF"
  },
  {
    question: "我认为更重要的是：",
    optionA: "公正对待每个人",
    optionB: "根据个人需求提供帮助",
    dimension: "TF"
  },
  {
    question: "当需要批评他人时，我更倾向于：",
    optionA: "直接指出问题，不回避真相",
    optionB: "考虑对方感受，委婉表达",
    dimension: "TF"
  },
  {
    question: "我在决策时更看重：",
    optionA: "是非对错和客观事实",
    optionB: "人际关系和情感因素",
    dimension: "TF"
  },
  {
    question: "我更倾向于：",
    optionA: "提出不同意见，挑战现有观点",
    optionB: "寻求共识，避免冲突",
    dimension: "TF"
  },
  {
    question: "我通常被他人视为：",
    optionA: "公正冷静的分析者",
    optionB: "友善暖心的支持者",
    dimension: "TF"
  },
  
  // JP维度问题 (106-141)
  {
    question: "我更喜欢：",
    optionA: "计划好的、有条理的生活",
    optionB: "灵活的、随性的生活",
    dimension: "JP"
  },
  {
    question: "我倾向于：",
    optionA: "按照计划和日程行事",
    optionB: "根据情况随时调整安排",
    dimension: "JP"
  },
  {
    question: "我更看重：",
    optionA: "按时完成任务，达成目标",
    optionB: "探索过程，保持开放性",
    dimension: "JP"
  },
  {
    question: "我的工作空间通常：",
    optionA: "整洁有序，物品摆放规整",
    optionB: "随性自然，物品触手可及",
    dimension: "JP"
  },
  {
    question: "对于截止日期，我更倾向于：",
    optionA: "提前完成，避免最后匆忙",
    optionB: "接近截止时才有灵感和动力",
    dimension: "JP"
  },
  {
    question: "我更享受：",
    optionA: "有明确计划的活动",
    optionB: "即兴决定的活动",
    dimension: "JP"
  },
  {
    question: "在进行项目时，我更喜欢：",
    optionA: "先制定详细计划再开始",
    optionB: "边做边调整方向",
    dimension: "JP"
  },
  {
    question: "我更倾向于：",
    optionA: "做决定，达成结论",
    optionB: "保持选项开放，继续收集信息",
    dimension: "JP"
  },
  {
    question: "我更喜欢的环境是：",
    optionA: "有序、可预测的",
    optionB: "多变、充满可能性的",
    dimension: "JP"
  },
  {
    question: "面对改变，我通常：",
    optionA: "需要时间适应并希望提前知道",
    optionB: "容易适应并可能感到兴奋",
    dimension: "JP"
  },
  {
    question: "我更倾向于：",
    optionA: "先完成工作，再享受休闲",
    optionB: "边工作边休闲，保持生活平衡",
    dimension: "JP"
  },
  {
    question: "我更看重：",
    optionA: "明确的目标和方向",
    optionB: "自由探索的过程",
    dimension: "JP"
  },
  {
    question: "在安排旅行时，我更喜欢：",
    optionA: "提前计划好行程和住宿",
    optionB: "保持灵活，根据兴趣即兴决定",
    dimension: "JP"
  },
  {
    question: "我更倾向于：",
    optionA: "遵循既定规则和流程",
    optionB: "根据情况调整规则和方法",
    dimension: "JP"
  },
  {
    question: "面对未完成的事情，我感觉：",
    optionA: "压力和不安",
    optionB: "可以接受并保持灵活",
    dimension: "JP"
  },
  {
    question: "我更喜欢：",
    optionA: "明确的指导和方向",
    optionB: "探索多种可能性",
    dimension: "JP"
  },
  {
    question: "在工作中，我更关注：",
    optionA: "按时完成任务和目标",
    optionB: "过程中的发现和可能性",
    dimension: "JP"
  },
  {
    question: "我更倾向于：",
    optionA: "系统地解决问题",
    optionB: "灵活地应对突发情况",
    dimension: "JP"
  },
  {
    question: "我更希望生活：",
    optionA: "井然有序，可预测",
    optionB: "充满变化，有惊喜",
    dimension: "JP"
  },
  {
    question: "我更看重：",
    optionA: "稳定性和一致性",
    optionB: "变化性和多样性",
    dimension: "JP"
  },
  {
    question: "我通常：",
    optionA: "严格遵守时间安排",
    optionB: "对时间安排保持灵活",
    dimension: "JP"
  },
  {
    question: "在做决定时，我更倾向于：",
    optionA: "尽快做出决定并执行",
    optionB: "保持选项开放，等待更多信息",
    dimension: "JP"
  },
  {
    question: "我更喜欢的工作方式是：",
    optionA: "有明确的步骤和截止日期",
    optionB: "灵活自由，允许即兴发挥",
    dimension: "JP"
  },
  {
    question: "对于规则和程序，我更倾向于：",
    optionA: "认为它们提供必要的结构和指导",
    optionB: "认为它们有时限制了灵活性和创新",
    dimension: "JP"
  },
  {
    question: "我更喜欢：",
    optionA: "知道接下来会发生什么",
    optionB: "让事情自然发展",
    dimension: "JP"
  },
  {
    question: "我通常被描述为：",
    optionA: "有条理、做事有计划的人",
    optionB: "适应力强、灵活多变的人",
    dimension: "JP"
  },
  {
    question: "我更喜欢的工作环境是：",
    optionA: "有明确职责和期望的",
    optionB: "允许即兴发挥和创新的",
    dimension: "JP"
  },
  {
    question: "我更倾向于：",
    optionA: "完成一个项目再开始下一个",
    optionB: "同时进行多个项目",
    dimension: "JP"
  },
  {
    question: "当计划改变时，我通常感到：",
    optionA: "不安或失望",
    optionB: "兴奋或好奇",
    dimension: "JP"
  },
  {
    question: "我更看重：",
    optionA: "结构和确定性",
    optionB: "自由度和可能性",
    dimension: "JP"
  },
  {
    question: "我更喜欢：",
    optionA: "按部就班，一步一步来",
    optionB: "根据灵感和情况调整方向",
    dimension: "JP"
  },
  {
    question: "我通常是：",
    optionA: "决定者和规划者",
    optionB: "探索者和适应者",
    dimension: "JP"
  },
  {
    question: "我更擅长：",
    optionA: "按照计划执行任务",
    optionB: "应对变化和即兴发挥",
    dimension: "JP"
  },
  {
    question: "我更喜欢：",
    optionA: "提前做好决定",
    optionB: "等待更多信息再决定",
    dimension: "JP"
  },
  {
    question: "我通常被视为：",
    optionA: "有组织、守时的人",
    optionB: "随性、灵活的人",
    dimension: "JP"
  }
];

module.exports = questions; 