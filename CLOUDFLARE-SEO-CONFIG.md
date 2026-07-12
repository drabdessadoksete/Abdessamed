# Cloudflare SEO configuration

The repository handles route prerendering, trailing-slash canonicals, slashless-to-canonical redirects, legacy content redirects and the static `404.html`. Cloudflare dashboard rules are still required for host consolidation because the deployment hostname is not safely discoverable from source.

The generated `_redirects` file contains canonical trailing-slash rules, the `/actualities/` and `/actualites/` hub redirects, and the duplicate price-article redirect. Existing `/actualities/:id` links are internally rewritten to a noindex React shell so database-backed articles remain accessible until they can be migrated to stable `/blog/` slugs.

## 1. Redirect `www` to the apex domain

In **Rules > Redirect Rules**, create a **Single Redirect**:

- Rule name: `Canonical host - www to apex`
- Match: Hostname equals `www.cabinetdentairesete.fr`
- Target expression: `concat("https://cabinetdentairesete.fr", http.request.uri.path)`
- Preserve query string: enabled
- Status: `301`

Expected example: `https://www.cabinetdentairesete.fr/contact/?source=test` becomes `https://cabinetdentairesete.fr/contact/?source=test` in one hop.

## 2. Redirect the Pages development domain

Find the exact `*.pages.dev` hostname in **Workers & Pages > project > Custom domains**. Add a second Single Redirect:

- Rule name: `Canonical host - pages.dev to production`
- Match: Hostname equals the exact project `pages.dev` hostname
- Target expression: `concat("https://cabinetdentairesete.fr", http.request.uri.path)`
- Preserve query string: enabled
- Status: `301`

Do not substitute a guessed Pages hostname. Verify the exact hostname in the dashboard first.

## 3. Trailing slash behavior

Deploy the generated `_redirects` file so slashless public routes return a one-hop `301` to their trailing-slash equivalents. The sitemap, canonicals, Open Graph URLs, structured data, hreflang and internal links use trailing slashes directly.

## 4. Post-deployment checks

Verify with redirect following disabled:

```sh
curl -I 'https://www.cabinetdentairesete.fr/contact/?source=test'
curl -I 'https://cabinetdentairesete.fr/contact/'
curl -I 'https://cabinetdentairesete.fr/contact'
curl -I 'https://cabinetdentairesete.fr/a-random-url-that-does-not-exist/'
```

Expected: one permanent redirect for `www`, direct `200` for `/contact/`, one `301` from `/contact` to `/contact/`, and `404` for the unknown URL.
