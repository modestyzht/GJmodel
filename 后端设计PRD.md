下面是一份可直接用于后端开发沟通、任务拆分和答辩说明的 **《脆蜜金桔 AI 智能体后端开发 PRD》**。重点已按照你的实际职责边界处理：**你负责前端与智能体编排框架，具体模型训练、模型服务实现、物联网接口和天气接口实现不属于你的任务，但后端需要预留标准化调用能力。**

---

# 脆蜜金桔 AI 智能体 — 后端开发 PRD

## 1. 项目背景

脆蜜金桔种植管理涉及物候判断、花果管理、病虫害识别、气象风险预警、农事建议等多个专业场景。传统系统通常以菜单和表单为主，用户需要主动查找功能，使用门槛较高。

本项目希望构建一个面向脆蜜金桔种植场景的 **AI 智能体平台**。用户可以通过自然语言提问、上传果树图片、选择地块等方式，由系统自动判断问题类型，并调用对应的专家智能体完成分析和回答。

前端已完成以 **React 18 + TypeScript + Vite 6 + Tailwind CSS 3** 为基础的 AI 工作台页面设计，包括侧边栏、知识库面板、快捷问题和 AI 输入框。后端需要围绕前端交互，提供统一的智能体会话接口、任务分发能力、专家智能体编排能力和工具调用适配能力。

---

## 2. 产品目标

### 2.1 总体目标

建设一个支持多智能体协同的后端服务，使前端能够通过统一接口完成以下能力：

1. 用户自然语言提问；
2. 用户上传图片并发起诊断；
3. 主控智能体自动判断任务类型；
4. 分发给对应专家智能体；
5. 专家智能体调用图像识别模型、知识库、物联网数据、天气预报等工具；
6. 生成结构化、可展示、可追溯的种植管理建议。

---

## 3. 开发边界

### 3.1 本阶段需要实现

| 模块        | 是否需要实现 | 说明                       |
| --------- | -----: | ------------------------ |
| 智能体后端服务   |      是 | 提供统一 AI 会话接口             |
| 主控智能体     |      是 | 负责任务识别、意图判断、智能体分发        |
| 专家智能体编排   |      是 | 包括保花保果、物候期识别、气象预测三个专家智能体 |
| 知识库检索接口   |      是 | 可先使用本地文档、向量库或 Mock 数据    |
| 工具调用适配层   |      是 | 封装模型接口、天气接口、物联网接口的调用方式   |
| Mock 数据能力 |      是 | 在真实模型/接口未完成前，保证前端可联调     |
| 会话管理      |      是 | 支持 session_id、历史对话记录     |
| 统一响应格式    |      是 | 支持前端卡片、文本、建议列表展示         |
| 日志与调用链记录  |   建议实现 | 便于调试主模型分发逻辑              |

### 3.2 本阶段不需要实现

| 模块          | 是否属于本任务 | 说明              |
| ----------- | ------: | --------------- |
| 花期识别模型训练    |       否 | 由模型团队或其他模块提供    |
| 病虫害图像识别模型训练 |       否 | 后端只预留调用接口       |
| 物候期识别模型训练   |       否 | 后端只接收识别结果       |
| 精准气象预测算法    |       否 | 后端只编排物联网数据与天气接口 |
| 物联网设备数据采集   |       否 | 由设备侧或数据服务提供     |
| 第三方天气接口开发   |       否 | 后端只对接或 Mock     |
| 农业知识专家标注    |       否 | 后端只支持知识库接入与检索   |

---

## 4. 用户角色

| 角色           | 使用场景                    |
| ------------ | ----------------------- |
| 果农 / 种植户     | 询问金桔种植问题、上传图片诊断、查看农事建议  |
| 农技员          | 辅助判断病虫害、物候期、气象风险，给出专业指导 |
| 管理人员         | 查看系统能力、演示智能体平台、管理知识库内容  |
| 前端开发人员       | 调用统一后端接口，实现页面展示和交互      |
| 模型 / 数据接口提供方 | 提供图像模型、天气接口、物联网数据接口     |

---

## 5. 整体系统架构

### 5.1 架构概览

