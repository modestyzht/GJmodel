import { featureCards } from '../data/constants'
import FeatureCard from './FeatureCard'

export default function FeatureCardGrid() {
  return (
    <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
      {featureCards.map((card) => (
        <FeatureCard key={card.title} card={card} />
      ))}
    </div>
  )
}
