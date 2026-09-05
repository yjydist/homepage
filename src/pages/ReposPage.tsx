import { Loading } from '../components/AsyncState'
import RepoCard from '../components/RepoCard'
import Section from '../components/Section'
import { content } from '../content'
import type { RepoEntry } from '../content'
import { useAsync } from '../hooks/useAsync'
import { fetchRepo } from '../lib/github'
import type { GitHubRepo } from '../lib/github'

interface CardData {
  key: string
  name: string
  url: string | null
  description: string | null
  stars: number | null
  language: string | null
  tags: string[]
  updatedAt: string | null
  live: boolean
  pinned: boolean
  order: number | null
  sourceIndex: number
}

/** Merge one TOML entry with its fetched data; TOML overrides win. */
function toCard(entry: RepoEntry, index: number, live?: GitHubRepo): CardData {
  return {
    key: entry.repo ?? entry.name ?? String(index),
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
    pinned: entry.pinned ?? false,
    order: entry.order ?? null,
    sourceIndex: index,
  }
}

function needsFetch(entry: RepoEntry): entry is RepoEntry & { repo: string } {
  return entry.mode === 'github' && typeof entry.repo === 'string'
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
            {content.repos.map((entry, i) => {
              if (needsFetch(entry)) return null
              const { key, ...card } = toCard(entry, i)
              return (
                <li key={key}>
                  <RepoCard {...card} />
                </li>
              )
            })}
          </ul>
          <Loading />
        </>
      ) : (
        <ul className="grid gap-10 sm:grid-cols-2">
          {content.repos
            .map((entry, i) => {
              const outcome = results.data?.[i]
              const live =
                outcome?.status === 'fulfilled' && outcome.value !== null
                  ? outcome.value
                  : undefined
              return toCard(entry, i, live)
            })
            .sort((a, b) => {
              if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
              const ao = a.order ?? Number.MAX_SAFE_INTEGER
              const bo = b.order ?? Number.MAX_SAFE_INTEGER
              if (ao !== bo) return ao - bo
              return a.sourceIndex - b.sourceIndex
            })
            // Strip key/sort-only fields before spreading into RepoCard.
            .map(({ key, pinned: _pinned, order: _order, sourceIndex: _sourceIndex, ...card }) => (
              <li key={key}>
                <RepoCard {...card} />
              </li>
            ))}
        </ul>
      )}
    </Section>
  )
}
