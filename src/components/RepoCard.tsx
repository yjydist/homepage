import type { CardData } from '../lib/repos'
import { timeAgo } from '../lib/time'
import Icon from './Icon'

export default function RepoCard({
  name,
  url,
  description,
  stars,
  language,
  tags,
  updatedAt,
}: CardData) {
  // One entry per optional meta field; the row renders only if it has any.
  const meta: Array<{ icon: string; text: string }> = []
  if (stars !== null) meta.push({ icon: 'star', text: String(stars) })
  if (language) meta.push({ icon: 'code', text: language })
  if (updatedAt) {
    meta.push({ icon: 'schedule', text: `${timeAgo(updatedAt)}更新` })
  }
  // Only a linked card tints its title when the card is hovered.
  const titleClass = url
    ? 'text-base font-bold underline-offset-4 transition-colors group-hover:text-accent'
    : 'text-base font-bold'
  const title = (
    <>
      <h3 className={titleClass}>{name}</h3>
      {description && (
        <p className="mt-2 text-base leading-relaxed text-muted">
          {description}
        </p>
      )}
    </>
  )

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
            {title}
          </a>
        ) : (
          title
        )}
      </div>

      {(tags.length > 0 || meta.length > 0) && (
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
          {meta.length > 0 && (
            <p className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
              {meta.map(({ icon, text }) => (
                <span key={icon} className="inline-flex items-center gap-1">
                  <Icon name={icon} />
                  {text}
                </span>
              ))}
            </p>
          )}
        </div>
      )}
    </article>
  )
}
