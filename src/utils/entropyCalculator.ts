export type CharacterSetUsage = {
  hasLowercase: boolean
  hasUppercase: boolean
  hasNumbers: boolean
  hasSymbols: boolean
}

const LOWERCASE_SIZE = 26
const UPPERCASE_SIZE = 26
const NUMBER_SIZE = 10
const SYMBOL_SIZE = 32

export const getCharacterSetUsage = (password: string): CharacterSetUsage => ({
  hasLowercase: /[a-z]/.test(password),
  hasUppercase: /[A-Z]/.test(password),
  hasNumbers: /\d/.test(password),
  hasSymbols: /[^A-Za-z0-9]/.test(password),
})

export const getCharacterPoolSize = (password: string): number => {
  const usage = getCharacterSetUsage(password)

  let poolSize = 0
  if (usage.hasLowercase) poolSize += LOWERCASE_SIZE
  if (usage.hasUppercase) poolSize += UPPERCASE_SIZE
  if (usage.hasNumbers) poolSize += NUMBER_SIZE
  if (usage.hasSymbols) poolSize += SYMBOL_SIZE

  return poolSize
}

export const calculateEntropy = (password: string): number => {
  if (!password.length) return 0

  const poolSize = getCharacterPoolSize(password)
  if (poolSize <= 1) return 0

  return password.length * Math.log2(poolSize)
}