```text
前端 React 工作台
  ├── Sidebar
  ├── KnowledgePanel
  ├── QuickQuestions
  └── ChatInput
        ↓
后端 Agent Service
        ↓
主控智能体 Orchestrator Agent
        ↓
专家智能体层
  ├── 保花保果智能体 FlowerFruit Agent
  ├── 物候期识别智能体 Phenology Agent
  └── 气象预测智能体 Weather Agent
        ↓
工具 / 数据适配层
  ├── 图像识别模型接口
  ├── 病虫害识别接口
  ├── 物候期识别接口
  ├── 知识库检索接口
  ├── 物联网实时数据接口
  └── 天气预报接口
```

### 5.2 设计原则

1. **前端只调用一个统一入口**
   前端不直接判断调用哪个智能体，所有问题统一提交给 `/api/agent/chat`。

2. **主控智能体负责任务分发**
   主控智能体根据文本、图片、地块、上下文判断任务类型。

3. **专家智能体只处理专业场景**
   保花保果、物候期识别、气象预测分别封装成独立专家智能体。

4. **模型和外部接口通过工具层解耦**
   真实模型未完成时，工具层可返回 Mock 数据，不影响前后端联调。

5. **响应结果结构化**
   后端返回不仅包含自然语言回答，还应包含前端可渲染的卡片、标签、风险等级、建议列表等结构化字段。

---

## 6. 核心功能需求

## 6.1 统一智能体会话接口

### 功能说明

前端通过统一接口向后端发送用户问题、图片、地块 ID、会话 ID 等信息。后端完成任务识别、专家智能体调用和结果生成。

### 接口建议

```http
POST /api/agent/chat
```

### 请求参数

```json
{
  "session_id": "session_001",
  "user_id": "user_001",
  "message": "这棵金桔现在是不是开花期？需要怎么管理？",
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "type": "tree"
    }
  ],
  "plot_id": "plot_001",
  "source": "chat_input"
}
```

### 字段说明

| 字段         | 类型     | 必填 | 说明                                     |
| ---------- | ------ | -: | -------------------------------------- |
| session_id | string |  否 | 会话 ID，没有则后端新建                          |
| user_id    | string |  否 | 用户 ID                                  |
| message    | string |  是 | 用户输入内容                                 |
| images     | array  |  否 | 图片列表                                   |
| plot_id    | string |  否 | 地块 ID                                  |
| source     | string |  否 | 来源，如 chat_input、quick_question、sidebar |

---

## 6.2 主控智能体任务分发

### 功能说明

主控智能体负责理解用户意图，并决定调用哪个专家智能体。

### 主控智能体需要识别的任务类型

| 任务类型        | 说明                | 推荐分发智能体        |
| ----------- | ----------------- | -------------- |
| 花期判断        | 判断是否处于花期、花量情况     | 保花保果智能体        |
| 保花保果建议      | 防落花、防落果、坐果期管理     | 保花保果智能体        |
| 病虫害诊断       | 根据图片或描述判断病虫害      | 保花保果智能体        |
| 物候期识别       | 判断金桔树当前生长周期       | 物候期识别智能体       |
| 阶段性农事建议     | 根据当前生长阶段给出管理方案    | 物候期识别智能体       |
| 气象风险判断      | 判断降雨、低温、高温、霜冻风险   | 气象预测智能体        |
| 打药 / 采摘天气窗口 | 判断未来是否适合打药、采摘、施肥  | 气象预测智能体        |
| 知识库问答       | 查询种植标准、病虫害防治、采收分级 | 可由主控或对应专家调用知识库 |
| 闲聊 / 无关问题   | 与种植无关的问题          | 主控智能体直接回复或拒答   |

### 主控智能体输出结构

主控智能体应优先输出结构化 JSON，便于后端程序执行。

```json
{
  "intent": "phenology_recognition",
  "target_agent": "phenology_agent",
  "need_image_model": true,
  "need_knowledge_base": true,
  "need_iot_data": false,
  "need_weather_forecast": false,
  "confidence": 0.91,
  "reason": "用户上传果树图片并询问当前生长阶段，属于物候期识别任务。"
}
```

---

## 6.3 保花保果智能体

### 功能定位

负责处理脆蜜金桔花期、坐果期、幼果期、病虫害、防落花落果等问题。

### 典型问题

