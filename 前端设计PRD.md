# 脆蜜金桔 AI 智能体 — 前端设计文档

## 1. 技术栈

| 层面 | 选型 |
| --- | --- |
| 框架 | React 18 |
| 语言 | TypeScript |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS 3 |
| 背景 | 实拍图片 + CSS 渐变蒙版叠加 |

---

## 2. 项目结构

```
plan2/
├── index.html                       # 入口 HTML
├── package.json                     # 依赖与脚本
├── vite.config.ts                   # Vite 配置
├── tailwind.config.js               # Tailwind 主题（色彩/字体）
├── postcss.config.js                # PostCSS 配置
├── tsconfig.json                    # TS 根配置
├── tsconfig.app.json                # TS 应用配置
├── tsconfig.node.json               # TS Node 配置
├── public/
│   └── images/
│       └── tree-branch-growth-.jpg  # 背景图片
└── src/
    ├── main.tsx                     # React 入口
    ├── App.tsx                      # 根组件，组装布局
    ├── index.css                    # 全局样式 + Tailwind 指令 + 玻璃拟态工具类
    ├── vite-env.d.ts
    ├── data/
    │   └── constants.ts             # 所有静态数据集中管理
    └── components/
        ├── Layout.tsx               # 三段式布局 + 背景层
        ├── Header.tsx               # 顶部栏
        ├── Sidebar.tsx              # 左侧导航 + 历史对话
        ├── HeroTitle.tsx            # 主标题（已隐藏，保留备用）
        ├── FeatureCard.tsx          # 单张功能卡片（已隐藏，保留备用）
        ├── FeatureCardGrid.tsx      # 功能卡片网格（已隐藏，保留备用）
        ├── KnowledgePanel.tsx       # 知识库面板
        └── ChatInput.tsx            # AI 对话输入框
```

---

## 3. 页面布局

```
┌──────────────────────────────────────────────────┐
│  Header：平台名称 + 语言切换 + 用户头像            │
├──────────┬───────────────────────────────────────┤
│          │                                       │
│ Sidebar  │  主内容区                              │
│          │  ┌─────────────────────────────────┐  │
│ + 新建对话│  │  脆蜜金桔知识库                    │  │
│          │  │  标签 / 快捷问题                  │  │
│ 常用功能  │  └─────────────────────────────────┘  │
│ 果园档案  │                                       │
│ 地块管理  │  ┌─────────────────────────────────┐  │
│ 农事记录  │  │  AI 输入框（置底）               │  │
│ 病虫害识别│  └─────────────────────────────────┘  │
│ 长势分析  │                                       │
│ 采收预测  │                                       │
│ 气象预警  │                                       │
│ 金桔知识库│                                       │
│          │                                       │
│ 历史对话  │                                       │
│ ...      │                                       │
└──────────┴───────────────────────────────────────┘
```

- 侧边栏宽度固定 260px
- 主内容区自适应剩余宽度，垂直 flex 布局
- 知识库面板在上，输入框通过 `mt-auto` 推至底部

---

## 4. 色彩体系

Tailwind 自定义颜色 token（`tailwind.config.js`）：

| Token | 色值 | 用途 |
| --- | --- | --- |
| `kumquat` | `#F6A623` | 主色，发送按钮、hover 强调 |
| `kumquat-light` | `#F8B84E` | 按钮 hover 态 |
| `orchard` | `#45A86B` | 辅色，新建对话按钮、标签背景 |
| `orchard-dark` | `#2F7D4F` | 深绿强调、标题文字、标签文字 |
| `beige` | `#FFF8E8` | 页面底色（body fallback） |

字体：`PingFang SC` → `Microsoft YaHei` → `Noto Sans SC` → `sans-serif`

---

## 5. 背景方案

采用 **实拍图 + 渐变蒙版** 双层叠加：

```
底层：<img> 背景图
  opacity: 0.65
  filter: blur(6px)
  object-fit: cover
  position: absolute

上层：<div> 渐变蒙版
  opacity: 0.50
  渐变：线性 175° 绿→米→黄 + 右上橙色光斑 + 左下绿色光斑
```

两个背景层使用 `absolute inset-0` 铺满，内容区使用 `relative z-[1]` 浮于背景之上。

---

## 6. 设计效果

### 玻璃拟态（Glassmorphism）

定义了三个 Tailwind 组件类：

```css
.glass        → bg-white/60 backdrop-blur-md border border-white/80
.glass-card   → glass + rounded-2xl shadow-lg
.glass-hover  → glass-card + hover 时提升透明度 + 微上移
```

### 侧边栏

- 玻璃拟态底色，右侧半透明分割线
- 新建对话按钮：果园绿底色，白色文字，带阴影
- 功能导航项：选中态浅绿底色 + 深绿文字，hover 态浅灰
- 历史对话项：灰色文字，hover 加深并显示背景

### 知识库面板

- 玻璃卡片容器，`w-full` 撑满主内容区
- 分类标签：浅绿背景 + 深绿边框，圆角药丸形，可 hover
- 快捷问题：2 列网格，hover 变为橙色

### AI 输入框

- 胶囊形 `rounded-full`，玻璃拟态底色
- 左侧 placeholder 文字提示
- 右侧麦克风图标（语音输入入口）+ 发送按钮
- 发送按钮：有内容时点亮橙色 + 阴影，无内容时灰色禁用态
- 支持 Enter 键快捷发送
- 底部灰色免责声明小字

---

## 7. 数据层

所有静态内容集中在 `src/data/constants.ts`，包括：

- `platformName` — 平台名称
- `heroTitle` / `heroSubtitle` — 主标题文案（隐藏）
- `featureCards` — 6 张功能卡片数据（隐藏）
- `sidebarNavItems` — 8 个侧边栏导航项
- `historyItems` — 4 条模拟历史对话
- `knowledgeTags` — 6 个知识库分类标签
- `quickQuestions` — 6 条快捷提问
- `chatPlaceholder` — 输入框占位文案

---

## 8. 交互状态

| 元素 | 状态 |
| --- | --- |
| 侧边栏导航项 | 点击切换选中高亮 |
| 知识库标签 | hover 加深背景 |
| 快捷问题 | hover 变为橙色 |
| AI 输入框 | focus 时边框变为橙色 + 增强阴影 |
| 发送按钮 | 有/无内容 → 点亮/禁用 |
| 语音按钮 | hover 变深灰色 |

---

## 9. 运行方式

```bash
npm install
npm run dev        # 开发服务器 → http://localhost:5173
npm run build      # 生产构建
npm run preview    # 预览生产构建
```
