import { useEffect, useState } from 'react'
import { content } from '../content'
import raw from '../generated/github-data.json'
import { fetchGitHubData } from './githubData'
import type {
  ContributionDay,
  GitHubData,
  GitHubEvent,
  GitHubRepo,
} from './githubData'
import { usesGitHub } from '../content'

export type { ContributionDay, GitHubData, GitHubEvent, GitHubRepo }

/** The committed snapshot, used for the first render and as fallback. */
const snapshot = raw as GitHubData

/** One in-flight/completed fetch per target set, shared across components. */
const pending = new Map<string, Promise<GitHubData>>()

function liveData(): Promise<GitHubData> {
  const username = content.github?.username
  if (!username) return Promise.reject(new Error('No [github].username.'))
  const repoFullNames = content.repos.filter(usesGitHub).map((e) => e.repo)
  const key = `${username}|${repoFullNames.join(',')}`
  let promise = pending.get(key)
  if (!promise) {
    promise = fetchGitHubData(username, repoFullNames)
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
