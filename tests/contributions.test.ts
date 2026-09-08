import { describe, expect, test } from 'bun:test'
import { monthLabels, parseDay, toWeeks } from '../src/lib/contributions'
import type { ContributionDay } from '../src/lib/github'

function day(date: string): ContributionDay {
  return { date, count: 1, level: 1 }
}

describe('parseDay', () => {
  test('parses a date-only string as local midnight', () => {
    const parsed = parseDay('2024-01-07')
    expect(parsed.getFullYear()).toBe(2024)
    expect(parsed.getMonth()).toBe(0)
    expect(parsed.getDate()).toBe(7)
    expect(parsed.getHours()).toBe(0)
  })
})

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

describe('monthLabels', () => {
  test('labels the week that contains the first day of a month', () => {
    const weeks = toWeeks([
      day('2024-01-07'),
      day('2024-01-08'),
      day('2024-01-14'),
      day('2024-02-01'),
      day('2024-02-04'),
    ])
    expect(monthLabels(weeks)).toEqual([{ weekIndex: 1, label: '2月' }])
  })

  test('skips a month whose 1st day is outside the range', () => {
    const weeks = toWeeks([day('2024-01-08'), day('2024-01-09')])
    expect(monthLabels(weeks)).toEqual([])
  })

  test('returns no labels for an empty range', () => {
    expect(monthLabels([])).toEqual([])
  })
})
