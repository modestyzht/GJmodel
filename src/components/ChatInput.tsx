import { useState, useRef, KeyboardEvent } from 'react'
import { chatPlaceholder } from '../data/constants'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!input.trim() || disabled) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full mt-6 mb-4">
      <div className="glass-card rounded-full px-5 py-3 flex items-center gap-3
        shadow-lg shadow-black/[0.04] focus-within:shadow-xl focus-within:shadow-kumquat/[0.08]
        focus-within:border-kumquat/30 transition-all duration-200">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={chatPlaceholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400
            outline-none border-none min-w-0"
        />

        <button
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center
            rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="语音输入"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>

        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200
            ${input.trim() && !disabled
              ? 'bg-kumquat text-white shadow-md shadow-kumquat/25 hover:bg-kumquat-light active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          title="发送"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <p className="text-center text-xs text-slate-400 mt-2">
        脆蜜金桔 AI 助手可能会产生不准确信息，关键决策请结合专业判断
      </p>
    </div>
  )
}