```text
现在是不是花期？
金桔开花期怎么管理？
为什么落花严重？
幼果发黄怎么办？
叶片有黑斑是什么病？
这张图是不是炭疽病？
保果期能不能施肥？
```

### 可调用工具

| 工具                       | 说明      | 当前实现方式      |
| ------------------------ | ------- | ----------- |
| flower_stage_recognition | 花期图像识别  | Mock / 预留接口 |
| disease_detection        | 病虫害图像识别 | Mock / 预留接口 |
| knowledge_base_search    | 知识库检索   | 可先本地实现      |
| plot_info_query          | 查询地块信息  | 可选          |
| weather_forecast_query   | 查询天气信息  | 可选          |

### 输出内容要求

| 输出项    | 说明                |
| ------ | ----------------- |
| 识别结论   | 如“疑似开花期”“疑似炭疽病风险” |
| 置信度    | 来自模型或 Mock        |
| 风险等级   | 低 / 中 / 高         |
| 可能原因   | 结合知识库解释           |
| 管理建议   | 给出具体农事操作          |
| 注意事项   | 提醒用户结合实际情况        |
| 工具调用记录 | 标明调用了哪些工具         |

### 返回示例

```json
{
  "agent": "flower_fruit_agent",
  "intent": "flower_fruit_protection",
  "summary": "根据图片和描述，当前金桔树疑似处于开花坐果关键期，存在中等落花落果风险。",
  "result": {
    "stage": "开花坐果期",
    "disease": "未发现明显病斑",
    "risk_level": "中",
    "confidence": 0.86
  },
  "recommendations": [
    "建议保持园区通风透光，避免湿度过高。",
    "花期不建议大量施用氮肥，避免营养生长过旺。",
    "近期如有连续降雨，应重点关注灰霉病、炭疽病等风险。",
    "可结合树势情况进行保花保果管理。"
  ],
  "tools_used": [
    "flower_stage_recognition",
    "knowledge_base_search"
  ]
}
```

---

## 6.4 物候期识别智能体

### 功能定位

负责根据图片、时间、地块信息、历史数据判断脆蜜金桔当前所处的生长周期。

### 物候期建议分类

```text
萌芽期
抽梢期
现蕾期
开花期
坐果期
膨果期
转色期
成熟采收期
采后恢复期
越冬管理期
```

### 典型问题

```text
这棵树现在是什么阶段？
现在能不能修剪？
现在应该施什么肥？
什么时候开始保果？
现在是不是采收期？
下一阶段要注意什么？
```

### 可调用工具

| 工具                    | 说明           | 当前实现方式      |
| --------------------- | ------------ | ----------- |
| phenology_recognition | 物候期图像识别      | Mock / 预留接口 |
| knowledge_base_search | 查询当前物候期管理知识  | 可先本地实现      |
| plot_info_query       | 查询地块、树龄、种植信息 | 可选          |
| history_record_query  | 查询历史农事记录     | 可选          |

### 输出内容要求

| 输出项      | 说明             |
| -------- | -------------- |
| 当前物候期    | 如“开花期”“膨果期”    |
| 识别依据     | 花、果、叶、枝梢等特征    |
| 置信度      | 模型结果或 Mock     |
| 当前阶段管理重点 | 如控梢、保果、水肥管理    |
| 下一阶段预测   | 如“预计进入坐果期”     |
| 农事建议     | 当前适合做什么、不适合做什么 |

### 返回示例

```json
{
  "agent": "phenology_agent",
  "intent": "phenology_recognition",
  "summary": "根据图片特征，当前脆蜜金桔疑似处于开花期，应重点做好保花和病害预防。",
  "result": {
    "phenology_stage": "开花期",
    "confidence": 0.89,
    "features": [
      "枝梢可见花朵",
      "部分叶片较嫩",
      "未见明显膨大果实"
    ]
  },
  "recommendations": [
    "保持树体通风透光，降低花期病害发生风险。",
    "避免过量浇水和偏施氮肥。",
    "关注天气变化，连续阴雨时应加强病害预防。",
    "下一阶段需重点关注坐果率和幼果发育情况。"
  ],
  "tools_used": [
    "phenology_recognition",
    "knowledge_base_search"
  ]
}
```

---

