import { ErrorNotice, Loading } from '../components/AsyncState'
import RepoCard from '../components/RepoCard'
import Section from '../components/Section'
import { content } from '../content'
import { useAsync } from '../hooks/useAsync'
import { fetchRepo } from '../lib/github'
import { byDisplayOrder, cardKey, needsFetch, toCard } from '../lib/repos'

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
  const failedCount =
    results.data?.filter((outcome) => outcome.status === 'rejected').length ?? 0

  return (
    <Section title="仓库">
      {failedCount > 0 && (
        <div className="mb-6">
          <ErrorNotice message="部分仓库元数据加载失败，已显示基础信息。" />
        </div>
      )}
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
