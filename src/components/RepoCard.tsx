import { timeAgo } from '../lib/time'
import Icon from './Icon'

interface RepoCardProps {
  name: string
  url: string | null
  description: string | null
  stars: number | null
  language: string | null
  tags: string[]
  updatedAt: string | null
  /** False when live metadata could not be fetched. */
  live: boolean
}

export default function RepoCard({
  name,
  url,
  description,
  stars,
  language,
  tags,
  updatedAt,
  live,
}: RepoCardProps) {
  const hasMeta = live && (stars !== null || language || updatedAt)

  return (
    <article className="group flex h-full flex-col justify-between rounded-xl border border-line bg-surface-container-low/70 p-5 transition-all duration-medium ease-spring hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-container hover:shadow-xs">
      <div>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <h3 className="text-base font-bold underline-offset-4 transition-colors group-hover:text-accent">
              {name}
            </h3>
            {description && (
              <p className="mt-2 text-base leading-relaxed text-muted">
                {description}
              </p>
            )}
          </a>
        ) : (
          <>
            <h3 className="text-base font-bold">{name}</h3>
            {description && (
              <p className="mt-2 text-base leading-relaxed text-muted">
                {description}
              </p>
            )}
          </>
        )}
      </div>

      {(tags.length > 0 || hasMeta) && (
        <div className="mt-4">
          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 text-xs text-muted">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-sm border border-line/60 bg-surface-container px-2 py-0.5 transition-colors duration-short ease-standard hover:bg-accent/10 hover:text-on-primary-container"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
          {hasMeta && (
            <p className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
              {stars !== null && (
                <span className="inline-flex items-center gap-1">
                  <Icon name="star" />
                  {stars}
                </span>
              )}
              {language && (
                <span className="inline-flex items-center gap-1">
                  <Icon name="code" />
                  {language}
                </span>
              )}
              {updatedAt && (
                <span className="inline-flex items-center gap-1">
                  <Icon name="schedule" />
                  {timeAgo(updatedAt)}更新
                </span>
              )}
            </p>
          )}
        </div>
      )}
    </article>
  )
}
