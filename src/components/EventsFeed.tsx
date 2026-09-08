import { useAsync } from '../hooks/useAsync'
import { toEventDisplay } from '../lib/events'
import { fetchPublicEvents } from '../lib/github'
import { timeAgo } from '../lib/time'
import { Empty, ErrorNotice, Loading } from './AsyncState'
import Icon from './Icon'

export default function EventsFeed({ username }: { username: string }) {
  const { data, loading, error } = useAsync(
    (signal) => fetchPublicEvents(username, signal),
    [username],
  )

  if (loading) return <Loading />
  if (error) return <ErrorNotice message="最近动态暂时不可用。" />
  if (!data || data.length === 0) {
    return <Empty message="暂无公开动态。" />
  }

  return (
    <ul className="space-y-3">
      {data.map((event) => {
        const { icon, description } = toEventDisplay(event)
        return (
          <li
            key={event.id}
            className="rounded-xl border border-line bg-surface-container-low/70 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="flex items-start gap-2 text-base leading-relaxed">
                <Icon name={icon} className="mt-0.5 shrink-0" />
                <span>
                  {description}
                  <span className="text-muted">
                    {' '}
                    在{' '}
                    <a
                      href={`https://github.com/${event.repo.name}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-sm px-1 py-0.5 underline decoration-line underline-offset-4 transition-all duration-short ease-standard hover:bg-accent/10 hover:text-accent hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {event.repo.name}
                    </a>
                  </span>
                </span>
              </p>
              <time
                dateTime={event.created_at}
                className="shrink-0 text-xs text-muted"
              >
                {timeAgo(event.created_at)}
              </time>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
