import { describe, expect, test } from 'bun:test'
import { fetchGitHubData, pickEvent, pickRepo } from '../src/lib/githubData'

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

const repoRaw = {
  name: 'handnote',
  full_name: 'yjydist/handnote',
  html_url: 'https://github.com/yjydist/handnote',
  description: 'A markdown note app',
  stargazers_count: 42,
  language: 'TypeScript',
  topics: ['react'],
  updated_at: '2026-09-01T12:00:00Z',
  id: 1,
  default_branch: 'main',
}

const eventsRaw = [
  {
    id: '987654321',
    type: 'PushEvent',
    created_at: '2026-09-08T10:30:00Z',
    repo: { name: 'yjydist/handnote' },
    payload: { commits: [{ message: 'feat: add note' }] },
    actor: { login: 'yjydist' },
    public: true,
  },
]

const contributionsRaw = {
  contributions: [{ date: '2026-09-08', count: 3, level: 2 }],
}

type FetchStub = (
  input: string | URL | Request,
) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>

function stubFetch(stub: FetchStub): void {
  globalThis.fetch = stub as typeof fetch
}

function jsonResponse(body: unknown): { ok: boolean; status: number; json: () => Promise<unknown> } {
  return { ok: true, status: 200, json: () => Promise.resolve(body) }
}

function errorResponse(status: number): { ok: boolean; status: number; json: () => Promise<unknown> } {
  return { ok: false, status, json: () => Promise.resolve({}) }
}

describe('fetchGitHubData', () => {
  test('assembles the snapshot schema via pickRepo/pickEvent projections', async () => {
    const urls: string[] = []
    stubFetch((input) => {
      urls.push(String(input))
      const url = String(input)
      if (url.includes('/repos/')) return jsonResponse(repoRaw)
      if (url.includes('/events/public')) return jsonResponse(eventsRaw)
      if (url.includes('jogruber')) return jsonResponse(contributionsRaw)
      return errorResponse(404)
    })

    const data = await fetchGitHubData('yjydist', ['yjydist/handnote'])
    expect(data.repos['yjydist/handnote']).toEqual({
      name: 'handnote',
      full_name: 'yjydist/handnote',
      html_url: 'https://github.com/yjydist/handnote',
      description: 'A markdown note app',
      stargazers_count: 42,
      language: 'TypeScript',
      topics: ['react'],
      updated_at: '2026-09-01T12:00:00Z',
    })
    expect(data.events).toEqual([
      {
        id: '987654321',
        type: 'PushEvent',
        created_at: '2026-09-08T10:30:00Z',
        repo: { name: 'yjydist/handnote' },
        payload: { commits: [{ message: 'feat: add note' }] },
      },
    ])
    expect(data.contributions).toEqual(contributionsRaw.contributions)
    expect(urls.some((url) => url.includes('/users/yjydist/events/public?per_page=6'))).toBe(true)
    expect(urls.some((url) => url.includes('jogruber.de/v4/yjydist?y=last'))).toBe(true)
  })

  test('keys each repo by its full_name', async () => {
    stubFetch((input) => {
      const url = String(input)
      if (url.includes('/repos/yjydist/agents')) {
        return jsonResponse({ ...repoRaw, name: 'agents', full_name: 'yjydist/agents' })
      }
      if (url.includes('/repos/')) return jsonResponse(repoRaw)
      if (url.includes('/events/public')) return jsonResponse(eventsRaw)
      return jsonResponse(contributionsRaw)
    })

    const data = await fetchGitHubData('yjydist', ['yjydist/handnote', 'yjydist/agents'])
    expect(Object.keys(data.repos)).toEqual(['yjydist/handnote', 'yjydist/agents'])
  })

  test('rejects as a whole when any request is not 2xx', async () => {
    stubFetch((input) => {
      const url = String(input)
      if (url.includes('/repos/')) return jsonResponse(repoRaw)
      // Rate-limited events endpoint.
      return errorResponse(403)
    })

    expect(
      fetchGitHubData('yjydist', ['yjydist/handnote']),
    ).rejects.toThrow('GitHub events failed (403).')
  })

  test('rejects when the contributions API fails', async () => {
    stubFetch((input) => {
      const url = String(input)
      if (url.includes('/repos/')) return jsonResponse(repoRaw)
      if (url.includes('/events/public')) return jsonResponse(eventsRaw)
      return errorResponse(500)
    })

    expect(
      fetchGitHubData('yjydist', ['yjydist/handnote']),
    ).rejects.toThrow('Contributions request failed (500).')
  })
})
