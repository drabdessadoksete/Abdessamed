# Site authority rebuild report

Branch requested: `site-authority-full-rebuild`

Last updated: 2026-07-13

## 1. Changed-file summary

The public experience, route configuration, image pipeline, content hub, treatment template, multilingual pages, structured data, sitemap, redirects, analytics events and automated SEO verification were rebuilt. Admin and Supabase service contracts were preserved.

## 2. Final homepage structure

1. Autoplay video hero with mobile source and no pause control.
2. Auto-scrolling public Google review excerpts.
3. Animated implantology and orthodontie-invisible patient-question rails.
4. Trust and verifiable-practice markers.
5. Treatment pathways.
6. Qualifications.
7. Consultation process.
8. Technology.
9. Safety and follow-up.
10. Educational resources.
11. Local access.
12. FAQ and final pre-rendez-vous CTA.

## 3. Treatment pages rebuilt

`/orthodontie-invisible-sete/` and `/implantologie/` receive dedicated candidacy, process, limits, retention/maintenance and FAQ panels. Other service and city routes share the clearer patient template.

## 4. Core pages rebuilt

About, Services, Contact, Guides and Gallery now use the same editorial design system. Gallery uses varied pedagogical scenes and can add admin images only when they are marked as verified documentary photographs.

## 5. Redirect map

`scripts/generate-redirects.mjs` generates 57 rules: slashless routes permanently redirect once to trailing-slash canonicals; `/actualities/` and `/actualites/` redirect to `/blog/`; the duplicate price article redirects to the price pillar.

## 6. Final sitemap

`scripts/generate-sitemap.mjs` currently emits 49 direct canonical routes: 37 French routes and 12 translated routes. `/pre-rendez-vous/`, private routes, legacy shells, redirects and 404 are excluded.

## 7. Hreflang setup

French, English, Spanish and German home, orthodontie-invisible, implantology and contact pages form reciprocal hreflang clusters with `x-default` pointing to the French homepage.

## 8. Content consolidation

See `docs/content-decisions.md`. Actualities and the duplicate price article were consolidated. Database-backed actuality records remain reachable through a noindex compatibility route.

## 9. Invisalign decision

Kept separate pending Search Console evidence. Brand-specific and generic-aligner intent are explicitly distinguished.

## 10. City-page decisions

Kept pending Search Console evidence. No new city page was added and every page discloses the Sète location.

## 11. Image-to-page mapping

See `docs/image-inventory.md`. The original five published scenes and the 20-image guide set are optimized and mapped by treatment, guide and gallery context.

## 12. Real versus generated classification

The supplied logo is a verified brand asset. The published clinical scenes are generated editorial assets and are not described as documentary photographs. Three potentially misleading images from the original set remain unpublished.

## 13. New implantology article list

- Les étapes de la pose d’un implant dentaire.
- Implant dentaire : douleur, anesthésie et cicatrisation.
- Remplacer une dent manquante : quelles solutions ?
- Bilan et imagerie avant un implant dentaire.
- Entretien et durée de vie d’un implant dentaire.
- Aligner les dents avant la pose d’un implant.

## 14. Multilingual route list

- `/en/`, `/en/invisible-orthodontics-sete/`, `/en/dental-implants-sete/`, `/en/contact/`
- `/es/`, `/es/ortodoncia-invisible-sete/`, `/es/implantes-dentales-sete/`, `/es/contacto/`
- `/de/`, `/de/unsichtbare-kieferorthopaedie-sete/`, `/de/zahnimplantate-sete/`, `/de/kontakt/`

Each translated route says that consultation in that language is not confirmed.

## 15. Analytics events implemented

Allow-listed GA4/dataLayer events cover pre-rendez-vous clicks, phone, email and map clicks, treatment-path clicks, language switching, and contact/pre-rendez-vous form submit, success and error states.

## 16. Accessibility improvements

Skip link, language-aware HTML, keyboard-accessible navigation and filters, visible focus, reduced-motion fallbacks, form status announcements, explicit image dimensions and descriptive alt text were added.

## 17. Performance improvements

Public forms, content pages, translations and admin are route-split. The guide renderer is prefetched from the guide hub and includes one-time stale-chunk recovery, preventing intermittent blank client navigations without inflating the initial bundle. Responsive AVIF/WebP images replace multi-megabyte PNG use. The restored desktop hero video remains the largest asset by explicit user request.

## 18. Build result

Run `npm run build`. Expected result: 49 sitemap routes, 57 redirect rules and a successful Vite production build.

## 19. SEO check result

Run `npm run seo:check`. The checker validates 49 sitemap routes plus `/pre-rendez-vous/` and a random 404 without binding a local HTTP port.

## 20. Screenshot locations

Automated screenshots are pending because the in-app browser backend was unavailable during this run. The local Vite server did start successfully; source, build and static-output checks were completed.

## 21. Manual Cloudflare actions remaining

Create the documented apex redirects for `www` and the exact production `pages.dev` hostname, preserving path and query. Test them after deployment. See `CLOUDFLARE-SEO-CONFIG.md`.

## 22. Manual local-authority actions remaining

Confirm identical NAP/hours on Google Business Profile, Doctolib, Santé.fr, PagesJaunes, Apple Maps and Bing Places. Do not mark this complete until each external profile is checked.

## 23. Medical content requiring dentist review

All six new implantology guides and existing generated orthodontie guides require practitioner review. Their current UI and metadata say review is pending.

## 24. Real photography still required

Exterior, entrance, reception, real practitioner portrait, treatment room, sterilisation area and actual equipment. See `docs/image-inventory.md`.

## 25. Video assets still required

Dedicated orthodontie and implantology explainer videos remain unconfigured. Empty video slots are not rendered. The original homepage hero video is restored.

## 26. Deliberately not changed

No Search Console-based redirect was guessed for Invisalign or city pages. No fake review, AggregateRating, specialist designation, guaranteed result, fabricated team photo or unconfirmed multilingual-consultation claim was added. Supabase credentials were not embedded in source.
