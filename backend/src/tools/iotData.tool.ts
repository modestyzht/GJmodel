import type { ToolResponse } from '../types/index.js'
import { mockIotData } from '../mocks/weather.mock.js'

export async function iotDataQuery(plotId?: string): Promise<ToolResponse> {
  const mock = mockIotData(plotId)
  return {
    tool_name: 'iot_realtime_data_query',
    ...mock,
  }
}
