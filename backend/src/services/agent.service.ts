import type { ChatRequest, AgentResponse } from '../types/index.js'
import { orchestrate } from '../agents/orchestrator.agent.js'
import { getOrCreateSession, addMessage } from './session.service.js'

export async function handleChat(request: ChatRequest): Promise<AgentResponse> {
  const session = getOrCreateSession(request.session_id)

  // Store user message
  addMessage(session.id, 'user', request.message, {
    images: request.images?.map((i) => i.url),
  })

  // Orchestrate
  const response = await orchestrate(request, session.id)

  // Store assistant message
  addMessage(session.id, 'assistant', response.answer, {
    agent: response.agent,
    intent: response.intent,
  })

  return response
}
