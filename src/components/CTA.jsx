import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function CTA(){
  const { t } = useTranslation()
  return (
    <section className="section">
      <motion.div className="container-max card p-8 text-center" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h3 className="text-2xl font-bold mb-3">{t('cta.title')}</h3>
        <p className="text-muted mb-6">{t('cta.subtitle')}</p>
        {/* Desktop text CTA */}
        <motion.a id="booking" href="https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/motives?specialityId=1&telehealth=false&placeId=practice-518332&bookingFunnelSource=profile" target="_blank" rel="noopener" className="btn-primary hidden md:inline-flex" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>{t('aria.book')}</motion.a>
        {/* Mobile calendar icon CTA */}
        <a
          href="https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/motives?specialityId=1&telehealth=false&placeId=practice-518332&bookingFunnelSource=profile"
          aria-label={t('aria.book')}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-slate-800 bg-surface hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-rolexGold"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
            <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zm12 7H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9zM7 12h4v4H7v-4z"/>
          </svg>
        </a>
        <span className="mx-3 text-muted">{t('cta.or')}</span>
        <Link to="/contact" className="btn-outline">{t('cta.contact')}</Link>
      </motion.div>
    </section>
  )
}
