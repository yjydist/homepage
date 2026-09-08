import type { GitHubEvent } from './github'

// Payload fields are loosely typed, so reads go through small guards.
function str(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function num(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

// Narrow an unknown payload field to a nested object, else undefined.
function obj(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : undefined
}

function shortRef(ref: string): string {
  return ref.replace(/^refs\/heads\//, '')
}

// Translate the English action verbs GitHub sends into Chinese verbs.
// Issues and pull requests share the same action vocabulary.
function actionVerb(action: string | undefined): string {
  switch (action) {
    case 'opened':
      return '打开'
    case 'closed':
      return '关闭'
    case 'reopened':
      return '重新打开'
    default:
      return '更新'
  }
}

/** Maps a GitHub event type to a Material Symbols ligature name. */
export function eventIcon(type: string): string {
  switch (type) {
    case 'PushEvent':
      return 'commit'
    case 'CreateEvent':
      return 'add_circle'
    case 'DeleteEvent':
      return 'delete'
    case 'IssuesEvent':
      return 'report'
    case 'IssueCommentEvent':
      return 'mode_comment'
    case 'PullRequestEvent':
      return 'call_merge'
    case 'PullRequestReviewEvent':
      return 'rate_review'
    case 'ForkEvent':
      return 'fork_right'
    case 'WatchEvent':
      return 'star'
    case 'ReleaseEvent':
      return 'local_offer'
    case 'PublicEvent':
      return 'public'
    default:
      return 'bolt'
  }
}

/** Renders one GitHub event as a short Chinese sentence. */
export function describeEvent(event: GitHubEvent): string {
  const { payload } = event
  switch (event.type) {
    case 'PushEvent': {
      const commits = Array.isArray(payload.commits)
        ? payload.commits.length
        : 1
      const ref = str(payload.ref)
      return `推送了 ${commits} 个提交${ref ? `到 ${shortRef(ref)}` : ''}`
    }
    case 'CreateEvent': {
      const refType = str(payload.ref_type) ?? 'ref'
      const ref = str(payload.ref)
      return refType === 'repository' ? '创建了此仓库' : `创建了${refType} ${ref ?? ''}`
    }
    case 'DeleteEvent':
      return `删除了${str(payload.ref_type) ?? 'ref'} ${str(payload.ref) ?? ''}`
    case 'IssuesEvent': {
      const issue = obj(payload.issue)
      return `${actionVerb(str(payload.action))}了 issue #${num(issue?.number) ?? ''}: ${str(issue?.title) ?? ''}`
    }
    case 'IssueCommentEvent': {
      const issue = obj(payload.issue)
      return `评论了 issue #${num(issue?.number) ?? ''}`
    }
    case 'PullRequestEvent': {
      const pr = obj(payload.pull_request)
      const action =
        payload.action === 'closed' && pr?.merged === true
          ? '合并了'
          : actionVerb(str(payload.action))
      return `${action} PR #${num(pr?.number) ?? ''}: ${str(pr?.title) ?? ''}`
    }
    case 'PullRequestReviewEvent':
      return `评审了一个拉取请求`
    case 'ForkEvent':
      return `复刻到 ${str(obj(payload.forkee)?.full_name) ?? '一个新仓库'}`
    case 'WatchEvent':
      return '为该仓库加了星'
    case 'ReleaseEvent':
      return `发布了 ${str(obj(payload.release)?.tag_name) ?? '一个版本'}`
    case 'PublicEvent':
      return '公开了一个仓库'
    default:
      return `${event.type.replace(/Event$/, '')}`
  }
}
