import fs from 'node:fs/promises'
import path from 'node:path'
import { seoRouteByPath, seoRoutes, sitemapRoutes } from '../src/config/seoRoutes.js'
import { mediaByRoute } from '../src/config/media.js'
import { getAlternatesForPageType } from '../src/config/multilingualRoutes.js'
import { absoluteUrl, trailingSlash } from '../src/config/site.js'
import { blogPages } from '../src/data/seoContent.js'

const distDir = path.resolve('dist')
const failures = []
const results = []
const fail = (message) => failures.push(message)

const stripTags = (value = '') => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ')
  .trim()
const textOf = (html, pattern) => stripTags(html.match(pattern)?.[1] || '')
const titleOf = (html) => textOf(html, /<title[^>]*>([\s\S]*?)<\/title>/i)
const h1Of = (html) => textOf(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)
const canonicalOf = (html) => html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1] || ''
const metaOf = (html, name) => html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))?.[1] || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'))?.[1] || ''
const htmlLanguage = (html) => html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1] || ''

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map((match) => [match[1].toLowerCase(), match[2]]))
}

function alternatesOf(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => attributes(match[0]))
    .filter((attrs) => attrs.rel === 'alternate' && attrs.hreflang)
}

function schemaTypes(html) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap((match) => {
    try {
      const value = JSON.parse(match[1])
      const types = []
      const visit = (item) => {
        if (!item || typeof item !== 'object') return
        if (item['@type']) types.push(...(Array.isArray(item['@type']) ? item['@type'] : [item['@type']]))
        Object.values(item).forEach((child) => Array.isArray(child) ? child.forEach(visit) : visit(child))
      }
      visit(value)
      return types
    } catch {
      fail('Invalid JSON-LD found in generated HTML')
      return []
    }
  })
}

async function exists(file) {
  try { await fs.access(file); return true } catch { return false }
}

function parseRedirects(source) {
  return source.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith('#')).map((line) => {
    const [from, to, status = '301'] = line.split(/\s+/)
    return { from, to, status: Number(status) }
  })
}

function matchRedirect(pathname, rules) {
  const exact = rules.find((rule) => rule.from === pathname)
  if (exact) return exact
  return rules.find((rule) => rule.from.endsWith('*') && pathname.startsWith(rule.from.slice(0, -1))) || null
}

async function fileForPath(pathname) {
  if (pathname === '/') return path.join(distDir, 'index.html')
  return path.join(distDir, pathname.replace(/^\/+|\/+$/g, ''), 'index.html')
}

async function directStatus(pathname, redirectRules) {
  if (matchRedirect(pathname, redirectRules)) return matchRedirect(pathname, redirectRules).status
  return await exists(await fileForPath(pathname)) ? 200 : 404
}

// schema.org subtypes satisfy a requirement for their parent: a page typed MedicalWebPage
// is a WebPage. Keep this in sync with the types emitted by prerender-static-pages.mjs.
const schemaSubtypes = {
  WebPage: ['MedicalWebPage', 'ContactPage', 'CollectionPage', 'ItemPage', 'AboutPage'],
}

function satisfiesSchema(required, types) {
  return types.includes(required) || (schemaSubtypes[required] || []).some((subtype) => types.includes(subtype))
}

function requiredSchema(route) {
  if (route.type === 'home') return ['Dentist', 'Organization', 'WebSite', 'WebPage']
  if (route.type === 'localizedHome') return ['WebPage', 'BreadcrumbList']
  if (route.type === 'contact') return ['Dentist', 'ContactPage', 'PostalAddress', 'OpeningHoursSpecification', 'BreadcrumbList']
  if (route.type === 'article') return ['Article', 'Person', 'WebPage', 'BreadcrumbList']
  if (route.type === 'treatment') return ['Service', 'WebPage', 'BreadcrumbList']
  if (route.type === 'blog' || route.type === 'gallery') return ['CollectionPage', 'BreadcrumbList']
  if (route.type === 'about') return ['Person', 'WebPage', 'BreadcrumbList']
  return ['WebPage', 'BreadcrumbList']
}

