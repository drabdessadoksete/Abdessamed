import KeepAlive from './components/KeepAlive'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import logoUrl from './assets/Favicon/android-chrome-192x192.png'
import Navbar from './components/Navbar'
import './i18n/index.js'
import Footer from './components/Footer'
import ScrollReveal from './components/ScrollReveal'
import MobileBookingBar from './components/MobileBookingBar'

const baseUrl = 'https://cabinetdentairesete.fr'

export default function App() {
  const location = useLocation()
  const normalizedPath = location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '')
  const canonicalUrl = `${baseUrl}${normalizedPath}`
  const isPrivate = normalizedPath.startsWith('/admin') || normalizedPath.startsWith('/login')
  const isHome = normalizedPath === '/'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="public-site min-h-screen bg-background text-foreground">
      <KeepAlive />
      <ScrollReveal pathname={location.pathname} />
      <Helmet defaultTitle="Cabinet Dentaire Dr. Abdessadok" titleTemplate="%s | Dr. Abdessadok">
        <meta name="description" content="Cabinet Dentaire Dr. Abdessadok - Un sourire sain, une confiance retrouvee." />
        <meta name="theme-color" content="#F5F3ED" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" href={canonicalUrl} hreflang="fr" />
        <link rel="alternate" href={canonicalUrl} hreflang="x-default" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="robots" content={isPrivate ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Dentist',
          name: 'Cabinet Dentaire Dr Abdessadok',
          image: typeof window !== 'undefined' ? new URL(logoUrl, window.location.origin).toString() : logoUrl,
          '@id': typeof window !== 'undefined' ? window.location.origin : '',
          url: typeof window !== 'undefined' ? window.location.origin : '',
          telephone: '+33422910594',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'RDC, 10 Bd Daniele Casanova',
            addressLocality: 'Sete',
            postalCode: '34200',
            addressCountry: 'FR',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 43.4000,
            longitude: 3.6833,
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
              opens: '08:00',
              closes: '17:00',
            },
          ],
          priceRange: '$$',
        })}</script>
      </Helmet>
      <Navbar />
      <main className={`overflow-x-hidden ${isHome ? 'public-main--home' : 'public-main--internal pt-16 lg:pt-[4.5rem]'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileBookingBar pathname={location.pathname} />
      <Footer />
    </div>
  )
}
