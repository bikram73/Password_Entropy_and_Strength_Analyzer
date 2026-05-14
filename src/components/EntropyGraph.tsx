import { useMemo } from 'react'
import {
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
    <section className="glass-card p-5 md:p-7" aria-labelledby="entropy-graph-title">
      <h2 id="entropy-graph-title" className="text-lg font-semibold text-cyan-200 md:text-xl">
        Live Entropy Graph
      </h2>

      <div className="mt-4 h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.length ? data : [{ step: 0, entropy: 0 }]}> 
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
            <Line
              type="monotone"
              dataKey="entropy"
              stroke="#00F5FF"
              strokeWidth={3}
              dot={false}
              isAnimationActive
              animationDuration={450}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
