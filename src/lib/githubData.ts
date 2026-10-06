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
 * The GitHub data schema that `scripts/fetch-github-data.ts` writes and
 * that the application uses for the first render and as fallback.
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

const API = 'https://api.github.com'
const CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de/v4'

interface ContributionsResponse {
  contributions: ContributionDay[]
}

export interface FetchOptions {
  /** Bearer token for api.github.com; the script passes one, the browser does not. */
  token?: string
}

/**
 * Fetch the GitHub dataset from api.github.com and the contributions
 * service. Any failed request rejects the whole call so callers keep
 * their previous data instead of merging a partially fresh dataset.
 */
export async function fetchGitHubData(
  username: string,
  repoFullNames: string[],
  options: FetchOptions = {},
): Promise<GitHubData> {
  const githubHeaders: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (options.token) {
    githubHeaders.Authorization = `Bearer ${options.token}`
  }

  const fetchRepo = async (fullName: string): Promise<GitHubRepo> => {
    // Encode per segment but keep the literal slash: a whole encoded
    // name (%2F) fails in the browser.
    const path = fullName.split('/').map(encodeURIComponent).join('/')
    const res = await fetch(`${API}/repos/${path}`, {
      headers: githubHeaders,
    })
    if (!res.ok) {
      throw new Error(`GitHub /repos/${fullName} failed (${res.status}).`)
    }
    return pickRepo((await res.json()) as GitHubRepo)
  }

  const fetchEvents = async (): Promise<GitHubEvent[]> => {
    const res = await fetch(
      `${API}/users/${encodeURIComponent(username)}/events/public?per_page=6`,
      { headers: githubHeaders },
    )
    if (!res.ok) {
      throw new Error(`GitHub events failed (${res.status}).`)
    }
    return ((await res.json()) as GitHubEvent[]).map(pickEvent)
  }

  const fetchContributions = async (): Promise<ContributionDay[]> => {
    // Third-party service, no token: it does not count against the GitHub limit.
    const res = await fetch(
      `${CONTRIBUTIONS_API}/${encodeURIComponent(username)}?y=last`,
    )
    if (!res.ok) {
      throw new Error(`Contributions request failed (${res.status}).`)
    }
    const body = (await res.json()) as ContributionsResponse
    return body.contributions
  }

  const [repos, events, contributions] = await Promise.all([
    Promise.all(repoFullNames.map(fetchRepo)),
    fetchEvents(),
    fetchContributions(),
  ])
  return {
    repos: Object.fromEntries(repos.map((repo) => [repo.full_name, repo])),
    events,
    contributions,
  }
}
