# SEO implementation and deployment handoff — 21 September 2026

## Scope and status

Implemented in the local project and rebuilt `dist`. Production, business listings, Search Console, Bing, GA administration and Supabase have not been changed. No messages, review requests or outreach were sent.

The acquisition focus is invisible orthodontics and implants in Sète and the Bassin de Thau. Regional/national visibility should come through the existing useful educational resources and a clear invitation to consult in Sète. The supplied clinical text, identity, address, phone, qualifications and treatment scope were preserved. Following the owner's confirmation of the dentists' approval on 21 September, the 15 existing articles are now eligible for indexing. No new location pages or medical claims were created.

Read [the sourced research report](seo-research-2026-09.md) for search intent, sampled competitors and platform guidance. Search impressions, rankings, bookings and conversion improvements have not been measured; these require production account data and an observation period.

## Changes delivered

| Finding | Implementation | Why it matters |
| --- | --- | --- |
| Hand-written static summaries differed from the actual React pages | Build-time rendering now uses the same App and public components, with Helmet-generated metadata; all 50 public routes have readable HTML before JavaScript | Search engines and text-based tools receive the actual page, including content and navigation |
| Initial animation styles could hide rendered content | Build output publishes the visible state; existing browser animations remain | Content remains readable without JavaScript |
| Entity descriptions and page metadata diverged between initial load and navigation | Shared practice, practitioner, website and page graphs; stable IDs; complete social metadata; React Helmet owns generated head tags | Consistent interpretation and previews; previous route metadata can be replaced correctly |
| Translated treatment/contact x-default links pointed to the homepage | Each language group points to its French equivalent in HTML and sitemap | Correct international page relationships |
| Sitemap lastmod was derived from local filesystem timestamps | Use recorded editorial dates where available and omit unverifiable dates | Rebuilds no longer fabricate content freshness |
| Other supported host configurations returned the homepage for unknown URLs | Removed Netlify/Vercel/Apache catch-all homepage rewrites; generate legacy redirects and preserve 404.html | Prevents missing URLs from masquerading as successful homepage responses |
| Long guide navigation and conversion paths were weak | Added in-page contents with stable anchors, treatment-specific appointment links, local contact panel, and main-treatment navigation | Makes existing answers and the next step easier to find |
| Implant budget/access pages were difficult to discover | Homepage links to implant pricing and existing Frontignan/Balaruc/Mèze pages; guide hub links to existing decision pages | Strengthens useful internal paths for local and informational intent |
| Some multiline article units lost every line after the first | Fixed the article parser and added regression checks; the SEO check compares supplied editorial text with generated HTML | Restores existing content without rewriting it |
| Callback selection/errors needed clearer handling | Preserved treatment selection from page links; accessible field errors; email required when email contact is selected; clear saved-request state and phone fallback | Reduces avoidable form friction without promising an appointment before confirmation |
| Supabase analytics code was included in the initial browser bundle | Analytics client now loads only when a consenting visitor generates a measurement event | Initial JS fell from 616.39 KB / 187.87 KB gzip in the first implementation build to approximately 420 KB / 137 KB gzip; this is a build comparison, not a measured Core Web Vitals result |
| AI referral visits were grouped into generic referrals | Coarse ChatGPT, Perplexity, Gemini, Claude and Copilot labels; exact hostname/subdomain matching; dashboard labels and a migration for existing ingestion functions | Makes observable consenting referrals distinguishable; requires backend deployment |
| Manual GA events could inherit query/referrer data | Explicit sanitized page context and allow-listed event parameters; treatment selection/form values excluded from manual event parameters | Keeps submitted information out of the events controlled by this code |

The existing `llms.txt` is a factual directory, now deduplicated and restricted to eligible pages. It is not a special ranking mechanism. The existing robots file already allows public crawling; production CDN access remains a separate check. [Google AI guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots).

## Verification

Commands:

```sh
npm run seo:check
npm test
git diff --check
```

