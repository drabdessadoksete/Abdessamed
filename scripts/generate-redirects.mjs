import fs from 'node:fs/promises'
import path from 'node:path'
import { seoRoutes } from '../src/config/seoRoutes.js'

const canonicalRedirects = seoRoutes
  .filter((route) => route.path !== '/' && route.path.endsWith('/'))
  .map((route) => `${route.path.slice(0, -1)} ${route.path} 301`)

const retiredRedirects = [
  ['/invisalign/', '/orthodontie-invisible-sete/'],
  ['/orthodontie-invisible-meze/', '/invisalign-bassin-de-thau/'],
  ['/invisalign-frontignan/', '/invisalign-bassin-de-thau/'],
  ['/invisalign-marseillan/', '/invisalign-bassin-de-thau/'],
  ['/orthodontie-invisible-agde/', '/invisalign-bassin-de-thau/'],
  ['/orthodontie-adulte-balaruc-les-bains/', '/invisalign-bassin-de-thau/'],
  ['/blog/prix-orthodontie-invisible-sete/', '/prix-orthodontie-invisible-sete/'],
  ['/blog/aligner-dents-avant-pose-implant/', '/blog/aligner-dents-avant-implant/'],
  ['/blog/orthodontie-sete-quand-consulter-alignement-dentaire/', '/orthodontie-sete/'],
  ['/blog/orthodontie-invisible-sete-questions-avant-bilan/', '/orthodontie-invisible-sete/'],
  ['/blog/verite-invisalign-taquets-temps-port-gene/', '/blog/orthodontie-invisible-quotidien-repas-entretien-parole/'],
  ['/blog/orthodontie-bassin-de-thau-suivi-sete/', '/invisalign-bassin-de-thau/'],
].flatMap(([from, to]) => [
  `${from.slice(0, -1)} ${to} 301`,
  `${from} ${to} 301`,
])

const redirects = [
  '/actualities /blog/ 301',
  '/actualities/ /blog/ 301',
  '/actualites /blog/ 301',
  '/actualites/ /blog/ 301',
  ...retiredRedirects,
  ...canonicalRedirects,
  '/actualities/* /legacy-actuality/index.html 200',
  '/actualites/* /blog/ 301',
]

const unique = [...new Set(redirects)]
await fs.writeFile(path.resolve('public/_redirects'), `${unique.join('\n')}\n`)
console.log(`Updated redirects with ${unique.length} rules`)
