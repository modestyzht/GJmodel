import type { ToolResponse } from '../types/index.js'
import { mockPhenologyRecognition } from '../mocks/phenology.mock.js'

export async function phenologyRecognition(imageUrl?: string): Promise<ToolResponse> {
  const mock = mockPhenologyRecognition(imageUrl)
  return {
    tool_name: 'phenology_recognition',
    ...mock,
  }
}
