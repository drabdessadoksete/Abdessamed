import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import logo from '../assets/Favicon/android-chrome-192x192.png'
import { blogPages, servicePages } from '../data/seoContent'

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-rolexGreen/40 ${
        isActive
          ? 'text-foreground border border-rolexGreen/40 bg-rolexGreen/45 backdrop-blur-sm'
          : 'hover:bg-rolexGreen/10'
      }`}
  >
    {children}
  </NavLink>
)

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [desktopMenu, setDesktopMenu] = useState(null)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false)
  const closeMenu = () => setOpen(false)
  const closeAllMenus = () => {
    setOpen(false)
    setLangOpen(false)
    setDesktopMenu(null)
    setMobileServicesOpen(false)
    setMobileBlogOpen(false)
  }
  const changeLang = (code) => { i18n.changeLanguage(code); localStorage.setItem('lang', code); setLangOpen(false) }
  const servicePillars = servicePages.filter((page) => page.menuGroup === 'pillars')
  const serviceLocals = servicePages.filter((page) => page.menuGroup === 'locals')

  useEffect(() => {
    setOpen(false)
    setDesktopMenu(null)
    setLangOpen(false)
  }, [location.pathname])

  const isServicesActive = location.pathname === '/services' || servicePages.some((page) => page.url === location.pathname)
  const isBlogActive = location.pathname === '/blog' || blogPages.some((page) => page.url === location.pathname)

  return (
    <header className="sticky top-0 z-50 backdrop-blur navbar-gold border-b border-slate-800">
      <div className="container-max flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="flex items-center gap-2 min-w-0" onClick={closeAllMenus}>
          <img src={logo} alt="Logo Cabinet Dentaire Dr Abdessadok" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-bold text-sm sm:text-base truncate">Dr. Abdessadok</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 relative">
          <NavItem to="/">{t('nav.home')}</NavItem>
          <NavItem to="/about">{t('nav.about')}</NavItem>
          <div
            className="relative"
            onMouseEnter={() => setDesktopMenu('services')}
            onMouseLeave={() => setDesktopMenu((current) => (current === 'services' ? null : current))}
          >
            <button
              type="button"
              className={`px-3 py-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-rolexGreen/40 ${
                isServicesActive || desktopMenu === 'services'
                  ? 'text-foreground border border-rolexGreen/40 bg-rolexGreen/45 backdrop-blur-sm'
                  : 'hover:bg-rolexGreen/10'
              }`}
              onClick={() => setDesktopMenu((current) => (current === 'services' ? null : 'services'))}
            >
              {t('nav.services')}
            </button>
            <AnimatePresence>
              {desktopMenu === 'services' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full mt-3 w-[720px] -translate-x-1/2 rounded-[2rem] border border-rolexGold/20 bg-surface/95 p-6 shadow-soft backdrop-blur"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-rolexGold mb-3">Pages piliers</div>
                      <div className="space-y-3">
                        <Link to="/services" className="block rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 p-4 hover:bg-rolexGreen/20 transition" onClick={closeAllMenus}>
                          <div className="font-semibold">Vue d&apos;ensemble des services</div>
                          <div className="text-sm text-slate-300 mt-1">Implantologie, Invisalign et soins du cabinet.</div>
                        </Link>
                        {servicePillars.map((page) => (
                          <Link key={page.url} to={page.url} className="block rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 p-4 hover:bg-rolexGreen/20 transition" onClick={closeAllMenus}>
                            <div className="font-semibold">{page.menuLabel}</div>
                            <div className="text-sm text-slate-300 mt-1">{page.menuDescription}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-rolexGold mb-3">Pages locales</div>
                      <div className="space-y-3">
                        {serviceLocals.map((page) => (
                          <Link key={page.url} to={page.url} className="block rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 p-4 hover:bg-rolexGreen/20 transition" onClick={closeAllMenus}>
                            <div className="font-semibold">{page.menuLabel}</div>
                            <div className="text-sm text-slate-300 mt-1">{page.menuDescription}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div
            className="relative"
            onMouseEnter={() => setDesktopMenu('blog')}
            onMouseLeave={() => setDesktopMenu((current) => (current === 'blog' ? null : current))}
          >
            <button
              type="button"
              className={`px-3 py-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-rolexGreen/40 ${
                isBlogActive || desktopMenu === 'blog'
                  ? 'text-foreground border border-rolexGreen/40 bg-rolexGreen/45 backdrop-blur-sm'
                  : 'hover:bg-rolexGreen/10'
              }`}
              onClick={() => setDesktopMenu((current) => (current === 'blog' ? null : 'blog'))}
            >
              Blog
            </button>
            <AnimatePresence>
              {desktopMenu === 'blog' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full mt-3 w-[620px] -translate-x-1/2 rounded-[2rem] border border-rolexGold/20 bg-surface/95 p-6 shadow-soft backdrop-blur"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <Link to="/blog" className="rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 p-5 hover:bg-rolexGreen/20 transition" onClick={closeAllMenus}>
                      <div className="text-xs uppercase tracking-[0.2em] text-rolexGold mb-2">Hub blog</div>
                      <div className="font-semibold">Tous les articles</div>
                      <div className="text-sm text-slate-300 mt-2">Guides patients sur Invisalign, le prix et la rehabilitation du sourire.</div>
                    </Link>
                    <div className="space-y-3">
                      {blogPages.map((page) => (
                        <Link key={page.url} to={page.url} className="block rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 p-4 hover:bg-rolexGreen/20 transition" onClick={closeAllMenus}>
                          <div className="font-semibold">{page.menuLabel}</div>
                          <div className="text-sm text-slate-300 mt-1">{page.menuDescription}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavItem to="/gallery">{t('nav.gallery')}</NavItem>
          <NavItem to="/contact">{t('nav.contact')}</NavItem>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden md:inline-flex items-center justify-center h-10 px-3 rounded-xl border border-rolexGreen/40 bg-rolexGreen/45 hover:bg-rolexGreen/60 text-sm focus:outline-none focus:ring-2 focus:ring-rolexGreen/40"
            onClick={closeAllMenus}
          >
            Se connecter
          </Link>
          {/* Desktop calendar CTA */}
          <a
            href="https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/motives?specialityId=1&telehealth=false&placeId=practice-518332&bookingFunnelSource=profile"
            aria-label={t('aria.book')}
            className="hidden md:inline-flex items-center justify-center h-10 w-10 rounded-xl border border-rolexGreen/40 bg-rolexGreen/45 hover:bg-rolexGreen/60 focus:outline-none focus:ring-2 focus:ring-rolexGreen/40"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
              <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zm12 7H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9zM7 12h4v4H7v-4z"/>
            </svg>
          </a>
          {/* Language switcher */}
          <div className="relative">
            <button
              aria-label={t('aria.language')}
              aria-haspopup="menu"
              aria-expanded={langOpen ? 'true' : 'false'}
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-rolexGreen/40 bg-rolexGreen/45 hover:bg-rolexGreen/60 focus:outline-none focus:ring-2 focus:ring-rolexGreen/40"
              onClick={() => setLangOpen((v) => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="text-foreground" fill="currentColor"><path d="M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3Zm0 2c1.7 0 3.3.6 4.5 1.6H7.5C8.7 5.6 10.3 5 12 5Zm-7 7c0-1 .2-2 .6-2.9h14.8c.4.9.6 1.9.6 2.9s-.2 2-.6 2.9H5.6A7.9 7.9 0 0 1 5 12Zm2.5 5.4h9c-1.2 1-2.8 1.6-4.5 1.6s-3.3-.6-4.5-1.6Z"/></svg>
            </button>
            {langOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-800 bg-surface/95 backdrop-blur shadow-soft z-50">
                <button role="menuitem" className="w-full text-left px-3 py-2 rounded-xl hover:bg-rolexGreen/10" onClick={() => changeLang('fr')}>Français</button>
                <button role="menuitem" className="w-full text-left px-3 py-2 rounded-xl hover:bg-rolexGreen/10" onClick={() => changeLang('en')}>English</button>
                <button role="menuitem" className="w-full text-left px-3 py-2 rounded-xl hover:bg-rolexGreen/10" onClick={() => changeLang('es')}>Español</button>
              </div>
            )}
          </div>
          {/* Mobile calendar CTA */}
          <a
            href="https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/motives?specialityId=1&telehealth=false&placeId=practice-518332&bookingFunnelSource=profile"
            aria-label={t('aria.book')}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-rolexGreen/40 bg-rolexGreen/45 hover:bg-rolexGreen/60 focus:outline-none focus:ring-2 focus:ring-rolexGreen/40"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
              <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zm12 7H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9zM7 12h4v4H7v-4z"/>
            </svg>
          </a>
          {/* Mobile burger */}
          <button
            aria-label={open ? t('aria.closeMenu') : t('aria.openMenu')}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-rolexGreen/40 bg-rolexGreen/45 hover:bg-rolexGreen/60 transition"
            onClick={() => setOpen((v) => !v)}
          >
            {!open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
                <path d="M12 2c-3.5 0-6 2.8-6 6.2 0 2.1.5 4.2 1.4 6 .6 1.2 1.7 3.3 2.6 3.3.9 0 1.3-1.5 2-3 .7 1.5 1.1 3 2 3 .9 0 2-2.1 2.6-3.3.9-1.8 1.4-3.9 1.4-6C18 4.8 15.5 2 12 2z"/>
              </svg>
            ) : (
              <motion.svg width="24" height="24" viewBox="0 0 24 24" className="text-foreground">
                <motion.path d="M12 2c-3.5 0-6 2.8-6 6.2 0 2.1.5 4.2 1.4 6 .6 1.2 1.7 3.3 2.6 3.3.9 0 1.3-1.5 2-3 .7 1.5 1.1 3 2 3 .9 0 2-2.1 2.6-3.3.9-1.8 1.4-3.9 1.4-6C18 4.8 15.5 2 12 2z" fill="currentColor" initial={{ x: 0, rotate: 0 }} animate={{ x: -2, rotate: -3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} />
                <motion.path d="M12 2c-3.5 0-6 2.8-6 6.2 0 2.1.5 4.2 1.4 6 .6 1.2 1.7 3.3 2.6 3.3.9 0 1.3-1.5 2-3 .7 1.5 1.1 3 2 3 .9 0 2-2.1 2.6-3.3.9-1.8 1.4-3.9 1.4-6C18 4.8 15.5 2 12 2z" fill="currentColor" initial={{ x: 0, rotate: 0 }} animate={{ x: 2, rotate: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} />
                <motion.path d="M10 6l2 3-1 2 3-3-1-2 2-2" stroke="currentColor" stroke-width="1.5" fill="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
              </motion.svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-800 bg-surface/95 backdrop-blur"
          >
            <nav className="container-max py-3 flex flex-col">
              <NavLink onClick={closeAllMenus} to="/" className={({ isActive }) => `px-3 py-3 rounded-xl transition ${isActive ? 'text-foreground border border-rolexGreen/40 bg-rolexGreen/45 backdrop-blur-sm' : 'hover:bg-rolexGreen/10'}`}>{t('nav.home')}</NavLink>
              <NavLink onClick={closeAllMenus} to="/about" className={({ isActive }) => `px-3 py-3 rounded-xl transition ${isActive ? 'text-foreground border border-rolexGreen/40 bg-rolexGreen/45 backdrop-blur-sm' : 'hover:bg-rolexGreen/10'}`}>{t('nav.about')}</NavLink>
              <div className="rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-3 text-left"
                  onClick={() => setMobileServicesOpen((value) => !value)}
                >
                  <span className="font-semibold">{t('nav.services')}</span>
                  <span>{mobileServicesOpen ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {mobileServicesOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-3 pb-3 overflow-hidden">
                      <div className="space-y-2">
                        <Link onClick={closeAllMenus} to="/services" className="block rounded-xl px-3 py-2 hover:bg-rolexGreen/20">Vue d&apos;ensemble des services</Link>
                        {[...servicePillars, ...serviceLocals].map((page) => (
                          <Link key={page.url} onClick={closeAllMenus} to={page.url} className="block rounded-xl px-3 py-2 hover:bg-rolexGreen/20">
                            {page.menuLabel}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-3 text-left"
                  onClick={() => setMobileBlogOpen((value) => !value)}
                >
                  <span className="font-semibold">Blog</span>
                  <span>{mobileBlogOpen ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {mobileBlogOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-3 pb-3 overflow-hidden">
                      <div className="space-y-2">
                        <Link onClick={closeAllMenus} to="/blog" className="block rounded-xl px-3 py-2 hover:bg-rolexGreen/20">Hub blog</Link>
                        {blogPages.map((page) => (
                          <Link key={page.url} onClick={closeAllMenus} to={page.url} className="block rounded-xl px-3 py-2 hover:bg-rolexGreen/20">
                            {page.menuLabel}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <NavLink onClick={closeAllMenus} to="/gallery" className={({ isActive }) => `px-3 py-3 rounded-xl transition ${isActive ? 'text-foreground border border-rolexGreen/40 bg-rolexGreen/45 backdrop-blur-sm' : 'hover:bg-rolexGreen/10'}`}>{t('nav.gallery')}</NavLink>
              <NavLink onClick={closeAllMenus} to="/contact" className={({ isActive }) => `px-3 py-3 rounded-xl transition ${isActive ? 'text-foreground border border-rolexGreen/40 bg-rolexGreen/45 backdrop-blur-sm' : 'hover:bg-rolexGreen/10'}`}>{t('nav.contact')}</NavLink>
              <Link onClick={closeAllMenus} to="/login" className="px-3 py-3 rounded-xl text-left hover:bg-rolexGreen/10">Se connecter</Link>
            <div className="mt-3 border-t border-slate-800 pt-3">
              <div className="px-3 py-3 rounded-xl bg-rolexGreen/45 backdrop-blur border border-slate-800">
                <div className="font-semibold">Dr. Abdessamed Abdessadok</div>
                <a href={`tel:${import.meta.env.VITE_CLINIC_PHONE || '+33467000000'}`} className="text-sm text-muted block mt-1">
                  {import.meta.env.VITE_CLINIC_PHONE || '04 67 00 00 00'}
                  </a>
                  <a
                    href="https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/motives?specialityId=1&telehealth=false&placeId=practice-518332&bookingFunnelSource=profile"
                    target="_blank"
                    rel="noopener"
                    className="mt-2 inline-flex items-center gap-2 text-sm text-foreground"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                      <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zm12 7H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9z"/>
                    </svg>
                    {t('aria.book')}
                  </a>
                  <div className="mt-2">
                    <div className="inline-block relative">
                      <button
                        aria-label={t('aria.language')}
                        aria-haspopup="menu"
                        aria-expanded={langOpen ? 'true' : 'false'}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-rolexGreen/40 bg-rolexGreen/45 hover:bg-rolexGreen/60 focus:outline-none focus:ring-2 focus:ring-rolexGreen/40"
                        onClick={() => setLangOpen((v) => !v)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" className="text-foreground" fill="currentColor"><path d="M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3Zm0 2c1.7 0 3.3.6 4.5 1.6H7.5C8.7 5.6 10.3 5 12 5Zm-7 7c0-1 .2-2 .6-2.9h14.8c.4.9.6 1.9.6 2.9s-.2 2-.6 2.9H5.6A7.9 7.9 0 0 1 5 12Zm2.5 5.4h9c-1.2 1-2.8 1.6-4.5 1.6s-3.3-.6-4.5-1.6Z"/></svg>
                      </button>
                      {langOpen && (
                        <div role="menu" className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-800 bg-surface/95 backdrop-blur shadow-soft z-50">
                          <button role="menuitem" className="w-full text-left px-3 py-2 rounded-xl hover:bg-rolexGreen/10" onClick={() => changeLang('fr')}>Français</button>
                          <button role="menuitem" className="w-full text-left px-3 py-2 rounded-xl hover:bg-rolexGreen/10" onClick={() => changeLang('en')}>English</button>
                          <button role="menuitem" className="w-full text-left px-3 py-2 rounded-xl hover:bg-rolexGreen/10" onClick={() => changeLang('es')}>Español</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
