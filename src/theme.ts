import { createTheme } from '@mui/material/styles'

export interface SwissTokens {
  text: { primary: string; secondary: string }
  background: string
  backgroundAlt: string
  divider: string
  controlBorder: string
  accent: string
  error: string
  contribution: readonly string[]
}

export const swissTokens: SwissTokens = {
  text: { primary: '#111111', secondary: '#595959' },
  background: '#FFFFFF',
  backgroundAlt: '#F5F5F2',
  divider: '#D9D9D6',
  controlBorder: '#595959',
  accent: '#E10600',
  error: '#B3261E',
  contribution: ['#EDEDEA', '#F6C4BE', '#EE8A80', '#E33B2E', '#9E0B00'],
}

declare module '@mui/material/styles' {
  interface Theme {
    swiss: SwissTokens
  }
  interface ThemeOptions {
    swiss?: SwissTokens
  }
}

export const theme = createTheme({
  swiss: swissTokens,
  palette: {
    mode: 'light',
    primary: { main: swissTokens.accent, contrastText: '#FFFFFF' },
    error: { main: swissTokens.error, contrastText: '#FFFFFF' },
    background: { default: swissTokens.background, paper: swissTokens.background },
    text: { primary: swissTokens.text.primary, secondary: swissTokens.text.secondary },
    divider: swissTokens.divider,
  },
  spacing: 4,
  breakpoints: { values: { xs: 0, sm: 600, md: 840, lg: 1200, xl: 1536 } },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: '"Alimama FangYuanTi VF", sans-serif',
    h1: {
      fontSize: 'clamp(2.5rem, 6vw, 4rem)',
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: '-0.015em',
    },
    h2: { fontSize: 'clamp(2rem, 1.6rem + 1.6vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2 },
    h3: { fontSize: 'clamp(1.25rem, 1.05rem + 1vw, 1.75rem)', fontWeight: 500, lineHeight: 1.3 },
    subtitle1: { fontSize: '1.125rem', lineHeight: 1.7, fontWeight: 400 },
    body1: { fontSize: '1rem', lineHeight: 1.8 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    caption: { fontSize: '0.75rem', lineHeight: 1.5 },
    button: { fontWeight: 500, textTransform: 'none', letterSpacing: 0 },
  },
  transitions: {
    duration: { shortest: 100, shorter: 150, short: 200, standard: 300, complex: 400, enteringScreen: 350, leavingScreen: 200 },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          '@media (min-width:600px)': { paddingLeft: 32, paddingRight: 32 },
          '@media (min-width:840px)': { paddingLeft: 48, paddingRight: 48 },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: swissTokens.background, color: swissTokens.text.primary },
        '::selection': { backgroundColor: swissTokens.accent, color: '#FFFFFF' },
      },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 0, boxShadow: 'none', backgroundColor: swissTokens.background } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 0, backgroundColor: swissTokens.backgroundAlt, color: swissTokens.text.secondary } },
    },
  },
})
