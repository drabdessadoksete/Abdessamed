import { NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import logo from '../assets/Favicon/android-chrome-192x192.png'
import { blogPages, servicePages } from '../data/seoContent'

const curatedBlogLinks = [
  { label: 'Tous les articles', url: '/blog', description: 'Guides et conseils du cabinet.' },
  { label: 'Orthodontie à Sète', url: '/orthodontie-sete', description: 'Comprendre quand consulter et comment préparer son bilan.' },
  { label: 'Orthodontie invisible', url: '/orthodontie-invisible-sete', description: 'Les réponses essentielles avant un traitement discret.' },
]

const curatedGuideLinks = [
  { label: 'Quand consulter ?', url: '/blog/orthodontie-sete-quand-consulter-alignement-dentaire' },
  { label: 'Orthodontie adulte', url: '/blog/orthodontie-adulte-sete-questions-avant-traitement' },
  { label: 'Invisalign ou aligneurs ?', url: '/blog/invisalign-aligneurs-transparents-gouttieres-differences' },
]

const navLinkClass = ({ isActive }) => `nav-link relative rounded-full px-3 py-2 text-sm font-bold transition ${isActive ? 'is-active' : ''}`

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3v3M17 3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.2 2.5 3.2 5.5 3.2 9s-1 6.5-3.2 9c-2.2-2.5-3.2-5.5-3.2-9S9.8 5.5 12 3Z" />
    </svg>
  )
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState(null)
  const [desktopMenu, setDesktopMenu] = useState(null)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled && !mobileOpen && !desktopMenu && !langOpen

  const servicePillars = servicePages.filter((page) => page.menuGroup === 'pillars')
  const serviceLocals = servicePages.filter((page) => page.menuGroup === 'locals')
  const guides = curatedGuideLinks.filter((item) => blogPages.some((page) => page.url === item.url))
  const servicesActive = location.pathname === '/services' || servicePages.some((page) => page.url === location.pathname)
  const blogActive = location.pathname === '/blog' || blogPages.some((page) => page.url === location.pathname)

  const closeAll = () => {
    setMobileOpen(false)
    setMobileSection(null)
    setDesktopMenu(null)
    setLangOpen(false)
  }

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
    setLangOpen(false)
  }

  useEffect(() => { closeAll() }, [location.pathname])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeAll()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [mobileOpen])

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      setScrolled(current > 30)
      setHidden(current > 180 && current > lastScrollY.current + 8 && !mobileOpen && !desktopMenu)
      if (current < lastScrollY.current - 5 || current < 80) setHidden(false)
      lastScrollY.current = current
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mobileOpen, desktopMenu])

  return (
    <header className={`site-navbar ${transparent ? 'site-navbar--hero' : 'site-navbar--solid'} ${hidden ? 'site-navbar--hidden' : ''}`}>
      <div className="container-max flex h-16 items-center justify-between lg:h-[4.5rem]">
        <Link to="/" className="nav-wordmark flex min-w-0 items-center gap-3" onClick={closeAll}>
          <span className="navbar-logo-orbit"><img src={logo} alt="" aria-hidden="true" /></span>
          <span className="truncate text-sm font-black tracking-[-0.01em] sm:text-base">Dr. Abdessadok</span>
        </Link>

        <nav className="relative hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          <NavLink to="/" className={navLinkClass}>Accueil</NavLink>
          <NavLink to="/about" className={navLinkClass}>{t('nav.about')}</NavLink>

          <div className="relative" onMouseEnter={() => setDesktopMenu('services')} onMouseLeave={() => setDesktopMenu(null)}>
            <button type="button" className={navLinkClass({ isActive: servicesActive || desktopMenu === 'services' })} aria-expanded={desktopMenu === 'services'} aria-controls="services-mega-menu" onClick={() => setDesktopMenu((value) => value === 'services' ? null : 'services')}>
              {t('nav.services')} <span aria-hidden="true" className="ml-1">⌄</span>
            </button>
            <AnimatePresence>
              {desktopMenu === 'services' && (
                <motion.div id="services-mega-menu" initial={{ opacity: 0, y: 10, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .985 }} className="absolute left-1/2 top-full mt-3 w-[760px] -translate-x-1/2 rounded-2xl border border-rolexGold/20 bg-surface/95 p-6 text-foreground shadow-soft backdrop-blur-xl">
                  <div className="grid grid-cols-[0.8fr_1fr_1fr] gap-6">
                    <div className="rounded-2xl bg-rolexGreen/20 p-5">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-rolexGold">Nos soins</span>
                      <p className="mt-3 text-sm text-slate-300">Une approche globale, de la prévention à la réhabilitation du sourire.</p>
                      <Link to="/services" onClick={closeAll} className="mt-5 inline-flex font-bold text-rolexGold">Vue d’ensemble →</Link>
                    </div>
                    <div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-rolexGold">Expertises</p>
                      <div className="space-y-1">
                        {servicePillars.map((page) => <Link key={page.url} to={page.url} onClick={closeAll} className="block rounded-xl px-3 py-2 text-sm hover:bg-rolexGreen/5 hover:text-rolexGold">{page.menuLabel}</Link>)}
                      </div>
                    </div>
                    <div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-rolexGold">À proximité</p>
                      <div className="space-y-1">
                        {serviceLocals.slice(0, 6).map((page) => <Link key={page.url} to={page.url} onClick={closeAll} className="block rounded-xl px-3 py-2 text-sm hover:bg-rolexGreen/5 hover:text-rolexGold">{page.menuLabel}</Link>)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" onMouseEnter={() => setDesktopMenu('blog')} onMouseLeave={() => setDesktopMenu(null)}>
            <button type="button" className={navLinkClass({ isActive: blogActive || desktopMenu === 'blog' })} aria-expanded={desktopMenu === 'blog'} aria-controls="blog-mega-menu" onClick={() => setDesktopMenu((value) => value === 'blog' ? null : 'blog')}>
              Blog <span aria-hidden="true" className="ml-1">⌄</span>
            </button>
            <AnimatePresence>
              {desktopMenu === 'blog' && (
                <motion.div id="blog-mega-menu" initial={{ opacity: 0, y: 10, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .985 }} className="absolute right-0 top-full mt-3 w-[650px] rounded-2xl border border-rolexGold/20 bg-surface/95 p-6 text-foreground shadow-soft backdrop-blur-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div>{curatedBlogLinks.map((item) => <Link key={item.url} to={item.url} onClick={closeAll} className="mb-2 block rounded-xl p-3 hover:bg-rolexGreen/5"><span className="block font-bold">{item.label}</span><span className="mt-1 block text-xs text-muted">{item.description}</span></Link>)}</div>
                    <div className="rounded-2xl bg-rolexGreen/10 p-4"><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-rolexGold">Guides clés</p>{guides.map((item) => <Link key={item.url} to={item.url} onClick={closeAll} className="block rounded-xl px-3 py-2 text-sm hover:bg-rolexGreen/5 hover:text-rolexGold">{item.label}</Link>)}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/gallery" className={navLinkClass}>{t('nav.gallery')}</NavLink>
          <NavLink to="/contact" className={navLinkClass}>{t('nav.contact')}</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden h-10 items-center rounded-full border border-current/20 bg-white/10 px-4 text-sm font-bold backdrop-blur hover:border-rolexGold/45 hover:text-rolexGold xl:inline-flex">Se connecter</Link>

          <div className="relative">
            <button type="button" aria-label={t('aria.language')} aria-expanded={langOpen} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/20 bg-white/10 backdrop-blur hover:border-rolexGold/45 hover:text-rolexGold" onClick={() => setLangOpen((value) => !value)}><GlobeIcon /></button>
            {langOpen && <div className="absolute right-0 mt-2 w-40 rounded-xl border border-rolexGold/20 bg-surface p-1 text-foreground shadow-soft" role="menu"><button role="menuitem" className="w-full rounded-lg px-3 py-2 text-left hover:bg-rolexGreen/5" onClick={() => changeLanguage('fr')}>Français</button><button role="menuitem" className="w-full rounded-lg px-3 py-2 text-left hover:bg-rolexGreen/5" onClick={() => changeLanguage('en')}>English</button><button role="menuitem" className="w-full rounded-lg px-3 py-2 text-left hover:bg-rolexGreen/5" onClick={() => changeLanguage('es')}>Español</button></div>}
          </div>

          <Link to="/pre-rendez-vous" aria-label="Demander un pré-rendez-vous" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rolexGold/40 bg-rolexGold/10 text-rolexGold transition hover:-translate-y-0.5 hover:bg-rolexGold hover:text-white"><CalendarIcon /></Link>

          <button type="button" aria-label={mobileOpen ? t('aria.closeMenu') : t('aria.openMenu')} aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/20 bg-white/10 backdrop-blur hover:border-rolexGold/45 hover:text-rolexGold lg:hidden" onClick={() => setMobileOpen((value) => !value)}>
            {mobileOpen ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div id="mobile-navigation" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .28, ease: [0.22,1,0.36,1] }} className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-rolexGold/15 bg-surface text-foreground lg:hidden">
            <nav className="container-max flex min-h-full flex-col gap-2 py-6" aria-label="Navigation mobile">
              <NavLink to="/" onClick={closeAll} className={navLinkClass}>Accueil</NavLink>
              <NavLink to="/about" onClick={closeAll} className={navLinkClass}>{t('nav.about')}</NavLink>

              <div className="overflow-hidden rounded-2xl border border-rolexGreen/10 bg-rolexGreen/5">
                <button type="button" className="flex min-h-12 w-full items-center justify-between px-4 text-left font-bold" aria-expanded={mobileSection === 'services'} aria-controls="mobile-services" onClick={() => setMobileSection((value) => value === 'services' ? null : 'services')}><span>{t('nav.services')}</span><span aria-hidden="true">{mobileSection === 'services' ? '−' : '+'}</span></button>
                {mobileSection === 'services' && <motion.div id="mobile-services" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1 border-t border-rolexGreen/10 px-3 py-3"><Link to="/services" onClick={closeAll} className="block rounded-xl px-3 py-2 font-bold text-rolexGold">Vue d’ensemble</Link>{[...servicePillars, ...serviceLocals].map((page) => <Link key={page.url} to={page.url} onClick={closeAll} className="block rounded-xl px-3 py-2 text-sm hover:bg-rolexGreen/5">{page.menuLabel}</Link>)}</motion.div>}
              </div>

              <div className="overflow-hidden rounded-2xl border border-rolexGreen/10 bg-rolexGreen/5">
                <button type="button" className="flex min-h-12 w-full items-center justify-between px-4 text-left font-bold" aria-expanded={mobileSection === 'blog'} aria-controls="mobile-blog" onClick={() => setMobileSection((value) => value === 'blog' ? null : 'blog')}><span>Blog</span><span aria-hidden="true">{mobileSection === 'blog' ? '−' : '+'}</span></button>
                {mobileSection === 'blog' && <motion.div id="mobile-blog" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1 border-t border-rolexGreen/10 px-3 py-3">{[...curatedBlogLinks, ...guides].map((item) => <Link key={item.url} to={item.url} onClick={closeAll} className="block rounded-xl px-3 py-2 text-sm hover:bg-rolexGreen/5">{item.label}</Link>)}</motion.div>}
              </div>

              <NavLink to="/gallery" onClick={closeAll} className={navLinkClass}>{t('nav.gallery')}</NavLink>
              <NavLink to="/contact" onClick={closeAll} className={navLinkClass}>{t('nav.contact')}</NavLink>
              <Link to="/login" onClick={closeAll} className="rounded-full px-3 py-2 text-sm font-bold">Se connecter</Link>
              <Link to="/pre-rendez-vous" onClick={closeAll} className="btn-primary mt-4">Demander un pré-rendez-vous <span aria-hidden="true">→</span></Link>
              <div className="mt-auto border-t border-rolexGreen/10 pt-5 text-sm text-muted"><strong className="text-foreground">Dr. Abdessamed Abdessadok</strong><a href="tel:+33422910594" className="mt-1 block text-rolexGold">04 22 91 05 94</a><p className="mt-2">10 Bd Danièle Casanova, Sète</p></div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
