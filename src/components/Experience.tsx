import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { content } from '../content'
import { Empty } from './Empty'
import Section from './Section'

export default function Experience() {
  return (
    <Section title="经历" headingLevel="h1">
      {content.experience.length === 0 ? (
        <Empty message="暂无经历。" />
      ) : (
        <List sx={{ p: 0, m: 0 }}>
          {content.experience.map((entry) => (
            <ListItem
              key={`${entry.period}-${entry.role}`}
              sx={(theme) => ({
                px: 0,
                py: 5,
                alignItems: 'stretch',
                borderBottom: `1px solid ${theme.swiss.divider}`,
              })}
            >
              <Stack spacing={3} sx={{ width: '100%' }}>
                <Box><Chip label={entry.period} size="small" /></Box>
                <Typography component="h2" variant="h3">{entry.role}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {entry.organization}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {entry.description}
                </Typography>
              </Stack>
            </ListItem>
          ))}
        </List>
      )}
    </Section>
  )
}
