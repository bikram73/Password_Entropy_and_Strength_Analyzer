import { motion } from 'framer-motion'
import type { CrackTimeEstimate } from '../utils/crackTimeEstimator'

type CrackTimeCardProps = {
  crackTime: CrackTimeEstimate
}

export const CrackTimeCard = ({ crackTime }: CrackTimeCardProps) => (
  <motion.section
    className="glass-card p-5 md:p-7"
    initial={{ opacity: 0, y: 22 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.15 }}
    aria-labelledby="crack-time-title"
  >
    <h2 id="crack-time-title" className="text-lg font-semibold text-cyan-200 md:text-xl">
      Crack Time Estimation
    </h2>

    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <article className="crack-tile">
        <p className="crack-label">Online Attack</p>
        <p className="crack-value">{crackTime.online}</p>
        <p className="crack-footnote">~10 guesses/sec</p>
      </article>

      <article className="crack-tile">
        <p className="crack-label">Offline Brute Force</p>
        <p className="crack-value">{crackTime.offline}</p>
        <p className="crack-footnote">~1B guesses/sec</p>
      </article>

      <article className="crack-tile">
        <p className="crack-label">GPU Cluster</p>
        <p className="crack-value">{crackTime.gpu}</p>
        <p className="crack-footnote">~100B guesses/sec</p>
      </article>
    </div>
  </motion.section>
)
