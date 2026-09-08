import RepoCard from '../components/RepoCard'
import Section from '../components/Section'
import { content } from '../content'
import { repoFor } from '../lib/github'
import type { CardItem } from '../lib/repos'
import { toCards } from '../lib/repos'

function RepoList({ items }: { items: CardItem[] }) {
  return (
    <ul className="grid gap-10 sm:grid-cols-2">
      {items.map(({ key, card }) => (
        <li key={key}>
          <RepoCard {...card} />
        </li>
      ))}
    </ul>
  )
}

export default function ReposPage() {
  return (
    <Section title="仓库">
      <RepoList items={toCards(content.repos, repoFor)} />
    </Section>
  )
}
