import { Link } from 'react-router-dom'
import { trackEvent } from '../utils/analytics'

export default function CTA() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="container-max">
        <div className="final-cta__panel">
          <span className="section-kicker section-kicker--light">Premier échange</span>
          <h2 id="final-cta-title">Prêt à retrouver votre sourire ?</h2>
          <p>Laissez vos coordonnées pour un pré-rendez-vous téléphonique gratuit de 5 minutes. Le cabinet vous orientera ensuite vers un rendez-vous adapté sur place.</p>
          <div>
            <Link to="/pre-rendez-vous/" className="btn-accent" onClick={() => trackEvent('pre_appointment_click', { location: 'final_cta' })}>Demander un pré-rendez-vous</Link>
            <Link to="/contact/" className="btn-light">Nous contacter</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
