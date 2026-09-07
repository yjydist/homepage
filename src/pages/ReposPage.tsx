import { Loading } from '../components/AsyncState'
import RepoCard from '../components/RepoCard'
import Section from '../components/Section'
import { content } from '../content'
import type { RepoEntry } from '../content'
import { useAsync } from '../hooks/useAsync'
import { fetchRepo } from '../lib/github'
import type { GitHubRepo } from '../lib/github'

/** What RepoCard renders: merged display fields, nothing else. */
interface CardData {
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
function cardKey(entry: RepoEntry, index: number): string {
  return entry.repo ?? entry.name ?? String(index)
}

/** Merge one TOML entry with its fetched data; TOML overrides win. */
function toCard(entry: RepoEntry, live?: GitHubRepo): CardData {
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

function needsFetch(entry: RepoEntry): entry is RepoEntry & { repo: string } {
  return entry.mode === 'github' && typeof entry.repo === 'string'
}

/** Pinned first, then explicit order, then content.toml position. */
function byDisplayOrder(
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

export default function ReposPage() {
  // One request per fetched entry, settled independently so a single
  // failure degrades only that card. Custom entries never touch the network.
  const results = useAsync(
    (signal) =>
      Promise.allSettled(
        content.repos.map((entry) =>
          needsFetch(entry)
            ? fetchRepo(entry.repo, signal)
            : Promise.resolve(null),
        ),
      ),
    [],
  )

  const hasFetched = content.repos.some(needsFetch)

  return (
    <Section id="repos" title="仓库">
      {results.loading && hasFetched ? (
        <>
          <ul className="grid gap-10 sm:grid-cols-2">
            {content.repos.map((entry, i) =>
              needsFetch(entry) ? null : (
                <li key={cardKey(entry, i)}>
                  <RepoCard {...toCard(entry)} />
                </li>
              ),
            )}
          </ul>
          <Loading />
        </>
      ) : (
        <ul className="grid gap-10 sm:grid-cols-2">
          {content.repos
            .map((entry, sourceIndex) => ({ ...entry, sourceIndex }))
            .sort(byDisplayOrder)
            .map(({ sourceIndex, ...entry }) => {
              const outcome = results.data?.[sourceIndex]
              const live =
                outcome?.status === 'fulfilled' && outcome.value !== null
                  ? outcome.value
                  : undefined
              return (
                <li key={cardKey(entry, sourceIndex)}>
                  <RepoCard {...toCard(entry, live)} />
                </li>
              )
            })}
        </ul>
      )}
    </Section>
  )
}
