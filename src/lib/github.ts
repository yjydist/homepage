import raw from '../generated/github-data.json'
import type {
  ContributionDay,
  GitHubData,
  GitHubEvent,
  GitHubRepo,
} from './githubSnapshot'

export type { ContributionDay, GitHubData, GitHubEvent, GitHubRepo }

const data = raw as GitHubData

/** Snapshot metadata for one `mode = "github"` entry. */
export function repoFor(fullName: string): GitHubRepo | undefined {
  return data.repos[fullName]
}

export function publicEvents(): GitHubEvent[] {
  return data.events
}

export function contributionDays(): ContributionDay[] {
  return data.contributions
}
