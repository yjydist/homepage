import ContributionsCalendar from '../components/ContributionsCalendar'
import EventsFeed from '../components/EventsFeed'
import Icon from '../components/Icon'
import Section from '../components/Section'
import { content } from '../content'

export default function ActivityPage() {
  const { username } = content.github
  return (
    <Section id="activity" title="Activity">
      <div className="space-y-12">
        <section>
          <h3 className="mb-4 flex items-center gap-1.5 text-sm text-muted">
            <Icon name="grid_on" size={16} />
            Contributions
          </h3>
          <ContributionsCalendar username={username} />
        </section>
        <section>
          <h3 className="mb-4 flex items-center gap-1.5 text-sm text-muted">
            <Icon name="history" size={16} />
            Recent activity
          </h3>
          <EventsFeed username={username} />
        </section>
      </div>
    </Section>
  )
}
