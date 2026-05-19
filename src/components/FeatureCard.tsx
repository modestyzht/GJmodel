import type { FeatureCard as FeatureCardType } from '../data/constants'

interface FeatureCardProps {
  card: FeatureCardType
}

export default function FeatureCard({ card }: FeatureCardProps) {
  return (
    <button className="glass-card glass-hover p-6 text-left w-full group cursor-pointer">
      <div className="w-12 h-12 rounded-xl bg-orchard/10 flex items-center justify-center mb-4
        group-hover:bg-orchard/20 transition-colors">
        <span className="text-2xl">{card.icon}</span>
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1.5">
        {card.title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed">
        {card.description}
      </p>
    </button>
  )
}
