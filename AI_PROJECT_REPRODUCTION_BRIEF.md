# The Porters — AI Project Reproduction Brief

> Give this file to an AI coding agent when you want it to create a new project, or modify an existing project, so that it matches The Porters in visual language, structure, responsiveness, and behavior.

## 1. Agent mission

Reproduce the current The Porters website as a polished, responsive French marketing site for a premium portage-salarial company focused on independent IT consultants and enterprise clients.

The result must feel like the same product, not merely use similar colors. Preserve:

- the editorial, human, premium tone;
- the slate-navy, warm-white, and muted-gold brand system;
- the large photo-led hero and alternating editorial sections;
- the central audience split between consultants and companies;
- the fixed adaptive navigation, mega menus, mobile accordion menu, and footer;
- the simulator, contact flows, FAQs, carousels, marquees, scroll reveals, and admin interactions;
- the French content architecture, SEO behavior, accessibility, and responsive layout.

If modifying an existing project, first inventory its framework, routes, components, styles, content source, assets, and existing behavior. Reuse sound architecture. Replace the design system and page composition incrementally without deleting unrelated working features.

## 2. Source of truth and known snapshot issue

When this brief is stored inside the original repository, these files are the highest-fidelity references:

- `src/styles/global.css` — complete public design system and responsive behavior;
- `src/components/layout/SiteHeader.astro` — desktop mega navigation, mobile menu, sticky behavior, and reading progress;
- `src/components/layout/SiteFooter.astro` — global footer;
- `src/pages/index.astro` — homepage data and section order;
- `src/pages/` — public route implementations;
- `src/data/` — site content and dynamic route data;
- `src/components/forms/SimulatorForm.tsx` — live calculator behavior;
- `src/components/forms/ContactForm.tsx` — contact flow behavior;
- `src/layouts/AdminLayout.astro`, `src/styles/admin.css`, and `src/components/admin/` — admin application;
- `images/` and `public/images/` — photographic and logo assets.

Important snapshot note: `src/components/home/HomeHeroCarousel.tsx` currently has an uncommitted edit that changes its prop contract from `audiences` to `slides`, while `src/pages/index.astro` still passes `audiences`. It also contains the malformed fragment `type Props = {also`. This makes the homepage fail during prerendering. Do not reproduce this mismatch. The intended homepage contract is the last committed audience-based implementation, which accepts `audiences` and an optional child review badge. The page data, audience-hero classes in `global.css`, and the other `Hero*` components agree with that committed contract.

## 3. Product and content model

The Porters serves two primary audiences:

1. Independent consultants, especially IT, data/AI, cyber, cloud/DevOps, agility, product, and project professionals.
2. Companies that need external experts without direct-hire administrative complexity.

The brand promise is freedom plus support: the consultant keeps the mission and autonomy; The Porters manages contracts, payroll, billing, expenses, and administration. The voice is clear, reassuring, direct, competent, and human. Avoid startup hype, legalistic overload, or luxury clichés.

Default language is French (`<html lang="fr">`). Use correct French typography and accents. The canonical production origin is `https://www.porters.fr`.

## 4. Technology and architecture

Match the current implementation unless the target project requires an equivalent stack:

- Astro 7, static output;
- React 19 islands only for stateful UI;
- Tailwind CSS 4 through the Vite plugin;
- TypeScript and ESM;
- `@astrojs/sitemap`;
- Node 22.12 or newer.

Architecture rules:

- Render content-heavy pages statically.
- Hydrate only interactive islands. The hero uses `client:load`; contact and simulator use `client:visible`; admin screens use `client:load`.
- Keep content in typed data modules under `src/data`, not duplicated across page files.
- Use dynamic routes for agencies, expertise pages, blog posts, and blog categories.
- Keep public and admin layouts visually and structurally isolated.
- Use semantic HTML, one meaningful `h1` per page, usable keyboard focus, labeled controls, and reduced-motion fallbacks.

Equivalent frameworks are acceptable only if they preserve static rendering, route coverage, hydration discipline, metadata, accessibility, and behavior.

## 5. Core visual system

### Colors

