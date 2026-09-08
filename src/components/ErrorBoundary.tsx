import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/** Shows a readable message instead of a blank page when a render throws. */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught render error', error, info)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div className="mx-auto max-w-content px-6 py-16">
        <h1 className="text-xl font-bold">页面出错了</h1>
        <p className="mt-3 text-sm text-muted">
          请刷新重试；如果问题持续，可能是 content.toml 配置有误。
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface-container-low p-4 text-xs text-muted">
          {error.message}
        </pre>
      </div>
    )
  }
}
