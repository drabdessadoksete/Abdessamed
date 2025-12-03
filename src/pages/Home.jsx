import Hero from '../components/Hero'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import implantImg from "../assets/Implantologie & Chirurgie Orale.png"
import alignerImg from "../assets/nvisalign® - L'Orthodontie Invisible.png"
import implantIcon from "../assets/Implantologie & Chirurgie Orale icon.png"
import alignerIcon from "../assets/nvisalign® - L'Orthodontie Invisible icon.png"
import { Link } from 'react-router-dom'
import Features from '../components/Features'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'

export default function Home(){
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
                  <span className="md:whitespace-nowrap">Implantologie BioTech</span>
                  <span className="block text-sm md:text-base opacity-90">(Made in France)</span>
                </h2>
              </div>
              <p className="text-sm md:text-base text-muted mb-4">Retrouvez le confort et l'esthétique de votre sourire. Implants conçus et fabriqués en France avec une garantie certifiée et une traçabilité complète.</p>
              <img src={implantImg} alt="Implantologie BioTech" className="rounded-xl shadow-soft w-full h-auto object-cover mb-6" />
              <div className="flex flex-col md:flex-row md:flex-wrap md:items-start gap-3">
                <a
                  href="https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/motives?specialityId=1&telehealth=false&placeId=practice-518332&bookingFunnelSource=profile"
                  aria-label="Réserver Bilan Implant"
                  rel="noopener"
                  onClick={(e) => {
                    e.preventDefault()
                    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
                    const isAndroid = /Android/.test(navigator.userAgent)
                    const iosLink = 'doctolib://booking/implant'
                    const androidIntent = 'intent://booking/implant#Intent;scheme=doctolib;package=fr.doctolib.www;S.browser_fallback_url=https%3A%2F%2Fwww.doctolib.fr%2F;end'
                    if (isIOS) {
                      window.location.href = iosLink
                      setTimeout(() => { window.location.href = e.currentTarget.href }, 1200)
                    } else if (isAndroid) {
                      window.location.href = androidIntent
                    } else {
                      window.location.href = e.currentTarget.href
                    }
                  }}
                  className="btn-primary min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl"
                >
                  Réserver Bilan Implant
                </a>
                <Link to="/gallery#implant" className="btn-outline min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl">Voir la galerie</Link>
                <Link to="/services" className="btn-outline min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl">En savoir plus</Link>
              </div>
            </div>
          </div>
          <div className="rounded-2xl shadow-soft overflow-hidden border border-rolexGreen/40 bg-rolexGreen/45 backdrop-blur">
            <div className="p-6 md:p-8 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <img src={alignerIcon} alt="Icone Invisalign" className="h-10 w-10 rounded-md object-cover" />
                <h2 className="text-xl md:text-2xl font-bold md:whitespace-nowrap">Orthodontie Invisible Invisalign®</h2>
              </div>
              <p className="text-sm md:text-base text-muted mb-4">Alignement dentaire discret par gouttières transparentes. Visualisez votre futur sourire grâce à notre planification numérique. Résultat garanti.</p>
              <img src={alignerImg} alt="Orthodontie Invisible Invisalign" className="rounded-xl shadow-soft w-full h-auto object-cover mb-6" />
              <div className="flex flex-col md:flex-row md:flex-wrap md:items-start gap-3">
                <a
                  href="https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/availabilities?specialityId=1&telehealth=false&placeId=practice-518332&motiveCategoryIds%5B%5D=492540&motiveIds%5B%5D=15059876&bookingFunnelSource=deep_link"
                  aria-label="Réserver Bilan Invisalign"
                  rel="noopener"
                  onClick={(e) => {
                    e.preventDefault()
                    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
                    const isAndroid = /Android/.test(navigator.userAgent)
                    const iosLink = 'doctolib://booking/invisalign'
                    const androidIntent = 'intent://booking/invisalign#Intent;scheme=doctolib;package=fr.doctolib.www;S.browser_fallback_url=https%3A%2F%2Fwww.doctolib.fr%2F;end'
                    if (isIOS) {
                      window.location.href = iosLink
                      setTimeout(() => { window.location.href = e.currentTarget.href }, 1200)
                    } else if (isAndroid) {
                      window.location.href = androidIntent
                    } else {
                      window.location.href = e.currentTarget.href
                    }
                  }}
                  className="btn-primary min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl"
                >
                  Réserver Bilan Invisalign
                </a>
                <Link to="/gallery#invisalign" className="btn-outline min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl">Voir la galerie</Link>
                <Link to="/services" className="btn-outline min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl">En savoir plus</Link>
                <button type="button" className="btn-primary min-w-[200px] md:min-w-0 h-11 whitespace-nowrap rounded-2xl" onClick={() => setShowInvisalignPortal((v) => !v)}>{showInvisalignPortal ? 'Masquer dans la page' : 'Prenez votre selfie'}</button>
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
