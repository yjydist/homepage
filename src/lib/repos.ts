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
}

/** Stable list key for one entry, independent of display merging. */
export function cardKey(entry: RepoEntry, index: number): string {
  return entry.repo ?? entry.name ?? String(index)
}

/** Merge one TOML entry with its fetched data; TOML overrides win. */
export function toCard(entry: RepoEntry, live?: GitHubRepo): CardData {
  return {
    name: entry.name ?? live?.name ?? entry.repo?.split('/').pop() ?? 'Untitled',
    url:
      entry.url ??
      live?.html_url ??
      (entry.repo ? `https://github.com/${entry.repo}` : null),
    description: entry.description ?? live?.description ?? null,
    stars: live?.stargazers_count ?? null,
    language: live?.language ?? null,
    tags: entry.tags ?? live?.topics ?? [],
    updatedAt: live?.updated_at ?? null,
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

/** One entry's fetch result, positionally aligned with the entry list. */
export type RepoOutcome = PromiseSettledResult<GitHubRepo | undefined>

/** A card paired with its stable list key. */
export interface CardItem {
  key: string
  card: CardData
}

/**
 * Pair every entry with its fetch result, in display order. Entries without
 * a result (no fetch, or a rejected one) keep their TOML-only fields.
 */
export function toCards(
  entries: RepoEntry[],
  outcomes: Array<RepoOutcome | undefined> = [],
): CardItem[] {
  return entries
    .map((entry, sourceIndex) => ({ ...entry, sourceIndex }))
    .sort(byDisplayOrder)
    .map(({ sourceIndex, ...entry }) => {
      const outcome = outcomes[sourceIndex]
      return {
        key: cardKey(entry, sourceIndex),
        card: toCard(
          entry,
          outcome?.status === 'fulfilled' ? outcome.value : undefined,
        ),
      }
    })
}

/**
 * Cards for the entries that need no fetch, in source order. The loading
 * state shows these immediately while the other entries are in flight, so
 * it deliberately skips the display-order sort that `toCards` applies.
 */
export function toCardsWithoutFetch(entries: RepoEntry[]): CardItem[] {
  const cards: CardItem[] = []
  entries.forEach((entry, sourceIndex) => {
    if (!needsFetch(entry)) {
      cards.push({ key: cardKey(entry, sourceIndex), card: toCard(entry) })
    }
  })
  return cards
}
