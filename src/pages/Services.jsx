import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import implantImg from "../assets/Gemini_Generated_Image_3b45m3b45m3b45m3.png"
import alignerImg from "../assets/nvisalign® - L'Orthodontie Invisible.png"
import implantIcon from "../assets/Favicon/android-chrome-192x192.png"
import alignerIcon from "../assets/nvisalign® - L'Orthodontie Invisible icon.png"
import alignTechLogo from "../assets/Align logo.png"
import invisalignLogo from "../assets/Invisalign_logo.png"
import iteroLogo from "../assets/iTero logo.jpeg"

const doctolibBooking = 'https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/motives?specialityId=1&telehealth=false&placeId=practice-518332&bookingFunnelSource=profile'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getServices } from '../services/api'

export default function Services(){
  const { t } = useTranslation()
  const [showInvisalignPortal, setShowInvisalignPortal] = useState(false)
  return (
    <section className="section">
      <div className="container-max space-y-12">
        <Helmet>
          <title>Implantologie & Invisalign à Sète | Dr Abdessadok</title>
          <meta name="description" content="Expertise en chirurgie implantaire (Made in France) et alignement dentaire invisible. Solutions esthétiques et durables à Sète." />
        </Helmet>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{t('servicesPage.title')}</h1>
          <p className="text-muted">{t('servicesPage.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.img src={implantImg} alt="Implant dentaire" className="rounded-2xl shadow-soft w-full h-auto object-cover" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} />
          <motion.div className="rounded-2xl border border-slate-800 bg-surface/60 backdrop-blur p-6 shadow-soft" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-2">
              <img src={implantIcon} alt="Icone Implantologie" className="h-10 w-10 rounded-md object-cover" />
              <h2 className="text-2xl md:text-3xl font-bold">{t('servicesPage.implantTitle')}</h2>
            </div>
            <span className="badge mt-3 mb-4">{t('servicesPage.implantBadge')}</span>
            <p className="text-sm text-muted mb-4">{t('servicesPage.implantDesc')}</p>
            <ul className="space-y-2 text-sm">
              {t('servicesPage.implantBullets', { returnObjects: true }).map((b, i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-primary">✔</span><span><strong>{b.title} :</strong> {b.text}</span></li>
              ))}
            </ul>
            <div className="mt-6">
              <a href={doctolibBooking} target="_blank" rel="noopener" className="btn-primary">{t('servicesPage.bookImplant')}</a>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div className="rounded-2xl border border-slate-800 bg-surface/60 backdrop-blur p-6 shadow-soft order-2 md:order-1" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-2">
              <img src={alignerIcon} alt="Icone Invisalign" className="h-10 w-10 rounded-md object-cover" />
              <h2 className="text-2xl md:text-3xl font-bold">{t('servicesPage.invisalignTitle')}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <img src={invisalignLogo} alt="Invisalign" className="h-9 w-auto object-contain" />
              <img src={alignTechLogo} alt="Align Technology" className="h-9 w-auto object-contain" />
              <img src={iteroLogo} alt="iTero" className="h-9 w-auto object-contain" />
            </div>
            <span className="badge mt-3 mb-4">{t('servicesPage.invisalignBadge')}</span>
            <p className="text-sm text-muted mb-4">{t('servicesPage.invisalignDesc')}</p>
          <ul className="space-y-2 text-sm">
            {t('servicesPage.invisalignBullets', { returnObjects: true }).map((b, i) => (
              <li key={i} className="flex items-start gap-2"><span className="text-primary">✔</span><span><strong>{b.title} :</strong> {b.text}</span></li>
            ))}
          </ul>
            <div className="mt-6">
              <a href="https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/availabilities?specialityId=1&telehealth=false&placeId=practice-518332&motiveCategoryIds%5B%5D=492540&motiveIds%5B%5D=15059876&bookingFunnelSource=deep_link" target="_blank" rel="noopener" className="btn-primary">{t('servicesPage.bookInvisalign')}</a>
            </div>
          <div className="mt-4 space-y-3">
            <button type="button" className="btn-primary" onClick={() => setShowInvisalignPortal((v) => !v)}>{showInvisalignPortal ? t('buttons.hideInPage') : t('buttons.selfie')}</button>
            {showInvisalignPortal && (
              <div className="rounded-2xl border border-slate-800 bg-surface/60 backdrop-blur overflow-hidden">
                <iframe
                  src="https://www.invisalign.fr/SV/1851755"
                  title="Portail Invisalign"
                  className="w-full h-[600px]"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </motion.div>
          <motion.img src={alignerImg} alt="Aligneurs Invisalign" className="rounded-2xl shadow-soft w-full h-auto object-cover order-1 md:order-2" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} />
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">{t('servicesPage.generalTitle')}</h3>
          <ServicesGrid />
        </div>
      </div>
    </section>
  )
}

function ServicesGrid(){
  const [items, setItems] = useState(null)
  useEffect(() => { getServices().then(setItems).catch(() => setItems(null)) }, [])
  const { t } = useTranslation()
  const fallback = t('servicesPage.generalItems', { returnObjects: true })
  const data = items && items.length ? items : fallback
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((s, i) => (
        <div key={i} className="rounded-2xl border border-slate-800 bg-surface/60 backdrop-blur p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></svg><h4 className="font-semibold">{s.title}</h4></div>
          <p className="text-sm text-muted">{s.description}</p>
        </div>
      ))}
    </div>
  )
}
