import { ErrorNotice, Loading } from '../components/AsyncState'
import RepoCard from '../components/RepoCard'
import Section from '../components/Section'
import { content } from '../content'
import { useAsync } from '../hooks/useAsync'
import { fetchRepo } from '../lib/github'
import type { CardItem } from '../lib/repos'
import { needsFetch, toCards, toCardsWithoutFetch } from '../lib/repos'

/** Card list markup shared by the loading and loaded states. */
function RepoList({ items }: { items: CardItem[] }) {
  return (
    <ul className="grid gap-10 sm:grid-cols-2">
      {items.map(({ key, card }) => (
        <li key={key}>
          <RepoCard {...card} />
        </li>
      ))}
    </ul>
  )
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
            : Promise.resolve(undefined),
        ),
      ),
    [],
  )

  const anyEntryNeedsFetch = content.repos.some(needsFetch)
  const hasFetchFailure =
    results.data?.some((outcome) => outcome.status === 'rejected') ?? false

  return (
    <Section title="仓库">
      {hasFetchFailure && (
        <div className="mb-6">
          <ErrorNotice message="部分仓库元数据加载失败，已显示基础信息。" />
        </div>
      )}
      {results.loading && anyEntryNeedsFetch ? (
        <>
          <RepoList items={toCardsWithoutFetch(content.repos)} />
          <Loading />
        </>
      ) : (
        <RepoList items={toCards(content.repos, results.data ?? [])} />
      )}
    </Section>
  )
}
