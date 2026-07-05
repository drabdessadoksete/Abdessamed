import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function CTA() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()

  return (
    <section className="section">
      <motion.div
        className="container-max"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="dark-panel relative overflow-hidden rounded-[2rem] border border-rolexGold/20 px-6 py-14 text-center shadow-soft sm:px-10 md:py-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-rolexGold/10" aria-hidden="true" />
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-rolexGold/15" aria-hidden="true" />
          <span className="section-kicker mb-5">Premier rendez-vous</span>
          <h2 className="mx-auto max-w-3xl text-3xl font-bold text-white sm:text-4xl md:text-5xl">{t('cta.title')}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-white/70">Laissez vos coordonnées et le cabinet vous rappelle pour organiser un premier bilan en implantologie ou orthodontie.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link id="booking" to="/pre-rendez-vous" className="btn-accent">Demander un pré-rendez-vous <span aria-hidden="true">→</span></Link>
            <Link to="/contact" className="btn-light">{t('cta.contact')}</Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