Public brand tokens:

| Token | Value | Use |
|---|---:|---|
| White | `#FFFFFF` | Main backgrounds, cards, reversed text |
| Slate navy | `#283743` | Primary headings, body identity, dark sections, buttons |
| Muted gold | `#BE9E58` | Eyebrows, rules, accents, active states |
| Warm gray section | approximately `#F5F5F2` | Testimonials and editorial contrast |
| Soft navy wash | `rgba(40,55,67,0.02–0.04)` | Alternating sections |

The legacy admin palette is intentionally a little bluer: navy `#192B63`, dark navy `#0F1D45`, gold `#D6B45A`, warm white `#FAF8F3`, and app background `#F4F2ED`.

Do not turn gold into the dominant fill. It is an accent used for underlines, thin borders, small labels, progress, and selected details.

### Typography

- Headings and main wordmark: **Bricolage Grotesque**, weights 500–800.
- Body and UI: **Inter**, weights 400–700.
- Numeric editorial accents: **IBM Plex Mono**, weights 500–600.
- Scripted “The” in the logo: **Yellowtail**.
- Fallbacks: system sans-serif; monospace for IBM Plex Mono.

Global typography:

- Body: `1rem`, line-height about `1.72`, slate navy.
- Headings: line-height `1.08`, balanced wrapping, no artificial tracking.
- `h1`: about `2.05rem` mobile, `2.42rem` default, `3.25rem` tablet/desktop.
- `h2`: about `1.68rem` mobile, `1.94rem` default, `2.42rem` tablet/desktop.
- `h3`: `1.34rem` default and `1.58rem` from tablet.
- Small section eyebrows: uppercase, gold, `0.72–0.85rem`, bold, tracking around `0.12–0.18em`.

Do not use the Cinzel/Montserrat links still present in layout heads as the visual source of truth; the active global font imports and CSS variables above define the actual design.

### Spacing, grid, radius, and depth

- Main container: maximum `1200px`, centered; `24px` horizontal padding mobile, `32px` from small screens.
- Standard section padding: `64px` mobile, `80px` desktop.
- Small section padding: `48px` mobile, `64px` desktop.
- Typical content grids: one column mobile, two at tablet/desktop, three for features, occasionally asymmetric `42/58` or `84/116` editorial splits.
- Standard card radius: `16px`; form controls around `12px`; hero/media cards `16–24px`; pill controls fully rounded.
- Cards use hairline navy borders and very restrained shadows. Hover lifts by roughly `1–3px`, border shifts toward gold, and shadow increases gently.
- Dark sections are full-width navy fields with white headings, translucent white body text, and gold accents.

### Reusable visual primitives

- `.gold-underline`: a flat `2px` gold underline near the text baseline, not a marker stroke.
- `.btn`: pill-shaped, minimum height `56px`, strong horizontal padding, weight 600.
- Primary button: navy fill, white text; gold border appears on hover.
- Secondary button: transparent, navy outline; gold on hover.
- White button: white fill on dark sections.
- Gold button: gold fill with navy text.
- `.card`: white, `16px` radius, subtle border and hover lift.
- `.pill`: compact rounded filters/tags with an active navy variant.
- `.icon-chip`: pale-gold square/rounded icon holder.
- Form fields: white, `12px` radius, subtle navy border; gold focus border plus soft gold focus ring.
- Article covers use a dark navy/gold editorial treatment and a small corner-line ornament.

Photography should show real-looking consultants, workspaces, meetings, laptops, and professional collaboration. Use WebP, meaningful alt text, correct intrinsic dimensions, lazy-loading below the fold, and art-directed desktop/mobile crops when available.

## 6. Global shell

### Header

The fixed header is approximately `5.85rem` high and sits at `z-index: 50`.

Desktop (`xl` and above):

- centered wordmark;
- two navigation groups on the left: “Entreprises”, “Indépendants”;
- two on the right: “Le groupe”, “Ressources”;
- account icon, calendar/Rendez-vous link, and navy “Simuler” CTA;
- every group opens a full-width white mega menu on hover/focus;
- mega menu has an intro/CTA column plus two or three link columns, with a title and explanatory note for each link;
- active route receives a visible active treatment.

