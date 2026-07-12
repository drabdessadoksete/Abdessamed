import fs from 'node:fs/promises'
import path from 'node:path'
import { seoRouteByPath, seoRoutes, sitemapRoutes } from '../src/config/seoRoutes.js'
import { getAlternatesForPageType } from '../src/config/multilingualRoutes.js'
import { absoluteUrl, trailingSlash } from '../src/config/site.js'

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
      return (value['@graph'] || [value]).flatMap((item) => Array.isArray(item['@type']) ? item['@type'] : [item['@type']]).filter(Boolean)
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
  if (!h1) fail(`${pathname}: H1 missing`)
  if (h1 !== route.h1) fail(`${pathname}: initial H1 differs from route configuration (${h1})`)
  if (pathname !== '/' && h1 === homepageH1) fail(`${pathname}: homepage H1 found in initial HTML`)
  if (canonical !== expectedCanonical) fail(`${pathname}: canonical ${canonical || '(missing)'} differs from ${expectedCanonical}`)
  if (/noindex/i.test(robots)) fail(`${pathname}: sitemap URL is noindex`)
  if (canonicalSet.has(canonical)) fail(`${pathname}: duplicate canonical ${canonical}`)
  canonicalSet.add(canonical)
  if (htmlLanguage(html) !== (route.language || 'fr')) fail(`${pathname}: HTML lang does not match route language`)
  for (const type of requiredSchema(route)) if (!types.includes(type)) fail(`${pathname}: required ${type} schema missing`)

  if (/Maillage interne|Mots-cl[eé]s travaill[eé]s|Blog d.autorit[eé]|Cluster prioritaire|Page pilier|city swap|signal s[eé]mantique/i.test(stripTags(html))) {
    fail(`${pathname}: patient-visible SEO strategy terminology remains`)
  }

  for (const tag of [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => attributes(match[0]))) {
    if (!('alt' in tag)) fail(`${pathname}: image is missing an alt attribute`)
    if (tag.src?.startsWith('/images/') && !(await exists(path.join(distDir, tag.src)))) fail(`${pathname}: image asset is missing (${tag.src})`)
  }

  for (const href of [...html.matchAll(/<a[^>]+href=["']([^"'#?]+)["']/gi)].map((match) => match[1])) {
    if (!href.startsWith('/') || href === '/' || /\.[a-z0-9]+$/i.test(href) || href.endsWith('/')) continue
    fail(`${pathname}: internal link is not trailing-slash canonical (${href})`)
  }

  if (route.pageType) {
    const expectedAlternates = [...getAlternatesForPageType(route.pageType).map((item) => ({ hreflang: item.language, href: absoluteUrl(item.href) })), { hreflang: 'x-default', href: absoluteUrl('/') }]
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

const preAppointmentPath = '/pre-rendez-vous/'
const preHtml = await fs.readFile(await fileForPath(preAppointmentPath), 'utf8')
if (await directStatus(preAppointmentPath, redirectRules) !== 200) fail(`${preAppointmentPath}: expected direct 200`)
if (!/noindex,follow/i.test(metaOf(preHtml, 'robots'))) fail(`${preAppointmentPath}: noindex,follow missing`)
if (sitemapUrls.includes(absoluteUrl(preAppointmentPath))) fail(`${preAppointmentPath}: noindex URL appears in sitemap`)
results.push({ URL: preAppointmentPath, Status: 200, Canonical: canonicalOf(preHtml), Robots: metaOf(preHtml, 'robots'), H1: h1Of(preHtml), Sitemap: 'no', Result: 'PASS' })

for (const [legacy, target] of [['/actualities/', '/blog/'], ['/actualites/', '/blog/'], ['/blog/prix-orthodontie-invisible-sete/', '/prix-orthodontie-invisible-sete/']]) {
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

console.table(results)
if (failures.length) {
  console.error(`\nSEO check failed with ${failures.length} issue(s):`)
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log(`\nSEO check passed for ${results.length} routes without requiring a local HTTP listener.`)
