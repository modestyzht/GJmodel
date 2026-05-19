import type { ChatRequest, AgentResponse, IntentResult } from '../types/index.js'
import { buildResponse } from '../utils/responseFormatter.js'
import { phenologyRecognition } from '../tools/phenologyRecognition.tool.js'
import { knowledgeBaseSearch } from '../tools/knowledgeSearch.tool.js'

export async function runPhenologyAgent(
  request: ChatRequest,
  sessionId: string,
  intentResult: IntentResult
): Promise<AgentResponse> {
  const toolsUsed: string[] = []

  let phenologyData = null
  if (request.images?.length) {
    const result = await phenologyRecognition(request.images[0].url)
    phenologyData = result.data
    toolsUsed.push('phenology_recognition')
  }

  const { data: kbData } = await knowledgeBaseSearch(request.message, 3)
  const docs = kbData.documents as { title: string; content: string; score: number; source: string }[]
  toolsUsed.push('knowledge_base_search')

  const stage = (phenologyData?.stage as string) || '开花期'

  return buildResponse({
    sessionId,
    agent: 'phenology_agent',
    intent: 'phenology_recognition',
    answer: `根据${request.images?.length ? '图片特征' : '描述'}，当前脆蜜金桔疑似处于${stage}，${intentResult.reason}。应重点做好当前阶段的农事管理工作。`,
    summary: `当前疑似处于${stage}`,
    cards: [
      { type: 'stage', title: '识别物候期', value: stage, description: '根据枝梢、花、果特征判断' },
      { type: 'operation', title: '当前管理重点', value: getStageFocus(stage), description: '建议优先完成' },
    ],
    recommendations: getRecommendations(stage),
    references: docs.map((d) => ({ title: d.title, source: d.source, score: d.score })),
    toolsUsed,
    suggestedQuestions: [
      `${stage}可以施肥吗？`,
      '下一阶段要注意什么？',
      '现在适合修剪吗？',
    ],
  })
}

function getStageFocus(stage: string): string {
  const map: Record<string, string> = {
    '萌芽期': '促梢壮芽、防虫保叶',
    '抽梢期': '控梢促花、防治潜叶蛾',
    '现蕾期': '保蕾促花、增施磷钾',
    '开花期': '保花保果、防灰霉病',
    '坐果期': '稳果保果、疏果定果',
    '膨果期': '水肥供给、防裂防晒',
    '转色期': '控水增甜、防鸟防虫',
    '成熟采收期': '适时采收、分级包装',
  }
  return map[stage] || '加强日常管理'
}

function getRecommendations(stage: string): string[] {
  const map: Record<string, string[]> = {
    '萌芽期': [
      '及时追施萌芽肥，以氮肥为主促进抽梢。',
      '注意检查蚜虫、红蜘蛛等早春害虫。',
      '保持土壤湿润但不过湿。',
    ],
    '开花期': [
      '保持树体通风透光，降低花期病害发生风险。',
      '避免过量浇水和偏施氮肥。',
      '关注天气变化，连续阴雨时应加强病害预防。',
      '下一阶段需重点关注坐果率和幼果发育情况。',
    ],
    '坐果期': [
      '适当疏除过密果、畸形果，保证果实品质。',
      '追施壮果肥，氮磷钾配合施用。',
      '注意果实蝇、吸果夜蛾等害虫防治。',
    ],
    '膨果期': [
      '保证充足水分供应，避免忽干忽湿导致裂果。',
      '增施钾肥提高果实品质和糖度。',
      '高温天气注意果园降温、果实防晒。',
    ],
    '成熟采收期': [
      '根据果实转色和糖度确定最佳采收时间。',
      '晴天上午露水干后采收，避免雨后采收。',
      '按分级标准进行分级包装。',
    ],
  }
  return map[stage] || [
    '保持日常巡查，留意树势变化。',
    '根据实际情况调整水肥管理。',
    '关注天气预报，提前应对极端天气。',
  ]
}
