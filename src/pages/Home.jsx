import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'
import implantImg from '../assets/Gemini_Generated_Image_1nvugv1nvugv1nvu.png'
import alignerImg from '../assets/nvisalign® - L\'Orthodontie Invisible.png'
import alignTechLogo from '../assets/Align logo.png'
import invisalignLogo from '../assets/Invisalign_logo.png'
import iteroLogo from '../assets/iTero logo.jpeg'

const journey = [
  { number: '01', title: 'Écouter', copy: 'Un premier échange pour comprendre votre besoin, vos priorités et votre confort.' },
  { number: '02', title: 'Planifier', copy: 'Un diagnostic expliqué simplement et un plan de traitement adapté à votre situation.' },
  { number: '03', title: 'Accompagner', copy: 'Des soins précis et un suivi attentif, du premier rendez-vous jusqu’au résultat.' },
]

export default function Home() {
  const [showInvisalignPortal, setShowInvisalignPortal] = useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <>
      <Helmet>
        <title>Dentiste Sète : Implantologie & Invisalign</title>
        <meta name="description" content="Cabinet de chirurgiens-dentistes à Sète spécialisé en Invisalign, Implantologie et soins dentaires. Prenez rendez-vous avec le Dr Abdessadok." />
        <meta name="keywords" content="Dentiste Sète, Implant dentaire Montpellier, Invisalign Sète, Urgence dentaire 34, Facettes dentaires" />
      </Helmet>

      <Hero />

      <section className="trust-rail border-y border-rolexGold/15 py-6" aria-label="Technologies et partenaires">
        <div className="container-max flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="max-w-md text-center text-sm font-bold uppercase tracking-[0.16em] text-slate-300 md:text-left">
            Des protocoles modernes, des partenaires reconnus
          </p>
          <div className="trust-rail__logos flex flex-wrap items-center justify-center gap-x-8 gap-y-5 rounded-2xl bg-white/95 px-7 py-4">
            <img src={invisalignLogo} alt="Invisalign" className="h-7 w-auto object-contain sm:h-8" />
            <img src={alignTechLogo} alt="Align Technology" className="h-7 w-auto object-contain sm:h-8" />
            <img src={iteroLogo} alt="iTero, scanner dentaire 3D" className="h-8 w-auto object-contain sm:h-9" />
          </div>
        </div>
      </section>

      <section className="home-expertise section" aria-labelledby="expertises-title">
        <div className="container-max">
          <div className="mb-10 grid items-end gap-6 md:grid-cols-[1fr_0.72fr] md:mb-14">
            <div>
              <span className="section-kicker mb-4">Nos expertises</span>
              <h2 id="expertises-title" className="max-w-2xl text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
                Deux parcours exigeants, une même attention au patient.
              </h2>
            </div>
            <p className="max-w-xl text-slate-300">
              Nous associons planification numérique, gestes précis et explications claires pour vous aider à décider sereinement.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="service-pathway service-pathway--implant">
              <img src={implantImg} alt="Planification d’un traitement implantaire en laboratoire dentaire" loading="lazy" width="1024" height="1024" />
              <div className="service-pathway__content">
                <span className="badge mb-4">Implantologie</span>
                <h3 className="text-3xl font-bold text-white md:text-4xl">Retrouver confort et stabilité.</h3>
                <p className="mt-3 max-w-xl text-white/80">Un bilan précis, une planification 3D et une prise en charge pensée pour restaurer durablement votre sourire.</p>
                <div className="service-actions mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link to="/pre-rendez-vous?specialite=implantologie" className="btn-accent">Demander un pré-RDV</Link>
                  <Link to="/implantologie" className="btn-light">En savoir plus</Link>
                </div>
              </div>
            </article>

            <article className="service-pathway service-pathway--ortho">
              <img src={alignerImg} alt="Présentation d’un traitement d’orthodontie invisible Invisalign" loading="lazy" width="2048" height="1146" />
              <div className="service-pathway__content">
                <span className="badge mb-4">Orthodontie invisible</span>
                <h3 className="text-3xl font-bold text-white md:text-4xl">Aligner sans bouleverser votre quotidien.</h3>
                <p className="mt-3 max-w-xl text-white/80">Des gouttières transparentes sur mesure, visualisées en 3D et suivies au cabinet à Sète.</p>
                <div className="service-actions mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link to="/pre-rendez-vous?specialite=orthodontie" className="btn-accent">Demander un pré-RDV</Link>
                  <Link to="/invisalign" className="btn-light">Découvrir Invisalign</Link>
                </div>
                <button type="button" className="service-inline-action" onClick={() => setShowInvisalignPortal((value) => !value)} aria-expanded={showInvisalignPortal} aria-controls="invisalign-portal">
                  {showInvisalignPortal ? 'Fermer la simulation' : 'Tester mon futur sourire avec SmileView'} <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          </div>

          {showInvisalignPortal && (
            <motion.div
              id="invisalign-portal"
              className="mt-6 overflow-hidden rounded-2xl border border-rolexGold/25 bg-surface"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="border-b border-white/10 px-5 py-4 text-sm text-slate-300">Simulation hébergée par Invisalign</div>
              <iframe src="https://www.invisalign.fr/SV/1851755" title="Simulation de sourire Invisalign" className="h-[650px] w-full bg-white" loading="lazy" />
            </motion.div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Link to="/orthodontie-sete" className="guide-card card group p-6 md:p-8">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-rolexGold">Guide patient</span>
              <h3 className="mt-3 text-2xl font-bold text-foreground">Orthodontie à Sète</h3>
              <p className="mt-3 text-slate-300">Quand consulter et quelles questions poser avant un premier bilan.</p>
              <span className="mt-5 inline-flex items-center font-bold text-rolexGold">Lire le guide <span aria-hidden="true" className="guide-card__arrow ml-3">→</span></span>
            </Link>
            <Link to="/orthodontie-invisible-sete" className="guide-card card group p-6 md:p-8">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-rolexGold">Guide patient</span>
              <h3 className="mt-3 text-2xl font-bold text-foreground">Orthodontie invisible à Sète</h3>
              <p className="mt-3 text-slate-300">Aligneurs, durée, quotidien et suivi local : l’essentiel avant de commencer.</p>
              <span className="mt-5 inline-flex items-center font-bold text-rolexGold">Lire le guide <span aria-hidden="true" className="guide-card__arrow ml-3">→</span></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section editorial-panel border-y border-rolexGold/15" aria-labelledby="journey-title">
        <div className="container-max">
          <div className="mx-auto max-w-3xl text-center">
            <span className="section-kicker mb-4">Votre parcours</span>
            <h2 id="journey-title" className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">De la première question au suivi.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-slate-300">Un cadre simple, lisible et humain pour que vous sachiez toujours où vous en êtes.</p>
          </div>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {journey.map((step) => (
              <li key={step.number} className="journey-step relative border-t border-rolexGreen/15 pt-7">
                <span className="number-chip">{step.number}</span>
                <h3 className="mt-5 text-2xl font-bold text-foreground">{step.title}</h3>
                <p className="mt-3 text-slate-300">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Features />
      <Testimonials />
      <CTA />
    </>
  )
}
