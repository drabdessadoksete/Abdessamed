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
    body: 'Avec votre accord, un identifiant aléatoire distingue ce navigateur afin de mesurer les visiteurs uniques et leur parcours sur le site. Il n’est relié ni à votre identité, ni à une demande de rendez-vous.',
    details: 'Nous enregistrons les pages consultées, les clics, la source, le type d’appareil et une zone géographique approximative. Jamais les noms, téléphones, messages, contenus de formulaire ou adresses IP. L’identifiant et les parcours sont conservés au maximum 13 mois, les positions de clics 90 jours. Google Analytics et nos statistiques restent désactivés avec le choix essentiel.',
    essential: 'Essentiels uniquement', accept: 'Tout accepter', more: 'Voir les détails', less: 'Masquer les détails', close: 'Fermer sans modifier',
  },
  en: {
    kicker: 'Your privacy', title: 'Cookies and audience measurement',
    body: 'With your permission, a random identifier distinguishes this browser so we can measure unique visitors and their journey on the site. It is not linked to your identity or an appointment request.',
    details: 'We record pages, clicks, source, device type and an approximate area—never names, phone numbers, messages, form contents or IP addresses. The identifier and journeys are kept for up to 13 months and click positions for 90 days. Google Analytics and our statistics remain disabled with the essential choice.',
    essential: 'Essentials only', accept: 'Accept all', more: 'View details', less: 'Hide details', close: 'Close without changes',
  },
  es: {
    kicker: 'Su privacidad', title: 'Cookies y medición de audiencia',
    body: 'Con su permiso, un identificador aleatorio distingue este navegador para medir visitantes únicos y su recorrido por el sitio. No se vincula con su identidad ni con una solicitud de cita.',
    details: 'Registramos páginas, clics, origen, dispositivo y zona aproximada; nunca nombres, teléfonos, mensajes, formularios ni direcciones IP. El identificador y los recorridos se conservan hasta 13 meses y las posiciones de clic durante 90 días. Google Analytics y nuestras estadísticas permanecen desactivados con la opción esencial.',
    essential: 'Solo esenciales', accept: 'Aceptar todo', more: 'Ver detalles', less: 'Ocultar detalles', close: 'Cerrar sin cambios',
  },
  de: {
    kicker: 'Ihre Privatsphäre', title: 'Cookies und Reichweitenmessung',
    body: 'Mit Ihrer Zustimmung unterscheidet eine zufällige Kennung diesen Browser, um eindeutige Besucher und ihren Weg auf der Website zu messen. Sie wird weder mit Ihrer Identität noch mit einer Terminanfrage verknüpft.',
    details: 'Erfasst werden Seiten, Klicks, Quelle, Gerätetyp und eine ungefähre Region – niemals Namen, Telefonnummern, Nachrichten, Formularinhalte oder IP-Adressen. Kennung und Verläufe werden höchstens 13 Monate, Klickpositionen 90 Tage gespeichert. Google Analytics und unsere Statistik bleiben bei „nur erforderlich“ deaktiviert.',
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
