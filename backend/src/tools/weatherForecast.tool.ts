import type { ToolResponse } from '../types/index.js'
import { mockWeatherForecast } from '../mocks/weather.mock.js'

export async function weatherForecastQuery(): Promise<ToolResponse> {
  const mock = mockWeatherForecast()
  return {
    tool_name: 'weather_forecast_query',
    ...mock,
  }
}
