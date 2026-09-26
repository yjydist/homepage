import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

interface SectionProps {
  title: string
  children: ReactNode
  headingLevel?: 'h1' | 'h2'
}

export default function Section({ title, children, headingLevel = 'h2' }: SectionProps) {
  return (
    <Container component="section" maxWidth="lg" sx={{ py: { xs: 12, md: 16 } }}>
      <Typography component={headingLevel} variant="h2" sx={{ mb: 8 }}>
        {title}
      </Typography>
      {children}
    </Container>
  )
}