Homepage header before scroll:

- transparent/dark gradient over the hero;
- white logo and navigation;
- gold “Simuler” CTA;
- when scrolled or when a menu opens, transition to a blurred near-white header with navy content.

General behavior:

- blurred translucent background;
- subtle border and shadow after scroll;
- hide on deliberate downward scrolling and reveal on upward scrolling or when the pointer enters the top reveal zone;
- reading progress bar is normally hidden and enabled on blog article pages marked with `data-reading-progress`;
- support keyboard focus and do not rely on hover alone.

Mobile/tablet:

- account icon left, centered wordmark, hamburger right;
- opening the menu locks body scroll and displays a backdrop plus a large navy slide-down/overlay panel;
- four numbered accordion groups, only one expanded at a time;
- group overview, labeled link columns, simulator and appointment CTAs, then account link;
- close on backdrop click or navigation.

### Wordmark

Build it typographically if no logo SVG is supplied:

- “Porters” is uppercase, heavy Bricolage Grotesque;
- “The” is smaller Yellowtail script, rotated about `-7deg`, sitting above and left;
- navy on light backgrounds, white in footer and transparent homepage header.

### Footer

- Full navy background and a `3px` gold top separator.
- Large top padding, typographic wordmark, short brand statement, and agency links.
- Four navigation columns: Consultants, Entreprises, The Porters, Resources.
- Bottom hairline divider with copyright and legal/privacy links.
- One column on mobile; six-column layout on large screens, with brand block spanning two columns.

### Breadcrumbs and SEO shell

- Breadcrumbs appear on internal public pages, not the homepage.
- Every page provides title, description, canonical URL, Open Graph, Twitter card, favicon, and structured data where relevant.
- Global JSON-LD includes Organization; internal pages also get BreadcrumbList.
- Blog articles include Article structured data.
- Admin and legal/private routes that should not be indexed use `noindex` as appropriate.
- Sitemap excludes `/admin`, `/mentions-legales`, and `/confidentialite`.

## 7. Homepage composition

Keep this order and rhythm:

1. Audience hero.
2. Two-row partner/logo marquee.
3. Large testimonial feature.
4. Three photographic experience pathway cards.
5. Dark status and expertise band.
6. Three-step process.
7. Six benefit cards.
8. Simulator preview/editorial block.
9. Dark appointment CTA.
10. Agency cards.
11. Latest resource/blog cards.
12. Final dark CTA.

### Audience hero — intended implementation

The intended hero is the committed audience-based version, not the broken uncommitted `slides` rewrite.

- Two audience tabs: company and independent consultant. The page currently reverses the audience array, so company is initially first.
- Each audience has its own eyebrow, headline, supporting copy, statistic, two CTAs, desktop photo set, and mobile photo set.
- Stage height is about `42rem` minimum on desktop.
- Full-bleed photograph with a strong left-to-right navy scrim so copy stays legible.
- Desktop copy width is about `47rem` / `58%`; stage inner max width around `92rem`.
- Eyebrow has a short gold rule and animated entrance.
- Headline is large white editorial display copy.
- Primary and secondary CTAs enter with restrained motion.
- Photos crossfade every `7000ms` and have a slow scale from `1` to roughly `1.065`.
- Pause automatic motion for reduced motion, hidden documents, or when insufficient images exist.
- Switching audience resets its photo index.
- Bottom audience strip contains numbered tabs with an animated progress line and a three-step journey rail.
- Include proof ticker, mobile proof scroller, rotating testimonial bar, floating promise cards/stickers, statistic card with contextual popover, and dark Google reviews badge.
- Floating cards use modest idle motion, clear links, and useful popover detail; they must not obscure essential text.
- Mobile uses separate portrait crops, a stronger bottom/side scrim, horizontally usable proof/journey surfaces, and simplified motion.

Audience content:

- Consultant: “Restez libre. On porte le reste.”; CTA to simulator, secondary appointment; `+10 ans` proof.
- Company: “Le bon consultant IT, sans la lourdeur administrative.”; CTA to enterprise offer, secondary appointment; `+150` current missions proof.

