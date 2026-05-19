import type { ToolResponse } from '../types/index.js'
import { mockDiseaseDetection } from '../mocks/disease.mock.js'

export async function diseaseDetection(imageUrl?: string): Promise<ToolResponse> {
  const mock = mockDiseaseDetection(imageUrl)
  return {
    tool_name: 'disease_detection',
    ...mock,
  }
}
