import { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { submitPreAppointment } from '../services/api'
import { site } from '../config/site'
import { trackEvent } from '../utils/analytics'

const specialties = [
  {
    value: 'implantologie',
    eyebrow: 'Implantologie',
    title: 'Pré-rendez-vous implantologie',
    description: 'Pour parler d’une dent absente, d’un implant dentaire ou d’une solution de remplacement adaptée à votre situation.',
  },
  {
    value: 'orthodontie',
    eyebrow: 'Orthodontie invisible',
    title: 'Pré-rendez-vous orthodontie invisible',
    description: 'Pour parler de l’alignement de vos dents et savoir si un traitement par aligneurs peut correspondre à votre besoin.',
  },
]

const initialForm = {
  name: '',
  phone: '',
  email: '',
  city: '',
  contactPreference: 'Téléphone',
  callbackWindow: 'Peu importe',
  note: '',
  consent: false,
}

export default function PreAppointment() {
  const [searchParams] = useSearchParams()
  const requestedSpecialty = searchParams.get('specialite')
  const initialSpecialty = specialties.some((item) => item.value === requestedSpecialty) ? requestedSpecialty : ''
  const [specialty, setSpecialty] = useState(initialSpecialty)
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const formStarted = useRef(false)
  const errorRef = useRef(null)
  const successRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const selectedSpecialty = useMemo(() => specialties.find((item) => item.value === specialty), [specialty])

  useEffect(() => {
    if (error) errorRef.current?.focus()
    if (status === 'success') successRef.current?.focus()
  }, [error, status])

  const startForm = () => {
    if (formStarted.current) return
    formStarted.current = true
    trackEvent('form_start', { form: 'pre_appointment' })
  }

  const updateField = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return
    setError('')
    const issues = {}
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (!specialty) issues.specialty = 'Choisissez le sujet de votre demande.'
    if (form.name.trim().length < 2) issues.name = 'Indiquez votre nom et prénom.'
    if (phoneDigits.length < 6 || phoneDigits.length > 15 || !/^[+\d\s().-]+$/.test(form.phone.trim())) issues.phone = 'Indiquez un numéro de téléphone valide, avec l’indicatif si nécessaire.'
    if (form.contactPreference === 'E-mail' && !form.email.trim()) issues.email = 'Indiquez une adresse e-mail pour être recontacté(e) par e-mail.'
    else if (form.email.trim() && !event.currentTarget.elements.email.validity.valid) issues.email = 'Vérifiez votre adresse e-mail.'
    if (!form.consent) issues.consent = 'Votre accord est nécessaire pour que le cabinet puisse vous recontacter.'
    setFieldErrors(issues)
    if (Object.keys(issues).length) {
      setError('Votre demande n’a pas encore été envoyée. Vérifiez les champs indiqués ci-dessous.')
      return
    }

    setStatus('sending')
    trackEvent('form_submit', { form: 'pre_appointment' })
    try {
      const response = await submitPreAppointment({ ...form, specialty })
      if (!response?.success) throw new Error('request-not-saved')
      setStatus('success')
      trackEvent('form_success', { form: 'pre_appointment' })
    } catch {
      setStatus('error')
      setError(`La demande n’a pas pu être enregistrée. Vos informations sont conservées dans ce formulaire pour réessayer. Vous pouvez aussi appeler le ${site.telephoneDisplay}.`)
      trackEvent('form_error', { form: 'pre_appointment' })
    }
  }

  if (status === 'success') {
    return (
      <section className="section min-h-[72vh]">
        <Helmet><title>Demande reçue | Pré-rendez-vous</title><meta name="robots" content="noindex,follow" /></Helmet>
        <div className="container-max">
          <motion.div className="card mx-auto max-w-2xl p-7 text-center sm:p-10" initial={reduceMotion ? false : { opacity: 0, y: 18, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rolexGreen text-2xl text-white shadow-soft" aria-hidden="true">✓</div>
            <span className="section-kicker mt-7">Demande reçue</span>
            <h1 ref={successRef} tabIndex="-1" className="mt-4 text-3xl font-bold sm:text-4xl">Merci, {form.name.trim().split(' ')[0]}.</h1>
            <p className="mx-auto mt-5 max-w-xl text-muted">Votre demande de {selectedSpecialty.title.toLowerCase()} a bien été transmise. Le cabinet vous recontactera pour échanger et vous orienter vers le rendez-vous le plus adapté.</p>
            <p className="mt-4 text-sm text-muted">Le rendez-vous sera confirmé avec le cabinet. Les consultations ont lieu à Sète.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/" className="btn-primary">Retour à l’accueil</Link>
              <a href={`tel:${site.telephone}`} className="btn-outline" onClick={() => trackEvent('phone_click', { location: 'booking_success' })}>Appeler le cabinet</a>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="section min-h-screen">
      <Helmet>
        <title>Pré-rendez-vous implantologie ou orthodontie | Dr Abdessadok</title>
        <meta name="description" content="Demandez un pré-rendez-vous téléphonique en implantologie ou en orthodontie invisible avec le cabinet du Dr Abdessadok à Sète." />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <div className="container-max">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <aside className="lg:sticky lg:top-28">
            <span className="section-kicker mb-5">Pré-rendez-vous</span>
            <h1 className="text-4xl font-bold sm:text-5xl">Commençons par vous écouter.</h1>
            <p className="mt-5 text-lg text-muted">Cette demande ne confirme pas immédiatement un rendez-vous. Elle permet au cabinet de vous rappeler et d’organiser le premier bilan adapté.</p>
            <p className="mt-4 text-sm text-muted">Les consultations ont lieu au {site.address.streetAddress}, {site.address.postalCode} {site.address.addressLocality}. <Link to="/contact/" className="font-bold text-rolexGreen underline underline-offset-4">Voir l’accès et les horaires</Link>.</p>
            <ol className="mt-8 space-y-5">
              {['Déterminez votre besoin', 'Laissez vos coordonnées', 'Le cabinet vous recontacte'].map((label, index) => (
                <li key={label} className="flex items-center gap-4"><span className="number-chip shrink-0">0{index + 1}</span><span className="font-bold">{label}</span></li>
              ))}
            </ol>
            <div className="mt-8 rounded-2xl border border-rolexGreen/10 bg-rolexGreen/5 p-5 text-sm text-muted">
              <strong className="block text-foreground">Une urgence ou une douleur importante ?</strong>
              <a href={`tel:${site.telephone}`} className="mt-2 inline-flex font-bold text-rolexGold" onClick={() => trackEvent('phone_click', { location: 'booking' })}>Appelez le {site.telephoneDisplay}</a>
            </div>
          </aside>

          <form onSubmit={submit} onFocusCapture={startForm} className="card overflow-hidden" method="post" noValidate aria-busy={status === 'sending'}>
            <noscript><p className="p-5">Activez JavaScript pour envoyer votre demande, ou appelez le <a href={`tel:${site.telephone}`}>{site.telephoneDisplay}</a>.</p></noscript>
            <AnimatePresence>
              {error && <motion.div ref={errorRef} tabIndex="-1" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:mx-8"><p>{error}</p>{Object.keys(fieldErrors).length ? <ul className="mt-2 list-disc pl-5">{Object.entries(fieldErrors).filter(([, message]) => message).map(([field, message]) => <li key={field}><a href={`#booking-${field}`} className="underline underline-offset-2">{message}</a></li>)}</ul> : <a href={`tel:${site.telephone}`} className="mt-2 inline-block font-bold underline" onClick={() => trackEvent('phone_click', { location: 'booking_error' })}>Appeler le cabinet</a>}</motion.div>}
            </AnimatePresence>
            <div className="border-b border-rolexGreen/10 bg-white px-5 py-6 sm:px-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-rolexGold">1 · Votre besoin</p>
              <fieldset id="booking-specialty" tabIndex="-1" className="mt-5" aria-required="true" aria-invalid={Boolean(fieldErrors.specialty)} aria-describedby={fieldErrors.specialty ? 'booking-specialty-error' : undefined}>
                <legend className="sr-only">Déterminez votre besoin</legend>
                <div className="grid gap-4 md:grid-cols-2">
                  {specialties.map((item) => {
                    const selected = specialty === item.value
                    return (
                      <label key={item.value} className={`flex h-full cursor-pointer flex-col rounded-2xl border p-5 transition focus-within:border-rolexGold ${selected ? 'border-rolexGreen bg-rolexGreen/5 shadow-[0_0_0_3px_rgba(33,78,62,.08)]' : 'border-rolexGreen/10 bg-surface hover:border-rolexGold/35'}`}>
                        <input type="radio" name="specialty" value={item.value} checked={selected} onChange={() => { setSpecialty(item.value); setFieldErrors((current) => ({ ...current, specialty: '' })) }} className="sr-only" required />
                        <span className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-rolexGold">{item.eyebrow}</span>
                        <span className="mt-2 block text-xl font-bold">{item.title}</span>
                        <span className="mt-2 block text-sm leading-6 text-muted">{item.description}</span>
                        <span className="mt-3 block text-sm font-medium leading-6 text-muted">Pré-rendez-vous téléphonique gratuit de 5 minutes pour préciser votre besoin et organiser le premier bilan adapté.</span>
                        <span className="mt-auto pt-4"><span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${selected ? 'border-rolexGreen bg-rolexGreen text-white' : 'border-rolexGreen/20'}`} aria-hidden="true">{selected ? '✓' : ''}</span></span>
                      </label>
                    )
                  })}
                </div>
                {fieldErrors.specialty ? <p id="booking-specialty-error" className="mt-3 text-sm text-red-800">{fieldErrors.specialty}</p> : null}
              </fieldset>
            </div>

            <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-rolexGold">2 · Vos coordonnées</p>
                <p className="mt-3 text-sm text-muted">Les champs marqués d’un * sont obligatoires.</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">Nom et prénom *</span><input id="booking-name" className="form-control" name="name" autoComplete="name" maxLength={120} value={form.name} onChange={updateField} required aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'booking-name-error' : undefined} />{fieldErrors.name ? <span id="booking-name-error" className="mt-2 block text-sm text-red-800">{fieldErrors.name}</span> : null}</label>
                  <label><span className="mb-2 block text-sm font-bold">Téléphone *</span><input id="booking-phone" className="form-control" type="tel" name="phone" autoComplete="tel" inputMode="tel" maxLength={30} value={form.phone} onChange={updateField} required aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'booking-phone-error' : undefined} />{fieldErrors.phone ? <span id="booking-phone-error" className="mt-2 block text-sm text-red-800">{fieldErrors.phone}</span> : null}</label>
                  <label><span className="mb-2 block text-sm font-bold">E-mail{form.contactPreference === 'E-mail' ? ' *' : ' (facultatif)'}</span><input id="booking-email" className="form-control" type="email" name="email" autoComplete="email" maxLength={254} value={form.email} onChange={updateField} required={form.contactPreference === 'E-mail'} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'booking-email-error' : undefined} />{fieldErrors.email ? <span id="booking-email-error" className="mt-2 block text-sm text-red-800">{fieldErrors.email}</span> : null}</label>
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">Ville (facultatif)</span><input className="form-control" name="city" autoComplete="address-level2" maxLength={120} value={form.city} onChange={updateField} /></label>
                </div>
              </div>

              <div className="border-t border-rolexGreen/10 pt-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-rolexGold">3 · Comment vous joindre ?</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label><span className="mb-2 block text-sm font-bold">Contact préféré</span><select className="form-control" name="contactPreference" value={form.contactPreference} onChange={updateField}><option>Téléphone</option><option>E-mail</option></select></label>
                  <label><span className="mb-2 block text-sm font-bold">Moment du rappel</span><select className="form-control" name="callbackWindow" value={form.callbackWindow} onChange={updateField}><option>Peu importe</option><option>Matin</option><option>Midi</option><option>Après-midi</option><option>Fin de journée</option></select></label>
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">Une précision utile ? (facultatif)</span><textarea className="form-control min-h-28 resize-y" name="note" maxLength={2000} value={form.note} onChange={updateField} aria-describedby="booking-note-help" /><span id="booking-note-help" className="mt-2 block text-xs text-muted">Évitez de renseigner des informations médicales sensibles ici.</span></label>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-rolexGreen/5 p-4 text-sm text-muted">
                <input id="booking-consent" type="checkbox" name="consent" checked={form.consent} onChange={updateField} className="mt-1 h-4 w-4 accent-[#214e3e]" required aria-invalid={Boolean(fieldErrors.consent)} aria-describedby={fieldErrors.consent ? 'booking-consent-error' : undefined} />
                <span>J’accepte d’être recontacté(e) par le cabinet au sujet de cette demande de pré-rendez-vous. *{fieldErrors.consent ? <span id="booking-consent-error" className="mt-2 block text-red-800">{fieldErrors.consent}</span> : null}</span>
              </label>

              <button type="submit" className="btn-primary w-full" disabled={status === 'sending'} aria-live="polite">{status === 'sending' ? 'Transmission…' : 'Demander à être recontacté(e)'} <span aria-hidden="true">→</span></button>
              <p className="text-center text-xs text-muted">Vos coordonnées sont utilisées uniquement pour répondre à cette demande.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
