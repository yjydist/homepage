import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import type { CardData } from '../lib/repos'
import { timeAgo } from '../lib/time'
import Icon from './Icon'

function CardContent({ name, description, tags, meta }: Pick<CardData, 'name' | 'description' | 'tags'> & { meta: Array<{ icon: string; text: string }> }) {
  return (
    <Stack sx={{ width: '100%', height: '100%', justifyContent: 'space-between', gap: 6 }}>
      <Box>
        <Typography component="h2" variant="h3" sx={{ overflowWrap: 'anywhere' }}>
          {name}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
            {description}
          </Typography>
        )}
      </Box>
      {(tags.length > 0 || meta.length > 0) && (
        <Stack sx={{ gap: 3 }}>
          {tags.length > 0 && (
            <Box component="ul" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, m: 0, p: 0, listStyle: 'none' }}>
              {tags.map((tag) => (
                <Box component="li" key={tag}>
                  <Chip label={tag} size="small" />
                </Box>
              ))}
            </Box>
          )}
          {meta.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 4, rowGap: 2, color: 'text.secondary' }}>
              {meta.map(({ icon, text }) => (
                <Typography component="span" variant="caption" key={icon} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                  <Icon name={icon} size={17} />
                  {text}
                </Typography>
              ))}
            </Box>
          )}
        </Stack>
      )}
    </Stack>
  )
}

export default function RepoCard({ name, url, description, stars, language, tags, updatedAt }: CardData) {
  const meta: Array<{ icon: string; text: string }> = []
  if (stars !== null) meta.push({ icon: 'star', text: String(stars) })
  if (language) meta.push({ icon: 'code', text: language })
  if (updatedAt) meta.push({ icon: 'schedule', text: `${timeAgo(updatedAt)}更新` })

  const content: ReactNode = <CardContent name={name} description={description} tags={tags} meta={meta} />

  return (
    <Card
      component="article"
      sx={(theme) => ({
        height: '100%',
        minHeight: { xs: 168, sm: 200 },
        border: `1px solid ${theme.swiss.divider}`,
        transition: theme.transitions.create(['background-color', 'border-color', 'transform'], { duration: theme.transitions.duration.standard, easing: theme.transitions.easing.easeOut }),
        ...(url && {
          '&:hover': { bgcolor: theme.swiss.backgroundAlt, borderColor: theme.swiss.accent, transform: 'translateY(-3px)' },
          '&:hover h2': { color: theme.swiss.accent },
        }),
      })}
    >
      {url ? (
        <CardActionArea
          component="a"
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={`打开仓库 ${name}`}
          sx={(theme) => ({
            p: 6,
            height: '100%',
            display: 'flex',
            alignItems: 'stretch',
            textAlign: 'left',
            '&.Mui-focusVisible': { outline: `2px solid ${theme.swiss.accent}`, outlineOffset: -3 },
          })}
        >
          {content}
        </CardActionArea>
      ) : (
        <Box sx={{ p: 6, height: '100%' }}>{content}</Box>
      )}
    </Card>
  )
}
