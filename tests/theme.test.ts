import { describe, expect, test } from 'bun:test'
import { getContrastRatio } from '@mui/material/styles'
import { swissTokens, theme } from '../src/theme'

describe('Swiss theme', () => {
  test('uses the planned layout breakpoints and spacing', () => {
    expect(theme.breakpoints.values.sm).toBe(600)
    expect(theme.breakpoints.values.md).toBe(840)
    expect(theme.spacing(1)).toBe('4px')
    expect(theme.shape.borderRadius).toBe(4)
  })

  test('keeps text readable on every used surface', () => {
    for (const surface of [swissTokens.background, swissTokens.backgroundAlt]) {
      expect(getContrastRatio(swissTokens.text.primary, surface)).toBeGreaterThanOrEqual(4.5)
      expect(getContrastRatio(swissTokens.text.secondary, surface)).toBeGreaterThanOrEqual(4.5)
    }
    expect(getContrastRatio(swissTokens.accent, swissTokens.background)).toBeGreaterThanOrEqual(4.5)
    expect(getContrastRatio(swissTokens.accent, swissTokens.backgroundAlt)).toBeGreaterThanOrEqual(4.5)
    expect(getContrastRatio(swissTokens.error, swissTokens.background)).toBeGreaterThanOrEqual(4.5)
  })

  test('keeps prominent icons distinct from their backgrounds', () => {
    expect(getContrastRatio(swissTokens.accent, swissTokens.background)).toBeGreaterThanOrEqual(3)
    expect(getContrastRatio(swissTokens.text.secondary, swissTokens.backgroundAlt)).toBeGreaterThanOrEqual(3)
    expect(getContrastRatio(swissTokens.contribution[4], swissTokens.background)).toBeGreaterThanOrEqual(3)
  })

  test('orders contribution levels from lightest to darkest without duplicates', () => {
    const levels = swissTokens.contribution
    expect(new Set(levels).size).toBe(levels.length)
    for (let i = 1; i < levels.length; i++) {
      expect(getContrastRatio(levels[i], swissTokens.background)).toBeGreaterThan(getContrastRatio(levels[i - 1], swissTokens.background))
    }
  })
})
