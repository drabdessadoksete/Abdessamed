# Search Console evidence and URL disposition — 21 September 2026

This inventories the 14 screenshots supplied by the site owner, maps them to current routing and indexing decisions, and separates the production baseline from desired behaviour after deployment. It does not claim that the new changes are live, that Google has recrawled them, or that indexing is guaranteed. The owner will push and deploy the changes.

The screenshots show the domain property `cabinetdentairesete.fr`, report data last updated **18 September 2026**, **31 indexed URLs** and **58 non-indexed URLs**. The total includes old addresses, slash variants, host variants and intentionally excluded pages; it is not a count of 58 broken current pages. The previous release had 50 public routes and 34 sitemap-eligible URLs. The owner has since confirmed the dentists’ approval to index the 15 existing articles. The local approval list explicitly identifies those articles, raising intended sitemap eligibility to 49 URLs. It does not invent a reviewer name or clinical review date. Pre-appointment, login/admin and legacy article shells remain excluded.

## Coverage and age of the supplied evidence

| GSC category | Reported URLs | Visible examples | Dates visible in the examples |
| --- | ---: | ---: | --- |
| Page avec redirection | 21 | 10 | 6–18 September 2026 |
| Exclue par la balise « noindex » | 14 | 10 | 21 July–17 September 2026 |
| Erreur liée à des redirections | 9 | 9 | All last crawled 19 May 2026 |
| Autre page avec balise canonique correcte | 4 | 4 | 16 April–31 August 2026 |
| Explorée, actuellement non indexée | 8 | 8 | 24 March–12 August 2026 |
| Détectée, actuellement non indexée | 2 | 2 | No crawl date; « Sans objet » |

There are **43 visible example rows**. The screenshots omit the remaining **11 redirect examples** and **4 noindex examples**. Those omitted URLs have not been inferred. The historical last-crawl dates, especially the nine entries from May, do not establish the current HTTP response or diagnose a present redirect loop. A current live fetch is required.

## Production baseline before the new changes

The read-only capture `/private/tmp/abdessamed-gsc-live-before.json`, timestamped `2026-09-21T13:09:48.554Z`, records:

- All nine URLs in the screenshot’s redirect-error category already terminate after one `301` at a `200` response. Their article destinations still carried `noindex` at capture time.
- `https://www.cabinetdentairesete.fr/` returned `200` with an apex-domain canonical, rather than a host redirect. The `www` Marseillan URL redirected to the Bassin de Thau page on `www`, whose canonical pointed to the apex domain.
- Both listed `/actualities/:id` addresses returned `404`; the desired compatibility access therefore needs repair and verification.
- `/implant-dentaire-balaruc-les-bains/`, `/contention-apres-aligneurs/` and `/de/kontakt/` returned `200`, allowed indexing and specified their own canonical URLs.
- The live sitemap contained 34 URLs before the new article approval. HTTP apex redirected to HTTPS apex.

These are HTTP observations, not a Googlebot crawl or Search Console live test. No post-deployment result is asserted here.

## Implemented fix and local verification

- The explicit article approval list makes all 15 approved articles indexable. Generated HTML, sitemap and `llms.txt` now agree; the sitemap contains 49 URLs. Article text and editorial dates are unchanged. No named reviewer or review date was invented.
- Cloudflare Wrangler 4.135.0 reproduced both legacy UUID 404s. Its parser rejected `/actualities/* /legacy-actuality/index.html 200` as a potential normalization loop and ignored that rule. Changing the target to `/legacy-actuality/` produced **79 valid rules with no invalid-rule warning**, `200` responses for both UUIDs, and preserved their original URLs and noindex directives.
- `npm run seo:check` passed for 50 public routes and 49 sitemap URLs, including the clinical content preservation checks. The final static check also covers the two legacy rewrite regressions.
- `npm test` passed all eight tests, including explicit approval of existing articles and continued exclusion of new unapproved articles.
- The HTTP checker passed **89 URLs with zero failures** against the rebuilt site in Wrangler. It checks all 43 screenshot examples, every public canonical page, sitemap membership, robots directives, canonicals, query preservation, one-hop configured redirects, and a real 404. The local override cannot test production hostname/HTTPS rules; those checks remain for after deployment.
- `git diff --check` passed. The generated `dist` is rebuilt. Nothing was pushed, deployed or validated in Search Console by this task.

Reproduce local HTTP verification in two terminals:

