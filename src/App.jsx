import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollReveal from './components/ScrollReveal'
import MobileBookingBar from './components/MobileBookingBar'
import { absoluteUrl, dentistPersonSchema, dentistSchema, organizationSchema, trailingSlash } from './config/site'
import { getAlternatesForPageType, routeLanguage, routePageType } from './config/multilingualRoutes'

export default function App() {
  const location = useLocation()
  const normalizedPath = trailingSlash(location.pathname)
  const canonicalUrl = absoluteUrl(normalizedPath)
  const isPrivate = normalizedPath.startsWith('/admin/') || normalizedPath.startsWith('/login/')
  const isPreAppointment = normalizedPath === '/pre-rendez-vous/'
  const isLegacyActuality = normalizedPath.startsWith('/actualities/') && normalizedPath !== '/actualities/'
  const language = routeLanguage(normalizedPath)
  const pageType = routePageType(normalizedPath)
  const isHome = pageType === 'home'
  const isFrenchHome = normalizedPath === '/'
  const alternates = pageType ? getAlternatesForPageType(pageType) : []

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <div className="public-site min-h-screen bg-background text-foreground">
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>
      <ScrollReveal pathname={location.pathname} />
      <Helmet htmlAttributes={{ lang: language }} defaultTitle="Cabinet Dentaire Dr. Abdessadok" titleTemplate="%s | Dr. Abdessadok">
        <meta name="description" content="Cabinet Dentaire Dr. Abdessadok - Un sourire sain, une confiance retrouvee." />
        <meta name="theme-color" content="#F5F3ED" />
        <link rel="canonical" href={canonicalUrl} />
        {alternates.map((alternate) => <link key={alternate.language} rel="alternate" href={absoluteUrl(alternate.href)} hreflang={alternate.language} />)}
        {alternates.length ? <link rel="alternate" href={absoluteUrl('/')} hreflang="x-default" /> : null}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={language === 'fr' ? 'fr_FR' : language === 'en' ? 'en_GB' : language === 'es' ? 'es_ES' : 'de_DE'} />
        <meta name="robots" content={isPrivate ? 'noindex,nofollow' : isPreAppointment || isLegacyActuality ? 'noindex,follow' : 'index,follow,max-image-preview:large'} />
        {isFrenchHome && <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            dentistSchema,
            dentistPersonSchema,
            organizationSchema,
            { '@type': 'WebSite', '@id': `${absoluteUrl('/')}#website`, url: absoluteUrl('/'), name: organizationSchema.name, inLanguage: 'fr' },
            { '@type': 'WebPage', '@id': `${absoluteUrl('/')}#webpage`, url: absoluteUrl('/'), name: 'Cabinet dentaire à Sète', isPartOf: { '@id': `${absoluteUrl('/')}#website` }, inLanguage: 'fr' },
          ],
        })}</script>}
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
    </div>
  )
}
