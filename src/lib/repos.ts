import type { RepoEntry } from '../content'
import type { GitHubRepo } from './github'

/** What RepoCard renders: merged display fields, nothing else. */
export interface CardData {
  name: string
  url: string | null
  description: string | null
  stars: number | null
  language: string | null
  tags: string[]
  updatedAt: string | null
  live: boolean
}

/** Stable list key for one entry, independent of display merging. */
export function cardKey(entry: RepoEntry, index: number): string {
  return entry.repo ?? entry.name ?? String(index)
}

/** Merge one TOML entry with its fetched data; TOML overrides win. */
export function toCard(entry: RepoEntry, live?: GitHubRepo): CardData {
  return {
    name:
      entry.name ??
      live?.name ??
      entry.repo?.split('/').pop() ??
      entry.repo ??
      'Untitled',
    url:
      entry.url ??
      live?.html_url ??
      (entry.repo ? `https://github.com/${entry.repo}` : null),
    description: entry.description ?? live?.description ?? null,
    stars: live?.stargazers_count ?? null,
    language: live?.language ?? null,
    tags: entry.tags ?? live?.topics ?? [],
    updatedAt: live?.updated_at ?? null,
    live: live !== undefined,
  }
}

export function needsFetch(
  entry: RepoEntry,
): entry is RepoEntry & { repo: string } {
  return entry.mode === 'github' && typeof entry.repo === 'string'
}

/** Pinned first, then explicit order, then content.toml position. */
export function byDisplayOrder(
  a: RepoEntry & { sourceIndex: number },
  b: RepoEntry & { sourceIndex: number },
): number {
  if ((a.pinned ?? false) !== (b.pinned ?? false)) {
    return a.pinned ? -1 : 1
  }
  const ao = a.order ?? Number.MAX_SAFE_INTEGER
  const bo = b.order ?? Number.MAX_SAFE_INTEGER
  if (ao !== bo) return ao - bo
  return a.sourceIndex - b.sourceIndex
}
