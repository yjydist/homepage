import { content } from '../content'

export default function Footer() {
  const { site, profile } = content
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-4 px-6 py-4 text-sm text-muted sm:flex-row">
        <span>
          © {site.year} {site.name}
        </span>
        <ul className="flex flex-wrap items-center gap-1">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[48px] items-center rounded-full px-3 py-2 transition-all duration-medium ease-standard hover:bg-accent/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
