# 脆蜜金桔 AI 智能体 — 智能体架构与数据库升级 PRD

## 1. 升级背景

当前系统已完成 Phase 1 基础框架搭建，实现了前端 React 工作台 + 后端多智能体编排 + Mock 工具调用的完整链路。但存在两个核心短板：

1. **智能体层缺乏真正的 AI 能力**：意图识别依赖关键词匹配，回答生成依赖模板拼接，不具备推理和动态决策能力。
2. **数据层缺乏持久化和语义检索**：会话数据存于内存（重启丢失），知识库为硬编码文档列表，无法支撑大规模知识管理和 RAG 场景。

本 PRD 围绕这两个问题，规划 Phase 2 的架构升级方案。

---

## 2. 升级目标

| 维度 | 当前状态（Phase 1） | 目标状态（Phase 2） |
|------|---------------------|---------------------|
| 意图识别 | 关键词匹配 | LLM 语义理解 |
| 回答生成 | 模板字符串拼接 | LLM + RAG 生成 |
| Agent 框架 | 无（手写 switch-case） | 成熟框架 / 自建 Agent Loop |
| 工具调用 | Mock 返回 | 真实 Tool Calling（函数调用） |
| 会话存储 | 内存 Map | 关系型数据库 |
| 知识库检索 | 关键词匹配 | 向量语义检索 |
| 知识库规模 | 硬编码 8 篇文档 | 可扩展的文档管理系统 |

---

# 第一部分：智能体架构升级

## 3. 现状分析

### 3.1 当前智能体架构

```text
用户提问
  ↓
intentClassifier.ts（关键词 includes 匹配）
  ↓
orchestrator.agent.ts（switch-case 分发）
  ↓
专家智能体（if-else 模板拼接）
  ↓
返回固定格式响应
```

### 3.2 核心问题

| 问题 | 具体表现 | 影响 |
|------|----------|------|
| 无 LLM 参与 | 所有回答是硬编码模板 | 无法处理未预设的问题，用户体验差 |
| 意图识别粗糙 | `message.includes('打药')` | 无法处理模糊表达、多意图、上下文依赖 |
| 无推理能力 | 智能体不会"思考" | 不能动态选择工具、不能多步推理 |
| 编排逻辑死板 | switch-case 路由 | 无法处理跨领域问题（如"花期遇到暴雨怎么办"） |
| 上下文浪费 | 消息存了但没传给 LLM | 多轮对话无法理解上下文 |

---

## 4. 智能体架构升级方案

### 4.1 方案选型

| 方案 | 说明 | 优点 | 缺点 | 推荐度 |
|------|------|------|------|--------|
| **LangChain.js** | 成熟的 LLM 应用框架 | 生态丰富、Chain/Agent/Tool 完整 | 较重、学习成本高 | ⭐⭐⭐⭐ |
| **Vercel AI SDK** | 轻量 AI SDK | 简洁、TypeScript 友好、流式输出 | 功能相对简单 | ⭐⭐⭐⭐⭐ |
| **自建 Agent Loop** | 自己实现 ReAct 循环 | 完全可控、轻量 | 需要自行处理工具调用、错误恢复 | ⭐⭐⭐ |
| **AutoGen / CrewAI** | 多智能体协作框架 | 多 Agent 协作能力强 | 偏 Python 生态，JS 支持弱 | ⭐⭐ |

### 4.2 推荐方案：Vercel AI SDK + 自建编排层

选择理由：
- 项目技术栈为 TypeScript/Node.js，Vercel AI SDK 原生支持
- 提供 `streamText`、`generateObject`、Tool Calling 等核心能力
- 可以渐进式接入，不需要大规模重构
- 支持多模型切换（OpenAI / Claude / 通义千问等）

### 4.3 目标架构

```text
用户提问
  ↓
Agent Service（入口不变，前端无需改动）
  ↓
LLM 意图识别 + 动态决策
  ├── 直接回答（简单问题）
  ├── 单工具调用（知识库检索 / 天气查询）
  └── 多步推理（图片识别 → 知识库 → 生成建议）
  ↓
LLM 生成回答（注入知识库检索结果 + 工具返回数据）
  ↓
结构化响应（answer + cards + recommendations + references）
  ↓
存储到数据库
```

