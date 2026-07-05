import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import heroPoster from '../assets/abdessamed-hero-poster.png'
import heroVideoDesktop from '../assets/video/abdessamed-hero-720.m4v'
import heroVideoMobile from '../assets/video/abdessamed-hero-mobile.m4v'

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(!reduceMotion)
  const [ready, setReady] = useState(false)

  const togglePlayback = async () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      try {
        await video.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <section className="home-hero relative flex items-end overflow-hidden" aria-labelledby="home-hero-title">
      <div className="home-hero__media" aria-hidden="true">
        <video
          ref={videoRef}
          className={`home-hero__video ${ready ? 'is-ready' : ''}`}
          poster={heroPoster}
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setReady(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={heroVideoMobile} media="(max-width: 767px)" />
          <source src={heroVideoDesktop} />
        </video>
      </div>

      <button type="button" className="hero-video-control" onClick={togglePlayback} aria-label={playing ? 'Mettre la vidéo en pause' : 'Lire la vidéo'}>
        {playing ? (
          <svg width="17" height="17" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5 4h3v12H5zm7 0h3v12h-3z" /></svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m6 3 10 7-10 7V3Z" /></svg>
        )}
        <span>{playing ? 'Pause' : 'Lecture'}</span>
      </button>

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
            <motion.div
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <Link to="/pre-rendez-vous" className="btn-accent">Demander un pré-rendez-vous <span aria-hidden="true">→</span></Link>
            </motion.div>
            <Link to="/services" className="btn-light">Découvrir nos soins</Link>
          </div>
        </motion.div>

        <div className="hero-proof mt-10 max-w-3xl" aria-label="Points forts du cabinet">
          <div>
            <strong>Sète</strong>
            <span>Cabinet local</span>
          </div>
          <div>
            <strong>3D</strong>
            <span>Planification numérique</span>
          </div>
          <div>
            <strong>PMR</strong>
            <span>Accès de plain-pied</span>
          </div>
        </div>
      </div>
    </section>
  )
}
