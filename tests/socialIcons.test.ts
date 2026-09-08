import { describe, expect, test } from 'bun:test'
import { socialIcon } from '../src/lib/socialIcons'

describe('socialIcon', () => {
  test('matches labels case-insensitively', () => {
    expect(socialIcon('GitHub')).toBe('code')
    expect(socialIcon('EMAIL')).toBe('mail')
  })

  test('maps the Chinese email label', () => {
    expect(socialIcon('邮箱')).toBe('mail')
  })

  test('maps X to the alternate email glyph', () => {
    expect(socialIcon('X')).toBe('alternate_email')
  })

  test('falls back to link for unknown labels', () => {
    expect(socialIcon('mastodon')).toBe('link')
  })
})