```sh
npx wrangler@4.135.0 pages dev dist --ip 127.0.0.1 --port 8788 --compatibility-date=2026-09-18
```

```sh
npm run seo:live -- --base-url=http://127.0.0.1:8788 --output=/tmp/gsc-local.json
```

After deployment, apply/verify the [Cloudflare `www` host rule](../CLOUDFLARE-SEO-CONFIG.md) and run `npm run seo:live -- --output=/tmp/gsc-production.json` without a local override. The production check is expected to fail until the new build and host rule are live. A passing response check does not verify the contents or availability of database-backed legacy articles after JavaScript loads, and does not guarantee Google's indexing decision.

## Expected result for each visible URL

Unless an entire URL is shown, paths below start at `https://cabinetdentairesete.fr`. “Eligible” means the current source permits indexing and the destination should be in the sitemap; it is not confirmation of Google's index selection. A permanent redirect must terminate at the stated destination without a loop. Requests to an indexable final destination should return `200` with its own canonical URL.

### Page avec redirection — 10 of 21 examples

These are intended URL consolidations in the source. The old address should continue to redirect; the final address is the one to inspect for indexing.

| Screenshot URL | Last crawl | Desired final address | Desired indexing outcome |
| --- | --- | --- | --- |
| `/services` | 2026-09-18 | `/services/` | Permanent redirect; destination eligible |
| `/invisalign-marseillan` | 2026-09-17 | `/invisalign-bassin-de-thau/` | Permanent redirect; destination eligible |
| `/orthodontie-invisible-agde` | 2026-09-14 | `/invisalign-bassin-de-thau/` | Permanent redirect; destination eligible |
| `/invisalign` | 2026-09-14 | `/orthodontie-invisible-sete/` | Permanent redirect; destination eligible |
| `/contact` | 2026-09-09 | `/contact/` | Permanent redirect; destination eligible |
| `/gallery` | 2026-09-07 | `/gallery/` | Permanent redirect; destination eligible |
| `http://cabinetdentairesete.fr/` | 2026-09-07 | `https://cabinetdentairesete.fr/` | Permanent HTTPS redirect; destination eligible |
| `/implantologie` | 2026-09-07 | `/implantologie/` | Permanent redirect; destination eligible |
| `/blog/prix-orthodontie-invisible-sete` | 2026-09-06 | `/prix-orthodontie-invisible-sete/` | Permanent redirect; destination eligible |
| `/blog/prix-orthodontie-invisible-sete/` | 2026-09-06 | `/prix-orthodontie-invisible-sete/` | Permanent redirect; destination eligible |

### Exclue par la balise « noindex » — 10 of 14 examples

The visible article destinations were excluded in the screenshots and production baseline. The owner’s subsequent confirmation authorizes indexing the 15 listed existing articles, including these destinations. They should become eligible after deployment. Login remains private and must remain noindex. The approval list does not automatically authorize future articles.

| Screenshot URL | Last crawl | Desired final address | Desired indexing outcome |
| --- | --- | --- | --- |
| `/blog/bilan-imagerie-avant-implant/` | 2026-09-17 | Same URL | `200`, eligible under the explicit article approval |
| `/blog/dents-chevauchees-espaces-visibles-correction-sete/` | 2026-08-07 | Same URL | `200`, eligible under the explicit article approval |
| `/blog/orthodontie-invisible-quotidien-repas-entretien-parole/` | 2026-07-25 | Same URL | `200`, eligible under the explicit article approval |
| `/blog/verite-invisalign-taquets-temps-port-gene` | 2026-07-25 | `/blog/orthodontie-invisible-quotidien-repas-entretien-parole/` | Permanent redirect; destination eligible under the explicit article approval |
| `/blog/verite-invisalign-taquets-temps-port-gene/` | 2026-07-24 | `/blog/orthodontie-invisible-quotidien-repas-entretien-parole/` | Permanent redirect; destination eligible under the explicit article approval |
| `/login` | 2026-07-22 | `/login/` | Canonical login address; noindex, nofollow |
| `/login/` | 2026-07-22 | Same URL | `200`, noindex, nofollow |
| `/blog/aligner-dents-avant-implant` | 2026-07-22 | `/blog/aligner-dents-avant-implant/` | Permanent redirect; destination eligible under the explicit article approval |
| `/blog/aligner-dents-avant-implant/` | 2026-07-22 | Same URL | `200`, eligible under the explicit article approval |
| `/blog/duree-orthodontie-invisible-sete` | 2026-07-21 | `/blog/duree-orthodontie-invisible-sete/` | Permanent redirect; destination eligible under the explicit article approval |

