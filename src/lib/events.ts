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

/** How one GitHub event type is presented: its icon and its sentence. */
interface EventPresentation {
  icon: string
  describe: (payload: Record<string, unknown>) => string
}

// One row per event type. The icon and the sentence change together, so
// supporting a new type means adding one entry here. Types GitHub adds
// later are absent, so a lookup can miss.
const EVENT_PRESENTATIONS: Record<string, EventPresentation | undefined> = {
  PushEvent: {
    icon: 'commit',
    describe: (payload) => {
      const commits = Array.isArray(payload.commits)
        ? payload.commits.length
        : 1
      const ref = str(payload.ref)
      return `推送了 ${commits} 个提交${ref ? `到 ${shortRef(ref)}` : ''}`
    },
  },
  CreateEvent: {
    icon: 'add_circle',
    describe: (payload) => {
      const refType = str(payload.ref_type) ?? 'ref'
      const ref = str(payload.ref)
      return refType === 'repository' ? '创建了此仓库' : `创建了${refType} ${ref ?? ''}`
    },
  },
  DeleteEvent: {
    icon: 'delete',
    describe: (payload) =>
      `删除了${str(payload.ref_type) ?? 'ref'} ${str(payload.ref) ?? ''}`,
  },
  IssuesEvent: {
    icon: 'report',
    describe: (payload) => {
      const issue = obj(payload.issue)
      return `${actionVerb(str(payload.action))}了 issue #${num(issue?.number) ?? ''}: ${str(issue?.title) ?? ''}`
    },
  },
  IssueCommentEvent: {
    icon: 'mode_comment',
    describe: (payload) => {
      const issue = obj(payload.issue)
      return `评论了 issue #${num(issue?.number) ?? ''}`
    },
  },
  PullRequestEvent: {
    icon: 'call_merge',
    describe: (payload) => {
      const pr = obj(payload.pull_request)
      const action =
        payload.action === 'closed' && pr?.merged === true
          ? '合并了'
          : actionVerb(str(payload.action))
      return `${action} PR #${num(pr?.number) ?? ''}: ${str(pr?.title) ?? ''}`
    },
  },
  PullRequestReviewEvent: {
    icon: 'rate_review',
    describe: () => '评审了一个拉取请求',
  },
  ForkEvent: {
    icon: 'fork_right',
    describe: (payload) =>
      `复刻到 ${str(obj(payload.forkee)?.full_name) ?? '一个新仓库'}`,
  },
  WatchEvent: {
    icon: 'star',
    describe: () => '为该仓库加了星',
  },
  ReleaseEvent: {
    icon: 'local_offer',
    describe: (payload) =>
      `发布了 ${str(obj(payload.release)?.tag_name) ?? '一个版本'}`,
  },
  PublicEvent: {
    icon: 'public',
    describe: () => '公开了一个仓库',
  },
}

/** What EventsFeed renders: the icon name and the sentence, nothing else. */
export interface EventDisplay {
  icon: string
  description: string
}

/**
 * Resolves one GitHub event to its icon name and Chinese sentence. Unknown
 * types keep the generic bolt icon and their bare type name.
 */
export function toEventDisplay(event: GitHubEvent): EventDisplay {
  const presentation = EVENT_PRESENTATIONS[event.type]
  return presentation
    ? {
        icon: presentation.icon,
        description: presentation.describe(event.payload),
      }
    : { icon: 'bolt', description: event.type.replace(/Event$/, '') }
}
