# 脆蜜金桔 AI 智能体

面向脆蜜金桔种植场景的 AI 智能体平台。用户通过自然语言提问，系统自动判断问题类型并调用对应专家智能体完成分析和回答。

---

## 项目结构

```
plan2/
├── README.md
├── 前端设计PRD.md                    # 前端设计文档
├── 后端设计PRD.md                    # 后端设计文档
│
├── index.html                       # 前端入口 HTML
├── package.json                     # 前端依赖
├── vite.config.ts                   # Vite 配置（含 /api 代理）
├── tailwind.config.js               # Tailwind 色彩主题
├── postcss.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│
├── public/
│   └── images/
│       └── tree-branch-growth-.jpg  # 背景图片
│
├── src/                             # 前端源码
│   ├── main.tsx                     # React 入口
│   ├── App.tsx                      # 根组件（会话状态 + API 调用）
│   ├── index.css                    # 全局样式 + 玻璃拟态工具类
│   ├── data/
│   │   └── constants.ts             # 静态数据（导航/知识库/快捷问题）
│   └── components/
│       ├── Layout.tsx               # 三段式布局 + 背景层 + footer
│       ├── Header.tsx               # 顶部栏
│       ├── Sidebar.tsx              # 左侧导航 + 历史对话
│       ├── KnowledgePanel.tsx       # 知识库面板（标签 + 快捷问题）
│       ├── ChatInput.tsx            # AI 对话输入框
│       ├── ChatDisplay.tsx          # 对话消息展示（回答/卡片/建议）
│       ├── HeroTitle.tsx            # 主标题（保留备用）
│       ├── FeatureCard.tsx          # 功能卡片（保留备用）
│       └── FeatureCardGrid.tsx      # 卡片网格（保留备用）
│
└── backend/                         # 后端源码
    ├── package.json
    ├── tsconfig.json
    ├── uploads/                     # 图片上传目录
    └── src/
        ├── main.ts                  # 启动入口（端口 3001）
        ├── app.ts                   # Express 配置
        ├── types/
        │   └── index.ts             # 全部 TS 类型定义
        ├── routes/
        │   ├── agent.routes.ts      # POST /api/agent/chat
        │   ├── session.routes.ts    # POST/GET /api/sessions
        │   ├── upload.routes.ts     # POST /api/upload/image
        │   └── knowledge.routes.ts  # POST /api/knowledge/search
        ├── agents/
        │   ├── orchestrator.agent.ts   # 主控智能体（关键词分发）
        │   ├── flowerFruit.agent.ts    # 保花保果专家
        │   ├── phenology.agent.ts      # 物候期识别专家
        │   └── weather.agent.ts        # 气象预测专家
        ├── tools/                      # 工具适配层（当前全部 Mock）
        │   ├── imageRecognition.tool.ts
        │   ├── diseaseDetection.tool.ts
        │   ├── phenologyRecognition.tool.ts
        │   ├── iotData.tool.ts
        │   ├── weatherForecast.tool.ts
        │   └── knowledgeSearch.tool.ts
        ├── services/
        │   ├── agent.service.ts        # 智能体编排核心
        │   ├── session.service.ts      # 会话 CRUD（内存）
        │   └── knowledge.service.ts    # 知识库检索（8 篇文档）
        ├── mocks/
        │   ├── phenology.mock.ts       # 物候期识别 Mock
        │   ├── disease.mock.ts         # 病虫害识别 Mock
        │   └── weather.mock.ts         # 天气 / IoT Mock
        └── utils/
            ├── intentClassifier.ts     # 关键词 → 意图映射
            └── responseFormatter.ts    # 统一响应格式构建
```

---

## 技术框架

| 层面 | 技术 | 说明 |
| --- | --- | --- |
| 前端框架 | React 18 + TypeScript | 组件化开发 |
| 构建工具 | Vite 6 | 开发热更新 + 生产打包 |
| 样式方案 | Tailwind CSS 3 | 玻璃拟态 + 农业橙绿色系 |
| 后端框架 | Express.js + TypeScript | RESTful API |
| 运行时 | tsx | TypeScript 直接运行，无需编译 |
| 意图识别 | 关键词匹配 | Phase 1 临时方案，后续可替换为 LLM |
| 数据存储 | 内存 Map | Phase 1 临时方案，后续可替换为数据库 |

---

## 快速启动

### 1. 安装依赖

```bash
# 前端
cd plan2
npm install

# 后端
cd backend
npm install
```

### 2. 启动后端（端口 3001）

```bash
cd backend
npm run dev
```

### 3. 启动前端（端口 5173）

```bash
cd plan2
npm run dev
```

### 4. 访问页面

浏览器打开 `http://localhost:5173`

---

## 目前可展示的功能

### 前端

- **三段式布局**：左侧导航栏 + 顶部标题栏 + 主内容区
- **玻璃拟态视觉**：半透明卡片 + backdrop-blur + 圆角阴影
- **农业场景背景**：实拍果园图（65% 透明度 + 6px 模糊）+ 橙绿渐变蒙版
- **侧边栏导航**：8 个常用功能入口 + 4 条模拟历史对话
- **新建对话**：清空当前会话，回到首页
- **知识库面板**：6 个分类标签 + 6 条快捷提问，点击即可发起对话
- **对话展示**：用户消息 + AI 回答（含信息卡片、管理建议列表、追问按钮）
- **AI 输入框**：悬浮固定在底部，Enter 快捷发送，有内容时按钮点亮
- **多轮对话**：自动维护 session_id，上下文连续

