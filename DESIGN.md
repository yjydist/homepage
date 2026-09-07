# DESIGN.md

Design specification for this personal homepage. It is the single source of
truth for how the site should look and behave, grounded in Material Design 3
(M3) and the Material 3 Expressive update.

---

## 1. Purpose & Status

This document is the **target design specification** for the site. It records
the Material Design 3 and Material 3 Expressive system we intend to follow, and
maps that system onto this project's concrete tokens and components.

**Current implementation status:** the live site is a "warm paper + ink"
palette plus one teal accent, in M3 terms: tonal container surfaces, a
`primary-container` active-nav pill, one squircle-ish avatar, spring hovers,
and light mode only. This is already a partial M3 implementation; the remaining
gap to the M3 Expressive target is listed per section below.

This document therefore describes **where we are going**, not where we are. It
is the direction and the constraints for the gradual redesign. The site will
move toward M3 Expressive incrementally; nothing here requires a big-bang
rewrite.

**Scope:** this document covers color, typography, shape, motion, elevation,
state layers, spacing, layout, accessibility, and a component inventory. It
does not prescribe implementation details (class names, CSS variables) beyond
the token mapping in each section; those live in `src/index.css` and the
component files.

---

## 2. Design Principles (M3 Expressive)

Material 3 Expressive extends M3 with a clear thesis: interfaces should be
**expressive, personal, playful, and human** — while never sacrificing
usability or accessibility.

The principles we adopt:

1. **Expression serves usability.** Visual character (color, shape, motion) is
   used to guide attention and communicate hierarchy, not as decoration.
2. **Personal and human.** A personal homepage is the right place for a
   distinct voice. The design may be warm and individual, but it stays
   legible and calm.
3. **Playful, not noisy.** Expressive shape and motion are welcome in small
   doses (a squircle avatar, a spring hover). They must not compete with
   content.
4. **Accessibility is non-negotiable.** Contrast, touch targets, and reduced
   motion are constraints, not afterthoughts (see Section 9).

**Evidence basis.** M3 Expressive is the result of 46 research studies with
over 18,000 participants. One headline finding: key UI elements can be
recognized up to **4x faster** when shape and color are used expressively and
consistently. This is why we treat expressive shape and color as functional
tools rather than optional flair.

**Constraint.** Expression never overrides function. Any expressive choice
that reduces contrast, slows comprehension, or breaks accessibility is
rejected regardless of how it looks.

---

## 3. Color

### 3.1 M3 foundation: tonal palettes and roles

M3 color is built on **tonal palettes**. A palette is generated from a single
seed color into 13 tones, numbered 0 (near-white) to 100 (near-black), where
each tone is a specific lightness step with adjusted chroma. Tones are
referenced by number (e.g. `primary-40`), not by hex value.

Colors are then assigned **semantic roles** rather than used directly. The
core roles:

| Role | Meaning |
| --- | --- |
| `primary` | Main brand color; key actions, active states |
| `on-primary` | Content on top of `primary` |
| `primary-container` | Tonal container for `primary`; emphasis surfaces |
| `on-primary-container` | Content on `primary-container` |
| `secondary` | Supporting accent; less prominent than `primary` |
| `tertiary` | Contrasting accent; rarely used, clearly distinct |
| `surface` | Background of the app |
| `surface-variant` | Alternative surface (e.g. inputs, chips) |
| `on-surface` | Primary text on `surface` |
| `on-surface-variant` | Secondary text (muted) |
| `outline` | Borders and dividers |
| `outline-variant` | Subtle borders and dividers |
| `error` / `on-error` | Destructive / error states |

### 3.2 M3 Expressive enhancement

Expressive loosens the strict "lightness-only" tonal system:

- **Richer tonal palettes.** Surfaces and containers may shift **chroma**, not
  just lightness, allowing warmer or more saturated surfaces while keeping
  contrast.
- **Clear separation of primary / secondary / tertiary.** The three accent
  roles are pushed further apart in hue so each is unmistakable, supporting
  the faster-recognition finding.
