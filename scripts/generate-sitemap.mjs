import fs from 'node:fs/promises'
import path from 'node:path'
import { blogPages, servicePages } from '../src/data/seoContent.js'

const siteUrl = 'https://cabinetdentairesete.fr'
const outputPath = path.resolve('public/sitemap.xml')
const lastmod = '2026-05-18'

const staticRoutes = [
  { url: '/', changefreq: 'weekly', priority: '1.0' },
  { url: '/about', changefreq: 'monthly', priority: '0.9' },
  { url: '/services', changefreq: 'monthly', priority: '0.9' },
  { url: '/gallery', changefreq: 'monthly', priority: '0.7' },
  { url: '/blog', changefreq: 'weekly', priority: '0.85' },
  { url: '/actualities', changefreq: 'weekly', priority: '0.7' },
  { url: '/contact', changefreq: 'monthly', priority: '0.8' },
]

function dedupeByUrl(entries) {
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()]
}

function getPriority(page) {
  if (page.cluster === 'orthodontie') return '0.85'
  if (page.url.startsWith('/blog/')) return '0.8'
  if (page.menuGroup === 'pillars') return '0.9'
  return '0.85'
}

function getChangefreq(page) {
  return page.url.startsWith('/blog/') ? 'monthly' : 'monthly'
}

async function main() {
  const dynamicRoutes = [...servicePages, ...blogPages].map((page) => ({
    url: page.url,
    changefreq: getChangefreq(page),
    priority: getPriority(page),
  }))

  const entries = dedupeByUrl([...staticRoutes, ...dynamicRoutes])
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${siteUrl}${entry.url === '/' ? '/' : entry.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

  await fs.writeFile(outputPath, xml)
  console.log(`Updated sitemap with ${entries.length} URLs`)
}

await main()
