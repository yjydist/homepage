import { describe, expect, test } from 'bun:test'
import { describeEvent, eventIcon } from '../src/lib/events'
import type { GitHubEvent } from '../src/lib/github'

function event(
  type: string,
  payload: Record<string, unknown> = {},
): GitHubEvent {
  return {
    id: '1',
    type,
    created_at: '2024-01-01T00:00:00Z',
    repo: { name: 'owner/name' },
    payload,
  }
}

describe('describeEvent', () => {
  test('counts push commits and shortens the ref', () => {
    expect(
      describeEvent(
        event('PushEvent', { commits: [{}, {}], ref: 'refs/heads/main' }),
      ),
    ).toBe('推送了 2 个提交到 main')
  })

  test('defaults a push without commits to one commit', () => {
    expect(describeEvent(event('PushEvent', { ref: 'refs/heads/main' }))).toBe(
      '推送了 1 个提交到 main',
    )
  })

  test('describes repository creation', () => {
    expect(describeEvent(event('CreateEvent', { ref_type: 'repository' }))).toBe(
      '创建了此仓库',
    )
  })

  test('describes branch creation and deletion', () => {
    expect(
      describeEvent(event('CreateEvent', { ref_type: 'branch', ref: 'main' })),
    ).toBe('创建了branch main')
    expect(
      describeEvent(event('DeleteEvent', { ref_type: 'branch', ref: 'main' })),
    ).toBe('删除了branch main')
  })

  test('describes issue actions', () => {
    expect(
      describeEvent(
        event('IssuesEvent', {
          action: 'opened',
          issue: { number: 1, title: '标题' },
        }),
      ),
    ).toBe('打开了 issue #1: 标题')
    expect(
      describeEvent(event('IssueCommentEvent', { issue: { number: 3 } })),
    ).toBe('评论了 issue #3')
  })

  test('reports a merged pull request as 合并了', () => {
    expect(
      describeEvent(
        event('PullRequestEvent', {
          action: 'closed',
          pull_request: { number: 2, title: '标题', merged: true },
        }),
      ),
    ).toBe('合并了 PR #2: 标题')
  })

  test('describes stars, forks and releases', () => {
    expect(describeEvent(event('WatchEvent'))).toBe('为该仓库加了星')
    expect(
      describeEvent(event('ForkEvent', { forkee: { full_name: 'me/fork' } })),
    ).toBe('复刻到 me/fork')
    expect(
      describeEvent(event('ReleaseEvent', { release: { tag_name: 'v1.0.0' } })),
    ).toBe('发布了 v1.0.0')
  })

  test('strips the Event suffix for unknown types', () => {
    expect(describeEvent(event('MemberEvent'))).toBe('Member')
  })
})

describe('eventIcon', () => {
  test('maps known event types', () => {
    expect(eventIcon('PushEvent')).toBe('commit')
    expect(eventIcon('PullRequestEvent')).toBe('call_merge')
  })

  test('falls back to bolt', () => {
    expect(eventIcon('MemberEvent')).toBe('bolt')
  })
})
