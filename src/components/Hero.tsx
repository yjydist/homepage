import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { content } from '../content'
import { socialIcon } from '../lib/socialIcons'
import Icon from './Icon'

export default function Hero() {
  const { profile, site } = content
  return (
    <Container component="header" maxWidth="lg" sx={{ pt: { xs: 12, md: 20 }, pb: { xs: 4, md: 8 } }}>
      <Box sx={(theme) => ({ borderTop: `2px solid ${theme.swiss.text.primary}`, pt: { xs: 6, md: 10 } })}>
        <Stack spacing={6} sx={{ maxWidth: 730 }}>
          {profile.avatar && (
            <Avatar
              src={profile.avatar}
              alt={site.name}
              variant="rounded"
              sx={(theme) => ({
                width: 96,
                height: 96,
                borderRadius: 0,
                border: `1px solid ${theme.swiss.divider}`,
                bgcolor: theme.swiss.backgroundAlt,
              })}
            />
          )}
          <Box>
            <Typography component="h1" variant="h1" sx={{ overflowWrap: 'anywhere' }}>
              {site.name}
            </Typography>
            <Typography component="p" variant="subtitle1" sx={{ mt: 4, maxWidth: 620, color: 'inherit' }}>
              {profile.tagline}
            </Typography>
          </Box>
          <Stack component="ul" direction="row" useFlexGap sx={{ m: 0, p: 0, listStyle: 'none', flexWrap: 'wrap', gap: 2 }}>
            {profile.socials.map((social) => (
              <Box component="li" key={social.label}>
                <Link
                  href={social.url}
                  target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel={social.url.startsWith('mailto:') ? undefined : 'noreferrer'}
                  underline="none"
                  sx={(theme) => ({
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 2,
                    minHeight: 48,
                    color: theme.swiss.text.primary,
                    fontWeight: 500,
                    borderBottom: '2px solid transparent',
                    transition: theme.transitions.create(['color', 'border-color'], { duration: theme.transitions.duration.short }),
                    '&:hover': { color: theme.swiss.accent, borderColor: theme.swiss.accent },
                    '&:focus-visible': { outline: `2px solid ${theme.swiss.accent}`, outlineOffset: 2 },
                  })}
                >
                  <Icon name={socialIcon(social.label)} size={20} />
                  {social.label}
                </Link>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Container>
  )
}