## 6.5 气象预测智能体

### 功能定位

负责结合果园物联网实时数据和当地天气预报，判断未来天气对脆蜜金桔生产管理的影响。

### 典型问题

```text
明天适合打药吗？
今晚会不会低温？
未来三天适合采摘吗？
最近要不要浇水？
暴雨会不会影响坐果？
未来一周有没有高温风险？
```

### 可调用工具

| 工具                      | 说明         | 当前实现方式      |
| ----------------------- | ---------- | ----------- |
| iot_realtime_data_query | 查询果园实时环境数据 | Mock / 预留接口 |
| weather_forecast_query  | 查询当地天气预报   | Mock / 预留接口 |
| plot_location_query     | 查询地块位置     | 可选          |
| knowledge_base_search   | 查询农事气象规则   | 可先本地实现      |

### 物联网数据字段

```json
{
  "temperature": 26.5,
  "humidity": 82,
  "soil_temperature": 22.1,
  "soil_moisture": 38,
  "light_intensity": 12000,
  "wind_speed": 2.4,
  "rainfall": 0,
  "leaf_wetness": 0.7
}
```

### 输出内容要求

| 输出项    | 说明                     |
| ------ | ---------------------- |
| 天气趋势   | 未来几小时 / 几天变化           |
| 当前地块环境 | 来自物联网数据                |
| 风险等级   | 低 / 中 / 高              |
| 对金桔影响  | 对花期、坐果、病虫害、采收等影响       |
| 操作建议   | 是否适合打药、施肥、灌溉、采摘        |
| 建议时间窗口 | 如“明天上午 8:00—10:00 较适合” |

### 返回示例

```json
{
  "agent": "weather_agent",
  "intent": "weather_risk_prediction",
  "summary": "未来 24 小时湿度较高，并有小雨概率，不建议安排喷药作业。",
  "result": {
    "risk_level": "中",
    "weather_trend": "未来 24 小时湿度偏高，局部有小雨。",
    "iot_data": {
      "temperature": 25.8,
      "humidity": 86,
      "soil_moisture": 41,
      "wind_speed": 3.1
    }
  },
  "recommendations": [
    "不建议在降雨前后进行喷药，药效可能受到影响。",
    "如必须防治病害，建议选择无雨且风速较低的时间窗口。",
    "湿度偏高时应关注炭疽病、灰霉病等病害风险。",
    "建议优先检查园区排水和通风情况。"
  ],
  "tools_used": [
    "iot_realtime_data_query",
    "weather_forecast_query",
    "knowledge_base_search"
  ]
}
```

---

# 7. 知识库模块需求

## 7.1 功能定位

知识库用于支撑智能体回答专业农业问题，避免模型只依赖通用知识生成答案。

## 7.2 知识库内容范围

| 分类    | 内容示例                |
| ----- | ------------------- |
| 种植标准  | 脆蜜金桔栽培规范、树体管理标准     |
| 病虫害防治 | 炭疽病、溃疡病、红蜘蛛、蚜虫等防治资料 |
| 水肥管理  | 不同阶段施肥、灌溉、控水建议      |
| 花果管理  | 保花、保果、疏果、控梢管理       |
| 采收分级  | 成熟度判断、采收标准、分级标准     |
| 气象灾害  | 高温、低温、暴雨、霜冻、干旱应对措施  |

## 7.3 检索接口建议

```http
POST /api/knowledge/search
```

### 请求示例

```json
{
  "query": "脆蜜金桔花期如何保花保果",
  "top_k": 5,
  "tags": ["花果管理", "水肥管理"]
}
```

### 响应示例

```json
{
  "documents": [
    {
      "title": "脆蜜金桔花期管理规范",
      "content": "花期应保持适宜水分，避免偏施氮肥...",
      "score": 0.91,
      "source": "knowledge_base"
    }
  ]
}
```

---

# 8. 前端对接需求

## 8.1 与现有前端模块对应关系

| 前端模块              | 后端能力                                    |
| ----------------- | --------------------------------------- |
| Sidebar 常用功能      | 可作为默认 intent 或 quick entry              |
| 历史对话              | 对接会话历史接口                                |
| KnowledgePanel 标签 | 对接知识库分类                                 |
| QuickQuestions    | 直接调用 `/api/agent/chat`                  |
| ChatInput         | 核心对话入口                                  |
| 图片上传能力            | 后续可扩展到 ChatInput 或独立上传组件                |
| 结果展示区域            | 使用后端返回的 answer、cards、recommendations 渲染 |

