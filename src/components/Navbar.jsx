import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { media } from '../config/media'
import { equivalentPath, getLanguageNavigation, routeLanguage } from '../config/multilingualRoutes'
import { trackEvent } from '../utils/analytics'

const frenchNavigation = [
  { label: 'Accueil', href: '/' },
  { label: 'À propos', href: '/about/' },
  { label: 'Soins', href: '/services/' },
  { label: 'Guides', href: '/blog/' },
  { label: 'Galerie', href: '/gallery/' },
  { label: 'Contact', href: '/contact/' },
]

const languageNames = { fr: 'FR', en: 'EN', es: 'ES', de: 'DE' }

function languageNavigation(language) {
  if (language === 'fr') return frenchNavigation
  const { labels, paths } = getLanguageNavigation(language)
  return [
    { label: labels.home, href: paths.home },
    { label: labels.ortho, href: paths.ortho },
    { label: labels.implant, href: paths.implant },
    { label: labels.contact, href: paths.contact },
  ]
}

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const pathname = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`
  const language = routeLanguage(pathname)
  const nav = languageNavigation(language)
  const localized = language !== 'fr'
  const isHome = pathname === '/' || pathname === `/${language}/`
  const transparent = isHome && !scrolled && !mobileOpen
  const ctaHref = localized ? getLanguageNavigation(language).paths.contact : '/pre-rendez-vous/'
  const ctaLabel = localized ? getLanguageNavigation(language).labels.cta : 'Pré-rendez-vous'

  useEffect(() => {
    setMobileOpen(false)
    setLanguageOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const close = (event) => { if (event.key === 'Escape') { setMobileOpen(false); setLanguageOpen(false) } }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [])

  useEffect(() => {
    const update = () => {
      const current = window.scrollY
      setScrolled(current > 28)
      setHidden(current > 190 && current > lastScrollY.current + 8 && !mobileOpen)
      if (current < lastScrollY.current - 5 || current < 90) setHidden(false)
      lastScrollY.current = current
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [mobileOpen])

  const closeMobileMenu = () => setMobileOpen(false)

  const mobileNavigation = (
    <AnimatePresence>
      {mobileOpen ? (
        <motion.nav
          id="mobile-navigation"
          className="authority-navbar__mobile"
          aria-label="Navigation mobile"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <div className="container-max">
            {nav.map((item, index) => (
              <NavLink key={item.href} to={item.href} onClick={closeMobileMenu}>
                <span>{String(index + 1).padStart(2, '0')}</span>{item.label}
              </NavLink>
            ))}
            <Link to={ctaHref} className="btn-accent" onClick={closeMobileMenu}>{ctaLabel}</Link>
            {!localized ? <Link to="/login/" className="authority-navbar__login" onClick={closeMobileMenu}>Espace cabinet</Link> : null}
          </div>
        </motion.nav>
      ) : null}
    </AnimatePresence>
  )

  return (
    <>
      <header className={`site-navbar authority-navbar ${transparent ? 'site-navbar--hero' : 'site-navbar--solid'} ${hidden ? 'site-navbar--hidden' : ''}`}>
        <div className="container-max authority-navbar__inner">
          <Link to={localized ? `/${language}/` : '/'} className="authority-navbar__brand" aria-label="Cabinet Dentaire Dr Abdessadok, accueil">
            <img src={media.logo.fallback} alt="" aria-hidden="true" />
            <span><strong>Dr. Abdessadok</strong><small>Chirurgien-dentiste · Sète</small></span>
          </Link>

          <nav className="authority-navbar__desktop" aria-label={localized ? 'Main navigation' : 'Navigation principale'}>
            {nav.map((item) => <NavLink key={item.href} to={item.href} className={({ isActive }) => isActive ? 'is-active' : ''}>{item.label}</NavLink>)}
          </nav>

          <div className="authority-navbar__actions">
            <div className="language-menu">
              <button type="button" aria-label="Choisir la langue" aria-expanded={languageOpen} onClick={() => setLanguageOpen((value) => !value)}>{languageNames[language]} <span aria-hidden="true">⌄</span></button>
              {languageOpen ? (
                <div role="menu">
                  {Object.keys(languageNames).map((target) => (
                    <Link key={target} role="menuitem" to={equivalentPath(pathname, target)} lang={target} onClick={() => trackEvent('language_switch', { from: language, to: target })}>{languageNames[target]}</Link>
                  ))}
                </div>
              ) : null}
            </div>
            <Link to={ctaHref} className="authority-navbar__cta">{ctaLabel}</Link>
            <button type="button" className="authority-navbar__toggle" aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen((value) => !value)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>
      {typeof document !== 'undefined' ? createPortal(mobileNavigation, document.body) : null}
    </>
  )
}
