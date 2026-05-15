import { calculateEntropy, getCharacterPoolSize, getCharacterSetUsage } from './entropyCalculator'
import { estimateCrackTimes, type CrackTimeEstimate } from './crackTimeEstimator'
import zxcvbn from 'zxcvbn'

const COMMON_PASSWORDS = new Set([
  'password',
  'password123',
  '123456',
  '123456789',
  'qwerty',
  'admin',
  'letmein',
  'welcome',
  'iloveyou',
  'abc123',
])

const DICTIONARY_TERMS = [
  'admin',
  'qwerty',
  'hello',
  'welcome',
  'password',
  'universe',
  'galaxy',
  'secure',
]

export type StrengthTier = {
  label: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong' | 'Good Level'
  min: number
  max: number
  color: string
  gradient: string
}

export type PasswordAnalysis = {
  password: string
  score: number
  practicalScore: number
  practicalLabel: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong'
  practicalGuesses: number
  practicalCrackTime: string
  practicalWarning: string
  practicalSuggestions: string[]
  entropy: number
  length: number
  poolSize: number
  tier: StrengthTier
  checks: {
    hasLowercase: boolean
    hasUppercase: boolean
    hasNumbers: boolean
    hasSymbols: boolean
    hasSequential: boolean
    hasRepeating: boolean
    hasDictionaryWord: boolean
    isCommonPassword: boolean
  }
  crackTime: CrackTimeEstimate
  suggestions: string[]
  aiSuggestions: string[]
}

const TIERS: StrengthTier[] = [
  {
    label: 'Very Weak',
    min: 0,
    max: 20,
    color: '#EF4444',
    gradient: 'linear-gradient(90deg, #EF4444, #F97316)',
  },
  {
    label: 'Weak',
    min: 21,
    max: 40,
    color: '#F97316',
    gradient: 'linear-gradient(90deg, #F97316, #F59E0B)',
  },
  {
    label: 'Moderate',
    min: 41,
    max: 60,
    color: '#FACC15',
    gradient: 'linear-gradient(90deg, #FACC15, #EAB308)',
  },
  {
    label: 'Strong',
    min: 61,
    max: 80,
    color: '#38BDF8',
    gradient: 'linear-gradient(90deg, #0EA5E9, #38BDF8)',
  },
  {
    label: 'Very Strong',
    min: 81,
    max: 95,
    color: '#22C55E',
    gradient: 'linear-gradient(90deg, #22C55E, #00F5FF)',
  },
  {
    label: 'Good Level',
    min: 96,
    max: 100,
    color: '#8B5CF6',
    gradient: 'linear-gradient(90deg, #8B5CF6, #00F5FF)',
  },
]

const findTier = (score: number): StrengthTier =>
  TIERS.find((tier) => score >= tier.min && score <= tier.max) ?? TIERS[0]

const containsSequence = (value: string): boolean => {
  if (value.length < 3) return false

  const normalized = value.toLowerCase()
  for (let i = 0; i < normalized.length - 2; i += 1) {
    const first = normalized.charCodeAt(i)
    const second = normalized.charCodeAt(i + 1)
    const third = normalized.charCodeAt(i + 2)

    const isAscending = second === first + 1 && third === second + 1
    const isDescending = second === first - 1 && third === second - 1

    if (isAscending || isDescending) {
      return true
    }
  }

  return false
}

const containsRepeatingPattern = (value: string): boolean => {
  if (/(.)\1{2,}/.test(value)) return true
  return /(.{2,})\1+/.test(value)
}

const hasDictionaryWord = (value: string): boolean => {
  const normalized = value.toLowerCase()
  return DICTIONARY_TERMS.some((word) => normalized.includes(word))
}

const isNumericOnly = (value: string): boolean => /^\d+$/.test(value)

type ZxcvbnResultLike = {
  score: number
  guesses: number
  crack_times_display: {
    offline_fast_hashing_1e10_per_second: string
  }
  feedback: {
    warning: string
    suggestions: string[]
  }
}

const practicalLabels: Array<PasswordAnalysis['practicalLabel']> = [
  'Very Weak',
  'Weak',
  'Moderate',
  'Strong',
  'Very Strong',
]

const entropyStrengthScore = (entropy: number): number => {
  if (entropy <= 0) return 0

  const normalized = 100 * (1 - Math.exp(-entropy / 90))
  return Math.max(0, Math.min(100, Math.round(normalized)))
}

