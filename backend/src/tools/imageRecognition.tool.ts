import type { ToolResponse } from '../types/index.js'

export async function imageRecognition(imageUrl: string): Promise<ToolResponse> {
  // Phase 1: always mock
  return {
    tool_name: 'flower_stage_recognition',
    success: true,
    data: {
      stage: '盛花期',
      confidence: 0.88,
      note: 'Mock 数据 — 实际模型未接入',
    },
    error: null,
  }
}
