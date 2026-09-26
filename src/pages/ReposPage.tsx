import Box from '@mui/material/Box'
import RepoCard from '../components/RepoCard'
import Section from '../components/Section'
import { Empty } from '../components/Empty'
import { content } from '../content'
import { repoFor } from '../lib/github'
import type { CardItem } from '../lib/repos'
import { toCards } from '../lib/repos'

function RepoList({ items }: { items: CardItem[] }) {
  if (items.length === 0) return <Empty message="暂无仓库。" />
  return (
    <Box component="ul" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 6, m: 0, p: 0, listStyle: 'none' }}>
      {items.map(({ key, card }) => (
        <li key={key}>
          <RepoCard {...card} />
        </li>
      ))}
    </Box>
  )
}

export default function ReposPage() {
  return (
    <Section title="仓库" headingLevel="h1">
      <RepoList items={toCards(content.repos, repoFor)} />
    </Section>
  )
}
