import { platformName } from '../data/constants'

export default function Header() {
  return (
    <header className="flex items-center justify-between h-14 px-8 flex-shrink-0">
      <h1 className="text-base font-semibold text-orchard-dark tracking-wide">
        🌿 {platformName}
      </h1>
      <div className="flex items-center gap-3">
        <button className="text-sm text-orchard-dark/70 hover:text-orchard-dark transition-colors">
          中文
        </button>
        <div className="w-8 h-8 rounded-full bg-orchard/20 flex items-center justify-center text-sm text-orchard-dark font-medium">
          GJ
        </div>
      </div>
    </header>
  )
}
