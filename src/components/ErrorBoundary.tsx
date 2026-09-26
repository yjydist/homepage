import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
      <Container maxWidth="lg" sx={{ py: 16 }}>
        <Alert
          severity="error"
          sx={(theme) => ({
            borderRadius: 6,
            bgcolor: theme.m3.surfaceContainerLow,
            color: theme.m3.onSurface,
            border: `1px solid ${theme.m3.error}`,
            '& .MuiAlert-icon': { color: theme.m3.error },
          })}
        >
          <AlertTitle component="h1" sx={{ fontWeight: 700 }}>页面出错了</AlertTitle>
          请刷新重试；如果问题持续，可能是 content.toml 配置有误。
          <Box component="pre" sx={(theme) => ({ mt: 4, mb: 0, p: 4, overflowX: 'auto', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', borderRadius: 3, bgcolor: theme.m3.surfaceContainer, color: theme.m3.onSurfaceVariant })}>
            {error.message}
          </Box>
        </Alert>
      </Container>
    )
  }
}
