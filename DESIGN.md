# Design specification

This site follows a Swiss International Style visual system: square corners, neutral black/white/gray surfaces, a single red accent, alignment to a 1280px grid, and restrained motion. It uses MUI v9 components with a local theme, so `src/theme.ts` supplies the site's colors, typography, spacing, shapes, and motion. This document describes the current implementation.

## Color

Colors are static design tokens, not generated. `src/theme.ts` exports `swissTokens`, and components read semantic values through `theme.swiss`. The accent is Swiss red `#E10600`; everything else is neutral. There is no dark mode and no dynamic scheme.

| Token | Value | Use |
| --- | --- | --- |
| `text.primary` | `#111111` | Headings and body text |
| `text.secondary` | `#595959` | Secondary text, icons, unselected navigation |
| `background` | `#FFFFFF` | Page and card surface; cards are separated by hairlines, not tinted fills |
| `backgroundAlt` | `#F5F5F2` | Chips, avatar placeholder, empty-state and error-alert fills |
| `divider` | `#D9D9D6` | Card, list-row, and calendar borders |
| `controlBorder` | `#595959` | Reserved for form-control borders |
| `accent` | `#E10600` | Links, selected navigation, hover states, selection highlight |
| `error` | `#B3261E` | Error alert border, icon, and palette role |

`error` is a darker red than `accent` so error states are not distinguished from the accent by hue alone. The MUI palette maps `primary` to `accent` and `error` to `error`; `background.default` and `background.paper` are both white.

The contribution calendar uses five static levels from `#EDEDEA` (zero) to `#9E0B00`, lightest to darkest. `tests/theme.test.ts` checks text and accent pairs at 4.5:1 against both surfaces, prominent icons at 3:1, and that the contribution levels stay unique and darken monotonically. New color combinations need the same check.

## Typography

Alimama FangYuanTi VF remains the single typeface for both Latin and Simplified Chinese text. It is a variable font (wght 200-700) self hosted from `src/fonts.css`, with the woff2 file and its license kept under `src/fonts/`. Weights are restricted to 400, 500, and 700. The body stays at 16px with a 1.8 line height for Chinese text; letter spacing is zero everywhere except the Latin-only site name (`h1`, -0.015em).

| Role | Size | Weight / line height | Use |
| --- | --- | --- | --- |
| `h1` | clamp(40px, 6vw, 64px) | 700 / 1.15 | Site name in the hero |
| `h2` | clamp(32px, 1.6rem + 1.6vw, 40px) | 700 / 1.2 | Page and section titles |
| `h3` | clamp(20px, 1.05rem + 1vw, 28px) | 500 / 1.3 | Card and subsection titles |
| `subtitle1` | 18px | 400 / 1.7 | Hero tagline |
| `body1` | 16px | 400 / 1.8 | Paragraphs and descriptions |
| `body2` | 14px | 400 / 1.6 | Metadata |
| `caption` | 12px | 400 / 1.5 | Timestamps and legend |

Page titles use MUI `h2` styling on semantic `h1` elements; card and subsection titles use `h3` on semantic `h2` elements. Emphasis comes from weight and size rather than all caps or wide tracking.

## Shape and spacing

The shape base radius is 4px, but components use square corners: cards, chips, the avatar, calendar cells, alerts, and navigation are all `borderRadius: 0`. There are no shadows; structure comes from a hairline system - 1px `divider` for cards and list rows, and strong 1-2px `#111111` rules for page-level separation (app bar bottom, footer top, hero top, mobile bar top).

MUI spacing uses a 4px unit (`theme.spacing(1)`). Content sits in a 1280px container with responsive gutters: 16px below 600px, 32px from 600px, and 48px from 840px. The repository grid changes from one to two columns at 600px with a 16/24px gap. The contribution SVG keeps its own width and sits in a keyboard focusable horizontal scroll region on narrow screens.

The breakpoints are 600/840/1200/1536, carried over from the previous layout; the skill's reference 768/1024 values were not adopted because the existing navigation switch (840px) and container width depend on them.

## Navigation and layout

Four routes retain their existing paths: `/`, `/repos`, `/activity`, and `/experience`. Every navigation item always shows a label. Navigation is text only: the current item is red and weight 700 in the app bar and `#111111` weight 700 in the bottom bar; other items are `text.secondary` weight 500. There are no pills or animated indicators.

| Viewport width | Navigation | Reserved bottom space |
| --- | --- | --- |
| Below 600px | Fixed bottom bar, icon above label | 96px plus safe area |
| 600-839px | Fixed bottom bar, icon beside label | 80px plus safe area |
| 840px and above | Sticky top app bar | None |

The page shell reserves bottom space through the footer so fixed navigation cannot cover the last content. The viewport uses `viewport-fit=cover` to support device safe areas.

## Motion

Transitions use MUI's default easing curves with the previous durations kept. Motion is limited to color and border-color changes; there are no transforms, entrance animations, or hover lifts. `src/index.css` collapses animations, transitions, and smooth scrolling for `prefers-reduced-motion: reduce`.

## Components and states

| Area | MUI building blocks |
| --- | --- |
| Shared shell | `AppBar`, `BottomNavigation`, `Container`, `Link`, `Typography` |
| Profile | `Avatar`, `Stack`, `Typography`, `Link` |
| Repositories | `Card`, `CardActionArea`, `Chip` |
| Activity | `Card`, `List`, `ListItem`, `Link`; custom SVG calendar |
| Experience and feedback | `List`, `ListItem`, `Chip`, `Alert` |

Repository cards with a URL use one `CardActionArea` link that covers the whole card; hover darkens the border and turns the heading red. Cards without a URL have no link affordance. Empty snapshot sections use a status message with a neutral icon, and render errors use an error alert with the `error` red. `content.toml` fields and the committed GitHub snapshot API are unchanged.

## Accessibility

- The first keyboard link skips to the main region. Links, cards, and navigation have visible keyboard focus styles with a 2px accent outline.
- Main page headings are `h1`; nested sections and cards use `h2` in order.
- Text pairs meet 4.5:1 and prominent icon pairs meet 3:1 in theme tests; the accent passes 4.5:1 on both surfaces.
- Error and accent states differ by more than hue (darker red, border plus icon).
- The calendar has an image label, per-day titles, and a keyboard focusable scroll region.
- External links have readable labels; the GitHub links open in a new tab, while email links use `mailto:`.
- Reduced motion and bottom safe area spacing are part of the normal layout.

## References

- [Swiss International Style](https://en.wikipedia.org/wiki/International_Typographic_Style)
- [MUI theming](https://mui.com/material-ui/customization/theming/)
- [WCAG contrast minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
