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

## Editing content

All site content and config are in `content.toml`:

- `[site]` — title, meta description, owner name, year
- `[profile]` — tagline, bio, avatar path, social links
- `[github]` — username for the /repos and /activity fetches
- `[[repos]]` — repo cards, sourced by `mode`: `github` fetches live
  metadata from the GitHub REST API via the `repo` key (other keys
  override the API values); `custom` is fully manual and makes no network
  request
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
