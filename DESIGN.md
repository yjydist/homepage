# Design specification

This site uses MUI v9 components with a local Material 3 Expressive theme. MUI's default component styling is still based on Material Design 2, so `src/theme.ts` supplies the site's colors, typography, spacing, shapes, and motion. This document describes the current implementation.

## Color

`src/theme.ts` creates a light `2025` Expressive dynamic scheme with Material Color Utilities. The primary seed is purple `#7C4DFF`; the tertiary seed is orange `#F36D3F`. The theme keeps those two hue families and uses the Expressive neutral palettes for surfaces. Components read semantic roles through `theme.m3` or MUI's mapped palette. The only raw seed colors belong in the theme.

| Role | Use |
| --- | --- |
| `primary`, `onPrimary` | Links and emphasized interactive content |
| `primaryContainer`, `onPrimaryContainer` | Selected navigation indicator and hero |
| `tertiary`, `tertiaryContainer`, `onTertiaryContainer` | Warm accent and event icons |
| `surface`, `surfaceContainerLow`, `surfaceContainer`, `surfaceContainerHigh` | Page and tonal elevation |
| `onSurface`, `onSurfaceVariant` | Main and secondary text |
| `outlineVariant` | Card and navigation borders |

The contribution calendar uses five colors from the same generated scheme, including a neutral zero level. `tests/theme.test.ts` checks text pairs at 4.5:1 and prominent icon pairs at 3:1. New role combinations need the same check.

## Typography

Alimama FangYuanTi VF is the single typeface for both Latin and Simplified Chinese text. It is a variable font (wght 200-700) self hosted from `src/fonts.css`, with the woff2 file and its license kept under `src/fonts/`. The body stays at 16px with a 1.8 line height for Chinese text. Page titles use MUI `h2` styling on semantic `h1` elements; the profile name uses a responsive 40–64px `h1`. Card and subsection titles use the `h3` style on semantic `h2` elements. Emphasis comes from weight and size rather than all caps or wide tracking.

## Shape and spacing

MUI spacing uses a 4px unit (`theme.spacing(1)`). Its shape base is also 4px, so numeric `sx.borderRadius` values map to that unit. Cards use 28px corners; the hero uses 28px on compact layouts and 40px on wider layouts; the avatar uses 32px; chips use 12px; navigation indicators are pills. These are rounded rectangles in the current web implementation. They do not claim to be superellipses or to provide shape morphing.

Content has a 1024px maximum width and 24px horizontal gutters. The repository grid changes from one to two columns at 600px. The contribution SVG keeps its own width and sits in a keyboard focusable horizontal scroll region on narrow screens.

## Navigation and layout

Four routes retain their existing paths: `/`, `/repos`, `/activity`, and `/experience`. Every navigation item always shows a label. The current item has one tonal indicator and a filled icon; inactive items use outline icons.

| Viewport width | Navigation | Reserved bottom space |
| --- | --- | --- |
| Below 600px | Fixed bottom bar, icon above label | 96px plus safe area |
| 600–839px | Fixed bottom bar, icon beside label | 80px plus safe area |
| 840px and above | Sticky top app bar | None |

The page shell reserves bottom space through the footer so fixed navigation cannot cover the last content. The viewport uses `viewport-fit=cover` to support device safe areas.

## Motion

Web transitions use the theme's standard, emphasized accelerate, and emphasized decelerate cubic Bézier curves. The avatar enters over 500ms and linked cards rise slightly on hover. The navigation indicator changes tone and scale when the route changes. These are CSS timing curves; they do not simulate spring physics. `src/index.css` collapses animations, transitions, and smooth scrolling for `prefers-reduced-motion: reduce`.

## Components and states

| Area | MUI building blocks |
| --- | --- |
| Shared shell | `AppBar`, `BottomNavigation`, `Container`, `Link`, `Typography` |
| Profile | `Avatar`, `Stack`, `Typography`, `Link` |
| Repositories | `Card`, `CardActionArea`, `Chip` |
| Activity | `Card`, `List`, `ListItem`, `Link`; custom SVG calendar |
| Experience and feedback | `List`, `ListItem`, `Chip`, `Alert` |

Repository cards with a URL use one `CardActionArea` link that covers the whole card. Cards without a URL have no link affordance. Empty snapshot sections use a status message, and render errors use an error alert. `content.toml` fields and the committed GitHub snapshot API are unchanged.

## Accessibility

- The first keyboard link skips to the main region. Links and cards have visible keyboard focus styles.
- Main page headings are `h1`; nested sections and cards use `h2` in order.
- Important icon pairs meet 3:1 and body text pairs meet 4.5:1 in theme tests.
- The calendar has an image label, per-day titles, and a keyboard focusable scroll region.
- External links have readable labels; the GitHub links open in a new tab, while email links use `mailto:`.
- Reduced motion and bottom safe area spacing are part of the normal layout.

## References

- [Material Design 3](https://m3.material.io/foundations)
- [Material 3 color scheme utilities](https://github.com/material-foundation/material-color-utilities/blob/main/dev_guide/creating_color_scheme.md)
- [Material typography](https://m3.material.io/styles/typography/type-scale-tokens)
- [Material shape](https://m3.material.io/styles/shape/overview-principles)
- [Material motion for web](https://m3.material.io/styles/motion/overview/specs)
- [Material UI installation and theming](https://mui.com/material-ui/getting-started/installation/)
- [WCAG contrast minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
