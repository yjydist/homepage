import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { monthLabels, parseDay, toWeeks } from '../lib/contributions'
import { contributionDays } from '../lib/github'
import { Empty } from './Empty'

const CELL = 10
const GAP = 3
const LABEL_HEIGHT = 14

export default function ContributionsCalendar() {
  const theme = useTheme()
  const days = contributionDays()
  if (days.length === 0) return <Empty message="暂无贡献数据。" />

  const weeks = toWeeks(days)
  const width = weeks.length * (CELL + GAP)
  const height = LABEL_HEIGHT + 7 * (CELL + GAP)

  return (
    <Card variant="outlined" sx={{ borderColor: theme.swiss.divider }}>
      <CardContent sx={{ p: 6, '&:last-child': { pb: 6 } }}>
        <Box
          role="region"
          aria-label="贡献日历，可横向滚动"
          tabIndex={0}
          sx={{ overflowX: 'auto', pb: 1, '&:focus-visible': { outline: `2px solid ${theme.swiss.accent}`, outlineOffset: 2 }, '& .contribution-cell': { transition: theme.transitions.create('opacity', { duration: theme.transitions.duration.short }) }, '& .contribution-cell:hover': { opacity: 0.68 } }}
        >
          <Box sx={{ width: 'max-content', mx: 'auto' }}>
            <svg width={width} height={height} role="img" aria-label="GitHub 贡献日历">
              {monthLabels(weeks).map(({ weekIndex, label }) => (
                <text
                  key={label + weekIndex}
                  x={weekIndex * (CELL + GAP)}
                  y={LABEL_HEIGHT - 4}
                  fill={theme.swiss.text.secondary}
                  fontSize="9"
                >
                  {label}
                </text>
              ))}
              {weeks.map((week, col) =>
                week.map((day) => {
                  const row = parseDay(day.date).getDay()
                  const level = Math.min(Math.max(day.level, 0), theme.swiss.contribution.length - 1)
                  return (
                    <rect
                      key={day.date}
                      className="contribution-cell"
                      x={col * (CELL + GAP)}
                      y={LABEL_HEIGHT + row * (CELL + GAP)}
                      width={CELL}
                      height={CELL}
                      rx={0}
                      fill={theme.swiss.contribution[level]}
                    >
                      <title>{day.count} 次贡献 · {day.date}</title>
                    </rect>
                  )
                }),
              )}
            </svg>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
              <Typography variant="caption" color="text.secondary">少</Typography>
              {theme.swiss.contribution.map((color) => (
                <Box key={color} sx={{ width: 10, height: 10, bgcolor: color }} />
              ))}
              <Typography variant="caption" color="text.secondary">多</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
