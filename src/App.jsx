import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollReveal from './components/ScrollReveal'
import MobileBookingBar from './components/MobileBookingBar'
import AnalyticsTracker from './components/AnalyticsTracker'
import ConsentBanner from './components/ConsentBanner'
import { absoluteUrl, site, trailingSlash } from './config/site'
import { getAlternatesForPageType, multilingualRoutes, routeLanguage, routePageType } from './config/multilingualRoutes'
import { coreMetadataByPath } from './config/pageMetadata'
import { mediaForRoute } from './config/media'
import { corePageGraph, practiceGraph } from './utils/pageSchema'

function removeReplacedStaticHeadTags() {
  // Build-time JSON-LD belongs to the initial URL, never to subsequent SPA routes.
  if (document.head.querySelector('script#practice-structured-data[data-rh="true"]')) {
    document.head.querySelectorAll('[data-static-seo="schema"]').forEach((tag) => tag.remove())
  }
  const staticTags = document.head.querySelectorAll('[data-static-seo="dedupe"]')
  staticTags.forEach((staticTag) => {
    const identityAttribute = ['name', 'property', 'rel'].find((attribute) => staticTag.hasAttribute(attribute))
    if (!identityAttribute) return
    const identityValue = staticTag.getAttribute(identityAttribute)
    const tagName = staticTag.tagName.toLowerCase()
    const hasManagedEquivalent = [...document.head.querySelectorAll(`${tagName}[data-rh="true"]`)]
      .some((candidate) => candidate.getAttribute(identityAttribute) === identityValue &&
        (identityValue !== 'alternate' || candidate.getAttribute('hreflang') === staticTag.getAttribute('hreflang')))
    if (hasManagedEquivalent) staticTag.remove()
  })
}

export default function App() {
  const location = useLocation()
  const normalizedPath = trailingSlash(location.pathname)
  const canonicalUrl = absoluteUrl(normalizedPath)
  const isPrivate = normalizedPath.startsWith('/admin/') || normalizedPath.startsWith('/login/')
  const isAnalyticsPreview = new URLSearchParams(location.search).get('analytics-preview') === '1'
  const isPreAppointment = normalizedPath === '/pre-rendez-vous/'
  const isLegacyActuality = normalizedPath.startsWith('/actualities/') && normalizedPath !== '/actualities/'
  const language = routeLanguage(normalizedPath)
  const pageType = routePageType(normalizedPath)
  const isHome = pageType === 'home'
  const alternates = pageType ? getAlternatesForPageType(pageType) : []
  const defaultAlternate = alternates.find((alternate) => alternate.language === 'fr')
  const metadata = coreMetadataByPath.get(normalizedPath) || multilingualRoutes.find((route) => route.path === normalizedPath)
  const image = mediaForRoute(normalizedPath)
  const shouldNoIndex = isPrivate || isPreAppointment || isLegacyActuality

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    const observer = new MutationObserver(removeReplacedStaticHeadTags)
    observer.observe(document.head, { childList: true })
    removeReplacedStaticHeadTags()
    const frame = window.requestAnimationFrame(removeReplacedStaticHeadTags)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [location.pathname])

  return (
    <div className="public-site min-h-screen bg-background text-foreground">
      <AnalyticsTracker disabled={isPrivate || isAnalyticsPreview} />
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>
      <ScrollReveal pathname={location.pathname} />
      <Helmet htmlAttributes={{ lang: language }} defaultTitle="Cabinet dentaire à Sète | Dr Abdessadok">
        <title>{metadata?.title || 'Cabinet dentaire à Sète | Dr Abdessadok'}</title>
        <meta name="description" content={metadata?.description || 'Cabinet dentaire à Sète du Dr Abdessamed Abdessadok : soins dentaires, implantologie et orthodontie invisible.'} />
        <link rel="canonical" href={canonicalUrl} />
        {alternates.map((alternate) => <link key={alternate.language} rel="alternate" href={absoluteUrl(alternate.href)} hrefLang={alternate.language} />)}
        {defaultAlternate ? <link rel="alternate" href={absoluteUrl(defaultAlternate.href)} hrefLang="x-default" /> : null}
        <meta property="og:title" content={metadata?.title || site.practiceName} />
        <meta property="og:description" content={metadata?.description || 'Implantologie et orthodontie invisible au cabinet dentaire à Sète.'} />
        <meta property="og:site_name" content={site.practiceName} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={absoluteUrl(image.fallback)} />
        <meta property="og:image:alt" content={image.alt} />
        <meta property="og:image:width" content={String(image.width)} />
        <meta property="og:image:height" content={String(image.height)} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata?.title || site.practiceName} />
        <meta name="twitter:description" content={metadata?.description || 'Implantologie et orthodontie invisible au cabinet dentaire à Sète.'} />
        <meta name="twitter:image" content={absoluteUrl(image.fallback)} />
        <meta property="og:locale" content={language === 'fr' ? 'fr_FR' : language === 'en' ? 'en_GB' : language === 'es' ? 'es_ES' : 'de_DE'} />
        <meta name="robots" content={isPrivate ? 'noindex,nofollow' : shouldNoIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'} />
        <script id="practice-structured-data" type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [...practiceGraph, ...corePageGraph(metadata, image)],
        })}</script>
      </Helmet>
      <Navbar />
      <main id="main-content" tabIndex="-1" className={`overflow-x-hidden ${isHome ? 'public-main--home' : 'public-main--internal'}`}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      <MobileBookingBar pathname={location.pathname} />
      <Footer />
      {!isPrivate && !isAnalyticsPreview && <ConsentBanner />}
    </div>
  )
}
