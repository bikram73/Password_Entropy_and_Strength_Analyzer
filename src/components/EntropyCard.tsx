import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type EntropyCardProps = {
  entropy: number
  poolSize: number
  length: number
  score: number
}

const useAnimatedNumber = (value: number, durationMs = 550) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const initial = displayValue
    let frame = 0

    const animate = (timestamp: number) => {
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = initial + (value - initial) * eased

      setDisplayValue(next)

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return displayValue
}

export const EntropyCard = ({ entropy, poolSize, length, score }: EntropyCardProps) => {
  const entropyAnimated = useAnimatedNumber(entropy)
  const poolAnimated = useAnimatedNumber(poolSize)
  const lengthAnimated = useAnimatedNumber(length)

  return (
    <motion.section
      className="glass-card p-5 md:p-7"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      aria-labelledby="entropy-title"
    >
      <h2 id="entropy-title" className="text-lg font-semibold text-cyan-200 md:text-xl">
        Entropy Analysis
      </h2>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div
          className="entropy-ring"
          style={{
            background: `conic-gradient(#00F5FF ${score * 3.6}deg, rgba(148, 163, 184, 0.2) 0deg)`,
          }}
          aria-label={`Entropy gauge at ${score} percent`}
          role="img"
        >
          <div className="entropy-core">
            <p className="font-heading text-2xl text-white">{score}%</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Score</p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div className="stat-tile">
            <p className="stat-label">Entropy</p>
            <p className="stat-value">{entropyAnimated.toFixed(1)} bits</p>
          </div>
          <div className="stat-tile">
            <p className="stat-label">Character Pool</p>
            <p className="stat-value">{Math.round(poolAnimated)}</p>
          </div>
          <div className="stat-tile">
            <p className="stat-label">Length</p>
            <p className="stat-value">{Math.round(lengthAnimated)}</p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