---

## 5. LLM 接入设计

### 5.1 模型选型

| 模型 | 适用场景 | 说明 |
|------|----------|------|
| **GPT-4o / GPT-4o-mini** | 通用对话、意图识别 | OpenAI，能力强，API 稳定 |
| **Claude 3.5 Sonnet** | 长文本理解、推理 | Anthropic，上下文窗口大 |
| **通义千问 qwen-plus** | 中文场景、低成本 | 阿里云，国内访问快 |
| **DeepSeek-V3** | 性价比高 | 国产开源，API 价格低 |

建议：开发阶段使用通义千问或 DeepSeek（成本低、国内快），生产环境可切换为 GPT-4o。

### 5.2 调用方式

```typescript
// 使用 Vercel AI SDK 示例
import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = await generateText({
  model: openai('gpt-4o-mini'),
  system: `你是脆蜜金桔种植专家。根据用户问题和检索到的知识库内容，给出专业的种植建议。
  回答要求：
  1. 结合知识库内容，不要编造
  2. 给出具体可操作的建议
  3. 如有风险，标明风险等级`,
  messages: conversationHistory,
  tools: {
    knowledgeSearch: tool({
      description: '检索脆蜜金桔种植知识库',
      parameters: z.object({
        query: z.string().describe('检索关键词'),
        topK: z.number().default(3),
      }),
      execute: async ({ query, topK }) => {
        return await knowledgeBaseSearch(query, topK);
      },
    }),
    weatherQuery: tool({
      description: '查询天气预报和物联网数据',
      parameters: z.object({
        plotId: z.string().optional(),
      }),
      execute: async ({ plotId }) => {
        return await weatherForecastQuery(plotId);
      },
    }),
  },
  maxSteps: 3, // 允许多步工具调用
});
```

### 5.3 Prompt 工程

需要设计以下 Prompt 模板：

| Prompt | 用途 | 关键要素 |
|--------|------|----------|
| **System Prompt** | 定义角色和行为规范 | 角色设定、回答格式、知识库引用规则 |
| **Intent Prompt** | 意图识别 | 意图分类列表、输出 JSON 格式 |
| **Agent Prompt** | 专家智能体 | 专业领域知识、工具使用规则、输出结构 |
| **RAG Prompt** | 知识库增强回答 | 检索结果注入、引用标注、置信度 |

---

## 6. Tool Calling 机制

### 6.1 工具定义规范

将现有 Mock 工具升级为 LLM 可调用的标准工具：

```typescript
interface ToolDefinition {
  name: string;
  description: string;        // LLM 理解用
  parameters: ZodSchema;      // 参数校验
  execute: (params) => Promise<ToolResult>;  // 实际执行
}

interface ToolResult {
  success: boolean;
  data: Record<string, unknown>;
  error?: string;
}
```

### 6.2 工具清单

| 工具名称 | 功能 | Phase 1 | Phase 2 |
|----------|------|---------|---------|
| knowledgeSearch | 知识库检索 | 关键词匹配 | 向量语义检索 |
| weatherForecast | 天气预报 | Mock | 真实 API / Mock |
| iotDataQuery | 物联网数据 | Mock | 真实 API / Mock |
| phenologyRecognition | 物候期识别 | Mock | 图像模型 API |
| diseaseDetection | 病虫害识别 | Mock | 图像模型 API |
| imageAnalysis | 图片分析 | 无 | 多模态 LLM 直接分析 |

### 6.3 Agent Loop（ReAct 模式）

```text
用户提问
  ↓
LLM 思考（Thought）：分析问题，决定需要哪些工具
  ↓
LLM 行动（Action）：调用工具获取数据
  ↓
LLM 观察（Observation）：获取工具返回结果
  ↓
循环：如果需要更多信息，继续调用工具
  ↓
LLM 回答（Answer）：综合所有信息生成最终回答
```

---

## 7. 多智能体协作升级

### 7.1 从"路由分发"到"动态协作"

当前架构是**静态路由**（主控分发到专家），升级为**动态协作**：

