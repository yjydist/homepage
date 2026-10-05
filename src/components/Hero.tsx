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
      <Box
        sx={(theme) => ({
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: 7, md: 10 },
          bgcolor: theme.swiss.accent,
          color: '#FFFFFF',
          p: { xs: 7, sm: 10, md: 14 },
        })}
      >
        <Box
          aria-hidden="true"
          sx={(theme) => ({
            position: 'absolute',
            top: { xs: -66, md: -100 },
            right: { xs: -92, md: -76 },
            width: { xs: 190, md: 280 },
            height: { xs: 190, md: 280 },
            borderRadius: '40%',
            transform: 'rotate(24deg)',
            bgcolor: theme.swiss.accent,
            opacity: 0.85,
            pointerEvents: 'none',
          })}
        />
        <Stack spacing={6} sx={{ position: 'relative', zIndex: 1, maxWidth: 730 }}>
          {profile.avatar && (
            <Avatar
              src={profile.avatar}
              alt={site.name}
              variant="rounded"
              sx={(theme) => ({
                width: 96,
                height: 96,
                borderRadius: 8,
                border: `3px solid ${theme.swiss.background}`,
                bgcolor: theme.swiss.backgroundAlt,
                boxShadow: theme.shadows[2],
                animation: 'hero-appear 500ms cubic-bezier(0.05, 0.7, 0.1, 1) both',
                transition: theme.transitions.create('transform', { duration: theme.transitions.duration.standard, easing: theme.transitions.easing.easeOut }),
                '&:hover': { transform: 'scale(1.05)' },
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
                    px: 4,
                    borderRadius: 99,
                    bgcolor: theme.swiss.background,
                    color: theme.swiss.accent,
                    fontWeight: 700,
                    transition: theme.transitions.create(['background-color', 'transform'], { duration: theme.transitions.duration.short, easing: theme.transitions.easing.easeOut }),
                    '&:hover': { bgcolor: theme.swiss.accent, color: '#FFFFFF', transform: 'translateY(-2px)' },
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
