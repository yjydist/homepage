import { useEffect, useState } from 'react'
import { content, usesGitHub } from '../content'
import raw from '../generated/github-data.json'
import { fetchGitHubData } from './githubData'
import type { GitHubData } from './githubData'

/** The committed snapshot, used for the first render and as fallback. */
const snapshot = raw as GitHubData

/**
 * The single live fetch, shared across components. Failures are cached
 * too (the hook silently keeps the snapshot), and HMR resets module
 * state, which is the only way to retry after a rejection.
 */
let live: Promise<GitHubData> | undefined

function liveData(): Promise<GitHubData> {
  const username = content.github?.username
  if (!username) return Promise.reject(new Error('No [github].username.'))
  const repoFullNames = content.repos.filter(usesGitHub).map((e) => e.repo)
  live ??= fetchGitHubData(username, repoFullNames)
  return live
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