```text
Phase 1（当前）：
用户 → 主控 → 专家A → 回答

Phase 2（目标）：
用户 → LLM 编排器
  ├── 调用知识库检索
  ├── 调用天气查询
  ├── 调用图像识别
  ├── 综合所有结果
  └── 生成回答
```

### 7.2 专家智能体保留策略

专家智能体的角色从"独立回答者"变为"领域 Prompt 模板"：

| 智能体 | Phase 1 角色 | Phase 2 角色 |
|--------|--------------|--------------|
| 保花保果智能体 | 独立生成模板回答 | 保花保果领域的 System Prompt + 工具集 |
| 物候期识别智能体 | 独立生成模板回答 | 物候识别领域的 System Prompt + 工具集 |
| 气象预测智能体 | 独立生成模板回答 | 气象分析领域的 System Prompt + 工具集 |

LLM 根据意图自动选择对应的 Prompt 模板和工具集，而非 switch-case 硬编码。

---

## 8. 智能体升级实施计划

| 阶段 | 内容 | 依赖 | 产出 |
|------|------|------|------|
| Phase 2.1 | 接入 LLM API，替换模板回答 | LLM API Key | 回答质量大幅提升 |
| Phase 2.2 | 实现 Tool Calling | Phase 2.1 | 智能体可调用工具 |
| Phase 2.3 | 接入向量数据库 + RAG | 向量数据库部署 | 知识库语义检索 |
| Phase 2.4 | 替换真实外部接口 | 天气/图像 API | 工具从 Mock 变为真实 |

---

# 第二部分：数据库开发

## 9. 数据库需求分析

### 9.1 数据分类

| 数据类型 | 说明 | 当前存储 | 目标存储 |
|----------|------|----------|----------|
| 会话数据 | session、message | 内存 Map | 关系型数据库 |
| 知识库文档 | 种植规范、病虫害资料 | 硬编码数组 | 向量数据库 |
| 用户数据 | 用户信息、偏好 | 无 | 关系型数据库 |
| 工具调用日志 | 调用记录、耗时 | 无 | 关系型数据库 |
| IoT 历史数据 | 传感器时序数据 | 无 | 时序数据库（可选） |

### 9.2 数据库选型总览

| 数据库类型 | 推荐方案 | 用途 |
|------------|----------|------|
| **关系型数据库** | SQLite（开发）→ PostgreSQL（生产） | 会话、用户、日志 |
| **向量数据库** | ChromaDB / pgvector | 知识库语义检索 |
| **ORM** | Prisma / Drizzle | 数据库访问层 |

---

## 10. 关系型数据库设计

### 10.1 方案选型

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **SQLite + Prisma** | 零配置、轻量、单文件 | 不支持高并发 | 开发/单机部署 |
| **PostgreSQL + Prisma** | 功能完整、支持并发 | 需要部署服务 | 生产环境 |
| **PostgreSQL + pgvector** | 一库两用（业务+向量） | 向量检索性能不如专用向量库 | 想减少组件 |

**推荐**：开发阶段用 SQLite + Prisma，生产迁移到 PostgreSQL。

### 10.2 数据模型设计

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"  // 开发阶段用 sqlite，生产切换为 postgresql
  url      = env("DATABASE_URL")
}

// 用户表
model User {
  id        String    @id @default(cuid())
  name      String?
  phone     String?   @unique
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  sessions  Session[]
}

