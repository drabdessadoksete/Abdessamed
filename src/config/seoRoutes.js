import { blogPages, servicePages } from '../data/seoContent.js'
import { absoluteUrl, trailingSlash } from './site.js'
import { multilingualRoutes } from './multilingualRoutes.js'

import { staticSeoRoutes } from './pageMetadata.js'
export { staticSeoRoutes } from './pageMetadata.js'

const contentRoutes = [...servicePages, ...blogPages].map((page) => ({
  path: trailingSlash(page.url),
  title: page.title,
  description: page.metaDescription,
  h1: page.h1,
  type: page.url.startsWith('/blog/') ? 'article' : 'treatment',
  language: 'fr',
  indexable: page.indexable,
  pageType: page.url === '/orthodontie-invisible-sete/' ? 'ortho' : page.url === '/implantologie/' ? 'implant' : undefined,
  page,
  source: page.cluster === 'implantologie'
    ? 'src/data/implantologyArticles.js'
    : page.url.startsWith('/blog/') && page.articleBody
      ? 'src/data/generatedOrthodontieArticles.js'
      : 'src/data/seoContent.js',
}))

const localizedSeoRoutes = multilingualRoutes.map((route) => ({
  ...route,
  h1: route.h1,
  language: route.language,
  indexable: true,
}))

export const seoRoutes = [...staticSeoRoutes, ...contentRoutes, ...localizedSeoRoutes]
export const sitemapRoutes = seoRoutes.filter((route) => route.indexable !== false)
export const seoRouteByPath = new Map(seoRoutes.map((route) => [trailingSlash(route.path), route]))

export function routeUrl(routeOrPath) {
  return absoluteUrl(typeof routeOrPath === 'string' ? routeOrPath : routeOrPath.path)
}
