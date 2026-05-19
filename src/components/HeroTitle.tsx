import { heroTitle, heroSubtitle } from '../data/constants'

export default function HeroTitle() {
  return (
    <div className="text-center mt-6 mb-8">
      <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
        {heroTitle}
      </h2>
      <p className="mt-3 text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
        {heroSubtitle}
      </p>
    </div>
  )
}
