import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { submitMessage } from '../services/api'
import { openingHoursSchema, site } from '../config/site'
import { trackEvent } from '../utils/analytics'

const initialForm = { name: '', email: '', phone: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [mapLoaded, setMapLoaded] = useState(false)

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setStatus('sending')
    trackEvent('form_submit', { form: 'contact' })
    try {
      const response = await submitMessage(form)
      if (!response?.success) throw new Error('not-saved')
      setForm(initialForm)
      setStatus('success')
      trackEvent('form_success', { form: 'contact' })
    } catch {
      setStatus('error')
      trackEvent('form_error', { form: 'contact' })
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact du cabinet dentaire à Sète | Dr Abdessadok</title>
        <meta name="description" content="Adresse, téléphone, e-mail, accès et horaires du cabinet dentaire du Dr Abdessadok à Sète. Envoyez un message au cabinet." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact du Cabinet Dentaire Dr. Abdessadok',
          mainEntity: {
            '@type': 'Dentist',
            name: site.practiceName,
            telephone: site.telephone,
            email: site.email,
            address: { '@type': 'PostalAddress', ...site.address },
            openingHoursSpecification: openingHoursSchema,
          },
        })}</script>
      </Helmet>

      <header className="page-hero page-hero--light" aria-labelledby="contact-title">
        <div className="container-max page-hero__grid">
          <div><span className="section-kicker">Nous joindre</span><h1 id="contact-title">Contact</h1></div>
          <p>Pour une urgence ou une douleur importante, appelez directement le cabinet. Le formulaire convient aux demandes non urgentes et ne doit pas contenir de données médicales sensibles.</p>
        </div>
      </header>

      <section className="authority-section contact-section">
        <div className="container-max contact-layout">
          <div className="contact-details">
            <div>
              <span className="section-kicker">Coordonnées</span>
              <address><strong>{site.practiceName}</strong><br />{site.address.streetAddress}<br />{site.address.postalCode} {site.address.addressLocality}, France</address>
              <a href={`tel:${site.telephone}`} onClick={() => trackEvent('phone_click', { location: 'contact' })}>{site.telephoneDisplay}</a>
              <a href={`mailto:${site.email}`} onClick={() => trackEvent('email_click', { location: 'contact' })}>{site.email}</a>
            </div>
            <div className="contact-hours">
              <h2>Horaires</h2>
              <p>Lundi, mardi, jeudi et vendredi<br /><strong>08:00–12:00 · 14:00–17:00</strong></p>
              <p>Mercredi<br /><strong>08:00–12:00</strong></p>
              <p>Samedi et dimanche<br /><strong>Fermé</strong></p>
            </div>
            <div className="contact-map">
              {mapLoaded ? <iframe title="Localisation du cabinet dentaire à Sète" src={site.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <button type="button" data-analytics-id="display_map" className="flex min-h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-[#d7e1dc] bg-[#eef3f0] p-6 text-center text-[#214e3e]" onClick={() => { setMapLoaded(true); trackEvent('map_click', { location: 'contact_embed' }) }}><span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-sm" aria-hidden="true">⌖</span><strong>Afficher la carte</strong><span className="max-w-sm text-xs font-medium leading-5 text-[#68776f]">La carte Google est chargée uniquement à votre demande.</span></button>}
              <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="text-link" onClick={() => trackEvent('map_click', { location: 'contact' })}>Ouvrir l’itinéraire <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <form className="contact-form" onSubmit={submit}>
            <span className="section-kicker section-kicker--light">Message non urgent</span>
            <h2>Écrire au cabinet</h2>
            <p>Ne transmettez pas de données médicales sensibles dans ce formulaire.</p>
            <label><span>Nom et prénom *</span><input className="form-control" name="name" autoComplete="name" value={form.name} onChange={updateField} required /></label>
            <label><span>E-mail *</span><input className="form-control" type="email" name="email" autoComplete="email" value={form.email} onChange={updateField} required /></label>
            <label><span>Téléphone</span><input className="form-control" type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={updateField} /></label>
            <label><span>Votre message *</span><textarea className="form-control min-h-36 resize-y" name="message" value={form.message} onChange={updateField} required /></label>
            <button type="submit" className="btn-accent" disabled={status === 'sending'}>{status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}</button>
            <p className="contact-form__status" aria-live="polite">
              {status === 'success' ? 'Votre message a bien été transmis au cabinet.' : null}
              {status === 'error' ? `Le message n’a pas pu être envoyé. Appelez le ${site.telephoneDisplay}.` : null}
            </p>
          </form>
        </div>
      </section>
    </>
  )
}
