import { motion } from 'framer-motion'
import type { StrengthTier } from '../utils/passwordAnalyzer'

type StrengthMeterProps = {
  score: number
  tier: StrengthTier
}

const getTone = (label: StrengthTier['label']) => {
  switch (label) {
    case 'Very Weak':
      return {
        title: 'text-rose-300',
        badge: 'border-rose-300/80 bg-rose-500/20 text-rose-100',
        chip: 'border-rose-300/90 bg-rose-500/20 text-rose-100',
      }
    case 'Weak':
      return {
        title: 'text-orange-300',
        badge: 'border-orange-300/80 bg-orange-500/20 text-orange-100',
        chip: 'border-orange-300/90 bg-orange-500/20 text-orange-100',
      }
    case 'Moderate':
      return {
        title: 'text-amber-300',
        badge: 'border-amber-300/80 bg-amber-500/20 text-amber-100',
        chip: 'border-amber-300/90 bg-amber-500/20 text-amber-100',
      }
    case 'Strong':
      return {
        title: 'text-sky-300',
        badge: 'border-sky-300/80 bg-sky-500/20 text-sky-100',
        chip: 'border-sky-300/90 bg-sky-500/20 text-sky-100',
      }
    case 'Very Strong':
      return {
        title: 'text-emerald-300',
        badge: 'border-emerald-300/80 bg-emerald-500/20 text-emerald-100',
        chip: 'border-emerald-300/90 bg-emerald-500/20 text-emerald-100',
      }
    case 'God Level':
      return {
        title: 'text-violet-300',
        badge: 'border-violet-300/80 bg-violet-500/20 text-violet-100',
        chip: 'border-violet-300/90 bg-violet-500/20 text-violet-100',
      }
    default:
      return {
        title: 'text-cyan-200',
        badge: 'border-cyan-300/80 bg-cyan-500/20 text-cyan-100',
        chip: 'border-cyan-300/90 bg-cyan-500/20 text-cyan-100',
      }
  }
}

export const StrengthMeter = ({ score, tier }: StrengthMeterProps) => {
  const tone = getTone(tier.label)
  const isDramaticTier = tier.label === 'Very Weak' || tier.label === 'God Level'

  return (
    <motion.section
      className="glass-card p-5 md:p-7"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      aria-labelledby="strength-meter-title"
    >
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 id="strength-meter-title" className={`text-lg font-semibold md:text-xl ${tone.title}`}>
          Strength Meter
        </h2>
        <span
          className={`tier-badge rounded-full border px-3 py-1 text-xs uppercase tracking-[0.15em] ${tone.badge} ${
            isDramaticTier ? 'tier-impact text-sm md:text-base' : ''
          }`}
        >
          {tier.label}
        </span>
      </div>

      <div className="h-5 rounded-full bg-slate-900/80 p-1">
        <motion.div
          className="strength-fill strength-fill-pulse h-full rounded-full"
          style={{ background: tier.gradient, boxShadow: `0 0 16px ${tier.color}AA` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs tracking-wide text-slate-400">
        <span>0</span>
        <span>20</span>
        <span>40</span>
        <span>60</span>
        <span>80</span>
        <span>100</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 md:grid-cols-6">
        {['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong', 'God Level'].map((label) => {
          const active = tier.label === label
          const dramatic = label === 'Very Weak' || label === 'God Level'

          return (
            <span
              key={label}
              className={`tier-chip rounded-lg border px-2 py-2 text-center ${
                active ? tone.chip : 'border-white/10 bg-slate-900/50 text-slate-400'
              } ${active && dramatic ? 'tier-chip-impact font-semibold tracking-[0.08em]' : ''}`}
            >
              {label.toUpperCase()}
            </span>
          )
        })}
      </div>
    </motion.section>
  )
}
