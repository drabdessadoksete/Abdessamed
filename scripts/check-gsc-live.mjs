import fs from 'node:fs/promises'
import { gscCases } from './gsc-url-cases.mjs'
import { seoRoutes, sitemapRoutes } from '../src/config/seoRoutes.js'
import { site } from '../src/config/site.js'

const output = process.argv.find((arg) => arg.startsWith('--output='))?.slice(9)
const check = process.argv.includes('--check')
const baseUrl = process.argv.find((arg) => arg.startsWith('--base-url='))?.slice(11)
const origin = baseUrl ? new URL(baseUrl).origin : site.url
if (baseUrl && !['localhost', '127.0.0.1'].includes(new URL(baseUrl).hostname)) throw new Error('--base-url must be a local test server')
const urls = [...new Set([...gscCases.map((item) => item.url),
  ...seoRoutes.map((route) => `${site.url}${route.path}`),
  'http://cabinetdentairesete.fr/', 'http://www.cabinetdentairesete.fr/',
  'https://cabinetdentairesete.fr/sitemap.xml',
  'https://www.cabinetdentairesete.fr/contact/?source=gsc-check',
  'https://cabinetdentairesete.fr/contact?source=gsc-check',
  'https://cabinetdentairesete.fr/this-page-does-not-exist-gsc-check/',
])]
const redirectRules = (await fs.readFile(new URL('../public/_redirects', import.meta.url), 'utf8'))
  .split(/\r?\n/).filter((line) => line && !line.startsWith('#')).map((line) => {
    const [from, to, status] = line.split(/\s+/)
    return { from, to, status: Number(status) }
  })

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] || ''
}

async function inspect(startUrl) {
  const hops = []
  const seen = new Set()
  const initial = new URL(startUrl)
  let url = baseUrl ? `${origin}${initial.pathname}${initial.search}` : startUrl
  try {
    for (let count = 0; count <= 8; count++) {
      if (seen.has(url)) throw new Error(`Redirect loop at ${url}`)
      seen.add(url)
      const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'CabinetSEOCheck/1.0', Accept: 'text/html,application/xml' } })
      const location = response.headers.get('location')
      hops.push({ url, status: response.status, ...(location ? { location } : {}) })
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        await response.body?.cancel()
        if (!location) throw new Error('Redirect has no Location header')
        url = new URL(location, url).href
        const next = new URL(url)
        const allowedHosts = baseUrl ? [new URL(origin).hostname] : ['cabinetdentairesete.fr', 'www.cabinetdentairesete.fr']
        if (!allowedHosts.includes(next.hostname) || !['http:', 'https:'].includes(next.protocol)) throw new Error(`Unexpected redirect destination ${url}`)
        continue
      }
      const html = await response.text()
      const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0])
      const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0])
      return {
        url: startUrl, finalUrl: url, status: response.status, hops,
        canonical: attribute(links.find((tag) => attribute(tag, 'rel') === 'canonical') || '', 'href'),
        robots: metas.filter((tag) => ['robots', 'googlebot'].includes(attribute(tag, 'name'))).map((tag) => attribute(tag, 'content')),
        xRobots: response.headers.get('x-robots-tag'),
        h1: html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]*>/g, '').trim() || '',
        sitemapUrls: startUrl.endsWith('/sitemap.xml') ? [...html.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]) : undefined,
      }
    }
    throw new Error('More than 8 redirects')
  } catch (error) {
    return { url: startUrl, hops, error: error.cause?.message || error.message }
  }
}

const results = []
let cursor = 0
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < urls.length) {
    const index = cursor++
    results[index] = await inspect(urls[index])
  }
}))

function validate(result) {
  if (result.error) return [result.error]
  const failures = []
  const initial = new URL(result.url)
  const final = new URL(result.finalUrl)
  const isUnknown = initial.pathname === '/this-page-does-not-exist-gsc-check/'
  const isLegacy = initial.pathname.startsWith('/actualities/')
  const isLogin = /^\/login\/?$/.test(initial.pathname)
  const rule = redirectRules.find((item) => item.from === initial.pathname && item.status === 301)
  const target = rule?.to || (isLogin ? '/login/' : initial.pathname)
  const route = seoRoutes.find((item) => item.path === target)
  const noindex = /noindex|\bnone\b/i.test([...result.robots, result.xRobots || ''].join(','))
  if (result.status !== (isUnknown ? 404 : 200)) failures.push(`Expected ${isUnknown ? 404 : 200}, received ${result.status}`)
  if (final.origin !== origin) failures.push(`Final host/protocol is ${final.origin}; expected ${origin}`)
  if (final.pathname !== target) failures.push(`Expected final path ${target}, received ${final.pathname}`)
  if (final.search !== initial.search) failures.push('Query string lost during redirect')
  if (result.hops.slice(0, -1).some((hop) => ![301, 308].includes(hop.status))) failures.push('Redirect is not permanent')
  if (result.hops.length > 4) failures.push('More than three redirects')
  if (rule && (baseUrl || initial.origin === site.url) && result.hops.length !== 2) failures.push('Expected exactly one redirect to the canonical destination')
  if (route) {
    if (result.canonical !== `${site.url}${target}`) failures.push('Missing or incorrect canonical')
    if (noindex !== (route.indexable === false)) failures.push(route.indexable === false ? 'Expected noindex' : 'Page still has noindex')
    if (!result.h1) failures.push('Missing initial H1')
    if (initial.pathname === target && initial.origin === site.url && result.hops.length !== 1) failures.push('Canonical public URL redirects')
  } else if (isLogin || isLegacy || isUnknown) {
    if (!noindex) failures.push('Private, legacy or missing page lacks noindex')
  } else if (initial.pathname === '/sitemap.xml') {
    const expected = sitemapRoutes.map((item) => `${site.url}${item.path}`).sort()
    if (JSON.stringify([...(result.sitemapUrls || [])].sort()) !== JSON.stringify(expected)) failures.push(`Sitemap does not match the ${expected.length} intended indexable URLs`)
  } else {
    failures.push('Test URL has no expected outcome')
  }
  return failures
}

if (check) for (const result of results) result.failures = validate(result)
const failed = results.filter((result) => result.error || result.status >= 500 || result.failures?.length)
const report = { checkedAt: new Date().toISOString(), mode: check ? 'assertions' : 'observation', origin, hostChecksSkipped: Boolean(baseUrl), results }
if (output) await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n')
if (!check) for (const result of results) console.log(JSON.stringify(result))
else for (const result of failed) console.error(`${result.url}: ${(result.failures || [result.error]).join('; ')}`)
console.log(`${check ? 'Checked' : 'Observed'} ${results.length} URLs; ${failed.length} failures.${baseUrl ? ' Local emulator: production host rules are not tested.' : ''}`)
if (failed.length) process.exitCode = 1
