import { calculateEntropy, getCharacterPoolSize, getCharacterSetUsage } from './entropyCalculator'
import { estimateCrackTimes, type CrackTimeEstimate } from './crackTimeEstimator'

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

const buildScore = (password: string, entropy: number): number => {
  const usage = getCharacterSetUsage(password)

  let score = 0

  if (password.length >= 12) score += 25
  else if (password.length >= 8) score += 12

  if (usage.hasUppercase) score += 10
  if (usage.hasLowercase) score += 10
  if (usage.hasNumbers) score += 10
  if (usage.hasSymbols) score += 15

  const repeating = containsRepeatingPattern(password)
  const sequence = containsSequence(password)
  const common = COMMON_PASSWORDS.has(password.toLowerCase())

  if (!repeating) score += 10
  if (entropy >= 60) score += 20
  else if (entropy >= 40) score += 12

  if (common) score -= 40
  if (sequence) score -= 20
  if (repeating) score -= 15

  if (password.length === 0) return 0

  return Math.max(0, Math.min(100, Math.round(score)))
}

export const analyzePassword = (password: string): PasswordAnalysis => {
  const entropy = calculateEntropy(password)
  const poolSize = getCharacterPoolSize(password)
  const charUsage = getCharacterSetUsage(password)

  const hasSequential = containsSequence(password)
  const hasRepeating = containsRepeatingPattern(password)
  const isCommonPassword = COMMON_PASSWORDS.has(password.toLowerCase())
  const dictionaryDetected = hasDictionaryWord(password)

  const score = buildScore(password, entropy)
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

  return {
    password,
    score,
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
