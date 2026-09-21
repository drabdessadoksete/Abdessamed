# Cabinet dentaire Dr Abdessadok — Sète

React, Vite and Tailwind website for `https://cabinetdentairesete.fr`.

## Development and verification

- `npm install`
- `npm run dev`
- `npm run seo:check` — builds the site and checks generated HTML, content preservation, indexability, links, schema, hreflang and routing configuration.
- `npm test` — runs article approval, content parsing and attribution regression checks.
- `npm run seo:live` — checks production HTTP responses against the current source (run after deployment). Add `-- --output=/tmp/gsc-check.json` to save evidence; a failure means the live site differs from the intended result.
- `node --test src/utils/*.test.js` — parser and referral-attribution regression checks.
- `npm run preview` — inspect the production build locally. Vite preview is not an emulator for Cloudflare/Netlify/Vercel redirect rules.

## Production build

`npm run build` generates content, sitemap, redirects and the optional `llms.txt` directory, builds browser assets, then renders the actual public React pages into `dist`. Root-relative assets (`base: '/'`) support nested URLs. The temporary server renderer is removed after the build. React effects, analytics and submissions do not run during prerendering.

Deploy the complete `dist` directory, including `_redirects`, `_headers`, `404.html` and all route folders. Unknown URLs must return a real 404. The 15 articles approved by the owner on 21 September 2026 are indexable; new articles still need approval. Configure public Supabase values from `.env.example` through the hosting environment; never place service-role credentials in the frontend.

For the September Search Console corrections, see [URL evidence and validation steps](docs/gsc-2026-09-21-evidence.md). The `www` host redirect still requires the [Cloudflare dashboard rule](CLOUDFLARE-SEO-CONFIG.md).

The existing repository tracks `dist`; the refreshed build is included with source changes.

## SEO handoff

- [Implemented improvements and deployment steps](docs/seo-implementation-2026-09.md)
- [Research, local search priorities and sources](docs/seo-research-2026-09.md)
- [Cloudflare hostname consolidation](CLOUDFLARE-SEO-CONFIG.md)
