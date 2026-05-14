import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type EntropyGraphProps = {
  value: string
}

const getPoolSize = (text: string) => {
  let pool = 0
  if (/[a-z]/.test(text)) pool += 26
  if (/[A-Z]/.test(text)) pool += 26
  if (/\d/.test(text)) pool += 10
  if (/[^A-Za-z0-9]/.test(text)) pool += 32
  return pool
}

export const EntropyGraph = ({ value }: EntropyGraphProps) => {
  const data = useMemo(
    () =>
      Array.from({ length: value.length }, (_, index) => {
        const part = value.slice(0, index + 1)
        const pool = getPoolSize(part)
        const entropy = part.length && pool ? part.length * Math.log2(pool) : 0

        return {
          step: index + 1,
          entropy: Number(entropy.toFixed(2)),
        }
      }),
    [value],
  )

  return (
    <motion.section
      className="glass-card p-5 md:p-7"
      aria-labelledby="entropy-graph-title"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
    >
      <h2 id="entropy-graph-title" className="text-lg font-semibold text-cyan-200 md:text-xl">
        Live Entropy Graph
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Real-time entropy growth appears as each character increases password complexity.
      </p>

      <div className="mt-4 h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.length ? data : [{ step: 0, entropy: 0 }]}> 
            <defs>
              <linearGradient id="entropyArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.25)" />
            <XAxis dataKey="step" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} width={40} />
            <Tooltip
              contentStyle={{
                background: '#0B1226',
                border: '1px solid rgba(0,245,255,0.4)',
                borderRadius: '10px',
                color: '#fff',
              }}
            />
            <Area
              type="monotone"
              dataKey="entropy"
              fill="url(#entropyArea)"
              stroke="none"
              isAnimationActive
              animationDuration={700}
            />
            <Line
              type="monotone"
              dataKey="entropy"
              stroke="#00F5FF"
              strokeWidth={3}
              dot={value.length ? { r: 2, fill: '#8B5CF6' } : false}
              activeDot={{ r: 5, fill: '#00F5FF', stroke: '#0B1226', strokeWidth: 2 }}
              isAnimationActive
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  )
}
