import { useState } from 'react'
import { sidebarNavItems, historyItems } from '../data/constants'

interface SidebarProps {
  onNewChat?: () => void
}

export default function Sidebar({ onNewChat }: SidebarProps) {
  const [activeNav, setActiveNav] = useState(sidebarNavItems[0].label)

  return (
    <aside className="w-[260px] flex-shrink-0 flex flex-col h-full glass border-r border-white/50 relative z-[2]">
      {/* New Chat Button */}
      <div className="px-4 pt-4 pb-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orchard text-white text-sm font-medium
          hover:bg-orchard-dark transition-colors shadow-md shadow-orchard/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          新建对话
        </button>
      </div>

      {/* Nav Section */}
      <div className="px-3 flex-1 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-medium text-orchard-dark/50 uppercase tracking-wider">
          常用功能
        </p>
        <nav className="space-y-0.5">
          {sidebarNavItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all duration-150
                ${activeNav === item.label
                  ? 'bg-orchard/12 text-orchard-dark font-medium'
                  : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-800'
                }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-3 mx-3 border-t border-slate-200/60" />

        {/* History Section */}
        <p className="px-3 mb-2 text-xs font-medium text-orchard-dark/50 uppercase tracking-wider">
          历史对话
        </p>
        <div className="space-y-0.5">
          {historyItems.map((item) => (
            <button
              key={item.id}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-500
                hover:bg-slate-100/60 hover:text-slate-700 transition-colors truncate"
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/40">
        <p className="text-xs text-slate-400 text-center">
          脆蜜金桔 · 智慧种植
        </p>
      </div>
    </aside>
  )
}
