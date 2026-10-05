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
      <Stack spacing={5} sx={{ maxWidth: '46rem' }}>
        {paragraphs.map((text, i) => (
          <Typography key={i} variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {text}
          </Typography>
        ))}
      </Stack>
    </Section>
  )
}
