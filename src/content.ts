import { parse } from 'toml'
import raw from '../content.toml?raw'

export interface SiteConfig {
  title: string
  meta_description: string
  name: string
  /** Footer copyright year; falls back to the current year when omitted. */
  year?: number
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

const parsed = parse(raw) as Partial<Content>

// Optional tables and arrays must never crash a page: omitted [[repos]],
// [[profile.socials]] and [[experience]] normalize to empty/defaults.
export const content: Content = {
  ...(parsed as Content),
  profile: {
    tagline: '',
    bio: '',
    avatar: '',
    ...parsed.profile,
    socials: parsed.profile?.socials ?? [],
  },
  repos: parsed.repos ?? [],
  experience: parsed.experience ?? [],
}
