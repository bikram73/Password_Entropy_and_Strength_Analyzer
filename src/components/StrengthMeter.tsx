import { motion } from 'framer-motion'
import type { StrengthTier } from '../utils/passwordAnalyzer'

type StrengthMeterProps = {
  score: number
  tier: StrengthTier
}

export const StrengthMeter = ({ score, tier }: StrengthMeterProps) => (
  <motion.section
    className="glass-card p-5 md:p-7"
    initial={{ opacity: 0, y: 22 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.05 }}
    aria-labelledby="strength-meter-title"
  >
    <div className="mb-4 flex items-end justify-between gap-3">
      <h2 id="strength-meter-title" className="text-lg font-semibold text-cyan-200 md:text-xl">
        Strength Meter
      </h2>
      <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.15em] text-slate-200">
        {tier.label}
      </span>
    </div>

    <div className="h-5 rounded-full bg-slate-900/80 p-1">
      <motion.div
        className="h-full rounded-full shadow-[0_0_22px_rgba(0,245,255,0.65)]"
        style={{ background: tier.gradient }}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ type: 'spring', stiffness: 110, damping: 20 }}
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
      {['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong', 'God Level'].map((label) => (
        <span
          key={label}
          className={`rounded-lg border px-2 py-2 text-center ${
            tier.label === label
              ? 'border-cyan-300/90 bg-cyan-400/15 text-cyan-100'
              : 'border-white/10 bg-slate-900/50 text-slate-400'
          }`}
        >
          {label.toUpperCase()}
        </span>
      ))}
    </div>
  </motion.section>
)
