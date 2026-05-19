import type { KnowledgeDocument } from '../types/index.js'

const knowledgeBase: KnowledgeDocument[] = [
  {
    title: '脆蜜金桔花期管理规范',
    content: '花期应保持适宜水分，避免偏施氮肥。花前可喷施硼肥促进花粉管伸长，提高坐果率。遇连续阴雨应加强灰霉病、炭疽病防治。盛花期避免喷药以免杀伤传粉昆虫。',
    score: 0,
    source: 'knowledge_base',
  },
  {
    title: '脆蜜金桔保花保果技术',
    content: '落花落果的主要原因包括：营养竞争、水分波动、病虫危害、激素失衡。保花保果措施：花前控氮增磷钾、花期喷硼、谢花后喷赤霉素、及时疏除过密枝梢。',
    score: 0,
    source: 'knowledge_base',
  },
  {
    title: '脆蜜金桔水肥管理指南',
    content: '萌芽期以氮肥为主促进抽梢；花期控氮增磷钾；坐果期追施复合肥；膨果期保证水分供应，配合钾肥提高品质；采后施基肥恢复树势。灌溉原则：少量多次，避免忽干忽湿。',
    score: 0,
    source: 'knowledge_base',
  },
  {
    title: '脆蜜金桔病虫害防治手册',
    content: '炭疽病：发病初期可用代森锰锌或苯醚甲环唑防治，重点在花前和幼果期预防。溃疡病：铜制剂有效，注意伤口保护。红蜘蛛：高温干旱季节注意检查叶背，可用阿维菌素或哒螨灵。',
    score: 0,
    source: 'knowledge_base',
  },
  {
    title: '脆蜜金桔采收分级标准',
    content: '采收适期为果实转色完全、可溶性固形物达到12%以上。分级标准：特级果单果重≥25g、果面光洁无斑；一级果≥20g、允许轻微斑痕；二级果≥15g。采收应在晴天上午露水干后进行。',
    score: 0,
    source: 'knowledge_base',
  },
  {
    title: '脆蜜金桔气象灾害应对',
    content: '低温霜冻：提前覆盖防霜网、熏烟增温、树盘覆盖。高温干旱：及时灌溉、树盘覆草保墒、喷施叶面肥增强抗逆性。暴雨洪涝：疏通排水沟、雨后松土透气、防治根腐病。',
    score: 0,
    source: 'knowledge_base',
  },
  {
    title: '脆蜜金桔控梢促花技术',
    content: '适时控梢是脆蜜金桔花芽分化的关键。一般在秋梢老熟后、花芽分化前进行控水控氮，结合环割或喷施多效唑控制营养生长，促进花芽生理分化。控梢过重会导致树势衰弱。',
    score: 0,
    source: 'knowledge_base',
  },
  {
    title: '脆蜜金桔裂果原因与预防',
    content: '裂果主要与水分剧烈波动、钙素不足、果皮发育不良有关。预防措施：保持土壤水分均衡、幼果期喷施钙肥、避免久旱后大量灌水、适当增施有机肥改善土壤结构。',
    score: 0,
    source: 'knowledge_base',
  },
]

export function searchKnowledge(
  query: string,
  topK = 3,
  tags?: string[]
): KnowledgeDocument[] {
  const keywords = query.toLowerCase().split(/\s+/)

  const scored = knowledgeBase.map((doc) => {
    let score = 0
    const content = (doc.title + doc.content).toLowerCase()
    for (const kw of keywords) {
      if (content.includes(kw)) score += 1
    }
    // Boost if query appears as substring
    if (content.includes(query.toLowerCase())) score += 2
    return { ...doc, score }
  })

  return scored
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}
