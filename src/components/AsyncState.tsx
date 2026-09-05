/** Shared async primitives so every page handles loading/error/empty alike. */

export function Loading() {
  return (
    <div
      role="status"
      aria-label="加载中"
      className="flex items-center gap-3 py-4 text-sm text-muted"
    >
      <svg
        className="size-5 animate-spin text-accent"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2.5"
          className="opacity-20"
        />
        <path
          d="M12 3a9 9 0 0 1 9 9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span>加载中…</span>
    </div>
  )
}

export function ErrorNotice({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-4 text-sm text-muted"
    >
      <p>{message}</p>
    </div>
  )
}

export function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-4 text-sm text-muted">
      <p>{message}</p>
    </div>
  )
}
