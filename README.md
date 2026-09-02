# homepage

Personal business-card site. Single scrolling page: hero, about, projects,
experience.

**Stack**: React + Vite + TypeScript, Tailwind CSS v4, Courier Prime, bun
(local dev). Content lives in `src/content.toml` — edit that file to change
anything displayed; components never hardcode text.

## Local development

```sh
bun install
bun run dev       # dev server
bun run build     # type-check + production build (output in dist/)
bun run preview   # serve the production build
```

## Editing content

All site content and config are in `src/content.toml`:

- `[site]` — title, meta description, owner name, year
- `[profile]` — tagline, bio, avatar path, social links
- `[[projects]]` — project cards (title, description, tags, link)
- `[[experience]]` — experience entries (period, role, organization)

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
