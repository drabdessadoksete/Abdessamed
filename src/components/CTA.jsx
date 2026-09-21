import { Link, useLocation } from 'react-router-dom'
import { site } from '../config/site'
import { trackEvent } from '../utils/analytics'
import { bookingPath } from '../utils/booking'

export default function CTA() {
  const { pathname } = useLocation()

  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="container-max">
        <div className="final-cta__panel">
          <span className="section-kicker section-kicker--light">Premier échange</span>
          <h2 id="final-cta-title">Prêt à retrouver votre sourire ?</h2>
          <p>Laissez vos coordonnées pour un pré-rendez-vous téléphonique gratuit de 5 minutes. Le cabinet vous orientera ensuite vers un rendez-vous adapté sur place.</p>
          <div>
            <Link to={bookingPath(pathname)} className="btn-accent" onClick={() => trackEvent('pre_appointment_click', { location: 'final_cta' })}>Demander un pré-rendez-vous</Link>
            <a href={`tel:${site.telephone}`} className="btn-light" onClick={() => trackEvent('phone_click', { location: 'final_cta' })}>Appeler le {site.telephoneDisplay}</a>
          </div>
          <Link to="/contact/" className="mt-5 inline-flex text-sm text-white underline underline-offset-4">Adresse, accès et horaires du cabinet à Sète</Link>
        </div>
      </div>
    </section>
  )
}
