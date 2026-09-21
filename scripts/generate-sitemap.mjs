import fs from 'node:fs/promises'
import path from 'node:path'
import { routeUrl, sitemapRoutes } from '../src/config/seoRoutes.js'
import { mediaForRoute } from '../src/config/media.js'
import { absoluteUrl } from '../src/config/site.js'
import { getAlternatesForPageType } from '../src/config/multilingualRoutes.js'

const outputPath = path.resolve('public/sitemap.xml')

function lastModified(route) {
  // A checkout/build time is not a content update. Omit dates we cannot substantiate.
  const date = route.page?.dateModified || route.dateModified
  return /^\d{4}-\d{2}-\d{2}$/.test(date || '') && date <= new Date().toISOString().slice(0, 10) ? date : null
}

const xmlEscape = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')

const entries = sitemapRoutes.map((route) => {
  const image = mediaForRoute(route.path)
  return {
    loc: routeUrl(route),
    lastmod: lastModified(route),
    alternates: route.pageType ? getAlternatesForPageType(route.pageType) : [],
    image: absoluteUrl(image.fallback),
    imageTitle: image.alt || route.h1,
  }
})

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map((entry) => `  <url>
    <loc>${xmlEscape(entry.loc)}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.alternates.map((alternate) => `<xhtml:link rel="alternate" hreflang="${alternate.language}" href="${xmlEscape(absoluteUrl(alternate.href))}" />`).join('\n    ')}
    ${entry.alternates.length ? `<xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(absoluteUrl(entry.alternates.find((alternate) => alternate.language === 'fr').href))}" />` : ''}
    <image:image>
      <image:loc>${xmlEscape(entry.image)}</image:loc>
      <image:title>${xmlEscape(entry.imageTitle)}</image:title>
    </image:image>
  </url>`).join('\n')}
</urlset>
`

await fs.writeFile(outputPath, xml.replace(/^[ \t]+$/gm, ''))
console.log(`Updated sitemap with ${entries.length} canonical URLs`)
