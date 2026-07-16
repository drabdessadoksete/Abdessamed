import { useEffect, useState } from 'react'
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_OPEN_EVENT,
  getConsentChoice,
  setConsentChoice,
} from '../utils/consent'

const copy = {
  fr: {
    kicker: 'Votre confidentialité', title: 'Cookies et mesure d’audience',
    body: 'Avec votre accord, nous utilisons des statistiques agrégées pour améliorer le site. Aucun nom, téléphone, contenu de formulaire, identifiant visiteur ou adresse IP n’est conservé dans ces statistiques.',
    details: 'Les données couvrent les pages consultées, les clics, la source de visite, le type d’appareil et une zone géographique approximative. Elles sont conservées au maximum 400 jours (90 jours pour la carte de clics). Google Analytics et nos statistiques restent désactivés avec le choix essentiel.',
    essential: 'Essentiels uniquement', accept: 'Tout accepter', more: 'Voir les détails', less: 'Masquer les détails', close: 'Fermer sans modifier',
  },
  en: {
    kicker: 'Your privacy', title: 'Cookies and audience measurement',
    body: 'With your permission, we use aggregate statistics to improve the site. No name, phone number, form content, visitor identifier or IP address is retained in these statistics.',
    details: 'Data covers pages, clicks, visit source, device type and an approximate area. It is retained for up to 400 days (90 days for the click map). Google Analytics and our statistics remain disabled with the essential choice.',
    essential: 'Essentials only', accept: 'Accept all', more: 'View details', less: 'Hide details', close: 'Close without changes',
  },
  es: {
    kicker: 'Su privacidad', title: 'Cookies y medición de audiencia',
    body: 'Con su permiso, utilizamos estadísticas agregadas para mejorar el sitio. No conservamos nombres, teléfonos, contenido de formularios, identificadores de visitantes ni direcciones IP.',
    details: 'Los datos incluyen páginas, clics, origen de la visita, dispositivo y zona aproximada. Se conservan hasta 400 días (90 días para el mapa de clics). Google Analytics y nuestras estadísticas permanecen desactivados con la opción esencial.',
    essential: 'Solo esenciales', accept: 'Aceptar todo', more: 'Ver detalles', less: 'Ocultar detalles', close: 'Cerrar sin cambios',
  },
  de: {
    kicker: 'Ihre Privatsphäre', title: 'Cookies und Reichweitenmessung',
    body: 'Mit Ihrer Zustimmung verwenden wir zusammengefasste Statistiken, um die Website zu verbessern. Namen, Telefonnummern, Formularinhalte, Besucherkennungen oder IP-Adressen werden nicht gespeichert.',
    details: 'Erfasst werden Seiten, Klicks, Besuchsquelle, Gerätetyp und eine ungefähre Region. Die Aufbewahrung beträgt höchstens 400 Tage (90 Tage für die Klickkarte). Google Analytics und unsere Statistik bleiben bei der Auswahl „nur erforderlich“ deaktiviert.',
    essential: 'Nur erforderlich', accept: 'Alle akzeptieren', more: 'Details anzeigen', less: 'Details ausblenden', close: 'Ohne Änderung schließen',
  },
}

export default function ConsentBanner() {
  const [choice, setChoice] = useState(() => getConsentChoice())
  const [open, setOpen] = useState(() => !getConsentChoice())
  const [expanded, setExpanded] = useState(false)
  const language = typeof document === 'undefined' ? 'fr' : document.documentElement.lang.split('-')[0]
  const text = copy[language] || copy.fr

  useEffect(() => {
    const handleOpen = () => { setExpanded(false); setOpen(true) }
    const handleChange = () => { setChoice(getConsentChoice()); setOpen(false) }
    window.addEventListener(CONSENT_OPEN_EVENT, handleOpen)
    window.addEventListener(CONSENT_CHANGE_EVENT, handleChange)
    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, handleOpen)
      window.removeEventListener(CONSENT_CHANGE_EVENT, handleChange)
    }
  }, [])

  if (!open) return null
  const choose = (nextChoice) => { setConsentChoice(nextChoice); setChoice(nextChoice); setOpen(false) }

  return (
    <section className="consent-banner" role="dialog" aria-modal="false" aria-labelledby="consent-title" data-analytics-ignore>
      <div className="consent-banner__copy">
        <span>{text.kicker}</span>
        <h2 id="consent-title">{text.title}</h2>
        <p>{text.body}</p>
        {expanded ? <p className="consent-banner__details">{text.details}</p> : null}
        <button type="button" className="consent-banner__more" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>{expanded ? text.less : text.more}</button>
      </div>
      <div className="consent-banner__actions">
        <button type="button" className="consent-banner__button consent-banner__button--essential" onClick={() => choose('essential')}>{text.essential}</button>
        <button type="button" className="consent-banner__button consent-banner__button--all" onClick={() => choose('all')}>{text.accept}</button>
        {choice ? <button type="button" className="consent-banner__close" onClick={() => setOpen(false)}>{text.close}</button> : null}
      </div>
    </section>
  )
}
