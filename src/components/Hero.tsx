import { content } from '../content'

export default function Hero() {
  const { profile } = content
  return (
    <section id="top" className="mx-auto w-full max-w-2xl px-6 pt-28 pb-16">
      {profile.avatar && (
        <img
          src={profile.avatar}
          alt={content.site.name}
          className="mb-8 size-20 rounded-full"
        />
      )}
      <h1 className="text-4xl font-bold">{content.site.name}</h1>
      <p className="mt-4 text-lg text-accent">{profile.tagline}</p>
      <ul className="mt-8 flex gap-4 text-sm text-muted">
        {profile.socials.map((social) => (
          <li key={social.label}>
            <a
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
