# Complete SEO and routing audit

Audit date: 2026-07-12  
Production origin: `https://cabinetdentairesete.fr`  
Scope: repository routing/SEO implementation plus live HTTP inspection of all 34 URLs in the production sitemap. No SEO routing, canonical, content, or sitemap fixes were applied during this audit.

## Executive summary

The current implementation has four critical technical issues:

1. **Twenty-six sitemap URLs redirect unnecessarily.** Every prerendered route is emitted as a directory (`dist/<route>/index.html`). The live host returns `308` from the slashless sitemap URL to the trailing-slash URL. The final page is `200`, but its canonical remains slashless. Sitemap entries and server-rendered internal links are also slashless.
2. **Six sitemap routes serve the homepage before JavaScript.** `/about`, `/services`, `/gallery`, `/actualities`, `/contact`, and `/pre-rendez-vous` directly return `200` with the homepage title, description, H1, body, canonical, and homepage structured data.
3. **Unknown routes are soft 404s.** `/audit-route-inexistante-404` returned `200` with the complete homepage HTML and homepage canonical. There is no catch-all route in `src/main.jsx`.
4. **The `www` host is not consolidated.** `https://www.cabinetdentairesete.fr/` returns `200` instead of redirecting to the non-`www` canonical host. HTTP correctly redirects to HTTPS, but `http://www...` stops at the `www` HTTPS duplicate.

All sitemap pages permit indexing. That is inappropriate for `/pre-rendez-vous`, a conversion utility that should normally be `noindex,follow` and omitted from the sitemap. The dynamic `/actualities` hub overlaps the static `/blog` hub and should be consolidated rather than indexed as a second blog architecture.

## Live HTTP and URL normalization

- Homepage: direct `200`, correct self-referencing canonical, correct initial HTML.
- Static SPA-shell routes: direct `200`, but server HTML is the homepage and canonical is `/`.
- Prerendered routes: `308` from slashless to trailing slash, then `200`.
- Canonicals on prerendered final pages: slashless, therefore not self-referencing against the final trailing-slash URL.
- Slash variants of the six SPA-shell routes: direct `200`, homepage HTML, homepage canonical.
- HTTPS `www`: direct `200`; should be one-hop `301` or `308` to `https://cabinetdentairesete.fr/`.
- Unknown route: direct `200`; must return a real `404`.

No repository `_redirects` file exists. `public/.htaccess` defines an Apache SPA fallback, but live behavior is consistent with Cloudflare/static-host directory normalization and fallback handling; the Apache file does not control Cloudflare Pages. `public/_headers` sets security/cache headers only.

## Per-URL technical matrix

