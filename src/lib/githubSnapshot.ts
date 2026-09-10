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
 * The committed snapshot schema that `scripts/fetch-github-data.ts` writes
 * and the application consumes at runtime.
 */
export interface GitHubData {
  /** Keyed by the `repo` value from content.toml, e.g. "owner/name". */
  repos: Record<string, GitHubRepo>
  events: GitHubEvent[]
  contributions: ContributionDay[]
}

/**
 * Project a raw GitHub repository API response down to the snapshot schema.
 * Drops extraneous fields to avoid file bloat and noisy diffs.
 */
export function pickRepo(repo: GitHubRepo): GitHubRepo {
  return {
    name: repo.name,
    full_name: repo.full_name,
    html_url: repo.html_url,
    description: repo.description,
    stargazers_count: repo.stargazers_count,
    language: repo.language,
    topics: repo.topics,
    updated_at: repo.updated_at,
  }
}

/**
 * Project a raw GitHub event API response down to the snapshot schema.
 */
export function pickEvent(event: GitHubEvent): GitHubEvent {
  return {
    id: event.id,
    type: event.type,
    created_at: event.created_at,
    repo: { name: event.repo.name },
    payload: event.payload,
  }
}
