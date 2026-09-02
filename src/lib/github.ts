const API = 'https://api.github.com'
const CONTRIB_API = 'https://github-contributions-api.jogruber.de/v4'

export interface GitHubRepo {
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  language: string | null
  topics: string[]
  updated_at: string
}

export interface GitHubEvent {
  id: string
  type: string
  created_at: string
  repo: { name: string }
  payload: Record<string, unknown>
}

export interface ContributionDay {
  date: string
  count: number
  level: number
}

interface ContributionsResponse {
  contributions: ContributionDay[]
}

const CACHE_TTL_MS = 5 * 60 * 1000
const CACHE_PREFIX = 'gh:'

// Small sessionStorage cache so StrictMode double-mounts, back/forward
// navigation and refreshes do not burn the 60 req/hr/IP GitHub limit.
function readCache<T>(url: string): T | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + url)
    if (!raw) return null
    const envelope = JSON.parse(raw) as { at: number; data: T }
    if (Date.now() - envelope.at > CACHE_TTL_MS) return null
    return envelope.data
  } catch {
    return null
  }
}

function writeCache<T>(url: string, data: T): void {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + url,
      JSON.stringify({ at: Date.now(), data }),
    )
  } catch {
    // Storage full or unavailable: silently skip the cache.
  }
}

async function ghFetch<T>(url: string, signal: AbortSignal): Promise<T> {
  const cached = readCache<T>(url)
  if (cached) return cached

  const res = await fetch(url, {
    signal,
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) {
    if (res.status === 403 || res.status === 429) {
      throw new Error('GitHub rate limit reached — try again later.')
    }
    throw new Error(`GitHub request failed (${res.status}).`)
  }
  const data = (await res.json()) as T
  writeCache(url, data)
  return data
}

export function fetchRepo(
  fullName: string,
  signal: AbortSignal,
): Promise<GitHubRepo> {
  return ghFetch<GitHubRepo>(`${API}/repos/${fullName}`, signal)
}

export function fetchPublicEvents(
  username: string,
  signal: AbortSignal,
): Promise<GitHubEvent[]> {
  return ghFetch<GitHubEvent[]>(
    `${API}/users/${encodeURIComponent(username)}/events/public?per_page=30`,
    signal,
  )
}

// Third-party endpoint: does not count against the GitHub rate limit.
export function fetchContributions(
  username: string,
  signal: AbortSignal,
): Promise<ContributionDay[]> {
  return ghFetch<ContributionsResponse>(
    `${CONTRIB_API}/${encodeURIComponent(username)}?y=last`,
    signal,
  ).then((res) => res.contributions)
}