### Partner proof

- White section with asymmetric heading/copy intro.
- Heading: trust/confiance framing with gold underline.
- Two horizontal marquee rows moving in opposite directions at approximately `34s` and `38s`.
- Use ten monochrome/contained partner logos; rows sit inside a very pale navy panel with top and bottom rules.
- Infinite movement must be seamless and disabled or simplified for reduced motion.

### Testimonials

- Warm gray background.
- Left editorial block: gold kicker, large `+10 ans` mono statistic, heading, supporting copy, overlapping portrait group.
- Right: dominant navy quote card with oversized quote mark and author details.
- Two smaller secondary quotes below.
- Include a small source/illustration disclaimer.

### Experience pathways

- Three large photo cards: Consultants, Companies, Simulation.
- Cards are dark-overlay, white text, minimum height near `28rem`, with 16px corners.
- On desktop, use a visually editorial grid; on mobile stack them.
- Hover gently scales the image and advances the action arrow.
- Follow with three compact numbered service-proof statements.

### Remaining homepage sections

- Dark “Offres & statuts” section: four cards for Portage salarial, CDI, CDD, Freelance; follow with expertise tags.
- Three-step section: outlined gold number circles and concise centered copy.
- Benefits: six white cards with gold-tinted line icons, covering protection, transparent fees, human support, payroll/advance, local presence, and RSE.
- Simulator preview: pale background, editorial text and photo/calculation framing, strong link to `/simulateur`.
- Appointment CTA and final CTA: navy field, centered white heading/copy, white or gold action.
- Agencies: show Paris, Lyon, Aix-en-Provence, Montpellier as primary homepage entries.
- Resources: show three latest/selected articles with category, cover, title, summary, and date/read-time metadata.

## 8. Public route inventory and page templates

Implement these routes. Preserve the actual French content from the data modules if this repository is available.

| Route | Template / purpose |
|---|---|
| `/` | Full homepage above |
| `/portage-salarial` | Dark photo hero; definition; benefits; three-step process; status comparison table; FAQ; dark CTA |
| `/entreprises` | Dark photo hero; proof strip; company challenges; benefits; portage-vs-ESN comparison; process; CTA |
| `/simulateur` | Dark photo hero; simulator selector and live calculator; FAQ; CTA |
| `/tarifs` | Photo hero centered on 10% management fee; inclusions; transparent explanation; adviser CTA |
| `/rendez-vous` | Dark centered hero; appointment types/cards; contact form; reasons to contact |
| `/contact` | Intro and contact details beside a white form card; agency/contact image |
| `/espace-client` | Dark photo hero; two access cards for sign-in link and account creation; dark support strip |
| `/qui-sommes-nous` | Editorial intro with photo and proof; values/reasons; navy CTA |
| `/equipe` | Team intro and responsive member grid; recruitment CTA |
| `/rse` | Tall dark photo hero; daily commitments; evidence/action cards; contact CTA |
| `/recrutement` | Intro, culture/benefit cards, current openings empty/content state |
| `/parrainage` | Split intro; dark “how it works” sequence; final referral CTA |
| `/agences` | Intro and responsive agency card grid |
| `/agences/[city]` | Localized hero and details, reasons, tailored content sections, gold highlight, FAQ |
| `/expertises/[slug]` | Tall photo hero; expertise positioning; intervention cards; support section; CTA |
| `/blog` | Blog hero, category pills, featured article, latest article grid |
| `/blog/categorie/[slug]` | Filtered category listing |
| `/blog/[slug]` | Article header, category/meta, editorial cover, readable prose column, article CTA and structured data |
| `/livres-blancs` | Resource card grid and newsletter form |
| `/faq` | Grouped native `details/summary` accordions |
| `/mentions-legales` | Narrow readable legal prose |
| `/confidentialite` | Narrow readable privacy prose |
| `/404` | Branded empty state and return-home CTA |

Dynamic content presently covers:

