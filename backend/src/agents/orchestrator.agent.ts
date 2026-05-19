import type { ChatRequest, AgentResponse, IntentResult } from '../types/index.js'
import { classifyIntent } from '../utils/intentClassifier.js'
import { buildResponse } from '../utils/responseFormatter.js'
import { runFlowerFruitAgent } from './flowerFruit.agent.js'
import { runPhenologyAgent } from './phenology.agent.js'
import { runWeatherAgent } from './weather.agent.js'
import { knowledgeBaseSearch } from '../tools/knowledgeSearch.tool.js'

export async function orchestrate(request: ChatRequest, sessionId: string): Promise<AgentResponse> {
  const intentResult: IntentResult = classifyIntent(request)

  switch (intentResult.intent) {
    case 'flower_fruit':
      return runFlowerFruitAgent(request, sessionId, intentResult)
    case 'phenology':
      return runPhenologyAgent(request, sessionId, intentResult)
    case 'weather':
      return runWeatherAgent(request, sessionId, intentResult)
    case 'general':
    default: {
      const { data } = await knowledgeBaseSearch(request.message, 3)
      const docs = data.documents as { title: string; content: string; score: number; source: string }[]
      return buildResponse({
        sessionId,
        agent: 'orchestrator',
        intent: 'general',
        answer: '这是关于脆蜜金桔种植的通用知识回答。请尝试提出更具体的问题，例如病虫害识别、物候期判断或气象相关咨询，我可以为你提供更精准的建议。',
        summary: '通用知识问答',
        toolsUsed: docs.length > 0 ? ['knowledge_base_search'] : [],
        references: docs.map((d) => ({ title: d.title, source: d.source, score: d.score })),
        suggestedQuestions: [
          '脆蜜金桔裂果怎么预防？',
          '现在是什么生长阶段？',
          '明天适合打药吗？',
        ],
      })
    }
  }
}
