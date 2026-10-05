import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { content } from '../content'
import { socialIcon } from '../lib/socialIcons'
import Icon from './Icon'

export default function Footer() {
  const { site, profile } = content
  return (
    <Box component="footer" sx={(theme) => ({ borderTop: `1px solid ${theme.swiss.divider}`, bgcolor: theme.swiss.backgroundAlt })}>
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', columnGap: 6, rowGap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          © {site.year ?? new Date().getFullYear()} {site.name}
        </Typography>
        <Stack component="ul" direction="row" spacing={3} sx={{ m: 0, p: 0, listStyle: 'none', flexWrap: 'wrap' }}>
          {profile.socials.map((social) => (
            <Box component="li" key={social.label}>
              <Link
                href={social.url}
                target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                rel={social.url.startsWith('mailto:') ? undefined : 'noreferrer'}
                underline="hover"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, minHeight: 44, color: 'text.secondary', borderRadius: 2, '&:hover': { color: 'primary.main' }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}
              >
                <Icon name={socialIcon(social.label)} size={18} />
                {social.label}
              </Link>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}
