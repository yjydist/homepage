/** Shared async primitives so every page handles loading/error/empty alike. */

export function Loading() {
  return <p className="text-sm text-muted">Loading…</p>
}

export function ErrorNotice({ message }: { message: string }) {
  return <p className="text-sm text-muted">{message}</p>
}

export function Empty({ message }: { message: string }) {
  return <p className="text-sm text-muted">{message}</p>
}
