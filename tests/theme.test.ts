import { describe, expect, test } from 'bun:test'
import { getContrastRatio } from '@mui/material/styles'
import { m3Roles, theme } from '../src/theme'

describe('M3 Expressive theme', () => {
  test('uses the planned layout breakpoints and spacing', () => {
    expect(theme.breakpoints.values.sm).toBe(600)
    expect(theme.breakpoints.values.md).toBe(840)
    expect(theme.spacing(1)).toBe('4px')
    expect(theme.shape.borderRadius).toBe(4)
  })

  test('keeps text readable on every used surface', () => {
    for (const surface of [
      m3Roles.surface,
      m3Roles.surfaceContainerLow,
      m3Roles.surfaceContainer,
      m3Roles.surfaceContainerHigh,
    ]) {
      expect(getContrastRatio(m3Roles.onSurface, surface)).toBeGreaterThanOrEqual(4.5)
      expect(getContrastRatio(m3Roles.onSurfaceVariant, surface)).toBeGreaterThanOrEqual(4.5)
    }
    expect(getContrastRatio(m3Roles.onPrimaryContainer, m3Roles.primaryContainer)).toBeGreaterThanOrEqual(4.5)
    expect(getContrastRatio(m3Roles.onTertiaryContainer, m3Roles.tertiaryContainer)).toBeGreaterThanOrEqual(4.5)
  })

  test('keeps prominent icons distinct from their backgrounds', () => {
    expect(getContrastRatio(m3Roles.primary, m3Roles.surface)).toBeGreaterThanOrEqual(3)
    expect(getContrastRatio(m3Roles.tertiary, m3Roles.surface)).toBeGreaterThanOrEqual(3)
    expect(getContrastRatio(m3Roles.onSurfaceVariant, m3Roles.surfaceContainerLow)).toBeGreaterThanOrEqual(3)
  })
})
