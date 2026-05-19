import type { ChatRequest, AgentResponse, IntentResult } from '../types/index.js'
import { buildResponse } from '../utils/responseFormatter.js'
import { diseaseDetection } from '../tools/diseaseDetection.tool.js'
import { imageRecognition } from '../tools/imageRecognition.tool.js'
import { knowledgeBaseSearch } from '../tools/knowledgeSearch.tool.js'

type MockDisease = { disease?: string; risk_level?: string; possible_cause?: string }
type MockStage = { stage?: string }

export async function runFlowerFruitAgent(
  request: ChatRequest,
  sessionId: string,
  intentResult: IntentResult
): Promise<AgentResponse> {
  const toolsUsed: string[] = []

  let stageResult: MockStage | undefined
  let diseaseResult: MockDisease | undefined
  if (request.images?.length) {
    const imgUrl = request.images[0].url
    const [stage, disease] = await Promise.all([
      imageRecognition(imgUrl),
      diseaseDetection(imgUrl),
    ])
    stageResult = stage.data as MockStage
    diseaseResult = disease.data as MockDisease
    toolsUsed.push('flower_stage_recognition', 'disease_detection')
  }

  const { data: kbData } = await knowledgeBaseSearch(request.message, 3)
  const docs = kbData.documents as { title: string; content: string; score: number; source: string }[]
  toolsUsed.push('knowledge_base_search')

  const isDisease = request.message.includes('病') || request.message.includes('斑') || request.message.includes('虫')

  if (isDisease && diseaseResult) {
    return buildResponse({
      sessionId,
      agent: 'flower_fruit_agent',
      intent: 'flower_fruit_protection',
      answer: `根据图片分析，当前金桔树疑似出现${diseaseResult.disease || '病害'}，风险等级为${diseaseResult.risk_level || '中'}。${diseaseResult.possible_cause || ''}`,
      summary: `疑似${diseaseResult.disease || '病害'}，风险等级${diseaseResult.risk_level || '中'}`,
      cards: [
        { type: 'disease', title: '识别病害', value: diseaseResult.disease || '未知', description: diseaseResult.possible_cause || '' },
        { type: 'risk', title: '风险等级', value: diseaseResult.risk_level || '中', description: '基于图像特征判断' },
      ],
      recommendations: [
        '建议剪除发病枝叶并集中烧毁，减少病原传播。',
        '根据病害类型选择合适的杀菌剂或杀虫剂进行防治。',
        '加强园区通风透光，降低湿度。',
        '定期巡查果园，做到早发现早防治。',
      ],
      references: docs.map((d) => ({ title: d.title, source: d.source, score: d.score })),
      toolsUsed,
      suggestedQuestions: [
        '用什么药防治效果最好？',
        '会不会影响坐果？',
        '需要剪掉病枝吗？',
      ],
    })
  }

  // Flower/fruit protection
  return buildResponse({
    sessionId,
    agent: 'flower_fruit_agent',
    intent: 'flower_fruit_protection',
    answer: `根据描述，当前金桔树${stageResult?.stage ? `疑似处于${stageResult.stage}` : '需要注意花果管理'}。${intentResult.reason}。建议做好保花保果和病虫害预防工作。`,
    summary: stageResult?.stage ? `当前疑似处于${String(stageResult.stage)}` : '建议加强花果管理',
    cards: [
      { type: 'stage', title: '识别阶段', value: stageResult?.stage || '开花坐果期', description: '基于描述判断' },
      { type: 'risk', title: '管理风险', value: '中', description: '需关注落花落果和病害风险' },
    ],
    recommendations: [
      '建议保持园区通风透光，避免湿度过高。',
      '花期不建议大量施用氮肥，避免营养生长过旺。',
      '近期如有连续降雨，应重点关注灰霉病、炭疽病等风险。',
      '可结合树势情况进行保花保果管理，如喷施硼肥。',
    ],
    references: docs.map((d) => ({ title: d.title, source: d.source, score: d.score })),
    toolsUsed,
    suggestedQuestions: [
      '花期可以施肥吗？',
      '现在适合打药吗？',
      '如何提高坐果率？',
    ],
  })
}