---

## 8.2 统一响应格式

为了方便前端展示，建议后端统一返回以下结构：

```json
{
  "session_id": "session_001",
  "message_id": "msg_001",
  "agent": "phenology_agent",
  "intent": "phenology_recognition",
  "answer": "根据图片特征，当前脆蜜金桔疑似处于开花期，应重点做好保花和病害预防。",
  "summary": "当前疑似处于开花期，建议加强保花管理。",
  "cards": [
    {
      "type": "stage",
      "title": "识别物候期",
      "value": "开花期",
      "description": "根据花朵和枝梢特征判断"
    },
    {
      "type": "risk",
      "title": "风险等级",
      "value": "中",
      "description": "近期湿度较高，需关注病害风险"
    }
  ],
  "recommendations": [
    "保持树体通风透光。",
    "避免花期大水大肥。",
    "连续阴雨天气注意病害预防。"
  ],
  "references": [
    {
      "title": "脆蜜金桔花期管理规范",
      "source": "knowledge_base"
    }
  ],
  "tools_used": [
    "phenology_recognition",
    "knowledge_base_search"
  ],
  "need_more_info": false,
  "suggested_questions": [
    "开花期可以施肥吗？",
    "现在适合打药吗？",
    "如何提高坐果率？"
  ]
}
```

---

# 9. 会话管理需求

## 9.1 新建会话

```http
POST /api/sessions
```

响应：

```json
{
  "session_id": "session_001",
  "title": "新的脆蜜金桔咨询"
}
```

## 9.2 获取历史会话

```http
GET /api/sessions
```

响应：

```json
{
  "sessions": [
    {
      "session_id": "session_001",
      "title": "脆蜜金桔裂果怎么办？",
      "updated_at": "2026-05-19 10:30:00"
    }
  ]
}
```

## 9.3 获取会话消息

```http
GET /api/sessions/{session_id}/messages
```

响应：

```json
{
  "messages": [
    {
      "role": "user",
      "content": "脆蜜金桔裂果怎么办？",
      "created_at": "2026-05-19 10:30:00"
    },
    {
      "role": "assistant",
      "content": "裂果通常与水分波动、钙素不足、果皮发育等因素有关...",
      "created_at": "2026-05-19 10:30:05"
    }
  ]
}
```

---

# 10. 工具适配层需求

## 10.1 工具列表

| 工具名称                     | 功能       | 当前状态      |
| ------------------------ | -------- | --------- |
| flower_stage_recognition | 花期识别     | Mock / 预留 |
| disease_detection        | 病虫害识别    | Mock / 预留 |
| phenology_recognition    | 物候期识别    | Mock / 预留 |
| iot_realtime_data_query  | 物联网实时数据  | Mock / 预留 |
| weather_forecast_query   | 天气预报     | Mock / 预留 |
| knowledge_base_search    | 知识库检索    | 需要实现      |
| plot_info_query          | 地块信息查询   | 可选实现      |
| history_record_query     | 历史农事记录查询 | 可选实现      |

## 10.2 工具调用统一格式

```json
{
  "tool_name": "phenology_recognition",
  "input": {
    "image_url": "https://example.com/tree.jpg",
    "plot_id": "plot_001"
  }
}
```

## 10.3 工具返回统一格式

```json
{
  "tool_name": "phenology_recognition",
  "success": true,
  "data": {
    "stage": "开花期",
    "confidence": 0.89
  },
  "error": null
}
```

---

# 11. 智能体工作流

## 11.1 图片识别类问题

```text
用户上传图片并提问
  ↓
/api/agent/chat
  ↓
主控智能体判断是否需要图像识别
  ↓
识别任务类型：病虫害 / 花期 / 物候期
  ↓
调用对应专家智能体
  ↓
专家智能体调用图像模型工具
  ↓
调用知识库补充专业解释
  ↓
生成回答
  ↓
返回前端
```

## 11.2 纯文本知识问答