- **Expressive surface tints.** Surfaces can carry a faint tint of the brand
  hue instead of being pure neutral gray.

### 3.3 Project mapping

Current tokens live in `src/index.css` under `@theme`. The mapping from
today's tokens to M3 roles:

| Current token | Value | M3 role | Notes |
| --- | --- | --- | --- |
| `--color-paper` | `#fafaf9` | `surface` | Warm near-white background |
| `--color-ink` | `#1c1917` | `on-surface` | Primary text |
| `--color-muted` | `#78716c` | `on-surface-variant` | Secondary text |
| `--color-accent` | `#0f766e` | `primary` | Teal accent; links, active nav |
| `--color-line` | `#e7e5e4` | `outline-variant` | Borders and dividers |
| `--color-surface-container-low` | `#f5f5f4` | `surface-container-low` | Card and list backgrounds |
| `--color-surface-container` | `#f0efee` | `surface-container` | Chip background; card hover surface |
| `--color-primary-container` | `#ccfbf1` | `primary-container` | Active nav pill |
| `--color-on-primary-container` | `#115e59` | `on-primary-container` | Text on the active nav pill |

Today the palette is intentionally monochrome-plus-one-accent. The M3 target
introduces roles we do not yet use:

- **A full tonal palette** generated from the teal seed (`#0f766e`) so accent
  tints like `primary-90` can be used for subtle backgrounds.
- **`secondary` and `tertiary`** accents — currently absent; the site is
  single-accent by design. Introducing them is optional and must stay
  restrained.

**Future direction:** generate the tonal palette from the existing teal seed.
Keep `paper`/`ink`/`muted`/`line` semantics intact as the neutral backbone.

---

## 4. Typography

### 4.1 M3 foundation: the type scale

M3 defines 15 type styles across five groups, each in Large / Medium / Small:

| Group | Purpose |
| --- | --- |
| Display | Large, expressive headlines (Display L/M/S) |
| Headline | Section and page headings (Headline L/M/S) |
| Title | Card and component titles (Title L/M/S) |
| Body | Running text (Body L/M/S) |
| Label | Small labels, buttons, captions (Label L/M/S) |

The scale is built on a **4dp baseline grid**: line heights are multiples of
4dp so text aligns vertically across the layout.

### 4.2 M3 Expressive enhancement

Expressive replaces the fixed scale with a **variable type scale**:

- Type styles vary **weight, width, and optical size** continuously rather
  than jumping between fixed steps.
- **Larger display sizes** and **tighter tracking** on large text for a more
  confident, expressive headline.
- **Body defaults to 16sp with 24sp line height** for comfortable reading.

### 4.3 Project mapping

Today the site uses a single typeface, **LXGW WenKai**, for everything
(`--font-sans` and `--font-mono` both build on it). This is a deliberate
aesthetic and is retained as the base.

Current usage mapped to the M3 scale:

| Current usage | Approx. M3 style | Notes |
| --- | --- | --- |
| Hero name (`text-4xl`) | Display Small / Headline Large | Largest text on the page |
| Hero tagline (`text-lg`) | Body Large | Accent-colored |
| Section title (`text-xs uppercase tracking-widest`) | Label Large | M3's label style, customized |
| Card title (`text-base font-bold`) | Title Medium | Repo and experience titles |
| About bio (`text-base leading-relaxed`) | Body Large | At 16sp, but `leading-relaxed` gives a 26sp line height, not the 24sp default |
| Card/list descriptions (`text-sm leading-relaxed`) | Body Medium | Slightly below M3's 16sp default |
| Meta / captions (`text-xs`) | Label Small | Stars, dates, tags |

**Future direction:**

- Keep LXGW WenKai as the identity typeface, but align sizes and line heights
  to the M3 scale (notably: raise card/list descriptions toward 16sp/24sp;
  the about bio is at 16sp but keeps a looser 26sp line height via
  `leading-relaxed`).
- **Optional:** introduce **Google Sans Text** for body and **Google Sans
  Display** for headings as a second, variable typeface. This is the M3
  Expressive default pairing. It is optional because the handwriting-style
  identity is a defining feature of the current design; if adopted, it should
  be a deliberate, documented change.
