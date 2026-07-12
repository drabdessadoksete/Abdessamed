import fs from 'node:fs/promises'
import path from 'node:path'
import { routeUrl, sitemapRoutes } from '../src/config/seoRoutes.js'

const outputPath = path.resolve('public/sitemap.xml')

async function lastModified(source) {
  const stats = await fs.stat(path.resolve(source))
  return stats.mtime.toISOString().slice(0, 10)
}

const entries = await Promise.all(sitemapRoutes.map(async (route) => ({
  loc: routeUrl(route),
  lastmod: await lastModified(route.source),
})))

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>
`

await fs.writeFile(outputPath, xml)
console.log(`Updated sitemap with ${entries.length} canonical URLs`)
