const diseaseDB = [
  {
    name: '炭疽病',
    risk: '高',
    symptoms: ['叶片出现褐色圆形病斑', '病斑边缘深褐色，中心灰白色', '果实出现凹陷黑斑'],
    cause: '高温高湿环境，病原菌通过风雨传播',
  },
  {
    name: '溃疡病',
    risk: '中',
    symptoms: ['叶片出现黄色晕圈', '病斑突起呈木栓化', '枝梢出现纵向裂纹'],
    cause: '细菌性病害，通过伤口或气孔侵入',
  },
  {
    name: '红蜘蛛',
    risk: '中',
    symptoms: ['叶片正面出现黄白色小点', '叶背可见红色小虫', '严重时叶片变褐脱落'],
    cause: '高温干旱季节易爆发，繁殖速度快',
  },
  {
    name: '灰霉病',
    risk: '低',
    symptoms: ['花瓣出现水渍状斑点', '幼果表面出现灰色霉层'],
    cause: '连续阴雨，通风不良导致',
  },
]

export function mockDiseaseDetection(imageUrl?: string) {
  if (imageUrl) {
    const disease = diseaseDB[Math.floor(Math.random() * diseaseDB.length)]
    return {
      success: true,
      data: {
        disease: disease.name,
        risk_level: disease.risk,
        confidence: 0.80 + Math.random() * 0.15,
        symptoms: disease.symptoms,
        possible_cause: disease.cause,
      },
      error: null,
    }
  }

  return {
    success: true,
    data: {
      disease: '未发现明显病斑',
      risk_level: '低',
      confidence: 0.92,
      symptoms: ['叶片整体正常', '未见明显病原特征'],
      possible_cause: '无需处理',
    },
    error: null,
  }
}