- Use `font-variation-settings` (weight, width, optical size) where the
  chosen typeface supports variable axes.

---

## 5. Shape

### 5.1 M3 foundation: shape categories

M3 defines a small set of corner-radius categories:

| Category | Radius | Typical use |
| --- | --- | --- |
| Extra small | 4dp | Checkboxes, small chips |
| Small | 8dp | Buttons, inputs, cards |
| Medium | 12dp | Cards, sheets |
| Large | 16dp | Large cards, dialogs |
| Extra large | 28dp | Large surfaces, sheets |

### 5.2 M3 Expressive enhancement: squircles

Expressive replaces simple rounded rectangles with **squircles**
(superellipses) — corners that curve more smoothly than a plain arc, avoiding
the "pinched" look at the corner-to-edge transition.

Key changes:

- **Squircle corners** instead of plain border-radius on prominent surfaces.
- **Corner radius scales with component size** — larger components get
  proportionally larger, softer corners.
- **35 new shape values** and **shape morphing** (a component can smoothly
  change shape between states, e.g. a chip expanding into a card).
- A **"full"** corner option (pill / fully rounded) as a first-class shape.

### 5.3 Project mapping

Today the site uses rounded rectangles throughout: a 24px squircle-ish avatar
(`rounded-[24px]`), 28px cards (`rounded-xl`), 16px notice boxes (`rounded-lg`),
8px chips and focus rings (`rounded-sm`), 4px footer links (`rounded-xs`),
3px legend swatches and calendar cells, and pill nav/social links
(`rounded-full`). Plain-arc corners, not true squircles.

| Current element | Current shape | M3 Expressive target |
| --- | --- | --- |
| Avatar | `rounded-[24px]` | True squircle (superellipse), scaled to its 80px size |
| Contribution cells | `rx={3}` | Extra small (4dp) squircle |
| Legend swatches | `rounded-[3px]` | Extra small (4dp) |
| Tag chips | `rounded-sm` (8dp) | Small (8dp) squircle |
| Cards | `rounded-xl` (28dp) | Small–Medium (8–12dp) squircle |

**Future direction:** the `--radius-xs/sm/lg/xl` tokens in `src/index.css`
already cover the M3 categories. The remaining step is replacing plain arcs
with true squircles where prominence warrants it: a superellipse can be
approximated in CSS with a `border-radius` plus a slightly larger value than
the plain-arc equivalent, or with an SVG `path` for the avatar.

---

## 6. Motion

### 6.1 M3 foundation: easing

M3 defines standard easing curves for transitions:

- **Standard** — `cubic-bezier(0.2, 0, 0, 1)` (decelerate into place)
- **Emphasized** — `cubic-bezier(0.2, 0, 0, 1)` with longer duration, for
  larger or more important movements

### 6.2 M3 Expressive enhancement: spring physics

Expressive moves from fixed-duration curves to **spring-based physics**,
parameterized by:

- **stiffness** — how strongly the spring pulls toward rest
- **damping** — how quickly oscillation decays
- **mass** — how heavy the animated object feels

Two new named curves are added:

- **Emphasized Accelerate** — `cubic-bezier(0.3, 0, 0.8, 0.15)`
- **Emphasized Decelerate** — `cubic-bezier(0.05, 0.7, 0.1, 1.0)`

Motion is used to **convey hierarchy**: important elements move more
emphatically; subtle elements move less. Springs give a natural, physical
feel that fixed curves cannot.

### 6.3 Project mapping

Today the site has spring motion in place: `--ease-spring` and
`--ease-standard` tokens with `--duration-short/medium`, a spring avatar
entrance (`animate-hero-avatar-spring`), a spring avatar hover
(`hover:scale-105` via `transition-transform`), a spring card hover lift
(`hover:-translate-y-0.5`), `transition-all` on links and nav items whose
background and text change together, `transition-colors` on text-only hovers
(footer links, the hero social underline, card titles, chips), an opacity
fade on contribution calendar cells (`transition-opacity`,
`hover:opacity-75`), and a reduced-motion collapse rule in `src/index.css`.