const redirectSource = await fs.readFile(path.resolve('public/_redirects'), 'utf8')
const redirectRules = parseRedirects(redirectSource)
const sitemap = await fs.readFile(path.join(distDir, 'sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
const expectedSitemapUrls = sitemapRoutes.map((route) => absoluteUrl(route.path))

if (!sitemapUrls.length) fail('Sitemap has no URLs')
if (sitemap.includes('<changefreq>') || sitemap.includes('<priority>')) fail('Sitemap contains changefreq or priority')
if (sitemapUrls.some((url) => !url.endsWith('/'))) fail('Every sitemap URL must use a trailing slash')
if (new Set(sitemapUrls).size !== sitemapUrls.length) fail('Sitemap contains duplicate URLs')
for (const url of expectedSitemapUrls) if (!sitemapUrls.includes(url)) fail(`Expected sitemap URL is missing: ${url}`)
for (const url of sitemapUrls) if (!expectedSitemapUrls.includes(url)) fail(`Unexpected sitemap URL: ${url}`)

const canonicalSet = new Set()
const htmlByPath = new Map()
const homepageH1 = seoRouteByPath.get('/')?.h1

for (const url of sitemapUrls) {
  const pathname = new URL(url).pathname
  const route = seoRouteByPath.get(trailingSlash(pathname))
  if (!route) { fail(`${pathname}: sitemap URL has no route configuration`); continue }

  const redirect = matchRedirect(pathname, redirectRules)
  const status = await directStatus(pathname, redirectRules)
  const file = await fileForPath(pathname)
  if (redirect) fail(`${pathname}: sitemap URL redirects via ${redirect.status} to ${redirect.to}`)
  if (status !== 200) { fail(`${pathname}: expected direct 200, got ${status}`); continue }

  const html = await fs.readFile(file, 'utf8')
  htmlByPath.set(pathname, html)
  const title = titleOf(html)
  const h1 = h1Of(html)
  const canonical = canonicalOf(html)
  const robots = metaOf(html, 'robots')
  const types = schemaTypes(html)
  const expectedCanonical = absoluteUrl(pathname)

  if (!title) fail(`${pathname}: title missing`)
  if (title !== route.title) fail(`${pathname}: title differs from route metadata`)
  if ([...html.matchAll(/<title\b/gi)].length !== 1) fail(`${pathname}: expected one title`)
  if ([...html.matchAll(/<h1\b/gi)].length !== 1) fail(`${pathname}: expected one H1`)
  if ([...html.matchAll(/<link\b[^>]*rel="canonical"/gi)].length !== 1) fail(`${pathname}: expected one canonical`)
  if (!h1) fail(`${pathname}: H1 missing`)
  if (h1 !== route.h1) fail(`${pathname}: initial H1 differs from route configuration (${h1})`)
  if (pathname !== '/' && h1 === homepageH1) fail(`${pathname}: homepage H1 found in initial HTML`)
  if (canonical !== expectedCanonical) fail(`${pathname}: canonical ${canonical || '(missing)'} differs from ${expectedCanonical}`)
  if (/noindex/i.test(robots)) fail(`${pathname}: sitemap URL is noindex`)
  if (canonicalSet.has(canonical)) fail(`${pathname}: duplicate canonical ${canonical}`)
  canonicalSet.add(canonical)
  if (htmlLanguage(html) !== (route.language || 'fr')) fail(`${pathname}: HTML lang does not match route language`)
  for (const type of requiredSchema(route)) if (!satisfiesSchema(type, types)) fail(`${pathname}: required ${type} schema missing`)

  if (/Maillage interne|Mots-cl[eé]s travaill[eé]s|Blog d.autorit[eé]|Cluster prioritaire|Page pilier|city swap|signal s[eé]mantique/i.test(stripTags(html))) {
    fail(`${pathname}: patient-visible SEO strategy terminology remains`)
  }
  if (/Illustration d.ambiance|Illustration [eé]ditoriale|non-photographie du cabinet|non r[eé]alis[eé]e dans le cabinet/i.test(stripTags(html))) {
    fail(`${pathname}: an internal image disclaimer is visible to patients`)
  }

  for (const tag of [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => attributes(match[0]))) {
    if (!('alt' in tag)) fail(`${pathname}: image is missing an alt attribute`)
    if (tag.src?.startsWith('/') && !(await exists(path.join(distDir, tag.src)))) fail(`${pathname}: image asset is missing (${tag.src})`)
  }

  for (const href of [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)].map((match) => match[1])) {
    if (href.startsWith('#')) {
      if (!html.includes(`id="${href.slice(1)}"`)) fail(`${pathname}: missing anchor target ${href}`)
      continue
    }
    if (!href.startsWith('/')) continue
    const target = new URL(href.replaceAll('&amp;', '&'), absoluteUrl('/')).pathname
    if (target !== '/' && !/\.[a-z0-9]+$/i.test(target) && !target.endsWith('/')) fail(`${pathname}: noncanonical internal link ${href}`)
    if (!/\.[a-z0-9]+$/i.test(target) && target !== '/login/' && !seoRouteByPath.has(target)) fail(`${pathname}: broken or redirected internal link ${href}`)
  }

  if (route.pageType) {
    const alternatives = getAlternatesForPageType(route.pageType)
    const expectedAlternates = [...alternatives.map((item) => ({ hreflang: item.language, href: absoluteUrl(item.href) })), { hreflang: 'x-default', href: absoluteUrl(alternatives.find((item) => item.language === 'fr').href) }]
    const actualAlternates = alternatesOf(html)
    for (const expected of expectedAlternates) {
      if (!actualAlternates.some((item) => item.hreflang === expected.hreflang && item.href === expected.href)) fail(`${pathname}: missing hreflang ${expected.hreflang} -> ${expected.href}`)
    }
  }

  results.push({ URL: pathname, Status: status, Canonical: canonical, Robots: robots, H1: h1, Sitemap: 'yes', Result: 'PASS' })
}

for (const route of sitemapRoutes.filter((item) => item.path !== '/')) {
  const slashless = route.path.slice(0, -1)
  const redirect = matchRedirect(slashless, redirectRules)
  if (!redirect || ![301, 308].includes(redirect.status) || redirect.to !== route.path) fail(`${slashless}: missing one-hop permanent redirect to ${route.path}`)
  if (redirect && matchRedirect(redirect.to, redirectRules)) fail(`${slashless}: redirect target redirects again`)
}

for (const route of sitemapRoutes.filter((item) => item.pageType)) {
  const sourceHtml = htmlByPath.get(route.path)
  if (!sourceHtml) continue
  for (const alternate of getAlternatesForPageType(route.pageType)) {
    const targetHtml = htmlByPath.get(alternate.href)
    if (!targetHtml) { fail(`${route.path}: hreflang target is not in sitemap (${alternate.href})`); continue }
    if (!alternatesOf(targetHtml).some((item) => item.hreflang === (route.language || 'fr') && item.href === absoluteUrl(route.path))) {
      fail(`${route.path}: hreflang is not reciprocal from ${alternate.href}`)
    }
  }
}

for (const route of seoRoutes.filter((item) => item.indexable === false)) {
  const pathname = route.path
  const file = await fileForPath(pathname)
  if (!(await exists(file))) { fail(`${pathname}: noindex route has no generated HTML`); continue }
  const html = await fs.readFile(file, 'utf8')
  if (!/noindex/i.test(metaOf(html, 'robots'))) fail(`${pathname}: configured noindex route is missing noindex`)
  if (sitemapUrls.includes(absoluteUrl(pathname))) fail(`${pathname}: configured noindex route appears in the sitemap`)
}

const guideAssets = new Map()
for (const page of blogPages) {
  const pathname = trailingSlash(page.url)
  const route = seoRouteByPath.get(pathname)
  const html = route?.indexable === false
    ? await fs.readFile(await fileForPath(pathname), 'utf8').catch(() => '')
    : htmlByPath.get(pathname)
  const asset = mediaByRoute[pathname]

  if (!page.url.startsWith('/blog/') || !page.url.endsWith('/')) fail(`${page.url}: guide URL must use /blog/ and a trailing slash`)
  if (!route || route.type !== 'article') fail(`${pathname}: guide has no article route configuration`)
  if (!asset) fail(`${pathname}: guide has no dedicated image mapping`)
  if (asset && guideAssets.has(asset.fallback)) fail(`${pathname}: guide repeats the image assigned to ${guideAssets.get(asset.fallback)}`)
  if (asset) guideAssets.set(asset.fallback, pathname)
  if (route?.indexable === false && sitemapUrls.includes(absoluteUrl(pathname))) fail(`${pathname}: pending guide appears in the sitemap`)
  if (route?.indexable !== false && !sitemapUrls.includes(absoluteUrl(pathname))) fail(`${pathname}: indexable guide is absent from the sitemap`)
  if (!html) fail(`${pathname}: guide initial HTML was not generated`)
  if (html && h1Of(html) !== page.h1) fail(`${pathname}: generated guide H1 does not match its content record`)
  if (html && canonicalOf(html) !== absoluteUrl(pathname)) fail(`${pathname}: generated guide canonical is not self-referencing`)
}

const preAppointmentPath = '/pre-rendez-vous/'
const preHtml = await fs.readFile(await fileForPath(preAppointmentPath), 'utf8')
if (await directStatus(preAppointmentPath, redirectRules) !== 200) fail(`${preAppointmentPath}: expected direct 200`)
if (!/noindex,follow/i.test(metaOf(preHtml, 'robots'))) fail(`${preAppointmentPath}: noindex,follow missing`)
if (sitemapUrls.includes(absoluteUrl(preAppointmentPath))) fail(`${preAppointmentPath}: noindex URL appears in sitemap`)
results.push({ URL: preAppointmentPath, Status: 200, Canonical: canonicalOf(preHtml), Robots: metaOf(preHtml, 'robots'), H1: h1Of(preHtml), Sitemap: 'no', Result: 'PASS' })

for (const [legacy, target] of [
  ['/actualities/', '/blog/'],
  ['/actualites/', '/blog/'],
  ['/invisalign/', '/orthodontie-invisible-sete/'],
  ['/blog/prix-orthodontie-invisible-sete/', '/prix-orthodontie-invisible-sete/'],
  ['/blog/aligner-dents-avant-pose-implant/', '/blog/aligner-dents-avant-implant/'],
  ['/blog/orthodontie-sete-quand-consulter-alignement-dentaire/', '/orthodontie-sete/'],
  ['/blog/orthodontie-invisible-sete-questions-avant-bilan/', '/orthodontie-invisible-sete/'],
  ['/blog/verite-invisalign-taquets-temps-port-gene/', '/blog/orthodontie-invisible-quotidien-repas-entretien-parole/'],
]) {
  const redirect = matchRedirect(legacy, redirectRules)
  if (!redirect || redirect.status !== 301 || redirect.to !== target) fail(`${legacy}: expected one-hop 301 to ${target}`)
  if (sitemapUrls.includes(absoluteUrl(legacy))) fail(`${legacy}: redirected URL appears in sitemap`)
}

const unknownPath = '/a-random-url-that-does-not-exist/'
const unknownStatus = await directStatus(unknownPath, redirectRules)
const notFoundHtml = await fs.readFile(path.join(distDir, '404.html'), 'utf8')
if (unknownStatus !== 404) fail(`${unknownPath}: unknown route returned ${unknownStatus}, expected 404`)
if (!/noindex/i.test(metaOf(notFoundHtml, 'robots'))) fail('404 document is not noindex')
if (canonicalOf(notFoundHtml)) fail('404 document must not declare a canonical')
if (h1Of(notFoundHtml) === homepageH1) fail('404 document contains homepage H1')
results.push({ URL: unknownPath, Status: unknownStatus, Canonical: '', Robots: metaOf(notFoundHtml, 'robots'), H1: h1Of(notFoundHtml), Sitemap: 'no', Result: 'PASS' })

// Check full server-rendered content and linked entities, including noindex guides.
for (const route of seoRoutes) {
  const html = await fs.readFile(await fileForPath(route.path), 'utf8')
  const mainHtml = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || ''
  const visibleText = stripTags(mainHtml)
  const textFragments = route.page?.articleBody
    ? route.page.articleBody.split('\n').map((line) => line.trim().replace(/^(?:#{1,3}\s+|>\s+|-\s+|\d+\.\s+)/, '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1')).filter(Boolean)
    : (route.page?.sections || []).flatMap((section) => section.blocks.flatMap((block) => [...(block.paragraphs || []), ...(block.bullets || [])]))
  for (const text of textFragments) if (!visibleText.includes(stripTags(text))) fail(`${route.path}: existing editorial text missing from HTML (${text.slice(0, 60)})`)

  const definitions = new Set()
  const references = new Set()
  const visit = (node) => {
    if (!node || typeof node !== 'object') return
    if (node['@id']) (node['@type'] ? definitions : references).add(node['@id'])
    Object.values(node).forEach((child) => Array.isArray(child) ? child.forEach(visit) : visit(child))
  }
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) visit(JSON.parse(match[1]))
  for (const id of references) if (!definitions.has(id)) fail(`${route.path}: unresolved structured-data reference ${id}`)
  if (/style="[^"]*(?:^|;)opacity:0(?:;|")/.test(mainHtml)) fail(`${route.path}: content is initially invisible without JavaScript`)
  for (const form of [...mainHtml.matchAll(/<form\b[^>]*>/gi)].map((match) => attributes(match[0]))) {
    if (form.method !== 'post') fail(`${route.path}: form could expose values in a GET URL before JavaScript loads`)
  }
}

const vercel = JSON.parse(await fs.readFile('vercel.json', 'utf8'))
if (vercel.rewrites?.some((rule) => rule.destination === '/index.html')) fail('Vercel contains a homepage catch-all rewrite')
const netlify = await fs.readFile('netlify.toml', 'utf8')
if (/to\s*=\s*"\/index.html"/.test(netlify)) fail('Netlify contains a homepage catch-all rewrite')
const apache = await fs.readFile('public/.htaccess', 'utf8')
if (/RewriteRule\s+\.\s+\/index.html/.test(apache)) fail('Apache contains a homepage catch-all rewrite')
for (const route of sitemapRoutes) {
  const entry = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]).find((xml) => xml.includes(`<loc>${absoluteUrl(route.path)}</loc>`))
  const lastmod = entry?.match(/<lastmod>(.*?)<\/lastmod>/)?.[1]
  if (lastmod && lastmod !== (route.page?.dateModified || route.dateModified)) fail(`${route.path}: sitemap lastmod lacks an editorial source`)
}

console.table(results)
if (failures.length) {
  console.error(`\nSEO check failed with ${failures.length} issue(s):`)
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log(`\nSEO check passed: ${seoRoutes.length} public routes, ${sitemapRoutes.length} sitemap URLs, private exclusions, editorial content, structured-data links and 404 configuration (no live HTTP listener).`)
