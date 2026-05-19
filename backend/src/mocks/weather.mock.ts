export function mockWeatherForecast() {
  return {
    success: true,
    data: {
      current: {
        temperature: 26.5,
        humidity: 82,
        wind_speed: 2.4,
        weather: '多云',
        rainfall: 0,
      },
      forecast: [
        { date: '今天', weather: '多云', temp_high: 28, temp_low: 20, humidity: 78, wind: 2.1, rainfall_prob: 20 },
        { date: '明天', weather: '小雨', temp_high: 26, temp_low: 19, humidity: 88, wind: 3.2, rainfall_prob: 75 },
        { date: '后天', weather: '多云转晴', temp_high: 29, temp_low: 21, humidity: 70, wind: 1.8, rainfall_prob: 15 },
      ],
      spray_window: {
        suitable: false,
        reason: '未来24小时有降雨概率，药效可能被冲刷',
        next_window: '后天上午 8:00—10:00',
      },
    },
    error: null,
  }
}

export function mockIotData(plotId?: string) {
  const base = plotId ? 0.95 : 0.88
  return {
    success: true,
    data: {
      temperature: 25 + Math.random() * 3,
      humidity: 75 + Math.random() * 15,
      soil_temperature: 22 + Math.random() * 2,
      soil_moisture: 35 + Math.random() * 15,
      light_intensity: 10000 + Math.random() * 5000,
      wind_speed: 1.5 + Math.random() * 3,
      rainfall: Math.random() > 0.7 ? Math.random() * 5 : 0,
      leaf_wetness: Math.random() * 0.8,
      confidence: base,
    },
    error: null,
  }
}
