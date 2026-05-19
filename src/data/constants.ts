export interface FeatureCard {
  icon: string
  title: string
  description: string
}

export interface NavItem {
  icon: string
  label: string
}

export interface HistoryItem {
  id: string
  text: string
}

export interface KnowledgeTag {
  label: string
}

export interface QuickQuestion {
  text: string
}

export const platformName = '脆蜜金桔 AI 智能体'

export const heroTitle = 'Hi，我是你的金桔种植助手'
export const heroSubtitle = '基于AI大模型的智慧农业平台，帮你管理果园、识别病虫害、预测产量、提供种植建议'

export const featureCards: FeatureCard[] = [
  {
    icon: '🌳',
    title: '果园管理',
    description: '查看果园品种、树龄、区域分布信息，一目了然掌握全园概况',
  },
  {
    icon: '📋',
    title: '农事管理',
    description: '记录施肥、修剪、灌溉、采摘等任务，科学安排农事作业',
  },
  {
    icon: '🔍',
    title: '病虫害识别',
    description: '上传图片识别炭疽病、溃疡病、红蜘蛛等常见问题，及时防治',
  },
  {
    icon: '📈',
    title: '长势监测',
    description: '分析树势、花期、挂果量、叶片状态，动态追踪生长变化',
  },
  {
    icon: '📊',
    title: '产量预测',
    description: '结合长势、气象、历史数据预测产量，辅助采收与销售计划',
  },
  {
    icon: '⚠️',
    title: '气象预警',
    description: '实时提醒低温、暴雨、高温、霜冻等气象风险，提前做好防护',
  },
]

export const sidebarNavItems: NavItem[] = [
  { icon: '🌳', label: '果园档案' },
  { icon: '🗺️', label: '地块管理' },
  { icon: '📋', label: '农事记录' },
  { icon: '🔍', label: '病虫害识别' },
  { icon: '📈', label: '长势分析' },
  { icon: '📊', label: '采收预测' },
  { icon: '⚠️', label: '气象预警' },
  { icon: '📚', label: '金桔知识库' },
]

export const historyItems: HistoryItem[] = [
  { id: '1', text: '脆蜜金桔裂果怎么办？' },
  { id: '2', text: '现在能不能施肥？' },
  { id: '3', text: '叶片发黄是什么原因？' },
  { id: '4', text: '今年采收期预计什么时候？' },
]

export const knowledgeTags: KnowledgeTag[] = [
  { label: '种植标准' },
  { label: '病虫害防治' },
  { label: '水肥管理' },
  { label: '花果管理' },
  { label: '采收分级' },
  { label: '市场行情' },
]

export const quickQuestions: QuickQuestion[] = [
  { text: '脆蜜金桔什么时候控梢？' },
  { text: '金桔裂果怎么预防？' },
  { text: '叶片发黄是什么原因？' },
  { text: '挂果期如何施肥？' },
  { text: '炭疽病怎么防治？' },
  { text: '什么时候采收口感最好？' },
]

export const chatPlaceholder = '输入你的问题，例如：脆蜜金桔裂果怎么办、当前地块是否适合施肥……'
