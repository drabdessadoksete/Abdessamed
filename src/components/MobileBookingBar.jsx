import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLanguageNavigation, routeLanguage } from '../config/multilingualRoutes'
import { site } from '../config/site'
import { trackEvent } from '../utils/analytics'
import { bookingPath } from '../utils/booking'

export default function MobileBookingBar({ pathname }) {
  const [visible, setVisible] = useState(false)
  const hiddenRoute = /^\/(?:pre-rendez-vous|login|admin)(?:\/|$)/.test(pathname)
  const language = routeLanguage(pathname.endsWith('/') ? pathname : `${pathname}/`)
  const localized = language !== 'fr'
  const navigation = localized ? getLanguageNavigation(language) : null

  useEffect(() => {
    if (hiddenRoute) {
      setVisible(false)
      return undefined
    }

    const update = () => {
      const threshold = pathname === '/' ? 420 : 120
      const nearBottom = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 180
      setVisible(window.scrollY > threshold && !nearBottom)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname, hiddenRoute])

  if (hiddenRoute || !visible) return null

  return (
    <div className="mobile-booking-bar lg:hidden" role="region" aria-label="Contacter le cabinet">
      <div>
        <strong>Pré-rendez-vous</strong>
        <span>{localized ? 'Sète · France' : '5 minutes · gratuit'}</span>
      </div>
      <div className="flex items-center gap-2">
        <a href={`tel:${site.telephone}`} className="mobile-booking-bar__phone" aria-label={`Appeler le cabinet au ${site.telephoneDisplay}`} onClick={() => trackEvent('phone_click', { location: 'mobile_bar' })}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6.6 3.5 9 7.8 7.5 9.3c1.4 3 3.8 5.4 6.8 6.8l1.5-1.5 4.3 2.4-.7 3c-.2.8-.9 1.4-1.8 1.4C9.3 21.4 2.6 14.7 2.6 6.4c0-.9.6-1.6 1.4-1.8l2.6-1.1Z" /></svg>
        </a>
        <Link to={localized ? navigation.paths.contact : bookingPath(pathname)} className="mobile-booking-bar__cta" aria-label={localized ? navigation.labels.contact : 'Demander un pré-rendez-vous téléphonique'} onClick={() => { if (!localized) trackEvent('pre_appointment_click', { location: 'mobile_bar' }) }}>{localized ? navigation.labels.contact : 'Demander'} <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  )
}
