import type { ContributionDay } from './github'

/** Bucket days into Sunday-aligned week columns. */
export function toWeeks(days: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = []
  let current: ContributionDay[] = []
  for (const day of days) {
    const dow = new Date(`${day.date}T00:00:00`).getDay()
    if (dow === 0 && current.length > 0) {
      weeks.push(current)
      current = []
    }
    current.push(day)
  }
  if (current.length > 0) weeks.push(current)
  return weeks
}
