import { ReactNode } from 'react'

interface LayoutProps {
  sidebar: ReactNode
  header: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export default function Layout({ sidebar, header, children, footer }: LayoutProps) {
  return (
    <div className="flex h-screen bg-agriculture relative overflow-hidden">
      {/* Background image layer */}
      <img
        src="/images/tree-branch-growth-.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-65"
        style={{ filter: 'blur(6px)' }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-agriculture opacity-50" />

      {/* Content */}
      {sidebar}
      <div className="flex-1 flex flex-col min-w-0 relative z-[1]">
        {header}
        <main className="flex-1 overflow-y-auto px-8 flex flex-col">
          {children}
        </main>
        {footer && (
          <div className="flex-shrink-0 px-8 pb-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
