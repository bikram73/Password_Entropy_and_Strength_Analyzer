import { CheckCircle2, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import type { PasswordAnalysis } from '../utils/passwordAnalyzer'

type SuggestionsPanelProps = {
  analysis: PasswordAnalysis
}

const checklistMap: { key: keyof PasswordAnalysis['checks']; label: string }[] = [
  { key: 'hasUppercase', label: 'Contains uppercase letters' },
  { key: 'hasLowercase', label: 'Contains lowercase letters' },
  { key: 'hasNumbers', label: 'Contains numbers' },
  { key: 'hasSymbols', label: 'Contains symbols' },
]

export const SuggestionsPanel = ({ analysis }: SuggestionsPanelProps) => (
  <motion.section
    className="glass-card p-5 md:p-7"
    initial={{ opacity: 0, y: 22 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    aria-labelledby="suggestions-title"
  >
    <h2 id="suggestions-title" className="text-lg font-semibold text-cyan-200 md:text-xl">
      Suggestions and Security Warnings
    </h2>

    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <div>
        <h3 className="mb-2 text-sm uppercase tracking-[0.17em] text-slate-300">Checklist</h3>
        <ul className="space-y-2 text-sm">
          {checklistMap.map((item) => {
            const ok = analysis.checks[item.key]
            return (
              <li key={item.key} className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/45 p-2">
                {ok ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                ) : (
                  <XCircle className="h-4 w-4 text-rose-400" aria-hidden="true" />
                )}
                <span className={ok ? 'text-slate-100' : 'text-slate-400'}>{item.label}</span>
              </li>
            )
          })}
          <li className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/45 p-2">
            {analysis.checks.hasSequential ? (
              <XCircle className="h-4 w-4 text-rose-400" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            )}
            <span className={analysis.checks.hasSequential ? 'text-slate-400' : 'text-slate-100'}>
              Avoids sequential patterns
            </span>
          </li>
          <li className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/45 p-2">
            {analysis.checks.hasRepeating ? (
              <XCircle className="h-4 w-4 text-rose-400" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            )}
            <span className={analysis.checks.hasRepeating ? 'text-slate-400' : 'text-slate-100'}>
              Avoids repeated patterns
            </span>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-sm uppercase tracking-[0.17em] text-slate-300">Improvement Tips</h3>
        <ul className="space-y-2 text-sm text-slate-200">
          {analysis.suggestions.length ? (
            analysis.suggestions.map((tip) => (
              <li key={tip} className="rounded-lg border border-rose-300/20 bg-rose-500/10 p-2">
                {tip}
              </li>
            ))
          ) : (
            <li className="rounded-lg border border-emerald-300/20 bg-emerald-500/10 p-2">
              Password currently meets all core requirements.
            </li>
          )}
        </ul>

        <h3 className="mb-2 mt-4 text-sm uppercase tracking-[0.17em] text-slate-300">AI-style Guidance</h3>
        <ul className="space-y-2 text-sm text-cyan-100">
          {analysis.aiSuggestions.map((tip) => (
            <li key={tip} className="rounded-lg border border-cyan-300/25 bg-cyan-500/10 p-2">
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </motion.section>
)
