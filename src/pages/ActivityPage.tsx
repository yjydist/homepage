import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import ContributionsCalendar from '../components/ContributionsCalendar'
import EventsFeed from '../components/EventsFeed'
import Icon from '../components/Icon'
import Section from '../components/Section'

function SubSection({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <Box component="section">
      <Typography component="h2" variant="h3" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Icon name={icon} size={23} sx={{ color: 'primary.main' }} />
        {title}
      </Typography>
      {children}
    </Box>
  )
}

export default function ActivityPage() {
  return (
    <Section title="动态" headingLevel="h1">
      <Stack spacing={12}>
        <SubSection icon="grid_on" title="贡献日历"><ContributionsCalendar /></SubSection>
        <SubSection icon="history" title="最近动态"><EventsFeed /></SubSection>
      </Stack>
    </Section>
  )
}
