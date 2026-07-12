# Content and route decisions

Last reviewed: 2026-07-13

## Consolidated now

| Previous URL | Action | Destination | Reason |
| --- | --- | --- | --- |
| `/actualities/` and `/actualites/` | 301 | `/blog/` | One public guide hub. Legacy database-backed `/actualities/:id` content remains reachable through a noindex compatibility shell. |
| `/blog/prix-orthodontie-invisible-sete/` | 301 | `/prix-orthodontie-invisible-sete/` | The price pillar is the single canonical resource. The duplicate article was removed from sitemap and client routing. |

## Kept separate pending evidence

`/invisalign/` remains distinct from `/orthodontie-invisible-sete/`. The first page explains the branded Invisalign protocol; the second covers clear-aligner candidacy and treatment more generally. No Search Console export was supplied, so a redirect would be evidence-free.

Nearby-city pages remain indexable for now. Each page explicitly states that the clinic is in Sète and does not claim a second location. No additional city page was created. Impressions, clicks, queries, position and backlinks must be compared in Search Console before keeping, merging or redirecting them.

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

The article schema does not claim `reviewedBy` while review remains pending.
