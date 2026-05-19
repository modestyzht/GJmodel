import type { Intent, IntentResult, ChatRequest } from '../types/index.js'

const keywordMap: { keywords: string[]; intent: Intent; agent: string }[] = [
  {
    keywords: ['开花', '落花', '落果', '保果', '保花', '坐果', '幼果', '病虫害', '炭疽病', '溃疡病', '红蜘蛛', '灰霉病', '蚜虫', '黑斑', '发黄', '裂果', '控梢', '疏果', '施肥建议'],
    intent: 'flower_fruit',
    agent: 'flower_fruit_agent',
  },
  {
    keywords: ['阶段', '物候', '生长期', '萌芽', '抽梢', '现蕾', '膨果', '转色', '采收期', '成熟', '采后', '越冬', '下一阶段', '现在是什么'],
    intent: 'phenology',
    agent: 'phenology_agent',
  },
  {
    keywords: ['天气', '打药', '降雨', '低温', '高温', '霜冻', '暴雨', '干旱', '采摘窗口', '适合采摘', '适合喷药', '浇水', '灌溉', '明天', '未来', '今晚'],
    intent: 'weather',
    agent: 'weather_agent',
  },
]

export function classifyIntent(request: ChatRequest): IntentResult {
  const text = (request.message + (request.images?.length ? ' 图片' : '')).toLowerCase()

  for (const entry of keywordMap) {
    for (const kw of entry.keywords) {
      if (text.includes(kw)) {
        return {
          intent: entry.intent,
          target_agent: entry.agent,
          need_image_model: !!request.images?.length || entry.intent === 'flower_fruit' || entry.intent === 'phenology',
          need_knowledge_base: true,
          need_iot_data: entry.intent === 'weather',
          need_weather_forecast: entry.intent === 'weather',
          confidence: 0.85,
          reason: `用户消息匹配关键词「${kw}」，分发至 ${entry.agent}`,
        }
      }
    }
  }

  // Fallback: treat as general knowledge question
  return {
    intent: 'general',
    target_agent: 'orchestrator',
    need_image_model: !!request.images?.length,
    need_knowledge_base: true,
    need_iot_data: false,
    need_weather_forecast: false,
    confidence: 0.60,
    reason: '未匹配到特定领域关键词，作为通用知识问答处理',
  }
}
