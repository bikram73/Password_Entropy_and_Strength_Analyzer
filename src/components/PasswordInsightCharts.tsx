import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PasswordAnalysis } from '../utils/passwordAnalyzer'

type PasswordInsightChartsProps = {
  analysis: PasswordAnalysis
}

const countMatches = (value: string, pattern: RegExp) => {
  const matches = value.match(pattern)
  return matches ? matches.length : 0
}

export const PasswordInsightCharts = ({ analysis }: PasswordInsightChartsProps) => {
  const password = analysis.password

  const compositionData = [
    {
      name: 'Lowercase',
      count: countMatches(password, /[a-z]/g),
      fill: '#00F5FF',
    },
    {
      name: 'Uppercase',
      count: countMatches(password, /[A-Z]/g),
      fill: '#8B5CF6',
    },
    {
      name: 'Numbers',
      count: countMatches(password, /\d/g),
      fill: '#22C55E',
    },
    {
      name: 'Symbols',
      count: countMatches(password, /[^A-Za-z0-9]/g),
      fill: '#FACC15',
    },
  ]

  const riskData = [
    {
      name: 'Secure Signals',
      value: [
        analysis.checks.hasLowercase,
        analysis.checks.hasUppercase,
        analysis.checks.hasNumbers,
        analysis.checks.hasSymbols,
        !analysis.checks.hasSequential,
        !analysis.checks.hasRepeating,
        !analysis.checks.hasDictionaryWord,
        !analysis.checks.isCommonPassword,
      ].filter(Boolean).length,
      fill: '#22C55E',
    },
    {
      name: 'Risk Signals',
      value: [
        !analysis.checks.hasLowercase,
        !analysis.checks.hasUppercase,
        !analysis.checks.hasNumbers,
        !analysis.checks.hasSymbols,
        analysis.checks.hasSequential,
        analysis.checks.hasRepeating,
        analysis.checks.hasDictionaryWord,
        analysis.checks.isCommonPassword,
      ].filter(Boolean).length,
      fill: '#EF4444',
    },
  ]

  return (
    <motion.section
      className="glass-card p-5 md:p-7"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      aria-labelledby="insight-charts-title"
    >
      <h2 id="insight-charts-title" className="text-lg font-semibold text-cyan-200 md:text-xl">
        More Security Charts
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Character mix and risk profile visuals based on your current password input.
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
          <h3 className="mb-3 text-sm uppercase tracking-[0.16em] text-slate-300">Character Composition</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compositionData} barSize={28}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.22)" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: '#0B1226',
                    border: '1px solid rgba(0,245,255,0.35)',
                    borderRadius: '10px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {compositionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
          <h3 className="mb-3 text-sm uppercase tracking-[0.16em] text-slate-300">Risk Signal Breakdown</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={84}
                  paddingAngle={3}
                  stroke="rgba(15,23,42,0.8)"
                  strokeWidth={2}
                  isAnimationActive
                >
                  {riskData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} checks`, 'Count']}
                  contentStyle={{
                    background: '#0B1226',
                    border: '1px solid rgba(0,245,255,0.35)',
                    borderRadius: '10px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {riskData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 rounded-lg bg-slate-950/50 px-3 py-2 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span>{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
