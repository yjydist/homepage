/** Render an ISO timestamp as a short relative time, e.g. "3 个月前". */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000))
  const units: Array<[span: number, label: string]> = [
    [60 * 60 * 24 * 30, '个月前'],
    [60 * 60 * 24, '天前'],
    [60 * 60, '小时前'],
    [60, '分钟前'],
  ]
  for (const [span, label] of units) {
    if (seconds >= span) return `${Math.floor(seconds / span)} ${label}`
  }
  return '刚刚'
}