```text
用户输入问题
  ↓
主控智能体判断为知识库问答
  ↓
检索脆蜜金桔知识库
  ↓
主控或专家智能体生成回答
  ↓
返回答案 + 参考来源 + 推荐问题
```

## 11.3 气象类问题

```text
用户询问天气 / 打药 / 采摘 / 灌溉
  ↓
主控智能体判断为气象预测任务
  ↓
调用气象预测智能体
  ↓
查询地块位置
  ↓
查询物联网实时数据
  ↓
查询当地天气预报
  ↓
结合知识库规则判断风险
  ↓
返回操作建议
```

---

# 12. 非功能需求

## 12.1 性能要求

| 指标          | 要求                 |
| ----------- | ------------------ |
| 普通知识问答响应时间  | 3 秒内优先返回           |
| 图像识别类响应时间   | 5—10 秒内返回          |
| 气象类响应时间     | 5 秒内返回             |
| Mock 工具响应时间 | 1 秒内               |
| 支持并发        | 初期支持 20—50 个并发请求即可 |

## 12.2 稳定性要求

1. 任一工具调用失败时，主流程不能直接崩溃；
2. 应返回友好的降级提示；
3. 外部接口不可用时使用 Mock 或缓存数据；
4. 模型无结果时，应提示用户补充图片、地块或问题描述。

示例：

```json
{
  "answer": "当前图片识别服务暂不可用，我可以先根据你的文字描述和知识库给出初步建议。",
  "need_more_info": true,
  "suggested_questions": [
    "请补充叶片或果实的近景照片",
    "请说明最近是否连续降雨",
    "请说明当前是否处于开花或挂果阶段"
  ]
}
```

## 12.3 安全要求

1. 上传图片需限制类型：jpg、jpeg、png、webp；
2. 上传图片需限制大小，例如不超过 10MB；
3. 接口需做基础参数校验；
4. 不应暴露模型服务真实地址；
5. 外部接口密钥应存放在环境变量中；
6. 用户会话数据应按 session_id 隔离。

## 12.4 可扩展性要求

后续应支持新增专家智能体，例如：

```text
水肥管理智能体
病虫害防治智能体
采收分级智能体
市场行情智能体
农事计划智能体
```

因此主控智能体的分发逻辑应设计为可配置结构，而不是写死在代码中。

---

# 13. 后端接口清单

| 接口                            | 方法   | 功能         |
| ----------------------------- | ---- | ---------- |
| `/api/agent/chat`             | POST | 统一智能体对话    |
| `/api/sessions`               | POST | 新建会话       |
| `/api/sessions`               | GET  | 获取会话列表     |
| `/api/sessions/{id}/messages` | GET  | 获取会话消息     |
| `/api/upload/image`           | POST | 上传图片       |
| `/api/knowledge/search`       | POST | 知识库检索      |
| `/api/tools/mock/phenology`   | POST | Mock 物候期识别 |
| `/api/tools/mock/disease`     | POST | Mock 病虫害识别 |
| `/api/tools/mock/weather`     | POST | Mock 气象预测  |
| `/api/plots`                  | GET  | 获取地块列表，可选  |
| `/api/plots/{id}`             | GET  | 获取地块详情，可选  |

---

# 14. 数据模型建议

## 14.1 Session

```ts
type Session = {
  id: string;
  userId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};
```

## 14.2 Message

```ts
type Message = {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  images?: string[];
  agent?: string;
  intent?: string;
  createdAt: string;
};
```

## 14.3 AgentResponse

```ts
type AgentResponse = {
  session_id: string;
  message_id: string;
  agent: string;
  intent: string;
  answer: string;
  summary?: string;
  cards?: AgentCard[];
  recommendations?: string[];
  references?: Reference[];
  tools_used?: string[];
  need_more_info?: boolean;
  suggested_questions?: string[];
};
```

## 14.4 AgentCard

```ts
type AgentCard = {
  type: "stage" | "risk" | "weather" | "disease" | "operation" | "default";
  title: string;
  value: string;
  description?: string;
};
```

---

# 15. 前后端联调建议

## 第一阶段：Mock 联调

目标：前端页面可以完整跑通 AI 对话流程。

实现内容：

