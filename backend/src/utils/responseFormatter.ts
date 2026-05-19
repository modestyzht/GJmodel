import { v4 as uuid } from 'uuid'
import type { AgentResponse, AgentCard, Reference } from '../types/index.js'

export function buildResponse(params: {
  sessionId: string
  agent: string
  intent: string
  answer: string
  summary?: string
  cards?: AgentCard[]
  recommendations?: string[]
  references?: Reference[]
  toolsUsed?: string[]
  needMoreInfo?: boolean
  suggestedQuestions?: string[]
}): AgentResponse {
  return {
    session_id: params.sessionId,
    message_id: uuid(),
    agent: params.agent,
    intent: params.intent,
    answer: params.answer,
    summary: params.summary,
    cards: params.cards,
    recommendations: params.recommendations,
    references: params.references,
    tools_used: params.toolsUsed,
    need_more_info: params.needMoreInfo ?? false,
    suggested_questions: params.suggestedQuestions,
  }
}
