import { content } from '../content'
import { socialIcon } from '../lib/socialIcons'
import Icon from './Icon'

export default function Footer() {
  const { site, profile } = content
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-content flex-wrap items-baseline justify-between gap-y-2 px-6 py-4 text-sm text-muted">
        <span>
          © {site.year ?? new Date().getFullYear()} {site.name}
        </span>
        <ul className="flex gap-4">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="-mx-1 -my-1.5 inline-flex items-center gap-1.5 rounded-xs px-1 py-1.5 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Icon name={socialIcon(social.label)} size={16} />
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