| Sitemap path | Direct | Final path | Canonical | Correct initial HTML | Recommended action |
|---|---:|---|---|---|---|
| `/` | 200 | `/` | Self | Yes | KEEP |
| `/about` | 200 | `/about` | Mismatch | No | FIX_RENDERING |
| `/services` | 200 | `/services` | Mismatch | No | FIX_RENDERING |
| `/gallery` | 200 | `/gallery` | Mismatch | No | FIX_RENDERING |
| `/blog` | 308 | `/blog/` | Mismatch | Yes | FIX_REDIRECT |
| `/actualities` | 200 | `/actualities` | Mismatch | No | MERGE |
| `/contact` | 200 | `/contact` | Mismatch | No | FIX_RENDERING |
| `/pre-rendez-vous` | 200 | `/pre-rendez-vous` | Mismatch | No | NOINDEX |
| `/invisalign` | 308 | `/invisalign/` | Mismatch | Yes | FIX_REDIRECT |
| `/prix-orthodontie-invisible-sete` | 308 | `/prix-orthodontie-invisible-sete/` | Mismatch | Yes | FIX_REDIRECT |
| `/implantologie` | 308 | `/implantologie/` | Mismatch | Yes | FIX_REDIRECT |
| `/orthodontie-sete` | 308 | `/orthodontie-sete/` | Mismatch | Yes | FIX_REDIRECT |
| `/orthodontie-invisible-sete` | 308 | `/orthodontie-invisible-sete/` | Mismatch | Yes | FIX_REDIRECT |
| `/orthodontie-invisible-meze` | 308 | `/orthodontie-invisible-meze/` | Mismatch | Yes | FIX_REDIRECT |
| `/invisalign-frontignan` | 308 | `/invisalign-frontignan/` | Mismatch | Yes | FIX_REDIRECT |
| `/invisalign-marseillan` | 308 | `/invisalign-marseillan/` | Mismatch | Yes | FIX_REDIRECT |
| `/orthodontie-invisible-agde` | 308 | `/orthodontie-invisible-agde/` | Mismatch | Yes | FIX_REDIRECT |
| `/orthodontie-adulte-balaruc-les-bains` | 308 | `/orthodontie-adulte-balaruc-les-bains/` | Mismatch | Yes | FIX_REDIRECT |
| `/invisalign-bassin-de-thau` | 308 | `/invisalign-bassin-de-thau/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/orthodontie-sete-quand-consulter-alignement-dentaire` | 308 | `/blog/orthodontie-sete-quand-consulter-alignement-dentaire/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/orthodontie-adulte-sete-questions-avant-traitement` | 308 | `/blog/orthodontie-adulte-sete-questions-avant-traitement/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/dents-chevauchees-espaces-visibles-correction-sete` | 308 | `/blog/dents-chevauchees-espaces-visibles-correction-sete/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/dents-qui-rebougent-apres-appareil-sete` | 308 | `/blog/dents-qui-rebougent-apres-appareil-sete/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/orthodontie-bassin-de-thau-suivi-sete` | 308 | `/blog/orthodontie-bassin-de-thau-suivi-sete/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/orthodontie-invisible-sete-questions-avant-bilan` | 308 | `/blog/orthodontie-invisible-sete-questions-avant-bilan/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/invisalign-aligneurs-transparents-gouttieres-differences` | 308 | `/blog/invisalign-aligneurs-transparents-gouttieres-differences/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/duree-orthodontie-invisible-sete` | 308 | `/blog/duree-orthodontie-invisible-sete/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/orthodontie-invisible-quotidien-repas-entretien-parole` | 308 | `/blog/orthodontie-invisible-quotidien-repas-entretien-parole/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/orthodontie-invisible-adulte-30-40-50-ans` | 308 | `/blog/orthodontie-invisible-adulte-30-40-50-ans/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/orthodontie-invisible-adolescent-sete` | 308 | `/blog/orthodontie-invisible-adolescent-sete/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/premier-bilan-orthodontie-invisible-sete` | 308 | `/blog/premier-bilan-orthodontie-invisible-sete/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/verite-invisalign-taquets-temps-port-gene` | 308 | `/blog/verite-invisalign-taquets-temps-port-gene/` | Mismatch | Yes | FIX_REDIRECT |
| `/blog/prix-orthodontie-invisible-sete` | 308 | `/blog/prix-orthodontie-invisible-sete/` | Mismatch | Yes | MERGE |
| `/blog/aligner-dents-avant-implant` | 308 | `/blog/aligner-dents-avant-implant/` | Mismatch | Yes | FIX_REDIRECT |

The complete redirect chain, title, H1, robots value, canonical, metadata notes, duplicate assessment, and final action for each URL are in `seo-url-map.csv`.

## Rendering and metadata findings

### Correct server-rendered routes

The homepage, `/blog`, all service/landing pages from `servicePages`, and all static articles from `blogPages` contain route-specific title, meta description, H1, and body content in the initial HTML. They do not accidentally contain the homepage H1.

### Incorrect server-rendered routes

The following initial documents are the homepage shell and contain the homepage H1: `/about`, `/services`, `/gallery`, `/actualities`, `/contact`, and `/pre-rendez-vous`. Their React components declare route-specific Helmet metadata and content, but it appears only after JavaScript executes. These routes need prerendered/static output or SSR.

### Canonical behavior

`App.jsx` removes trailing slashes when creating canonicals, and the prerenderer writes slashless canonicals. The host redirects directory routes to trailing-slash URLs, so all 26 prerendered final pages have non-self-referencing canonicals. Choose one format across hosting, output paths, sitemap, canonicals, hreflang, Open Graph URLs, and internal links. The existing application conventions favor slashless URLs, but the host must then serve them directly.

### Robots and sitemap

All 34 sitemap URLs declare `index,follow,max-image-preview:large`. The sitemap generator hard-codes `lastmod` to `2026-05-18` for every URL, so future builds can publish stale modification dates.

Indexability recommendations:

- Keep indexable: homepage, about, services, gallery, contact, blog, genuine treatment pillars, useful articles, and genuinely differentiated local landing pages.
- Merge: `/actualities` into `/blog`, preserving unique database-backed articles with stable public slugs.
- Noindex/remove from sitemap: `/pre-rendez-vous`.
- Human quality review: every nearby-city page; each must provide genuine local value to avoid doorway-page risk.

## Internal links

Prerendered headers, breadcrumbs, related links, CTA links, React navigation, `llms.txt`, and sitemap predominantly use slashless URLs. For all 26 prerendered routes, these links do not point directly to the current final URL because the host adds a slash via `308`.

Links to the six SPA-shell routes are direct at the HTTP level, but their server response is homepage content. Query links to `/pre-rendez-vous?specialite=implantologie` and `?specialite=orthodontie` are stale because the form now has one generic telephone option; clean them up during implementation.

## Duplicate and overlap risks

- **`/invisalign` and `/orthodontie-invisible-sete`:** both target invisible orthodontics in Sète. They can coexist only with sharply separated brand/treatment versus local clinical intent.
- **`/prix-orthodontie-invisible-sete` and `/blog/prix-orthodontie-invisible-sete`:** substantial same-intent overlap. Consolidate into the stronger price pillar and redirect the article, or redefine the article around a distinct question.
- **`/blog` and `/actualities`:** two public article hubs backed by different systems. Consolidate navigation and indexing around one hub.
- **Nearby-city pages:** route-specific copy exists, but the pages share a strong service/location template. Review factual local usefulness and avoid doorway pages.
- **Core SPA routes and unknown routes:** server HTML duplicates the homepage until JavaScript runs.

## Structured data

Every audited initial document contains global `Dentist`, `Organization`, `WebSite`, and homepage `BreadcrumbList` schema inherited from `index.html`. On non-home routes, that breadcrumb graph does not describe the page.

`SeoContentPage` creates page-specific schemas client-side, but the static prerenderer does not serialize equivalent page-specific `WebPage`/`Service`/`Article`, breadcrumb, and FAQ schema into initial HTML. Static articles therefore lack server-delivered `Article` schema. Generate schema per route during prerendering.

Dentist data is duplicated in `index.html` and `App.jsx` with inconsistent hours, coordinates, address accents, and price range. Consolidate it into one source.

## Routing and prerender architecture

- `src/main.jsx` has explicit client routes but no public catch-all 404 route.
- `scripts/prerender-static-pages.mjs` generates the homepage, blog hub, service pages, and static blog pages only.
- Core informational routes and dynamic Supabase actualities are omitted from prerendering.
- Nested `index.html` output triggers directory slash normalization on the host.
- `public/.htaccess` rewrites unknown paths to the homepage shell, creating soft 404s on Apache too.
- No Cloudflare `_redirects` ruleset exists in the repository.
- Dynamic `/actualities/:id` uses database IDs, is absent from the sitemap, and receives generic/homepage initial HTML. Do not index until stable slugs, metadata, rendering, and 404 behavior exist.

## Prioritized implementation plan

1. **Fix redirect and host behavior.** Choose one slash format, enforce it in one hop, redirect `www` to non-`www`, and make every sitemap URL directly return `200`.
2. **Fix route rendering and 404s.** Prerender or server-render about, services, gallery, contact, and any retained hub. Add a not-found route plus host-level `404.html`/rules so unknown URLs return HTTP `404`.
3. **Consolidate public hubs.** Merge `/actualities` into `/blog` or clearly separate them; migrate unique articles to stable slugs and permanently redirect the redundant hub.
4. **Set indexability intentionally.** Add `noindex,follow` to `/pre-rendez-vous`, remove it from the sitemap, and review nearby-city pages for genuine local value.
5. **Consolidate overlaps.** Resolve the two price URLs first, then review `/invisalign` against `/orthodontie-invisible-sete`. Redirect merged pages and update internal links.
6. **Generate route-specific structured data.** Emit page-appropriate server HTML schema and one consistent Dentist entity.
7. **Regenerate sitemap and internal links.** Include only canonical, indexable, direct-`200` URLs; derive truthful `lastmod` and update all internal references.
8. **Re-crawl before release.** Recheck statuses, redirects, canonicals, robots, initial HTML, H1, schema, internal links, and unknown routes.

