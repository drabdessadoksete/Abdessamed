import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { submitPreAppointment } from '../services/api'

const specialties = [
  {
    value: 'implantologie',
    eyebrow: 'Implants dentaires',
    title: 'Implantologie',
    description: 'Pour un bilan lié à une dent absente, un implant ou une réhabilitation du sourire.',
  },
  {
    value: 'orthodontie',
    eyebrow: 'Aligneurs transparents',
    title: 'Orthodontie invisible',
    description: 'Pour étudier un alignement dentaire discret chez l’adulte ou l’adolescent.',
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
  const initialSpecialty = specialties.some((item) => item.value === requestedSpecialty) ? requestedSpecialty : 'implantologie'
  const [specialty, setSpecialty] = useState(initialSpecialty)
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const reduceMotion = useReducedMotion()
  const selectedSpecialty = useMemo(() => specialties.find((item) => item.value === specialty), [specialty])

  const updateField = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.name.trim() || !form.phone.trim() || !form.consent) {
      setError('Merci de renseigner votre nom, votre téléphone et votre consentement.')
      return
    }

    setStatus('sending')
    try {
      const response = await submitPreAppointment({ ...form, specialty })
      if (!response?.success) throw new Error('request-not-saved')
      setStatus('success')
    } catch {
      setStatus('error')
      setError('La demande n’a pas pu être enregistrée. Vous pouvez appeler directement le 04 22 91 05 94.')
    }
  }

  if (status === 'success') {
    return (
      <section className="section min-h-[72vh]">
        <Helmet><title>Demande reçue | Pré-rendez-vous</title></Helmet>
        <div className="container-max">
          <motion.div className="card mx-auto max-w-2xl p-7 text-center sm:p-10" initial={reduceMotion ? false : { opacity: 0, y: 18, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rolexGreen text-2xl text-white shadow-soft" aria-hidden="true">✓</div>
            <span className="section-kicker mt-7">Demande reçue</span>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Merci, {form.name.split(' ')[0]}.</h1>
            <p className="mx-auto mt-5 max-w-xl text-muted">Votre demande de pré-rendez-vous en {selectedSpecialty.title.toLowerCase()} a bien été transmise. Le cabinet vous recontactera pour échanger et proposer la suite adaptée.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/" className="btn-primary">Retour à l’accueil</Link>
              <a href="tel:+33422910594" className="btn-outline">Appeler le cabinet</a>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="section min-h-screen">
      <Helmet>
        <title>Pré-rendez-vous Implantologie ou Orthodontie à Sète</title>
        <meta name="description" content="Demandez à être rappelé par le cabinet du Dr Abdessadok pour un premier bilan en implantologie ou en orthodontie invisible à Sète." />
      </Helmet>

      <div className="container-max">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <aside className="lg:sticky lg:top-28">
            <span className="section-kicker mb-5">Pré-rendez-vous</span>
            <h1 className="text-4xl font-bold sm:text-5xl">Commençons par vous écouter.</h1>
            <p className="mt-5 text-lg text-muted">Cette demande ne confirme pas immédiatement un rendez-vous. Elle permet au cabinet de vous rappeler et d’organiser le premier bilan adapté.</p>
            <ol className="mt-8 space-y-5">
              {['Choisissez votre spécialité', 'Laissez vos coordonnées', 'Le cabinet vous recontacte'].map((label, index) => (
                <li key={label} className="flex items-center gap-4"><span className="number-chip shrink-0">0{index + 1}</span><span className="font-bold">{label}</span></li>
              ))}
            </ol>
            <div className="mt-8 rounded-2xl border border-rolexGreen/10 bg-rolexGreen/5 p-5 text-sm text-muted">
              <strong className="block text-foreground">Une urgence ou une douleur importante ?</strong>
              <a href="tel:+33422910594" className="mt-2 inline-flex font-bold text-rolexGold">Appelez le 04 22 91 05 94</a>
            </div>
          </aside>

          <form onSubmit={submit} className="card overflow-hidden" noValidate>
            <div className="border-b border-rolexGreen/10 bg-white px-5 py-6 sm:px-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-rolexGold">1 · Votre besoin</p>
              <fieldset className="mt-5 grid gap-3 sm:grid-cols-2">
                <legend className="sr-only">Choisissez une spécialité</legend>
                {specialties.map((item) => {
                  const selected = specialty === item.value
                  return (
                    <label key={item.value} className={`cursor-pointer rounded-2xl border p-5 transition ${selected ? 'border-rolexGreen bg-rolexGreen/5 shadow-[0_0_0_3px_rgba(33,78,62,.08)]' : 'border-rolexGreen/10 bg-surface hover:border-rolexGold/35'}`}>
                      <input type="radio" name="specialty" value={item.value} checked={selected} onChange={() => setSpecialty(item.value)} className="sr-only" />
                      <span className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-rolexGold">{item.eyebrow}</span>
                      <span className="mt-2 block text-xl font-bold">{item.title}</span>
                      <span className="mt-2 block text-sm leading-6 text-muted">{item.description}</span>
                      <span className={`mt-4 inline-flex h-6 w-6 items-center justify-center rounded-full border ${selected ? 'border-rolexGreen bg-rolexGreen text-white' : 'border-rolexGreen/20'}`} aria-hidden="true">{selected ? '✓' : ''}</span>
                    </label>
                  )
                })}
              </fieldset>
            </div>

            <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-rolexGold">2 · Vos coordonnées</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">Nom et prénom *</span><input className="form-control" name="name" autoComplete="name" value={form.name} onChange={updateField} required /></label>
                  <label><span className="mb-2 block text-sm font-bold">Téléphone *</span><input className="form-control" type="tel" name="phone" autoComplete="tel" inputMode="tel" value={form.phone} onChange={updateField} required /></label>
                  <label><span className="mb-2 block text-sm font-bold">E-mail</span><input className="form-control" type="email" name="email" autoComplete="email" value={form.email} onChange={updateField} /></label>
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">Ville</span><input className="form-control" name="city" autoComplete="address-level2" value={form.city} onChange={updateField} /></label>
                </div>
              </div>

              <div className="border-t border-rolexGreen/10 pt-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-rolexGold">3 · Comment vous joindre ?</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label><span className="mb-2 block text-sm font-bold">Contact préféré</span><select className="form-control" name="contactPreference" value={form.contactPreference} onChange={updateField}><option>Téléphone</option><option>E-mail</option></select></label>
                  <label><span className="mb-2 block text-sm font-bold">Moment du rappel</span><select className="form-control" name="callbackWindow" value={form.callbackWindow} onChange={updateField}><option>Peu importe</option><option>Matin</option><option>Midi</option><option>Après-midi</option><option>Fin de journée</option></select></label>
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">Une précision utile ?</span><textarea className="form-control min-h-28 resize-y" name="note" value={form.note} onChange={updateField} placeholder="Évitez de renseigner des informations médicales sensibles ici." /></label>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-rolexGreen/5 p-4 text-sm text-muted">
                <input type="checkbox" name="consent" checked={form.consent} onChange={updateField} className="mt-1 h-4 w-4 accent-[#214e3e]" />
                <span>J’accepte d’être recontacté(e) par le cabinet au sujet de cette demande de pré-rendez-vous. *</span>
              </label>

              <AnimatePresence>
                {error && <motion.p role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</motion.p>}
              </AnimatePresence>

              <button type="submit" className="btn-primary w-full" disabled={status === 'sending'}>{status === 'sending' ? 'Transmission…' : 'Envoyer ma demande'} <span aria-hidden="true">→</span></button>
              <p className="text-center text-xs text-muted">Vos coordonnées sont utilisées uniquement pour répondre à cette demande.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
