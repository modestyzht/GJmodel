interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  agent?: string
  cards?: { type: string; title: string; value: string; description?: string }[]
  recommendations?: string[]
  suggestedQuestions?: string[]
  loading?: boolean
}

interface ChatDisplayProps {
  messages: ChatMessage[]
  onQuickQuestion: (q: string) => void
}

export type { ChatMessage }

export default function ChatDisplay({ messages, onQuickQuestion }: ChatDisplayProps) {
  if (messages.length === 0) return null

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 space-y-4 pb-2">
      {messages.map((msg, i) => (
        <div key={i}>
          {/* User message */}
          {msg.role === 'user' && (
            <div className="flex justify-end">
              <div className="max-w-[75%] bg-kumquat/10 text-slate-700 rounded-2xl rounded-br-md px-4 py-2.5 text-sm">
                {msg.content}
              </div>
            </div>
          )}

          {/* Assistant message */}
          {msg.role === 'assistant' && (
            <div className="glass-card p-5">
              {msg.loading ? (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-kumquat animate-pulse" />
                  智能体思考中...
                </div>
              ) : (
                <>
                  {/* Agent badge */}
                  {msg.agent && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-orchard/10 text-orchard-dark mb-3">
                      {agentLabel(msg.agent)}
                    </span>
                  )}

                  {/* Answer */}
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    {msg.content}
                  </p>

                  {/* Cards */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {msg.cards.map((card, ci) => (
                        <div key={ci} className="flex-1 min-w-[120px] bg-white/50 rounded-xl p-3 border border-white/60">
                          <p className="text-xs text-slate-400 mb-0.5">{card.title}</p>
                          <p className="text-sm font-semibold text-slate-800">{card.value}</p>
                          {card.description && (
                            <p className="text-xs text-slate-500 mt-0.5">{card.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommendations */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-slate-400 mb-1.5">管理建议</p>
                      <ul className="space-y-1">
                        {msg.recommendations.map((rec, ri) => (
                          <li key={ri} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-orchard mt-0.5 flex-shrink-0">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggested questions */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="border-t border-white/60 pt-3 mt-2">
                      <p className="text-xs text-slate-400 mb-1.5">继续提问</p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedQuestions.map((q, qi) => (
                          <button
                            key={qi}
                            onClick={() => onQuickQuestion(q)}
                            className="text-xs text-kumquat hover:text-white hover:bg-kumquat
                              px-2.5 py-1 rounded-full border border-kumquat/20 hover:border-kumquat
                              transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function agentLabel(agent: string): string {
  const map: Record<string, string> = {
    flower_fruit_agent: '保花保果',
    phenology_agent: '物候期识别',
    weather_agent: '气象预测',
    orchestrator: '通用问答',
  }
  return map[agent] || agent
}
