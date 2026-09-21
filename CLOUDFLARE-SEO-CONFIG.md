# Cloudflare SEO configuration

The repository handles route prerendering, trailing-slash canonicals, slashless-to-canonical redirects, legacy content redirects and the static `404.html`. Cloudflare dashboard rules are still required for host consolidation because the deployment hostname is not safely discoverable from source.

The generated `_redirects` file contains canonical trailing-slash rules, the `/actualities/` and `/actualites/` hub redirects, and the duplicate price-article redirect. Existing `/actualities/:id` links are internally rewritten to a noindex React shell so database-backed articles remain accessible until they can be migrated to stable `/blog/` slugs.

The rewrite destination must be `/legacy-actuality/`, not `/legacy-actuality/index.html`: Wrangler 4.135.0 rejected the latter as a potential loop and returned 404 for both GSC article IDs. The clean destination passed the local HTTP checks while preserving the original article ID in the address bar.

## 1. Redirect `www` to the apex domain

In **Rules > Redirect Rules**, create a **Single Redirect**:

This remains outstanding: the 21 September live check returned `200` on `www` with an apex canonical. Deploying the repository does not create a dashboard redirect. Host redirects are not supported by the Pages `_redirects` file. [Cloudflare redirect documentation](https://developers.cloudflare.com/pages/configuration/redirects/).

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

Run the complete public HTTP check after deploying and applying the host rule:

```sh
npm run seo:live -- --output=/tmp/gsc-after-deploy.json
```

It checks all 43 visible GSC examples, all public canonical routes, the sitemap, query preservation, HTTPS/host normalization and a real missing page (89 distinct requests in total). The two private legacy shells must remain noindex; approved articles must not be noindex. It exits unsuccessfully if the deployed site does not match the source. Passing these checks verifies the HTTP responses, not Google's eventual indexing decision.
