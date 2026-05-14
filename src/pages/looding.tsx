import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const passwordStreams = [
  '••••••••  qW9#x2!A',
  '••••••••  n7@Kp4$z',
  '••••••••  H3!mT8^r',
  '••••••••  s2%Vn6&L',
]

const statusModules = [
  'Entropy Engine',
  'Strength Meter',
  'Crack-Time Model',
  'Security Charts',
]

export const Looding = () => {
  const [progress, setProgress] = useState(10)
  const activeStream = useMemo(() => passwordStreams[progress % passwordStreams.length], [progress])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 96) return current
        return Math.min(96, current + Math.ceil(Math.random() * 10))
      })
    }, 180)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <motion.main
      className="loading-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      aria-label="Loading SecurePass AI"
    >
      <div className="loading-grid" aria-hidden="true" />

      <section className="loading-card">
        <div className="loading-head">
          <motion.div
            className="loading-orb"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
          />

          <div>
            <p className="loading-kicker">SecurePass AI</p>
            <h1 className="loading-title">Initializing security dashboard</h1>
            <p className="loading-subtitle">
              Preparing entropy engine, crack-time models, and live risk analytics.
            </p>
          </div>
        </div>

        <div className="loading-modules" aria-label="Loading modules">
          {statusModules.map((module, index) => (
            <motion.span
              key={module}
              className="loading-module-chip"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
            >
              {module}
            </motion.span>
          ))}
        </div>

        <div className="loading-stream-panel" aria-label="Password stream loading">
          <p className="loading-stream-label">Password character stream</p>
          <div className="loading-streams">
            {passwordStreams.map((stream, index) => (
              <motion.div
                key={stream}
                className={`loading-stream-row ${index === progress % passwordStreams.length ? 'active' : ''}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <span className="loading-stream-index">0{index + 1}</span>
                <span className="loading-stream-text">{stream}</span>
              </motion.div>
            ))}
          </div>
          <p className="loading-stream-hint">Live masking and character mix are being prepared for analysis.</p>
          <p className="loading-stream-active">Active pattern: <span>{activeStream}</span></p>
        </div>

        <div className="loading-progress-wrap" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            className="loading-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </div>

        <div className="loading-foot">
          <span>Booting modules</span>
          <span>{progress}%</span>
        </div>
      </section>
    </motion.main>
  )
}
