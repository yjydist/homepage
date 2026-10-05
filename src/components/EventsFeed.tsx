import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { toEventDisplay } from '../lib/events'
import { publicEvents } from '../lib/github'
import { timeAgo } from '../lib/time'
import { Empty } from './Empty'
import Icon from './Icon'

export default function EventsFeed() {
  const events = publicEvents()
  if (events.length === 0) return <Empty message="暂无公开动态。" />

  return (
    <List sx={{ display: 'grid', gap: 3, p: 0 }}>
      {events.map((event) => {
        const { icon, description } = toEventDisplay(event)
        return (
          <ListItem
            key={event.id}
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'flex-start',
              gap: 3,
              p: 5,
              borderRadius: 6,
              bgcolor: theme.swiss.backgroundAlt,
              border: `1px solid ${theme.swiss.divider}`,
            })}
          >
            <Box sx={(theme) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 4, flexShrink: 0, bgcolor: theme.swiss.accent, color: '#FFFFFF' })}>
              <Icon name={icon} size={22} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body1" component="p" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                {description}{' '}
                <Typography component="span" variant="body1" color="text.secondary">
                  在{' '}
                  <Link
                    href={`https://github.com/${event.repo.name}`}
                    target="_blank"
                    rel="noreferrer"
                    underline="always"
                    sx={{ color: 'primary.main', borderRadius: 1, overflowWrap: 'anywhere', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}
                  >
                    {event.repo.name}
                  </Link>
                </Typography>
              </Typography>
              <Typography component="time" dateTime={event.created_at} variant="caption" color="text.secondary" sx={{ flexShrink: 0, pt: 1 }}>
                {timeAgo(event.created_at)}
              </Typography>
            </Box>
          </ListItem>
        )
      })}
    </List>
  )
}
