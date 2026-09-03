import { content } from '../content'
import { socialIcon } from '../lib/socialIcons'
import Icon from './Icon'

export default function Hero() {
  const { profile } = content
  return (
    <section id="top" className="mx-auto w-full max-w-2xl px-6 pt-28 pb-16">
      {profile.avatar && (
        <>
          <style>{`
            @keyframes hero-avatar-spring {
              from {
                opacity: 0;
                transform: scale(0.88);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>
          <img
            src={profile.avatar}
            alt={content.site.name}
            style={{
              animation:
                'hero-avatar-spring 500ms var(--ease-spring, cubic-bezier(0.34, 1.56, 0.64, 1)) both',
            }}
            className="mb-8 size-20 rounded-[24px] border border-line bg-surface-container object-cover shadow-xs transition-transform duration-medium ease-spring hover:scale-105"
          />
        </>
      )}
      <h1 className="text-4xl font-bold tracking-tight">
        {content.site.name}
      </h1>
      <p className="mt-4 text-lg text-accent">{profile.tagline}</p>
      <ul className="mt-8 flex flex-wrap gap-1 text-sm text-muted">
        {profile.socials.map((social) => (
          <li key={social.label}>
            <a
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[48px] items-center gap-1.5 rounded-full px-3 py-2 transition-all duration-medium ease-standard hover:bg-accent/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Icon name={socialIcon(social.label)} size={18} />
              <span className="underline decoration-line underline-offset-4 transition-colors">
                {social.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