The SEO checks cover 50 public routes, 49 sitemap URLs including the 15 approved articles, and pre-appointment exclusions, plus private shells and the 404 document. They check initial titles/H1s, canonicals, languages/reciprocal alternates, required structured-data types, resolved entity references, image files, internal links, anchor targets, preservation of clinical body text, safe POST form markup, and routing configuration. The eight unit checks cover article approvals, restored article lines, heading anchors, and referral classification including malformed/impersonating hosts.

The subsequent GSC fix also passed 89 HTTP checks against Cloudflare's local Wrangler 4.135.0 runner. This reproduced the rejected legacy rewrite before the fix and verified its clean destination afterward. A read-only production baseline was captured; the new deployment and the outstanding dashboard host redirect must be checked again with `npm run seo:live`. See [GSC evidence and validation instructions](gsc-2026-09-21-evidence.md).

The in-app browser returned no available backend, so visual/browser interaction verification was not available. No live patient request was submitted and the SQL migration was not executed against a database. There is no measured Lighthouse or Core Web Vitals score in this report.

## Deployment order

1. Apply `supabase/migrations/20260921001000_ai_referral_sources.sql` using the project's normal migration process. It replaces the two existing analytics functions with the same signatures, consent checks, privileges, retention and aggregation logic; the only functional change is the source allow-list. It does not rewrite historical events.
2. Deploy `supabase/functions/analytics-ingest/index.ts` so the Edge Function accepts the same new labels. Without both backend updates, new AI labels fall back to `other`; appointment handling is unaffected.
3. Deploy the complete freshly built `dist` using the existing hosting pipeline. Preserve environment configuration and generated route/404 files.
4. In the existing GA4 web stream, inspect Enhanced Measurement. Disable automatic history-based page views and automatic form interactions if manual events are used, and validate that no query/form data is sent. `send_page_view: false` controls manual configuration but does not disable every Enhanced Measurement feature. [Google pageview guidance](https://developers.google.com/analytics/devguides/collection/ga4/views), [Enhanced Measurement](https://support.google.com/analytics/answer/9216061?hl=en).
5. Verify homepage, both treatment pages, a price page, each translated treatment, an old URL and a random missing URL on the actual host. Check one-hop permanent redirects, self-canonicals and a real 404. Check `www`, the exact Pages preview hostname and CDN bot access using [the existing Cloudflare instructions](../CLOUDFLARE-SEO-CONFIG.md).
6. In a browser at mobile/tablet/desktop sizes, check menus, contents links, both treatment-to-form selections, invalid fields, phone links, consent, and a controlled test request through a staging backend. Check client navigation from an article to home for stale metadata. Do not use real patient details as test data.
7. Submit `https://cabinetdentairesete.fr/sitemap.xml` through the verified Google Search Console and Bing Webmaster Tools accounts. Inspect the two main treatment pages and price pages and request recrawling. Verify accurate Google Business Profile/Bing Places/Doctolib facts through their owner accounts.

## Measurement and next priorities

Capture a baseline before deployment and compare equal periods, accounting for seasonality and appointment capacity. Separate search impressions/clicks, phone/appointment clicks, successfully delivered requests, qualified enquiries, and attended consultations. Reception outcomes belong in the practice's operational records; a website click is not a patient acquisition.

AI source attribution only observes an available referrer or explicit source label after analytics consent. It misses apps that suppress referrers, unclicked citations and other unobservable exposure. Google and Bing AI citation reports provide complementary evidence where available.

The 15 clinical blog articles are now indexable through the explicit approval list in `src/data/articleIndexingApprovals.js`. The owner confirmed the dentists' agreement; a named reviewer and actual clinical review date were not supplied, so no such attribution was invented. Future articles still require their own approval or an identified completed review. Existing editorial dates and clinical text are unchanged.

First geographic priority: Sète, Frontignan, Balaruc-les-Bains, Mèze and the wider Bassin de Thau. Existing guidance also serves Marseillan and Agde. Hérault, Occitanie, southern France and national educational visibility are secondary goals, with the actual Sète consultation/follow-up location kept clear.
