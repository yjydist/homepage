import { describe, expect, test } from 'bun:test'
import { pickEvent, pickRepo } from '../src/lib/githubSnapshot'

describe('pickRepo', () => {
  test('projects required repository fields and drops extraneous attributes', () => {
    const raw = {
      id: 123456,
      node_id: 'MDEwOlJlcG9zaXRvcnkxMjM0NTY=',
      name: 'handnote',
      full_name: 'yjydist/handnote',
      private: false,
      owner: { login: 'yjydist', id: 1 },
      html_url: 'https://github.com/yjydist/handnote',
      description: 'A markdown note app',
      fork: false,
      stargazers_count: 42,
      watchers_count: 42,
      language: 'TypeScript',
      topics: ['react', 'vite'],
      updated_at: '2026-09-01T12:00:00Z',
      default_branch: 'main',
    }

    expect(pickRepo(raw)).toEqual({
      name: 'handnote',
      full_name: 'yjydist/handnote',
      html_url: 'https://github.com/yjydist/handnote',
      description: 'A markdown note app',
      stargazers_count: 42,
      language: 'TypeScript',
      topics: ['react', 'vite'],
      updated_at: '2026-09-01T12:00:00Z',
    })
  })

  test('preserves nullable fields and topics array verbatim', () => {
    const raw = {
      name: 'agents',
      full_name: 'yjydist/agents',
      html_url: 'https://github.com/yjydist/agents',
      description: null,
      stargazers_count: 0,
      language: null,
      topics: [],
      updated_at: '2026-09-05T08:00:00Z',
    }

    const projected = pickRepo(raw)
    expect(projected.topics).toEqual([])
    expect(projected.description).toBeNull()
    expect(projected.language).toBeNull()
  })
})

describe('pickEvent', () => {
  test('projects required event fields and drops extraneous attributes', () => {
    const raw = {
      id: '987654321',
      type: 'PushEvent',
      actor: { id: 1, login: 'yjydist' },
      repo: { id: 10, name: 'yjydist/handnote', url: 'https://api.github.com/repos/yjydist/handnote' },
      payload: { commits: [{ message: 'feat: add note' }] },
      public: true,
      created_at: '2026-09-08T10:30:00Z',
    }

    expect(pickEvent(raw)).toEqual({
      id: '987654321',
      type: 'PushEvent',
      created_at: '2026-09-08T10:30:00Z',
      repo: { name: 'yjydist/handnote' },
      payload: { commits: [{ message: 'feat: add note' }] },
    })
  })

  test('preserves empty payload verbatim without modification', () => {
    const raw = {
      id: '12345',
      type: 'WatchEvent',
      created_at: '2026-09-08T11:00:00Z',
      repo: { name: 'yjydist/agents' },
      payload: {},
    }

    expect(pickEvent(raw).payload).toEqual({})
  })
})
