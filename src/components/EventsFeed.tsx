import { useAsync } from '../hooks/useAsync'
import { fetchPublicEvents } from '../lib/github'
import type { GitHubEvent } from '../lib/github'
import { timeAgo } from '../lib/time'
import { Empty, ErrorNotice, Loading } from './AsyncState'
import Icon from './Icon'

// Payload fields are loosely typed, so reads go through small guards.
function str(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function num(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

function shortRef(ref: string): string {
  return ref.replace(/^refs\/heads\//, '')
}

// Maps a GitHub event type to a Material Symbols ligature name. Not
// exported: keeps this file a single-component module for oxlint's
// react/only-export-components rule.
function eventIcon(type: string): string {
  switch (type) {
    case 'PushEvent':
      return 'commit'
    case 'CreateEvent':
      return 'add_circle'
    case 'DeleteEvent':
      return 'delete'
    case 'IssuesEvent':
      return 'report'
    case 'IssueCommentEvent':
      return 'mode_comment'
    case 'PullRequestEvent':
      return 'call_merge'
    case 'PullRequestReviewEvent':
      return 'rate_review'
    case 'ForkEvent':
      return 'fork_right'
    case 'WatchEvent':
      return 'star'
    case 'ReleaseEvent':
      return 'local_offer'
    case 'PublicEvent':
      return 'public'
    default:
      return 'bolt'
  }
}

function describeEvent(event: GitHubEvent): string {
  const { payload } = event
  switch (event.type) {
    case 'PushEvent': {
      const commits = Array.isArray(payload.commits)
        ? payload.commits.length
        : 1
      const ref = str(payload.ref)
      return `Pushed ${commits} commit${commits === 1 ? '' : 's'}${ref ? ` to ${shortRef(ref)}` : ''}`
    }
    case 'CreateEvent': {
      const refType = str(payload.ref_type) ?? 'ref'
      const ref = str(payload.ref)
      return refType === 'repository'
        ? 'Created this repository'
        : `Created ${refType} ${ref ?? ''}`
    }
    case 'DeleteEvent':
      return `Deleted ${str(payload.ref_type) ?? 'ref'} ${str(payload.ref) ?? ''}`
    case 'IssuesEvent':
      return `${str(payload.action) ?? 'Updated'} issue #${num((payload.issue as Record<string, unknown>)?.number) ?? ''}: ${str((payload.issue as Record<string, unknown>)?.title) ?? ''}`
    case 'IssueCommentEvent':
      return `Commented on issue #${num((payload.issue as Record<string, unknown>)?.number) ?? ''}`
    case 'PullRequestEvent': {
      const pr = payload.pull_request as Record<string, unknown> | undefined
      const action = payload.action === 'closed' && pr?.merged === true
        ? 'Merged'
        : (str(payload.action) ?? 'Updated')
      return `${action} PR #${num(pr?.number) ?? ''}: ${str(pr?.title) ?? ''}`
    }
    case 'PullRequestReviewEvent':
      return `Reviewed a pull request`
    case 'ForkEvent':
      return `Forked to ${str((payload.forkee as Record<string, unknown>)?.full_name) ?? 'a new repository'}`
    case 'WatchEvent':
      return 'Starred this repository'
    case 'ReleaseEvent':
      return `Released ${str((payload.release as Record<string, unknown>)?.tag_name) ?? 'a version'}`
    case 'PublicEvent':
      return 'Made a repository public'
    default:
      return `${event.type.replace(/Event$/, '')}`
  }
}

export default function EventsFeed({ username }: { username: string }) {
  const { data, loading, error } = useAsync(
    (signal) => fetchPublicEvents(username, signal),
    [username],
  )

  if (loading) return <Loading />
  if (error) return <ErrorNotice message="Recent activity is unavailable right now." />
  if (!data || data.length === 0) {
    return <Empty message="No recent public activity." />
  }

  return (
    <ul className="space-y-3">
      {data.map((event) => (
        <li
          key={event.id}
          className="rounded-xl border border-line bg-surface-container-low/70 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="flex items-start gap-2 text-sm leading-relaxed">
              <Icon name={eventIcon(event.type)} className="mt-0.5 shrink-0" />
              <span>
                {describeEvent(event)}
                <span className="text-muted">
                  {' '}
                  in{' '}
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
            <time className="shrink-0 text-xs text-muted">
              {timeAgo(event.created_at)}
            </time>
          </div>
        </li>
      ))}
    </ul>
  )
}
