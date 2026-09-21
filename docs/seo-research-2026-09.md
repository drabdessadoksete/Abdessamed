# SEO and patient acquisition research — 20 September 2026

## Objective and evidence limits

Improve discovery and appointment enquiries for invisible orthodontics and dental implants, prioritising Sète and the Bassin de Thau. Preserve the practice's identity, qualifications, clinical information, location and treatment claims. Regional and national visibility should support that local practice, whose consultations take place in Sète.

This research combines public web searches, fetched practice/competitor pages, official search-engine documentation and the local route configuration. It is **not** a Google Search Console, Business Profile, rank-tracker or booking-system audit. No authenticated account data, search volumes, conversion rates, local map-pack positions or backlink totals were available. Search results are a sample and can contain older cached versions; they do not establish a stable ranking or the current HTTP response. Shell DNS access to the production domain was unavailable during this research, and the web tool could not retrieve production robots.txt or sitemap.xml. Those tool limitations do not establish a production outage.

## Main findings

1. **Existing content is an asset; publishing more near-identical pages is not the first priority.** The initial local configuration contained 50 SEO routes, 34 indexable. Fifteen clinical blog pages were intentionally excluded pending medical review, alongside the pre-appointment page. Retain that review gate; a technical SEO task cannot provide clinical sign-off.
2. **The search index contains different generations of the site.** The slashless orthodontic URL surfaced an older local page; the trailing-slash URL surfaced a newer comprehensive guide. Slashless `/about` and `/gallery` also surfaced a generic treatment-index introduction. This supports verifying redirects, canonicals, rendered-content parity and requesting recrawls after deployment; it does not prove that today's production routing is broken. Evidence: [older orthodontic URL](https://cabinetdentairesete.fr/orthodontie-invisible-sete), [canonical orthodontic URL](https://cabinetdentairesete.fr/orthodontie-invisible-sete/), [about](https://cabinetdentairesete.fr/about), [gallery](https://cabinetdentairesete.fr/gallery).
3. **The indexed implant page trails the repository version.** The fetched page still led with BioTech and an older unaccented title, whereas the local configuration already used “Implant dentaire à Sète”. Keep patient intent prominent in metadata while preserving verified brand/material information in the body. Evidence: [indexed implant page](https://cabinetdentairesete.fr/implantologie/).
4. **The practice has credible local facts to connect consistently.** The source configuration and contact page identify Dr Abdessamed Abdessadok, one address at RDC, 10 Bd Danièle Casanova, 34200 Sète, and 04 22 91 05 94. Keep these facts aligned across structured data, contact pages and owned listings; nearby towns are patient origins, not branch addresses. Evidence: [contact page](https://cabinetdentairesete.fr/contact/).

## Search intent and geographic priorities

These priorities are strategic judgments from the practice's location, existing pages and sampled results, **not measured keyword volumes**. Keep one primary destination per intent; support it with relevant existing information.

| Priority | Intent and example searches | Existing destination / action |
| --- | --- | --- |
| 1 | `implant dentaire Sète`, `implantologie Sète`, `dentiste implant Sète` | `/implantologie/`; connect price, alternatives, clinical assessment and contact |
| 1 | `orthodontie invisible Sète`, `Invisalign Sète`, `aligneurs transparents Sète` | `/orthodontie-invisible-sete/`; preserve one main treatment destination and redirect legacy equivalents |
| 1 | `prix implant dentaire Sète`, `prix orthodontie invisible Sète`, `devis Invisalign Sète` | Existing price pages; explain the existing assessment/devis process without inventing a fee or reimbursement promise |
| 2 | `implant dentaire Frontignan`, `implant Mèze`, `implant Balaruc-les-Bains` | Existing access/local pages with an explicit Sète address and links to the main implant guide |
| 2 | `orthodontie invisible Bassin de Thau`, nearby-town treatment searches | `/invisalign-bassin-de-thau/` and contact; preserve realistic information on attending appointments |
| 2 | `implant ou bridge`, `remboursement implant`, `remboursement orthodontie adulte`, `contention après aligneurs` | Existing decision pages answering a distinct question and linking to the relevant treatment route |
| 3 | Informational searches across Hérault, Occitanie, southern France and France | Existing educational guides after actual medical review; use clinical clarity and useful explanations rather than city-name duplication |

Do not change the professional title to “orthodontiste spécialiste” to match a keyword. The current source explicitly identifies a chirurgien-dentiste and lists qualifications without claiming that specialty. Brand terms should accurately describe the real treatment discussed, not imply an endorsement or unavailable service.

For distant patients, an enquiry remains useful only if the Sète consultation and follow-up arrangement works for them. National educational traffic is a secondary acquisition opportunity; a France-wide local-ranking claim would be misleading. Google says local visibility depends on relevance, distance and prominence, and accurate business information helps it understand the practice. [Google local-ranking guidance](https://support.google.com/business/answer/7091?hl=en).

## Sampled competitors and practical lessons

The sample searches included `"implant dentaire" "Sète"`, `"orthodontie invisible" "Sète"`, `"implant dentaire" "Frontignan"` and `"orthodontie invisible" "Mèze"`. Competitor inclusion below means the site appeared in this sample or was inspected; it does not imply a verified position or endorsement of its clinical claims.

| Practice / page | Observed presentation | Applicable lesson |
| --- | --- | --- |
| [Sète Orthodontie](https://www.seteorthodontie.fr/) | Named practitioners, explicit local address, child/adolescent/adult treatment navigation, access and contact paths | Clear identities, patient pathways and logistics matter; retain this practice's actual credentials |
| [Dr Goudier — implantology](https://selarl-dr-goudier-jacques.chirurgiens-dentistes.fr/implantologie-dentaire-sete/) and [surgery room](https://selarl-dr-goudier-jacques.chirurgiens-dentistes.fr/cabinet-dentaire-sete/salle-de-chirurgie-dediee/) | Dedicated implant page, practitioner background and specific facilities page | Connect existing verified qualifications and real facilities to treatment pages; do not copy outcome or safety claims |
| [OR THAU](https://dentiste-sete.fr/cabinet/) | Sète practice page presents several care pathways | Make the two priority treatments easy to discover without hiding general practice information |
| [DentalPole Frontignan — implant videos](https://cabinetdentairedentalpole.fr/content/implant-dentaire-vid%C3%A9o-frontignan-34) | Educational media alongside location and appointment links | Existing images/media should support understanding and lead naturally to a relevant consultation path |

## Technical work with the strongest justification

- Serve the correct route's meaningful HTML, metadata and links before client JavaScript executes. Keep the canonical URL identical before and after hydration. Distinct routes need distinct titles/descriptions, and missing pages need appropriate status handling. [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
- Keep HTTPS, host, trailing slash, legacy redirects, canonical links, sitemap entries and internal links aligned. Consolidate genuinely equivalent legacy routes into their corresponding primary pages. Avoid blanket redirects to the homepage. [Google canonicalisation guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- Describe the real practice and practitioner with consistent structured-data identifiers and visible matching facts. Use actual address, hours, phone, profiles and relevant page relationships; never manufacture review scores, credentials, outcomes or branch locations. Structured data helps interpretation and eligibility, not guaranteed placement. [Google LocalBusiness documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business).
- Improve relevant links between existing treatment, price, decision, access and booking pages. Visitors should be able to answer a question, find the relevant treatment and request an appointment without searching through a long generic footer.
- Use only canonical, indexable pages in the sitemap. Dates must represent actual substantive changes, not the latest build time. Keep review-pending pages outside discovery feeds intended to promote published content. [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a).
- Do not add large sets of interchangeable city pages, keyword lists or purchased ranking links. Local pages must independently help a patient, especially with truthful logistics. [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies).

## AI discovery: practical requirements

**Google Search and its AI features:** normal SEO, original useful information, accessible pages and consistent entities remain the foundation. Google explicitly says special AI schema and `llms.txt` are unnecessary; it ignores `llms.txt` for ranking. An existing file can remain a convenience for other systems, but should not be described as an AI ranking improvement. [Google's AI optimisation guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

**FAQ content:** real patient questions still help readers, but Google stopped displaying FAQ rich results on 7 May 2026 and removed the feature documentation in June. Do not promise FAQ rich-result traffic. [Google documentation changelog](https://developers.google.com/search/updates).

**ChatGPT search:** OpenAI's official crawler documentation distinguishes `OAI-SearchBot` for search from `GPTBot` for model training. Search access can be allowed independently of training access. Check deployed robots rules and CDN/firewall access; a permissive local robots file cannot prove that the production CDN permits requests. `ChatGPT-User` is a separate agent for user-initiated visits, not the switch for search inclusion. No citation or recommendation is guaranteed. Verified using the OpenAI Docs skill and [official OpenAI crawler documentation](https://developers.openai.com/api/docs/bots).

**Bing/Copilot:** Bing offers AI citation and grounding-query reporting in Webmaster Tools. These measures describe citations, not bookings, authority or stable rankings. Inspect cited pages and trends alongside ordinary search traffic. [Bing AI Performance documentation](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c). After deployment, IndexNow can notify participating engines of changed URLs once a valid key is hosted; notifications do not guarantee crawling or indexing. [Bing IndexNow setup](https://www.bing.com/indexnow/getstarted).

## Conversion and measurement plan

The principal success measure is qualified enquiries that become attended consultations for the two target services. Rankings, traffic and AI citations are supporting indicators.

| Stage | Measure | Interpretation |
| --- | --- | --- |
| Search discovery | Search Console impressions/clicks for each treatment and nearby location; indexed canonical pages | Whether relevant people can discover the correct pages |
| Local discovery | Business Profile website, call and direction interactions | Local engagement, not confirmed consultations |
| Website intent | Booking-link clicks, phone clicks, successful contact or pre-appointment submissions | Separate clicks from successfully delivered requests |
| Reception outcome | Qualified request, consultation booked, consultation attended | Practice-held operational counts, not a diagnosis sent to marketing analytics |
| AI discovery | Available Google generative-AI reports, Bing cited URLs, observable referral visits | Trend signals; not a complete record of AI exposure |

Keep names, email addresses, phone numbers, free-text messages and medical details out of analytics payloads. Avoid recording sensitive treatment interests against identifiable visitors. Review aggregate enquiries and attended consultations for equal periods before/after deployment, with seasonality and capacity in mind. A phone click is not a completed call, and a Doctolib click is not a confirmed booking.

Suggested review schedule: capture a baseline before deployment; confirm delivery, indexability and form behaviour immediately after; review crawl/index changes after two weeks; compare acquisition and consultation trends monthly. Do not set a numerical uplift target before a reliable baseline exists.

## External actions for the practice owner

These are an operational checklist, not completed account changes or messages sent to third parties.

1. Verify ownership/access in Google Search Console and Bing Webmaster Tools. Submit the deployed canonical sitemap; inspect the two treatment pages, their main price pages and legacy redirect destinations. Use URL inspection to confirm what the engine actually rendered.
2. Check Google Business Profile and Bing Places for the real name, primary professional category, address, phone, hours, website and appointment link. Select categories that describe the actual practice and qualifications. Do not add city/treatment keywords to the business name unless they are genuinely part of it. Bing specifically recommends accurate local listings for AI discovery. [Bing's AI Performance announcement](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview).
3. Reconcile practice-owned Doctolib and relevant official/professional directory records with the same facts. Correct old addresses or duplicate listings through the platforms' normal ownership process. Do not purchase bulk directory links.
4. Arrange actual practitioner review of the existing clinical articles. Record reviewer identity and substantive review date only after the work occurs, then publish eligible articles through the existing process.
5. Maintain accurate, original practice photos and educational materials the practice has permission to use. Useful local professional references can be earned through real activity; do not manufacture mentions or contact patients for marketing without a separate, appropriate basis.

## Dental communication boundaries relevant to acquisition

French public-health rules allow factual information about a dentist's practice and qualifications, with honest, measured educational information. They prohibit using third-party testimonials in that communication, comparisons with other practitioners and misleading claims. Preserve the existing factual credentials; avoid testimonial widgets, “best dentist” claims or guaranteed outcomes. [Code de la santé publique, R4127-215-1 and R4127-220](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072665/LEGISCTA000006196413/).

R4127-217 also restricts obtaining priority digital placement through payment or other means; paid search placement should not be assumed to be an available acquisition tactic. The current work is organic technical discoverability and factual patient information. [R4127-217](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000042795963).

Do not incentivise favourable reviews. The Ordre's 2024 activity report describes disciplinary treatment of a free-whitening contest linked to positive Google reviews. [Ordre national activity report](https://www.ordre-chirurgiens-dentistes.fr/wp-content/uploads/dlm_uploads/2025/07/RA_2024_INTERACTIF.pdf). These concrete boundaries guide implementation; they do not prevent completing the authorised website improvements.
