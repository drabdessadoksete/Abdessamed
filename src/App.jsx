import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import logoUrl from './assets/new logo.png'
import Navbar from './components/Navbar'
import './i18n/index.js'
import Footer from './components/Footer'

export default function App() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <meta name="description" content="Cabinet Dentaire Dr. Abdessadok — Un sourire sain, une confiance retrouvée." />
        <meta name="theme-color" content="#2563eb" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Dentist',
          name: 'Cabinet Dentaire Dr Abdessadok',
          image: typeof window !== 'undefined' ? new URL(logoUrl, window.location.origin).toString() : logoUrl,
          '@id': typeof window !== 'undefined' ? window.location.origin : '',
          url: typeof window !== 'undefined' ? window.location.origin : '',
          telephone: '+33467000000',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '10 Boulevard Danièle Casanova',
            addressLocality: 'Sète',
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
      <main className="overflow-x-hidden">
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
      <Footer />
    </div>
  )
}
