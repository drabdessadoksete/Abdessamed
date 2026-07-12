import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import heroPoster from '../assets/abdessamed-hero-poster.png'
import heroVideoDesktop from '../assets/video/abdessamed-hero-720.m4v'
import heroVideoMobile from '../assets/video/abdessamed-hero-mobile.m4v'
import { trackEvent } from '../utils/analytics'

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const [ready, setReady] = useState(false)

  return (
    <section className="home-hero relative flex items-end overflow-hidden" aria-labelledby="home-hero-title">
      <div className="home-hero__media" aria-hidden="true">
        <video
          className={`home-hero__video ${ready ? 'is-ready' : ''}`}
          poster={heroPoster}
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setReady(true)}
        >
          <source src={heroVideoMobile} media="(max-width: 767px)" />
          <source src={heroVideoDesktop} />
        </video>
      </div>

      <div className="container-max relative z-10 w-full pb-8 pt-28 md:pb-14 md:pt-36">
        <motion.div
          className="home-hero__copy max-w-3xl"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-kicker mb-5">Cabinet dentaire à Sète</span>
          <h1 id="home-hero-title" className="max-w-[14ch] text-4xl font-bold leading-[0.98] text-white sm:text-5xl md:text-7xl">
            Votre sourire, traité avec <span className="gold-underline">précision</span> et humanité.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg md:text-xl md:leading-8">
            Implantologie et orthodontie invisible, avec une technologie précise et surtout le temps de vous expliquer chaque étape.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/75">
            <span className="hero-specialty-pill">Implantologie</span>
            <span className="hero-specialty-pill">Orthodontie invisible</span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/pre-rendez-vous/" className="btn-accent" onClick={() => trackEvent('pre_appointment_click', { location: 'home_hero' })}>Demander un pré-rendez-vous <span aria-hidden="true">→</span></Link>
            <Link to="/services/" className="btn-light">Découvrir nos soins</Link>
          </div>
        </motion.div>

        <div className="hero-proof mt-10 max-w-3xl" aria-label="Points clés du cabinet">
          <div><strong>Sète</strong><span>Cabinet local</span></div>
          <div><strong>3D</strong><span>Planification numérique</span></div>
          <div><strong>5 min</strong><span>Pré-rendez-vous gratuit</span></div>
        </div>
      </div>
    </section>
  )
}
