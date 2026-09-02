import { useEffect, useState } from 'react'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Run an async function with abort-on-unmount semantics. Safe under
 * StrictMode double-mounts: the first pass is aborted, and its rejection
 * never overwrites the second pass's result. `deps` behave like a normal
 * dependency array (shallow-compared via a serialized key).
 */
export function useAsync<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const key = JSON.stringify(deps)

  useEffect(() => {
    const controller = new AbortController()
    setState({ data: null, loading: true, error: null })
    fn(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: null })
        }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Something went wrong.',
        })
      })
    return () => controller.abort()
    // `key` re-runs the effect whenever a dep value changes (see above).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}
