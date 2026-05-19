import { knowledgeTags, quickQuestions } from '../data/constants'

interface KnowledgePanelProps {
  onQuickQuestion?: (q: string) => void
}

export default function KnowledgePanel({ onQuickQuestion }: KnowledgePanelProps) {
  return (
    <div className="w-full mt-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">📚</span>
          <h3 className="text-base font-semibold text-slate-800">
            脆蜜金桔知识库
          </h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          整合脆蜜金桔种植标准、病虫害防治、采收分级、水肥管理与地方经验文档
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {knowledgeTags.map((tag) => (
            <span
              key={tag.label}
              onClick={() => onQuickQuestion?.(`${tag.label}方面有什么建议？`)}
              className="px-3 py-1 rounded-full text-xs font-medium
                bg-orchard/8 text-orchard-dark border border-orchard/15
                hover:bg-orchard/16 transition-colors cursor-pointer"
            >
              {tag.label}
            </span>
          ))}
        </div>

        <p className="text-xs font-medium text-slate-400 mb-2">你可能想问</p>
        <div className="grid grid-cols-2 gap-1.5">
          {quickQuestions.map((q) => (
            <button
              key={q.text}
              onClick={() => onQuickQuestion?.(q.text)}
              className="text-left text-sm text-slate-600 hover:text-kumquat
                hover:bg-kumquat/[0.06] rounded-lg px-3 py-1.5 transition-colors truncate"
            >
              {q.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