### Erreur liée à des redirections — all 9 examples

Every example was last crawled on **19 May 2026**, also the category's first-detected date in the screenshot. The production baseline already returns one `301` followed by `200` for each of these nine URLs. Recheck after deployment before requesting GSC validation; this historical category is not evidence of a current loop. Their article destinations should become indexable under the new explicit approval.

| Screenshot URL | Last crawl | Desired final address | Desired indexing outcome |
| --- | --- | --- | --- |
| `/blog/orthodontie-invisible-adulte-30-40-50-ans` | 2026-05-19 | `/blog/orthodontie-invisible-adulte-30-40-50-ans/` | Permanent redirect; destination eligible under the explicit article approval |
| `/blog/orthodontie-invisible-quotidien-repas-entretien-parole` | 2026-05-19 | `/blog/orthodontie-invisible-quotidien-repas-entretien-parole/` | Permanent redirect; destination eligible under the explicit article approval |
| `/blog/orthodontie-bassin-de-thau-suivi-sete` | 2026-05-19 | `/invisalign-bassin-de-thau/` | Permanent redirect; destination eligible |
| `/blog/orthodontie-invisible-sete-questions-avant-bilan` | 2026-05-19 | `/orthodontie-invisible-sete/` | Permanent redirect; destination eligible |
| `/blog/dents-chevauchees-espaces-visibles-correction-sete` | 2026-05-19 | `/blog/dents-chevauchees-espaces-visibles-correction-sete/` | Permanent redirect; destination eligible under the explicit article approval |
| `/blog/dents-qui-rebougent-apres-appareil-sete` | 2026-05-19 | `/blog/dents-qui-rebougent-apres-appareil-sete/` | Permanent redirect; destination eligible under the explicit article approval |
| `/blog/orthodontie-adulte-sete-questions-avant-traitement` | 2026-05-19 | `/blog/orthodontie-adulte-sete-questions-avant-traitement/` | Permanent redirect; destination eligible under the explicit article approval |
| `/blog/orthodontie-sete-quand-consulter-alignement-dentaire` | 2026-05-19 | `/orthodontie-sete/` | Permanent redirect; destination eligible |
| `/orthodontie-sete` | 2026-05-19 | `/orthodontie-sete/` | Permanent redirect; destination eligible |

### Autre page avec balise canonique correcte — all 4 examples

The current preferred host is the HTTPS apex domain. The three retired city URLs consolidate into the existing Bassin de Thau page. Verify host consolidation and the final destination in production; the screenshots themselves only report Google's earlier canonical classification.

| Screenshot URL | Last crawl | Desired final address | Desired indexing outcome |
| --- | --- | --- | --- |
| `https://www.cabinetdentairesete.fr/` | 2026-08-31 | `https://cabinetdentairesete.fr/` | Permanent host redirect; apex homepage eligible |
| `/orthodontie-invisible-meze/` | 2026-06-24 | `/invisalign-bassin-de-thau/` | Permanent redirect; destination eligible |
| `/orthodontie-invisible-agde/` | 2026-05-22 | `/invisalign-bassin-de-thau/` | Permanent redirect; destination eligible |
| `https://www.cabinetdentairesete.fr/invisalign-marseillan/` | 2026-04-16 | `https://cabinetdentairesete.fr/invisalign-bassin-de-thau/` | Permanent host/path consolidation; destination eligible |

### Explorée, actuellement non indexée — all 8 examples

The first entry is already index-eligible in production. Two article entries become eligible under the new explicit approval. Three entries are retired/hub addresses and two are legacy article IDs; those source URLs should not all be made indexable.

| Screenshot URL | Last crawl | Desired final address | Desired indexing outcome |
| --- | --- | --- | --- |
| `/implant-dentaire-balaruc-les-bains/` | 2026-08-12 | Same URL | `200`, eligible, own canonical; check Google's live fetch and selected canonical |
| `/blog/orthodontie-invisible-adulte-30-40-50-ans/` | 2026-07-16 | Same URL | `200`, eligible under the explicit article approval |
| `/blog/orthodontie-sete-quand-consulter-alignement-dentaire/` | 2026-07-16 | `/orthodontie-sete/` | Permanent redirect; destination eligible |
| `/blog/orthodontie-adulte-sete-questions-avant-traitement/` | 2026-07-15 | Same URL | `200`, eligible under the explicit article approval |
| `/orthodontie-adulte-balaruc-les-bains/` | 2026-07-03 | `/invisalign-bassin-de-thau/` | Permanent redirect; destination eligible |
| `/actualities/39fadf61-8196-4e3d-bc2f-c7d9d953619d` | 2026-04-10 | Same article ID; compatibility routing | Noindex legacy article; preserve the existing article URL rather than inventing a replacement |
| `/actualities` | 2026-04-10 | `/blog/` | Permanent redirect; destination eligible |
| `/actualities/84603478-f35f-4f74-9052-a9ff3f01e632` | 2026-03-24 | Same article ID; compatibility routing | Noindex legacy article; preserve the existing article URL rather than inventing a replacement |

