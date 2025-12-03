import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import heroSmile from "../assets/Logo ( hero section ).png"

export default function Hero(){
  return (
    <section className="section relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/30 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/30 blur-3xl rounded-full"></div>
      </div>
      <div className="container-max grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="badge mb-4">Soins modernes • Équipe à l’écoute</span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Cabinet Dentaire <span className="text-primary">Dr. Abdessadok</span>
          </h1>
          <p className="text-muted mb-8 max-w-xl">« Un sourire sain, une confiance retrouvée. » Soins modernes, approche humaine, au cœur de Sète.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Desktop text CTA */}
            <motion.a href="https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/motives?specialityId=1&telehealth=false&placeId=practice-518332&bookingFunnelSource=profile" target="_blank" rel="noopener" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary hidden md:inline-flex">Prendre rendez‑vous</motion.a>
            {/* Mobile calendar icon CTA */}
            <a
              href="https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/motives?specialityId=1&telehealth=false&placeId=practice-518332&bookingFunnelSource=profile"
              aria-label="Prendre rendez‑vous"
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-slate-800 bg-surface hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-rolexGold"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
                <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zm12 7H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9zM7 12h4v4H7v-4z"/>
              </svg>
            </a>
            <Link to="/services" className="btn-outline">Voir les services</Link>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="card p-4">
          <img src={heroSmile} alt="Logo du Cabinet Dentaire" className="rounded-2xl w-full h-auto object-contain bg-white/5" />
        </motion.div>
      </div>
    </section>
  )
}
