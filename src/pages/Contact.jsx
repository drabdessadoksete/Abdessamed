import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { submitMessage } from '../services/api'
import { useTranslation } from 'react-i18next'

export default function Contact(){
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const faqData = [
    {
      question: t('about.faq.items.0.question'),
      answer: t('about.faq.items.0.answer')
    },
    {
      question: t('about.faq.items.1.question'),
      answer: (
        <ul className="list-none space-y-1">
          <li><strong>Lundi :</strong> 08h00 - 12h00, 14h00 - 17h00</li>
          <li><strong>Mardi :</strong> 08h00 - 12h00, 14h00 - 17h00</li>
          <li><strong>Mercredi :</strong> 08h00 - 12h00</li>
          <li><strong>Jeudi :</strong> 08h00 - 12h00, 14h00 - 17h00</li>
          <li><strong>Vendredi :</strong> 08h00 - 12h00, 14h00 - 17h00</li>
        </ul>
      )
    },
    {
      question: t('about.faq.items.2.question'),
      answer: t('about.faq.items.2.answer')
    },
    {
      question: t('about.faq.items.3.question'),
      answer: t('about.faq.items.3.answer')
    },
    {
      question: t('about.faq.items.4.question'),
      answer: t('about.faq.items.4.answer')
    }
  ]
  return (
    <section className="section">
      <Helmet>
        <title>Contact Dr Abdessadok | Dentiste Sète - Rendez-vous Implantologie Invisalign</title>
        <meta name="description" content="Prise de rendez-vous pour implantologie et orthodontie invisible à Sète. Contactez le cabinet dentaire Dr Abdessadok par téléphone ou email." />
        <meta name="keywords" content="Contact dentiste Sète, Rendez-vous Implantologie, Rendez-vous Invisalign, Adresse cabinet Sète, Téléphone dentiste 34" />
      </Helmet>
      <div className="container-max grid md:grid-cols-2 gap-10">
        <form className="card space-y-5 p-6 md:p-8" onSubmit={async (e) => {
          e.preventDefault()
          setStatus('')
          try {
            const res = await submitMessage({ name, email, phone, message })
            if (res?.success) {
              setStatus('Message envoyé')
              setName('')
              setEmail('')
              setPhone('')
              setMessage('')
            } else {
              setStatus('Erreur lors de l’envoi')
            }
          } catch {
            setStatus('Erreur lors de l’envoi')
          }
        }}>
          <div><span className="section-kicker mb-3">Écrivez-nous</span><h1 className="text-3xl font-bold md:text-4xl">{t('contact.title')}</h1></div>
          <label><span className="mb-2 block text-sm font-bold">Nom</span><input className="form-control" autoComplete="name" placeholder={t('contact.placeholders.name')} value={name} onChange={(e) => setName(e.target.value)} required /></label>
          <label><span className="mb-2 block text-sm font-bold">E-mail</span><input type="email" className="form-control" autoComplete="email" placeholder={t('contact.placeholders.email')} value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label><span className="mb-2 block text-sm font-bold">Téléphone</span><input className="form-control" type="tel" autoComplete="tel" placeholder={t('contact.placeholders.phone')} value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          <label><span className="mb-2 block text-sm font-bold">Message</span><textarea className="form-control h-32 resize-y" placeholder={t('contact.placeholders.message')} value={message} onChange={(e) => setMessage(e.target.value)} required /></label>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary">{t('contact.submit')}</button>
            {status && <span className="text-sm text-muted">{status === 'Message envoyé' ? t('contact.status.sent') : t('contact.status.error')}</span>}
          </div>
        </form>
        <div className="card p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-3">{t('contact.findUs')}</h2>
          <p className="text-muted mb-4">{import.meta.env.VITE_CLINIC_ADDRESS || 'RDC, 10 Bd Danièle Casanova, 34200 Sète, France'}</p>
          <div className="aspect-video rounded-2xl overflow-hidden border border-slate-800">
            <iframe
              title="Carte"
              src={import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL || 'https://maps.google.com/maps?q=RDC%2C%2010%20Bd%20Dani%C3%A8le%20Casanova%2C%2034200%20S%C3%A8te&t=&z=16&ie=UTF8&iwloc=&output=embed'}
              className="w-full h-full"
              loading="lazy"
            ></iframe>
          </div>
          <div className="mt-3">
            <a href={(import.meta.env.VITE_GOOGLE_MAPS_LINK || 'https://maps.app.goo.gl/UALfaQYvaAV5otoq9')} target="_blank" rel="noopener" className="btn-outline">{t('contact.viewOnMaps')}</a>
          </div>
        </div>
      </div>

      <div className="container-max mt-10">
        <div className="card p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4">{t('contact.faq.title')}</h2>
          <div className="space-y-3">
            {faqData.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-rolexGreen/10 bg-rolexGreen/5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left px-4 py-4"
                >
                  <span className="font-medium">{item.question}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`text-muted transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}
                  >
                    <path d="M12 15.5l-5-5 1.4-1.4L12 12.7l3.6-3.6 1.4 1.4-5 5z"/>
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 pb-4 text-sm text-muted"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