const buildScore = (password: string, entropy: number, practicalScore: number): number => {
  const usage = getCharacterSetUsage(password)
  const entropyScore = entropyStrengthScore(entropy)
  const varietyCount = [usage.hasLowercase, usage.hasUppercase, usage.hasNumbers, usage.hasSymbols].filter(Boolean).length
  const numericOnly = isNumericOnly(password)

  let score = Math.round(entropyScore * 0.9 + practicalScore * 0.1)

  if (password.length >= 24) score += 2
  else if (password.length >= 16) score += 1

  if (varietyCount === 4 && entropyScore >= 70) score += 1

  const repeating = containsRepeatingPattern(password)
  const sequence = containsSequence(password)
  const common = COMMON_PASSWORDS.has(password.toLowerCase())
  const dictionaryDetected = hasDictionaryWord(password)

  if (common) score -= 18
  if (sequence) score -= 10
  if (repeating) score -= 8
  if (dictionaryDetected) score -= 6

  if (numericOnly && !sequence && !repeating && !common) {
    if (entropy >= 300) score = Math.max(score, 97)
    else if (entropy >= 180) score = Math.max(score, 96)
    else if (entropy >= 120) score = Math.max(score, 82)
    else if (entropy >= 60) score = Math.max(score, 60)
  }

  if (password.length === 0) return 0

  return Math.max(0, Math.min(100, Math.round(score)))
}

export const analyzePassword = (password: string): PasswordAnalysis => {
  const entropy = calculateEntropy(password)
  const poolSize = getCharacterPoolSize(password)
  const charUsage = getCharacterSetUsage(password)
  const zxcvbnResult = zxcvbn(password) as ZxcvbnResultLike

  const hasSequential = containsSequence(password)
  const hasRepeating = containsRepeatingPattern(password)
  const isCommonPassword = COMMON_PASSWORDS.has(password.toLowerCase())
  const dictionaryDetected = hasDictionaryWord(password)

  const practicalScore = Math.round((zxcvbnResult.score / 4) * 100)
  const practicalLabel = practicalLabels[zxcvbnResult.score] ?? practicalLabels[0]
  const practicalSuggestions = zxcvbnResult.feedback.suggestions.filter(Boolean)

  const score = buildScore(password, entropy, practicalScore)
  const tier = findTier(score)
  const crackTime = estimateCrackTimes(poolSize, password.length)

  const suggestions: string[] = []
  const aiSuggestions: string[] = []

  if (password.length < 12) suggestions.push('Use at least 12 to 16 characters.')
  if (!charUsage.hasUppercase) suggestions.push('Add uppercase letters (A-Z).')
  if (!charUsage.hasLowercase) suggestions.push('Add lowercase letters (a-z).')
  if (!charUsage.hasNumbers) suggestions.push('Include numbers (0-9).')
  if (!charUsage.hasSymbols) suggestions.push('Add symbols like @#$%^&*.')
  if (hasRepeating) suggestions.push('Avoid repeated characters or repeated chunks.')
  if (hasSequential) suggestions.push('Avoid sequential patterns such as abcde or 12345.')
  if (dictionaryDetected) suggestions.push('Avoid dictionary words and obvious phrases.')
  if (isCommonPassword) suggestions.push('This password is commonly used and unsafe.')
  if (zxcvbnResult.feedback.warning) suggestions.push(zxcvbnResult.feedback.warning)
  if (practicalSuggestions.length) {
    suggestions.push(...practicalSuggestions.map((tip) => `zxcvbn: ${tip}`))
  }

  if (!password.length) {
    aiSuggestions.push('Start with a memorable passphrase and then add symbols and numbers.')
  } else if (score < 60) {
    aiSuggestions.push('Use unrelated words with separators, then mix case and symbols.')
    aiSuggestions.push('Replace predictable chunks with random characters for better entropy.')
  } else if (score < 96) {
    aiSuggestions.push('You are close to elite strength, add more length and randomness.')
  } else {
    aiSuggestions.push('Excellent password security profile.')
  }

  if (practicalScore < score) {
    aiSuggestions.push('zxcvbn flags a more realistic strength drop than raw entropy alone suggests.')
  }

  return {
    password,
    score,
    practicalScore,
    practicalLabel,
    practicalGuesses: zxcvbnResult.guesses,
    practicalCrackTime: zxcvbnResult.crack_times_display.offline_fast_hashing_1e10_per_second,
    practicalWarning: zxcvbnResult.feedback.warning,
    practicalSuggestions,
    entropy,
    length: password.length,
    poolSize,
    tier,
    checks: {
      hasLowercase: charUsage.hasLowercase,
      hasUppercase: charUsage.hasUppercase,
      hasNumbers: charUsage.hasNumbers,
      hasSymbols: charUsage.hasSymbols,
      hasSequential,
      hasRepeating,
      hasDictionaryWord: dictionaryDetected,
      isCommonPassword,
    },
    crackTime,
    suggestions,
    aiSuggestions,
  }
}
