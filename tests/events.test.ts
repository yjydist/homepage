import { describe, expect, test } from 'bun:test'
import { toEventDisplay } from '../src/lib/events'
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

function sentence(
  type: string,
  payload: Record<string, unknown> = {},
): string {
  return toEventDisplay(event(type, payload)).description
}

describe('toEventDisplay', () => {
  test('counts push commits and shortens the ref', () => {
    expect(
      sentence('PushEvent', { commits: [{}, {}], ref: 'refs/heads/main' }),
    ).toBe('推送了 2 个提交到 main')
  })

  test('defaults a push without commits to one commit', () => {
    expect(sentence('PushEvent', { ref: 'refs/heads/main' })).toBe(
      '推送了 1 个提交到 main',
    )
  })

  test('describes repository creation', () => {
    expect(sentence('CreateEvent', { ref_type: 'repository' })).toBe(
      '创建了此仓库',
    )
  })

  test('describes branch creation and deletion', () => {
    expect(sentence('CreateEvent', { ref_type: 'branch', ref: 'main' })).toBe(
      '创建了branch main',
    )
    expect(sentence('DeleteEvent', { ref_type: 'branch', ref: 'main' })).toBe(
      '删除了branch main',
    )
  })

  test('describes issue actions', () => {
    expect(
      sentence('IssuesEvent', {
        action: 'opened',
        issue: { number: 1, title: '标题' },
      }),
    ).toBe('打开了 issue #1: 标题')
    expect(sentence('IssueCommentEvent', { issue: { number: 3 } })).toBe(
      '评论了 issue #3',
    )
  })

  test('reports a merged pull request as 合并了', () => {
    expect(
      sentence('PullRequestEvent', {
        action: 'closed',
        pull_request: { number: 2, title: '标题', merged: true },
      }),
    ).toBe('合并了 PR #2: 标题')
  })

  test('describes stars, forks and releases', () => {
    expect(sentence('WatchEvent')).toBe('为该仓库加了星')
    expect(sentence('ForkEvent', { forkee: { full_name: 'me/fork' } })).toBe(
      '复刻到 me/fork',
    )
    expect(sentence('ReleaseEvent', { release: { tag_name: 'v1.0.0' } })).toBe(
      '发布了 v1.0.0',
    )
  })

  test('maps known event types to icons', () => {
    expect(toEventDisplay(event('PushEvent')).icon).toBe('commit')
    expect(toEventDisplay(event('PullRequestEvent')).icon).toBe('call_merge')
  })

  test('falls back to a bolt icon and the bare type name for unknown types', () => {
    expect(toEventDisplay(event('MemberEvent'))).toEqual({
      icon: 'bolt',
      description: 'Member',
    })
  })
})
