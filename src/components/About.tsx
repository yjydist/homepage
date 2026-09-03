import { content } from '../content'
import Section from './Section'

export default function About() {
  const paragraphs = content.profile.bio.trim().split(/\n\s*\n/)
  return (
    <Section id="about" title="About">
      <div className="max-w-xl space-y-6 text-base leading-relaxed text-ink/90">
        {paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </Section>
  )
}
