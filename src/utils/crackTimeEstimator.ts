const ONLINE_GUESSES_PER_SECOND = 10
const OFFLINE_GUESSES_PER_SECOND = 1e9
const GPU_GUESSES_PER_SECOND = 1e11

type TimeUnit = {
  label: string
  seconds: number
}

const TIME_UNITS = [
  { label: 'second', seconds: 1 },
  { label: 'minute', seconds: 60 },
  { label: 'hour', seconds: 3600 },
  { label: 'day', seconds: 86400 },
  { label: 'year', seconds: 31_536_000 },
] as const satisfies TimeUnit[]

const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds <= 0) return 'instant'
  if (seconds > 1e20) return 'effectively impossible'

  if (seconds < 1) return 'less than a second'

  let chosen: TimeUnit = TIME_UNITS[0]
  for (const unit of TIME_UNITS) {
    if (seconds >= unit.seconds) {
      chosen = unit
    }
  }

  const value = seconds / chosen.seconds

  if (chosen.label === 'year' && value >= 1_000_000) {
    const millionYears = value / 1_000_000
    return `${millionYears.toFixed(millionYears >= 100 ? 0 : 1)} million years`
  }

  const rounded = value >= 100 ? Math.round(value) : Number(value.toFixed(1))
  const plural = rounded === 1 ? '' : 's'
  return `${rounded} ${chosen.label}${plural}`
}

export type CrackTimeEstimate = {
  online: string
  offline: string
  gpu: string
  onlineSeconds: number
  offlineSeconds: number
  gpuSeconds: number
}

export const estimateCrackTimes = (
  poolSize: number,
  passwordLength: number,
): CrackTimeEstimate => {
  if (!poolSize || !passwordLength) {
    return {
      online: 'instant',
      offline: 'instant',
      gpu: 'instant',
      onlineSeconds: 0,
      offlineSeconds: 0,
      gpuSeconds: 0,
    }
  }

  const combinations = Math.pow(poolSize, passwordLength)
  const averageGuessesToCrack = combinations / 2

  const onlineSeconds = averageGuessesToCrack / ONLINE_GUESSES_PER_SECOND
  const offlineSeconds = averageGuessesToCrack / OFFLINE_GUESSES_PER_SECOND
  const gpuSeconds = averageGuessesToCrack / GPU_GUESSES_PER_SECOND

  return {
    online: formatDuration(onlineSeconds),
    offline: formatDuration(offlineSeconds),
    gpu: formatDuration(gpuSeconds),
    onlineSeconds,
    offlineSeconds,
    gpuSeconds,
  }
}
