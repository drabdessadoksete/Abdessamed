import fs from 'node:fs/promises'
import path from 'node:path'
import { sitemapRoutes } from '../src/config/seoRoutes.js'
import { routeUrl } from '../src/config/seoRoutes.js'
import { site } from '../src/config/site.js'

const groups = [
  ['Main public pages', sitemapRoutes.filter((route) => ['home', 'about', 'services', 'gallery', 'contact', 'blog'].includes(route.type))],
  ['Treatment information', sitemapRoutes.filter((route) => route.type === 'treatment' && route.language === 'fr')],
  ['Patient guides', sitemapRoutes.filter((route) => route.type === 'article')],
  ['Translated information', sitemapRoutes.filter((route) => route.language && route.language !== 'fr')],
]

const content = `# ${site.practiceName}

${site.practiceName} is a dental practice in Sète, France. The site provides patient information about dental implants, invisible orthodontics, general dental care, access, opening hours and contact options.

Clinical information is general and does not replace an examination. Translated pages do not promise that consultations are available in the translated language.

${groups.map(([heading, routes]) => `## ${heading}\n\n${routes.map((route) => `- ${route.title}: ${routeUrl(route)}`).join('\n')}`).join('\n\n')}
`

await fs.writeFile(path.resolve('public/llms.txt'), content)
console.log(`Updated llms.txt with ${sitemapRoutes.length} canonical public routes`)
