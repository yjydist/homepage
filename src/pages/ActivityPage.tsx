import type { ReactNode } from 'react'
import ContributionsCalendar from '../components/ContributionsCalendar'
import EventsFeed from '../components/EventsFeed'
import Icon from '../components/Icon'
import Section from '../components/Section'
import { content } from '../content'

/** One labeled sub-section of the activity page. */
function SubSection({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: ReactNode
}) {
  return (
    <section>
      <h3 className="mb-4 flex items-center gap-1.5 text-sm text-muted">
        <Icon name={icon} size={16} />
        {title}
      </h3>
      {children}
    </section>
  )
}

export default function ActivityPage() {
  const { username } = content.github
  return (
    <Section title="动态">
      <div className="space-y-12">
        <SubSection icon="grid_on" title="贡献日历">
          <ContributionsCalendar username={username} />
        </SubSection>
        <SubSection icon="history" title="最近动态">
          <EventsFeed username={username} />
        </SubSection>
      </div>
    </Section>
  )
}
