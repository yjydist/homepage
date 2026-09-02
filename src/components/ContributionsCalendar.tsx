import { useAsync } from '../hooks/useAsync'
import { fetchContributions } from '../lib/github'
import type { ContributionDay } from '../lib/github'
import { ErrorNotice, Loading } from './AsyncState'

const CELL = 10
const GAP = 3
const LABEL_HEIGHT = 14
const LEVEL_CLASS = [
  'fill-line',
  'fill-accent/20',
  'fill-accent/40',
  'fill-accent/65',
  'fill-accent',
]
const LEGEND_CLASS = [
  'bg-line',
  'bg-accent/20',
  'bg-accent/40',
  'bg-accent/65',
  'bg-accent',
]

interface Week {
  days: Array<ContributionDay | null>
}

/** Bucket days into Sunday-aligned week columns. */
function toWeeks(days: ContributionDay[]): Week[] {
  const weeks: Week[] = []
  let current: Array<ContributionDay | null> = []
  for (const day of days) {
    const dow = new Date(`${day.date}T00:00:00`).getDay()
    if (dow === 0 && current.length > 0) {
      weeks.push({ days: current })
      current = []
    }
    current.push(day)
  }
  if (current.length > 0) weeks.push({ days: current })
  return weeks
}

export default function ContributionsCalendar({
  username,
}: {
  username: string
}) {
  const { data, loading, error } = useAsync(
    (signal) => fetchContributions(username, signal),
    [username],
  )

  if (loading) return <Loading />
  if (error || !data || data.length === 0) {
    return <ErrorNotice message="Contribution calendar is unavailable right now." />
  }

  const weeks = toWeeks(data)
  const width = weeks.length * (CELL + GAP)
  const height = LABEL_HEIGHT + 7 * (CELL + GAP)

  // Label the month above the first week that contains its 1st.
  const monthLabels = weeks
    .map((week, i) => {
      const firstOfMonth = week.days.find(
        (day) => day !== null && new Date(`${day.date}T00:00:00`).getDate() === 1,
      )
      if (!firstOfMonth) return null
      const label = new Date(`${firstOfMonth.date}T00:00:00`).toLocaleString(
        'en',
        { month: 'short' },
      )
      return { x: i * (CELL + GAP), label }
    })
    .filter((item): item is { x: number; label: string } => item !== null)

  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        role="img"
        aria-label="GitHub contribution calendar"
      >
        {monthLabels.map((month) => (
          <text
            key={month.label + month.x}
            x={month.x}
            y={LABEL_HEIGHT - 4}
            className="fill-muted text-[9px]"
          >
            {month.label}
          </text>
        ))}
        {weeks.map((week, col) =>
          week.days.map((day) => {
            if (!day) return null
            const row = new Date(`${day.date}T00:00:00`).getDay()
            const level = Math.min(Math.max(day.level, 0), 4)
            return (
              <rect
                key={day.date}
                x={col * (CELL + GAP)}
                y={LABEL_HEIGHT + row * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={2}
                className={LEVEL_CLASS[level]}
              >
                <title>
                  {day.count} contribution{day.count === 1 ? '' : 's'} on{' '}
                  {day.date}
                </title>
              </rect>
            )
          }),
        )}
      </svg>
      <div className="mt-2 flex items-center gap-1 text-xs text-muted">
        <span>Less</span>
        {LEGEND_CLASS.map((className) => (
          <span key={className} className={`size-2 rounded-xs ${className}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
