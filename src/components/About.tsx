import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { content } from '../content'
import Section from './Section'

export default function About() {
  const paragraphs = content.profile.bio
    .trim()
    .split(/\n\s*\n/)
    .filter((text) => text.trim() !== '')

  return (
    <Section title="关于">
      <Box
        sx={(theme) => ({
          maxWidth: 800,
          p: { xs: 6, sm: 8 },
          borderRadius: 7,
          borderLeft: `4px solid ${theme.m3.tertiary}`,
          bgcolor: theme.m3.surfaceContainerLow,
        })}
      >
        <Stack spacing={5}>
          {paragraphs.map((text, i) => (
            <Typography key={i} variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {text}
            </Typography>
          ))}
        </Stack>
      </Box>
    </Section>
  )
}
