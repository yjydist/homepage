/** Placeholder for a section whose snapshot data is empty. */
export function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-line/40 bg-surface-container-low p-4 text-sm text-muted">
      <p>{message}</p>
    </div>
  )
}
