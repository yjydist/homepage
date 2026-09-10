/**
 * Refresh the committed GitHub snapshot that the site renders from. Run
 * by `.github/workflows/refresh-github-data.yml` with a GITHUB_TOKEN; the
 * browser never talks to the API itself, so the 60 req/hr/IP anonymous
 * limit cannot break the pages.
 *
 * Any failed request aborts the run without touching the existing file,
 * so a bad upstream leaves the site on the last good snapshot.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'toml'
import type { Content } from '../src/content'
import { pickEvent, pickRepo } from '../src/lib/githubSnapshot'
import type {
  ContributionDay,
  GitHubData,
  GitHubEvent,
  GitHubRepo,
} from '../src/lib/githubSnapshot'
import { usesGitHub } from '../src/lib/repos'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT_PATH = resolve(ROOT, 'content.toml')
const SNAPSHOT_PATH = resolve(ROOT, 'src/generated/github-data.json')

const API = 'https://api.github.com'
const CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de/v4'

interface ContributionsResponse {
  contributions: ContributionDay[]
}

async function fetchGitHub<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  if (!res.ok) {
    throw new Error(`GitHub ${path} failed (${res.status} ${res.statusText}).`)
  }
  return (await res.json()) as T
}

// Third-party service, no token: it does not count against the GitHub limit.
async function fetchContributions(
  username: string,
): Promise<ContributionDay[]> {
  const url = `${CONTRIBUTIONS_API}/${encodeURIComponent(username)}?y=last`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Contributions request failed (${res.status}).`)
  }
  const body = (await res.json()) as ContributionsResponse
  return body.contributions
}

/** Write only when the bytes change, so an unchanged run leaves no diff. */
async function writeIfChanged(contents: string): Promise<boolean> {
  let previous: string | undefined
  try {
    previous = await readFile(SNAPSHOT_PATH, 'utf8')
  } catch {
    // First run: the snapshot does not exist yet.
  }
  if (previous === contents) return false
  await mkdir(dirname(SNAPSHOT_PATH), { recursive: true })
  await writeFile(SNAPSHOT_PATH, contents)
  return true
}

async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error('GITHUB_TOKEN is not set (locally: `gh auth token`).')
  }

  const parsed = parse(await readFile(CONTENT_PATH, 'utf8')) as Partial<Content>
  const username = parsed.github?.username
  if (!username) {
    throw new Error('content.toml is missing [github].username.')
  }

  const repos: Record<string, GitHubRepo> = {}
  for (const entry of (parsed.repos ?? []).filter(usesGitHub)) {
    repos[entry.repo] = pickRepo(
      await fetchGitHub<GitHubRepo>(`/repos/${entry.repo}`, token),
    )
  }

  const events = (
    await fetchGitHub<GitHubEvent[]>(
      `/users/${encodeURIComponent(username)}/events/public?per_page=6`,
      token,
    )
  ).map(pickEvent)
  const contributions = await fetchContributions(username)

  const data: GitHubData = { repos, events, contributions }
  const written = await writeIfChanged(`${JSON.stringify(data, null, 2)}\n`)
  console.log(written ? `Wrote ${SNAPSHOT_PATH}` : 'Snapshot unchanged.')
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
