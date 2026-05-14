import { useState } from 'react'
import { Copy, Eye, EyeOff, RefreshCw, ShieldEllipsis } from 'lucide-react'
import { motion } from 'framer-motion'

type PasswordInputProps = {
  value: string
  onChange: (next: string) => void
}

export const PasswordInput = ({ value, onChange }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const copyPassword = async () => {
    if (!value) return

    try {
      await navigator.clipboard.writeText(value)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }

    window.setTimeout(() => setCopyState('idle'), 1500)
  }

  return (
    <motion.section
      className="glass-card p-5 md:p-7"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      aria-labelledby="password-input-title"
    >
      <div className="mb-4 flex items-center gap-2 text-cyan-200">
        <ShieldEllipsis className="h-5 w-5" aria-hidden="true" />
        <h2 id="password-input-title" className="text-lg font-semibold md:text-xl">
          Password Input
        </h2>
      </div>

      <label htmlFor="password-field" className="mb-2 block text-sm text-slate-300">
        Enter password to analyze in real time
      </label>

      <div className="relative">
        <input
          id="password-field"
          aria-label="Password field"
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Type your password here..."
          className="focus-ring w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-4 pr-36 text-base text-white outline-none transition md:text-lg"
        />

        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
          <button
            type="button"
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible((prev) => !prev)}
            className="icon-btn"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>

          <button
            type="button"
            aria-label="Copy password"
            onClick={copyPassword}
            className="icon-btn"
          >
            <Copy className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Clear password"
            onClick={() => onChange('')}
            className="icon-btn"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400" aria-live="polite">
        {copyState === 'copied' && 'Password copied to clipboard.'}
        {copyState === 'failed' && 'Clipboard access denied by browser settings.'}
        {copyState === 'idle' && 'Tip: avoid sharing real passwords while testing.'}
      </p>
    </motion.section>
  )
}