The eight rows contain **two** newly approved articles, **three** retired/hub addresses, **two** legacy article IDs and **one** already eligible current page. The baseline returned `404` for both legacy IDs. Repairing their compatibility route should restore access to the existing application; article contents and database availability still require application verification.

### Détectée, actuellement non indexée — both examples

| Screenshot URL | Last crawl | Desired final address | Desired indexing outcome |
| --- | --- | --- | --- |
| `/contention-apres-aligneurs/` | Sans objet | Same URL | `200`, eligible, own canonical, sitemap and crawlable internal links |
| `/de/kontakt/` | Sans objet | Same URL | `200`, eligible, own canonical, German metadata and reciprocal language links |

## What to validate after deployment

Expected redirects, deliberate noindex pages and correct canonical duplicates can remain excluded. Redirect errors need working redirect chains. The two “currently not indexed” categories do not by themselves identify a code error or promise eventual indexing. Validate an issue only after addressing all affected instances in the scope being validated; Google may update reports through normal recrawling, and a remaining instance can cause validation to fail. A completed redirect-error validation is not the same as indexing its destination. [Google: Page indexing report](https://support.google.com/webmasters/answer/7440203?hl=en).

For this site, use this order:

1. Deploy the complete build and verify the nine redirect-error source URLs and their final destinations on the actual production host. Also verify HTTPS, `www`, legacy article behaviour, and the three currently eligible addresses in the “currently not indexed” tables. Save response chains and metadata as fresh evidence.
2. In **Erreur liée à des redirections**, run **Valider la correction** only when the current production checks confirm that the affected redirects terminate successfully. Do not claim the screenshot's May observations are already cleared.
3. Keep **Page avec redirection** and **Autre page avec balise canonique correcte** as expected exclusions for old/duplicate URLs. For **Exclue par la balise « noindex »**, verify the approved article destinations now permit indexing, while login/admin, pre-appointment and legacy shells remain excluded. After GSC reads the updated sitemap, filter the report to that sitemap and inspect the affected list before validating the corrected article noindex exclusions in that scope. If the scope still includes intentionally excluded URLs, use individual URL inspection/indexing requests for the approved articles instead of claiming the entire noindex category is fixed. Do not remove private-page exclusions to obtain a zero count.
4. Use **Inspection de l'URL → Tester l'URL publiée** for `/implant-dentaire-balaruc-les-bains/`, `/contention-apres-aligneurs/` and `/de/kontakt/`, plus the newly approved article destinations and the main orthodontics/implantology landing pages. Review fetch success, indexing permission and rendered HTML. The live test measures present access; the indexed report records Google's last processing and canonical choice. A successful live test does not guarantee indexing. [Google: URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en).
5. Submit/check the canonical sitemap and request indexing of the eligible priority pages after the live checks pass. Repeated requests do not speed processing; crawling can take days to weeks and inclusion is not guaranteed. [Google: request recrawling](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
6. Compare later crawl dates and individual statuses after Google processes the deployment. Export the 15 example rows missing from the screenshots before claiming complete URL-by-URL coverage of all 58 reported exclusions.

## Local sources for the desired mappings

- [Public routes and indexability](../src/config/seoRoutes.js)
- [Canonical origin](../src/config/site.js)
- [Generated redirect rules](../scripts/generate-redirects.mjs)
- [Private and legacy noindex handling](../src/App.jsx)
- [Explicit approval of the 15 existing articles](../src/data/articleIndexingApprovals.js)
- [Existing content decisions](content-decisions.md)
- [Hosting verification instructions](../CLOUDFLARE-SEO-CONFIG.md)

This inventory does not alter clinical facts, article text, reviewer records, route code or production settings. The article indexing approval is recorded separately in the linked source file.
