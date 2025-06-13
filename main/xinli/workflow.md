# AI工作流

```mermaid
flowchart LR
    Start([开始]) --> CreateTemplate[创建模板HTML]
    CreateTemplate --> CreateTodoList[创建子任务清单]
    CreateTodoList --> ResearchSection1[研究首页设计]
    ResearchSection1 --> CreateSection1[创建首页Hero区域]
    CreateSection1 --> UpdateResult1[更新result.md和todolist.md]
    
    UpdateResult1 --> ResearchSection2[研究核心功能模块]
    ResearchSection2 --> CreateSection2[创建核心功能模块区域]
    CreateSection2 --> UpdateResult2[更新result.md和todolist.md]
    
    UpdateResult2 --> ResearchSection3[研究测试分类页]
    ResearchSection3 --> CreateSection3[创建测试分类页区域]
    CreateSection3 --> UpdateResult3[更新result.md和todolist.md]
    
    UpdateResult3 --> ResearchSection4[研究测试执行页]
    ResearchSection4 --> CreateSection4[创建测试执行页区域]
    CreateSection4 --> UpdateResult4[更新result.md和todolist.md]
    
    UpdateResult4 --> ResearchSection5[研究结果页设计]
    ResearchSection5 --> CreateSection5[创建结果页设计区域]
    CreateSection5 --> UpdateResult5[更新result.md和todolist.md]
    
    UpdateResult5 --> ResearchSection6[研究交互设计要点]
    ResearchSection6 --> CreateSection6[创建交互设计要点区域]
    CreateSection6 --> UpdateResult6[更新result.md和todolist.md]
    
    UpdateResult6 --> ResearchSection7[研究特色功能]
    ResearchSection7 --> CreateSection7[创建特色功能区域]
    CreateSection7 --> UpdateResult7[更新result.md和todolist.md]
    
    UpdateResult7 --> ResearchSection8[研究专业支持]
    ResearchSection8 --> CreateSection8[创建专业支持区域]
    CreateSection8 --> UpdateResult8[更新result.md和todolist.md]
    
    UpdateResult8 --> End([结束])
```

## 任务拆解思路

为了设计一个完整的心理健康测试APP原型，我将工作流程拆分为以下几个主要步骤：

1. 首先创建基础模板HTML，包含导航栏、页脚和整体样式设计
2. 然后按照APP的主要功能模块和页面流程，依次设计各个section：
   - 首页Hero区域：吸引用户注意力的主视觉区域
   - 核心功能模块：展示APP的五大核心功能
   - 测试分类页：展示不同类型的心理测试
   - 测试执行页：展示测试过程的界面设计
   - 结果页设计：展示测试结果的呈现方式
   - 交互设计要点：展示APP的交互设计特点
   - 特色功能：展示APP的差异化功能
   - 专业支持：展示APP提供的专业心理健康支持

3. 每个section完成后，更新result.md记录核心内容概述，并更新todolist.md的进度
4. 最终完成一个完整的、视觉吸引力强的心理健康测试APP原型设计

这种拆解方式确保了设计过程的系统性和完整性，同时保证了各个功能模块之间的逻辑连贯性。