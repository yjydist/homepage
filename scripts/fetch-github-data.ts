/**
 * Refresh the committed GitHub snapshot that the site falls back to. Run
 * manually with a GITHUB_TOKEN; at runtime the browser fetches live data
 * anonymously and only uses this snapshot for the first render and when
 * any live request fails.
 *
 * Any failed request aborts the run without touching the existing file,
 * so a bad upstream leaves the site on the last good snapshot.
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { content, usesGitHub } from '../src/content'
import { fetchGitHubData } from '../src/lib/githubData'
import type { GitHubData } from '../src/lib/githubData'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SNAPSHOT_PATH = resolve(ROOT, 'src/generated/github-data.json')

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

  // content.ts types github.username as required, but a missing [github]
  // table in content.toml still slips through, so guard at runtime.
  const username = content.github?.username
  if (!username) {
    throw new Error('content.toml is missing [github].username.')
  }

  const data: GitHubData = await fetchGitHubData(
    username,
    content.repos.filter(usesGitHub).map((e) => e.repo),
    { token },
  )
  const written = await writeIfChanged(`${JSON.stringify(data, null, 2)}\n`)
  console.log(written ? `Wrote ${SNAPSHOT_PATH}` : 'Snapshot unchanged.')
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
