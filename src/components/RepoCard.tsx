import { timeAgo } from '../lib/time'

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
  const title = (
    <h3 className="font-bold underline-offset-4 group-hover:text-accent group-hover:underline">
      {name}
    </h3>
  )

  return (
    <article className="flex flex-col">
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="group">
          {title}
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {description}
            </p>
          )}
        </a>
      ) : (
        <>
          {title}
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {description}
            </p>
          )}
        </>
      )}
      {tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
          {tags.map((tag) => (
            <li key={tag} className="border border-line px-2 py-0.5">
              {tag}
            </li>
          ))}
        </ul>
      )}
      {live && (stars !== null || language || updatedAt) && (
        <p className="mt-2 flex gap-3 text-xs text-muted">
          {stars !== null && <span>★ {stars}</span>}
          {language && <span>{language}</span>}
          {updatedAt && <span>updated {timeAgo(updatedAt)}</span>}
        </p>
      )}
    </article>
  )
}