- agencies: Paris, Lyon, Aix-en-Provence, Marseille, Montpellier, Toulouse;
- expertise: cybersecurity, data/AI, DevOps/cloud, agility/coaching;
- blog categories and posts from `src/data/blog.data.ts`;
- team, testimonials, benefits, FAQ, resources, and SEO from their corresponding typed data files.

## 9. Stateful public behavior

### Simulator

Create a live React calculator with two tabs:

1. Portage salarial: starts from monthly revenue.
2. Activité freelance: starts from TJM multiplied by billed days.

Preset scenarios:

- Premier contrat: TJM 420, 16 days, expenses 150.
- Mission régulière: TJM 550, 18 days, expenses 500; default.
- Expert senior: TJM 750, 19 days, expenses 350.
- Temps choisi: TJM 600, 12 days, expenses 200.

Portage formulas:

```text
management fee = monthly revenue × 0.10
base before social charges = revenue - management fee - professional expenses
social charges = max(base, 0) × 0.45
estimated net monthly = max(base - social charges, 0)
estimated annual = monthly × 12
retention rate = net / revenue × 100
```

Freelance mode reports revenue, not net salary. Format in French EUR with no decimals. Sliders update results immediately. Use a white assumptions card and a navy result card. Include an explicit estimate/legal caveat and a small lead-capture form whose current local behavior is only an optimistic success state.

Slider ranges:

- monthly revenue: 3,000–25,000, step 100;
- TJM: 250–1,200, step 10;
- billed days: 4–22, step 1;
- expenses: 0–1,200, step 25.

### Contact form

Fields: full name, email, phone, company, audience/profile select, message. Required fields are name, email, profile, and message. Current implementation simulates an 800ms send and then shows a success state with a reset action. Clearly mark the backend integration point; do not pretend data is persisted until a real endpoint exists.

### FAQs

Use native `details/summary` for robust keyboard behavior. Cards are white with navy hairline borders and a rotating/transitioning affordance. Organize by category with section headings.

### Scroll and motion

- Global IntersectionObserver reveals `.reveal` elements once at threshold `0.14`, with bottom root margin `-8%`.
- Default reveal: opacity plus `30px` vertical shift and tiny scale; left/right variants shift `46px`; duration roughly `0.68–0.82s` using an ease-out curve.
- Respect `prefers-reduced-motion`: remove transforms/transitions, stop auto-scroll, disable smooth scrolling, and expose content immediately.
- Keep motion purposeful. No large parallax, bouncing CTA, or constant decorative animation outside the hero/marquees.

## 10. Admin application

The admin is a separate noindex product surface under `/admin`; `/admin` redirects to `/admin/dashboard`. It currently uses demo data and must not be presented as a production backend.

Routes:

- `/admin/dashboard`
- `/admin/leads`
- `/admin/messages`
- `/admin/meetings`
- `/admin/calendar`
- `/admin/calculator`
- `/admin/analytics`
- `/admin/notifications`
- `/admin/team`
- `/admin/settings`

Shell:

- fixed `260px` navy-gradient sidebar;
- `64px` white topbar;
- warm-gray app canvas;
- compact white cards with 8–12px corners;
- main content margin equals sidebar width on desktop;
- mobile sidebar becomes an overlay opened by a topbar hamburger;
- active nav has pale-gold background and a 3px gold left marker.

Admin UI includes metric cards, chart shells, activity feed, quick actions, filters/search, status badges, paginated tables, month/week calendar, notifications, settings toggles, and slide-over detail panels for leads/messages.

Behavior to preserve:

- filters and search update local displayed data;
- lead/message rows open a right-side detail panel with backdrop and close action;
- tables paginate locally;
- calendar switches month/week and filters by team member;
- notifications switch tabs and can be marked read locally;
- settings toggles are local demo state;
- charts are CSS/SVG/demo visualizations rather than live analytics.

Production requirement: protect all `/admin` routes with real authentication and authorization (for example Supabase Auth plus RLS, or a gateway such as Cloudflare Access) before deployment. Do not expose the demo admin publicly.

## 11. Content and data rules

