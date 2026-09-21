# Content and route decisions

Last updated: 2026-09-21

## Consolidated now

| Previous URL | Action | Destination | Reason |
| --- | --- | --- | --- |
| `/actualities/` and `/actualites/` | 301 | `/blog/` | One public guide hub. Legacy database-backed `/actualities/:id` content remains reachable through a noindex compatibility shell. |
| `/blog/prix-orthodontie-invisible-sete/` | 301 | `/prix-orthodontie-invisible-sete/` | The price pillar is the single canonical resource. The duplicate article was removed from sitemap and client routing. |

## Current treatment consolidation

The current routing consolidates `/invisalign/` into `/orthodontie-invisible-sete/`. Older orthodontics city variants for Frontignan, Mèze, Marseillan, Agde and Balaruc-les-Bains redirect to `/invisalign-bassin-de-thau/`. The full maintained mapping is in `scripts/generate-redirects.mjs`.

Existing implant pages for Frontignan, Balaruc-les-Bains and Mèze remain indexable. Each page states that the clinic is in Sète and does not claim a second location. No additional city page was created in the September GSC fix.

## Patient-facing language

Visible labels such as “maillage interne”, “mots-clés travaillés”, “page pilier”, “cluster prioritaire”, “city swap” and ranking language were removed from runtime and prerendered content. The automated SEO check fails if key strategy phrases return.

## Reviews

The homepage review rail uses only short positive excerpts visible in the supplied Google screenshots and labels them as public Google reviews. No AggregateRating schema is generated. No treatment-specific testimonial was fabricated. Treatment-specific animated cards are clearly questions, not patient reviews.

## Medical review status

New implantology articles use:

- author: `Équipe éditoriale du cabinet`
- publication date: `2026-07-12`
- modification date: `2026-07-13`
- medical review status: `pending`
- reviewer: none until the dentist confirms review

On 21 September 2026 the owner confirmed the dentists' approval of the 15 existing articles. `src/data/articleIndexingApprovals.js` explicitly lists them for indexing, bringing the sitemap to 49 URLs. New unapproved articles retain the review gate. Clinical content and publication/modification dates are unchanged.

The confirmation did not identify a reviewer or an actual review date. Those attribution fields remain unset; the article schema does not invent `reviewedBy` or `lastReviewed`. The existing `pending` review field records that incomplete attribution and no longer blocks the separately approved URLs.
