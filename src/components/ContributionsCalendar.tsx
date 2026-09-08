import { monthLabels, parseDay, toWeeks } from '../lib/contributions'
import { contributionDays } from '../lib/github'
import { Empty } from './Empty'

const CELL = 10
const GAP = 3
const LABEL_HEIGHT = 14
const LEVEL_CLASS = [
  'fill-line',
  'fill-accent/20',
  'fill-accent/45',
  'fill-accent/70',
  'fill-accent',
]
const LEGEND_CLASS = [
  'bg-line',
  'bg-accent/20',
  'bg-accent/45',
  'bg-accent/70',
  'bg-accent',
]

export default function ContributionsCalendar() {
  const days = contributionDays()
  if (days.length === 0) {
    return <Empty message="暂无贡献数据。" />
  }

  const weeks = toWeeks(days)
  const width = weeks.length * (CELL + GAP)
  const height = LABEL_HEIGHT + 7 * (CELL + GAP)

  return (
    <div className="overflow-x-auto">
      {/* w-fit keeps the block at the calendar's own width, so mx-auto
          centers it while it fits and resolves to 0 (left-aligned, fully
          scrollable) once it does not. */}
      <div className="mx-auto w-fit">
        <svg
          width={width}
          height={height}
          role="img"
          aria-label="GitHub 贡献日历"
        >
          {monthLabels(weeks).map(({ weekIndex, label }) => (
            <text
              key={label + weekIndex}
              x={weekIndex * (CELL + GAP)}
              y={LABEL_HEIGHT - 4}
              className="fill-muted text-[9px]"
            >
              {label}
            </text>
          ))}
          {weeks.map((week, col) =>
            week.map((day) => {
              const row = parseDay(day.date).getDay()
              const level = Math.min(
                Math.max(day.level, 0),
                LEVEL_CLASS.length - 1,
              )
              return (
                <rect
                  key={day.date}
                  x={col * (CELL + GAP)}
                  y={LABEL_HEIGHT + row * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={3}
                  className={`${LEVEL_CLASS[level]} transition-opacity duration-short ease-standard hover:opacity-75`}
                >
                  <title>
                    {day.count} 次贡献 · {day.date}
                  </title>
                </rect>
              )
            }),
          )}
        </svg>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <span>少</span>
          {LEGEND_CLASS.map((className) => (
            <span
              key={className}
              className={`size-2.5 rounded-[3px] ${className}`}
            />
          ))}
          <span>多</span>
        </div>
      </div>
    </div>
  )
}
