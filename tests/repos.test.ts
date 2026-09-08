import { describe, expect, test } from 'bun:test'
import type { RepoEntry } from '../src/content'
import type { GitHubRepo } from '../src/lib/github'
import {
  byDisplayOrder,
  cardKey,
  toCard,
  toCards,
  usesGitHub,
} from '../src/lib/repos'

function entry(overrides: Partial<RepoEntry>): RepoEntry {
  return { mode: 'custom', ...overrides }
}

function live(overrides: Partial<GitHubRepo> = {}): GitHubRepo {
  return {
    name: 'name',
    full_name: 'owner/name',
    html_url: 'https://github.com/owner/name',
    description: 'live description',
    stargazers_count: 12,
    language: 'TypeScript',
    topics: ['a', 'b'],
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('usesGitHub', () => {
  test('matches only github entries with a repo key', () => {
    expect(usesGitHub(entry({ mode: 'github', repo: 'owner/name' }))).toBe(true)
    expect(usesGitHub(entry({ mode: 'github' }))).toBe(false)
    expect(usesGitHub(entry({ mode: 'custom' }))).toBe(false)
  })
})

describe('cardKey', () => {
  test('prefers repo, then name, then index', () => {
    expect(cardKey(entry({ repo: 'owner/name' }), 0)).toBe('owner/name')
    expect(cardKey(entry({ name: 'display' }), 0)).toBe('display')
    expect(cardKey(entry({}), 4)).toBe('4')
  })
})

describe('toCard', () => {
  test('lets TOML values override snapshot metadata', () => {
    const card = toCard(
      entry({
        mode: 'github',
        repo: 'owner/name',
        name: 'custom name',
        description: 'custom description',
        tags: ['x'],
      }),
      live(),
    )
    expect(card.name).toBe('custom name')
    expect(card.description).toBe('custom description')
    expect(card.tags).toEqual(['x'])
    expect(card.stars).toBe(12)
  })

  test('falls back to repo-derived fields without snapshot data', () => {
    const card = toCard(entry({ mode: 'github', repo: 'owner/name' }))
    expect(card.name).toBe('name')
    expect(card.url).toBe('https://github.com/owner/name')
    expect(card.stars).toBeNull()
  })
})

describe('toCards', () => {
  test('pairs each entry with its snapshot metadata after sorting', () => {
    const cards = toCards(
      [
        entry({ mode: 'github', repo: 'owner/name' }),
        entry({ name: 'manual', pinned: true }),
      ],
      (fullName) => (fullName === 'owner/name' ? live() : undefined),
    )
    expect(cards.map((item) => item.key)).toEqual(['manual', 'owner/name'])
    expect(cards[0].card.name).toBe('manual')
    expect(cards[1].card.name).toBe('name')
    expect(cards[1].card.stars).toBe(12)
  })

  test('keeps TOML-only fields when the snapshot has no metadata', () => {
    const cards = toCards(
      [entry({ mode: 'github', repo: 'owner/name', name: 'custom name' })],
      () => undefined,
    )
    expect(cards[0].card.name).toBe('custom name')
    expect(cards[0].card.stars).toBeNull()
  })

  test('never looks up entries that do not use GitHub', () => {
    const cards = toCards([entry({ name: 'manual' })], () => {
      throw new Error('lookup must not run for non-github entries')
    })
    expect(cards).toHaveLength(1)
    expect(cards[0].key).toBe('manual')
    expect(cards[0].card.url).toBeNull()
  })
})

describe('byDisplayOrder', () => {
  test('puts pinned entries first, then order, then source position', () => {
    const items = [
      { ...entry({ order: 1 }), sourceIndex: 0 },
      { ...entry({ pinned: true }), sourceIndex: 1 },
      { ...entry({}), sourceIndex: 2 },
      { ...entry({ order: 0 }), sourceIndex: 3 },
    ].sort(byDisplayOrder)
    expect(items.map((item) => item.sourceIndex)).toEqual([1, 3, 0, 2])
  })
})