1. `/api/agent/chat` 返回固定结构；
2. 根据关键词简单模拟分发：

   * 包含“开花”“落花”“保果”“病虫害” → 保花保果智能体；
   * 包含“阶段”“物候”“生长期” → 物候期智能体；
   * 包含“天气”“打药”“采摘”“降雨”“低温” → 气象智能体；
3. 所有模型调用使用 Mock；
4. 前端完成回答、卡片、建议列表展示。

## 第二阶段：知识库接入

目标：让回答具备专业依据。

实现内容：

1. 接入本地知识文档；
2. 建立知识库检索接口；
3. 专家智能体调用知识库；
4. 返回 references 给前端展示。

## 第三阶段：真实接口替换

目标：替换 Mock 工具为真实服务。

实现内容：

1. 替换图像识别接口；
2. 替换物联网数据接口；
3. 替换天气预报接口；
4. 保持前端和主控智能体接口不变。

---

# 16. 验收标准

## 16.1 主流程验收

| 验收项           | 标准                              |
| ------------- | ------------------------------- |
| 用户可发起对话       | 输入问题后后端能返回回答                    |
| 主控智能体可分发任务    | 不同问题能路由到不同专家智能体                 |
| 专家智能体可返回结构化结果 | 返回 answer、cards、recommendations |
| 前端可展示结果       | 前端能正常渲染回答、卡片、建议                 |
| Mock 工具可用     | 无真实模型时也能完整演示                    |
| 会话可保存         | 刷新后可查看历史会话                      |
| 错误可降级         | 工具失败时返回友好提示                     |

## 16.2 示例验收用例

### 用例一：保花保果

输入：

```text
脆蜜金桔开花期落花严重怎么办？
```

预期：

```text
分发到 flower_fruit_agent
返回落花原因、风险等级、保花建议
```

### 用例二：物候期识别

输入：

```text
帮我看看这棵树现在是什么阶段
```

并上传图片。

预期：

```text
分发到 phenology_agent
调用物候期识别工具
返回当前物候期、置信度、农事建议
```

### 用例三：气象预测

输入：

```text
明天适合打药吗？
```

预期：

```text
分发到 weather_agent
调用天气预报和物联网 Mock 数据
返回是否适合打药、风险等级、建议时间窗口
```

---

# 17. 推荐项目目录结构

如果后端使用 Node.js / TypeScript，可以采用：

```text
backend/
├── package.json
├── src/
│   ├── main.ts
│   ├── app.ts
│   ├── routes/
│   │   ├── agent.routes.ts
│   │   ├── session.routes.ts
│   │   ├── upload.routes.ts
│   │   └── knowledge.routes.ts
│   ├── agents/
│   │   ├── orchestrator.agent.ts
│   │   ├── flowerFruit.agent.ts
│   │   ├── phenology.agent.ts
│   │   └── weather.agent.ts
│   ├── tools/
│   │   ├── imageRecognition.tool.ts
│   │   ├── diseaseDetection.tool.ts
│   │   ├── phenologyRecognition.tool.ts
│   │   ├── iotData.tool.ts
│   │   ├── weatherForecast.tool.ts
│   │   └── knowledgeSearch.tool.ts
│   ├── services/
│   │   ├── session.service.ts
│   │   ├── message.service.ts
│   │   ├── knowledge.service.ts
│   │   └── agent.service.ts
│   ├── mocks/
│   │   ├── phenology.mock.ts
│   │   ├── disease.mock.ts
│   │   └── weather.mock.ts
│   ├── types/
│   │   ├── agent.ts
│   │   ├── message.ts
│   │   ├── tool.ts
│   │   └── response.ts
│   └── utils/
│       ├── responseFormatter.ts
│       └── intentClassifier.ts
```

---

# 18. 一句话总结

本项目后端应建设为一个 **多智能体协同调度服务**：前端通过统一对话接口提交用户问题，主控智能体负责任务识别与分发，保花保果、物候期识别、气象预测三个专家智能体分别调用图像模型、知识库、物联网数据和天气预报工具，最终返回可供前端直接展示的结构化种植建议。当前阶段重点是完成 **智能体框架、任务分发、Mock 工具、知识库接入和前后端联调**，具体模型训练和外部接口实现不在本开发任务范围内。