// 会话表
model Session {
  id        String    @id @default(cuid())
  title     String    @default("新的咨询")
  userId    String?
  user      User?     @relation(fields: [userId], references: [id])
  messages  Message[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([userId])
  @@index([updatedAt])
}

// 消息表
model Message {
  id        String   @id @default(cuid())
  sessionId String
  session   Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  role      String   // "user" | "assistant" | "system"
  content   String
  images    String?  // JSON 数组字符串
  agent     String?  // 哪个智能体回复的
  intent    String?  // 识别的意图
  metadata  String?  // 扩展字段，JSON 格式
  createdAt DateTime @default(now())

  @@index([sessionId])
  @@index([createdAt])
}

// 知识库文档表
model KnowledgeDocument {
  id        String   @id @default(cuid())
  title     String
  content   String
  category  String   // 分类标签
  source    String?  // 来源
  tags      String?  // JSON 数组字符串
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([category])
  @@index([isActive])
}

// 工具调用日志表
model ToolCallLog {
  id        String   @id @default(cuid())
  sessionId String?
  toolName  String
  input     String   // JSON
  output    String   // JSON
  success   Boolean
  duration  Int      // 耗时(ms)
  error     String?
  createdAt DateTime @default(now())

  @@index([sessionId])
  @@index([toolName])
  @@index([createdAt])
}
```

### 10.3 Prisma 集成步骤

```bash
# 1. 安装依赖
cd backend
npm install prisma @prisma/client

# 2. 初始化 Prisma
npx prisma init --datasource-provider sqlite

# 3. 创建 schema.prisma（如上）

# 4. 生成数据库
npx prisma db push

# 5. 生成客户端
npx prisma generate

# 6. 创建种子数据脚本
npx prisma db seed
```

---

## 11. 向量数据库与 RAG 设计

### 11.1 向量数据库选型

| 方案 | 部署方式 | 语言支持 | 特点 | 推荐度 |
|------|----------|----------|------|--------|
| **ChromaDB** | Docker / 嵌入式 | Python, JS | 轻量、本地部署简单 | ⭐⭐⭐⭐⭐ |
| **pgvector** | PostgreSQL 插件 | SQL | 与业务库统一、运维简单 | ⭐⭐⭐⭐ |
| **Milvus** | Docker / K8s | Python, Java, Go | 分布式、性能强 | ⭐⭐⭐ |
| **Pinecone** | 云托管 | REST API | 免运维、按量付费 | ⭐⭐⭐⭐ |
| **FAISS** | 嵌入式 | Python, C++ | 极快、纯内存 | ⭐⭐⭐ |

**推荐**：
- 开发阶段：ChromaDB（Docker 一行启动，JS SDK 支持好）
- 生产阶段：pgvector（如果已用 PostgreSQL）或 ChromaDB 集群

### 11.2 RAG 架构设计

```text
知识库文档
  ↓
文档分块（Chunking）
  ├── 按段落分块
  ├── 每块 500-1000 token
  └── 保留元数据（标题、分类、来源）
  ↓
向量化（Embedding）
  ├── 模型：text-embedding-3-small（OpenAI）
  └── 或：text-embedding-v3（通义千问）
  ↓
存入向量数据库
  ↓
用户提问时
  ├── 问题向量化
  ├── 相似度检索 Top-K
  └── 注入 LLM Prompt 作为上下文
  ↓
LLM 生成回答（基于检索结果）
```

### 11.3 文档分块策略

```typescript
interface DocumentChunk {
  id: string;
  documentId: string;       // 关联的知识库文档 ID
  content: string;          // 分块内容
  metadata: {
    title: string;          // 文档标题
    category: string;       // 分类
    source: string;         // 来源
    chunkIndex: number;     // 在原文中的位置
  };
  embedding: number[];      // 向量
}
```

分块规则：
- 按自然段落分块，每块 500-1000 token
- 保留段落间的上下文（前后各 overlap 50 token）
- 标题和小标题作为元数据保留
- 表格内容单独分块

### 11.4 Embedding 模型选型

| 模型 | 维度 | 价格 | 中文效果 | 推荐度 |
|------|------|------|----------|--------|
| **text-embedding-3-small** | 1536 | $0.02/1M tokens | 好 | ⭐⭐⭐⭐ |
| **text-embedding-3-large** | 3072 | $0.13/1M tokens | 很好 | ⭐⭐⭐⭐⭐ |
| **通义 text-embedding-v3** | 1024 | ¥0.0007/1K tokens | 很好 | ⭐⭐⭐⭐⭐ |
| **智谱 embedding-3** | 1024 | ¥0.0005/1K tokens | 好 | ⭐⭐⭐⭐ |

**推荐**：通义千问 text-embedding-v3（国内访问快、中文效果好、价格低）

### 11.5 ChromaDB 集成示例

```typescript
// services/vector.service.ts
import { ChromaClient } from 'chromadb';

const client = new ChromaClient({ path: 'http://localhost:8000' });

// 初始化集合
async function getCollection() {
  return await client.getOrCreateCollection({
    name: 'kumquat_knowledge',
    embeddingFunction: {
      generate: async (texts: string[]) => {
        // 调用 Embedding API
        return await getEmbeddings(texts);
      },
    },
  });
}

// 添加文档
async function addDocuments(chunks: DocumentChunk[]) {
  const collection = await getCollection();
  await collection.add({
    ids: chunks.map(c => c.id),
    documents: chunks.map(c => c.content),
    metadatas: chunks.map(c => c.metadata),
  });
}

// 语义检索
async function search(query: string, topK: number = 3) {
  const collection = await getCollection();
  const results = await collection.query({
    queryTexts: [query],
    nResults: topK,
  });
  return results;
}
```

---

## 12. 知识库管理系统

### 12.1 知识库内容规划

| 分类 | 文档数量（当前） | 目标数量 | 内容来源 |
|------|------------------|----------|----------|
| 种植标准 | 2 | 10+ | 农业规范、栽培指南 |
| 病虫害防治 | 2 | 20+ | 植保手册、防治方案 |
| 水肥管理 | 1 | 10+ | 施肥方案、灌溉标准 |
| 花果管理 | 1 | 10+ | 保花保果技术 |
| 采收分级 | 1 | 5+ | 采收标准、分级规范 |
| 气象灾害 | 1 | 10+ | 防灾减灾指南 |

### 12.2 知识库管理 API

```http
# 文档 CRUD
POST   /api/knowledge/documents      # 添加文档
GET    /api/knowledge/documents      # 获取文档列表
GET    /api/knowledge/documents/:id  # 获取文档详情
PUT    /api/knowledge/documents/:id  # 更新文档
DELETE /api/knowledge/documents/:id  # 删除文档

# 语义检索
POST   /api/knowledge/search         # 向量检索

# 知识库管理
POST   /api/knowledge/reindex        # 重建向量索引
GET    /api/knowledge/stats          # 知识库统计
```

### 12.3 文档导入流程

```text
管理员上传文档（PDF / Word / Markdown）
  ↓
文档解析（提取文本）
  ↓
自动分块（Chunking）
  ↓
向量化（Embedding）
  ↓
存入向量数据库 + 关系型数据库（元数据）
  ↓
完成，可被检索
```

---

## 13. 数据库实施计划

### 13.1 阶段划分

| 阶段 | 内容 | 依赖 | 产出 |
|------|------|------|------|
| **Phase 2.1** | Prisma + SQLite 集成 | 无 | 会话/消息持久化 |
| **Phase 2.2** | 知识库文档管理 CRUD | Phase 2.1 | 文档可增删改查 |
| **Phase 2.3** | ChromaDB 部署 + 向量化 | ChromaDB Docker | 向量检索可用 |
| **Phase 2.4** | RAG 流程打通 | Phase 2.3 + LLM API | 知识库增强回答 |
| **Phase 2.5** | 迁移到 PostgreSQL（可选） | 生产环境需求 | 支持并发和持久化 |

### 13.2 Phase 2.1 详细任务

```
backend/
├── prisma/
│   ├── schema.prisma          # 数据模型定义
│   └── seed.ts                # 种子数据（迁移现有 8 篇文档）
├── src/
│   ├── lib/
│   │   └── prisma.ts          # Prisma 客户端单例
│   ├── services/
│   │   ├── session.service.ts # 改用 Prisma 操作
│   │   ├── message.service.ts # 消息 CRUD
│   │   └── knowledge.service.ts # 知识库 CRUD
│   └── routes/
│       └── knowledge.routes.ts # 知识库管理接口
```

---

## 14. 非功能需求

### 14.1 性能要求

| 指标 | Phase 1 | Phase 2 目标 |
|------|---------|--------------|
| 普通问答响应 | 3 秒 | 3-5 秒（含 LLM 调用） |
| RAG 检索延迟 | N/A | < 500ms |
| 向量化延迟 | N/A | < 200ms/文档 |
| 数据库查询 | N/A | < 50ms |
| 并发支持 | 20-50 | 50-100 |

### 14.2 数据安全

1. 数据库连接字符串存放在环境变量中
2. LLM API Key 不得硬编码在代码中
3. 用户会话数据按 session_id 隔离
4. 知识库文档支持软删除，防止误删
5. 工具调用日志记录完整输入输出，便于审计

### 14.3 可扩展性

1. Prisma 支持数据库迁移（`prisma migrate`），schema 变更可控
2. 向量数据库与关系型数据库解耦，可独立扩展
3. Embedding 模型可切换，只需重新生成向量
4. LLM 提供商可切换，通过环境变量配置

---

## 15. 技术依赖清单

### 15.1 新增 npm 依赖

```json
{
  "dependencies": {
    "@prisma/client": "^6.0.0",
    "ai": "^4.0.0",
    "@ai-sdk/openai": "^1.0.0",
    "chromadb": "^1.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "prisma": "^6.0.0"
  }
}
```

### 15.2 基础设施依赖

| 组件 | 部署方式 | 说明 |
|------|----------|------|
| SQLite | 嵌入式 | 开发阶段零配置 |
| PostgreSQL | Docker / 云服务 | 生产阶段 |
| ChromaDB | Docker | 向量数据库 |
| LLM API | 云服务 | OpenAI / 通义千问 / DeepSeek |

### 15.3 Docker Compose（可选）

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: kumquat
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  chroma:
    image: chromadb/chroma
    ports:
      - "8000:8000"
    volumes:
      - chromadata:/chroma/chroma

volumes:
  pgdata:
  chromadata:
```

---

## 16. 验收标准

### 16.1 智能体架构验收

| 验收项 | 标准 |
|--------|------|
| LLM 回答可用 | 接入 LLM 后，回答质量明显优于模板 |
| Tool Calling 正常 | LLM 能正确选择和调用工具 |
| 多步推理 | 复杂问题能自动多步调用工具 |
| 流式输出 | 前端支持逐字显示（SSE） |
| 模型可切换 | 通过环境变量切换不同 LLM |

### 16.2 数据库验收

| 验收项 | 标准 |
|--------|------|
| 会话持久化 | 重启后会话数据不丢失 |
| 消息可查询 | 支持按 session 查询历史消息 |
| 知识库 CRUD | 文档可增删改查 |
| 向量检索可用 | 输入问题能返回相关文档片段 |
| RAG 回答增强 | 回答引用知识库内容，有 references |
| 日志可追溯 | 工具调用记录完整 |

### 16.3 端到端验收用例

**用例一：知识库增强问答**

```
输入："脆蜜金桔花期落花严重怎么办？"
预期：
  1. 向量检索返回相关知识库文档
  2. LLM 基于检索结果生成回答
  3. 返回 answer + references + recommendations
  4. 会话和消息持久化到数据库
```

**用例二：多工具协作**

```
输入："明天适合打药吗？"
预期：
  1. LLM 判断需要天气数据
  2. 调用天气查询工具
  3. 调用知识库检索打药注意事项
  4. 综合生成回答
  5. 返回 answer + cards + suggested_questions
```

**用例三：上下文记忆**

```
第一轮："金桔开花期怎么管理？"
第二轮："那遇到连续降雨怎么办？"
预期：第二轮能理解"那"指代的是花期，结合上下文回答
```

---

## 17. 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| LLM API 不稳定 | 回答生成失败 | 降级到模板回答 + 重试机制 |
| LLM 成本超预期 | 运营成本高 | 控制 max_tokens、使用便宜模型、缓存常见问答 |
| 向量检索不准 | RAG 效果差 | 优化分块策略、调整相似度阈值、人工标注测试集 |
| ChromaDB 性能瓶颈 | 检索延迟高 | 迁移到 pgvector 或 Milvus |
| 数据库迁移复杂 | 上线风险 | Prisma migrate 自动管理、先在测试环境验证 |

---

## 18. 一句话总结

本 PRD 规划了脆蜜金桔 AI 智能体 Phase 2 的两大核心升级：**智能体架构**从关键词路由+模板拼接升级为 LLM 驱动的 Agent + Tool Calling；**数据层**从内存存储升级为 Prisma 关系型数据库 + ChromaDB 向量数据库的 RAG 架构。升级后前端接口保持不变，回答质量和知识库能力将大幅提升。
