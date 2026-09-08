import raw from '../generated/github-data.json'

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

/**
 * The committed snapshot, also the schema `scripts/fetch-github-data.ts`
 * writes. There is no runtime request: the data is refreshed by
 * `.github/workflows/refresh-github-data.yml` every six hours.
 */
export interface GitHubData {
  /** Keyed by the `repo` value from content.toml, e.g. "owner/name". */
  repos: Record<string, GitHubRepo>
  events: GitHubEvent[]
  contributions: ContributionDay[]
}

const data = raw as GitHubData

/** Snapshot metadata for one `mode = "github"` entry. */
export function repoFor(fullName: string): GitHubRepo | undefined {
  return data.repos[fullName]
}

export function publicEvents(): GitHubEvent[] {
  return data.events
}

export function contributionDays(): ContributionDay[] {
  return data.contributions
}
