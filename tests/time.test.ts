import { describe, expect, test } from 'bun:test'
import { timeAgo } from '../src/lib/time'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString()
}

describe('timeAgo', () => {
  test('returns an empty string for an invalid timestamp', () => {
    expect(timeAgo('not-a-date')).toBe('')
  })

  test('returns 刚刚 under a minute', () => {
    expect(timeAgo(ago(30 * 1000))).toBe('刚刚')
  })

  test('rounds down to minutes', () => {
    expect(timeAgo(ago(5 * MINUTE))).toBe('5 分钟前')
    expect(timeAgo(ago(59 * MINUTE))).toBe('59 分钟前')
  })

  test('rounds down to hours', () => {
    expect(timeAgo(ago(3 * HOUR))).toBe('3 小时前')
  })

  test('rounds down to days', () => {
    expect(timeAgo(ago(2 * DAY))).toBe('2 天前')
  })

  test('rounds down to 30-day months', () => {
    expect(timeAgo(ago(3 * MONTH))).toBe('3 个月前')
  })

  test('treats future timestamps as 刚刚', () => {
    expect(timeAgo(ago(-DAY))).toBe('刚刚')
  })
})
