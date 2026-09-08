import { describe, expect, test } from 'bun:test'
import { toWeeks } from '../src/lib/contributions'
import type { ContributionDay } from '../src/lib/github'

function day(date: string): ContributionDay {
  return { date, count: 1, level: 1 }
}

describe('toWeeks', () => {
  test('returns no weeks for an empty range', () => {
    expect(toWeeks([])).toEqual([])
  })

  test('keeps a Sunday-to-Saturday run in one week', () => {
    const days = [
      day('2024-01-07'),
      day('2024-01-08'),
      day('2024-01-09'),
      day('2024-01-10'),
      day('2024-01-11'),
      day('2024-01-12'),
      day('2024-01-13'),
    ]
    const weeks = toWeeks(days)
    expect(weeks).toHaveLength(1)
    expect(weeks[0]).toHaveLength(7)
  })

  test('starts a new week on the next Sunday', () => {
    const weeks = toWeeks([
      day('2024-01-07'),
      day('2024-01-08'),
      day('2024-01-14'),
    ])
    expect(weeks).toHaveLength(2)
    expect(weeks[0].map((d) => d.date)).toEqual(['2024-01-07', '2024-01-08'])
    expect(weeks[1].map((d) => d.date)).toEqual(['2024-01-14'])
  })

  test('leaves a partial first week short', () => {
    const weeks = toWeeks([day('2024-01-08'), day('2024-01-09')])
    expect(weeks).toHaveLength(1)
    expect(weeks[0]).toHaveLength(2)
  })
})
