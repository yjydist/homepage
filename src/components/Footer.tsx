import { content } from '../content'

export default function Footer() {
  const { site, profile } = content
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-2xl items-baseline justify-between px-6 py-8 text-sm text-muted">
        <span>
          © {site.year} {site.name}
        </span>
        <ul className="flex gap-4">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-accent"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
