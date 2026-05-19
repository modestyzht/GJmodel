import type { ToolResponse, KnowledgeDocument } from '../types/index.js'
import { searchKnowledge } from '../services/knowledge.service.js'

export async function knowledgeBaseSearch(query: string, topK = 3, tags?: string[]): Promise<ToolResponse> {
  const documents: KnowledgeDocument[] = searchKnowledge(query, topK, tags)
  return {
    tool_name: 'knowledge_base_search',
    success: true,
    data: { documents },
    error: null,
  }
}
