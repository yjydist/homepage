import { content } from '../content'
import Section from './Section'

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ul className="space-y-10">
        {content.experience.map((entry) => (
          <li key={`${entry.period}-${entry.role}`}>
            <div className="text-xs text-muted">{entry.period}</div>
            <h3 className="mt-1 font-bold">
              {entry.role}
              <span className="font-normal text-muted">
                {' '}
                · {entry.organization}
              </span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {entry.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
