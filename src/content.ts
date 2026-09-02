import { parse } from 'toml'
import raw from '../content.toml?raw'

export interface SiteConfig {
  title: string
  meta_description: string
  name: string
  year: number
}

export interface Social {
  label: string
  url: string
}

export interface Profile {
  tagline: string
  bio: string
  avatar: string
  socials: Social[]
}

export interface GithubConfig {
  username: string
}

export type RepoMode = 'github' | 'custom'

export interface RepoEntry {
  mode: RepoMode
  // Shorthand source for fetched modes, e.g. "owner/name" for github.
  repo?: string
  // Manual fields; also act as overrides on top of fetched data.
  name?: string
  url?: string
  description?: string
  tags?: string[]
  pinned?: boolean
  order?: number
}

export interface ExperienceEntry {
  period: string
  role: string
  organization: string
  description: string
}

export interface Content {
  site: SiteConfig
  profile: Profile
  github: GithubConfig
  repos: RepoEntry[]
  experience: ExperienceEntry[]
}

const parsed = parse(raw) as Content

// An omitted [[repos]] table must never crash the repos page.
export const content: Content = { ...parsed, repos: parsed.repos ?? [] }
