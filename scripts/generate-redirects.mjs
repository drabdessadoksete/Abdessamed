import fs from 'node:fs/promises'
import path from 'node:path'
import { seoRoutes } from '../src/config/seoRoutes.js'

const canonicalRedirects = seoRoutes
  .filter((route) => route.path !== '/' && route.path.endsWith('/'))
  .map((route) => `${route.path.slice(0, -1)} ${route.path} 301`)

const redirects = [
  '/actualities /blog/ 301',
  '/actualities/ /blog/ 301',
  '/actualites /blog/ 301',
  '/actualites/ /blog/ 301',
  '/blog/prix-orthodontie-invisible-sete /prix-orthodontie-invisible-sete/ 301',
  '/blog/prix-orthodontie-invisible-sete/ /prix-orthodontie-invisible-sete/ 301',
  ...canonicalRedirects,
  '/actualities/* /legacy-actuality/index.html 200',
  '/actualites/* /blog/ 301',
]

const unique = [...new Set(redirects)]
await fs.writeFile(path.resolve('public/_redirects'), `${unique.join('\n')}\n`)
console.log(`Updated redirects with ${unique.length} rules`)
