# homepage

Personal business-card site. Small SPA with four pages: 关于 (hero and
bio), 仓库, 动态, 经历.

**Stack**: React + Vite + TypeScript, Tailwind CSS v4, LXGW WenKai
(typeface), Material Symbols (icons), bun (local dev). Content lives in
`content.toml` — edit that file to change site copy, socials, repos and
experience entries; page-level titles and nav labels live in
`src/routes.ts` and the page components.

## Local development

```sh
bun install
bun run dev       # dev server
bun run build     # type-check + production build (output in dist/)
bun run preview   # serve the production build
```

GitHub data (repo metadata, public events, the contributions calendar)
comes from the committed snapshot at `src/generated/github-data.json`, so
the browser makes no API calls. `.github/workflows/refresh-github-data.yml`
refreshes it every 6 hours and commits only when the data changed. To
refresh it locally, provide a token:

```sh
GITHUB_TOKEN=$(gh auth token) bun run fetch:github
```

## Editing content

All site content and config are in `content.toml`:

- `[site]` — title, meta description, owner name
- `[profile]` — tagline, bio, avatar (image URL or path under `public/`),
  social links
- `[github]` — username the snapshot fetch uses for the contributions
  calendar and public events; /repos uses each entry's own `repo` key
- `[[repos]]` — repo cards, sourced by `mode`: `github` reads metadata
  from the committed snapshot via the `repo` key (other keys override the
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
