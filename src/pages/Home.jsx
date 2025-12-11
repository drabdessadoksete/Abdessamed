import Hero from '../components/Hero'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import implantImg from "../assets/Gemini_Generated_Image_1nvugv1nvugv1nvu.png"
import alignerImg from "../assets/nvisalign® - L'Orthodontie Invisible.png"
import implantIcon from "../assets/new logo.png"
import alignerIcon from "../assets/nvisalign® - L'Orthodontie Invisible icon.png"
import alignTechLogo from "../assets/Align logo.png"
import invisalignLogo from "../assets/Invisalign_logo.png"
import iteroLogo from "../assets/iTero logo.jpeg"
import { Link } from 'react-router-dom'
import Features from '../components/Features'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'
import { useTranslation } from 'react-i18next'

export default function Home(){
  const { t } = useTranslation()
  const [showInvisalignPortal, setShowInvisalignPortal] = useState(false)
  return (
    <>
      <Helmet>
        <title>Dr Abdessadok | Dentiste Sète - Implantologie BioTech & Invisalign</title>
        <meta name="description" content="Cabinet dentaire à Sète (34). Spécialiste en implants dentaires français (BioTech) et orthodontie invisible (Invisalign). Prenez RDV en ligne." />
        <meta name="keywords" content="Dentiste Sète, Implant dentaire Montpellier, Invisalign Sète, Urgence dentaire 34, Facettes dentaires" />
      </Helmet>
      <Hero />
      <section className="section pt-0">
        <div className="container-max grid md:grid-cols-2 gap-5 md:gap-10">
          <div className="rounded-2xl shadow-soft overflow-hidden border border-rolexGreen/40 bg-rolexGreen/45 backdrop-blur">
            <div className="p-6 md:p-8 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <img src={implantIcon} alt="Icone Implantologie" className="h-10 w-10 rounded-md object-cover" />
                <h2 className="text-xl md:text-2xl font-bold">
                  <span className="md:whitespace-nowrap">{t('sections.implant.title')}</span>
                  <span className="block text-sm md:text-base opacity-90">{t('sections.implant.madeInFrance')}</span>
                </h2>
              </div>
              <p className="text-sm md:text-base text-muted mb-4">{t('sections.implant.desc')}</p>
              <img src={implantImg} alt="Implantologie BioTech" className="rounded-xl shadow-soft w-full h-auto object-cover mb-6" />
              <div className="flex flex-col md:flex-row md:flex-wrap md:items-start gap-3">
                <a
                  href="https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/motives?specialityId=1&telehealth=false&placeId=practice-518332&bookingFunnelSource=profile"
                  aria-label="Réserver Bilan Implant"
                  rel="noopener"
                  className="btn-primary min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl"
                >
                  {t('buttons.reserveImplant')}
                </a>
                <Link to="/gallery#implant" className="btn-outline min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl">{t('buttons.gallery')}</Link>
                <Link to="/services" className="btn-outline min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl">{t('buttons.learn')}</Link>
              </div>
            </div>
          </div>
          <div className="rounded-2xl shadow-soft overflow-hidden border border-rolexGreen/40 bg-rolexGreen/45 backdrop-blur">
            <div className="p-6 md:p-8 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <img src={alignerIcon} alt="Icone Invisalign" className="h-10 w-10 rounded-md object-cover" />
                <h2 className="text-xl md:text-2xl font-bold md:whitespace-nowrap">{t('sections.invisalign.title')}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <img src={invisalignLogo} alt="Invisalign" className="h-9 w-auto object-contain" />
                <img src={alignTechLogo} alt="Align Technology" className="h-9 w-auto object-contain" />
                <img src={iteroLogo} alt="iTero" className="h-9 w-auto object-contain" />
              </div>
              <p className="text-sm md:text-base text-muted mb-4">{t('sections.invisalign.desc')}</p>
              <img src={alignerImg} alt="Orthodontie Invisible Invisalign" className="rounded-xl shadow-soft w-full h-auto object-cover mb-6" />
              <div className="flex flex-col md:flex-row md:flex-wrap md:items-start gap-3">
                <a
                  href="https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/availabilities?specialityId=1&telehealth=false&placeId=practice-518332&motiveCategoryIds%5B%5D=492540&motiveIds%5B%5D=15059876&bookingFunnelSource=deep_link"
                  aria-label="Réserver Bilan Invisalign"
                  rel="noopener"
                  className="btn-primary min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl"
                >
                  {t('buttons.reserveInvisalign')}
                </a>
                <Link to="/gallery#invisalign" className="btn-outline min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl">{t('buttons.gallery')}</Link>
                <Link to="/services" className="btn-outline min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl">{t('buttons.learn')}</Link>
                <button type="button" className="btn-primary min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl" onClick={() => setShowInvisalignPortal((v) => !v)}>{showInvisalignPortal ? t('buttons.hideInPage') : t('buttons.selfie')}</button>
              </div>
              {showInvisalignPortal && (
                <div className="mt-4 rounded-2xl border border-slate-800 bg-surface/60 backdrop-blur overflow-hidden">
                  <iframe
                    src="https://www.invisalign.fr/SV/1851755"
                    title="Portail Invisalign"
                    className="w-full h-[600px]"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Features />
      <Testimonials />
      <CTA />
    </>
  )
}
