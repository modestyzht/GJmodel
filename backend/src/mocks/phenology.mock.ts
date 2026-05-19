export function mockPhenologyRecognition(imageUrl?: string) {
  const stages = ['萌芽期', '抽梢期', '现蕾期', '开花期', '坐果期', '膨果期', '转色期', '成熟采收期']
  const stage = imageUrl ? stages[Math.floor(Math.random() * stages.length)] : '开花期'

  return {
    success: true,
    data: {
      stage,
      confidence: 0.85 + Math.random() * 0.12,
      features: [
        '枝梢可见花朵，部分已开放',
        '嫩叶颜色浅绿，叶面积正在扩大',
        '未见明显膨大果实',
      ],
    },
    error: null,
  }
}

export function mockFlowerStageRecognition(imageUrl?: string) {
  const stages = ['现蕾期', '初花期', '盛花期', '谢花期', '坐果期']
  const stage = imageUrl ? stages[Math.floor(Math.random() * stages.length)] : '盛花期'

  return {
    success: true,
    data: {
      stage,
      flower_density: '中',
      fruit_set_potential: '良好',
      confidence: 0.82 + Math.random() * 0.14,
    },
    error: null,
  }
}