**Future direction:**

- Keep `transition-colors` for text-color hovers (it is appropriate and
  subtle).
- Extend spring motion to: nav active-indicator movement, the contribution
  calendar's day cells on hover (today an opacity fade on the standard
  easing), and page/section transitions.
- Avoid animating `color` with springs — springs are for transforms and
  opacity.
- Respect `prefers-reduced-motion` (Section 9): collapse springs to instant or
  a short fade when the user requests reduced motion.

---

## 7. Elevation & State Layers

### 7.1 M3 foundation

M3 defines **6 elevation levels** (0–5), but unlike older Material it uses
**tonal elevation**: elevation is conveyed by shifting the surface's tone
(lighter or darker, optionally tinted) rather than by a hard drop shadow.
Shadows are used only at the highest levels and are soft.

**State layers** are translucent overlays that communicate interaction state
on top of any surface:

- `hover` — subtle tint
- `focus` — slightly stronger
- `pressed` — strongest
- `dragged` — strongest of all

### 7.2 Project mapping

Today the site uses tonal elevation and state layers throughout: repo cards,
the experience list and the events feed sit on `surface-container-low`, the
active nav pill is `primary-container`, and interactive elements carry a
faint accent tint on hover (`hover:bg-accent/10`; inactive nav items use a
fainter `hover:bg-accent/8`). Only repo cards lift to
`surface-container` on hover. Only the soft `shadow-xs` appears (avatar, nav
pill, card hover) — no hard drop shadows.

**Future direction:**

- Continue to avoid hard drop shadows; they fight the flat paper aesthetic.
- Extend tonal elevation where hierarchy needs it, e.g. a `surface-container`
  tint behind the sticky nav to separate layers.

---

## 8. Spacing & Layout

### 8.1 Grid

M3 uses a **4dp grid** for spacing. Tailwind's default spacing scale is
already 4px-based (`p-1` = 4px, `p-2` = 8px, ...), so the project is
naturally aligned with the M3 grid. No change is required; the convention is
to keep spacing on the 4px grid.

### 8.2 Layout conventions

| Property | Current value | Convention |
| --- | --- | --- |
| Content max width | `max-w-content` (64rem, via `--container-content`) | Keep; a business-card site reads best narrow |
| Page gutter | `px-6` (24px) | Keep; matches M3's comfortable margin |
| Section rhythm | `py-16` (hero: `pt-28 pb-16`) | Keep on the 4px grid |
| Nav height | `py-2` | Keep; 48dp+ touch target (Section 9) |

**Future direction:** no change to the layout skeleton. If a different
measure is ever wanted, adjust `--container-content` (the single source of
truth for the page width) and re-evaluate the type scale rather than
stretching the current one.

---

## 9. Accessibility

Accessibility is a hard constraint on every section above.

- **Contrast (WCAG AA).** Body text must meet 4.5:1; large text 3:1. `muted`
  on `paper` clears 4.5:1 (4.59), but `muted` text on the container surfaces
  does not: 4.40 on `surface-container-low`, 4.44 on the card rows'
  `surface-container-low/70` over `paper`, and 4.18 on `surface-container`
  (tag chips); the chip hover pair (`accent` on `accent/10` over
  `surface-container`) is 4.18. Darkening `muted` (e.g. toward
  `#6f6a65`, which clears 4.5 on every current surface) is queued future work;
  any new container or tint role must be re-checked before adoption.
- **Touch targets.** Minimum 48dp (48px). Nav links must retain adequate hit
  area; do not shrink them below 48px. Footer social links are deliberately
  compact text links (a row of small, non-primary targets); the footer stays
  short by design, so its links may stay under 48px.
- **Responsive type.** Text scales with viewport where appropriate; body text
  stays readable without horizontal scroll.
- **Reduced motion.** Honor `prefers-reduced-motion`; all spring and transform
  motion collapses to instant or a short opacity fade.
