import { content } from '../content'
import Section from './Section'

export default function Experience() {
  return (
    <Section id="experience" title="经历">
      <ul className="space-y-4">
        {content.experience.map((entry) => (
          <li
            key={`${entry.period}-${entry.role}`}
            className="rounded-xl border border-line bg-surface-container-low/70 p-5"
          >
            <div className="text-xs font-medium tracking-wide text-muted uppercase">
              {entry.period}
            </div>
            <h3 className="mt-1 text-base font-bold text-ink">
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
