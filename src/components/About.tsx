import { content } from '../content'
import Section from './Section'

export default function About() {
  const paragraphs = content.profile.bio.trim().split(/\n\s*\n/)
  return (
    <Section id="about" title="About">
      <div className="max-w-xl space-y-4 leading-relaxed">
        {paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </Section>
  )
}