- **Focus visibility.** Keyboard focus must remain visible; if state layers
  are added, a `focus` layer is required, not just `hover`.
- **Semantic structure.** Headings use `h1`–`h3` in order; the contribution
  calendar keeps its `role="img"` + `aria-label`; links keep discernible text.

**Dark mode:** the site is light-mode only today. Dark mode is a **future
item**: M3 defines a parallel dark tonal palette (tones shift toward higher
values; surfaces become dark neutrals). It is out of scope for the current
design but is the natural next step after the light palette is tokenized.

---

## 10. Component Inventory

Mapping of existing components to M3 components and the shape/color/motion
rules above.

| Component | M3 analogue | Shape | Color | Motion / state |
| --- | --- | --- | --- | --- |
| `Nav` | Top app bar (updated in Expressive) | Pill links (`rounded-full`) | `primary-container` active pill; `hover:bg-accent/8` state layer on inactive items | `transition-all`; active-indicator movement is future work |
| `Hero` | Header / display region | `rounded-[24px]` avatar; pill social links | `on-surface` name, `primary` tagline | Spring on avatar entrance (`animate-hero-avatar-spring`) and hover (`hover:scale-105`) |
| `Section` | Section heading | — | `on-surface-variant` label | — |
| `Footer` | Footer | `rounded-xs` links | `outline-variant` border | `transition-colors` |
| `RepoCard` | Card (Expressive) | `rounded-xl` (28dp) | `surface-container-low`; container tint + `shadow-xs` on hover | Spring lift (`ease-spring`, `-translate-y-0.5`) |
| Tag chips | Chip (assist) | `rounded-sm` | `surface-container`; `hover:bg-accent/10` state layer | `transition-colors` |
| `ContributionsCalendar` | Custom data viz | `rx={3}` cells | `primary` tonal ramp (accent opacities) | `hover:opacity-75` per cell |
| `EventsFeed` | List | `rounded-xl` card rows | `surface-container-low` | `transition-all` on links; `hover:bg-accent/10` |
| `Experience` | List | `rounded-xl` card rows | `surface-container-low` | — |
| `AsyncState` (Loading / Error / Empty) | Progress / empty state | `rounded-lg` (16dp) boxes | `surface-container-low` | Spinner + `animate-spin` on Loading |

**M3 Expressive new components** and their relevance to this site:

| Expressive component | Relevance | Notes |
| --- | --- | --- |
| Button groups | Low | No button-heavy flows today |
| FAB menu | Low | No FAB; could host a "back to top" action |
| Split button | None | Not applicable |
| Docked / floating toolbar | Low | Could replace the sticky nav on scroll |
| Loading indicator | Done | `Loading` already renders a spinner, not text only |
| Updated top app bar | Medium | The nav is the site's top app bar |
| Updated carousel / nav bar / nav rail | Low | Single-page nav; rail is overkill |

**Priority order for future work:** (1) true squircles for the avatar and
chips, (2) nav active-indicator spring movement, (3) a full tonal palette
from the teal seed, (4) optional Google Sans type pairing, (5) dark mode.
The earlier groundwork items these build on (container surfaces, state
layers, spring motion, and the loading indicator) are already implemented.

---

## 11. Sources

- Material Design 3 — https://m3.material.io
- Material 3 Expressive (Google Design blog) — https://design.google/library/material-3-expressive/
- Material 3 Expressive announcement (Android Developers Blog) —
  https://android-developers.googleblog.com/2025/05/material-3-expressive.html
- Google Design research on expressive UI (recognition-speed findings) —
  https://design.google/library/expressive-ui/
- Material Design color system (tonal palettes and roles) —
  https://m3.material.io/styles/color/overview
- Material Design typography — https://m3.material.io/styles/typography/overview
- Material Design shape — https://m3.material.io/styles/shape/overview
- Material Design motion — https://m3.material.io/styles/motion/overview
- WCAG 2 contrast (minimum) — https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html

> Note: verify source URLs against the live Material/Google Design sites
> before relying on them; they may move over time.
