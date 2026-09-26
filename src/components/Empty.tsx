import Alert from '@mui/material/Alert'

export function Empty({ message }: { message: string }) {
  return (
    <Alert
      severity="info"
      role="status"
      sx={(theme) => ({
        borderRadius: 5,
        border: `1px solid ${theme.m3.outlineVariant}`,
        bgcolor: theme.m3.surfaceContainerLow,
        color: theme.m3.onSurfaceVariant,
        '& .MuiAlert-icon': { color: theme.m3.primary },
      })}
    >
      {message}
    </Alert>
  )
}
