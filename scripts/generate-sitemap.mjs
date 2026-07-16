import fs from 'node:fs/promises'
import path from 'node:path'
import { routeUrl, sitemapRoutes } from '../src/config/seoRoutes.js'
import { mediaForRoute } from '../src/config/media.js'
import { absoluteUrl } from '../src/config/site.js'

const outputPath = path.resolve('public/sitemap.xml')

async function lastModified(source) {
  const stats = await fs.stat(path.resolve(source))
  return stats.mtime.toISOString().slice(0, 10)
}

const xmlEscape = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')

const entries = await Promise.all(sitemapRoutes.map(async (route) => {
  const image = mediaForRoute(route.path)
  return {
    loc: routeUrl(route),
    lastmod: await lastModified(route.source),
    image: absoluteUrl(image.fallback),
    imageTitle: image.alt || route.h1,
  }
}))

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map((entry) => `  <url>
    <loc>${xmlEscape(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <image:image>
      <image:loc>${xmlEscape(entry.image)}</image:loc>
      <image:title>${xmlEscape(entry.imageTitle)}</image:title>
    </image:image>
  </url>`).join('\n')}
</urlset>
`

await fs.writeFile(outputPath, xml)
console.log(`Updated sitemap with ${entries.length} canonical URLs`)
