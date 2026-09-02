/** Render an ISO timestamp as a short relative time, e.g. "3h ago". */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000))
  const units: Array<[number, string]> = [
    [60 * 60 * 24 * 30, 'mo'],
    [60 * 60 * 24, 'd'],
    [60 * 60, 'h'],
    [60, 'm'],
  ]
  for (const [span, unit] of units) {
    if (seconds >= span) return `${Math.floor(seconds / span)}${unit} ago`
  }
  return 'just now'
}
