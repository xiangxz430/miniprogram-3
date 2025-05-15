const mbtiTypes = {
  'INTJ': {
    name: '建筑师',
    percent: 2.1,
    description: 'INTJ型的人富有想象力和战略性思维，是天生的规划者。他们以独特的创造力和创新思维著称。',
    functions: [
      {
        code: 'Ni',
        name: '内向直觉',
        description: '能够看到事物背后的联系和模式，善于预测未来趋势。'
      },
      {
        code: 'Te',
        name: '外向思维',
        description: '善于逻辑分析和系统规划，追求效率和目标达成。'
      },
      {
        code: 'Fi',
        name: '内向情感',
        description: '有强烈的个人价值观和道德准则，重视真实性。'
      },
      {
        code: 'Se',
        name: '外向感觉',
        description: '关注当下的具体细节，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'ENTJ',
      name: '指挥官'
    },
    careers: [
      { name: '战略规划', icon: 'icon-strategy', bgColor: '#3b82f6' },
      { name: '系统架构', icon: 'icon-architecture', bgColor: '#8b5cf6' },
      { name: '科学研究', icon: 'icon-research', bgColor: '#10b981' },
      { name: '管理咨询', icon: 'icon-consulting', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '北向', isGood: true },
      { name: '东向', isGood: true },
      { name: '南向', isGood: false },
      { name: '西向', isGood: false }
    ]
  },
  'INTP': {
    name: '逻辑学家',
    percent: 3.3,
    description: 'INTP型的人是创新者和发明家，他们热爱理论和抽象思维，追求逻辑和理性。',
    functions: [
      {
        code: 'Ti',
        name: '内向思维',
        description: '深入分析问题，建立个人的逻辑体系。'
      },
      {
        code: 'Ne',
        name: '外向直觉',
        description: '探索可能性，发现新的联系和模式。'
      },
      {
        code: 'Si',
        name: '内向感觉',
        description: '收集和整理详细信息，重视经验。'
      },
      {
        code: 'Fe',
        name: '外向情感',
        description: '理解他人情感，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'ENTP',
      name: '辩论家'
    },
    careers: [
      { name: '软件开发', icon: 'icon-code', bgColor: '#3b82f6' },
      { name: '数据分析', icon: 'icon-chart', bgColor: '#8b5cf6' },
      { name: '学术研究', icon: 'icon-research', bgColor: '#10b981' },
      { name: '系统设计', icon: 'icon-design', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '东向', isGood: true },
      { name: '北向', isGood: true },
      { name: '西向', isGood: false },
      { name: '南向', isGood: false }
    ]
  },
  'ENTJ': {
    name: '指挥官',
    percent: 1.8,
    description: 'ENTJ型的人是天生的领导者，具有战略性思维和组织能力。他们善于制定计划并带领团队实现目标。',
    functions: [
      {
        code: 'Te',
        name: '外向思维',
        description: '善于制定计划和组织资源，追求效率和目标达成。'
      },
      {
        code: 'Ni',
        name: '内向直觉',
        description: '能够预见长远发展，把握战略方向。'
      },
      {
        code: 'Se',
        name: '外向感觉',
        description: '关注现实情况，善于把握机会。'
      },
      {
        code: 'Fi',
        name: '内向情感',
        description: '有坚定的个人价值观，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'INTJ',
      name: '建筑师'
    },
    careers: [
      { name: '企业管理', icon: 'icon-management', bgColor: '#3b82f6' },
      { name: '战略咨询', icon: 'icon-strategy', bgColor: '#8b5cf6' },
      { name: '项目领导', icon: 'icon-leadership', bgColor: '#10b981' },
      { name: '创业者', icon: 'icon-startup', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '北向', isGood: true },
      { name: '东向', isGood: true },
      { name: '南向', isGood: false },
      { name: '西向', isGood: false }
    ]
  },
  'ENTP': {
    name: '辩论家',
    percent: 3.2,
    description: 'ENTP型的人富有创造力和智慧，喜欢挑战传统观念，善于发现新的可能性。',
    functions: [
      {
        code: 'Ne',
        name: '外向直觉',
        description: '善于发现新的可能性和联系，喜欢创新。'
      },
      {
        code: 'Ti',
        name: '内向思维',
        description: '擅长逻辑分析和理论构建。'
      },
      {
        code: 'Fe',
        name: '外向情感',
        description: '理解他人情感，但可能不够深入。'
      },
      {
        code: 'Si',
        name: '内向感觉',
        description: '关注细节和经验，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'INTP',
      name: '逻辑学家'
    },
    careers: [
      { name: '创新顾问', icon: 'icon-innovation', bgColor: '#3b82f6' },
      { name: '企业家', icon: 'icon-entrepreneur', bgColor: '#8b5cf6' },
      { name: '市场策略', icon: 'icon-marketing', bgColor: '#10b981' },
      { name: '产品设计', icon: 'icon-design', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '东向', isGood: true },
      { name: '北向', isGood: true },
      { name: '西向', isGood: false },
      { name: '南向', isGood: false }
    ]
  },
  'INFJ': {
    name: '提倡者',
    percent: 1.5,
    description: 'INFJ型的人富有同理心和洞察力，追求意义和价值，致力于帮助他人和改善世界。',
    functions: [
      {
        code: 'Ni',
        name: '内向直觉',
        description: '深刻的洞察力和远见，能看到事物的本质。'
      },
      {
        code: 'Fe',
        name: '外向情感',
        description: '强烈的同理心，关心他人福祉。'
      },
      {
        code: 'Ti',
        name: '内向思维',
        description: '理性分析能力，但不是主导功能。'
      },
      {
        code: 'Se',
        name: '外向感觉',
        description: '对现实的感知，通常是最弱的功能。'
      }
    ],
    socialMask: {
      code: 'ENFJ',
      name: '主人公'
    },
    careers: [
      { name: '心理咨询', icon: 'icon-counseling', bgColor: '#3b82f6' },
      { name: '职业指导', icon: 'icon-guidance', bgColor: '#8b5cf6' },
      { name: '非营利组织', icon: 'icon-nonprofit', bgColor: '#10b981' },
      { name: '作家', icon: 'icon-writing', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '北向', isGood: true },
      { name: '东向', isGood: true },
      { name: '南向', isGood: false },
      { name: '西向', isGood: false }
    ]
  },
  'INFP': {
    name: '调停者',
    percent: 4.4,
    description: 'INFP型的人富有理想主义和创造力，重视个人价值观和真实性，追求内心的和谐。',
    functions: [
      {
        code: 'Fi',
        name: '内向情感',
        description: '强烈的个人价值观和道德准则。'
      },
      {
        code: 'Ne',
        name: '外向直觉',
        description: '丰富的想象力和创造力。'
      },
      {
        code: 'Si',
        name: '内向感觉',
        description: '重视个人经验和回忆。'
      },
      {
        code: 'Te',
        name: '外向思维',
        description: '逻辑组织能力，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'ENFP',
      name: '探险家'
    },
    careers: [
      { name: '作家/艺术家', icon: 'icon-art', bgColor: '#3b82f6' },
      { name: '心理咨询师', icon: 'icon-counseling', bgColor: '#8b5cf6' },
      { name: '教育工作者', icon: 'icon-education', bgColor: '#10b981' },
      { name: '人文研究', icon: 'icon-research', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '东向', isGood: true },
      { name: '北向', isGood: true },
      { name: '西向', isGood: false },
      { name: '南向', isGood: false }
    ]
  },
  'ENFJ': {
    name: '主人公',
    percent: 2.5,
    description: 'ENFJ型的人富有魅力和同理心，善于激励他人，致力于促进个人和团队的成长。',
    functions: [
      {
        code: 'Fe',
        name: '外向情感',
        description: '强大的人际交往能力，善于理解和影响他人。'
      },
      {
        code: 'Ni',
        name: '内向直觉',
        description: '洞察人性，预见发展方向。'
      },
      {
        code: 'Se',
        name: '外向感觉',
        description: '关注现实需求和机会。'
      },
      {
        code: 'Ti',
        name: '内向思维',
        description: '逻辑分析能力，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'INFJ',
      name: '提倡者'
    },
    careers: [
      { name: '培训讲师', icon: 'icon-training', bgColor: '#3b82f6' },
      { name: '人力资源', icon: 'icon-hr', bgColor: '#8b5cf6' },
      { name: '公共关系', icon: 'icon-pr', bgColor: '#10b981' },
      { name: '教育管理', icon: 'icon-education', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '北向', isGood: true },
      { name: '东向', isGood: true },
      { name: '南向', isGood: false },
      { name: '西向', isGood: false }
    ]
  },
  'ENFP': {
    name: '探险家',
    percent: 8.1,
    description: 'ENFP型的人充满热情和创造力，善于发现可能性，激励他人追求梦想。',
    functions: [
      {
        code: 'Ne',
        name: '外向直觉',
        description: '强大的创造力和洞察力，发现新的可能性。'
      },
      {
        code: 'Fi',
        name: '内向情感',
        description: '强烈的个人价值观和真实性追求。'
      },
      {
        code: 'Te',
        name: '外向思维',
        description: '实现目标的组织能力。'
      },
      {
        code: 'Si',
        name: '内向感觉',
        description: '经验参考，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'INFP',
      name: '调停者'
    },
    careers: [
      { name: '创意总监', icon: 'icon-creative', bgColor: '#3b82f6' },
      { name: '市场营销', icon: 'icon-marketing', bgColor: '#8b5cf6' },
      { name: '职业顾问', icon: 'icon-counseling', bgColor: '#10b981' },
      { name: '艺术工作', icon: 'icon-art', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '东向', isGood: true },
      { name: '北向', isGood: true },
      { name: '西向', isGood: false },
      { name: '南向', isGood: false }
    ]
  },
  'ISTJ': {
    name: '检查者',
    percent: 11.6,
    description: 'ISTJ型的人务实可靠，注重细节，遵守传统和规则，追求秩序和效率。',
    functions: [
      {
        code: 'Si',
        name: '内向感觉',
        description: '重视经验和细节，追求可靠性。'
      },
      {
        code: 'Te',
        name: '外向思维',
        description: '逻辑分析和组织能力强。'
      },
      {
        code: 'Fi',
        name: '内向情感',
        description: '个人价值判断。'
      },
      {
        code: 'Ne',
        name: '外向直觉',
        description: '创新思维，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'ESTJ',
      name: '总经理'
    },
    careers: [
      { name: '财务管理', icon: 'icon-finance', bgColor: '#3b82f6' },
      { name: '项目管理', icon: 'icon-project', bgColor: '#8b5cf6' },
      { name: '质量控制', icon: 'icon-quality', bgColor: '#10b981' },
      { name: '行政管理', icon: 'icon-admin', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '北向', isGood: true },
      { name: '东向', isGood: true },
      { name: '南向', isGood: false },
      { name: '西向', isGood: false }
    ]
  },
  'ISFJ': {
    name: '守卫者',
    percent: 13.8,
    description: 'ISFJ型的人温和细心，富有同情心，重视传统和责任，致力于服务他人。',
    functions: [
      {
        code: 'Si',
        name: '内向感觉',
        description: '重视细节和传统经验。'
      },
      {
        code: 'Fe',
        name: '外向情感',
        description: '关心他人需求，善于照顾。'
      },
      {
        code: 'Ti',
        name: '内向思维',
        description: '逻辑分析能力。'
      },
      {
        code: 'Ne',
        name: '外向直觉',
        description: '创新思维，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'ESFJ',
      name: '执政官'
    },
    careers: [
      { name: '护理医疗', icon: 'icon-medical', bgColor: '#3b82f6' },
      { name: '行政助理', icon: 'icon-assistant', bgColor: '#8b5cf6' },
      { name: '客户服务', icon: 'icon-service', bgColor: '#10b981' },
      { name: '教育工作', icon: 'icon-education', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '东向', isGood: true },
      { name: '北向', isGood: true },
      { name: '西向', isGood: false },
      { name: '南向', isGood: false }
    ]
  },
  'ESTJ': {
    name: '总经理',
    percent: 8.7,
    description: 'ESTJ型的人务实果断，善于组织和管理，重视效率和规则，追求明确的目标。',
    functions: [
      {
        code: 'Te',
        name: '外向思维',
        description: '强大的组织和管理能力。'
      },
      {
        code: 'Si',
        name: '内向感觉',
        description: '重视传统和经验。'
      },
      {
        code: 'Ne',
        name: '外向直觉',
        description: '创新思维能力。'
      },
      {
        code: 'Fi',
        name: '内向情感',
        description: '个人价值判断，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'ISTJ',
      name: '检查者'
    },
    careers: [
      { name: '项目经理', icon: 'icon-project', bgColor: '#3b82f6' },
      { name: '行政主管', icon: 'icon-admin', bgColor: '#8b5cf6' },
      { name: '财务总监', icon: 'icon-finance', bgColor: '#10b981' },
      { name: '运营管理', icon: 'icon-operations', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '北向', isGood: true },
      { name: '东向', isGood: true },
      { name: '南向', isGood: false },
      { name: '西向', isGood: false }
    ]
  },
  'ESFJ': {
    name: '执政官',
    percent: 12.3,
    description: 'ESFJ型的人热情友善，重视和谐关系，善于照顾他人，追求稳定和秩序。',
    functions: [
      {
        code: 'Fe',
        name: '外向情感',
        description: '强大的人际交往能力，关心他人。'
      },
      {
        code: 'Si',
        name: '内向感觉',
        description: '重视传统和具体细节。'
      },
      {
        code: 'Ne',
        name: '外向直觉',
        description: '创新思维能力。'
      },
      {
        code: 'Ti',
        name: '内向思维',
        description: '逻辑分析，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'ISFJ',
      name: '守卫者'
    },
    careers: [
      { name: '人力资源', icon: 'icon-hr', bgColor: '#3b82f6' },
      { name: '客户关系', icon: 'icon-customer', bgColor: '#8b5cf6' },
      { name: '医疗服务', icon: 'icon-medical', bgColor: '#10b981' },
      { name: '社区工作', icon: 'icon-community', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '东向', isGood: true },
      { name: '北向', isGood: true },
      { name: '西向', isGood: false },
      { name: '南向', isGood: false }
    ]
  },
  'ISTP': {
    name: '鉴赏家',
    percent: 5.4,
    description: 'ISTP型的人灵活务实，善于解决具体问题，喜欢探索和冒险，追求效率。',
    functions: [
      {
        code: 'Ti',
        name: '内向思维',
        description: '强大的逻辑分析能力。'
      },
      {
        code: 'Se',
        name: '外向感觉',
        description: '关注现实，善于实践。'
      },
      {
        code: 'Ni',
        name: '内向直觉',
        description: '洞察力和预见性。'
      },
      {
        code: 'Fe',
        name: '外向情感',
        description: '人际交往，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'ESTP',
      name: '企业家'
    },
    careers: [
      { name: '技术专家', icon: 'icon-tech', bgColor: '#3b82f6' },
      { name: '工程师', icon: 'icon-engineer', bgColor: '#8b5cf6' },
      { name: '数据分析', icon: 'icon-data', bgColor: '#10b981' },
      { name: '危机处理', icon: 'icon-crisis', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '北向', isGood: true },
      { name: '东向', isGood: true },
      { name: '南向', isGood: false },
      { name: '西向', isGood: false }
    ]
  },
  'ISFP': {
    name: '探索者',
    percent: 8.8,
    description: 'ISFP型的人富有艺术感和同情心，重视个人价值观，追求自由和真实表达。',
    functions: [
      {
        code: 'Fi',
        name: '内向情感',
        description: '强烈的个人价值观和审美观。'
      },
      {
        code: 'Se',
        name: '外向感觉',
        description: '关注当下，享受生活。'
      },
      {
        code: 'Ni',
        name: '内向直觉',
        description: '直觉洞察力。'
      },
      {
        code: 'Te',
        name: '外向思维',
        description: '组织能力，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'ESFP',
      name: '表演者'
    },
    careers: [
      { name: '艺术创作', icon: 'icon-art', bgColor: '#3b82f6' },
      { name: '设计师', icon: 'icon-design', bgColor: '#8b5cf6' },
      { name: '音乐表演', icon: 'icon-music', bgColor: '#10b981' },
      { name: '个人护理', icon: 'icon-care', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '东向', isGood: true },
      { name: '北向', isGood: true },
      { name: '西向', isGood: false },
      { name: '南向', isGood: false }
    ]
  },
  'ESTP': {
    name: '企业家',
    percent: 4.3,
    description: 'ESTP型的人活力充沛，善于解决问题，喜欢冒险和挑战，追求即时的结果。',
    functions: [
      {
        code: 'Se',
        name: '外向感觉',
        description: '关注现实，善于把握机会。'
      },
      {
        code: 'Ti',
        name: '内向思维',
        description: '理性分析和解决问题。'
      },
      {
        code: 'Fe',
        name: '外向情感',
        description: '社交能力和影响力。'
      },
      {
        code: 'Ni',
        name: '内向直觉',
        description: '战略思维，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'ISTP',
      name: '鉴赏家'
    },
    careers: [
      { name: '销售经理', icon: 'icon-sales', bgColor: '#3b82f6' },
      { name: '创业者', icon: 'icon-startup', bgColor: '#8b5cf6' },
      { name: '运动教练', icon: 'icon-sports', bgColor: '#10b981' },
      { name: '危机管理', icon: 'icon-crisis', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '北向', isGood: true },
      { name: '东向', isGood: true },
      { name: '南向', isGood: false },
      { name: '西向', isGood: false }
    ]
  },
  'ESFP': {
    name: '表演者',
    percent: 8.5,
    description: 'ESFP型的人热情活泼，善于社交，喜欢表现自我，追求快乐和自由。',
    functions: [
      {
        code: 'Se',
        name: '外向感觉',
        description: '享受当下，善于感知环境。'
      },
      {
        code: 'Fi',
        name: '内向情感',
        description: '强烈的个人价值观。'
      },
      {
        code: 'Te',
        name: '外向思维',
        description: '实践能力和组织能力。'
      },
      {
        code: 'Ni',
        name: '内向直觉',
        description: '远见卓识，但可能是较弱的功能。'
      }
    ],
    socialMask: {
      code: 'ISFP',
      name: '探索者'
    },
    careers: [
      { name: '演艺工作', icon: 'icon-entertainment', bgColor: '#3b82f6' },
      { name: '活动策划', icon: 'icon-event', bgColor: '#8b5cf6' },
      { name: '销售代表', icon: 'icon-sales', bgColor: '#10b981' },
      { name: '公关工作', icon: 'icon-pr', bgColor: '#f59e0b' }
    ],
    directions: [
      { name: '东向', isGood: true },
      { name: '北向', isGood: true },
      { name: '西向', isGood: false },
      { name: '南向', isGood: false }
    ]
  }
}

export default mbtiTypes 