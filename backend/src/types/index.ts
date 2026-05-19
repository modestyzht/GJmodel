// ─── Agent types ───

export type Intent =
  | 'flower_fruit'
  | 'phenology'
  | 'weather'
  | 'general'

export interface IntentResult {
  intent: Intent
  target_agent: string
  need_image_model: boolean
  need_knowledge_base: boolean
  need_iot_data: boolean
  need_weather_forecast: boolean
  confidence: number
  reason: string
}

export interface AgentCard {
  type: 'stage' | 'risk' | 'weather' | 'disease' | 'operation' | 'default'
  title: string
  value: string
  description?: string
}

export interface Reference {
  title: string
  source: string
  score?: number
}

export interface AgentResponse {
  session_id: string
  message_id: string
  agent: string
  intent: string
  answer: string
  summary?: string
  cards?: AgentCard[]
  recommendations?: string[]
  references?: Reference[]
  tools_used?: string[]
  need_more_info?: boolean
  suggested_questions?: string[]
}

// ─── Message types ───

export interface ChatRequest {
  session_id?: string
  user_id?: string
  message: string
  images?: { url: string; type: string }[]
  plot_id?: string
  source?: string
}

export interface Message {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  images?: string[]
  agent?: string
  intent?: string
  createdAt: string
}

// ─── Session types ───

export interface Session {
  id: string
  userId?: string
  title: string
  createdAt: string
  updatedAt: string
}

// ─── Tool types ───

export interface ToolRequest {
  tool_name: string
  input: Record<string, unknown>
}

export interface ToolResponse {
  tool_name: string
  success: boolean
  data: Record<string, unknown>
  error: string | null
}

// ─── Knowledge types ───

export interface KnowledgeSearchRequest {
  query: string
  top_k?: number
  tags?: string[]
}

export interface KnowledgeDocument {
  title: string
  content: string
  score: number
  source: string
}

export interface KnowledgeSearchResponse {
  documents: KnowledgeDocument[]
}

// ─── Upload types ───

export interface UploadResponse {
  url: string
  filename: string
  size: number
}