- Keep route data typed.
- Agencies, expertise entries, blog posts/categories, FAQ groups, team members, testimonials, resources, benefits, navigation, and SEO each have a dedicated data module.
- Dynamic routes implement `getStaticPaths` from those arrays.
- Do not hard-code the same navigation or agency facts in multiple page components when they can be shared.
- Preserve French titles, descriptions, dates, labels, alt text, and local agency distinctions.
- Avoid unverifiable superlatives and invented certifications, customer counts, ratings, or legal guarantees.
- Partner logos are visual proof; give each a useful accessible name while treating duplicate marquee copies as hidden from assistive technology.

## 12. Responsive requirements

Test at minimum at 375, 640, 768, 1024, 1280, and 1440 CSS pixels.

Mobile:

- no horizontal page overflow;
- stacked grids and full-width primary actions where needed;
- photo crops keep people/faces and working context visible;
- hero copy remains legible over a strong scrim;
- mobile menu is scrollable while body is locked;
- tables either become usable horizontal regions or responsive card rows;
- headings do not orphan single short words where avoidable;
- touch targets are at least about 44px.

Desktop:

- container stays near 1200px while hero may use a wider internal stage;
- asymmetric editorial layouts should not collapse into generic equal cards;
- mega menus span the available width cleanly;
- page rhythm alternates white, pale wash, photography, and full navy sections;
- limit paragraph measure to roughly 60–75 characters for prose and lead copy.

## 13. Accessibility and quality gates

- Semantic landmarks: header, nav, main, sections, article, aside, footer.
- Meaningful focus-visible gold outline with offset.
- All icon-only controls have labels.
- Active tabs expose `aria-selected`; pressed presets use `aria-pressed`; mobile accordion updates `aria-expanded` and `hidden`.
- Decorative SVGs and repeated imagery are hidden from assistive technology.
- Form labels are programmatically connected; validation does not rely only on color.
- Dark sections meet WCAG contrast; translucent body text must remain readable.
- Carousels stop or simplify for reduced motion and never trap keyboard focus.
- Images specify width/height to reduce layout shift.
- There must be no console errors, hydration warnings, dead internal links, or missing assets.

## 14. Implementation sequence for the receiving agent

1. Audit the target repo and preserve unrelated working features.
2. Establish tokens, fonts, base styles, container, typography, buttons, cards, forms, and motion utilities.
3. Build the public SEO layout, fixed header, mega menus, mobile menu, breadcrumbs, and footer.
4. Implement shared data models and dynamic route generation.
5. Build the homepage in the exact section order, starting with the intended audience-based hero.
6. Build core conversion pages: portage, companies, simulator, pricing, appointment, contact.
7. Build company/about, agencies, expertise, content, FAQ, legal, and error routes.
8. Implement interactive islands and reduced-motion behavior.
9. Build or restyle the isolated admin surface if it is in scope.
10. Validate responsive layouts, keyboard behavior, metadata, structured data, links, assets, and production build.

Do not make broad visual changes after implementation without comparing them against the tokens and composition rules in this brief.

## 15. Definition of done

The reproduction is complete only when:

- all required routes render in French;
- the homepage composition and audience split are immediately recognizable as The Porters;
- header states, mega menus, mobile navigation, breadcrumbs, and footer work across routes;
- calculator outputs match the formulas and update live;
- contact and simulator lead states are honest about demo/backend status;
- dynamic agency, expertise, blog, and category routes build successfully;
- typography, colors, spacing, cards, photography, dark sections, and gold accents follow this brief;
- animations work without harming reduced-motion users;
- SEO and structured data are present;
- admin is isolated, noindex, and protected before production;
- `npm run build` or the equivalent production build succeeds with zero runtime/prerender errors;
- no unrelated user changes were overwritten.

## 16. Final instruction to the receiving AI

Treat this document as a design-and-behavior contract. Inspect the available source and assets before coding. Prefer exact reuse of supplied content and media over invented substitutes. If a requirement conflicts with the target project’s working business logic, preserve the business logic and adapt the presentation around it. Make reasonable implementation decisions independently, document any unavoidable deviations, and finish by reporting changed files, validation performed, remaining backend integrations, and any known limitations.
