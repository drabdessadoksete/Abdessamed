import { Link, useLocation } from 'react-router-dom'
import { media } from '../config/media'
import { getLanguageNavigation, routeLanguage } from '../config/multilingualRoutes'
import { site } from '../config/site'
import { openConsentSettings } from '../utils/consent'
import { trackEvent } from '../utils/analytics'
import { bookingPath } from '../utils/booking'

export default function Footer() {
  const { pathname } = useLocation()
  const language = routeLanguage(pathname.endsWith('/') ? pathname : `${pathname}/`)
  const localized = language !== 'fr'
  const localizedNav = localized ? getLanguageNavigation(language) : null
  const links = localized
    ? [
        [localizedNav.labels.home, localizedNav.paths.home],
        [localizedNav.labels.ortho, localizedNav.paths.ortho],
        [localizedNav.labels.implant, localizedNav.paths.implant],
        [localizedNav.labels.contact, localizedNav.paths.contact],
      ]
    : [['Implant dentaire à Sète', '/implantologie/'], ['Orthodontie invisible à Sète', '/orthodontie-invisible-sete/'], ['Soins', '/services/'], ['À propos', '/about/'], ['Guides', '/blog/'], ['Galerie', '/gallery/'], ['Contact', '/contact/']]

  return (
    <footer className="authority-footer">
      <div className="container-max authority-footer__grid">
        <div className="authority-footer__brand">
          <img src={media.logo.fallback} alt={media.logo.alt} />
          <p>{localized ? localizedNav.notice : 'Des soins dentaires expliqués avec précision, du premier échange au suivi au cabinet à Sète.'}</p>
          {!localized ? <Link to={bookingPath(pathname)} className="mt-5 inline-flex text-sm font-bold text-rolexGold underline underline-offset-4" onClick={() => trackEvent('pre_appointment_click', { location: 'footer' })}>Demander un pré-rendez-vous</Link> : null}
        </div>
        <div>
          <h2>{localized ? 'Navigation' : 'Explorer'}</h2>
          <nav aria-label="Navigation de pied de page">{links.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}</nav>
        </div>
        <div>
          <h2>Contact</h2>
          <address>{site.address.streetAddress}<br />{site.address.postalCode} {site.address.addressLocality}<a href={`tel:${site.telephone}`} onClick={() => trackEvent('phone_click', { location: 'footer' })}>{site.telephoneDisplay}</a><a href={`mailto:${site.email}`} onClick={() => trackEvent('email_click', { location: 'footer' })}>{site.email}</a>{!localized ? <a href={site.mapLink} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('map_click', { location: 'footer' })}>Itinéraire vers le cabinet à Sète ↗</a> : null}</address>
        </div>
        <div>
          <h2>Horaires</h2>
          <p>Lun, mar, jeu, ven<br /><strong>08:00–12:00 · 14:00–17:00</strong></p>
          <p>Mercredi<br /><strong>08:00–12:00</strong></p>
        </div>
        <div className="authority-footer__legal">
          <p>© {new Date().getFullYear()} {site.practiceName}</p>
          <div><p>Informations générales : aucun contenu ne remplace un examen clinique.</p><button type="button" onClick={openConsentSettings}>Gérer mes cookies</button></div>
        </div>
      </div>
    </footer>
  )
}
