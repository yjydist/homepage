# homepage

Personal business-card site. Small SPA with four pages: 关于 (hero and
bio), 仓库, 动态, 经历.

**Stack**: React + Vite + TypeScript, MUI v9 + Emotion, Material Color
Utilities, Google Sans Flex and Noto Sans SC, bun (local dev). Content lives in
`content.toml` — edit that file to change site copy, socials, repos and
experience entries; page-level titles and nav labels live in
`src/routes.ts` and the page components.

## Local development

```sh
bun install
bun run dev       # dev server
bun run build     # type-check + production build (output in dist/)
bun run lint      # static checks
bun run test      # unit and theme contrast checks
bun run preview   # serve the production build
```

The light M3 Expressive theme is defined in `src/theme.ts`, with purple and
orange source colors. Layout and navigation adapt at 600px and 840px.
`DESIGN.md` records the component rules and accessibility checks. Fonts and
icons are bundled locally; the browser does not need a font CDN.

GitHub data (repo metadata, public events, the contributions calendar)
renders from the committed snapshot at `src/generated/github-data.json`
on first paint, then the browser fetches live data anonymously (no token)
and replaces it in place; the snapshot stays as the fallback whenever any
live request fails (e.g. rate limiting, offline). To refresh the snapshot
locally, provide a token:

```sh
GITHUB_TOKEN=$(gh auth token) bun run fetch:github
```

## Editing content

All site content and config are in `content.toml`:

- `[site]` — title, meta description, owner name
- `[profile]` — tagline, bio, avatar (image URL or path under `public/`),
  social links
- `[github]` — username used at runtime for the contributions calendar
  and public events; /repos uses each entry's own `repo` key
- `[[repos]]` — repo cards, sourced by `mode`: `github` reads metadata
  from the snapshot/live data via the `repo` key (other keys override the
  snapshot values); `custom` is fully manual and uses no snapshot data
- `[[experience]]` — experience entries (period, role, organization,
  description)

## Deploying to Cloudflare Pages

The site auto-deploys from GitHub:

1. In the Cloudflare dashboard, create a Pages project and connect this repo.
2. Build settings:
   - Framework preset: `vite`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Push to `main`; every push triggers a rebuild.

`public/_redirects` keeps SPA fallback working; no other Pages configuration
is required.
