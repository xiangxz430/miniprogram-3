# 每日算运 微信小程序

这是一款基于周易卦象的每日运势小程序，通过DeepSeek AI提供个性化的卦象解析。

## 功能特点

- **每日一挂**: 每天抽取一个卦象，提供个性化的解析
- **AI解析**: 接入DeepSeek API，提供更智能的卦象解读
- **全方位运势**: 包含整体运势、财运、桃花运、事业学业等多个方面
- **开运指南**: 提供开运方位、开运颜色、宜忌事项等实用建议

## 技术实现

- 前端: 微信小程序原生框架
- AI接口: DeepSeek API (https://api.deepseek.com)
- 存储: 微信小程序本地缓存

## 配置说明

### 克隆并配置项目

1. 克隆仓库到本地
```bash
git clone https://github.com/你的用户名/每日算运.git
cd 每日算运
```

2. 配置DeepSeek API
```bash
# 复制示例配置文件
cp utils/config.example.js utils/config.js
```

然后编辑`utils/config.js`文件，将`your-api-key-here`替换为你的DeepSeek API Key:

```javascript
const API_CONFIG = {
  DEEPSEEK: {
    API_KEY: 'your-api-key-here', // 替换为你的API Key
    API_URL: 'https://api.deepseek.com/v1/chat/completions'
  }
};
```

### 域名配置

需要在微信小程序管理后台添加以下域名到request合法域名:

- `https://api.deepseek.com`

## 使用说明

1. 打开小程序，进入"每日一挂"页面
2. 点击"开始占卜"按钮，等待3-5秒
3. 查看今日运势解析和各项建议
4. 如需重新占卜，点击页面底部的"重新占卜"按钮

## 注意事项

- 每日运势仅供娱乐参考，请勿过度依赖
- 首次使用需要授权网络请求权限
- 每日会消耗一定的API调用额度
- API密钥不应该提交到版本控制系统中

## 贡献代码

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 开发者

本项目由XXX团队开发，如有问题请联系：example@email.com

## 项目结构

```
.
├── app.js              # 小程序入口文件
├── app.json            # 小程序全局配置文件
├── app.wxss            # 小程序全局样式文件
├── images              # 图片资源目录
│   └── icons           # 图标资源目录
├── pages               # 页面目录
│   └── daily_hexagram  # 每日一挂页面
│       ├── index.js    # 页面逻辑
│       ├── index.json  # 页面配置
│       ├── index.wxml  # 页面结构
│       └── index.wxss  # 页面样式
├── utils               # 工具类目录
│   ├── config.example.js # 配置示例文件
│   ├── deepseekApi.js  # DeepSeek API接口
│   └── hexagram.js     # 卦象生成工具
├── project.config.json # 项目配置文件
├── sitemap.json        # 小程序索引配置文件
└── README.md           # 项目说明文件
```

## 功能模块

1. **每日一挂**
   - 基于易经六十四卦的每日运势占卜
   - 提供卦象解析与今日运势分析
   - 提供开运指南和宜忌提示
   - 支持本地存储，保存每日卦象
   - 支持分享功能

2. **后续开发计划**
   - 八字总运
   - 星座每日运势
   - MBTI人格系统
   - 周公解梦
   - 用户个人中心

## 使用方法

1. 克隆本仓库
2. 使用微信开发者工具打开项目
3. 在开发者工具中编译预览

## 开发进度

- [x] 项目基础架构搭建
- [x] 每日一挂页面开发
- [x] 卦象生成工具类开发
- [x] DeepSeek API接入
- [ ] 八字总运页面开发
- [ ] 星座每日运势页面开发
- [ ] MBTI人格系统页面开发
- [ ] 周公解梦页面开发
- [ ] 用户个人中心页面开发
- [ ] 上线发布 