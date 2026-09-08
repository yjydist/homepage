import type { ContributionDay } from './github'

/**
 * Parse a `YYYY-MM-DD` date as local midnight. Date-only strings parse as
 * UTC, which shifts the weekday for visitors behind UTC; the time suffix
 * pins the day to their local calendar.
 */
export function parseDay(iso: string): Date {
  return new Date(`${iso}T00:00:00`)
}

/** Bucket days into Sunday-aligned week columns. */
export function toWeeks(days: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = []
  let current: ContributionDay[] = []
  for (const day of days) {
    const dow = parseDay(day.date).getDay()
    if (dow === 0 && current.length > 0) {
      weeks.push(current)
      current = []
    }
    current.push(day)
  }
  if (current.length > 0) weeks.push(current)
  return weeks
}

/**
 * For every month that starts inside the range, the index of the week
 * column holding its 1st day plus a short month name. A month whose 1st
 * day is missing (range starts later) gets no label.
 */
export function monthLabels(
  weeks: ContributionDay[][],
): Array<{ weekIndex: number; label: string }> {
  const labels: Array<{ weekIndex: number; label: string }> = []
  weeks.forEach((week, weekIndex) => {
    const firstOfMonth = week.find((day) => parseDay(day.date).getDate() === 1)
    if (!firstOfMonth) return
    labels.push({
      weekIndex,
      label: parseDay(firstOfMonth.date).toLocaleString('zh-CN', {
        month: 'short',
      }),
    })
  })
  return labels
}
