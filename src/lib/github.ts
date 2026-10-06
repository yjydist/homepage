import { useEffect, useState } from 'react'
import { content } from '../content'
import raw from '../generated/github-data.json'
import type {
  ContributionDay,
  GitHubData,
  GitHubEvent,
  GitHubRepo,
} from './githubSnapshot'
import { pickEvent, pickRepo } from './githubSnapshot'
import { usesGitHub } from '../content'

export type { ContributionDay, GitHubData, GitHubEvent, GitHubRepo }

/** The committed snapshot, used for the first render and as fallback. */
const snapshot = raw as GitHubData

const API = 'https://api.github.com'
const CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de/v4'

interface ContributionsResponse {
  contributions: ContributionDay[]
}

/**
 * Fetch live data anonymously (no token) from the browser. Any failed
 * request rejects the whole call so callers keep the committed snapshot
 * instead of merging a partially fresh dataset.
 */
export async function fetchLiveGitHubData(
  username: string,
  repoFullNames: string[],
): Promise<GitHubData> {
  const fetchRepo = async (fullName: string): Promise<GitHubRepo> => {
    // Encode per segment but keep the literal slash: a whole encoded
    // name (%2F) fails in the browser.
    const path = fullName.split('/').map(encodeURIComponent).join('/')
    const res = await fetch(`${API}/repos/${path}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
    if (!res.ok) {
      throw new Error(`GitHub /repos/${fullName} failed (${res.status}).`)
    }
    return pickRepo((await res.json()) as GitHubRepo)
  }

  const fetchEvents = async (): Promise<GitHubEvent[]> => {
    const res = await fetch(
      `${API}/users/${encodeURIComponent(username)}/events/public?per_page=6`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
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

/** One in-flight/completed fetch per target set, shared across components. */
const pending = new Map<string, Promise<GitHubData>>()

function liveData(): Promise<GitHubData> {
  const username = content.github?.username
  if (!username) return Promise.reject(new Error('No [github].username.'))
  const repoFullNames = content.repos.filter(usesGitHub).map((e) => e.repo)
  const key = `${username}|${repoFullNames.join(',')}`
  let promise = pending.get(key)
  if (!promise) {
    promise = fetchLiveGitHubData(username, repoFullNames)
    pending.set(key, promise)
  }
  return promise
}

/**
 * GitHub data for rendering: the committed snapshot immediately, then
 * replaced in place by live data once (and only if) the fetch succeeds.
 */
export function useGitHubData(): GitHubData {
  const [data, setData] = useState(snapshot)
  useEffect(() => {
    let cancelled = false
    liveData().then(
      (live) => {
        if (!cancelled) setData(live)
      },
      () => {
        // Keep the snapshot; a failed anonymous request is expected (rate
        // limit, offline) and must not surface as an error.
      },
    )
    return () => {
      cancelled = true
    }
  }, [])
  return data
}
