import Alert from '@mui/material/Alert'

export function Empty({ message }: { message: string }) {
  return (
    <Alert
      severity="info"
      role="status"
      sx={(theme) => ({
        borderRadius: 0,
        border: `1px solid ${theme.swiss.divider}`,
        bgcolor: theme.swiss.backgroundAlt,
        color: theme.swiss.text.secondary,
        '& .MuiAlert-icon': { color: theme.swiss.text.secondary },
      })}
    >
      {message}
    </Alert>
  )
}
