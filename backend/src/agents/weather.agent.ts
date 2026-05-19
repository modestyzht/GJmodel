import type { ChatRequest, AgentResponse, IntentResult } from '../types/index.js'
import { buildResponse } from '../utils/responseFormatter.js'
import { weatherForecastQuery } from '../tools/weatherForecast.tool.js'
import { iotDataQuery } from '../tools/iotData.tool.js'
import { knowledgeBaseSearch } from '../tools/knowledgeSearch.tool.js'

export async function runWeatherAgent(
  request: ChatRequest,
  sessionId: string,
  _intentResult: IntentResult
): Promise<AgentResponse> {
  const toolsUsed: string[] = []

  const [weatherResult, iotResult, { data: kbData }] = await Promise.all([
    weatherForecastQuery(),
    iotDataQuery(request.plot_id),
    knowledgeBaseSearch(request.message, 2),
  ])

  toolsUsed.push('weather_forecast_query', 'iot_realtime_data_query', 'knowledge_base_search')

  const weatherData = weatherResult.data as Record<string, unknown>
  const iotData = iotResult.data as Record<string, unknown>
  const docs = kbData.documents as { title: string; content: string; score: number; source: string }[]

  const forecast = (weatherData.forecast as Record<string, unknown>[])?.[1] || {}
  const sprayWindow = weatherData.spray_window as Record<string, unknown> | undefined

  const isSpray = request.message.includes('打药') || request.message.includes('喷药')
  const isPick = request.message.includes('采摘') || request.message.includes('采收')
  const isFrost = request.message.includes('低温') || request.message.includes('霜冻')

  if (isSpray) {
    return buildResponse({
      sessionId,
      agent: 'weather_agent',
      intent: 'weather_risk_prediction',
      answer: sprayWindow?.suitable
        ? `当前天气条件适合打药。${sprayWindow.next_window || '建议选择无风晴天的上午进行。'}`
        : `不建议在近期进行喷药作业。${sprayWindow?.reason || '未来有降雨概率，药效可能被冲刷。'}${sprayWindow?.next_window ? `建议时间窗口：${sprayWindow.next_window}` : ''}`,
      summary: sprayWindow?.suitable ? '适合打药' : '不建议打药',
      cards: [
        { type: 'weather', title: '打药条件', value: sprayWindow?.suitable ? '适合' : '不适合', description: sprayWindow?.reason as string || '' },
        { type: 'risk', title: '环境风险', value: (forecast.rainfall_prob as number) > 50 ? '中' : '低', description: `降雨概率 ${forecast.rainfall_prob}%` },
      ],
      recommendations: [
        '打药应选择无风或微风的晴天，上午 8:00—11:00 或下午 16:00 后较适宜。',
        '喷药后 6 小时内如遇降雨，应考虑补喷。',
        '注意轮换使用不同作用机理的药剂，延缓抗药性产生。',
      ],
      references: docs.map((d) => ({ title: d.title, source: d.source, score: d.score })),
      toolsUsed,
      suggestedQuestions: [
        '未来三天天气怎么样？',
        '现在适合施肥吗？',
        '近期有没有高温风险？',
      ],
    })
  }

  if (isPick) {
    return buildResponse({
      sessionId,
      agent: 'weather_agent',
      intent: 'weather_risk_prediction',
      answer: `近期天气${(forecast.rainfall_prob as number) > 50 ? '有降雨可能，不太适合' : '条件尚可，可以考虑'}采摘。建议关注采摘前 3 天的天气变化，选择连续晴天后进行采收，果实品质更佳。`,
      summary: (forecast.rainfall_prob as number) > 50 ? '近期有雨，谨慎安排采摘' : '天气条件基本适合采摘',
      cards: [
        { type: 'weather', title: '未来天气', value: forecast.weather as string || '多云', description: `温度 ${forecast.temp_low}—${forecast.temp_high}°C` },
        { type: 'operation', title: '采摘建议', value: (forecast.rainfall_prob as number) > 50 ? '暂缓采摘' : '可安排采摘', description: '晴天上午露水干后最佳' },
      ],
      recommendations: [
        '采收应在晴天上午露水干后进行，避免雨后或高温时段采收。',
        '采收时轻拿轻放，避免机械损伤。',
        '采后及时分级、预冷、包装，延长保鲜期。',
      ],
      references: docs.map((d) => ({ title: d.title, source: d.source, score: d.score })),
      toolsUsed,
      suggestedQuestions: [
        '未来三天天气怎么样？',
        '采收后怎么保鲜？',
        '什么时候采收口感最好？',
      ],
    })
  }

  if (isFrost) {
    return buildResponse({
      sessionId,
      agent: 'weather_agent',
      intent: 'weather_risk_prediction',
      answer: `当前温度 ${iotData.temperature}°C，${(iotData.temperature as number) < 10 ? '存在低温风险，需做好防霜冻准备。' : '暂无明显低温风险，但仍需关注天气预报。'}果园应提前做好防寒防冻措施。`,
      summary: (iotData.temperature as number) < 10 ? '存在低温风险' : '暂无明显低温风险',
      cards: [
        { type: 'risk', title: '低温风险', value: (iotData.temperature as number) < 10 ? '高' : '低', description: `当前温度 ${iotData.temperature}°C` },
        { type: 'operation', title: '防护措施', value: '防霜防冻', description: '覆盖、熏烟、灌水等' },
      ],
      recommendations: [
        '低温来临前进行果园灌水，利用水的热容量缓冲降温。',
        '可用防霜网、无纺布等覆盖树冠。',
        '低温当晚可在果园上风口熏烟增温。',
        '树盘覆盖稻草或地膜，保护根系。',
      ],
      references: docs.map((d) => ({ title: d.title, source: d.source, score: d.score })),
      toolsUsed,
      suggestedQuestions: [
        '今晚会降到多少度？',
        '霜冻后怎么补救？',
        '有哪些防寒措施？',
      ],
    })
  }

  // General weather
  return buildResponse({
    sessionId,
    agent: 'weather_agent',
    intent: 'weather_risk_prediction',
    answer: `当前果园温度 ${iotData.temperature}°C，湿度 ${iotData.humidity}%，风速 ${iotData.wind_speed} m/s。明天天气${forecast.weather}，温度 ${forecast.temp_low}—${forecast.temp_high}°C，降雨概率 ${forecast.rainfall_prob}%。${(forecast.rainfall_prob as number) > 50 ? '湿度偏高，注意病害防控。' : '天气条件总体较好。'}`,
    summary: `明天${forecast.weather}，${(forecast.rainfall_prob as number) > 50 ? '有降雨风险' : '天气较好'}`,
    cards: [
      { type: 'weather', title: '明天天气', value: forecast.weather as string || '多云', description: `${forecast.temp_low}—${forecast.temp_high}°C，降雨概率 ${forecast.rainfall_prob}%` },
      { type: 'default', title: '当前环境', value: `${iotData.temperature}°C`, description: `湿度 ${iotData.humidity}%，风速 ${iotData.wind_speed} m/s` },
    ],
    recommendations: [
      (forecast.rainfall_prob as number) > 50 ? '湿度偏高时应关注炭疽病、灰霉病等病害风险。' : '天气条件良好，可适当安排农事作业。',
      '建议优先检查园区排水和通风情况。',
      '关注后续天气变化，提前做好应对准备。',
    ],
    references: docs.map((d) => ({ title: d.title, source: d.source, score: d.score })),
    toolsUsed,
    suggestedQuestions: [
      '未来三天天气怎么样？',
      '什么时候适合打药？',
      '明天可以采摘吗？',
    ],
  })
}
