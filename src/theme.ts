import {
  DynamicScheme,
  Hct,
  SchemeExpressive,
  TonalPalette,
  Variant,
  argbFromHex,
  hexFromArgb,
} from '@material/material-color-utilities'
import { createTheme } from '@mui/material/styles'

const primarySeed = argbFromHex('#7C4DFF')
const tertiarySeed = argbFromHex('#F36D3F')
const primaryHct = Hct.fromInt(primarySeed)
const expressive = new SchemeExpressive(primaryHct, false, 0, '2025')

// Keep the supplied brand hues while retaining the 2025 Expressive neutral
// palettes and dynamic role contrast calculations.
const scheme = new DynamicScheme({
  sourceColorHct: primaryHct,
  variant: Variant.EXPRESSIVE,
  isDark: false,
  contrastLevel: 0,
  specVersion: '2025',
  primaryPalette: TonalPalette.fromInt(primarySeed),
  secondaryPalette: TonalPalette.fromHueAndChroma(primaryHct.hue, 24),
  tertiaryPalette: TonalPalette.fromInt(tertiarySeed),
  neutralPalette: expressive.neutralPalette,
  neutralVariantPalette: expressive.neutralVariantPalette,
})

export interface M3Roles {
  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
  secondary: string
  onSecondary: string
  secondaryContainer: string
  onSecondaryContainer: string
  tertiary: string
  onTertiary: string
  tertiaryContainer: string
  onTertiaryContainer: string
  surface: string
  onSurface: string
  onSurfaceVariant: string
  surfaceContainerLow: string
  surfaceContainer: string
  surfaceContainerHigh: string
  outline: string
  outlineVariant: string
  error: string
  onError: string
  contribution: readonly string[]
}

const color = (argb: number) => hexFromArgb(argb)

export const m3Roles: M3Roles = {
  primary: color(scheme.primary),
  onPrimary: color(scheme.onPrimary),
  primaryContainer: color(scheme.primaryContainer),
  onPrimaryContainer: color(scheme.onPrimaryContainer),
  secondary: color(scheme.secondary),
  onSecondary: color(scheme.onSecondary),
  secondaryContainer: color(scheme.secondaryContainer),
  onSecondaryContainer: color(scheme.onSecondaryContainer),
  tertiary: color(scheme.tertiary),
  onTertiary: color(scheme.onTertiary),
  tertiaryContainer: color(scheme.tertiaryContainer),
  onTertiaryContainer: color(scheme.onTertiaryContainer),
  surface: color(scheme.surface),
  onSurface: color(scheme.onSurface),
  onSurfaceVariant: color(scheme.onSurfaceVariant),
  surfaceContainerLow: color(scheme.surfaceContainerLow),
  surfaceContainer: color(scheme.surfaceContainer),
  surfaceContainerHigh: color(scheme.surfaceContainerHigh),
  outline: color(scheme.outline),
  outlineVariant: color(scheme.outlineVariant),
  error: color(scheme.error),
  onError: color(scheme.onError),
  contribution: [
    color(scheme.surfaceContainerHigh),
    color(scheme.primaryPalette.tone(90)),
    color(scheme.primaryPalette.tone(75)),
    color(scheme.primaryPalette.tone(55)),
    color(scheme.primaryPalette.tone(35)),
  ],
}

declare module '@mui/material/styles' {
  interface Theme {
    m3: M3Roles
  }
  interface ThemeOptions {
    m3?: M3Roles
  }
}

export const theme = createTheme({
  m3: m3Roles,
  palette: {
    mode: 'light',
    primary: { main: m3Roles.primary, contrastText: m3Roles.onPrimary },
    secondary: { main: m3Roles.secondary, contrastText: m3Roles.onSecondary },
    error: { main: m3Roles.error, contrastText: m3Roles.onError },
    background: { default: m3Roles.surface, paper: m3Roles.surfaceContainerLow },
    text: { primary: m3Roles.onSurface, secondary: m3Roles.onSurfaceVariant },
    divider: m3Roles.outlineVariant,
  },
  spacing: 4,
  breakpoints: { values: { xs: 0, sm: 600, md: 840, lg: 1200, xl: 1536 } },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: '"Google Sans Flex Variable", "Noto Sans SC", sans-serif',
    h1: {
      fontSize: 'clamp(2.5rem, 6vw, 4rem)',
      fontWeight: 750,
      lineHeight: 1.16,
      letterSpacing: '-0.04em',
      fontVariationSettings: '"wdth" 105, "opsz" 48',
    },
    h2: { fontSize: '2rem', fontWeight: 720, lineHeight: 1.3, letterSpacing: '-0.025em' },
    h3: { fontSize: '1.25rem', fontWeight: 680, lineHeight: 1.4 },
    subtitle1: { fontSize: '1.125rem', lineHeight: 1.65, fontWeight: 520 },
    body1: { fontSize: '1rem', lineHeight: 1.8 },
    body2: { fontSize: '0.875rem', lineHeight: 1.7 },
    caption: { fontSize: '0.75rem', lineHeight: 1.5 },
    button: { fontWeight: 680, textTransform: 'none', letterSpacing: 0 },
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.2, 0, 0, 1)',
      easeOut: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
      easeIn: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
      sharp: 'cubic-bezier(0.2, 0, 0, 1)',
    },
    duration: { shortest: 100, shorter: 150, short: 200, standard: 300, complex: 400, enteringScreen: 350, leavingScreen: 200 },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: { paddingLeft: 24, paddingRight: 24 },
        maxWidthLg: { '@media (min-width:1200px)': { maxWidth: 1024 } },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: m3Roles.surface, color: m3Roles.onSurface },
        '::selection': { backgroundColor: m3Roles.primaryContainer, color: m3Roles.onPrimaryContainer },
      },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 28, boxShadow: 'none', backgroundColor: m3Roles.surfaceContainerLow } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 12, backgroundColor: m3Roles.secondaryContainer, color: m3Roles.onSecondaryContainer } },
    },
  },
})
