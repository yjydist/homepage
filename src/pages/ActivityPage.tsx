import ContributionsCalendar from '../components/ContributionsCalendar'
import EventsFeed from '../components/EventsFeed'
import Section from '../components/Section'
import { content } from '../content'

export default function ActivityPage() {
  const { username } = content.github
  return (
    <Section id="activity" title="Activity">
      <div className="space-y-12">
        <section>
          <h3 className="mb-4 text-sm text-muted">Contributions</h3>
          <ContributionsCalendar username={username} />
        </section>
        <section>
          <h3 className="mb-4 text-sm text-muted">Recent activity</h3>
          <EventsFeed username={username} />
        </section>
      </div>
    </Section>
  )
}