### 后端

- **智能体路由**：根据关键词自动分发到保花保果 / 物候期识别 / 气象预测三个专家智能体
- **结构化响应**：返回 `answer`（文本）、`cards`（卡片）、`recommendations`（建议列表）、`suggested_questions`（追问）
- **知识库检索**：内置 8 篇脆蜜金桔种植文档，关键词匹配搜索
- **图片上传接口**：支持 jpg/png/webp，限制 10MB
- **会话管理**：创建会话 / 获取列表 / 获取消息历史
- **Mock 工具**：物候期识别、病虫害检测、天气预报、物联网数据均可无外部依赖运行

### 测试用例

| 输入 | 预期分发 | 预期返回 |
| --- | --- | --- |
| "脆蜜金桔开花期落花严重怎么办？" | 保花保果智能体 | 落花原因 + 风险等级 + 保花建议 |
| "帮我看看这棵树现在是什么阶段" | 物候期识别智能体 | 当前物候期 + 农事建议 |
| "明天适合打药吗？" | 气象预测智能体 | 天气条件判断 + 建议时间窗口 + 风险提示 |

---

## 后期 API 对接要求

当前所有模型和外部接口均使用 **Mock 数据**。后续接入真实服务时，只需替换对应 Tool 文件，**前端和主控智能体接口保持不变**。

### 需要对接的真实接口

| Tool 文件 | Mock 文件 | 需对接服务 |
| --- | --- | --- |
| `tools/imageRecognition.tool.ts` | `mocks/phenology.mock.ts` | 花期图像识别模型 |
| `tools/diseaseDetection.tool.ts` | `mocks/disease.mock.ts` | 病虫害图像识别模型 |
| `tools/phenologyRecognition.tool.ts` | `mocks/phenology.mock.ts` | 物候期识别模型 |
| `tools/iotData.tool.ts` | `mocks/weather.mock.ts` | 物联网设备实时数据 |
| `tools/weatherForecast.tool.ts` | `mocks/weather.mock.ts` | 第三方天气预报接口 |
| `tools/knowledgeSearch.tool.ts` | `services/knowledge.service.ts` | 向量数据库或 RAG 服务 |

### 对接规范

每个 Tool 文件已定义好统一的输入输出格式：

```typescript
// 输入：Tool 函数接收具体参数
// 输出：统一返回 ToolResponse
{
  tool_name: string      // 工具名称
  success: boolean       // 是否成功
  data: Record<string, unknown>  // 返回数据
  error: string | null   // 错误信息
}
```

对接时只需：
1. 修改对应 Tool 文件，将 Mock 调用替换为真实 API 调用
2. 保持 `ToolResponse` 返回格式不变
3. 在环境变量中配置 API 地址和密钥

### 意图识别升级（可选）

当前使用关键词匹配进行分类（`utils/intentClassifier.ts`），后续可升级为大模型意图识别：

1. 修改 `classifyIntent` 函数，调用 LLM API 替代关键词匹配
2. 保持返回的 `IntentResult` 结构不变
3. 前置路由和专家智能体调用逻辑无需改动

### 数据持久化（可选）

当前会话和消息存储在内存中（`services/session.service.ts`），服务重启后丢失。后续可替换为：

- SQLite（轻量，适合单机部署）
- PostgreSQL / MySQL（适合多实例部署）
- Redis（适合高并发场景）

---

## 色彩体系

| Token | 色值 | 用途 |
| --- | --- | --- |
| `kumquat` | `#F6A623` | 主色，发送按钮、强调元素 |
| `kumquat-light` | `#F8B84E` | hover 态 |
| `orchard` | `#45A86B` | 辅色，新建对话按钮、标签 |
| `orchard-dark` | `#2F7D4F` | 深绿强调、标题 |
| `beige` | `#FFF8E8` | 页面底色 |

---

## API 接口清单

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/agent/chat` | 统一对话入口 |
| POST | `/api/sessions` | 新建会话 |
| GET | `/api/sessions` | 获取会话列表 |
| GET | `/api/sessions/:id/messages` | 获取会话消息 |
| POST | `/api/upload/image` | 上传图片 |
| POST | `/api/knowledge/search` | 知识库检索 |
| GET | `/api/health` | 健康检查 |

### 对话接口请求示例

```json
{
  "session_id": "session_001",
  "message": "脆蜜金桔开花期落花严重怎么办？",
  "images": [{ "url": "https://example.com/tree.jpg", "type": "tree" }],
  "plot_id": "plot_001",
  "source": "chat_input"
}
```

### 对话接口响应示例

```json
{
  "session_id": "session_001",
  "message_id": "msg_001",
  "agent": "flower_fruit_agent",
  "intent": "flower_fruit_protection",
  "answer": "根据描述，当前金桔树需要注意花果管理...",
  "cards": [
    { "type": "stage", "title": "识别阶段", "value": "开花坐果期", "description": "基于描述判断" },
    { "type": "risk", "title": "管理风险", "value": "中", "description": "需关注落花落果和病害风险" }
  ],
  "recommendations": [
    "建议保持园区通风透光，避免湿度过高。",
    "花期不建议大量施用氮肥。"
  ],
  "tools_used": ["knowledge_base_search"],
  "suggested_questions": [
    "花期可以施肥吗？",
    "现在适合打药吗？"
  ]
}
```

---

## 开发者

前端与智能体编排框架开发。具体模型训练、模型服务实现、物联网接口和天气接口实现不在当前任务范围。
